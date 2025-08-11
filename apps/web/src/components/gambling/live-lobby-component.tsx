"use client";

import { useState } from "react";
import TriColorProgressBar from "./tri-color-progress-bar";

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
  gameStatus:
    | "pregame"
    | "1st_quarter"
    | "2nd_quarter"
    | "halftime"
    | "3rd_quarter"
    | "4th_quarter"
    | "overtime"
    | "final";
  winProbability?: number;
}

interface GameParticipant {
  id: number;
  name: string;
  avatar: string;
  isOnline: boolean;
  buyIn: number;
  picks: GamePick[];
  joinedAt: string;
  currentScore: number;
  legsWon: number;
  legsLost: number;
  isEliminated: boolean;
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
  currentUser: string;
}

interface ActivityFeedItem {
  id: number;
  type:
    | "game_start"
    | "game_end"
    | "pick_won"
    | "pick_lost"
    | "player_eliminated"
    | "pick_added"
    | "score_update";
  player: string;
  avatar: string;
  message: string;
  timestamp: string;
  data?: any;
}

interface AthleteUpdate {
  id: number;
  athleteName: string;
  athleteImage: string;
  sport: string;
  updateType:
    | "score_update"
    | "milestone"
    | "quarter_end"
    | "injury"
    | "timeout"
    | "game_status";
  currentValue: number;
  previousValue?: number;
  betType: string;
  gameTime: string;
  gameStatus: string;
  affectedPlayers: string[];
  isPositive: boolean;
  timestamp: string;
  description: string;
}

