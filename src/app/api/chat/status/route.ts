import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const configured = Boolean(process.env.OPENAI_API_KEY?.trim());

  return NextResponse.json(
    {
      configured,
      model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
      env: process.env.VERCEL_ENV ?? "local",
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
