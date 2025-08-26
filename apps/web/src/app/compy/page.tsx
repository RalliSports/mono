"use client";

import PlayerDashboard from "@/components/gambling/player-dashboard";
import SelectedPlayers from "@/components/gambling/selected-players";
import StakeControls from "@/components/gambling/stake-controls";
import CategoryFilters from "@/components/gambling/category-filters";
import PlayerCards from "@/components/gambling/player-cards";
import CompactPlayerCards from "@/components/gambling/compact-player-cards";
import CompactPlayerCard2 from "@/components/gambling/compact-player-card-2";
import BetSlip from "@/components/gambling/bet-slip";
import CategoryTabs from "@/components/gambling/category-tabs";
import LiveScoreboard from "@/components/gambling/live-scoreboard";
import TrendingPlayers from "@/components/gambling/trending-players";
import OddsDisplay from "@/components/gambling/odds-display";
import UserProfileDrawer from "@/components/gambling/user-profile-drawer";
import TransactionHistory from "@/components/gambling/transaction-history";
import WalletTopUpModal from "@/components/gambling/wallet-topup-modal";
import LeaderboardComponent from "@/components/gambling/leaderboard-component";
import ReferralBonusPopup from "@/components/gambling/referral-bonus-popup";
import ChatSocialFeed from "@/components/gambling/chat-social-feed";
import GameCreation from "@/components/gambling/game-creation";
import SocialActivityFeed from "@/components/gambling/social-activity-feed-enhanced";
import LivePlayerDashboard from "@/components/gambling/live-player-dashboard";
import ParlayProgressTracker from "@/components/gambling/parlay-progress-tracker";
import OtherPlayersParlays from "@/components/gambling/other-players-parlays";
import LobbyPicksViewer from "@/components/gambling/lobby-picks-viewer";
import JoinGameComponent from "@/components/gambling/join-game-component";
import JoinGameComponentCompact1 from "@/components/gambling/join-game-component-compact-1";
import JoinGameComponentCompact2 from "@/components/gambling/join-game-component-compact-2";
import HostGameComponent from "@/components/gambling/host-game-component";
import HostGameComponentCompact from "@/components/gambling/host-game-component-compact";
import LiveLobbyComponent from "@/components/gambling/live-lobby-component";
import CompletedGameComponent from "@/components/gambling/completed-game-component";
import { useParaWalletBalance } from '@/hooks/use-para-wallet-balance'


