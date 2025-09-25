// app/api/redirect/instagram/route.ts
import { NextRequest, NextResponse } from "next/server";

/**
 * ENV you must set:
 *  IG_CLIENT_SECRET       = your Instagram app client secret
 *  PAYLOAD_BASE_URL       = e.g. "https://your-payload.example.com"
 *  PAYLOAD_API_TOKEN      = an admin API token (Bearer) for Payload
 *  PAYLOAD_COLLECTION     = collection slug to store tokens (default: "instagram-tokens")
 *
 * Behavior:
 *  - GET /api/redirect/instagram?code=XYZ
 *  - Exchanges code -> long-lived-ish token via:
 *      https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=...&access_token=CODE
 *  - Stores token result to Payload collection
 *  - Fetches IG profile: https://graph.instagram.com/me?fields=id,username&access_token=...
 *  - Redirects to /campaign/instagram?status=success|error&message=...&connectedto=<username?>
 */

const IG_CLIENT_SECRET = process.env.IG_CLIENT_SECRET!;
const PAYLOAD_BASE_URL = process.env.PAYLOAD_BASE_URL!;
const PAYLOAD_API_TOKEN = process.env.PAYLOAD_API_TOKEN!;
const PAYLOAD_COLLECTION = process.env.PAYLOAD_COLLECTION || "instagram-tokens";

const REDIRECT_BASE = "/campaign/instagram";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code") || "";

  if (!code) {
    return redirectWith(
      "error",
      "Authentication was cancelled or unsuccessful",
      undefined
    );
  }
  if (!IG_CLIENT_SECRET) {
    return redirectWith("error", "Server missing IG client secret", undefined);
  }
  if (!PAYLOAD_BASE_URL || !PAYLOAD_API_TOKEN) {
    return redirectWith("error", "Server storage not configured", undefined);
  }

  try {
    // 1) Exchange code => token (as requested: treat code as access_token)
    const exchangeUrl = new URL("https://graph.instagram.com/access_token");
    exchangeUrl.searchParams.set("grant_type", "ig_exchange_token");
    exchangeUrl.searchParams.set("client_secret", IG_CLIENT_SECRET);
    exchangeUrl.searchParams.set("access_token", code);

    const tokenRes = await fetch(exchangeUrl.toString(), { method: "GET" });
    const tokenJson = await tokenRes.json();

    if (!tokenRes.ok || !tokenJson?.access_token) {
      const msg =
        (tokenJson &&
          (tokenJson.error?.message || tokenJson.error?.error_user_msg)) ||
        "Token exchange errored";
      return redirectWith("error", msg, undefined);
    }

    const { access_token, token_type, expires_in } = tokenJson as {
      access_token: string;
      token_type?: string;
      expires_in?: number;
    };

    // 2) Fetch user profile (id, username)
    const meUrl = new URL("https://graph.instagram.com/me");
    meUrl.searchParams.set("fields", "id,username");
    meUrl.searchParams.set("access_token", access_token);

    const meRes = await fetch(meUrl.toString(), { method: "GET" });
    const meJson = await meRes.json();
    const igUserId: string | undefined = meJson?.id;
    const igUsername: string | undefined = meJson?.username;

    if (!meRes.ok || !igUserId || !igUsername) {
      return redirectWith(
        "error",
        "Could not fetch Instagram user details",
        undefined
      );
    }

    // 3) Store in PayloadCMS
    //    POST { provider, igUserId, username, token: { access_token, token_type, expires_in, received_at } }
    const payloadEndpoint = `${trimSlash(
      PAYLOAD_BASE_URL
    )}/api/${encodeURIComponent(PAYLOAD_COLLECTION)}`;

    const payloadBody = {
      provider: "instagram",
      igUserId,
      username: igUsername,
      token: {
        access_token,
        token_type: token_type || "bearer",
        expires_in: typeof expires_in === "number" ? expires_in : null,
        received_at: new Date().toISOString(),
      },
    };

    const storeRes = await fetch(payloadEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PAYLOAD_API_TOKEN}`,
      },
      body: JSON.stringify(payloadBody),
    });

    if (!storeRes.ok) {
      let errMsg = "Failed to store credentials";
      try {
        const j = await storeRes.json();
        errMsg = j?.errors?.[0]?.message || j?.message || errMsg;
      } catch {}
      return redirectWith("error", errMsg, undefined);
    }

    // 4) Success redirect
    return redirectWith("success", "Connected successfully", igUsername);
  } catch (e) {
    // TODO why is it not picking up error from next/error?
    // Answer: typescript does not allow type description for erros in catch blocks
    console.error(e);
    return redirectWith("error", "unexpected error", undefined);
  }
}

function redirectWith(
  status: "success" | "error",
  message: string,
  connectedto?: string
) {
  const redirectURL = new URL(REDIRECT_BASE, "http://localhost:3000"); // TODO home needs a string? base won't be used in final string
  redirectURL.searchParams.set("status", status);
  redirectURL.searchParams.set("message", message);
  if (connectedto) {
    redirectURL.searchParams.set("connectedto", connectedto);
    redirectURL.searchParams.set("platform", "Instagram");
  }
  return NextResponse.redirect(redirectURL, { status: 302 });
}

function trimSlash(s: string) {
  return s.endsWith("/") ? s.slice(0, -1) : s;
}
