import Link from "next/link";
import { education, experience } from "@/lib/data";
import { formatDateLabel } from "@/lib/format";

export default function ExperiencePage() {
  return (
    <div className="max-w-5xl space-y-14">
      <header className="page-fade stagger-1 max-w-3xl space-y-4">
        <Link href="/" className="link-inline text-sm font-semibold">
          Back to home
        </Link>
        <p className="section-kicker">Timeline</p>
        <h1 className="section-title">Experience</h1>
        <p className="section-copy">
          Full-stack product work, systems analysis, and operational problem solving
          across both engineering and customer-facing environments.
        </p>
      </header>

      <section className="page-fade stagger-2">
        {experience.map((item) => (
          <article
            key={item.id}
            className="line-row grid gap-4 py-7 md:grid-cols-[170px_minmax(0,1fr)]"
          >
            <div className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
              <p>{formatDateLabel(item.startDate)}</p>
              <p>{formatDateLabel(item.endDate)}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="font-display text-2xl font-semibold text-[var(--text-strong)]">
                  {item.role}
                </h2>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {item.company} • {item.location}
                </p>
                <p className="max-w-3xl text-sm leading-7 text-[var(--text-muted)]">{item.summary}</p>
              </div>

              <ul className="space-y-2 text-sm leading-7 text-[var(--text-muted)]">
                {item.achievements.map((achievement) => (
                  <li key={achievement}>{achievement}</li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2">
                {item.technologies.map((technology) => (
                  <span key={technology} className="row-tag">
                    {technology}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="page-fade stagger-3 space-y-6">
        <div className="space-y-3">
          <p className="section-kicker">Education</p>
          <h2 className="section-title">Formal study</h2>
        </div>

        <div>
          {education.map((item) => (
            <article
              key={item.id}
              className="line-row grid gap-3 py-6 md:grid-cols-[170px_minmax(0,1fr)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                {formatDateLabel(item.startDate)} - {formatDateLabel(item.endDate)}
              </p>
              <div className="space-y-2">
                <h3 className="font-display text-xl font-semibold text-[var(--text-strong)]">
                  {item.program}
                </h3>
                <p className="text-sm text-[var(--text-primary)]">
                  {item.institution} • {item.location}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
