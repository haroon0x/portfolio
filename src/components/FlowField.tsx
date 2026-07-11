import React, { useEffect, useRef } from 'react';

/**
 * FlowField — a generative background.
 *
 * Fine particles drift along a simplex-noise vector field, leaving fading
 * trails — like watching data diffuse through latent space. Monochrome with a
 * whisper of accent on a tiny fraction of particles for "intelligent" sparks.
 *
 * - No per-frame React state; entirely on a canvas.
 * - DPR-aware (capped at 2), pauses on tab-hide, cleans up on unmount.
 * - Reduced motion → renders a single static frame.
 */

/* ── Compact 2D simplex noise (Gustavson, public-domain algorithm) ────────── */

class SimplexNoise {
  private perm = new Uint8Array(512);
  private permMod12 = new Uint8Array(512);
  private static readonly grad3 = new Float32Array([
    1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0,
    1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1,
    0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1,
  ]);

  constructor(seed = 1337) {
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    let s = seed >>> 0 || 1;
    const rand = () => {
      // simple LCG PRNG, deterministic from seed
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }
    for (let i = 0; i < 512; i++) {
      this.perm[i] = p[i & 255];
      this.permMod12[i] = this.perm[i] % 12;
    }
  }

  noise2D(xin: number, yin: number): number {
    const F2 = 0.5 * (Math.sqrt(3) - 1);
    const G2 = (3 - Math.sqrt(3)) / 6;
    let n0 = 0, n1 = 0, n2 = 0;
    const s = (xin + yin) * F2;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const t = (i + j) * G2;
    const X0 = i - t;
    const Y0 = j - t;
    const x0 = xin - X0;
    const y0 = yin - Y0;
    let i1: number, j1: number;
    if (x0 > y0) { i1 = 1; j1 = 0; } else { i1 = 0; j1 = 1; }
    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2;
    const y2 = y0 - 1 + 2 * G2;
    const ii = i & 255;
    const jj = j & 255;
    const gi0 = this.permMod12[ii + this.perm[jj]];
    const gi1 = this.permMod12[ii + i1 + this.perm[jj + j1]];
    const gi2 = this.permMod12[ii + 1 + this.perm[jj + 1]];
    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 >= 0) { t0 *= t0; n0 = t0 * t0 * (SimplexNoise.grad3[gi0 * 3] * x0 + SimplexNoise.grad3[gi0 * 3 + 1] * y0); }
    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 >= 0) { t1 *= t1; n1 = t1 * t1 * (SimplexNoise.grad3[gi1 * 3] * x1 + SimplexNoise.grad3[gi1 * 3 + 1] * y1); }
    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 >= 0) { t2 *= t2; n2 = t2 * t2 * (SimplexNoise.grad3[gi2 * 3] * x2 + SimplexNoise.grad3[gi2 * 3 + 1] * y2); }
    return 70 * (n0 + n1 + n2);
  }
}

/* ── Component ────────────────────────────────────────────────────────────── */

const FlowField: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const noise = new SimplexNoise(Math.floor(Math.random() * 1e6));

    const BG = '#08080b';
    let width = 0;
    let height = 0;
    let dpr = 1;

    interface Particle { x: number; y: number; life: number; maxLife: number; accent: boolean; }

    let particles: Particle[] = [];
    // Scale field resolution to viewport so the field reads consistently.
    let fieldScale = 0.0016;
    let rafId = 0;
    let running = true;

    const particleCount = () => {
      // density scales with area, capped for perf
      const area = width * height;
      return Math.min(620, Math.max(180, Math.floor(area / 2600)));
    };

    const seedParticle = (p: Particle, fresh = false) => {
      p.x = Math.random() * width;
      p.y = Math.random() * height;
      p.maxLife = 120 + Math.random() * 220;
      p.life = fresh ? 0 : Math.random() * p.maxLife;
      p.accent = Math.random() < 0.04; // ~4% whisper of accent
    };

    const initParticles = () => {
      const count = particleCount();
      particles = new Array(count);
      for (let i = 0; i < count; i++) {
        particles[i] = { x: 0, y: 0, life: 0, maxLife: 0, accent: false };
        seedParticle(particles[i]);
      }
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fieldScale = Math.max(0.0011, 1.6 / Math.max(width, 960));
      // repaint background fully on resize
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, width, height);
      initParticles();
    };

    const draw = () => {
      // Fade existing trails rather than clearing → ghosting streamlines.
      ctx.fillStyle = 'rgba(8, 8, 11, 0.055)';
      ctx.fillRect(0, 0, width, height);

      const step = fieldScale;
      const zoff = (performance.now() * 0.000035) % 1000; // glacial drift of the field over time

      for (const p of particles) {
        const angle = noise.noise2D(p.x * step, p.y * step + zoff) * Math.PI * 2;
        const speed = 0.55;
        p.x += Math.cos(angle) * speed;
        p.y += Math.sin(angle) * speed;
        p.life += 1;

        // lifecycle
        if (p.life > p.maxLife || p.x < -10 || p.x > width + 10 || p.y < -10 || p.y > height + 10) {
          seedParticle(p, true);
          continue;
        }

        // fade in then out over life
        const t = p.life / p.maxLife;
        const alpha = (Math.sin(t * Math.PI)) * 0.5; // 0..0.5
        if (alpha <= 0.01) continue;

        ctx.beginPath();
        if (p.accent) {
          ctx.fillStyle = `rgba(129, 140, 248, ${alpha * 0.9})`; // accent-soft
        } else {
          ctx.fillStyle = `rgba(232, 232, 240, ${alpha * 0.55})`; // off-white
        }
        ctx.arc(p.x, p.y, p.accent ? 1.25 : 0.9, 0, Math.PI * 2);
        ctx.fill();
      }

      if (running) rafId = requestAnimationFrame(draw);
    };

    const start = () => {
      running = true;
      rafId = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(rafId);
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (!prefersReducedMotion) start();
    };

    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);

    if (prefersReducedMotion) {
      // single static frame
      draw();
      running = false;
    } else {
      start();
    }

    return () => {
      stop();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-background text-text-primary overflow-hidden">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      />
      {/* soft vignette so content remains legible over the field */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden="true"
        style={{ background: 'radial-gradient(ellipse 90% 90% at 30% 35%, rgba(8,8,11,0.35) 0%, rgba(8,8,11,0.05) 45%, rgba(8,8,11,0.55) 100%)' }}
      />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};

export default FlowField;
