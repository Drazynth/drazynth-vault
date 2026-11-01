import { useSearchParams } from 'react-router-dom'
import { CATEGORIES, PAGE_SIZE } from '../config'
import { SearchBox } from '../components/SearchBox'
import { ResourceGrid } from '../components/ResourceGrid'
import { ErrorState, NoResults, SetupNotice, SkeletonGrid } from '../components/States'
import { useAsync, usePageTitle, useResourceList } from '../lib/hooks'
import { cmsConfigured, listTags } from '../lib/sanity'

export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const cat = params.get('cat') || ''
  const tag = params.get('tag') || ''
  usePageTitle(q ? `Search: ${q}` : 'Search')

  const list = useResourceList({ q, category: cat || undefined, tag: tag || undefined, order: q ? 'manual' : 'newest' }, PAGE_SIZE)
  const tags = useAsync(() => (cmsConfigured ? listTags(cat || undefined) : Promise.resolve([])), [cat])

  const update = (next: Record<string, string>) => {
    const p = new URLSearchParams(params)
    Object.entries(next).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)))
    setParams(p, { replace: true })
  }

  return (
    <div className="wrap section">
      <h1 className="page-title">Search</h1>
      <div className="toolbar">
        <SearchBox value={q} onSubmit={(v) => update({ q: v })} onClear={() => update({ q: '' })} />
        <div className="chips" role="group" aria-label="Filter by category">
          <button className={`chip-btn ${!cat ? 'is-on' : ''}`} aria-pressed={!cat} onClick={() => update({ cat: '', tag: '' })}>All categories</button>
          {CATEGORIES.map((c) => (
            <button key={c.slug} className={`chip-btn ${cat === c.slug ? 'is-on' : ''}`} aria-pressed={cat === c.slug} onClick={() => update({ cat: cat === c.slug ? '' : c.slug, tag: '' })}>
              {c.title}
            </button>
          ))}
        </div>
        {tags.data && tags.data.length > 0 && (
          <div className="chips" role="group" aria-label="Filter by tag">
            {tags.data.map((t) => (
              <button key={t} className={`chip-btn chip-tag ${tag === t ? 'is-on' : ''}`} aria-pressed={tag === t} onClick={() => update({ tag: tag === t ? '' : t })}>
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {!cmsConfigured && <SetupNotice />}
      {cmsConfigured && list.loading && <SkeletonGrid />}
      {cmsConfigured && list.error && !list.loading && <ErrorState onRetry={list.retry} />}
      {cmsConfigured && !list.loading && !list.error && list.items.length === 0 && (
        <NoResults onClear={q || cat || tag ? () => setParams({}, { replace: true }) : undefined}>
          {q || cat || tag ? 'No published resources match your search.' : 'No resources have been published yet.'}
        </NoResults>
      )}
      {!list.loading && list.items.length > 0 && (
        <>
          <p className="muted result-count" aria-live="polite">{list.total} {list.total === 1 ? 'result' : 'results'}</p>
          <ResourceGrid items={list.items} />
          {list.hasMore && (
            <div className="center">
              <button className="btn" onClick={list.loadMore} disabled={list.loadingMore}>{list.loadingMore ? 'Loading…' : 'Load more'}</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
