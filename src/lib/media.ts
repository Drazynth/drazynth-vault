export type VideoSource =
  | { kind: 'youtube'; embed: string; href: string }
  | { kind: 'file'; src: string }
  | { kind: 'link'; href: string }

const FILE_VIDEO = /\.(mp4|webm|ogg|mov)$/i
const FILE_IMAGE = /\.(png|jpe?g|webp|gif|avif|svg)$/i

export function parseVideo(url?: string): VideoSource | null {
  if (!url) return null
  let u: URL
  try {
    u = new URL(url)
  } catch {
    return null
  }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return null
  const host = u.hostname.replace(/^www\./, '')
  let id: string | null = null
  if (host === 'youtu.be') id = u.pathname.slice(1)
  else if (host === 'youtube.com' || host === 'm.youtube.com') {
    if (u.pathname === '/watch') id = u.searchParams.get('v')
    else if (u.pathname.startsWith('/shorts/') || u.pathname.startsWith('/embed/')) id = u.pathname.split('/')[2]
  }
  if (id && /^[\w-]{6,20}$/.test(id)) {
    return { kind: 'youtube', embed: `https://www.youtube-nocookie.com/embed/${id}`, href: url }
  }
  if (FILE_VIDEO.test(u.pathname)) return { kind: 'file', src: url }
  return { kind: 'link', href: url }
}

export function isImageUrl(url?: string): boolean {
  if (!url) return false
  try {
    return FILE_IMAGE.test(new URL(url).pathname)
  } catch {
    return false
  }
}

export function formatDate(iso?: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
