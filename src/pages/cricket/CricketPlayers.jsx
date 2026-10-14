import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CricketNavbar from "../../components/cricket/CricketNavbar";
import {
  getCricketPlayers,
  getCricketTeams,
} from "../../services/cricketService";
import "./CricketPlayers.css";

function CricketPlayers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("ALL");
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [playersData, teamsData] = await Promise.all([
          getCricketPlayers(),
          getCricketTeams(),
        ]);

        if (!mounted) return;

        setPlayers(
          playersData.filter((player) => player.is_active !== false)
        );
        setTeams(
          teamsData.filter((team) => team.is_active !== false)
        );
      } catch (err) {
        if (mounted) {
          setError(err.message || "Unable to load cricket players.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const teamMap = useMemo(
    () => new Map(teams.map((team) => [Number(team.id), team])),
    [teams]
  );

  const filteredPlayers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return players.filter((player) => {
      const name = player.player_name || "";
      const matchesSearch = name.toLowerCase().includes(query);

      const matchesTeam =
        selectedTeam === "ALL" ||
        Number(player.team_id) === Number(selectedTeam);

      return matchesSearch && matchesTeam;
    });
  }, [players, searchTerm, selectedTeam]);

  return (
    <>
      <CricketNavbar />

      <main className="cricket-players-page">
        <section className="cricket-players-header">
          <span className="cricket-section-badge">🏏 BCL CRICKET</span>
          <h1>Cricket Players</h1>
          <p>
            Players participating in Baharagora Champions League.
          </p>
        </section>

        <section className="cricket-player-filters">
          <div className="cricket-player-search">
            <span>🔎</span>
            <input
              type="text"
              placeholder="Search player..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <select
            className="cricket-player-team-filter"
            value={selectedTeam}
            onChange={(event) => setSelectedTeam(event.target.value)}
          >
            <option value="ALL">All Teams</option>

            {teams.map((team) => (
              <option value={team.id} key={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </section>

        {!loading && !error && (
          <div className="cricket-player-result-count">
            Showing <strong>{filteredPlayers.length}</strong> player
            {filteredPlayers.length !== 1 ? "s" : ""}
          </div>
        )}

        {loading ? (
          <div className="cricket-no-players">
            <div>🏏</div>
            <h2>Loading Players...</h2>
            <p>Fetching the latest player data.</p>
          </div>
        ) : error ? (
          <div className="cricket-no-players">
            <h2>Unable to Load Players</h2>
            <p>{error}</p>
          </div>
        ) : (
          <section className="cricket-players-grid">
            {filteredPlayers.length === 0 ? (
              <div className="cricket-no-players">
                <div>👤</div>
                <h2>No Players Found</h2>
                <p>Try changing your search or team filter.</p>
              </div>
            ) : (
              filteredPlayers.map((player) => {
                const team = teamMap.get(Number(player.team_id));

                return (
                  <div
                    className="cricket-player-list-card"
                    key={player.id}
                  >
                    <div className="cricket-player-list-number">
                      #{player.jersey_number ?? "—"}
                    </div>

                    <div className="cricket-player-list-avatar">
                      {player.photo_url ? (
                        <img
                          src={player.photo_url}
                          alt={player.player_name}
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        "👤"
                      )}
                    </div>

                    <div className="cricket-player-list-info">
                      <h2>{player.player_name}</h2>

                      <span className="cricket-player-position">
                        {player.playing_role || "Player"}
                      </span>

                      <div className="cricket-player-team-name">
                        🏏 {team?.name || "Unknown Team"}
                      </div>
                    </div>

                    <div className="cricket-player-team-badge">
                      {team?.short_name || "N/A"}
                    </div>
                  </div>
                );
              })
            )}
          </section>
        )}

        <section className="cricket-players-bottom">
          <Link to="/cricket" className="cricket-back-button">
            ← Back to Cricket Home
          </Link>
        </section>
      </main>
    </>
  );
}

export default CricketPlayers;
