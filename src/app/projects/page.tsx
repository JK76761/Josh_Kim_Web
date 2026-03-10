import Link from "next/link";
import ProjectsArchive from "@/components/ProjectsArchive";
import { projects } from "@/lib/data";

export default function ProjectsPage() {
  return (
    <div className="max-w-5xl space-y-12">
      <header className="page-fade stagger-1 max-w-3xl space-y-4">
        <Link href="/" className="link-inline text-sm font-semibold">
          Back to home
        </Link>
        <p className="section-kicker">Archive</p>
        <h1 className="section-title">Projects</h1>
        <p className="section-copy">
          Work across web and mobile with emphasis on clean delivery, live API
          integrations, authentication flow, and deployment-ready implementation.
        </p>
      </header>

      <section className="page-fade stagger-2">
        <ProjectsArchive projects={projects} />
      </section>
    </div>
  );
}
