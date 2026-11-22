import { useCallback, useEffect, useState } from "react";
import { Activity, ArrowRight, Cable, RotateCcw, Sparkles, X, Check } from "lucide-react";
import {
  DIAGNOSIS,
  DIAGNOSIS_COMMAND,
  FORWARD_COMPARE,
  LOG_STREAM,
  type LogLine,
} from "../data/kitetermData";
import { usePrefersReducedMotion, useScrollReveal } from "../hooks/useScrollReveal";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const LOG_INTERVAL_MS = 420;
const DIAG_INTERVAL_MS = 650;

const LEVEL_STYLE: Record<LogLine["level"], string> = {
  INFO: "text-ink-faint",
  WARN: "text-warn",
  ERROR: "text-err",
};

type DiagPhase = "idle" | "running" | "done";

/**
 * 每隔 `interval` 毫秒把计数加一，直到 `total`。`active` 为 false 时不走；
 * 减少动态效果时直接返回 `total`。
 */
function useStepper(total: number, active: boolean, interval: number): number {
  const reduced = usePrefersReducedMotion();
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active || reduced || count >= total) return;
    const t = window.setTimeout(() => setCount((c) => c + 1), interval);
    return () => window.clearTimeout(t);
  }, [active, reduced, count, total, interval]);
  if (!active) return 0;
  return reduced ? total : count;
}

/** 排障演练：点按钮后依次出现诊断结论；演练过一次可以重来 */
function Diagnosis({ run }: { run: number }) {
  const shown = useStepper(DIAGNOSIS.length + 1, true, DIAG_INTERVAL_MS);
  return (
    <div className="space-y-3" aria-live="polite">
      {DIAGNOSIS.slice(0, shown).map((d) => (
        <div key={`${run}-${d.label}`} className="animate-fade-up flex gap-3 text-sm">
          <span className="mt-0.5 shrink-0 rounded-md border border-cyber/30 bg-cyber/10 px-1.5 py-0.5 font-mono text-[11px] text-cyber">
            {d.label}
          </span>
          <span className="leading-relaxed text-ink">{d.text}</span>
        </div>
      ))}
      {shown > DIAGNOSIS.length && (
        <div className="animate-fade-up rounded-lg border border-line bg-space/70 p-3">
          <div className="mb-1.5 text-[11px] text-ink-faint">下一步（只读，自动执行）：</div>
          <code className="font-mono text-[12.5px] break-all text-cyber">{DIAGNOSIS_COMMAND}</code>
        </div>
      )}
    </div>
  );
}

