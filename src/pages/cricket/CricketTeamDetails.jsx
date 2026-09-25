import { Link, useParams } from "react-router-dom";
import CricketNavbar from "../../components/cricket/CricketNavbar";
import { cricketTeams } from "../../data/cricket/teams";
import { cricketPlayers } from "../../data/cricket/players";
import "./CricketTeamDetails.css";

function CricketTeamDetails() {
  const { teamId } = useParams();

  const team = cricketTeams.find(
    (item) => item.id === Number(teamId)
  );

  const teamPlayers = cricketPlayers.filter(
    (player) => player.teamId === Number(teamId)
  );

  if (!team) {
    return (
      <>
        <CricketNavbar />

        <main className="cricket-team-details-page">
          <div className="cricket-team-not-found">
            <div>🏏</div>

            <h1>Team Not Found</h1>

            <p>
              The requested cricket team does not exist.
            </p>

            <Link
              to="/cricket/teams"
              className="cricket-back-button"
            >
              ← Back to Teams
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <CricketNavbar />

      <main className="cricket-team-details-page">

        {/* Hero */}
        <section className="cricket-team-details-hero">

          <div className="cricket-team-details-logo">
            {team.logo ? (
              <img
                src={team.logo}
                alt={team.name}
              />
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
              <span>{team.shortName}</span>
              <span>📍 {team.city}</span>
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
            <strong>{team.shortName}</strong>
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

              <p>
                Players for this team will appear here.
              </p>
            </div>
          ) : (
            <div className="cricket-player-grid">

              {teamPlayers.map((player) => (
                <div
                  className="cricket-player-card"
                  key={player.id}
                >

                  <div className="cricket-player-number">
                    {player.jerseyNumber}
                  </div>

                  <div className="cricket-player-avatar">
                    👤
                  </div>

                  <div className="cricket-player-info">
                    <h3>{player.name}</h3>

                    <span>{player.role}</span>
                  </div>

                  <div className="cricket-player-role">
                    {player.role}
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

      </main>
    </>
  );
}

export default CricketTeamDetails;