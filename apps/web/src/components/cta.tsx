export default function RalliCta() {
  return (
    <section className="bg-gray-900 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
          {/* Main CTA Container */}
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 md:p-16 border border-gray-700/50">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-72 h-72 bg-[#00CED1] rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
              <div className="absolute top-0 right-0 w-72 h-72 bg-[#FFAB91] rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-200"></div>
              <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-400"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center">
              {/* Live Indicator */}
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-[#00CED1]/20 to-[#FFAB91]/20 border border-[#00CED1]/30 rounded-full px-6 py-3 mb-8">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-semibold text-sm">
                    LIVE
                  </span>
                </div>
                <div className="text-white text-sm font-medium">
                  <span className="text-[#00CED1]">2,847</span> active players
                </div>
              </div>
              {/* Main Headline */}
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Join the Next Generation of{" "}
                <span className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] bg-clip-text text-transparent">
                  Sports Betting
                </span>
              </h2>{" "}
              {/* Subtitle */}
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Experience the thrill of intelligent sports betting with
                advanced analytics, real-time insights, and a community of
                passionate sports enthusiasts.
              </p>
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <a
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 min-w-[200px]"
                  href="/signup"
                >
                  <span className="relative z-10 flex items-center">
                    Get Started Today
                    <svg
                      className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FFAB91] to-[#00CED1] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>

                <a
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300 min-w-[200px]"
                  href="/demo"
                >
                  Watch Demo
                </a>
              </div>
              {/* Social Proof Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-[#00CED1] mb-1">
                    150K+
                  </div>
                  <div className="text-gray-400 text-sm">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-[#FFAB91] mb-1">
                    98%
                  </div>
                  <div className="text-gray-400 text-sm">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-green-400 mb-1">
                    4.8★
                  </div>
                  <div className="text-gray-400 text-sm">User Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                    24/7
                  </div>
                  <div className="text-gray-400 text-sm">Support</div>
                </div>
              </div>{" "}
              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center items-center gap-6 text-gray-400 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-300">Free to Start</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-300">Secure & Licensed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-300">Responsible Gaming</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-300">Expert Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Professional Note */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-[#00CED1]/10 border border-blue-500/20 rounded-full px-6 py-3">
            <svg
              className="w-4 h-4 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-blue-400 text-sm font-medium">
              Join thousands of sports enthusiasts already using Ralli
            </span>
          </div>
          <div className="mt-4 text-gray-500 text-xs max-w-2xl mx-auto">
            Must be 21+ to participate. Please bet responsibly. If you or
            someone you know has a gambling problem, call 1-800-GAMBLER for
            help.
          </div>
        </div>
      </div>
    </section>
  );
}
