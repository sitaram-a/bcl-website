// HOW TO ADD YOUR FILES
// 1. Copy photos into  public/media/photos/   and videos into  public/media/videos/
// 2. Name them exactly as below (or change the file names in this list).
// 3. Add / remove items freely — the page updates automatically.
//
// size (photos only): "" | "wide" | "tall" | "big"  → controls tile size in the grid

const photo = (n) => `/media/photos/${n}`;
const video = (n) => `/media/videos/${n}`;

export const mediaCategories = ["All", "Football", "Cricket", "Champions", "Fans", "Events"];

export const photos = [
  { id: 1, title: "BCL Football Trophy", category: "Champions", date: "Season 3", size: "tall", tone: 6, src: photo("BCL FOOTBALL TROPHY 🏆.jpg") },
  { id: 2, title: "Season 3 Champions", category: "Champions", date: "Season 3", size: "big", tone: 4, src: photo("THE CHAMPIONS OF BCL SEASON 3 🔥 TEAM - KHANDAMOUDA WARRIORS 🔥 OWNER - SHASANK SHEKHAR PAUL CAP 2.jpg") },
  { id: 3, title: "Season 3 Champions", category: "Champions", date: "Season 3", size: "", tone: 4, src: photo("THE CHAMPIONS OF BCL SEASON 3 🔥 TEAM - KHANDAMOUDA WARRIORS 🔥 OWNER - SHASANK SHEKHAR PAUL CAP.jpg") },
  { id: 4, title: "Season 2 Winner – Chakulia Supernova", category: "Champions", date: "Season 2", size: "wide", tone: 6, src: photo("CHAMPION TEAM BCL FOOTBALL 1  TEAM GURABANDA FIGHTERS 🔥❤️_🔥.jpg") },
  { id: 5, title: "Season 1 Winner", category: "Cricket", date: "Season 1", size: "", tone: 6, src: photo("WE LOVE ❤️ BCL ✨ 2.jpg") },
  { id: 6, title: "Champion Team – BCL Football", category: "Cricket", date: "Season 1", size: "", tone: 1, src: photo("WE LOVE ❤️ BCL ✨ 3.jpg") },
  { id: 7, title: "Runners Up – Qayamat FC", category: "Cricket", date: "Season 1", size: "tall", tone: 1, src: photo("WE LOVE ❤️ BCL ✨ 4.jpg") },
  { id: 8, title: "Runners Up – Qayamat FC", category: "Football", date: "Season 1", size: "tall", tone: 1, src: photo("RUNNERS UP BCL FOOTBALL -1 TEAM QAYAMAT FC JAGANNATHPUR ❤️_🔥🏆 2.jpg") },
  { id: 9, title: "Runners Up – Qayamat FC", category: "Football", date: "Season 1", size: "", tone: 1, src: photo("RUNNERS UP BCL FOOTBALL -1 TEAM QAYAMAT FC JAGANNATHPUR ❤️_🔥🏆.jpg") },
  { id: 10, title: "Football Match Day", category: "Football", date: "BCL", size: "wide", tone: 1, src: photo("football-2.webp") },
  { id: 11, title: "Football Match Day", category: "Football", date: "BCL", size: "", tone: 1, src: photo("football-3.webp") },
  { id: 12, title: "Baharagora Champions League", category: "Football", date: "BCL", size: "", tone: 0, src: photo("BCL Baharagora champion league  Champions team 🏆🎖️🏅 Team-Bineet warrior f.c ⚽🏆🎖️🏅🏆⚽.webp") },
  { id: 13, title: "Season 3 Grand Auction", category: "Events", date: "27 Sept", size: "tall", tone: 7, src: photo("Remember The Date 🔥Timing Evening 5pm.jpg") },
  { id: 14, title: "Our Happy BCL Family", category: "Fans", date: "BCL", size: "big", tone: 3, src: photo("OUR HAPPY BCL FAMILY 😄❣️THANKS FOR ALL THE EFFORTS ❤️✨ 2.jpg") },
  { id: 15, title: "Our Happy BCL Family", category: "Fans", date: "BCL", size: "wide", tone: 3, src: photo("OUR HAPPY BCL FAMILY 😄❣️THANKS FOR ALL THE EFFORTS ❤️✨.jpg") },
  { id: 16, title: "We Love BCL", category: "Cricket", date: "Season 3", size: "", tone: 2, src: photo("WE LOVE ❤️ BCL ✨ 4.jpg") },
  { id: 17, title: "We Love BCL", category: "Cricket", date: "Season 3", size: "", tone: 2, src: photo("WE LOVE ❤️ BCL ✨.jpg") },
  { id: 18, title: "We Love BCL", category: "Cricket", date: "Season 3", size: "", tone: 5, src: photo("WE LOVE ❤️ BCL ✨ 2.jpg") },
  { id: 19, title: "We Love BCL", category: "Cricket", date: "Season 3", size: "", tone: 5, src: photo("WE LOVE ❤️ BCL ✨ 3.jpg") },
  { id: 20, title: "Football Team", category: "Football", date: "Season 2", size: "big", tone: 2, src: photo("football_team.heic") },
  { id: 21, title: "We all Love BCL", category: "Football", date: "Season 2", size: "", tone: 5, src: photo("WE_ALL_LOVE_BCL.jpg") },
  { id: 22, title: "We all Love BCL", category: "Football", date: "Season 2", size: "", tone: 5, src: photo("WE_ALL_LOVE_BCL_2.jpg") },
  { id: 23, title: "We all Love BCL", category: "Football", date: "Season 2", size: "", tone: 5, src: photo("WE_ALL_LOVE_BCL_3.jpg") },
  { id: 24, title: "We all Love BCL", category: "Football", date: "Season 2", size: "", tone: 5, src: photo("WE_ALL_LOVE_BCL_4.jpg") },
  { id: 25, title: "BCL season2 point table day1", category: "Football", date: "Season 2", size: "", tone: 5, src: photo("BCL_season2_point_table_day1_day2.jpg") },
  { id: 26, title: "Glimpses Of the Day", category: "Football", date: "Season 3", size: "wide", tone: 5, src: photo("Glimpses_Of_Day_1_Football_Tournament.jpg") },
  { id: 27, title: "Glimpses Of the Day", category: "Football", date: "Season 3", size: "big", tone: 5, src: photo("Glimpses_Of_Day_1_Football_player.jpg") },
  { id: 28, title: "Glimpses Of the Day", category: "Football", date: "Season 3", size: "", tone: 5, src: photo("Glimpses_Of_Day_1_Football_player_1.jpg") },
  { id: 29, title: "Glimpses Of the Day", category: "Football", date: "Season 3", size: "", tone: 5, src: photo("Glimpses_Of_Day_hand_shake_guest.jpg") },
  { id: 30, title: "WELCOME OUR ALL OWNER AND ICONS", category: "Cricket", date: "Season 3", size: "big", tone: 5, src: photo("WELCOME_OUR_ALL_OWNER_AND_ICONS.jpg") },
  { id: 31, title: "Football season2 Day 2", category: "Football", date: "Season 3", size: "", tone: 5, src: photo("football_season2_DaY_1_And_Day_2.jpg") },
  { id: 32, title: "Football season2 Day 1", category: "Football", date: "Season 3", size: "", tone: 5, src: photo("football_season-2_DaY_1_And_Day_2.jpg") },
  { id: 33, title: "Bcl cricket team names", category: "Cricket", date: "Season 3", size: "", tone: 5, src: photo("bcl_cricket_team_names.jpg") },
  { id: 34, title: "OWNER AND ICON OF KHANDAMOUDA WARRIORS", category: "Cricket", date: "Season 3", size: "tall", tone: 5, src: photo("OWNER_AND_ICON_OF_KHANDAMOUDA_WARRIORS.jpg") },
  { id: 35, title: "Kerukocha Titans team members", category: "Cricket", date: "Season 3", size: "", tone: 5, src: photo("kerukocha_titans_team_members.jpg") },
  { id: 36, title: "Bankdha Lions team members", category: "Cricket", date: "Season 3", size: "", tone: 5, src: photo("bankdha_royals_team_members.jpg") },
  { id: 37, title: "Sakara Royals team members", category: "Cricket", date: "Season 3", size: "", tone: 5, src: photo("sakra_royals_team_members.jpg") },
  { id: 38, title: "Chakuliya Warriors Team members", category: "Cricket", date: "Season 3", size: "", tone: 5, src: photo("chakuliya_warriors_team_members.jpg") },
  { id: 39, title: "Jagannathpur Fighters team_members", category: "Cricket", date: "Season 3", size: "", tone: 5, src: photo("jagannathpur_team_members.jpg") },
  { id: 40, title: "Baharagora Kings team members", category: "Cricket", date: "Season 3", size: "", tone: 5, src: photo("baharagora_kings_team_members.jpg") },
  { id: 41, title: "Kesarda Super Kings team_members", category: "Cricket", date: "Season 3", size: "", tone: 5, src: photo("kesarda_team_members.jpg") },
  { id: 42, title: "Khandamouda Worriors team_members", category: "Cricket", date: "Season 3", size: "", tone: 5, src: photo("khandamouda_team_members.jpg") },
  { id: 43, title: "BCL Football Match Rafree", category: "Cricket", date: "Season 3", size: "wide", tone: 5, src: photo("bcl_football_match_rafree.jpg") },
];

