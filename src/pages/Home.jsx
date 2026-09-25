import { Link } from "react-router-dom";
import { useEffect } from "react";

import footballLogo from "../assets/logo/bcl-football-logo.png";
import cricketLogo from "../assets/logo/bcl-cricket-logo.png";

import { footballTeams } from "../data/football/teams";
import { cricketTeams } from "../data/cricket/teams";

import { footballFixtures } from "../data/football/fixtures";
import { cricketFixtures } from "../data/cricket/fixtures";

import { footballResults } from "../data/football/results";
import { cricketResults } from "../data/cricket/results";

import { footballStandings } from "../data/football/standings";
import { cricketStandings } from "../data/cricket/standings";

import { footballMatches } from "../data/football/footballMatches";
import { cricketLiveMatches } from "../data/cricket/liveMatches";

import "./Home.css";

function Home() {

  /* =====================================================
     LIVE MATCH DATA
  ===================================================== */

  const footballLiveMatch = footballMatches.find(
    (match) => match.status === "LIVE"
  );

  const cricketLiveMatch = cricketLiveMatches.find(
    (match) => match.status === "LIVE"
  );


  /* =====================================================
     TEAM HELPERS
  ===================================================== */

  const getFootballTeam = (teamId) =>
    footballTeams.find((team) => team.id === teamId);

  const getCricketTeam = (teamId) =>
    cricketTeams.find((team) => team.id === teamId);


const footballLiveTeam1 = footballLiveMatch
  ? getFootballTeam(footballLiveMatch.team1Id)
  : null;

const footballLiveTeam2 = footballLiveMatch
  ? getFootballTeam(footballLiveMatch.team2Id)
  : null;

const cricketLiveTeam1 = cricketLiveMatch
  ? getCricketTeam(cricketLiveMatch.team1Id)
  : null;

const cricketLiveTeam2 = cricketLiveMatch
  ? getCricketTeam(cricketLiveMatch.team2Id)
  : null;

  /* =====================================================
     UPCOMING MATCHES
  ===================================================== */

  const upcomingFootballMatches = footballMatches.filter(
    (match) => match.status === "UPCOMING"
  );

  const footballTeamCount = footballTeams.length;
  const cricketTeamCount = cricketTeams.length;
  const totalTeams = footballTeamCount + cricketTeamCount;


  /* =====================================================
     DEBUG LOGS
  ===================================================== */

  console.log("Football Teams:", footballTeams);
  console.log("Cricket Teams:", cricketTeams);

  console.log("Football Fixtures:", footballFixtures);
  console.log("Cricket Fixtures:", cricketFixtures);

  console.log("Football Results:", footballResults);
  console.log("Cricket Results:", cricketResults);

  console.log("Football Standings:", footballStandings);
  console.log("Cricket Standings:", cricketStandings);

  console.log("Football Live Match:", footballLiveMatch);
  console.log("Cricket Live Match:", cricketLiveMatch);


  /* =====================================================
     SCROLL-REVEAL ANIMATIONS
     Adds "reveal" classes to key sections/cards and fades
     them in with a staggered, modern animation as they
     enter the viewport. Falls back gracefully if
     IntersectionObserver isn't available.
  ===================================================== */

  useEffect(() => {
    const revealSelectors = [
      ".home-section-heading",
      ".home-tournament-item",
      ".home-stat-card",
      ".home-sport-card",
      ".home-live-match-card",
      ".live-match-card",
      ".home-upcoming-card",
      ".home-result-card",
      ".home-standing-card",
      ".home-media-card",
      ".home-follow-card",
      ".home-cta-content",
    ];

    const elements = Array.from(
      document.querySelectorAll(revealSelectors.join(","))
    );

    if (elements.length === 0) return;

    // Group elements by their parent so siblings stagger together
    const staggerCounters = new Map();

    elements.forEach((el) => {
      el.classList.add("reveal-up");

      const parent = el.parentElement;
      const count = staggerCounters.get(parent) ?? 0;
      staggerCounters.set(parent, count + 1);

      el.style.transitionDelay = `${Math.min(count, 6) * 0.09}s`;
    });

    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("in-view"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);


  return (
    <div className="home-page">

     {/* ================= HERO SECTION ================= */}
<section className="home-hero">

  <div className="home-hero-overlay"></div>

  <div className="home-hero-flying-balls" aria-hidden="true">
    <span className="home-hero-ball home-hero-ball-football">⚽</span>
    <span className="home-hero-ball home-hero-ball-cricket">🥎</span>
    <span className="home-hero-ball home-hero-ball-football home-hero-ball-football-2">⚽</span>
  </div>

  <div className="home-hero-content">

    <div className="home-hero-kicker">
      BAHARAGORA CHAMPIONS LEAGUE
    </div>

    <h1>
      BCL <span>2026</span>
    </h1>

    <div className="home-hero-sports">
      ⚽ FOOTBALL
      <span>•</span>
      🏏 CRICKET
    </div>

    <p className="home-hero-description">
      Experience the excitement of Baharagora's biggest local
      sporting tournament with live scores, fixtures, results
      and championship standings.
    </p>

    <div className="home-hero-actions">

      <Link
        to="/football"
        className="home-hero-btn home-hero-btn-football"
      >
        ⚽ Football
      </Link>

      <Link
        to="/cricket"
        className="home-hero-btn home-hero-btn-cricket"
      >
        🏏 Cricket
      </Link>

    </div>

    <div className="home-hero-features">

      <div className="home-hero-feature">
        <strong>🔴 LIVE</strong>
        <span>Match Scores</span>
      </div>

      <div className="home-hero-feature">
        <strong>📅 FIXTURES</strong>
        <span>Match Schedule</span>
      </div>

      <div className="home-hero-feature">
        <strong>🏆 RESULTS</strong>
        <span>Match Results</span>
      </div>

      <div className="home-hero-feature">
        <strong>📊 STANDINGS</strong>
        <span>League Table</span>
      </div>

    </div>

  </div>

</section>

      {/* ================= TOURNAMENT INFO STRIP ================= */}
<section className="home-tournament-info">
  <div className="home-tournament-info-container">

    <div className="home-tournament-item">
      <div className="home-tournament-icon">🏆</div>
      <div>
        <strong>BCL 2026</strong>
        <span>Bahargora Champions League</span>
      </div>
    </div>

    <div className="home-tournament-item">
      <div className="home-tournament-icon">⚽</div>
      <div>
        <strong>FOOTBALL</strong>
        <span>Championship</span>
      </div>
    </div>

    <div className="home-tournament-item">
      <div className="home-tournament-icon">🏏</div>
      <div>
        <strong>CRICKET</strong>
        <span>Championship</span>
      </div>
    </div>

    <div className="home-tournament-item">
      <div className="home-tournament-icon">👥</div>
      <div>
        <strong>8 TEAMS</strong>
        <span>Competing</span>
      </div>
    </div>

    <div className="home-tournament-item">
      <div className="home-tournament-icon">📅</div>
      <div>
        <strong>2026</strong>
        <span>Tournament Season</span>
      </div>
    </div>

  </div>
</section>

{/* ================= TOURNAMENT STATISTICS ================= */}
<section className="home-tournament-stats">
  <div className="home-section-container">

    <div className="home-tournament-stats-grid">

      <div className="home-stat-card">
        <div className="home-stat-icon">🏆</div>

        <div className="home-stat-content">
          <strong>BCL 2026</strong>
          <span>Tournament</span>
        </div>
      </div>


      <div className="home-stat-card">
        <div className="home-stat-icon">⚽</div>

        <div className="home-stat-content">
          <strong>{footballTeamCount}</strong>
          <span>Football Teams</span>
        </div>
      </div>


      <div className="home-stat-card">
        <div className="home-stat-icon">🏏</div>

        <div className="home-stat-content">
          <strong>{cricketTeamCount}</strong>
          <span>Cricket Teams</span>
        </div>
      </div>


      <div className="home-stat-card">
        <div className="home-stat-icon">👥</div>

        <div className="home-stat-content">
          <strong>{totalTeams}</strong>
          <span>Total Teams</span>
        </div>
      </div>


      <div className="home-stat-card">
        <div className="home-stat-icon">📅</div>

        <div className="home-stat-content">
          <strong>2026</strong>
          <span>Season</span>
        </div>
      </div>

    </div>

  </div>
</section>


      {/* ================= SPORTS SECTION ================= */}
<section className="home-sports-section">

  <div className="home-section-container">

    <div className="home-section-heading">
      <span>EXPLORE BCL</span>
      <h2>Choose Your Sport</h2>
      <p>
        Follow all the action from the BCL Football and Cricket tournaments.
      </p>
    </div>


    <div className="home-sports-grid">

      {/* FOOTBALL CARD */}
      <div className="home-sport-card home-sport-football">

        <div className="home-sport-card-top">

          <img
            src={footballLogo}
            alt="BCL Football"
            className="home-sport-logo"
          />

          <div className="home-sport-badge">
            ⚽ FOOTBALL
          </div>

        </div>


        <div className="home-sport-card-content">

          <h3>BCL Football</h3>

          <p>
            Follow live football matches, fixtures, results,
            teams, players and league standings.
          </p>


          <div className="home-sport-features">

            <span>🔴 Live Scores</span>
            <span>📅 Fixtures</span>
            <span>🏆 Results</span>
            <span>📊 Standings</span>

          </div>


          <Link
            to="/football"
            className="home-sport-button"
          >
            Explore Football
            <span>→</span>
          </Link>

        </div>

      </div>


      {/* CRICKET CARD */}
      <div className="home-sport-card home-sport-cricket">

        <div className="home-sport-card-top">

          <img
            src={cricketLogo}
            alt="BCL Cricket"
            className="home-sport-logo"
          />

          <div className="home-sport-badge">
            🏏 CRICKET
          </div>

        </div>


        <div className="home-sport-card-content">

          <h3>BCL Cricket</h3>

          <p>
            Follow live cricket matches, fixtures, results,
            teams, players and tournament standings.
          </p>


          <div className="home-sport-features">

            <span>🔴 Live Scores</span>
            <span>📅 Fixtures</span>
            <span>🏆 Results</span>
            <span>📊 Standings</span>

          </div>


          <Link
            to="/cricket"
            className="home-sport-button"
          >
            Explore Cricket
            <span>→</span>
          </Link>

        </div>

      </div>

    </div>

  </div>

</section>


      {/* ================= LIVE MATCHES ================= */}
<section className="home-live-highlight">

  <div className="home-section-container">

    <div className="home-live-heading">

      <div>
        <span className="home-live-kicker">
          🔴 LIVE NOW
        </span>

        <h2>Live Matches</h2>

        <p>
          Follow the action from the BCL tournament.
        </p>
      </div>

      <Link
        to="/football/live-score"
        className="home-live-view-all"
      >
        View Live Scores →
      </Link>

    </div>


    <div className="home-live-highlight-grid">

      {/* ================= FOOTBALL LIVE ================= */}
      {footballLiveMatch && (
        <div className="home-live-match-card home-live-football">

          <div className="home-live-card-header">

            <span>⚽ FOOTBALL</span>

            <strong>
              🔴 LIVE
            </strong>

          </div>


          <div className="home-live-teams">

            <div className="home-live-team">

              <strong>
                {footballLiveTeam1?.name || "Team A"}
              </strong>

              <span>
                {footballLiveMatch.score1 ?? 0}
              </span>

            </div>


            <div className="home-live-vs">
              VS
            </div>


            <div className="home-live-team">

              <strong>
                {footballLiveTeam2?.name || "Team B"}
              </strong>

              <span>
                {footballLiveMatch.score2 ?? 0}
              </span>

            </div>

          </div>


          <div className="home-live-match-meta">

            <span>
              ⏱ {footballLiveMatch.minute ?? 0}'
            </span>

            <span>
              🏟 {footballLiveMatch.venue}
            </span>

          </div>


          <Link
            to="/football/live-score"
            className="home-live-score-button"
          >
            View Live Score →
          </Link>

        </div>
      )}


      {/* ================= CRICKET LIVE ================= */}
      {cricketLiveMatch && (
        <div className="home-live-match-card home-live-cricket">

          <div className="home-live-card-header">

            <span>🏏 CRICKET</span>

            <strong>
              🔴 LIVE
            </strong>

          </div>


          <div className="home-cricket-live-score">

            <div className="home-cricket-team">

              <strong>
                {cricketLiveTeam1?.name || "Team A"}
              </strong>

              <span>
                {cricketLiveMatch.innings?.[0]?.runs ?? 0}/
                {cricketLiveMatch.innings?.[0]?.wickets ?? 0}
              </span>

              <small>
                {cricketLiveMatch.innings?.[0]?.overs || "0.0"} overs
              </small>

            </div>


            <div className="home-cricket-vs">
              VS
            </div>


            <div className="home-cricket-team">

              <strong>
                {cricketLiveTeam2?.name || "Team B"}
              </strong>

              <span>
                {cricketLiveMatch.innings?.[1]?.runs ?? 0}/
                {cricketLiveMatch.innings?.[1]?.wickets ?? 0}
              </span>

              <small>
                {cricketLiveMatch.innings?.[1]?.overs || "0.0"} overs
              </small>

            </div>

          </div>


          <div className="home-live-match-meta">

            <span>
              🏟 {cricketLiveMatch.venue}
            </span>

            <span>
              🏏 Innings {cricketLiveMatch.currentInnings || 1}
            </span>

          </div>


          <Link
            to="/cricket/live-score"
            className="home-live-score-button"
          >
            View Live Score →
          </Link>

        </div>
      )}

    </div>

  </div>

</section>


      {/* =================================================
          LIVE MATCH STREAM
      ================================================= */}

      <section className="live-section">

        <div className="section-heading light-heading">

          <span>LIVE NOW</span>

          <h2>
            Live Match & Auction Stream
          </h2>

        </div>


        <div className="live-match-card">

          <div className="live-match-header">

            <span className="live-badge">

              <span className="live-dot"></span>

              LIVE STREAM

            </span>

            <span className="match-type">
              🏆 BCL Match Day
            </span>

          </div>


          <div
            className="home-youtube-container"
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16/9",
              background: "#000"
            }}
          >

            <iframe
              src="https://www.youtube.com/embed/42xFSI6kRtM?si=go8F8JTWl6l7I4TE"
              title="BCL Live Stream"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: 0
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />

          </div>


          <div
            className="live-match-footer"
            style={{ marginTop: "15px" }}
          >

            <span>
              📍 Baharagora Stadium
            </span>

            <Link to="/media">
              More Videos →
            </Link>

          </div>

        </div>

      </section>


      {/* ================= UPCOMING MATCHES ================= */}
<section className="home-upcoming-section">

  <div className="home-section-container">

    <div className="home-section-heading home-upcoming-heading">

      <div>
        <span>COMING UP</span>

        <h2>Upcoming Matches</h2>

        <p>
          Don't miss the next BCL Football and Cricket matches.
        </p>
      </div>

    </div>


    <div className="home-upcoming-list">

      {/* ================= FOOTBALL FIXTURES ================= */}

      {upcomingFootballMatches.slice(0, 3).map((match) => {

        const team1 = getFootballTeam(match.team1Id);
        const team2 = getFootballTeam(match.team2Id);

        return (
          <div
            className="home-upcoming-card"
            key={`football-${match.id}`}
          >

            <div className="home-upcoming-date">

              <strong>
                {formatMatchDate(match.date)}
              </strong>

              <span>
                {formatMatchTime(match.time)}
              </span>

            </div>


            <div className="home-upcoming-sport football">

              ⚽ FOOTBALL

            </div>


            <div className="home-upcoming-teams">

              <strong>
                {team1?.name || "Team A"}
              </strong>

              <span>VS</span>

              <strong>
                {team2?.name || "Team B"}
              </strong>

            </div>


            <div className="home-upcoming-venue">

              🏟 {match.venue}

            </div>


            <Link
              to="/fixtures"
              className="home-upcoming-link"
            >
              View Fixture →
            </Link>

          </div>
        );
      })}


      {/* ================= CRICKET FIXTURES ================= */}

      {cricketFixtures.slice(0, 3).map((match) => {

        const team1 = getCricketTeam(match.team1Id);
        const team2 = getCricketTeam(match.team2Id);

        return (
          <div
            className="home-upcoming-card"
            key={`cricket-${match.id}`}
          >

            <div className="home-upcoming-date">

              <strong>
                {formatMatchDate(match.date)}
              </strong>

              <span>
                {formatMatchTime(match.time)}
              </span>

            </div>


            <div className="home-upcoming-sport cricket">

              🏏 CRICKET

            </div>


            <div className="home-upcoming-teams">

              <strong>
                {team1?.name || "Team A"}
              </strong>

              <span>VS</span>

              <strong>
                {team2?.name || "Team B"}
              </strong>

            </div>


            <div className="home-upcoming-venue">

              🏟 {match.venue}

            </div>


            <Link
              to="/cricket/fixtures"
              className="home-upcoming-link"
            >
              View Fixture →
            </Link>

          </div>
        );
      })}


      {upcomingFootballMatches.length === 0 &&
        cricketFixtures.length === 0 && (
          <div className="empty-home-message">
            No upcoming matches available.
          </div>
        )}

    </div>

  </div>

</section>


      {/* ================= RESULTS ================= */}
<section className="home-results-section">

  <div className="home-section-container">

    <div className="home-section-heading">

      <span>RECENT ACTION</span>

      <h2>Latest Results</h2>

      <p>
        Check the latest completed BCL Football and Cricket matches.
      </p>

    </div>


    <div className="home-results-grid">

      {/* ================= FOOTBALL RESULT ================= */}

      {footballResults.slice(0, 1).map((result) => {

        const team1 = getFootballTeam(result.team1Id);
        const team2 = getFootballTeam(result.team2Id);

        return (
          <div
            className="home-result-card home-result-football"
            key={`football-result-${result.id}`}
          >

            <div className="home-result-header">

              <span>
                ⚽ FOOTBALL
              </span>

              <strong>
                FINAL
              </strong>

            </div>


            <div className="home-result-body">

              <div className="home-result-date">

                {formatMatchDate(result.date)}

              </div>


              <div className="home-result-teams">

                <div className="home-result-team">

                  <strong>
                    {team1?.name || "Team A"}
                  </strong>

                  <span>
                    {result.score1 ?? 0}
                  </span>

                </div>


                <div className="home-result-vs">
                  FT
                </div>


                <div className="home-result-team">

                  <strong>
                    {team2?.name || "Team B"}
                  </strong>

                  <span>
                    {result.score2 ?? 0}
                  </span>

                </div>

              </div>


              <div className="home-result-venue">

                🏟 {result.venue}

              </div>


              <Link
                to="/results"
                className="home-result-link"
              >
                View All Results →
              </Link>

            </div>

          </div>
        );
      })}


      {/* ================= CRICKET RESULT ================= */}

      {cricketResults.slice(0, 1).map((result) => {

        const team1 = getCricketTeam(result.team1Id);
        const team2 = getCricketTeam(result.team2Id);

        return (
          <div
            className="home-result-card home-result-cricket"
            key={`cricket-result-${result.id}`}
          >

            <div className="home-result-header">

              <span>
                🏏 CRICKET
              </span>

              <strong>
                FINAL
              </strong>

            </div>


            <div className="home-result-body">

              <div className="home-result-date">

                {formatMatchDate(result.date)}

              </div>


              <div className="home-result-teams">

                <div className="home-result-team">

                  <strong>
                    {team1?.name || "Team A"}
                  </strong>

                  <span className="home-cricket-result-score">
                    {result.score1}
                  </span>

                </div>


                <div className="home-result-vs">
                  VS
                </div>


                <div className="home-result-team">

                  <strong>
                    {team2?.name || "Team B"}
                  </strong>

                  <span className="home-cricket-result-score">
                    {result.score2}
                  </span>

                </div>

              </div>


              <div className="home-result-venue">

                🏟 {result.venue}

              </div>


              <Link
                to="/cricket/results"
                className="home-result-link"
              >
                View All Results →
              </Link>

            </div>

          </div>
        );
      })}


      {footballResults.length === 0 &&
        cricketResults.length === 0 && (
          <div className="empty-home-message">
            No match results available.
          </div>
        )}

    </div>

  </div>

</section>


      {/* ================= STANDINGS ================= */}
<section className="home-standings-section">
  <div className="home-section-container">

    <div className="home-section-heading">
      <span>LEAGUE TABLE</span>
      <h2>Championship Standings</h2>
      <p>
        Track team performance and points throughout the BCL 2026 season.
      </p>
    </div>

    <div className="home-standings-grid">

      {/* ================= FOOTBALL STANDINGS ================= */}
      <div className="home-standing-card home-standing-football">

        <div className="home-standing-header">
          <div>
            <span>⚽ FOOTBALL</span>
            <h3>League Standings</h3>
          </div>

          <Link
            to="/football/standings"
            className="home-standing-header-link"
          >
            Full Table →
          </Link>
        </div>

        <div className="home-standing-table-wrapper">
          <table className="home-standing-table">

            <thead>
              <tr>
                <th>#</th>
                <th>TEAM</th>
                <th>P</th>
                <th>W</th>
                <th>L</th>
                <th>PTS</th>
              </tr>
            </thead>

            <tbody>
              {footballStandings.slice(0, 4).map((standing) => {
                const team = getFootballTeam(standing.teamId);

                return (
                  <tr key={`football-standing-${standing.teamId}`}>

                    <td>
                      <span
                        className={`home-standing-position position-${standing.position}`}
                      >
                        {standing.position}
                      </span>
                    </td>

                    <td>
                      <div className="home-standing-team">
                        <strong>
                          {team?.name || "Team"}
                        </strong>
                      </div>
                    </td>

                    <td>{standing.played}</td>
                    <td>{standing.won}</td>
                    <td>{standing.lost}</td>

                    <td>
                      <strong className="home-standing-points">
                        {standing.points}
                      </strong>
                    </td>

                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>

        <div className="home-standing-footer">
          <Link
            to="/football/standings"
            className="home-standing-button home-standing-button-football"
          >
            View Football Standings
            <span>→</span>
          </Link>
        </div>

      </div>


      {/* ================= CRICKET STANDINGS ================= */}
      <div className="home-standing-card home-standing-cricket">

        <div className="home-standing-header">
          <div>
            <span>🏏 CRICKET</span>
            <h3>Tournament Standings</h3>
          </div>

          <Link
            to="/cricket/standings"
            className="home-standing-header-link"
          >
            Full Table →
          </Link>
        </div>

        <div className="home-standing-table-wrapper">
          <table className="home-standing-table">

            <thead>
              <tr>
                <th>#</th>
                <th>TEAM</th>
                <th>P</th>
                <th>W</th>
                <th>L</th>
                <th>PTS</th>
              </tr>
            </thead>

            <tbody>
              {cricketStandings.slice(0, 4).map((standing) => {
                const team = getCricketTeam(standing.teamId);

                return (
                  <tr key={`cricket-standing-${standing.teamId}`}>

                    <td>
                      <span
                        className={`home-standing-position position-${standing.position}`}
                      >
                        {standing.position}
                      </span>
                    </td>

                    <td>
                      <div className="home-standing-team">
                        <strong>
                          {team?.name || "Team"}
                        </strong>
                      </div>
                    </td>

                    <td>{standing.played}</td>
                    <td>{standing.won}</td>
                    <td>{standing.lost}</td>

                    <td>
                      <strong className="home-standing-points">
                        {standing.points}
                      </strong>
                    </td>

                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>

        <div className="home-standing-footer">
          <Link
            to="/cricket/standings"
            className="home-standing-button home-standing-button-cricket"
          >
            View Cricket Standings
            <span>→</span>
          </Link>
        </div>

      </div>

    </div>

  </div>
</section>


      {/* =================================================
    BCL MEDIA
================================================= */}

<section className="home-media-showcase">

  <div className="home-section-container">

    <div className="home-section-heading home-media-heading">

      <span>BCL MEDIA</span>

      <h2>
        Experience the BCL Action
      </h2>

      <p>
        Follow BCL moments, match highlights, tournament videos
        and updates across our social platforms.
      </p>

    </div>


    <div className="home-media-grid">


      {/* ================= INSTAGRAM ================= */}

      <div className="home-media-card home-media-instagram">

        <div className="home-media-card-top">

          <div className="home-media-icon">
            📸
          </div>

          <div className="home-media-platform">

            <span>FOLLOW US ON</span>

            <strong>
              Instagram
            </strong>

          </div>

        </div>


        <div className="home-media-card-content">

          <h3>
            BCL on Instagram
          </h3>

          <p>
            Watch BCL Reels, match moments, player highlights,
            team updates and tournament promotions.
          </p>


          <div className="home-media-tags">

            <span>🎬 Reels</span>

            <span>📸 Photos</span>

            <span>🔥 Highlights</span>

          </div>


          <a
            href="https://www.instagram.com/bcl.__official?stkn=MWl2MmY3YTExY28zOA%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="home-media-button"
          >
            Follow on Instagram

            <span>
              ↗
            </span>

          </a>

        </div>

      </div>


      {/* ================= YOUTUBE ================= */}

      <div className="home-media-card home-media-youtube">

        <div className="home-media-card-top">

          <div className="home-media-icon">
            ▶️
          </div>

          <div className="home-media-platform">

            <span>WATCH US ON</span>

            <strong>
              YouTube
            </strong>

          </div>

        </div>


        <div className="home-media-card-content">

          <h3>
            BCL on YouTube
          </h3>

          <p>
            Watch match highlights, tournament videos,
            interviews and special BCL content.
          </p>


          <div className="home-media-tags">

            <span>🎥 Videos</span>

            <span>🏆 Highlights</span>

            <span>🔴 Live</span>

          </div>


          <a
            href="https://www.youtube.com/@AdityaSports"
            target="_blank"
            rel="noopener noreferrer"
            className="home-media-button"
          >
            Watch BCL Videos

            <span>
              ↗
            </span>

          </a>

        </div>

      </div>


      {/* ================= BCL MEDIA ================= */}

      <div className="home-media-card home-media-videos">

        <div className="home-media-card-top">

          <div className="home-media-icon">
            📷
          </div>

          <div className="home-media-platform">

            <span>TOURNAMENT</span>

            <strong>
              BCL Media
            </strong>

          </div>

        </div>


        <div className="home-media-card-content">

          <h3>
            Matchday Memories
          </h3>

          <p>
            Explore BCL matchday photos, tournament moments
            and special content from Baharagora.
          </p>


          <div className="home-media-tags">

            <span>⚽ Football</span>

            <span>🏏 Cricket</span>

            <span>📸 Photos</span>

          </div>


          <Link
            to="/media"
            className="home-media-button"
          >
            Explore BCL Media

            <span>
              →
            </span>

          </Link>

        </div>

      </div>


    </div>

  </div>

</section>

{/* =================================================
    WHY FOLLOW BCL
================================================= */}

<section className="home-follow-section">

  <div className="home-section-container">

    <div className="home-section-heading">

      <span>FOLLOW THE TOURNAMENT</span>

      <h2>
        Why Follow BCL?
      </h2>

      <p>
        Everything you need to stay connected with the
        Baharagora Champions League.
      </p>

    </div>


    <div className="home-follow-grid">


      {/* LIVE UPDATES */}

      <div className="home-follow-card">

        <div className="home-follow-icon">
          🔴
        </div>

        <div className="home-follow-content">

          <h3>
            Live Updates
          </h3>

          <p>
            Follow live football and cricket match scores
            and important match updates.
          </p>

          <Link
            to="/football/live-score"
            className="home-follow-link"
          >
            View Live Scores →
          </Link>

        </div>

      </div>


      {/* FIXTURES */}

      <div className="home-follow-card">

        <div className="home-follow-icon">
          📅
        </div>

        <div className="home-follow-content">

          <h3>
            Fixtures
          </h3>

          <p>
            Check upcoming BCL matches, dates, venues
            and scheduled match times.
          </p>

          <Link
            to="/fixtures"
            className="home-follow-link"
          >
            View Fixtures →
          </Link>

        </div>

      </div>


      {/* STANDINGS */}

      <div className="home-follow-card">

        <div className="home-follow-icon">
          📊
        </div>

        <div className="home-follow-content">

          <h3>
            Standings
          </h3>

          <p>
            Track team performance, points, wins and
            league positions throughout the tournament.
          </p>

          <Link
            to="/football/standings"
            className="home-follow-link"
          >
            View Standings →
          </Link>

        </div>

      </div>


      {/* RESULTS */}

      <div className="home-follow-card">

        <div className="home-follow-icon">
          🏆
        </div>

        <div className="home-follow-content">

          <h3>
            Results
          </h3>

          <p>
            Check completed football and cricket matches
            and their final scores.
          </p>

          <Link
            to="/results"
            className="home-follow-link"
          >
            View Results →
          </Link>

        </div>

      </div>


      {/* TEAMS & PLAYERS */}

      <div className="home-follow-card">

        <div className="home-follow-icon">
          👥
        </div>

        <div className="home-follow-content">

          <h3>
            Teams & Players
          </h3>

          <p>
            Explore participating BCL teams and discover
            the players representing them.
          </p>

          <Link
            to="/teams"
            className="home-follow-link"
          >
            Explore Teams →
          </Link>

        </div>

      </div>


      {/* MEDIA */}

      <div className="home-follow-card">

        <div className="home-follow-icon">
          📸
        </div>

        <div className="home-follow-content">

          <h3>
            BCL Media
          </h3>

          <p>
            Watch tournament videos, explore photos,
            reels and memorable BCL moments.
          </p>

          <Link
            to="/media"
            className="home-follow-link"
          >
            Explore Media →
          </Link>

        </div>

      </div>


    </div>

  </div>

</section>

{/* =================================================
    BCL TOURNAMENT CTA
================================================= */}

<section className="home-cta-section">

  <div className="home-cta-overlay"></div>

  <div className="home-cta-content">

    <div className="home-cta-kicker">
      BAHARAGORA CHAMPIONS LEAGUE
    </div>

    <div className="home-cta-trophy">
      🏆
    </div>

    <h2>
      Be Part of BCL <span>2026</span>
    </h2>

    <p>
      Follow every match, support every team and
      experience the excitement of Baharagora's
      biggest local sporting tournament.
    </p>


    <div className="home-cta-actions">

      <Link
        to="/football"
        className="home-cta-button home-cta-football"
      >
        ⚽ Explore Football
        <span>→</span>
      </Link>

      <Link
        to="/cricket"
        className="home-cta-button home-cta-cricket"
      >
        🏏 Explore Cricket
        <span>→</span>
      </Link>

    </div>


    <div className="home-cta-features">

      <span>
        🔴 Live Scores
      </span>

      <span>
        📅 Fixtures
      </span>

      <span>
        🏆 Results
      </span>

      <span>
        📊 Standings
      </span>

    </div>

  </div>

</section>


      {/* =================================================
    BCL FOOTER
================================================= */}

<footer className="bcl-footer">

  <div className="footer-container">


    {/* ================= BRAND ================= */}

    <div className="footer-brand">

      <div className="footer-brand-logo">
        🏆
      </div>

      <div className="footer-brand-title">
        <h2>
          BCL <span>2026</span>
        </h2>

        <p>
          Baharagora Champions League
        </p>
      </div>

      <div className="footer-sports">
        <span>⚽ Football</span>
        <span>🏏 Cricket</span>
      </div>

      <p className="footer-brand-description">
        Celebrating local sporting talent and bringing
        the excitement of football and cricket to Baharagora.
      </p>

    </div>


    {/* ================= QUICK LINKS ================= */}

    <div className="footer-links">

      <h4>
        Quick Links
      </h4>

      <Link to="/football/live-score">
        🔴 Live Scores
      </Link>

      <Link to="/fixtures">
        📅 Fixtures
      </Link>

      <Link to="/results">
        🏆 Results
      </Link>

      <Link to="/football/standings">
        📊 Standings
      </Link>

    </div>


    {/* ================= BCL SPORTS ================= */}

    <div className="footer-links">

      <h4>
        BCL Sports
      </h4>

      <Link to="/football">
        ⚽ Football
      </Link>

      <Link to="/cricket">
        🏏 Cricket
      </Link>

      <Link to="/teams">
        👥 Teams
      </Link>

      <Link to="/players">
        ⭐ Players
      </Link>

      <Link to="/media">
        📸 Media
      </Link>

    </div>


    {/* ================= CONNECT ================= */}

    <div className="footer-contact">

      <h4>
        Connect With BCL
      </h4>

      <p>
        Follow BCL for match updates,
        highlights and tournament news.
      </p>


      <div className="footer-social-links">

        <a
          href="https://www.instagram.com/bcl.__official?stkn=MWl2MmY3YTExY28zOA%3D%3D"
          target="_blank"
          rel="noopener noreferrer"
        >
          📸 Instagram
        </a>

        <a
          href="https://www.youtube.com/@AdityaSports"
          target="_blank"
          rel="noopener noreferrer"
        >
          ▶️ YouTube
        </a>

      </div>


      <div className="footer-location">
        📍 Baharagora, Jharkhand
      </div>

    </div>

  </div>


  {/* ================= FOOTER BOTTOM ================= */}

  <div className="footer-bottom">

    <div className="footer-bottom-content">

      <p>
        © {new Date().getFullYear()} Baharagora Champions League.
        All rights reserved.
      </p>

      <p className="footer-developed">

        Developed by
        <strong>
          Hembram
        </strong>

      </p>

    </div>

  </div>

</footer>

    </div>
  );
}


/* =====================================================
   MATCH CARD
===================================================== */

function MatchCard({
  sport,
  date,
  time,
  team1,
  team2,
  venue
}) {

  return (

    <div className="match-card">

      <div className="match-card-top">

        <span>
          {sport}
        </span>

        <span>
          {formatMatchDate(date)}
        </span>

      </div>


      <div className="match-teams">

        <strong>
          {team1}
        </strong>

        <span>
          VS
        </span>

        <strong>
          {team2}
        </strong>

      </div>


      <div className="match-info">

        <span>
          ⏰ {time}
        </span>

        <span>
          📍 {venue}
        </span>

      </div>

    </div>

  );
}


/* =====================================================
   RESULT CARD
===================================================== */

function ResultCard({
  sport,
  team1,
  score1,
  team2,
  score2,
  date
}) {

  return (

    <div className="result-card">

      <div className="result-top">

        <span>
          {sport}
        </span>

        <span>
          {formatMatchDate(date)}
        </span>

      </div>


      <div className="result-teams">

        <div>

          <strong>
            {team1}
          </strong>

          <b>
            {score1}
          </b>

        </div>


        <div>

          <strong>
            {team2}
          </strong>

          <b>
            {score2}
          </b>

        </div>

      </div>


      <div className="result-status">
        Final
      </div>

    </div>

  );
}


/* =====================================================
   DATE FORMATTER
===================================================== */

function formatMatchDate(date) {

  if (!date) {
    return "";
  }

  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  ).toUpperCase();
}

function formatMatchTime(time) {
  if (!time) return "";

  const [hours, minutes] = time.split(":");

  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}


export default Home;