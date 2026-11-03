import { ExternalLink, ShieldCheck } from 'lucide-react'
import { STUDIO_URL } from '../config'
import { usePageTitle } from '../lib/hooks'

/**
 * Admin access lives in Sanity Studio, a separate hosted app with its own login.
 * This page is only a signpost. It grants no access and holds no secrets.
 */
export default function Admin() {
  usePageTitle('Admin')
  return (
    <div className="wrap stagger section narrow">
      <h1 className="page-title"><ShieldCheck size={26} aria-hidden="true" /> Admin</h1>
      <p className="lede">Resources are managed in the DRAZYNTH VAULT Studio. Sign in there with the owner account.</p>
      {STUDIO_URL ? (
        <a className="btn btn-primary" href={STUDIO_URL} target="_blank" rel="noopener noreferrer">
          Open admin login <ExternalLink size={15} aria-hidden="true" />
        </a>
      ) : (
        <p className="notice">The Studio address isn't set. Add VITE_STUDIO_URL to the site's environment variables.</p>
      )}
      <p className="muted">Only invited Sanity members can sign in. Visitors cannot create accounts, and this page cannot change any content.</p>
    </div>
  )
}
