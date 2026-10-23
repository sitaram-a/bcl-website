
import { Link } from "react-router-dom";
import CricketNavbar from "../../components/cricket/CricketNavbar";
import "./CricketResults.css";

function CricketResults() {
  return (
    <>
      <CricketNavbar />

      <main className="cricket-results-page">
        <section className="cricket-results-header">
          <span className="cricket-section-badge">
            🏏 BCL CRICKET
          </span>

          <h1>Season Update</h1>

          <p>
            The countdown to Baharagora Champions League cricket is on!
          </p>
        </section>

        <section className="cricket-results-list">
          <div className="cricket-no-results">
            <div>🏏</div>

            <h2>Matches Start 25 October</h2>

            <p>
              The tournament begins on 25 October. Match fixtures,
              live scores, and results will be available here as
              the competition progresses.
            </p>

            <div className="cricket-season-info">
              <div>
                <span>TOURNAMENT STATUS</span>
                <strong>Coming Soon</strong>
              </div>

              <div>
                <span>START DATE</span>
                <strong>25 October</strong>
              </div>

              <div>
                <span>UPDATES</span>
                <strong>Fixtures &amp; Scores</strong>
              </div>
            </div>

            <p className="cricket-season-note">
              Stay connected with BCL for upcoming fixtures,
              team updates, and match-day action.
            </p>

            <Link to="/cricket" className="cricket-back-button">
              Explore Cricket Home
            </Link>
          </div>
        </section>

        <section className="cricket-results-bottom">
          <Link to="/cricket" className="cricket-back-button">
            ← Back to Cricket Home
          </Link>
        </section>
      </main>
    </>
  );
}

export default CricketResults;
