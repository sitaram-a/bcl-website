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
  ArrowUpRight,
  Trophy,
} from "lucide-react";

import { photos, videos, mediaCategories } from "../data/media";
import { supabase } from "../lib/supabase";
import "./Media.css";

function Thumb({ item, children }) {
  if (item.thumb) {
    return (
      <div className="media-thumb">
        <img src={item.thumb} alt={item.title} loading="lazy" />
        {children}
      </div>
    );
  }

  if (item.youtubeId) {
    return (
      <div className="media-thumb media-thumb-placeholder">
        <span className="media-thumb-mark">BCL</span>
        {children}
      </div>
    );
  }

  if (item.src) {
    return (
      <div className="media-thumb">
        <video src={item.src} muted playsInline preload="metadata" />
        {children}
      </div>
    );
  }

  return (
    <div className={`media-thumb media-tone-${item.tone ?? 5}`}>
      <span className="media-thumb-mark">BCL</span>
      {children}
    </div>
  );
}

function Media() {
  const [tab, setTab] = useState("photos");
  const [category, setCategory] = useState("All");
  const [lightbox, setLightbox] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [supabaseMedia, setSupabaseMedia] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadPublishedMedia() {
      setMediaLoading(true);

      try {
        const { data, error } = await supabase
          .from("bcl_media")
          .select(
            "id, title, description, media_type, category, public_url, thumbnail_url, placement, is_published, sort_order, created_at, card_size"
          )
          .eq("is_published", true)
          .contains("placement", ["media"])
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (cancelled) return;

        const mapped = (data || [])
          .filter((item) => item.public_url)
          .map((item) => {
            const date = item.created_at
              ? new Date(item.created_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "BCL";

            return {
              id: `supabase-${item.id}`,
              title: item.title || "BCL Media",
              description: item.description || "",
              category: item.category || "General",
              date,
              tone: 5,
              src: item.public_url,
              thumb: item.thumbnail_url || undefined,
              isSupabase: true,
              mediaType: item.media_type,
              size: ["square", "tall", "wide", "large"].includes(item.card_size)
                ? item.card_size
                : "square",
              duration: "",
              views: "",
            };
          });

        setSupabaseMedia(mapped);
      } catch (error) {
        console.error("Unable to load published BCL media:", error);
        if (!cancelled) setSupabaseMedia([]);
      } finally {
        if (!cancelled) setMediaLoading(false);
      }
    }

    loadPublishedMedia();

    return () => {
      cancelled = true;
    };
  }, []);

  const remotePhotos = useMemo(
    () => supabaseMedia.filter((item) => item.mediaType === "image"),
    [supabaseMedia]
  );

  const remoteVideos = useMemo(
    () => supabaseMedia.filter((item) => item.mediaType === "video"),
    [supabaseMedia]
  );

  const allPhotos = useMemo(
    () => [...remotePhotos, ...photos],
    [remotePhotos]
  );

  const allVideos = useMemo(
    () => [...remoteVideos, ...videos],
    [remoteVideos]
  );

  const allCategories = useMemo(
    () => [
      "All",
      ...new Set([
        ...mediaCategories.filter((item) => item !== "All"),
        ...supabaseMedia.map((item) => item.category).filter(Boolean),
      ]),
    ],
    [supabaseMedia]
  );

  const filteredPhotos = useMemo(
    () =>
      allPhotos.filter(
        (item) => category === "All" || item.category === category
      ),
    [allPhotos, category]
  );

  const filteredVideos = useMemo(
    () =>
      allVideos.filter(
        (item) => category === "All" || item.category === category
      ),
    [allVideos, category]
  );

  const currentMediaStats = useMemo(
    () => [
      { label: "Photos", value: allPhotos.length },
      { label: "Videos", value: allVideos.length },
      { label: "Seasons", value: "05" },
      { label: "League", value: "BCL" },
    ],
    [allPhotos.length, allVideos.length]
  );

  const next = useCallback(() => {
    setLightbox((index) =>
      filteredPhotos.length ? (index + 1) % filteredPhotos.length : null
    );
  }, [filteredPhotos.length]);

  const prev = useCallback(() => {
    setLightbox((index) =>
      filteredPhotos.length
        ? (index - 1 + filteredPhotos.length) % filteredPhotos.length
        : null
    );
  }, [filteredPhotos.length]);

  const closeOverlays = useCallback(() => {
    setLightbox(null);
    setActiveVideo(null);
  }, []);

  useEffect(() => {
    if (lightbox === null && !activeVideo) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") closeOverlays();
      if (lightbox !== null && event.key === "ArrowRight") next();
      if (lightbox !== null && event.key === "ArrowLeft") prev();
    };

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightbox, activeVideo, closeOverlays, next, prev]);

  const currentPhoto = lightbox !== null ? filteredPhotos[lightbox] : null;

  const getPhotoSize = (item) =>
    ["square", "tall", "wide", "large"].includes(item.size)
      ? item.size
      : "square";

  const getVideoSize = (item, index) => {
    const size = item.size;

    // Make the first default-sized video the cinematic featured card.
    if (index === 0 && (!size || size === "square")) return "featured";

    return ["square", "tall", "wide", "large"].includes(size)
      ? size
      : "square";
  };

  return (
    <main className="media-page">
      <div className="media-ambient media-ambient-one" />
      <div className="media-ambient media-ambient-two" />

      {/* HERO */}
      <section className="media-hero">
        <div className="media-hero-grid" />

        <div className="media-hero-inner">
          <div className="media-kicker">
            <span className="media-kicker-icon">
              <Camera size={15} />
            </span>
            BAHARAGORA CHAMPIONS LEAGUE
          </div>

          <h1>
            The Game.
            <br />
            <span>Beyond the Moment.</span>
          </h1>

          <p className="media-hero-description">
            Relive the goals, the wickets, the celebrations, and the people who
            make every BCL season unforgettable.
          </p>

          <div className="media-hero-actions">
            <button
              className="media-primary-action"
              onClick={() => {
                setTab("photos");
                document
                  .querySelector(".media-gallery-section")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              <ImageIcon size={17} />
              Explore gallery
              <ArrowUpRight size={16} />
            </button>

            <span className="media-live-indicator">
              <span />
              THE BCL ARCHIVE
            </span>
          </div>

          <div className="media-stats">
            {currentMediaStats.map((stat) => (
              <div className="media-stat" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="media-hero-emblem" aria-hidden="true">
          <div className="media-emblem-ring">
           <div className="media-emblem">
  <img
    src="src/assets/logo/bcl-cricket-logo.png"
    alt="Baharagora Champions League logo"
    className="media-bcl-logo"
  />
</div>
          </div>
        </div>

        <div className="media-hero-bottom">
          <span>PASSION · PRIDE · PERFORMANCE</span>
          <span>BAHARAGORA, JHARKHAND</span>
        </div>
      </section>

      {/* GALLERY CONTROLS */}
      <section className="media-gallery-section">
        <div className="media-section-heading">
          <div>
            <span className="media-section-eyebrow">THE COLLECTION</span>
            <h2>
              BCL <span>Media Vault</span>
            </h2>
            <p>Every frame tells a story.</p>
          </div>

          <div className="media-heading-count">
            <span className="media-count-dot" />
            {tab === "photos" ? filteredPhotos.length : filteredVideos.length}{" "}
            ITEMS
          </div>
        </div>

        <div className="media-toolbar">
          <div className="media-tabs" role="tablist" aria-label="Media type">
            <button
              role="tab"
              aria-selected={tab === "photos"}
              className={tab === "photos" ? "active" : ""}
              onClick={() => {
                setTab("photos");
                setLightbox(null);
              }}
            >
              <ImageIcon size={17} />
              Photo Gallery
              <em>{allPhotos.length}</em>
            </button>

            <button
              role="tab"
              aria-selected={tab === "videos"}
              className={tab === "videos" ? "active" : ""}
              onClick={() => {
                setTab("videos");
                setLightbox(null);
              }}
            >
              <Video size={17} />
              Video Gallery
              <em>{allVideos.length}</em>
            </button>
          </div>

          <div className="media-filters" aria-label="Filter by category">
            {allCategories.map((item) => (
              <button
                key={item}
                className={category === item ? "active" : ""}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {mediaLoading && (
          <div className="media-loading">
            <span className="media-loading-spinner" />
            Loading the BCL archive…
          </div>
        )}

        {/* PHOTOS */}
        {tab === "photos" && (
          <div className="media-gallery-content">
            {filteredPhotos.length === 0 ? (
              <div className="media-empty">
                <ImageIcon size={32} />
                <h3>No photos yet</h3>
                <p>There are no photos in this category right now.</p>
              </div>
            ) : (
              <div className="photo-grid">
                {filteredPhotos.map((photo, index) => (
                  <button
                    key={photo.id}
                    type="button"
                    className={`photo-card ${getPhotoSize(photo)}`}
                    onClick={() => setLightbox(index)}
                    aria-label={`Open photo: ${photo.title}`}
                    style={{ "--card-index": index }}
                  >
                    <div className="media-thumb">
                      {photo.src ? (
                        <img
                          src={photo.src}
                          alt={photo.title}
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className={`media-thumb-placeholder media-tone-${photo.tone ?? 5}`}
                        >
                          <span className="media-thumb-mark">BCL</span>
                        </div>
                      )}

                      <div className="photo-overlay">
                        <span className="photo-chip">{photo.category}</span>
                        <span className="photo-expand">
                          <Expand size={17} />
                        </span>
                        <div className="photo-caption">
                          <h3>{photo.title}</h3>
                          <small>{photo.date || "BCL Archive"}</small>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIDEOS */}
        {tab === "videos" && (
          <div className="media-gallery-content">
            {filteredVideos.length === 0 ? (
              <div className="media-empty">
                <Video size={32} />
                <h3>No videos yet</h3>
                <p>There are no videos in this category right now.</p>
              </div>
            ) : (
              <div className="video-grid">
                {filteredVideos.map((video, index) => (
                  <button
                    key={video.id}
                    type="button"
                    className={`video-card ${getVideoSize(video, index)}`}
                    onClick={() => setActiveVideo(video)}
                    aria-label={`Play video: ${video.title}`}
                    style={{ "--card-index": index }}
                  >
                    <div className="video-visual">
                      <Thumb item={video}>
                        <span className="video-play">
                          <Play size={23} fill="currentColor" />
                        </span>

                        {video.duration && (
                          <span className="video-duration">
                            <Clock size={12} />
                            {video.duration}
                          </span>
                        )}
                      </Thumb>
                      <span className="video-corner-mark">BCL / FILMS</span>
                    </div>

                    <div className="video-info">
                      <span className="photo-chip dark">
                        {video.category || "BCL"}
                      </span>

                      <h3>{video.title}</h3>

                      <div className="video-meta">
                        {video.views && (
                          <small>
                            <Eye size={13} />
                            {video.views} views
                          </small>
                        )}
                        <span className="video-watch-link">
                          Watch film <ArrowUpRight size={13} />
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* CALL TO ACTION */}
      <section className="media-cta">
        <div className="media-cta-glow" />
        <div className="media-cta-content">
          <span className="media-section-eyebrow">YOUR MOMENT IS NEXT</span>
          <h2>
            Be part of the <span>next chapter.</span>
          </h2>
          <p>
            Bring your team, bring your passion, and make your own BCL memories.
          </p>
          <Link to="/registration" className="media-cta-btn">
            Register for BCL
            <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="media-cta-watermark" aria-hidden="true">
          BCL
        </div>
      </section>

      {/* PHOTO LIGHTBOX */}
      {currentPhoto && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setLightbox(null)}
            aria-label="Close photo"
          >
            <X size={23} />
          </button>

          <button
            type="button"
            className="lightbox-nav left"
            onClick={(event) => {
              event.stopPropagation();
              prev();
            }}
            aria-label="Previous photo"
          >
            <ChevronLeft size={29} />
          </button>

          <figure
            className="lightbox-figure"
            onClick={(event) => event.stopPropagation()}
          >
            {currentPhoto.src ? (
              <img src={currentPhoto.src} alt={currentPhoto.title} />
            ) : (
              <div
                className={`lightbox-placeholder media-tone-${currentPhoto.tone ?? 5}`}
              >
                <span className="media-thumb-mark">BCL</span>
              </div>
            )}

            <figcaption>
              <div>
                <strong>{currentPhoto.title}</strong>
                <span>
                  {currentPhoto.category} · {currentPhoto.date || "BCL Archive"}
                </span>
              </div>
              <em>
                {lightbox + 1} / {filteredPhotos.length}
              </em>
            </figcaption>
          </figure>

          <button
            type="button"
            className="lightbox-nav right"
            onClick={(event) => {
              event.stopPropagation();
              next();
            }}
            aria-label="Next photo"
          >
            <ChevronRight size={29} />
          </button>
        </div>
      )}

      {/* VIDEO MODAL */}
      {activeVideo && (
        <div className="lightbox video-lightbox" onClick={closeOverlays}>
          <button
            type="button"
            className="lightbox-close"
            onClick={closeOverlays}
            aria-label="Close video"
          >
            <X size={23} />
          </button>

          <div
            className="video-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="video-frame">
              {activeVideo.youtubeId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                  title={activeVideo.title}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              ) : activeVideo.src ? (
                <video
                  src={activeVideo.src}
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                />
              ) : (
                <div
                  className={`video-soon media-tone-${activeVideo.tone ?? 5}`}
                >
                  <Play size={42} />
                  <p>Video coming soon</p>
                </div>
              )}
            </div>

            <div className="video-modal-info">
              <span className="media-section-eyebrow">BCL FILM ARCHIVE</span>
              <strong>{activeVideo.title}</strong>
              <span>
                {activeVideo.category || "BCL"}
                {activeVideo.views ? ` · ${activeVideo.views} views` : ""}
              </span>
              {activeVideo.description && <p>{activeVideo.description}</p>}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Media;