import { Link } from "react-router-dom";
import CricketNavbar from "../../components/cricket/CricketNavbar";
import { cricketResults } from "../../data/cricket/results";
import { cricketTeams } from "../../data/cricket/teams";
import "./CricketResults.css";

function CricketResults() {
  const getTeam = (teamId) => {
    return cricketTeams.find((team) => team.id === teamId);
  };

  return (
    <>
      <CricketNavbar />

      <main className="cricket-results-page">

        {/* Header */}
        <section className="cricket-results-header">
          <span className="cricket-section-badge">
            🏏 BCL CRICKET
          </span>

          <h1>Cricket Results</h1>

          <p>
            Latest completed matches of Baharagora Champions League.
          </p>
        </section>

        {/* Results */}
        <section className="cricket-results-list">

          {cricketResults.length === 0 ? (
            <div className="cricket-no-results">
              <div>🏏</div>

              <h2>No Results Yet</h2>

              <p>
                Completed matches will appear here.
              </p>
            </div>
          ) : (
            cricketResults.map((result) => {
              const team1 = getTeam(result.team1Id);
              const team2 = getTeam(result.team2Id);

              return (
                <div
                  className="cricket-result-card"
                  key={result.id}
                >

                  {/* Top */}
                  <div className="cricket-result-top">

                    <span className="cricket-result-status">
                      ✓ FINISHED
                    </span>

                    <span className="cricket-result-id">
                      Match #{result.id}
                    </span>

                  </div>

                  {/* Date */}
                  <div className="cricket-result-date">
                    {result.date}
                  </div>

                  {/* Teams + Score */}
                  <div className="cricket-result-teams">

                    {/* Team 1 */}
                    <div className="cricket-result-team">

                      <div className="cricket-result-logo">
                        {team1?.logo ? (
                          <img
                            src={team1.logo}
                            alt={team1.name}
                          />
                        ) : (
                          "🏏"
                        )}
                      </div>

                      <h2>
                        {team1?.name || "Team 1"}
                      </h2>

                      <span>
                        {team1?.shortName || ""}
                      </span>

                    </div>

                    {/* Score */}
                    <div className="cricket-result-score">

                      <div className="cricket-score-numbers">
                        <strong>{result.score1}</strong>

                        <span>—</span>

                        <strong>{result.score2}</strong>
                      </div>

                      <div className="cricket-final-label">
                        FINAL
                      </div>

                    </div>

                    {/* Team 2 */}
                    <div className="cricket-result-team">

                      <div className="cricket-result-logo">
                        {team2?.logo ? (
                          <img
                            src={team2.logo}
                            alt={team2.name}
                          />
                        ) : (
                          "🏏"
                        )}
                      </div>

                      <h2>
                        {team2?.name || "Team 2"}
                      </h2>

                      <span>
                        {team2?.shortName || ""}
                      </span>

                    </div>

                  </div>

                  {/* Venue */}
                  <div className="cricket-result-venue">
                    📍 {result.venue}
                  </div>

                </div>
              );
            })
          )}

        </section>

        {/* Bottom */}
        <section className="cricket-results-bottom">

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

export default CricketResults;