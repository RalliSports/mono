export default function PageHeader() {
  return (
    <div className="text-center mb-8">
      <div className="mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center shadow-xl">
          <span className="text-2xl">🎁</span>
        </div>
      </div>
      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
        Referrals
      </h1>
      <p className="text-slate-400 text-lg">Earn rewards by inviting friends</p>
    </div>
  )
}
