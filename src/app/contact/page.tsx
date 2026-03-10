import Link from "next/link";
import CopyEmailButton from "@/components/CopyEmailButton";
import { profile } from "@/lib/data";

const socialItems = [
  { label: "GitHub", href: profile.socials.github },
  { label: "LinkedIn", href: profile.socials.linkedin },
  ...(profile.socials.x ? [{ label: "X", href: profile.socials.x }] : []),
  ...(profile.socials.website ? [{ label: "Website", href: profile.socials.website }] : []),
];

export default function ContactPage() {
  return (
    <div className="max-w-4xl space-y-12">
      <header className="page-fade stagger-1 max-w-3xl space-y-4">
        <Link href="/" className="link-inline text-sm font-semibold">
          Back to home
        </Link>
        <h1 className="section-title">Contact</h1>
        <p className="section-copy">
          If you want to discuss a role, project, or internship path, email is the
          fastest route.
        </p>
      </header>

      <section className="page-fade stagger-2 space-y-8">
        <div className="contact-grid">
          <div className="space-y-6">
            <a href={`mailto:${profile.email}`} className="contact-email contact-email-large">
              {profile.email}
            </a>

            <p className="section-copy max-w-xl">
              I&apos;m currently open to graduate software roles and IT support-focused
              opportunities. If there&apos;s a team or project worth discussing, email is
              the best starting point.
            </p>

            <div className="flex flex-wrap gap-3">
              <CopyEmailButton email={profile.email} />
              <a
                href="/Joshua_Kim_CV_final.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-secondary"
              >
                View CV
              </a>
            </div>
          </div>

          <div className="contact-rail">
            <div className="contact-row">
              <span className="contact-row-label">Location</span>
              <span className="contact-row-value">{profile.location}</span>
            </div>
            <div className="contact-row">
              <span className="contact-row-label">Availability</span>
              <span className="contact-row-value">{profile.availability}</span>
            </div>
            {socialItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-row"
              >
                <span className="contact-row-label">{item.label}</span>
                <span className="contact-row-link">Open</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
