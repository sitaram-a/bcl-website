import { Link } from "react-router-dom";
import CricketNavbar from "../../components/cricket/CricketNavbar";
import { cricketFixtures } from "../../data/cricket/fixtures";
import { cricketTeams } from "../../data/cricket/teams";
import "./CricketFixtures.css";

function CricketFixtures() {
  const getTeam = (teamId) => {
    return cricketTeams.find((team) => team.id === teamId);
  };

  return (
    <>
      <CricketNavbar />

      <main className="cricket-fixtures-page">
        <section className="cricket-fixtures-header">
          <span className="cricket-section-badge">🏏 BCL CRICKET</span>

          <h1>Cricket Fixtures</h1>

          <p>
            Upcoming cricket matches of Baharagora Champions League.
          </p>
        </section>

        <section className="cricket-fixtures-list">
          {cricketFixtures.length === 0 ? (
            <div className="cricket-no-fixtures">
              <div>🏏</div>
              <h2>No Upcoming Fixtures</h2>
              <p>New matches will appear here once scheduled.</p>
            </div>
          ) : (
            cricketFixtures.map((fixture) => {
              const team1 = getTeam(fixture.team1Id);
              const team2 = getTeam(fixture.team2Id);

              return (
                <div
                  className="cricket-fixture-card"
                  key={fixture.id}
                >
                  <div className="cricket-fixture-top">
                    <span className="cricket-fixture-status">
                      {fixture.status}
                    </span>

                    <span className="cricket-fixture-id">
                      Match #{fixture.id}
                    </span>
                  </div>

                  <div className="cricket-fixture-date">
                    <strong>{fixture.date}</strong>
                    <span>{fixture.time}</span>
                  </div>

                  <div className="cricket-fixture-teams">
                    <div className="cricket-fixture-team">
                      <div className="cricket-team-logo">
                        {team1?.logo ? (
                          <img
                            src={team1.logo}
                            alt={team1.name}
                          />
                        ) : (
                          "🏏"
                        )}
                      </div>

                      <h2>{team1?.name || "Team 1"}</h2>
                      <span>{team1?.shortName || ""}</span>
                    </div>

                    <div className="cricket-fixture-vs">
                      <span>VS</span>
                    </div>

                    <div className="cricket-fixture-team">
                      <div className="cricket-team-logo">
                        {team2?.logo ? (
                          <img
                            src={team2.logo}
                            alt={team2.name}
                          />
                        ) : (
                          "🏏"
                        )}
                      </div>

                      <h2>{team2?.name || "Team 2"}</h2>
                      <span>{team2?.shortName || ""}</span>
                    </div>
                  </div>

                  <div className="cricket-fixture-venue">
                    📍 {fixture.venue}
                  </div>
                </div>
              );
            })
          )}
        </section>

        <section className="cricket-fixtures-bottom">
          <Link to="/cricket" className="cricket-back-button">
            ← Back to Cricket Home
          </Link>
        </section>
      </main>
    </>
  );
}

export default CricketFixtures;