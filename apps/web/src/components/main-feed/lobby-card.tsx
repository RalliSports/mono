"use client";

import Link from "next/link";

interface LobbyCardProps {
  id: string;
  title: string;
  sport: string;
  sportIcon: string;
  participants: number;
  maxParticipants: number;
  buyIn: number;
  prizePool: number;
  legs: number;
  timeLeft: string;
  host: {
    name: string;
    avatar: string;
  };
  isUrgent?: boolean;
  onJoin: (lobbyId: string, requiredLegs: number) => void;
}

export default function LobbyCard({
  id,
  title,
  sport,
  sportIcon,
  participants,
  maxParticipants,
  buyIn,
  prizePool,
  legs,
  timeLeft,
  host,
  isUrgent = false,
  onJoin,
}: LobbyCardProps) {
  const progressPercentage = (participants / maxParticipants) * 100;

  return (
    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group hover:transform hover:scale-[1.01] shadow-xl relative min-h-[280px]">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#00CED1]/5 via-transparent to-[#FFAB91]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

      <div className="relative z-10 h-full flex flex-col">
        {/* Host Info Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full flex items-center justify-center shadow-lg overflow-hidden">
            {host.name ? (
              <img
                src={`/users/${host.name.toLowerCase().replace(/\s+/g, "-")}.png`}
                alt={host.name}
                className="w-12 h-12 object-cover rounded-full"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(host.name)}&background=0D8ABC&color=fff&size=128`;
                }}
              />
            ) : (
              <span className="text-white font-bold text-sm">
                {host.avatar}
              </span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="text-white font-bold text-base">{host.name}</h4>
              <span className="text-slate-400 text-sm">created a lobby</span>
            </div>
            <p className="text-slate-300 text-xs">
              <span className="text-[#00CED1]">{timeLeft} left</span>
            </p>
          </div>
        </div>

        {/* Lobby Content */}
        <div className="flex-1 flex flex-col">
          <div className="mb-6">
            <h3 className="text-white font-bold text-xl mb-4 flex items-center">
              {title}
              {isUrgent && (
                <span className="ml-3 px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-red-400 text-xs font-bold animate-pulse">
                  FILLING FAST
                </span>
              )}
            </h3>

            {/* Key Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/60 rounded-xl p-4 border border-slate-600/30">
                <div className="text-center">
                  <div className="text-2xl font-black text-[#00CED1] mb-1">
                    {legs}
                  </div>
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">
                    Legs
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/60 rounded-xl p-4 border border-slate-600/30">
                <div className="text-center">
                  <div className="text-2xl font-black text-[#FFAB91] mb-1">
                    ${buyIn}
                  </div>
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">
                    Buy-in
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/60 rounded-xl p-4 border border-slate-600/30">
                <div className="text-center">
                  <div className="text-2xl font-black text-emerald-400 mb-1">
                    {participants}/{maxParticipants}
                  </div>
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">
                    Slots
                  </div>
                </div>
              </div>
            </div>

            {/* Prize Pool and Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[#00CED1] font-bold text-2xl">
                    ${prizePool}
                  </span>
                  <span className="text-slate-400 text-sm ml-2">
                    prize pool
                  </span>
                </div>
                <span className="text-slate-300 text-sm font-semibold">
                  {Math.round(progressPercentage)}% full
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${progressPercentage}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* View Button - pushed to bottom */}
          <Link
            href={`/join-game?id=${id}`}
            className="w-full bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-slate-900 font-bold py-4 rounded-2xl hover:shadow-xl hover:shadow-[#00CED1]/30 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2 mt-auto"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>View Lobby</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
