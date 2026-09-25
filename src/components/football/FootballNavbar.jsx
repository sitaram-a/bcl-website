import { NavLink } from "react-router-dom";
import footballLogo from "../../assets/logo/bcl-football-logo.png";
import "./FootballNavbar.css";

function FootballNavbar() {
  return (
    <nav className="football-navbar">
      <div className="football-navbar-container">

        <NavLink to="/football" className="football-navbar-brand">
          <img
            src={footballLogo}
            alt="BCL Football"
          />

          <div>
            <strong>BCL</strong>
            <span>Football</span>
          </div>
        </NavLink>

        <div className="football-navbar-links">

          <NavLink
            to="/football"
            end
            className={({ isActive }) =>
              isActive ? "football-nav-link active" : "football-nav-link"
            }
          >
            Home
          </NavLink>

            <NavLink
            to="/football/live-score"
            className={({ isActive }) =>
            isActive
            ? "football-nav-link active"
            : "football-nav-link"
            }
            >
            🔴 Live
            </NavLink>

          <NavLink
            to="/fixtures"
            className={({ isActive }) =>
              isActive ? "football-nav-link active" : "football-nav-link"
            }
          >
            Fixtures
          </NavLink>

          <NavLink
            to="/results"
            className={({ isActive }) =>
              isActive ? "football-nav-link active" : "football-nav-link"
            }
          >
            Results
          </NavLink>

          <NavLink
            to="/football/standings"
            className={({ isActive }) =>
              isActive ? "football-nav-link active" : "football-nav-link"
            }
          >
            Standings
          </NavLink>

          <NavLink
            to="/teams"
            className={({ isActive }) =>
              isActive ? "football-nav-link active" : "football-nav-link"
            }
          >
            Teams
          </NavLink>

          <NavLink
            to="/players"
            className={({ isActive }) =>
              isActive ? "football-nav-link active" : "football-nav-link"
            }
          >
            Players
          </NavLink>

        </div>

      </div>
    </nav>
  );
}

export default FootballNavbar;