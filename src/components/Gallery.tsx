import { useMemo, useState } from 'react'
import { ExternalLink, Play } from 'lucide-react'
import { Img } from './Img'
import { isImageUrl, parseVideo } from '../lib/media'
import { imageUrl } from '../lib/sanity'
import type { Resource, SanityImage } from '../lib/types'

type Slide =
  | { type: 'video'; id: string }
  | { type: 'image'; id: string; image: SanityImage; alt: string }
  | { type: 'remote-image'; id: string; src: string; alt: string }

/** Only shows media that the admin actually supplied. Nothing is invented. */
export function Gallery({ r }: { r: Resource }) {
  const video = parseVideo(r.previewVideoUrl)
  const slides = useMemo<Slide[]>(() => {
    const list: Slide[] = []
    if (video) list.push({ type: 'video', id: 'video' })
    if (r.thumbnail?.asset) list.push({ type: 'image', id: 'thumb', image: r.thumbnail, alt: r.thumbnail.alt || `${r.title} cover` })
    ;(r.screenshots || []).forEach((s, i) => {
      if (s?.asset) list.push({ type: 'image', id: `s${i}`, image: s, alt: s.alt || `${r.title} screenshot ${i + 1}` })
    })
    if (isImageUrl(r.previewUrl)) list.push({ type: 'remote-image', id: 'purl', src: r.previewUrl as string, alt: `${r.title} preview` })
    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [r])

  const [active, setActive] = useState(0)
  const [remoteFailed, setRemoteFailed] = useState(false)
  const current = slides[Math.min(active, slides.length - 1)]

  if (!current) {
    return (
      <div className="stage stage-empty">
        <p>No preview has been added for this resource yet.</p>
      </div>
    )
  }

  return (
    <div className="gallery">
      <div className="stage">
        <div className="stage-in" key={current.id}>
        {current.type === 'video' && video?.kind === 'youtube' && (
          <iframe src={video.embed} title={`${r.title} preview video`} loading="lazy" allow="encrypted-media; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
        )}
        {current.type === 'video' && video?.kind === 'file' && (
          <video src={video.src} controls preload="metadata" playsInline aria-label={`${r.title} preview video`} />
        )}
        {current.type === 'video' && video?.kind === 'link' && (
          <div className="stage-empty">
            <p>This preview video opens on another site.</p>
            <a className="btn" href={video.href} target="_blank" rel="noopener noreferrer">
              Watch preview <ExternalLink size={15} aria-hidden="true" />
            </a>
          </div>
        )}
        {current.type === 'image' && <Img image={current.image} alt={current.alt} width={1280} sizes="(max-width: 900px) 95vw, 720px" eager />}
        {current.type === 'remote-image' &&
          (remoteFailed ? (
            <div className="stage-empty"><p>The preview image couldn't be loaded.</p></div>
          ) : (
            <img src={current.src} alt={current.alt} onError={() => setRemoteFailed(true)} referrerPolicy="no-referrer" />
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <ul className="thumbs" aria-label="Preview gallery">
          {slides.map((s, i) => (
            <li key={s.id}>
              <button
                className={`thumb ${i === active ? 'is-active' : ''}`}
                onClick={() => setActive(i)}
                aria-label={s.type === 'video' ? 'Show preview video' : `Show image ${i + (video ? 0 : 1)}`}
                aria-current={i === active}
              >
                {s.type === 'video' ? (
                  <span className="thumb-video"><Play size={16} aria-hidden="true" /></span>
                ) : s.type === 'image' ? (
                  <img src={imageUrl(s.image, 160)} alt="" loading="lazy" decoding="async" />
                ) : (
                  <img src={s.src} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
