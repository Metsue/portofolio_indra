import { CertificateGallery } from "./CertificateGallery";
import { useRef, useState, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  Trophy,
  Code2,
  Layers,
  ImageIcon,
  Maximize2,
  FolderOpen,
} from "lucide-react";
import { projects, type Project } from "../data/projects";
import { techStack } from "../data/techStack";
import { Reveal } from "./Effects";
import { SectionHeading } from "./Layout";
export function ProjectCover({ project }: { project: Project }) {
  return project.coverImage ? (
    <img
      src={project.coverImage}
      alt={`Tampilan asli aplikasi ${project.title}`}
      loading="lazy"
      width="1440"
      height="900"
    />
  ) : (
    <div className={`project-placeholder ${project.accent}`}>
      <span className="placeholder-symbol">
        <Code2 size={32} />
      </span>
      <strong>{project.title}</strong>
      <span>Screenshot belum ditambahkan</span>
      <div className="placeholder-grid" aria-hidden="true" />
    </div>
  );
}
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card">
      <Link
        to={`/projects/${project.slug}`}
        className="project-cover"
        tabIndex={-1}
        aria-hidden="true"
      >
        <ProjectCover project={project} />
        <span className="cover-open">
          <Maximize2 size={17} />
        </span>
      </Link>
      <div className="project-body">
        <span className="eyebrow">{project.category}</span>
        <h3>
          <Link to={`/projects/${project.slug}`}>{project.title}</Link>
        </h3>
        <p>{project.summary}</p>
        <div className="chips">
          {project.technologies.slice(0, 3).map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <Link to={`/projects/${project.slug}`} className="project-detail-link">
          Lihat Detail <FolderOpen size={16} />
        </Link>
      </div>
    </article>
  );
}
const tabs = [
  { name: "Projects", icon: Code2 },
  { name: "Certificates", icon: Award },
  { name: "Achievements", icon: Trophy },
  { name: "Tech Stack", icon: Layers },
];
export function Portfolio() {
  const [tab, setTab] = useState("Projects");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  function keyNav(e: KeyboardEvent, index: number) {
    let next = index;
    if (e.key === "ArrowRight") next = (index + 1) % 4;
    else if (e.key === "ArrowLeft") next = (index + 3) % 4;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = 3;
    else return;
    e.preventDefault();
    setTab(tabs[next].name);
    tabRefs.current[next]?.focus();
  }
  return (
    <section id="portfolio" className="section portfolio-section container">
      <Reveal>
        <SectionHeading
          eyebrow="A COLLECTION OF CURIOSITY"
          title="Portfolio"
          description="Ide yang dieksplorasi. Pengalaman yang dibangun."
        />
      </Reveal>
      <div
        className="portfolio-tabs"
        role="tablist"
        aria-label="Kategori portofolio"
      >
        {tabs.map((t, i) => (
          <button
            key={t.name}
            ref={(e) => {
              tabRefs.current[i] = e;
            }}
            id={`tab-${i}`}
            aria-controls={`panel-${i}`}
            role="tab"
            aria-selected={tab === t.name}
            tabIndex={tab === t.name ? 0 : -1}
            className={tab === t.name ? "selected" : ""}
            onClick={() => setTab(t.name)}
            onKeyDown={(e) => keyNav(e, i)}
          >
            <t.icon size={17} />
            {t.name}
          </button>
        ))}
      </div>
      <div
        className="tab-content"
        key={tab}
        role="tabpanel"
        id={`panel-${tabs.findIndex((t) => t.name === tab)}`}
        aria-labelledby={`tab-${tabs.findIndex((t) => t.name === tab)}`}
        tabIndex={0}
      >
        {tab === "Projects" && (
          <>
            <div className="portfolio-caption">
              <span>
                <span className="small-spark">✦</span> SELECTED WORK
              </span>
              <span>
                {String(projects.length).padStart(2, "0")} projects to explore
              </span>
            </div>
            <div className="project-grid">
              {projects.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          </>
        )}
        {tab === "Certificates" && <CertificateGallery />}
        {tab === "Achievements" && <CertificateGallery milestones />}
        {tab === "Tech Stack" && (
          <>
            <p className="stack-intro">
              Teknologi yang digunakan pada proyek-proyek saya.
            </p>
            <div className="tech-grid">
              {techStack.map((tech) => (
                <div className="tech-card" key={tech.slug}>
                  <svg
                    role="img"
                    aria-label={tech.title}
                    viewBox="0 0 24 24"
                    style={{ fill: `#${tech.hex}` }}
                  >
                    <path d={tech.path} />
                  </svg>
                  <span>{tech.title}</span>
                </div>
              ))}
            </div>
            <p className="stack-note">
              <ImageIcon size={15} /> Phaser juga digunakan untuk game 2D pada
              PyroRescue.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
