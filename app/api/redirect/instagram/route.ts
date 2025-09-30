// app/api/redirect/instagram/route.ts
import { NextRequest, NextResponse } from "next/server";

/**
 * ENV VARS (set these in your deployment):
 *  IG_CLIENT_ID         = "990602627938098"          // your app id
 *  IG_CLIENT_SECRET     = "a1b2C3D4"                 // your app secret
 *  PAYLOAD_BASE_URL     = "https://your-payload.example.com"
 *  PAYLOAD_API_TOKEN    = "<payload-admin-api-token>"
 *  PAYLOAD_COLLECTION   = "instagram-tokens"         // your collection slug
 *
 * HARD-CODED (per your spec):
 *  grant_type           = "authorization_code"
 *  redirect_uri         = "https://myURL/campaign/instagram"
 */

const IG_CLIENT_ID = process.env.IG_CLIENT_ID!;
const IG_CLIENT_SECRET = process.env.IG_CLIENT_SECRET!;

const PAYLOAD_BASE_URL = process.env.PAYLOAD_BASE_URL!;
const PAYLOAD_API_TOKEN = process.env.PAYLOAD_API_TOKEN!;
const PAYLOAD_COLLECTION = process.env.PAYLOAD_COLLECTION || "instagram-tokens";

// Hard-coded as requested
const OAUTH_REDIRECT_URI = "https://myURL/campaign/instagram";

const ERR_GENERIC =
  "/connected-accounts?status=error&message=" +
  encodeURIComponent("Failed to Authenticate");

const ERR_INTERNAL_ENV_MISSING =
  "/connected-accounts?status=error&message=" +
  encodeURIComponent("Internal Server Environment Error");

const ERR_SHORT_CODE =
  "/connected-accounts?status=error&message=" +
  encodeURIComponent("Failed to Authenticate - Short");

const ERR_LONG_CODE =
  "/connected-accounts?status=error&message=" +
  encodeURIComponent("Failed to Authenticate - Long");

const ERR_STORAGE_FAILURE =
  "/connected-accounts?status=error&message=" +
  encodeURIComponent("Failed to Store to DB");

const ERR_SUBSCRIPTION_FAILURE =
  "/connected-accounts?status=error&message=" +
  encodeURIComponent("Failed to Subscribe to Webhooks");

