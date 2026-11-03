import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Img } from './Img'
import { Reveal } from './Reveal'
import { getCategory } from '../config'
import { formatDate } from '../lib/media'
import type { ResourceSummary } from '../lib/types'

export function ResourceCard({ r, index = 0 }: { r: ResourceSummary; index?: number }) {
  const cat = getCategory(r.categories?.[0])
  const meta = [r.fileFormat, r.version && `v${r.version}`, r.fileSize].filter(Boolean).join(' · ')
  return (
    <Reveal as="article" className="card" delay={(index % 6) * 70} glow tilt>
      <Link to={`/resources/${r.slug}`} className="card-link" aria-label={`${r.title}, open details`}>
        <div className="card-thumb">
          <Img image={r.thumbnail} alt={r.thumbnail?.alt || r.title} width={640} />
          {cat && <span className="chip chip-overlay">{cat.title}</span>}
          <span className="card-go" aria-hidden="true"><ArrowUpRight size={15} /></span>
        </div>
        <div className="card-body">
          <h3>{r.title}</h3>
          <p className="clamp-2">{r.description}</p>
          <p className="card-meta">{meta || formatDate(r.publishedAt)}</p>
        </div>
      </Link>
    </Reveal>
  )
}
