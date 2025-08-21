import type { PageHeaderProps } from './types'

export default function PageHeader({ onCreateGame }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <h2 className="text-3xl font-bold text-white flex items-center">
          <span className="w-10 h-10 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4 flex items-center justify-center">
            <span className="text-xl">🏆</span>
          </span>
          All Lobbies
        </h2>
      </div>
      <div>
        <button
          onClick={onCreateGame}
          className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] hover:from-[#00CED1]/90 hover:to-[#FFAB91]/90 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2 group"
        >
          <svg
            className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Create</span>
        </button>
      </div>
    </div>
  )
}
