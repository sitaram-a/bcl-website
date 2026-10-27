import { Component, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import "./CricketTournamentBracket.css";

// Place your official BCL logo at public/bcl-logo.png.

const VENUE = "Baharagora Stadium";

const STAGES = [
  {
    id: "qualifiers",
    no: "01",
    chip: "Qualifiers",
    kicker: "LEAGUE STAGE",
    title: "Qualifiers",
    sub: "Top 2 from each group advance",
    type: "groups",
    groups: [
      {
        name: "GROUP A",
        slots: [
          { tag: "GROUP A", name: "Top 1", goes: "Advances to Playoff 01" },
          { tag: "GROUP A", name: "Top 2", goes: "Advances to Playoff 02" },
        ],
      },
      {
        name: "GROUP B",
        slots: [
          { tag: "GROUP B", name: "Top 1", goes: "Advances to Playoff 01" },
          { tag: "GROUP B", name: "Top 2", goes: "Advances to Playoff 02" },
        ],
      },
    ],
  },
  {
    id: "playoffs",
    no: "02",
    chip: "Playoffs",
    kicker: "DAY 5 · THURSDAY",
    title: "Playoffs",
    sub: "29 October 2026",
    type: "matches",
    matches: [
      {
        label: "PLAYOFF 01",
        date: "THURSDAY, 29 OCTOBER 2026",
        time: "10:00 AM",
        teams: [
          { tag: "GROUP A", name: "Top 1" },
          { tag: "GROUP B", name: "Top 1" },
        ],
      },
      {
        label: "PLAYOFF 02",
        date: "THURSDAY, 29 OCTOBER 2026",
        time: "12:00 PM",
        teams: [
          { tag: "GROUP A", name: "Top 2" },
          { tag: "GROUP B", name: "Top 2" },
        ],
      },
    ],
  },
  {
    id: "decider",
    no: "03",
    chip: "Decider",
    kicker: "DAY 5 · THURSDAY",
    title: "The Decider",
    sub: "29 October 2026 · 2:30 PM",
    type: "matches",
    matches: [
      {
        label: "PLAYOFF 03",
        date: "THURSDAY, 29 OCTOBER 2026",
        time: "2:30 PM",
        teams: [
          { tag: "PLAYOFF", name: "Loser of Match 1" },
          { tag: "PLAYOFF", name: "Winner of Match 2" },
        ],
      },
    ],
  },
  {
    id: "final",
    no: "04",
    chip: "Final",
    kicker: "DAY 6 · FRIDAY",
    title: "The Grand Final",
    sub: "30 October 2026 · 12:00 PM",
    type: "matches",
    final: true,
    matches: [
      {
        label: "CHAMPIONSHIP FINAL",
        date: "FRIDAY, 30 OCTOBER 2026",
        time: "12:00 PM",
        teams: [
          { tag: "FINALIST 01", name: "Winner of Playoff 01" },
          { tag: "FINALIST 02", name: "Winner of Playoff 03" },
        ],
      },
    ],
  },
];

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

/* ============================================================
   3D SCENE
============================================================ */

const TROPHY_PROFILE = [
  [0, 0],
  [0.9, 0],
  [0.9, 0.12],
  [0.72, 0.22],
  [0.72, 0.34],
  [0.28, 0.5],
  [0.14, 0.68],
  [0.14, 1.05],
  [0.3, 1.2],
  [0.5, 1.35],
  [0.8, 1.75],
  [0.86, 2.15],
  [0.8, 2.5],
  [0.7, 2.5],
  [0.74, 2.15],
  [0.68, 1.8],
  [0, 1.55],
].map(([x, y]) => new THREE.Vector2(x, y));

function CricketBall({ progress }) {
  const ref = useRef(null);

  useFrame((state, dt) => {
    const g = ref.current;
    if (!g) return;

    const p = progress.current;
    const t = state.clock.elapsedTime;
    const xr = state.viewport.width * 0.3;
    const base = clamp(state.viewport.width / 8, 0.5, 1);
    const end = THREE.MathUtils.smoothstep(p, 0.78, 0.95);

    const tx = Math.sin(p * Math.PI * 3) * xr * (1 - end) - xr * 0.9 * end;
    const ty = Math.cos(p * Math.PI * 2.5) * 0.8 + end * 1.2 + Math.sin(t) * 0.08;

    g.position.x = THREE.MathUtils.damp(g.position.x, tx, 4, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, ty, 4, dt);
    g.rotation.x = p * Math.PI * 14 + t * 0.25;
    g.rotation.y = p * Math.PI * 6;
    g.scale.setScalar(base * 0.85 * (1 - end * 0.45));
  });

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.38} metalness={0.15} />
      </mesh>

      {/* seam */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.003, 0.026, 12, 128]} />
        <meshStandardMaterial color="#f5e6c8" roughness={0.7} />
      </mesh>

      {/* stitches */}
      {[-0.075, 0.075].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[Math.sqrt(1.006 * 1.006 - y * y), 0.012, 8, 128]} />
          <meshStandardMaterial color="#f5e6c8" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function Trophy({ progress }) {
  const ref = useRef(null);

  useFrame((state, dt) => {
    const g = ref.current;
    if (!g) return;

    const p = progress.current;
    const base = clamp(state.viewport.width / 8, 0.5, 1);
    const k = THREE.MathUtils.smoothstep(p, 0.72, 0.95);
    const s = Math.max(k * base * 0.85, 0.0001);

    g.visible = k > 0.01;
    g.scale.setScalar(s);
    g.position.y = -1.25 * base + Math.sin(state.clock.elapsedTime * 1.2) * 0.07;
    g.rotation.y += dt * 0.8;
  });

  return (
    <group ref={ref} visible={false}>
      <mesh>
        <latheGeometry args={[TROPHY_PROFILE, 48]} />
        <meshStandardMaterial
          color="#fbbf24"
          metalness={1}
          roughness={0.22}
          envMapIntensity={1.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {[-0.88, 0.88].map((x) => (
        <mesh key={x} position={[x, 1.9, 0]}>
          <torusGeometry args={[0.34, 0.06, 16, 40]} />
          <meshStandardMaterial
            color="#fbbf24"
            metalness={1}
            roughness={0.25}
            envMapIntensity={1.3}
          />
        </mesh>
      ))}
    </group>
  );
}

function Scene({ progress }) {
  const { viewport } = useThree();

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 5]} intensity={2.2} />
      <pointLight position={[-4, -2, 3]} intensity={30} color="#fbbf24" />

      <Environment resolution={128}>
        <Lightformer form="rect" intensity={3} position={[0, 5, -6]} scale={[12, 4, 1]} />
        <Lightformer
          form="ring"
          intensity={4}
          color="#fbbf24"
          position={[-5, 1, -2]}
          rotation-y={Math.PI / 2}
          scale={4}
        />
        <Lightformer
          form="rect"
          intensity={2}
          color="#93c5fd"
          position={[6, 0, 2]}
          rotation-y={-Math.PI / 2}
          scale={[6, 6, 1]}
        />
      </Environment>

      <Sparkles
        count={viewport.width < 4 ? 30 : 70}
        scale={[viewport.width, viewport.height, 3]}
        size={3}
        speed={0.4}
        color="#fbbf24"
        opacity={0.7}
      />

      <CricketBall progress={progress} />
      <Trophy progress={progress} />
    </>
  );
}

