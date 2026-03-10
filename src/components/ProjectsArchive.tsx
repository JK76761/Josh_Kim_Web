"use client";

import { useState } from "react";
import type { Project } from "@/lib/types";
import ProjectCard from "@/components/ProjectCard";

type ProjectsArchiveProps = {
  projects: Project[];
};

export default function ProjectsArchive({ projects }: ProjectsArchiveProps) {
  const [selectedTag, setSelectedTag] = useState("All");

  const tags = [
    "All",
    ...Array.from(new Set(projects.flatMap((project) => project.stack))).sort(),
  ];

  const filteredProjects =
    selectedTag === "All"
      ? projects
      : projects.filter((project) => project.stack.includes(selectedTag));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setSelectedTag(tag)}
            data-active={selectedTag === tag}
            className="section-link rounded-full px-3 py-1 text-sm font-semibold"
          >
            {tag}
          </button>
        ))}
      </div>

      <div>
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
