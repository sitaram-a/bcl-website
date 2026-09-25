import { Link } from "react-router-dom";
import footballLogo from "../../assets/logo/bcl-football-logo.png";
import { footballTeams } from "../../data/football/teams";
import { footballStandings } from "../../data/football/standings";
import FootballNavbar from "../../components/football/FootballNavbar";

import "./FootballStandings.css";

function FootballStandings() {
  const getTeam = (teamId) => {
    return footballTeams.find((team) => team.id === teamId);
  };

  return (
    <>
        <FootballNavbar />
    <div className="football-standings-page">

      {/* HEADER */}
      <section className="standings-header">
        <div className="standings-header-content">

          <div className="standings-logo">
            <img
              src={footballLogo}
              alt="BCL Football"
            />
          </div>

          <div>
            <span className="standings-kicker">
              BAHARAGORA CHAMPIONS LEAGUE
            </span>

            <h1>Football Standings</h1>

            <p>
              Follow the BCL football points table,
              team performance and tournament standings.
            </p>
          </div>

        </div>
      </section>


      {/* BACK BUTTON */}
      <div className="standings-back-wrapper">

        <Link
          to="/football"
          className="standings-back-button"
        >
          ← Back to Football
        </Link>

      </div>


      {/* STANDINGS */}
      <section className="standings-section">

        <div className="standings-section-heading">

          <span>TOURNAMENT TABLE</span>

          <h2>Football Points Table</h2>

          <p>
            Current BCL football team standings.
          </p>

        </div>


        <div className="standings-table-wrapper">

          <table className="standings-table">

            <thead>
              <tr>
                <th>POS</th>
                <th>TEAM</th>
                <th>P</th>
                <th>W</th>
                <th>D</th>
                <th>L</th>
                <th>PTS</th>
              </tr>
            </thead>


            <tbody>

              {footballStandings.map((standing) => {

                const team = getTeam(standing.teamId);

                return (
                  <tr key={standing.teamId}>

                    {/* POSITION */}
                    <td>
                      <div
                        className={`position-badge position-${standing.position}`}
                      >
                        {standing.position}
                      </div>
                    </td>


                    {/* TEAM */}
                    <td>

                      <div className="standing-team">

                        <div className="standing-team-logo">

                          {team?.logo ? (

                            <img
                              src={team.logo}
                              alt={team.name}
                            />

                          ) : (

                            <span>
                              {team?.shortName?.charAt(0)}
                            </span>

                          )}

                        </div>

                        <div>

                          <strong>
                            {team?.name}
                          </strong>

                          <small>
                            {team?.shortName}
                          </small>

                        </div>

                      </div>

                    </td>


                    {/* PLAYED */}
                    <td>
                      {standing.played}
                    </td>


                    {/* WON */}
                    <td className="standings-win">
                      {standing.won}
                    </td>


                    {/* DRAWN */}
                    <td className="standings-draw">
                      {standing.drawn}
                    </td>


                    {/* LOST */}
                    <td className="standings-loss">
                      {standing.lost}
                    </td>


                    {/* POINTS */}
                    <td>

                      <strong className="points-value">
                        {standing.points}
                      </strong>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>


        {/* LEGEND */}
        <div className="standings-legend">

          <div>
            <strong>P</strong>
            <span>Played</span>
          </div>

          <div>
            <strong>W</strong>
            <span>Won</span>
          </div>

          <div>
            <strong>D</strong>
            <span>Drawn</span>
          </div>

          <div>
            <strong>L</strong>
            <span>Lost</span>
          </div>

          <div>
            <strong>PTS</strong>
            <span>Points</span>
          </div>

        </div>

      </section>


      {/* NAVIGATION */}
      <section className="standings-navigation">

        <span>BCL FOOTBALL</span>

        <h2>Follow Every Match</h2>

        <p>
          Check upcoming fixtures and completed match results.
        </p>

        <div className="standings-navigation-buttons">

          <Link
            to="/fixtures"
            className="standings-primary-button"
          >
            View Fixtures
          </Link>

          <Link
            to="/results"
            className="standings-secondary-button"
          >
            View Results
          </Link>

        </div>

      </section>

    </div>
    </>
  );
}

export default FootballStandings;