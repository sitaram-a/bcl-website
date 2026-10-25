
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import CricketNavbar from "../../components/cricket/CricketNavbar";
import { supabase } from "../../lib/supabase";
import { cricketTeams } from "../../data/cricket/teams";
import "./CricketLiveScore.css";

const CRICHEROES_SCORECARDS = [
  {
    id: 1,
    title: "Match 1",
    teams: "Baharagora Kings vs Sakara Royals",
    result: "Baharagora Kings won by 37 runs",
    url: "https://cricheroes.com/scorecard/27884163/baharagora-champions-league-season-5/baharagora-kings-vs-sakra-royals/summary",
  },
  {
    id: 2,
    title: "Match 2",
    teams: "Kesharda Super Kings vs Gajraj 11",
    result: "Kesharda Super Kings won by 39 runs (DLS)",
    url: "",
  },
  {
    id: 3,
    title: "Match 3",
    teams: "Sakra Royals vs Gajraj 11",
    result: "Gajraj 11 won by 7 wickets",
    url: "https://cricheroes.com/scorecard/27815334/baharagora-champions-league-season-5/sakra-royals-vs-gajraj-11/scorecard",
  },
];

function getTeamName(teamId) {
  const team = cricketTeams.find(
    (item) => Number(item.id) === Number(teamId)
  );

  return team?.name || team?.shortName || "";
}

function CricHeroesScorecards() {
  return (
    <section className="cricheroes-scorecard-section">
      <div className="cricheroes-scorecard-heading">
        <div>
          <span className="cricheroes-scorecard-label">
            BCL SEASON 5
          </span>
          <h2>Official Match Scorecards</h2>
          <p>View completed match scorecards on CricHeroes.</p>
        </div>
      </div>

      <div className="cricheroes-match-list">
        {CRICHEROES_SCORECARDS.map((match) => (
          <article
            className="cricheroes-match-card"
            key={match.id}
          >
            <div className="cricheroes-match-info">
              <span className="cricheroes-match-number">
                {match.title}
              </span>
              <h3>{match.teams}</h3>
              <p>{match.result}</p>
            </div>

            {match.url ? (
              <a
                href={match.url}
                target="_blank"
                rel="noopener noreferrer"
                className="cricheroes-scorecard-link"
              >
                Open Scorecard
                <ExternalLink size={17} />
              </a>
            ) : (
              <span className="cricheroes-scorecard-unavailable">
                Link not available
              </span>
            )}
          </article>
        ))}
      </div>

      <p className="cricheroes-scorecard-fallback">
        Official scorecards open in a new tab. They are not embedded
        because CricHeroes blocks iframe embedding.
      </p>
    </section>
  );
}

