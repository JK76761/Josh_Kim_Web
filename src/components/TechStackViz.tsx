import { stackSkills } from "@/lib/data";

const CATEGORY_ORDER = [
  "Frontend",
  "Mobile",
  "Backend",
  "Systems & Support",
  "Dev Tools",
];

function levelLabel(level: number): string {
  if (level >= 5) {
    return "Advanced";
  }

  if (level >= 4) {
    return "Strong";
  }

  if (level >= 3) {
    return "Working";
  }

  return "Learning";
}

export default function TechStackViz() {
  const grouped = CATEGORY_ORDER.map((category) => {
    const items = stackSkills
      .filter((skill) => skill.category === category)
      .sort((a, b) => b.level - a.level);

    const averageLevel = items.length
      ? Math.round((items.reduce((total, item) => total + item.level, 0) / items.length) * 20)
      : 0;

    return {
      category,
      items,
      averageLevel,
    };
  }).filter((group) => group.items.length > 0);

  return (
    <section className="page-fade stagger-2 space-y-8">
      <div className="space-y-3">
        <div>
          <p className="section-kicker">Stack</p>
          <h2 className="section-title mt-3">기술 스택 시각화</h2>
          <p className="section-copy mt-3 max-w-2xl">
            카테고리별 강점과 실사용 비중을 한 화면에서 읽기 쉽게 정리했습니다.
          </p>
        </div>
      </div>

      <div className="grid gap-x-12 gap-y-8 lg:grid-cols-2">
        {grouped.map((group, groupIndex) => (
          <article key={group.category} className="stack-group space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-xl font-semibold text-[var(--text-strong)]">
                {group.category}
              </h3>
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Avg {group.averageLevel}%
              </span>
            </div>

            <ul className="space-y-3">
              {group.items.map((item, itemIndex) => (
                <li key={item.id}>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-[var(--text-primary)]">{item.name}</span>
                    <span className="text-xs font-semibold text-[var(--text-muted)]">
                      {levelLabel(item.level)}
                    </span>
                  </div>

                  <div className="meter-track">
                    <div
                      className="meter-fill"
                      style={{
                        width: `${(item.level / 5) * 100}%`,
                        animationDelay: `${(groupIndex * 4 + itemIndex) * 110}ms`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
