export interface SanityImage {
  _type?: 'image'
  asset?: { _ref: string; _type: 'reference' }
  alt?: string
}

export interface ResourceSummary {
  _id: string
  title: string
  slug: string
  categories: string[]
  description: string
  tags?: string[]
  compatibleApp?: string
  fileFormat?: string
  fileSize?: string
  version?: string
  publishedAt: string
  featured?: boolean
  thumbnail?: SanityImage
  appIcon?: SanityImage
}

export interface Resource extends ResourceSummary {
  details?: string
  instructions?: string
  screenshots?: SanityImage[]
  previewUrl?: string
  previewVideoUrl?: string
  previewAudioUrl?: string
  downloadUrl?: string
  compatibilityNotes?: string
  versionNotes?: string
  resolution?: string
  androidVersion?: string
  isUnofficial?: boolean
  waveform?: SanityImage
}
