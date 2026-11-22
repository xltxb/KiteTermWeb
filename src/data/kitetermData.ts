/**
 * 官网的全部文案与数据。组件只负责呈现，改文案、改数字都在这里。
 *
 * 取材原则：功能描述以 KiteTerm 仓库 README「功能对照（PRD F1–F10）」为准，只写已实现的；
 * 规划中的能力明确标注 `planned`。性能基准目前没有实测，数据标为 `placeholder`,
 * 页面上会显示「示意数据」—— 拿到实测结果后替换数字并把 `placeholder` 改为 false。
 */
import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Cable,
  FolderSync,
  Gauge,
  Layers,
  ShieldCheck,
} from "lucide-react";

export const REPO_URL = "https://github.com/xltxb/KiteTerm";

/** public/ 下资源的地址。要带上 BASE_URL,站点放在子路径下时才找得到(见 vite.config.ts) */
export const BRAND_ICON = `${import.meta.env.BASE_URL}img/icon-128.png`;
export const RELEASES_URL = `${REPO_URL}/releases`;

/** 已发布安装包时改为 true，下载按钮会去掉「尚未发布」提示 */
export const INSTALLERS_RELEASED = false;

// ---------------------------------------------------------------------------
// 导航
// ---------------------------------------------------------------------------

export interface NavLink {
  href: `#${string}`;
  label: string;
}

export const NAV_LINKS: readonly NavLink[] = [
  { href: "#features", label: "核心能力" },
  { href: "#workflow", label: "工作流" },
  { href: "#benchmark", label: "性能" },
  { href: "#download", label: "下载" },
  { href: "#faq", label: "常见问题" },
];

// ---------------------------------------------------------------------------
// Hero 终端预览
// ---------------------------------------------------------------------------

export type TerminalTabId = "ssh" | "ai" | "sftp";

/** 终端里的一行。`prompt` 行会逐字「敲」出来，其余按行出现 */
export interface TerminalLine {
  kind: "prompt" | "output" | "success" | "accent" | "muted";
  text: string;
}

export interface TerminalTab {
  id: TerminalTabId;
  label: string;
  /** 标题栏显示的会话名 */
  title: string;
  lines: readonly TerminalLine[];
}

export const TERMINAL_TABS: readonly TerminalTab[] = [
  {
    id: "ssh",
    label: "SSH",
    title: "deploy@prod-web-01",
    lines: [
      { kind: "muted", text: "已连接 · ssh-ed25519 指纹已校验 · 延迟 18ms" },
      { kind: "prompt", text: "systemctl is-active nginx app-api" },
      { kind: "success", text: "active" },
      { kind: "success", text: "active" },
      { kind: "prompt", text: "df -h / | tail -1" },
      { kind: "output", text: "/dev/vda1   80G   41G   39G  52% /" },
      { kind: "prompt", text: "uptime" },
      { kind: "output", text: " 14:02:31 up 37 days,  load average: 0.42, 0.38, 0.35" },
    ],
  },
  {
    id: "ai",
    label: "AI Copilot",
    title: "AI 终端助手",
    lines: [
      { kind: "prompt", text: "找出占用 8080 端口的进程" },
      { kind: "muted", text: "✦ 识别为白话，交给 AI 翻译成命令…" },
      { kind: "accent", text: "ss -tlnp 'sport = :8080'" },
      { kind: "muted", text: "只读命令 · 已确认 · 执行中" },
      { kind: "output", text: "LISTEN 0 511 *:8080 users:((\"java\",pid=21477,fd=42))" },
      { kind: "accent", text: "✦ 8080 由 java 进程 21477 占用，看起来是旧版 app.jar 未退出。" },
    ],
  },
  {
    id: "sftp",
    label: "SFTP",
    title: "SFTP · /var/www/releases",
    lines: [
      { kind: "prompt", text: "put ./dist/web-2.4.0.tar.gz" },
      { kind: "output", text: "web-2.4.0.tar.gz   ████████████████████ 100%  38.2MB  21.6MB/s" },
      { kind: "prompt", text: "put ./dist/checksums.txt" },
      { kind: "output", text: "checksums.txt      ████████████████████ 100%   1.1KB" },
      { kind: "success", text: "队列完成 · 2 个文件 · 断点续传已校验（SHA-256）" },
    ],
  },
];

// ---------------------------------------------------------------------------
// 指标栏 —— 都是产品的客观事实，不是用户量之类需要背书的数字
// ---------------------------------------------------------------------------

export interface Metric {
  value: number;
  suffix?: string;
  label: string;
  detail: string;
}

export const METRICS: readonly Metric[] = [
  { value: 10, suffix: " 项", label: "核心功能模块", detail: "终端、SFTP、转发、监控、同步…" },
  { value: 3, suffix: " 种", label: "AI 模型协议", detail: "Anthropic · OpenAI 兼容 · 本地 Ollama" },
  { value: 256, suffix: " 位", label: "端到端加密密钥", detail: "XChaCha20-Poly1305，云端只见密文" },
  { value: 24, suffix: " 词", label: "BIP39 恢复短语", detail: "忘记主密码也能找回同步数据" },
];

