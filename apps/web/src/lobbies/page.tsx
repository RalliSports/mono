"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LobbyCard from "@/components/main-feed/lobby-card";
import SidebarNav from "@/components/ui/sidebar-nav";

export default function LobbiesPage() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Fix hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isProfileDropdownOpen) {
        const target = event.target as Element;
        if (!target.closest(".profile-dropdown")) {
          setIsProfileDropdownOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileDropdownOpen]);

  // Mock lobbies data with different states
  const allLobbies = [
    {
      id: "1",
      title: "🔥 NBA Sunday Showdown",
      sport: "NBA",
      sportIcon: "🏀",
      participants: 9,
      maxParticipants: 12,
      buyIn: 25,
      prizePool: 280,
      legs: 4,
      timeLeft: "2h 15m",
      host: { name: "Jack Sturt", avatar: "JS" },
      isUrgent: false,
      status: "waiting" as const,
    },
    {
      id: "2",
      title: "Monday Night Football",
      sport: "NFL",
      sportIcon: "🏈",
      participants: 11,
      maxParticipants: 12,
      buyIn: 50,
      prizePool: 580,
      legs: 5,
      timeLeft: "45m",
      host: { name: "Mike Chen", avatar: "MC" },
      isUrgent: true,
      status: "waiting" as const,
    },
    {
      id: "3",
      title: "Champions League Special",
      sport: "Soccer",
      sportIcon: "⚽",
      participants: 6,
      maxParticipants: 10,
      buyIn: 35,
      prizePool: 315,
      legs: 3,
      timeLeft: "1h 30m",
      host: { name: "Sarah J", avatar: "SJ" },
      isUrgent: false,
      status: "waiting" as const,
    },
    {
      id: "4",
      title: "NBA Playoffs Madness",
      sport: "NBA",
      sportIcon: "🏀",
      participants: 12,
      maxParticipants: 12,
      buyIn: 100,
      prizePool: 1200,
      legs: 6,
      timeLeft: "Live",
      host: { name: "Alex Rodriguez", avatar: "AR" },
      isUrgent: false,
      status: "active" as const,
    },
    {
      id: "5",
      title: "Thursday Night Soccer",
      sport: "Soccer",
      sportIcon: "⚽",
      participants: 8,
      maxParticipants: 8,
      buyIn: 40,
      prizePool: 320,
      legs: 4,
      timeLeft: "Live",
      host: { name: "Emma Wilson", avatar: "EW" },
      isUrgent: false,
      status: "active" as const,
    },
    {
      id: "6",
      title: "Weekend Basketball Blast",
      sport: "NBA",
      sportIcon: "🏀",
      participants: 10,
      maxParticipants: 10,
      buyIn: 75,
      prizePool: 750,
      legs: 5,
      timeLeft: "Completed",
      host: { name: "David Kim", avatar: "DK" },
      isUrgent: false,
      status: "complete" as const,
    },
    {
      id: "7",
      title: "NFL Super Bowl Prep",
      sport: "NFL",
      sportIcon: "🏈",
      participants: 15,
      maxParticipants: 15,
      buyIn: 200,
      prizePool: 3000,
      legs: 8,
      timeLeft: "Completed",
      host: { name: "Michael Torres", avatar: "MT" },
      isUrgent: false,
      status: "complete" as const,
    },
    {
      id: "8",
      title: "Tennis Grand Slam",
      sport: "Tennis",
      sportIcon: "🎾",
      participants: 4,
      maxParticipants: 8,
      buyIn: 60,
      prizePool: 240,
      legs: 3,
      timeLeft: "Processing",
      host: { name: "Lisa Chang", avatar: "LC" },
      isUrgent: false,
      status: "pending" as const,
    },
    {
      id: "9",
      title: "Baseball World Series",
      sport: "MLB",
      sportIcon: "⚾",
      participants: 6,
      maxParticipants: 12,
      buyIn: 80,
      prizePool: 480,
      legs: 4,
      timeLeft: "Processing",
      host: { name: "Roberto Silva", avatar: "RS" },
      isUrgent: false,
      status: "pending" as const,
    },
    {
      id: "10",
      title: "Hockey Championship",
      sport: "NHL",
      sportIcon: "🏒",
      participants: 8,
      maxParticipants: 10,
      buyIn: 45,
      prizePool: 360,
      legs: 5,
      timeLeft: "3h 45m",
      host: { name: "Anna Johnson", avatar: "AJ" },
      isUrgent: false,
      status: "waiting" as const,
    },
    {
      id: "11",
      title: "College Football Fever",
      sport: "College Football",
      sportIcon: "🏈",
      participants: 12,
      maxParticipants: 12,
      buyIn: 30,
      prizePool: 360,
      legs: 4,
      timeLeft: "Live",
      host: { name: "Tom Bradley", avatar: "TB" },
      isUrgent: false,
      status: "active" as const,
    },
    {
      id: "12",
      title: "Weekend Warriors",
      sport: "NBA",
      sportIcon: "🏀",
      participants: 15,
      maxParticipants: 15,
      buyIn: 150,
      prizePool: 2250,
      legs: 7,
      timeLeft: "Completed",
      host: { name: "Jennifer Lee", avatar: "JL" },
      isUrgent: false,
      status: "complete" as const,
    },
  ];

  const handleLobbyJoin = (lobbyId: string, requiredLegs: number) => {
    // Handle lobby join logic here
    console.log(`Joining lobby ${lobbyId} with ${requiredLegs} legs`);
  };

  // Filter lobbies based on selected filter and search query
  const filteredLobbies = allLobbies.filter((lobby) => {
    const matchesFilter =
      selectedFilter === "all" || lobby.status === selectedFilter;
    const matchesSearch =
      lobby.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lobby.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lobby.host.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const filterTabs = [
    {
      id: "all",
      name: "All",
      icon: "🏆",
      count: allLobbies.length,
      color: "from-[#00CED1] to-[#FFAB91]",
    },
    {
      id: "waiting",
      name: "Waiting",
      icon: "⏳",
      count: allLobbies.filter((l) => l.status === "waiting").length,
      color: "from-blue-500 to-blue-400",
    },
    {
      id: "active",
      name: "Active",
      icon: "🔴",
      count: allLobbies.filter((l) => l.status === "active").length,
      color: "from-green-500 to-green-400",
    },
    {
      id: "complete",
      name: "Complete",
      icon: "✅",
      count: allLobbies.filter((l) => l.status === "complete").length,
      color: "from-emerald-500 to-emerald-400",
    },
    {
      id: "pending",
      name: "Pending",
      icon: "⏱️",
      count: allLobbies.filter((l) => l.status === "pending").length,
      color: "from-yellow-500 to-yellow-400",
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
          {/* Left: Back Button + Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push("/main")}
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
            </button>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-colors lg:hidden"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-white">
              <span className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] bg-clip-text text-transparent">
                All Lobbies
              </span>
            </h1>
          </div>

          {/* Right: Balance + Profile */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-[#00CED1]/20 to-[#FFAB91]/20 border border-[#00CED1]/30 rounded-xl px-4 py-2 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-lg flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="font-bold text-lg bg-gradient-to-r from-[#00CED1] to-[#FFAB91] bg-clip-text text-transparent">
                  $1,250
                </span>
              </div>
            </div>

            {/* Profile Dropdown */}
            <div className="relative profile-dropdown">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-white/20 overflow-hidden bg-slate-800"
              >
                <img
                  src="/users/mainuser.png"
                  alt="Profile"
                  className="w-10 h-10 object-cover rounded-full"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=Main+User&background=0D8ABC&color=fff&size=128`;
                  }}
                />
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 top-12 w-48 bg-slate-800/95 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-xl z-50">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        router.push("/profile");
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl hover:bg-slate-700/50 transition-colors text-left"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="text-white font-semibold text-sm">
                          Profile
                        </div>
                        <div className="text-slate-400 text-xs">
                          View your stats
                        </div>
                      </div>
                    </button>

                    <button className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl hover:bg-slate-700/50 transition-colors text-left">
                      <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-slate-300"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="text-white font-semibold text-sm">
                          Sign Out
                        </div>
                        <div className="text-slate-400 text-xs">
                          Logout of account
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lobby Status Filter Tabs */}
      <div className="sticky top-[60px] z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/30 px-4 py-3">
        <div
          className="flex space-x-2 overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-300 ${
                selectedFilter === tab.id
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                  : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white border border-slate-700/50"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
              <span className="bg-white/20 rounded-full px-2 py-0.5 text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search and Quick Actions */}
      <div className="sticky top-[116px] z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/30 px-4 py-3">
        <div className="flex items-center space-x-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search lobbies, sports, or hosts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-700/50 rounded-xl bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00CED1] focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-none mx-auto px-6 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <h2 className="text-3xl font-bold text-white flex items-center">
              <span className="w-10 h-10 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4 flex items-center justify-center">
                <span className="text-xl">🏆</span>
              </span>
              All Lobbies
            </h2>
          </div>
          <div>
            <button
              onClick={() => router.push("/create-game")}
              className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] hover:from-[#00CED1]/90 hover:to-[#FFAB91]/90 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2 group"
            >
              <svg
                className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Create</span>
            </button>
          </div>
        </div>

        {/* Results Summary */}
        {searchQuery && (
          <div className="mb-6 flex items-center justify-center">
            <div className="bg-[#FFAB91]/20 border border-[#FFAB91]/30 rounded-xl px-4 py-2 flex items-center space-x-2">
              <span className="text-[#FFAB91]">🔍</span>
              <span className="text-[#FFAB91] font-semibold text-sm">
                Found {filteredLobbies.length} results for "{searchQuery}"
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-[#FFAB91] hover:text-white transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Lobbies Grid */}
        {filteredLobbies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredLobbies.map((lobby) => (
              <LobbyCard
                key={lobby.id}
                id={lobby.id}
                title={lobby.title}
                sport={lobby.sport}
                sportIcon={lobby.sportIcon}
                participants={lobby.participants}
                maxParticipants={lobby.maxParticipants}
                buyIn={lobby.buyIn}
                prizePool={lobby.prizePool}
                legs={lobby.legs}
                timeLeft={lobby.timeLeft}
                host={lobby.host}
                isUrgent={lobby.isUrgent}
                onJoin={handleLobbyJoin}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-12 h-12 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No lobbies found
            </h3>
            <p className="text-slate-400 mb-6">
              {searchQuery
                ? `No lobbies match your search for "${searchQuery}"`
                : `No lobbies found for the ${selectedFilter} filter`}
            </p>
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] hover:from-[#00CED1]/90 hover:to-[#FFAB91]/90 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
              >
                Clear Search
              </button>
            ) : (
              <button
                onClick={() => router.push("/create-game")}
                className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] hover:from-[#00CED1]/90 hover:to-[#FFAB91]/90 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
              >
                Create Your First Lobby
              </button>
            )}
          </div>
        )}
      </div>

      {/* Sidebar Navigation */}
      <SidebarNav
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </div>
  );
}
