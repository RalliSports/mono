import Image from "next/image";
import Avatar01 from "@/public/images/avatar-01.jpg";
import Avatar02 from "@/public/images/avatar-02.jpg";
import Avatar03 from "@/public/images/avatar-03.jpg";
import Avatar04 from "@/public/images/avatar-04.jpg";
import Avatar05 from "@/public/images/avatar-05.jpg";
import Avatar06 from "@/public/images/avatar-06.jpg";

export default function PvPFeatures() {
  return (
    <section className="relative bg-gray-900 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white md:text-4xl mb-4">
            Compete With Friends Around The World
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Challenge your friends, track your performance, and climb the global
            leaderboards in real-time.
          </p>
        </div>

        {/* Global Competition Visual */}
        <div className="pb-16 md:pb-20" data-aos="zoom-y-out">
          <div className="text-center relative">
            {/* Central Globe/Map */}
            <div className="relative inline-flex rounded-full">
              <div className="w-96 h-96 bg-gradient-to-br from-[#00CED1]/20 to-[#FFAB91]/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-[#00CED1]/30">
                <div className="w-80 h-80 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🌍</div>
                    <p className="text-white font-semibold text-lg">
                      Global PvP
                    </p>
                    <p className="text-gray-400 text-sm">Live Competitions</p>
                  </div>
                </div>
              </div>{" "}
              {/* Floating Friend Cards */}
              <div className="pointer-events-none absolute inset-0">
                {" "}
                {/* Friend 1 - Top Left - Winning */}{" "}
                <div className="absolute -left-20 top-8 animate-bounce">
                  <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-[#00CED1]">
                    <div className="flex items-center space-x-3">
                      <Image
                        className="w-10 h-10 rounded-full"
                        src={Avatar01}
                        width={40}
                        height={40}
                        alt="Jake"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          Jake
                        </p>{" "}
                        <p className="text-[#00CED1] text-xs font-bold">
                          +$245
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      🏈 Chiefs -3.5 ✅
                    </div>
                  </div>
                </div>{" "}
                {/* Friend 2 - Top Right - Currently Betting */}{" "}
                <div className="absolute -right-24 top-16 animate-pulse">
                  <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-[#FFAB91]">
                    <div className="flex items-center space-x-3">
                      <Image
                        className="w-10 h-10 rounded-full"
                        src={Avatar02}
                        width={40}
                        height={40}
                        alt="Sarah"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          Sarah
                        </p>
                        <p className="text-[#FFAB91] text-xs font-bold">
                          Live Bet
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      🏀 Lakers +5.5 ⏱️
                    </div>
                  </div>
                </div>{" "}
                {/* Friend 3 - Bottom Left - Lost */}
                <div className="absolute -left-28 bottom-20 animate-bounce">
                  <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-red-400">
                    <div className="flex items-center space-x-3">
                      <Image
                        className="w-10 h-10 rounded-full"
                        src={Avatar03}
                        width={40}
                        height={40}
                        alt="Mike"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          Mike
                        </p>
                        <p className="text-red-600 text-xs font-bold">-$85</p>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      ⚽ Arsenal Win ❌
                    </div>
                  </div>
                </div>{" "}
                {/* Friend 4 - Bottom Right - Big Win */}{" "}
                <div className="absolute -right-20 bottom-12 animate-pulse">
                  <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-[#00CED1]">
                    <div className="flex items-center space-x-3">
                      <Image
                        className="w-10 h-10 rounded-full"
                        src={Avatar04}
                        width={40}
                        height={40}
                        alt="Emma"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          Emma
                        </p>{" "}
                        <p className="text-[#00CED1] text-xs font-bold">
                          +$420
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      ⚾ Yankees ML ✅
                    </div>
                  </div>
                </div>{" "}
                {/* Friend 5 - Top Center */}{" "}
                <div className="absolute left-1/2 -translate-x-1/2 -top-16 animate-bounce">
                  <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-[#FFAB91]">
                    <div className="flex items-center space-x-3">
                      <Image
                        className="w-10 h-10 rounded-full"
                        src={Avatar05}
                        width={40}
                        height={40}
                        alt="Alex"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          Alex
                        </p>
                        <p className="text-[#FFAB91] text-xs font-bold">
                          +$156
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      🏀 Over 215.5 ✅
                    </div>
                  </div>
                </div>{" "}
                {/* Friend 6 - Bottom Center */}
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-16 animate-pulse">
                  <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-purple-400">
                    <div className="flex items-center space-x-3">
                      <Image
                        className="w-10 h-10 rounded-full"
                        src={Avatar06}
                        width={40}
                        height={40}
                        alt="Chris"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          Chris
                        </p>
                        <p className="text-purple-600 text-xs font-bold">
                          Challenge
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      🏈 Wants to bet!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Real-Time Competition */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-gradient-to-br from-[#00CED1] to-[#00CED1] rounded-xl flex items-center justify-center mb-4">
              <span className="text-white text-xl">⚡</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Real-Time Battles
            </h3>
            <p className="text-gray-400">
              Challenge friends to live betting duels. See results instantly and
              track your head-to-head record.
            </p>
          </div>
          {/* Global Leaderboards */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FFAB91] to-[#00CED1] rounded-xl flex items-center justify-center mb-4">
              <span className="text-white text-xl">🏆</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Global Rankings
            </h3>
            <p className="text-gray-400">
              Climb the worldwide leaderboards. Compete for weekly prizes and
              ultimate bragging rights.
            </p>
          </div>
          {/* Smart Matching */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-xl flex items-center justify-center mb-4">
              <span className="text-white text-xl">🎯</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Smart Matching
            </h3>
            <p className="text-gray-400">
              Find opponents at your skill level. Our algorithm matches you with
              players for fair, exciting competition.
            </p>
          </div>
          {/* Social Features */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
              <span className="text-white text-xl">👥</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Friend Groups</h3>
            <p className="text-gray-400">
              Create private leagues with friends. Set group challenges and
              track everyone's performance.
            </p>
          </div>
          {/* Achievement System */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-xl flex items-center justify-center mb-4">
              <span className="text-white text-xl">🏅</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Achievements</h3>
            <p className="text-gray-400">
              Unlock badges and achievements. Show off your betting skills with
              special titles and rewards.
            </p>
          </div>
          {/* Live Chat */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
              <span className="text-white text-xl">💬</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Trash Talk</h3>
            <p className="text-gray-400">
              Built-in chat system for friendly banter. Celebrate wins and
              commiserate losses together.
            </p>
          </div>{" "}
        </div>
      </div>
    </section>
  );
}
