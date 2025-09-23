import { AthletesServiceGetActiveAthletesWithUnresolvedLines } from '@repo/server'

interface AthletesListProps {
  athletes: AthletesServiceGetActiveAthletesWithUnresolvedLines
  children: React.ReactNode
}

export default function AthletesList({ athletes, children }: AthletesListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4 flex items-center justify-center">
            <span className="text-lg">📈</span>
          </span>
          Available Players
        </h3>
        <div className="text-right">
          <div className="text-[#00CED1] font-bold text-lg">{athletes.length}</div>
          <div className="text-slate-400 text-xs">Showing</div>
        </div>
      </div>

      {children}
    </div>
  )
}
