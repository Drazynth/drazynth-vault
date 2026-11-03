import { readFile, writeFile } from 'node:fs/promises'

const SITE_URL = 'https://drazynth-vault.pages.dev'
const API_VERSION = '2024-10-01'
const categories = ['xml-presets', 'custom-effects', 'apks', 'sfx', 'overlays']

function readEnvFile(text) {
  const values = {}
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
    if (match) values[match[1]] = match[2].replace(/^['"]|['"]$/g, '')
  }
  return values
}

let fileEnv = {}
try { fileEnv = readEnvFile(await readFile('.env', 'utf8')) } catch { /* Cloudflare supplies environment variables in CI. */ }
const projectId = process.env.VITE_SANITY_PROJECT_ID || fileEnv.VITE_SANITY_PROJECT_ID
const dataset = process.env.VITE_SANITY_DATASET || fileEnv.VITE_SANITY_DATASET || 'production'

const urls = new Map()
const add = (loc, lastmod) => urls.set(loc, lastmod || '')
add(`${SITE_URL}/`)
for (const category of categories) add(`${SITE_URL}/category/${category}`)

if (projectId && projectId !== 'your_project_id') {
  const query = '*[_type == "resource" && defined(slug.current) && !(_id in path("drafts.**"))]{ "slug": slug.current, _updatedAt }'
  const endpoint = `https://${projectId}.api.sanity.io/v${API_VERSION}/data/query/${encodeURIComponent(dataset)}?query=${encodeURIComponent(query)}`
  const response = await fetch(endpoint, { headers: { Accept: 'application/json' } })
  if (!response.ok) throw new Error(`Sanity sitemap query failed: HTTP ${response.status}`)
  const payload = await response.json()
  for (const resource of payload.result || []) {
    if (!resource.slug) continue
    const loc = `${SITE_URL}/resources/${encodeURIComponent(resource.slug)}`
    add(loc, resource._updatedAt ? new Date(resource._updatedAt).toISOString().slice(0, 10) : '')
  }
  console.log(`Sitemap includes ${urls.size} URLs (${(payload.result || []).length} published resources returned).`)
} else {
  console.warn('Sanity project ID not found. Sitemap includes homepage and category pages only; set VITE_SANITY_PROJECT_ID to include resource pages.')
}

const xmlEscape = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;')
const entries = [...urls.entries()].map(([loc, lastmod]) => `  <url>\n    <loc>${xmlEscape(loc)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`).join('\n')
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`
await writeFile('public/sitemap.xml', xml, 'utf8')
