import { useToast } from '@/components/ui/toast'
import { useStats } from '@/hooks/api'
import { CreateStatDtoType } from '@repo/server'
import { useState } from 'react'

export default function CreateStatForm() {
  const { addToast } = useToast()
  // Form states
  const [newStat, setNewStat] = useState<CreateStatDtoType>({
    name: '',
    description: '',
    displayName: '',
    shortDisplayName: '',
    abbreviation: '',
    statOddsName: '',
    customId: 0,
  })

  const statsQuery = useStats()

  // Handlers using mutations
  const handleCreateStat = async () => {
    if (!newStat.name || !newStat.description || !newStat.customId) {
      addToast('Please fill in all fields', 'error')
      return
    }

    try {
      await statsQuery.create.mutateAsync({
        customId: newStat.customId,
        name: newStat.name,
        description: newStat.description,
        displayName: newStat.displayName,
        shortDisplayName: newStat.shortDisplayName,
        abbreviation: newStat.abbreviation,
        statOddsName: newStat.statOddsName,
      })

      setNewStat({
        name: '',
        description: '',
        customId: 0,
        displayName: '',
        shortDisplayName: '',
        abbreviation: '',
        statOddsName: '',
      })

      addToast('Stat type created successfully!', 'success')
    } catch (error) {
      console.error('Error creating stat:', error)
      addToast('Error creating stat', 'error')
    }
  }

  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-3 flex items-center justify-center">
          <span className="text-lg">➕</span>
        </span>
        Create Stat Type
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-white font-semibold mb-2">Stat Name</label>
          <input
            type="text"
            value={newStat.name}
            onChange={(e) => setNewStat({ ...newStat, name: e.target.value })}
            placeholder="e.g., Points, Assists, Goals"
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Description</label>
          <textarea
            value={newStat.description}
            onChange={(e) =>
              setNewStat({
                ...newStat,
                description: e.target.value,
              })
            }
            placeholder="Describe what this stat measures..."
            rows={3}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Custom ID</label>
          <input
            type="text"
            value={newStat.customId}
            onChange={(e) =>
              setNewStat({
                ...newStat,
                customId: parseInt(e.target.value),
              })
            }
            placeholder="e.g., 00001-00001"
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all font-mono"
          />
          <p className="text-slate-400 text-xs mt-1">
            Enter the specific numerical ID (e.g., 00001-00001) or leave blank to auto-generate
          </p>
        </div>

        <button
          onClick={handleCreateStat}
          className="w-full bg-gradient-to-r from-[#00CED1] to-[#FFAB91] hover:from-[#00CED1]/90 hover:to-[#FFAB91]/90 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
        >
          Create Stat Type
        </button>
      </div>
    </div>
  )
}
