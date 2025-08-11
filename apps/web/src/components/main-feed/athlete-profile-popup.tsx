"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface PerformanceData {
  date: string;
  value: number;
}

interface MatchInfo {
  opponent: string;
  date: string;
  result: "W" | "L" | "T";
  score: string;
  performance: string;
}

interface AthleteData {
  fullName: string;
  team: string;
  position: string;
  number: string;
  avatar: string;
  nextMatch: {
    opponent: string;
    date: string;
    time: string;
    venue: string;
  };
  stats: {
    ppg: string;
    rpg: string;
    apg: string;
    fgp: string;
  };
  advancedStats: {
    per: string;
    ts: string;
    usg: string;
    bpm: string;
    vorp: string;
    ws: string;
  };
  splits: {
    home: { ppg: string; fgp: string; record: string };
    away: { ppg: string; fgp: string; record: string };
    clutch: { ppg: string; fgp: string; record: string };
  };
  performanceData: PerformanceData[];
  recentMatches: MatchInfo[];
  trends: {
    last5Games: string;
    last10Games: string;
    monthlyTrend: string;
    efficiency: string;
  };
}

interface AthleteProfilePopupProps {
  athleteId: string;
  isOpen: boolean;
  onClose: () => void;
}

// Mock data for different athletes
const athleteDatabase: { [key: string]: AthleteData } = {
  "lebron-james": {
    fullName: "LeBron James",
    team: "Los Angeles Lakers",
    position: "Small Forward",
    number: "#23",
    avatar: "LJ",
    nextMatch: {
      opponent: "vs Golden State Warriors",
      date: "Dec 16, 2024",
      time: "7:30 PM PST",
      venue: "Crypto.com Arena",
    },
    stats: {
      ppg: "28.5",
      rpg: "8.2",
      apg: "9.8",
      fgp: "52.1%",
    },
    advancedStats: {
      per: "28.4",
      ts: "61.2%",
      usg: "31.8%",
      bpm: "+8.7",
      vorp: "4.2",
      ws: "8.1",
    },
    splits: {
      home: { ppg: "30.1", fgp: "54.3%", record: "12-3" },
      away: { ppg: "26.9", fgp: "49.8%", record: "8-7" },
      clutch: { ppg: "31.2", fgp: "48.1%", record: "7-2" },
    },
    trends: {
      last5Games: "+12.4 avg",
      last10Games: "+8.7 avg",
      monthlyTrend: "↗ +5.2%",
      efficiency: "Elite (96th %)",
    },
    performanceData: [
      { date: "Dec 1", value: 25 },
      { date: "Dec 3", value: 32 },
      { date: "Dec 5", value: 28 },
      { date: "Dec 7", value: 35 },
      { date: "Dec 9", value: 30 },
      { date: "Dec 11", value: 38 },
      { date: "Dec 13", value: 41 },
    ],
    recentMatches: [
      {
        opponent: "vs Phoenix Suns",
        date: "Dec 13",
        result: "W",
        score: "125-118",
        performance: "41 PTS, 9 REB, 11 AST",
      },
      {
        opponent: "@ Sacramento Kings",
        date: "Dec 11",
        result: "L",
        score: "115-120",
        performance: "38 PTS, 7 REB, 8 AST",
      },
      {
        opponent: "vs Denver Nuggets",
        date: "Dec 9",
        result: "W",
        score: "132-127",
        performance: "30 PTS, 10 REB, 12 AST",
      },
    ],
  },
  "steph-curry": {
    fullName: "Stephen Curry",
    team: "Golden State Warriors",
    position: "Point Guard",
    number: "#30",
    avatar: "SC",
    nextMatch: {
      opponent: "@ Los Angeles Lakers",
      date: "Dec 16, 2024",
      time: "7:30 PM PST",
      venue: "Crypto.com Arena",
    },
    stats: {
      ppg: "27.8",
      rpg: "5.1",
      apg: "6.3",
      fgp: "45.2%",
    },
    advancedStats: {
      per: "26.1",
      ts: "65.8%",
      usg: "32.4%",
      bpm: "+7.2",
      vorp: "3.8",
      ws: "7.3",
    },
    splits: {
      home: { ppg: "29.4", fgp: "47.1%", record: "11-4" },
      away: { ppg: "26.2", fgp: "43.3%", record: "9-6" },
      clutch: { ppg: "28.7", fgp: "41.2%", record: "6-3" },
    },
    trends: {
      last5Games: "+8.2 avg",
      last10Games: "+6.1 avg",
      monthlyTrend: "↗ +3.8%",
      efficiency: "Elite (94th %)",
    },
    performanceData: [
      { date: "Dec 1", value: 24 },
      { date: "Dec 3", value: 29 },
      { date: "Dec 5", value: 31 },
      { date: "Dec 7", value: 26 },
      { date: "Dec 9", value: 33 },
      { date: "Dec 11", value: 28 },
      { date: "Dec 13", value: 36 },
    ],
    recentMatches: [
      {
        opponent: "vs Portland Trail Blazers",
        date: "Dec 13",
        result: "W",
        score: "134-124",
        performance: "36 PTS, 6 REB, 8 AST",
      },
      {
        opponent: "@ Minnesota Timberwolves",
        date: "Dec 11",
        result: "W",
        score: "116-108",
        performance: "28 PTS, 4 REB, 7 AST",
      },
      {
        opponent: "vs Memphis Grizzlies",
        date: "Dec 9",
        result: "L",
        score: "121-125",
        performance: "33 PTS, 5 REB, 9 AST",
      },
    ],
  },
  "giannis-antetokounmpo": {
    fullName: "Giannis Antetokounmpo",
    team: "Milwaukee Bucks",
    position: "Power Forward",
    number: "#34",
    avatar: "GA",
    nextMatch: {
      opponent: "vs Boston Celtics",
      date: "Dec 15, 2024",
      time: "8:00 PM EST",
      venue: "TD Garden",
    },
    stats: {
      ppg: "31.2",
      rpg: "11.8",
      apg: "6.1",
      fgp: "58.3%",
    },
    advancedStats: {
      per: "32.1",
      ts: "63.4%",
      usg: "35.2%",
      bpm: "+9.1",
      vorp: "4.8",
      ws: "9.2",
    },
    splits: {
      home: { ppg: "33.1", fgp: "61.2%", record: "13-2" },
      away: { ppg: "29.3", fgp: "55.4%", record: "7-8" },
      clutch: { ppg: "34.7", fgp: "52.8%", record: "8-1" },
    },
    trends: {
      last5Games: "+15.2 avg",
      last10Games: "+11.8 avg",
      monthlyTrend: "↗ +7.4%",
      efficiency: "Elite (98th %)",
    },
    performanceData: [
      { date: "Dec 1", value: 28 },
      { date: "Dec 3", value: 31 },
      { date: "Dec 5", value: 35 },
      { date: "Dec 7", value: 29 },
      { date: "Dec 9", value: 38 },
      { date: "Dec 11", value: 42 },
      { date: "Dec 13", value: 33 },
    ],
    recentMatches: [
      {
        opponent: "vs Miami Heat",
        date: "Dec 13",
        result: "W",
        score: "115-102",
        performance: "33 PTS, 12 REB, 8 AST",
      },
      {
        opponent: "@ Detroit Pistons",
        date: "Dec 11",
        result: "W",
        score: "128-107",
        performance: "42 PTS, 15 REB, 6 AST",
      },
      {
        opponent: "vs Chicago Bulls",
        date: "Dec 9",
        result: "L",
        score: "108-112",
        performance: "38 PTS, 9 REB, 7 AST",
      },
    ],
  },
  "josh-allen": {
    fullName: "Josh Allen",
    team: "Buffalo Bills",
    position: "Quarterback",
    number: "#17",
    avatar: "JA",
    nextMatch: {
      opponent: "vs Kansas City Chiefs",
      date: "Dec 17, 2024",
      time: "1:00 PM EST",
      venue: "Highmark Stadium",
    },
    stats: {
      ppg: "285.5",
      rpg: "45.5",
      apg: "2.5",
      fgp: "62.8%",
    },
    advancedStats: {
      per: "24.7",
      ts: "68.2%",
      usg: "28.4%",
      bpm: "+6.8",
      vorp: "3.2",
      ws: "6.7",
    },
    splits: {
      home: { ppg: "298.2", fgp: "65.1%", record: "9-2" },
      away: { ppg: "272.8", fgp: "60.5%", record: "6-5" },
      clutch: { ppg: "311.4", fgp: "58.9%", record: "7-1" },
    },
    trends: {
      last5Games: "+22.4 avg",
      last10Games: "+18.7 avg",
      monthlyTrend: "↗ +4.2%",
      efficiency: "Elite (92nd %)",
    },
    performanceData: [
      { date: "Dec 1", value: 290 },
      { date: "Dec 3", value: 310 },
      { date: "Dec 5", value: 275 },
      { date: "Dec 7", value: 320 },
      { date: "Dec 9", value: 295 },
      { date: "Dec 11", value: 305 },
      { date: "Dec 13", value: 285 },
    ],
    recentMatches: [
      {
        opponent: "vs Miami Dolphins",
        date: "Dec 13",
        result: "W",
        score: "31-17",
        performance: "285 YDS, 3 TD, 1 INT",
      },
      {
        opponent: "@ New York Jets",
        date: "Dec 11",
        result: "W",
        score: "28-14",
        performance: "305 YDS, 2 TD, 0 INT",
      },
      {
        opponent: "vs New England Patriots",
        date: "Dec 9",
        result: "L",
        score: "21-24",
        performance: "295 YDS, 2 TD, 2 INT",
      },
    ],
  },
  "patrick-mahomes": {
    fullName: "Patrick Mahomes",
    team: "Kansas City Chiefs",
    position: "Quarterback",
    number: "#15",
    avatar: "PM",
    nextMatch: {
      opponent: "@ Buffalo Bills",
      date: "Dec 17, 2024",
      time: "1:00 PM EST",
      venue: "Highmark Stadium",
    },
    stats: {
      ppg: "295.5",
      rpg: "25.0",
      apg: "2.8",
      fgp: "68.2%",
    },
    advancedStats: {
      per: "26.8",
      ts: "71.4%",
      usg: "30.1%",
      bpm: "+7.9",
      vorp: "4.1",
      ws: "8.3",
    },
    splits: {
      home: { ppg: "312.4", fgp: "71.2%", record: "11-1" },
      away: { ppg: "278.6", fgp: "65.3%", record: "7-4" },
      clutch: { ppg: "324.8", fgp: "67.9%", record: "9-0" },
    },
    trends: {
      last5Games: "+28.7 avg",
      last10Games: "+24.2 avg",
      monthlyTrend: "↗ +6.1%",
      efficiency: "Elite (97th %)",
    },
    performanceData: [
      { date: "Dec 1", value: 310 },
      { date: "Dec 3", value: 325 },
      { date: "Dec 5", value: 280 },
      { date: "Dec 7", value: 340 },
      { date: "Dec 9", value: 300 },
      { date: "Dec 11", value: 315 },
      { date: "Dec 13", value: 298 },
    ],
    recentMatches: [
      {
        opponent: "vs Denver Broncos",
        date: "Dec 13",
        result: "W",
        score: "35-21",
        performance: "298 YDS, 4 TD, 0 INT",
      },
      {
        opponent: "@ Las Vegas Raiders",
        date: "Dec 11",
        result: "W",
        score: "42-14",
        performance: "315 YDS, 3 TD, 1 INT",
      },
      {
        opponent: "vs Los Angeles Chargers",
        date: "Dec 9",
        result: "W",
        score: "28-17",
        performance: "300 YDS, 2 TD, 0 INT",
      },
    ],
  },
  "travis-kelce": {
    fullName: "Travis Kelce",
    team: "Kansas City Chiefs",
    position: "Tight End",
    number: "#87",
    avatar: "TK",
    nextMatch: {
      opponent: "@ Buffalo Bills",
      date: "Dec 17, 2024",
      time: "1:00 PM EST",
      venue: "Highmark Stadium",
    },
    stats: {
      ppg: "85.5",
      rpg: "6.5",
      apg: "0.5",
      fgp: "65.4%",
    },
    advancedStats: {
      per: "22.4",
      ts: "58.7%",
      usg: "24.8%",
      bpm: "+5.2",
      vorp: "2.8",
      ws: "5.1",
    },
    splits: {
      home: { ppg: "92.1", fgp: "68.9%", record: "11-1" },
      away: { ppg: "78.9", fgp: "61.9%", record: "7-4" },
      clutch: { ppg: "96.3", fgp: "63.4%", record: "9-0" },
    },
    trends: {
      last5Games: "+12.8 avg",
      last10Games: "+9.4 avg",
      monthlyTrend: "↗ +3.7%",
      efficiency: "Good (78th %)",
    },
    performanceData: [
      { date: "Dec 1", value: 92 },
      { date: "Dec 3", value: 78 },
      { date: "Dec 5", value: 105 },
      { date: "Dec 7", value: 88 },
      { date: "Dec 9", value: 94 },
      { date: "Dec 11", value: 112 },
      { date: "Dec 13", value: 85 },
    ],
    recentMatches: [
      {
        opponent: "vs Denver Broncos",
        date: "Dec 13",
        result: "W",
        score: "35-21",
        performance: "85 YDS, 7 REC, 1 TD",
      },
      {
        opponent: "@ Las Vegas Raiders",
        date: "Dec 11",
        result: "W",
        score: "42-14",
        performance: "112 YDS, 8 REC, 2 TD",
      },
      {
        opponent: "vs Los Angeles Chargers",
        date: "Dec 9",
        result: "W",
        score: "28-17",
        performance: "94 YDS, 6 REC, 0 TD",
      },
    ],
  },
  messi: {
    fullName: "Lionel Messi",
    team: "Inter Miami CF",
    position: "Forward",
    number: "#10",
    avatar: "LM",
    nextMatch: {
      opponent: "vs New York City FC",
      date: "Dec 16, 2024",
      time: "7:30 PM EST",
      venue: "DRV PNK Stadium",
    },
    stats: {
      ppg: "0.8",
      rpg: "0.6",
      apg: "2.8",
      fgp: "78.5%",
    },
    advancedStats: {
      per: "18.9",
      ts: "82.1%",
      usg: "32.7%",
      bpm: "+4.8",
      vorp: "2.1",
      ws: "4.2",
    },
    splits: {
      home: { ppg: "1.1", fgp: "81.2%", record: "8-2-2" },
      away: { ppg: "0.5", fgp: "75.8%", record: "4-4-4" },
      clutch: { ppg: "1.3", fgp: "79.4%", record: "5-1-1" },
    },
    trends: {
      last5Games: "+0.6 avg",
      last10Games: "+0.4 avg",
      monthlyTrend: "→ +0.2%",
      efficiency: "Elite (89th %)",
    },
    performanceData: [
      { date: "Dec 1", value: 1 },
      { date: "Dec 3", value: 2 },
      { date: "Dec 5", value: 0 },
      { date: "Dec 7", value: 1 },
      { date: "Dec 9", value: 2 },
      { date: "Dec 11", value: 1 },
      { date: "Dec 13", value: 1 },
    ],
    recentMatches: [
      {
        opponent: "vs Atlanta United",
        date: "Dec 13",
        result: "W",
        score: "2-1",
        performance: "1 Goal, 1 Assist",
      },
      {
        opponent: "@ Orlando City",
        date: "Dec 11",
        result: "T",
        score: "1-1",
        performance: "1 Goal, 0 Assist",
      },
      {
        opponent: "vs Charlotte FC",
        date: "Dec 9",
        result: "W",
        score: "3-0",
        performance: "2 Goals, 1 Assist",
      },
    ],
  },
};

