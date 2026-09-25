import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import CricketNavbar from "../../components/cricket/CricketNavbar";

import { cricketLiveMatches } from "../../data/cricket/liveMatches";
import { cricketTeams } from "../../data/cricket/teams";

import "./CricketLiveScore.css";

function CricketLiveScore() {
  const [liveMatches, setLiveMatches] = useState(cricketLiveMatches);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // =========================================
  // AUTO REFRESH
  // =========================================

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      setLiveMatches([...cricketLiveMatches]);
      setLastUpdated(new Date());
    }, 10000);

    return () => clearInterval(refreshInterval);
  }, []);

  // =========================================
  // FIND LIVE MATCH
  // =========================================

  const liveMatch = liveMatches.find(
    (match) => match.status === "LIVE"
  );

  // =========================================
  // GET TEAM
  // =========================================

  const getTeam = (teamId) => {
    return cricketTeams.find(
      (team) => team.id === teamId
    );
  };

  // =========================================
  // NO LIVE MATCH
  // =========================================

  if (!liveMatch) {
    return (
      <>
        <CricketNavbar />

        <main className="cricket-live-page">

          <section className="cricket-live-empty">

            <div className="cricket-live-empty-icon">
              🏏
            </div>

            <h1>
              No Live Match
            </h1>

            <p>
              There are currently no cricket matches
              being played live.
            </p>

            <Link
              to="/cricket"
              className="cricket-live-back-button"
            >
              ← Back to Cricket Home
            </Link>

          </section>

        </main>
      </>
    );
  }

  // =========================================
  // TEAMS
  // =========================================

  const team1 = getTeam(
    liveMatch.team1Id
  );

  const team2 = getTeam(
    liveMatch.team2Id
  );

  // =========================================
  // INNINGS
  // =========================================

  const innings1 = liveMatch.innings.find(
    (innings) =>
      innings.teamId === liveMatch.team1Id
  );

  const innings2 = liveMatch.innings.find(
    (innings) =>
      innings.teamId === liveMatch.team2Id
  );

  // =========================================
  // CURRENT BATTING TEAM
  // =========================================

  const currentInnings =
    liveMatch.innings[
      liveMatch.currentInnings - 1
    ];

  const battingTeam = currentInnings
    ? getTeam(currentInnings.teamId)
    : null;

  // =========================================
  // CURRENT SCORE
  // =========================================

  const currentRuns =
    currentInnings?.runs ?? 0;

  const currentWickets =
    currentInnings?.wickets ?? 0;

  const currentOvers =
    currentInnings?.overs ?? "0.0";

  // =========================================
  // TARGET / CHASE
  // =========================================

  const target = liveMatch.target;

  const runsRequired =
    target && target > currentRuns
      ? target - currentRuns
      : null;

  const wicketsRemaining =
    10 - currentWickets;

    const oversParts = currentOvers.split(".");
const completedOvers = Number(oversParts[0] || 0);
const ballsInCurrentOver = Number(oversParts[1] || 0);

const totalBalls =
  completedOvers * 6 + ballsInCurrentOver;

const currentRunRate =
  totalBalls > 0
    ? (currentRuns / (totalBalls / 6)).toFixed(2)
    : "0.00";

const inningsOversLimit = 20;

const totalMatchBalls = inningsOversLimit * 6;

const inningsProgress =
  Math.min(
    (totalBalls / totalMatchBalls) * 100,
    100
  ).toFixed(1);

