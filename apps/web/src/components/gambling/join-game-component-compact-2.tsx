"use client";

import { useState } from "react";

interface GamePick {
  id: number;
  player: string;
  betType: string;
  target: number;
  currentValue: number;
  betDirection: "over" | "under";
  odds: string;
  status: "not_started" | "active" | "won" | "lost";
  gameTime: string;
  athleteImage: string;
  sport: string;
}

interface GameParticipant {
  id: number;
  name: string;
  avatar: string;
  isOnline: boolean;
  buyIn: number;
  picks: GamePick[];
  joinedAt: string;
}

interface GameInfo {
  id: number;
  name: string;
  hostName: string;
  hostAvatar: string;
  currentPlayers: number;
  maxPlayers: number;
  buyIn: number;
  maxPayout: number;
  legs: number;
  visibility: "public" | "private" | "friends";
  status: "waiting" | "active" | "completed";
  createdAt: string;
  participants: GameParticipant[];
}

export default function JoinGameComponentCompact2() {
  const [expandedParticipants, setExpandedParticipants] = useState<number[]>(
    []
  );
  const [showAllPlayers, setShowAllPlayers] = useState<boolean>(false);

  // Helper function to toggle participant expansion
  const toggleParticipant = (participantId: number) => {
    setExpandedParticipants((prev) =>
      prev.includes(participantId)
        ? prev.filter((id) => id !== participantId)
        : [...prev, participantId]
    );
  };

  const isParticipantExpanded = (participantId: number) =>
    expandedParticipants.includes(participantId);

  // Sample game data - Soccer & Hockey Mix
  const [gameInfo] = useState<GameInfo>({
    id: 3,
    name: "Champions League & NHL Power Play",
    hostName: "Maria Gonzalez",
    hostAvatar: "⚽",
    currentPlayers: 5,
    maxPlayers: 10,
    buyIn: 35,
    maxPayout: 320,
    legs: 6,
    visibility: "public",
    status: "waiting",
    createdAt: "1 hour ago",
    participants: [
      {
        id: 1,
        name: "Maria Gonzalez",
        avatar: "⚽",
        isOnline: true,
        buyIn: 35,
        joinedAt: "1 hour ago",
        picks: [
          {
            id: 1,
            player: "Kylian Mbappé",
            betType: "Goals",
            target: 0.5,
            currentValue: 0,
            betDirection: "over",
            odds: "+130",
            status: "not_started",
            gameTime: "Tomorrow 3:00 PM",
            athleteImage: "🇫🇷",
            sport: "Soccer",
          },
          {
            id: 2,
            player: "Erling Haaland",
            betType: "Shots on Target",
            target: 2.5,
            currentValue: 0,
            betDirection: "over",
            odds: "+105",
            status: "not_started",
            gameTime: "Tomorrow 3:00 PM",
            athleteImage: "🇳🇴",
            sport: "Soccer",
          },
          {
            id: 3,
            player: "Connor McDavid",
            betType: "Points",
            target: 1.5,
            currentValue: 0,
            betDirection: "over",
            odds: "+115",
            status: "not_started",
            gameTime: "Tomorrow 7:00 PM",
            athleteImage: "🏒",
            sport: "NHL",
          },
          {
            id: 4,
            player: "Lionel Messi",
            betType: "Key Passes",
            target: 3.5,
            currentValue: 0,
            betDirection: "over",
            odds: "+120",
            status: "not_started",
            gameTime: "Tomorrow 3:00 PM",
            athleteImage: "🐐",
            sport: "Soccer",
          },
          {
            id: 5,
            player: "Leon Draisaitl",
            betType: "Assists",
            target: 0.5,
            currentValue: 0,
            betDirection: "over",
            odds: "+140",
            status: "not_started",
            gameTime: "Tomorrow 7:00 PM",
            athleteImage: "🇩🇪",
            sport: "NHL",
          },
          {
            id: 6,
            player: "Vinicius Jr.",
            betType: "Successful Dribbles",
            target: 4.5,
            currentValue: 0,
            betDirection: "over",
            odds: "+110",
            status: "not_started",
            gameTime: "Tomorrow 3:00 PM",
            athleteImage: "🇧🇷",
            sport: "Soccer",
          },
        ],
      },
      {
        id: 2,
        name: "David Kim",
        avatar: "🏒",
        isOnline: true,
        buyIn: 35,
        joinedAt: "50 minutes ago",
        picks: [
          {
            id: 7,
            player: "Nathan MacKinnon",
            betType: "Goals",
            target: 0.5,
            currentValue: 0,
            betDirection: "over",
            odds: "+145",
            status: "not_started",
            gameTime: "Tomorrow 7:00 PM",
            athleteImage: "⚡",
            sport: "NHL",
          },
          {
            id: 8,
            player: "Pedri",
            betType: "Passes Completed",
            target: 85.5,
            currentValue: 0,
            betDirection: "over",
            odds: "+100",
            status: "not_started",
            gameTime: "Tomorrow 3:00 PM",
            athleteImage: "🎯",
            sport: "Soccer",
          },
          {
            id: 9,
            player: "Erik Karlsson",
            betType: "Shots",
            target: 3.5,
            currentValue: 0,
            betDirection: "over",
            odds: "+125",
            status: "not_started",
            gameTime: "Tomorrow 7:00 PM",
            athleteImage: "🎯",
            sport: "NHL",
          },
          {
            id: 10,
            player: "Bruno Fernandes",
            betType: "Touches",
            target: 95.5,
            currentValue: 0,
            betDirection: "over",
            odds: "-110",
            status: "not_started",
            gameTime: "Tomorrow 3:00 PM",
            athleteImage: "🎭",
            sport: "Soccer",
          },
          {
            id: 11,
            player: "Artemi Panarin",
            betType: "Time on Ice",
            target: 20.5,
            currentValue: 0,
            betDirection: "over",
            odds: "+105",
            status: "not_started",
            gameTime: "Tomorrow 7:00 PM",
            athleteImage: "🎨",
            sport: "NHL",
          },
          {
            id: 12,
            player: "Kevin De Bruyne",
            betType: "Crosses",
            target: 6.5,
            currentValue: 0,
            betDirection: "over",
            odds: "+115",
            status: "not_started",
            gameTime: "Tomorrow 3:00 PM",
            athleteImage: "👑",
            sport: "Soccer",
          },
        ],
      },
      {
        id: 3,
        name: "Sophie Martin",
        avatar: "⭐",
        isOnline: false,
        buyIn: 35,
        joinedAt: "35 minutes ago",
        picks: [
          {
            id: 13,
            player: "Jude Bellingham",
            betType: "Tackles",
            target: 2.5,
            currentValue: 0,
            betDirection: "over",
            odds: "+120",
            status: "not_started",
            gameTime: "Tomorrow 3:00 PM",
            athleteImage: "🌟",
            sport: "Soccer",
          },
          {
            id: 14,
            player: "Auston Matthews",
            betType: "Shots on Goal",
            target: 4.5,
            currentValue: 0,
            betDirection: "over",
            odds: "+110",
            status: "not_started",
            gameTime: "Tomorrow 7:00 PM",
            athleteImage: "🇺🇸",
            sport: "NHL",
          },
          {
            id: 15,
            player: "Bukayo Saka",
            betType: "Fouls Drawn",
            target: 1.5,
            currentValue: 0,
            betDirection: "over",
            odds: "+135",
            status: "not_started",
            gameTime: "Tomorrow 3:00 PM",
            athleteImage: "🚀",
            sport: "Soccer",
          },
          {
            id: 16,
            player: "Nikita Kucherov",
            betType: "Power Play Points",
            target: 0.5,
            currentValue: 0,
            betDirection: "over",
            odds: "+160",
            status: "not_started",
            gameTime: "Tomorrow 7:00 PM",
            athleteImage: "⚡",
            sport: "NHL",
          },
          {
            id: 17,
            player: "Mohamed Salah",
            betType: "Shots",
            target: 3.5,
            currentValue: 0,
            betDirection: "over",
            odds: "+105",
            status: "not_started",
            gameTime: "Tomorrow 3:00 PM",
            athleteImage: "🇪🇬",
            sport: "Soccer",
          },
          {
            id: 18,
            player: "Sidney Crosby",
            betType: "Face-off Wins",
            target: 12.5,
            currentValue: 0,
            betDirection: "over",
            odds: "+100",
            status: "not_started",
            gameTime: "Tomorrow 7:00 PM",
            athleteImage: "🏆",
            sport: "NHL",
          },
        ],
      },
      {
        id: 4,
        name: "James Wilson",
        avatar: "🥅",
        isOnline: true,
        buyIn: 35,
        joinedAt: "20 minutes ago",
        picks: [
          {
            id: 19,
            player: "Luka Modric",
            betType: "Long Passes",
            target: 8.5,
            currentValue: 0,
            betDirection: "over",
            odds: "+125",
            status: "not_started",
            gameTime: "Tomorrow 3:00 PM",
            athleteImage: "🎼",
            sport: "Soccer",
          },
          {
            id: 20,
            player: "Igor Shesterkin",
            betType: "Saves",
            target: 28.5,
            currentValue: 0,
            betDirection: "over",
            odds: "+115",
            status: "not_started",
            gameTime: "Tomorrow 7:00 PM",
            athleteImage: "🥅",
            sport: "NHL",
          },
          {
            id: 21,
            player: "Jamal Musiala",
            betType: "Successful Take-ons",
            target: 3.5,
            currentValue: 0,
            betDirection: "over",
            odds: "+140",
            status: "not_started",
            gameTime: "Tomorrow 3:00 PM",
            athleteImage: "💫",
            sport: "Soccer",
          },
          {
            id: 22,
            player: "Cale Makar",
            betType: "Blocked Shots",
            target: 2.5,
            currentValue: 0,
            betDirection: "over",
            odds: "+130",
            status: "not_started",
            gameTime: "Tomorrow 7:00 PM",
            athleteImage: "🛡️",
            sport: "NHL",
          },
          {
            id: 23,
            player: "Gavi",
            betType: "Interceptions",
            target: 1.5,
            currentValue: 0,
            betDirection: "over",
            odds: "+150",
            status: "not_started",
            gameTime: "Tomorrow 3:00 PM",
            athleteImage: "🎪",
            sport: "Soccer",
          },
          {
            id: 24,
            player: "Victor Hedman",
            betType: "Hits",
            target: 3.5,
            currentValue: 0,
            betDirection: "over",
            odds: "+120",
            status: "not_started",
            gameTime: "Tomorrow 7:00 PM",
            athleteImage: "💥",
            sport: "NHL",
          },
        ],
      },
      {
        id: 5,
        name: "Emma Thompson",
        avatar: "💎",
        isOnline: true,
        buyIn: 35,
        joinedAt: "10 minutes ago",
        picks: [
          {
            id: 25,
            player: "Virgil van Dijk",
            betType: "Aerial Duels Won",
            target: 4.5,
            currentValue: 0,
            betDirection: "over",
            odds: "+110",
            status: "not_started",
            gameTime: "Tomorrow 3:00 PM",
            athleteImage: "🏔️",
            sport: "Soccer",
          },
          {
            id: 26,
            player: "Mikko Rantanen",
            betType: "Penalty Minutes",
            target: 1.5,
            currentValue: 0,
            betDirection: "under",
            odds: "-105",
            status: "not_started",
            gameTime: "Tomorrow 7:00 PM",
            athleteImage: "🇫🇮",
            sport: "NHL",
          },
          {
            id: 27,
            player: "Rodri",
            betType: "Yellow Cards",
            target: 0.5,
            currentValue: 0,
            betDirection: "under",
            odds: "-120",
            status: "not_started",
            gameTime: "Tomorrow 3:00 PM",
            athleteImage: "🎯",
            sport: "Soccer",
          },
          {
            id: 28,
            player: "Alex Ovechkin",
            betType: "Hits",
            target: 4.5,
            currentValue: 0,
            betDirection: "over",
            odds: "+105",
            status: "not_started",
            gameTime: "Tomorrow 7:00 PM",
            athleteImage: "🚀",
            sport: "NHL",
          },
          {
            id: 29,
            player: "Bernardo Silva",
            betType: "Distance Covered",
            target: 10.5,
            currentValue: 0,
            betDirection: "over",
            odds: "+100",
            status: "not_started",
            gameTime: "Tomorrow 3:00 PM",
            athleteImage: "🏃",
            sport: "Soccer",
          },
          {
            id: 30,
            player: "Quinn Hughes",
            betType: "Plus/Minus",
            target: 0.5,
            currentValue: 0,
            betDirection: "over",
            odds: "+125",
            status: "not_started",
            gameTime: "Tomorrow 7:00 PM",
            athleteImage: "⚡",
            sport: "NHL",
          },
        ],
      },
    ],
  });

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "public":
        return "🌍";
      case "private":
        return "🔒";
      case "friends":
        return "👥";
      default:
        return "🌍";
    }
  };

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case "public":
        return "text-emerald-400 bg-emerald-400/20 border-emerald-400/30";
      case "private":
        return "text-red-400 bg-red-400/20 border-red-400/30";
      case "friends":
        return "text-blue-400 bg-blue-400/20 border-blue-400/30";
      default:
        return "text-slate-400 bg-slate-400/20 border-slate-400/30";
    }
  };

  const spotsLeft = gameInfo.maxPlayers - gameInfo.currentPlayers;
  const displayedParticipants = showAllPlayers
    ? gameInfo.participants
    : gameInfo.participants.slice(0, 3);
  const hiddenParticipantsCount = gameInfo.participants.length - 3;

  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Join Game 🎮</h2>
            <p className="text-slate-400">
              Review the lobby details and join the action
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-400">
              {gameInfo.participants.filter((p) => p.isOnline).length}/
              {gameInfo.currentPlayers} online
            </span>
          </div>
        </div>

        {/* Enhanced Host Info */}
        <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl flex items-center justify-center text-3xl shadow-xl">
                {gameInfo.hostAvatar}
              </div>
              <div className="absolute -bottom-1 -right-1 text-lg shadow-lg">
                👑
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-xl truncate">
                {gameInfo.hostName}
              </h3>
              <p className="text-slate-400 text-sm">
                Host • Created {gameInfo.createdAt}
              </p>
              <div className="mt-2">
                <h4 className="text-lg font-semibold text-white truncate">
                  {gameInfo.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-slate-300 font-medium">
                    {gameInfo.currentPlayers}/{gameInfo.maxPlayers} players
                  </span>
                  <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                  <span className="text-slate-400 text-sm">
                    {gameInfo.legs} legs
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Game Details */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 shadow-2xl hover:shadow-[#00CED1]/10 transition-all duration-300 hover:scale-105">
            <div className="text-slate-400 text-sm">Buy In</div>
            <div className="text-white font-bold text-xl">
              ${gameInfo.buyIn}
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 hover:scale-105">
            <div className="text-slate-400 text-sm">Max Payout</div>
            <div className="text-emerald-400 font-bold text-xl">
              ${gameInfo.maxPayout}
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-105">
            <div className="text-slate-400 text-sm">Legs</div>
            <div className="text-white font-bold text-xl">{gameInfo.legs}</div>
          </div>
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 shadow-2xl hover:shadow-slate-500/10 transition-all duration-300 hover:scale-105">
            <div className="text-slate-400 text-sm">Visibility</div>
            <div
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-sm font-medium ${getVisibilityColor(gameInfo.visibility)}`}
            >
              {getVisibilityIcon(gameInfo.visibility)} {gameInfo.visibility}
            </div>
          </div>
        </div>
      </div>

      {/* Participants */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-white font-bold text-lg mb-2">
            Current Players ({gameInfo.currentPlayers})
          </h3>
          <p className="text-slate-400 text-sm">
            See what picks other players have locked in
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-6">
          {displayedParticipants.map((participant) => (
            <div key={participant.id} className="space-y-3">
              {/* Enhanced Participant Header */}
              <div
                className={`bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer shadow-2xl ${
                  isParticipantExpanded(participant.id)
                    ? "border-[#00CED1] shadow-[#00CED1]/20"
                    : "hover:border-slate-600 hover:shadow-slate-600/10"
                }`}
                onClick={() => toggleParticipant(participant.id)}
              >
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-14 h-14 backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl flex items-center justify-center text-2xl shadow-xl">
                          {participant.avatar}
                        </div>
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-800 ${
                            participant.isOnline
                              ? "bg-emerald-400"
                              : "bg-slate-500"
                          }`}
                        ></div>
                        {participant.name === gameInfo.hostName && (
                          <div className="absolute -top-1 -left-1 text-sm">
                            👑
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-white font-bold text-base leading-tight truncate">
                          {participant.name}
                        </h4>
                        <p className="text-slate-400 text-sm mt-1">
                          Joined {participant.joinedAt} • ${participant.buyIn}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm text-slate-300 font-medium">
                          {participant.picks.length} picks
                        </div>
                        <div className="text-xs text-slate-500">
                          Ready to play
                        </div>
                      </div>
                      <div
                        className={`transform transition-transform duration-300 text-slate-400 ${
                          isParticipantExpanded(participant.id)
                            ? "rotate-180"
                            : ""
                        }`}
                      >
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* Quick Picks Preview */}
                  <div className="mt-4">
                    <div className="flex gap-1.5">
                      {participant.picks.slice(0, 4).map((pick, index) => (
                        <div
                          key={pick.id}
                          className="flex-1 h-2.5 bg-slate-700 rounded-full overflow-hidden"
                        >
                          <div
                            className="h-full bg-gradient-to-r from-blue-400 to-blue-500"
                            style={{ width: "100%" }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Expanded Picks List */}
              {isParticipantExpanded(participant.id) && (
                <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden animate-in slide-in-from-top-2 duration-300 shadow-2xl shadow-[#00CED1]/10">
                  <div className="p-4 border-b border-slate-700/50">
                    <h5 className="text-white font-bold truncate">
                      {participant.name}'s Picks
                    </h5>
                    <p className="text-slate-400 text-sm">
                      {participant.picks.length} legs selected
                    </p>
                  </div>

                  <div className="divide-y divide-slate-700/30">
                    {participant.picks.map((pick) => (
                      <div
                        key={pick.id}
                        className="p-4 hover:bg-slate-700/20 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-10 h-10 backdrop-blur-lg bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-lg">
                              {pick.athleteImage}
                            </div>
                            <div className="min-w-0">
                              <h6 className="text-white font-semibold text-sm leading-tight truncate">
                                {pick.player}
                              </h6>
                              <p className="text-slate-400 text-xs">
                                {pick.sport} • {pick.gameTime}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-white font-semibold text-sm">
                              {pick.betType} {pick.betDirection} {pick.target}
                            </div>
                            <div className="text-slate-400 text-xs">
                              {pick.odds}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Show More Players Button */}
          {gameInfo.participants.length > 3 && (
            <div className="flex justify-center">
              <button
                onClick={() => setShowAllPlayers(!showAllPlayers)}
                className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl px-6 py-3 shadow-xl hover:shadow-slate-600/10 transition-all duration-300 hover:scale-105 group"
              >
                <div className="flex items-center gap-2 text-slate-300 group-hover:text-white">
                  <span className="font-medium">
                    {showAllPlayers
                      ? "Show Less Players"
                      : `Show ${hiddenParticipantsCount} More Player${hiddenParticipantsCount > 1 ? "s" : ""}`}
                  </span>
                  <div
                    className={`transform transition-transform duration-300 ${showAllPlayers ? "rotate-180" : ""}`}
                  >
                    ▼
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Enhanced Join Game Button */}
        <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-[#00CED1]/30 rounded-2xl p-6 shadow-2xl shadow-[#00CED1]/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-bold text-xl">Ready to Join?</h3>
              <p className="text-slate-400">
                {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} remaining in this
                lobby
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                ${gameInfo.buyIn}
              </div>
              <div className="text-sm text-slate-400">Buy-in required</div>
            </div>
          </div>

          <button className="relative w-full bg-gradient-to-r from-[#00CED1] to-blue-500 hover:from-[#00CED1]/90 hover:to-blue-500/90 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg overflow-hidden group">
            {/* Shimmer effect */}
            <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
            <span className="relative z-10">
              Join Game • {spotsLeft} Spot{spotsLeft !== 1 ? "s" : ""} Left
            </span>
          </button>

          {spotsLeft <= 3 && (
            <p className="text-amber-400 text-sm text-center mt-2 font-medium">
              ⚡ Filling up fast! Only {spotsLeft} spot
              {spotsLeft !== 1 ? "s" : ""} remaining
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
