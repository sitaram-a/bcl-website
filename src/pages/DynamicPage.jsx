import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import CricketNavbar from "../components/cricket/CricketNavbar";
import "./DynamicPage.css";

export default function DynamicPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadPage() {
      setLoading(true);
      setError("");

      try {
        const { data, error: queryError } = await supabase
          .from("website_pages")
          .select("*")
          .eq("slug", slug || "about")
          .eq("is_published", true)
          .maybeSingle();

        if (queryError) throw queryError;
        if (!data) {
          setError("Page not found or is currently unpublished.");
        } else if (active) {
          setPage(data);
        }
      } catch (err) {
        setError(err.message || "Unable to load page content.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPage();

    return () => {
      active = false;
    };
  }, [slug]);

  // Decodes encoded HTML entities (&lt;p&gt; -> <p>) stored in the database
  const decodeHtmlEntities = (text) => {
    if (!text) return "";
    const textArea = document.createElement("textarea");
    textArea.innerHTML = text;
    return textArea.value;
  };

  return (
    <>
      <CricketNavbar />
      <main className="dynamic-page">
        <div className="dynamic-container">
          {loading ? (
            <p className="dynamic-message">Loading page...</p>
          ) : error ? (
            <div className="dynamic-card error-card">
              <h1>Page Not Found</h1>
              <p>{error}</p>
              <Link to="/" className="dynamic-btn">Back to Home</Link>
            </div>
          ) : page ? (
            <article className="dynamic-card">
              <header className="dynamic-header">
                <span className="dynamic-badge">BCL TOURNAMENT</span>
                <h1>{page.title}</h1>
              </header>
              
              {/* Properly decodes and renders HTML content */}
              <div 
                className="dynamic-content-html"
                dangerouslySetInnerHTML={{ 
                  __html: decodeHtmlEntities(page.content) 
                }}
              />

              <footer className="dynamic-footer">
                <Link to="/" className="dynamic-btn secondary">← Back to Home</Link>
              </footer>
            </article>
          ) : null}
        </div>
      </main>
    </>
  );
}