// `thumb` is optional: a poster image for the video card. If omitted, the first frame of the video is used.
export const videos = [
  { id: 1, title: "Baharagora Champions League  – Season 5", category: "Cricket", duration: "", views: "", tone: 4, src: video("BCL-season-5-1.mp4"), thumb: video("BCL-season-5.png") },
  { id: 2, title: "Nikhil On Fire", category: "Champions", duration: "", views: "", tone: 4, src: video("KPL BATTING ❤️.mp4"), thumb: video("nikhil-on-fire.png") },
  { id: 3, title: "The Dancing Umpire in BCL 3", category: "Cricket", duration: "", views: "", tone: 2, src: video("anchor_pallab_2.mp4"), thumb: video("anchor_pallab.png") },
  { id: 4, title: "The Dancing Umpire in BCL 3", category: "Fans", duration: "", views: "", tone: 3, src: video("SEASON 3 🔥.mp4"), thumb: video("tennis.png") },
  { id: 5, title: "THE CHAMPIONS OF BCL SEASON 3", category: "Champions", duration: "", views: "", tone: 0, src: video("THE CHAMPIONS OF BCL SEASON 3 🔥 TEAM - KHANDAMOUDA WARRIORS 🔥 OWNER - SHASANK SHEKHAR PAUL CAP 2.mp4"), thumb: video("THE_CHAMPIONS.jpg") },
  { id: 6, title: "Anchor Pallab 2.0", category: "Events", duration: "", views: "", tone: 7, src: video("THE CHAMPIONS OF BCL SEASON 3 🔥 TEAM - KHANDAMOUDA WARRIORS 🔥 OWNER - SHASANK SHEKHAR PAUL CAP.mp4"), thumb: video("champions2.png") },
  { id: 7, title: "Update for Advertisement", category: "Events", duration: "", views: "", tone: 6, src: video("Update For Advertisement 👍.mp4"), thumb: video("piklu.png") },
  { id: 8, title: "THE DANCING UMPIRE IN BCL 3 .🥳", category: "Cricket", duration: "", views: "", tone: 6, src: video("THE DANCING UMPIRE IN BCL 3 .🥳.mp4"), thumb: video("advetise.png") },
  { id: 9, title: "Arun Patra Batting", category: "Cricket", duration: "", views: "", tone: 4, src: video("Arunpatra_batting.mp4"), thumb: video("Arunpatra_batting.png") },
  { id: 10, title: "5 Ball 5 six Liyakat Ali", category: "Cricket", duration: "", views: "", tone: 4, src: video("5_ball_5_six_liyakat__ali.mp4"), thumb: video("5_ball_5_six_liyakat__ali.png") },
  { id: 11, title: "Symonskumar Bowling", category: "Cricket", duration: "", views: "", tone: 4, src: video("symonskumar_bowling.mp4"), thumb: video("symonskumar_bowling.png") },
  { id: 12, title: "81 runs 23 Balls Anu", category: "Cricket", duration: "", views: "", tone: 4, src: video("ANU_81_runs_23_balls.mp4"), thumb: video("ANU_81_runs_23_balls.png") },
  { id: 13, title: "DEV MAHATO BCL", category: "Cricket", duration: "", views: "", tone: 4, src: video("DEV_MAHATO_BCL.mp4"), thumb: video("DEV_MAHATO_BCL.png") },
  { id: 14, title: "BCL Football Final Moment", category: "Football", duration: "", views: "", tone: 4, src: video("BCL_football_Final_Moment.mp4"), thumb: video("football_match.png") },
  { id: 15, title: "BCL_football_promotion", category: "Football", duration: "", views: "", tone: 4, src: video("BCL_football_promotion.mp4"), thumb: video("advetise2.png") },
  { id: 16, title: "BCL_football_promotion", category: "Football", duration: "", views: "", tone: 4, src: video("BCL_football_promotion_2.mp4"), thumb: video("piklu2.png") },
  { id: 17, title: "BCL_football_promotion", category: "Football", duration: "", views: "", tone: 4, src: video("BCL_season4_UPDATE.mp4"), thumb: video("piklu3.png") },
  { id: 18, title: "Brilliant Catch of the Tournament season3 Shivham_kumar", category: "Cricket", duration: "", views: "", tone: 4, src: video("Brilliant_Catch_of_the_Tournament_season3_Shivham_kumar.mp4"), thumb: video("Brilliant_Catch_of_the_Tournament_season3_Shivham_kumar.png") },
  { id: 19, title: "BUNTY DAS Kerukocha Titans", category: "Cricket", duration: "", views: "", tone: 4, src: video("BUNTY_DAS_Kerukocha_Titans.mp4"), thumb: video("BUNTY_DAS_Kerukocha_Titans.png") },
];

export const mediaStats = [
  { label: "Photos", value: `${photos.length}` },
  { label: "Videos", value: `${videos.length}` },
  { label: "Seasons", value: "3" },
  { label: "Champions", value: "3" },
];