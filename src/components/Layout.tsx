import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Menu, Search, X, Youtube, Send } from 'lucide-react'
import { CATEGORIES, SITE_NAME, TELEGRAM_URL, YOUTUBE_URL } from '../config'

function Wordmark() {
  return (
    <Link to="/" className="wordmark" aria-label={`${SITE_NAME} home`}>
      <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#1d1b28" />
        <path d="M9 8h7a8 8 0 0 1 0 16H9z" fill="none" stroke="#a48cf5" strokeWidth="3" strokeLinejoin="round" />
      </svg>
      <span>DRAZYNTH <b>VAULT</b></span>
    </Link>
  )
}

export function Layout() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const main = useRef<HTMLElement>(null)

  useEffect(() => {
    setOpen(false)
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <a href="#main" className="skip" onClick={() => main.current?.focus()}>Skip to content</a>
      <header className="site-header">
        <div className="wrap header-row">
          <Wordmark />
          <nav id="primary-nav" className={`nav ${open ? 'is-open' : ''}`} aria-label="Primary">
            {CATEGORIES.map((c) => (
              <NavLink key={c.slug} to={`/category/${c.slug}`}>{c.title}</NavLink>
            ))}
            <NavLink to="/about">About</NavLink>
          </nav>
          <div className="header-actions">
            <button className="icon-btn" aria-label="Search" onClick={() => navigate('/search')}>
              <Search size={19} />
            </button>
            <button
              className="icon-btn nav-toggle"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="primary-nav"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main id="main" ref={main} tabIndex={-1}>
        <div key={pathname} className="page">
          <Outlet />
        </div>
      </main>

      <footer className="site-footer">
        <div className="wrap footer-grid">
          <div>
            <Wordmark />
            <p className="footer-about">A library of resources for video editors.</p>
            <div className="footer-social">
              <a className="btn btn-sm" href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer"><Youtube size={15} aria-hidden="true" /> Visit YouTube Channel</a>
              <a className="btn btn-sm" href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer"><Send size={15} aria-hidden="true" /> Join Telegram Channel</a>
            </div>
          </div>
          <nav aria-label="Categories">
            <h2 className="footer-h">Browse</h2>
            <ul>
              {CATEGORIES.map((c) => (
                <li key={c.slug}><Link to={`/category/${c.slug}`}>{c.title}</Link></li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Site">
            <h2 className="footer-h">Site</h2>
            <ul>
              <li><Link to="/search">Search</Link></li>
              <li><Link to="/about">About and contact</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Use</Link></li>
            </ul>
          </nav>
        </div>
        <div className="wrap footer-base">© {new Date().getFullYear()} {SITE_NAME}</div>
      </footer>
    </>
  )
}
