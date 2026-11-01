import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink, ShieldAlert } from 'lucide-react'
import { getCategory } from '../config'
import { Gallery } from '../components/Gallery'
import { DownloadPanel } from '../components/DownloadPanel'
import { ResourceGrid } from '../components/ResourceGrid'
import { Img } from '../components/Img'
import { ErrorState, SetupNotice } from '../components/States'
import { useAsync, usePageTitle } from '../lib/hooks'
import { cmsConfigured, getResource, imageUrl, listResources } from '../lib/sanity'
import { formatDate, isImageUrl } from '../lib/media'
import { isSafeWebUrl } from '../lib/downloadFlow'
import type { Resource } from '../lib/types'
import NotFound from './NotFound'

export default function ResourceDetail() {
  const { slug = '' } = useParams()
  const { data, loading, error, retry } = useAsync(
    () => (cmsConfigured ? getResource(slug) : Promise.resolve(null)),
    [slug],
  )
  usePageTitle(data?.title, data?.description)

  if (!cmsConfigured) return <div className="wrap section"><SetupNotice /></div>
  if (loading) return <div className="wrap section"><div className="detail-skel" aria-busy="true" aria-label="Loading resource" /></div>
  if (error) return <div className="wrap section"><ErrorState onRetry={retry} /></div>
  if (!data) return <NotFound />
  return <Detail r={data} />
}

function Detail({ r }: { r: Resource }) {
  const cat = getCategory(r.categories?.[0])
  const isSfx = r.categories?.includes('sfx')
  const isApk = r.categories?.includes('apks')

  const rows: [string, string | undefined][] = [
    ['Category', r.categories?.map((c) => getCategory(c)?.title).filter(Boolean).join(', ')],
    ['Compatible app', r.compatibleApp],
    ['Format', r.fileFormat],
    ['Version', r.version],
    ['File size', r.fileSize],
    ['Resolution', r.resolution],
    ['Android', r.androidVersion],
    ['Published', formatDate(r.publishedAt)],
  ]
  const visibleRows = rows.filter(([, v]) => v)

  const related = useAsync(
    () => (cat ? listResources({ category: cat.slug, excludeId: r._id, limit: 4 }) : Promise.resolve(null)),
    [r._id],
  )

  return (
    <div className="wrap section">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link> <span aria-hidden="true">/</span>{' '}
        {cat && (<><Link to={`/category/${cat.slug}`}>{cat.title}</Link> <span aria-hidden="true">/</span>{' '}</>)}
        <span aria-current="page">{r.title}</span>
      </nav>

      <div className="detail">
        <div className="detail-media">
          <Gallery r={r} />
          {isSfx && r.waveform?.asset && (
            <img className="waveform" src={imageUrl(r.waveform, 900)} alt="" loading="lazy" />
          )}
          {isSfx && isSafeWebUrl(r.previewAudioUrl) && (
            <div className="audio">
              <audio controls preload="none" src={r.previewAudioUrl} aria-label={`${r.title} audio preview`} />
            </div>
          )}
        </div>

        <div className="detail-side">
          <div className="detail-head">
            {isApk && r.appIcon?.asset && <Img className="app-icon" image={r.appIcon} alt="" width={160} sizes="64px" />}
            <h1>{r.title}</h1>
          </div>
          <p className="lede">{r.description}</p>

          {r.isUnofficial && (
            <div className="warn" role="note">
              <ShieldAlert size={18} aria-hidden="true" />
              <p>This is an unofficial or modified file, not an official release. Install it only if you trust it.</p>
            </div>
          )}

          <DownloadPanel resourceId={r._id} title={r.title} downloadUrl={r.downloadUrl} />

          {visibleRows.length > 0 && (
            <dl className="facts">
              {visibleRows.map(([k, v]) => (
                <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
          )}

          {r.tags && r.tags.length > 0 && (
            <ul className="tag-list" aria-label="Tags">
              {r.tags.map((t) => (
                <li key={t}><Link to={`/category/${cat?.slug ?? ''}?tag=${encodeURIComponent(t)}`} className="chip">{t}</Link></li>
              ))}
            </ul>
          )}

          {r.previewUrl && isSafeWebUrl(r.previewUrl) && !isImageUrl(r.previewUrl) && (
            <a className="text-link" href={r.previewUrl} target="_blank" rel="noopener noreferrer">
              Open preview page <ExternalLink size={14} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>

      <div className="prose-grid">
        {r.details && (<section><h2>About this resource</h2><p className="prewrap">{r.details}</p></section>)}
        {r.compatibilityNotes && (<section><h2>Compatibility</h2><p className="prewrap">{r.compatibilityNotes}</p></section>)}
        {r.instructions && (<section><h2>How to use</h2><p className="prewrap">{r.instructions}</p></section>)}
        {r.versionNotes && (<section><h2>Version notes</h2><p className="prewrap">{r.versionNotes}</p></section>)}
      </div>

      {cat && (
        <section className="section" aria-labelledby="rel-h">
          <div className="section-head">
            <h2 id="rel-h">More in {cat.title}</h2>
            <Link to={`/category/${cat.slug}`} className="text-link"><ArrowLeft size={14} aria-hidden="true" /> Back to {cat.title}</Link>
          </div>
          {related.data && related.data.items.length > 0 ? (
            <ResourceGrid items={related.data.items} />
          ) : (
            !related.loading && <p className="muted">There are no other resources in this category yet.</p>
          )}
        </section>
      )}
    </div>
  )
}
