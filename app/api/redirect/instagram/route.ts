// app/api/redirect/instagram/route.ts
import Error from "next/error";
import { NextRequest, NextResponse } from "next/server";

const META_APP_ID = process.env.META_APP_ID!;
const META_APP_SECRET = process.env.META_APP_SECRET!;
const OAUTH_REDIRECT_URI = process.env.OAUTH_REDIRECT_URI!;

const SUCCESS_BASE = "/campaign/instagram?status=success";
const FAIL_URL =
  "/connected-accounts?status=error&message=" +
  encodeURIComponent("Authentication Unsuccessful");

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    if (!code) {
      // || !META_APP_ID || !META_APP_SECRET || !OAUTH_REDIRECT_URI) {
      return clientRedirectHTML(FAIL_URL);
    }

    // 1) Exchange code -> short-lived Instagram User Access Token
    const short = await exchangeCodeForShortLivedToken(code);
    if (!short?.access_token) return clientRedirectHTML(FAIL_URL);

    // 2) Upgrade to long-lived token (recommended)
    const long = await exchangeForLongLivedToken(short.access_token);
    const token = long.access_token ?? short.access_token;
    const expiresInSec =
      typeof long.expires_in === "number"
        ? long.expires_in
        : typeof short.expires_in === "number"
        ? short.expires_in
        : undefined;
    const expiresAtMs = expiresInSec ? Date.now() + expiresInSec * 1000 : null;

    // 3) Fetch IG user profile (id, username). (Graph API does not return "name")
    const me = await fetchIgMe(token);
    if (!me?.id || !me?.username) return clientRedirectHTML(FAIL_URL);

    // 4) Return minimal HTML that writes to localStorage, then redirects to UI with toast hint
    const successUrl = `${SUCCESS_BASE}&platform=Instagram&connected=${encodeURIComponent(
      me.username
    )}`;
    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>Connecting Instagram…</title>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
  </head>
  <body>
    <script>
      try {
        localStorage.setItem("ig_user_access_token", ${JSON.stringify(token)});
        localStorage.setItem("ig_user_access_token_expires_at", ${JSON.stringify(
          expiresAtMs
        )});
        localStorage.setItem("ig_user_id", ${JSON.stringify(me.id)});
        localStorage.setItem("ig_username", ${JSON.stringify(me.username)});
        localStorage.setItem("ig_oauth_fetched_at", ${JSON.stringify(
          Date.now().toString()
        )});
        window.location.replace(${JSON.stringify(successUrl)});
      } catch (e) {
        window.location.replace(${JSON.stringify(FAIL_URL)});
      }
    </script>
  </body>
</html>`;
    return new NextResponse(html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch {
    return clientRedirectHTML(FAIL_URL);
  }
}

/* ---------------- Inline helpers ---------------- */

async function exchangeCodeForShortLivedToken(code: string) {
  // Graph OAuth (Business Login): GET https://graph.facebook.com/v20.0/oauth/access_token
  const u = new URL("https://graph.facebook.com/v20.0/oauth/access_token");
  u.searchParams.set("client_id", META_APP_ID);
  u.searchParams.set("redirect_uri", OAUTH_REDIRECT_URI);
  u.searchParams.set("client_secret", META_APP_SECRET);
  u.searchParams.set("code", code);
  const r = await fetch(u.toString(), { method: "GET" });
  return (await r.json()) as {
    access_token?: string;
    token_type?: string;
    expires_in?: number;
    error?: Error;
  };
}

async function exchangeForLongLivedToken(shortToken: string) {
  // Instagram long-lived user token: POST https://graph.instagram.com/access_token
  const form = new URLSearchParams();
  form.set("grant_type", "ig_exchange_token");
  form.set("client_secret", META_APP_SECRET);
  form.set("access_token", shortToken);
  const r = await fetch("https://graph.instagram.com/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });
  if (!r.ok)
    return {} as {
      access_token?: string;
      token_type?: string;
      expires_in?: number;
    };
  return (await r.json()) as {
    access_token?: string;
    token_type?: string;
    expires_in?: number;
  };
}

async function fetchIgMe(accessToken: string) {
  // GET https://graph.instagram.com/me?fields=id,username&access_token=TOKEN
  const u = new URL("https://graph.instagram.com/me");
  u.searchParams.set("fields", "id,username");
  u.searchParams.set("access_token", accessToken);
  const r = await fetch(u.toString(), { method: "GET" });
  if (!r.ok) return null;
  return (await r.json()) as { id?: string; username?: string };
}

function clientRedirectHTML(location: string) {
  const html = `<!doctype html><meta charset="utf-8"/><script>location.replace(${JSON.stringify(
    location
  )});</script>`;
  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
