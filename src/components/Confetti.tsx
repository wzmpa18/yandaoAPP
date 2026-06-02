import { useEffect, useRef } from 'react';

interface ConfettiProps {
  active: boolean;
  duration?: number;
}

const COLORS = ['#C9A574', '#7A9B71', '#C9553D', '#5B8FA8', '#A8C5BC', '#F7F1E4'];

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; color: string;
  rot: number; rotV: number;
  rect: boolean;
}

export const Confetti: React.FC<ConfettiProps> = ({ active, duration = 2200 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const particles: Particle[] = Array.from({ length: 70 }, () => ({
      x: Math.random() * W,
      y: -10 - Math.random() * 50,
      vx: (Math.random() - 0.5) * 5,
      vy: Math.random() * 2.5 + 2,
      size: Math.random() * 7 + 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rot: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 8,
      rect: Math.random() > 0.45,
    }));

    const t0 = Date.now();

    function draw() {
      if (!ctx || !canvas) return;
      const elapsed = Date.now() - t0;
      if (elapsed > duration) { ctx.clearRect(0, 0, canvas.width, canvas.height); return; }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = Math.max(0, 1 - elapsed / duration);

      for (const p of particles) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.rot += p.rotV;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        if (p.rect) {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      rafRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [active, duration]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      width={360} height={500}
      style={{
        position: 'fixed', top: '15%', left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none', zIndex: 9999, maxWidth: '100vw',
      }}
    />
  );
};
