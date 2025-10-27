export interface ProfileDropdownProps {
  isOpen: boolean
  onClose: () => void
  onNavigateToProfile: () => void
}
export default function ProfileDropdown({ isOpen, onClose, onNavigateToProfile }: ProfileDropdownProps) {
  if (!isOpen) return null

  return (
    <div className="absolute right-0 top-12 w-48 bg-slate-800/95 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-xl z-50">
      <div className="p-2">
        <button
          onClick={() => {
            onNavigateToProfile()
            onClose()
          }}
          className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl hover:bg-slate-700/50 transition-colors text-left"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <div className="text-white font-semibold text-sm">Profile</div>
            <div className="text-slate-400 text-xs">View your stats</div>
          </div>
        </button>

        <button className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl hover:bg-slate-700/50 transition-colors text-left">
          <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-slate-300" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <div className="text-white font-semibold text-sm">Sign Out</div>
            <div className="text-slate-400 text-xs">Logout of account</div>
          </div>
        </button>
      </div>
    </div>
  )
}
