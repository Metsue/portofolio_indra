import { useContext, useEffect, useRef, useState } from "react";
import { MotionContext } from "./Effects";
export function DynamicInteractions() {
  const progress = useRef<HTMLDivElement>(null),
    aura = useRef<HTMLDivElement>(null);
  const { enabled } = useContext(MotionContext);
  useEffect(() => {
    let frame = 0;
    const scroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const h = document.documentElement.scrollHeight - innerHeight;
        progress.current?.style.setProperty(
          "transform",
          `scaleX(${h > 0 ? scrollY / h : 0})`,
        );
      });
    };
    const move = (e: PointerEvent) => {
      if (!enabled || e.pointerType !== "mouse") return;
      aura.current?.style.setProperty(
        "transform",
        `translate(${e.clientX}px,${e.clientY}px)`,
      );
      const card = (e.target as HTMLElement).closest<HTMLElement>(
        ".project-card,.stat-card,.tech-card,.certificate-card",
      );
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
        if (card.classList.contains("project-card")) {
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          card.style.setProperty("--tilt-x", `${-y * 5}deg`);
          card.style.setProperty("--tilt-y", `${x * 5}deg`);
        }
      }
    };
    const leave = (e: PointerEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>(
        ".project-card",
      );
      if (
        card &&
        !(e.relatedTarget instanceof Node && card.contains(e.relatedTarget))
      ) {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      }
    };
    addEventListener("scroll", scroll, { passive: true });
    addEventListener("pointermove", move, { passive: true });
    addEventListener("pointerout", leave, { passive: true });
    scroll();
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", scroll);
      removeEventListener("pointermove", move);
      removeEventListener("pointerout", leave);
    };
  }, [enabled]);
  return (
    <>
      <div ref={progress} className="reading-progress" aria-hidden="true" />
      {enabled && <div ref={aura} className="cursor-aura" aria-hidden="true" />}
    </>
  );
}
export function CountUp({ value }: { value: number }) {
  const node = useRef<HTMLSpanElement>(null),
    [count, setCount] = useState(0);
  const { enabled } = useContext(MotionContext);
  useEffect(() => {
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / 1100);
          setCount(Math.round(value * (1 - (1 - p) ** 3)));
          if (p < 1) frame = requestAnimationFrame(tick);
        };
        if (enabled) frame = requestAnimationFrame(tick);
        else setCount(value);
      },
      { threshold: 0.5 },
    );
    if (node.current) observer.observe(node.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, enabled]);
  return <span ref={node}>{String(count).padStart(2, "0")}</span>;
}
export function SkillsRibbon() {
  return (
    <div
      className="skills-ribbon"
      aria-label="Design, development, education, and curiosity"
    >
      <div aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span key={i}>
            CREATIVE DEVELOPMENT <b>✦</b> PURPOSEFUL DESIGN <b>✦</b> ALWAYS
            EXPLORING <b>✦</b>
          </span>
        ))}
      </div>
    </div>
  );
}
