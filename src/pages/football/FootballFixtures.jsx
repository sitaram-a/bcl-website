import { Link } from "react-router-dom";

import footballLogo from "../../assets/logo/bcl-football-logo.png";

import { footballTeams } from "../../data/football/teams";
import { footballMatches } from "../../data/football/footballMatches";

import FootballNavbar from "../../components/football/FootballNavbar";

import "./FootballFixtures.css";

function FootballFixtures() {
  // Get only upcoming matches
  const footballFixtures = footballMatches.filter(
    (match) => match.status === "UPCOMING"
  );

  // Find team by ID
  const getTeam = (teamId) => {
    return footballTeams.find((team) => team.id === teamId);
  };

  return (
    <>
      <FootballNavbar />

      <div className="football-fixtures-page">

        {/* ================= HEADER ================= */}
        <section className="fixtures-header">
          <div className="fixtures-header-content">

            <div className="fixtures-logo">
              <img
                src={footballLogo}
                alt="BCL Football"
              />
            </div>

            <div>
              <span className="fixtures-kicker">
                BAHARAGORA CHAMPIONS LEAGUE
              </span>

              <h1>Football Fixtures</h1>

              <p>
                Check upcoming BCL football matches,
                dates, venues and match details.
              </p>
            </div>

          </div>
        </section>


        {/* ================= BACK BUTTON ================= */}
        <div className="fixtures-back-wrapper">

          <Link
            to="/football"
            className="fixtures-back-button"
          >
            ← Back to Football
          </Link>

        </div>


        {/* ================= FIXTURES ================= */}
        <section className="fixtures-section">

          <div className="fixtures-section-heading">

            <span>UPCOMING MATCHES</span>

            <h2>Football Fixtures</h2>

            <p>
              Upcoming Baharagora Champions League
              football matches.
            </p>

          </div>


          <div className="fixtures-list">

            {footballFixtures.length === 0 ? (

              /* ================= NO FIXTURES ================= */
              <div className="no-fixtures">

                <div>⚽</div>

                <h3>No Upcoming Fixtures</h3>

                <p>
                  Upcoming football matches will appear here.
                </p>

              </div>

            ) : (

              /* ================= FIXTURE LIST ================= */
              footballFixtures.map((fixture) => {

                const team1 = getTeam(fixture.team1Id);
                const team2 = getTeam(fixture.team2Id);

                return (
                  <div
                    className="fixture-card"
                    key={fixture.id}
                  >

                    {/* ================= DATE ================= */}
                    <div className="fixture-date">

                      <span>
                        {new Date(fixture.date).toLocaleDateString(
                          "en-IN",
                          {
                            weekday: "short",
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>

                      <strong>
                        MATCH #{fixture.id}
                      </strong>

                    </div>


                    {/* ================= MATCH ================= */}
                    <div className="fixture-match">

                      {/* TEAM 1 */}
                      <div className="fixture-team">

                        <div className="fixture-team-logo">

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


                      {/* VS */}
                      <div className="fixture-vs">

                        <span>
                          KICK-OFF
                        </span>

                        <strong>
                          VS
                        </strong>

                        <small>
                          {fixture.time}
                        </small>

                      </div>


                      {/* TEAM 2 */}
                      <div className="fixture-team">

                        <div className="fixture-team-logo">

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
                    <div className="fixture-details">

                      <div>

                        <span>
                          VENUE
                        </span>

                        <strong>
                          📍 {fixture.venue}
                        </strong>

                      </div>


                      <div>

                        <span>
                          STATUS
                        </span>

                        <strong className="fixture-upcoming">
                          ● {fixture.status}
                        </strong>

                      </div>

                    </div>


                    {/* ================= MATCH DETAILS ================= */}
                    <div className="fixture-card-action">

                      <Link
                        to={`/football/match/${fixture.id}`}
                        className="fixture-details-button"
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
        <section className="fixtures-navigation">

          <span>
            BCL FOOTBALL
          </span>

          <h2>
            Follow The Tournament
          </h2>

          <p>
            Check completed matches and explore
            BCL football teams.
          </p>


          <div className="fixtures-navigation-buttons">

            <Link
              to="/results"
              className="fixtures-primary-button"
            >
              View Results
            </Link>

            <Link
              to="/teams"
              className="fixtures-secondary-button"
            >
              View Teams
            </Link>

          </div>

        </section>

      </div>
    </>
  );
}

export default FootballFixtures;