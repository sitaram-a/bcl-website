import { Link, useParams } from "react-router-dom";
import footballLogo from "../../assets/logo/bcl-football-logo.png";
import { footballTeams } from "../../data/football/teams";
import { footballPlayers } from "../../data/football/players";
import FootballNavbar from "../../components/football/FootballNavbar";

import "./FootballTeamDetails.css";

function FootballTeamDetails() {
  const { teamId } = useParams();

  const team = footballTeams.find(
    (item) => item.id === Number(teamId)
  );

  const teamPlayers = footballPlayers.filter(
    (player) => player.teamId === Number(teamId)
  );

  if (!team) {
    return (
       
        
      <div className="team-not-found">

        <div className="team-not-found-icon">
          ⚽
        </div>

        <h1>Team Not Found</h1>

        <p>
          The requested BCL football team does not exist.
        </p>

        <Link
          to="/teams"
          className="team-not-found-button"
        >
          ← Back to Teams
        </Link>

      </div>
    );
  }

  return (
     <>
        <FootballNavbar />
    <div className="football-team-details-page">

      {/* HERO */}
      <section className="team-details-hero">

        <div className="team-details-hero-content">

          <div className="team-details-main-logo">

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


          <div className="team-details-info">

            <span className="team-details-kicker">
              BCL FOOTBALL TEAM #{team.id}
            </span>

            <h1>
              {team.name}
            </h1>

            <div className="team-details-meta">

              <span>
                {team.shortName}
              </span>

              <span>
                📍 {team.city}
              </span>

            </div>

            <p>
              Official football team participating in the
              Baharagora Champions League.
            </p>

          </div>

        </div>

      </section>


      {/* NAVIGATION */}
      <div className="team-details-back-wrapper">

        <Link
          to="/teams"
          className="team-details-back-button"
        >
          ← All Football Teams
        </Link>

      </div>


      {/* TEAM OVERVIEW */}
      <section className="team-overview-section">

        <div className="team-overview-heading">

          <span>TEAM PROFILE</span>

          <h2>
            {team.name}
          </h2>

          <p>
            Team information and registered players.
          </p>

        </div>


        <div className="team-overview-grid">

          <div className="team-overview-card">

            <span>TEAM NAME</span>

            <strong>
              {team.name}
            </strong>

          </div>


          <div className="team-overview-card">

            <span>SHORT NAME</span>

            <strong>
              {team.shortName}
            </strong>

          </div>


          <div className="team-overview-card">

            <span>LOCATION</span>

            <strong>
              📍 {team.city}
            </strong>

          </div>


          <div className="team-overview-card">

            <span>REGISTERED PLAYERS</span>

            <strong>
              {teamPlayers.length}
            </strong>

          </div>

        </div>

      </section>


      {/* PLAYERS */}
      <section className="team-players-section">

        <div className="team-players-heading">

          <span>TEAM SQUAD</span>

          <h2>
            {team.name} Players
          </h2>

          <p>
            Registered players representing {team.name}.
          </p>

        </div>


        {teamPlayers.length === 0 ? (

          <div className="no-team-players">

            <div>
              👥
            </div>

            <h3>
              No Players Added Yet
            </h3>

            <p>
              Player information for this team will
              appear here.
            </p>

          </div>

        ) : (

          <div className="team-players-grid">

            {teamPlayers.map((player) => (

              <div
                className="team-player-card"
                key={player.id}
              >

                <div className="player-number">
                  {player.jerseyNumber}
                </div>

                <div className="player-icon">
                  ⚽
                </div>

                <span className="player-label">
                  PLAYER
                </span>

                <h3>
                  {player.name}
                </h3>

                <p>
                  {player.position}
                </p>

              </div>

            ))}

          </div>

        )}

      </section>


      {/* FOOTBALL NAVIGATION */}
      <section className="team-details-navigation">

        <span>
          BCL FOOTBALL
        </span>

        <h2>
          Explore The Tournament
        </h2>

        <p>
          Follow fixtures, results, standings and other
          BCL football teams.
        </p>

        <div className="team-details-navigation-buttons">

          <Link
            to="/fixtures"
            className="team-details-primary-button"
          >
            Fixtures
          </Link>

          <Link
            to="/results"
            className="team-details-secondary-button"
          >
            Results
          </Link>

          <Link
            to="/football/standings"
            className="team-details-secondary-button"
          >
            Standings
          </Link>

        </div>

      </section>

    </div>
    </>
  );
}

export default FootballTeamDetails;