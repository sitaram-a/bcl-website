export const cricketLiveMatches = [
  {
    id: 201,

    team1Id: 1,
    team2Id: 4,

    date: "2026-09-25",
    time: "15:00",

    venue: "Baharagora Cricket Ground",

    status: "LIVE",

    matchType: "LEAGUE",

    innings: [
      {
        teamId: 1,
        runs: 142,
        wickets: 4,
        overs: "17.2",
      },
      {
        teamId: 4,
        runs: 0,
        wickets: 0,
        overs: "0.0",
      },
    ],

    currentInnings: 1,

    target: null,

    lastOver: [
      "1",
      "4",
      "0",
      "W",
      "2",
      "1",
    ],

    recentEvents: [
  {
    id: 1,
    over: "17.2",
    text: "Four runs",
    type: "FOUR",
    player: "Player One",
    description: "Beautiful shot through the covers.",
  },
  {
    id: 2,
    over: "17.1",
    text: "1 run",
    type: "RUN",
    player: "Player Four",
    description: "Quick single taken.",
  },
  {
    id: 3,
    over: "16.6",
    text: "Wicket",
    type: "WICKET",
    player: "Player Three",
    description: "Batter dismissed after a top edge.",
  },
  {
    id: 4,
    over: "16.5",
    text: "0 runs",
    type: "DOT",
    player: "Player Four",
    description: "Good delivery, no run.",
  },
  {
    id: 5,
    over: "16.4",
    text: "2 runs",
    type: "RUN",
    player: "Player One",
    description: "Two runs completed.",
  },
  {
    id: 6,
    over: "16.3",
    text: "1 run",
    type: "RUN",
    player: "Player One",
    description: "Single taken.",
  },
],

    batting: [
      {
        player: "Player One",
        runs: 68,
        balls: 42,
        fours: 7,
        sixes: 2,
        strikeRate: "161.90",
        status: "NOT OUT",
      },
      {
        player: "Player Four",
        runs: 34,
        balls: 28,
        fours: 4,
        sixes: 1,
        strikeRate: "121.43",
        status: "NOT OUT",
      },
    ],

    bowling: [
      {
        player: "Player Two",
        overs: "3.2",
        maidens: 0,
        runs: 24,
        wickets: 1,
        economy: "7.20",
      },
    ],

        partnership: {
      runs: 102,
      balls: 70,
      runRate: "8.74",
    },

    keyStats: {
      highestScorer: {
        player: "Player One",
        runs: 68,
        balls: 42,
      },

      bestBowler: {
        player: "Player Two",
        wickets: 1,
        runs: 24,
        overs: "3.2",
      },
    },


  },
];