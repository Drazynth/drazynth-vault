import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import { imageSrcSet, imageUrl } from '../lib/sanity'
import type { SanityImage } from '../lib/types'

interface Props {
  image?: SanityImage
  alt: string
  width?: number
  sizes?: string
  eager?: boolean
  className?: string
}

/** Lazy, responsive Sanity image with a graceful fallback when missing or broken. */
export function Img({ image, alt, width = 800, sizes = '(max-width: 640px) 90vw, 400px', eager, className }: Props) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const src = imageUrl(image, width)
  if (!src || failed) {
    return (
      <div className={`img-fallback ${className || ''}`} role="img" aria-label={`${alt} (no image available)`}>
        <ImageOff size={20} aria-hidden="true" />
      </div>
    )
  }
  const widths = [320, 480, 640, 960, 1280].filter((w) => w <= Math.max(width, 640))
  return (
    <img
      className={`img-fade ${loaded ? 'is-in' : ''} ${className || ''}`}
      src={src}
      srcSet={imageSrcSet(image, widths)}
      sizes={sizes}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
    />
  )
}
