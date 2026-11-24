import { useState } from "react";
import {
  Headphones,
  Play,
  Shuffle,
  SkipBack,
  SkipForward,
  ExternalLink,
  X,
  Music2,
} from "lucide-react";
import { playlist } from "../data/playlist";
import { Reveal } from "./Effects";
export function MusicPanel() {
  const [current, setCurrent] = useState(0);
  const [opened, setOpened] = useState(false);
  const track = playlist[current];
  const select = (index: number) => {
    setCurrent((index + playlist.length) % playlist.length);
    setOpened(true);
  };
  const shuffle = () => {
    const values = new Uint32Array(1);
    crypto.getRandomValues(values);
    select(
      (current + 1 + (values[0] % (playlist.length - 1))) % playlist.length,
    );
  };
  return (
    <Reveal className="music-panel music-studio">
      <div className="music-story">
        <span className="eyebrow">
          <Headphones size={16} /> THE LISTENING ROOM
        </span>
        <h3>
          A little music.
          <br />
          <span>A lot of ideas.</span>
        </h3>
        <p>
          Temani waktu eksplorasi dengan suara
          <br />
          yang memberi ruang untuk imajinasi.
        </p>
        <div
          className={`vinyl-display ${opened ? "record-active" : ""}`}
          aria-hidden="true"
        >
          <div className="vinyl-record">
            <div>
              <Music2 size={28} />
              <span>
                INDRA’S
                <br />
                LISTENING ROOM
              </span>
            </div>
          </div>
          <span className="vinyl-arm" />
        </div>
        <span className="music-curation">
          10 lagu · Tarot + rekomendasi bernuansa serupa
        </span>
      </div>
      <div className="music-console">
        <div className="player-label">
          <span>
            <i /> {opened ? "YOUTUBE PLAYER" : "READY WHEN YOU ARE"}
          </span>
          <span>VOL. 01</span>
        </div>
        <div className="youtube-screen">
          {opened ? (
            <>
              <iframe
                key={track.id}
                title={`${track.artist} — ${track.title}`}
                src={`https://www.youtube-nocookie.com/embed/${track.id}?autoplay=1&rel=0&playsinline=1`}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
              <button
                className="stop-player"
                onClick={() => setOpened(false)}
                aria-label="Tutup dan hentikan pemutar"
              >
                <X size={14} />
              </button>
            </>
          ) : (
            <button
              className="start-player"
              onClick={() => setOpened(true)}
              aria-label={`Putar ${track.title}`}
            >
              <span className="play-disc">
                <Play size={25} fill="currentColor" />
              </span>
              <strong>{track.title}</strong>
              <span>{track.artist}</span>
              <small>Klik untuk membuka pemutar YouTube</small>
            </button>
          )}
        </div>
        <div className="now-selected">
          <div>
            <strong>{track.title}</strong>
            <span>
              {track.artist} · {track.source}
            </span>
          </div>
          <a
            href={`https://www.youtube.com/watch?v=${track.id}`}
            target="_blank"
            rel="noreferrer"
            aria-label={`Buka ${track.title} di YouTube`}
          >
            <ExternalLink size={17} />
          </a>
        </div>
        <div className="playlist-controls">
          <button
            onClick={() => select(current - 1)}
            aria-label="Lagu sebelumnya"
          >
            <SkipBack size={18} />
          </button>
          <button className="shuffle-button" onClick={shuffle}>
            <Shuffle size={15} />
            Acak lagu
          </button>
          <button
            onClick={() => select(current + 1)}
            aria-label="Lagu berikutnya"
          >
            <SkipForward size={18} />
          </button>
        </div>
        <div className="track-list" aria-label="Daftar 10 lagu">
          {playlist.map((song, index) => (
            <button
              key={song.id}
              onClick={() => select(index)}
              className={index === current ? "current-track" : ""}
              aria-pressed={index === current}
            >
              <span className="track-symbol">
                {index === current ? <Music2 size={15} /> : <Play size={12} />}
              </span>
              <span>
                <strong>{song.title}</strong>
                <small>{song.artist}</small>
              </span>
              <span className="track-source">
                {index === 0 ? "PILIHAN INDRA" : "REKOMENDASI"}
              </span>
            </button>
          ))}
        </div>
        <p className="player-note">
          Kontrol suara dan progres tersedia di pemutar YouTube. Jika video
          tidak bisa diputar di sini, gunakan tautan YouTube.
        </p>
      </div>
    </Reveal>
  );
}
