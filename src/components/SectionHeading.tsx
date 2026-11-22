import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
}

/** 各区块统一的小标题 + 大标题 + 说明 */
export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <Reveal className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
      <p className="mb-3 font-mono text-xs tracking-[0.3em] text-cyber uppercase">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-relaxed text-ink-muted">{description}</p>}
    </Reveal>
  );
}
