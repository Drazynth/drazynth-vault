import { AudioLines, Layers, SlidersHorizontal, Smartphone, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const SITE_NAME = 'DRAZYNTH VAULT'
export const YOUTUBE_URL = 'https://www.youtube.com/@drazynth_x'
export const TELEGRAM_URL = 'https://t.me/drazynth_vault'
export const STUDIO_URL = (import.meta.env.VITE_STUDIO_URL as string | undefined) || ''
export const CONTACT_EMAIL = (import.meta.env.VITE_CONTACT_EMAIL as string | undefined) || ''

export const PAGE_SIZE = 12

export type CategorySlug = 'xml-presets' | 'custom-effects' | 'apks' | 'sfx' | 'overlays'

export interface Category {
  slug: CategorySlug
  title: string
  blurb: string
  icon: LucideIcon
}

export const CATEGORIES: Category[] = [
  { slug: 'xml-presets', title: 'XML / Presets', blurb: 'Ready-to-import presets and XML files for your editing app.', icon: SlidersHorizontal },
  { slug: 'custom-effects', title: 'Custom Effects', blurb: 'Effects you can add to your projects, with previews and setup notes.', icon: Sparkles },
  { slug: 'apks', title: 'APKs', blurb: 'Android apps with version, size and compatibility details.', icon: Smartphone },
  { slug: 'sfx', title: 'SFX', blurb: 'Sound effects you can audition before downloading.', icon: AudioLines },
  { slug: 'overlays', title: 'Overlays', blurb: 'Overlay clips and textures with resolution and format info.', icon: Layers },
]

export function getCategory(slug?: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}
