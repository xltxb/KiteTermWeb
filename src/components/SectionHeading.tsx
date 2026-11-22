import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
}

/** 各区块统一的小标题 + 大标题 + 说明 */
export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <Reveal className="mx-auto mb-8 max-w-3xl text-center md:mb-10">
      <p className="mb-2 font-mono text-xs tracking-[0.3em] text-cyber uppercase">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-balance text-ink md:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-base leading-relaxed text-balance text-ink-muted">{description}</p>}
    </Reveal>
  );
}
