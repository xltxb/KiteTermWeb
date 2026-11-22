import { Github } from "lucide-react";
import { BRAND_ICON, NAV_LINKS, REPO_URL } from "../data/kitetermData";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5 font-semibold text-ink">
            <img src={BRAND_ICON} alt="" width={24} height={24} className="rounded-md" />
            KiteTerm
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-faint">
            一个终端，装下整套远程工作台。面向 Windows 与 macOS 的桌面 SSH 客户端。
          </p>
        </div>
        <nav aria-label="页脚导航" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-cyber">
              {l.label}
            </a>
          ))}
          <a href={REPO_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-cyber">
            <Github size={15} aria-hidden="true" />
            GitHub
          </a>
        </nav>
      </div>
      <p className="mx-auto mt-8 max-w-6xl text-xs text-ink-faint">© {year} KiteTerm</p>
    </footer>
  );
}
