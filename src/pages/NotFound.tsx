import { Link } from 'react-router-dom'
import { usePageTitle } from '../lib/hooks'

export default function NotFound() {
  usePageTitle('Page not found')
  return (
    <div className="wrap section">
      <div className="message">
        <h1>That page doesn't exist</h1>
        <p>The link may be old, or the resource may have been unpublished.</p>
        <div className="community-actions">
          <Link className="btn btn-primary" to="/">Go to home</Link>
          <Link className="btn" to="/search">Search the vault</Link>
        </div>
      </div>
    </div>
  )
}
