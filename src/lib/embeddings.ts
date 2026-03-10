import { education, experience, profile, projects, stackSkills } from "@/lib/data";
import { getDisplayName } from "@/lib/format";

type KnowledgeChunk = {
  id: string;
  content: string;
};

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "how",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "that",
  "the",
  "this",
  "to",
  "what",
  "when",
  "where",
  "who",
  "with",
  "you"
]);

const knowledgeBase: KnowledgeChunk[] = [
  {
    id: "profile",
    content: `${profile.name} is a ${profile.headline}. ${profile.bio} Availability: ${profile.availability}. Skills: ${profile.skills.join(
      ", ",
    )}.`,
  },
  {
    id: "ai",
    content: `This portfolio includes a live AI assistant powered by the OpenAI API. The assistant is grounded in locally stored portfolio data and answers questions about ${getDisplayName(
      profile.name,
    )}'s projects, experience, education, availability, and tech stack.`,
  },
  ...projects.map((project) => ({
    id: `project:${project.id}`,
    content: `${project.name} (${project.year}) summary: ${project.summary}. Details: ${project.description}. Stack: ${project.stack.join(
      ", ",
    )}. Impact: ${project.impact}.`,
  })),
  ...experience.map((item) => ({
    id: `experience:${item.id}`,
    content: `${item.role} at ${item.company} in ${item.location} from ${item.startDate} to ${item.endDate}. ${item.summary}. Achievements: ${item.achievements.join(
      "; ",
    )}. Technologies: ${item.technologies.join(", ")}.`,
  })),
  ...education.map((item) => ({
    id: `education:${item.id}`,
    content: `${item.program} at ${item.institution}, ${item.location} (${item.startDate} - ${item.endDate}).`,
  })),
  {
    id: "stack",
    content: `Tech stack strengths: ${stackSkills
      .map((skill) => `${skill.name} (${skill.category}, level ${skill.level}/5)`)
      .join(", ")}.`,
  },
];

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function scoreChunk(queryTokens: string[], chunkTokens: string[]): number {
  if (!queryTokens.length || !chunkTokens.length) {
    return 0;
  }

  const chunkSet = new Set(chunkTokens);
  let score = 0;

  for (const token of queryTokens) {
    if (chunkSet.has(token)) {
      score += 2;
    }

    if (chunkTokens.some((chunkToken) => chunkToken.startsWith(token))) {
      score += 1;
    }
  }

  return score / Math.sqrt(chunkTokens.length);
}

export function buildContext(question: string, topK = 4): string {
  const queryTokens = tokenize(question);

  const ranked = knowledgeBase
    .map((chunk) => {
      const chunkTokens = tokenize(chunk.content);
      return {
        chunk,
        score: scoreChunk(queryTokens, chunkTokens),
      };
    })
    .sort((a, b) => b.score - a.score)
    .filter((item) => item.score > 0)
    .slice(0, topK)
    .map((item) => item.chunk.content);

  if (!ranked.length) {
    return [
      `${profile.name} is a ${profile.headline}.`,
      "The site includes a live OpenAI assistant grounded in local portfolio data.",
      `Projects include: ${projects.map((project) => project.name).join(", ")}.`,
      `Experience includes ${experience
        .map((item) => `${item.role} at ${item.company}`)
        .join(", ")}.`,
      `Education includes ${education
        .map((item) => `${item.program} at ${item.institution}`)
        .join(", ")}.`,
    ].join("\n");
  }

  return ranked.join("\n\n");
}
