import { useContext, type PointerEvent } from "react";
import { MusicPanel } from "./MusicPanel";
import { CountUp } from "./Interactions";
import { Link } from "react-router-dom";
import {
  Code2,
  Award,
  Trophy,
  GraduationCap,
  BriefcaseBusiness,
  Send,
} from "lucide-react";
import { profile } from "../data/profile";
import { projects } from "../data/projects";
import { certificates } from "../data/certificates";
import { achievements } from "../data/achievements";
import { MotionContext, Reveal } from "./Effects";
import { SectionHeading } from "./Layout";
export function About() {
  const { enabled } = useContext(MotionContext);
  const movePortrait = (event: PointerEvent<HTMLDivElement>) => {
    if (!enabled || event.pointerType !== "mouse") return;
    const target = event.currentTarget;
    const box = target.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    target.style.setProperty("--portrait-x", `${x * 13}px`);
    target.style.setProperty("--portrait-y", `${y * 9}px`);
    target.style.setProperty("--portrait-rotate-y", `${x * 7}deg`);
    target.style.setProperty("--portrait-rotate-x", `${-y * 5}deg`);
    target.style.setProperty("--halo-x", `${50 + x * 14}%`);
    target.style.setProperty("--halo-y", `${50 + y * 14}%`);
  };
  const resetPortrait = (event: PointerEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    for (const [key, value] of Object.entries({
      "--portrait-x": "0px",
      "--portrait-y": "0px",
      "--portrait-rotate-y": "0deg",
      "--portrait-rotate-x": "0deg",
      "--halo-x": "50%",
      "--halo-y": "50%",
    }))
      target.style.setProperty(key, value);
  };
  return (
    <section id="about" className="section container">
      <Reveal>
        <SectionHeading
          eyebrow="THE PERSON BEHIND THE PIXELS"
          title="About Me"
        />
      </Reveal>
      <Reveal className="about-grid">
        <div className="about-greeting">
          <span>Hi, I’m</span>
          <h3>
            Muhammad
            <br />
            Indra<span className="title-dot">.</span>
          </h3>
          <p>
            Mengubah rasa ingin tahu
            <br />
            menjadi sesuatu yang berarti.
          </p>
          <Link to="/#contact" className="button primary">
            <Send size={16} />
            Hubungi Saya
          </Link>
        </div>
        <div
          className="about-portrait"
          onPointerMove={movePortrait}
          onPointerLeave={resetPortrait}
        >
          <div className="portrait-halo" />
          <span className="portrait-orbit orbit-one" aria-hidden="true" />
          <span className="portrait-orbit orbit-two" aria-hidden="true" />
          <span
            className="portrait-spark portrait-spark-one"
            aria-hidden="true"
          >
            ✦
          </span>
          <span
            className="portrait-spark portrait-spark-two"
            aria-hidden="true"
          >
            ✧
          </span>
          <img
            src={profile.aboutImage}
            alt="Muhammad Indra mengenakan jas almamater kuning Universitas Lambung Mangkurat"
            width="960"
            height="1215"
            loading="lazy"
          />
          <span className="portrait-tag">
            <Code2 size={16} />A mind full of ideas.
          </span>
        </div>
        <div className="about-copy">
          <span className="eyebrow">DESIGN. DEVELOP. KEEP LEARNING.</span>
          <p>{profile.about}</p>
          <p>
            Bagi saya, antarmuka yang baik bukan hanya enak dilihat. Ia membantu
            orang menemukan jalan, memahami informasi, dan menikmati prosesnya.
          </p>
          <Link to="/#portfolio" className="text-link">
            <Code2 size={16} />
            Jelajahi karya saya
          </Link>
        </div>
      </Reveal>
      <Reveal className="history-grid">
        {[
          { title: "Education", icon: GraduationCap, items: profile.education },
          {
            title: "Experience",
            icon: BriefcaseBusiness,
            items: profile.experience,
          },
        ].map((group) => (
          <div key={group.title}>
            <h3 className="subheading">{group.title}</h3>
            {group.items.map((item) => (
              <div className="history-card" key={item.title}>
                <span className="icon-tile">
                  <group.icon size={22} />
                </span>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.subtitle}</p>
                  <small>{item.note}</small>
                </div>
              </div>
            ))}
          </div>
        ))}
      </Reveal>
      <Reveal className="stats-grid">
        {[
          {
            name: "Projects",
            value: projects.length,
            description: "Ide yang menjadi karya",
            icon: Code2,
          },
          {
            name: "Certificates",
            value: certificates.length,
            description: "Sertifikat yang ditambahkan",
            icon: Award,
          },
          {
            name: "Achievements",
            value: achievements.length,
            description: "Pencapaian yang didokumentasikan",
            icon: Trophy,
          },
        ].map((s) => (
          <div className="stat-card" key={s.name}>
            <div>
              <span className="icon-tile">
                <s.icon size={21} />
              </span>
              <strong>
                <CountUp value={s.value} />
              </strong>
            </div>
            <h3>{s.name}</h3>
            <p>{s.description}</p>
          </div>
        ))}
      </Reveal>
      <MusicPanel />
    </section>
  );
}
