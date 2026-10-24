
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
// import Navbar from "../components/Navbar";

import "./WebsitePage.css";

function WebsitePage() {
  const { slug } = useParams();

  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadPage() {
      setLoading(true);
      setError("");
      setPage(null);

      const { data, error } = await supabase
        .from("website_pages")
        .select("id, slug, title, content, meta_description")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error("Unable to load website page:", error);
        setError("Unable to load this page right now. Please try again later.");
      } else if (!data) {
        setError("This page was not found or is not published.");
      } else {
        setPage(data);
      }

      setLoading(false);
    }

    loadPage();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <div className="website-page">
      {/* <Navbar /> */}

      <main className="website-page-main">
        {loading ? (
          <p className="website-page-message">Loading page...</p>
        ) : error ? (
          <section className="website-page-message">
            <h1>Page unavailable</h1>
            <p>{error}</p>
            <Link to="/" className="website-page-home-link">
              Back to Home
            </Link>
          </section>
        ) : (
          <article className="website-page-article">
            <p className="website-page-eyebrow">
              Baharagora Champions League
            </p>

            <h1>{page.title}</h1>

            <div className="website-page-content">
              {page.content.split(/\r?\n/).map((paragraph, index) =>
                paragraph.trim() ? (
                  <p key={index}>{paragraph}</p>
                ) : null
              )}
            </div>
          </article>
        )}
      </main>
    </div>
  );
}

export default WebsitePage;
