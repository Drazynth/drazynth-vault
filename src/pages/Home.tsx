import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ChevronDown, Download, Eye, Send, Youtube } from 'lucide-react'
import { CATEGORIES, TELEGRAM_URL, YOUTUBE_URL } from '../config'
import { SearchBox } from '../components/SearchBox'
import { ResourceGrid } from '../components/ResourceGrid'
import { EmptyState, ErrorState, SetupNotice, SkeletonGrid } from '../components/States'
import { Particles } from '../components/Particles'
import { Chars, Reveal, Words } from '../components/Reveal'
import { useAsync, usePageTitle } from '../lib/hooks'
import { reducedMotion, vars } from '../lib/motion'
import { cmsConfigured, listResources } from '../lib/sanity'

function SectionHead({ id, no, eyebrow, title, action }: { id: string; no: string; eyebrow: string; title: string; action?: React.ReactNode }) {
  return (
    <Reveal className="section-head">
      <div>
        <p className="eyebrow"><span>{no}</span> {eyebrow}</p>
        <h2 id={id}>{title}</h2>
      </div>
      {action}
    </Reveal>
  )
}

const STEPS = [
  { icon: Eye, title: 'Browse and preview', text: 'Open any resource to see its screenshots, preview and details before you download.' },
  { icon: Youtube, title: 'Visit the channel', text: 'The first click on a download button opens our YouTube channel in a new tab.' },
  { icon: Download, title: 'Get the file', text: 'Come back, press the button again, and the file link opens. Files are hosted on Google Drive.' },
]

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

  const toCategories = () =>
    document.getElementById('categories')?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' })

  return (
    <>
      <section className="hero">
        <div className="hero-bg" aria-hidden="true">
          <div className="hero-beam" data-parallax="0.1" />
          <div className="hero-grid" data-parallax="0.05" />
          <Particles />
          <div className="hero-vignette" />
        </div>

        <div className="wrap hero-inner">
          <p className="hero-kicker"><i className="dot" aria-hidden="true" /> Resources for video editors</p>
          <h1 className="hero-title" aria-label="DRAZYNTH VAULT">
            <span className="line"><Chars text="DRAZYNTH" /></span>
            <span className="line line-2"><Chars text="VAULT" start={8} /></span>
          </h1>
          <p className="hero-headline" aria-label="Find the preset, effect or sound for your next edit.">
            <Words text="Find the preset, effect or sound for your next edit." start={14} />
          </p>
          <p className="hero-sub">Browse XML presets, custom effects, APKs, SFX and overlays. Preview each one before you download.</p>
          <div className="hero-search">
            <SearchBox large onSubmit={(q) => navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search')} />
          </div>
          <div className="hero-cta">
            <Link to="/search" className="btn btn-primary btn-lg" data-magnetic>
              Explore Resources <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <button type="button" className="btn btn-lg" onClick={toCategories} data-magnetic>
              Browse categories <ChevronDown size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="scroll-cue" aria-hidden="true"><span /></div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <div className="marquee-set" key={k}>
              {CATEGORIES.map((c) => (
                <span key={c.slug}><c.icon size={14} /> {c.title}<em /></span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section id="categories" className="wrap section" aria-labelledby="cats-h">
        <SectionHead id="cats-h" no="01" eyebrow="Library" title="Categories" />
        <ul className="cat-grid">
          {CATEGORIES.map((c, i) => (
            <li key={c.slug} className={`cat-item cat-${i + 1}`}>
              <Reveal className="cat-card-wrap" delay={i * 80} glow tilt>
                <Link to={`/category/${c.slug}`} className="cat-card">
                  <span className="cat-no" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <span className="cat-icon" aria-hidden="true"><c.icon size={20} /></span>
                  <span className="cat-text">
                    <span className="cat-title">{c.title}</span>
                    <span className="cat-blurb">{c.blurb}</span>
                  </span>
                  <ArrowRight size={16} className="cat-arrow" aria-hidden="true" />
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {!cmsConfigured && <div className="wrap section"><SetupNotice /></div>}
      {cmsConfigured && loading && <div className="wrap section"><SkeletonGrid count={4} /></div>}
      {cmsConfigured && error && <div className="wrap section"><ErrorState onRetry={retry} /></div>}

      {featured && featured.items.length > 0 && (
        <section className="wrap section" aria-labelledby="feat-h">
          <SectionHead id="feat-h" no="02" eyebrow="Hand-picked" title="Featured" />
          <ResourceGrid items={featured.items} />
        </section>
      )}

      {fresh && fresh.items.length > 0 && (
        <section className="wrap section" aria-labelledby="new-h">
          <SectionHead id="new-h" no="03" eyebrow="Just in" title="New this week" />
          <ResourceGrid items={fresh.items} />
        </section>
      )}

      {recent && (
        <section className="wrap section" aria-labelledby="recent-h">
          <SectionHead
            id="recent-h"
            no="04"
            eyebrow="Latest"
            title="Recently published"
            action={recent.total > 8 ? <Link to="/search" className="text-link">Browse everything <ArrowRight size={14} aria-hidden="true" /></Link> : undefined}
          />
          {recent.items.length > 0 ? (
            <ResourceGrid items={recent.items} />
          ) : (
            <EmptyState title="Nothing published yet">New resources will appear here as soon as they're published.</EmptyState>
          )}
        </section>
      )}

      <section className="wrap section" aria-labelledby="how-h">
        <SectionHead id="how-h" no="05" eyebrow="How it works" title="From preview to download" />
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <Reveal className="step" delay={i * 90} glow>
                <span className="step-no" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className="step-icon" aria-hidden="true"><s.icon size={18} /></span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section className="wrap section" aria-labelledby="comm-h">
        <Reveal className="community" glow>
          <div>
            <p className="eyebrow"><span>06</span> Community</p>
            <h2 id="comm-h">Updates and tutorials</h2>
            <p>Follow the channels to see new releases and how to use them.</p>
          </div>
          <div className="community-actions" style={vars({ '--n': 0 })}>
            <a className="btn btn-primary" href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" data-magnetic><Youtube size={15} aria-hidden="true" /> Visit YouTube Channel</a>
            <a className="btn" href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" data-magnetic><Send size={15} aria-hidden="true" /> Join Telegram Channel</a>
          </div>
        </Reveal>
      </section>
    </>
  )
}
