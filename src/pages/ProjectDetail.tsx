import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Code2, ExternalLink, X, Maximize2 } from "lucide-react";
import { projects } from "../data/projects";
import { ProjectCover } from "../components/Portfolio";
export function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);
  const dialog = useRef<HTMLDialogElement>(null);
  const enlarged = useRef<HTMLImageElement>(null);
  useEffect(() => {
    document.title = project
      ? `${project.title} — Muhammad Indra`
      : "Proyek tidak ditemukan — Muhammad Indra";
  }, [project]);
  if (!project)
    return (
      <main className="container not-found">
        <span className="eyebrow">404 / PROJECT NOT FOUND</span>
        <h1>Proyek belum ditemukan.</h1>
        <Link to="/#portfolio" className="button primary">
          Kembali ke Portfolio
        </Link>
      </main>
    );
  return (
    <main className="container detail-page">
      <div className="detail-breadcrumb">
        <Link className="button secondary" to="/#portfolio">
          <ChevronLeft size={16} />
          Kembali
        </Link>
        <span>
          Projects / <b>{project.title}</b>
        </span>
      </div>
      <div className="detail-grid">
        <div>
          <span className="eyebrow">{project.category}</span>
          <h1>
            {project.title}
            <span className="title-dot">.</span>
          </h1>
          {project.status && (
            <span className="status-chip">{project.status}</span>
          )}
          <p className="detail-intro">{project.description}</p>
          <h2 className="subheading">
            <Code2 size={18} />
            Technologies Used
          </h2>
          <div className="chips large">
            {project.technologies.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <div className="detail-links">
            {project.repositoryUrl && (
              <a
                className="button secondary"
                href={project.repositoryUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Code2 size={16} />
                Repository
              </a>
            )}
            {project.demoUrl && (
              <a
                className="button primary"
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink size={16} />
                Live Demo
              </a>
            )}
          </div>
        </div>
        <div className="detail-visual">
          <ProjectCover project={project} />
          <div className="detail-visual-caption">
            <span>
              {project.coverImage
                ? "Tampilan aplikasi asli"
                : "Pratinjau proyek"}
            </span>
            <span>{project.title}</span>
          </div>
        </div>
      </div>
      <div className="detail-information">
        <section>
          <span className="eyebrow">WHAT’S INSIDE</span>
          <h2>Fitur utama</h2>
          <ul>
            {project.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>
        <section>
          <span className="eyebrow">BEHIND THE PROJECT</span>
          <h2>
            {project.role ? "Kontribusi & konteks" : "Tentang pengembangan"}
          </h2>
          <p>
            {project.role ||
              "Fitur dan teknologi dirangkum dari dokumentasi serta kode sumber proyek yang tersedia."}
          </p>
          {project.note && <p className="project-note">{project.note}</p>}
        </section>
      </div>
      {!!project.gallery?.length && (
        <section className="detail-gallery">
          <h2>Lebih dekat dengan {project.title}</h2>
          <div>
            {project.gallery.map((src, i) => (
              <button
                key={src}
                onClick={() => {
                  if (enlarged.current) enlarged.current.src = src;
                  dialog.current?.showModal();
                }}
              >
                <img
                  src={src}
                  alt={`Screenshot asli ${project.title}, tampilan ${i + 1}`}
                  loading="lazy"
                />
                <span>
                  <Maximize2 size={15} /> Perbesar tampilan
                </span>
              </button>
            ))}
          </div>
        </section>
      )}
      <dialog
        ref={dialog}
        className="image-dialog"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <button
          className="dialog-close"
          onClick={() => dialog.current?.close()}
          aria-label="Tutup pratinjau"
        >
          <X />
        </button>
        <img ref={enlarged} alt={`Pratinjau ${project.title}`} />
      </dialog>
      <Link to="/#portfolio" className="button secondary">
        <ChevronLeft size={16} />
        Kembali ke semua proyek
      </Link>
    </main>
  );
}
