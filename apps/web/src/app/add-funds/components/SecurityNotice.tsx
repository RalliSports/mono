export default function SecurityNotice() {
  return (
    <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/20 backdrop-blur-sm border border-emerald-700/30 rounded-xl p-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <svg className="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div className="ml-3">
          <p className="text-sm text-emerald-300 font-medium">Your payment is secured with 256-bit SSL encryption</p>
          <p className="text-xs text-emerald-400 mt-1">We never store your payment information</p>
        </div>
      </div>
    </div>
  )
}
