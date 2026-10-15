import { useCallback, useEffect, useState } from "react";

import { Link } from "react-router-dom";

import {

  ArrowLeft,

  Image as ImageIcon,

  Video,

  Upload,

  Trash2,
  Pencil,
  Save,
  X,

  Eye,

  EyeOff,

  RefreshCw,

  LoaderCircle,

} from "lucide-react";

import { supabase } from "../../lib/supabase";

import "./AdminMedia.css";

const BUCKET = "bcl-media";

const MAX_FILE_SIZE = 100 * 1024 * 1024;

const categories = [

  "General",

  "Football",

  "Cricket",

  "Tournament",

  "Players",

  "Behind the Scenes",

];

const placementOptions = [

  { value: "media", label: "Media page" },

  { value: "home", label: "Home page" },

  { value: "football", label: "Football" },

  { value: "cricket", label: "Cricket" },

];

function AdminMedia() {

  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);

  const [uploading, setUploading] = useState(false);

  const [message, setMessage] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [file, setFile] = useState(null);

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [category, setCategory] = useState("General");

  const [placements, setPlacements] = useState(["media"]);

  const [published, setPublished] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("General");
  const [editPlacements, setEditPlacements] = useState(["media"]);
  const [editThumbnailUrl, setEditThumbnailUrl] = useState("");
  const [editPublished, setEditPublished] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  const loadMedia = useCallback(async () => {

    setLoading(true);

    setErrorMessage("");

    const { data, error } = await supabase

      .from("bcl_media")

      .select("*")

      .order("created_at", { ascending: false });

    if (error) {

      setErrorMessage(`Could not load media: ${error.message}`);

      setItems([]);

    } else {

      setItems(data || []);

    }

    setLoading(false);

  }, []);

  useEffect(() => {

    loadMedia();

  }, [loadMedia]);

  const resetForm = () => {

    setFile(null);

    setTitle("");

    setDescription("");

    setCategory("General");

    setPlacements(["media"]);

    setPublished(false);

    const input = document.getElementById("bcl-media-file");

    if (input) input.value = "";

  };

  const handleFileChange = (event) => {

    const selected = event.target.files?.[0];

    setErrorMessage("");

    setMessage("");

    if (!selected) {

      setFile(null);

      return;

    }

    const allowedTypes = [

      "image/jpeg",

      "image/png",

      "image/webp",

      "image/gif",

      "image/avif",

      "video/mp4",

      "video/webm",

      "video/quicktime",

    ];

    if (!allowedTypes.includes(selected.type)) {

      setErrorMessage(

        "Choose a JPG, PNG, WebP, GIF, AVIF, MP4, WebM, or MOV file."

      );

      event.target.value = "";

      setFile(null);

      return;

    }

    if (selected.size > MAX_FILE_SIZE) {

      setErrorMessage("The file exceeds the 100 MB upload limit.");

      event.target.value = "";

      setFile(null);

      return;

    }

    setFile(selected);

    if (!title.trim()) {

      setTitle(selected.name.replace(/\.[^.]+$/, "").replace(/[\_-]+/g, " "));

    }

  };

  const togglePlacement = (value) => {

    setPlacements((current) =>

      current.includes(value)

        ? current.filter((item) => item !== value)

        : [...current, value]

    );

  };

  const handleUpload = async (event) => {

    event.preventDefault();

    setMessage("");

    setErrorMessage("");

    if (!file) {

      setErrorMessage("Please choose an image or video.");

      return;

    }

    if (!title.trim()) {

      setErrorMessage("Please enter a title.");

      return;

    }

    if (placements.length === 0) {

      setErrorMessage("Choose at least one website placement.");

      return;

    }

    setUploading(true);

    let uploadedPath = null;

    try {

      const {

        data: { user },

        error: userError,

      } = await supabase.auth.getUser();

      if (userError || !user) {

        throw new Error("Your session has expired. Please sign in again.");

      }

      const safeName = file.name

        .normalize("NFKD")

        .replace(/[^a-zA-Z0-9.\_-]/g, "-")

        .slice(-100);

      uploadedPath = `${user.id}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;

      const { error: uploadError } = await supabase.storage

        .from(BUCKET)

        .upload(uploadedPath, file, {

          contentType: file.type,

          upsert: false,

        });

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage

        .from(BUCKET)

        .getPublicUrl(uploadedPath);

      const mediaType = file.type.startsWith("image/") ? "image" : "video";

      const { error: insertError } = await supabase.from("bcl_media").insert({

        title: title.trim(),

        description: description.trim() || null,

        media_type: mediaType,

        category,

        storage_path: uploadedPath,

        public_url: publicData.publicUrl,

        thumbnail_url: mediaType === "image" ? publicData.publicUrl : null,

        placement: placements,

        is_published: published,

        uploaded_by: user.id,

      });

      if (insertError) {

        // Best-effort cleanup if the database insert fails.

        await supabase.storage.from(BUCKET).remove([uploadedPath]);

        uploadedPath = null;

        throw insertError;

      }

      setMessage("Media uploaded successfully.");

      resetForm();

      await loadMedia();

    } catch (err) {

      setErrorMessage(err.message || "Upload failed. Please try again.");

    } finally {

      setUploading(false);

    }

  };

  const startEdit = (item) => {
    setEditingItem(item);
    setEditTitle(item.title || "");
    setEditDescription(item.description || "");
    setEditCategory(item.category || "General");
    setEditPlacements(Array.isArray(item.placement) ? item.placement : []);
    setEditThumbnailUrl(item.thumbnail_url || "");
    setEditPublished(Boolean(item.is_published));
    setErrorMessage("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditTitle("");
    setEditDescription("");
    setEditCategory("General");
    setEditPlacements(["media"]);
    setEditThumbnailUrl("");
    setEditPublished(false);
  };

  const toggleEditPlacement = (value) => {
    setEditPlacements((current) =>
      current.includes(value)
        ? current.filter((placement) => placement !== value)
        : [...current, value]
    );
  };

  const saveEdit = async (event) => {
    event.preventDefault();
    if (!editingItem) return;
    if (!editTitle.trim()) {
      setErrorMessage("Please enter a title.");
      return;
    }
    if (editPlacements.length === 0) {
      setErrorMessage("Choose at least one website placement.");
      return;
    }
    setSavingEdit(true);
    setErrorMessage("");
    setMessage("");
    try {
      const { error } = await supabase
        .from("bcl_media")
        .update({
          title: editTitle.trim(),
          description: editDescription.trim() || null,
          category: editCategory,
          placement: editPlacements,
          thumbnail_url: editThumbnailUrl.trim() || null,
          is_published: editPublished,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingItem.id);
      if (error) throw error;
      setMessage("Media details updated successfully.");
      cancelEdit();
      await loadMedia();
    } catch (err) {
      setErrorMessage(`Could not save changes: ${err.message || "Please try again."}`);
    } finally {
      setSavingEdit(false);
    }
  };

  const togglePublished = async (item) => {

    setErrorMessage("");

    setMessage("");

    const { error } = await supabase

      .from("bcl_media")

      .update({

        is_published: !item.is_published,

        updated_at: new Date().toISOString(),

      })

      .eq("id", item.id);

    if (error) {

      setErrorMessage(`Could not update publishing status: ${error.message}`);

      return;

    }

    setMessage(

      item.is_published ? "Media unpublished." : "Media published."

    );

    await loadMedia();

  };

  const deleteMedia = async (item) => {

    const confirmed = window.confirm(

      `Delete "${item.title}" permanently? This removes the stored file too.`

    );

    if (!confirmed) return;

    setErrorMessage("");

    setMessage("");

    const { error: storageError } = await supabase.storage

      .from(BUCKET)

      .remove([item.storage_path]);

    if (storageError) {

      setErrorMessage(

        `Could not delete the stored file: ${storageError.message}`

      );

      return;

    }

    const { error: rowError } = await supabase

      .from("bcl_media")

      .delete()

      .eq("id", item.id);

    if (rowError) {

      setErrorMessage(

        `The file was removed, but its database row could not be deleted: ${rowError.message}`

      );

      await loadMedia();

      return;

    }

    setMessage("Media deleted successfully.");

    await loadMedia();

  };

  return (

    <div className="admin-media-page">

      <header className="admin-media-header">

        <div>

          <Link to="/admin" className="admin-media-back">

            <ArrowLeft size={17} />

            Back to dashboard

          </Link>

          <p className="admin-media-eyebrow">BCL CONTENT CONTROL</p>

          <h1>Media Management</h1>

          <p>Upload and manage tournament photos and videos.</p>

        </div>

        <button

          type="button"

          className="admin-media-refresh"

          onClick={loadMedia}

          disabled={loading}

        >

          <RefreshCw size={16} />

          Refresh

        </button>

      </header>

      {message && (

        <div className="admin-media-message" role="status">

          {message}

        </div>

      )}

      {errorMessage && (

        <div className="admin-media-error" role="alert">

          {errorMessage}

        </div>

      )}

      <section className="admin-media-panel">

        <div className="admin-media-panel-heading">

          <Upload size={22} />

          <div>

            <h2>Upload new media</h2>

            <p>Supported images and videos up to 100 MB.</p>

          </div>

        </div>

        <form className="admin-media-form" onSubmit={handleUpload}>

          <label className="admin-media-field admin-media-full">

            Select image or video

            <input

              id="bcl-media-file"

              type="file"

              accept="image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm,video/quicktime"

              onChange={handleFileChange}

            />

          </label>

          {file && (

            <div className="admin-media-selected">

              {file.type.startsWith("image/") ? (

                <ImageIcon size={20} />

              ) : (

                <Video size={20} />

              )}

              <span>{file.name}</span>

              <small>{(file.size / (1024 * 1024)).toFixed(2)} MB</small>

            </div>

          )}

          {file && file.type.startsWith("image/") && (

            <img

              className="admin-media-upload-preview"

              src={URL.createObjectURL(file)}

              alt="Selected upload preview"

            />

          )}

          {file && file.type.startsWith("video/") && (

            <video

              className="admin-media-upload-preview"

              src={URL.createObjectURL(file)}

              controls

              preload="metadata"

            />

          )}

          <label className="admin-media-field">

            Title *

            <input

              value={title}

              onChange={(event) => setTitle(event.target.value)}

              maxLength={150}

              required

              placeholder="e.g. BCL Final 2026"

            />

          </label>

          <label className="admin-media-field">

            Category

            <select

              value={category}

              onChange={(event) => setCategory(event.target.value)}

            >

              {categories.map((option) => (

                <option key={option} value={option}>

                  {option}

                </option>

              ))}

            </select>

          </label>

          <label className="admin-media-field admin-media-full">

            Description

            <textarea

              value={description}

              onChange={(event) => setDescription(event.target.value)}

              rows={3}

              maxLength={2000}

              placeholder="Add a short description (optional)"

            />

          </label>

            <fieldset className="admin-media-field admin-media-full">

            <legend>Display on</legend>

            <div className="admin-media-placement-options">

                {placementOptions.map((option) => (

                <label key={option.value}>

                    <input

                    type="checkbox"

                    checked={placements.includes(option.value)}

                    onChange={() => togglePlacement(option.value)}

                    />

                    <span>{option.label}</span>

                </label>

                ))}

            </div>

            </fieldset>

            <div className="admin-media-full">

            <label className="admin-media-publish-toggle">

                <input

                type="checkbox"

                checked={published}

                onChange={(event) => setPublished(event.target.checked)}

                />

                <span>Publish immediately</span>

            </label>

            </div>

          <div className="admin-media-full">

            <button

              type="submit"

              className="admin-media-submit"

              disabled={uploading}

            >

              {uploading ? (

                <>

                  <LoaderCircle className="admin-media-spinner" size={18} />

                  Uploading…

                </>

              ) : (

                <>

                  <Upload size={18} />

                  Upload media

                </>

              )}

            </button>

          </div>

        </form>

      </section>

      {editingItem && (
        <section className="admin-media-panel admin-media-edit-panel" id="admin-media-edit">
          <div className="admin-media-panel-heading">
            <Pencil size={22} />
            <div>
              <h2>Edit media</h2>
              <p>Update details without uploading the file again.</p>
            </div>
            <button type="button" className="admin-media-cancel-edit" onClick={cancelEdit}>
              <X size={16} /> Cancel
            </button>
          </div>
          <form className="admin-media-form" onSubmit={saveEdit}>
            <div className="admin-media-edit-current admin-media-full">
              {editingItem.media_type === "image" ? (
                <img src={editThumbnailUrl || editingItem.public_url} alt="Current media preview" />
              ) : (
                <video src={editingItem.public_url} controls preload="metadata" />
              )}
              <span>{editingItem.media_type === "video" ? "Video" : "Image"} file stays unchanged.</span>
            </div>
            <label className="admin-media-field">
              Title *
              <input value={editTitle} onChange={(event) => setEditTitle(event.target.value)} maxLength={150} required />
            </label>
            <label className="admin-media-field">
              Category
              <select value={editCategory} onChange={(event) => setEditCategory(event.target.value)}>
                {categories.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
            <label className="admin-media-field admin-media-full">
              Description
              <textarea value={editDescription} onChange={(event) => setEditDescription(event.target.value)} rows={3} maxLength={2000} />
            </label>
            <label className="admin-media-field admin-media-full">
              Thumbnail URL (optional)
              <input type="text" value={editThumbnailUrl} onChange={(event) => setEditThumbnailUrl(event.target.value)} placeholder="/media/photos/posters/season5_start_from.png" />
              <small>Use a full URL or a website-relative path such as /media/photos/posters/season5_start_from.png. Do not enter the Windows C:\ path.</small>
            </label>
            <fieldset className="admin-media-field admin-media-full">
              <legend>Display on</legend>
              <div className="admin-media-placement-options">
                {placementOptions.map((option) => (
                  <label key={option.value}>
                    <input type="checkbox" checked={editPlacements.includes(option.value)} onChange={() => toggleEditPlacement(option.value)} />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="admin-media-full">
              <label className="admin-media-publish-toggle">
                <input type="checkbox" checked={editPublished} onChange={(event) => setEditPublished(event.target.checked)} />
                <span>Published and visible on the website</span>
              </label>
            </div>
            <div className="admin-media-full admin-media-edit-actions">
              <button type="submit" className="admin-media-submit" disabled={savingEdit}>
                {savingEdit ? <><LoaderCircle className="admin-media-spinner" size={18} /> Saving…</> : <><Save size={18} /> Save changes</>}
              </button>
              <button type="button" className="admin-media-secondary" onClick={cancelEdit} disabled={savingEdit}>Cancel</button>
            </div>
          </form>
        </section>
      )}

      <section className="admin-media-library">

        <div className="admin-media-library-heading">

          <div>

            <h2>Media library</h2>

            <p>{items.length} item(s) in your library</p>

          </div>

        </div>

        {loading ? (

          <p className="admin-media-empty">Loading media library…</p>

        ) : items.length === 0 ? (

          <p className="admin-media-empty">

            No uploaded media yet. Your new uploads will appear here.

          </p>

        ) : (

          <div className="admin-media-grid">

            {items.map((item) => (

              <article className="admin-media-card" key={item.id}>

                <div className="admin-media-card-preview">

                  {item.media_type === "image" ? (
                    <img
                      src={item.thumbnail_url || item.public_url}
                      alt={item.title || "BCL media thumbnail"}
                      loading="lazy"
                      onError={(event) => {
                        if (event.currentTarget.src !== item.public_url) {
                          event.currentTarget.src = item.public_url;
                        } else {
                          event.currentTarget.style.display = "none";
                        }
                      }}
                    />
                  ) : item.thumbnail_url ? (
                    <button
                      type="button"
                      className="admin-media-video-thumbnail"
                      onClick={() => window.open(item.public_url, "_blank", "noopener,noreferrer")}
                      aria-label={`Open video: ${item.title}`}
                    >
                      <img src={item.thumbnail_url} alt={`${item.title} thumbnail`} loading="lazy" />
                      <span><Video size={24} /> Open video</span>
                    </button>
                  ) : (
                    <video src={item.public_url} controls preload="metadata" />
                  )}

                </div>

                <div className="admin-media-card-content">

                  <div className="admin-media-card-tags">

                    <span>{item.category}</span>

                    <span

                      className={

                        item.is_published

                          ? "admin-media-status is-published"

                          : "admin-media-status"

                      }

                    >

                      {item.is_published ? "Published" : "Draft"}

                    </span>

                  </div>

                  <h3>{item.title}</h3>

                  {item.description && <p>{item.description}</p>}

                  <small>

                    Placement: {(item.placement || []).join(", ") || "None"}

                  </small>

                  <div className="admin-media-card-actions">
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      title="Edit media details"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button

                      type="button"

                      onClick={() => togglePublished(item)}

                      title={

                        item.is_published ? "Unpublish media" : "Publish media"

                      }

                    >

                      {item.is_published ? (

                        <EyeOff size={16} />

                      ) : (

                        <Eye size={16} />

                      )}

                      {item.is_published ? "Unpublish" : "Publish"}

                    </button>

                    <button

                      type="button"

                      className="admin-media-delete"

                      onClick={() => deleteMedia(item)}

                    >

                      <Trash2 size={16} />

                      Delete

                    </button>

                  </div>

                </div>

              </article>

            ))}

          </div>

        )}

      </section>

    </div>

  );

}

export default AdminMedia;
