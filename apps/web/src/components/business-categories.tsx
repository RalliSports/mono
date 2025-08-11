"use client";

import Image from "next/image";
import BoxingLogo from "@/public/images/boxing.svg";
import F1Logo from "@/public/images/F1.svg";
import IPLLogo from "@/public/images/IPL.svg";
import NBALogo from "@/public/images/nba-6.svg";
import OlympicsLogo from "@/public/images/olympics-1.svg";
import WBCLogo from "@/public/images/WBC_logo.svg";

export default function BusinessCategories() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-[#F5F5DC] to-white relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* <div className="absolute top-10 left-10 text-6xl opacity-10 animate-float">
          💎
        </div> */}
        {/* <div className="absolute top-20 right-20 text-5xl opacity-15 animate-bounce">
          🎰
        </div> */}
        <div className="absolute bottom-20 left-20 text-4xl opacity-10 animate-pulse">
          🏆
        </div>
        <div className="absolute bottom-10 right-10 text-5xl opacity-15 animate-float">
          💰
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Enhanced Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-[#00CED1]/10 to-[#FFAB91]/10 border border-[#00CED1]/20 rounded-full px-8 py-4 mb-8">
            <span className="text-2xl animate-spin-slow">🎯</span>
            <span className="text-lg font-bold text-gray-800">
              ALL MAJOR SPORTS COVERED
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
            BET ON{" "}
            <span className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] bg-clip-text text-transparent">
              EVERYTHING
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            From NFL to Formula 1, NBA to Premier League - challenge friends
            across
            <span className="font-bold text-gray-900">
              {" "}
              every sport that matters
            </span>{" "}
            🔥
          </p>
        </div>{" "}
        {/* Ultra Enhanced Sports Universe Display */}
        <div className="pb-16 md:pb-24">
          {/* Main Sports Display */}
          <div className="relative flex h-[400px] items-center justify-center">
            {/* Enhanced Background Effects */}
            <div className="absolute -z-10">
              <div className="w-96 h-96 bg-gradient-to-r from-[#00CED1]/20 via-purple-500/10 to-[#FFAB91]/20 rounded-full blur-3xl animate-pulse"></div>
            </div>
            {/* Rotating Ring Effect */}
            <div className="absolute -z-10 w-80 h-80 border-2 border-dashed border-[#00CED1]/30 rounded-full animate-spin-slow"></div>
            <div className="absolute -z-10 w-96 h-96 border border-dashed border-[#FFAB91]/20 rounded-full animate-spin-reverse"></div>{" "}
            {/* Central Ralli Hub */}
            <div className="absolute z-20">
              <div className="animate-float">
                <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-white to-gray-50 shadow-2xl border-4 border-white/80 backdrop-blur-sm">
                  {/* Simple rotating border effect */}
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#00CED1] via-purple-500 to-[#FFAB91] opacity-20 animate-spin-slow"></div>
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#FFAB91] via-transparent to-[#00CED1] opacity-30 animate-spin-reverse"></div>

                  <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-[#00CED1] via-purple-500 to-[#FFAB91] rounded-2xl flex items-center justify-center shadow-xl">
                    <span className="text-white font-black text-3xl">R</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Enhanced Sports Logos Orbit */}
            <div className="relative flex flex-col">
              <article className="flex h-full w-full items-center justify-center">
                {/* NBA - Premium Position */}
                <div className="absolute -translate-x-[160px] z-10">
                  <div className="animate-float group cursor-pointer">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-white to-gray-50 shadow-2xl border-4 border-orange-200/50 hover:border-orange-400/70 transition-all duration-500 hover:scale-110 before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-orange-400/20 before:to-red-500/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300">
                      <Image
                        className="relative z-10"
                        src={NBALogo}
                        width={32}
                        height={30}
                        alt="NBA"
                      />
                    </div>
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                        NBA Basketball 🏀
                      </div>
                    </div>
                  </div>
                </div>

                {/* F1 - Premium Position */}
                <div className="absolute translate-x-[160px] z-10">
                  <div className="animate-float-slow group cursor-pointer">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-white to-gray-50 shadow-2xl border-4 border-red-200/50 hover:border-red-500/70 transition-all duration-500 hover:scale-110 before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-red-500/20 before:to-black/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300">
                      <Image
                        className="relative z-10"
                        src={F1Logo}
                        width={56}
                        height={60}
                        alt="F1"
                      />
                    </div>
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                        Formula 1 🏎️
                      </div>
                    </div>
                  </div>
                </div>

                {/* IPL - Top Left */}
                <div className="absolute -translate-x-[240px] -translate-y-[100px] z-10">
                  <div className="animate-bounce-slow group cursor-pointer">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-white to-gray-50 shadow-2xl border-4 border-blue-200/50 hover:border-blue-500/70 transition-all duration-500 hover:scale-110 before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-blue-500/20 before:to-purple-500/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300">
                      <Image
                        className="relative z-10"
                        src={IPLLogo}
                        width={80}
                        height={80}
                        alt="IPL"
                      />
                    </div>
                    <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                        Indian Premier League 🏏
                      </div>
                    </div>
                  </div>
                </div>

                {/* WBC - Top Right */}
                <div className="absolute -translate-y-[100px] translate-x-[240px] z-10">
                  <div className="animate-pulse-slow group cursor-pointer">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-white to-gray-50 shadow-2xl border-4 border-yellow-200/50 hover:border-yellow-500/70 transition-all duration-500 hover:scale-110 before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-yellow-500/20 before:to-red-600/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300">
                      <Image
                        className="relative z-10"
                        src={WBCLogo}
                        width={70}
                        height={85}
                        alt="WBC"
                      />
                    </div>
                    <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                        World Baseball Academy ⚾
                      </div>
                    </div>
                  </div>
                </div>

                {/* Boxing - Bottom Right */}
                <div className="absolute translate-x-[240px] translate-y-[100px] z-10">
                  <div className="animate-wiggle group cursor-pointer">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-white to-gray-50 shadow-2xl border-4 border-red-200/50 hover:border-red-600/70 transition-all duration-500 hover:scale-110 before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-red-600/20 before:to-black/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300">
                      <Image
                        className="relative z-10"
                        src={BoxingLogo}
                        width={60}
                        height={60}
                        alt="Boxing"
                      />
                    </div>
                    <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                        Professional Boxing 🥊
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hockey - Bottom Left */}
                <div className="absolute -translate-x-[240px] translate-y-[100px] z-10">
                  <div className="animate-float group cursor-pointer">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-white to-gray-50 shadow-2xl border-4 border-blue-200/50 hover:border-blue-600/70 transition-all duration-500 hover:scale-110 before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-blue-600/20 before:to-cyan-500/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300">
                      <span className="text-4xl">🏒</span>
                    </div>
                    <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                        Ice Hockey 🏒
                      </div>
                    </div>
                  </div>
                </div>

                {/* Smaller outer sports */}
                <div className="absolute -translate-x-[320px] opacity-60">
                  <div className="animate-spin-slow group cursor-pointer">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-300/60 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <span className="text-2xl">🎾</span>
                    </div>
                  </div>
                </div>

                <div className="absolute translate-x-[320px] opacity-60">
                  <div className="animate-bounce group cursor-pointer">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-300/60 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <span className="text-2xl">⛳</span>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>{" "}
        {/* Ultra Enhanced Live Betting Section */}
        <div className="mt-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-400/30 rounded-full px-8 py-4 mb-8">
              <div className="relative">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute"></div>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
              <span className="text-lg font-bold text-red-600">
                LIVE BETTING ACTION
              </span>
              <span className="text-2xl animate-pulse">🔥</span>
            </div>
            <h3 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
              JOIN THE{" "}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                ACTION
              </span>
            </h3>
            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Your friends are betting{" "}
              <span className="font-bold text-red-600">RIGHT NOW</span> 🎯 Jump
              in, counter their bets, or start your own challenge!
            </p>
          </div>

          {/* Premium Live Bets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {" "}
            {/* Ultra Enhanced Bet Card 1 - NFL */}
            <div className="group bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-2xl border-2 border-[#FFAB91]/30 hover:border-[#FFAB91]/70 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFAB91]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#FFAB91] to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-2xl">🏈</span>
                    </div>
                    <div>
                      <h4 className="font-black text-xl text-gray-900 group-hover:text-[#FFAB91] transition-colors">
                        Chiefs vs Bills
                      </h4>
                      <p className="text-sm text-gray-600 font-medium">
                        NFL • Divisional Championship
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 bg-red-100 px-3 py-2 rounded-full">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                    <span className="text-xs text-red-600 font-black">
                      LIVE
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200 group-hover:shadow-lg transition-shadow">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-sm font-black shadow-md">
                        J
                      </div>
                      <div>
                        <span className="font-bold text-gray-900">
                          Jake Miller
                        </span>
                        <div className="text-xs text-gray-600">
                          7-2 this season
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-[#FFAB91] text-lg">
                        Chiefs -3.5
                      </p>
                      <p className="text-sm text-gray-600">
                        $75 bet • Confident
                      </p>
                    </div>
                  </div>

                  <div className="text-center py-3">
                    <div className="inline-flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full">
                      <span className="text-sm text-gray-500 font-bold">
                        VS
                      </span>
                      <span className="text-xs text-gray-400">
                        Winner takes $150
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl border border-green-200 group-hover:shadow-lg transition-shadow">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white text-sm font-black shadow-md">
                        S
                      </div>
                      <div>
                        <span className="font-bold text-gray-900">
                          Sarah Chen
                        </span>
                        <div className="text-xs text-gray-600">
                          12-1 this season
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-[#00CED1] text-lg">
                        Bills +3.5
                      </p>
                      <p className="text-sm text-gray-600">
                        $75 bet • Hot streak
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <button className="flex-1 bg-gradient-to-r from-[#FFAB91] to-orange-500 text-white font-bold py-4 px-6 rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    🔥 Counter Bet
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 font-bold py-4 px-6 rounded-2xl hover:bg-gray-200 transition-colors">
                    👀 Watch
                  </button>
                </div>
              </div>
            </div>{" "}
            {/* Ultra Enhanced Bet Card 2 - NBA */}
            <div className="group bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-2xl border-2 border-[#00CED1]/30 hover:border-[#00CED1]/70 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00CED1]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#00CED1] to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-2xl">🏀</span>
                    </div>
                    <div>
                      <h4 className="font-black text-xl text-gray-900 group-hover:text-[#00CED1] transition-colors">
                        Lakers vs Warriors
                      </h4>
                      <p className="text-sm text-gray-600 font-medium">
                        NBA • Western Conference Finals
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 bg-yellow-100 px-3 py-2 rounded-full">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-yellow-600 font-black">
                      Q3
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-5 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 rounded-2xl border-2 border-purple-200 group-hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white text-sm font-black shadow-md">
                          M
                        </div>
                        <div>
                          <span className="font-bold text-gray-900">
                            Mike Rodriguez
                          </span>
                          <div className="text-xs text-green-600 font-medium">
                            🔥 Currently Winning
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="bg-green-100 text-green-700 text-xs font-black px-2 py-1 rounded-full">
                          WINNING
                        </div>
                      </div>
                    </div>
                    <div className="text-center p-3 bg-white/60 rounded-xl">
                      <p className="font-black text-[#00CED1] text-xl">
                        Over 225.5 Points
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        $100 bet • Current:{" "}
                        <span className="font-bold text-green-600">
                          212 pts
                        </span>
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-gradient-to-r from-green-400 to-[#00CED1] h-2 rounded-full w-4/5 animate-pulse"></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Need 14 more points to win
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <button className="flex-1 bg-gradient-to-r from-[#00CED1] to-blue-500 text-white font-bold py-4 px-6 rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    💪 Counter Bet
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 font-bold py-4 px-6 rounded-2xl hover:bg-gray-200 transition-colors">
                    📊 Stats
                  </button>
                </div>
              </div>
            </div>
            {/* Ultra Enhanced Bet Card 3 - Multi-Sport */}
            <div className="group bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-2xl border-2 border-purple-300/30 hover:border-purple-500/70 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-2xl">⚽</span>
                    </div>
                    <div>
                      <h4 className="font-black text-xl text-gray-900 group-hover:text-purple-600 transition-colors">
                        Premier League
                      </h4>
                      <p className="text-sm text-gray-600 font-medium">
                        Multiple Active Matches
                      </p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-100 to-blue-100 text-green-700 text-sm font-black px-4 py-2 rounded-full border border-green-300">
                    8 ACTIVE BETS
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-blue-50 rounded-xl border border-red-200">
                    <span className="text-gray-800 font-medium">
                      Arsenal vs Chelsea
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-[#FFAB91]">4 bets</span>
                      <span className="text-green-600 text-xs">🔥</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                    <span className="text-gray-800 font-medium">
                      Man City vs Liverpool
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-[#00CED1]">3 bets</span>
                      <span className="text-red-500 text-xs">⚡</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                    <span className="text-gray-800 font-medium">
                      Tottenham vs Newcastle
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-purple-600">2 bets</span>
                      <span className="text-yellow-500 text-xs">💎</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl p-4 border border-gray-200">
                  <div className="text-center">
                    <p className="text-gray-600 text-sm mb-2">
                      Total Prize Pool
                    </p>
                    <p className="text-3xl font-black text-purple-600">
                      $1,247
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button className="flex-1 bg-gray-100 text-gray-700 font-bold py-4 px-6 rounded-2xl hover:bg-gray-200 transition-colors">
                    📋 View All
                  </button>
                  <button className="flex-1 bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold py-4 px-6 rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    🚀 Join Party
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Custom Animations */}
        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-10px) rotate(1deg);
            }
          }

          @keyframes float-slow {
            0%,
            100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-15px) rotate(-1deg);
            }
          }

          @keyframes bounce-slow {
            0%,
            100% {
              transform: translateY(0px) scale(1);
            }
            50% {
              transform: translateY(-8px) scale(1.05);
            }
          }

          @keyframes pulse-slow {
            0%,
            100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.1);
            }
          }

          @keyframes wiggle {
            0%,
            100% {
              transform: rotate(0deg);
            }
            25% {
              transform: rotate(1deg);
            }
            75% {
              transform: rotate(-1deg);
            }
          }

          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          @keyframes spin-reverse {
            from {
              transform: rotate(360deg);
            }
            to {
              transform: rotate(0deg);
            }
          }

          .animate-float {
            animation: float 4s ease-in-out infinite;
          }

          .animate-float-slow {
            animation: float-slow 6s ease-in-out infinite;
          }

          .animate-bounce-slow {
            animation: bounce-slow 3s ease-in-out infinite;
          }

          .animate-pulse-slow {
            animation: pulse-slow 4s ease-in-out infinite;
          }

          .animate-wiggle {
            animation: wiggle 2s ease-in-out infinite;
          }

          .animate-spin-slow {
            animation: spin-slow 10s linear infinite;
          }

          .animate-spin-reverse {
            animation: spin-reverse 15s linear infinite;
          }
        `}</style>
      </div>
    </section>
  );
}