// If WebGL is unavailable the page still works, just without the 3D layer.
class GLBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/* ============================================================
   UI HELPERS
============================================================ */

function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}

function SplitText({ text, start = 0 }) {
  return text.split("").map((ch, i) => (
    <span
      className="bcl-ch"
      key={`${ch}-${i}`}
      style={{ "--i": start + i }}
      aria-hidden="true"
    >
      {ch === " " ? "\u00A0" : ch}
    </span>
  ));
}

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`bcl-reveal ${className}`}
      style={{ "--d": `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Tilt({ children, max = 8 }) {
  const ref = useRef(null);

  const handleMove = (e) => {
    if (e.pointerType === "touch") return;
    const el = ref.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;

    el.style.setProperty("--rx", `${(0.5 - y) * max * 2}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * max * 2}deg`);
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div
      ref={ref}
      className="bcl-tilt"
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {children}
    </div>
  );
}

function Slot({ tag, name }) {
  return (
    <div className="bcl-slot">
      <span className="bcl-slot-tag">{tag}</span>
      <span className="bcl-slot-name">{name}</span>
      <i className="bcl-slot-flag" />
    </div>
  );
}

function MatchCard({ match, final = false }) {
  return (
    <Tilt>
      <article className={`bcl-card ${final ? "bcl-card-final" : ""}`}>
        <div className="bcl-card-glare" />

        <header className="bcl-card-head">
          <span className="bcl-live">
            <i className="bcl-dot" />
            UPCOMING
          </span>
          <span className="bcl-card-label">{match.label}</span>
        </header>

        <div className="bcl-card-time">
          <span>{match.date}</span>
          <strong>{match.time}</strong>
        </div>

        <div className="bcl-card-teams">
          <Slot {...match.teams[0]} />
          <div className="bcl-vs">
            <span>VS</span>
          </div>
          <Slot {...match.teams[1]} />
        </div>

        <footer className="bcl-card-venue">📍 {VENUE}</footer>
      </article>
    </Tilt>
  );
}

function GroupCard({ group }) {
  return (
    <Tilt>
      <article className="bcl-card">
        <div className="bcl-card-glare" />

        <header className="bcl-card-head">
          <span className="bcl-live">
            <i className="bcl-dot" />
            LEAGUE
          </span>
          <span className="bcl-card-label">{group.name}</span>
        </header>

        <div className="bcl-card-teams">
          {group.slots.map((slot) => (
            <div className="bcl-group-row" key={slot.name}>
              <Slot tag={slot.tag} name={slot.name} />
              <small>{slot.goes}</small>
            </div>
          ))}
        </div>

        <footer className="bcl-card-venue">Top 2 advance to the playoffs</footer>
      </article>
    </Tilt>
  );
}

/* ============================================================
   MAIN
============================================================ */

export default function CricketTournamentBracket() {
  const wrapRef = useRef(null);
  const stagesRef = useRef(null);
  const stageRefs = useRef([]);
  const progress = useRef(0);

  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const reduced = useReducedMotion();

  // Scroll progress: written to CSS variables and a ref (no re-renders).
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return undefined;

    let raf = 0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const r = wrap.getBoundingClientRect();

      const p = clamp(-r.top / Math.max(r.height - vh, 1), 0, 1);
      const hp = clamp(-r.top / vh, 0, 1);

      let sp = 0;
      if (stagesRef.current) {
        const sr = stagesRef.current.getBoundingClientRect();
        sp = clamp((vh * 0.55 - sr.top) / sr.height, 0, 1);
      }

      progress.current = p;
      wrap.style.setProperty("--p", p.toFixed(4));
      wrap.style.setProperty("--hp", hp.toFixed(4));
      wrap.style.setProperty("--sp", sp.toFixed(4));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Which stage is in the middle of the screen.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(Number(entry.target.dataset.index));
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );

    stageRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  // Only render the 3D canvas while the section is near the screen.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return undefined;

    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "150px" }
    );

    io.observe(wrap);
    return () => io.disconnect();
  }, []);

  const goToStage = (i) => {
    stageRefs.current[i]?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "center",
    });
  };

  return (
    <div className="bcl-road" ref={wrapRef}>
      {/* 3D layer */}
      {!reduced && (
        <GLBoundary>
          <div className="bcl-canvas-layer" aria-hidden="true">
            <div className="bcl-canvas-sticky">
              <Canvas
                dpr={[1, 1.75]}
                camera={{ position: [0, 0, 6], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
                frameloop={inView ? "always" : "never"}
              >
                <Scene progress={progress} />
              </Canvas>
            </div>
          </div>
        </GLBoundary>
      )}

      {/* Hero */}
      <header className="bcl-hero">
        <div className="bcl-hero-inner">
          <img
            className="bcl-hero-logo"
            src="/bcl-logo.png"
            alt="Baharagora Champions League official logo"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />

          <span className="bcl-season">
            BAHARAGORA CHAMPIONS LEAGUE · SEASON 5
          </span>

          <h2 className="bcl-hero-title" aria-label="The road to glory">
            <span className="bcl-line">
              <SplitText text="THE ROAD TO" />
            </span>
            <span className="bcl-line bcl-line-gold">
              <SplitText text="GLORY" start={11} />
            </span>
          </h2>

          <p className="bcl-hero-sub">Playoffs &amp; Championship</p>

          <div className="bcl-scroll-cue" aria-hidden="true">
            <span>SCROLL</span>
            <i />
          </div>
        </div>

        <div className="bcl-floor" aria-hidden="true" />
      </header>

      {/* Sticky stage progress */}
      <nav className="bcl-progress" aria-label="Tournament stages">
        <div className="bcl-progress-fill" />
        {STAGES.map((stage, i) => (
          <button
            key={stage.id}
            type="button"
            className={i === active ? "is-active" : ""}
            onClick={() => goToStage(i)}
          >
            <b>{stage.no}</b>
            <span>{stage.chip}</span>
          </button>
        ))}
      </nav>

      {/* Stages */}
      <div className="bcl-stages" ref={stagesRef}>
        <div className="bcl-spine" aria-hidden="true" />

        {STAGES.map((stage, i) => (
          <section
            key={stage.id}
            ref={(el) => {
              stageRefs.current[i] = el;
            }}
            data-index={i}
            className={`bcl-stage ${stage.final ? "bcl-stage-final" : ""}`}
          >
            <span className="bcl-ghost" aria-hidden="true">
              {stage.no}
            </span>

            <Reveal className="bcl-stage-head">
              <div className="bcl-node">
                <span>{stage.no}</span>
              </div>
              <span className="bcl-kicker">{stage.kicker}</span>
              <h3>{stage.title}</h3>
              <p>{stage.sub}</p>
            </Reveal>

            <div
              className={`bcl-cards ${
                (stage.type === "groups" ? stage.groups : stage.matches)
                  .length > 1
                  ? "bcl-cards-2"
                  : "bcl-cards-1"
              }`}
            >
              {stage.type === "groups"
                ? stage.groups.map((group, gi) => (
                    <Reveal key={group.name} delay={gi * 140}>
                      <GroupCard group={group} />
                    </Reveal>
                  ))
                : stage.matches.map((match, mi) => (
                    <Reveal key={match.label} delay={mi * 140}>
                      <MatchCard match={match} final={stage.final} />
                    </Reveal>
                  ))}
            </div>
          </section>
        ))}
      </div>

      {/* Trophy zone: the 3D trophy rises here */}
      <footer className="bcl-champion">
        <Reveal>
          <div className="bcl-champion-banner">
            <span>ONE TROPHY</span>
            <strong>ONE CHAMPION</strong>
            <span>THE GLORY OF BCL</span>
          </div>
        </Reveal>

        <p className="bcl-disclaimer">
          Qualifying positions and match outcomes will be updated as the
          official tournament progresses.
        </p>
      </footer>
    </div>
  );
}