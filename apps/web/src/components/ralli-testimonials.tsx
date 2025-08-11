import Image from 'next/image'

export default function RalliTestimonials() {
  return (
    <section className="relative bg-gray-900 py-16 md:py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,206,209,0.1),transparent_50%)]"></div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {' '}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-slate-800 border border-slate-700 rounded-full px-6 py-3 mb-8">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Community Stories</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            What Our{' '}
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Community Says
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Join thousands of sports fans who have found their perfect prediction platform for friendly competition and
            skill development.
          </p>
        </div>{' '}
        {/* Featured Testimonial */}
        <div className="relative mb-20">
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-slate-700 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 p-1">
                  <Image
                    className="rounded-full w-full h-full object-cover"
                    src="/images/large-testimonial.jpg"
                    width={96}
                    height={96}
                    alt="Featured testimonial"
                  />
                </div>
                <div className="absolute -top-2 -right-2 bg-emerald-500 rounded-full w-6 h-6 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <blockquote className="text-xl md:text-2xl text-white mb-6 font-medium leading-relaxed">
                  "Ralli completely changed how I engage with sports. The prediction challenges with friends have made
                  every game incredibly exciting, and I've genuinely improved my sports knowledge through friendly
                  competition."
                </blockquote>

                <div className="flex flex-col md:flex-row md:items-center justify-center md:justify-start gap-6">
                  <div>
                    <div className="font-bold text-white text-lg">Marcus Rodriguez</div>
                    <div className="text-blue-400 text-sm font-medium">Community Leader • 2 Years Active</div>
                  </div>

                  <div className="hidden md:block w-px h-12 bg-slate-600"></div>

                  <div className="flex items-center gap-8 text-sm">
                    <div className="text-center">
                      <div className="text-emerald-400 font-bold text-lg">92%</div>
                      <div className="text-slate-400">Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-400 font-bold text-lg">#3</div>
                      <div className="text-slate-400">Rank</div>
                    </div>
                    <div className="text-center">
                      <div className="text-violet-400 font-bold text-lg">847</div>
                      <div className="text-slate-400">Predictions</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>{' '}
        {/* Grid Testimonials */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {/* Testimonial 1 */}
          <div className="bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:bg-slate-800/90">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">JM</span>
              </div>
              <div className="ml-3">
                <h4 className="font-bold text-white">Jake Miller</h4>
                <p className="text-slate-400 text-sm">NFL Enthusiast</p>
              </div>
            </div>
            <p className="text-slate-300 mb-4 leading-relaxed">
              "The prediction accuracy tracking has helped me become a much better sports analyst. Great way to compete
              with friends!"
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-emerald-400 font-semibold">89% Accuracy</span>
              <span className="text-slate-500">156 Predictions</span>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-violet-500/50 transition-all duration-300 hover:bg-slate-800/90">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">SC</span>
              </div>
              <div className="ml-3">
                <h4 className="font-bold text-white">Sarah Chen</h4>
                <p className="text-slate-400 text-sm">Basketball Analyst</p>
              </div>
            </div>
            <p className="text-slate-300 mb-4 leading-relaxed">
              "Love the group challenges during March Madness. Made the tournament so much more engaging with friends!"
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-400 font-semibold">Rank #47</span>
              <span className="text-slate-500">234 Challenges</span>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 hover:bg-slate-800/90 md:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">AK</span>
              </div>
              <div className="ml-3">
                <h4 className="font-bold text-white">Alex Kim</h4>
                <p className="text-slate-400 text-sm">Multi-Sport Fan</p>
              </div>
            </div>
            <p className="text-slate-300 mb-4 leading-relaxed">
              "Perfect platform for sports predictions. The social aspect makes it so much more fun than traditional
              approaches."
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-emerald-400 font-semibold">91% Win Rate</span>
              <span className="text-slate-500">312 Challenges</span>
            </div>
          </div>
        </div>{' '}
        {/* Enhanced Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 text-center hover:bg-slate-800/90 transition-all duration-300">
            <div className="text-3xl font-bold text-blue-400 mb-2">50K+</div>
            <div className="text-slate-400 text-sm font-medium">Active Users</div>
          </div>
          <div className="bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 text-center hover:bg-slate-800/90 transition-all duration-300">
            <div className="text-3xl font-bold text-violet-400 mb-2">2.3M</div>
            <div className="text-slate-400 text-sm font-medium">Predictions Made</div>
          </div>
          <div className="bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 text-center hover:bg-slate-800/90 transition-all duration-300">
            <div className="text-3xl font-bold text-emerald-400 mb-2">96%</div>
            <div className="text-slate-400 text-sm font-medium">User Satisfaction</div>
          </div>
          <div className="bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 text-center hover:bg-slate-800/90 transition-all duration-300">
            <div className="text-3xl font-bold text-white mb-2">24/7</div>
            <div className="text-slate-400 text-sm font-medium">Platform Uptime</div>
          </div>
        </div>
      </div>
    </section>
  )
}
