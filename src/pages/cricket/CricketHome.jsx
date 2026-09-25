import { Link } from "react-router-dom";
import cricketLogo from "../../assets/logo/bcl-cricket-logo.png";
import CricketNavbar from "../../components/cricket/CricketNavbar";
import { cricketTeams } from "../../data/cricket/teams";
import { cricketPlayers } from "../../data/cricket/players";
import { cricketFixtures } from "../../data/cricket/fixtures";
import { cricketResults } from "../../data/cricket/results";
import { cricketStandings } from "../../data/cricket/standings";

import "./CricketHome.css";

function CricketHome() {
  const upcomingMatches = cricketFixtures.filter(
    (match) => match.status === "UPCOMING"
  );

  const completedMatches = cricketResults.filter(
    (match) => match.status === "FINISHED"
  );

  const nextMatch = upcomingMatches[0];
  const latestResult = completedMatches[completedMatches.length - 1];

  const getTeam = (teamId) => {
    return cricketTeams.find((team) => team.id === teamId);
  };

  return (
    <>
    <CricketNavbar />
    <div className="cricket-home-page">
      {/* HERO */}
      <section className="cricket-home-hero">
        <div className="cricket-home-hero-content">
          <div className="cricket-home-logo">
            <img src={cricketLogo} alt="BCL Cricket" />
          </div>

          <div className="cricket-home-hero-text">
            <span className="cricket-home-badge">
              🏏 BAHARAGORA CHAMPIONS LEAGUE
            </span>

            <h1>BCL Cricket</h1>

            <p>
              Follow fixtures, results, teams, players and the latest
              cricket action from Baharagora.
            </p>

            <div className="cricket-home-hero-buttons">
              <Link
                to="/cricket/fixtures"
                className="cricket-primary-button"
              >
                📅 View Fixtures
              </Link>

              <Link
                to="/cricket/standings"
                className="cricket-secondary-button"
              >
                🏆 Points Table
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="cricket-home-stats">
        <div className="cricket-stat-card">
          <div className="cricket-stat-icon">🏏</div>
          <div>
            <strong>{cricketTeams.length}</strong>
            <span>Teams</span>
          </div>
        </div>

        <div className="cricket-stat-card">
          <div className="cricket-stat-icon">👥</div>
          <div>
            <strong>{cricketPlayers.length}</strong>
            <span>Players</span>
          </div>
        </div>

        <div className="cricket-stat-card">
          <div className="cricket-stat-icon">📅</div>
          <div>
            <strong>{upcomingMatches.length}</strong>
            <span>Upcoming</span>
          </div>
        </div>

        <div className="cricket-stat-card">
          <div className="cricket-stat-icon">🏆</div>
          <div>
            <strong>{completedMatches.length}</strong>
            <span>Completed</span>
          </div>
        </div>
      </section>

      {/* MATCH CENTER */}
      <section className="cricket-home-section">
        <div className="cricket-section-heading">
          <div>
            <span>LIVE TOURNAMENT INFO</span>
            <h2>Match Center</h2>
          </div>
        </div>

        <div className="cricket-match-center-grid">
          {/* NEXT MATCH */}
          <div className="cricket-home-match-card">
            <div className="cricket-home-match-header">
              <span>📅 NEXT MATCH</span>
              <span className="cricket-upcoming-label">
                UPCOMING
              </span>
            </div>

            {nextMatch ? (
              <>
                <div className="cricket-home-match-date">
                  {nextMatch.date} • {nextMatch.time}
                </div>

                <div className="cricket-home-teams">
                  <div className="cricket-home-team">
                    <div className="cricket-home-team-logo">
                      🏏
                    </div>

                    <strong>
                      {getTeam(nextMatch.team1Id)?.shortName}
                    </strong>

                    <span>
                      {getTeam(nextMatch.team1Id)?.name}
                    </span>
                  </div>

                  <div className="cricket-home-vs">
                    <strong>VS</strong>
                  </div>

                  <div className="cricket-home-team">
                    <div className="cricket-home-team-logo">
                      🏏
                    </div>

                    <strong>
                      {getTeam(nextMatch.team2Id)?.shortName}
                    </strong>

                    <span>
                      {getTeam(nextMatch.team2Id)?.name}
                    </span>
                  </div>
                </div>

                <div className="cricket-home-venue">
                  📍 {nextMatch.venue}
                </div>

                <Link
                  to="/cricket/fixtures"
                  className="cricket-home-card-button"
                >
                  View Fixture →
                </Link>
              </>
            ) : (
              <div className="cricket-home-empty">
                No upcoming matches
              </div>
            )}
          </div>

          {/* LATEST RESULT */}
          <div className="cricket-home-match-card">
            <div className="cricket-home-match-header">
              <span>🏆 LATEST RESULT</span>
              <span className="cricket-finished-label">
                FINISHED
              </span>
            </div>

            {latestResult ? (
              <>
                <div className="cricket-home-match-date">
                  {latestResult.date}
                </div>

                <div className="cricket-home-result">
                  <div>
                    <strong>
                      {getTeam(latestResult.team1Id)?.shortName}
                    </strong>

                    <span>
                      {getTeam(latestResult.team1Id)?.name}
                    </span>

                    <b>{latestResult.score1}</b>
                  </div>

                  <div className="cricket-result-vs">
                    VS
                  </div>

                  <div>
                    <strong>
                      {getTeam(latestResult.team2Id)?.shortName}
                    </strong>

                    <span>
                      {getTeam(latestResult.team2Id)?.name}
                    </span>

                    <b>{latestResult.score2}</b>
                  </div>
                </div>

                <div className="cricket-home-venue">
                  📍 {latestResult.venue}
                </div>

                <Link
                  to="/cricket/results"
                  className="cricket-home-card-button"
                >
                  View Results →
                </Link>
              </>
            ) : (
              <div className="cricket-home-empty">
                No completed matches
              </div>
            )}
          </div>
        </div>
      </section>

      {/* POINTS TABLE */}
      <section className="cricket-home-section">
        <div className="cricket-section-heading">
          <div>
            <span>TOURNAMENT STANDINGS</span>
            <h2>Points Table</h2>
          </div>

          <Link to="/cricket/standings">
            View Full Table →
          </Link>
        </div>

        <div className="cricket-home-table-wrapper">
          <table className="cricket-home-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Team</th>
                <th>Played</th>
                <th>Won</th>
                <th>Lost</th>
                <th>Points</th>
              </tr>
            </thead>

            <tbody>
              {cricketStandings.map((team) => {
                const teamInfo = getTeam(team.teamId);

                return (
                  <tr key={team.teamId}>
                    <td>{team.position}</td>

                    <td>
                      <strong>
                        {teamInfo?.shortName}
                      </strong>

                      <span className="cricket-table-team-name">
                        {teamInfo?.name}
                      </span>
                    </td>

                    <td>{team.played}</td>
                    <td>{team.won}</td>
                    <td>{team.lost}</td>

                    <td>
                      <strong className="cricket-table-points">
                        {team.points}
                      </strong>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* QUICK LINKS */}
      <section className="cricket-home-section">
        <div className="cricket-section-heading">
          <div>
            <span>EXPLORE BCL CRICKET</span>
            <h2>Quick Links</h2>
          </div>
        </div>

        <div className="cricket-quick-links">
          <Link to="/cricket/fixtures">
            <span>📅</span>
            <div>
              <strong>Fixtures</strong>
              <small>Upcoming matches</small>
            </div>
          </Link>

          <Link to="/cricket/results">
            <span>🏆</span>
            <div>
              <strong>Results</strong>
              <small>Completed matches</small>
            </div>
          </Link>

          <Link to="/cricket/standings">
            <span>📊</span>
            <div>
              <strong>Standings</strong>
              <small>Points table</small>
            </div>
          </Link>

            <Link
            to="/cricket/live-score"
            className="cricket-live-home-button"
            >
            🔴 <strong>Live Score</strong>
            </Link>

          <Link to="/cricket/teams">
            <span>👥</span>
            <div>
              <strong>Teams</strong>
              <small>All participating teams</small>
            </div>
          </Link>

          <Link to="/cricket/players">
            <span>🏏</span>
            <div>
              <strong>Players</strong>
              <small>Player directory</small>
            </div>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="cricket-home-cta">
        <div>
          <span>🏏 BCL CRICKET</span>
          <h2>Follow Every Match</h2>
          <p>
            Fixtures, results, teams, players and tournament
            standings — all in one place.
          </p>
        </div>

        <Link to="/cricket/fixtures">
          Explore Cricket →
        </Link>
      </section>
    </div>
    </>
  );
}

export default CricketHome;