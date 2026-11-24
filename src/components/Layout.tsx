import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Instagram, Pause, Play, Code2, ChevronUp } from "lucide-react";
import { MotionContext } from "./Effects";
import { profile } from "../data/profile";
export function Navbar() {
  const location = useLocation();
  const [active, setActive] = useState("home");
  const { enabled, toggle } = useContext(MotionContext);
  useEffect(() => {
    if (location.pathname !== "/") {
      setActive("portfolio");
      return;
    }
    const update = () => {
      let current = "home";
      for (const id of ["home", "about", "portfolio", "contact"]) {
        const e = document.getElementById(id);
        if (e && e.getBoundingClientRect().top < innerHeight * 0.4)
          current = id;
      }
      setActive(current);
    };
    update();
    addEventListener("scroll", update, { passive: true });
    return () => removeEventListener("scroll", update);
  }, [location]);
  return (
    <header className="site-header">
      <Link
        to="/#home"
        className="brand header-brand"
        aria-label="indra.dev beranda"
      >
        <Code2 size={22} />
        <span>
          indra<span className="muted">.dev</span>
        </span>
      </Link>
      <nav className="nav-pill" aria-label="Navigasi utama">
        {["Home", "About", "Portfolio", "Contact"].map((label) => (
          <Link
            key={label}
            to={`/#${label.toLowerCase()}`}
            className={active === label.toLowerCase() ? "active" : ""}
            aria-current={active === label.toLowerCase() ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
        <span className="nav-divider" />
        <button
          className="motion-toggle"
          onClick={toggle}
          aria-label={enabled ? "Matikan animasi" : "Aktifkan animasi"}
          aria-pressed={enabled}
        >
          {enabled ? <Pause size={15} /> : <Play size={15} />}
        </button>
      </nav>
      <span className="header-caption">PERSONAL PORTFOLIO</span>
    </header>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>
        {title}
        <span className="title-dot">.</span>
      </h2>
      {description && <p>{description}</p>}
    </div>
  );
}
export function InstagramLink({ compact = false }: { compact?: boolean }) {
  return (
    <a
      className={compact ? "social-icon" : "instagram-link"}
      href={profile.instagram}
      target="_blank"
      rel="noreferrer"
      aria-label="Instagram Muhammad Indra"
    >
      <Instagram size={18} />
      {!compact && (
        <span>
          Instagram <small>{profile.handle}</small>
        </span>
      )}
    </a>
  );
}
export function Footer() {
  return (
    <footer className="footer container">
      <div className="footer-top">
        <div>
          <Link to="/#home" className="brand">
            <Code2 size={23} />
            indra<span className="muted">.dev</span>
          </Link>
          <p>
            Merangkai ide menjadi pengalaman digital.
            <br />
            Dibuat dengan rasa ingin tahu.
          </p>
        </div>
        <div>
          <span className="eyebrow">EXPLORE</span>
          <div className="footer-nav">
            {["Home", "About", "Portfolio", "Contact"].map((x) => (
              <Link key={x} to={`/#${x.toLowerCase()}`}>
                {x}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <span className="eyebrow">LET’S CONNECT</span>
          <InstagramLink />
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Muhammad Indra</span>
        <span>Designed with purpose. Built with care.</span>
        <Link to="/#home" aria-label="Kembali ke atas">
          <ChevronUp size={18} />
        </Link>
      </div>
    </footer>
  );
}
