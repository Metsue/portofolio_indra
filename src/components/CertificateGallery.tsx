import { useRef, useState } from "react";
import {
  Award,
  ArrowUpRight,
  X,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { certificates, type Certificate } from "../data/certificates";
import { achievements } from "../data/achievements";
export function CertificateGallery({
  milestones = false,
}: {
  milestones?: boolean;
}) {
  const [filter, setFilter] = useState("Semua"),
    [selected, setSelected] = useState<Certificate | null>(null),
    [page, setPage] = useState(0),
    [zoom, setZoom] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const open = (c: Certificate) => {
    setSelected(c);
    setPage(0);
    setZoom(false);
    dialog.current?.showModal();
  };
  const pages = selected ? [selected.image, ...(selected.pages || [])] : [];
  return (
    <>
      {milestones ? (
        <div className="achievement-grid">
          {achievements.map((a, i) => (
            <article className="achievement-card" key={a.title}>
              <div className="achievement-meta">
                <Award size={25} />
                <span>{a.year}</span>
              </div>
              <span className="eyebrow">{a.label}</span>
              <h3>{a.title}</h3>
              <p>{a.description}</p>
              <button
                className="text-link"
                onClick={() => {
                  const c = certificates.find((c) => c.id === a.certificateId);
                  if (c) open(c);
                }}
              >
                Lihat dokumentasi <ArrowUpRight size={16} />
              </button>
              <span className="milestone-number">0{i + 1}</span>
            </article>
          ))}
        </div>
      ) : (
        <>
          <div className="certificate-filters" aria-label="Filter sertifikat">
            {["Semua", "Kompetensi", "Pengalaman", "Kegiatan"].map((f) => (
              <button
                key={f}
                aria-pressed={filter === f}
                className={filter === f ? "active" : ""}
                onClick={() => setFilter(f)}
              >
                {f}
                <span>
                  {
                    certificates.filter(
                      (c) => f === "Semua" || c.category === f,
                    ).length
                  }
                </span>
              </button>
            ))}
          </div>
          <div className="project-grid certificate-grid">
            {certificates
              .filter((c) => filter === "Semua" || c.category === filter)
              .map((c) => (
                <button
                  className="certificate-card"
                  key={c.id}
                  onClick={() => open(c)}
                >
                  <div className="certificate-image">
                    <img
                      src={c.thumbnail || c.image}
                      alt={c.title}
                      loading="lazy"
                    />
                    <span>
                      <ZoomIn size={18} />
                    </span>
                  </div>
                  <div className="certificate-body">
                    <span className="eyebrow">
                      {c.category} · {c.year}
                    </span>
                    <h3>{c.title}</h3>
                    <p>{c.issuer}</p>
                    <span className="certificate-date">
                      {c.date}
                      <ArrowUpRight size={16} />
                    </span>
                  </div>
                </button>
              ))}
          </div>
        </>
      )}
      <dialog
        ref={dialog}
        className="certificate-dialog"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
        aria-label={selected?.title || "Pratinjau sertifikat"}
      >
        <div className="certificate-toolbar">
          <span>
            {selected?.category} · {selected?.year}
          </span>
          <div>
            {pages.length > 1 && (
              <>
                <button
                  aria-label="Halaman sertifikat sebelumnya"
                  disabled={page === 0}
                  onClick={() => {
                    setPage(page - 1);
                    setZoom(false);
                  }}
                >
                  <ChevronLeft size={18} />
                </button>
                <span>
                  {page + 1}/{pages.length}
                </span>
                <button
                  aria-label="Halaman sertifikat berikutnya"
                  disabled={page === pages.length - 1}
                  onClick={() => {
                    setPage(page + 1);
                    setZoom(false);
                  }}
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
            <button
              aria-label={zoom ? "Perkecil sertifikat" : "Perbesar sertifikat"}
              onClick={() => setZoom(!zoom)}
            >
              {zoom ? <ZoomOut size={19} /> : <ZoomIn size={19} />}
            </button>
            <button
              aria-label="Tutup pratinjau"
              onClick={() => dialog.current?.close()}
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className={`certificate-viewer ${zoom ? "is-zoomed" : ""}`}>
          {selected && (
            <img
              src={pages[page]}
              alt={`${selected.title}, halaman ${page + 1}`}
            />
          )}
        </div>
        <div className="certificate-description">
          <h3>{selected?.title}</h3>
          <p>{selected?.description}</p>
          <small>
            {selected?.issuer} · {selected?.date}
          </small>
        </div>
      </dialog>
    </>
  );
}