const ERR_USERDATA =
  "/connected-accounts?status=error&message=" +
  encodeURIComponent("Error getting the user data");

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    if (!code) return NextResponse.redirect(ERR_GENERIC, 302);

    if (!IG_CLIENT_ID || !IG_CLIENT_SECRET)
      return NextResponse.redirect(ERR_INTERNAL_ENV_MISSING, 302);
    if (!PAYLOAD_BASE_URL || !PAYLOAD_API_TOKEN)
      return NextResponse.redirect(ERR_INTERNAL_ENV_MISSING, 302);

    // 1) Exchange code -> access token (authorization_code)
    // curl -X POST https://api.instagram.com/oauth/access_token \
    //  -F client_id     -F client_secret -F grant_type=authorization_code
    //  -F redirect_uri="https://myURL/campaign/instagram" -F code=...
    const form = new URLSearchParams();
    form.set("client_id", IG_CLIENT_ID);
    form.set("client_secret", IG_CLIENT_SECRET);
    form.set("grant_type", "authorization_code");
    form.set("redirect_uri", OAUTH_REDIRECT_URI); // must be the same as the OG redirect URL? does that mean IG will send it back here?
    form.set("code", code);

    const shortResp = await fetch(
      "https://api.instagram.com/oauth/access_token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form.toString(),
      }
    );

    if (!shortResp.ok) {
      return NextResponse.redirect(ERR_SHORT_CODE, 302);
    }

    const shortJson = await safeJson(shortResp);

    // Your example shows a 'data' array; IG may also return flat JSON.
    const shortData = Array.isArray(shortJson?.data)
      ? shortJson.data[0]
      : shortJson;
    const shortAccessToken: string | undefined = shortData?.access_token;
    const appScopedUserId: string | undefined = shortData?.user_id;

    if (!shortAccessToken) {
      return NextResponse.redirect(ERR_SHORT_CODE, 302);
    }

    // 2) Exchange for long-lived token
    // GET https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=...&access_token=...
    const llUrl = new URL("https://graph.instagram.com/access_token");
    llUrl.searchParams.set("grant_type", "ig_exchange_token");
    llUrl.searchParams.set("client_secret", IG_CLIENT_SECRET);
    llUrl.searchParams.set("access_token", shortAccessToken);

    const longResp = await fetch(llUrl.toString(), { method: "GET" });
    const longJson = await safeJson(longResp);

    if (!longResp.ok || !longJson?.access_token) {
      return NextResponse.redirect(ERR_LONG_CODE, 302);
    }

    const longAccessToken: string = longJson.access_token;
    const expiresIn: number | null =
      typeof longJson.expires_in === "number" ? longJson.expires_in : null;

    // 3) Fetch user data (user_id, username)
    // GET https://graph.instagram.com/v23.0/me?fields=user_id,username&access_token=...
    const meUrl = new URL("https://graph.instagram.com/v23.0/me");
    meUrl.searchParams.set("fields", "user_id,username");
    meUrl.searchParams.set("access_token", longAccessToken);

    const meResp = await fetch(meUrl.toString(), { method: "GET" });
    const meJson = await safeJson(meResp);

    if (
      !meResp.ok ||
      !meJson?.username ||
      !(meJson?.user_id || appScopedUserId)
    ) {
      return NextResponse.redirect(ERR_USERDATA, 302);
    }

    const igUsername: string = meJson.username;
    const igUserId: string = meJson.user_id || appScopedUserId || ""; // fallback to app-scoped id if IG returns flat 'id' in some versions

    // 4) Store in PayloadCMS
    // POST { igUserId, username, access_token, expires_in, provider, created_at }
    const payloadEndpoint = `${trimSlash(
      PAYLOAD_BASE_URL
    )}/api/${encodeURIComponent(PAYLOAD_COLLECTION)}`;
    const payloadBody = {
      provider: "instagram",
      igUserId,
      username: igUsername,
      access_token: longAccessToken,
      expires_in: expiresIn,
      created_at: new Date().toISOString(),
    };

    const storeResp = await fetch(payloadEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PAYLOAD_API_TOKEN}`,
      },
      body: JSON.stringify(payloadBody),
    });

    if (!storeResp.ok) {
      // Storage failure
      return NextResponse.redirect(ERR_STORAGE_FAILURE, 302);
    }

    // 5) Set up subscriptions
    const subscribeURL = new URL(
      `$graph.instagram.com/v23.0/me/subscribed_apps`
    );
    subscribeURL.searchParams.set(
      "subscribed_fields",
      "comments,mentions,messages"
    );
    subscribeURL.searchParams.set("access_token", longAccessToken);

    const sub = await fetch(url.toString(), { method: "POST" });
    const safeSub = await safeJson(sub);

    if (!safeSub.ok) {
      // Subscription failure
      return NextResponse.redirect(ERR_SUBSCRIPTION_FAILURE, 302);
    }

    // 6) Success redirect with params
    const successUrl =
      `/campaign/instagram?status=success&message=${encodeURIComponent(
        "Connected successfully"
      )}` + `&connectedto=${encodeURIComponent(igUsername)}`;

    return NextResponse.redirect(successUrl, 302);
  } catch {
    return NextResponse.redirect(ERR_GENERIC, 302);
  }
}

/* ------------------------ helpers ------------------------ */

async function safeJson(resp: Response) {
  try {
    return await resp.json();
  } catch {
    return null as unknown;
  }
}

function trimSlash(s: string) {
  return s.endsWith("/") ? s.slice(0, -1) : s;
}
