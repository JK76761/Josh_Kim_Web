import educationData from "@/data/education.json";
import experienceData from "@/data/experience.json";
import profileData from "@/data/profile.json";
import projectsData from "@/data/projects.json";
import stackData from "@/data/stack.json";
import type {
  Education,
  Experience,
  Profile,
  Project,
  StackSkill,
} from "@/lib/types";

export const profile = profileData as Profile;
export const projects = projectsData as Project[];
export const experience = experienceData as Experience[];
export const education = educationData as Education[];
export const stackSkills = stackData as StackSkill[];

export const featuredProjects = projects.filter((project) => project.featured);
