import { AlertTriangle, SearchX, PackageOpen } from 'lucide-react'
import type { ReactNode } from 'react'

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid" aria-busy="true" aria-label="Loading resources">
      {Array.from({ length: count }).map((_, i) => (
        <div className="card skeleton" key={i}>
          <div className="card-thumb" />
          <div className="card-body">
            <div className="sk-line w60" />
            <div className="sk-line" />
            <div className="sk-line w40" />
          </div>
        </div>
      ))}
    </div>
  )
}

interface MessageProps {
  title: string
  children?: ReactNode
  action?: ReactNode
}

function Message({ icon, title, children, action }: MessageProps & { icon: ReactNode }) {
  return (
    <div className="message" role="status">
      <div className="message-icon" aria-hidden="true">{icon}</div>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
      {action}
    </div>
  )
}

export function ErrorState({ onRetry, children }: { onRetry?: () => void; children?: ReactNode }) {
  return (
    <Message
      icon={<AlertTriangle size={22} />}
      title="Couldn't load resources"
      action={onRetry && <button className="btn" onClick={onRetry}>Try again</button>}
    >
      {children || 'Check your connection and try again. If it keeps happening, the library may be temporarily unavailable.'}
    </Message>
  )
}

export function EmptyState({ title, children, action }: MessageProps) {
  return <Message icon={<PackageOpen size={22} />} title={title} action={action}>{children}</Message>
}

export function NoResults({ onClear, children }: { onClear?: () => void; children?: ReactNode }) {
  return (
    <Message
      icon={<SearchX size={22} />}
      title="No matches"
      action={onClear && <button className="btn" onClick={onClear}>Clear search</button>}
    >
      {children || 'Try a different word, or remove a filter.'}
    </Message>
  )
}

export function SetupNotice() {
  return (
    <Message icon={<AlertTriangle size={22} />} title="Content source not connected">
      This site needs its Sanity project ID. Add VITE_SANITY_PROJECT_ID to the site's environment variables, then redeploy.
    </Message>
  )
}
