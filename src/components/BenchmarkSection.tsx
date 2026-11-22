import { FlaskConical } from "lucide-react";
import {
  BENCHMARKS,
  BENCHMARK_BASELINE_LABEL,
  BENCHMARK_IS_PLACEHOLDER,
  type BenchmarkMetric,
} from "../data/kitetermData";
import { useCountUp, useScrollReveal } from "../hooks/useScrollReveal";
import { SectionHeading } from "./SectionHeading";

/** 一句话概括优势：越小越好的看「快/省多少」，越大越好的看「高多少」 */
function verdict(m: BenchmarkMetric): string {
  if (m.lowerIsBetter) {
    const saved = Math.round((1 - m.kiteterm / m.baseline) * 100);
    return m.id === "memory" ? `省 ${saved}%` : `快 ${(m.baseline / m.kiteterm).toFixed(1)}×`;
  }
  return `高 ${Math.round((m.kiteterm / m.baseline - 1) * 100)}%`;
}

function Bar({
  label,
  value,
  unit,
  ratio,
  active,
  highlight,
}: {
  label: string;
  value: number;
  unit: string;
  ratio: number;
  active: boolean;
  highlight: boolean;
}) {
  const shown = useCountUp(value, active, 1100);
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-xs">
        <span className={highlight ? "text-ink" : "text-ink-faint"}>{label}</span>
        <span className={`font-mono tabular-nums ${highlight ? "text-cyber" : "text-ink-muted"}`}>
          {shown} {unit}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
        <div
          className={`h-full rounded-full transition-[width] duration-[1100ms] ease-out motion-reduce:transition-none ${
            highlight
              ? "bg-gradient-to-r from-cyber to-electric shadow-[0_0_12px_rgb(0_229_255/0.6)]"
              : "bg-ink-faint/50"
          }`}
          style={{ width: active ? `${Math.max(4, ratio * 100)}%` : "0%" }}
        />
      </div>
    </div>
  );
}

function MetricCard({ metric, active }: { metric: BenchmarkMetric; active: boolean }) {
  const max = Math.max(metric.kiteterm, metric.baseline);
  return (
    <div className="glow-card p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium text-ink">{metric.label}</h3>
          <p className="mt-0.5 text-xs text-ink-faint">{metric.lowerIsBetter ? "越低越好" : "越高越好"}</p>
        </div>
        <span className="rounded-full border border-cyber/30 bg-cyber/10 px-2.5 py-1 font-mono text-xs text-cyber">
          {verdict(metric)}
        </span>
      </div>
      <div className="space-y-4">
        <Bar
          label="KiteTerm"
          value={metric.kiteterm}
          unit={metric.unit}
          ratio={metric.kiteterm / max}
          active={active}
          highlight
        />
        <Bar
          label={BENCHMARK_BASELINE_LABEL}
          value={metric.baseline}
          unit={metric.unit}
          ratio={metric.baseline / max}
          active={active}
          highlight={false}
        />
      </div>
    </div>
  );
}

/** 性能基准：进入视口时进度条从 0 展开、数字递增 */
export function BenchmarkSection() {
  const [ref, visible] = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });
  return (
    <section id="benchmark" className="relative px-4 py-24 sm:px-6 md:py-32">
      <SectionHeading
        eyebrow="Benchmark"
        title="原生内核，轻快不占地"
        description="基于 Tauri 与 Rust，界面用系统 WebView，不随包附带整套浏览器 —— 启动、内存与输入响应都更克制。"
      />
      {BENCHMARK_IS_PLACEHOLDER && (
        <p className="mx-auto mb-8 flex max-w-6xl items-center justify-center gap-2 text-center text-xs text-warn">
          <FlaskConical size={14} aria-hidden="true" />
          以下为示意数据，尚未实测；正式数据以发布时的基准测试为准。
        </p>
      )}
      <div
        ref={ref}
        className={`reveal mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4 ${visible ? "is-visible" : ""}`}
      >
        {BENCHMARKS.map((m) => (
          <MetricCard key={m.id} metric={m} active={visible} />
        ))}
      </div>
    </section>
  );
}
