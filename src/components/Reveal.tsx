import type { ElementType, ReactNode } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** 同一组里依次错开出现的延迟（毫秒） */
  delay?: number;
  as?: ElementType;
}

/**
 * 滚动进入视口时上浮显现的包装。动效本身在 index.css 的 `.reveal` / `.is-visible`,
 * 减少动态效果时 CSS 直接取消过渡。
 */
export function Reveal({ children, className = "", delay = 0, as: Tag = "div" }: RevealProps) {
  const [ref, visible] = useScrollReveal<HTMLElement>();
  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
}
