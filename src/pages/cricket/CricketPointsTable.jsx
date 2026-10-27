
import { cricketStandings } from "../../data/cricket/standings";
import { cricketTeams } from "../../data/cricket/teams";
import "./CricketStandings.css";

const GROUP_A_TEAM_IDS = [1, 4, 5, 7];
const GROUP_B_TEAM_IDS = [2, 3, 6, 8];

function CricketPointsTable() {
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

  const getGroupStandings = (teamIds) =>
    teamIds
      .map((teamId) => {
        const standing = cricketStandings.find(
          (item) => Number(item.teamId) === teamId
        );

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
        const pointsDifference =
          Number(b.points || 0) - Number(a.points || 0);

        if (pointsDifference !== 0) return pointsDifference;

        const aNRR = Number(a.nrr);
        const bNRR = Number(b.nrr);

        const aValid =
          a.nrr !== null &&
          a.nrr !== undefined &&
          a.nrr !== "" &&
          Number.isFinite(aNRR);

        const bValid =
          b.nrr !== null &&
          b.nrr !== undefined &&
          b.nrr !== "" &&
          Number.isFinite(bNRR);

        if (aValid && bValid) return bNRR - aNRR;
        if (aValid) return -1;
        if (bValid) return 1;

        return 0;
      });

  const renderGroupTable = (groupName, teamIds) => {
    const standings = getGroupStandings(teamIds);

    return (
      <section
        className="cricket-standings-container"
        key={groupName}
      >
        <div className="cricket-group-heading">
          <h2>{groupName}</h2>
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
                      <strong className="cricket-nrr">
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
    <div className="home-cricket-points-tables">
      {renderGroupTable("Group A", GROUP_A_TEAM_IDS)}
      {renderGroupTable("Group B", GROUP_B_TEAM_IDS)}
    </div>
  );
}

export default CricketPointsTable;
