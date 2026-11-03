import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Menu, Search, X, Youtube, Send } from 'lucide-react'
import { CATEGORIES, SITE_NAME, TELEGRAM_URL, YOUTUBE_URL } from '../config'
import { usePointerEffects, useScrollEffects } from '../lib/motion'
import { Intro } from './Intro'

function Wordmark() {
  return (
    <Link to="/" className="wordmark" aria-label={`${SITE_NAME} home`}>
      <svg className="wordmark-mark" width="24" height="24" viewBox="0 0 32 32" aria-hidden="true">
        <defs>
          <linearGradient id="dvg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#8b919c" />
          </linearGradient>
        </defs>
        <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="8" fill="#050506" stroke="#3a3d45" strokeWidth="1.5" />
        <path d="M10 9h6a7 7 0 0 1 0 14h-6z" fill="none" stroke="url(#dvg)" strokeWidth="2.6" strokeLinejoin="round" />
      </svg>
      <span className="wordmark-text">DRAZYNTH <b>VAULT</b></span>
    </Link>
  )
}

export function Layout() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const main = useRef<HTMLElement>(null)
  const header = useRef<HTMLElement>(null)
  const bar = useRef<HTMLDivElement>(null)

  usePointerEffects()
  useScrollEffects(header, bar)

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
      <Intro />
      <div className="ambient" aria-hidden="true"><i /><i /></div>
      <a href="#main" className="skip" onClick={() => main.current?.focus()}>Skip to content</a>
      <header className="site-header" ref={header}>
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
              <Search size={17} />
            </button>
            <button
              className={`icon-btn nav-toggle ${open ? 'is-open' : ''}`}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="primary-nav"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        <div className="scroll-progress" ref={bar} aria-hidden="true" />
      </header>

      <main id="main" ref={main} tabIndex={-1}>
        <div key={pathname} className="page">
          <Outlet />
        </div>
      </main>

      <footer className="site-footer">
        <div className="footer-mark" aria-hidden="true">DRAZYNTH VAULT</div>
        <div className="wrap footer-grid">
          <div>
            <Wordmark />
            <p className="footer-about">A library of resources for video editors.</p>
            <div className="footer-social">
              <a className="btn btn-sm" href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer"><Youtube size={14} aria-hidden="true" /> Visit YouTube Channel</a>
              <a className="btn btn-sm" href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer"><Send size={14} aria-hidden="true" /> Join Telegram Channel</a>
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
