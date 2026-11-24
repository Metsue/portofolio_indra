import {
  useContext,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type KeyboardEvent,
} from "react";
import {
  Code2,
  Instagram,
  Move,
  Rotate3D,
  RotateCcw,
  Fingerprint,
} from "lucide-react";
import { profile } from "../data/profile";
import { MotionContext } from "./Effects";

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));
export function HangingIdCard() {
  const stage = useRef<HTMLDivElement>(null),
    holder = useRef<HTMLDivElement>(null),
    rope = useRef<SVGPathElement>(null),
    sheen = useRef<HTMLDivElement>(null);
  const { enabled } = useContext(MotionContext);
  const [mode, setMode] = useState<"drag" | "rotate">("drag");
  const [held, setHeld] = useState(false);
  const geometry = useRef({ w: 500, h: 800, scale: 1, restX: 260, restY: 430 });
  const body = useRef({
    x: 260,
    y: 430,
    z: 9,
    yaw: 0,
    pitch: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    spin: 0,
  });
  const aim = useRef({ x: 260, y: 430, yaw: 0, pitch: 0 });
  const drag = useRef<null | {
    id: number;
    startX: number;
    startY: number;
    x: number;
    y: number;
    yaw: number;
    pitch: number;
    rotate: boolean;
  }>(null);
  const wake = useRef(() => {});
  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    let disposed = false;
    let frame = 0,
      previous = 0;
    let visible = true;
    const resize = () => {
      if (disposed || !element.isConnected) return;
      const r = element.getBoundingClientRect();
      const scale = Math.min(1, r.width / 420);
      geometry.current = {
        w: r.width,
        h: r.height,
        scale,
        restX: r.width * 0.52,
        restY: Math.min(
          r.height * (r.width < 420 ? 0.43 : 0.49),
          r.height - (435 * scale) / 2 - 75,
        ),
      };
      body.current.x = geometry.current.restX;
      body.current.y = geometry.current.restY;
      wake.current();
    };
    const draw = (time: number) => {
      frame = 0;
      if (disposed || !holder.current) return;
      const g = geometry.current,
        b = body.current,
        a = aim.current;
      const dt = Math.min(1.5, Math.max(0.25, (time - previous) / 16.667 || 1));
      previous = time;
      const dragging = drag.current;
      if (dragging) {
        const oldX = b.x,
          oldY = b.y;
        b.x += (a.x - b.x) * 0.48;
        b.y += (a.y - b.y) * 0.48;
        b.vx = clamp(b.x - oldX, -18, 18);
        b.vy = clamp(b.y - oldY, -18, 18);
        if (dragging.rotate) {
          b.spin = (a.yaw - b.yaw) * 0.35;
          b.yaw += b.spin;
          b.pitch += (a.pitch - b.pitch) * 0.4;
        } else {
          b.z += (clamp((b.x - g.restX) * 0.12, -25, 25) - b.z) * 0.12;
        }
      } else if (enabled) {
        const restX = g.restX + Math.sin(time * 0.00065) * 12;
        b.vx += (restX - b.x) * 0.015 * dt;
        b.vy += (g.restY + Math.sin(time * 0.0009) * 5 - b.y) * 0.021 * dt;
        b.vx *= Math.pow(0.965, dt);
        b.vy *= Math.pow(0.91, dt);
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.vz += (8 + (b.x - g.restX) * 0.13 - b.z) * 0.018 * dt;
        b.vz *= Math.pow(0.93, dt);
        b.z += b.vz * dt;
        b.yaw += b.spin * dt;
        b.spin *= Math.pow(0.966, dt);
        b.pitch *= Math.pow(0.94, dt);
      } else {
        b.x = g.restX;
        b.y = g.restY;
        b.z = 8;
        b.vx = b.vy = b.vz = b.spin = 0;
        b.pitch = 0;
      }
      const half = 155 * g.scale;
      b.x = clamp(b.x, half * 0.65, g.w - half * 0.65);
      b.y = clamp(b.y, 230 * g.scale, g.h - 220 * g.scale - 48);
      if (holder.current) {
        holder.current.style.left = `${b.x}px`;
        holder.current.style.top = `${b.y}px`;
        holder.current.style.transform = `translate(-50%,-50%) scale(${g.scale}) rotateZ(${b.z}deg) rotateY(${b.yaw}deg) rotateX(${b.pitch}deg)`;
        holder.current.dataset.x = b.x.toFixed(1);
        holder.current.dataset.y = b.y.toFixed(1);
        holder.current.dataset.yaw = b.yaw.toFixed(1);
      }
      const rad = (b.z * Math.PI) / 180,
        attachX = b.x + Math.sin(rad) * 232 * g.scale,
        attachY = b.y - Math.cos(rad) * 232 * g.scale;
      const anchorX = g.w * 0.56,
        anchorY = -20;
      const sway = enabled
        ? Math.sin(time * 0.002) * Math.min(22, Math.abs(b.vx) * 8 + 4)
        : 0;
      const path = `M ${anchorX} ${anchorY} C ${anchorX + b.vx * 3 + sway} ${attachY * 0.32}, ${attachX - b.vx * 4 - sway} ${attachY * 0.68}, ${attachX} ${attachY}`;
      rope.current?.setAttribute("d", path);
      if (sheen.current)
        sheen.current.style.background = `linear-gradient(${110 + b.yaw * 0.15}deg,transparent 25%,#ffffff30 48%,transparent 65%)`;
      if (visible && !document.hidden && (enabled || dragging))
        frame = requestAnimationFrame(draw);
    };
    wake.current = () => {
      if (!disposed && !frame) frame = requestAnimationFrame(draw);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    const intersection = new IntersectionObserver(([entry]) => {
      if (disposed) return;
      visible = entry.isIntersecting;
      if (visible) wake.current();
    });
    intersection.observe(element);
    const visibility = () => {
      if (!document.hidden) wake.current();
    };
    document.addEventListener("visibilitychange", visibility);
    resize();
    return () => {
      disposed = true;
      wake.current = () => {};
      drag.current = null;
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [enabled]);
  function start(
    e: PointerEvent<HTMLElement | SVGSVGElement>,
    forceDrag = false,
  ) {
    if (e.button !== 0) return;
    e.preventDefault();
    const b = body.current;
    drag.current = {
      id: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      x: b.x,
      y: b.y,
      yaw: b.yaw,
      pitch: b.pitch,
      rotate: !forceDrag && (mode === "rotate" || e.shiftKey),
    };
    aim.current = { x: b.x, y: b.y, yaw: b.yaw, pitch: b.pitch };
    e.currentTarget.setPointerCapture(e.pointerId);
    setHeld(true);
    wake.current();
  }
  function move(e: PointerEvent<HTMLElement | SVGSVGElement>) {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.startX,
      dy = e.clientY - d.startY;
    if (d.rotate) {
      aim.current.yaw = d.yaw + dx * 1.3;
      aim.current.pitch = clamp(d.pitch - dy * 0.35, -35, 35);
    } else {
      aim.current.x = d.x + dx;
      aim.current.y = d.y + dy;
    }
    wake.current();
  }
  function end(e: PointerEvent<HTMLElement | SVGSVGElement>) {
    if (!drag.current) return;
    drag.current = null;
    setHeld(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
    wake.current();
  }
  function flip() {
    body.current.yaw += 180;
    body.current.spin = enabled ? 1.2 : 0;
    wake.current();
  }
  function reset() {
    const b = body.current,
      g = geometry.current;
    b.x = g.restX;
    b.y = g.restY;
    b.yaw = 0;
    b.pitch = 0;
    b.z = 8;
    b.vx = b.vy = b.vz = b.spin = 0;
    wake.current();
  }
  function keyboard(e: KeyboardEvent) {
    if (
      [
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "Enter",
        " ",
      ].includes(e.key)
    ) {
      e.preventDefault();
      if (e.key === "Home") reset();
      else if (e.key === "Enter" || e.key === " ") flip();
      else {
        body.current.yaw +=
          e.key === "ArrowLeft" ? -30 : e.key === "ArrowRight" ? 30 : 0;
        body.current.vy +=
          e.key === "ArrowDown" ? 15 : e.key === "ArrowUp" ? -15 : 0;
        wake.current();
      }
    }
  }
  return (
    <div
      ref={stage}
      className={`id-stage physics-stage ${held ? "is-held" : ""}`}
    >
      <div className="id-orbit" aria-hidden="true" />
      <div className="orbital-ring ring-a" aria-hidden="true" />
      <div className="orbital-ring ring-b" aria-hidden="true" />
      <svg
        className="rope-canvas"
        onPointerDown={(e) => start(e, true)}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        aria-label="Tali kartu, tarik untuk menggerakkan kartu"
      >
        <defs>
          <linearGradient id="strap-gradient">
            <stop stopColor="#22132f" />
            <stop offset=".45" stopColor="#5c3d73" />
            <stop offset="1" stopColor="#170e22" />
          </linearGradient>
          <path ref={rope} id="physics-rope" />
        </defs>
        <use href="#physics-rope" className="rope-edge" />
        <use href="#physics-rope" className="rope-body" />
        <use href="#physics-rope" className="rope-stitch" />
        <text className="rope-lettering">
          <textPath href="#physics-rope" startOffset="12%">
            INDRA.DEV ✦ CREATIVE DEVELOPER ✦
          </textPath>
        </text>
        <use href="#physics-rope" className="rope-hit" />
      </svg>
      <div
        ref={holder}
        className="physics-card"
        role="group"
        tabIndex={0}
        aria-label="Kartu identitas interaktif. Tarik untuk memindahkan. Gunakan mode Putar atau Shift dan tarik untuk memutar. Tombol panah untuk memutar, Enter membalik, Home mengatur ulang."
        onKeyDown={keyboard}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        onLostPointerCapture={() => {
          drag.current = null;
          setHeld(false);
        }}
        onDragStart={(e) => e.preventDefault()}
      >
        <div className="physics-clip" />
        <div className="card-face card-front">
          <div className="card-punch" />
          <div className="pass-top">
            <span>THE CREATIVE PASS</span>
            <Code2 size={21} />
          </div>
          <div className="pass-title">
            DEVELOPER<span>& DIGITAL EXPLORER</span>
          </div>
          <div className="pass-photo">
            <img
              draggable={false}
              src={profile.heroImage}
              alt="Muhammad Indra memegang jam tangan, foto pada kartu identitas"
              width="1067"
              height="1600"
            />
            <div className="photo-caption">HELLO, I’M INDRA.</div>
            <span className="side-label">BUILD • LEARN • EXPLORE</span>
          </div>
          <div className="pass-name">
            MUHAMMAD
            <br />
            <strong>INDRA</strong>
            <span className="pass-star">✳</span>
          </div>
          <div className="pass-bottom">
            <span>
              PORTFOLIO
              <br />
              <b>CREATIVE DEVELOPER</b>
            </span>
            <div className="barcode" aria-hidden="true" />
          </div>
          <div ref={sheen} className="card-sheen" />
        </div>
        <div className="card-face card-back">
          <Fingerprint size={46} />
          <span className="eyebrow">BEHIND THE CODE</span>
          <strong>
            Curiosity.
            <br />
            Creativity.
            <br />
            <em>A little purple.</em>
          </strong>
          <p>Muhammad Indra</p>
          <Instagram size={24} />
          <span>{profile.handle}</span>
          <div className="barcode" aria-hidden="true" />
        </div>
      </div>
      <div className="card-playground-controls">
        <span className="playground-label">
          {held
            ? drag.current?.rotate
              ? "PUTAR SEPUASNYA"
              : "LEPAS UNTUK MELIHAT AYUNAN"
            : "A LITTLE PLAYGROUND"}
        </span>
        <div>
          <button
            className={mode === "drag" ? "chosen" : ""}
            onClick={() => setMode("drag")}
            aria-pressed={mode === "drag"}
          >
            <Move size={14} />
            Tarik
          </button>
          <button
            className={mode === "rotate" ? "chosen" : ""}
            onClick={() => setMode("rotate")}
            aria-pressed={mode === "rotate"}
          >
            <Rotate3D size={14} />
            Putar
          </button>
          <button onClick={flip} aria-label="Balik kartu identitas">
            Balik
          </button>
          <button onClick={reset} aria-label="Atur ulang kartu">
            <RotateCcw size={14} />
          </button>
        </div>
        <small>Tarik kartu atau talinya · Shift + tarik untuk memutar</small>
      </div>
    </div>
  );
}