export default function ComponentsShowcase() {
  

  const { isConnected, balances, isLoading: balanceLoading, error: balanceError } = useParaWalletBalance()
  // Format balance for display
  const formatBalance = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }
  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 border-b border-gray-700/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-slate-800 border border-slate-700 rounded-full px-6 py-3 mb-8">
              <div className="w-2 h-2 bg-[#00CED1] rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
                Component Showcase
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ralli{" "}
              <span className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] bg-clip-text text-transparent">
                Gambling Components
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Advanced gambling UI components built for modern sports betting
              experiences
            </p>
          </div>
        </div>
      </div>

      {/* Components Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        {/* Dashboard Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4"></span>
            Player Dashboard
          </h2>
          <PlayerDashboard />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-[#FFAB91] to-[#00CED1] rounded-full mr-4"></span>
              Selected Players
            </h2>
            <SelectedPlayers/>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4"></span>
              Stake Controls
            </h2>
            <StakeControls />
          </div>
        </div>

        {/* Filters and Tabs */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-r from-[#FFAB91] to-[#00CED1] rounded-full mr-4"></span>
            Navigation & Filters
          </h2>
          <div className="space-y-8">
            <CategoryFilters />
            <CategoryTabs />
          </div>
        </div>

        {/* Player Cards Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4"></span>
            Player Cards
          </h2>
          <PlayerCards />
        </div>

        {/* Compact Player Cards Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-r from-[#FFAB91] to-[#00CED1] rounded-full mr-4"></span>
            Compact Player Cards
          </h2>
          <div className="mb-4">
            <p className="text-slate-300 text-sm">
              Streamlined player cards with swipeable multiple stats, arrow
              navigation, and compact design
            </p>
          </div>
          <CompactPlayerCards />
        </div>

        {/* Compact Player Cards 2 (Horizontal Layout) */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4"></span>
            Compact Player Cards 2 (Horizontal)
          </h2>
          <div className="mb-4">
            <p className="text-slate-300 text-sm">
              Horizontal layout variant with stats on left and over/under
              buttons stacked vertically on the right
            </p>
          </div>
          <CompactPlayerCard2 />
        </div>

        {/* Bet Slip and Scoreboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-[#FFAB91] to-[#00CED1] rounded-full mr-4"></span>
              Bet Slip
            </h2>
            <BetSlip />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4"></span>
              Live Scoreboard
            </h2>
            <LiveScoreboard />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4"></span>
              Trending Players
            </h2>
            <TrendingPlayers />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-[#FFAB91] to-[#00CED1] rounded-full mr-4"></span>
              Odds Display
            </h2>
            <OddsDisplay />
          </div>
        </div>

        {/* User Experience Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4"></span>
            User Experience Components
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Transaction History
              </h3>
              <TransactionHistory />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Leaderboard
              </h3>
              <LeaderboardComponent />
            </div>
          </div>
        </div>

        {/* Modals & Drawers Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-r from-[#FFAB91] to-[#00CED1] rounded-full mr-4"></span>
            Modals & Drawers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                User Profile Drawer
              </h3>
              <UserProfileDrawer />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Wallet Top-Up Modal
              </h3>
              <WalletTopUpModal />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Referral Program
              </h3>
              <ReferralBonusPopup type="referral" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Bonus Offers
              </h3>
              <ReferralBonusPopup type="bonus" />
            </div>
          </div>
        </div>

        {/* Social & Community Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-r from-[#FFAB91] to-[#00CED1] rounded-full mr-4"></span>
            Social & Community
          </h2>
          <ChatSocialFeed />
        </div>

        {/* Game Creation Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4"></span>
            Multiplayer Contest Creation
          </h2>
          <div className="mb-4">
            <p className="text-slate-300 text-sm">
              Create parlay battles where players compete to get the most
              correct predictions across multiple bet legs
            </p>
          </div>
          <GameCreation />
        </div>

        {/* Social Activity Feed Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-r from-[#FFAB91] to-[#00CED1] rounded-full mr-4"></span>
            Social Activity Feed
          </h2>
          <div className="mb-4">
            <p className="text-slate-300 text-sm">
              Stay connected with friends, discover hot lobbies, celebrate big
              wins, and follow the community action
            </p>
          </div>
          <SocialActivityFeed />
        </div>

        {/* Live Player Dashboard Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-purple-500 rounded-full mr-4"></span>
            Live Player Dashboard
          </h2>
          <div className="mb-4">
            <p className="text-slate-300 text-sm">
              Real-time tracking of your active bets, live game updates,
              enhanced player stats with current streak and global rankings
            </p>
          </div>
          <LivePlayerDashboard />
        </div>

        {/* Dynamic Bet Progress Section */}
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
                sport betting
              </div>
              <div>
                🔄 <strong>Live Tracking</strong> - Real-time progress with
                smooth animations
              </div>
              <div>
                📊 <strong>Smart Progress</strong> - Visual indicators for wins,
                losses, and pending bets
              </div>
            </div>
          </div>
          <ParlayProgressTracker />
        </div>
      </div>

      {/* Other Players' Parlays Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-white">
              Lobby{" "}
              <span className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] bg-clip-text text-transparent">
                Parlays
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              View other players' parlays in the lobby with live progress
              tracking
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400 max-w-2xl mx-auto">
              <div>
                👥 <strong>Player Rankings</strong> - See how others are
                performing
              </div>
              <div>
                📈 <strong>Live Progress</strong> - Real-time bet tracking for
                all players
              </div>
              <div>
                🎯 <strong>Win Rates</strong> - Historical performance
                indicators
              </div>
            </div>
          </div>
          <OtherPlayersParlays />
        </div>
      </div>

      {/* Lobby Picks Viewer Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-white">
              Live{" "}
              <span className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] bg-clip-text text-transparent">
                Picks
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              See what everyone in the lobby is betting on with real-time
              updates
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400 max-w-2xl mx-auto">
              <div>
                🎯 <strong>Individual Picks</strong> - Each player's current
                bets
              </div>
              <div>
                📱 <strong>Real-time Updates</strong> - Live scores and progress
              </div>
              <div>
                👥 <strong>Social Betting</strong> - Follow the action together
              </div>
            </div>
          </div>
          <LobbyPicksViewer />
        </div>

        {/* Join Game Component */}
        <div className="space-y-6 mt-20">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-white">
              Join Game Component 🎮
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Review lobby details, see what other players are betting on, and
              join the action with a clean, comprehensive interface.
            </p>
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
