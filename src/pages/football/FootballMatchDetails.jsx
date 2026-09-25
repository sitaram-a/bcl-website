import { Link, useParams } from "react-router-dom";

import FootballNavbar from "../../components/football/FootballNavbar";

import { footballMatches } from "../../data/football/footballMatches";
import { footballTeams } from "../../data/football/teams";

import "./FootballMatchDetails.css";

function FootballMatchDetails() {
  const { matchId } = useParams();

  const match = footballMatches.find(
    (item) => item.id === Number(matchId)
  );

  if (!match) {
    return (
      <>
        <FootballNavbar />

        <div className="football-match-not-found">
          <div>⚽</div>
          <h1>Match Not Found</h1>
          <p>The requested BCL football match does not exist.</p>

          <Link to="/fixtures">← Back to Fixtures</Link>
        </div>
      </>
    );
  }

  const team1 = footballTeams.find(
    (team) => team.id === match.team1Id
  );

  const team2 = footballTeams.find(
    (team) => team.id === match.team2Id
  );

  const isFinished = match.status === "FINISHED";
  const isLive = match.status === "LIVE";

  const getEventIcon = (type) => {
    switch (type) {
      case "GOAL":
        return "⚽";

      case "YELLOW_CARD":
        return "🟨";

      case "RED_CARD":
        return "🟥";

      case "SUBSTITUTION":
        return "🔄";

      default:
        return "•";
    }
  };

  const getEventLabel = (type) => {
    switch (type) {
      case "GOAL":
        return "GOAL";

      case "YELLOW_CARD":
        return "YELLOW CARD";

      case "RED_CARD":
        return "RED CARD";

      case "SUBSTITUTION":
        return "SUBSTITUTION";

      default:
        return type;
    }
  };

  return (
    <>
      <FootballNavbar />

      <div className="football-match-details-page">

        {/* HERO */}
        <section className="football-match-details-hero">
          <span>BCL FOOTBALL MATCH CENTER</span>

          <h1>
            {isFinished
              ? "Match Result"
              : isLive
              ? "Live Match"
              : "Upcoming Match"}
          </h1>

          <p>Baharagora Champions League Football</p>
        </section>

        <main className="football-match-details-container">

          {/* STATUS */}
          <div className="football-match-status">
            <span
              className={
                isFinished
                  ? "match-status finished"
                  : isLive
                  ? "match-status live"
                  : "match-status upcoming"
              }
            >
              {match.status}
            </span>
          </div>

          {/* MAIN MATCH CARD */}
          <div className="football-match-main-card">

            {/* DATE / TIME */}
            <div className="football-match-date-details">
              <span>📅 {match.date}</span>

              {match.time && (
                <span>🕐 {match.time}</span>
              )}
            </div>

            {/* MATCH TYPE */}
            <div className="football-match-type">
              {match.matchType} MATCH
            </div>

            {/* TEAMS */}
            <div className="football-match-main-teams">

              {/* TEAM 1 */}
              <div className="football-match-main-team">

                <div className="football-match-main-logo">
                  {team1?.logo ? (
                    <img
                      src={team1.logo}
                      alt={team1.name}
                    />
                  ) : (
                    <span>
                      {team1?.shortName?.charAt(0) || "?"}
                    </span>
                  )}
                </div>

                <h2>
                  {team1?.name || "Unknown Team"}
                </h2>

                <span>
                  {team1?.shortName || ""}
                </span>

                {isFinished && (
                  <strong>{match.score1}</strong>
                )}
              </div>

              {/* CENTER SCORE */}
              <div className="football-match-main-center">

                {isFinished || isLive ? (
                  <>
                    <span>
                      {isLive ? "LIVE SCORE" : "FINAL"}
                    </span>

                    <div>
                      {match.score1}

                      <b> - </b>

                      {match.score2}
                    </div>
                  </>
                ) : (
                  <>
                    <span>KICK-OFF</span>

                    <div>VS</div>
                  </>
                )}

              </div>

              {/* TEAM 2 */}
              <div className="football-match-main-team">

                <div className="football-match-main-logo">
                  {team2?.logo ? (
                    <img
                      src={team2.logo}
                      alt={team2.name}
                    />
                  ) : (
                    <span>
                      {team2?.shortName?.charAt(0) || "?"}
                    </span>
                  )}
                </div>

                <h2>
                  {team2?.name || "Unknown Team"}
                </h2>

                <span>
                  {team2?.shortName || ""}
                </span>

                {isFinished && (
                  <strong>{match.score2}</strong>
                )}
              </div>

            </div>

            {/* VENUE */}
            <div className="football-match-main-venue">
              <span>VENUE</span>

              <strong>
                📍 {match.venue}
              </strong>
            </div>

          </div>

          {/* MATCH INFORMATION */}
          <section className="football-match-information">

            <div className="football-match-information-heading">
              <span>MATCH INFORMATION</span>

              <h2>Match Details</h2>
            </div>

            <div className="football-match-information-grid">

              <div>
                <span>STATUS</span>
                <strong>{match.status}</strong>
              </div>

              <div>
                <span>MATCH TYPE</span>
                <strong>{match.matchType}</strong>
              </div>

              <div>
                <span>DATE</span>
                <strong>{match.date}</strong>
              </div>

              <div>
                <span>TIME</span>
                <strong>{match.time || "—"}</strong>
              </div>

              <div>
                <span>VENUE</span>
                <strong>{match.venue}</strong>
              </div>

              {(isFinished || isLive) && (
                <div>
                  <span>HALF TIME</span>

                  <strong>
                    {match.halftimeScore1} -{" "}
                    {match.halftimeScore2}
                  </strong>
                </div>
              )}

            </div>

          </section>

          {/* MATCH EVENTS */}
          {(isFinished || isLive) && (
            <section className="football-match-events">

              <div className="football-match-events-heading">
                <span>MATCH CENTER</span>

                <h2>Match Events</h2>

                <p>
                  Goals, cards and other important moments
                  from the match.
                </p>
              </div>

              {match.events && match.events.length > 0 ? (
                <div className="football-match-events-timeline">

                  {match.events
                    .slice()
                    .sort((a, b) => a.minute - b.minute)
                    .map((event) => {

                      const isTeam1Event =
                        event.teamId === match.team1Id;

                      const eventTeam =
                        isTeam1Event
                          ? team1
                          : team2;

                      return (
                        <div
                          className={
                            isTeam1Event
                              ? "football-match-event team1"
                              : "football-match-event team2"
                          }
                          key={event.id}
                        >

                          <div className="football-match-event-minute">
                            {event.minute}'
                          </div>

                          <div className="football-match-event-line">
                            <span>
                              {getEventIcon(event.type)}
                            </span>
                          </div>

                          <div
  className={`football-match-event-content event-${event.type.toLowerCase()}`}
>
  <div className="football-match-event-top">
    <strong>
      {getEventLabel(event.type)}
    </strong>

    <span className="football-match-event-team">
      {eventTeam?.shortName || eventTeam?.name}
    </span>
  </div>

  <h3>{event.player}</h3>

  <span className="football-match-event-team-name">
    {eventTeam?.name || "Unknown Team"}
  </span>

  <p>{event.description}</p>
</div>

                        </div>
                      );
                    })}

                </div>
              ) : (
                <div className="football-no-match-events">
                  <div>⚽</div>

                  <h3>No Match Events</h3>

                  <p>
                    No events have been recorded for
                    this match yet.
                  </p>
                </div>
              )}

            </section>
          )}

          {/* TEAM LINKS */}
          <section className="football-match-team-links">

            <div>
              <span>TEAM PROFILE</span>

              <h2>Explore The Teams</h2>

              <p>
                View team information and registered players.
              </p>
            </div>

            <div className="football-match-team-buttons">

              <Link to={`/football/teams/${team1?.id}`}>
                {team1?.name || "Team 1"} →
              </Link>

              <Link to={`/football/teams/${team2?.id}`}>
                {team2?.name || "Team 2"} →
              </Link>

            </div>

          </section>

          {/* NAVIGATION */}
          <div className="football-match-navigation">

            <Link to="/fixtures">
              ← Fixtures
            </Link>

            <Link to="/results">
              Results
            </Link>

            <Link to="/football">
              Football Home
            </Link>

          </div>

        </main>
      </div>
    </>
  );
}

export default FootballMatchDetails;