import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQS, type FaqItem } from "../data/kitetermData";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

/**
 * 折叠项。高度动画用 grid-template-rows 0fr → 1fr，不用量 DOM 高度，
 * 内容多少都能平滑展开；减少动态效果时 motion-reduce 直接取消过渡。
 */
function FaqEntry({ item, open, onToggle }: { item: FaqItem; open: boolean; onToggle: () => void }) {
  const id = useId();
  const panelId = `${id}-panel`;
  const buttonId = `${id}-button`;
  return (
    <div className={`glow-card transition-colors ${open ? "border-cyber/30" : ""}`}>
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-medium text-ink sm:px-6"
        >
          {item.q}
          <ChevronDown
            size={18}
            aria-hidden="true"
            className={`shrink-0 text-ink-faint transition-transform duration-300 motion-reduce:transition-none ${
              open ? "rotate-180 text-cyber" : ""
            }`}
          />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden" inert={!open}>
          <p className="px-5 pb-5 text-sm leading-relaxed text-ink-muted sm:px-6">{item.a}</p>
        </div>
      </div>
    </div>
  );
}

export function FaqSection() {
  // 一次只展开一项；默认展开第一项
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <section id="faq" className="relative px-4 py-12 sm:px-6 md:py-16">
      <SectionHeading eyebrow="FAQ" title="常见问题" />
      <div className="mx-auto max-w-3xl space-y-2.5">
        {FAQS.map((item, i) => (
          <Reveal key={item.q} delay={i * 60}>
            <FaqEntry item={item} open={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? null : i)} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
