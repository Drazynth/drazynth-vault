import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Send, Youtube } from 'lucide-react'
import { CATEGORIES, TELEGRAM_URL, YOUTUBE_URL } from '../config'
import { SearchBox } from '../components/SearchBox'
import { ResourceGrid } from '../components/ResourceGrid'
import { EmptyState, ErrorState, SetupNotice, SkeletonGrid } from '../components/States'
import { useAsync, usePageTitle } from '../lib/hooks'
import { cmsConfigured, listResources } from '../lib/sanity'

export default function Home() {
  usePageTitle(undefined, 'XML presets, custom effects, APKs, SFX and overlays for video editors.')
  const navigate = useNavigate()

  const { data, loading, error, retry } = useAsync(
    () =>
      cmsConfigured
        ? Promise.all([
            listResources({ featured: true, limit: 4 }),
            listResources({ order: 'newest', limit: 8 }),
            listResources({ order: 'newest', sinceDays: 7, limit: 4 }),
          ])
        : Promise.resolve(null),
    [],
  )

  const [featured, recent, fresh] = data || []

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <h1>Find the preset, effect or sound for your next edit.</h1>
          <p className="hero-sub">Browse XML presets, custom effects, APKs, SFX and overlays. Preview each one before you download.</p>
          <SearchBox large onSubmit={(q) => navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search')} />
        </div>
      </section>

      <section className="wrap section" aria-labelledby="cats-h">
        <h2 id="cats-h">Categories</h2>
        <ul className="cat-list">
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link to={`/category/${c.slug}`} className="cat-row">
                <span className="cat-icon" aria-hidden="true"><c.icon size={22} /></span>
                <span className="cat-text">
                  <span className="cat-title">{c.title}</span>
                  <span className="cat-blurb">{c.blurb}</span>
                </span>
                <ArrowRight size={18} className="cat-arrow" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {!cmsConfigured && <div className="wrap section"><SetupNotice /></div>}
      {cmsConfigured && loading && <div className="wrap section"><SkeletonGrid count={4} /></div>}
      {cmsConfigured && error && <div className="wrap section"><ErrorState onRetry={retry} /></div>}

      {featured && featured.items.length > 0 && (
        <section className="wrap section" aria-labelledby="feat-h">
          <h2 id="feat-h">Featured</h2>
          <ResourceGrid items={featured.items} />
        </section>
      )}

      {fresh && fresh.items.length > 0 && (
        <section className="wrap section" aria-labelledby="new-h">
          <h2 id="new-h">New this week</h2>
          <ResourceGrid items={fresh.items} />
        </section>
      )}

      {recent && (
        <section className="wrap section" aria-labelledby="recent-h">
          <div className="section-head">
            <h2 id="recent-h">Recently published</h2>
            {recent.total > 8 && <Link to="/search" className="text-link">Browse everything</Link>}
          </div>
          {recent.items.length > 0 ? (
            <ResourceGrid items={recent.items} />
          ) : (
            <EmptyState title="Nothing published yet">New resources will appear here as soon as they're published.</EmptyState>
          )}
        </section>
      )}

      <section className="wrap section" aria-labelledby="comm-h">
        <div className="community">
          <div>
            <h2 id="comm-h">Updates and tutorials</h2>
            <p>Follow the channels to see new releases and how to use them.</p>
          </div>
          <div className="community-actions">
            <a className="btn btn-primary" href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer"><Youtube size={16} aria-hidden="true" /> Visit YouTube Channel</a>
            <a className="btn" href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer"><Send size={16} aria-hidden="true" /> Join Telegram Channel</a>
          </div>
        </div>
      </section>
    </>
  )
}
