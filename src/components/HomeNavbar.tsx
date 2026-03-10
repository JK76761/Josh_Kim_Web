"use client";

const items = [
  { id: "hero", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export default function HomeNavbar() {
  return (
    <nav className="home-nav" aria-label="Homepage navigation">
      <div className="home-nav-track">
        {items.map((item) => (
          <a key={item.id} href={`#${item.id}`} className="home-nav-link">
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
