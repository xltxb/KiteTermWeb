# KiteTerm 官网

[KiteTerm](https://github.com/xltxb/KiteTerm) 的产品官网,React 19 + TypeScript + Vite + Tailwind CSS + Lucide React。

## 结构

```
index.html                         Vite 入口
public/                            原样复制到产物根目录
  CNAME                            自定义域名 www.kiteterm.com
  img/                             品牌图标(取自 KiteTerm 仓库 desktop/src-tauri/icons/)
src/
  data/kitetermData.ts             全部文案与数据:指标、Bento 卡片、性能基准、下载命令、FAQ
  hooks/useScrollReveal.ts         滚动显现、数字递增、prefers-reduced-motion
  components/
    ScrollProgressBar.tsx          顶部滚动进度条
    CyberCanvas.tsx                网格 + 连线粒子背景,随滚动视差
    SiteHeader.tsx / SiteFooter.tsx
    HeroSection.tsx                首屏 + 可切换标签的终端预览(打字机输出)
    MetricsBar.tsx                 核心指标,进入视口时数字递增
    BentoFeatures.tsx              核心能力 Bento 网格
    WorkflowShowcase.tsx           日志流 + AI 一键排障演练;端口转发对比
    BenchmarkSection.tsx           性能基准对比
    DownloadSection.tsx            macOS / Windows 切换,一键复制命令
    FaqSection.tsx                 折叠问答
    Reveal.tsx / SectionHeading.tsx  通用包装
  index.css                        设计令牌(@theme)与光效、动效样式
```

## 开发

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm typecheck    # tsc 严格模式
pnpm lint         # ESLint,含 react-hooks 依赖检查,0 警告
pnpm build        # 产物在 dist/
pnpm preview      # 预览构建产物
```

## 部署

`.github/workflows/deploy.yml` 在推送到 main 时构建并发布到 GitHub Pages。
**首次启用**:仓库 Settings → Pages → Source 改为「GitHub Actions」(原先是直接发布分支根目录,
那种方式在改为 Vite 之后不再可用)。

## 维护提示

- 所有文案与数字都在 `src/data/kitetermData.ts`,组件只负责呈现。
- 功能描述以 KiteTerm 仓库 README 的「功能对照(PRD F1–F10)」为准,产品有变更时同步更新。
- 发布安装包后把 `INSTALLERS_RELEASED` 改为 `true`,下载按钮会去掉「尚未发布」提示。
- **性能基准目前是示意数据**:拿到实测结果后替换 `BENCHMARKS` 的数字,并把
  `BENCHMARK_IS_PLACEHOLDER` 改为 `false`,页面上的「示意数据」提示会随之消失。
- 统一堡垒机与集中凭证网关尚在规划中,FAQ 里如实写明;上线后再补进功能区。
