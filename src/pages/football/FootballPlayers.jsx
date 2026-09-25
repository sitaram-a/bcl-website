import { useState } from "react";
import { Link } from "react-router-dom";
import footballLogo from "../../assets/logo/bcl-football-logo.png";
import { footballPlayers } from "../../data/football/players";
import { footballTeams } from "../../data/football/teams";
import FootballNavbar from "../../components/football/FootballNavbar";
import "./FootballPlayers.css";

function FootballPlayers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("ALL");

  const filteredPlayers = footballPlayers.filter((player) => {
    const team = footballTeams.find((item) => item.id === player.teamId);

    const matchesSearch =
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTeam =
      selectedTeam === "ALL" ||
      player.teamId === Number(selectedTeam);

    return matchesSearch && matchesTeam && team;
  });

  return (
    <>
    <FootballNavbar />
    <div className="football-players-page">

      {/* HERO */}
      <section className="football-players-hero">
        <div className="football-players-hero-content">

          <img
            src={footballLogo}
            alt="BCL Football"
            className="football-players-logo"
          />

          <div>
            <span className="football-players-kicker">
              BAHARAGORA CHAMPIONS LEAGUE
            </span>

            <h1>Football Players</h1>

            <p>
              Meet the players representing their teams in BCL Football.
            </p>
          </div>

        </div>
      </section>

      {/* BACK */}
      <div className="football-players-back">
        <Link to="/football">
          ← Back to Football
        </Link>
      </div>

      {/* FILTER SECTION */}
      <section className="football-player-filter-section">

        <div className="football-player-filter-heading">
          <span>BCL FOOTBALL</span>
          <h2>Registered Players</h2>
          <p>
            Search players or filter them by team.
          </p>
        </div>

        <div className="football-player-filters">

          {/* SEARCH */}
          <div className="player-search-box">
            <label>SEARCH PLAYER</label>

            <input
              type="text"
              placeholder="Search by player or position..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          {/* TEAM FILTER */}
          <div className="player-team-filter">
            <label>FILTER BY TEAM</label>

            <select
              value={selectedTeam}
              onChange={(event) => setSelectedTeam(event.target.value)}
            >
              <option value="ALL">All Teams</option>

              {footballTeams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

        </div>

      </section>

      {/* PLAYER COUNT */}
      <section className="football-player-count-section">
        <strong>{filteredPlayers.length}</strong>
        <span>
          {filteredPlayers.length === 1
            ? " Player Found"
            : " Players Found"}
        </span>
      </section>

      {/* PLAYERS */}
      <section className="football-players-list-section">

        {filteredPlayers.length === 0 ? (
          <div className="football-no-players">

            <div className="football-no-players-icon">
              ⚽
            </div>

            <h3>No Players Found</h3>

            <p>
              Try changing your search or team filter.
            </p>

          </div>
        ) : (
          <div className="football-players-grid">

            {filteredPlayers.map((player) => {

              const team = footballTeams.find(
                (item) => item.id === player.teamId
              );

              return (
                <div
                  className="football-player-card"
                  key={player.id}
                >

                  {/* JERSEY */}
                  <div className="football-player-jersey">
                    {player.jerseyNumber}
                  </div>

                  {/* ICON */}
                  <div className="football-player-icon">
                    ⚽
                  </div>

                  <span className="football-player-label">
                    PLAYER
                  </span>

                  <h3>{player.name}</h3>

                  <p className="football-player-position">
                    {player.position}
                  </p>

                  <div className="football-player-team">
                    <span>TEAM</span>
                    <strong>{team.name}</strong>
                  </div>

                  <div className="football-player-location">
                    📍 {team.city}
                  </div>

                  <Link
                    to={`/football/teams/${team.id}`}
                    className="football-player-team-button"
                  >
                    View Team →
                  </Link>

                </div>
              );
            })}

          </div>
        )}

      </section>

      {/* NAVIGATION */}
      <section className="football-players-navigation">

        <span>BCL FOOTBALL</span>

        <h2>Explore Football</h2>

        <p>
          Follow fixtures, results, standings and participating teams.
        </p>

        <div className="football-players-navigation-buttons">

          <Link
            to="/fixtures"
            className="football-players-primary-button"
          >
            Fixtures
          </Link>

          <Link
            to="/results"
            className="football-players-secondary-button"
          >
            Results
          </Link>

          <Link
            to="/football/standings"
            className="football-players-secondary-button"
          >
            Standings
          </Link>

          <Link
            to="/teams"
            className="football-players-secondary-button"
          >
            Teams
          </Link>

        </div>

      </section>

    </div>
    </>
  );
}

export default FootballPlayers;