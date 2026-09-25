import { Link } from "react-router-dom";
import CricketNavbar from "../../components/cricket/CricketNavbar";
import { cricketStandings } from "../../data/cricket/standings";
import { cricketTeams } from "../../data/cricket/teams";
import "./CricketStandings.css";

function CricketStandings() {
  const getTeam = (teamId) => {
    return cricketTeams.find((team) => team.id === teamId);
  };

  return (
    <>
      <CricketNavbar />

      <main className="cricket-standings-page">

        {/* Header */}
        <section className="cricket-standings-header">
          <span className="cricket-section-badge">
            🏏 BCL CRICKET
          </span>

          <h1>Points Table</h1>

          <p>
            Cricket league standings of Baharagora Champions League.
          </p>
        </section>

        {/* Table */}
        <section className="cricket-standings-container">

          {cricketStandings.length === 0 ? (
            <div className="cricket-no-standings">
              <div>🏏</div>

              <h2>No Standings Available</h2>

              <p>
                The points table will appear once matches are played.
              </p>
            </div>
          ) : (
            <div className="cricket-table-wrapper">

              <table className="cricket-standings-table">

                <thead>
                  <tr>
                    <th>POS</th>
                    <th>TEAM</th>
                    <th>P</th>
                    <th>W</th>
                    <th>L</th>
                    <th>PTS</th>
                  </tr>
                </thead>

                <tbody>
                  {cricketStandings.map((standing) => {
                    const team = getTeam(standing.teamId);

                    return (
                      <tr key={standing.teamId}>

                        {/* Position */}
                        <td>
                          <span
                            className={`cricket-position ${
                              standing.position <= 3
                                ? "top-position"
                                : ""
                            }`}
                          >
                            {standing.position}
                          </span>
                        </td>

                        {/* Team */}
                        <td>
                          <div className="cricket-standing-team">

                            <div className="cricket-standing-logo">
                              {team?.logo ? (
                                <img
                                  src={team.logo}
                                  alt={team.name}
                                />
                              ) : (
                                "🏏"
                              )}
                            </div>

                            <div>
                              <strong>
                                {team?.name || "Unknown Team"}
                              </strong>

                              <span>
                                {team?.shortName || ""}
                              </span>
                            </div>

                          </div>
                        </td>

                        {/* Played */}
                        <td>{standing.played}</td>

                        {/* Won */}
                        <td className="cricket-wins">
                          {standing.won}
                        </td>

                        {/* Lost */}
                        <td className="cricket-losses">
                          {standing.lost}
                        </td>

                        {/* Points */}
                        <td>
                          <strong className="cricket-points">
                            {standing.points}
                          </strong>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>

              </table>

            </div>
          )}

        </section>

        {/* Legend */}
        <section className="cricket-standings-legend">

          <div>
            <strong>P</strong>
            <span>Played</span>
          </div>

          <div>
            <strong>W</strong>
            <span>Won</span>
          </div>

          <div>
            <strong>L</strong>
            <span>Lost</span>
          </div>

          <div>
            <strong>PTS</strong>
            <span>Points</span>
          </div>

        </section>

        {/* Bottom */}
        <section className="cricket-standings-bottom">

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

export default CricketStandings;