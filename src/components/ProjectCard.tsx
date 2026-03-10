import type { Project } from "@/lib/types";

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="project-card-simple">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {project.year}
          </p>
          <h3 className="font-display text-2xl font-semibold text-slate-50">
            {project.name}
          </h3>
        </div>

        <div className="flex flex-wrap gap-4 text-sm font-semibold text-slate-300">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-inline"
          >
            GitHub
          </a>
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-inline"
            >
              Live Demo
            </a>
          ) : null}
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-400">{project.summary}</p>
      <p className="mt-3 text-sm leading-7 text-slate-500">{project.impact}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.stack.map((item) => (
          <span key={item} className="row-tag">
            {item}
          </span>
        ))}
      </div>
    </article>
  );
}