function CricketLiveScore() {
  const [liveMatch, setLiveMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    let active = true;

    async function fetchLiveMatch() {
      try {
        const { data, error } = await supabase
          .from("cricket_live_scores")
          .select(`
            *,
            match:match_id (
              id,
              stage,
              group_name,
              team1_id,
              team2_id,
              team1_placeholder,
              team2_placeholder,
              match_date,
              match_time,
              venue
            )
          `)
          .eq("status", "LIVE")
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!active) return;

        if (error) {
          console.error("Error fetching live match:", error);
          setLoading(false);
          return;
        }

        if (data?.match) {
          setLiveMatch({
            id: data.match.id,
            matchType: data.match.stage || "BCL Match",
            status: data.status,
            date: data.match.match_date,
            time: data.match.match_time?.slice(0, 5) || "",
            venue:
              data.match.venue || "Baharagora Stadium, Ghatsila",

            team1Id: Number(data.match.team1_id),
            team2Id: Number(data.match.team2_id),

            team1Name:
              getTeamName(data.match.team1_id) ||
              data.match.team1_placeholder ||
              "Team 1",

            team2Name:
              getTeamName(data.match.team2_id) ||
              data.match.team2_placeholder ||
              "Team 2",

            currentInnings: Number(data.current_innings) || 1,
            target: Number(data.target) || 0,

            innings: [
              {
                teamId: Number(data.match.team1_id),
                runs: Number(data.team1_runs) || 0,
                wickets: Number(data.team1_wickets) || 0,
                overs: String(data.team1_overs ?? "0.0"),
              },
              {
                teamId: Number(data.match.team2_id),
                runs: Number(data.team2_runs) || 0,
                wickets: Number(data.team2_wickets) || 0,
                overs: String(data.team2_overs ?? "0.0"),
              },
            ],

            batting: (data.batting_data || []).map((batter) => ({
              ...batter,
              player:
                batter.player || batter.name || "Unknown Batter",
              status:
                batter.status ||
                (batter.isOnStrike ? "Batting" : "Not out"),
              runs: Number(batter.runs) || 0,
              balls: Number(batter.balls) || 0,
              fours: Number(batter.fours) || 0,
              sixes: Number(batter.sixes) || 0,
              strikeRate: batter.strikeRate || "0.00",
            })),

            bowling: (data.bowling_data || []).map((bowler) => ({
              ...bowler,
              player:
                bowler.player || bowler.name || "Unknown Bowler",
              overs: bowler.overs ?? "0.0",
              maidens: Number(bowler.maidens) || 0,
              runs: Number(bowler.runs) || 0,
              wickets: Number(bowler.wickets) || 0,
              economy: bowler.economy || "0.00",
            })),

            partnership: data.partnership_data || {
              runs: 0,
              balls: 0,
              runRate: "0.00",
            },

            lastOver: data.recent_balls
              ? data.recent_balls.split(",")
              : [],

            recentEvents: data.commentary_data || [],
          });
        } else {
          setLiveMatch(null);
        }

        setLoading(false);
        setLastUpdated(new Date());
      } catch (err) {
        console.error("Unexpected error loading live match:", err);

        if (active) setLoading(false);
      }
    }

    fetchLiveMatch();

    const channel = supabase
      .channel("public-cricket-live-scores")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cricket_live_scores",
        },
        fetchLiveMatch
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const getTeam = (teamId) =>
    cricketTeams.find(
      (team) => Number(team.id) === Number(teamId)
    );

  if (loading) {
    return (
      <>
        <CricketNavbar />
        <main className="cricket-live-page">
          <section className="cricket-live-empty">
            <div className="cricket-live-empty-icon">⏳</div>
            <h1>Loading Live Scores...</h1>
          </section>
          <CricHeroesScorecards />
        </main>
      </>
    );
  }

  if (!liveMatch || liveMatch.status !== "LIVE") {
    return (
      <>
        <CricketNavbar />
        <main className="cricket-live-page">
          <section className="cricket-live-empty">
            <div className="cricket-live-empty-icon">🏏</div>
            <h1>No Live Match</h1>
            <p>
              There are currently no cricket matches being played live.
            </p>
            <Link
              to="/cricket"
              className="cricket-live-back-button"
            >
              ← Back to Cricket Home
            </Link>
          </section>

          <CricHeroesScorecards />
        </main>
      </>
    );
  }

  const team1 = getTeam(liveMatch.team1Id);
  const team2 = getTeam(liveMatch.team2Id);

  const innings1 = liveMatch.innings.find(
    (innings) => innings.teamId === liveMatch.team1Id
  );

  const innings2 = liveMatch.innings.find(
    (innings) => innings.teamId === liveMatch.team2Id
  );

  const currentInnings =
    liveMatch.innings[liveMatch.currentInnings - 1];

  const battingTeam = currentInnings
    ? getTeam(currentInnings.teamId)
    : null;

  const currentRuns = currentInnings?.runs ?? 0;
  const currentWickets = currentInnings?.wickets ?? 0;
  const currentOvers = currentInnings?.overs ?? "0.0";
  const target = liveMatch.target;

  const runsRequired =
    target > currentRuns ? target - currentRuns : null;

  const wicketsRemaining = 10 - currentWickets;

  return (
    <>
      <CricketNavbar />

      <main className="cricket-live-page">
        <section className="cricket-live-header">
          <span className="cricket-live-badge">🔴 LIVE NOW</span>
          <h1>Cricket Live Score</h1>
          <p>
            Live match updates from Baharagora Champions League.
          </p>
          <div className="cricket-live-refresh">
            <span className="refresh-dot"></span>
            {" "}Real-time Supabase Sync Active
          </div>
        </section>

        <section className="cricket-live-score-card">
          <div className="cricket-live-match-top">
            <span>🏏 {liveMatch.matchType}</span>
            <strong>LIVE</strong>
          </div>

          <div className="cricket-live-match-info">
            {liveMatch.date} • {liveMatch.time}
            <br />
            📍 {liveMatch.venue}
          </div>

          <div className="cricket-live-teams">
            <div className="cricket-live-team">
              <div className="cricket-live-team-logo">🏏</div>
              <h2>{team1?.shortName || liveMatch.team1Name}</h2>
              <p>{team1?.name || liveMatch.team1Name}</p>
              <div className="cricket-live-score">
                {innings1?.runs ?? 0}/{innings1?.wickets ?? 0}
              </div>
              <span className="cricket-live-overs">
                {innings1?.overs ?? "0.0"} overs
              </span>
            </div>

            <div className="cricket-live-vs">
              <span>VS</span>
            </div>

            <div className="cricket-live-team">
              <div className="cricket-live-team-logo">🏏</div>
              <h2>{team2?.shortName || liveMatch.team2Name}</h2>
              <p>{team2?.name || liveMatch.team2Name}</p>
              <div className="cricket-live-score">
                {innings2?.runs ?? 0}/{innings2?.wickets ?? 0}
              </div>
              <span className="cricket-live-overs">
                {innings2?.overs ?? "0.0"} overs
              </span>
            </div>
          </div>

          <div className="cricket-current-innings">
            <span>CURRENT INNINGS</span>
            <strong>{battingTeam?.name || "Batting Team"}</strong>
          </div>

          {target > 0 && (
            <div className="cricket-live-target">
              🎯 Target: <strong>{target}</strong>
            </div>
          )}
        </section>

        <section className="cricket-live-section">
          <div className="cricket-live-section-title">
            <div>
              <span>LIVE MATCH STATUS</span>
              <h2>Match Situation</h2>
            </div>
          </div>

          <div className="cricket-match-status-grid">
            <div className="cricket-status-card">
              <div className="cricket-status-icon">🏏</div>
              <div>
                <span>BATTING NOW</span>
                <strong>{battingTeam?.name || "Team"}</strong>
              </div>
            </div>

            <div className="cricket-status-card">
              <div className="cricket-status-icon">📊</div>
              <div>
                <span>CURRENT SCORE</span>
                <strong>{currentRuns}/{currentWickets}</strong>
              </div>
            </div>

            <div className="cricket-status-card">
              <div className="cricket-status-icon">⏱️</div>
              <div>
                <span>OVERS</span>
                <strong>{currentOvers}</strong>
              </div>
            </div>

            <div className="cricket-status-card">
              <div className="cricket-status-icon">🧤</div>
              <div>
                <span>WICKETS LEFT</span>
                <strong>{wicketsRemaining}</strong>
              </div>
            </div>

            {target > 0 && (
              <div className="cricket-status-card">
                <div className="cricket-status-icon">🎯</div>
                <div>
                  <span>TARGET</span>
                  <strong>{target}</strong>
                </div>
              </div>
            )}

            {runsRequired !== null && (
              <div className="cricket-status-card cricket-status-highlight">
                <div className="cricket-status-icon">🔥</div>
                <div>
                  <span>RUNS REQUIRED</span>
                  <strong>{runsRequired}</strong>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="cricket-live-section">
          <div className="cricket-live-section-title">
            <div>
              <span>LIVE SCORECARD</span>
              <h2>Batters &amp; Bowlers</h2>
            </div>
          </div>

          <div
            className="cricket-scorecard-block"
            style={{ marginBottom: "2rem" }}
          >
            <div className="cricket-scorecard-heading">
              <div>
                <span>BATTERS</span>
                <h3>{battingTeam?.name || "Batting Team"}</h3>
              </div>
              <strong>{currentRuns}/{currentWickets}</strong>
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

              {liveMatch.batting.length === 0 ? (
                <p style={{ padding: "1rem", color: "#64748b" }}>
                  No batters added yet.
                </p>
              ) : (
                liveMatch.batting.map((batter, index) => (
                  <div className="cricket-batting-row" key={index}>
                    <div className="cricket-batter-name">
                      <strong>{batter.player}</strong>
                      <span>{batter.status}</span>
                    </div>
                    <strong>{batter.runs}</strong>
                    <span>{batter.balls}</span>
                    <span>{batter.fours}</span>
                    <span>{batter.sixes}</span>
                    <span>{batter.strikeRate}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="cricket-scorecard-block">
            <div className="cricket-scorecard-heading">
              <div>
                <span>BOWLERS</span>
                <h3>Bowling Figures</h3>
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

              {liveMatch.bowling.length === 0 ? (
                <p style={{ padding: "1rem", color: "#64748b" }}>
                  No bowlers added yet.
                </p>
              ) : (
                liveMatch.bowling.map((bowler, index) => (
                  <div className="cricket-bowling-row" key={index}>
                    <strong>{bowler.player}</strong>
                    <span>{bowler.overs}</span>
                    <span>{bowler.maidens}</span>
                    <span>{bowler.runs}</span>
                    <strong>{bowler.wickets}</strong>
                    <span>{bowler.economy}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="cricket-live-section">
          <div className="cricket-partnership-card">
            <div className="cricket-partnership-header">
              <div>
                <span>CURRENT PARTNERSHIP</span>
                <h3>{liveMatch.partnership.runs ?? 0} Runs</h3>
              </div>
              <div className="cricket-partnership-icon">🤝</div>
            </div>

            <div className="cricket-partnership-stats">
              <div>
                <span>RUNS</span>
                <strong>{liveMatch.partnership.runs ?? 0}</strong>
              </div>
              <div>
                <span>BALLS</span>
                <strong>{liveMatch.partnership.balls ?? 0}</strong>
              </div>
              <div>
                <span>RUN RATE</span>
                <strong>
                  {liveMatch.partnership.runRate ?? "0.00"}
                </strong>
              </div>
            </div>
          </div>
        </section>

        {liveMatch.lastOver.length > 0 && (
          <section className="cricket-live-section">
            <div className="cricket-live-section-title">
              <div>
                <span>RECENT BALLS</span>
                <h2>Last Over</h2>
              </div>
              <span>
                Last updated:{" "}
                {lastUpdated?.toLocaleTimeString() || "Updating..."}
              </span>
            </div>

            <div className="cricket-last-over">
              {liveMatch.lastOver.map((ball, index) => (
                <div
                  key={index}
                  className={
                    ball.trim() === "W"
                      ? "cricket-ball wicket"
                      : ball.trim() === "4" || ball.trim() === "6"
                        ? "cricket-ball boundary"
                        : "cricket-ball"
                  }
                >
                  {ball.trim()}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="cricket-live-section">
          <div className="cricket-live-section-title">
            <div>
              <span>BALL BY BALL</span>
              <h2>Live Commentary</h2>
            </div>
          </div>

          <div className="cricket-commentary-list">
            {liveMatch.recentEvents.length === 0 ? (
              <p style={{ color: "#64748b" }}>
                No live commentary broadcasted yet.
              </p>
            ) : (
              liveMatch.recentEvents.map((event, index) => (
                <div
                  className={`cricket-commentary-item commentary-${(
                    event.type || "RUN"
                  ).toLowerCase()}`}
                  key={event.id ?? index}
                >
                  <div className="cricket-commentary-over">
                    {event.over}
                  </div>

                  <div className="cricket-commentary-icon">
                    {event.type === "FOUR" && "4️⃣"}
                    {event.type === "SIX" && "6️⃣"}
                    {event.type === "WICKET" && "🟥"}
                    {event.type === "DOT" && "•"}
                    {event.type === "RUN" && "🏏"}
                  </div>

                  <div className="cricket-commentary-content">
                    <div className="cricket-commentary-top">
                      <strong>{event.text}</strong>
                    </div>
                    <p>{event.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <CricHeroesScorecards />

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
