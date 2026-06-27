import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMarkdown } from '@content-collections/markdown'
import { existsSync } from 'node:fs'
import path from 'node:path'
import rehypeHighlight from 'rehype-highlight'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import { z } from 'zod'
import { getReadingTime } from './lib/reading-time'

// Frontmatter dates are date-only (YYYY-MM-DD). Keep them as date-only
// strings instead of converting to ISO UTC — `new Date('YYYY-MM-DD')` is
// parsed as UTC midnight, which would shift the displayed day in other
// timezones. Downstream code parses via lib/site.parsePostDate, which
// constructs from Y/M/D components so the calendar date is timezone-stable.
function toIsoDate(value: string | Date) {
  if (value instanceof Date) {
    const year = value.getFullYear()
    const month = String(value.getMonth() + 1).padStart(2, '0')
    const day = String(value.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return value.split('T')[0]
}

function validatePostDate(value: string | Date) {
  const date = new Date(value)

  return Number.isFinite(date.getTime()) && date.getTime() <= Date.now()
}

function validateCoverImage(value: string) {
  if (!value) {
    return true
  }

  if (!value.startsWith('/images/')) {
    return false
  }

  return existsSync(path.join(process.cwd(), 'public', value))
}

async function assertUniqueSlug(slug: string, context: { collection: { documents: () => Promise<Array<{ slug: string }>> } }) {
  const documents = await context.collection.documents()
  const matches = documents.filter((document) => document.slug === slug)

  if (matches.length > 1) {
    throw new Error(`Duplicate post slug: ${slug}`)
  }
}

const posts = defineCollection({
  name: 'posts',
  typeName: 'Post',
  directory: 'content/posts',
  include: '**/*.md',
  schema: z.object({
    title: z.string(),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must use lowercase letters, numbers, and hyphens'),
    date: z.union([z.string(), z.date()]).refine(validatePostDate, 'date must be valid and not in the future'),
    tags: z.array(z.string()).default([]),
    excerpt: z.string(),
    coverImage: z.string().default('').refine(validateCoverImage, 'coverImage must point to an existing file under /public/images'),
    content: z.string(),
  }),
  transform: async (document, context) => {
    await assertUniqueSlug(document.slug, context)

    const html = await compileMarkdown(context, document, {
      remarkPlugins: [remarkGfm],
      // Sanitize before highlighting: strip raw/dangerous HTML first, then let
      // rehype-highlight add `hljs` spans afterwards (un-sanitized, so the
      // highlighting classes survive to the final HTML).
      rehypePlugins: [rehypeSanitize, rehypeHighlight],
    })

    return {
      ...document,
      _id: document._meta.filePath,
      date: toIsoDate(document.date),
      body: {
        raw: document.content,
        html,
      },
      url: `/posts/${document.slug}`,
      readingTime: getReadingTime(document.content),
    }
  },
})

export default defineConfig({
  content: [posts],
})
