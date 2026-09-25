import { Link } from "react-router-dom";
import CricketNavbar from "../../components/cricket/CricketNavbar";
import { cricketTeams } from "../../data/cricket/teams";
import { cricketPlayers } from "../../data/cricket/players";
import "./CricketTeams.css";

function CricketTeams() {
  const getPlayerCount = (teamId) => {
    return cricketPlayers.filter(
      (player) => player.teamId === teamId
    ).length;
  };

  return (
    <>
      <CricketNavbar />

      <main className="cricket-teams-page">

        {/* Header */}
        <section className="cricket-teams-header">
          <span className="cricket-section-badge">
            🏏 BCL CRICKET
          </span>

          <h1>Cricket Teams</h1>

          <p>
            Teams participating in Baharagora Champions League.
          </p>
        </section>

        {/* Teams */}
        <section className="cricket-teams-grid">

          {cricketTeams.length === 0 ? (
            <div className="cricket-no-teams">
              <div>🏏</div>

              <h2>No Teams Registered</h2>

              <p>
                Cricket teams will appear here after registration.
              </p>
            </div>
          ) : (
            cricketTeams.map((team) => (
              <div
                className="cricket-team-card"
                key={team.id}
              >

                {/* Team Logo */}
                <div className="cricket-team-card-logo">

                  {team.logo ? (
                    <img
                      src={team.logo}
                      alt={team.name}
                    />
                  ) : (
                    <span>🏏</span>
                  )}

                </div>

                {/* Team Info */}
                <div className="cricket-team-card-info">

                  <h2>{team.name}</h2>

                  <span className="cricket-team-short-name">
                    {team.shortName}
                  </span>

                  <p>
                    📍 {team.city}
                  </p>

                </div>

                {/* Stats */}
                <div className="cricket-team-card-stats">

                  <div>
                    <strong>
                      {getPlayerCount(team.id)}
                    </strong>

                    <span>Players</span>
                  </div>

                  <div>
                    <strong>BCL</strong>

                    <span>Cricket</span>
                  </div>

                </div>

                {/* Button */}
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

        {/* Bottom */}
        <section className="cricket-teams-bottom">

          <Link
            to="/cricket"
            className="cricket-back-button"
          >
            ← Back to Cricket Home
          </Link>

        </section>

      </main>
    </>
  );
}

export default CricketTeams;