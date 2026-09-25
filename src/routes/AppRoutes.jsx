import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import FootballHome from "../pages/football/FootballHome";
import FootballFixtures from "../pages/football/FootballFixtures";
import FootballResults from "../pages/football/FootballResults";
import FootballStandings from "../pages/football/FootballStandings";
import FootballTeams from "../pages/football/FootballTeams";
import FootballTeamDetails from "../pages/football/FootballTeamDetails";
import FootballPlayers from "../pages/football/FootballPlayers";
import FootballLiveScore from "../pages/football/FootballLiveScore";
import FootballMatchDetails from "../pages/football/FootballMatchDetails";
import CricketHome from "../pages/cricket/CricketHome";
import CricketFixtures from "../pages/cricket/CricketFixtures";
import CricketResults from "../pages/cricket/CricketResults";
import CricketStandings from "../pages/cricket/CricketStandings";
import CricketTeams from "../pages/cricket/CricketTeams";
import CricketTeamDetails from "../pages/cricket/CricketTeamDetails";
import CricketPlayers from "../pages/cricket/CricketPlayers";
import CricketLiveScore from "../pages/cricket/CricketLiveScore";
import CricketMatchDetails from "../pages/cricket/CricketMatchDetails";

import Media from "../pages/Media";
import Registration from "../pages/Registration";



function Fixtures() {
  return <h1>Fixtures</h1>;
}

function Results() {
  return <h1>Results</h1>;
}

function Teams() {
  return <h1>Teams</h1>;
}


function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/football" element={<FootballHome />} />
      <Route path="/fixtures" element={<FootballFixtures />} />
      <Route path="/results" element={<FootballResults />} />
      <Route path="/football/standings" element={<FootballStandings />} />

      <Route path="/cricket" element={<CricketHome />} />
      <Route path="/cricket/fixtures" element={<CricketFixtures />} />
      <Route path="/cricket/results" element={<CricketResults />} />
      <Route path="/cricket/standings" element={<CricketStandings />} />
      <Route path="/cricket/teams" element={<CricketTeams />} />
      <Route  path="/cricket/teams/:teamId"  element={<CricketTeamDetails />} />
      <Route  path="/cricket/players"  element={<CricketPlayers />} />
      <Route  path="/cricket/live-score"  element={<CricketLiveScore />} />
      <Route  path="/cricket/matches/:matchId"  element={<CricketMatchDetails />} />

      <Route path="/results" element={<Results />} />

      <Route
  path="/football/teams/:teamId"
  element={<FootballTeamDetails />}
/>
      <Route path="/teams" element={<FootballTeams />} />

      
      <Route path="/players" element={<FootballPlayers />} />

      <Route
  path="/football/live-score"
  element={<FootballLiveScore />}
/>

<Route
  path="/football/match/:matchId"
  element={<FootballMatchDetails />}
/>
      <Route path="/media" element={<Media />} />

      <Route path="/registration" element={<Registration />} />

    </Routes>
  );
}

export default AppRoutes;