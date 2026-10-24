
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import "./AdminHomepageContent.css";

const EMPTY_FORM = {
  content_type: "hero_slide",
  title: "",
  subtitle: "",
  description: "",
  button_text: "",
  button_url: "",
  media_url: "",
  sort_order: 1,
  is_active: false,
};

const CONTENT_TYPES = [
  { value: "hero_slide", label: "Hero slide" },
  { value: "announcement", label: "Announcement" },
  { value: "featured", label: "Featured content" },
];

function AdminHomepageContent() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  async function loadItems() {
    setLoading(true);

    const { data, error } = await supabase
      .from("homepage_content")
      .select("*")
      .order("content_type")
      .order("sort_order", { ascending: true });

    if (error) {
      setNotice(`Could not load content: ${error.message}`);
    } else {
      setItems(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadItems();
  }, []);

  function updateField(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox"
        ? checked
        : name === "sort_order"
          ? value === "" ? "" : Number(value)
          : value,
    }));
  }

  function resetForm() {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setNotice("");

    const payload = {
      ...form,
      sort_order: Number(form.sort_order) || 0,
      updated_at: new Date().toISOString(),
    };

    const result = editingId
      ? await supabase
          .from("homepage_content")
          .update(payload)
          .eq("id", editingId)
      : await supabase
          .from("homepage_content")
          .insert([payload]);

    if (result.error) {
      setNotice(`Save failed: ${result.error.message}`);
    } else {
      setNotice(editingId ? "Content updated." : "Content created.");
      resetForm();
      await loadItems();
    }

    setSaving(false);
  }

  function startEditing(item) {
    setForm({
      content_type: item.content_type,
      title: item.title || "",
      subtitle: item.subtitle || "",
      description: item.description || "",
      button_text: item.button_text || "",
      button_url: item.button_url || "",
      media_url: item.media_url || "",
      sort_order: item.sort_order ?? 0,
      is_active: item.is_active,
    });

    setEditingId(item.id);
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function toggleActive(item) {
    const { error } = await supabase
      .from("homepage_content")
      .update({
        is_active: !item.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", item.id);

    if (error) {
      setNotice(`Status update failed: ${error.message}`);
    } else {
      setNotice("Content visibility updated.");
      await loadItems();
    }
  }

  async function deleteItem(item) {
    if (!window.confirm(`Delete "${item.title || item.content_type}"?`)) {
      return;
    }

    const { error } = await supabase
      .from("homepage_content")
      .delete()
      .eq("id", item.id);

    if (error) {
      setNotice(`Delete failed: ${error.message}`);
    } else {
      if (editingId === item.id) resetForm();
      setNotice("Content deleted.");
      await loadItems();
    }
  }

  return (
    <main className="admin-home-content">
      <header className="admin-home-content-header">
        <div>
          <p className="admin-home-content-eyebrow">BCL WEBSITE CMS</p>
          <h1>Homepage Content</h1>
          <p>Manage hero slides, announcements and featured content.</p>
        </div>
      </header>

      {notice && (
        <p className="admin-home-content-notice" role="status">
          {notice}
        </p>
      )}

      <form className="admin-home-content-form" onSubmit={handleSubmit}>
        <h2>{editingId ? "Edit content" : "Create content"}</h2>

        <label>
          Content type
          <select
            name="content_type"
            value={form.content_type}
            onChange={updateField}
            required
          >
            {CONTENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Title
          <input
            name="title"
            value={form.title}
            onChange={updateField}
            required
            maxLength={200}
          />
        </label>

        <label>
          Subtitle
          <input
            name="subtitle"
            value={form.subtitle}
            onChange={updateField}
            maxLength={300}
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={updateField}
            rows={5}
          />
        </label>

        <div className="admin-home-content-grid">
          <label>
            Button text
            <input
              name="button_text"
              value={form.button_text}
              onChange={updateField}
            />
          </label>

          <label>
            Button URL
            <input
              name="button_url"
              value={form.button_url}
              onChange={updateField}
              placeholder="/cricket"
            />
          </label>
        </div>

        <label>
          Image or video URL
          <input
            name="media_url"
            value={form.media_url}
            onChange={updateField}
            placeholder="/media/photos/example.png"
          />
        </label>

        <label>
          Display order
          <input
            name="sort_order"
            type="number"
            value={form.sort_order}
            onChange={updateField}
            required
          />
        </label>

        <label className="admin-home-content-checkbox">
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={updateField}
          />
          Active (visible to public once connected)
        </label>

        <div className="admin-home-content-actions">
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Save changes" : "Create content"}
          </button>

          {editingId && (
            <button type="button" className="secondary" onClick={resetForm}>
              Cancel editing
            </button>
          )}
        </div>
      </form>

      <section className="admin-home-content-list">
        <h2>Saved content ({items.length})</h2>

        {loading ? (
          <p>Loading content...</p>
        ) : items.length === 0 ? (
          <p>No homepage content created yet.</p>
        ) : (
          items.map((item) => (
            <article className="admin-home-content-item" key={item.id}>
              <div>
                <span className="admin-home-content-type">
                  {CONTENT_TYPES.find((type) => type.value === item.content_type)?.label}
                </span>
                <h3>{item.title || "Untitled content"}</h3>
                {item.subtitle && <p>{item.subtitle}</p>}
                <small>
                  Order: {item.sort_order} · {item.is_active ? "Active" : "Hidden"}
                </small>
              </div>

              <div className="admin-home-content-item-actions">
                <button type="button" onClick={() => startEditing(item)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => toggleActive(item)}
                >
                  {item.is_active ? "Hide" : "Activate"}
                </button>
                <button
                  type="button"
                  className="danger"
                  onClick={() => deleteItem(item)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

export default AdminHomepageContent;
