import { Link } from 'react-router-dom'
import { Img } from './Img'
import { getCategory } from '../config'
import { formatDate } from '../lib/media'
import type { ResourceSummary } from '../lib/types'

export function ResourceCard({ r }: { r: ResourceSummary }) {
  const cat = getCategory(r.categories?.[0])
  const meta = [r.fileFormat, r.version && `v${r.version}`, r.fileSize].filter(Boolean).join(' · ')
  return (
    <article className="card">
      <Link to={`/resources/${r.slug}`} className="card-link" aria-label={`${r.title}, open details`}>
        <div className="card-thumb">
          <Img image={r.thumbnail} alt={r.thumbnail?.alt || r.title} width={640} />
          {cat && <span className="chip chip-overlay">{cat.title}</span>}
        </div>
        <div className="card-body">
          <h3>{r.title}</h3>
          <p className="clamp-2">{r.description}</p>
          <p className="card-meta">{meta || formatDate(r.publishedAt)}</p>
        </div>
      </Link>
    </article>
  )
}
