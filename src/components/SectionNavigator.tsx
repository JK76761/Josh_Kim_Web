"use client";

import { useEffect, useState } from "react";

type SectionItem = {
  id: string;
  label: string;
};

type SectionNavigatorProps = {
  compact?: boolean;
  items: SectionItem[];
};

export default function SectionNavigator({
  compact = false,
  items,
}: SectionNavigatorProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!elements.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target.id) {
          setActiveId(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.2, 0.45, 0.7],
      },
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, [items]);

  return (
    <nav aria-label="Home sections">
      <div
        className={`section-nav flex gap-2 overflow-x-auto pb-1 ${
          compact ? "" : "flex-wrap lg:flex-col lg:gap-2"
        }`}
      >
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            data-active={activeId === item.id}
            className={`section-link whitespace-nowrap text-sm font-semibold ${
              compact ? "rounded-full px-3 py-1" : "section-link-rail px-0 py-1.5"
            }`}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
