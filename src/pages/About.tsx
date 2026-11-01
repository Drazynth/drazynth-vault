import { Send, Youtube } from 'lucide-react'
import { CONTACT_EMAIL, TELEGRAM_URL, YOUTUBE_URL } from '../config'
import { usePageTitle } from '../lib/hooks'

export default function About() {
  usePageTitle('About and contact')
  return (
    <div className="wrap section narrow">
      <h1 className="page-title">About and contact</h1>
      <p className="lede">DRAZYNTH VAULT is a library of resources for video editors: XML presets, custom effects, APKs, SFX and overlays.</p>
      <p>Each resource has its own page with previews and details. Files are hosted on Google Drive and linked from here, they are not stored on this website.</p>
      <h2>Contact</h2>
      <p>For questions, requests, or copyright and takedown notices, reach out through a channel below.</p>
      <ul className="plain">
        {CONTACT_EMAIL && <li>Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>}
      </ul>
      <div className="community-actions">
        <a className="btn btn-primary" href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer"><Youtube size={16} aria-hidden="true" /> Visit YouTube Channel</a>
        <a className="btn" href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer"><Send size={16} aria-hidden="true" /> Join Telegram Channel</a>
      </div>
    </div>
  )
}
