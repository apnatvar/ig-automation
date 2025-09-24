import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  // Replace with your actual verify token
  const VERIFY_TOKEN = process.env.IG_WEBHOOK_VERIFY_TOKEN || "richsoon";

  if (mode === "subscribe" && token === VERIFY_TOKEN && challenge) {
    // Echo back the challenge string
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}