const requiredRunRate =
  target && target > currentRuns && totalBalls < totalMatchBalls
    ? (
        (target - currentRuns) /
        ((totalMatchBalls - totalBalls) / 6)
      ).toFixed(2)
    : null;

  // =========================================
  // RENDER
  // =========================================

  return (
    <>
      <CricketNavbar />

      <main className="cricket-live-page">

        {/* =====================================
            HEADER
        ===================================== */}

        <section className="cricket-live-header">

          <span className="cricket-live-badge">
            🔴 LIVE NOW
          </span>

          <h1>
            Cricket Live Score
          </h1>

          <p>
            Live match updates from Baharagora
            Champions League.
          </p>

          <div className="cricket-live-refresh">

            <span className="refresh-dot"></span>

            Auto refresh: 10s

          </div>

        </section>


        {/* =====================================
            SCORE CARD
        ===================================== */}

        <section className="cricket-live-score-card">

          <div className="cricket-live-match-top">

            <span>
              🏏 {liveMatch.matchType}
            </span>

            <strong>
              LIVE
            </strong>

          </div>


          <div className="cricket-live-match-info">

            {liveMatch.date}
            {" • "}
            {liveMatch.time}

            <br />

            📍 {liveMatch.venue}

          </div>


          {/* ===================================
              TEAMS
          =================================== */}

          <div className="cricket-live-teams">

            {/* TEAM 1 */}

            <div className="cricket-live-team">

              <div className="cricket-live-team-logo">
                🏏
              </div>

              <h2>
                {team1?.shortName}
              </h2>

              <p>
                {team1?.name}
              </p>

              <div className="cricket-live-score">

                {innings1?.runs ?? 0}
                /
                {innings1?.wickets ?? 0}

              </div>

              <span className="cricket-live-overs">

                {innings1?.overs ?? "0.0"}
                {" "}
                overs

              </span>

            </div>


            {/* VS */}

            <div className="cricket-live-vs">

              <span>
                VS
              </span>

            </div>


            {/* TEAM 2 */}

            <div className="cricket-live-team">

              <div className="cricket-live-team-logo">
                🏏
              </div>

              <h2>
                {team2?.shortName}
              </h2>

              <p>
                {team2?.name}
              </p>

              <div className="cricket-live-score">

                {innings2?.runs ?? 0}
                /
                {innings2?.wickets ?? 0}

              </div>

              <span className="cricket-live-overs">

                {innings2?.overs ?? "0.0"}
                {" "}
                overs

              </span>

            </div>

          </div>


          {/* ===================================
              CURRENT INNINGS
          =================================== */}

          <div className="cricket-current-innings">

            <span>
              CURRENT INNINGS
            </span>

            <strong>

              {battingTeam?.name ||
                "Unknown Team"}

            </strong>

          </div>


          {/* ===================================
              TARGET
          =================================== */}

          {target && (
            <div className="cricket-live-target">

              🎯 Target:

              {" "}

              <strong>
                {target}
              </strong>

            </div>
          )}


          {/* ===================================
              FULL MATCH DETAILS
          =================================== */}

          <Link
            to={`/cricket/matches/${liveMatch.id}`}
            className="cricket-live-details-button"
          >
            View Full Match Details →
          </Link>

        </section>


        {/* =====================================
            LIVE MATCH STATUS
        ===================================== */}

        <section className="cricket-live-section">

          <div className="cricket-live-section-title">

            <div>

              <span>
                LIVE MATCH STATUS
              </span>

              <h2>
                Match Situation
              </h2>

            </div>

          </div>


          <div className="cricket-match-status-grid">

            {/* BATTING NOW */}

            <div className="cricket-status-card">

              <div className="cricket-status-icon">
                🏏
              </div>

              <div>

                <span>
                  BATTING NOW
                </span>

                <strong>
                  {battingTeam?.name ||
                    "Unknown Team"}
                </strong>

              </div>

            </div>


            {/* SCORE */}

            <div className="cricket-status-card">

              <div className="cricket-status-icon">
                📊
              </div>

              <div>

                <span>
                  CURRENT SCORE
                </span>

                <strong>
                  {currentRuns}/
                  {currentWickets}
                </strong>

              </div>

            </div>


            {/* OVERS */}

            <div className="cricket-status-card">

              <div className="cricket-status-icon">
                ⏱️
              </div>

              <div>

                <span>
                  OVERS
                </span>

                <strong>
                  {currentOvers}
                </strong>

              </div>

            </div>


            {/* WICKETS */}

            <div className="cricket-status-card">

              <div className="cricket-status-icon">
                🧤
              </div>

              <div>

                <span>
                  WICKETS LEFT
                </span>

                <strong>
                  {wicketsRemaining}
                </strong>

              </div>

            </div>


            {/* TARGET */}

            {target && (
              <div className="cricket-status-card">

                <div className="cricket-status-icon">
                  🎯
                </div>

                <div>

                  <span>
                    TARGET
                  </span>

                  <strong>
                    {target}
                  </strong>

                </div>

              </div>
            )}


            {/* RUNS REQUIRED */}

            {runsRequired !== null && (
              <div className="cricket-status-card cricket-status-highlight">

                <div className="cricket-status-icon">
                  🔥
                </div>

                <div>

                  <span>
                    RUNS REQUIRED
                  </span>

                  <strong>
                    {runsRequired}
                  </strong>

                </div>

              </div>
            )}

          </div>

        </section>


        <section className="cricket-live-section">
  <div className="cricket-live-section-title">
    <div>
      <span>MATCH PROGRESS</span>
      <h2>Innings Statistics</h2>
    </div>
  </div>

  <div className="cricket-progress-grid">

    <div className="cricket-progress-card">
      <div className="cricket-progress-icon">
        📈
      </div>

      <div className="cricket-progress-content">
        <span>CURRENT RUN RATE</span>
        <strong>{currentRunRate}</strong>
        <small>Runs per over</small>
      </div>
    </div>

    {requiredRunRate !== null && (
      <div className="cricket-progress-card cricket-required-rate">
        <div className="cricket-progress-icon">
          🎯
        </div>

        <div className="cricket-progress-content">
          <span>REQUIRED RUN RATE</span>
          <strong>{requiredRunRate}</strong>
          <small>Runs per over</small>
        </div>
      </div>
    )}

    <div className="cricket-progress-card">
      <div className="cricket-progress-icon">
        ⏱️
      </div>

      <div className="cricket-progress-content">
        <span>OVERS PLAYED</span>
        <strong>
          {currentOvers}
        </strong>
        <small>
          of {inningsOversLimit}.0 overs
        </small>
      </div>
    </div>

    <div className="cricket-progress-card">
      <div className="cricket-progress-icon">
        🏏
      </div>

      <div className="cricket-progress-content">
        <span>INNINGS PROGRESS</span>
        <strong>
          {inningsProgress}%
        </strong>
        <small>
          {totalBalls} of {totalMatchBalls} balls
        </small>
      </div>
    </div>

  </div>

  <div className="cricket-innings-progress">

    <div className="cricket-innings-progress-header">
      <span>20 OVER INNINGS</span>

      <strong>
        {currentOvers} / {inningsOversLimit}.0
      </strong>
    </div>

    <div className="cricket-progress-track">
      <div
        className="cricket-progress-fill"
        style={{
          width: `${inningsProgress}%`,
        }}
      ></div>
    </div>

    <div className="cricket-progress-footer">
      <span>Start</span>
      <span>
        {inningsProgress}% completed
      </span>
      <span>20 Overs</span>
    </div>

  </div>
</section>

{/* =====================================
    STEP 6.10.9
    BATTING & BOWLING DETAILS
===================================== */}

<section className="cricket-live-section">

  <div className="cricket-live-section-title">
    <div>
      <span>LIVE SCORECARD</span>
      <h2>Batting & Bowling</h2>
    </div>
  </div>


  {/* ===============================
      BATTING
  =============================== */}

  <div className="cricket-scorecard-block">

    <div className="cricket-scorecard-heading">
      <div>
        <span>BATTERS</span>
        <h3>
          {battingTeam?.name || "Batting Team"}
        </h3>
      </div>

      <strong>
        {currentRuns}/{currentWickets}
      </strong>
    </div>


    <div className="cricket-batting-table">

      <div className="cricket-table-header">
        <span>BATTER</span>
        <span>R</span>
        <span>B</span>
        <span>4s</span>
        <span>6s</span>
        <span>SR</span>
      </div>


      {liveMatch.batting?.map((batter, index) => (
        <div
          className="cricket-batting-row"
          key={index}
        >

          <div className="cricket-batter-name">
            <strong>
              {batter.player}
            </strong>

            <span>
              {batter.status}
            </span>
          </div>

          <strong>{batter.runs}</strong>

          <span>{batter.balls}</span>

          <span>{batter.fours}</span>

          <span>{batter.sixes}</span>

          <span>{batter.strikeRate}</span>

        </div>
      ))}

    </div>

  </div>


  {/* ===============================
      BOWLING
  =============================== */}

  <div className="cricket-scorecard-block">

    <div className="cricket-scorecard-heading">
      <div>
        <span>BOWLER</span>
        <h3>
          {team2?.name || "Bowling Team"}
        </h3>
      </div>

      <strong>LIVE</strong>
    </div>


    <div className="cricket-bowling-table">

      <div className="cricket-bowling-header">
        <span>BOWLER</span>
        <span>O</span>
        <span>M</span>
        <span>R</span>
        <span>W</span>
        <span>ECO</span>
      </div>


      {liveMatch.bowling?.map((bowler, index) => (
        <div
          className="cricket-bowling-row"
          key={index}
        >

          <strong>
            {bowler.player}
          </strong>

          <span>{bowler.overs}</span>

          <span>{bowler.maidens}</span>

          <span>{bowler.runs}</span>

          <strong>{bowler.wickets}</strong>

          <span>{bowler.economy}</span>

        </div>
      ))}

    </div>

  </div>

</section>


{/* =====================================
    STEP 6.10.10
    PARTNERSHIP & KEY STATS
===================================== */}

<section className="cricket-live-section">

  <div className="cricket-live-section-title">
    <div>
      <span>MATCH STATISTICS</span>
      <h2>Partnership & Key Stats</h2>
    </div>
  </div>


  {/* ===============================
      CURRENT PARTNERSHIP
  =============================== */}

  <div className="cricket-partnership-card">

    <div className="cricket-partnership-header">
      <div>
        <span>CURRENT PARTNERSHIP</span>

        <h3>
          {liveMatch.partnership?.runs ?? 0}
          {" "}
          Runs
        </h3>
      </div>

      <div className="cricket-partnership-icon">
        🤝
      </div>
    </div>


    <div className="cricket-partnership-stats">

      <div>
        <span>RUNS</span>

        <strong>
          {liveMatch.partnership?.runs ?? 0}
        </strong>
      </div>

      <div>
        <span>BALLS</span>

        <strong>
          {liveMatch.partnership?.balls ?? 0}
        </strong>
      </div>

      <div>
        <span>RUN RATE</span>

        <strong>
          {liveMatch.partnership?.runRate ?? "0.00"}
        </strong>
      </div>

    </div>

  </div>


  {/* ===============================
      KEY STATS
  =============================== */}

  <div className="cricket-key-stats-grid">

    {/* HIGHEST SCORER */}

    <div className="cricket-key-stat-card">

      <div className="cricket-key-stat-icon">
        🏏
      </div>

      <div>
        <span>HIGHEST SCORER</span>

        <strong>
          {liveMatch.keyStats?.highestScorer?.player ||
            "N/A"}
        </strong>

        <small>
          {liveMatch.keyStats?.highestScorer?.runs ?? 0}
          {" "}
          runs •
          {" "}
          {liveMatch.keyStats?.highestScorer?.balls ?? 0}
          {" "}
          balls
        </small>
      </div>

    </div>


    {/* BEST BOWLER */}

    <div className="cricket-key-stat-card">

      <div className="cricket-key-stat-icon">
        🎳
      </div>

      <div>
        <span>BEST BOWLER</span>

        <strong>
          {liveMatch.keyStats?.bestBowler?.player ||
            "N/A"}
        </strong>

        <small>
          {liveMatch.keyStats?.bestBowler?.wickets ?? 0}
          {" "}
          wicket •
          {" "}
          {liveMatch.keyStats?.bestBowler?.runs ?? 0}
          {" "}
          runs
        </small>
      </div>

    </div>

  </div>


  {/* ===============================
      TEAM SUMMARY
  =============================== */}

  <div className="cricket-team-summary">

    <div className="cricket-team-summary-header">

      <div>
        <span>TEAM SCORING SUMMARY</span>

        <h3>
          {battingTeam?.name || "Batting Team"}
        </h3>
      </div>

      <strong>
        {currentRuns}/{currentWickets}
      </strong>

    </div>


    <div className="cricket-team-summary-grid">

      <div>
        <span>OVERS</span>

        <strong>
          {currentOvers}
        </strong>
      </div>

      <div>
        <span>RUN RATE</span>

        <strong>
          {currentRunRate}
        </strong>
      </div>

      <div>
        <span>WICKETS</span>

        <strong>
          {currentWickets}
        </strong>
      </div>

      <div>
        <span>WICKETS LEFT</span>

        <strong>
          {wicketsRemaining}
        </strong>
      </div>

    </div>

  </div>

</section>


        {/* =====================================
            LAST OVER
        ===================================== */}

        <section className="cricket-live-section">

          <div className="cricket-live-section-title">

            <div>

              <span>
                RECENT BALLS
              </span>

              <h2>
                Last Over
              </h2>

            </div>

            <span>
              Last updated:{" "}
              {lastUpdated.toLocaleTimeString()}
            </span>

          </div>


          <div className="cricket-last-over">

            {liveMatch.lastOver.map(
              (ball, index) => (

                <div
                  key={index}
                  className={
                    ball === "W"
                      ? "cricket-ball wicket"
                      : ball === "4" ||
                        ball === "6"
                      ? "cricket-ball boundary"
                      : "cricket-ball"
                  }
                >
                  {ball}
                </div>

              )
            )}

          </div>

        </section>


        {/* =====================================
    STEP 6.10.11
    LIVE COMMENTARY
===================================== */}

<section className="cricket-live-section">

  <div className="cricket-live-section-title">
    <div>
      <span>BALL BY BALL</span>
      <h2>Live Commentary</h2>
    </div>

    <span>
      Latest updates
    </span>
  </div>


  <div className="cricket-commentary-list">

    {liveMatch.recentEvents?.map((event) => (

      <div
        className={`cricket-commentary-item commentary-${(
          event.type || "RUN"
        ).toLowerCase()}`}
        key={event.id}
      >

        {/* OVER */}

        <div className="cricket-commentary-over">
          {event.over}
        </div>


        {/* EVENT ICON */}

        <div className="cricket-commentary-icon">

          {event.type === "FOUR" && "4️⃣"}

          {event.type === "SIX" && "6️⃣"}

          {event.type === "WICKET" && "🟥"}

          {event.type === "DOT" && "•"}

          {event.type === "RUN" && "🏏"}

          {!event.type && "🏏"}

        </div>


        {/* COMMENTARY */}

        <div className="cricket-commentary-content">

          <div className="cricket-commentary-top">

            <strong>
              {event.text}
            </strong>

            {event.player && (
              <span>
                {event.player}
              </span>
            )}

          </div>

          <p>
            {event.description ||
              "Match update"}
          </p>

        </div>

      </div>

    ))}

  </div>

</section>


        {/* =====================================
            AUTO REFRESH INFORMATION
        ===================================== */}

        <section className="cricket-auto-refresh-info">

          <div className="auto-refresh-icon">
            🔄
          </div>

          <div>

            <h3>
              Live Score Auto-Refresh
            </h3>

            <p>
              Scores are automatically refreshed
              every 10 seconds.
            </p>

            <span>
              Last updated:{" "}
              {lastUpdated.toLocaleTimeString()}
            </span>

          </div>

        </section>


        {/* =====================================
            BACK
        ===================================== */}

        <section className="cricket-live-bottom">

          <Link
            to="/cricket"
            className="cricket-live-back-button"
          >
            ← Back to Cricket Home
          </Link>

        </section>

      </main>
    </>
  );
}

export default CricketLiveScore;