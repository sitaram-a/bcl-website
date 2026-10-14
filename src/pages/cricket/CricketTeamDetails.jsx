
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CricketNavbar from "../../components/cricket/CricketNavbar";
import {
  getCricketTeams,
  getPlayersByTeam,
} from "../../services/cricketService";
import "./CricketTeamDetails.css";

function CricketTeamDetails() {
  const { teamId } = useParams();

  const [team, setTeam] = useState(null);
  const [teamPlayers, setTeamPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadTeamDetails() {
      try {
        setLoading(true);
        setError("");

        const teams = await getCricketTeams();
        const selectedTeam = teams.find(
          (item) => Number(item.id) === Number(teamId)
        );

        if (!mounted) return;

        if (!selectedTeam || selectedTeam.is_active === false) {
          setTeam(null);
          setTeamPlayers([]);
          return;
        }

        setTeam(selectedTeam);

        const players = await getPlayersByTeam(teamId);

        if (!mounted) return;

        setTeamPlayers(
          players.filter((player) => player.is_active !== false)
        );
      } catch (err) {
        if (mounted) {
          setError(
            err.message || "Unable to load team details from Supabase."
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadTeamDetails();

    return () => {
      mounted = false;
    };
  }, [teamId]);

  return (
    <>
      <CricketNavbar />

      <main className="cricket-team-details-page">
        {loading ? (
          <div className="cricket-team-not-found">
            <div>🏏</div>
            <h1>Loading Team...</h1>
            <p>Fetching team information and squad.</p>
          </div>
        ) : error ? (
          <div className="cricket-team-not-found">
            <div>⚠️</div>
            <h1>Unable to Load Team</h1>
            <p>{error}</p>
            <Link
              to="/cricket/teams"
              className="cricket-back-button"
            >
              ← Back to Teams
            </Link>
          </div>
        ) : !team ? (
          <div className="cricket-team-not-found">
            <div>🏏</div>
            <h1>Team Not Found</h1>
            <p>The requested cricket team does not exist.</p>
            <Link
              to="/cricket/teams"
              className="cricket-back-button"
            >
              ← Back to Teams
            </Link>
          </div>
        ) : (
          <>
            {/* Hero */}
            <section className="cricket-team-details-hero">
              <div className="cricket-team-details-logo">
                {team.logo_url ? (
                  <img src={team.logo_url} alt={team.name} />
                ) : (
                  <span>🏏</span>
                )}
              </div>

              <div className="cricket-team-details-info">
                <span className="cricket-section-badge">
                  BCL CRICKET
                </span>

                <h1>{team.name}</h1>

                <div className="cricket-team-details-meta">
                  <span>{team.short_name || "BCL"}</span>
                  <span>📍 {team.city || "Baharagora"}</span>
                </div>
              </div>
            </section>

            {/* Stats */}
            <section className="cricket-team-details-stats">
              <div className="cricket-team-stat-card">
                <strong>{teamPlayers.length}</strong>
                <span>Players</span>
              </div>

              <div className="cricket-team-stat-card">
                <strong>BCL</strong>
                <span>League</span>
              </div>

              <div className="cricket-team-stat-card">
                <strong>{team.short_name || "—"}</strong>
                <span>Short Name</span>
              </div>
            </section>

            {/* Squad */}
            <section className="cricket-team-squad">
              <div className="cricket-team-squad-header">
                <div>
                  <span className="cricket-section-badge">
                    SQUAD
                  </span>
                  <h2>Team Players</h2>
                </div>

                <span className="cricket-player-count">
                  {teamPlayers.length} Players
                </span>
              </div>

              {teamPlayers.length === 0 ? (
                <div className="cricket-empty-squad">
                  <div>👤</div>
                  <h3>No Players Registered</h3>
                  <p>Players for this team will appear here.</p>
                </div>
              ) : (
                <div className="cricket-player-grid">
                  {teamPlayers.map((player) => (
                    <div
                      className="cricket-player-card"
                      key={player.id}
                    >
                      <div className="cricket-player-number">
                        {player.jersey_number ?? "—"}
                      </div>

                      <div className="cricket-player-avatar">
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

                      <div className="cricket-player-info">
                        <h3>{player.player_name}</h3>
                        <span>{player.playing_role || "Player"}</span>
                      </div>

                      <div className="cricket-player-role">
                        {player.playing_role || "Player"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Bottom */}
            <section className="cricket-team-details-bottom">
              <Link
                to="/cricket/teams"
                className="cricket-back-button"
              >
                ← Back to Teams
              </Link>

              <Link
                to="/cricket"
                className="cricket-home-button"
              >
                Cricket Home
              </Link>
            </section>
          </>
        )}
      </main>
    </>
  );
}

export default CricketTeamDetails;
