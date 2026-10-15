import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import cricketLogo from "../../assets/logo/bcl-cricket-logo.png";
import CricketNavbar from "../../components/cricket/CricketNavbar";
import {
  getCricketTeams,
  getCricketPlayers,
  getCricketFixtures,
} from "../../services/cricketService";
import { cricketResults } from "../../data/cricket/results";
import { cricketStandings } from "../../data/cricket/standings";
import CricketHero3D from "../../components/cricket/CricketHero3D";
import "./CricketHome.css";

function CricketHome() {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadHomeData() {
      try {
        setLoading(true);
        setDataError("");

        const [teamsData, playersData, fixturesData] = await Promise.all([
          getCricketTeams(),
          getCricketPlayers(),
          getCricketFixtures(),
        ]);

        if (!mounted) return;

        setTeams(teamsData.filter((team) => team.is_active !== false));
        setPlayers(playersData.filter((player) => player.is_active !== false));
        setFixtures(fixturesData);
      } catch (error) {
        if (mounted) {
          console.error("Unable to load BCL home data:", error);
          setDataError("Unable to load BCL data from Supabase.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadHomeData();

    return () => {
      mounted = false;
    };
  }, []);

  const teamMap = useMemo(
    () => new Map(teams.map((team) => [Number(team.id), team])),
    [teams]
  );

  const upcomingMatches = useMemo(
    () =>
      fixtures.filter(
        (match) => match.status?.toUpperCase() === "UPCOMING"
      ),
    [fixtures]
  );

  const completedMatches = cricketResults.filter(
    (match) => match.status === "FINISHED"
  );

  // Select the earliest upcoming fixture from Supabase.
  const nextMatch = upcomingMatches[0];

  const latestResult = completedMatches[completedMatches.length - 1];

  const getTeam = (teamId) =>
    teamId == null ? undefined : teamMap.get(Number(teamId));

  const formatMatchDate = (date) => {
    if (!date) return "Date to be announced";

    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatMatchTime = (time) => {
    if (!time) return "";

    const [hours, minutes] = time.split(":");
    const hour = Number(hours);

    if (Number.isNaN(hour)) return time;

    const suffix = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;

    return `${displayHour}:${minutes || "00"} ${suffix}`;
  };

  const getFixtureTeamName = (match, side) => {
    const teamId = side === 1 ? match.team1_id : match.team2_id;
    const placeholder =
      side === 1 ? match.team1_placeholder : match.team2_placeholder;
    const team = getTeam(teamId);

    return team?.name || placeholder || "Team TBD";
  };

  const getFixtureShortName = (match, side) => {
    const teamId = side === 1 ? match.team1_id : match.team2_id;
    const placeholder =
      side === 1 ? match.team1_placeholder : match.team2_placeholder;
    const team = getTeam(teamId);

    return team?.short_name || placeholder || "TBD";
  };

  return (
    <>
      <CricketNavbar />

      <div className="cricket-home-page">
        {/* HERO */}
        <section className="cricket-home-hero">
            <CricketHero3D />
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
              <strong>
                {loading ? "…" : dataError ? "—" : teams.length}
              </strong>
              <span>Teams</span>
            </div>
          </div>

          <div className="cricket-stat-card">
            <div className="cricket-stat-icon">👥</div>
            <div>
              <strong>
                {loading ? "…" : dataError ? "—" : players.length}
              </strong>
              <span>Players</span>
            </div>
          </div>

          <div className="cricket-stat-card">
            <div className="cricket-stat-icon">📅</div>
            <div>
              <strong>
                {loading ? "…" : dataError ? "—" : upcomingMatches.length}
              </strong>
              <span>Upcoming matches</span>
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

        {dataError && (
          <p role="alert" style={{ textAlign: "center", padding: "12px" }}>
            {dataError} Please check the Supabase connection and refresh.
          </p>
        )}

        {/* MATCH CENTER */}
        <section className="cricket-home-section">
          <div className="cricket-section-heading">
            <div>
              <span>LIVE TOURNAMENT INFO</span>
              <h2>Match Center</h2>
            </div>
          </div>

          <div className="cricket-match-center-grid">
            {/* NEXT MATCH — SUPABASE */}
            <div className="cricket-home-match-card">
              <div className="cricket-home-match-header">
                <span>📅 NEXT MATCH</span>
                <span className="cricket-upcoming-label">
                  {nextMatch?.status || "UPCOMING"}
                </span>
              </div>

              {nextMatch ? (
                <>
                  <div className="cricket-home-match-date">
                    {formatMatchDate(nextMatch.match_date)}
                    {" • "}
                    {formatMatchTime(nextMatch.match_time)}
                  </div>

                  <div className="cricket-home-teams">
                    <div className="cricket-home-team">
                      <div className="cricket-home-team-logo">🏏</div>
                      <strong>{getFixtureShortName(nextMatch, 1)}</strong>
                      <span>{getFixtureTeamName(nextMatch, 1)}</span>
                    </div>

                    <div className="cricket-home-vs">
                      <strong>VS</strong>
                    </div>

                    <div className="cricket-home-team">
                      <div className="cricket-home-team-logo">🏏</div>
                      <strong>{getFixtureShortName(nextMatch, 2)}</strong>
                      <span>{getFixtureTeamName(nextMatch, 2)}</span>
                    </div>
                  </div>

                  <div className="cricket-home-venue">
                    📍 {nextMatch.venue || "Venue to be announced"}
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
                  {loading ? "Loading fixtures…" : "No upcoming matches"}
                </div>
              )}
            </div>

            {/* LATEST RESULT — EXISTING LOCAL DATA */}
            <div className="cricket-home-match-card">
              <div className="cricket-home-match-header">
                <span>🏆 LATEST RESULT</span>
                <span className="cricket-finished-label">FINISHED</span>
              </div>

              {latestResult ? (
                <>
                  <div className="cricket-home-match-date">
                    {latestResult.date}
                  </div>

                  <div className="cricket-home-result">
                    <div>
                      <strong>
                        {getTeam(latestResult.team1Id)?.short_name || "TBD"}
                      </strong>
                      <span>
                        {getTeam(latestResult.team1Id)?.name || "Team TBD"}
                      </span>
                      <b>{latestResult.score1}</b>
                    </div>

                    <div className="cricket-result-vs">VS</div>

                    <div>
                      <strong>
                        {getTeam(latestResult.team2Id)?.short_name || "TBD"}
                      </strong>
                      <span>
                        {getTeam(latestResult.team2Id)?.name || "Team TBD"}
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

        {/* POINTS TABLE — EXISTING STANDINGS DATA */}
        <section className="cricket-home-section">
          <div className="cricket-section-heading">
            <div>
              <span>TOURNAMENT STANDINGS</span>
              <h2>Points Table</h2>
            </div>

            <Link to="/cricket/standings">View Full Table →</Link>
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
                {cricketStandings.map((standing) => {
                  const teamInfo = getTeam(standing.teamId);

                  return (
                    <tr key={standing.teamId}>
                      <td>{standing.position}</td>
                      <td>
                        <strong>{teamInfo?.short_name || "TBD"}</strong>
                        <span className="cricket-table-team-name">
                          {teamInfo?.name || "Team TBD"}
                        </span>
                      </td>
                      <td>{standing.played}</td>
                      <td>{standing.won}</td>
                      <td>{standing.lost}</td>
                      <td>
                        <strong className="cricket-table-points">
                          {standing.points}
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

          <Link to="/cricket/fixtures">Explore Cricket →</Link>
        </section>
      </div>
    </>
  );
}

export default CricketHome;
