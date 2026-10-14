import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CricketNavbar from "../../components/cricket/CricketNavbar";
import {
  getCricketPlayers,
  getCricketTeams,
} from "../../services/cricketService";
import "./CricketTeams.css";

function CricketTeams() {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [teamsData, playersData] = await Promise.all([
          getCricketTeams(),
          getCricketPlayers(),
        ]);

        if (!mounted) return;

        setTeams(
          teamsData.filter((team) => team.is_active !== false)
        );
        setPlayers(
          playersData.filter((player) => player.is_active !== false)
        );
      } catch (err) {
        if (mounted) {
          setError(err.message || "Unable to load cricket teams.");
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

  const getPlayerCount = (teamId) =>
    players.filter(
      (player) => Number(player.team_id) === Number(teamId)
    ).length;

  return (
    <>
      <CricketNavbar />

      <main className="cricket-teams-page">
        <section className="cricket-teams-header">
          <span className="cricket-section-badge">🏏 BCL CRICKET</span>
          <h1>Cricket Teams</h1>
          <p>
            Teams participating in Baharagora Champions League.
          </p>
        </section>

        {loading ? (
          <div className="cricket-no-teams">
            <div>🏏</div>
            <h2>Loading Teams...</h2>
            <p>Fetching the latest team data.</p>
          </div>
        ) : error ? (
          <div className="cricket-no-teams">
            <h2>Unable to Load Teams</h2>
            <p>{error}</p>
          </div>
        ) : (
          <section className="cricket-teams-grid">
            {teams.length === 0 ? (
              <div className="cricket-no-teams">
                <div>🏏</div>
                <h2>No Teams Registered</h2>
                <p>
                  Cricket teams will appear here after registration.
                </p>
              </div>
            ) : (
              teams.map((team) => (
                <div className="cricket-team-card" key={team.id}>
                  <div className="cricket-team-card-logo">
                    {team.logo_url ? (
                      <img src={team.logo_url} alt={team.name} />
                    ) : (
                      <span>🏏</span>
                    )}
                  </div>

                  <div className="cricket-team-card-info">
                    <h2>{team.name}</h2>

                    <span className="cricket-team-short-name">
                      {team.short_name || ""}
                    </span>

                    <p>📍 {team.city || "Baharagora"}</p>
                  </div>

                  <div className="cricket-team-card-stats">
                    <div>
                      <strong>{getPlayerCount(team.id)}</strong>
                      <span>Players</span>
                    </div>

                    <div>
                      <strong>BCL</strong>
                      <span>Cricket</span>
                    </div>
                  </div>

                  <Link
                    to={`/cricket/teams/${team.id}`}
                    className="cricket-team-view-button"
                  >
                    View Team →
                  </Link>
                </div>
              ))
            )}
          </section>
        )}

        <section className="cricket-teams-bottom">
          <Link to="/cricket" className="cricket-back-button">
            ← Back to Cricket Home
          </Link>
        </section>
      </main>
    </>
  );
}

export default CricketTeams;