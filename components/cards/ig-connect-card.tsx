"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { FaInstagram } from "react-icons/fa";

export default function InstagramLoginCard({}) {
  const [loading, setLoading] = React.useState(false);

  async function beginLogin() {
    try {
      setLoading(true);

      const url = //TODO maybe change this into an environment variable?
        "https://www.instagram.com/oauth/authorize?force_reauth=true&client_id=1876310406570643&redirect_uri=https://campage-ig.vercel.app/campaign/instagram/comments/new-campaign/&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights";

      window.location.assign(url);
    } catch (e) {
      console.error(e);
      alert("Failed to start Instagram sign-in.");
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md min-w-0 m-auto mt-auto">
      <CardHeader>
        <CardTitle className="m-auto scale-200 p-2">
          <FaInstagram />
        </CardTitle>
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
            "Sign in to Instagram"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
