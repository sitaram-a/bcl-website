import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Video,
  Eye,
  Clock,
  Expand,
} from "lucide-react";

import { photos, videos, mediaCategories, mediaStats } from "../data/media";
import "./Media.css";

function Thumb({ item, children }) {
  // If a custom thumbnail image is provided, show it as an image
  if (item.thumb) {
    return (
      <div className="media-thumb">
        <img src={item.thumb} alt={item.title} loading="lazy" />
        {children}
      </div>
    );
  }

  // If no thumb is provided, fallback to showing the actual video file frame
  if (item.src) {
    return (
      <div className="media-thumb">
        <video src={item.src} muted playsInline preload="metadata" />
        {children}
      </div>
    );
  }

  // Fallback tone block if nothing else exists
  return (
    <div className={`media-thumb media-tone-${item.tone}`}>
      <span className="media-thumb-mark">BCL</span>
      {children}
    </div>
  );
}

function Media() {
  const [tab, setTab] = useState("photos");
  const [category, setCategory] = useState("All");
  const [lightbox, setLightbox] = useState(null); // index in filteredPhotos
  const [activeVideo, setActiveVideo] = useState(null);

  const filteredPhotos = useMemo(
    () => photos.filter((p) => category === "All" || p.category === category),
    [category]
  );
  const filteredVideos = useMemo(
    () => videos.filter((v) => category === "All" || v.category === category),
    [category]
  );

  const next = useCallback(
    () => setLightbox((i) => (i + 1) % filteredPhotos.length),
    [filteredPhotos.length]
  );
  const prev = useCallback(
    () =>
      setLightbox((i) => (i - 1 + filteredPhotos.length) % filteredPhotos.length),
    [filteredPhotos.length]
  );

  useEffect(() => {
    if (lightbox === null && !activeVideo) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setLightbox(null);
        setActiveVideo(null);
      }
      if (lightbox !== null) {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, activeVideo, next, prev]);

  const current = lightbox !== null ? filteredPhotos[lightbox] : null;

  return (
    <div className="media-page">
      {/* HERO */}
      <section className="media-hero">
        <div className="media-hero-glow" />
        <div className="media-hero-inner">
          <span className="media-kicker">
            <Camera size={14} /> BCL MEDIA CENTER
          </span>
          <h1>
            Relive Every <span>Moment</span>
          </h1>
          <p>
            Photos and videos from the Baharagora Champions League — the goals,
            the wickets, the celebrations and the fans who make it special.
          </p>

          <div className="media-stats">
            {mediaStats.map((s) => (
              <div key={s.label} className="media-stat">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTROLS */}
      <section className="media-controls">
        <div className="media-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={tab === "photos"}
            className={tab === "photos" ? "active" : ""}
            onClick={() => setTab("photos")}
          >
            <ImageIcon size={17} /> Photo Gallery
            <em>{filteredPhotos.length}</em>
          </button>
          <button
            role="tab"
            aria-selected={tab === "videos"}
            className={tab === "videos" ? "active" : ""}
            onClick={() => setTab("videos")}
          >
            <Video size={17} /> Video Gallery
            <em>{filteredVideos.length}</em>
          </button>
        </div>

        <div className="media-filters">
          {mediaCategories.map((c) => (
            <button
              key={c}
              className={category === c ? "active" : ""}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section className="media-content">
        {tab === "photos" && (
          <>
            {filteredPhotos.length === 0 ? (
              <p className="media-empty">No photos in this category yet.</p>
            ) : (
              <div className="photo-grid">
                {filteredPhotos.map((p, i) => (
                  <button
                    key={p.id}
                    className={`photo-card ${p.size}`}
                    onClick={() => setLightbox(i)}
                    aria-label={`Open ${p.title}`}
                  >
                    <div className="media-thumb">
                      <img src={p.src} alt={p.title} loading="lazy" />
                      <div className="photo-overlay">
                        <span className="photo-chip">{p.category}</span>
                        <Expand className="photo-expand" size={20} />
                        <div>
                          <h3>{p.title}</h3>
                          <small>{p.date}</small>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "videos" && (
          <>
            {filteredVideos.length === 0 ? (
              <p className="media-empty">No videos in this category yet.</p>
            ) : (
              <div className="video-grid" >
                {filteredVideos.map((v, i) => (
                  <button
                    key={v.id}
                    className={`video-card ${i === 0 ? "featured" : ""}`}
                    onClick={() => setActiveVideo(v)}
                    aria-label={`Play ${v.title}`}
                  >
                    <Thumb item={v}>
                      <span className="video-play">
                        <Play size={26} fill="currentColor" />
                      </span>
                      {v.duration && (
                        <span className="video-duration">
                          <Clock size={12} /> {v.duration}
                        </span>
                      )}
                    </Thumb>
                    <div className="video-info">
                      <span className="photo-chip dark">{v.category}</span>
                      <h3>{v.title}</h3>
                      {v.views && (
                        <small>
                          <Eye size={13} /> {v.views} views
                        </small>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* CTA */}
      <section className="media-cta">
        <h2>Want to be in the next gallery?</h2>
        <p>Register your team or yourself for the upcoming BCL season.</p>
        <Link to="/registration" className="media-cta-btn">
          Register Now
        </Link>
      </section>

      {/* LIGHTBOX */}
      {current && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button
            className="lightbox-close"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <X size={24} />
          </button>
          <button
            className="lightbox-nav left"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous photo"
          >
            <ChevronLeft size={30} />
          </button>
          <figure onClick={(e) => e.stopPropagation()}>
            {current.src ? (
              <img src={current.src} alt={current.title} />
            ) : (
              <div className={`lightbox-placeholder media-tone-${current.tone}`}>
                <span className="media-thumb-mark">BCL</span>
              </div>
            )}
            <figcaption>
              <div>
                <strong>{current.title}</strong>
                <span>
                  {current.category} • {current.date}
                </span>
              </div>
              <em>
                {lightbox + 1} / {filteredPhotos.length}
              </em>
            </figcaption>
          </figure>
          <button
            className="lightbox-nav right"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next photo"
          >
            <ChevronRight size={30} />
          </button>
        </div>
      )}

      {/* VIDEO MODAL */}
      {activeVideo && (
        <div className="lightbox" onClick={() => setActiveVideo(null)}>
          <button
            className="lightbox-close"
            onClick={() => setActiveVideo(null)}
            aria-label="Close"
          >
            <X size={24} />
          </button>
          <div className="video-modal" onClick={(e) => e.stopPropagation()}>
            <div className="video-frame youtube-player-container">
              {activeVideo.youtubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1`}
                  title={activeVideo.title}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : activeVideo.src ? (
                <video
                  src={activeVideo.src}
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  className="yt-styled-video"
                />
              ) : (
                <div className={`video-soon media-tone-${activeVideo.tone}`}>
                  <Play size={44} />
                  <p>Video coming soon</p>
                </div>
              )}
            </div>
            <div className="video-modal-info">
              <strong>{activeVideo.title}</strong>
              <span>
                {activeVideo.category} {activeVideo.views ? `• ${activeVideo.views} views` : ""}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Media;