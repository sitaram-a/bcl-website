import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import CricketNavbar from "../../components/cricket/CricketNavbar";
import { season4Matches } from "../../data/history/season4Matches";

import "./CricketSeason4History.css";

function CricketSeason4History() {
  const [competitionFilter, setCompetitionFilter] = useState("ALL");
  const [teamFilter, setTeamFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");

  /* =====================================================
     TEAMS
  ===================================================== */

  const teams = useMemo(() => {
    const teamSet = new Set();

    season4Matches.forEach((match) => {
      teamSet.add(match.team1);
      teamSet.add(match.team2);
    });

    return Array.from(teamSet).sort();
  }, []);

  /* =====================================================
     DATES
  ===================================================== */

  const dates = useMemo(() => {
    return [...new Set(season4Matches.map((match) => match.date))]
      .sort()
      .reverse();
  }, []);

  /* =====================================================
     FILTER MATCHES
  ===================================================== */

  const filteredMatches = useMemo(() => {
    return season4Matches.filter((match) => {

      /* League / Playoffs */

      const competitionMatch =
        competitionFilter === "ALL" ||
        (competitionFilter === "LEAGUE" &&
          match.stage === "League Matches") ||
        (competitionFilter === "PLAYOFFS" &&
          match.stage !== "League Matches");

      /* Team */

      const teamMatch =
        teamFilter === "ALL" ||
        match.team1 === teamFilter ||
        match.team2 === teamFilter;

      /* Date */

      const dateMatch =
        dateFilter === "ALL" ||
        match.date === dateFilter;

      return (
        competitionMatch &&
        teamMatch &&
        dateMatch
      );
    });
  }, [
    competitionFilter,
    teamFilter,
    dateFilter,
  ]);

  /* =====================================================
     FORMAT DATE
  ===================================================== */

  const formatDate = (date) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =====================================================
     RESET
  ===================================================== */

  const resetFilters = () => {
    setCompetitionFilter("ALL");
    setTeamFilter("ALL");
    setDateFilter("ALL");
  };

  return (
    <div className="season4-history-page">

      <CricketNavbar />

      {/* ================= HERO ================= */}

      <section className="season4-history-hero">

        <div className="season4-history-hero-content">

          <span className="season4-history-kicker">
            BCL CRICKET ARCHIVE
          </span>

          <h1>
            Season 4 History
          </h1>

          <p>
            Explore all 20 matches from the
            Baharagora Champions League Season 4.
          </p>

          <div className="season4-history-meta">

            <span>
              🏏 BCL Season 4
            </span>

            <span>
              📅 09 Nov – 16 Nov 2025
            </span>

            <span>
              🏟 Baharagora Stadium, Ghatsila
            </span>

          </div>

        </div>

      </section>


      {/* ================= CONTENT ================= */}

      <main className="season4-history-content">

        <div className="season4-history-container">

          {/* ================= PAGE HEADER ================= */}

          <div className="season4-history-heading">

            <div>

              <span>
                HISTORICAL MATCHES
              </span>

              <h2>
                BCL Season 4 Matches
              </h2>

              <p>
                Browse league and playoff matches,
                filter by team or date, and open the
                original CricHeroes scorecard.
              </p>

            </div>

            <div className="season4-match-count">

              <strong>
                {filteredMatches.length}
              </strong>

              <span>
                of {season4Matches.length} matches
              </span>

            </div>

          </div>


          {/* ================= FILTERS ================= */}

          <section className="season4-filters">

            {/* Competition */}

            <div className="season4-filter-group">

              <label>
                Competition
              </label>

              <select
                value={competitionFilter}
                onChange={(event) =>
                  setCompetitionFilter(event.target.value)
                }
              >

                <option value="ALL">
                  All Matches
                </option>

                <option value="LEAGUE">
                  League Matches
                </option>

                <option value="PLAYOFFS">
                  Playoffs
                </option>

              </select>

            </div>


            {/* Team */}

            <div className="season4-filter-group">

              <label>
                Team
              </label>

              <select
                value={teamFilter}
                onChange={(event) =>
                  setTeamFilter(event.target.value)
                }
              >

                <option value="ALL">
                  All Teams
                </option>

                {teams.map((team) => (
                  <option
                    key={team}
                    value={team}
                  >
                    {team}
                  </option>
                ))}

              </select>

            </div>


            {/* Date */}

            <div className="season4-filter-group">

              <label>
                Date
              </label>

              <select
                value={dateFilter}
                onChange={(event) =>
                  setDateFilter(event.target.value)
                }
              >

                <option value="ALL">
                  All Dates
                </option>

                {dates.map((date) => (
                  <option
                    key={date}
                    value={date}
                  >
                    {formatDate(date)}
                  </option>
                ))}

              </select>

            </div>


            {/* Reset */}

            <button
              type="button"
              className="season4-reset-button"
              onClick={resetFilters}
            >
              Reset Filters
            </button>

          </section>


          {/* ================= MATCH LIST ================= */}

          <section className="season4-match-list">

            {filteredMatches.length > 0 ? (

              filteredMatches.map((match) => (

                <article
                  className="season4-match-card"
                  key={match.id}
                >

                  {/* Match Header */}

                  <div className="season4-match-header">

                    <div>

                      <span className="season4-match-stage">
                        {match.stage}
                      </span>

                      <span className="season4-match-date">
                        {formatDate(match.date)}
                      </span>

                    </div>

                    <span className="season4-match-overs">
                      {match.overs} Overs
                    </span>

                  </div>


                  {/* Teams */}

                  <div className="season4-match-teams">

                    <div className="season4-team">

                      <strong>
                        {match.team1}
                      </strong>

                    </div>

                    <div className="season4-vs">
                      VS
                    </div>

                    <div className="season4-team">

                      <strong>
                        {match.team2}
                      </strong>

                    </div>

                  </div>


                  {/* Result */}

                  <div className="season4-match-result">

                    {match.result ? (

                      <>
                        <span className="season4-result-label">
                          RESULT
                        </span>

                        <strong>
                          {match.result}
                        </strong>
                      </>

                    ) : (

                      <span className="season4-result-unavailable">
                        Result unavailable in the imported
                        CricHeroes data
                      </span>

                    )}

                  </div>


                  {/* Footer */}

                  <div className="season4-match-footer">

                    <span>
                      🏟 {match.venue}
                    </span>

                    <Link
  to={`/cricket/history/${match.id}`}
  className="season4-scorecard-button"
>
  View Match →
</Link>

                  </div>

                </article>

              ))

            ) : (

              <div className="season4-empty">

                <div>
                  🔎
                </div>

                <h3>
                  No matches found
                </h3>

                <p>
                  Try changing your filters.
                </p>

                <button
                  type="button"
                  onClick={resetFilters}
                >
                  Clear Filters
                </button>

              </div>

            )}

          </section>


          {/* ================= BACK ================= */}

          <div className="season4-history-back">

            <Link to="/cricket">
              ← Back to BCL Cricket
            </Link>

          </div>

        </div>

      </main>

    </div>
  );
}

export default CricketSeason4History;