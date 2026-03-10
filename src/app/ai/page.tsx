import Link from "next/link";
import Chatbox from "@/components/Chatbox";
import { profile } from "@/lib/data";
import { getDisplayName } from "@/lib/format";

const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";
export const dynamic = "force-dynamic";

export default function AIAssistantPage() {
  const isConfigured = Boolean(process.env.OPENAI_API_KEY);
  const displayName = getDisplayName(profile.name);

  return (
    <div className="max-w-5xl space-y-10">
      <header className="page-fade stagger-1 max-w-3xl space-y-4">
        <Link href="/" className="link-inline text-sm font-semibold">
          Back to home
        </Link>
        <p className="section-kicker">Assistant</p>
        <h1 className="section-title">AI Assistant</h1>
        <p className="section-copy">
          Ask about {displayName}&apos;s projects, experience, technical strengths,
          and career focus. This portfolio uses a live OpenAI assistant grounded in local
          project, experience, education, and stack data.
        </p>
        <p className="status-note" data-state={isConfigured ? "live" : "error"}>
          {isConfigured
            ? `Live on ${model}`
            : "OpenAI disabled: set OPENAI_API_KEY in .env.local or Vercel"}
        </p>
        {!isConfigured ? (
          <div className="page-rule max-w-2xl space-y-2 pt-4 text-sm leading-7 text-slate-400">
            <p>For Vercel deployment:</p>
            <p>1. Add `OPENAI_API_KEY` in Project Settings → Environment Variables.</p>
            <p>2. Make sure it is added to the Production environment.</p>
            <p>3. Redeploy after saving the variable.</p>
          </div>
        ) : null}
      </header>

      <div className="page-fade stagger-2">
        <Chatbox developerName={displayName} isConfigured={isConfigured} />
      </div>
    </div>
  );
}
