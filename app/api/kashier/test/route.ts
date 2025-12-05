import { NextResponse } from "next/server";

// Simple test endpoint to verify webhooks are reachable
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Kashier webhook endpoint is reachable",
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    console.log("🔍 Kashier Webhook Test - Received POST request");
    console.log("Headers:", Object.fromEntries(req.headers.entries()));
    console.log("Body:", body);

    return NextResponse.json({
      status: "received",
      message: "Webhook data logged to console",
    });
  } catch (error) {
    console.error("Webhook test error:", error);
    return NextResponse.json({ error: "Failed to process" }, { status: 500 });
  }
}