export default function LiveLobbyComponent() {
  const [expandedParticipants, setExpandedParticipants] = useState<number[]>(
    []
  );
  const [activeTab, setActiveTab] = useState<"my_picks" | "all_players">(
    "my_picks"
  );
  const [sidebarTab, setSidebarTab] = useState<
    "live_feed" | "leaderboard" | "athlete_updates"
  >("live_feed");
  const [athleteUpdatesTab, setAthleteUpdatesTab] = useState<
    "my_picks" | "lobby_picks"
  >("my_picks");
  const [showAddPickModal, setShowAddPickModal] = useState(false);

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

  // Sample live game data with active status
  const [gameInfo] = useState<GameInfo>({
    id: 1,
    name: "NBA Sunday Showdown",
    hostName: "Jack Sturt",
    hostAvatar: "🎯",
    currentPlayers: 5,
    maxPlayers: 8,
    buyIn: 25,
    maxPayout: 180,
    legs: 4,
    visibility: "public",
    status: "active",
    createdAt: "2 hours ago",
    currentUser: "Emma Chen",
    participants: [
      {
        id: 1,
        name: "Jack Sturt",
        avatar: "🎯",
        isOnline: true,
        buyIn: 25,
        joinedAt: "2 hours ago",
        currentScore: 3,
        legsWon: 3,
        legsLost: 1,
        isEliminated: false,
        picks: [
          {
            id: 1,
            player: "LeBron James",
            betType: "Points",
            target: 28.5,
            currentValue: 32,
            betDirection: "over",
            odds: "+110",
            status: "won",
            gameTime: "Final",
            athleteImage: "👑",
            sport: "NBA",
            gameStatus: "final",
            winProbability: 100,
          },
          {
            id: 2,
            player: "Steph Curry",
            betType: "3-Pointers",
            target: 4.5,
            currentValue: 6,
            betDirection: "over",
            odds: "+105",
            status: "won",
            gameTime: "Final",
            athleteImage: "👨‍🦱",
            sport: "NBA",
            gameStatus: "final",
            winProbability: 100,
          },
          {
            id: 3,
            player: "Giannis",
            betType: "Rebounds",
            target: 11.5,
            currentValue: 8,
            betDirection: "over",
            odds: "-115",
            status: "lost",
            gameTime: "Final",
            athleteImage: "🦌",
            sport: "NBA",
            gameStatus: "final",
            winProbability: 0,
          },
          {
            id: 4,
            player: "Luka Dončić",
            betType: "Assists",
            target: 8.5,
            currentValue: 12,
            betDirection: "over",
            odds: "+105",
            status: "won",
            gameTime: "Final",
            athleteImage: "🇸🇮",
            sport: "NBA",
            gameStatus: "final",
            winProbability: 100,
          },
        ],
      },
      {
        id: 2,
        name: "Emma Chen",
        avatar: "⚡",
        isOnline: true,
        buyIn: 25,
        joinedAt: "1 hour ago",
        currentScore: 2,
        legsWon: 2,
        legsLost: 2,
        isEliminated: false,
        picks: [
          {
            id: 5,
            player: "Jayson Tatum",
            betType: "Points",
            target: 26.5,
            currentValue: 18,
            betDirection: "over",
            odds: "+115",
            status: "active",
            gameTime: "3rd Quarter",
            athleteImage: "☘️",
            sport: "NBA",
            gameStatus: "3rd_quarter",
            winProbability: 25,
          },
          {
            id: 6,
            player: "Kevin Durant",
            betType: "Points",
            target: 25.5,
            currentValue: 28,
            betDirection: "over",
            odds: "+115",
            status: "won",
            gameTime: "Final",
            athleteImage: "🐍",
            sport: "NBA",
            gameStatus: "final",
            winProbability: 100,
          },
          {
            id: 7,
            player: "Kawhi Leonard",
            betType: "Assists",
            target: 5.5,
            currentValue: 3,
            betDirection: "over",
            odds: "-115",
            status: "lost",
            gameTime: "Final",
            athleteImage: "🤖",
            sport: "NBA",
            gameStatus: "final",
            winProbability: 0,
          },
          {
            id: 8,
            player: "Nikola Jokić",
            betType: "Triple-Double",
            target: 0.5,
            currentValue: 0,
            betDirection: "over",
            odds: "+180",
            status: "won",
            gameTime: "Final",
            athleteImage: "🐴",
            sport: "NBA",
            gameStatus: "final",
            winProbability: 100,
          },
        ],
      },
      {
        id: 3,
        name: "Carlos Rodriguez",
        avatar: "🌟",
        isOnline: false,
        buyIn: 25,
        joinedAt: "45 minutes ago",
        currentScore: 1,
        legsWon: 1,
        legsLost: 3,
        isEliminated: false,
        picks: [
          {
            id: 9,
            player: "Damian Lillard",
            betType: "3-Pointers",
            target: 3.5,
            currentValue: 2,
            betDirection: "over",
            odds: "+105",
            status: "lost",
            gameTime: "Final",
            athleteImage: "⏰",
            sport: "NBA",
            gameStatus: "final",
            winProbability: 0,
          },
          {
            id: 10,
            player: "Anthony Davis",
            betType: "Blocks",
            target: 2.5,
            currentValue: 4,
            betDirection: "over",
            odds: "+120",
            status: "won",
            gameTime: "Final",
            athleteImage: "🏠",
            sport: "NBA",
            gameStatus: "final",
            winProbability: 100,
          },
          {
            id: 11,
            player: "Joel Embiid",
            betType: "Rebounds",
            target: 10.5,
            currentValue: 7,
            betDirection: "over",
            odds: "-110",
            status: "lost",
            gameTime: "Final",
            athleteImage: "🏠",
            sport: "NBA",
            gameStatus: "final",
            winProbability: 0,
          },
          {
            id: 12,
            player: "Devin Booker",
            betType: "Points",
            target: 24.5,
            currentValue: 19,
            betDirection: "over",
            odds: "+110",
            status: "lost",
            gameTime: "Final",
            athleteImage: "☀️",
            sport: "NBA",
            gameStatus: "final",
            winProbability: 0,
          },
        ],
      },
      {
        id: 4,
        name: "Matt Zimmermann",
        avatar: "🏆",
        isOnline: true,
        buyIn: 25,
        joinedAt: "30 minutes ago",
        currentScore: 2,
        legsWon: 2,
        legsLost: 2,
        isEliminated: false,
        picks: [
          {
            id: 13,
            player: "Ja Morant",
            betType: "Assists",
            target: 8.5,
            currentValue: 11,
            betDirection: "over",
            odds: "-115",
            status: "won",
            gameTime: "Final",
            athleteImage: "🎪",
            sport: "NBA",
            gameStatus: "final",
            winProbability: 100,
          },
          {
            id: 14,
            player: "Trae Young",
            betType: "Points",
            target: 25.5,
            currentValue: 22,
            betDirection: "over",
            odds: "+110",
            status: "lost",
            gameTime: "Final",
            athleteImage: "🐍",
            sport: "NBA",
            gameStatus: "final",
            winProbability: 0,
          },
          {
            id: 15,
            player: "Donovan Mitchell",
            betType: "3-Pointers",
            target: 3.5,
            currentValue: 5,
            betDirection: "over",
            odds: "+105",
            status: "won",
            gameTime: "Final",
            athleteImage: "🎯",
            sport: "NBA",
            gameStatus: "final",
            winProbability: 100,
          },
          {
            id: 16,
            player: "Zion Williamson",
            betType: "Rebounds",
            target: 7.5,
            currentValue: 6,
            betDirection: "over",
            odds: "-110",
            status: "lost",
            gameTime: "Final",
            athleteImage: "💪",
            sport: "NBA",
            gameStatus: "final",
            winProbability: 0,
          },
        ],
      },
      {
        id: 5,
        name: "Sarah Johnson",
        avatar: "🚀",
        isOnline: true,
        buyIn: 25,
        joinedAt: "20 minutes ago",
        currentScore: 3,
        legsWon: 3,
        legsLost: 1,
        isEliminated: false,
        picks: [
          {
            id: 17,
            player: "Jimmy Butler",
            betType: "Points",
            target: 22.5,
            currentValue: 25,
            betDirection: "over",
            odds: "+105",
            status: "won",
            gameTime: "Final",
            athleteImage: "🔥",
            sport: "NBA",
            gameStatus: "final",
            winProbability: 100,
          },
          {
            id: 18,
            player: "Kyrie Irving",
            betType: "Assists",
            target: 6.5,
            currentValue: 8,
            betDirection: "over",
            odds: "+115",
            status: "won",
            gameTime: "Final",
            athleteImage: "🎭",
            sport: "NBA",
            gameStatus: "final",
            winProbability: 100,
          },
          {
            id: 19,
            player: "Pascal Siakam",
            betType: "Rebounds",
            target: 8.5,
            currentValue: 6,
            betDirection: "over",
            odds: "-110",
            status: "lost",
            gameTime: "Final",
            athleteImage: "🌪️",
            sport: "NBA",
            gameStatus: "final",
            winProbability: 0,
          },
          {
            id: 20,
            player: "Russell Westbrook",
            betType: "Assists",
            target: 7.5,
            currentValue: 10,
            betDirection: "over",
            odds: "+120",
            status: "won",
            gameTime: "Final",
            athleteImage: "⚡",
            sport: "NBA",
            gameStatus: "final",
            winProbability: 100,
          },
        ],
      },
    ],
  });

  // Sample activity feed
  const [activityFeed] = useState<ActivityFeedItem[]>([
    {
      id: 1,
      type: "pick_won",
      player: "Jack Sturt",
      avatar: "🎯",
      message: "won LeBron James Points O28.5 (+110)",
      timestamp: "2 mins ago",
    },
    {
      id: 2,
      type: "score_update",
      player: "Emma Chen",
      avatar: "⚡",
      message: "Jayson Tatum now at 18 points (need 26.5)",
      timestamp: "3 mins ago",
    },
    {
      id: 3,
      type: "pick_won",
      player: "Matt Zimmermann",
      avatar: "🏆",
      message: "won Donovan Mitchell 3-Pointers O3.5 (+105)",
      timestamp: "5 mins ago",
    },
    {
      id: 4,
      type: "player_eliminated",
      player: "Carlos Rodriguez",
      avatar: "🌟",
      message: "has been eliminated (1/4 legs won)",
      timestamp: "8 mins ago",
    },
    {
      id: 5,
      type: "pick_lost",
      player: "Emma Chen",
      avatar: "⚡",
      message: "lost Kawhi Leonard Assists O5.5 (-115)",
      timestamp: "12 mins ago",
    },
    {
      id: 6,
      type: "game_start",
      player: "System",
      avatar: "🎮",
      message: "Lakers vs Celtics game started",
      timestamp: "15 mins ago",
    },
  ]);

  // Sample athlete updates data with more live updates
  const [athleteUpdates] = useState<AthleteUpdate[]>([
    {
      id: 1,
      athleteName: "LeBron James",
      athleteImage: "👑",
      sport: "NBA",
      updateType: "score_update",
      currentValue: 32,
      previousValue: 30,
      betType: "Points",
      gameTime: "4th Quarter - 2:15",
      gameStatus: "Live",
      affectedPlayers: ["Jack Sturt"],
      isPositive: true,
      timestamp: "30 seconds ago",
      description:
        "🔥 CLUTCH layup and-1! Now at 32 points, crushing the O28.5!",
    },
    {
      id: 2,
      athleteName: "Jayson Tatum",
      athleteImage: "☘️",
      sport: "NBA",
      updateType: "score_update",
      currentValue: 21,
      previousValue: 18,
      betType: "Points",
      gameTime: "4th Quarter - 8:42",
      gameStatus: "Live",
      affectedPlayers: ["Emma Chen"],
      isPositive: true,
      timestamp: "1 min ago",
      description:
        "🎯 Back-to-back threes! 5.5 points away from the over O26.5",
    },
    {
      id: 3,
      athleteName: "Steph Curry",
      athleteImage: "👨‍🦱",
      sport: "NBA",
      updateType: "milestone",
      currentValue: 6,
      previousValue: 5,
      betType: "3-Pointers",
      gameTime: "4th Quarter - 1:03",
      gameStatus: "Live",
      affectedPlayers: ["Jack Sturt"],
      isPositive: true,
      timestamp: "2 mins ago",
      description: "🎯 LOGO THREE! 6th three-pointer secures the O4.5 bet!",
    },
    {
      id: 4,
      athleteName: "Giannis Antetokounmpo",
      athleteImage: "🦌",
      sport: "NBA",
      updateType: "score_update",
      currentValue: 13,
      previousValue: 11,
      betType: "Rebounds",
      gameTime: "4th Quarter - 5:20",
      gameStatus: "Live",
      affectedPlayers: ["Jack Sturt"],
      isPositive: true,
      timestamp: "3 mins ago",
      description: "💪 Two offensive boards in a row! Just 1.5 away from O11.5",
    },
    {
      id: 5,
      athleteName: "Damian Lillard",
      athleteImage: "⏰",
      sport: "NBA",
      updateType: "score_update",
      currentValue: 3,
      previousValue: 2,
      betType: "3-Pointers",
      gameTime: "4th Quarter - 6:15",
      gameStatus: "Live",
      affectedPlayers: ["Carlos Rodriguez"],
      isPositive: true,
      timestamp: "4 mins ago",
      description:
        "⚡ Deep three from Dame! Getting closer to O3.5 - needs 1 more",
    },
    {
      id: 6,
      athleteName: "Anthony Davis",
      athleteImage: "🏠",
      sport: "NBA",
      updateType: "score_update",
      currentValue: 3,
      previousValue: 2,
      betType: "Blocks",
      gameTime: "4th Quarter - 7:33",
      gameStatus: "Live",
      affectedPlayers: ["Carlos Rodriguez"],
      isPositive: true,
      timestamp: "5 mins ago",
      description: "🚫 REJECTION at the rim! One more block needed for O2.5",
    },
    {
      id: 7,
      athleteName: "Ja Morant",
      athleteImage: "🎪",
      sport: "NBA",
      updateType: "milestone",
      currentValue: 11,
      previousValue: 8,
      betType: "Assists",
      gameTime: "Final",
      gameStatus: "Game Ended",
      affectedPlayers: ["Matt Zimmermann"],
      isPositive: true,
      timestamp: "6 mins ago",
      description: "🎪 THREE assists in 2 minutes! Secured the O8.5 bet!",
    },
    {
      id: 8,
      athleteName: "Kevin Durant",
      athleteImage: "🐍",
      sport: "NBA",
      updateType: "score_update",
      currentValue: 28,
      previousValue: 25,
      betType: "Points",
      gameTime: "Final",
      gameStatus: "Game Ended",
      affectedPlayers: ["Emma Chen"],
      isPositive: true,
      timestamp: "8 mins ago",
      description: "🐍 Ice cold fadeaway jumper sealed the O25.5!",
    },
    {
      id: 9,
      athleteName: "Russell Westbrook",
      athleteImage: "⚡",
      sport: "NBA",
      updateType: "score_update",
      currentValue: 8,
      previousValue: 7,
      betType: "Assists",
      gameTime: "3rd Quarter - 11:22",
      gameStatus: "Live",
      affectedPlayers: ["Sarah Johnson"],
      isPositive: true,
      timestamp: "8 mins ago",
      description: "⚡ Beautiful dime to teammate! Halfway to O7.5 assists",
    },
    {
      id: 10,
      athleteName: "Jimmy Butler",
      athleteImage: "🔥",
      sport: "NBA",
      updateType: "score_update",
      currentValue: 25,
      previousValue: 22,
      betType: "Points",
      gameTime: "Final",
      gameStatus: "Game Ended",
      affectedPlayers: ["Sarah Johnson"],
      isPositive: true,
      timestamp: "10 mins ago",
      description: "🔥 Tough shot over defender! Secured the O22.5 easily!",
    },
    {
      id: 11,
      athleteName: "Luka Dončić",
      athleteImage: "🇸🇮",
      sport: "NBA",
      updateType: "score_update",
      currentValue: 10,
      previousValue: 8,
      betType: "Assists",
      gameTime: "3rd Quarter - 2:45",
      gameStatus: "Live",
      affectedPlayers: ["Jack Sturt"],
      isPositive: true,
      timestamp: "12 mins ago",
      description: "🎯 Two no-look passes! Already crushed the O8.5 assists!",
    },
    {
      id: 12,
      athleteName: "Joel Embiid",
      athleteImage: "🏠",
      sport: "NBA",
      updateType: "score_update",
      currentValue: 8,
      previousValue: 7,
      betType: "Rebounds",
      gameTime: "3rd Quarter - 0:33",
      gameStatus: "Live",
      affectedPlayers: ["Carlos Rodriguez"],
      isPositive: false,
      timestamp: "15 mins ago",
      description:
        "🏠 Struggling on the boards tonight, needs 2.5 more for O10.5",
    },
    {
      id: 13,
      athleteName: "Trae Young",
      athleteImage: "🐍",
      sport: "NBA",
      updateType: "score_update",
      currentValue: 23,
      previousValue: 19,
      betType: "Points",
      gameTime: "3rd Quarter - 4:12",
      gameStatus: "Live",
      affectedPlayers: ["Matt Zimmermann"],
      isPositive: false,
      timestamp: "18 mins ago",
      description: "🎯 Quick 4 points but still 2.5 short of O25.5",
    },
    {
      id: 14,
      athleteName: "Kawhi Leonard",
      athleteImage: "🤖",
      sport: "NBA",
      updateType: "quarter_end",
      currentValue: 3,
      previousValue: 3,
      betType: "Assists",
      gameTime: "Final",
      gameStatus: "Game Ended",
      affectedPlayers: ["Emma Chen"],
      isPositive: false,
      timestamp: "20 mins ago",
      description:
        "🤖 Quiet night distributing, finished well under O5.5 assists",
    },
    {
      id: 15,
      athleteName: "Donovan Mitchell",
      athleteImage: "🎯",
      sport: "NBA",
      updateType: "milestone",
      currentValue: 5,
      previousValue: 3,
      betType: "3-Pointers",
      gameTime: "Final",
      gameStatus: "Game Ended",
      affectedPlayers: ["Matt Zimmermann"],
      isPositive: true,
      timestamp: "22 mins ago",
      description: "🎯 Clutch corner three! Sealed the O3.5 three-pointers!",
    },
    {
      id: 16,
      athleteName: "Nikola Jokić",
      athleteImage: "🐴",
      sport: "NBA",
      updateType: "milestone",
      currentValue: 1,
      previousValue: 0,
      betType: "Triple-Double",
      gameTime: "Final",
      gameStatus: "Game Ended",
      affectedPlayers: ["Emma Chen"],
      isPositive: true,
      timestamp: "25 mins ago",
      description: "🐴 Triple-double achieved! 10th assist completed the feat!",
    },
    {
      id: 17,
      athleteName: "Pascal Siakam",
      athleteImage: "🌪️",
      sport: "NBA",
      updateType: "score_update",
      currentValue: 6,
      previousValue: 5,
      betType: "Rebounds",
      gameTime: "Final",
      gameStatus: "Game Ended",
      affectedPlayers: ["Sarah Johnson"],
      isPositive: false,
      timestamp: "28 mins ago",
      description: "🌪️ Couldn't grab enough boards, finished under O8.5",
    },
    {
      id: 18,
      athleteName: "Devin Booker",
      athleteImage: "☀️",
      sport: "NBA",
      updateType: "score_update",
      currentValue: 19,
      previousValue: 16,
      betType: "Points",
      gameTime: "Final",
      gameStatus: "Game Ended",
      affectedPlayers: ["Carlos Rodriguez"],
      isPositive: false,
      timestamp: "30 mins ago",
      description: "☀️ Late scoring burst but came up short of O24.5 points",
    },
    {
      id: 19,
      athleteName: "Kyrie Irving",
      athleteImage: "🎭",
      sport: "NBA",
      updateType: "score_update",
      currentValue: 8,
      previousValue: 6,
      betType: "Assists",
      gameTime: "Final",
      gameStatus: "Game Ended",
      affectedPlayers: ["Sarah Johnson"],
      isPositive: true,
      timestamp: "32 mins ago",
      description: "🎭 Smooth playmaking all game, easily hit O6.5 assists!",
    },
    {
      id: 20,
      athleteName: "Zion Williamson",
      athleteImage: "💪",
      sport: "NBA",
      updateType: "score_update",
      currentValue: 6,
      previousValue: 4,
      betType: "Rebounds",
      gameTime: "Final",
      gameStatus: "Game Ended",
      affectedPlayers: ["Matt Zimmermann"],
      isPositive: false,
      timestamp: "35 mins ago",
      description: "💪 Not his usual rebounding night, fell short of O7.5",
    },
  ]);

  const getCurrentUserParticipant = () => {
    return gameInfo.participants.find((p) => p.name === gameInfo.currentUser);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "won":
        return "text-emerald-400 bg-emerald-400/20 border-emerald-400/30";
      case "lost":
        return "text-red-400 bg-red-400/20 border-red-400/30";
      case "active":
        return "text-blue-400 bg-blue-400/20 border-blue-400/30";
      default:
        return "text-slate-400 bg-slate-400/20 border-slate-400/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "won":
        return "✅";
      case "lost":
        return "❌";
      case "active":
        return "🔄";
      default:
        return "⏳";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "pick_won":
        return "🎉";
      case "pick_lost":
        return "💔";
      case "player_eliminated":
        return "⚡";
      case "game_start":
        return "🏀";
      case "game_end":
        return "🏁";
      case "score_update":
        return "📊";
      case "pick_added":
        return "➕";
      default:
        return "📢";
    }
  };

  const currentUser = getCurrentUserParticipant();
  const allPlayers = gameInfo.participants;
  const sortedPlayers = [...allPlayers].sort(
    (a, b) => b.currentScore - a.currentScore
  );

  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <h2 className="text-2xl font-bold text-white">LIVE</h2>
              <span className="text-lg font-semibold text-white">
                {gameInfo.name}
              </span>
            </div>
            <p className="text-slate-400">
              Game in progress • {allPlayers.length} players competing
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-400">
              {gameInfo.participants.filter((p) => p.isOnline).length}/
              {gameInfo.participants.length} online
            </span>
          </div>
        </div>

        {/* Enhanced Host Info - Similar to Join Game Component */}
        <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl flex items-center justify-center text-3xl shadow-xl">
                {gameInfo.hostAvatar}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 flex items-center justify-center text-xs shadow-lg">
                👑
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-xl">
                {gameInfo.hostName}
              </h3>
              <p className="text-slate-400 text-sm">
                Host • Started {gameInfo.createdAt}
              </p>
              <div className="mt-2">
                <h4 className="text-lg font-semibold text-white">
                  {gameInfo.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-slate-300 font-medium">
                    {allPlayers.length} players competing
                  </span>
                  <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                  <span className="text-slate-400 text-sm">
                    {gameInfo.legs} legs
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-400">
                ${gameInfo.maxPayout}
              </div>
              <div className="text-sm text-slate-400">Prize Pool</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Game Details - Similar to Join Game */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 shadow-2xl hover:shadow-[#00CED1]/10 transition-all duration-300 hover:scale-105">
            <div className="text-slate-400 text-sm">Total Players</div>
            <div className="text-white font-bold text-xl">
              {allPlayers.length}
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 hover:scale-105">
            <div className="text-slate-400 text-sm">Prize Pool</div>
            <div className="text-emerald-400 font-bold text-xl">
              ${gameInfo.maxPayout}
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-105">
            <div className="text-slate-400 text-sm">Total Legs</div>
            <div className="text-white font-bold text-xl">{gameInfo.legs}</div>
          </div>
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 shadow-2xl hover:shadow-slate-500/10 transition-all duration-300 hover:scale-105">
            <div className="text-slate-400 text-sm">Visibility</div>
            <div className="text-slate-300 font-bold text-xl capitalize">
              {gameInfo.visibility}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - Player Views */}
          <div className="lg:col-span-2">
            {/* Enhanced Glassmorphic Tab Navigation */}
            <div className="mb-6">
              <div className="relative bg-gradient-to-r from-slate-800/30 to-slate-900/30 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 shadow-2xl">
                <div className="flex relative">
                  {/* Animated Background Slider */}
                  <div
                    className={`absolute top-1.5 h-[calc(100%-12px)] bg-gradient-to-r from-[#00CED1]/80 to-blue-500/80 backdrop-blur-sm rounded-xl transition-all duration-300 ease-out shadow-lg shadow-[#00CED1]/20 ${
                      activeTab === "my_picks"
                        ? "left-1.5 w-[calc(50%-6px)]"
                        : "left-[calc(50%+1.5px)] w-[calc(50%-6px)]"
                    }`}
                  />

                  <button
                    onClick={() => setActiveTab("my_picks")}
                    className={`relative z-10 flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ease-out ${
                      activeTab === "my_picks"
                        ? "text-white shadow-lg"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>My Picks</span>
                      <div
                        className={`px-2 py-0.5 rounded-full text-xs font-bold transition-all duration-300 ${
                          activeTab === "my_picks"
                            ? "bg-white/20 text-white"
                            : "bg-slate-700/50 text-slate-300"
                        }`}
                      >
                        {currentUser?.picks.length || 0}
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab("all_players")}
                    className={`relative z-10 flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ease-out ${
                      activeTab === "all_players"
                        ? "text-white shadow-lg"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>All Players</span>
                      <div
                        className={`px-2 py-0.5 rounded-full text-xs font-bold transition-all duration-300 ${
                          activeTab === "all_players"
                            ? "bg-white/20 text-white"
                            : "bg-slate-700/50 text-slate-300"
                        }`}
                      >
                        {gameInfo.participants.length}
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* My Picks Tab */}
            {activeTab === "my_picks" && currentUser && (
              <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl flex items-center justify-center text-2xl">
                        {currentUser.avatar}
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">
                          {currentUser.name}
                        </h3>
                        <p className="text-slate-400 text-sm">
                          {currentUser.legsWon}/{gameInfo.legs} legs won
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">
                        {currentUser.currentScore}
                      </div>
                      <div className="text-sm text-slate-400">Score</div>
                    </div>
                  </div>

                  {/* TriColor Progress Bar */}
                  <div className="mt-4">
                    <TriColorProgressBar
                      totalBets={currentUser.picks.length}
                      wonBets={
                        currentUser.picks.filter((p) => p.status === "won")
                          .length
                      }
                      activeBets={
                        currentUser.picks.filter((p) => p.status === "active")
                          .length
                      }
                      lostBets={
                        currentUser.picks.filter((p) => p.status === "lost")
                          .length
                      }
                    />
                  </div>
                </div>

                <div className="divide-y divide-slate-700/30">
                  {currentUser.picks.map((pick) => (
                    <div
                      key={pick.id}
                      className="p-4 hover:bg-slate-700/20 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 backdrop-blur-lg bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-xl">
                            {pick.athleteImage}
                          </div>
                          <div>
                            <h6 className="text-white font-semibold leading-tight">
                              {pick.player}
                            </h6>
                            <p className="text-slate-400 text-sm">
                              {pick.betType} {pick.betDirection} {pick.target} •{" "}
                              {pick.odds}
                            </p>
                            <p className="text-slate-500 text-xs">
                              {pick.sport} • {pick.gameTime}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(pick.status)}`}
                            >
                              {getStatusIcon(pick.status)}{" "}
                              {pick.status.replace("_", " ").toUpperCase()}
                            </span>
                          </div>
                          <div className="text-white font-semibold">
                            {pick.currentValue} / {pick.target}
                          </div>
                          {pick.status === "active" &&
                            pick.winProbability !== undefined && (
                              <div className="text-xs text-slate-400">
                                {pick.winProbability}% win chance
                              </div>
                            )}
                        </div>
                      </div>

                      {/* Progress indicator for active picks */}
                      {pick.status === "active" && (
                        <div className="mt-3">
                          <div className="flex gap-1">
                            <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-500 ${
                                  pick.betDirection === "over"
                                    ? pick.currentValue >= pick.target
                                      ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                                      : "bg-gradient-to-r from-blue-400 to-blue-500"
                                    : pick.currentValue <= pick.target
                                      ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                                      : "bg-gradient-to-r from-blue-400 to-blue-500"
                                }`}
                                style={{
                                  width: `${Math.min(100, Math.max(10, (pick.currentValue / pick.target) * 100))}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Players Tab */}
            {activeTab === "all_players" && (
              <div className="space-y-4">
                {sortedPlayers.map((participant, index) => (
                  <div key={participant.id} className="space-y-3">
                    {/* Enhanced Participant Header - Same style as Join Game */}
                    <div
                      className={`bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer shadow-2xl ${
                        isParticipantExpanded(participant.id)
                          ? "border-[#00CED1] shadow-[#00CED1]/20"
                          : "hover:border-slate-600 hover:shadow-slate-600/10"
                      }`}
                      onClick={() => toggleParticipant(participant.id)}
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-12 h-12 backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl flex items-center justify-center text-2xl shadow-xl">
                                {participant.avatar}
                              </div>
                              <div
                                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-800 ${
                                  participant.isOnline
                                    ? "bg-emerald-400"
                                    : "bg-slate-500"
                                }`}
                              ></div>
                              {index === 0 && (
                                <div className="absolute -top-1 -left-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-slate-800 flex items-center justify-center text-xs">
                                  👑
                                </div>
                              )}
                            </div>
                            <div>
                              <h4 className="text-white font-bold leading-tight">
                                {participant.name}
                              </h4>
                              <p className="text-slate-400 text-sm">
                                Score: {participant.currentScore} •{" "}
                                {participant.legsWon}W/{participant.legsLost}L
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <div className="text-sm text-slate-300">
                                #{index + 1}
                              </div>
                              <div className="text-xs text-slate-500">
                                {participant.isEliminated
                                  ? "Eliminated"
                                  : "Active"}
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

                        {/* Quick Picks Preview - Same as Join Game */}
                        <div className="mt-3">
                          <div className="flex gap-1">
                            {participant.picks
                              .slice(0, 4)
                              .map((pick, pickIndex) => (
                                <div
                                  key={pick.id}
                                  className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden"
                                >
                                  <div
                                    className={`h-full ${
                                      pick.status === "won"
                                        ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                                        : pick.status === "lost"
                                          ? "bg-gradient-to-r from-red-400 to-red-500"
                                          : pick.status === "active"
                                            ? "bg-gradient-to-r from-blue-400 to-blue-500"
                                            : "bg-gradient-to-r from-slate-500 to-slate-600"
                                    }`}
                                    style={{ width: "100%" }}
                                  />
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Expanded Picks List - Same style as Join Game */}
                    {isParticipantExpanded(participant.id) && (
                      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden animate-in slide-in-from-top-2 duration-300 shadow-2xl shadow-[#00CED1]/10">
                        <div className="p-4 border-b border-slate-700/50">
                          <h5 className="text-white font-bold">
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
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 backdrop-blur-lg bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-lg">
                                    {pick.athleteImage}
                                  </div>
                                  <div>
                                    <h6 className="text-white font-semibold text-sm leading-tight">
                                      {pick.player}
                                    </h6>
                                    <p className="text-slate-400 text-xs">
                                      {pick.sport} • {pick.gameTime}
                                    </p>
                                  </div>
                                </div>

                                <div className="text-right">
                                  <div className="text-white font-semibold text-sm">
                                    {pick.betType} {pick.betDirection}{" "}
                                    {pick.target}
                                  </div>
                                  <div className="text-slate-400 text-xs">
                                    {pick.currentValue} / {pick.target} •{" "}
                                    {pick.odds}
                                  </div>
                                  <span
                                    className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium border ${getStatusColor(pick.status)}`}
                                  >
                                    {getStatusIcon(pick.status)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Enhanced Glassmorphic Sidebar Tab Navigation */}
            <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
              <div className="relative bg-gradient-to-r from-slate-800/30 to-slate-900/30 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 shadow-inner">
                <div className="flex relative">
                  {/* Animated Background Slider */}
                  <div
                    className={`absolute top-1.5 h-[calc(100%-12px)] bg-gradient-to-r from-[#00CED1]/80 to-blue-500/80 backdrop-blur-sm rounded-xl transition-all duration-300 ease-out shadow-lg shadow-[#00CED1]/20 ${
                      sidebarTab === "live_feed"
                        ? "left-1.5 w-[calc(33.33%-4px)]"
                        : sidebarTab === "leaderboard"
                          ? "left-[calc(33.33%+1.5px)] w-[calc(33.33%-4px)]"
                          : "left-[calc(66.66%+1.5px)] w-[calc(33.33%-4px)]"
                    }`}
                  />

                  <button
                    onClick={() => setSidebarTab("live_feed")}
                    className={`relative z-10 flex-1 px-3 py-3 rounded-xl font-semibold transition-all duration-300 ease-out ${
                      sidebarTab === "live_feed"
                        ? "text-white shadow-lg"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <div
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          sidebarTab === "live_feed"
                            ? "bg-white animate-pulse"
                            : "bg-slate-500"
                        }`}
                      ></div>
                      <span className="text-xs">Feed</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setSidebarTab("leaderboard")}
                    className={`relative z-10 flex-1 px-3 py-3 rounded-xl font-semibold transition-all duration-300 ease-out ${
                      sidebarTab === "leaderboard"
                        ? "text-white shadow-lg"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>🏆</span>
                      <span className="text-xs">Board</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setSidebarTab("athlete_updates")}
                    className={`relative z-10 flex-1 px-3 py-3 rounded-xl font-semibold transition-all duration-300 ease-out ${
                      sidebarTab === "athlete_updates"
                        ? "text-white shadow-lg"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>🏃‍♂️</span>
                      <span className="text-xs">Athletes</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Activity Feed */}
            {sidebarTab === "live_feed" && (
              <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-slate-700/50">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    Live Feed
                  </h3>
                  <p className="text-slate-400 text-sm">Real-time updates</p>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {activityFeed.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 border-b border-slate-700/30 hover:bg-slate-700/20 transition-all duration-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 backdrop-blur-lg bg-white/10 border border-white/20 rounded-lg flex items-center justify-center text-sm">
                          {item.player === "System"
                            ? getActivityIcon(item.type)
                            : item.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="text-white text-sm">
                            <span className="font-semibold">{item.player}</span>{" "}
                            {item.message}
                          </div>
                          <div className="text-slate-500 text-xs mt-1">
                            {item.timestamp}
                          </div>
                        </div>
                        <div className="text-lg">
                          {getActivityIcon(item.type)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Leaderboard */}
            {sidebarTab === "leaderboard" && (
              <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-slate-700/50">
                  <h3 className="text-white font-bold text-lg">Leaderboard</h3>
                  <p className="text-slate-400 text-sm">Current standings</p>
                </div>

                <div className="divide-y divide-slate-700/30">
                  {sortedPlayers.slice(0, 5).map((participant, index) => (
                    <div
                      key={participant.id}
                      className="p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0
                              ? "bg-amber-500 text-white"
                              : index === 1
                                ? "bg-slate-400 text-white"
                                : index === 2
                                  ? "bg-amber-600 text-white"
                                  : "bg-slate-600 text-white"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="w-8 h-8 backdrop-blur-lg bg-white/10 border border-white/20 rounded-lg flex items-center justify-center text-sm">
                          {participant.avatar}
                        </div>
                        <div>
                          <div className="text-white font-semibold text-sm">
                            {participant.name}
                          </div>
                          <div className="text-slate-400 text-xs">
                            {participant.legsWon}W / {participant.legsLost}L
                          </div>
                        </div>
                      </div>
                      <div className="text-white font-bold">
                        {participant.currentScore}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Athlete Updates */}
            {sidebarTab === "athlete_updates" && (
              <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-slate-700/50">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <span>🏃‍♂️</span>
                    Athlete Updates
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Live performance tracking
                  </p>

                  {/* Sub-tabs for My Picks vs Lobby Picks */}
                  <div className="mt-4">
                    <div className="relative bg-gradient-to-r from-slate-800/30 to-slate-900/30 backdrop-blur-xl border border-white/10 rounded-xl p-1 shadow-inner">
                      <div className="flex relative">
                        {/* Animated Background Slider */}
                        <div
                          className={`absolute top-1 h-[calc(100%-8px)] bg-gradient-to-r from-[#00CED1]/60 to-blue-500/60 backdrop-blur-sm rounded-lg transition-all duration-300 ease-out ${
                            athleteUpdatesTab === "my_picks"
                              ? "left-1 w-[calc(50%-4px)]"
                              : "left-[calc(50%+1px)] w-[calc(50%-4px)]"
                          }`}
                        />

                        <button
                          onClick={() => setAthleteUpdatesTab("my_picks")}
                          className={`relative z-10 flex-1 px-3 py-2 rounded-lg font-medium transition-all duration-300 ease-out text-xs ${
                            athleteUpdatesTab === "my_picks"
                              ? "text-white"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          My Picks
                        </button>

                        <button
                          onClick={() => setAthleteUpdatesTab("lobby_picks")}
                          className={`relative z-10 flex-1 px-3 py-2 rounded-lg font-medium transition-all duration-300 ease-out text-xs ${
                            athleteUpdatesTab === "lobby_picks"
                              ? "text-white"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          Lobby Picks
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {athleteUpdatesTab === "my_picks" && (
                    <div>
                      {athleteUpdates
                        .filter(
                          (update) =>
                            currentUser &&
                            update.affectedPlayers.includes(currentUser.name)
                        )
                        .map((update) => (
                          <div
                            key={update.id}
                            className="p-4 border-b border-slate-700/30 hover:bg-slate-700/20 transition-all duration-200"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 backdrop-blur-lg bg-white/10 border border-white/20 rounded-lg flex items-center justify-center text-lg">
                                {update.athleteImage}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h6 className="text-white font-semibold text-sm">
                                    {update.athleteName}
                                  </h6>
                                  <div
                                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                                      update.isPositive
                                        ? "bg-emerald-400/20 text-emerald-400 border border-emerald-400/30"
                                        : "bg-red-400/20 text-red-400 border border-red-400/30"
                                    }`}
                                  >
                                    {update.isPositive
                                      ? "✅ Good"
                                      : "❌ Behind"}
                                  </div>
                                </div>
                                <p className="text-slate-400 text-xs mb-1">
                                  {update.betType}: {update.currentValue}
                                  {update.previousValue &&
                                    ` (was ${update.previousValue})`}
                                </p>
                                <p className="text-slate-300 text-xs mb-2">
                                  {update.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-500 text-xs">
                                    {update.gameTime} • {update.timestamp}
                                  </span>
                                  <span
                                    className={`text-xs ${
                                      update.isPositive
                                        ? "text-emerald-400"
                                        : "text-red-400"
                                    }`}
                                  >
                                    {update.sport}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {athleteUpdatesTab === "lobby_picks" && (
                    <div>
                      {athleteUpdates.map((update) => (
                        <div
                          key={update.id}
                          className="p-4 border-b border-slate-700/30 hover:bg-slate-700/20 transition-all duration-200"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 backdrop-blur-lg bg-white/10 border border-white/20 rounded-lg flex items-center justify-center text-lg">
                              {update.athleteImage}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h6 className="text-white font-semibold text-sm">
                                  {update.athleteName}
                                </h6>
                                <div
                                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                                    update.isPositive
                                      ? "bg-emerald-400/20 text-emerald-400 border border-emerald-400/30"
                                      : "bg-red-400/20 text-red-400 border border-red-400/30"
                                  }`}
                                >
                                  {update.isPositive ? "✅ Hit" : "❌ Miss"}
                                </div>
                              </div>
                              <p className="text-slate-400 text-xs mb-1">
                                {update.betType}: {update.currentValue}
                                {update.previousValue &&
                                  ` (was ${update.previousValue})`}
                              </p>
                              <p className="text-slate-300 text-xs mb-2">
                                {update.description}
                              </p>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-slate-500 text-xs">
                                  {update.gameTime} • {update.timestamp}
                                </span>
                                <span
                                  className={`text-xs ${
                                    update.isPositive
                                      ? "text-emerald-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {update.sport}
                                </span>
                              </div>
                              {/* Affected Players */}
                              <div className="flex items-center gap-1 flex-wrap">
                                <span className="text-slate-500 text-xs">
                                  Affects:
                                </span>
                                {update.affectedPlayers.map(
                                  (playerName, index) => {
                                    const player = gameInfo.participants.find(
                                      (p) => p.name === playerName
                                    );
                                    return (
                                      <div
                                        key={index}
                                        className="flex items-center gap-1"
                                      >
                                        <div className="w-4 h-4 backdrop-blur-lg bg-white/10 border border-white/20 rounded text-xs flex items-center justify-center">
                                          {player?.avatar || "👤"}
                                        </div>
                                        <span className="text-slate-400 text-xs">
                                          {playerName}
                                        </span>
                                        {index <
                                          update.affectedPlayers.length - 1 && (
                                          <span className="text-slate-600 text-xs">
                                            •
                                          </span>
                                        )}
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Pick Modal (placeholder) */}
      {showAddPickModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-700">
            <h3 className="text-white font-bold text-xl mb-4">Add New Pick</h3>
            <p className="text-slate-400 mb-4">Feature coming soon...</p>
            <button
              onClick={() => setShowAddPickModal(false)}
              className="w-full bg-gradient-to-r from-[#00CED1] to-blue-500 hover:from-[#00CED1]/90 hover:to-blue-500/90 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
