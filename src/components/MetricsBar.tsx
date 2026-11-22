import { METRICS, type Metric } from "../data/kitetermData";
import { useCountUp, useScrollReveal } from "../hooks/useScrollReveal";

function MetricItem({ metric, active, index }: { metric: Metric; active: boolean; index: number }) {
  // 依次错开一点开始，看起来更像一排读数在跳
  const value = useCountUp(metric.value, active, 1200 + index * 150);
  return (
    <div className="px-4 py-6 text-center md:px-6 md:py-8">
      <div className="font-mono text-3xl font-semibold text-ink tabular-nums md:text-4xl">
        <span className="text-gradient">{value}</span>
        {metric.suffix && <span className="ml-1 text-base font-normal text-ink-muted md:text-lg">{metric.suffix}</span>}
      </div>
      <div className="mt-2 text-sm font-medium text-ink">{metric.label}</div>
      <div className="mt-1 text-xs leading-relaxed text-ink-faint">{metric.detail}</div>
    </div>
  );
}

/** 核心指标栏：首次进入视口时数字从 0 平滑递增到目标值 */
export function MetricsBar() {
  const [ref, visible] = useScrollReveal<HTMLDivElement>({ threshold: 0.35 });
  return (
    <section aria-label="核心指标" className="relative px-4 sm:px-6">
      <div
        ref={ref}
        className={`reveal glow-card mx-auto grid max-w-6xl grid-cols-2 divide-line md:grid-cols-4 md:divide-x ${
          visible ? "is-visible" : ""
        }`}
      >
        {METRICS.map((m, i) => (
          <MetricItem key={m.label} metric={m} active={visible} index={i} />
        ))}
      </div>
    </section>
  );
}
