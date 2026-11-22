import { useEffect, useRef, useState } from "react";
import { Apple, Check, Copy, Download, ExternalLink, Monitor, type LucideIcon } from "lucide-react";
import {
  DOWNLOADS,
  INSTALLERS_RELEASED,
  RELEASES_URL,
  type CommandBlock,
  type PlatformId,
} from "../data/kitetermData";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const PLATFORM_ICONS: Record<PlatformId, LucideIcon> = {
  macos: Apple,
  windows: Monitor,
};

/** 复制到剪贴板。Clipboard API 不可用（非安全上下文等）时退回选区复制 */
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // 落到下面的兜底
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  document.body.removeChild(ta);
  return ok;
}

type CopyState = "idle" | "copied" | "failed";

function CommandRow({ block }: { block: CommandBlock }) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<number | undefined>(undefined);

  // 卸载时清掉还没到点的复位计时器
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onCopy = async () => {
    const ok = await copyText(block.command);
    setState(ok ? "copied" : "failed");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2000);
  };

  return (
    <div>
      <div className="mb-2 text-xs text-ink-faint">{block.title}</div>
      <div className="flex items-stretch overflow-hidden rounded-xl border border-line bg-space/80">
        <pre className="flex-1 overflow-x-auto px-4 py-3 font-mono text-[12.5px] leading-relaxed text-ink">
          <span className="mr-2 select-none text-cyber">$</span>
          {block.command}
        </pre>
        <button
          type="button"
          onClick={onCopy}
          className={`flex w-24 shrink-0 items-center justify-center gap-1.5 border-l border-line text-xs transition-colors ${
            state === "copied"
              ? "bg-ok/10 text-ok"
              : state === "failed"
                ? "bg-err/10 text-err"
                : "text-ink-muted hover:bg-cyber/10 hover:text-cyber"
          }`}
          aria-label={`复制命令：${block.title}`}
        >
          {state === "copied" ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
          {state === "copied" ? "已复制" : state === "failed" ? "复制失败" : "复制"}
        </button>
      </div>
      {/* 读屏软件播报复制结果 */}
      <span className="sr-only" aria-live="polite">
        {state === "copied" ? "已复制到剪贴板" : state === "failed" ? "复制失败，请手动选中复制" : ""}
      </span>
    </div>
  );
}

function guessPlatform(): PlatformId {
  if (typeof navigator === "undefined") return "macos";
  return /Win/i.test(navigator.userAgent) ? "windows" : "macos";
}

export function DownloadSection() {
  // 按访客系统预选一个平台
  const [platform, setPlatform] = useState<PlatformId>(guessPlatform);
  const current = DOWNLOADS.find((d) => d.id === platform) ?? DOWNLOADS[0]!;

  return (
    <section id="download" className="radial-glow relative px-4 py-12 sm:px-6 md:py-16">
      <SectionHeading
        eyebrow="Download"
        title="获取 KiteTerm"
        description="选择你的系统。安装包发布前，可以按下面两步从源码构建。"
      />
      <Reveal className="mx-auto max-w-3xl">
        <div className="glow-card p-5 sm:p-7">
          <div role="tablist" aria-label="选择平台" className="mb-6 inline-flex rounded-xl border border-line bg-space/70 p-1">
            {DOWNLOADS.map((d) => {
              const Icon = PLATFORM_ICONS[d.id];
              const selected = d.id === platform;
              return (
                <button
                  key={d.id}
                  type="button"
                  role="tab"
                  id={`dl-tab-${d.id}`}
                  aria-selected={selected}
                  aria-controls="dl-panel"
                  onClick={() => setPlatform(d.id)}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors ${
                    selected ? "bg-cyber/15 text-cyber shadow-[inset_0_0_0_1px_rgb(0_229_255/0.35)]" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  <Icon size={16} aria-hidden="true" />
                  {d.label}
                </button>
              );
            })}
          </div>

          <div id="dl-panel" role="tabpanel" aria-labelledby={`dl-tab-${current.id}`}>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-ink-muted">{current.requirement}</p>
              <a
                href={RELEASES_URL}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-medium ${
                  INSTALLERS_RELEASED ? "btn-primary" : "btn-ghost text-ink-muted"
                }`}
              >
                <Download size={16} aria-hidden="true" />
                {current.installerLabel}
                {INSTALLERS_RELEASED ? (
                  <ExternalLink size={14} aria-hidden="true" />
                ) : (
                  <span className="rounded bg-warn/15 px-1.5 py-0.5 text-[10px] text-warn">尚未发布</span>
                )}
              </a>
            </div>
            <div className="space-y-5">
              {current.commands.map((c) => (
                <CommandRow key={`${current.id}-${c.title}`} block={c} />
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