export default function AthleteProfilePopup({
  athleteId,
  isOpen,
  onClose,
}: AthleteProfilePopupProps) {
  const [athlete, setAthlete] = useState<AthleteData | null>(null);
  const [mounted, setMounted] = useState(false);

  // Fix hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && athleteId) {
      const athleteData = athleteDatabase[athleteId];
      if (athleteData) {
        setAthlete(athleteData);
      }
    }
  }, [athleteId, isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Don't render on server side to prevent hydration mismatch
  if (!mounted) return null;

  if (!isOpen || !athlete) return null;

  const maxValue = Math.max(...athlete.performanceData.map((d) => d.value));

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4"
      suppressHydrationWarning={true}
    >
      {/* Modal Container */}
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-700/50 shadow-2xl w-full max-w-md sm:max-w-2xl lg:max-w-3xl max-h-[95vh] sm:max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
              <div className="relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl overflow-hidden">
                  <img
                    src={`/players/${athlete.fullName.toLowerCase().replace(/\s+/g, "-")}.png`}
                    alt={athlete.fullName}
                    className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(athlete.fullName)}&background=0D8ABC&color=fff&size=128`;
                    }}
                  />
                </div>
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 sm:border-3 border-slate-800 bg-emerald-400"></div>
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white mb-1">
                  {athlete.fullName}
                </h2>
                <p className="text-slate-400 text-sm sm:text-base lg:text-lg font-medium">
                  {athlete.team} • {athlete.position} • {athlete.number}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl sm:rounded-2xl bg-slate-700/50 border border-slate-600/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-600/50 transition-all duration-300"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content - No visible scrollbar */}
        <div className="overflow-y-auto max-h-[calc(95vh-100px)] sm:max-h-[calc(85vh-140px)] scrollbar-hide">
          <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-slate-700/50 text-center hover:border-slate-600/70 transition-all duration-300">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                  {athlete.stats.ppg}
                </div>
                <div className="text-slate-400 text-xs sm:text-sm font-medium mt-1 sm:mt-2">
                  PTS
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-slate-700/50 text-center hover:border-slate-600/70 transition-all duration-300">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                  {athlete.stats.rpg}
                </div>
                <div className="text-slate-400 text-xs sm:text-sm font-medium mt-1 sm:mt-2">
                  REB
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-slate-700/50 text-center hover:border-slate-600/70 transition-all duration-300">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                  {athlete.stats.apg}
                </div>
                <div className="text-slate-400 text-xs sm:text-sm font-medium mt-1 sm:mt-2">
                  AST
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-slate-700/50 text-center hover:border-slate-600/70 transition-all duration-300">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                  {athlete.stats.fgp}
                </div>
                <div className="text-slate-400 text-xs sm:text-sm font-medium mt-1 sm:mt-2">
                  FG%
                </div>
              </div>
            </div>

            {/* Advanced Analytics Section */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-700/50 p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
                Advanced Analytics
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-white">
                    {athlete.advancedStats.per}
                  </div>
                  <div className="text-slate-400 text-xs font-medium">PER</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-white">
                    {athlete.advancedStats.ts}
                  </div>
                  <div className="text-slate-400 text-xs font-medium">TS%</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-white">
                    {athlete.advancedStats.usg}
                  </div>
                  <div className="text-slate-400 text-xs font-medium">USG%</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-emerald-400">
                    {athlete.advancedStats.bpm}
                  </div>
                  <div className="text-slate-400 text-xs font-medium">BPM</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-white">
                    {athlete.advancedStats.vorp}
                  </div>
                  <div className="text-slate-400 text-xs font-medium">VORP</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-white">
                    {athlete.advancedStats.ws}
                  </div>
                  <div className="text-slate-400 text-xs font-medium">WS</div>
                </div>
              </div>
            </div>

            {/* Performance Trends */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-700/50 p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
                Performance Trends
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-xl p-3 sm:p-4">
                  <div className="text-slate-400 text-xs font-medium mb-1">
                    Last 5 Games
                  </div>
                  <div className="text-white font-bold">
                    {athlete.trends.last5Games}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-xl p-3 sm:p-4">
                  <div className="text-slate-400 text-xs font-medium mb-1">
                    Last 10 Games
                  </div>
                  <div className="text-white font-bold">
                    {athlete.trends.last10Games}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-xl p-3 sm:p-4">
                  <div className="text-slate-400 text-xs font-medium mb-1">
                    Monthly Trend
                  </div>
                  <div className="text-emerald-400 font-bold">
                    {athlete.trends.monthlyTrend}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-xl p-3 sm:p-4">
                  <div className="text-slate-400 text-xs font-medium mb-1">
                    Efficiency
                  </div>
                  <div className="text-[#FFAB91] font-bold">
                    {athlete.trends.efficiency}
                  </div>
                </div>
              </div>
            </div>

            {/* Home/Away/Clutch Splits */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-700/50 p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
                Situational Splits
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    <div className="text-slate-400 text-sm font-medium">
                      Home
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-300 text-sm">PPG</span>
                      <span className="text-white font-bold">
                        {athlete.splits.home.ppg}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300 text-sm">FG%</span>
                      <span className="text-white font-bold">
                        {athlete.splits.home.fgp}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300 text-sm">Record</span>
                      <span className="text-emerald-400 font-bold">
                        {athlete.splits.home.record}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                    <div className="text-slate-400 text-sm font-medium">
                      Away
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-300 text-sm">PPG</span>
                      <span className="text-white font-bold">
                        {athlete.splits.away.ppg}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300 text-sm">FG%</span>
                      <span className="text-white font-bold">
                        {athlete.splits.away.fgp}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300 text-sm">Record</span>
                      <span className="text-amber-400 font-bold">
                        {athlete.splits.away.record}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <div className="text-slate-400 text-sm font-medium">
                      Clutch Time
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-300 text-sm">PPG</span>
                      <span className="text-white font-bold">
                        {athlete.splits.clutch.ppg}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300 text-sm">FG%</span>
                      <span className="text-white font-bold">
                        {athlete.splits.clutch.fgp}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300 text-sm">Record</span>
                      <span className="text-red-400 font-bold">
                        {athlete.splits.clutch.record}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-700/50 p-4 sm:p-6 lg:p-8">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Recent Performance
                </h3>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-[#00CED1] to-[#FFAB91]"></div>
                  <span className="text-slate-400 text-xs sm:text-sm font-medium">
                    Last 7 Games
                  </span>
                </div>
              </div>

              <div className="h-40 sm:h-48 lg:h-56 mb-4 sm:mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={athlete.performanceData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                  >
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 500 }}
                      className="sm:text-xs"
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 500 }}
                      width={30}
                      className="sm:text-xs sm:w-40"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(30, 41, 59, 0.95)",
                        border: "1px solid rgba(148, 163, 184, 0.3)",
                        borderRadius: "12px",
                        color: "white",
                        fontSize: "12px",
                        fontWeight: 500,
                        boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.25)",
                      }}
                      cursor={{ fill: "rgba(0, 206, 209, 0.1)", radius: 6 }}
                    />
                    <Bar
                      dataKey="value"
                      fill="url(#barGradient)"
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient
                        id="barGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#00CED1" />
                        <stop offset="100%" stopColor="#FFAB91" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Average Display */}
              <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-600/30">
                <div className="text-center">
                  <div className="text-slate-400 text-xs sm:text-sm font-medium mb-2">
                    Average Last 7 Games
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white">
                    {Math.round(
                      athlete.performanceData.reduce(
                        (sum, game) => sum + game.value,
                        0
                      ) / athlete.performanceData.length
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Next Match */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-700/50 p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
                Upcoming Match
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#00CED1] to-[#FFAB91]"></div>
                      <span className="text-slate-400 text-xs sm:text-sm font-medium">
                        Opponent
                      </span>
                    </div>
                    <div className="text-white font-bold text-lg sm:text-xl">
                      {athlete.nextMatch.opponent}
                    </div>
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#00CED1] to-[#FFAB91]"></div>
                      <span className="text-slate-400 text-xs sm:text-sm font-medium">
                        Schedule
                      </span>
                    </div>
                    <div className="text-white font-bold text-base sm:text-lg">
                      {athlete.nextMatch.date}
                    </div>
                    <div className="text-slate-300 font-medium text-sm sm:text-base">
                      {athlete.nextMatch.time}
                    </div>
                    <div className="text-slate-400 text-xs sm:text-sm mt-1 sm:mt-2">
                      {athlete.nextMatch.venue}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Games */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-700/50 p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
                Recent Games
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {athlete.recentMatches.map((match, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-slate-600/30 hover:border-slate-500/40 transition-all duration-300"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                      {/* Mobile layout - stacked */}
                      <div className="sm:hidden space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-slate-400 text-sm font-medium">
                            {match.date}
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold ${
                                match.result === "W"
                                  ? "bg-emerald-500 text-white"
                                  : match.result === "L"
                                    ? "bg-red-500 text-white"
                                    : "bg-slate-500 text-white"
                              }`}
                            >
                              {match.result}
                            </span>
                            <div className="text-slate-300 text-sm font-medium">
                              {match.score}
                            </div>
                          </div>
                        </div>
                        <div className="text-white font-bold">
                          {match.opponent}
                        </div>
                        <div className="text-slate-400 text-sm">
                          {match.performance}
                        </div>
                      </div>

                      {/* Desktop layout - grid */}
                      <div className="hidden sm:block text-slate-400 font-medium text-sm">
                        {match.date}
                      </div>
                      <div className="hidden sm:block text-white font-bold">
                        {match.opponent}
                      </div>
                      <div className="hidden sm:flex flex-col items-center gap-2">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-xl text-sm font-bold shadow-lg ${
                            match.result === "W"
                              ? "bg-emerald-500 text-white"
                              : match.result === "L"
                                ? "bg-red-500 text-white"
                                : "bg-slate-500 text-white"
                          }`}
                        >
                          {match.result}
                        </span>
                        <div className="text-slate-300 text-sm font-medium">
                          {match.score}
                        </div>
                      </div>
                      <div className="hidden sm:block text-slate-400 text-sm font-medium text-right">
                        {match.performance}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
