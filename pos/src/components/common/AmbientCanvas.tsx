import { useEffect, useRef } from "react";

/**
 * Subtle ambient backdrop: slow-drifting ember particles on a canvas.
 * Intentionally lightweight (no WebGL) so the POS stays fast, and it pauses
 * when the tab is hidden or the user prefers reduced motion.
 */
export function AmbientCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const particles = Array.from({ length: 46 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.9,
      vx: (Math.random() - 0.5) * 0.00022,
      vy: -(0.00012 + Math.random() * 0.00028),
      a: 0.12 + Math.random() * 0.35,
      phase: i,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        if (!reduced) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < -0.05) p.y = 1.05;
          if (p.x < -0.05) p.x = 1.05;
          if (p.x > 1.05) p.x = -0.05;
        }
        const twinkle = 0.65 + 0.35 * Math.sin(t / 1400 + p.phase);
        ctx.beginPath();
        ctx.arc(p.x * width, p.y * height, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 158, 66, ${p.a * twinkle})`;
        ctx.fill();
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
