import "./CricketTournamentBracket.css";

// Place your official BCL logo at public/bcl-logo.png.

const VENUE = "Baharagora Stadium";

const qualifiers = [
  [
    { tag: "GROUP A", name: "Top 1" },
    { tag: "GROUP B", name: "Top 1" },
  ],
  [
    { tag: "GROUP A", name: "Top 2" },
    { tag: "GROUP B", name: "Top 2" },
  ],
];

const playoff1 = {
  label: "PLAYOFF 01",
  time: "10:00 AM",
  teams: [
    { tag: "GROUP A", name: "Top 1" },
    { tag: "GROUP B", name: "Top 1" },
  ],
};

const playoff2 = {
  label: "PLAYOFF 02",
  time: "12:00 PM",
  teams: [
    { tag: "GROUP A", name: "Top 2" },
    { tag: "GROUP B", name: "Top 2" },
  ],
};

const playoff3 = {
  label: "PLAYOFF 03",
  time: "2:30 PM",
  teams: [
    { tag: "PLAYOFF", name: "Loser of Match 1" },
    { tag: "PLAYOFF", name: "Winner of Match 2" },
  ],
};

const finalMatch = {
  label: "CHAMPIONSHIP FINAL",
  time: "12:00 PM",
  teams: [
    { tag: "FINALIST 01", name: "Winner of Playoff 01" },
    { tag: "FINALIST 02", name: "Winner of Playoff 03" },
  ],
};

function Slot({ tag, name }) {
  return (
    <div className="bcl-slot">
      <span className="bcl-slot-tag">{tag}</span>
      <span className="bcl-slot-name">{name}</span>
      <i className="bcl-slot-flag" />
    </div>
  );
}

function MatchBox({ match, final = false }) {
  return (
    <article className={`bcl-match ${final ? "bcl-match-final" : ""}`}>
      {final ? (
        <div className="bcl-final-ribbon">FINAL</div>
      ) : (
        <div className="bcl-match-label">{match.label}</div>
      )}

      <div className="bcl-match-time">
        <span className="bcl-status-dot" />
        UPCOMING · <strong>{match.time}</strong>
      </div>

      <div className="bcl-match-teams">
        <Slot {...match.teams[0]} />
        <div className="bcl-match-vs">VS</div>
        <Slot {...match.teams[1]} />
      </div>

      <div className="bcl-match-venue">📍 {VENUE}</div>
    </article>
  );
}

export default function CricketPlayoffs() {
  return (
    <main className="bcl-playoffs-page">
      <section className="bcl-playoffs-hero">
        <div className="bcl-hero-glow" />

        <img
          className="bcl-playoffs-logo"
          src="/media/logos/bcl-cricket-logo.png"
          alt="Baharagora Champions League official logo"
        />

        <span className="bcl-season-label">BAHARAGORA CHAMPIONS LEAGUE</span>
        <h1>
          THE ROAD TO <span>GLORY</span>
        </h1>
        <p>Season 5 · Playoffs & Championship</p>

        <div className="bcl-hero-line">
          <span />
          <i>🏆</i>
          <span />
        </div>
      </section>

      <section className="bcl-bracket-wrap">
        <div className="bcl-bracket">
          {/* Column 1: qualifiers */}
          <div className="bcl-col">
            <div className="bcl-col-head">
              <strong>QUALIFIERS</strong>
              <span>Group A · Group B</span>
            </div>
            <div className="bcl-col-body bcl-col-qualifiers">
              {qualifiers.map((pair, i) => (
                <div className="bcl-pair" key={i}>
                  {pair.map((slot) => (
                    <Slot key={slot.tag + slot.name} {...slot} />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Day 5 playoffs 01 & 02 */}
          <div className="bcl-col">
            <div className="bcl-col-head">
              <strong>DAY 5 · THURSDAY</strong>
              <span>29 October 2026</span>
            </div>
            <div className="bcl-col-body bcl-col-round1">
              <div className="bcl-round-slot bcl-from-left">
                <MatchBox match={playoff1} />
              </div>
              <div className="bcl-round-slot bcl-from-left">
                <MatchBox match={playoff2} />
              </div>
            </div>
          </div>

          {/* Column 3: Playoff 03 */}
          <div className="bcl-col">
            <div className="bcl-col-head">
              <strong>DAY 5 · THURSDAY</strong>
              <span>Playoff decider</span>
            </div>
            <div className="bcl-col-body bcl-col-center">
              <div className="bcl-round-slot bcl-from-left bcl-to-right">
                <MatchBox match={playoff3} />
              </div>
            </div>
          </div>

          {/* Column 4: Final */}
          <div className="bcl-col bcl-col-final">
            <div className="bcl-col-head bcl-col-head-gold">
              <strong>DAY 6 · FRIDAY</strong>
              <span>30 October 2026</span>
            </div>
            <div className="bcl-col-body bcl-col-center">
              <div className="bcl-round-slot bcl-from-left">
                <MatchBox match={finalMatch} final />
                <div className="bcl-champion-banner">
                  <span>ONE TROPHY</span>
                  <strong>🏆 ONE CHAMPION</strong>
                  <span>THE GLORY OF BCL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <p className="bcl-fixture-disclaimer">
        Qualifying positions and match outcomes will be updated as the
        official tournament progresses.
      </p>
    </main>
  );
}