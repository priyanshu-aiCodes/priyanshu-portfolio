"use client";

/**
 * ParticleBackground — animated HTML5 canvas with connected particle dots.
 *
 * Renders 80 particles that drift around the canvas and draw connecting
 * lines between any pair within `connectionDistance` pixels.
 * The entire canvas renders at a reduced opacity so it never distracts
 * from foreground content.
 *
 * Safety:
 *  - Wrapped in try/catch: silently unmounts if canvas context is unavailable.
 *  - Only mounted when `particlesEnabled: true` in siteConfig.
 *  - aria-hidden so screen readers ignore it.
 *  - pointer-events: none so it never intercepts clicks.
 */

import React, { useEffect, useRef } from "react";

interface ParticleBackgroundProps {
  particleCount?: number;       // default 40 (reduced from 80)
  connectionDistance?: number;  // default 120 (reduced from 150)
  opacity?: number;             // default 0.15
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export default function ParticleBackground({
  particleCount = 40,
  connectionDistance = 120,
  opacity = 0.15,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = canvas.getContext("2d", { alpha: true });
    } catch {
      return; // canvas not supported — unmount silently
    }
    if (!ctx) return;

    // Throttle to ~30fps for better performance on mid-range laptops
    const TARGET_FPS = 30;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;
    let lastTime = 0;

    // Size canvas to viewport (use devicePixelRatio cap for performance)
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    // Debounce resize to avoid thrashing
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    };
    window.addEventListener("resize", onResize, { passive: true });

    // Initialise particles
    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x:      Math.random() * canvas.width,
      y:      Math.random() * canvas.height,
      vx:     (Math.random() - 0.5) * 0.4,   // slightly slower
      vy:     (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.2 + 0.4,
    }));

    // Pre-compute squared distance threshold to avoid Math.sqrt in inner loop
    const connDistSq = connectionDistance * connectionDistance;

    let animId: number;

    const draw = (timestamp: number) => {
      animId = requestAnimationFrame(draw);

      // Throttle frame rate
      if (timestamp - lastTime < FRAME_INTERVAL) return;
      lastTime = timestamp;

      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Move & wrap particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }

      // Batch connections into a single path per alpha bucket (reduces ctx state changes)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < connDistSq) {
            const alpha = (1 - Math.sqrt(distSq) / connectionDistance) * 0.4;
            ctx.strokeStyle = `rgba(108,99,255,${alpha.toFixed(2)})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw all particles in one pass
      ctx.fillStyle = "rgba(108,99,255,0.6)";
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    animId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
      cancelAnimationFrame(animId);
    };
  }, [particleCount, connectionDistance]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
