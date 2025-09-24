import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';

export const runtime = 'nodejs';

const TOKEN = process.env.TOKEN || 'token';
const APP_SECRET = process.env.APP_SECRET || '';

/**
 * In-memory store (ephemeral in serverless). Replace with DB/queue in prod.
 */
const received_updates: unknown[] = [];

/**
 * Compute and verify Facebook X-Hub-Signature (sha1).
 * Header format: "sha1=<hex>"
 */
function verifyXHubSignature(rawBody: string, headerSig: string | null): boolean {
  if (!APP_SECRET || !headerSig) return false;
  const expected = 'sha1=' + createHmac('sha1', APP_SECRET).update(rawBody, 'utf8').digest('hex');

  try {
    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(headerSig, 'utf8');
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * GET: Webhook verification (hub.challenge)
 * Example: /api/webhooks/instagram?hub.mode=subscribe&hub.verify_token=...&hub.challenge=...
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ platform: string }> }) {
  const searchParams = req.nextUrl.searchParams;
  const { platform } = await params;
  const mode = searchParams.get('hub.mode');
  const verifyToken = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && verifyToken === TOKEN && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }

  // Optional: dump recent updates if no hub params (useful during testing)
  if (!mode && !verifyToken && !challenge) {
    return NextResponse.json(
      {
        platform: platform,
        count: received_updates.length,
        recent: received_updates.slice(0, 10),
      },
      { status: 200 }
    );
  }

  return new NextResponse('Bad Request', { status: 400 });
}

/**
 * POST: Webhook receiver
 * - Facebook: validates X-Hub-Signature (sha1)
 * - Instagram/Threads: accepts as-is (add your own validation as needed)
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ platform: string }> }) {
  const { platform } = await params;

  // Read raw body for signature validation, then parse JSON
  const raw = await req.text();

  if (platform === 'facebook') {
    const signature =
      req.headers.get('x-hub-signature') || req.headers.get('x-hub-signature-256'); // prefer sha1 if both set
    const ok = verifyXHubSignature(raw, signature);
    if (!ok) {
      console.warn('Warning - X-Hub-Signature missing/invalid');
      return new NextResponse('Unauthorized', { status: 401 });
    }
  }

  let body: unknown = null;
  try {
    body = raw ? JSON.parse(raw) : {};
  } catch {
    // Some providers may POST empty/invalid JSON during config checks
    body = {};
  }

  // Store (ephemeral) and log
  received_updates.unshift({
    platform,
    at: new Date().toISOString(),
    body,
  });

  // TODO: route by platform, topic, object, etc. to your business logic/queue
  // e.g., await enqueue({ platform, body });

  return new NextResponse(null, { status: 200 });
}
