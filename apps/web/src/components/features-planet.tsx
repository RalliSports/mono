import Image from 'next/image'
import BettingTag from './betting-tag'

export default function FeaturesPlanet() {
  return (
    <section className="relative bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-24 md:py-32">
          {/* Section header */}
          <div className="mx-auto max-w-3xl pb-20 text-center md:pb-24">
            <div className="inline-flex items-center space-x-2 bg-gray-800 border border-gray-700 rounded-full px-6 py-3 mb-8">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Platform Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Built for{' '}
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                Competition
              </span>
            </h2>{' '}
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Challenge friends with real-time predictions, track your performance, and compete in a social sports
              betting experience designed for transparency and fun.
            </p>
          </div>
          {/* Planet */}
          <div className="pb-20 md:pb-24" data-aos="zoom-y-out">
            <div className="text-center">
              <div className="relative inline-flex rounded-full before:absolute before:inset-0 before:-z-10 before:scale-[.85] before:animate-[pulse_4s_cubic-bezier(.4,0,.6,1)_infinite] before:bg-gradient-to-b before:from-blue-400/30 before:to-violet-400/20 before:blur-3xl after:absolute after:inset-0 after:rounded-[inherit] after:[background:radial-gradient(closest-side,theme(colors.blue.400/0.3),transparent)]">
                <Image
                  className="rounded-full bg-gray-800"
                  src="/images/planet.png"
                  width={400}
                  height={400}
                  alt="Global Sports Platform"
                />
                <div className="pointer-events-none" aria-hidden="true">
                  <Image
                    className="absolute -right-64 -top-20 z-10 max-w-none opacity-60"
                    src="/images/planet-overlay.svg"
                    width={789}
                    height={755}
                    alt="Platform visualization"
                  />
                  <BettingTag
                    text="Yankees ML ✓ Won"
                    className="absolute bottom-32 left-64 z-10 animate-[float_4s_ease-in-out_infinite_3s_both] opacity-90 transition-opacity duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>{' '}
        {/* Enhanced Features Grid */}{' '}
        <div className="grid overflow-hidden sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <article className="relative bg-gray-800/50 border border-gray-700 rounded-2xl p-8 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <svg className="fill-blue-400 w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                  <path d="M2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Zm2-4a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4Zm1 10a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H5Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">Real-Time Challenges</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Challenge friends to live prediction battles and see results instantly. Build your head-to-head record
              across all major sports and leagues with transparent, real-time tracking.
            </p>
          </article>

          <article className="relative bg-gray-800/50 border border-gray-700 rounded-2xl p-8 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <svg className="fill-emerald-400 w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                  <path d="M14.29 2.614a1 1 0 0 0-1.58-1.228L6.407 9.492l-3.199-3.2a1 1 0 1 0-1.414 1.415l4 4a1 1 0 0 0 1.496-.093l7-9ZM1 14a1 1 0 1 0 0 2h14a1 1 0 1 0 0-2H1Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">Performance Tracking</h3>
            </div>{' '}
            <p className="text-gray-300 leading-relaxed">
              Climb the leaderboards and track your prediction accuracy across different sports. Compete for weekly
              recognition and build your reputation as a sports prediction expert.
            </p>
          </article>

          <article className="relative bg-gray-800/50 border border-gray-700 rounded-2xl p-8 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center">
                <svg className="fill-violet-400 w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                  <path
                    d="M2.248 6.285a1 1 0 0 1-1.916-.57A8.014 8.014 0 0 1 5.715.332a1 1 0 0 1 .57 1.916 6.014 6.014 0 0 0-4.037 4.037Z"
                    opacity=".3"
                  />
                  <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm0-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm1.715-6.752a1 1 0 0 1 .57-1.916 8.014 8.014 0 0 1 5.383 5.383 1 1 0 1 1-1.916.57 6.014 6.014 0 0 0-4.037-4.037Zm4.037 7.467a1 1 0 1 1 1.916.57 8.014 8.014 0 0 1-5.383 5.383 1 1 0 1 1-.57-1.916 6.014 6.014 0 0 0 4.037-4.037Zm-7.467 4.037a1 1 0 1 1-.57 1.916 8.014 8.014 0 0 1-5.383-5.383 1 1 0 1 1 1.916-.57 6.014 6.014 0 0 0 4.037 4.037Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">Smart Matching</h3>
            </div>{' '}
            <p className="text-gray-300 leading-relaxed">
              Get matched with opponents at your skill level using our intelligent pairing system. Enjoy fair,
              competitive matches that keep you engaged and improving.
            </p>
          </article>

          <article className="relative bg-gray-800/50 border border-gray-700 rounded-2xl p-8 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <svg className="fill-orange-400 w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                  <path d="M8 0a1 1 0 0 1 1 1v14a1 1 0 1 1-2 0V1a1 1 0 0 1 1-1Zm6 3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h1a1 1 0 1 1 0 2h-1a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3h1a1 1 0 1 1 0 2h-1ZM1 1a1 1 0 0 0 0 2h1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 1 0 0 2h1a3 3 0 0 0 3-3V4a3 3 0 0 0-3-3H1Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">Private Groups</h3>
            </div>{' '}
            <p className="text-gray-300 leading-relaxed">
              Create exclusive prediction leagues with your closest friends. Set up group challenges and track
              everyone's performance within your private circle.
            </p>
          </article>

          <article className="relative bg-gray-800/50 border border-gray-700 rounded-2xl p-8 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
                <svg className="fill-pink-400 w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                  <path d="M10.284.33a1 1 0 1 0-.574 1.917 6.049 6.049 0 0 1 2.417 1.395A1 1 0 0 0 13.5 2.188 8.034 8.034 0 0 0 10.284.33ZM6.288 2.248A1 1 0 0 0 5.718.33 8.036 8.036 0 0 0 2.5 2.187a1 1 0 0 0 1.372 1.455 6.036 6.036 0 0 1 2.415-1.395ZM1.42 5.401a1 1 0 0 1 .742 1.204 6.025 6.025 0 0 0 0 2.79 1 1 0 0 1-1.946.462 8.026 8.026 0 0 1 0-3.714A1 1 0 0 1 1.421 5.4Zm2.452 6.957A1 1 0 0 0 2.5 13.812a8.036 8.036 0 0 0 3.216 1.857 1 1 0 0 0 .574-1.916 6.044 6.044 0 0 1-2.417-1.395Zm9.668.04a1 1 0 0 1-.041 1.414 8.033 8.033 0 0 1-3.217 1.857 1 1 0 1 1-.571-1.917 6.035 6.035 0 0 0 2.415-1.395 1 1 0 0 1 1.414.042Zm2.242-6.255a1 1 0 1 0-1.946.462 6.03 6.03 0 0 1 0 2.79 1 1 0 1 0 1.946.462 8.022 8.022 0 0 0 0-3.714Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">Live Notifications</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Stay updated with instant notifications about your active predictions, friend challenges, and leaderboard
              changes. Never miss important moments.
            </p>
          </article>

          <article className="relative bg-slate-800/50 border border-slate-700 rounded-2xl p-8 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                <svg className="fill-cyan-400 w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                  <path d="M9 1a1 1 0 1 0-2 0v6a1 1 0 0 0 2 0V1ZM4.572 3.08a1 1 0 0 0-1.144-1.64A7.987 7.987 0 0 0 0 8a8 8 0 0 0 16 0c0-2.72-1.36-5.117-3.428-6.56a1 1 0 1 0-1.144 1.64A5.987 5.987 0 0 1 14 8 6 6 0 1 1 2 8a5.987 5.987 0 0 1 2.572-4.92Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">Achievement System</h3>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Unlock exclusive badges and achievements as you improve your prediction skills. Earn recognition with
              special titles and showcase your sports knowledge.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}
