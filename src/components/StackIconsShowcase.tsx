import type { CSSProperties, JSX } from "react";

type TechIcon = {
  angle: number;
  color: string;
  id: string;
  label: string;
  orbit: "outer" | "inner";
  svg: JSX.Element;
};

const techIcons: TechIcon[] = [
  {
    id: "nextjs",
    label: "Next.js",
    color: "#f8fafc",
    orbit: "outer",
    angle: 0,
    svg: (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <circle cx="32" cy="32" r="25" stroke="currentColor" strokeWidth="3" />
        <path
          d="M22 40V24l20 16V24"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "react",
    label: "React",
    color: "#61dafb",
    orbit: "inner",
    angle: 48,
    svg: (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <circle cx="32" cy="32" r="4.5" fill="currentColor" />
        <ellipse cx="32" cy="32" rx="22" ry="8.5" stroke="currentColor" strokeWidth="2.8" />
        <ellipse
          cx="32"
          cy="32"
          rx="22"
          ry="8.5"
          stroke="currentColor"
          strokeWidth="2.8"
          transform="rotate(60 32 32)"
        />
        <ellipse
          cx="32"
          cy="32"
          rx="22"
          ry="8.5"
          stroke="currentColor"
          strokeWidth="2.8"
          transform="rotate(120 32 32)"
        />
      </svg>
    ),
  },
  {
    id: "typescript",
    label: "TypeScript",
    color: "#3178c6",
    orbit: "outer",
    angle: 120,
    svg: (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <rect x="10" y="10" width="44" height="44" rx="8" fill="currentColor" />
        <path
          d="M22 24h20M32 24v18M25 31h7M38 33.5c0-1.8 1.4-3 3.5-3 1.9 0 3.2.8 4.5 2.2M38.2 41c1 .8 2.1 1.2 3.5 1.2 2.2 0 3.8-1.3 3.8-3.1 0-4.7-7.8-2.2-7.8-6.6"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "node",
    label: "Node.js",
    color: "#5fa04e",
    orbit: "inner",
    angle: 182,
    svg: (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path
          d="M32 8 50 18.5v21L32 56 14 39.5v-21L32 8Z"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          d="M26 40V24l12 16V24"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "react-native",
    label: "React Native",
    color: "#8b5cf6",
    orbit: "outer",
    angle: 240,
    svg: (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <rect x="18" y="10" width="28" height="44" rx="8" stroke="currentColor" strokeWidth="3" />
        <circle cx="32" cy="45" r="2.8" fill="currentColor" />
        <rect x="24" y="18" width="16" height="18" rx="3" stroke="currentColor" strokeWidth="2.5" />
      </svg>
    ),
  },
  {
    id: "vercel",
    label: "Vercel",
    color: "#f59e0b",
    orbit: "inner",
    angle: 304,
    svg: (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M32 14 49 46H15L32 14Z" fill="currentColor" />
      </svg>
    ),
  },
];

export default function StackIconsShowcase() {
  return (
    <div className="stack-orbit" aria-label="Animated tech stack showcase">
      <div className="stack-orbit-glow" />
      <div className="stack-orbit-ring stack-orbit-ring-outer" />
      <div className="stack-orbit-ring stack-orbit-ring-inner" />

      <div className="stack-core">
        <span className="stack-core-kicker">Core Stack</span>
        <strong className="stack-core-title">Next.js + React</strong>
        <span className="stack-core-copy">TypeScript, Node.js, React Native, Vercel</span>
      </div>

      {techIcons.map((icon) => (
        <div
          key={icon.id}
          className={`orbit-node orbit-node-${icon.orbit}`}
          style={
            {
              "--node-angle": `${icon.angle}deg`,
              "--node-color": icon.color,
            } as CSSProperties
          }
        >
          <div className="orbit-node-badge" title={icon.label} aria-label={icon.label}>
            <div className="orbit-node-icon">{icon.svg}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
