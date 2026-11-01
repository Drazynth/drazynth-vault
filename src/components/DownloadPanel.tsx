import { Download, ExternalLink, RotateCcw, X } from 'lucide-react'
import { YOUTUBE_URL } from '../config'
import { useDownloadFlow } from '../lib/downloadFlow'

interface Props {
  resourceId: string
  title: string
  downloadUrl?: string
}

export function DownloadPanel({ resourceId, title, downloadUrl }: Props) {
  const { state, activate, reset, popupBlocked, linkOk } = useDownloadFlow(resourceId, downloadUrl)

  if (!linkOk && state !== 'pending') {
    return (
      <div className="download">
        <button className="btn btn-primary btn-xl" disabled>
          <Download size={18} aria-hidden="true" /> Download unavailable
        </button>
        <p className="note" role="status">The download link for this resource is missing. Check the YouTube or Telegram channel for an update.</p>
      </div>
    )
  }

  const label = state === 'idle' ? 'Get Download' : state === 'pending' ? 'Continue to Download' : 'Open download link again'

  return (
    <div className="download">
      <button className="btn btn-primary btn-xl" onClick={activate} aria-label={`${label}: ${title}`} disabled={state !== 'idle' && !linkOk}>
        <Download size={18} aria-hidden="true" /> {label}
      </button>

      {state === 'idle' && (
        <p className="note">The first click opens our YouTube channel in a new tab. Come back to this page and press the button again to reach the file.</p>
      )}

      {state === 'pending' && (
        <div className="notice" role="status">
          <p>
            <strong>Next step:</strong> our YouTube channel was opened in a new tab. When you're back here, press <em>Continue to Download</em>.
          </p>
          {popupBlocked && (
            <p>
              Your browser blocked the new tab.{' '}
              <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">
                Open the YouTube channel <ExternalLink size={13} aria-hidden="true" />
              </a>
            </p>
          )}
          {!linkOk && <p>The download link for this resource is missing right now.</p>}
          <button className="link-btn" onClick={reset}>
            <X size={14} aria-hidden="true" /> Cancel
          </button>
        </div>
      )}

      {state === 'done' && (
        <div className="notice" role="status">
          <p>The download link opened in a new tab. If it was blocked, press the button again. Files are hosted on Google Drive, so access and speed depend on Drive.</p>
          <button className="link-btn" onClick={reset}>
            <RotateCcw size={14} aria-hidden="true" /> Start over
          </button>
        </div>
      )}
    </div>
  )
}
