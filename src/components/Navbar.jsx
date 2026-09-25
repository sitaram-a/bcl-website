import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";

import cricketLogo from "../assets/logo/bcl-cricket-logo.png";
import footballLogo from "../assets/logo/bcl-football-logo.png";

import "./Navbar.css";

function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [sportsOpen, setSportsOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenu(false);
    setSportsOpen(false);
  };

  return (
    <header className="bcl-header">

      <div className="navbar-container">

        {/* BCL BRAND */}
        <Link to="/" className="bcl-brand" onClick={closeMobileMenu}>

          <div className="bcl-logos">

            <img
              src={footballLogo}
              alt="BCL Football"
              className="bcl-logo football-logo"
            />

            <img
              src={cricketLogo}
              alt="BCL Cricket"
              className="bcl-logo cricket-logo"
            />

          </div>

          <div className="bcl-brand-text">
            <span className="bcl-name">BCL</span>
            <span className="bcl-full-name">
              Baharagora Champions League
            </span>
          </div>

        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="desktop-nav">

          <Link to="/" className="nav-link">
            Home
          </Link>

          {/* SPORTS DROPDOWN */}
          <div className="sports-dropdown">

            <button
              className="nav-dropdown-button"
              onClick={() => setSportsOpen(!sportsOpen)}
            >
              Sports
              <ChevronDown size={16} />
            </button>

            {sportsOpen && (
              <div className="dropdown-menu">

                <Link
                  to="/football"
                  onClick={() => setSportsOpen(false)}
                >
                  <span>⚽</span>
                  Football
                </Link>

                <Link
                  to="/cricket"
                  onClick={() => setSportsOpen(false)}
                >
                  <span>🏏</span>
                  Cricket
                </Link>

              </div>
            )}

          </div>

          <Link to="/fixtures" className="nav-link">
            Fixtures
          </Link>

          <Link to="/results" className="nav-link">
            Results
          </Link>

          <Link to="/teams" className="nav-link">
            Teams
          </Link>

          <Link to="/players" className="nav-link">
            Players
          </Link>

          <Link to="/media" className="nav-link">
            Media
          </Link>

          <Link to="/registration" className="register-button">
            Registration
          </Link>

        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          className="mobile-menu-button"
          onClick={() => setMobileMenu(!mobileMenu)}
          aria-label="Toggle navigation"
        >
          {mobileMenu ? <X size={27} /> : <Menu size={27} />}
        </button>

      </div>

      {/* MOBILE NAVIGATION */}
      {mobileMenu && (
        <div className="mobile-nav">

          <Link to="/" onClick={closeMobileMenu}>
            Home
          </Link>

          <button
            className="mobile-sports-button"
            onClick={() => setSportsOpen(!sportsOpen)}
          >
            Sports
            <ChevronDown size={17} />
          </button>

          {sportsOpen && (
            <div className="mobile-sports-menu">

              <Link to="/football" onClick={closeMobileMenu}>
                ⚽ Football
              </Link>

              <Link to="/cricket" onClick={closeMobileMenu}>
                🏏 Cricket
              </Link>

            </div>
          )}

          <Link to="/fixtures" onClick={closeMobileMenu}>
            Fixtures
          </Link>

          <Link to="/results" onClick={closeMobileMenu}>
            Results
          </Link>

          <Link to="/teams" onClick={closeMobileMenu}>
            Teams
          </Link>

          <Link to="/players" onClick={closeMobileMenu}>
            Players
          </Link>

          <Link to="/media" onClick={closeMobileMenu}>
            Media
          </Link>

          <Link
            to="/registration"
            className="mobile-register-button"
            onClick={closeMobileMenu}
          >
            Registration
          </Link>

        </div>
      )}

    </header>
  );
}

export default Navbar;