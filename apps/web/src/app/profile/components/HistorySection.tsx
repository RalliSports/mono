export default function HistorySection() {
  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
        <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4 flex items-center justify-center">
          <span className="text-lg">📋</span>
        </span>
        Betting History
      </h3>
      <div className="text-slate-400 text-center py-8">
        <div className="text-4xl mb-2">📋</div>
        <div>Detailed betting history coming soon</div>
      </div>
    </div>
  )
}
