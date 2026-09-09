import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery.js';
import './PixelField.css';

const CELL = 5; // px per pixel cell
const GAP = 2; // px between cells
const STRIDE = CELL + GAP;
const DENSITY = 0.055; // fraction of grid positions that hold a cell
const POINTER_RADIUS = 108; // px within which cells brighten

/**
 * Animated pixel field used as the hero backdrop.
 *
 * Design constraints that shaped this:
 *
 * - A full grid at this cell size would be tens of thousands of fillRect calls
 *   per frame. Instead a sparse subset of positions is seeded once on resize,
 *   which keeps the per-frame cost to a few hundred draws.
 * - The loop is suspended when the hero scrolls out of view and when the tab is
 *   hidden, so it never burns battery behind content or in a background tab.
 * - Under prefers-reduced-motion a single static frame is painted and no
 *   animation loop starts at all.
 */
export function PixelField({ className }) {
  const canvasRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return undefined;

    let cells = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let running = false;
    let visible = true;
    const pointer = { x: -9999, y: -9999, active: false };

    // Capping DPR at 2 avoids quadrupling the fill cost on 3x phone displays
    // for a difference nobody can see at this cell size.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function seed() {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.ceil(width / STRIDE);
      const rows = Math.ceil(height / STRIDE);
      const next = [];

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          if (Math.random() > DENSITY) continue;

          // Cells fade out toward the bottom of the hero so the field never
          // competes with the headline sitting over it.
          const depth = 1 - row / rows;

          next.push({
            x: col * STRIDE,
            y: row * STRIDE,
            base: 0.06 + Math.random() * 0.22 * depth,
            // Warm cells pick up the ember end of the accent ramp.
            warm: Math.random() < 0.22,
            phase: Math.random() * Math.PI * 2,
            speed: 0.0004 + Math.random() * 0.0011,
          });
        }
      }

      cells = next;
    }

    function draw(time) {
      ctx.clearRect(0, 0, width, height);

      for (const cell of cells) {
        // Slow ambient breathing, offset per cell so the field never pulses in
        // unison.
        let alpha = cell.base * (0.55 + 0.45 * Math.sin(time * cell.speed + cell.phase));

        if (pointer.active) {
          const dx = cell.x - pointer.x;
          const dy = cell.y - pointer.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < POINTER_RADIUS) {
            const falloff = 1 - distance / POINTER_RADIUS;
            alpha += falloff * falloff * 0.85;
          }
        }

        if (alpha <= 0.02) continue;

        ctx.fillStyle = cell.warm
          ? `rgba(255, 138, 61, ${Math.min(alpha, 1)})`
          : `rgba(255, 51, 69, ${Math.min(alpha, 1)})`;
        ctx.fillRect(cell.x, cell.y, CELL, CELL);
      }
    }

    function loop(time) {
      draw(time);
      frame = requestAnimationFrame(loop);
    }

    function start() {
      if (running || reducedMotion) return;
      running = true;
      frame = requestAnimationFrame(loop);
    }

    function stop() {
      running = false;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    }

    function onPointerMove(event) {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    }

    function onPointerLeave() {
      pointer.active = false;
    }

    function onResize() {
      seed();
      if (!running) draw(performance.now());
    }

    function onVisibilityChange() {
      visible = !document.hidden;
      if (visible && !reducedMotion) start();
      else stop();
    }

    seed();

    if (reducedMotion) {
      // One static frame, no loop.
      draw(0);
    } else {
      // Only animate while the hero is actually on screen.
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && visible) start();
          else stop();
        },
        { threshold: 0 },
      );
      observer.observe(canvas);

      // Fine pointers only: on touch devices the halo would sit wherever the
      // last tap landed, which reads as a rendering bug.
      const finePointer = window.matchMedia('(pointer: fine)').matches;
      if (finePointer) {
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('pointerleave', onPointerLeave);
      }

      document.addEventListener('visibilitychange', onVisibilityChange);
      window.addEventListener('resize', onResize);

      return () => {
        stop();
        observer.disconnect();
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerleave', onPointerLeave);
        document.removeEventListener('visibilitychange', onVisibilityChange);
        window.removeEventListener('resize', onResize);
      };
    }

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className={`pixel-field ${className ?? ''}`} aria-hidden="true" />;
}

export default PixelField;
