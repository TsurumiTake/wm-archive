import { useEffect, useRef } from "react";

interface AtmosphereCanvasProps {
  density?: number;
  speed?: number;
  opacity?: number;
}

type ParticleKind = "dot" | "rain";

interface Particle {
  kind: ParticleKind;
  depth: 0 | 1 | 2;
  x: number;
  y: number;
  size: number;
  length: number;
  speed: number;
  drift: number;
  phase: number;
  alpha: number;
}

const FALLBACK_GREEN = "0, 110, 78";
const FALLBACK_BLUE = "43, 153, 196";
const FALLBACK_MINT = "183, 207, 197";

const DEPTH_SCROLL = [0.25, 0.55, 0.9] as const;
const DEPTH_SPEED = [0.22, 0.42, 1] as const;
const DEPTH_ALPHA = [0.06, 0.1, 0.14] as const;

function readPalette() {
  if (typeof window === "undefined") {
    return { green: FALLBACK_GREEN, blue: FALLBACK_BLUE, mint: FALLBACK_MINT };
  }

  const styles = getComputedStyle(document.documentElement);
  const toRgb = (value: string, fallback: string) => {
    const hex = value.trim().replace("#", "");
    if (!/^[0-9a-f]{6}$/i.test(hex)) return fallback;
    const number = Number.parseInt(hex, 16);
    return `${(number >> 16) & 255}, ${(number >> 8) & 255}, ${number & 255}`;
  };

  return {
    green: toRgb(styles.getPropertyValue("--green"), FALLBACK_GREEN),
    blue: toRgb(styles.getPropertyValue("--blue"), FALLBACK_BLUE),
    mint: FALLBACK_MINT
  };
}

function createParticles(width: number, height: number, density: number, opacity: number): Particle[] {
  const mobile = width < 768;
  const dotCount = Math.round((mobile ? 120 : 340) * density);
  const rainCount = Math.round((mobile ? 100 : 140) * density);
  const particles: Particle[] = [];

  for (let index = 0; index < dotCount; index += 1) {
    const depth = (index % 5 === 0 ? 1 : 0) as 0 | 1;
    particles.push({
      kind: "dot",
      depth,
      x: Math.random() * width,
      y: Math.random() * height,
      size: 0.7 + Math.random() * (depth === 0 ? 1.4 : 2.1),
      length: 0,
      speed: 5 + Math.random() * 10,
      drift: 0.25 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
      alpha: DEPTH_ALPHA[depth] * (0.65 + Math.random() * 0.7) * opacity
    });
  }

  for (let index = 0; index < rainCount; index += 1) {
    particles.push({
      kind: "rain",
      depth: 2,
      x: Math.random() * width,
      y: Math.random() * height,
      size: 0,
      length: 12 + Math.random() * 42,
      speed: 24 + Math.random() * 38,
      drift: 0,
      phase: Math.random() * Math.PI * 2,
      alpha: DEPTH_ALPHA[2] * (0.7 + Math.random() * 0.75) * opacity
    });
  }

  return particles;
}

export function AtmosphereCanvas({ density = 1, speed = 1, opacity = 0.8 }: AtmosphereCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const palette = readPalette();
    let particles: Particle[] = [];
    let frame = 0;
    let width = 0;
    let height = 0;
    let scrollTarget = window.scrollY;
    let scrollCurrent = window.scrollY;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = createParticles(width, height, density, opacity);
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      scrollCurrent += (scrollTarget - scrollCurrent) * 0.08;
      const seconds = (time / 1000) * speed;

      particles.forEach((particle) => {
        const depthSpeed = DEPTH_SPEED[particle.depth];
        const scrollOffset = scrollCurrent * DEPTH_SCROLL[particle.depth];

        if (particle.kind === "dot") {
          const driftX = Math.sin(seconds * particle.drift + particle.phase) * (5 + particle.depth * 6);
          const x = ((particle.x + driftX) % width + width) % width;
          const y = ((particle.y + seconds * particle.speed * depthSpeed + scrollOffset) % height + height) % height;
          context.globalAlpha = particle.alpha;
          context.fillStyle = `rgb(${particle.depth === 0 ? palette.mint : palette.blue})`;
          context.beginPath();
          context.arc(x, y, particle.size, 0, Math.PI * 2);
          context.fill();
          return;
        }

        const rainY = ((particle.y + seconds * particle.speed + scrollOffset) % (height + particle.length)) - particle.length;
        const slant = Math.sin(particle.phase) * 2.5;
        context.globalAlpha = particle.alpha;
        context.strokeStyle = `rgb(${particle.depth === 2 ? palette.green : palette.blue})`;
        context.lineWidth = 0.7 + (particle.phase % 0.9);
        context.beginPath();
        context.moveTo(particle.x, rainY);
        context.lineTo(particle.x + slant, rainY + particle.length);
        context.stroke();
      });

      context.globalAlpha = 1;
      if (!reducedMotion) frame = window.requestAnimationFrame(draw);
    };

    const onScroll = () => {
      scrollTarget = window.scrollY;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    window.addEventListener("scroll", onScroll, { passive: true });
    resize();
    frame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
    };
  }, [density, opacity, speed]);

  return <canvas ref={canvasRef} className="atmosphere-canvas" aria-hidden="true" />;
}