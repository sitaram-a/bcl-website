import { Link } from "react-router-dom";
import FootballNavbar from "../../components/football/FootballNavbar";
import footballLogo from "../../assets/logo/bcl-football-logo.png";

import { footballTeams } from "../../data/football/teams";
import { footballPlayers } from "../../data/football/players";
import { footballMatches } from "../../data/football/footballMatches";
import { footballStandings } from "../../data/football/standings";

import "./FootballHome.css";

function FootballHome() {
  // Get upcoming matches from unified match data
  const upcomingMatches = footballMatches.filter(
    (match) => match.status === "UPCOMING"
  );

  // Get completed matches from unified match data
  const finishedMatches = footballMatches.filter(
    (match) => match.status === "FINISHED"
  );

const liveMatches = footballMatches.filter(
  (match) => match.status === "LIVE"
);


  // First upcoming match
  const nextMatch = upcomingMatches[0];

  // Latest completed match
  const latestResult = finishedMatches[0];

  const getTeam = (teamId) =>
    footballTeams.find((team) => team.id === teamId);

  return (
    <>
      <FootballNavbar />

      <div className="football-home-page">

        {/* HERO */}
        <section className="football-home-hero">

          <div className="football-home-hero-content">

            <div className="football-home-hero-text">

              <span className="football-home-kicker">
                BAHARAGORA CHAMPIONS LEAGUE
              </span>

              <h1>
                BCL <span>Football</span>
              </h1>

              <p>
                Follow fixtures, results, teams, players and standings
                from the BCL Football tournament.
              </p>

              <div className="football-home-hero-buttons">

                <Link
                  to="/fixtures"
                  className="football-home-primary-button"
                >
                  View Fixtures
                </Link>

                <Link
                  to="/football/standings"
                  className="football-home-outline-button"
                >
                  Points Table
                </Link>

              </div>

            </div>

            <div className="football-home-logo-wrapper">

              <img
                src={footballLogo}
                alt="BCL Football"
              />

              <div className="football-home-logo-badge">
                ⚽ BCL FOOTBALL
              </div>

            </div>

          </div>

        </section>

        {/* TOURNAMENT STATS */}
       <section className="football-home-stats">

  <div className="football-stat-card">
    <strong>{footballTeams.length}</strong>
    <span>Teams</span>
  </div>

  <div className="football-stat-card">
    <strong>{footballPlayers.length}</strong>
    <span>Players</span>
  </div>

  <div className="football-stat-card">
    <strong>{upcomingMatches.length}</strong>
    <span>Upcoming Matches</span>
  </div>

  <div className="football-stat-card football-live-stat-card">
    <strong>{liveMatches.length}</strong>
    <span>Live Matches</span>
  </div>

  <div className="football-stat-card">
    <strong>{finishedMatches.length}</strong>
    <span>Completed Matches</span>
  </div>

</section>

{/* LIVE MATCH CENTER */}

{liveMatches.length > 0 && (
  <section className="football-home-live">

    <div className="football-section-heading">

      <span>🔴 LIVE NOW</span>

      <h2>Live Match Center</h2>

      <p>
        Follow BCL football matches currently in progress.
      </p>

    </div>

    <div className="football-home-live-grid">

      {liveMatches.map((match) => {

        const team1 = getTeam(match.team1Id);
        const team2 = getTeam(match.team2Id);

        return (
          <div
            className="football-home-live-card"
            key={match.id}
          >

            <div className="football-home-live-header">

              <span>
                <i></i>
                LIVE
              </span>

              <strong>
                {match.minute}'
              </strong>

            </div>

            <div className="football-home-live-teams">

              <div>
                <span className="football-home-live-team-code">
                  {team1?.shortName}
                </span>

                <strong>
                  {team1?.name}
                </strong>
              </div>

              <div className="football-home-live-score">

                <strong>
                  {match.score1}
                </strong>

                <span>–</span>

                <strong>
                  {match.score2}
                </strong>

              </div>

              <div>
                <span className="football-home-live-team-code">
                  {team2?.shortName}
                </span>

                <strong>
                  {team2?.name}
                </strong>
              </div>

            </div>

            <div className="football-home-live-venue">
              📍 {match.venue}
            </div>

            <Link
              to={`/football/match/${match.id}`}
              className="football-home-live-button"
            >
              View Live Match →
            </Link>

          </div>
        );

      })}

    </div>

    <div className="football-centered-button">

      <Link
        to="/football/live-score"
        className="football-home-primary-button"
      >
        View All Live Scores
      </Link>

    </div>

  </section>
)}


        {/* NEXT MATCH + LATEST RESULT */}
        <section className="football-home-matches">

          <div className="football-section-heading">
            <span>MATCH CENTER</span>
            <h2>Match Updates</h2>
            <p>
              Stay updated with upcoming and completed BCL football matches.
            </p>
          </div>

          <div className="football-match-grid">

            {/* NEXT MATCH */}
            <div className="football-match-card">

              <div className="football-match-card-header">
                <span>NEXT MATCH</span>
                <strong>UPCOMING</strong>
              </div>

              {nextMatch && (
                <>
                  <div className="football-match-date">
                    📅 {nextMatch.date}
                    <span> • </span>
                    🕐 {nextMatch.time}
                  </div>

                  <div className="football-match-teams">

                    <div>
                      <div className="football-mini-team">
                        {getTeam(nextMatch.team1Id)?.shortName}
                      </div>

                      <strong>
                        {getTeam(nextMatch.team1Id)?.name}
                      </strong>
                    </div>

                    <span className="football-match-vs">
                      VS
                    </span>

                    <div>
                      <div className="football-mini-team">
                        {getTeam(nextMatch.team2Id)?.shortName}
                      </div>

                      <strong>
                        {getTeam(nextMatch.team2Id)?.name}
                      </strong>
                    </div>

                  </div>

                  <div className="football-match-venue">
                    📍 {nextMatch.venue}
                  </div>
                </>
              )}

              <Link
                to="/fixtures"
                className="football-match-link"
              >
                View All Fixtures →
              </Link>

            </div>

            {/* LATEST RESULT */}
            <div className="football-match-card">

              <div className="football-match-card-header">
                <span>LATEST RESULT</span>
                <strong>FINISHED</strong>
              </div>

              {latestResult && (
                <>
                  <div className="football-match-date">
                    📅 {latestResult.date}
                  </div>

                  <div className="football-result-teams">

                    <div>
                      <strong>
                        {getTeam(latestResult.team1Id)?.name}
                      </strong>

                      <b>
                        {latestResult.score1}
                      </b>
                    </div>

                    <span>–</span>

                    <div>
                      <strong>
                        {getTeam(latestResult.team2Id)?.name}
                      </strong>

                      <b>
                        {latestResult.score2}
                      </b>
                    </div>

                  </div>

                  <div className="football-match-venue">
                    📍 {latestResult.venue}
                  </div>
                </>
              )}

              <Link
                to="/results"
                className="football-match-link"
              >
                View All Results →
              </Link>

            </div>

          </div>

        </section>

        {/* STANDINGS PREVIEW */}
        <section className="football-home-standings">

          <div className="football-section-heading">
            <span>LEAGUE TABLE</span>
            <h2>Current Standings</h2>
            <p>
              Follow the latest BCL Football points table.
            </p>
          </div>

          <div className="football-standing-preview">

            {footballStandings.map((standing) => {

              const team = getTeam(standing.teamId);

              return (
                <div
                  className="football-standing-row"
                  key={standing.teamId}
                >

                  <span className="football-standing-position">
                    {standing.position}
                  </span>

                  <strong>
                    {team?.name}
                  </strong>

                  <span>
                    {standing.played} P
                  </span>

                  <span>
                    {standing.won} W
                  </span>

                  <span className="football-standing-points">
                    {standing.points} PTS
                  </span>

                </div>
              );
            })}

          </div>

          <div className="football-centered-button">
            <Link
              to="/football/standings"
              className="football-home-primary-button"
            >
              View Full Standings
            </Link>
          </div>

        </section>

        {/* TEAMS */}
        <section className="football-home-teams">

          <div className="football-section-heading">
            <span>PARTICIPATING TEAMS</span>
            <h2>BCL Football Teams</h2>
            <p>
              Meet the teams competing in the tournament.
            </p>
          </div>

          <div className="football-home-team-grid">

            {footballTeams.map((team) => {

              const playerCount = footballPlayers.filter(
                (player) => player.teamId === team.id
              ).length;

              return (
                <div
                  className="football-home-team-card"
                  key={team.id}
                >

                  <div className="football-home-team-logo">
                    {team.logo ? (
                      <img
                        src={team.logo}
                        alt={team.name}
                      />
                    ) : (
                      team.shortName.charAt(0)
                    )}
                  </div>

                  <span>{team.shortName}</span>

                  <h3>{team.name}</h3>

                  <p>
                    📍 {team.city}
                  </p>

                  <small>
                    {playerCount} Registered Players
                  </small>

                  <Link
                    to={`/football/teams/${team.id}`}
                  >
                    View Team →
                  </Link>

                </div>
              );
            })}

          </div>

          <div className="football-centered-button">
            <Link
              to="/teams"
              className="football-home-outline-dark-button"
            >
              View All Teams
            </Link>
          </div>

        </section>

        {/* PLAYERS */}
        <section className="football-home-players">

          <div className="football-section-heading">
            <span>BCL FOOTBALL SQUADS</span>
            <h2>Featured Players</h2>
            <p>
              Explore the registered BCL football players.
            </p>
          </div>

          <div className="football-home-player-grid">

            {footballPlayers.slice(0, 3).map((player) => {

              const team = getTeam(player.teamId);

              return (
                <div
                  className="football-home-player-card"
                  key={player.id}
                >

                  <div className="football-home-player-number">
                    {player.jerseyNumber}
                  </div>

                  <div className="football-home-player-icon">
                    ⚽
                  </div>

                  <span>PLAYER</span>

                  <h3>{player.name}</h3>

                  <p>{player.position}</p>

                  <strong>
                    {team?.name}
                  </strong>

                </div>
              );
            })}

          </div>

          <div className="football-centered-button">
            <Link
              to="/players"
              className="football-home-primary-button"
            >
              View All Players
            </Link>
          </div>

        </section>

        {/* FINAL CTA */}
        <section className="football-home-cta">

          <span>BCL FOOTBALL</span>

          <h2>
            Follow Every Match.
            <br />
            Support Every Team.
          </h2>

          <p>
            Fixtures, results, standings, teams and players —
            everything in one place.
          </p>

          <div className="football-home-hero-buttons">

            <Link
              to="/fixtures"
              className="football-home-primary-button"
            >
              Fixtures
            </Link>

            <Link
              to="/teams"
              className="football-home-outline-button"
            >
              Teams
            </Link>

          </div>

        </section>

      </div>
    </>
  );
}

export default FootballHome;