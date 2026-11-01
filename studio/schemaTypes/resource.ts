import { defineField, defineType } from 'sanity'

const CATEGORIES = [
  { title: 'XML / Presets', value: 'xml-presets' },
  { title: 'Custom Effects', value: 'custom-effects' },
  { title: 'APKs', value: 'apks' },
  { title: 'SFX', value: 'sfx' },
  { title: 'Overlays', value: 'overlays' },
]

// Only allow normal web links. Blocks javascript: and similar.
const webUrl = { scheme: ['http', 'https'] }

export const resource = defineType({
  name: 'resource',
  title: 'Resource',
  type: 'document',
  orderings: [
    { title: 'Manual order', name: 'manual', by: [{ field: 'sortOrder', direction: 'asc' }] },
    { title: 'Newest first', name: 'newest', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'categories', media: 'thumbnail' },
    prepare: ({ title, subtitle, media }) => ({
      title,
      subtitle: Array.isArray(subtitle) ? subtitle.join(', ') : '',
      media,
    }),
  },
  fields: [
    defineField({ name: 'title', title: 'Name', type: 'string', validation: (r) => r.required().max(90) }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      description: 'Click Generate. This becomes the page address: /resources/your-slug',
      type: 'slug',
      options: { source: 'title', maxLength: 80 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Category',
      description: 'Pick the exact category. Choose more than one only if you want it listed in several.',
      type: 'array',
      of: [{ type: 'string' }],
      options: { list: CATEGORIES },
      validation: (r) => r.required().min(1).unique(),
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'text',
      rows: 3,
      validation: (r) => r.required().max(220),
    }),
    defineField({ name: 'details', title: 'Detailed description (optional)', type: 'text', rows: 8 }),
    defineField({ name: 'instructions', title: 'Instructions (optional)', type: 'text', rows: 5 }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail / cover image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt text', type: 'string' }],
    }),
    defineField({
      name: 'screenshots',
      title: 'Screenshots',
      description: 'Upload as many as you need.',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', title: 'Alt text', type: 'string' }],
        },
      ],
    }),
    defineField({
      name: 'previewUrl',
      title: 'Preview media URL (optional)',
      description: 'A page or image link that shows the resource. NOT the download link.',
      type: 'url',
      validation: (r) => r.uri(webUrl),
    }),
    defineField({
      name: 'previewVideoUrl',
      title: 'Preview video URL (optional)',
      description: 'A YouTube link or a direct .mp4 / .webm link.',
      type: 'url',
      validation: (r) => r.uri(webUrl),
    }),
    defineField({
      name: 'previewAudioUrl',
      title: 'Audio preview URL (SFX only, optional)',
      description: 'A direct .mp3 / .ogg / .wav link to a short preview clip.',
      type: 'url',
      validation: (r) => r.uri(webUrl),
    }),
    defineField({
      name: 'downloadUrl',
      title: 'Download URL (Google Drive)',
      description: 'Paste the Drive share link. Set sharing to "Anyone with the link" first.',
      type: 'url',
      validation: (r) => r.required().uri(webUrl),
    }),
    defineField({ name: 'compatibleApp', title: 'Compatible app', type: 'string' }),
    defineField({ name: 'compatibilityNotes', title: 'Compatibility notes', type: 'text', rows: 3 }),
    defineField({ name: 'fileFormat', title: 'File format (e.g. XML, MP3, APK)', type: 'string' }),
    defineField({ name: 'fileSize', title: 'File size (e.g. 24 MB)', type: 'string' }),
    defineField({ name: 'version', title: 'Version', type: 'string' }),
    defineField({ name: 'versionNotes', title: 'Version notes (APKs)', type: 'text', rows: 3 }),
    defineField({ name: 'resolution', title: 'Resolution (overlays)', type: 'string' }),
    defineField({ name: 'androidVersion', title: 'Android compatibility (APKs)', type: 'string' }),
    defineField({
      name: 'isUnofficial',
      title: 'Unofficial / modified file',
      description: 'Turn on for any APK that is not the official release. A notice is shown on the page.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({ name: 'appIcon', title: 'App icon (APKs, optional)', type: 'image' }),
    defineField({ name: 'waveform', title: 'Waveform artwork (SFX, optional)', type: 'image' }),
    defineField({ name: 'featured', title: 'Featured on home page', type: 'boolean', initialValue: false }),
    defineField({
      name: 'sortOrder',
      title: 'Manual order (lower shows first)',
      type: 'number',
      initialValue: 100,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publication date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
  ],
})
