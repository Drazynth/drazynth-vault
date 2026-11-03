import { Link, useParams, useSearchParams } from 'react-router-dom'
import { getCategory, PAGE_SIZE } from '../config'
import { SearchBox } from '../components/SearchBox'
import { ResourceGrid } from '../components/ResourceGrid'
import { EmptyState, ErrorState, NoResults, SetupNotice, SkeletonGrid } from '../components/States'
import { useAsync, usePageTitle, useResourceList } from '../lib/hooks'
import { cmsConfigured, listTags } from '../lib/sanity'
import NotFound from './NotFound'

export default function CategoryPage() {
  const { slug } = useParams()
  const category = getCategory(slug)
  if (!category) return <NotFound />
  return <CategoryView slug={category.slug} />
}

function CategoryView({ slug }: { slug: string }) {
  const category = getCategory(slug)!
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const tag = params.get('tag') || ''
  usePageTitle(category.title, category.blurb)

  const list = useResourceList({ category: slug, q, tag, order: 'manual' }, PAGE_SIZE)
  const tags = useAsync(() => (cmsConfigured ? listTags(slug) : Promise.resolve([])), [slug])

  const update = (next: Record<string, string>) => {
    const p = new URLSearchParams(params)
    Object.entries(next).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)))
    setParams(p, { replace: true })
  }
  const filtering = Boolean(q || tag)

  return (
    <div className="wrap stagger section">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link> <span aria-hidden="true">/</span> <span aria-current="page">{category.title}</span>
      </nav>
      <h1 className="page-title"><category.icon size={28} aria-hidden="true" /> {category.title}</h1>
      <p className="lede">{category.blurb}</p>

      <div className="toolbar">
        <SearchBox
          value={q}
          placeholder={`Search ${category.title}`}
          label={`Search ${category.title}`}
          onSubmit={(v) => update({ q: v })}
          onClear={() => update({ q: '' })}
        />
        {tags.data && tags.data.length > 0 && (
          <div className="chips" role="group" aria-label="Filter by tag">
            <button className={`chip-btn ${!tag ? 'is-on' : ''}`} onClick={() => update({ tag: '' })} aria-pressed={!tag}>All</button>
            {tags.data.map((t) => (
              <button key={t} className={`chip-btn ${tag === t ? 'is-on' : ''}`} onClick={() => update({ tag: tag === t ? '' : t })} aria-pressed={tag === t}>
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {!cmsConfigured && <SetupNotice />}
      {cmsConfigured && list.loading && <SkeletonGrid />}
      {cmsConfigured && list.error && !list.loading && <ErrorState onRetry={list.retry} />}
      {cmsConfigured && !list.loading && !list.error && list.items.length === 0 &&
        (filtering ? (
          <NoResults onClear={() => update({ q: '', tag: '' })}>Nothing in {category.title} matches that.</NoResults>
        ) : (
          <EmptyState title={`No ${category.title} yet`}>Resources in this category will show up here once they're published.</EmptyState>
        ))}
      {!list.loading && list.items.length > 0 && (
        <>
          <p className="muted result-count" aria-live="polite">{list.total} {list.total === 1 ? 'resource' : 'resources'}</p>
          <ResourceGrid items={list.items} />
          {list.hasMore && (
            <div className="center">
              <button className="btn" onClick={list.loadMore} disabled={list.loadingMore}>
                {list.loadingMore ? 'Loading…' : 'Load more'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
