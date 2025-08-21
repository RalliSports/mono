import { useRouter } from 'next/navigation'
import { ParaButton } from '@/components/para-modal'

interface StatsGridProps {
  balances: { ralli: number }
  formatBalance: (amount: number) => string
}

export default function StatsGrid({ balances, formatBalance }: StatsGridProps) {
  const router = useRouter()

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-xl p-4 text-center border border-slate-700/50"
        onClick={() => {
          router.push('/add-funds')
        }}
      >
        <div className="text-2xl font-bold text-[#00CED1]">${formatBalance(balances.ralli)}</div>
        <div className="text-slate-400 text-sm">Balance</div>
      </div>
      <ParaButton />
    </div>
  )
}
