
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Plus,
  Pencil,
  RefreshCw,
  Search,
  ShieldCheck,
  Save,
  X,
  Power,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { cricketTeams } from "../../data/cricket/teams";
import "./AdminCricketTeams.css";

const emptyForm = {
  name: "",
  short_name: "",
  city: "",
  logo_url: "",
  captain_name: "",
  is_active: true,
};

function AdminCricketTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const loadTeams = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error: queryError } = await supabase
      .from("cricket_teams")
      .select(
        "id, name, short_name, city, logo_url, captain_name, is_active, created_at, updated_at"
      )
      .order("id", { ascending: true });

    if (queryError) {
      setTeams([]);
      setError(queryError.message);
    } else {
      setTeams(data || []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openNewForm = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setError("");
    setNotice("");
    setFormOpen(true);
  };

  const openEditForm = (team) => {
    setEditingId(team.id);
    setForm({
      name: team.name || "",
      short_name: team.short_name || "",
      city: team.city || "",
      logo_url: team.logo_url || "",
      captain_name: team.captain_name || "",
      is_active: team.is_active,
    });
    setError("");
    setNotice("");
    setFormOpen(true);
  };

  const saveTeam = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const payload = {
      name: form.name.trim().toUpperCase(),
      short_name: form.short_name.trim().toUpperCase(),
      city: form.city.trim() || null,
      logo_url: form.logo_url.trim() || null,
      captain_name: form.captain_name.trim() || null,
      is_active: form.is_active,
      updated_at: new Date().toISOString(),
    };

    if (!payload.name || !payload.short_name) {
      setError("Team name and short name are required.");
      setSaving(false);
      return;
    }

    let result;

    if (editingId !== null) {
      result = await supabase
        .from("cricket_teams")
        .update(payload)
        .eq("id", editingId)
        .select("id");
    } else {
      // Existing team IDs are 1–8. Find the next available ID.
      const { data: idRows, error: idError } = await supabase
        .from("cricket_teams")
        .select("id")
        .order("id", { ascending: false })
        .limit(1);

      if (idError) {
        setError(idError.message);
        setSaving(false);
        return;
      }

      const nextId = (idRows?.[0]?.id || 0) + 1;

      result = await supabase
        .from("cricket_teams")
        .insert({ id: nextId, ...payload })
        .select("id");
    }

    if (result.error) {
      setError(
        result.error.code === "42501"
          ? "Permission denied. Sign in with an authorized BCL admin account."
          : result.error.code === "23505"
            ? "A team with this name or ID already exists."
            : result.error.message
      );
      setSaving(false);
      return;
    }

    if (!result.data?.length) {
      setError("No team was changed. Check your admin permissions.");
      setSaving(false);
      return;
    }

    setNotice(
      editingId !== null
        ? "Team updated successfully."
        : "Team added successfully."
    );
    setFormOpen(false);
    setEditingId(null);
    setForm({ ...emptyForm });

    await loadTeams();
    setSaving(false);
  };

  const toggleTeamStatus = async (team) => {
    const nextStatus = !team.is_active;
    const action = nextStatus ? "activate" : "deactivate";

    if (
      !window.confirm(
        `Are you sure you want to ${action} ${team.name}?`
      )
    ) {
      return;
    }

    setError("");
    setNotice("");

    const { data, error: updateError } = await supabase
      .from("cricket_teams")
      .update({
        is_active: nextStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", team.id)
      .select("id");

    if (updateError) {
      setError(updateError.message);
      return;
    }

    if (!data?.length) {
      setError("No team was changed. Check your admin permissions.");
      return;
    }

    setNotice(
      `${team.name} is now ${nextStatus ? "active" : "inactive"}.`
    );
    await loadTeams();
  };

  const filteredTeams = teams.filter((team) =>
    [
      team.id,
      team.name,
      team.short_name,
      team.city,
      team.captain_name,
      team.is_active ? "active" : "inactive",
    ].some((value) =>
      String(value ?? "").toLowerCase().includes(search.trim().toLowerCase())
    )
  );

  const getLogo = (team) =>
    team.logo_url ||
    cricketTeams.find((item) => Number(item.id) === Number(team.id))?.logo ||
    "";

  return (
    <div className="admin-cricket-teams-page">
      <header className="admin-cricket-teams-header">
        <Link to="/admin" className="admin-cricket-teams-back">
          <ArrowLeft size={18} />
          Dashboard
        </Link>

        <div className="admin-cricket-teams-heading">
          <span>
            <ShieldCheck size={16} />
            ADMIN CONTROL
          </span>
          <h1>Cricket Team Management</h1>
          <p>Manage registered teams and their details.</p>
        </div>

        <div className="admin-cricket-teams-actions">
          <button
            type="button"
            className="act-secondary"
            onClick={loadTeams}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          <button
            type="button"
            className="act-primary"
            onClick={openNewForm}
          >
            <Plus size={17} />
            Add Team
          </button>
        </div>
      </header>

      <section className="admin-cricket-teams-summary">
        <Users size={23} />
        <div>
          <strong>{teams.length} teams</strong>
          <span>Loaded from Supabase</span>
        </div>
        <div className="act-summary-counts">
          <span>{teams.filter((team) => team.is_active).length} active</span>
          <span>{teams.filter((team) => !team.is_active).length} inactive</span>
        </div>
      </section>

      {notice && (
        <p className="act-notice" role="status">
          {notice}
        </p>
      )}
      {error && (
        <p className="act-error" role="alert">
          {error}
        </p>
      )}

      {formOpen && (
        <section className="act-form-panel">
          <div className="act-form-heading">
            <div>
              <h2>{editingId !== null ? "Edit Team" : "Add a Team"}</h2>
              <p>Enter the team details below.</p>
            </div>
            <button
              type="button"
              className="act-icon-button"
              onClick={() => setFormOpen(false)}
              aria-label="Close team form"
            >
              <X size={19} />
            </button>
          </div>

          <form className="act-form" onSubmit={saveTeam}>
            <label>
              Team name *
              <input
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="BAHARAGORA KINGS"
                maxLength={100}
                required
              />
            </label>

            <label>
              Short name *
              <input
                name="short_name"
                value={form.short_name}
                onChange={updateField}
                placeholder="BAHARAGORA"
                maxLength={40}
                required
              />
            </label>

            <label>
              City or locality
              <input
                name="city"
                value={form.city}
                onChange={updateField}
                placeholder="BAHARAGORA"
                maxLength={100}
              />
            </label>

            <label>
              Captain name
              <input
                name="captain_name"
                value={form.captain_name}
                onChange={updateField}
                placeholder="Captain name"
                maxLength={100}
              />
            </label>

            <label className="act-full-width">
              Logo path or URL
              <input
                name="logo_url"
                value={form.logo_url}
                onChange={updateField}
                placeholder="/media/logos/team.png"
                maxLength={500}
              />
              <small>
                Use an existing website path or a complete image URL.
              </small>
            </label>

            <label className="act-checkbox-label">
              <input
                name="is_active"
                type="checkbox"
                checked={form.is_active}
                onChange={updateField}
              />
              Team is active
            </label>

            <div className="act-form-actions act-full-width">
              <button
                type="submit"
                className="act-primary"
                disabled={saving}
              >
                <Save size={16} />
                {saving
                  ? "Saving..."
                  : editingId !== null
                    ? "Save Changes"
                    : "Create Team"}
              </button>
              <button
                type="button"
                className="act-secondary"
                disabled={saving}
                onClick={() => setFormOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="act-list-panel">
        <div className="act-list-heading">
          <div>
            <h2>All Cricket Teams</h2>
            <p>Team changes are saved to Supabase.</p>
          </div>

          <label className="act-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search teams..."
              aria-label="Search cricket teams"
            />
          </label>
        </div>

        {loading ? (
          <p className="act-empty">Loading cricket teams...</p>
        ) : error && teams.length === 0 ? (
          <p className="act-empty">
            Teams could not be loaded. Check your connection and permissions.
          </p>
        ) : filteredTeams.length === 0 ? (
          <p className="act-empty">No matching teams found.</p>
        ) : (
          <div className="act-table-wrap">
            <table className="act-table">
              <thead>
                <tr>
                  <th>Team</th>
                  <th>Short name</th>
                  <th>City</th>
                  <th>Captain</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeams.map((team) => (
                  <tr key={team.id}>
                    <td>
                      <div className="act-team-cell">
                        {getLogo(team) ? (
                          <img
                            src={getLogo(team)}
                            alt={`${team.name} logo`}
                            onError={(event) => {
                              event.currentTarget.style.visibility = "hidden";
                            }}
                          />
                        ) : (
                          <div className="act-logo-fallback">
                            {team.short_name?.slice(0, 2) || "TC"}
                          </div>
                        )}
                        <div>
                          <strong>{team.name}</strong>
                          <span>ID: {team.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>{team.short_name}</td>
                    <td>{team.city || "—"}</td>
                    <td>{team.captain_name || "—"}</td>
                    <td>
                      <span
                        className={`act-status ${
                          team.is_active ? "is-active" : "is-inactive"
                        }`}
                      >
                        {team.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="act-row-actions">
                        <button
                          type="button"
                          className="act-edit-button"
                          onClick={() => openEditForm(team)}
                        >
                          <Pencil size={14} />
                          Edit
                        </button>
                        <button
                          type="button"
                          className="act-toggle-button"
                          onClick={() => toggleTeamStatus(team)}
                        >
                          <Power size={14} />
                          {team.is_active ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminCricketTeams;
