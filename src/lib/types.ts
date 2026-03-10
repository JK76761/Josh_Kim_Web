export type SocialLinks = {
  github: string;
  linkedin: string;
  x?: string;
  website?: string;
};

export type Profile = {
  name: string;
  headline: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  phone?: string;
  availability: string;
  socials: SocialLinks;
  skills: string[];
  highlights: string[];
};

export type Project = {
  id: string;
  name: string;
  summary: string;
  description: string;
  stack: string[];
  githubUrl: string;
  liveUrl: string;
  year: string;
  featured: boolean;
  impact: string;
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  summary: string;
  achievements: string[];
  technologies: string[];
};

export type Education = {
  id: string;
  institution: string;
  program: string;
  startDate: string;
  endDate: string;
  location: string;
};

export type ChatHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

export type StackSkill = {
  id: string;
  name: string;
  category: string;
  level: number;
};
