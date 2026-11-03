import { useEffect, useLayoutEffect, useState } from 'react'
import { SITE_NAME } from '../config'
import { reducedMotion } from '../lib/motion'
import { Chars } from './Reveal'

const KEY = 'dv:intro-seen'

/**
 * Cinematic opening screen. Shown once per browser session (not on internal
 * navigation), skipped for reduced motion, always dismisses itself on a timer
 * so it can never block the site, and can be skipped with one click.
 */
export function Intro() {
  const [show, setShow] = useState(() => {
    try {
      if (sessionStorage.getItem(KEY)) return false
    } catch {
      /* storage blocked: just show it once per page load */
    }
    return !reducedMotion()
  })
  const [leaving, setLeaving] = useState(false)

  // Lock scroll and pause the hero animations underneath until the intro lifts.
  useLayoutEffect(() => {
    if (!show) return
    const root = document.documentElement
    root.classList.add('intro-lock')
    return () => root.classList.remove('intro-lock')
  }, [show])

  useEffect(() => {
    if (!show) return
    try {
      sessionStorage.setItem(KEY, '1')
    } catch {
      /* ignore */
    }
    const t = window.setTimeout(() => setLeaving(true), 2500)
    return () => window.clearTimeout(t)
  }, [show])

  useEffect(() => {
    if (!leaving) return
    const root = document.documentElement
    root.classList.remove('intro-lock')
    const t = window.setTimeout(() => setShow(false), 900)
    return () => window.clearTimeout(t)
  }, [leaving])

  if (!show) return null
  return (
    <div className={`intro ${leaving ? 'is-leaving' : ''}`} role="presentation">
      <div className="intro-glow" aria-hidden="true" />
      <div className="intro-center">
        <div className="intro-flare" aria-hidden="true" />
        <p className="intro-name" aria-label={SITE_NAME}>
          <span className="intro-word"><Chars text="DRAZYNTH" /></span>
          <span className="intro-word intro-word-2"><Chars text="VAULT" start={8} /></span>
        </p>
        <p className="intro-tag">Resources for video editors</p>
        <div className="intro-bar" aria-hidden="true"><span /></div>
      </div>
      <button type="button" className="intro-skip" onClick={() => setLeaving(true)}>Skip</button>
    </div>
  )
}
