// Players & teams registered for BCL Football.
//
// New sign-ups submitted on the Registration page are saved automatically
// in that visitor's own browser (this is a static site, so there is no
// shared server database). From the "Registration submitted" screen you
// can click "Download data file" to export everything registered on your
// own device as an updated copy of this exact file — replace this file
// with that download to permanently commit new sign-ups to the site.
//
// Shape of each entry:
// { id, sport: "football", type: "player" | "team", name, age, position,
//   teamName, captain, players, phone, email, address, hasPhoto, submittedAt }

export const registrations = [];
