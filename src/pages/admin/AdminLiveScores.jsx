import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Radio,
  Save,
  CheckCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { cricketTeams } from "../../data/cricket/teams";
import "./AdminLiveScores.css";

function getTeamName(teamId, placeholder) {
  if (teamId !== null && teamId !== undefined) {
    const team = cricketTeams.find(
      (item) => Number(item.id) === Number(teamId)
    );

    if (team) return team.name;
  }

  return placeholder || "TBD";
}

function getErrorMessage(error) {
  return error?.message || "An unexpected error occurred.";
}

function parseJsonList(value) {
  if (Array.isArray(value)) return value;
  return [];
}

function AdminLiveScores() {
  const [fixtures, setFixtures] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [matchStatus, setMatchStatus] = useState("UPCOMING");
  const [currentInnings, setCurrentInnings] = useState(1);

  const [team1Runs, setTeam1Runs] = useState(0);
  const [team1Wickets, setTeam1Wickets] = useState(0);
  const [team1Overs, setTeam1Overs] = useState("0.0");

  const [team2Runs, setTeam2Runs] = useState(0);
  const [team2Wickets, setTeam2Wickets] = useState(0);
  const [team2Overs, setTeam2Overs] = useState("0.0");

  const [target, setTarget] = useState(0);
  const [recentBalls, setRecentBalls] = useState("");

  const [battingList, setBattingList] = useState([]);
  const [bowlingList, setBowlingList] = useState([]);
  const [commentaryList, setCommentaryList] = useState([]);

  const [partnershipRuns, setPartnershipRuns] = useState(0);
  const [partnershipBalls, setPartnershipBalls] = useState(0);

  const [newBatter, setNewBatter] = useState({
    name: "",
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    isOnStrike: false,
  });

  const [newBowler, setNewBowler] = useState({
    name: "",
    overs: "0.0",
    maidens: 0,
    runs: 0,
    wickets: 0,
  });

  const [newCommentary, setNewCommentary] = useState({
    over: "",
    text: "",
  });

  useEffect(() => {
    let cancelled = false;

    async function loadFixtures() {
      setLoading(true);
      setErrorMessage("");

      try {
        const { data, error } = await supabase
          .from("cricket_matches")
          .select("*")
          .order("match_date", { ascending: true })
          .order("match_time", { ascending: true });

        if (error) throw error;
        if (cancelled) return;

        const matches = data || [];
        setFixtures(matches);

        if (matches.length > 0) {
          setSelectedMatchId(String(matches[0].id));
        } else {
          setSelectedMatchId("");
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Error loading cricket fixtures:", error);
          setErrorMessage(
            `Could not load fixtures: ${getErrorMessage(error)}`
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadFixtures();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedMatchId) return;

    let cancelled = false;

    async function loadLiveScore() {
      setErrorMessage("");
      setSuccessMessage("");

      try {
        const { data, error } = await supabase
          .from("cricket_live_scores")
          .select("*")
          .eq("match_id", Number(selectedMatchId))
          .maybeSingle();

        if (error) throw error;
        if (cancelled) return;

        if (data) {
          setMatchStatus(data.status || "UPCOMING");
          setCurrentInnings(data.current_innings ?? 1);

          setTeam1Runs(data.team1_runs ?? 0);
          setTeam1Wickets(data.team1_wickets ?? 0);
          setTeam1Overs(String(data.team1_overs ?? "0.0"));

          setTeam2Runs(data.team2_runs ?? 0);
          setTeam2Wickets(data.team2_wickets ?? 0);
          setTeam2Overs(String(data.team2_overs ?? "0.0"));

          setTarget(data.target ?? 0);
          setRecentBalls(data.recent_balls || "");

          setBattingList(parseJsonList(data.batting_data));
          setBowlingList(parseJsonList(data.bowling_data));
          setCommentaryList(parseJsonList(data.commentary_data));

          const partnership = data.partnership_data || {};
          setPartnershipRuns(partnership.runs ?? 0);
          setPartnershipBalls(partnership.balls ?? 0);
        } else {
          resetScoreForm();
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Error loading live score:", error);
          setErrorMessage(
            `Could not load this match's score: ${getErrorMessage(error)}`
          );
        }
      }
    }

    loadLiveScore();

    return () => {
      cancelled = true;
    };
  }, [selectedMatchId]);

  function resetScoreForm() {
    setMatchStatus("UPCOMING");
    setCurrentInnings(1);

    setTeam1Runs(0);
    setTeam1Wickets(0);
    setTeam1Overs("0.0");

    setTeam2Runs(0);
    setTeam2Wickets(0);
    setTeam2Overs("0.0");

    setTarget(0);
    setRecentBalls("");

    setBattingList([]);
    setBowlingList([]);
    setCommentaryList([]);

    setPartnershipRuns(0);
    setPartnershipBalls(0);
  }

  function handleAddBatter(event) {
    event.preventDefault();

    const name = newBatter.name.trim();
    if (!name) {
      setErrorMessage("Enter the batter's name.");
      return;
    }

    const runs = Number(newBatter.runs) || 0;
    const balls = Number(newBatter.balls) || 0;
    const fours = Number(newBatter.fours) || 0;
    const sixes = Number(newBatter.sixes) || 0;

    const batter = {
      id: Date.now(),
      name,
      runs,
      balls,
      fours,
      sixes,
      strikeRate: balls > 0 ? ((runs / balls) * 100).toFixed(2) : "0.00",
      isOnStrike: Boolean(newBatter.isOnStrike),
    };

    setBattingList((previous) => [
      ...previous.map((item) => ({ ...item, isOnStrike: false })),
      batter,
    ]);

    setNewBatter({
      name: "",
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      isOnStrike: false,
    });

    setErrorMessage("");
  }

  function handleRemoveBatter(id) {
    setBattingList((previous) => previous.filter((item) => item.id !== id));
  }

  function handleBatterChange(id, field, value) {
    setBattingList((previous) =>
      previous.map((item) => {
        if (item.id !== id) {
          return field === "isOnStrike"
            ? { ...item, isOnStrike: false }
            : item;
        }

        const updated = { ...item, [field]: value };

        if (["runs", "balls"].includes(field)) {
          const runs = Number(updated.runs) || 0;
          const balls = Number(updated.balls) || 0;

          updated.strikeRate =
            balls > 0 ? ((runs / balls) * 100).toFixed(2) : "0.00";
        }

        return updated;
      })
    );
  }

  function handleAddBowler(event) {
    event.preventDefault();

    const name = newBowler.name.trim();
    if (!name) {
      setErrorMessage("Enter the bowler's name.");
      return;
    }

    const overs = String(newBowler.overs || "0.0");
    const [wholePart, ballPart = "0"] = overs.split(".");
    const wholeOvers = Math.max(0, Number(wholePart) || 0);
    const balls = Math.min(5, Math.max(0, Number(ballPart) || 0));
    const totalBalls = wholeOvers * 6 + balls;
    const runs = Number(newBowler.runs) || 0;

    const bowler = {
      id: Date.now(),
      name,
      overs: `${wholeOvers}.${balls}`,
      maidens: Number(newBowler.maidens) || 0,
      runs,
      wickets: Number(newBowler.wickets) || 0,
      economy:
        totalBalls > 0
          ? (runs / (totalBalls / 6)).toFixed(2)
          : "0.00",
    };

    setBowlingList((previous) => [...previous, bowler]);

    setNewBowler({
      name: "",
      overs: "0.0",
      maidens: 0,
      runs: 0,
      wickets: 0,
    });

    setErrorMessage("");
  }

  function handleRemoveBowler(id) {
    setBowlingList((previous) => previous.filter((item) => item.id !== id));
  }

  function handleBowlerChange(id, field, value) {
    setBowlingList((previous) =>
      previous.map((item) => {
        if (item.id !== id) return item;

        const updated = { ...item, [field]: value };

        const [wholePart, ballPart = "0"] = String(updated.overs || "0.0").split(".");
        const wholeOvers = Math.max(0, Number(wholePart) || 0);
        const balls = Math.min(5, Math.max(0, Number(ballPart) || 0));
        const totalBalls = wholeOvers * 6 + balls;
        const runs = Number(updated.runs) || 0;

        updated.economy =
          totalBalls > 0
            ? (runs / (totalBalls / 6)).toFixed(2)
            : "0.00";

        return updated;
      })
    );
  }

  function handleAddCommentary(event) {
    event.preventDefault();

    const text = newCommentary.text.trim();
    if (!text) {
      setErrorMessage("Enter the commentary text.");
      return;
    }

    setCommentaryList((previous) => [
      {
        id: Date.now(),
        over: newCommentary.over.trim(),
        text,
        createdAt: new Date().toISOString(),
      },
      ...previous,
    ]);

    setNewCommentary({ over: "", text: "" });
    setErrorMessage("");
  }

  function handleRemoveCommentary(id) {
    setCommentaryList((previous) =>
      previous.filter((item) => item.id !== id)
    );
  }

  function validateOvers(value, label) {
    const text = String(value).trim();
    const match = text.match(/^(\d+)(?:\.([0-5]))?$/);

    if (!match) {
      throw new Error(`${label} must use cricket overs notation, e.g. 4.2.`);
    }

    return Number(`${match[1]}.${match[2] || "0"}`);
  }

  async function handleSave(event) {
    event.preventDefault();

    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      if (!selectedMatchId) {
        throw new Error("Please select a match first.");
      }

      const innings = Number(currentInnings);
      if (![1, 2].includes(innings)) {
        throw new Error("Current innings must be 1 or 2.");
      }

      const overs1 = validateOvers(team1Overs, "Team 1 overs");
      const overs2 = validateOvers(team2Overs, "Team 2 overs");

      const runs1 = Number(team1Runs);
      const wickets1 = Number(team1Wickets);
      const runs2 = Number(team2Runs);
      const wickets2 = Number(team2Wickets);
      const targetValue = Number(target);

      const numericValues = [
        runs1,
        wickets1,
        runs2,
        wickets2,
        targetValue,
        Number(partnershipRuns),
        Number(partnershipBalls),
      ];

      if (numericValues.some((value) => !Number.isFinite(value) || value < 0)) {
        throw new Error("Scores, wickets, target, and partnership values must be non-negative numbers.");
      }

      if (wickets1 > 10 || wickets2 > 10) {
        throw new Error("A team cannot lose more than 10 wickets.");
      }

      if (overs1 < 0 || overs2 < 0) {
        throw new Error("Overs cannot be negative.");
      }

      const partnershipRunRate =
        Number(partnershipBalls) > 0
          ? (
              Number(partnershipRuns) /
              (Number(partnershipBalls) / 6)
            ).toFixed(2)
          : "0.00";

      const payload = {
        match_id: Number(selectedMatchId),
        status: matchStatus,
        current_innings: innings,
        team1_runs: runs1,
        team1_wickets: wickets1,
        team1_overs: overs1,
        team2_runs: runs2,
        team2_wickets: wickets2,
        team2_overs: overs2,
        target: targetValue,
        recent_balls: recentBalls.trim(),
        batting_data: battingList,
        bowling_data: bowlingList,
        commentary_data: commentaryList,
        partnership_data: {
          runs: Number(partnershipRuns) || 0,
          balls: Number(partnershipBalls) || 0,
          runRate: partnershipRunRate,
        },
        updated_at: new Date().toISOString(),
      };

      const { data: existing, error: lookupError } = await supabase
        .from("cricket_live_scores")
        .select("id")
        .eq("match_id", Number(selectedMatchId))
        .maybeSingle();

      if (lookupError) throw lookupError;

      let saveError;


console.log("Saving live score payload:", payload);

let saveResult;

if (existing) {
  saveResult = await supabase
    .from("cricket_live_scores")
    .update(payload)
    .eq("id", existing.id)
    .select();
} else {
  saveResult = await supabase
    .from("cricket_live_scores")
    .insert(payload)
    .select();
}

console.log("Supabase save result:", saveResult);

if (saveResult.error) {
  throw saveResult.error;
}

setSuccessMessage("Live score saved successfully.");

    } catch (error) {
      console.error("Error saving cricket live score:", error);
      setErrorMessage(`Could not save live score: ${getErrorMessage(error)}`);
    } finally {
      setSaving(false);
    }
  }

  const selectedMatch = fixtures.find(
    (match) => Number(match.id) === Number(selectedMatchId)
  );

  const team1Name = selectedMatch
    ? getTeamName(selectedMatch.team1_id, selectedMatch.team1_placeholder)
    : "Team 1";

  const team2Name = selectedMatch
    ? getTeamName(selectedMatch.team2_id, selectedMatch.team2_placeholder)
    : "Team 2";

  const partnershipRunRate =
    Number(partnershipBalls) > 0
      ? (
          Number(partnershipRuns) /
          (Number(partnershipBalls) / 6)
        ).toFixed(2)
      : "0.00";

  return (
    <div className="admin-dashboard">
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <Link to="/admin" className="admin-view-site">
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>

            <h1>
              <Radio size={26} />
              Cricket Live Score Management
            </h1>

            <p className="admin-subtitle">
              Update match scores, innings, batting, bowling, and commentary.
            </p>
          </div>

          <Link to="/cricket/live-score" className="admin-view-site">
            View Public Live Score
          </Link>
        </header>

        {errorMessage && (
          <div className="admin-error-message" role="alert">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="admin-success-message" role="status">
            <CheckCircle size={18} />
            {successMessage}
          </div>
        )}

        {loading ? (
          <div className="admin-card">
            <p>Loading cricket fixtures...</p>
          </div>
        ) : fixtures.length === 0 ? (
          <div className="admin-card">
            <h2>No fixtures found</h2>
            <p>Create a fixture before entering its live score.</p>
            <Link to="/admin/cricket-fixtures" className="admin-view-site">
              Manage Fixtures
            </Link>
          </div>
        ) : (
          <form className="admin-score-form" onSubmit={handleSave}>
            <section className="admin-card">
              <h2>Match Settings</h2>

              <div className="admin-form-grid">
                <label>
                  Select Match
                  <select
                    value={selectedMatchId}
                    onChange={(event) =>
                      setSelectedMatchId(event.target.value)
                    }
                    required
                  >
                    {fixtures.map((match) => (
                      <option key={match.id} value={match.id}>
                        Match #{match.id} (Day {match.match_day}) —{" "}
                        {getTeamName(
                          match.team1_id,
                          match.team1_placeholder
                        )}{" "}
                        vs{" "}
                        {getTeamName(
                          match.team2_id,
                          match.team2_placeholder
                        )}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Match Status
                  <select
                    value={matchStatus}
                    onChange={(event) => setMatchStatus(event.target.value)}
                  >
                    <option value="UPCOMING">Upcoming</option>
                    <option value="LIVE">Live</option>
                    <option value="FINISHED">Finished</option>
                    <option value="POSTPONED">Postponed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </label>

                <label>
                  Current Innings
                  <select
                    value={currentInnings}
                    onChange={(event) =>
                      setCurrentInnings(Number(event.target.value))
                    }
                  >
                    <option value={1}>1st Innings</option>
                    <option value={2}>2nd Innings</option>
                  </select>
                </label>

                <label>
                  Target
                  <input
                    type="number"
                    min="0"
                    value={target}
                    onChange={(event) => setTarget(event.target.value)}
                  />
                </label>
              </div>

              {selectedMatch && (
                <p className="admin-subtitle">
                  {selectedMatch.match_date} · {selectedMatch.match_time} ·{" "}
                  {selectedMatch.venue}
                </p>
              )}
            </section>

            <section className="admin-card">
              <h2>Team Scores</h2>

              <div className="admin-form-grid">
                <div className="admin-score-team">
                  <h3>{team1Name}</h3>

                  <label>
                    Runs
                    <input
                      type="number"
                      min="0"
                      value={team1Runs}
                      onChange={(event) =>
                        setTeam1Runs(event.target.value)
                      }
                    />
                  </label>

                  <label>
                    Wickets
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={team1Wickets}
                      onChange={(event) =>
                        setTeam1Wickets(event.target.value)
                      }
                    />
                  </label>

                  <label>
                    Overs (e.g. 12.3)
                    <input
                      type="text"
                      inputMode="decimal"
                      value={team1Overs}
                      onChange={(event) =>
                        setTeam1Overs(event.target.value)
                      }
                    />
                  </label>
                </div>

                <div className="admin-score-team">
                  <h3>{team2Name}</h3>

                  <label>
                    Runs
                    <input
                      type="number"
                      min="0"
                      value={team2Runs}
                      onChange={(event) =>
                        setTeam2Runs(event.target.value)
                      }
                    />
                  </label>

                  <label>
                    Wickets
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={team2Wickets}
                      onChange={(event) =>
                        setTeam2Wickets(event.target.value)
                      }
                    />
                  </label>

                  <label>
                    Overs (e.g. 12.3)
                    <input
                      type="text"
                      inputMode="decimal"
                      value={team2Overs}
                      onChange={(event) =>
                        setTeam2Overs(event.target.value)
                      }
                    />
                  </label>
                </div>
              </div>
            </section>

            <section className="admin-card">
              <h2>Recent Balls</h2>

              <label>
                Recent deliveries
                <input
                  type="text"
                  value={recentBalls}
                  onChange={(event) => setRecentBalls(event.target.value)}
                  placeholder="Example: 1, 0, 4, W, 2, 6"
                />
              </label>

              <p className="admin-subtitle">
                Separate deliveries with commas, for example: 1, 0, 4, W.
              </p>
            </section>

            <section className="admin-card">
              <h2>Batting Scorecard</h2>

              <div className="admin-form-grid">
                <label>
                  Batter Name
                  <input
                    type="text"
                    value={newBatter.name}
                    onChange={(event) =>
                      setNewBatter({
                        ...newBatter,
                        name: event.target.value,
                      })
                    }
                    placeholder="Batter name"
                  />
                </label>

                <label>
                  Runs
                  <input
                    type="number"
                    min="0"
                    value={newBatter.runs}
                    onChange={(event) =>
                      setNewBatter({
                        ...newBatter,
                        runs: event.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Balls
                  <input
                    type="number"
                    min="0"
                    value={newBatter.balls}
                    onChange={(event) =>
                      setNewBatter({
                        ...newBatter,
                        balls: event.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Fours
                  <input
                    type="number"
                    min="0"
                    value={newBatter.fours}
                    onChange={(event) =>
                      setNewBatter({
                        ...newBatter,
                        fours: event.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Sixes
                  <input
                    type="number"
                    min="0"
                    value={newBatter.sixes}
                    onChange={(event) =>
                      setNewBatter({
                        ...newBatter,
                        sixes: event.target.value,
                      })
                    }
                  />
                </label>

                <label className="admin-checkbox-label">
                  <input
                    type="checkbox"
                    checked={newBatter.isOnStrike}
                    onChange={(event) =>
                      setNewBatter({
                        ...newBatter,
                        isOnStrike: event.target.checked,
                      })
                    }
                  />
                  On strike
                </label>
              </div>

              <button
                type="button"
                className="admin-action-button"
                onClick={handleAddBatter}
              >
                <Plus size={16} />
                Add Batter
              </button>

              {battingList.length > 0 && (
                <div className="admin-score-list">
                  {battingList.map((batter) => (
                    <div className="admin-score-list-item" key={batter.id}>
                      <div className="admin-form-grid">
                        <label>
                          Batter
                          <input
                            value={batter.name}
                            onChange={(event) =>
                              handleBatterChange(
                                batter.id,
                                "name",
                                event.target.value
                              )
                            }
                          />
                        </label>

                        <label>
                          Runs
                          <input
                            type="number"
                            min="0"
                            value={batter.runs}
                            onChange={(event) =>
                              handleBatterChange(
                                batter.id,
                                "runs",
                                Number(event.target.value)
                              )
                            }
                          />
                        </label>

                        <label>
                          Balls
                          <input
                            type="number"
                            min="0"
                            value={batter.balls}
                            onChange={(event) =>
                              handleBatterChange(
                                batter.id,
                                "balls",
                                Number(event.target.value)
                              )
                            }
                          />
                        </label>

                        <label>
                          4s
                          <input
                            type="number"
                            min="0"
                            value={batter.fours}
                            onChange={(event) =>
                              handleBatterChange(
                                batter.id,
                                "fours",
                                Number(event.target.value)
                              )
                            }
                          />
                        </label>

                        <label>
                          6s
                          <input
                            type="number"
                            min="0"
                            value={batter.sixes}
                            onChange={(event) =>
                              handleBatterChange(
                                batter.id,
                                "sixes",
                                Number(event.target.value)
                              )
                            }
                          />
                        </label>

                        <label className="admin-checkbox-label">
                          <input
                            type="checkbox"
                            checked={Boolean(batter.isOnStrike)}
                            onChange={(event) =>
                              handleBatterChange(
                                batter.id,
                                "isOnStrike",
                                event.target.checked
                              )
                            }
                          />
                          On strike
                        </label>
                      </div>

                      <p>Strike rate: {batter.strikeRate ?? "0.00"}</p>

                      <button
                        type="button"
                        className="admin-danger-button"
                        onClick={() => handleRemoveBatter(batter.id)}
                      >
                        <Trash2 size={15} />
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="admin-card">
              <h2>Bowling Scorecard</h2>

              <div className="admin-form-grid">
                <label>
                  Bowler Name
                  <input
                    type="text"
                    value={newBowler.name}
                    onChange={(event) =>
                      setNewBowler({
                        ...newBowler,
                        name: event.target.value,
                      })
                    }
                    placeholder="Bowler name"
                  />
                </label>

                <label>
                  Overs
                  <input
                    type="text"
                    inputMode="decimal"
                    value={newBowler.overs}
                    onChange={(event) =>
                      setNewBowler({
                        ...newBowler,
                        overs: event.target.value,
                      })
                    }
                    placeholder="e.g. 4.2"
                  />
                </label>

                <label>
                  Maidens
                  <input
                    type="number"
                    min="0"
                    value={newBowler.maidens}
                    onChange={(event) =>
                      setNewBowler({
                        ...newBowler,
                        maidens: event.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Runs
                  <input
                    type="number"
                    min="0"
                    value={newBowler.runs}
                    onChange={(event) =>
                      setNewBowler({
                        ...newBowler,
                        runs: event.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Wickets
                  <input
                    type="number"
                    min="0"
                    value={newBowler.wickets}
                    onChange={(event) =>
                      setNewBowler({
                        ...newBowler,
                        wickets: event.target.value,
                      })
                    }
                  />
                </label>
              </div>

              <button
                type="button"
                className="admin-action-button"
                onClick={handleAddBowler}
              >
                <Plus size={16} />
                Add Bowler
              </button>

              {bowlingList.length > 0 && (
                <div className="admin-score-list">
                  {bowlingList.map((bowler) => (
                    <div className="admin-score-list-item" key={bowler.id}>
                      <div className="admin-form-grid">
                        <label>
                          Bowler
                          <input
                            value={bowler.name}
                            onChange={(event) =>
                              handleBowlerChange(
                                bowler.id,
                                "name",
                                event.target.value
                              )
                            }
                          />
                        </label>

                        <label>
                          Overs
                          <input
                            value={bowler.overs}
                            onChange={(event) =>
                              handleBowlerChange(
                                bowler.id,
                                "overs",
                                event.target.value
                              )
                            }
                          />
                        </label>

                        <label>
                          Maidens
                          <input
                            type="number"
                            min="0"
                            value={bowler.maidens}
                            onChange={(event) =>
                              handleBowlerChange(
                                bowler.id,
                                "maidens",
                                Number(event.target.value)
                              )
                            }
                          />
                        </label>

                        <label>
                          Runs
                          <input
                            type="number"
                            min="0"
                            value={bowler.runs}
                            onChange={(event) =>
                              handleBowlerChange(
                                bowler.id,
                                "runs",
                                Number(event.target.value)
                              )
                            }
                          />
                        </label>

                        <label>
                          Wickets
                          <input
                            type="number"
                            min="0"
                            value={bowler.wickets}
                            onChange={(event) =>
                              handleBowlerChange(
                                bowler.id,
                                "wickets",
                                Number(event.target.value)
                              )
                            }
                          />
                        </label>
                      </div>

                      <p>Economy: {bowler.economy ?? "0.00"}</p>

                      <button
                        type="button"
                        className="admin-danger-button"
                        onClick={() => handleRemoveBowler(bowler.id)}
                      >
                        <Trash2 size={15} />
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="admin-card">
              <h2>Current Partnership</h2>

              <div className="admin-form-grid">
                <label>
                  Partnership Runs
                  <input
                    type="number"
                    min="0"
                    value={partnershipRuns}
                    onChange={(event) =>
                      setPartnershipRuns(event.target.value)
                    }
                  />
                </label>

                <label>
                  Partnership Balls
                  <input
                    type="number"
                    min="0"
                    value={partnershipBalls}
                    onChange={(event) =>
                      setPartnershipBalls(event.target.value)
                    }
                  />
                </label>
              </div>

              <p>Partnership run rate: {partnershipRunRate}</p>
            </section>

            <section className="admin-card">
              <h2>Ball-by-Ball Commentary</h2>

              <div className="admin-form-grid">
                <label>
                  Over / Ball
                  <input
                    type="text"
                    value={newCommentary.over}
                    onChange={(event) =>
                      setNewCommentary({
                        ...newCommentary,
                        over: event.target.value,
                      })
                    }
                    placeholder="e.g. 12.3"
                  />
                </label>

                <label>
                  Commentary
                  <input
                    type="text"
                    value={newCommentary.text}
                    onChange={(event) =>
                      setNewCommentary({
                        ...newCommentary,
                        text: event.target.value,
                      })
                    }
                    placeholder="Describe the delivery"
                  />
                </label>
              </div>

              <button
                type="button"
                className="admin-action-button"
                onClick={handleAddCommentary}
              >
                <Plus size={16} />
                Add Commentary
              </button>

              {commentaryList.length > 0 && (
                <div className="admin-score-list">
                  {commentaryList.map((item) => (
                    <div className="admin-score-list-item" key={item.id}>
                      <div>
                        <strong>
                          {item.over ? `Over ${item.over}` : "Commentary"}
                        </strong>
                        <p>{item.text}</p>
                      </div>

                      <button
                        type="button"
                        className="admin-danger-button"
                        onClick={() => handleRemoveCommentary(item.id)}
                      >
                        <Trash2 size={15} />
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <div className="admin-score-actions">
              <button
                type="submit"
                className="admin-save-button"
                disabled={saving || !selectedMatchId}
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Live Score"}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

export default AdminLiveScores;
