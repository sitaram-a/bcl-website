import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import CricketNavbar from "../../components/cricket/CricketNavbar";
import { season4Matches } from "../../data/history/season4Matches";
import { season4Scorecards } from "../../data/history/season4Scorecards";

import "./CricketSeason4Match.css";

const CricketSeason4Match = () => {
  const { matchId } = useParams();

  const match = useMemo(() => {
    return season4Matches.find(
      (item) => String(item.id) === String(matchId)
    );
  }, [matchId]);

  const scorecard = useMemo(() => {
    return season4Scorecards.find(
      (item) => String(item.id) === String(matchId)
    );
  }, [matchId]);

  if (!match) {
    return (
      <>
        <CricketNavbar />

        <main className="season4-match-page">
          <section className="season4-match-not-found">
            <h1>Match Not Found</h1>

            <p>
              The requested BCL Season 4 match could not be found.
            </p>

            <Link to="/cricket/history">
              ← Back to Season 4 History
            </Link>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <CricketNavbar />

      <main className="season4-match-page">

        {/* ================= HERO ================= */}

        <section className="season4-match-hero">

          <div className="season4-match-hero-content">

            <Link
              to="/cricket/history"
              className="season4-back-link"
            >
              ← Season 4 History
            </Link>

            <span className="season4-match-kicker">
              BCL SEASON 4 • {match.stage}
            </span>

            <h1>
              {match.team1}{" "}
              <span>vs</span>{" "}
              {match.team2}
            </h1>

            <p>
              {match.date} • {match.venue}
            </p>

          </div>

        </section>


        {/* ================= RESULT ================= */}

        <section className="season4-match-result-section">

          <div className="season4-match-result-card">

            <span className="season4-completed-badge">
              ✓ COMPLETED
            </span>

            <h2>
              {match.result}
            </h2>

            <div className="season4-score-summary">

              <div className="season4-score-team">

                <span>
                  {scorecard?.team1?.name || match.team1}
                </span>

                <strong>
                  {scorecard?.team1?.score ?? "-"}
                  /
                  {scorecard?.team1?.wickets ?? "-"}
                </strong>

                <small>
                  ({scorecard?.team1?.overs || match.overs})
                </small>

              </div>


              <div className="season4-vs">
                VS
              </div>


              <div className="season4-score-team">

                <span>
                  {scorecard?.team2?.name || match.team2}
                </span>

                <strong>
                  {scorecard?.team2?.score ?? "-"}
                  /
                  {scorecard?.team2?.wickets ?? "-"}
                </strong>

                <small>
                  ({scorecard?.team2?.overs || "-"})
                </small>

              </div>

            </div>

          </div>

        </section>


        {/* ================= MATCH INFORMATION ================= */}

        <section className="season4-match-container">

          <div className="season4-info-grid">

            <div className="season4-info-card">
              <span>Date</span>
              <strong>{match.date}</strong>
            </div>

            <div className="season4-info-card">
              <span>Venue</span>
              <strong>{match.venue}</strong>
            </div>

            <div className="season4-info-card">
              <span>Match Type</span>
              <strong>{match.stage}</strong>
            </div>

            <div className="season4-info-card">
              <span>Overs</span>
              <strong>{match.overs} Overs</strong>
            </div>

          </div>


          {/* ================= TOSS ================= */}

          {scorecard?.toss && (
            <section className="season4-detail-section">

              <div className="season4-section-title">
                <span>MATCH INFORMATION</span>
                <h2>Toss</h2>
              </div>

              <div className="season4-toss-card">
                🏏 {scorecard.toss}
              </div>

            </section>
          )}


          {/* ================= TEAM 1 BATTING ================= */}

          {scorecard?.team1 && (
            <section className="season4-detail-section">

              <div className="season4-section-title">

                <span>
                  {scorecard.team1.name}
                </span>

                <h2>
                  Batting
                </h2>

              </div>


              <div className="season4-table-wrapper">

                <table className="season4-scorecard-table">

                  <thead>
                    <tr>
                      <th>Batter</th>
                      <th>Dismissal</th>
                      <th>R</th>
                      <th>B</th>
                      <th>4s</th>
                      <th>6s</th>
                      <th>SR</th>
                    </tr>
                  </thead>

                  <tbody>

                    {scorecard.team1.batting.map(
                      (player, index) => (

                        <tr key={index}>

                          <td>
                            <strong>
                              {player.player}

                              {player.captain && (
                                <span className="captain-mark">
                                  {" "} (C)
                                </span>
                              )}
                            </strong>
                          </td>

                          <td className="dismissal">
                            {player.dismissal}
                          </td>

                          <td>
                            {player.runs}
                          </td>

                          <td>
                            {player.balls}
                          </td>

                          <td>
                            {player.fours}
                          </td>

                          <td>
                            {player.sixes}
                          </td>

                          <td>
                            {player.strikeRate}
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>


              {/* EXTRAS */}

              <div className="season4-extra-summary">

                <div>
                  <span>Extras</span>
                  <strong>
                    {scorecard.team1.extras.total}
                  </strong>
                </div>

                <div>
                  <span>LB</span>
                  <strong>
                    {scorecard.team1.extras.legByes}
                  </strong>
                </div>

                <div>
                  <span>WD</span>
                  <strong>
                    {scorecard.team1.extras.wides}
                  </strong>
                </div>

                <div>
                  <span>NB</span>
                  <strong>
                    {scorecard.team1.extras.noBalls}
                  </strong>
                </div>

              </div>


              {/* TOTAL */}

              <div className="season4-total-card">

                <span>
                  Total
                </span>

                <strong>
                  {scorecard.team1.total.runs}/
                  {scorecard.team1.total.wickets}
                </strong>

                <small>
                  {scorecard.team1.total.overs} Overs
                  {" • "}
                  RR {scorecard.team1.total.runRate}
                </small>

              </div>


              {/* FALL OF WICKETS */}

              <div className="season4-subsection">

                <h3>
                  Fall of Wickets
                </h3>

                <div className="season4-fow-list">

                  {scorecard.team1.fallOfWickets.map(
                    (item, index) => (
                      <div key={index}>
                        {item}
                      </div>
                    )
                  )}

                </div>

              </div>


              {/* BOWLING */}

              <div className="season4-subsection">

                <h3>
                  Bowling
                </h3>

                <div className="season4-table-wrapper">

                  <table className="season4-scorecard-table">

                    <thead>
                      <tr>
                        <th>Bowler</th>
                        <th>O</th>
                        <th>M</th>
                        <th>R</th>
                        <th>W</th>
                        <th>WD</th>
                        <th>NB</th>
                        <th>Eco</th>
                      </tr>
                    </thead>

                    <tbody>

                      {scorecard.team1.bowling.map(
                        (player, index) => (

                          <tr key={index}>

                            <td>
                              <strong>
                                {player.player}
                              </strong>
                            </td>

                            <td>{player.overs}</td>
                            <td>{player.maidens}</td>
                            <td>{player.runs}</td>
                            <td>{player.wickets}</td>
                            <td>{player.wides}</td>
                            <td>{player.noBalls}</td>
                            <td>{player.economy}</td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </div>


              {/* YET TO BAT */}

              {scorecard.team1.yetToBat?.length > 0 && (

                <div className="season4-subsection">

                  <h3>
                    Yet to Bat
                  </h3>

                  <div className="season4-yet-to-bat">

                    {scorecard.team1.yetToBat.map(
                      (player, index) => (
                        <span key={index}>
                          {player}
                        </span>
                      )
                    )}

                  </div>

                </div>

              )}

            </section>
          )}


          {/* ================= TEAM 2 BATTING ================= */}

          {scorecard?.team2 && (
            <section className="season4-detail-section">

              <div className="season4-section-title">

                <span>
                  {scorecard.team2.name}
                </span>

                <h2>
                  Batting
                </h2>

              </div>


              <div className="season4-table-wrapper">

                <table className="season4-scorecard-table">

                  <thead>
                    <tr>
                      <th>Batter</th>
                      <th>Dismissal</th>
                      <th>R</th>
                      <th>B</th>
                      <th>4s</th>
                      <th>6s</th>
                      <th>SR</th>
                    </tr>
                  </thead>

                  <tbody>

                    {scorecard.team2.batting.map(
                      (player, index) => (

                        <tr key={index}>

                          <td>
                            <strong>

                              {player.player}

                              {player.captain && (
                                <span className="captain-mark">
                                  {" "} (C)
                                </span>
                              )}

                            </strong>
                          </td>

                          <td className="dismissal">
                            {player.dismissal}
                          </td>

                          <td>
                            {player.runs}
                          </td>

                          <td>
                            {player.balls}
                          </td>

                          <td>
                            {player.fours}
                          </td>

                          <td>
                            {player.sixes}
                          </td>

                          <td>
                            {player.strikeRate}
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>


              {/* EXTRAS */}

              <div className="season4-extra-summary">

                <div>
                  <span>Extras</span>
                  <strong>
                    {scorecard.team2.extras.total}
                  </strong>
                </div>

                <div>
                  <span>LB</span>
                  <strong>
                    {scorecard.team2.extras.legByes}
                  </strong>
                </div>

                <div>
                  <span>WD</span>
                  <strong>
                    {scorecard.team2.extras.wides}
                  </strong>
                </div>

                <div>
                  <span>NB</span>
                  <strong>
                    {scorecard.team2.extras.noBalls}
                  </strong>
                </div>

              </div>


              {/* TOTAL */}

              <div className="season4-total-card">

                <span>
                  Total
                </span>

                <strong>
                  {scorecard.team2.total.runs}/
                  {scorecard.team2.total.wickets}
                </strong>

                <small>
                  {scorecard.team2.total.overs} Overs
                  {" • "}
                  RR {scorecard.team2.total.runRate}
                </small>

              </div>


              {/* FALL OF WICKETS */}

              <div className="season4-subsection">

                <h3>
                  Fall of Wickets
                </h3>

                <div className="season4-fow-list">

                  {scorecard.team2.fallOfWickets.map(
                    (item, index) => (
                      <div key={index}>
                        {item}
                      </div>
                    )
                  )}

                </div>

              </div>


              {/* BOWLING */}

              <div className="season4-subsection">

                <h3>
                  Bowling
                </h3>

                <div className="season4-table-wrapper">

                  <table className="season4-scorecard-table">

                    <thead>
                      <tr>
                        <th>Bowler</th>
                        <th>O</th>
                        <th>M</th>
                        <th>R</th>
                        <th>W</th>
                        <th>WD</th>
                        <th>NB</th>
                        <th>Eco</th>
                      </tr>
                    </thead>

                    <tbody>

                      {scorecard.team2.bowling.map(
                        (player, index) => (

                          <tr key={index}>

                            <td>
                              <strong>
                                {player.player}
                              </strong>
                            </td>

                            <td>{player.overs}</td>
                            <td>{player.maidens}</td>
                            <td>{player.runs}</td>
                            <td>{player.wickets}</td>
                            <td>{player.wides}</td>
                            <td>{player.noBalls}</td>
                            <td>{player.economy}</td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </div>


              {/* YET TO BAT */}

              {scorecard.team2.yetToBat?.length > 0 && (

                <div className="season4-subsection">

                  <h3>
                    Yet to Bat
                  </h3>

                  <div className="season4-yet-to-bat">

                    {scorecard.team2.yetToBat.map(
                      (player, index) => (
                        <span key={index}>
                          {player}
                        </span>
                      )
                    )}

                  </div>

                </div>

              )}

            </section>
          )}


          {/* ================= OFFICIALS ================= */}

          {scorecard?.officials && (

            <section className="season4-detail-section">

              <div className="season4-section-title">

                <span>
                  MATCH OFFICIALS
                </span>

                <h2>
                  Match Details
                </h2>

              </div>

              <div className="season4-officials-grid">

                <div>
                  <span>Scorer</span>
                  <strong>
                    {scorecard.officials.scorer}
                  </strong>
                </div>

                <div>
                  <span>
                    {scorecard.team1.name} Captain
                  </span>

                  <strong>
                    {scorecard.officials.team1Captain}
                  </strong>
                </div>

                <div>
                  <span>
                    {scorecard.team2.name} Captain
                  </span>

                  <strong>
                    {scorecard.officials.team2Captain}
                  </strong>
                </div>

              </div>

            </section>

          )}


          {/* ================= SOURCE ================= */}

          {scorecard?.sourceUrl && (

            <div className="season4-source">

              Original scorecard source:
              {" "}

              <a
                href={scorecard.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                CricHeroes →
              </a>

            </div>

          )}


          {/* ================= BACK ================= */}

          <div className="season4-bottom-navigation">

            <Link to="/cricket/history">
              ← Back to Season 4 History
            </Link>

          </div>

        </section>

      </main>
    </>
  );
};

export default CricketSeason4Match;