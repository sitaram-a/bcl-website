import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CricketNavbar from "../../components/cricket/CricketNavbar";
import { supabase } from "../../lib/supabase";
import { getCricketTeams } from "../../services/cricketService";
import "./CricketFixtures.css";

function formatDate(dateString) {
  if (!dateString) return "Date to be announced";

  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(timeString) {
  if (!timeString) return "Time to be announced";

  const [hours, minutes] = timeString.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;

  return `${displayHours}:${String(minutes ?? 0).padStart(2, "0")} ${suffix}`;
}

function getFixtureStage(fixture) {
  if (fixture.stage === "FINAL") return "FINAL";

  if (
    fixture.stage === "SEMI-FINAL" ||
    fixture.stage === "PLAYOFF"
  ) {
    return "PLAYOFF";
  }

  if (fixture.group === "A") return "GROUP A";
  if (fixture.group === "B") return "GROUP B";

  return "BCL CRICKET";
}

function getMatchDayTitle(day, fixtures) {
  const stages = fixtures.map((fixture) => fixture.stage);

  if (stages.includes("FINAL")) {
    return `Day ${day} — Championship Final`;
  }

  if (
    stages.some(
      (stage) => stage === "SEMI-FINAL" || stage === "PLAYOFF"
    )
  ) {
    return `Day ${day} — Playoffs`;
  }

  const groups = [...new Set(fixtures.map((fixture) => fixture.group))];

  if (groups.length === 1 && groups[0]) {
    return `Day ${day} — Group ${groups[0]}`;
  }

  return `Day ${day} — Matches`;
}

function CricketFixtures() {
  const [fixtures, setFixtures] = useState([]);
  const [teams, setTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadFixtures(isRefresh = false) {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const [fixtureResult, teamData] = await Promise.all([
          supabase
            .from("cricket_matches")
            .select(`
              id,
              match_day,
              stage,
              group_name,
              team1_id,
              team2_id,
              team1_placeholder,
              team2_placeholder,
              match_date,
              match_time,
              venue,
              status
            `)
            .order("match_date", { ascending: true })
            .order("match_time", { ascending: true }),
          getCricketTeams(),
        ]);

        if (!active) return;

        if (fixtureResult.error) {
          throw fixtureResult.error;
        }

        setTeams((teamData || []).filter((team) => team.is_active !== false));

        setFixtures(
          (fixtureResult.data || []).map((row) => ({
            id: row.id,
            day: Number(row.match_day),
            stage: row.stage,
            group: row.group_name,
            team1Id: row.team1_id,
            team2Id: row.team2_id,
            team1Placeholder: row.team1_placeholder,
            team2Placeholder: row.team2_placeholder,
            date: row.match_date,
            time: row.match_time?.slice(0, 5) || "",
            venue: row.venue || "Venue to be announced",
            status: row.status || "UPCOMING",
          }))
        );
      } catch (fetchError) {
        console.error("Failed to load cricket fixtures:", fetchError);

        if (active) {
          setError(
            "We couldn't load the fixtures. Please refresh the page and try again."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    }

    loadFixtures();

    const channel = supabase
      .channel("public-cricket-fixtures")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cricket_matches",
        },
        () => loadFixtures(true)
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          console.error(
            "Live fixture updates are unavailable. Use Refresh Fixtures to reload."
          );
        }
      });

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const teamMap = useMemo(
    () => new Map(teams.map((team) => [Number(team.id), team])),
    [teams]
  );

  function getTeam(teamId) {
    return teamId == null ? undefined : teamMap.get(Number(teamId));
  }

  function getTeamName(fixture, side) {
    const teamId = side === 1 ? fixture.team1Id : fixture.team2Id;
    const placeholder =
      side === 1 ? fixture.team1Placeholder : fixture.team2Placeholder;

    return getTeam(teamId)?.name || placeholder || "TBD";
  }

  function getTeamLogo(teamId) {
    const team = getTeam(teamId);
    return team?.logo_url || "";
  }

  const filteredFixtures = fixtures.filter((fixture) => {
    const search = searchTerm.trim().toLowerCase();
    const team1 = getTeamName(fixture, 1).toLowerCase();
    const team2 = getTeamName(fixture, 2).toLowerCase();
    const venue = fixture.venue.toLowerCase();

    const matchesSearch =
      !search ||
      team1.includes(search) ||
      team2.includes(search) ||
      venue.includes(search);

    const stage = getFixtureStage(fixture);
    const matchesStage = stageFilter === "ALL" || stage === stageFilter;

    return matchesSearch && matchesStage;
  });

  const matchDays = [
    ...new Set(filteredFixtures.map((fixture) => fixture.day)),
  ].sort((a, b) => a - b);

  const fixtureDates = fixtures
    .map((fixture) => fixture.date)
    .filter(Boolean)
    .sort();

  const dateRange =
    fixtureDates.length > 0
      ? fixtureDates.length === 1
        ? formatDate(fixtureDates[0])
        : `${formatDate(fixtureDates[0])} – ${formatDate(
            fixtureDates[fixtureDates.length - 1]
          )}`
      : "Schedule to be announced";

  return (
    <>
      <CricketNavbar />

      <main className="cricket-fixtures-page">
        <section className="cricket-fixtures-header">
          <span className="cricket-section-badge">
            🏏 BCL CRICKET · SEASON 5
          </span>

          <h1>Match Fixtures</h1>

          <p>Follow the official BCL Season 5 cricket schedule.</p>

          <div className="fixtures-summary">
            <span>📍 Baharagora Stadium</span>
            <span>🏏 {fixtures.length} Scheduled Matches</span>
            <span>📅 {dateRange}</span>
          </div>
        </section>

        <section className="fixture-controls" aria-label="Search and filter fixtures">
          <div className="fixture-search">
            <label htmlFor="fixture-search-input">Search matches</label>
            <input
              id="fixture-search-input"
              type="search"
              placeholder="Search by team name or venue..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="fixture-filter">
            <label htmlFor="fixture-stage-filter">Filter by stage</label>
            <select
              id="fixture-stage-filter"
              value={stageFilter}
              onChange={(event) => setStageFilter(event.target.value)}
            >
              <option value="ALL">All Matches</option>
              <option value="GROUP A">Group A</option>
              <option value="GROUP B">Group B</option>
              <option value="PLAYOFF">Playoffs</option>
              <option value="FINAL">Final</option>
              <option value="BCL CRICKET">Other Matches</option>
            </select>
          </div>

          <button
            type="button"
            className="fixture-reset-button"
            onClick={() => {
              setSearchTerm("");
              setStageFilter("ALL");
            }}
          >
            Reset Filters
          </button>

          <button
            type="button"
            className="fixture-reset-button"
            onClick={() => loadFixturesFromButton()}
            disabled={refreshing}
          >
            {refreshing ? "Refreshing..." : "Refresh Fixtures"}
          </button>
        </section>

        <div className="fixture-results-count" aria-live="polite">
          Showing {filteredFixtures.length} of {fixtures.length} matches
        </div>

        {loading ? (
          <div className="cricket-no-fixtures">
            <p>Loading cricket fixtures...</p>
          </div>
        ) : error ? (
          <div className="cricket-no-fixtures" role="alert">
            <h2>Unable to Load Fixtures</h2>
            <p>{error}</p>
            <button
              type="button"
              className="fixture-reset-button"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : (
          <section className="cricket-fixtures-list">
            {filteredFixtures.length === 0 ? (
              <div className="cricket-no-fixtures">
                <div>🔎</div>
                <h2>No Matches Found</h2>
                <p>Try another team name or change the selected stage.</p>
                <button
                  type="button"
                  className="fixture-reset-button"
                  onClick={() => {
                    setSearchTerm("");
                    setStageFilter("ALL");
                  }}
                >
                  Show All Matches
                </button>
              </div>
            ) : (
              matchDays.map((day) => {
                const dayFixtures = filteredFixtures
                  .filter((fixture) => fixture.day === day)
                  .sort((a, b) => a.time.localeCompare(b.time));

                return (
                  <section className="fixture-day-section" key={day}>
                    <header className="fixture-day-header">
                      <div>
                        <span className="fixture-day-label">BCL SEASON 5</span>
                        <h2>{getMatchDayTitle(day, dayFixtures)}</h2>
                        <p>{formatDate(dayFixtures[0].date)}</p>
                      </div>

                      <span className="fixture-day-count">
                        {dayFixtures.length}{" "}
                        {dayFixtures.length === 1 ? "Match" : "Matches"}
                      </span>
                    </header>

                    <div className="fixture-day-matches">
                      {dayFixtures.map((fixture) => {
                        const team1 = getTeam(fixture.team1Id);
                        const team2 = getTeam(fixture.team2Id);

                        return (
                          <article className="cricket-fixture-card" key={fixture.id}>
                            <div className="cricket-fixture-top">
                              <span className="cricket-fixture-status">
                                {fixture.status}
                              </span>
                              <span className="cricket-fixture-id">
                                {getFixtureStage(fixture)}
                              </span>
                            </div>

                            <div className="cricket-fixture-date">
                              <strong>{formatDate(fixture.date)}</strong>
                              <span>{formatTime(fixture.time)}</span>
                            </div>

                            <div className="cricket-fixture-teams">
                              <div className="cricket-fixture-team">
                                <div className="cricket-team-logo">
                                  {getTeamLogo(fixture.team1Id) ? (
                                    <img
                                      src={getTeamLogo(fixture.team1Id)}
                                      alt={team1?.name || "Team logo"}
                                    />
                                  ) : (
                                    "🏏"
                                  )}
                                </div>
                                <h2>{getTeamName(fixture, 1)}</h2>
                                {team1?.short_name && <span>{team1.short_name}</span>}
                              </div>

                              <div className="cricket-fixture-vs">
                                <span>VS</span>
                              </div>

                              <div className="cricket-fixture-team">
                                <div className="cricket-team-logo">
                                  {getTeamLogo(fixture.team2Id) ? (
                                    <img
                                      src={getTeamLogo(fixture.team2Id)}
                                      alt={team2?.name || "Team logo"}
                                    />
                                  ) : (
                                    "🏏"
                                  )}
                                </div>
                                <h2>{getTeamName(fixture, 2)}</h2>
                                {team2?.short_name && <span>{team2.short_name}</span>}
                              </div>
                            </div>

                            <div className="cricket-fixture-venue">
                              📍 {fixture.venue}
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                );
              })
            )}
          </section>
        )}

        <section className="cricket-fixtures-bottom">
          <Link to="/cricket" className="cricket-back-button">
            ← Back to Cricket Home
          </Link>
        </section>
      </main>
    </>
  );
}

export default CricketFixtures;