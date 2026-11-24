import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { profile } from "../data/profile";
export const MotionContext = createContext({ enabled: true, toggle: () => {} });
export function MotionProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(
    () => !matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    document.documentElement.dataset.motion = String(enabled);
  }, [enabled]);
  useEffect(() => {
    const q = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setEnabled(!q.matches);
    q.addEventListener("change", change);
    return () => q.removeEventListener("change", change);
  }, []);
  return (
    <MotionContext.Provider
      value={{ enabled, toggle: () => setEnabled((v) => !v) }}
    >
      {children}
    </MotionContext.Provider>
  );
}
export function CosmicBackground() {
  const ref = useRef<HTMLCanvasElement>(null);
  const { enabled } = useContext(MotionContext);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let frame = 0;
    let width = innerWidth;
    let height = innerHeight;
    let stars: { x: number; y: number; r: number; p: number }[] = [];
    const resize = () => {
      width = innerWidth;
      height = innerHeight;
      const ratio = Math.min(devicePixelRatio, 1.5);
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      stars = Array.from({ length: width < 600 ? 48 : 100 }, (_, i) => ({
        x: (((i * 7919) % 997) / 997) * width,
        y: (((i * 4391) % 991) / 991) * height,
        r: i % 9 === 0 ? 1.3 : 0.6,
        p: i * 1.8,
      }));
      draw(0);
    };
    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      stars.forEach((s) => {
        ctx.globalAlpha = 0.18 + (Math.sin(t * 0.0004 + s.p) + 1) * 0.2;
        ctx.fillStyle = "#e8dcff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };
    const tick = (t: number) => {
      if (!document.hidden) draw(t);
      frame = requestAnimationFrame(tick);
    };
    resize();
    if (enabled) frame = requestAnimationFrame(tick);
    addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("resize", resize);
    };
  }, [enabled]);
  return (
    <div className="cosmos" aria-hidden="true">
      <canvas ref={ref} />
      <span className="meteor meteor-one" />
      <span className="meteor meteor-two" />
    </div>
  );
}
export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let cancelled = false;
    let done = 0;
    const finish = () => {
      done++;
      if (!cancelled) setProgress(Math.round((done / 2) * 100));
    };
    const photos = [profile.heroImage].map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = img.onerror = () => {
            finish();
            resolve();
          };
          img.src = src;
        }),
    );
    Promise.all([...photos, document.fonts.ready.then(finish)]).then(() => {
      if (!cancelled) setHidden(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return (
    <div className={`preloader ${hidden ? "loaded" : ""}`} aria-hidden={hidden}>
      <div>
        <strong>
          {progress}
          <span>%</span>
        </strong>
        <div className="loading-track">
          <i style={{ width: `${progress}%` }} />
        </div>
        <p>Memuat pengalaman…</p>
      </div>
    </div>
  );
}
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div className={`reveal ${className}`} ref={ref}>
      {children}
    </div>
  );
}
