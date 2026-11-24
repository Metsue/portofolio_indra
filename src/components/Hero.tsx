import { HangingIdCard } from "./HangingIdCard";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Code2, Mouse, Send, Sparkles } from "lucide-react";
import { profile } from "../data/profile";
import { MotionContext } from "./Effects";
import { InstagramLink } from "./Layout";
export function Hero() {
  const [role, setRole] = useState(0);
  const { enabled } = useContext(MotionContext);
  useEffect(() => {
    if (!enabled) return;
    const t = setInterval(
      () => setRole((v) => (v + 1) % profile.roles.length),
      3200,
    );
    return () => clearInterval(t);
  }, [enabled]);
  return (
    <section id="home" className="hero container">
      <div className="hero-atmosphere" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="hero-copy">
        <div className="hero-kicker">
          <Sparkles size={15} />
          <span>A LITTLE ABOUT MY UNIVERSE</span>
        </div>
        <h1>
          <span>Welcome to</span>
          <br />
          My Portfolio<span className="hero-period">.</span>
        </h1>
        <div className="role-line">
          <span key={role}>{profile.roles[role]}</span>
          <i />
        </div>
        <p className="hero-description">
          Halo, saya <strong>Muhammad Indra.</strong> Saya senang merancang dan
          mengembangkan pengalaman digital yang menarik, bermanfaat, dan mudah
          digunakan.
        </p>
        <div className="hero-actions">
          <Link className="button primary" to="/#portfolio">
            <Code2 size={17} />
            Lihat Proyek
          </Link>
          <Link className="button secondary" to="/#contact">
            <Send size={16} />
            Hubungi Saya
          </Link>
        </div>
        <div className="find-me">
          <span>FIND ME</span>
          <span className="tiny-line" />
          <InstagramLink compact />
          <span className="social-handle">{profile.handle}</span>
        </div>
      </div>
      <HangingIdCard />
      <Link className="scroll-cue" to="/#about">
        <Mouse size={18} />
        <span>SCROLL TO EXPLORE</span>
        <i />
      </Link>
      <div className="hero-corner" aria-hidden="true">
        IDEAS INTO EXPERIENCES
        <br />
        <span>ONE LINE AT A TIME.</span>
      </div>
    </section>
  );
}