// ---------------------------------------------------------------------------
// Bento 核心能力
// ---------------------------------------------------------------------------

export interface FeatureCard {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  points: readonly string[];
  /** Bento 网格里的尺寸：wide 在大屏上占两列。大屏三列，宽窄卡片要能凑满整行（当前 3 宽 + 3 窄 = 9 格） */
  size: "wide" | "normal";
}

export const FEATURES: readonly FeatureCard[] = [
  {
    id: "sessions",
    icon: Layers,
    title: "多标签与会话管理",
    description: "主机分组与标签、一键连接、断线指数退避自动重连。本地终端与 SSH 标签页并排工作。",
    points: ["⌘T 本地终端 · ⌘W 关闭", "⌘⇧B 输入镜像到所有 SSH 标签", "首连记录指纹，变更即告警"],
    size: "wide",
  },
  {
    id: "ai",
    icon: Bot,
    title: "AI 终端助手",
    description: "命令行直接敲白话，回车即翻译成命令；失败输出一键诊断，长输出自动摘要。",
    points: ["只读命令自动执行，写操作必须批准", "只读判定在本地，不信 AI 的声明"],
    size: "normal",
  },
  {
    id: "sftp",
    icon: FolderSync,
    title: "可视化 SFTP",
    description: "双栏文件管理，传输队列、速率与失败重试；拖文件进终端自动 rz 上传。",
    points: ["断点续传前比对 SHA-256", "内置 ZMODEM，无需装 lrzsz"],
    size: "normal",
  },
  {
    id: "sync",
    icon: ShieldCheck,
    title: "零信任云同步",
    description: "主机、密钥、片段、证书逐条端到端加密后增量同步。主密码只在本地派生密钥，平台零知识。",
    points: ["oplog 增量 + 实体级 LWW", "限权临时凭据，按用户前缀隔离"],
    size: "wide",
  },
  {
    id: "forward",
    icon: Cable,
    title: "端口转发与隧道",
    description: "本地 / 远程 / SOCKS5 动态三种转发，实时流量统计，应用启动时自动恢复已启用规则。",
    points: ["L · R · D 三类实转发", "每条规则独立的上下行计数"],
    size: "normal",
  },
  {
    id: "telemetry",
    icon: Gauge,
    title: "进程与资源遥测",
    description: "复用 SSH 会话每 5 秒采样 CPU、内存、磁盘、负载与网络，远端无需安装任何 agent。",
    points: ["零 agent，只走 SSH", "面向 Linux 远端"],
    size: "wide",
  },
];

// ---------------------------------------------------------------------------
// 工作流演示：日志流 + AI 一键排障
// ---------------------------------------------------------------------------

export interface LogLine {
  time: string;
  level: "INFO" | "WARN" | "ERROR";
  text: string;
}

export const LOG_STREAM: readonly LogLine[] = [
  { time: "14:02:11", level: "INFO", text: "app-api  GET /healthz 200 3ms" },
  { time: "14:02:12", level: "INFO", text: "app-api  POST /orders 201 48ms" },
  { time: "14:02:14", level: "WARN", text: "app-api  pool: 46/50 connections in use" },
  { time: "14:02:15", level: "WARN", text: "app-api  pool: 50/50 connections in use, waiting" },
  { time: "14:02:17", level: "ERROR", text: "app-api  timeout acquiring connection after 5000ms" },
  { time: "14:02:17", level: "ERROR", text: "nginx    upstream timed out (110) while reading response" },
  { time: "14:02:18", level: "ERROR", text: "app-api  POST /orders 504 5012ms" },
];

export interface DiagnosisStep {
  label: string;
  text: string;
}

/** 点「AI 一键排障」后依次出现 */
export const DIAGNOSIS: readonly DiagnosisStep[] = [
  { label: "现象", text: "/orders 出现 504，nginx 上游读超时。" },
  { label: "根因", text: "数据库连接池 50/50 耗尽，新请求等待 5 秒后超时 —— 504 只是连锁反应。" },
  { label: "佐证", text: "WARN 从 46/50 升到 50/50 后两秒内开始报错，时间线吻合。" },
  { label: "建议", text: "先查慢查询与未归还的连接；临时可调大连接池并缩短等待超时。" },
];

/** AI 建议的下一步命令（只读，会自动执行） */
export const DIAGNOSIS_COMMAND = "ss -tn state established '( dport = :5432 )' | wc -l";

// 双栏对比：把内网 HTTP 服务带到本机
export interface CompareRow {
  aspect: string;
  manual: string;
  kiteterm: string;
}

