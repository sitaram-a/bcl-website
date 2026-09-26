import { registrations as footballSeed } from "./football/registrations";
import { registrations as cricketSeed } from "./cricket/registrations";

// localStorage is per-browser: this records what THIS device has submitted.
// It does not collect entries from other visitors' devices — for that you
// need a real backend (see the TODO in Registration.jsx).
const STORAGE_KEY = {
  football: "bcl_registrations_football",
  cricket: "bcl_registrations_cricket",
};
const SEED = { football: footballSeed, cricket: cricketSeed };

function readLocal(sport) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY[sport]);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocal(sport, list) {
  try {
    localStorage.setItem(STORAGE_KEY[sport], JSON.stringify(list));
  } catch {
    // storage unavailable (private browsing / quota) — registration still succeeded
  }
}

// All registrations known on this device: the committed seed file plus
// anything saved locally since then.
export function getAllRegistrations(sport) {
  return [...(SEED[sport] || []), ...readLocal(sport)];
}

// Saves a new registration into this device's local copy.
export function addRegistration(sport, record) {
  const list = readLocal(sport);
  list.push(record);
  writeLocal(sport, list);
  return record;
}