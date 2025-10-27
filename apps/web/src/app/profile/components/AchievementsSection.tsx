"use client"

import { ACHIEVEMENTS } from '../constants/achievements'

export default function AchievementsSection() {
  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
        <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4 flex items-center justify-center">
          <span className="text-lg">🏆</span>
        </span>
        Achievements
      </h3>
      <div className="space-y-4">
        {ACHIEVEMENTS.map((achievement, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl border transition-all duration-300 ${
              achievement.unlocked
                ? 'bg-gradient-to-r from-[#00CED1]/10 to-[#FFAB91]/10 border-[#00CED1]/30'
                : 'bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm border-slate-700/50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  achievement.unlocked ? 'bg-gradient-to-r from-[#00CED1] to-[#FFAB91]' : 'bg-slate-700/50'
                }`}
              >
                <span className="text-xl">{achievement.icon}</span>
              </div>
              <div className="flex-1">
                <div className={`font-bold ${achievement.unlocked ? 'text-white' : 'text-slate-400'}`}>
                  {achievement.name}
                </div>
                <div className="text-slate-400 text-sm">{achievement.desc}</div>
              </div>
              {achievement.unlocked && (
                <div className="text-[#00CED1]">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
