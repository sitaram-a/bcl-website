
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Save, Pencil, Trash2, Eye, EyeOff, RefreshCw } from "lucide-react";
import { supabase } from "../../lib/supabase";
import "./AdminWebsitePages.css";

const EMPTY_FORM = {
  slug: "",
  title: "",
  content: "",
  meta_description: "",
  is_published: false,
  sort_order: 0,
};

export default function AdminWebsitePages() {
  const [pages, setPages] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadPages = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError) throw authError;
      if (!authData.user) {
        throw new Error("Please sign in with your administrator account.");
      }

      const { data: membership, error: membershipError } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", authData.user.id)
        .maybeSingle();

      if (membershipError) throw membershipError;
      if (!membership) {
        throw new Error("Access denied. Administrator access is required.");
      }

      const { data, error: queryError } = await supabase
        .from("website_pages")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (queryError) throw queryError;
      setPages(data || []);
    } catch (err) {
      setError(err.message || "Unable to load website pages.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPages();
  }, [loadPages]);

  function updateField(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : name === "sort_order"
            ? value === "" ? "" : Number(value)
            : value,
    }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError("");
    setNotice("");
  }

  function startEditing(page) {
    setForm({
      slug: page.slug,
      title: page.title,
      content: page.content || "",
      meta_description: page.meta_description || "",
      is_published: page.is_published,
      sort_order: page.sort_order ?? 0,
    });
    setEditingId(page.id);
    setError("");
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    const slug = form.slug
      .trim()
      .toLowerCase()
      .replace(/^\/+|\/+$/g, "");

    const title = form.title.trim();
    const sortOrder = Number(form.sort_order);

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      setError("Use a URL slug such as about, contact, or tournament-rules.");
      return;
    }

    if (!title) {
      setError("Please enter a page title.");
      return;
    }

    if (!Number.isInteger(sortOrder) || sortOrder < 0) {
      setError("Display order must be a whole number of 0 or greater.");
      return;
    }

    setSaving(true);

    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError) throw authError;
      if (!authData.user) throw new Error("Your session has expired.");

      const { data: membership, error: membershipError } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", authData.user.id)
        .maybeSingle();

      if (membershipError) throw membershipError;
      if (!membership) throw new Error("Administrator access is required.");

      const payload = {
        slug,
        title,
        content: form.content,
        meta_description: form.meta_description.trim(),
        is_published: form.is_published,
        sort_order: sortOrder,
        updated_at: new Date().toISOString(),
      };

      const result = editingId
        ? await supabase
            .from("website_pages")
            .update(payload)
            .eq("id", editingId)
        : await supabase.from("website_pages").insert(payload);

      if (result.error) throw result.error;

      setNotice(editingId ? "Website page updated." : "Website page created.");
      resetForm();
      setNotice(editingId ? "Website page updated." : "Website page created.");
      await loadPages();
    } catch (err) {
      setError(err.message || "Unable to save the page.");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(page) {
    setError("");
    setNotice("");

    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError) throw authError;
      if (!authData.user) throw new Error("Please sign in again.");

      const { data: membership, error: membershipError } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", authData.user.id)
        .maybeSingle();

      if (membershipError) throw membershipError;
      if (!membership) throw new Error("Administrator access is required.");

      const { error: updateError } = await supabase
        .from("website_pages")
        .update({
          is_published: !page.is_published,
          updated_at: new Date().toISOString(),
        })
        .eq("id", page.id);

      if (updateError) throw updateError;

      setNotice(
        page.is_published ? "Page unpublished." : "Page published."
      );
      await loadPages();
    } catch (err) {
      setError(err.message || "Unable to change publication status.");
    }
  }

  async function deletePage(page) {
    if (!window.confirm(`Permanently delete "${page.title}"?`)) return;

    setError("");
    setNotice("");

    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError) throw authError;
      if (!authData.user) throw new Error("Please sign in again.");

      const { data: membership, error: membershipError } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", authData.user.id)
        .maybeSingle();

      if (membershipError) throw membershipError;
      if (!membership) throw new Error("Administrator access is required.");

      const { error: deleteError } = await supabase
        .from("website_pages")
        .delete()
        .eq("id", page.id);

      if (deleteError) throw deleteError;

      if (editingId === page.id) resetForm();
      setNotice("Website page deleted.");
      await loadPages();
    } catch (err) {
      setError(err.message || "Unable to delete the page.");
    }
  }

  return (
    <main className="website-pages-admin">
      <header className="website-pages-header">
        <div>
          <p className="website-pages-eyebrow">BCL WEBSITE CMS</p>
          <h1>Website Pages</h1>
          <p>Create and manage editable website page content.</p>
        </div>
        <Link to="/admin" className="website-pages-back">
          <ArrowLeft size={17} /> Dashboard
        </Link>
      </header>

      {error && <p className="website-pages-message error" role="alert">{error}</p>}
      {notice && <p className="website-pages-message success" role="status">{notice}</p>}

      <section className="website-pages-panel">
        <h2>{editingId ? "Edit website page" : "Create website page"}</h2>

        <form onSubmit={handleSubmit} className="website-pages-form">
          <label>
            Page title
            <input
              name="title"
              value={form.title}
              onChange={updateField}
              placeholder="About BCL"
              required
            />
          </label>

          <label>
            URL slug
            <input
              name="slug"
              value={form.slug}
              onChange={updateField}
              placeholder="about"
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              title="Use lowercase letters, numbers, and single hyphens."
              required
            />
            <small>Slug: about, contact, tournament-rules</small>
          </label>

          <label>
            Page content
            <textarea
              name="content"
              value={form.content}
              onChange={updateField}
              rows={10}
              placeholder="Write the page content here..."
            />
          </label>

          <label>
            SEO meta description
            <textarea
              name="meta_description"
              value={form.meta_description}
              onChange={updateField}
              rows={3}
              maxLength={320}
              placeholder="Short summary for search engines"
            />
          </label>

          <label>
            Display order
            <input
              name="sort_order"
              type="number"
              min="0"
              step="1"
              value={form.sort_order}
              onChange={updateField}
              required
            />
          </label>

          <label className="website-pages-publish">
            <input
              name="is_published"
              type="checkbox"
              checked={form.is_published}
              onChange={updateField}
            />
            Publish this page
          </label>

          <div className="website-pages-actions">
            <button type="submit" disabled={saving}>
              <Save size={16} /> {saving ? "Saving..." : editingId ? "Save changes" : "Create page"}
            </button>
            {editingId && (
              <button type="button" className="secondary" onClick={resetForm} disabled={saving}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="website-pages-panel">
        <div className="website-pages-list-heading">
          <h2>Existing pages ({pages.length})</h2>
          <button type="button" className="secondary" onClick={loadPages} disabled={loading}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {loading ? (
          <p>Loading pages...</p>
        ) : pages.length === 0 ? (
          <p>No website pages created yet.</p>
        ) : (
          <div className="website-pages-list">
            {pages.map((page) => (
              <article key={page.id} className="website-page-row">
                <div className="website-page-details">
                  <h3>{page.title}</h3>
                  <p>/{page.slug} · Order {page.sort_order}</p>
                  <span className={page.is_published ? "published" : "unpublished"}>
                    {page.is_published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="website-page-actions">
                  <button type="button" onClick={() => startEditing(page)} disabled={saving}>
                    <Pencil size={15} /> Edit
                  </button>
                  <button type="button" onClick={() => togglePublished(page)} disabled={saving}>
                    {page.is_published ? <EyeOff size={15} /> : <Eye size={15} />}
                    {page.is_published ? "Unpublish" : "Publish"}
                  </button>
                  <button type="button" className="delete" onClick={() => deletePage(page)} disabled={saving}>
                    <Trash2 size={15} /> Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
