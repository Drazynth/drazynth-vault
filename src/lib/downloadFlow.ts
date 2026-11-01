import { useCallback, useEffect, useState } from 'react'
import { YOUTUBE_URL } from '../config'

/**
 * YouTube-first two-click download flow.
 * State is stored PER RESOURCE in sessionStorage under its own key, so one
 * resource can never unlock another resource's download.
 *
 *   idle    -> first click opens the YouTube channel, state becomes "pending"
 *   pending -> button reads "Continue to Download"; click opens THIS resource's link
 *   done    -> link was opened; button opens it again directly (no more YouTube)
 */
export type FlowState = 'idle' | 'pending' | 'done'

const keyFor = (id: string) => `dv:download:${id}`

function read(id: string): FlowState {
  try {
    const v = sessionStorage.getItem(keyFor(id))
    return v === 'pending' || v === 'done' ? v : 'idle'
  } catch {
    return 'idle'
  }
}

function write(id: string, state: FlowState) {
  try {
    if (state === 'idle') sessionStorage.removeItem(keyFor(id))
    else sessionStorage.setItem(keyFor(id), state)
  } catch {
    /* storage unavailable (private mode): the flow still works for this page view */
  }
}

export function isSafeWebUrl(url?: string): url is string {
  if (!url) return false
  try {
    const u = new URL(url)
    return u.protocol === 'https:' || u.protocol === 'http:'
  } catch {
    return false
  }
}

export function useDownloadFlow(resourceId: string, downloadUrl?: string) {
  const [state, setState] = useState<FlowState>(() => read(resourceId))
  const [popupBlocked, setPopupBlocked] = useState(false)
  const linkOk = isSafeWebUrl(downloadUrl)

  // Switching to another resource loads THAT resource's own state.
  useEffect(() => {
    setState(read(resourceId))
    setPopupBlocked(false)
  }, [resourceId])

  const activate = useCallback(() => {
    if (state === 'idle') {
      write(resourceId, 'pending')
      setState('pending')
      const w = window.open(YOUTUBE_URL, '_blank', 'noopener,noreferrer')
      setPopupBlocked(!w)
      return
    }
    if (!linkOk) return
    window.open(downloadUrl, '_blank', 'noopener,noreferrer')
    write(resourceId, 'done')
    setState('done')
  }, [state, resourceId, downloadUrl, linkOk])

  const reset = useCallback(() => {
    write(resourceId, 'idle')
    setState('idle')
    setPopupBlocked(false)
  }, [resourceId])

  return { state, activate, reset, popupBlocked, linkOk }
}
