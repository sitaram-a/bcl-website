
import { Link } from "react-router-dom";
import CricketNavbar from "../../components/cricket/CricketNavbar";
import { cricketResults } from "../../data/cricket/results";
import { cricketTeams } from "../../data/cricket/teams";
import "./CricketResults.css";

const batting = [
  { name: "Guddu Singh (C)", runs: 0, balls: 1, fours: 0, sixes: 0, sr: "0.00" },
  { name: "Noto Nayek Ckt", runs: 1, balls: 2, fours: 0, sixes: 0, sr: "50.00" },
  { name: "Nikhil Kumar", runs: 25, balls: 10, fours: 3, sixes: 2, sr: "250.00" },
  { name: "Liyakat", runs: 27, balls: 13, fours: 2, sixes: 3, sr: "207.69" },
  { name: "Subhendu Das", runs: 60, balls: 19, fours: 1, sixes: 5, sr: "315.79" },
  { name: "Gouri Shankar Sardar", runs: 26, balls: 8, fours: 1, sixes: 3, sr: "325.00" },
  { name: "Santi Giri", runs: 0, balls: 2, fours: 0, sixes: 0, sr: "0.00" },
  { name: "Anand", runs: 24, balls: 5, fours: 2, sixes: 4, sr: "480.00" },
];

const bowling = [
  { name: "Md Anash Hussain", overs: "2", maidens: 0, runs: 30, wickets: 1, economy: "15.00" },
  { name: "Sarfraj Alam", overs: "2", maidens: 0, runs: 36, wickets: 2, economy: "18.00" },
  { name: "Bunty", overs: "2", maidens: 0, runs: 26, wickets: 1, economy: "13.00" },
  { name: "Utpal Kumar (C)", overs: "2", maidens: 0, runs: 13, wickets: 2, economy: "6.50" },
  { name: "Sahendra", overs: "1", maidens: 0, runs: 36, wickets: 0, economy: "36.00" },
  { name: "Shukdev Rana", overs: "1", maidens: 0, runs: 23, wickets: 1, economy: "23.00" },
];

const SCORECARD_URL =
  "https://cricheroes.com/scorecard/27884163/baharagora-champions-league-season-5/baharagora-kings-vs-sakra-royals/summary";

function CricketResults() {
  return (
    <>
      <CricketNavbar />

      <main className="cricket-results-page">
        <section className="cricket-results-header">
          <span className="cricket-section-badge">🏏 BCL CRICKET</span>
          <h1>Match Results</h1>
          <p>Baharagora Champions League Season 5 — match scorecard</p>
        </section>

        <section className="cricket-results-list">
          {cricketResults.map((match) => {
            const team1 = cricketTeams.find(
              (team) => team.id === match.team1Id
            );
            const team2 = cricketTeams.find(
              (team) => team.id === match.team2Id
            );

            return (
              <article className="result-scorecard" key={match.id}>
                <div className="result-tournament-label">
                  BAHARAGORA CHAMPIONS LEAGUE · SEASON 5
                </div>

                <div className="result-match-status">COMPLETED</div>

                <div className="result-teams">
                  <div className="result-team">
                    {team1?.logo && (
                      <img
                        src={team1.logo}
                        alt={`${team1.name} logo`}
                        className="result-team-logo"
                      />
                    )}
                    <h2>{team1?.name || match.team1Name}</h2>
                    <strong>{match.score1}</strong>
                    <span>{match.overs1 || "10.0"} Overs</span>
                  </div>

                  <div className="result-vs">VS</div>

                  <div className="result-team">
                    {team2?.logo && (
                      <img
                        src={team2.logo}
                        alt={`${team2.name} logo`}
                        className="result-team-logo"
                      />
                    )}
                    <h2>{team2?.name || match.team2Name}</h2>
                    <strong>{match.score2}</strong>
                    <span>{match.overs2 || "10.0"} Overs</span>
                  </div>
                </div>

                <div className="result-winner">
                  {match.result || "Match completed"}
                </div>

                <div className="result-match-meta">
                  <p>
                    <strong>Toss:</strong> {match.toss || "Not available"}
                  </p>
                  <p>
                    <strong>Player of the Match:</strong>{" "}
                    {match.playerOfMatch || "Not available"}
                  </p>
                  <p>
                    <strong>Date:</strong> {match.date}
                  </p>
                  <p>
                    <strong>Venue:</strong> {match.venue}
                  </p>
                </div>

                <div className="result-innings-heading">
                  <h2>{team1?.name || match.team1Name}</h2>
                  <strong>{match.score1}</strong>
                </div>

                <h3 className="result-table-title">Batting Scorecard</h3>

                <div className="result-table-wrap">
                  <table className="result-table">
                    <thead>
                      <tr>
                        <th>Batter</th>
                        <th>R</th>
                        <th>B</th>
                        <th>4s</th>
                        <th>6s</th>
                        <th>SR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batting.map((player) => (
                        <tr key={player.name}>
                          <td>{player.name}</td>
                          <td>{player.runs}</td>
                          <td>{player.balls}</td>
                          <td>{player.fours}</td>
                          <td>{player.sixes}</td>
                          <td>{player.sr}</td>
                        </tr>
                      ))}
                      <tr className="result-extras">
                        <td>Extras</td>
                        <td colSpan="5">1 (wide)</td>
                      </tr>
                      <tr className="result-total">
                        <td>Total</td>
                        <td colSpan="5">
                          {match.score1} in {match.overs1 || "10.0"} overs
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="result-table-title">Bowling Scorecard</h3>

                <div className="result-table-wrap">
                  <table className="result-table">
                    <thead>
                      <tr>
                        <th>Bowler</th>
                        <th>O</th>
                        <th>M</th>
                        <th>R</th>
                        <th>W</th>
                        <th>Econ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bowling.map((player) => (
                        <tr key={player.name}>
                          <td>{player.name}</td>
                          <td>{player.overs}</td>
                          <td>{player.maidens}</td>
                          <td>{player.runs}</td>
                          <td>{player.wickets}</td>
                          <td>{player.economy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="result-fall-wickets">
                  <h3>Fall of Wickets</h3>
                  <p>
                    See the official scorecard for the verified fall-of-wickets
                    sequence and dismissal details.
                  </p>
                </div>

                <div className="result-second-innings">
                  <h3>{team2?.name || match.team2Name}</h3>
                  <strong>
                    {match.score2} ({match.overs2 || "10.0"} Overs)
                  </strong>
                  <p>{match.result}</p>
                </div>

                <a
                  className="result-official-link"
                  href={SCORECARD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Official CricHeroes Scorecard ↗
                </a>
              </article>
            );
          })}

          {cricketResults.length === 0 && (
            <div className="cricket-no-results">
              <h2>No completed matches yet</h2>
              <p>Completed BCL cricket results will appear here.</p>
            </div>
          )}
        </section>

        <section className="cricket-results-bottom">
          <Link to="/cricket" className="cricket-back-button">
            ← Back to Cricket Home
          </Link>
        </section>
      </main>
    </>
  );
}

export default CricketResults;
