import { ResourceCard } from './ResourceCard'
import type { ResourceSummary } from '../lib/types'

export function ResourceGrid({ items }: { items: ResourceSummary[] }) {
  return (
    <div className="grid">
      {items.map((r) => (
        <ResourceCard key={r._id} r={r} />
      ))}
    </div>
  )
}
