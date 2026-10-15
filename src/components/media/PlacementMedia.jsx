import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import "./PlacementMedia.css";

const PLACEMENT_LABELS = {
  home: "From the BCL Gallery",
  football: "BCL Football Gallery",
  cricket: "BCL Cricket Gallery",
};

export default function PlacementMedia({ placement, limit = 6 }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadMedia() {
      setLoading(true);
      setError("");

      const { data, error: queryError } = await supabase
        .from("bcl_media")
        .select(
          "id,title,description,media_type,category,public_url,thumbnail_url,placement,is_published,sort_order,created_at"
        )
        .eq("is_published", true)
        .contains("placement", [placement])
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false })
        .limit(limit);

      if (!active) return;

      if (queryError) {
        console.error(`Unable to load ${placement} media:`, queryError);
        setError("Media is temporarily unavailable.");
        setItems([]);
      } else {
        setItems(data || []);
      }
      setLoading(false);
    }

    if (placement) loadMedia();
    return () => {
      active = false;
    };
  }, [placement, limit]);

  if (!loading && !error && items.length === 0) return null;

  return (
    <section className={`placement-media placement-media--${placement}`}>
      <div className="placement-media__heading">
        <div>
          <span className="placement-media__eyebrow">BCL MOMENTS</span>
          <h2>{PLACEMENT_LABELS[placement] || "BCL Media"}</h2>
        </div>
        <a href="/media" className="placement-media__more">
          View all media <span aria-hidden="true">→</span>
        </a>
      </div>

      {loading ? (
        <p className="placement-media__status" role="status">Loading gallery…</p>
      ) : error ? (
        <p className="placement-media__status" role="status">{error}</p>
      ) : (
        <div className="placement-media__grid">
          {items.map((item) => {
            const preview = item.thumbnail_url || item.public_url;
            const isVideo = item.media_type === "video";

            return (
              <a
                className="placement-media__card"
                href={item.public_url}
                key={item.id}
                target="_blank"
                rel="noreferrer"
                aria-label={`${item.title || "BCL media"} — open ${isVideo ? "video" : "image"}`}
              >
                <div className="placement-media__visual">
                  {isVideo ? (
                    <>
                      {preview && <img src={preview} alt="" loading="lazy" />}
                      <span className="placement-media__play" aria-hidden="true">▶</span>
                      <span className="placement-media__type">VIDEO</span>
                    </>
                  ) : (
                    <img
                      src={preview}
                      alt={item.title || "BCL gallery image"}
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="placement-media__caption">
                  <strong>{item.title || "BCL moment"}</strong>
                  {item.description && <p>{item.description}</p>}
                </div>
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}
