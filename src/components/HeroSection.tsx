import { useEffect, useState } from "react";
import { ArrowRight, Bot, FolderSync, Github, SquareTerminal, type LucideIcon } from "lucide-react";
import {
  REPO_URL,
  TERMINAL_TABS,
  type TerminalLine,
  type TerminalTab,
  type TerminalTabId,
} from "../data/kitetermData";
import { usePrefersReducedMotion } from "../hooks/useScrollReveal";

const TAB_ICONS: Record<TerminalTabId, LucideIcon> = {
  ssh: SquareTerminal,
  ai: Bot,
  sftp: FolderSync,
};

const TYPE_MS = 34; // 敲一个字符
const AFTER_PROMPT_MS = 260; // 敲完命令后「回车」的停顿
const OUTPUT_MS = 170; // 输出行之间

const LINE_COLOR: Record<TerminalLine["kind"], string> = {
  prompt: "text-ink",
  output: "text-ink-muted",
  success: "text-ok",
  accent: "text-cyber",
  muted: "text-ink-faint",
};

/** 打字进度：已完整显示的行数 + 当前行敲到第几个字符 */
interface Cursor {
  line: number;
  char: number;
}

/**
 * 一个标签页的终端内容，逐行播放：`prompt` 行逐字敲出，其余行整行出现。
 * 切换标签时父组件以 `key` 重新挂载本组件，进度自然从头开始。
 */
function TerminalBody({ lines }: { lines: readonly TerminalLine[] }) {
  const reduced = usePrefersReducedMotion();
  const [cursor, setCursor] = useState<Cursor>({ line: 0, char: 0 });
  const done = reduced || cursor.line >= lines.length;

  useEffect(() => {
    if (done) return;
    const current = lines[cursor.line];
    if (!current) return;
    let delay: number;
    let next: Cursor;
    if (current.kind === "prompt" && cursor.char < current.text.length) {
      delay = TYPE_MS;
      next = { line: cursor.line, char: cursor.char + 1 };
    } else {
      delay = current.kind === "prompt" ? AFTER_PROMPT_MS : OUTPUT_MS;
      next = { line: cursor.line + 1, char: 0 };
    }
    const timer = window.setTimeout(() => setCursor(next), delay);
    return () => window.clearTimeout(timer);
  }, [cursor, done, lines]);

  const visible = done ? lines.length : cursor.line + 1;

  return (
    <div className="min-h-[15.5rem] space-y-1.5 p-4 font-mono text-[12.5px] leading-relaxed sm:p-5 sm:text-[13px]">
      {lines.slice(0, visible).map((l, i) => {
        const typing = !done && i === cursor.line;
        const text = typing && l.kind === "prompt" ? l.text.slice(0, cursor.char) : l.text;
        // 输出行在「轮到它」之前不显示，避免整行闪一下
        if (typing && l.kind !== "prompt") return null;
        return (
          <div key={i} className={`break-all whitespace-pre-wrap ${LINE_COLOR[l.kind]}`}>
            {l.kind === "prompt" && <span className="mr-2 select-none text-cyber">❯</span>}
            {text}
            {typing && <span className="caret" aria-hidden="true" />}
          </div>
        );
      })}
      {done && (
        <div className="text-ink">
          <span className="mr-2 select-none text-cyber">❯</span>
          <span className="caret" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}

function TerminalPreview() {
  const [active, setActive] = useState<TerminalTabId>("ssh");
  const tab: TerminalTab = TERMINAL_TABS.find((t) => t.id === active) ?? TERMINAL_TABS[0]!;

  return (
    <div className="glow-card overflow-hidden shadow-[0_40px_120px_-40px_rgb(0_229_255/0.45)]">
      {/* 标题栏 */}
      <div className="flex items-center gap-3 border-b border-line bg-space-2/80 px-4 py-3">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="truncate font-mono text-xs text-ink-faint">{tab.title}</span>
      </div>

      {/* 标签页 */}
      <div role="tablist" aria-label="终端演示" className="flex gap-1 border-b border-line bg-space-2/50 px-2 pt-2">
        {TERMINAL_TABS.map((t) => {
          const Icon = TAB_ICONS[t.id];
          const selected = t.id === active;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`term-tab-${t.id}`}
              aria-selected={selected}
              aria-controls="term-panel"
              onClick={() => setActive(t.id)}
              className={`inline-flex items-center gap-1.5 rounded-t-lg border-x border-t px-3 py-2 text-xs transition-colors ${
                selected
                  ? "border-line-strong bg-panel text-cyber"
                  : "border-transparent text-ink-faint hover:text-ink-muted"
              }`}
            >
              <Icon size={14} aria-hidden="true" />
              {t.label}
            </button>
          );
        })}
      </div>

      <div id="term-panel" role="tabpanel" aria-labelledby={`term-tab-${active}`} className="bg-panel/70">
        <TerminalBody key={tab.id} lines={tab.lines} />
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section id="top" className="radial-glow relative overflow-hidden pt-24 pb-12 md:pt-28 md:pb-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-line-strong bg-white/[0.03] px-3 py-1 text-xs text-ink-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-cyber shadow-[0_0_8px_#00e5ff]" />
            Windows · macOS 桌面 SSH 终端
          </p>
          <h1 className="text-4xl leading-[1.15] font-semibold tracking-tight sm:text-5xl lg:text-[3.4rem]">
            把整套远程工作台，
            <br />
            <span className="text-gradient">装进一个终端。</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
            多标签会话、可视化 SFTP、端口转发、服务器监控与端到端加密云同步，再加一个懂分寸的 AI 终端助手。
            你日常要开五个工具做的事，这里一个窗口搞定。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#download" className="btn-primary inline-flex h-12 items-center gap-2 rounded-xl px-6 font-medium">
              获取 KiteTerm
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost inline-flex h-12 items-center gap-2 rounded-xl px-6 text-ink"
            >
              <Github size={18} aria-hidden="true" />
              在 GitHub 查看源码
            </a>
          </div>
          <p className="mt-6 text-xs text-ink-faint">本地功能无需注册 · 凭据只留在你的设备上</p>
        </div>

        <TerminalPreview />
      </div>
    </section>
  );
}
