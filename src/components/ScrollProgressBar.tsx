import { useEffect, useRef } from "react";

/**
 * 页面顶部的赛博青渐变滚动进度条。
 *
 * 直接改 DOM 的 transform 而不走 React state：滚动事件一秒几十次，每次都重渲染没必要。
 * 一帧最多更新一次（requestAnimationFrame 合并）。
 */
export function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${ratio})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent" aria-hidden="true">
      <div
        ref={barRef}
        className="h-full origin-left bg-gradient-to-r from-cyber via-cyber to-electric shadow-[0_0_12px_rgb(0_229_255/0.8)]"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
