export default function SportsCategories() {
  return (
    <section className="bg-[#F5F5DC] py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-4">
            Bet on Your Favorite Sports
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Challenge your friends across all major sports leagues with live
            odds and exciting matchups.
          </p>
        </div>{" "}
        {/* Sports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* NFL */}{" "}
          <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[#00CED1]/20">
            <div className="w-16 h-16 bg-gradient-to-br from-[#00CED1] to-[#00CED1] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-2xl">🏈</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">NFL</h3>
            <p className="text-gray-600 text-sm mb-4">
              Bet on spreads, totals, and player props across all 32 teams.
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#00CED1] font-semibold">Live Now</span>
              <span className="text-gray-500">15 Games This Week</span>
            </div>
          </div>
          {/* NBA */}{" "}
          <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[#FFAB91]/20">
            <div className="w-16 h-16 bg-gradient-to-br from-[#FFAB91] to-[#FFAB91] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-2xl">🏀</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">NBA</h3>
            <p className="text-gray-600 text-sm mb-4">
              Fast-paced action with points, rebounds, assists, and more.
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#FFAB91] font-semibold">Live Now</span>
              <span className="text-gray-500">12 Games Tonight</span>
            </div>
          </div>
          {/* Soccer */}{" "}
          <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[#00CED1]/20">
            <div className="w-16 h-16 bg-gradient-to-br from-[#00CED1] to-[#00CED1] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-2xl">⚽</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Soccer</h3>
            <p className="text-gray-600 text-sm mb-4">
              Premier League, Champions League, World Cup, and more.
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#00CED1] font-semibold">Live Now</span>
              <span className="text-gray-500">8 Matches Today</span>
            </div>
          </div>
          {/* Baseball */}{" "}
          <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[#FFAB91]/20">
            <div className="w-16 h-16 bg-gradient-to-br from-[#FFAB91] to-[#FFAB91] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-2xl">⚾</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Baseball</h3>
            <p className="text-gray-600 text-sm mb-4">
              MLB action with runs, hits, strikeouts, and home runs.
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#FFAB91] font-semibold">Live Now</span>
              <span className="text-gray-500">10 Games Today</span>
            </div>
          </div>
        </div>
        {/* Popular Bet Types */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Popular Bet Types
          </h3>{" "}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {" "}
            <div className="bg-white rounded-lg p-4 text-center shadow-md border border-[#00CED1]/30">
              <div className="text-2xl mb-2">📊</div>
              <p className="font-semibold text-gray-900">Point Spreads</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-md border border-[#FFAB91]/30">
              <div className="text-2xl mb-2">🎯</div>
              <p className="font-semibold text-gray-900">Over/Under</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-md border border-[#00CED1]/30">
              <div className="text-2xl mb-2">💰</div>
              <p className="font-semibold text-gray-900">Moneyline</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-md border border-[#FFAB91]/30">
              <div className="text-2xl mb-2">👤</div>
              <p className="font-semibold text-gray-900">Player Props</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
