
import { useState } from "react";
import { Link } from "react-router-dom";
import CricketNavbar from "../../components/cricket/CricketNavbar";
import { cricketFixtures } from "../../data/cricket/fixtures";
import { cricketTeams } from "../../data/cricket/teams";
import "./CricketFixtures.css";

const matchDays = [
  { day: 1, title: "Day 1 — Opening Matches", date: "2026-10-25" },
  { day: 2, title: "Day 2 — Group B", date: "2026-10-26" },
  { day: 3, title: "Day 3 — Group A", date: "2026-10-27" },
  { day: 4, title: "Day 4 — Group B", date: "2026-10-28" },
  { day: 5, title: "Day 5 — Playoffs", date: "2026-10-29" },
  { day: 6, title: "Final Day — Championship Final", date: "2026-10-30" },
];

function formatDate(dateString) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(timeString) {
  const [hours, minutes] = timeString.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;

  return `${displayHours}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

function getFixtureStage(fixture) {
  if (fixture.stage === "FINAL") return "FINAL";
  if (fixture.stage === "SEMI-FINAL") return "PLAYOFF";
  if (fixture.stage === "PLAYOFF") return "PLAYOFF";
  if (fixture.group === "A") return "GROUP A";
  if (fixture.group === "B") return "GROUP B";
  return "BCL CRICKET";
}

function CricketFixtures() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("ALL");

  
const teamAliases = {
  "BAHARAGORA KINGS": ["BAHARAGORA KINGS", "BAHARAGORA"],
  "BAHARAGORA ROYALS": ["BAHARAGORA ROYALS", "ROYALS"],
  "DIGBARDA PITCH PANTHERS": ["DIGBARDA PITCH PANTHERS", "PANTHERS"],
  "TEAM GAJRAJ": ["TEAM GAJRAJ", "GAJRAJ", "GAJRAJ CKU"],
  "KESHARDA SUPER KINGS": ["KESHARDA SUPER KINGS", "KESHARDA SUPER KING", "KESHARDA"],
  "KHANDAMOUDA WARRIORS": ["KHANDAMOUDA WARRIORS", "KHANDAMOUDA WARRIOR", "KHANDAMOUDA"],
  "SAKARA ROYALS": ["SAKARA ROYALS", "SAKRA ROYALS", "SAKARA"],
  "RR THUNDER STAR": ["RR THUNDER STAR", "RR THUNDER", "R.R THUNDER"],
};

const getTeam = (teamName) => {
  const normalizedName = teamName?.trim().toUpperCase();

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
};

  const filteredFixtures = cricketFixtures.filter((fixture) => {
    const search = searchTerm.trim().toLowerCase();

    const matchesSearch =
      !search ||
      fixture.team1?.toLowerCase().includes(search) ||
      fixture.team2?.toLowerCase().includes(search) ||
      fixture.venue?.toLowerCase().includes(search);

    const stage = getFixtureStage(fixture);
    const matchesStage = stageFilter === "ALL" || stage === stageFilter;

    return matchesSearch && matchesStage;
  });

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
            Follow the official BCL Season 5 cricket schedule from
            25 to 30 October 2026.
          </p>

          <div className="fixtures-summary">
            <span>📍 Baharagora Stadium</span>
            <span>🏏 {cricketFixtures.length} Scheduled Matches</span>
            <span>📅 25–30 October 2026</span>
          </div>
        </section>

        <section className="fixture-controls" aria-label="Search and filter fixtures">
          <div className="fixture-search">
            <label htmlFor="fixture-search-input">Search matches</label>
            <input
              id="fixture-search-input"
              type="search"
              placeholder="Search by team name..."
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
        </section>

        <div className="fixture-results-count" aria-live="polite">
          Showing {filteredFixtures.length} of {cricketFixtures.length} matches
        </div>

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
            matchDays.map((matchDay) => {
              const dayFixtures = filteredFixtures
                .filter((fixture) => fixture.day === matchDay.day)
                .sort((a, b) => a.time.localeCompare(b.time));

              if (dayFixtures.length === 0) return null;

              return (
                <section
                  className="fixture-day-section"
                  key={matchDay.day}
                >
                  <header className="fixture-day-header">
                    <div>
                      <span className="fixture-day-label">BCL SEASON 5</span>
                      <h2>{matchDay.title}</h2>
                      <p>{formatDate(matchDay.date)}</p>
                    </div>

                    <span className="fixture-day-count">
                      {dayFixtures.length}{" "}
                      {dayFixtures.length === 1 ? "Match" : "Matches"}
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
                                {team1?.logo ? (
                                  <img src={team1.logo} alt={team1.name} />
                                ) : (
                                  "🏏"
                                )}
                              </div>

                              <h2>{fixture.team1}</h2>
                              {team1?.shortName && (
                                <span>{team1.shortName}</span>
                              )}
                            </div>

                            <div className="cricket-fixture-vs">
                              <span>VS</span>
                            </div>

                            <div className="cricket-fixture-team">
                              <div className="cricket-team-logo">
                                {team2?.logo ? (
                                  <img src={team2.logo} alt={team2.name} />
                                ) : (
                                  "🏏"
                                )}
                              </div>

                              <h2>{fixture.team2}</h2>
                              {team2?.shortName && (
                                <span>{team2.shortName}</span>
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