export const FORWARD_COMPARE: readonly CompareRow[] = [
  { aspect: "建立隧道", manual: "记住并手敲 ssh -L 8080:10.0.3.7:80 …", kiteterm: "表单填端口与目标，保存即生效" },
  { aspect: "断线之后", manual: "隧道跟着断，得重新敲一遍", kiteterm: "随会话自动重连，规则不丢" },
  { aspect: "重启电脑", manual: "全部重来", kiteterm: "启动时自动恢复已启用的规则" },
  { aspect: "看流量", manual: "无从得知", kiteterm: "每条规则实时上下行计数" },
  { aspect: "换台电脑", manual: "笔记里翻命令", kiteterm: "规则随端到端加密同步过来" },
];

// ---------------------------------------------------------------------------
// 性能基准
// ---------------------------------------------------------------------------

export interface BenchmarkMetric {
  id: string;
  label: string;
  unit: string;
  kiteterm: number;
  baseline: number;
  /** true：数值越小越好（启动时间、内存、延迟）;false：越大越好（帧率） */
  lowerIsBetter: boolean;
}

/**
 * ⚠️ 示意数据，尚未实测。对比对象是泛称的「典型 Electron 终端」，不指向任何具体产品。
 * 实测后替换数字，并把 BENCHMARK_IS_PLACEHOLDER 改为 false。
 */
export const BENCHMARK_IS_PLACEHOLDER = true;
export const BENCHMARK_BASELINE_LABEL = "典型 Electron 终端";

export const BENCHMARKS: readonly BenchmarkMetric[] = [
  { id: "startup", label: "冷启动", unit: "ms", kiteterm: 420, baseline: 1800, lowerIsBetter: true },
  { id: "memory", label: "空闲内存", unit: "MB", kiteterm: 95, baseline: 320, lowerIsBetter: true },
  { id: "fps", label: "大量输出时渲染帧率", unit: "fps", kiteterm: 60, baseline: 38, lowerIsBetter: false },
  { id: "latency", label: "输入延迟", unit: "ms", kiteterm: 6, baseline: 18, lowerIsBetter: true },
];

// ---------------------------------------------------------------------------
// 下载
// ---------------------------------------------------------------------------

export type PlatformId = "macos" | "windows";

export interface CommandBlock {
  title: string;
  /** 复制按钮复制的内容 */
  command: string;
}

export interface PlatformDownload {
  id: PlatformId;
  label: string;
  requirement: string;
  installerLabel: string;
  /** 从源码构建的步骤：安装包发布前这是唯一的获取方式 */
  commands: readonly CommandBlock[];
}

export const DOWNLOADS: readonly PlatformDownload[] = [
  {
    id: "macos",
    label: "macOS",
    requirement: "从源码构建需 Rust 工具链、Node.js 与 pnpm",
    installerLabel: "下载 .dmg",
    commands: [
      { title: "准备工具链", command: "xcode-select --install && curl https://sh.rustup.rs -sSf | sh" },
      {
        title: "克隆并构建",
        command: "git clone https://github.com/xltxb/KiteTerm.git && cd KiteTerm && pnpm install:desktop && pnpm tauri build",
      },
    ],
  },
  {
    id: "windows",
    label: "Windows",
    requirement: "Windows 10 / 11 · 依赖系统 WebView2(一般已自带)· 构建需 Rust、Node.js 与 pnpm",
    installerLabel: "下载 .msi",
    commands: [
      { title: "准备工具链", command: "winget install Rustlang.Rustup Microsoft.VisualStudio.2022.BuildTools" },
      {
        title: "克隆并构建",
        command: "git clone https://github.com/xltxb/KiteTerm.git; cd KiteTerm; pnpm install:desktop; pnpm tauri build",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQS: readonly FaqItem[] = [
  {
    q: "支持哪些系统?",
    a: "桌面端支持 macOS 与 Windows。连接的远端不限系统；其中服务器监控的采样命令面向 Linux 远端。",
  },
  {
    q: "我的密码和私钥会上传到云端吗?",
    a: "不会以明文上传。私钥在本机用设备密钥加密落库；开启云同步后，每条数据先在本地端到端加密再上传，主密码只在本地派生密钥，管理平台看到的只有密文。",
  },
  {
    q: "AI 助手会不会擅自执行危险命令?",
    a: "不会。AI 给出的命令先经本地的只读判定：白名单内的只读命令才会自动执行，其余一律停下等你批准，破坏性命令还要二次确认。AI 自称「只读」不作数。",
  },
  {
    q: "AI 用的是哪家模型?数据会发给谁?",
    a: "由你自己配置：Anthropic、OpenAI 兼容接口（含 DeepSeek、OpenRouter、vLLM 等）或本地 Ollama。请求直接从你的电脑发往你选的模型服务，密钥经设备密钥加密存在本地。",
  },
  {
    q: "不注册账号能用吗?",
    a: "能。终端、SFTP、转发、监控等本地功能无需账号；只有云同步需要登录管理平台。",
  },
  {
    q: "统一堡垒机与集中凭证网关什么时候提供?",
    a: "规划中。目标是让团队通过管理平台统一下发访问策略与凭据，客户端联动执行。上线前会在这里和仓库里同步进展。",
  },
];
