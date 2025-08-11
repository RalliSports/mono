"use client";

import CompactPlayerCards from "@/components/gambling/compact-player-cards";
import CompactPlayerCard2 from "@/components/gambling/compact-player-card-2";
import ParlayProgressTracker from "@/components/gambling/parlay-progress-tracker";
import OtherPlayersParlays from "@/components/gambling/other-players-parlays";
import LobbyPicksViewer from "@/components/gambling/lobby-picks-viewer";
import JoinGameComponent from "@/components/gambling/join-game-component";
import HostGameComponentCompact from "@/components/gambling/host-game-component-compact";
import HostGameComponent from "@/components/gambling/host-game-component";
import JoinGameComponentCompact2 from "@/components/gambling/join-game-component-compact-2";
import JoinGameComponentCompact1 from "@/components/gambling/join-game-component-compact-1";
import LiveLobbyComponent from "@/components/gambling/live-lobby-component";
import CompletedGameComponent from "@/components/gambling/completed-game-component";

export default function NewComponentsShowcase() {
  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 border-b border-gray-700/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-slate-800 border border-slate-700 rounded-full px-6 py-3 mb-8">
              <div className="w-2 h-2 bg-[#00CED1] rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
                New Components Showcase
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Latest{" "}
              <span className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] bg-clip-text text-transparent">
                Ralli Components
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Recently developed gambling UI components featuring enhanced
              player cards and social betting experiences
            </p>
          </div>
        </div>
      </div>

      {/* Components Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        {/* Compact Player Cards (Vertical Layout) */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-r from-[#FFAB91] to-[#00CED1] rounded-full mr-4"></span>
            Compact Player Cards (Vertical)
          </h2>
          <div className="mb-6">
            <p className="text-slate-300 text-lg mb-4">
              Streamlined player cards with swipeable multiple stats, arrow
              navigation, and compact design featuring buttons below stats.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-slate-400">
              <div>
                📊 <strong>Multi-Stat Navigation</strong> - Swipe or click
                through different player statistics
              </div>
              <div>
                🎯 <strong>Over/Under Betting</strong> - Large, accessible
                betting buttons with hover effects
              </div>
              <div>
                📱 <strong>Mobile Optimized</strong> - Touch-friendly design
                with smooth animations
              </div>
            </div>
          </div>
          <CompactPlayerCards />
        </div>

        {/* Compact Player Cards 2 (Horizontal Layout) */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4"></span>
            Compact Player Cards 2 (Horizontal)
          </h2>
          <div className="mb-6">
            <p className="text-slate-300 text-lg mb-4">
              Horizontal layout variant with stats on the left and enhanced
              over/under buttons stacked vertically on the right.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-slate-400">
              <div>
                ↔️ <strong>Horizontal Layout</strong> - Stats and buttons side
                by side for better space utilization
              </div>
              <div>
                🎮 <strong>Enhanced UX</strong> - Larger buttons with odds
                display for improved interaction
              </div>
              <div>
                ✨ <strong>Modern Design</strong> - Glassmorphic effects with
                gradient backgrounds
              </div>
            </div>
          </div>
          <CompactPlayerCard2 />
        </div>

        {/* Live Parlay Progress Dashboard */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-4"></span>
            Live Parlay Progress Dashboard
          </h2>
          <div className="mb-6">
            <p className="text-slate-300 text-lg mb-4">
              Beautiful 3-column parlay dashboard showcasing your friends'
              weekend action in real-time.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-slate-400">
              <div>
                ✨ <strong>Multi-Sport Parlays</strong> - NBA, NFL, and mixed
                sport betting with live tracking
              </div>
              <div>
                🔄 <strong>Real-time Updates</strong> - Live progress with
                smooth animations and status indicators
              </div>
              <div>
                📊 <strong>Smart Progress</strong> - Visual indicators for wins,
                losses, and pending bets
              </div>
            </div>
          </div>
          <ParlayProgressTracker />
        </div>

        {/* Other Players' Parlays Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-purple-500 rounded-full mr-4"></span>
            Lobby Parlays
          </h2>
          <div className="mb-6">
            <p className="text-slate-300 text-lg mb-4">
              View other players' parlays in the lobby with live progress
              tracking and social interaction features.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-slate-400">
              <div>
                👥 <strong>Player Rankings</strong> - See how others are
                performing with win rates
              </div>
              <div>
                📈 <strong>Live Progress</strong> - Real-time bet tracking for
                all players in the lobby
              </div>
              <div>
                🎯 <strong>Performance Metrics</strong> - Historical performance
                indicators and statistics
              </div>
            </div>
          </div>
          <OtherPlayersParlays />
        </div>

        {/* Lobby Picks Viewer Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4"></span>
            Live Picks Viewer
          </h2>
          <div className="mb-6">
            <p className="text-slate-300 text-lg mb-4">
              See what everyone in the lobby is betting on with real-time
              updates and social betting features.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-slate-400">
              <div>
                🎯 <strong>Individual Picks</strong> - Each player's current
                bets with detailed information
              </div>
              <div>
                📱 <strong>Real-time Updates</strong> - Live scores and progress
                tracking across all games
              </div>
              <div>
                👥 <strong>Social Betting</strong> - Follow the action together
                with friends and community
              </div>
            </div>
          </div>
          <LobbyPicksViewer />
        </div>

        {/* Join Game Component */}
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-white">
              Join Game Component 🎮
            </h2>
          </div>
          <JoinGameComponent />
        </div>
        {/* Compact Join Game Components */}
        <div className="space-y-6 mt-20">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-white">
              Compact Join Game Variations 🎯
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Two smaller components showcasing different sports and lobby
              configurations for side-by-side display.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* NFL Component */}
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white">
                  NFL Monday Night 🏈
                </h3>
                <p className="text-slate-400 text-sm">
                  6-player private lobby • $50 buy-in
                </p>
              </div>
              <JoinGameComponentCompact1 />
            </div>

            {/* Soccer & Hockey Component */}
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white">
                  Champions League & NHL ⚽🏒
                </h3>
                <p className="text-slate-400 text-sm">
                  10-player public lobby • $35 buy-in
                </p>
              </div>
              <JoinGameComponentCompact2 />
            </div>
          </div>
        </div>

        {/* Host Game Component */}
        <div className="space-y-6 mt-20">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-white">
              Host Game Component 🎯
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Create and manage your own contests with comprehensive settings
              for buy-in, player limits, contest legs, and bet types.
            </p>
          </div>
          <HostGameComponent />
        </div>

        {/* Compact Host Game Component */}
        <div className="space-y-6 mt-20">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-white">
              Compact Host Game Component ⚾🎾
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Tennis & Baseball themed compact hosting interface with
              streamlined creation and management features.
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <HostGameComponentCompact />
          </div>
        </div>

        {/* Live Lobby Component */}
        <div className="space-y-6 mt-20">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-white">
              Live Lobby Component 🔴
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Real-time game lobby with live updates, player tracking, activity
              feed, and interactive gameplay management.
            </p>
          </div>
          <div className="w-full">
            <LiveLobbyComponent />
          </div>
        </div>

        {/* Completed Game Component */}
        <div className="space-y-6 mt-20">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-white">
              Completed Game Component 🏆
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Post-game results showing final standings, payouts, performance
              breakdown, and end-game chat with celebration elements for
              winners.
            </p>
          </div>
          <div className="w-full">
            <CompletedGameComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
