"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

/**
 * InstagramLoginCard
 *
 * A shadcn/ui card with a single button that initiates Meta OAuth for Instagram.
 * - Uses Facebook Login dialog for the "Instagram API with Instagram Login".
 * - Implements Authorization Code flow with optional PKCE (recommended).
 * - After redirect, your backend must exchange `code` (+ PKCE verifier if used) for tokens.
 *
 * Required env:
 * - NEXT_PUBLIC_META_APP_ID            (Facebook App ID)
 * - NEXT_PUBLIC_META_REDIRECT_URI      (Exactly matches one of your Valid OAuth Redirect URIs)
 *
 * Backend (example): POST /api/meta/oauth/callback -> exchanges `code` for tokens & stores them.
 *
 * Notes:
 * - Works for Instagram Professional (Business/Creator) accounts.
 * - Choose scopes according to your needs and the permissions you’ve been approved for.
 */
export default function InstagramLoginCard({
  scopes = [
    // Common read scopes for IG Graph API access:
    "instagram_basic",
    "pages_show_list",
    "pages_read_engagement",
    "pages_read_user_content",
    // Add as needed (requires App Review / eligibility):
    // "instagram_manage_insights",
    // "instagram_manage_comments",
    // "business_management",
  ],
  graphVersion = "v20.0", // override to the version your app uses
  usePKCE = true,
}: {
  scopes?: string[]
  graphVersion?: string
  usePKCE?: boolean
}) {
  const [loading, setLoading] = React.useState(false)

  async function sha256ToBase64Url(input: string) {
    const data = new TextEncoder().encode(input)
    const digest = await crypto.subtle.digest("SHA-256", data)
    const bytes = new Uint8Array(digest)
    let str = ""
    for (let i = 0; i < bytes.byteLength; i++) str += String.fromCharCode(bytes[i])
    const base64 = btoa(str)
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
  }

  function randomString(len = 64) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"
    let out = ""
    const randoms = crypto.getRandomValues(new Uint8Array(len))
    for (let i = 0; i < len; i++) out += chars[randoms[i] % chars.length]
    return out
  }

  async function beginLogin() {
    try {
      setLoading(true)

      const clientId = process.env.NEXT_PUBLIC_META_APP_ID
      const redirectUri = process.env.NEXT_PUBLIC_META_REDIRECT_URI

      if (!clientId || !redirectUri) {
        console.error("Missing NEXT_PUBLIC_META_APP_ID or NEXT_PUBLIC_META_REDIRECT_URI")
        alert("OAuth not configured. Set NEXT_PUBLIC_META_APP_ID and NEXT_PUBLIC_META_REDIRECT_URI.")
        setLoading(false)
        return
      }

      const state = randomString(32)
      sessionStorage.setItem("meta_oauth_state", state)

      let pkceParams = ""
      if (usePKCE) {
        const codeVerifier = randomString(96)
        sessionStorage.setItem("meta_pkce_verifier", codeVerifier)
        const codeChallenge = await sha256ToBase64Url(codeVerifier)
        pkceParams = `&code_challenge=${encodeURIComponent(codeChallenge)}&code_challenge_method=S256`
      }

      // Facebook Login dialog (works for Instagram API with Instagram Login)
      const base = `https://www.facebook.com/${graphVersion}/dialog/oauth`
      const scopeParam = scopes.join(",")

      const url =
        `${base}?client_id=${encodeURIComponent(clientId)}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=code` +
        `&state=${encodeURIComponent(state)}` +
        `&scope=${encodeURIComponent(scopeParam)}` +
        pkceParams

      window.location.assign(url)
    } catch (e) {
      console.error(e)
      alert("Failed to start Instagram sign-in.")
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md m-auto">
      <CardHeader>
        <CardTitle className="text-center p-4">Connect Instagram</CardTitle>
        <CardDescription className="text-center p-2">
          Grant access to your Instagram account by signing in.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-3">
        <Button onClick={beginLogin} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Redirecting to Instagram…
            </>
          ) : (
            "Sign in with Instagram"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

/**
 * ---- Server-side (for reference) ----
 * After Meta redirects back to NEXT_PUBLIC_META_REDIRECT_URI with `?code=...&state=...`,
 * verify `state` vs sessionStorage (forward it to your API), then exchange:
 *
 * POST https://graph.facebook.com/{graphVersion}/oauth/access_token
 *   - client_id
 *   - client_secret (server-side only)
 *   - redirect_uri (must match exactly)
 *   - code
 *   - (if PKCE) code_verifier
 *
 * Store returned access_token and (if applicable) long-lived tokens.
 *
 * Docs:
 * - OAuth dialog (Facebook Login): https://www.facebook.com/{graphVersion}/dialog/oauth
 * - Permissions (choose & request via App Review as needed)
 * - Instagram Platform Guides (Insights, Media, etc.)
 */
