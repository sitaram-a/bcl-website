import { Link, useParams } from "react-router-dom";
import CricketNavbar from "../../components/cricket/CricketNavbar";

import { cricketLiveMatches } from "../../data/cricket/liveMatches";
import { cricketTeams } from "../../data/cricket/teams";

import "./CricketMatchDetails.css";

function CricketMatchDetails() {
  const { matchId } = useParams();

  const match = cricketLiveMatches.find(
    (item) => item.id === Number(matchId)
  );

  const getTeam = (teamId) => {
    return cricketTeams.find((team) => team.id === teamId);
  };

  if (!match) {
    return (
      <>
        <CricketNavbar />

        <main className="cricket-match-details-page">
          <section className="cricket-match-not-found">
            <div>🏏</div>

            <h1>Match Not Found</h1>

            <p>
              The cricket match you are looking for does not exist.
            </p>

            <Link to="/cricket" className="cricket-match-back-button">
              ← Back to Cricket Home
            </Link>
          </section>
        </main>
      </>
    );
  }

  const team1 = getTeam(match.team1Id);
  const team2 = getTeam(match.team2Id);

  const innings1 = match.innings.find(
    (innings) => innings.teamId === match.team1Id
  );

  const innings2 = match.innings.find(
    (innings) => innings.teamId === match.team2Id
  );

  const currentInnings = match.innings[match.currentInnings - 1];

  return (
    <>
      <CricketNavbar />

      <main className="cricket-match-details-page">
        {/* HEADER */}
        <section className="cricket-match-details-header">
          <span className="cricket-match-details-badge">
            🏏 {match.matchType}
          </span>

          <h1>Match Details</h1>

          <p>
            {match.date} • {match.time} • {match.venue}
          </p>
        </section>

        {/* STATUS */}
        <section className="cricket-match-status-card">
          <div className="cricket-match-status-top">
            <span>#{match.id}</span>

            <strong
              className={
                match.status === "LIVE"
                  ? "status-live"
                  : "status-other"
              }
            >
              {match.status === "LIVE" ? "🔴 LIVE" : match.status}
            </strong>
          </div>

          {/* TEAMS */}
          <div className="cricket-match-teams">
            <div className="cricket-match-team">
              <div className="cricket-match-team-logo">
                🏏
              </div>

              <h2>{team1?.shortName}</h2>

              <p>{team1?.name}</p>

              <strong>
                {innings1?.runs ?? 0}/{innings1?.wickets ?? 0}
              </strong>

              <span>
                {innings1?.overs ?? "0.0"} overs
              </span>
            </div>

            <div className="cricket-match-vs">
              VS
            </div>

            <div className="cricket-match-team">
              <div className="cricket-match-team-logo">
                🏏
              </div>

              <h2>{team2?.shortName}</h2>

              <p>{team2?.name}</p>

              <strong>
                {innings2?.runs ?? 0}/{innings2?.wickets ?? 0}
              </strong>

              <span>
                {innings2?.overs ?? "0.0"} overs
              </span>
            </div>
          </div>

          {/* CURRENT INNINGS */}
          {currentInnings && (
            <div className="cricket-current-innings-details">
              <span>CURRENT INNINGS</span>

              <strong>
                {getTeam(currentInnings.teamId)?.name}
              </strong>

              <p>
                {currentInnings.runs}/{currentInnings.wickets}{" "}
                ({currentInnings.overs} overs)
              </p>
            </div>
          )}

          {/* TARGET */}
          {match.target && (
            <div className="cricket-match-target">
              🎯 Target: <strong>{match.target}</strong>
            </div>
          )}
        </section>

        {/* LAST OVER */}
        <section className="cricket-match-details-section">
          <div className="cricket-match-section-heading">
            <span>RECENT BALLS</span>
            <h2>Last Over</h2>
          </div>

          <div className="cricket-match-last-over">
            {match.lastOver.map((ball, index) => (
              <div
                key={index}
                className={
                  ball === "W"
                    ? "cricket-match-ball wicket"
                    : ball === "4" || ball === "6"
                    ? "cricket-match-ball boundary"
                    : "cricket-match-ball"
                }
              >
                {ball}
              </div>
            ))}
          </div>
        </section>

        {/* RECENT EVENTS */}
        <section className="cricket-match-details-section">
          <div className="cricket-match-section-heading">
            <span>MATCH TIMELINE</span>
            <h2>Recent Events</h2>
          </div>

          <div className="cricket-match-events">
            {match.recentEvents.map((event) => (
              <div
                className="cricket-match-event"
                key={event.id}
              >
                <div className="cricket-match-event-over">
                  {event.over}
                </div>

                <div className="cricket-match-event-icon">
                  {event.text === "Wicket" ? "🟥" : "🏏"}
                </div>

                <div className="cricket-match-event-text">
                  {event.text}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MATCH INFORMATION */}
        <section className="cricket-match-details-section">
          <div className="cricket-match-section-heading">
            <span>MATCH INFORMATION</span>
            <h2>Details</h2>
          </div>

          <div className="cricket-match-info-grid">
            <div>
              <span>Match Type</span>
              <strong>{match.matchType}</strong>
            </div>

            <div>
              <span>Date</span>
              <strong>{match.date}</strong>
            </div>

            <div>
              <span>Time</span>
              <strong>{match.time}</strong>
            </div>

            <div>
              <span>Venue</span>
              <strong>{match.venue}</strong>
            </div>

            <div>
              <span>Status</span>
              <strong>{match.status}</strong>
            </div>
          </div>
        </section>

        {/* BACK */}
        <section className="cricket-match-details-bottom">
          <Link
            to="/cricket/live-score"
            className="cricket-match-back-button"
          >
            ← Back to Live Score
          </Link>
        </section>
      </main>
    </>
  );
}

export default CricketMatchDetails;