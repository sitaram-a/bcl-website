import { Link } from "react-router-dom";

import footballLogo from "../../assets/logo/bcl-football-logo.png";

import { footballTeams } from "../../data/football/teams";
import { footballMatches } from "../../data/football/footballMatches";

import FootballNavbar from "../../components/football/FootballNavbar";

import "./FootballResults.css";

function FootballResults() {
  // Get only completed matches
  const footballResults = footballMatches.filter(
    (match) => match.status === "FINISHED"
  );

  // Find team by ID
  const getTeam = (teamId) => {
    return footballTeams.find((team) => team.id === teamId);
  };

  return (
    <>
      <FootballNavbar />

      <div className="football-results-page">

        {/* ================= HEADER ================= */}
        <section className="results-header">
          <div className="results-header-content">

            <div className="results-logo">
              <img
                src={footballLogo}
                alt="BCL Football"
              />
            </div>

            <div>
              <span className="results-kicker">
                BAHARAGORA CHAMPIONS LEAGUE
              </span>

              <h1>Football Results</h1>

              <p>
                Check completed BCL football matches,
                final scores and match details.
              </p>
            </div>

          </div>
        </section>


        {/* ================= BACK BUTTON ================= */}
        <div className="results-back-wrapper">
          <Link
            to="/football"
            className="results-back-button"
          >
            ← Back to Football
          </Link>
        </div>


        {/* ================= RESULTS ================= */}
        <section className="results-section">

          <div className="results-section-heading">

            <span>COMPLETED MATCHES</span>

            <h2>Latest Football Results</h2>

            <p>
              Results from completed Baharagora Champions League
              football matches.
            </p>

          </div>


          <div className="results-list">

            {footballResults.length === 0 ? (

              /* ================= NO RESULTS ================= */
              <div className="no-results">

                <div>⚽</div>

                <h3>No Results Yet</h3>

                <p>
                  Completed match results will appear here.
                </p>

              </div>

            ) : (

              /* ================= RESULT LIST ================= */
              footballResults.map((result) => {

                const team1 = getTeam(result.team1Id);
                const team2 = getTeam(result.team2Id);

                return (
                  <div
                    className="result-card"
                    key={result.id}
                  >

                    {/* ================= DATE ================= */}
                    <div className="result-date">

                      <span>
                        {new Date(result.date).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>

                      <strong>
                        MATCH #{result.id}
                      </strong>

                    </div>


                    {/* ================= MATCH ================= */}
                    <div className="result-match">

                      {/* ================= TEAM 1 ================= */}
                      <div className="result-team">

                        <div className="result-team-logo">

                          {team1?.logo ? (

                            <img
                              src={team1.logo}
                              alt={team1.name}
                            />

                          ) : (

                            <span>
                              {team1?.shortName?.charAt(0) || "?"}
                            </span>

                          )}

                        </div>

                        <h3>
                          {team1?.name || "Unknown Team"}
                        </h3>

                        <span>
                          {team1?.shortName || ""}
                        </span>

                      </div>


                      {/* ================= SCORE ================= */}
                      <div className="result-score">

                        <div className="score-box">

                          <span>
                            {result.score1}
                          </span>

                          <strong>
                            -
                          </strong>

                          <span>
                            {result.score2}
                          </span>

                        </div>

                        <small>
                          FULL TIME
                        </small>

                      </div>


                      {/* ================= TEAM 2 ================= */}
                      <div className="result-team">

                        <div className="result-team-logo">

                          {team2?.logo ? (

                            <img
                              src={team2.logo}
                              alt={team2.name}
                            />

                          ) : (

                            <span>
                              {team2?.shortName?.charAt(0) || "?"}
                            </span>

                          )}

                        </div>

                        <h3>
                          {team2?.name || "Unknown Team"}
                        </h3>

                        <span>
                          {team2?.shortName || ""}
                        </span>

                      </div>

                    </div>


                    {/* ================= DETAILS ================= */}
                    <div className="result-details">

                      <div>

                        <span>
                          VENUE
                        </span>

                        <strong>
                          📍 {result.venue}
                        </strong>

                      </div>


                      <div>

                        <span>
                          STATUS
                        </span>

                        <strong className="result-finished">
                          ✓ {result.status}
                        </strong>

                      </div>

                    </div>


                    {/* ================= MATCH DETAILS ================= */}
                    <div className="result-card-action">

                      <Link
                        to={`/football/match/${result.id}`}
                        className="result-details-button"
                      >
                        View Match Details →
                      </Link>

                    </div>

                  </div>
                );
              })

            )}

          </div>

        </section>


        {/* ================= NAVIGATION ================= */}
        <section className="results-navigation">

          <span>
            BCL FOOTBALL
          </span>

          <h2>
            Follow The Tournament
          </h2>

          <p>
            View upcoming matches, teams and tournament fixtures.
          </p>


          <div className="results-navigation-buttons">

            <Link
              to="/fixtures"
              className="results-primary-button"
            >
              View Fixtures
            </Link>

            <Link
              to="/teams"
              className="results-secondary-button"
            >
              View Teams
            </Link>

          </div>

        </section>

      </div>
    </>
  );
}

export default FootballResults;