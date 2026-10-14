
import { supabase } from "../lib/supabase";

// Get all cricket teams
export async function getCricketTeams() {
  const { data, error } = await supabase
    .from("cricket_teams")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching cricket teams:", error.message);
    throw error;
  }

  return data || [];
}

// Get all cricket players
export async function getCricketPlayers() {
  const { data, error } = await supabase
    .from("cricket_players")
    .select("*")
    .order("team_id", { ascending: true })
    .order("jersey_number", { ascending: true });

  if (error) {
    console.error("Error fetching cricket players:", error.message);
    throw error;
  }

  return data || [];
}

// Get players for a specific team
export async function getPlayersByTeam(teamId) {
  const { data, error } = await supabase
    .from("cricket_players")
    .select("*")
    .eq("team_id", teamId)
    .order("jersey_number", { ascending: true });

  if (error) {
    console.error("Error fetching team players:", error.message);
    throw error;
  }

  return data || [];
}



export async function getCricketFixtures() {
  const { data, error } = await supabase
    .from("cricket_matches")
    .select(`
      id,
      match_day,
      stage,
      group_name,
      team1_id,
      team2_id,
      team1_placeholder,
      team2_placeholder,
      match_date,
      match_time,
      venue,
      status
    `)
    .order("match_date", { ascending: true })
    .order("match_time", { ascending: true });

  if (error) {
    console.error("Error fetching cricket fixtures:", error.message);
    throw error;
  }

  return data || [];
}
