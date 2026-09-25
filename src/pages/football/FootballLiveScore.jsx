import { Link } from "react-router-dom";

import FootballNavbar from "../../components/football/FootballNavbar";
import footballLogo from "../../assets/logo/bcl-football-logo.png";

import { footballMatches } from "../../data/football/footballMatches";
import { footballTeams } from "../../data/football/teams";

import "./FootballLiveScore.css";

function FootballLiveScore() {
  // Get only LIVE matches from unified football match data
  const liveMatches = footballMatches.filter(
    (match) => match.status === "LIVE"
  );

  // Find team by ID
  const getTeam = (teamId) =>
    footballTeams.find((team) => team.id === teamId);

  return (
    <>
      <FootballNavbar />

      <div className="football-live-score-page">

        {/* ================= HERO ================= */}

        <section className="football-live-score-hero">

          <div className="football-live-score-hero-content">

            <img
              src={footballLogo}
              alt="BCL Football"
            />

            <div>
              <span>BCL FOOTBALL</span>

              <h1>Live Score</h1>

              <p>
                Follow live BCL football match updates.
              </p>
            </div>

          </div>

        </section>

        {/* ================= BACK ================= */}

        <div className="football-live-score-back">

          <Link to="/football">
            ← Back to Football
          </Link>

        </div>

        {/* ================= LIVE SECTION ================= */}

        <section className="football-live-score-section">

          <div className="football-live-score-heading">

            <span>LIVE MATCH CENTER</span>

            <h2>Live Matches</h2>

            <p>
              Current football matches being played in the tournament.
            </p>

          </div>

          {/* ================= NO LIVE MATCHES ================= */}

          {liveMatches.length === 0 ? (

            <div className="football-no-live-match">

              <div>⚽</div>

              <h3>No Live Matches</h3>

              <p>
                There are currently no BCL football matches in progress.
              </p>

              <Link to="/fixtures">
                View Fixtures →
              </Link>

            </div>

          ) : (

            /* ================= LIVE MATCHES ================= */

            <div className="football-live-matches-grid">

              {liveMatches.map((match) => {

                const team1 = getTeam(match.team1Id);
                const team2 = getTeam(match.team2Id);

                return (

                  <div
                    className="football-live-match-card"
                    key={match.id}
                  >

                    {/* ================= HEADER ================= */}

                    <div className="football-live-match-header">

                      <div className="football-live-indicator">

                        <span></span>

                        LIVE

                      </div>

                      <strong>
                        {match.minute}'
                      </strong>

                    </div>

                    {/* ================= TEAMS ================= */}

                    <div className="football-live-match-teams">

                      {/* TEAM 1 */}

                      <div className="football-live-team">

                        <div className="football-live-team-logo">

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

                      {/* SCORE */}

                      <div className="football-live-score">

                        <strong>
                          {match.score1}
                        </strong>

                        <span>–</span>

                        <strong>
                          {match.score2}
                        </strong>

                      </div>

                      {/* TEAM 2 */}

                      <div className="football-live-team">

                        <div className="football-live-team-logo">

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

                    {/* ================= MATCH INFO ================= */}

                    <div className="football-live-match-info">

                      <div>

                        <span>STATUS</span>

                        <strong>
                          LIVE
                        </strong>

                      </div>

                      <div>

                        <span>TIME</span>

                        <strong>
                          {match.minute}'
                        </strong>

                      </div>

                      <div>

                        <span>VENUE</span>

                        <strong>
                          {match.venue}
                        </strong>

                      </div>

                    </div>

                    {/* ================= MATCH DETAILS ================= */}

                    <div className="football-live-match-action">

                      <Link
                        to={`/football/match/${match.id}`}
                      >
                        View Match Details →
                      </Link>

                    </div>

                  </div>

                );

              })}

            </div>

          )}

        </section>

        {/* ================= INFO ================= */}

        <section className="football-live-score-info">

          <div>

            <span>BCL FOOTBALL</span>

            <h2>Live Match Updates</h2>

            <p>
              Live scores will later be connected to the BCL
              tournament backend. Match scores, goals and match
              status can then be updated without manually changing
              this page.
            </p>

          </div>

          <Link
            to="/fixtures"
            className="football-live-score-button"
          >
            View Fixtures
          </Link>

        </section>

      </div>
    </>
  );
}

export default FootballLiveScore;