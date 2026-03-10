import { NextResponse } from "next/server";
import { buildContext } from "@/lib/embeddings";
import { createPortfolioAnswer, OpenAIRequestError } from "@/lib/openai";
import type { ChatHistoryMessage } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatRequest = {
  message?: string;
  history?: Array<{
    role?: string;
    content?: string;
  }>;
};

function getGuardedAnswer(message: string): string | null {
  const normalizedMessage = message.toLowerCase();

  if (/\b(phone|number|mobile|cell|call)\b/.test(normalizedMessage)) {
    return "Joshua's phone number is not public on this site. Please use the public email or LinkedIn contact instead.";
  }

  return null;
}

function sanitizeHistory(history: ChatRequest["history"]): ChatHistoryMessage[] {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter(
      (item): item is { role: "user" | "assistant"; content: string } =>
        (item.role === "user" || item.role === "assistant") &&
        typeof item.content === "string" &&
        item.content.trim().length > 0,
    )
    .map((item) => ({
      role: item.role,
      content: item.content.trim(),
    }))
    .slice(-8);
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ChatRequest;
    const message = payload.message?.trim();

    if (!message) {
      return NextResponse.json(
        { error: "A non-empty message is required." },
        { status: 400 },
      );
    }

    const guardedAnswer = getGuardedAnswer(message);

    if (guardedAnswer) {
      return NextResponse.json({ answer: guardedAnswer, source: "policy" });
    }

    const history = sanitizeHistory(payload.history);
    const apiKey = process.env.OPENAI_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI is not configured for this deployment." },
        { status: 503 },
      );
    }

    try {
      const context = buildContext(message, 6);
      const answer = await createPortfolioAnswer({
        question: message,
        context,
        history,
      });

      return NextResponse.json({ answer, source: "openai" });
    } catch (caughtError) {
      if (caughtError instanceof OpenAIRequestError) {
        console.error("OpenAI chat request failed.", caughtError);
        return NextResponse.json(
          { error: caughtError.message },
          { status: caughtError.status },
        );
      }

      console.error("Unexpected OpenAI chat failure.", caughtError);
      return NextResponse.json(
        { error: "OpenAI request could not be completed. Try again shortly." },
        { status: 502 },
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 },
    );
  }
}
