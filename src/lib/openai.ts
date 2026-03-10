import type { ChatHistoryMessage } from "@/lib/types";

const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

export class OpenAIRequestError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "OpenAIRequestError";
    this.status = status;
  }
}

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

type OpenAIErrorResponse = {
  error?: {
    message?: string;
  };
};

function buildHistoryTranscript(history: ChatHistoryMessage[]): string {
  return history
    .slice(-6)
    .map((message) => {
      const label = message.role === "user" ? "User" : "Assistant";
      return `${label}: ${message.content}`;
    })
    .join("\n");
}

function buildInputPrompt(
  question: string,
  context: string,
  history: ChatHistoryMessage[],
): string {
  const transcript = buildHistoryTranscript(history);

  return [
    transcript ? `Recent conversation:\n${transcript}` : "",
    `Current user question:\n${question}`,
    `Portfolio context:\n${context}`,
  ]
    .filter(Boolean)
    .join("\n\n");
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
    throw new OpenAIRequestError(
      503,
      "OpenAI is not configured for this deployment.",
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);
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
        max_output_tokens: 320,
        store: false,
        instructions:
          "You are Joshua Kim's AI portfolio assistant. Answer only about Joshua Kim's work, projects, experience, education, skills, availability, public contact methods, and how AI is used on this portfolio site. Keep answers clear, concise, and recruiter-friendly. If the question is unrelated to Joshua Kim's portfolio or asks for general programming help, reply: 'That is outside Joshua Kim's portfolio and work scope.' Do not reveal private personal information such as phone number or private contact details. If asked for private contact details, say they are not public on this site and direct the user to the public email or LinkedIn instead. If a detail is missing from the provided context, say that directly instead of guessing.",
        input: buildInputPrompt(question, context, history),
      }),
      cache: "no-store",
      signal: controller.signal,
    });
  } catch (caughtError) {
    if (caughtError instanceof Error && caughtError.name === "AbortError") {
      throw new OpenAIRequestError(504, "OpenAI request timed out.");
    }

    throw new OpenAIRequestError(
      502,
      "OpenAI request could not be completed. Try again shortly.",
    );
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    let message = `OpenAI request failed (${response.status}).`;

    try {
      const payload = (await response.json()) as OpenAIErrorResponse;
      const errorMessage = payload.error?.message?.trim();

      if (errorMessage) {
        message = `OpenAI request failed (${response.status}): ${errorMessage}`;
      }
    } catch {
      const errorText = (await response.text()).trim();

      if (errorText) {
        message = `OpenAI request failed (${response.status}): ${errorText}`;
      }
    }

    throw new OpenAIRequestError(response.status, message);
  }

  const payload = (await response.json()) as OpenAIResponse;
  const answer = readTextFromResponse(payload);

  if (!answer) {
    throw new OpenAIRequestError(502, "OpenAI returned an empty answer.");
  }

  return answer;
}
