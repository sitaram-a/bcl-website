
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Users, Plus, Pencil, RefreshCw, Search,
  ShieldCheck, Save, X, Power,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import "./AdminCricketPlayers.css";

const emptyForm = {
  player_name: "",
  team_id: "",
  jersey_number: "",
  playing_role: "Player",
  batting_style: "",
  bowling_style: "",
  photo_url: "",
  is_captain: false,
  is_active: true,
};

const roleOptions = [
  "Icon",
  "Player",
  "BAT",
  "Batter",
  "Bowler",
  "All-rounder",
  "Wicketkeeper",
];

export default function AdminCricketPlayers() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");


const loadData = useCallback(async () => {
  setLoading(true);
  setError("");

  try {
    const [playerResult, teamResult] = await Promise.all([
      supabase
        .from("cricket_players")
        .select(`
          id,
          player_name,
          team_id,
          jersey_number,
          playing_role,
          batting_style,
          bowling_style,
          photo_url,
          is_captain,
          is_active,
          created_at,
          updated_at
        `)
        .order("team_id", { ascending: true })
        .order("jersey_number", { ascending: true }),

      supabase
        .from("cricket_teams")
        .select("id, name, short_name, logo_url, is_active")
        .order("id", { ascending: true }),
    ]);

    if (playerResult.error) throw playerResult.error;
    if (teamResult.error) throw teamResult.error;

    const teamMap = new Map(
      (teamResult.data || []).map((team) => [
        Number(team.id),
        team,
      ])
    );

    const playersWithTeams = (playerResult.data || []).map((player) => ({
      ...player,
      cricket_teams: teamMap.get(Number(player.team_id)) || null,
    }));

    setPlayers(playersWithTeams);
    setTeams(teamResult.data || []);
  } catch (err) {
    setError(err.message || "Unable to load player data.");
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

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

  const openEditForm = (player) => {
    setEditingId(player.id);
    setForm({
      player_name: player.player_name || "",
      team_id: String(player.team_id),
      jersey_number: player.jersey_number ?? "",
      playing_role: player.playing_role || "Player",
      batting_style: player.batting_style || "",
      bowling_style: player.bowling_style || "",
      photo_url: player.photo_url || "",
      is_captain: player.is_captain,
      is_active: player.is_active,
    });
    setError("");
    setNotice("");
    setFormOpen(true);
  };

  const savePlayer = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const payload = {
      player_name: form.player_name.trim().toUpperCase(),
      team_id: Number(form.team_id),
      jersey_number: form.jersey_number === ""
        ? null
        : Number(form.jersey_number),
      playing_role: form.playing_role,
      batting_style: form.batting_style.trim() || null,
      bowling_style: form.bowling_style.trim() || null,
      photo_url: form.photo_url.trim() || null,
      is_captain: form.is_captain,
      is_active: form.is_active,
      updated_at: new Date().toISOString(),
    };

    if (!payload.player_name || !payload.team_id) {
      setError("Player name and team are required.");
      setSaving(false);
      return;
    }

    if (
      payload.jersey_number !== null &&
      (!Number.isInteger(payload.jersey_number) ||
        payload.jersey_number < 1)
    ) {
      setError("Jersey number must be a positive whole number.");
      setSaving(false);
      return;
    }

    const result = editingId !== null
      ? await supabase
          .from("cricket_players")
          .update(payload)
          .eq("id", editingId)
          .select("id")
      : await supabase
          .from("cricket_players")
          .insert(payload)
          .select("id");

    if (result.error) {
      setError(
        result.error.code === "23505"
          ? "That jersey number is already used by a player on this team."
          : result.error.code === "23503"
            ? "Please select an existing team."
            : result.error.code === "42501"
              ? "Permission denied. Sign in with an authorized BCL admin account."
              : result.error.message
      );
      setSaving(false);
      return;
    }

    if (!result.data?.length) {
      setError("No player was saved. Check your admin permissions.");
      setSaving(false);
      return;
    }

    setNotice(
      editingId !== null
        ? "Player updated successfully."
        : "Player added successfully."
    );
    setFormOpen(false);
    setForm({ ...emptyForm });
    setEditingId(null);
    await loadData();
    setSaving(false);
  };

  const toggleStatus = async (player) => {
    const nextStatus = !player.is_active;
    const action = nextStatus ? "activate" : "deactivate";

    if (!window.confirm(`Are you sure you want to ${action} ${player.player_name}?`)) {
      return;
    }

    setError("");
    setNotice("");

    const { data, error: updateError } = await supabase
      .from("cricket_players")
      .update({
        is_active: nextStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", player.id)
      .select("id");

    if (updateError) {
      setError(updateError.message);
      return;
    }

    if (!data?.length) {
      setError("No player was changed. Check your admin permissions.");
      return;
    }

    setNotice(
      `${player.player_name} is now ${nextStatus ? "active" : "inactive"}.`
    );
    await loadData();
  };

  const filteredPlayers = players.filter((player) => {
    const teamName = player.cricket_teams?.name || "";
    const matchesSearch = [
      player.player_name,
      player.playing_role,
      teamName,
      player.jersey_number,
      player.batting_style,
      player.bowling_style,
    ].some((value) =>
      String(value ?? "").toLowerCase().includes(search.trim().toLowerCase())
    );

    const matchesTeam =
      teamFilter === "all" || String(player.team_id) === teamFilter;

    return matchesSearch && matchesTeam;
  });

  return (
    <main className="admin-cricket-players-page">
      <header className="acp-header">
        <Link to="/admin" className="acp-back">
          <ArrowLeft size={18} /> Dashboard
        </Link>

        <div className="acp-title">
          <span><ShieldCheck size={16} /> ADMIN CONTROL</span>
          <h1>Cricket Player Management</h1>
          <p>Manage player profiles and team assignments.</p>
        </div>

        <div className="acp-header-actions">
          <button
            type="button"
            className="acp-secondary"
            onClick={loadData}
            disabled={loading}
          >
            <RefreshCw size={16} /> Refresh
          </button>
          <button type="button" className="acp-primary" onClick={openNewForm}>
            <Plus size={17} /> Add Player
          </button>
        </div>
      </header>

      <section className="acp-summary">
        <Users size={24} />
        <div>
          <strong>{players.length} players</strong>
          <span>Loaded from Supabase</span>
        </div>
        <div className="acp-counts">
          <span>{players.filter((p) => p.is_active).length} active</span>
          <span>{players.filter((p) => !p.is_active).length} inactive</span>
        </div>
      </section>

      {notice && <p className="acp-notice" role="status">{notice}</p>}
      {error && <p className="acp-error" role="alert">{error}</p>}

      {formOpen && (
        <section className="acp-panel">
          <div className="acp-panel-heading">
            <div>
              <h2>{editingId !== null ? "Edit Player" : "Add Player"}</h2>
              <p>Enter the player details below.</p>
            </div>
            <button
              type="button"
              className="acp-close"
              onClick={() => setFormOpen(false)}
              aria-label="Close player form"
            >
              <X size={19} />
            </button>
          </div>

          <form className="acp-form" onSubmit={savePlayer}>
            <label>
              Player name *
              <input
                name="player_name"
                value={form.player_name}
                onChange={updateField}
                maxLength={120}
                required
              />
            </label>

            <label>
              Team *
              <select name="team_id" value={form.team_id} onChange={updateField} required>
                <option value="">Select team</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}{team.is_active ? "" : " (Inactive)"}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Jersey number
              <input
                type="number"
                min="1"
                step="1"
                name="jersey_number"
                value={form.jersey_number}
                onChange={updateField}
              />
            </label>

            <label>
              Player role *
              <select
                name="playing_role"
                value={form.playing_role}
                onChange={updateField}
                required
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </label>

            <label>
              Batting style
              <input
                name="batting_style"
                value={form.batting_style}
                onChange={updateField}
                placeholder="e.g. Right-hand bat"
              />
            </label>

            <label>
              Bowling style
              <input
                name="bowling_style"
                value={form.bowling_style}
                onChange={updateField}
                placeholder="e.g. Right-arm medium"
              />
            </label>

            <label className="acp-full">
              Player photo URL
              <input
                name="photo_url"
                type="url"
                value={form.photo_url}
                onChange={updateField}
                placeholder="https://..."
              />
            </label>

            <div className="acp-checks acp-full">
              <label>
                <input
                  type="checkbox"
                  name="is_captain"
                  checked={form.is_captain}
                  onChange={updateField}
                />
                Team captain
              </label>
              <label>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={updateField}
                />
                Player is active
              </label>
            </div>

            <div className="acp-form-actions acp-full">
              <button type="submit" className="acp-primary" disabled={saving}>
                <Save size={16} />
                {saving ? "Saving..." : editingId !== null ? "Save Changes" : "Create Player"}
              </button>
              <button
                type="button"
                className="acp-secondary"
                disabled={saving}
                onClick={() => setFormOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="acp-panel">
        <div className="acp-list-heading">
          <div>
            <h2>Player Roster</h2>
            <p>Search, edit, or update player status.</p>
          </div>

          <div className="acp-filters">
            <label className="acp-search">
              <Search size={17} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search players..."
                aria-label="Search players"
              />
            </label>

            <select
              value={teamFilter}
              onChange={(event) => setTeamFilter(event.target.value)}
              aria-label="Filter by team"
            >
              <option value="all">All teams</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <p className="acp-empty">Loading players...</p>
        ) : error && players.length === 0 ? (
          <p className="acp-empty">Players could not be loaded. Check the connection and permissions.</p>
        ) : filteredPlayers.length === 0 ? (
          <p className="acp-empty">No matching players found.</p>
        ) : (
          <div className="acp-table-wrap">
            <table className="acp-table">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Team</th>
                  <th>Role</th>
                  <th>Jersey</th>
                  <th>Captain</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.map((player) => (
                  <tr key={player.id}>
                    <td>
                      <div className="acp-player-cell">
                        {player.photo_url ? (
                          <img
                            src={player.photo_url}
                            alt=""
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <span className="acp-avatar">
                            {player.player_name.slice(0, 1)}
                          </span>
                        )}
                        <div>
                          <strong>{player.player_name}</strong>
                          <small>ID: {player.id}</small>
                        </div>
                      </div>
                    </td>
                    <td>{player.cricket_teams?.name || `Team ${player.team_id}`}</td>
                    <td>{player.playing_role}</td>
                    <td>{player.jersey_number ?? "—"}</td>
                    <td>{player.is_captain ? "Yes" : "—"}</td>
                    <td>
                      <span className={`acp-status ${player.is_active ? "active" : "inactive"}`}>
                        {player.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="acp-row-actions">
                        <button type="button" className="acp-edit" onClick={() => openEditForm(player)}>
                          <Pencil size={14} /> Edit
                        </button>
                        <button type="button" className="acp-toggle" onClick={() => toggleStatus(player)}>
                          <Power size={14} />
                          {player.is_active ? "Deactivate" : "Activate"}
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
    </main>
  );
}
