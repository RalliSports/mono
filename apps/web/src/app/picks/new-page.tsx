"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Athlete {
  id: string;
  name: string;
  team: string;
  position: string;
  sport: string;
  matchup: string;
  gameTime: string;
  avatar: string;
  stats: Array<{
    type: string;
    line: number;
    over: string;
    under: string;
  }>;
  trending: "up" | "down" | "hot" | "stable";
  confidence: number;
}

interface SelectedPick {
  id: string;
  athleteId: string;
  athleteName: string;
  athleteAvatar: string;
  propName: string;
  propValue: number;
  betType: "over" | "under";
  odds: string;
  sport: string;
}

export default function PicksPage() {
  const searchParams = useSearchParams();
  const [selectedPicks, setSelectedPicks] = useState<SelectedPick[]>([]);
  const [selectedSport, setSelectedSport] = useState("all");
  const [bookmarkedAthletes, setBookmarkedAthletes] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Get game parameters from URL
  const gameId = searchParams.get("gameId") || "1";
  const legsRequired = parseInt(searchParams.get("legs") || "4");
  const buyIn = parseInt(searchParams.get("buyIn") || "25");

  // Fix hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock athlete data matching main page structure
  const athletes: Athlete[] = [
    {
      id: "lebron-james",
      name: "LeBron James",
      team: "LAL",
      position: "SF",
      sport: "NBA",
      matchup: "vs GSW",
      gameTime: "Tonight 8:00 PM",
      avatar: "LJ",
      stats: [
        { type: "Points", line: 28.5, over: "+110", under: "-130" },
        { type: "Rebounds", line: 7.5, over: "-110", under: "-110" },
        { type: "Assists", line: 6.5, over: "+105", under: "-125" },
      ],
      trending: "up" as const,
      confidence: 85,
    },
    {
      id: "steph-curry",
      name: "Stephen Curry",
      team: "GSW",
      position: "PG",
      sport: "NBA",
      matchup: "@ LAL",
      gameTime: "Tonight 8:00 PM",
      avatar: "SC",
      stats: [
        { type: "Points", line: 31.5, over: "-115", under: "-105" },
        { type: "3-Pointers", line: 4.5, over: "+120", under: "-140" },
        { type: "Assists", line: 5.5, over: "-110", under: "-110" },
      ],
      trending: "hot" as const,
      confidence: 92,
    },
    {
      id: "josh-allen",
      name: "Josh Allen",
      team: "BUF",
      position: "QB",
      sport: "NFL",
      matchup: "vs KC",
      gameTime: "Sunday 1:00 PM",
      avatar: "JA",
      stats: [
        { type: "Passing Yards", line: 285.5, over: "-110", under: "-110" },
        { type: "Rushing Yards", line: 45.5, over: "+105", under: "-125" },
        { type: "Total TDs", line: 2.5, over: "+115", under: "-135" },
      ],
      trending: "stable" as const,
      confidence: 78,
    },
    {
      id: "patrick-mahomes",
      name: "Patrick Mahomes",
      team: "KC",
      position: "QB",
      sport: "NFL",
      matchup: "@ BUF",
      gameTime: "Sunday 1:00 PM",
      avatar: "PM",
      stats: [
        { type: "Passing Yards", line: 295.5, over: "-105", under: "-115" },
        { type: "Passing TDs", line: 2.5, over: "+110", under: "-130" },
        { type: "Completions", line: 24.5, over: "-110", under: "-110" },
      ],
      trending: "hot" as const,
      confidence: 89,
    },
    {
      id: "travis-kelce",
      name: "Travis Kelce",
      team: "KC",
      position: "TE",
      sport: "NFL",
      matchup: "@ BUF",
      gameTime: "Sunday 1:00 PM",
      avatar: "TK",
      stats: [
        { type: "Receiving Yards", line: 85.5, over: "-110", under: "-110" },
        { type: "Receptions", line: 6.5, over: "+105", under: "-125" },
        { type: "Receiving TDs", line: 0.5, over: "+150", under: "-180" },
      ],
      trending: "up" as const,
      confidence: 74,
    },
    {
      id: "messi",
      name: "Lionel Messi",
      team: "MIA",
      position: "FW",
      sport: "Soccer",
      matchup: "vs NYC",
      gameTime: "Saturday 7:30 PM",
      avatar: "LM",
      stats: [
        { type: "Goals", line: 0.5, over: "+120", under: "-140" },
        { type: "Assists", line: 0.5, over: "+105", under: "-125" },
        { type: "Shots on Target", line: 2.5, over: "-110", under: "-110" },
      ],
      trending: "hot" as const,
      confidence: 88,
    },
  ];

  const toggleBookmark = (athleteId: string) => {
    setBookmarkedAthletes((prev) => {
      if (prev.includes(athleteId)) {
        return prev.filter((id) => id !== athleteId);
      } else if (prev.length < 50) {
        return [...prev, athleteId];
      }
      return prev;
    });
  };

  const handlePickSelection = (
    athleteId: string,
    statIndex: number,
    betType: "over" | "under"
  ) => {
    const athlete = athletes.find((a) => a.id === athleteId);
    if (!athlete || selectedPicks.length >= legsRequired) return;

    const stat = athlete.stats[statIndex];
    const pickId = `${athleteId}-${statIndex}-${betType}`;

    // Remove any existing pick for this athlete
    const filteredPicks = selectedPicks.filter(
      (pick) => pick.athleteId !== athleteId
    );

    const newPick: SelectedPick = {
      id: pickId,
      athleteId,
      athleteName: athlete.name,
      athleteAvatar: athlete.avatar,
      propName: stat.type,
      propValue: stat.line,
      betType,
      odds: betType === "over" ? stat.over : stat.under,
      sport: athlete.sport,
    };

    setSelectedPicks([...filteredPicks, newPick]);
  };

  const removePick = (pickId: string) => {
    setSelectedPicks((prev) => prev.filter((pick) => pick.id !== pickId));
  };

  const filteredAthletes =
    selectedSport === "all"
      ? athletes
      : athletes.filter((athlete) => athlete.sport === selectedSport);

  const sportTabs = [
    { id: "all", name: "All", icon: "🏆", count: athletes.length },
    {
      id: "NBA",
      name: "NBA",
      icon: "🏀",
      count: athletes.filter((a) => a.sport === "NBA").length,
    },
    {
      id: "NFL",
      name: "NFL",
      icon: "🏈",
      count: athletes.filter((a) => a.sport === "NFL").length,
    },
    {
      id: "Soccer",
      name: "Soccer",
      icon: "⚽",
      count: athletes.filter((a) => a.sport === "Soccer").length,
    },
  ];

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-md border-b border-slate-700/50">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Back Button + Title */}
          <div className="flex items-center space-x-3">
            <Link
              href={`/join-game?id=${gameId}`}
              className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-colors"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-white">
              <span className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] bg-clip-text text-transparent">
                Make Your Picks
              </span>
            </h1>
          </div>

          {/* Right: Progress Info */}
          <div className="text-right">
            <div className="text-[#00CED1] font-bold text-lg">
              {selectedPicks.length}/{legsRequired}
            </div>
            <div className="text-slate-400 text-xs">Selected</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-32">
        {/* Game Info Header */}
        <div className="pt-6 pb-4">
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
            <div className="text-center mb-4">
              <h2 className="text-white font-bold text-xl mb-2">
                Select Your {legsRequired} Picks
              </h2>
              <p className="text-slate-400 text-sm">
                Choose player props to build your ${buyIn} parlay
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-3 text-center">
                <div className="text-slate-400 text-xs">Buy In</div>
                <div className="text-white font-bold text-lg">${buyIn}</div>
              </div>
              <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-3 text-center">
                <div className="text-slate-400 text-xs">Legs</div>
                <div className="text-[#00CED1] font-bold text-lg">
                  {legsRequired}
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-3 text-center">
                <div className="text-slate-400 text-xs">Potential</div>
                <div className="text-emerald-400 font-bold text-lg">
                  ~${Math.round(buyIn * 7.2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sport Filter Tabs */}
        <div className="mb-6">
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {sportTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedSport(tab.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  selectedSport === tab.id
                    ? "bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white shadow-lg"
                    : "bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-700/50"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
                <span className="text-xs opacity-75">({tab.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Athletes Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-white flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4 flex items-center justify-center">
                <span className="text-lg">📈</span>
              </span>
              Available Players
            </h3>
            <div className="text-right">
              <div className="text-[#00CED1] font-bold text-lg">
                {filteredAthletes.length}
              </div>
              <div className="text-slate-400 text-xs">Available</div>
            </div>
          </div>

          {filteredAthletes.map((athlete) => (
            <AthletePickCard
              key={athlete.id}
              athlete={athlete}
              isBookmarked={bookmarkedAthletes.includes(athlete.id)}
              onBookmarkToggle={toggleBookmark}
              onPickSelection={handlePickSelection}
              selectedPick={selectedPicks.find(
                (pick) => pick.athleteId === athlete.id
              )}
              isSelectionDisabled={
                selectedPicks.length >= legsRequired &&
                !selectedPicks.find((pick) => pick.athleteId === athlete.id)
              }
            />
          ))}
        </div>
      </div>

      {/* Bottom Selection Cart */}
      {selectedPicks.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900/98 to-slate-800/98 backdrop-blur-md border-t border-slate-700/50 p-4 shadow-2xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col space-y-4">
              {/* Selected Picks Header */}
              <div className="text-center">
                <div className="text-white font-bold text-lg mb-1">
                  {selectedPicks.length}/{legsRequired} Picks Selected
                </div>
                <div className="text-slate-400 text-sm">
                  Potential Payout: ~${Math.round(buyIn * 7.2)}
                </div>
              </div>

              {/* Avatar Stack with Picks */}
              <div className="flex justify-center space-x-2 max-w-full overflow-x-auto pb-2">
                {Array.from({ length: legsRequired }).map((_, index) => {
                  const pick = selectedPicks[index];

                  return (
                    <div key={index} className="text-center min-w-[60px]">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative ${
                          pick
                            ? "bg-gradient-to-br from-[#00CED1] to-[#FFAB91] border-white text-white shadow-lg"
                            : "bg-slate-800 border-slate-600 text-slate-400"
                        }`}
                      >
                        {pick ? (
                          <>
                            <span className="text-xs font-bold">
                              {pick.athleteAvatar}
                            </span>
                            <button
                              onClick={() => removePick(pick.id)}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600 transition-colors"
                            >
                              ×
                            </button>
                          </>
                        ) : (
                          <span className="text-lg">?</span>
                        )}
                      </div>
                      {pick && (
                        <div className="text-[#00CED1] text-xs mt-1 font-semibold truncate max-w-[60px]">
                          {pick.propName}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Confirm Button */}
              <button
                disabled={selectedPicks.length !== legsRequired}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                  selectedPicks.length === legsRequired
                    ? "bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                {selectedPicks.length === legsRequired
                  ? `Confirm Picks • $${buyIn} Buy-in`
                  : `Select ${legsRequired - selectedPicks.length} More Pick${legsRequired - selectedPicks.length !== 1 ? "s" : ""}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Athlete Pick Card Component
function AthletePickCard({
  athlete,
  isBookmarked,
  onBookmarkToggle,
  onPickSelection,
  selectedPick,
  isSelectionDisabled,
}: {
  athlete: Athlete;
  isBookmarked: boolean;
  onBookmarkToggle: (id: string) => void;
  onPickSelection: (
    athleteId: string,
    statIndex: number,
    betType: "over" | "under"
  ) => void;
  selectedPick?: SelectedPick;
  isSelectionDisabled: boolean;
}) {
  const [currentStatIndex, setCurrentStatIndex] = useState(0);

  const getPositionColor = (position: string) => {
    switch (position) {
      case "QB":
        return "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400";
      case "RB":
        return "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400";
      case "WR":
        return "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400";
      case "TE":
        return "from-orange-500/20 to-amber-500/20 border-orange-500/30 text-orange-400";
      case "SF":
        return "from-red-500/20 to-pink-500/20 border-red-500/30 text-red-400";
      case "PG":
        return "from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-400";
      case "FW":
        return "from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-400";
      default:
        return "from-slate-500/20 to-slate-600/20 border-slate-500/30 text-slate-400";
    }
  };

  const nextStat = () => {
    setCurrentStatIndex((prev) => (prev + 1) % athlete.stats.length);
  };

  const prevStat = () => {
    setCurrentStatIndex((prev) =>
      prev === 0 ? athlete.stats.length - 1 : prev - 1
    );
  };

  const currentStat = athlete.stats[currentStatIndex];
  const isThisStatSelected =
    selectedPick &&
    selectedPick.propName === currentStat.type &&
    selectedPick.propValue === currentStat.line;

  return (
    <div
      className={`group relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-xl border shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden ${
        selectedPick
          ? "border-[#00CED1] shadow-[#00CED1]/20"
          : "border-slate-700/50 hover:border-slate-600/60"
      }`}
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#00CED1]/3 via-transparent to-[#FFAB91]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10 p-5">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-3">
            {/* Player Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl flex items-center justify-center shadow-lg">
                {athlete.name ? (
                  <img
                    src={`/players/${athlete.name.toLowerCase().replace(/\s+/g, "-")}.png`}
                    alt={athlete.name}
                    className="w-12 h-12 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(athlete.name)}&background=0D8ABC&color=fff&size=128`;
                    }}
                  />
                ) : (
                  <span className="text-white font-bold text-lg tracking-tight">
                    {athlete.avatar}
                  </span>
                )}
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-800 bg-emerald-500"></div>
            </div>

            {/* Player Details */}
            <div className="min-w-0 flex-1">
              <h3 className="text-white font-bold text-lg mb-1 truncate">
                {athlete.name}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-slate-300 font-semibold text-sm">
                  {athlete.team}
                </span>
                <div
                  className={`px-2 py-1 bg-gradient-to-r ${getPositionColor(
                    athlete.position
                  )} border rounded text-xs font-bold`}
                >
                  {athlete.position}
                </div>
              </div>
            </div>
          </div>

          {/* Matchup */}
          <div className="text-slate-400 font-medium text-sm">
            {athlete.matchup}
          </div>
        </div>

        {/* Horizontal Layout with Stats and Buttons */}
        <div className="flex items-center gap-4">
          {/* Stats Section */}
          <div className="flex-1 bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-5">
            {/* Stat Navigation Header */}
            <div className="flex flex-col mb-3">
              <div className="text-slate-200 font-bold text-base mb-3 tracking-wide text-center">
                {currentStat.type}
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={prevStat}
                  className="w-8 h-8 bg-gradient-to-r from-slate-700/60 to-slate-600/60 hover:from-[#00CED1]/30 hover:to-[#00CED1]/20 rounded-lg flex items-center justify-center transition-all duration-300 border border-slate-600/40 hover:border-[#00CED1]/50"
                >
                  <svg
                    className="w-4 h-4 text-slate-300 hover:text-[#00CED1] transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <div className="text-[#00CED1] font-black text-3xl tracking-tight drop-shadow-lg">
                  {currentStat.line}
                </div>

                <button
                  onClick={nextStat}
                  className="w-8 h-8 bg-gradient-to-r from-slate-700/60 to-slate-600/60 hover:from-[#00CED1]/30 hover:to-[#00CED1]/20 rounded-lg flex items-center justify-center transition-all duration-300 border border-slate-600/40 hover:border-[#00CED1]/50"
                >
                  <svg
                    className="w-4 h-4 text-slate-300 hover:text-[#00CED1] transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Progress Indicators */}
            <div className="flex justify-center space-x-2 mb-4">
              {athlete.stats.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStatIndex(index)}
                  className={`transition-all duration-500 rounded-full ${
                    index === currentStatIndex
                      ? "w-6 h-1.5 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] shadow-lg shadow-[#00CED1]/30"
                      : "w-1.5 h-1.5 bg-slate-600/60 hover:bg-slate-500/80 hover:scale-150 shadow-md"
                  }`}
                ></button>
              ))}
            </div>

            {/* Bookmark Button */}
            <button
              onClick={() => onBookmarkToggle(athlete.id)}
              className={`w-full py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isBookmarked
                  ? "bg-[#FFAB91]/20 border border-[#FFAB91]/40 text-[#FFAB91]"
                  : "bg-slate-700/50 border border-slate-600/50 text-slate-400 hover:bg-[#FFAB91]/10 hover:border-[#FFAB91]/30 hover:text-[#FFAB91]"
              }`}
            >
              {isBookmarked ? "Bookmarked" : "Save for Later"}
            </button>
          </div>

          {/* Over/Under Buttons */}
          <div className="flex flex-col space-y-2 min-w-[100px] flex-shrink-0">
            <button
              onClick={() =>
                onPickSelection(athlete.id, currentStatIndex, "over")
              }
              disabled={isSelectionDisabled}
              className={`rounded-xl py-3 px-4 transition-all duration-300 group shadow-lg ${
                isThisStatSelected && selectedPick?.betType === "over"
                  ? "bg-gradient-to-r from-emerald-500/50 to-emerald-600/40 border-2 border-emerald-300 shadow-emerald-500/40"
                  : isSelectionDisabled
                    ? "bg-gradient-to-r from-slate-600/25 to-slate-700/15 border-2 border-slate-500/20 cursor-not-allowed opacity-50"
                    : "bg-gradient-to-r from-emerald-500/25 to-emerald-600/15 border-2 border-emerald-400/40 hover:from-emerald-500/35 hover:to-emerald-600/25 hover:border-emerald-400/60 hover:shadow-emerald-500/20"
              }`}
            >
              <div className="flex items-center justify-center mb-1">
                <svg
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isThisStatSelected && selectedPick?.betType === "over"
                      ? "text-emerald-300 scale-110"
                      : isSelectionDisabled
                        ? "text-slate-500"
                        : "text-emerald-400 group-hover:scale-110"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </div>
              <div
                className={`font-bold text-sm transition-colors ${
                  isThisStatSelected && selectedPick?.betType === "over"
                    ? "text-emerald-200"
                    : isSelectionDisabled
                      ? "text-slate-500"
                      : "text-emerald-300 group-hover:text-emerald-200"
                }`}
              >
                OVER
              </div>
              <div
                className={`font-semibold text-xs ${
                  isThisStatSelected && selectedPick?.betType === "over"
                    ? "text-emerald-300"
                    : isSelectionDisabled
                      ? "text-slate-500"
                      : "text-emerald-400"
                }`}
              >
                {currentStat.over}
              </div>
            </button>

            <button
              onClick={() =>
                onPickSelection(athlete.id, currentStatIndex, "under")
              }
              disabled={isSelectionDisabled}
              className={`rounded-xl py-3 px-4 transition-all duration-300 group shadow-lg ${
                isThisStatSelected && selectedPick?.betType === "under"
                  ? "bg-gradient-to-r from-red-500/50 to-red-600/40 border-2 border-red-300 shadow-red-500/40"
                  : isSelectionDisabled
                    ? "bg-gradient-to-r from-slate-600/25 to-slate-700/15 border-2 border-slate-500/20 cursor-not-allowed opacity-50"
                    : "bg-gradient-to-r from-red-500/25 to-red-600/15 border-2 border-red-400/40 hover:from-red-500/35 hover:to-red-600/25 hover:border-red-400/60 hover:shadow-red-500/20"
              }`}
            >
              <div className="flex items-center justify-center mb-1">
                <svg
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isThisStatSelected && selectedPick?.betType === "under"
                      ? "text-red-300 scale-110"
                      : isSelectionDisabled
                        ? "text-slate-500"
                        : "text-red-400 group-hover:scale-110"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              <div
                className={`font-bold text-sm transition-colors ${
                  isThisStatSelected && selectedPick?.betType === "under"
                    ? "text-red-200"
                    : isSelectionDisabled
                      ? "text-slate-500"
                      : "text-red-300 group-hover:text-red-200"
                }`}
              >
                UNDER
              </div>
              <div
                className={`font-semibold text-xs ${
                  isThisStatSelected && selectedPick?.betType === "under"
                    ? "text-red-300"
                    : isSelectionDisabled
                      ? "text-slate-500"
                      : "text-red-400"
                }`}
              >
                {currentStat.under}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
