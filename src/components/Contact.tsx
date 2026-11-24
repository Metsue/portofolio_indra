import { api, runtime } from "../lib/runtime";
import { useEffect, useState, type FormEvent } from "react";
import {
  Send,
  MessageSquare,
  LockKeyhole,
  Check,
  Copy,
  Trash2,
} from "lucide-react";
import { profile } from "../data/profile";
import { InstagramLink, SectionHeading } from "./Layout";
import { Reveal } from "./Effects";
type Comment = {
  id: string;
  name: string;
  text: string;
  date: string;
  canDelete: boolean;
};
export function Contact() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [guestStatus, setGuestStatus] = useState("");
  const [messageStatus, setMessageStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const endpoint = runtime.mailEnabled;
  useEffect(() => {
    if (runtime.staticSite) return;
    api<Comment[]>("guestbook")
      .then((data) => setComments(data))
      .catch((e) => setGuestStatus(e.message));
  }, []);
  const email = profile.email;
  async function submitMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name")).trim(),
      sender = String(data.get("email")).trim(),
      message = String(data.get("message")).trim();
    if (!name || !message) {
      setMessageStatus("Nama dan pesan tidak boleh hanya berisi spasi.");
      return;
    }
    setBusy(true);
    setMessageStatus("");
    try {
      if (endpoint) {
        await api("contact", "POST", {
          name,
          email: sender,
          message,
          website: "",
        });
        setMessageStatus("Pesan berhasil diterima oleh layanan pengiriman.");
        form.reset();
      } else if (email) {
        location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(`Pesan dari ${name}`)}&body=${encodeURIComponent(`${message}\n\n${name}\n${sender}`)}`;
        setMessageStatus(
          "Lanjutkan pengiriman di aplikasi email Anda. Pesan belum dikirim oleh website.",
        );
      } else {
        await navigator.clipboard.writeText(
          `Halo Indra, saya ${name}.\n${message}\n\nEmail: ${sender}`,
        );
        setCopied(true);
        setMessageStatus(
          "Pesan disalin. Buka Instagram, lalu tempel dan kirim melalui DM.",
        );
      }
    } catch (err) {
      setMessageStatus(
        endpoint && err instanceof Error
          ? err.message
          : "Pesan belum terkirim. Salin pesan Anda secara manual dan kirim melalui Instagram.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function submitComment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget,
      data = new FormData(form);
    setBusy(true);
    try {
      await api("guestbook", "POST", {
        name: String(data.get("guestName")).trim(),
        text: String(data.get("comment")).trim(),
        website: "",
      });
      const result = await api<Comment[]>("guestbook");
      setComments(result);
      form.reset();
      setGuestStatus("Terima kasih! Catatan Anda tersimpan.");
    } catch (e) {
      setGuestStatus(
        e instanceof Error ? e.message : "Catatan belum tersimpan.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function removeComment(id: string) {
    setBusy(true);
    try {
      await api("guestbook/" + id, "DELETE");
      setComments((items) => items.filter((c) => c.id !== id));
      setGuestStatus("Catatan Anda dihapus.");
    } catch (e) {
      setGuestStatus(e instanceof Error ? e.message : "Belum dapat dihapus.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section id="contact" className="section container contact-section">
      <Reveal>
        <SectionHeading
          eyebrow="GOOD THINGS START WITH A HELLO"
          title="Let’s Connect"
          description="Punya ide, pertanyaan, atau sekadar ingin menyapa?"
        />
      </Reveal>
      <Reveal className="contact-grid">
        <div className="contact-panel">
          <div className="panel-heading">
            <span className="icon-tile">
              <Send size={20} />
            </span>
            <div>
              <h3>Hubungi Saya</h3>
              <p>Mari mulai percakapan.</p>
            </div>
          </div>
          <div className="email-contact">
            <a href={"mailto:" + profile.email}>{profile.email}</a>
            <button
              aria-label="Salin alamat email"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(profile.email);
                  setMessageStatus("Alamat email disalin.");
                } catch {
                  setMessageStatus(profile.email);
                }
              }}
            >
              <Copy size={15} />
            </button>
          </div>
          <form onSubmit={submitMessage}>
            <label htmlFor="name">Nama</label>
            <input
              id="name"
              name="name"
              placeholder="Nama Anda"
              autoComplete="name"
              required
              maxLength={80}
            />
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              placeholder="nama@email.com"
              type="email"
              autoComplete="email"
              required
              maxLength={160}
            />
            <label htmlFor="message">Pesan</label>
            <textarea
              id="message"
              name="message"
              placeholder="Ceritakan ide Anda…"
              required
              minLength={5}
              maxLength={3000}
              rows={4}
            />
            {!endpoint && (
              <p className="form-note">
                Pesan akan dibuka di aplikasi email Anda, siap dikirim ke Indra.
              </p>
            )}
            <button
              className="button primary full"
              disabled={busy}
              type="submit"
            >
              {copied ? (
                <Check size={16} />
              ) : endpoint || email ? (
                <Send size={16} />
              ) : (
                <Copy size={16} />
              )}{" "}
              {busy
                ? "Memproses…"
                : endpoint || email
                  ? endpoint
                    ? "Kirim Pesan"
                    : "Lanjutkan ke Email"
                  : "Salin pesan untuk Instagram"}
            </button>
            <p className="form-status" role="status">
              {messageStatus}
            </p>
            {copied && (
              <a
                className="button secondary full"
                href={profile.instagram}
                target="_blank"
                rel="noreferrer"
              >
                Buka Instagram
              </a>
            )}
          </form>
          <div className="contact-social">
            <span className="eyebrow">FIND ME</span>
            <InstagramLink />
          </div>
        </div>
        {runtime.staticSite ? (
          <div className="guestbook-panel static-contact-panel">
            <div className="panel-heading">
              <span className="icon-tile">
                <MessageSquare size={21} />
              </span>
              <div>
                <h3>Let's make something meaningful.</h3>
                <p>Satu percakapan bisa jadi awal karya baru.</p>
              </div>
            </div>
            <p>
              Punya ide proyek, kolaborasi, atau sekadar ingin menyapa?
              Ceritakan lewat email atau Instagram. Saya senang mendengar cerita
              dan ide baru.
            </p>
            <div className="static-contact-actions">
              <a className="button primary" href={`mailto:${profile.email}`}>
                <Send size={16} /> Kirim Email
              </a>
              <a
                className="button secondary"
                href={profile.instagram}
                target="_blank"
                rel="noreferrer"
              >
                Buka Instagram
              </a>
            </div>
            <span className="eyebrow">IDEAS INTO EXPERIENCES ✦</span>
          </div>
        ) : (
          <div className="guestbook-panel">
            <div className="panel-heading">
              <span className="icon-tile">
                <MessageSquare size={21} />
              </span>
              <div>
                <h3>Leave a little note.</h3>
                <p>Terima kasih sudah singgah.</p>
              </div>
            </div>
            <p className="storage-notice">
              <LockKeyhole size={15} />
              Catatan tampil publik. Catatan Anda dapat dihapus selama sesi
              browser masih aktif.
            </p>
            <form onSubmit={submitComment}>
              <label htmlFor="guestName">Nama</label>
              <input
                id="guestName"
                name="guestName"
                placeholder="Siapa nama Anda?"
                required
                maxLength={50}
              />
              <label htmlFor="comment">Komentar</label>
              <textarea
                id="comment"
                name="comment"
                placeholder="Tinggalkan pesan kecil di sini…"
                required
                maxLength={1000}
                rows={4}
              />
              <button
                className="button primary full"
                type="submit"
                disabled={busy}
              >
                <Send size={16} />
                Kirim Komentar
              </button>
              <p className="form-status" role="status">
                {guestStatus}
              </p>
            </form>
            <div className="comments-header">
              <h4>Guestbook</h4>
              <span>{comments.length} catatan</span>
            </div>
            <div className="comments-list">
              {comments.length ? (
                comments.map((c) => (
                  <article className="comment" key={c.id}>
                    <span className="comment-avatar">
                      {c.name.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <h4>{c.name}</h4>
                      <time dateTime={c.date}>
                        {Number.isNaN(Date.parse(c.date))
                          ? ""
                          : new Date(c.date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                      </time>
                      <p>{c.text}</p>
                    </div>
                    {c.canDelete && (
                      <button
                        disabled={busy}
                        aria-label={`Hapus komentar ${c.name}`}
                        className="delete-comment"
                        onClick={() => removeComment(c.id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </article>
                ))
              ) : (
                <div className="guestbook-empty">
                  <MessageSquare size={24} />
                  <p>Jadilah yang pertama meninggalkan catatan.</p>
                  <span>A small hello goes a long way.</span>
                </div>
              )}
            </div>
          </div>
        )}
      </Reveal>
    </section>
  );
}
