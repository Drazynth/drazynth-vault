import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { Resource, ResourceSummary, SanityImage } from './types'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID as string | undefined
const dataset = (import.meta.env.VITE_SANITY_DATASET as string | undefined) || 'production'

export const cmsConfigured = Boolean(projectId)

// Read-only client. No token: anonymous requests can only see PUBLISHED documents.
const client = createClient({
  projectId: projectId || 'unconfigured',
  dataset,
  apiVersion: '2024-10-01',
  useCdn: true,
})

const builder = imageUrlBuilder(client)

export function imageUrl(img: SanityImage | undefined, width: number): string | undefined {
  if (!img?.asset) return undefined
  return builder.image(img).width(width).auto('format').quality(80).url()
}

export function imageSrcSet(img: SanityImage | undefined, widths: number[]): string | undefined {
  if (!img?.asset) return undefined
  return widths.map((w) => `${imageUrl(img, w)} ${w}w`).join(', ')
}

const SUMMARY = `{
  _id, title, "slug": slug.current, categories, description, tags,
  compatibleApp, fileFormat, fileSize, version, publishedAt, featured,
  "thumbnail": thumbnail{asset, alt}, "appIcon": appIcon{asset}
}`

const NOT_DRAFT = `!(_id in path("drafts.**"))`

export interface ListOptions {
  category?: string
  tag?: string
  q?: string
  featured?: boolean
  sinceDays?: number
  order?: 'manual' | 'newest'
  offset?: number
  limit?: number
  excludeId?: string
}

function buildFilter(o: ListOptions) {
  const conds = [`_type == "resource"`, NOT_DRAFT, `defined(slug.current)`]
  const params: Record<string, unknown> = {}
  if (o.category) {
    conds.push(`$category in categories`)
    params.category = o.category
  }
  if (o.tag) {
    conds.push(`$tag in tags`)
    params.tag = o.tag
  }
  if (o.featured) conds.push(`featured == true`)
  if (o.excludeId) {
    conds.push(`_id != $excludeId`)
    params.excludeId = o.excludeId
  }
  if (o.sinceDays) {
    params.since = new Date(Date.now() - o.sinceDays * 86400000).toISOString()
    conds.push(`publishedAt >= $since`)
  }
  const terms = (o.q || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 5)
  terms.forEach((t, i) => {
    params[`t${i}`] = `${t}*`
    conds.push(
      `(title match $t${i} || description match $t${i} || compatibleApp match $t${i} || count(tags[@ match $t${i}]) > 0)`,
    )
  })
  return { filter: conds.join(' && '), params }
}

export async function listResources(o: ListOptions): Promise<{ items: ResourceSummary[]; total: number }> {
  const { filter, params } = buildFilter(o)
  const offset = o.offset ?? 0
  const limit = o.limit ?? 12
  const order = o.order === 'newest' ? 'publishedAt desc' : 'coalesce(sortOrder, 100) asc, publishedAt desc'
  const query = `{
    "items": *[${filter}] | order(${order}) [${offset}...${offset + limit}] ${SUMMARY},
    "total": count(*[${filter}])
  }`
  return client.fetch(query, params)
}

export async function getResource(slug: string): Promise<Resource | null> {
  const query = `*[_type == "resource" && ${NOT_DRAFT} && slug.current == $slug][0]{
    _id, title, "slug": slug.current, categories, description, details, instructions, tags,
    compatibleApp, compatibilityNotes, fileFormat, fileSize, version, versionNotes,
    resolution, androidVersion, isUnofficial, publishedAt, featured,
    previewUrl, previewVideoUrl, previewAudioUrl, downloadUrl,
    "thumbnail": thumbnail{asset, alt},
    "screenshots": screenshots[]{asset, alt},
    "appIcon": appIcon{asset}, "waveform": waveform{asset}
  }`
  return client.fetch(query, { slug })
}

export async function listTags(category?: string): Promise<string[]> {
  const cond = category ? ` && $category in categories` : ''
  const query = `array::unique(*[_type == "resource" && ${NOT_DRAFT}${cond}].tags[])`
  const tags: string[] | null = await client.fetch(query, category ? { category } : {})
  return (tags || []).filter(Boolean).sort((a, b) => a.localeCompare(b)).slice(0, 40)
}