function LogTroubleshoot() {
  const [ref, visible] = useScrollReveal<HTMLDivElement>({ threshold: 0.3 });
  const shownLogs = useStepper(LOG_STREAM.length, visible, LOG_INTERVAL_MS);
  const logsDone = shownLogs >= LOG_STREAM.length;
  const [phase, setPhase] = useState<DiagPhase>("idle");
  // 每次演练换一个 key,Diagnosis 重新挂载，进度从头开始
  const [run, setRun] = useState(0);

  const start = () => {
    setRun((r) => r + 1);
    setPhase("running");
  };
  // 固定引用：DiagnosisRunner 的计时 effect 依赖它，每次渲染换新函数会让计时器反复重置
  const finish = useCallback(() => setPhase("done"), []);

  return (
    <div ref={ref} className="glow-card flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
        <div className="flex items-center gap-2 text-sm font-medium text-ink">
          <Activity size={16} className="text-cyber" aria-hidden="true" />
          终端内实时排障
        </div>
        <span className="font-mono text-[11px] text-ink-faint">journalctl -fu app-api</span>
      </div>

      <div className="min-h-[13.5rem] space-y-1 bg-space/60 p-4 font-mono text-[12px] leading-relaxed">
        {LOG_STREAM.slice(0, shownLogs).map((l, i) => (
          <div key={i} className={`animate-fade-up break-all ${l.level === "ERROR" ? "bg-err/5" : ""}`}>
            <span className="text-ink-faint">{l.time}</span>{" "}
            <span className={`${LEVEL_STYLE[l.level]} font-semibold`}>{l.level.padEnd(5)}</span>{" "}
            <span className="text-ink-muted">{l.text}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-1 flex-col gap-4 border-t border-line p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-ink-faint">
            {logsDone ? "检测到失败输出 —— 可以交给 AI 诊断" : "正在跟随日志…"}
          </p>
          <button
            type="button"
            onClick={start}
            disabled={!logsDone || phase === "running"}
            className="btn-primary inline-flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          >
            {phase === "idle" ? (
              <>
                <Sparkles size={15} aria-hidden="true" />
                AI 一键排障
              </>
            ) : (
              <>
                <RotateCcw size={15} aria-hidden="true" />
                再演练一次
              </>
            )}
          </button>
        </div>
        {phase !== "idle" && <DiagnosisRunner key={run} run={run} onDone={finish} />}
      </div>
    </div>
  );
}

/** 包一层：Diagnosis 播完后通知父组件把按钮恢复可点 */
function DiagnosisRunner({ run, onDone }: { run: number; onDone: () => void }) {
  const reduced = usePrefersReducedMotion();
  const totalMs = reduced ? 0 : (DIAGNOSIS.length + 1) * DIAG_INTERVAL_MS + 100;
  useEffect(() => {
    const t = window.setTimeout(onDone, totalMs);
    return () => window.clearTimeout(t);
  }, [onDone, totalMs]);
  return <Diagnosis run={run} />;
}

function ForwardCompare() {
  return (
    <div className="glow-card flex h-full flex-col overflow-hidden">
      <div className="flex items-center gap-2 border-b border-line px-5 py-3.5 text-sm font-medium text-ink">
        <Cable size={16} className="text-cyber" aria-hidden="true" />
        把内网 HTTP 服务带到本机
      </div>
      <div className="flex items-center gap-2 border-b border-line bg-space/60 px-5 py-3 font-mono text-[12px] text-ink-muted">
        <span>localhost:8080</span>
        <ArrowRight size={14} className="text-cyber" aria-hidden="true" />
        <span>bastion</span>
        <ArrowRight size={14} className="text-cyber" aria-hidden="true" />
        <span className="text-ink">10.0.3.7:80</span>
      </div>
      <div className="overflow-x-auto">
      <table className="w-full min-w-[30rem] text-left text-sm">
        <caption className="sr-only">手动 ssh -L 与 KiteTerm 端口转发对比</caption>
        <thead>
          <tr className="text-[11px] tracking-wider text-ink-faint uppercase">
            <th scope="col" className="px-5 py-3 font-medium">
              场景
            </th>
            <th scope="col" className="px-3 py-3 font-medium">
              手敲 ssh -L
            </th>
            <th scope="col" className="px-5 py-3 font-medium text-cyber">
              KiteTerm
            </th>
          </tr>
        </thead>
        <tbody>
          {FORWARD_COMPARE.map((r) => (
            <tr key={r.aspect} className="border-t border-line align-top">
              <th scope="row" className="px-5 py-3 text-[13px] font-medium whitespace-nowrap text-ink">
                {r.aspect}
              </th>
              <td className="px-3 py-3 text-[13px] text-ink-faint">
                <span className="flex gap-1.5">
                  <X size={14} className="mt-0.5 shrink-0 text-err/70" aria-hidden="true" />
                  {r.manual}
                </span>
              </td>
              <td className="px-5 py-3 text-[13px] text-ink-muted">
                <span className="flex gap-1.5">
                  <Check size={14} className="mt-0.5 shrink-0 text-cyber" aria-hidden="true" />
                  {r.kiteterm}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export function WorkflowShowcase() {
  return (
    <section id="workflow" className="relative px-4 py-24 sm:px-6 md:py-32">
      <SectionHeading
        eyebrow="Workflow"
        title="排障与隧道，都在终端里完成"
        description="日志报错时不用切窗口查资料：把失败输出交给 AI，先看根因再动手。要访问内网服务，转发规则一次配置、长期有效。"
      />
      {/* min-w-0:Grid 子项默认按内容最小宽度撑开，右栏表格的 min-width 会把整列连同左栏一起撑出视口 */}
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-2 [&>*]:min-w-0">
        <Reveal>
          <LogTroubleshoot />
        </Reveal>
        <Reveal delay={120}>
          <ForwardCompare />
        </Reveal>
      </div>
    </section>
  );
}
