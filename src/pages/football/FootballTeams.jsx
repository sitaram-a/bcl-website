import { Link } from "react-router-dom";
import footballLogo from "../../assets/logo/bcl-football-logo.png";
import { footballTeams } from "../../data/football/teams";
import { footballPlayers } from "../../data/football/players";
import FootballNavbar from "../../components/football/FootballNavbar";

import "./FootballTeams.css";

function FootballTeams() {
  const getPlayerCount = (teamId) => {
    return footballPlayers.filter(
      (player) => player.teamId === teamId
    ).length;
  };

  return (
    <>
    <FootballNavbar />
   
    <div className="football-teams-page">

      {/* HEADER */}
      <section className="teams-header">
        <div className="teams-header-content">

          <div className="teams-header-logo">
            <img
              src={footballLogo}
              alt="BCL Football"
            />
          </div>

          <div>
            <span className="teams-kicker">
              BAHARAGORA CHAMPIONS LEAGUE
            </span>

            <h1>Football Teams</h1>

            <p>
              Meet the teams competing in the
              Baharagora Champions League football tournament.
            </p>
          </div>

        </div>
      </section>


      {/* BACK BUTTON */}
      <div className="teams-back-wrapper">

        <Link
          to="/football"
          className="teams-back-button"
        >
          ← Back to Football
        </Link>

      </div>


      {/* TEAMS */}
      <section className="teams-section">

        <div className="teams-section-heading">

          <span>THE COMPETITION</span>

          <h2>BCL Football Teams</h2>

          <p>
            Explore the teams participating in the tournament.
          </p>

        </div>


        <div className="teams-grid">

          {footballTeams.map((team) => (

            <div
              className="team-card"
              key={team.id}
            >

              {/* TEAM LOGO */}
              <div className="team-card-logo">

                {team.logo ? (

                  <img
                    src={team.logo}
                    alt={team.name}
                  />

                ) : (

                  <span>
                    {team.shortName.charAt(0)}
                  </span>

                )}

              </div>


              {/* TEAM NUMBER */}
              <span className="team-number">
                TEAM #{team.id}
              </span>


              {/* TEAM NAME */}
              <h3>
                {team.name}
              </h3>


              {/* SHORT NAME */}
              <div className="team-short-name">
                {team.shortName}
              </div>


              {/* CITY */}
              <p className="team-city">
                📍 {team.city}
              </p>


              {/* PLAYER COUNT */}
              <div className="team-player-count">

                <span>PLAYERS</span>

                <strong>
                  {getPlayerCount(team.id)}
                </strong>

              </div>


              {/* BUTTON */}
              <Link
                to={`/football/teams/${team.id}`}
                className="team-details-button"
              >
                View Team →
              </Link>

            </div>

          ))}

        </div>

      </section>


      {/* FOOTBALL NAVIGATION */}
      <section className="teams-navigation">

        <span>BCL FOOTBALL</span>

        <h2>Explore The Tournament</h2>

        <p>
          Follow fixtures, results, standings and players.
        </p>


        <div className="teams-navigation-grid">

          <Link
            to="/fixtures"
            className="teams-nav-card"
          >
            <span>📅</span>
            <h3>Fixtures</h3>
            <p>
              View upcoming matches.
            </p>
          </Link>


          <Link
            to="/results"
            className="teams-nav-card"
          >
            <span>🏆</span>
            <h3>Results</h3>
            <p>
              Check completed matches.
            </p>
          </Link>


          <Link
            to="/football/standings"
            className="teams-nav-card"
          >
            <span>📊</span>
            <h3>Standings</h3>
            <p>
              Check the points table.
            </p>
          </Link>


          <Link
            to="/players"
            className="teams-nav-card"
          >
            <span>⚽</span>
            <h3>Players</h3>
            <p>
              Explore BCL players.
            </p>
          </Link>

        </div>

      </section>

    </div>
     </>
  );
}

export default FootballTeams;