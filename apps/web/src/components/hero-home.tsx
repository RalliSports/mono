"use client";

import Image from "next/image";
import PageIllustration from "@/components/page-illustration";
import Avatar01 from "@/public/images/avatar-01.jpg";
import Avatar02 from "@/public/images/avatar-02.jpg";
import Avatar03 from "@/public/images/avatar-03.jpg";
import Avatar04 from "@/public/images/avatar-04.jpg";
import Avatar05 from "@/public/images/avatar-05.jpg";
import Avatar06 from "@/public/images/avatar-06.jpg";

export default function HeroHome() {
  return (
    <section className="relative bg-[#F5F5DC] min-h-screen overflow-hidden">
      {" "}
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Money Symbols */}
        {/* <div className="absolute top-20 left-10 text-4xl animate-bounce opacity-20">
          💰
        </div> */}
        {/* <div className="absolute top-32 right-20 text-3xl animate-pulse opacity-30 delay-300">
          🎯
        </div> */}
        {/* <div className="absolute top-60 left-1/4 text-2xl animate-bounce opacity-25 delay-700">
          🔥
        </div>
        <div className="absolute bottom-40 right-1/4 text-3xl animate-pulse opacity-20 delay-1000">
          ⚡
        </div> */}
        {/* <div className="absolute bottom-32 left-16 text-2xl animate-bounce opacity-30 delay-500">
          🏆
        </div> */}
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        {/* Hero content */}
        <div className="pb-16 pt-32 md:pb-24 md:pt-40">
          {/* Section header */}{" "}
          <div className="text-center mb-16">
            {" "}
            {/* Compact Live Players Badge */}
            <div
              className="group inline-flex items-center space-x-3 bg-white/90 backdrop-blur-sm border border-[#00CED1]/30 rounded-full px-6 py-3 mb-8 shadow-lg hover:shadow-xl hover:shadow-[#00CED1]/15 transition-all duration-300 transform hover:scale-105 hover:border-[#00CED1]/50 cursor-pointer overflow-hidden relative"
              data-aos="zoom-y-out"
            >
              {/* Simplified background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#00CED1]/3 to-[#FFAB91]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>

              <div className="relative z-10 flex -space-x-2">
                <Image
                  className="w-8 h-8 rounded-full border-2 border-white shadow-md transition-all duration-300"
                  src={Avatar01}
                  width={32}
                  height={32}
                  alt="Player 1"
                />
                <Image
                  className="w-8 h-8 rounded-full border-2 border-white shadow-md transition-all duration-300"
                  src={Avatar02}
                  width={32}
                  height={32}
                  alt="Player 2"
                />
                <Image
                  className="w-8 h-8 rounded-full border-2 border-white shadow-md transition-all duration-300"
                  src={Avatar03}
                  width={32}
                  height={32}
                  alt="Player 3"
                />
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-[#00CED1] to-[#FFAB91] flex items-center justify-center shadow-md group-hover:scale-105 transition-all duration-300">
                  <span className="text-xs font-bold text-white">+3K</span>
                </div>
              </div>
              <div className="relative z-10 flex items-center space-x-2">
                <div className="relative">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-ping absolute"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
                <div>
                  <div className="text-gray-800 font-semibold text-sm">
                    <span className="text-[#00CED1] font-bold">3,247</span> live
                    players
                  </div>
                </div>
              </div>
            </div>
            {/* Explosive Main Headline */}
            <div className="relative mb-10">
              <h1
                className="text-6xl md:text-8xl lg:text-9xl font-black text-gray-900 mb-4 leading-none tracking-tight"
                data-aos="zoom-y-out"
                data-aos-delay={150}
              >
                <div className="relative inline-block">
                  <span className="relative z-10">TURN</span>
                  <div className="absolute -top-2 -left-2 w-full h-full bg-[#00CED1]/20 rounded-lg -rotate-2"></div>
                </div>{" "}
                <div className="block md:inline-block relative">
                  <span className="relative z-10">SPORTS</span>
                  <div className="absolute -top-2 -right-2 w-full h-full bg-[#FFAB91]/20 rounded-lg rotate-1"></div>
                </div>
              </h1>
              <h1
                className="text-6xl md:text-8xl lg:text-9xl font-black leading-none tracking-tight"
                data-aos="zoom-y-out"
                data-aos-delay={200}
              >
                INTO{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-[#00CED1] via-green-400 to-[#FFAB91] bg-clip-text text-transparent animate-pulse">
                    CASH
                  </span>
                  <div className="absolute -bottom-4 left-0 right-0 h-4 bg-gradient-to-r from-[#00CED1]/30 to-[#FFAB91]/30 -skew-x-12 animate-pulse"></div>
                  <div className="absolute top-0 right-0 text-2xl animate-bounce">
                    💸
                  </div>
                </span>
              </h1>
            </div>{" "}
            {/* Enhanced Subtitle with Urgency */}
            <div className="mx-auto max-w-5xl mb-14">
              {" "}
              <p
                className="text-2xl md:text-3xl text-gray-800 leading-relaxed mb-8 font-medium"
                data-aos="zoom-y-out"
                data-aos-delay={300}
              >
                🎯 Challenge friends to epic betting showdowns across
                <span className="font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}
                  NFL, NBA, Soccer, and Baseball
                </span>
                .
                <br className="hidden md:block" />
                <span className="font-black text-gray-900">
                  {" "}
                  Win money 💰 | Climb leaderboards 🏆 | Earn bragging rights 🔥
                </span>
              </p>
              {/* Enhanced Stats with Animations */}
              <div
                className="flex flex-wrap justify-center gap-10 text-lg text-gray-700 mb-10"
                data-aos="fade-up"
                data-aos-delay={400}
              >
                <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full animate-pulse"></div>
                  <span className="font-bold">
                    💵 <span className="text-green-600 text-xl">$3.7M+</span>{" "}
                    won this month
                  </span>
                </div>
                <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="w-4 h-4 bg-gradient-to-r from-[#00CED1] to-blue-600 rounded-full animate-pulse delay-200"></div>
                  <span className="font-bold">
                    👥 <span className="text-[#00CED1] text-xl">180K+</span>{" "}
                    active players
                  </span>
                </div>
                <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="w-4 h-4 bg-gradient-to-r from-[#FFAB91] to-orange-600 rounded-full animate-pulse delay-400"></div>
                  <span className="font-bold">
                    ⭐ <span className="text-[#FFAB91] text-xl">4.9/5</span> app
                    rating
                  </span>
                </div>
              </div>
              {/* Trust Indicators */}
              <div className="flex justify-center items-center space-x-8 text-gray-600 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">🔒</span>
                  <span className="font-medium">Bank-level security</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-500">⚡</span>
                  <span className="font-medium">Instant payouts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-purple-500">🎯</span>
                  <span className="font-medium">Fair play guaranteed</span>
                </div>
              </div>
            </div>{" "}
            {/* Enhanced CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
              data-aos="zoom-y-out"
              data-aos-delay={450}
            >
              <a
                className="group relative inline-flex items-center justify-center px-12 py-6 text-xl font-black text-white bg-gradient-to-r from-[#00CED1] via-blue-500 to-[#FFAB91] rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 min-w-[280px] overflow-hidden"
                href="/signup"
              >
                <span className="relative z-10 flex items-center">
                  🚀 START WINNING FREE
                  <svg
                    className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-2 group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFAB91] via-purple-500 to-[#00CED1] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:animate-pulse"></div>
              </a>

              <a
                className="group inline-flex items-center justify-center px-12 py-6 text-xl font-bold text-gray-800 bg-white/90 backdrop-blur-sm border-2 border-gray-300 rounded-full hover:bg-white hover:border-[#00CED1] hover:text-[#00CED1] transition-all duration-300 min-w-[280px] shadow-xl hover:shadow-2xl transform hover:scale-105"
                href="#features"
              >
                {/* <svg
                  className="mr-3 w-6 h-6 transition-transform group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-10 5a9 9 0 1118 0 9 9 0 01-18 0z"
                  />
                </svg> */}
                🎬 WATCH DEMO
              </a>
            </div>
          </div>{" "}
          {/* Hero Dashboard Mockup - Completely Enhanced */}
          <div
            className="mx-auto max-w-7xl"
            data-aos="zoom-y-out"
            data-aos-delay={600}
          >
            <div className="relative">
              {/* Enhanced Floating Elements */}
              {/* <div className="absolute -top-12 -left-12 z-30 animate-float">
                <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-6 shadow-2xl border-2 border-white/20 backdrop-blur-sm">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white font-bold text-xl">💸</span>
                    </div>
                    <div>
                      <p className="text-white font-black text-lg">
                        Jake just won!
                      </p>
                      <p className="text-green-100 font-bold text-2xl">+$347</p>
                      <p className="text-green-200 text-sm">
                        vs Sarah on Lakers bet
                      </p>
                    </div>
                  </div>
                </div>
              </div> */}

              {/* <div className="absolute -top-8 -right-16 z-30 animate-bounce">
                <div className="bg-gradient-to-br from-[#FFAB91] to-orange-600 rounded-2xl p-6 shadow-2xl border-2 border-white/20 backdrop-blur-sm">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white font-bold text-xl">🔥</span>
                    </div>
                    <div>
                      <p className="text-white font-black text-lg">
                        HOT STREAK!
                      </p>
                      <p className="text-orange-100 font-bold text-2xl">
                        7 WINS
                      </p>
                      <p className="text-orange-200 text-sm">
                        You're on fire! 🔥
                      </p>
                    </div>
                  </div>
                </div>
              </div> */}

              <div className="absolute -bottom-8 -left-8 z-30 animate-float-slow">
                <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 shadow-2xl border-2 border-white/20 backdrop-blur-sm">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white font-bold text-xl">🏆</span>
                    </div>
                    <div>
                      <p className="text-white font-black text-lg">
                        LEADERBOARD
                      </p>
                      <p className="text-purple-100 font-bold text-2xl">
                        #1 THIS WEEK
                      </p>
                      <p className="text-purple-200 text-sm">+$1,247 total</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Dashboard - Ultra Enhanced */}
              <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl p-10 shadow-3xl border-4 border-gray-700/50 backdrop-blur-sm overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,206,209,0.5) 2px, transparent 0)`,
                      backgroundSize: "30px 30px",
                      animation: "float 6s ease-in-out infinite",
                    }}
                  ></div>
                </div>
                {/* Dashboard Header */}
                <div className="relative z-10 flex items-center justify-between text-white mb-12">
                  <div>
                    <h3 className="text-4xl font-black mb-2">
                      YOUR BETTING ARENA
                    </h3>
                    <p className="text-xl text-gray-300 font-medium">
                      🎯 Live competitions with friends
                    </p>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="bg-gradient-to-r from-green-500/30 to-green-600/30 border-2 border-green-400/50 rounded-full px-6 py-3 backdrop-blur-sm">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-ping absolute"></div>
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        </div>
                        <span className="text-green-300 font-black text-lg">
                          🔴 LIVE BETTING
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-[#00CED1]">
                        $1,247
                      </div>
                      <div className="text-gray-400 text-sm">Your winnings</div>
                    </div>
                  </div>
                </div>{" "}
                {/* Ultra Enhanced Betting Cards */}
                <div className="relative z-10 grid md:grid-cols-2 gap-8 mb-12">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border-2 border-gray-600 hover:border-[#00CED1]/70 transition-all duration-500 transform hover:scale-105 shadow-2xl group">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-2xl">
                            🏈
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-black text-xl">
                            Chiefs vs Bills
                          </p>
                          <p className="text-gray-300 text-sm font-medium">
                            Your bet: Chiefs -3.5 | $50
                          </p>
                          <p className="text-gray-400 text-xs">
                            vs Jake M. • 2 hours ago
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-black text-2xl">
                          +$285
                        </p>
                        <p className="text-green-300 text-sm font-medium">
                          🎉 YOU WON!
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full w-full animate-pulse shadow-lg"></div>
                      </div>
                      <p className="text-green-400 text-sm font-bold mt-2 flex items-center">
                        <span className="mr-2">🔥</span>
                        100% confidence - Perfect prediction!
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border-2 border-gray-600 hover:border-[#FFAB91]/70 transition-all duration-500 transform hover:scale-105 shadow-2xl group">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#FFAB91] to-orange-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                          <span className="text-white font-bold text-2xl">
                            🏀
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-black text-xl">
                            Lakers vs Warriors
                          </p>
                          <p className="text-gray-300 text-sm font-medium">
                            Your bet: Over 225.5 | $75
                          </p>
                          <p className="text-gray-400 text-xs">
                            vs Sarah C. • Live now
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-yellow-400 font-black text-2xl animate-pulse">
                          🔴 LIVE
                        </p>
                        <p className="text-yellow-300 text-sm font-medium">
                          Q3 - 189 pts
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full w-3/4 animate-pulse shadow-lg"></div>
                      </div>
                      <p className="text-yellow-400 text-sm font-bold mt-2 flex items-center">
                        <span className="mr-2">⚡</span>
                        Looking good! 37 more points needed
                      </p>
                    </div>
                  </div>
                </div>{" "}
                {/* Ultra Enhanced Leaderboard */}
                <div className="relative z-10 bg-gradient-to-br from-gray-800 to-black rounded-3xl p-8 border-2 border-gray-600 shadow-2xl">
                  <h4 className="text-white font-black text-2xl mb-8 flex items-center">
                    <span className="text-4xl mr-4 animate-bounce">🏆</span>
                    <div>
                      <div className="text-[#00CED1]">FRIENDS LEADERBOARD</div>
                      <div className="text-gray-400 text-sm font-medium">
                        This week's champions
                      </div>
                    </div>
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-2 border-yellow-400/30 rounded-2xl p-4 transform hover:scale-105 transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <span className="text-yellow-400 font-black text-2xl">
                            👑
                          </span>
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                        </div>
                        <Image
                          src={Avatar01}
                          width={40}
                          height={40}
                          className="rounded-full border-2 border-yellow-400 shadow-lg"
                          alt="Player"
                        />
                        <div>
                          <span className="text-white font-black text-xl">
                            YOU
                          </span>
                          <div className="text-yellow-300 text-sm font-medium">
                            7 wins this week
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-green-400 font-black text-2xl">
                          +$1,247
                        </span>
                        <div className="text-green-300 text-sm font-medium">
                          🔥 On fire!
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-gray-700/50 rounded-2xl p-4 border border-gray-600 hover:border-gray-500 transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-300 font-black text-xl">
                          2.
                        </span>
                        <Image
                          src={Avatar02}
                          width={36}
                          height={36}
                          className="rounded-full border-2 border-gray-400 shadow-md"
                          alt="Player"
                        />
                        <div>
                          <span className="text-white font-bold text-lg">
                            Jake M.
                          </span>
                          <div className="text-gray-400 text-sm">
                            5 wins this week
                          </div>
                        </div>
                      </div>
                      <span className="text-green-400 font-bold text-xl">
                        +$823
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-gray-700/50 rounded-2xl p-4 border border-gray-600 hover:border-gray-500 transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-300 font-black text-xl">
                          3.
                        </span>
                        <Image
                          src={Avatar03}
                          width={36}
                          height={36}
                          className="rounded-full border-2 border-gray-400 shadow-md"
                          alt="Player"
                        />
                        <div>
                          <span className="text-white font-bold text-lg">
                            Sarah C.
                          </span>
                          <div className="text-gray-400 text-sm">
                            4 wins this week
                          </div>
                        </div>
                      </div>
                      <span className="text-green-400 font-bold text-xl">
                        +$645
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-gray-700/30 rounded-2xl p-4 border border-gray-600/50">
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-400 font-bold text-lg">
                          4.
                        </span>
                        <Image
                          src={Avatar04}
                          width={32}
                          height={32}
                          className="rounded-full border border-gray-500"
                          alt="Player"
                        />
                        <span className="text-gray-300 font-medium">
                          Mike R.
                        </span>
                      </div>
                      <span className="text-gray-400 font-bold">+$412</span>
                    </div>
                  </div>

                  {/* Challenge button */}
                  <div className="mt-6 text-center">
                    <button className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white font-bold px-8 py-3 rounded-full hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                      💪 Challenge Friends Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* Enhanced Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-15px) rotate(1deg);
          }
          66% {
            transform: translateY(-5px) rotate(-1deg);
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          50% {
            transform: translateY(-20px) rotate(2deg) scale(1.05);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </section>
  );
}
