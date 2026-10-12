import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CricketNavbar from "../../components/cricket/CricketNavbar";
import { supabase } from "../../lib/supabase";
import { cricketTeams } from "../../data/cricket/teams";
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

  return `${displayHours}:${String(minutes).padStart(2, "0")} ${suffix}`;
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

  const groups = [
    ...new Set(fixtures.map((fixture) => fixture.group)),
  ];

  if (groups.length === 1 && groups[0]) {
    return `Day ${day} — Group ${groups[0]}`;
  }

  return `Day ${day} — Matches`;
}

const teamAliases = {
  "BAHARAGORA KINGS": ["BAHARAGORA KINGS", "BAHARAGORA"],
  "BAHARAGORA ROYALS": ["BAHARAGORA ROYALS", "ROYALS"],
  "DIGBARDA PITCH PANTHERS": [
    "DIGBARDA PITCH PANTHERS",
    "PANTHERS",
  ],
  "TEAM GAJRAJ": ["TEAM GAJRAJ", "GAJRAJ", "GAJRAJ CKU"],
  "KESHARDA SUPER KINGS": [
    "KESHARDA SUPER KINGS",
    "KESHARDA SUPER KING",
    "KESHARDA",
  ],
  "KHANDAMOUDA WARRIORS": [
    "KHANDAMOUDA WARRIORS",
    "KHANDAMOUDA WARRIOR",
    "KHANDAMOUDA",
  ],
  "SAKARA ROYALS": [
    "SAKARA ROYALS",
    "SAKRA ROYALS",
    "SAKARA",
  ],
  "RR THUNDER STAR": [
    "RR THUNDER STAR",
    "RR THUNDER",
    "R.R THUNDER",
  ],
};

function getTeam(teamName) {
  const normalizedName = teamName?.trim().toUpperCase();

  if (!normalizedName) return undefined;

  return cricketTeams.find((team) => {
    const canonicalName = team.name?.trim().toUpperCase();
    const shortName = team.shortName?.trim().toUpperCase();
    const aliases = teamAliases[canonicalName] || [];

    return (
      canonicalName === normalizedName ||
      shortName === normalizedName ||
      aliases.includes(normalizedName)
    );
  });
}

function mapDatabaseFixture(row) {
  const team1 = cricketTeams.find(
    (team) => Number(team.id) === Number(row.team1_id)
  );

  const team2 = cricketTeams.find(
    (team) => Number(team.id) === Number(row.team2_id)
  );

  return {
    id: row.id,
    day: Number(row.match_day),
    stage: row.stage,
    group: row.group_name,
    team1: team1?.name || row.team1_placeholder || "TBD",
    team2: team2?.name || row.team2_placeholder || "TBD",
    date: row.match_date,
    time: row.match_time?.slice(0, 5) || "",
    venue: row.venue || "Venue to be announced",
    status: row.status || "UPCOMING",
  };
}

