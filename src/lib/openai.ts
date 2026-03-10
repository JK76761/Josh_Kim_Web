import type { ChatHistoryMessage } from "@/lib/types";

const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

type CreatePortfolioAnswerInput = {
  question: string;
  context: string;
  history: ChatHistoryMessage[];
};

type OpenAIOutput = {
  type: string;
  content?: Array<{
    type: string;
    text?: string;
  }>;
};

type OpenAIResponse = {
  output_text?: string;
  output?: OpenAIOutput[];
};

function mapHistoryForOpenAI(history: ChatHistoryMessage[]) {
  return history.slice(-8).map((message) => ({
    role: message.role,
    content: [{ type: "input_text", text: message.content }],
  }));
}

function readTextFromResponse(payload: OpenAIResponse): string {
  if (payload.output_text && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const text = payload.output
    ?.flatMap((item) => item.content ?? [])
    .filter((item) => item.type === "output_text" && item.text)
    .map((item) => item.text)
    .join("\n")
    .trim();

  return text || "";
}

export async function createPortfolioAnswer({
  question,
  context,
  history,
}: CreatePortfolioAnswerInput): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);
  let response: Response;

  try {
    response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        instructions:
          "You are a portfolio assistant. Answer only using the provided portfolio context and prior conversation. If information is missing, clearly say you do not have that detail.",
        input: [
          ...mapHistoryForOpenAI(history),
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `Question: ${question}\n\nPortfolio context:\n${context}`,
              },
            ],
          },
        ],
      }),
      cache: "no-store",
      signal: controller.signal,
    });
  } catch (caughtError) {
    if (caughtError instanceof Error && caughtError.name === "AbortError") {
      throw new Error("OpenAI request timed out.");
    }

    throw caughtError;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${errorText}`);
  }

  const payload = (await response.json()) as OpenAIResponse;
  const answer = readTextFromResponse(payload);

  if (!answer) {
    throw new Error("OpenAI returned an empty answer");
  }

  return answer;
}
