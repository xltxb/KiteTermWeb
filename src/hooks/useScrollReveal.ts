import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";

// ---------------------------------------------------------------------------
// prefers-reduced-motion
// ---------------------------------------------------------------------------

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void): () => void {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/** 系统是否要求减少动态效果。用户在系统设置里切换时会实时更新 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

// ---------------------------------------------------------------------------
// 滚动显现
// ---------------------------------------------------------------------------

export interface ScrollRevealOptions {
  /** 元素露出多少比例算进入视口 */
  threshold?: number;
  /** 提前/推迟触发,同 IntersectionObserver 的 rootMargin */
  rootMargin?: string;
}

/**
 * 元素首次进入视口时返回 true,之后**保持 true** —— 滚出视口不会再藏起来,
 * 避免来回滚动时反复闪烁。
 *
 * 减少动态效果时直接视为已显现。不支持 IntersectionObserver 的环境同样直接显现,
 * 宁可没有动效也不能让内容一直透明。
 */
export function useScrollReveal<T extends Element>(
  options: ScrollRevealOptions = {},
): [RefObject<T | null>, boolean] {
  const { threshold = 0.15, rootMargin = "0px 0px -8% 0px" } = options;
  const ref = useRef<T | null>(null);
  const reduced = usePrefersReducedMotion();
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (seen || reduced) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen, reduced, threshold, rootMargin]);

  return [ref, seen || reduced];
}

// ---------------------------------------------------------------------------
// 数字递增
// ---------------------------------------------------------------------------

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

/**
 * `active` 变为 true 后,在 `duration` 毫秒内把数字从 0 平滑递增到 `target`,之后停在目标值。
 * 减少动态效果时直接返回目标值。
 */
export function useCountUp(target: number, active: boolean, duration = 1400): number {
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active || reduced) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setValue(Math.round(target * easeOutCubic(t)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, reduced, target, duration]);

  if (reduced) return target;
  return active ? value : 0;
}
