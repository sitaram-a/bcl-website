
import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  ImagePlus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  RefreshCw,
  Upload,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./AdminPosters.css";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

const EMPTY_FORM = {
  title: "",
  image_url: "",
  category: "team",
  sort_order: 1,
  is_active: true,
};

export default function AdminPosters() {
  const [posters, setPosters] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadPosters = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;

      if (!user) {
        setIsAdmin(false);
        setError("Please sign in with an administrator account.");
        return;
      }

      const { data: membership, error: membershipError } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (membershipError) throw membershipError;

      if (!membership) {
        setIsAdmin(false);
        setError("Access denied. Your account is not an administrator.");
        return;
      }

      setIsAdmin(true);

      const { data, error: postersError } = await supabase
        .from("site_content")
        .select(
          "id, title, image_url, category, sort_order, is_active, created_at, updated_at"
        )
        .eq("section", "home_posters")
        .order("sort_order", { ascending: true });

      if (postersError) throw postersError;

      setPosters(data || []);
    } catch (err) {
      console.error("Failed to load posters:", err);
      setError(err.message || "Failed to load posters.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosters();
  }, [loadPosters]);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  function updateField(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : name === "sort_order"
            ? value === ""
              ? ""
              : Number(value)
            : value,
    }));
  }

  function resetForm() {
    setForm({
      ...EMPTY_FORM,
      sort_order:
        posters.length > 0
          ? Math.max(...posters.map((poster) => poster.sort_order || 0)) + 1
          : 1,
    });

    setEditingId(null);
    setSelectedFile(null);
    setError("");
    setNotice("");

    const fileInput = document.getElementById("poster-file-input");
    if (fileInput) fileInput.value = "";
  }

  function startEditing(poster) {
    setForm({
      title: poster.title,
      image_url: poster.image_url,
      category: poster.category || "team",
      sort_order: poster.sort_order ?? 0,
      is_active: poster.is_active,
    });

    setEditingId(poster.id);
    setSelectedFile(null);
    setError("");
    setNotice("");

    const fileInput = document.getElementById("poster-file-input");
    if (fileInput) fileInput.value = "";

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    setError("");
    setNotice("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Choose a JPG, PNG, or WebP image.");
      event.target.value = "";
      setSelectedFile(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("The image must be 5 MB or smaller.");
      event.target.value = "";
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  }

  async function uploadPosterImage(file) {
    const originalExtension = file.name.split(".").pop()?.toLowerCase();
    const extension = ALLOWED_EXTENSIONS.includes(originalExtension)
      ? originalExtension
      : file.type === "image/png"
        ? "png"
        : file.type === "image/webp"
          ? "webp"
          : "jpg";

    const filePath = `posters/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("bcl-media")
      .upload(filePath, file, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("bcl-media")
      .getPublicUrl(filePath);

    if (!data?.publicUrl) {
      throw new Error("The image uploaded, but its public URL could not be created.");
    }

    return data.publicUrl;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!isAdmin) {
      setError("You do not have permission to manage posters.");
      return;
    }

    const title = form.title.trim();
    const sortOrder = Number(form.sort_order);

    if (!title) {
      setError("Please enter a poster title.");
      return;
    }

    if (!selectedFile && !form.image_url.trim()) {
      setError("Please select an image file.");
      return;
    }

    if (!Number.isInteger(sortOrder) || sortOrder < 0) {
      setError(
        "Display order must be a whole number greater than or equal to 0."
      );
      return;
    }

    setSaving(true);
    setUploadProgress(Boolean(selectedFile));

    let uploadedImageUrl = null;

    try {
      // Re-check the current session before attempting any changes.
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;
      if (!user) throw new Error("Your session has expired. Please sign in again.");

      const { data: membership, error: membershipError } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (membershipError) throw membershipError;
      if (!membership) throw new Error("Administrator access is required.");

      let imageUrl = form.image_url.trim();

      if (selectedFile) {
        imageUrl = await uploadPosterImage(selectedFile);
        uploadedImageUrl = imageUrl;
      }

      const payload = {
        section: "home_posters",
        title,
        image_url: imageUrl,
        category: form.category,
        sort_order: sortOrder,
        is_active: form.is_active,
        updated_at: new Date().toISOString(),
      };

      let result;

      if (editingId) {
        result = await supabase
          .from("site_content")
          .update(payload)
          .eq("id", editingId)
          .eq("section", "home_posters");
      } else {
        result = await supabase.from("site_content").insert(payload);
      }

      if (result.error) throw result.error;

      setNotice(
        editingId
          ? "Poster updated successfully."
          : "Poster added successfully."
      );

      resetForm();
      await loadPosters();
    } catch (err) {
      console.error("Failed to save poster:", err);

      if (uploadedImageUrl) {
        setError(
          `${err.message || "Failed to save poster."} The image may already be uploaded to Storage; check before trying again.`
        );
      } else {
        setError(err.message || "Failed to save poster.");
      }
    } finally {
      setSaving(false);
      setUploadProgress(false);
    }
  }

  async function togglePublished(poster) {
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
        .from("site_content")
        .update({
          is_active: !poster.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq("id", poster.id)
        .eq("section", "home_posters");

      if (updateError) throw updateError;

      setNotice(
        poster.is_active
          ? "Poster hidden from the homepage."
          : "Poster published to the homepage."
      );

      await loadPosters();
    } catch (err) {
      setError(err.message || "Could not change poster status.");
    }
  }

  async function deletePoster(poster) {
    const confirmed = window.confirm(
      `Delete "${poster.title}" permanently? This cannot be undone.`
    );

    if (!confirmed) return;

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
        .from("site_content")
        .delete()
        .eq("id", poster.id)
        .eq("section", "home_posters");

      if (deleteError) throw deleteError;

      if (editingId === poster.id) resetForm();

      setNotice("Poster record deleted. Its Storage image was not deleted.");
      await loadPosters();
    } catch (err) {
      setError(err.message || "Could not delete poster.");
    }
  }

  if (loading) {
    return (
      <div className="poster-admin-page">
        <p className="poster-admin-status">Loading poster management…</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="poster-admin-page">
        <div className="poster-admin-header">
          <h1>Poster Management</h1>
          <Link to="/admin" className="poster-admin-back">
            <ArrowLeft size={17} />
            Dashboard
          </Link>
        </div>

        <p className="poster-admin-message error" role="alert">
          {error || "Administrator access is required."}
        </p>
      </div>
    );
  }

  return (
    <main className="poster-admin-page">
      <header className="poster-admin-header">
        <div>
          <p className="poster-admin-eyebrow">BCL WEBSITE CMS</p>
          <h1>Poster Management</h1>
          <p className="poster-admin-subtitle">
            Upload and manage posters shown in the homepage slider.
          </p>
        </div>

        <Link to="/admin" className="poster-admin-back">
          <ArrowLeft size={17} />
          Dashboard
        </Link>
      </header>

      <div className="poster-admin-stats">
        <div>
          <span>Total posters</span>
          <strong>{posters.length}</strong>
        </div>
        <div>
          <span>Published</span>
          <strong>{posters.filter((poster) => poster.is_active).length}</strong>
        </div>
        <div>
          <span>Hidden</span>
          <strong>{posters.filter((poster) => !poster.is_active).length}</strong>
        </div>
      </div>

      {error && (
        <p className="poster-admin-message error" role="alert">
          {error}
        </p>
      )}

      {notice && (
        <p className="poster-admin-message success" role="status">
          {notice}
        </p>
      )}

      <section className="poster-admin-form-section">
        <div className="poster-admin-section-heading">
          <ImagePlus size={22} />
          <h2>{editingId ? "Edit poster" : "Add a new poster"}</h2>
        </div>

        <form className="poster-admin-form" onSubmit={handleSubmit}>
          <label>
            Poster title
            <input
              name="title"
              value={form.title}
              onChange={updateField}
              placeholder="e.g. Baharagora Kings"
              required
            />
          </label>

          <label>
            Choose poster image
            <input
              id="poster-file-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              disabled={saving}
            />
            <span className="poster-admin-field-help">
              JPG, PNG, or WebP · Maximum 5 MB
            </span>
          </label>

          {selectedFile && previewUrl && (
            <div className="poster-admin-preview">
              <span>Selected file: {selectedFile.name}</span>
              <img src={previewUrl} alt="Selected poster preview" />
            </div>
          )}

          {!selectedFile && editingId && form.image_url && (
            <div className="poster-admin-preview">
              <span>Current image</span>
              <img src={form.image_url} alt="Current poster" />
            </div>
          )}

          <div className="poster-admin-form-row">
            <label>
              Category
              <select
                name="category"
                value={form.category}
                onChange={updateField}
              >
                <option value="team">Team</option>
                <option value="announcement">Announcement</option>
                <option value="event">Event</option>
                <option value="other">Other</option>
              </select>
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
          </div>

          <label className="poster-admin-checkbox">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={updateField}
            />
            Publish this poster on the homepage
          </label>

          <div className="poster-admin-form-actions">
            <button type="submit" disabled={saving}>
              {uploadProgress ? (
                <>
                  <Upload size={17} />
                  Uploading image…
                </>
              ) : saving ? (
                <>
                  <Save size={17} />
                  Saving…
                </>
              ) : (
                <>
                  <Save size={17} />
                  {editingId ? "Save changes" : "Upload and add poster"}
                </>
              )}
            </button>

            {editingId && (
              <button
                type="button"
                className="poster-admin-cancel"
                onClick={resetForm}
                disabled={saving}
              >
                <X size={17} />
                Cancel editing
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="poster-admin-list-section">
        <div className="poster-admin-section-heading">
          <ImagePlus size={22} />
          <h2>Homepage posters</h2>

          <button
            type="button"
            className="poster-admin-refresh"
            onClick={loadPosters}
            title="Refresh posters"
            disabled={loading || saving}
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {posters.length === 0 ? (
          <p className="poster-admin-empty">
            No homepage posters found. Add your first poster above.
          </p>
        ) : (
          <div className="poster-admin-grid">
            {posters.map((poster) => (
              <article className="poster-admin-card" key={poster.id}>
                <div className="poster-admin-image-wrap">
                  <img
                    src={poster.image_url}
                    alt={poster.title}
                    loading="lazy"
                  />

                  <span
                    className={`poster-admin-status-badge ${
                      poster.is_active ? "published" : "hidden"
                    }`}
                  >
                    {poster.is_active ? "Published" : "Hidden"}
                  </span>
                </div>

                <div className="poster-admin-card-content">
                  <h3>{poster.title}</h3>
                  <p>
                    {poster.category || "team"} · Order {poster.sort_order}
                  </p>

                  <div className="poster-admin-card-actions">
                    <button
                      type="button"
                      onClick={() => startEditing(poster)}
                      disabled={saving}
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => togglePublished(poster)}
                      disabled={saving}
                    >
                      {poster.is_active ? (
                        <>
                          <EyeOff size={15} />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye size={15} />
                          Publish
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      className="poster-admin-delete"
                      onClick={() => deletePoster(poster)}
                      disabled={saving}
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
