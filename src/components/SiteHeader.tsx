import { useEffect, useState } from "react";
import { Download, Github, Menu, X } from "lucide-react";
import { NAV_LINKS, REPO_URL } from "../data/kitetermData";

/** 顶部导航：滚动后加深背景；小屏折叠成菜单 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 菜单打开时按 Esc 关闭
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || open ? "border-line bg-space/85 backdrop-blur-md" : "border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6" aria-label="主导航">
        <a href="#top" className="flex items-center gap-2.5 font-semibold text-ink">
          <img src="/img/icon-128.png" alt="" width={28} height={28} className="rounded-md" />
          <span className="tracking-tight">KiteTerm</span>
        </a>

        <ul className="hidden items-center gap-7 text-sm text-ink-muted md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="transition-colors hover:text-cyber">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm text-ink-muted hover:text-ink"
          >
            <Github size={16} aria-hidden="true" />
            GitHub
          </a>
          <a href="#download" className="btn-primary inline-flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-medium">
            <Download size={16} aria-hidden="true" />
            下载
          </a>
        </div>

        <button
          type="button"
          className="btn-ghost inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink md:hidden"
          aria-label={open ? "关闭菜单" : "打开菜单"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-line px-4 pb-4 md:hidden">
          <ul className="flex flex-col py-2">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="block rounded-lg px-2 py-3 text-ink-muted hover:bg-white/5 hover:text-ink"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#download"
            className="btn-primary flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-medium"
            onClick={() => setOpen(false)}
          >
            <Download size={16} aria-hidden="true" />
            下载 KiteTerm
          </a>
        </div>
      )}
    </header>
  );
}