function CricketFixtures() {
  const [fixtures, setFixtures] = useState([]);
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

      const { data, error: fetchError } = await supabase
        .from("cricket_matches")
        .select(
          [
            "id",
            "match_day",
            "stage",
            "group_name",
            "team1_id",
            "team2_id",
            "team1_placeholder",
            "team2_placeholder",
            "match_date",
            "match_time",
            "venue",
            "status",
          ].join(", ")
        )
        .order("match_date", { ascending: true })
        .order("match_time", { ascending: true });

      if (!active) return;

      if (fetchError) {
        console.error(
          "Failed to load cricket fixtures:",
          fetchError
        );

        setError(
          "We couldn't load the fixtures. Please refresh the page and try again."
        );
        setLoading(false);
        setRefreshing(false);
        return;
      }

      setFixtures((data || []).map(mapDatabaseFixture));
      setLoading(false);
      setRefreshing(false);
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
        () => {
          loadFixtures(true);
        }
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          console.error(
            "Live fixture updates are unavailable. Manual refresh is still available."
          );
        }
      });

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredFixtures = fixtures.filter((fixture) => {
    const search = searchTerm.trim().toLowerCase();

    const matchesSearch =
      !search ||
      fixture.team1.toLowerCase().includes(search) ||
      fixture.team2.toLowerCase().includes(search) ||
      fixture.venue.toLowerCase().includes(search);

    const stage = getFixtureStage(fixture);
    const matchesStage =
      stageFilter === "ALL" || stage === stageFilter;

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

          <p>
            Follow the official BCL Season 5 cricket schedule.
          </p>

          <div className="fixtures-summary">
            <span>📍 Baharagora Stadium</span>
            <span>
              🏏 {fixtures.length} Scheduled Matches
            </span>
            <span>📅 {dateRange}</span>
          </div>
        </section>

        <section
          className="fixture-controls"
          aria-label="Search and filter fixtures"
        >
          <div className="fixture-search">
            <label htmlFor="fixture-search-input">
              Search matches
            </label>

            <input
              id="fixture-search-input"
              type="search"
              placeholder="Search by team name or venue..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />
          </div>

          <div className="fixture-filter">
            <label htmlFor="fixture-stage-filter">
              Filter by stage
            </label>

            <select
              id="fixture-stage-filter"
              value={stageFilter}
              onChange={(event) =>
                setStageFilter(event.target.value)
              }
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
            onClick={() => window.location.reload()}
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
                <p>
                  Try another team name or change the selected stage.
                </p>

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
                  .sort((a, b) =>
                    a.time.localeCompare(b.time)
                  );

                if (dayFixtures.length === 0) return null;

                return (
                  <section
                    className="fixture-day-section"
                    key={day}
                  >
                    <header className="fixture-day-header">
                      <div>
                        <span className="fixture-day-label">
                          BCL SEASON 5
                        </span>

                        <h2>
                          {getMatchDayTitle(day, dayFixtures)}
                        </h2>

                        <p>
                          {formatDate(dayFixtures[0].date)}
                        </p>
                      </div>

                      <span className="fixture-day-count">
                        {dayFixtures.length}{" "}
                        {dayFixtures.length === 1
                          ? "Match"
                          : "Matches"}
                      </span>
                    </header>

                    <div className="fixture-day-matches">
                      {dayFixtures.map((fixture) => {
                        const team1 = getTeam(fixture.team1);
                        const team2 = getTeam(fixture.team2);

                        return (
                          <article
                            className="cricket-fixture-card"
                            key={fixture.id}
                          >
                            <div className="cricket-fixture-top">
                              <span
                                className="cricket-fixture-status"
                              >
                                {fixture.status}
                              </span>

                              <span className="cricket-fixture-id">
                                {getFixtureStage(fixture)}
                              </span>
                            </div>

                            <div className="cricket-fixture-date">
                              <strong>
                                {formatDate(fixture.date)}
                              </strong>

                              <span>
                                {formatTime(fixture.time)}
                              </span>
                            </div>

                            <div className="cricket-fixture-teams">
                              <div className="cricket-fixture-team">
                                <div className="cricket-team-logo">
                                  {team1?.logo ? (
                                    <img
                                      src={team1.logo}
                                      alt={team1.name}
                                    />
                                  ) : (
                                    "🏏"
                                  )}
                                </div>

                                <h2>{fixture.team1}</h2>

                                {team1?.shortName && (
                                  <span>
                                    {team1.shortName}
                                  </span>
                                )}
                              </div>

                              <div className="cricket-fixture-vs">
                                <span>VS</span>
                              </div>

                              <div className="cricket-fixture-team">
                                <div className="cricket-team-logo">
                                  {team2?.logo ? (
                                    <img
                                      src={team2.logo}
                                      alt={team2.name}
                                    />
                                  ) : (
                                    "🏏"
                                  )}
                                </div>

                                <h2>{fixture.team2}</h2>

                                {team2?.shortName && (
                                  <span>
                                    {team2.shortName}
                                  </span>
                                )}
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

export default CricketFixtures;
