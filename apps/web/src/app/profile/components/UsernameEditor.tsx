import { useProfile } from '../hooks/useProfile'
import { useSessionToken } from '@/hooks/use-session'
import { useProfileTabs } from '../hooks/useProfileTabs'

export default function UsernameEditor() {
  const { session } = useSessionToken()
  const { editingUsername, setEditingUsername } = useProfileTabs()
  const { username, setUsername, user, handleUpdateUser } = useProfile(session || null)

  const handleSave = async () => {
    setEditingUsername(false)
    await handleUpdateUser()
  }

  const handleCancel = () => {
    setEditingUsername(false)
    setUsername(user?.username || '')
  }

  const handleUsernameClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setEditingUsername(true)
  }

  if (editingUsername) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-slate-800/50 text-white text-xl font-semibold border border-slate-600/50 rounded-xl px-4 py-2 focus:border-[#00CED1]/50 focus:ring-1 focus:ring-[#00CED1]/50 focus:outline-none transition-all duration-200"
            placeholder="Enter username"
            autoFocus
          />
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSave}
            className="p-2 bg-gradient-to-r from-[#00CED1] to-blue-500 hover:from-[#00CED1]/90 hover:to-blue-500/90 text-white rounded-xl transition-all duration-200 hover:scale-105"
            title="Save changes"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
          <button
            onClick={handleCancel}
            className="p-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white rounded-xl transition-all duration-200"
            title="Cancel"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6m0 12L6 6" />
            </svg>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-800/30 transition-all duration-200">
      <div className="flex-1 flex flex-row items-center gap-3">
        <h2 className="text-2xl font-bold text-white group-hover:text-[#00CED1] transition-colors duration-200 max-w-[150px] truncate cursor-pointer">
          {user?.username || 'Set username'}
        </h2>
        {/* Edit Button */}
        <button
          onClick={handleUsernameClick}
          className="w-8 h-8 bg-gradient-to-br from-[#00CED1] to-blue-500 hover:from-[#00CED1]/90 hover:to-blue-500/90 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 border-2 border-slate-800 group"
        >
          <svg
            className="w-3.5 h-3.5 text-white transition-transform duration-200 group-hover:rotate-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="p-2 bg-slate-700/50 rounded-lg">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
