import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/useScrollReveal";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

const GRID = 56; // 网格间距（CSS 像素）
const LINK_DIST = 140; // 两个粒子相距小于它时连线
const GRID_PARALLAX = 0.12; // 网格随滚动的位移比例
const PARTICLE_PARALLAX = 0.05; // 粒子层随滚动的位移比例（比网格慢，产生纵深）

function createParticles(width: number, height: number): Particle[] {
  // 按面积取数量，小屏少一些，上限防止大屏卡顿
  const count = Math.min(90, Math.round((width * height) / 22000));
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    r: Math.random() * 1.4 + 0.6,
  }));
}

/**
 * 全屏固定的赛博网格 + 连线粒子背景，随滚动位置产生轻微视差。
 *
 * - 标签页不可见时暂停动画循环，回来再继续
 * - 减少动态效果时不跑动画：只在尺寸或滚动变化时重画一帧静态画面
 */
export function CyberCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frame = 0;
    let running = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = createParticles(width, height);
    };

    const draw = () => {
      const scroll = window.scrollY;
      ctx.clearRect(0, 0, width, height);

      // 网格：随滚动向上平移，取模让它无缝循环
      const gridOffset = (scroll * GRID_PARALLAX) % GRID;
      ctx.strokeStyle = "rgba(148, 163, 184, 0.06)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0.5; x <= width; x += GRID) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = -gridOffset + 0.5; y <= height; y += GRID) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // 粒子层：比网格移动得慢，纵向取模循环
      const pOffset = scroll * PARTICLE_PARALLAX;
      const pts = particles.map((p) => ({
        x: p.x,
        y: (((p.y - pOffset) % height) + height) % height,
        r: p.r,
      }));

      for (let i = 0; i < pts.length; i++) {
        const a = pts[i]!;
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j]!;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST * LINK_DIST) {
            const alpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.35;
            ctx.strokeStyle = `rgba(0, 229, 255, ${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const p of pts) {
        ctx.fillStyle = "rgba(125, 249, 255, 0.85)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = () => {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }
      draw();
      frame = requestAnimationFrame(step);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      frame = requestAnimationFrame(step);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const onVisibility = () => (document.hidden ? stop() : start());
    // 动画跑着的时候每帧都会读 scrollY，不需要再响应滚动；静态模式下才靠滚动触发重画
    const onScroll = () => {
      if (!running) draw();
    };
    const onResize = () => {
      resize();
      draw();
    };

    resize();
    draw();
    start();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10"
      aria-hidden="true"
    />
  );
}
