import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CricketNavbar from "../../components/cricket/CricketNavbar";
import { cricketPlayers } from "../../data/cricket/players";
import { cricketTeams } from "../../data/cricket/teams";
import "./CricketPlayers.css";

function CricketPlayers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("ALL");

  const getTeam = (teamId) => {
    return cricketTeams.find((team) => team.id === teamId);
  };

  const filteredPlayers = useMemo(() => {
    return cricketPlayers.filter((player) => {
      const matchesSearch = player.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesTeam =
        selectedTeam === "ALL" ||
        player.teamId === Number(selectedTeam);

      return matchesSearch && matchesTeam;
    });
  }, [searchTerm, selectedTeam]);

  return (
    <>
      <CricketNavbar />

      <main className="cricket-players-page">

        {/* Header */}
        <section className="cricket-players-header">
          <span className="cricket-section-badge">
            🏏 BCL CRICKET
          </span>

          <h1>Cricket Players</h1>

          <p>
            Players participating in Baharagora Champions League.
          </p>
        </section>

        {/* Filters */}
        <section className="cricket-player-filters">

          <div className="cricket-player-search">
            <span>🔎</span>

            <input
              type="text"
              placeholder="Search player..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />
          </div>

          <select
            className="cricket-player-team-filter"
            value={selectedTeam}
            onChange={(event) =>
              setSelectedTeam(event.target.value)
            }
          >
            <option value="ALL">
              All Teams
            </option>

            {cricketTeams.map((team) => (
              <option
                value={team.id}
                key={team.id}
              >
                {team.name}
              </option>
            ))}
          </select>

        </section>

        {/* Result count */}
        <div className="cricket-player-result-count">
          Showing{" "}
          <strong>{filteredPlayers.length}</strong>{" "}
          player
          {filteredPlayers.length !== 1 ? "s" : ""}
        </div>

        {/* Players */}
        <section className="cricket-players-grid">

          {filteredPlayers.length === 0 ? (
            <div className="cricket-no-players">

              <div>👤</div>

              <h2>No Players Found</h2>

              <p>
                Try changing your search or team filter.
              </p>

            </div>
          ) : (
            filteredPlayers.map((player) => {
              const team = getTeam(player.teamId);

              return (
                <div
                  className="cricket-player-list-card"
                  key={player.id}
                >

                  {/* Jersey */}
                  <div className="cricket-player-list-number">
                    #{player.jerseyNumber}
                  </div>

                  {/* Avatar */}
                  <div className="cricket-player-list-avatar">
                    👤
                  </div>

                  {/* Info */}
                  <div className="cricket-player-list-info">

                    <h2>{player.name}</h2>

                    <span className="cricket-player-position">
                      {player.role}
                    </span>

                    <div className="cricket-player-team-name">
                      🏏 {team?.name || "Unknown Team"}
                    </div>

                  </div>

                  {/* Team short name */}
                  <div className="cricket-player-team-badge">
                    {team?.shortName || "N/A"}
                  </div>

                </div>
              );
            })
          )}

        </section>

        {/* Bottom */}
        <section className="cricket-players-bottom">

          <Link
            to="/cricket"
            className="cricket-back-button"
          >
            ← Back to Cricket Home
          </Link>

        </section>

      </main>
    </>
  );
}

export default CricketPlayers;