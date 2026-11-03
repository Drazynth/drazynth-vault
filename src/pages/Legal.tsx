import { CONTACT_EMAIL } from '../config'
import { usePageTitle } from '../lib/hooks'

const contact = CONTACT_EMAIL || 'the YouTube or Telegram channel linked in the footer'

export function Privacy() {
  usePageTitle('Privacy Policy')
  return (
    <div className="wrap stagger section narrow prose">
      <h1 className="page-title">Privacy Policy</h1>
      <p className="muted">Plain-language summary. Have a lawyer review this before relying on it.</p>
      <h2>What we collect</h2>
      <p>This site has no accounts, comments or visitor uploads, and it does not ask you for personal information. Your browser stores a small note in session storage to remember where you are in a download step for a resource. It stays in your browser and is cleared when you close the tab.</p>
      <h2>Third-party services</h2>
      <p>Pages load fonts from Google Fonts and images from our content provider, Sanity. Download links open Google Drive. Preview videos may load from YouTube. Those services have their own privacy policies and may receive technical data such as your IP address.</p>
      <h2>Contact</h2>
      <p>Questions about privacy: {contact}.</p>
    </div>
  )
}

export function Terms() {
  usePageTitle('Terms of Use')
  return (
    <div className="wrap stagger section narrow prose">
      <h1 className="page-title">Terms of Use</h1>
      <p className="muted">Plain-language summary. Have a lawyer review this before relying on it.</p>
      <h2>Third-party links</h2>
      <p>Downloadable files are hosted on external services such as Google Drive. Availability, speed and download limits depend on those services and can change. A link may stop working without notice.</p>
      <h2>Compatibility</h2>
      <p>Presets, effects, overlays and sounds are made for specific apps and versions. Check the compatibility details on each resource page before you use it. We can't guarantee a file works with every app or device.</p>
      <h2>APKs and unofficial files</h2>
      <p>Files marked as unofficial or modified are not official releases. Install apps only from sources you trust, and use them at your own risk.</p>
      <h2>Copyright and takedown</h2>
      <p>If you believe a resource infringes your rights, contact {contact} with the resource's page address and proof of ownership. We will review it and remove content when appropriate.</p>
      <h2>Using resources</h2>
      <p>Check any license notes on a resource's page. Don't re-upload or sell files from this site unless the page says you may.</p>
    </div>
  )
}
