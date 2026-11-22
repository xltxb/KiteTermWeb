import type { MouseEvent } from "react";
import { Check } from "lucide-react";
import { FEATURES, type FeatureCard } from "../data/kitetermData";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

/** 把鼠标位置写进 CSS 变量，微光边框的光点跟着走（见 index.css 的 .glow-card::before） */
function trackGlow(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  el.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

function Card({ feature }: { feature: FeatureCard }) {
  const Icon = feature.icon;
  return (
    <article onMouseMove={trackGlow} className="glow-card flex h-full flex-col p-5 md:p-6">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cyber/25 bg-cyber/10 text-cyber shadow-[0_0_24px_-6px_rgb(0_229_255/0.6)]">
        <Icon size={22} aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-ink">{feature.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{feature.description}</p>
      <ul className="mt-4 space-y-1.5 border-t border-line pt-3">
        {feature.points.map((p) => (
          <li key={p} className="flex items-start gap-2 text-[13px] text-ink-muted">
            <Check size={15} className="mt-0.5 shrink-0 text-cyber" aria-hidden="true" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

/** 核心能力 Bento 网格：大屏三列，wide 卡片占两列；平板两列；手机单列 */
export function BentoFeatures() {
  return (
    <section id="features" className="relative px-4 py-12 sm:px-6 md:py-16">
      <SectionHeading
        eyebrow="Core Capabilities"
        title="一个窗口，装下整套远程工作台"
        description="会话、文件、隧道、监控、同步，再加一个懂分寸的 AI —— 每一块都为日常运维的高频动作设计。"
      />
      <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <Reveal key={f.id} delay={(i % 3) * 90} className={f.size === "wide" ? "lg:col-span-2" : ""}>
            <Card feature={f} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
