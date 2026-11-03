import { Download, ExternalLink, RotateCcw, X } from 'lucide-react'
import { YOUTUBE_URL } from '../config'
import { useDownloadFlow } from '../lib/downloadFlow'

interface DownloadItem {
  label: string
  url: string
}

interface Props {
  resourceId: string
  title: string
  downloadUrl?: string
  downloadLinks?: DownloadItem[]
}

export function DownloadPanel({ resourceId, title, downloadUrl, downloadLinks }: Props) {
  // New named links take priority. Old resources continue to use downloadUrl.
  const links = downloadLinks?.filter((item) => item?.label?.trim() && item?.url?.trim()) ?? []
  const items = links.length > 0 ? links : (downloadUrl ? [{ label: 'Download', url: downloadUrl }] : [])

  if (items.length === 0) {
    return (
      <div className="download">
        <button className="btn btn-primary btn-xl" disabled>
          <Download size={18} aria-hidden="true" /> Download unavailable
        </button>
        <p className="note" role="status">The download link for this resource is missing. Check the YouTube or Telegram channel for an update.</p>
      </div>
    )
  }

  return (
    <div className="download download-list">
      {items.map((item, index) => (
        <DownloadAction
          key={`${resourceId}:${index}`}
          flowId={`${resourceId}:${index}`}
          title={title}
          label={item.label}
          downloadUrl={item.url}
        />
      ))}
    </div>
  )
}

function DownloadAction({ flowId, title, label, downloadUrl }: { flowId: string; title: string; label: string; downloadUrl: string }) {
  const { state, activate, reset, popupBlocked, linkOk } = useDownloadFlow(flowId, downloadUrl)
  const buttonLabel = state === 'idle' ? label : state === 'pending' ? `Continue: ${label}` : `Open ${label} again`

  if (!linkOk && state !== 'pending') {
    return <p className="note" role="status">{label}: download link unavailable.</p>
  }

  return (
    <div className="download-item">
      <button className="btn btn-primary btn-xl" data-magnetic onClick={activate} aria-label={`${buttonLabel}: ${title}`} disabled={state !== 'idle' && !linkOk}>
        <Download size={17} aria-hidden="true" /> {buttonLabel}
      </button>

      {state === 'idle' && <p className="note">First click opens our YouTube channel in a new tab. Return here and press this button again to reach the file.</p>}

      {state === 'pending' && (
        <div className="notice" role="status">
          <p><strong>Next step:</strong> our YouTube channel was opened in a new tab. When you're back here, press <em>Continue: {label}</em>.</p>
          {popupBlocked && <p>Your browser blocked the new tab. <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">Open the YouTube channel <ExternalLink size={13} aria-hidden="true" /></a></p>}
          {!linkOk && <p>The download link for this resource is missing right now.</p>}
          <button className="link-btn" onClick={reset}><X size={14} aria-hidden="true" /> Cancel</button>
        </div>
      )}

      {state === 'done' && (
        <div className="notice" role="status">
          <p>The download link opened in a new tab. If it was blocked, press the button again. Files are hosted externally, so access and speed depend on the host.</p>
          <button className="link-btn" onClick={reset}><RotateCcw size={14} aria-hidden="true" /> Start over</button>
        </div>
      )}
    </div>
  )
}
