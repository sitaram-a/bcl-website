
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, CalendarDays, Trophy } from "lucide-react";
import CricketNavbar from "../../components/cricket/CricketNavbar";
import { cricketResults } from "../../data/cricket/results";
import { cricketTeams } from "../../data/cricket/teams";
import { getCricketFixtures } from "../../services/cricketService";
import "./CricketResults.css";

function getTeam(teamId, fallbackName) {
  const team = cricketTeams.find(
    (item) => Number(item.id) === Number(teamId)
  );

  return {
    name: team?.name || fallbackName || "TBA",
    logo: team?.logo || "",
  };
}

function formatDate(date) {
  if (!date) return "Date to be announced";

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusLabel(status) {
  switch (status) {
    case "FINISHED":
    case "COMPLETED":
      return "COMPLETED";
    case "LIVE":
      return "🔴 LIVE";
    case "ABANDONED":
      return "ABANDONED";
    case "CANCELLED":
      return "CANCELLED";
    default:
      return "UPCOMING";
  }
}

function CricketResults() {
  const [fixtures, setFixtures] = useState([]);
  const [fixtureLoading, setFixtureLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    let active = true;

    async function loadFixtures() {
      try {
        const data = await getCricketFixtures();

        if (active) {
          setFixtures(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Unable to load cricket fixtures:", error);

        if (active) setFixtures([]);
      } finally {
        if (active) setFixtureLoading(false);
      }
    }

    loadFixtures();

    return () => {
      active = false;
    };
  }, []);

  const resultMatches = useMemo(
    () =>
      cricketResults.map((result) => ({
        ...result,
        source: "result",
        matchId: result.id,
      })),
    []
  );

  const completedFixtureKeys = useMemo(
    () =>
      new Set(
        resultMatches.map(
          (match) =>
            `${match.date}|${match.team1Id}|${match.team2Id}`
        )
      ),
    [resultMatches]
  );

  const remainingMatches = useMemo(
    () =>
      fixtures
        .filter((fixture) => {
          const status = String(fixture.status || "").toUpperCase();

          const finished = [
            "FINISHED",
            "COMPLETED",
            "ABANDONED",
            "CANCELLED",
          ].includes(status);

          const team1Id = fixture.team1Id ?? fixture.team1_id;
          const team2Id = fixture.team2Id ?? fixture.team2_id;
          const date = fixture.date || fixture.match_date;

          const fixtureKey = `${date}|${team1Id}|${team2Id}`;

          return (
            !finished &&
            !completedFixtureKeys.has(fixtureKey)
          );
        })
        .map((fixture) => ({
          ...fixture,
          source: "fixture",
          matchId: fixture.id,
          team1Id: fixture.team1Id ?? fixture.team1_id,
          team2Id: fixture.team2Id ?? fixture.team2_id,
          team1Name:
            fixture.team1Name ||
            fixture.team1_name ||
            fixture.team1 ||
            fixture.team1_placeholder,
          team2Name:
            fixture.team2Name ||
            fixture.team2_name ||
            fixture.team2 ||
            fixture.team2_placeholder,
          date: fixture.date || fixture.match_date,
          time: fixture.time || fixture.match_time,
          status: fixture.status || "UPCOMING",
        })),
    [fixtures, completedFixtureKeys]
  );

  const allMatches = useMemo(
    () => [...resultMatches, ...remainingMatches],
    [resultMatches, remainingMatches]
  );

  const filteredMatches = useMemo(
    () =>
      allMatches
        .filter((match) => {
          const status = String(match.status || "UPCOMING").toUpperCase();

          if (filter === "COMPLETED") {
            return (
              status === "FINISHED" ||
              status === "COMPLETED"
            );
          }

          if (filter === "LIVE") {
            return status === "LIVE";
          }

          if (filter === "UPCOMING") {
            return ![
              "FINISHED",
              "COMPLETED",
              "LIVE",
              "ABANDONED",
              "CANCELLED",
            ].includes(status);
          }

          return true;
        })
        .sort((a, b) => {
          const dateA = new Date(a.date || "9999-12-31");
          const dateB = new Date(b.date || "9999-12-31");

          return dateB - dateA;
        }),
    [allMatches, filter]
  );

  const completedCount = resultMatches.filter((match) =>
    ["FINISHED", "COMPLETED"].includes(
      String(match.status).toUpperCase()
    )
  ).length;

  const liveCount = resultMatches.filter(
    (match) => String(match.status).toUpperCase() === "LIVE"
  ).length;

  const remainingCount = Math.max(
    0,
    16 - completedCount - liveCount
  );

  return (
    <>
      <CricketNavbar />

      <main className="cricket-results-page">
        <section className="cricket-results-header">
          <span className="cricket-section-badge">
            🏏 BCL CRICKET
          </span>

          <h1>Season 5 Match Centre</h1>

          <p>
            All matches and results of Baharagora Champions League
            Season 5.
          </p>

          <div className="cricket-results-summary">
            <div>
              <strong>16</strong>
              <span>Total Matches</span>
            </div>

            <div>
              <strong>{completedCount}</strong>
              <span>Results Added</span>
            </div>

            <div>
              <strong>{remainingCount}</strong>
              <span>Remaining</span>
            </div>
          </div>
        </section>

        <section className="cricket-results-list">
          <div className="cricket-results-toolbar">
            <h2>Matches &amp; Results</h2>

            <div className="cricket-results-filters">
              {["ALL", "LIVE", "UPCOMING", "COMPLETED"].map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    className={filter === item ? "active" : ""}
                    onClick={() => setFilter(item)}
                  >
                    {item === "ALL"
                      ? "All Matches"
                      : item === "UPCOMING"
                        ? "Upcoming"
                        : item === "COMPLETED"
                          ? "Completed"
                          : "Live"}
                  </button>
                )
              )}
            </div>
          </div>

          {fixtureLoading && (
            <p className="cricket-results-message">
              Loading fixtures…
            </p>
          )}

          {!fixtureLoading && filteredMatches.length === 0 && (
            <div className="cricket-no-results">
              <CalendarDays size={32} />
              <h2>No matches in this category</h2>
              <p>
                Match information will appear here when available.
              </p>
            </div>
          )}

          {filteredMatches.map((match) => {
            const team1 = getTeam(
              match.team1Id,
              match.team1Name
            );

            const team2 = getTeam(
              match.team2Id,
              match.team2Name
            );

            const status = String(
              match.status || "UPCOMING"
            ).toUpperCase();

            const completed =
              status === "FINISHED" ||
              status === "COMPLETED";

            const scorecardUrl =
              match.scorecardUrl ||
              match.scorecard_url ||
              "";

            return (
              <article
                className="result-scorecard result-match-card"
                key={`${match.source}-${match.matchId}`}
              >
                <div className="result-card-topline">
                  <span className="result-tournament-label">
                    BCL SEASON 5
                  </span>

                  <span
                    className={`result-match-status status-${status.toLowerCase()}`}
                  >
                    {getStatusLabel(status)}
                  </span>
                </div>

                <div className="result-match-date">
                  <CalendarDays size={15} />
                  {formatDate(match.date)}

                  {match.time &&
                    ` · ${String(match.time).slice(0, 5)}`}

                  {match.venue && ` · ${match.venue}`}
                </div>

                <div className="result-teams">
                  <div className="result-team">
                    {team1.logo && (
                      <img
                        src={team1.logo}
                        alt={`${team1.name} logo`}
                        className="result-team-logo"
                      />
                    )}

                    <h2>{team1.name}</h2>

                    {completed ? (
                      <>
                        <strong>{match.score1 || "—"}</strong>
                        <span>
                          {match.overs1
                            ? `${match.overs1} overs`
                            : ""}
                        </span>
                      </>
                    ) : (
                      <span className="result-pending-score">
                        {status === "LIVE"
                          ? match.score1 || "Live score updating"
                          : "—"}
                      </span>
                    )}
                  </div>

                  <div className="result-vs">VS</div>

                  <div className="result-team">
                    {team2.logo && (
                      <img
                        src={team2.logo}
                        alt={`${team2.name} logo`}
                        className="result-team-logo"
                      />
                    )}

                    <h2>{team2.name}</h2>

                    {completed ? (
                      <>
                        <strong>{match.score2 || "—"}</strong>
                        <span>
                          {match.overs2
                            ? `${match.overs2} overs`
                            : ""}
                        </span>
                      </>
                    ) : (
                      <span className="result-pending-score">
                        {status === "LIVE"
                          ? match.score2 || "Live score updating"
                          : "—"}
                      </span>
                    )}
                  </div>
                </div>

                {completed ? (
                  <div className="result-winner">
                    <Trophy size={17} />
                    {match.result || "Match completed"}
                  </div>
                ) : status === "ABANDONED" ? (
                  <div className="result-fixture-status">
                    Match abandoned
                  </div>
                ) : (
                  <div className="result-fixture-status">
                    {status === "LIVE"
                      ? "Match in progress"
                      : "Fixture scheduled — score not available yet"}
                  </div>
                )}

                {completed && (
                  <div className="result-match-meta">
                    {match.toss && (
                      <p>
                        <strong>Toss:</strong> {match.toss}
                      </p>
                    )}

                    {match.playerOfMatch &&
                      match.playerOfMatch !== "Not confirmed" && (
                        <p>
                          <strong>Player of the Match:</strong>{" "}
                          {match.playerOfMatch}
                        </p>
                      )}
                  </div>
                )}

                <div className="result-card-actions">
                  {scorecardUrl ? (
                    <a
                      className="result-official-link"
                      href={scorecardUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Official Scorecard
                      <ExternalLink size={16} />
                    </a>
                  ) : (
                    <span className="result-scorecard-pending">
                      Detailed scorecard not linked yet
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </section>

        <section className="cricket-results-bottom">
          <Link
            to="/cricket"
            className="cricket-back-button"
          >
            ← Back to Cricket Home
          </Link>
        </section>
      </main>
    </>
  );
}

export default CricketResults;
