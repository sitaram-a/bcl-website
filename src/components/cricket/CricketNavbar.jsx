import { NavLink } from "react-router-dom";
import cricketLogo from "../../assets/logo/bcl-cricket-logo.png";
import "./CricketNavbar.css";

function CricketNavbar() {
  return (
    <nav className="cricket-navbar">
      <div className="cricket-navbar-container">

        {/* Logo / Brand */}
        <NavLink to="/cricket" className="cricket-navbar-brand">
          <img src={cricketLogo} alt="BCL Cricket" />

          <div className="cricket-navbar-brand-text">
            <strong>BCL</strong>
            <span>Cricket</span>
          </div>
        </NavLink>

        {/* Navigation */}
        <div className="cricket-navbar-links">

          <NavLink
            to="/cricket"
            end
            className={({ isActive }) =>
              isActive
                ? "cricket-nav-link active"
                : "cricket-nav-link"
            }
          >
            Home
          </NavLink>

            <NavLink
            to="/cricket/live-score"
            className={({ isActive }) =>
            isActive
            ? "cricket-nav-link active cricket-live-nav-link"
            : "cricket-nav-link cricket-live-nav-link"
            }
            >
            🔴 Live
            </NavLink>

          <NavLink
            to="/cricket/fixtures"
            className={({ isActive }) =>
              isActive
                ? "cricket-nav-link active"
                : "cricket-nav-link"
            }
          >
            Fixtures
          </NavLink>

          <NavLink
            to="/cricket/results"
            className={({ isActive }) =>
              isActive
                ? "cricket-nav-link active"
                : "cricket-nav-link"
            }
          >
            Results
          </NavLink>

          <NavLink
            to="/cricket/standings"
            className={({ isActive }) =>
              isActive
                ? "cricket-nav-link active"
                : "cricket-nav-link"
            }
          >
            Standings
          </NavLink>

          <NavLink
            to="/cricket/teams"
            className={({ isActive }) =>
              isActive
                ? "cricket-nav-link active"
                : "cricket-nav-link"
            }
          >
            Teams
          </NavLink>

          <NavLink
            to="/cricket/players"
            className={({ isActive }) =>
              isActive
                ? "cricket-nav-link active"
                : "cricket-nav-link"
            }
          >
            Players
          </NavLink>

        </div>
      </div>
    </nav>
  );
}

export default CricketNavbar;