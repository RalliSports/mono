import CreateStatForm from './CreateStatForm'
import StatsList from './StatsList'

export default function StatsTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <CreateStatForm />
      <StatsList />
    </div>
  )
}
