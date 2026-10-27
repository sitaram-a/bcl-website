
import { Link } from "react-router-dom";
import CricketNavbar from "../../components/cricket/CricketNavbar";
import { cricketStandings } from "../../data/cricket/standings";
import { cricketTeams } from "../../data/cricket/teams";
import CricketTournamentBracket from "./CricketTournamentBracket";
import "./CricketStandings.css";

// Group A: Day 1
const GROUP_A_TEAM_IDS = [1, 4, 5, 7];

// Group B: Day 2
const GROUP_B_TEAM_IDS = [2, 3, 6, 8];

function CricketStandings() {
  const getTeam = (teamId) =>
    cricketTeams.find(
      (team) => Number(team.id) === Number(teamId)
    );

  const formatNRR = (nrr) => {
    if (
      nrr === null ||
      nrr === undefined ||
      nrr === "" ||
      String(nrr).toLowerCase() === "provisional"
    ) {
      return "—";
    }

    const value = Number(nrr);

    if (!Number.isFinite(value)) return "—";

    return `${value > 0 ? "+" : ""}${value.toFixed(3)}`;
  };

  const getNRRClass = (nrr) => {
    if (
      nrr === null ||
      nrr === undefined ||
      nrr === "" ||
      String(nrr).toLowerCase() === "provisional" ||
      !Number.isFinite(Number(nrr))
    ) {
      return "unverified";
    }

    const value = Number(nrr);

    if (value > 0) return "positive";
    if (value < 0) return "negative";

    return "neutral";
  };

  const getGroupStandings = (teamIds) => {
    return teamIds
      .map((teamId) => {
        const standing = cricketStandings.find(
          (item) => Number(item.teamId) === teamId
        );

        // Include every group team, even before it has played.
        return (
          standing || {
            teamId,
            played: 0,
            won: 0,
            lost: 0,
            points: 0,
            nrr: null,
          }
        );
      })
      .sort((a, b) => {
        // Points first, then verified NRR.
        const pointsDifference =
          Number(b.points || 0) - Number(a.points || 0);

        if (pointsDifference !== 0) return pointsDifference;

        const aNRR = Number(a.nrr);
        const bNRR = Number(b.nrr);
        const aValid = a.nrr !== null &&
          a.nrr !== undefined &&
          a.nrr !== "" &&
          Number.isFinite(aNRR);
        const bValid = b.nrr !== null &&
          b.nrr !== undefined &&
          b.nrr !== "" &&
          Number.isFinite(bNRR);

        if (aValid && bValid) return bNRR - aNRR;
        if (aValid) return -1;
        if (bValid) return 1;

        return 0;
      });
  };

  const renderGroupTable = (groupName, description, teamIds) => {
    const standings = getGroupStandings(teamIds);

    return (
      <section
        className="cricket-standings-container"
        key={groupName}
      >
        <div className="cricket-group-heading">
          <h2>{groupName}</h2>
          {/* <p>{description}</p> */}
        </div>

        <div className="cricket-table-wrapper">
          <table className="cricket-standings-table">
            <thead>
              <tr>
                <th>POS</th>
                <th>TEAM</th>
                <th>P</th>
                <th>W</th>
                <th>L</th>
                <th>PTS</th>
                <th>NRR</th>
              </tr>
            </thead>

            <tbody>
              {standings.map((standing, index) => {
                const team = getTeam(standing.teamId);

                return (
                  <tr key={standing.teamId}>
                    <td>
                      <span
                        className={`cricket-position ${
                          index < 2 ? "top-position" : ""
                        }`}
                      >
                        {index + 1}
                      </span>
                    </td>

                    <td>
                      <div className="cricket-standing-team">
                        <div className="cricket-standing-logo">
                          {team?.logo ? (
                            <img
                              src={team.logo}
                              alt={`${team.name} logo`}
                              loading="lazy"
                            />
                          ) : (
                            "🏏"
                          )}
                        </div>

                        <div>
                          <strong>
                            {team?.name || "Unknown Team"}
                          </strong>
                          <span>{team?.shortName || ""}</span>
                        </div>
                      </div>
                    </td>

                    <td>{standing.played ?? 0}</td>
                    <td className="cricket-wins">
                      {standing.won ?? 0}
                    </td>
                    <td className="cricket-losses">
                      {standing.lost ?? 0}
                    </td>

                    <td>
                      <strong className="cricket-points">
                        {standing.points ?? 0}
                      </strong>
                    </td>

                    <td>
                      <strong
                        className={`cricket-nrr ${getNRRClass(
                          standing.nrr
                        )}`}
                        title={
                          getNRRClass(standing.nrr) === "unverified"
                            ? "NRR has not been verified yet"
                            : "Net Run Rate"
                        }
                      >
                        {formatNRR(standing.nrr)}
                      </strong>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    );
  };

  return (
    <>
      <CricketNavbar />

      <main className="cricket-standings-page">
        <section className="cricket-standings-header">
          <span className="cricket-section-badge">
            🏏 BCL CRICKET
          </span>

          <h1>Season 5 Points Table</h1>

          <p>
            Follow the standings and qualification race in each group.
          </p>
        </section>

        {renderGroupTable(
          "Group A",
          "Baharagora Kings, Sakara Royals, Kesharda Super Kings and Gajraj 11",
          GROUP_A_TEAM_IDS
        )}

        {renderGroupTable(
          "Group B",
          "Baharagora Royals, RR Thunder Star, Digbarda Pitch Panthers and Khandamouda Warriors",
          GROUP_B_TEAM_IDS
        )}

        <section className="cricket-standings-legend">
          <div><strong>P</strong><span>Played</span></div>
          <div><strong>W</strong><span>Won</span></div>
          <div><strong>L</strong><span>Lost</span></div>
          <div><strong>PTS</strong><span>Points</span></div>
          <div><strong>NRR</strong><span>Net Run Rate</span></div>
        </section>

        <p className="cricket-nrr-note">
          NRR is shown only when a numeric value is available.
          A dash (—) means the value is not verified.
          Teams are ordered by points, then available NRR.
        </p>

        <CricketTournamentBracket />

<section className="cricket-standings-bottom">
  <Link to="/cricket" className="cricket-back-button">
    ← Back to Cricket Home
  </Link>
</section>

     
      </main>
    </>
  );
}

export default CricketStandings;
