import { Link } from "react-router-dom";

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

import "./Home.css";

function Home() {

    console.log("Football Teams:", footballTeams);
console.log("Cricket Teams:", cricketTeams);

console.log("Football Fixtures:", footballFixtures);
console.log("Cricket Fixtures:", cricketFixtures);

console.log("Football Results:", footballResults);
console.log("Cricket Results:", cricketResults);

console.log("Football Standings:", footballStandings);
console.log("Cricket Standings:", cricketStandings);

  return (
    <div className="home-page">

      {/* ================= HERO ================= */}

      <section className="hero-section">

        <div className="hero-overlay">

          <div className="hero-content">

            <span className="hero-small-title">
              WELCOME TO
            </span>

            <h1>
              BAHARAGORA
              <span> CHAMPIONS LEAGUE</span>
            </h1>

            <p>
              Celebrating the passion, talent and spirit of Baharagora
              through Football and Cricket.
            </p>

            <div className="hero-buttons">

              <Link to="/football" className="hero-button football-button">
                ⚽ Football
              </Link>

              <Link to="/cricket" className="hero-button cricket-button">
                🏏 Cricket
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* ================= SPORTS ================= */}

      <section className="sports-section">

        <div className="section-heading">

          <span>OUR SPORTS</span>

          <h2>
            Choose Your Game
          </h2>

          <p>
            Follow your favourite BCL tournament
          </p>

        </div>


        <div className="sports-grid">

          {/* FOOTBALL */}

          <div className="sport-card football-card">

            <div className="sport-logo-container">

              <img
                src={footballLogo}
                alt="BCL Football"
              />

            </div>

            <div className="sport-content">

              <span className="sport-label">
                BCL FOOTBALL
              </span>

              <h3>
                Football
              </h3>

              <p>
                Fixtures, live scores, results, teams,
                players and standings.
              </p>

              <Link
                to="/football"
                className="sport-button"
              >
                Explore Football →
              </Link>

            </div>

          </div>


          {/* CRICKET */}

          <div className="sport-card cricket-card">

            <div className="sport-logo-container">

              <img
                src={cricketLogo}
                alt="BCL Cricket"
              />

            </div>

            <div className="sport-content">

              <span className="sport-label">
                BCL CRICKET
              </span>

              <h3>
                Cricket
              </h3>

              <p>
                Match scores, fixtures, results,
                teams, players and points table.
              </p>

              <Link
                to="/cricket"
                className="sport-button"
              >
                Explore Cricket →
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* ================= LIVE MATCH ================= */}

      <section className="live-section">

        <div className="section-heading light-heading">

          <span>LIVE NOW</span>

          <h2>
            Live Match
          </h2>

        </div>


        <div className="live-match-card">

          <div className="live-match-header">

            <span className="live-badge">
              <span className="live-dot"></span>
              LIVE
            </span>

            <span className="match-type">
              ⚽ Football
            </span>

          </div>


          <div className="live-match-body">

            <div className="live-team">

              <div className="team-placeholder">
                A
              </div>

              <h3>
                Team A
              </h3>

            </div>


            <div className="live-score">

              <span>
                2
              </span>

              <strong>
                -
              </strong>

              <span>
                1
              </span>

              <small>
                2nd Half
              </small>

            </div>


            <div className="live-team">

              <div className="team-placeholder">
                B
              </div>

              <h3>
                Team B
              </h3>

            </div>

          </div>


          <div className="live-match-footer">

            <span>
              📍 Baharagora Stadium
            </span>

            <Link to="/football">
              Match Centre →
            </Link>

          </div>

        </div>

      </section>


      {/* ================= UPCOMING MATCHES ================= */}

      <section className="matches-section">

        <div className="section-heading">

          <span>DON'T MISS OUT</span>

          <h2>
            Upcoming Matches
          </h2>

          <p>
            Stay updated with the latest BCL fixtures.
          </p>

        </div>


        <div className="matches-grid">

          <MatchCard
            sport="⚽ Football"
            date="25 SEP"
            time="4:00 PM"
            team1="Team A"
            team2="Team C"
            venue="Baharagora Stadium"
          />

          <MatchCard
            sport="🏏 Cricket"
            date="26 SEP"
            time="3:00 PM"
            team1="Team B"
            team2="Team D"
            venue="Baharagora Cricket Ground"
          />

          <MatchCard
            sport="⚽ Football"
            date="27 SEP"
            time="4:00 PM"
            team1="Team C"
            team2="Team D"
            venue="Baharagora Stadium"
          />

        </div>


        <div className="center-button">

          <Link to="/fixtures" className="outline-button">
            View All Fixtures →
          </Link>

        </div>

      </section>


      {/* ================= RESULTS ================= */}

      <section className="results-section">

        <div className="section-heading">

          <span>LATEST ACTION</span>

          <h2>
            Latest Results
          </h2>

        </div>


        <div className="results-grid">

          <ResultCard
            sport="⚽ Football"
            team1="Team A"
            score1="3"
            team2="Team B"
            score2="1"
            date="20 SEP 2026"
          />

          <ResultCard
            sport="🏏 Cricket"
            team1="Team C"
            score1="156/7"
            team2="Team D"
            score2="149/9"
            date="21 SEP 2026"
          />

        </div>


        <div className="center-button">

          <Link to="/results" className="outline-button">
            View All Results →
          </Link>

        </div>

      </section>


      {/* ================= POINTS TABLE ================= */}

      <section className="standings-section">

        <div className="section-heading">

          <span>TOURNAMENT STANDINGS</span>

          <h2>
            Points Table
          </h2>

          <p>
            Track the race for the top of the table.
          </p>

        </div>


        <div className="tables-grid">

          {/* FOOTBALL */}

          <div className="table-card">

            <div className="table-header">

              <div>
                <span>⚽</span>

                <h3>
                  Football
                </h3>
              </div>

              <Link to="/football">
                Full Table →
              </Link>

            </div>


            <table>

              <thead>

                <tr>
                  <th>#</th>
                  <th>Team</th>
                  <th>P</th>
                  <th>W</th>
                  <th>Pts</th>
                </tr>

              </thead>

              <tbody>

                <tr>
                  <td>1</td>
                  <td>Team A</td>
                  <td>3</td>
                  <td>3</td>
                  <td>9</td>
                </tr>

                <tr>
                  <td>2</td>
                  <td>Team B</td>
                  <td>3</td>
                  <td>2</td>
                  <td>6</td>
                </tr>

                <tr>
                  <td>3</td>
                  <td>Team C</td>
                  <td>3</td>
                  <td>1</td>
                  <td>3</td>
                </tr>

                <tr>
                  <td>4</td>
                  <td>Team D</td>
                  <td>3</td>
                  <td>0</td>
                  <td>0</td>
                </tr>

              </tbody>

            </table>

          </div>


          {/* CRICKET */}

          <div className="table-card">

            <div className="table-header">

              <div>
                <span>🏏</span>

                <h3>
                  Cricket
                </h3>
              </div>

              <Link to="/cricket">
                Full Table →
              </Link>

            </div>


            <table>

              <thead>

                <tr>
                  <th>#</th>
                  <th>Team</th>
                  <th>P</th>
                  <th>W</th>
                  <th>Pts</th>
                </tr>

              </thead>

              <tbody>

                <tr>
                  <td>1</td>
                  <td>Team A</td>
                  <td>3</td>
                  <td>3</td>
                  <td>6</td>
                </tr>

                <tr>
                  <td>2</td>
                  <td>Team B</td>
                  <td>3</td>
                  <td>2</td>
                  <td>4</td>
                </tr>

                <tr>
                  <td>3</td>
                  <td>Team C</td>
                  <td>3</td>
                  <td>1</td>
                  <td>2</td>
                </tr>

                <tr>
                  <td>4</td>
                  <td>Team D</td>
                  <td>3</td>
                  <td>0</td>
                  <td>0</td>
                </tr>

              </tbody>

            </table>

          </div>

        </div>

      </section>


      {/* ================= MEDIA ================= */}

      <section className="media-section">

        <div className="section-heading light-heading">

          <span>BCL MEDIA</span>

          <h2>
            Match Moments
          </h2>

          <p>
            Follow BCL on social media and never miss a moment.
          </p>

        </div>


        <div className="media-grid">

          <div className="media-card">

            <div className="media-icon">
              📸
            </div>

            <h3>
              Instagram
            </h3>

            <p>
              Matchday posts, reels and highlights.
            </p>

            <button>
              Follow BCL →
            </button>

          </div>


          <div className="media-card">

            <div className="media-icon">
              ▶
            </div>

            <h3>
              YouTube
            </h3>

            <p>
              Watch match highlights and tournament videos.
            </p>

            <button>
              Watch Videos →
            </button>

          </div>


          <div className="media-card">

            <div className="media-icon">
              📷
            </div>

            <h3>
              Photos
            </h3>

            <p>
              Explore BCL matchday memories.
            </p>

            <Link to="/media">
              View Gallery →
            </Link>

          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="bcl-footer">

        <div className="footer-container">

          <div className="footer-brand">

            <h2>
              BCL
            </h2>

            <p>
              Baharagora Champions League
            </p>

            <span>
              Football ⚽ | Cricket 🏏
            </span>

          </div>


          <div className="footer-links">

            <h4>
              Quick Links
            </h4>

            <Link to="/fixtures">
              Fixtures
            </Link>

            <Link to="/results">
              Results
            </Link>

            <Link to="/teams">
              Teams
            </Link>

            <Link to="/players">
              Players
            </Link>

          </div>


          <div className="footer-links">

            <h4>
              BCL Sports
            </h4>

            <Link to="/football">
              Football
            </Link>

            <Link to="/cricket">
              Cricket
            </Link>

            <Link to="/media">
              Media
            </Link>

            <Link to="/registration">
              Registration
            </Link>

          </div>


          <div className="footer-contact">

            <h4>
              BCL
            </h4>

            <p>
              Promoting local sports talent
              in Baharagora.
            </p>

            <p>
              📍 Baharagora, Jharkhand
            </p>

          </div>

        </div>


        <div className="footer-bottom">

          <p>
            © {new Date().getFullYear()} Baharagora Champions League.
            All rights reserved.
          </p>

        </div>

      </footer>

    </div>
  );
}


/* ================= MATCH CARD ================= */

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
          {date}
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


/* ================= RESULT CARD ================= */

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
          {date}
        </span>

      </div>


      <div className="result-teams">

        <div>
          <strong>{team1}</strong>
          <b>{score1}</b>
        </div>

        <div>
          <strong>{team2}</strong>
          <b>{score2}</b>
        </div>

      </div>


      <div className="result-status">
        Final
      </div>

    </div>
  );
}


export default Home;