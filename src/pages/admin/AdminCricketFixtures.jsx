
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  RefreshCw,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { cricketTeams } from "../../data/cricket/teams";
import "./AdminCricketFixtures.css";

const emptyForm = {
  match_day: "1",
  stage: "LEAGUE",
  group_name: "A",
  team1_id: "",
  team2_id: "",
  team1_placeholder: "",
  team2_placeholder: "",
  match_date: "",
  match_time: "10:00",
  venue: "Baharagora Stadium",
  status: "UPCOMING",
};

const stages = ["LEAGUE", "SEMI-FINAL", "PLAYOFF", "FINAL"];
const statuses = ["UPCOMING", "LIVE", "FINISHED", "POSTPONED", "CANCELLED"];

function teamName(teamId, placeholder) {
  if (teamId !== null && teamId !== undefined) {
    const team = cricketTeams.find((item) => Number(item.id) === Number(teamId));
    if (team) return team.name;
  }

  return placeholder || "TBD";
}

function AdminCricketFixtures() {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const loadFixtures = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error: queryError } = await supabase
      .from("cricket_matches")
      .select(
        "id, match_day, stage, group_name, team1_id, team2_id, team1_placeholder, team2_placeholder, match_date, match_time, venue, status"
      )
      .order("match_date", { ascending: true })
      .order("match_time", { ascending: true });

    if (queryError) {
      setError(queryError.message);
      setFixtures([]);
    } else {
      setFixtures(data || []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadFixtures();
  }, [loadFixtures]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const openNewForm = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setNotice("");
    setError("");
    setFormOpen(true);
  };

  const openEditForm = (match) => {
    setEditingId(match.id);
    setForm({
      match_day: String(match.match_day),
      stage: match.stage,
      group_name: match.group_name,
      team1_id: match.team1_id == null ? "" : String(match.team1_id),
      team2_id: match.team2_id == null ? "" : String(match.team2_id),
      team1_placeholder: match.team1_placeholder || "",
      team2_placeholder: match.team2_placeholder || "",
      match_date: match.match_date,
      match_time: String(match.match_time).slice(0, 5),
      venue: match.venue,
      status: match.status,
    });
    setNotice("");
    setError("");
    setFormOpen(true);
  };

  const saveFixture = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    if (
      form.team1_id &&
      form.team2_id &&
      form.team1_id === form.team2_id
    ) {
      setError("Choose two different teams.");
      setSaving(false);
      return;
    }

    const payload = {
      match_day: Number(form.match_day),
      stage: form.stage,
      group_name: form.group_name.trim(),
      team1_id: form.team1_id ? Number(form.team1_id) : null,
      team2_id: form.team2_id ? Number(form.team2_id) : null,
      team1_placeholder: form.team1_id
        ? null
        : form.team1_placeholder.trim() || null,
      team2_placeholder: form.team2_id
        ? null
        : form.team2_placeholder.trim() || null,
      match_date: form.match_date,
      match_time: form.match_time,
      venue: form.venue.trim(),
      status: form.status,
      updated_at: new Date().toISOString(),
    };

    if (
      (!payload.team1_id && !payload.team1_placeholder) ||
      (!payload.team2_id && !payload.team2_placeholder)
    ) {
      setError("Select a team or enter a placeholder for both sides.");
      setSaving(false);
      return;
    }

    if (
      !payload.group_name ||
      !payload.match_date ||
      !payload.match_time ||
      !payload.venue ||
      !Number.isInteger(payload.match_day) ||
      payload.match_day < 1
    ) {
      setError("Complete all required fields with valid values.");
      setSaving(false);
      return;
    }

    const result = editingId
      ? await supabase
          .from("cricket_matches")
          .update(payload)
          .eq("id", editingId)
          .select("id")
      : await supabase
          .from("cricket_matches")
          .insert(payload)
          .select("id");

    if (result.error) {
      setError(
        result.error.code === "42501"
          ? "Permission denied. Please sign in with an authorized BCL admin account."
          : result.error.message
      );
      setSaving(false);
      return;
    }

    if (!result.data || result.data.length === 0) {
      setError(
        "No fixture was changed. Confirm your admin access and try again."
      );
      setSaving(false);
      return;
    }

    setNotice(editingId ? "Fixture updated successfully." : "Fixture added successfully.");
    setFormOpen(false);
    setEditingId(null);
    setForm({ ...emptyForm });
    await loadFixtures();
    setSaving(false);
  };

  const changeStatus = async (match, status) => {
    const confirmed = window.confirm(
      `Change Match ${match.id} status to ${status.replace("_", " ")}?`
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    const { data, error: updateError } = await supabase
      .from("cricket_matches")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", match.id)
      .select("id");

    if (updateError) {
      setError(updateError.message);
      return;
    }

    if (!data || data.length === 0) {
      setError("No fixture was changed. Check your admin permissions.");
      return;
    }

    setNotice(`Match ${match.id} is now ${status.replace("_", " ")}.`);
    await loadFixtures();
  };

  const filteredFixtures = fixtures.filter((match) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return [
      String(match.id),
      String(match.match_day),
      match.stage,
      match.group_name,
      teamName(match.team1_id, match.team1_placeholder),
      teamName(match.team2_id, match.team2_placeholder),
      match.venue,
      match.status,
    ].some((value) => String(value || "").toLowerCase().includes(query));
  });

  return (
    <div className="admin-fixtures-page">
      <header className="admin-fixtures-header">
        <Link to="/admin" className="admin-fixtures-back">
          <ArrowLeft size={18} />
          Dashboard
        </Link>

        <div className="admin-fixtures-heading">
          <span><ShieldCheck size={16} /> ADMIN CONTROL</span>
          <h1>Cricket Fixture Management</h1>
          <p>Add matches, edit schedules, and manage fixture status.</p>
        </div>

        <div className="admin-fixtures-actions">
          <button
            type="button"
            className="admin-fixtures-secondary"
            onClick={loadFixtures}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            type="button"
            className="admin-fixtures-primary"
            onClick={openNewForm}
          >
            <Plus size={17} />
            Add Fixture
          </button>
        </div>
      </header>

      <div className="admin-fixtures-summary">
        <CalendarDays size={22} />
        <div>
          <strong>{fixtures.length} fixtures</strong>
          <span>Loaded from Supabase</span>
        </div>
      </div>

      {notice && <p className="admin-fixtures-notice" role="status">{notice}</p>}
      {error && <p className="admin-fixtures-error" role="alert">{error}</p>}

      {formOpen && (
        <section className="admin-fixtures-form-panel">
          <div className="admin-fixtures-form-heading">
            <div>
              <h2>{editingId ? `Edit Match ${editingId}` : "Add a Fixture"}</h2>
              <p>Fields marked with * are required.</p>
            </div>
            <button
              type="button"
              className="admin-fixtures-secondary"
              onClick={() => setFormOpen(false)}
            >
              Close
            </button>
          </div>

          <form onSubmit={saveFixture} className="admin-fixtures-form">
            <label>
              Match day *
              <input
                name="match_day"
                type="number"
                min="1"
                required
                value={form.match_day}
                onChange={updateField}
              />
            </label>

            <label>
              Stage *
              <select name="stage" value={form.stage} onChange={updateField} required>
                {stages.map((stage) => <option key={stage}>{stage}</option>)}
              </select>
            </label>

            <label>
              Group *
              <input
                name="group_name"
                required
                value={form.group_name}
                onChange={updateField}
                placeholder="A, B, PLAYOFFS..."
              />
            </label>

            <label>
              Team 1
              <select name="team1_id" value={form.team1_id} onChange={updateField}>
                <option value="">Use placeholder</option>
                {cricketTeams.map((team) => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </label>

            {!form.team1_id && (
              <label>
                Team 1 placeholder *
                <input
                  name="team1_placeholder"
                  value={form.team1_placeholder}
                  onChange={updateField}
                  placeholder="Top 1 (Group A)"
                  required
                />
              </label>
            )}

            <label>
              Team 2
              <select name="team2_id" value={form.team2_id} onChange={updateField}>
                <option value="">Use placeholder</option>
                {cricketTeams.map((team) => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </label>

            {!form.team2_id && (
              <label>
                Team 2 placeholder *
                <input
                  name="team2_placeholder"
                  value={form.team2_placeholder}
                  onChange={updateField}
                  placeholder="Top 1 (Group B)"
                  required
                />
              </label>
            )}

            <label>
              Date *
              <input
                name="match_date"
                type="date"
                required
                value={form.match_date}
                onChange={updateField}
              />
            </label>

            <label>
              Time *
              <input
                name="match_time"
                type="time"
                required
                value={form.match_time}
                onChange={updateField}
              />
            </label>

            <label>
              Venue *
              <input
                name="venue"
                required
                value={form.venue}
                onChange={updateField}
              />
            </label>

            <label>
              Status *
              <select name="status" value={form.status} onChange={updateField} required>
                {statuses.map((status) => <option key={status}>{status}</option>)}
              </select>
            </label>

            <div className="admin-fixtures-form-actions">
              <button type="submit" className="admin-fixtures-primary" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Save Changes" : "Create Fixture"}
              </button>
              <button
                type="button"
                className="admin-fixtures-secondary"
                disabled={saving}
                onClick={() => {
                  setFormOpen(false);
                  setError("");
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="admin-fixtures-list-panel">
        <div className="admin-fixtures-list-heading">
          <div>
            <h2>All Cricket Fixtures</h2>
            <p>Changes are saved to Supabase.</p>
          </div>

          <label className="admin-fixtures-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search team, venue, status..."
              aria-label="Search fixtures"
            />
          </label>
        </div>

        {loading ? (
          <p className="admin-fixtures-empty">Loading fixtures...</p>
        ) : error && fixtures.length === 0 ? (
          <p className="admin-fixtures-empty">Fixtures could not be loaded.</p>
        ) : filteredFixtures.length === 0 ? (
          <p className="admin-fixtures-empty">No matching fixtures found.</p>
        ) : (
          <div className="admin-fixtures-table-wrap">
            <table className="admin-fixtures-table">
              <thead>
                <tr>
                  <th>Match</th>
                  <th>Teams</th>
                  <th>Schedule</th>
                  <th>Venue</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFixtures.map((match) => (
                  <tr key={match.id}>
                    <td>
                      <strong>#{match.id}</strong>
                      <span>Day {match.match_day} · {match.stage}</span>
                      <span>Group {match.group_name}</span>
                    </td>
                    <td>
                      <strong>{teamName(match.team1_id, match.team1_placeholder)}</strong>
                      <span>vs</span>
                      <strong>{teamName(match.team2_id, match.team2_placeholder)}</strong>
                    </td>
                    <td>
                      <strong>{match.match_date}</strong>
                      <span>{String(match.match_time).slice(0, 5)}</span>
                    </td>
                    <td>{match.venue}</td>
                    <td>
                      <select
                        aria-label={`Status for match ${match.id}`}
                        className={`admin-fixtures-status status-${match.status.toLowerCase()}`}
                        value={match.status}
                        onChange={(event) => changeStatus(match, event.target.value)}
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="admin-fixtures-edit"
                        onClick={() => openEditForm(match)}
                      >
                        <Pencil size={15} />
                        Edit
                      </button>
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

export default AdminCricketFixtures;