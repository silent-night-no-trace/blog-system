import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMarkdown } from '@content-collections/markdown'
import { existsSync } from 'node:fs'
import path from 'node:path'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import { z } from 'zod'

const wordsPerMinute = 200

function toIsoDate(value: string | Date) {
  return new Date(value).toISOString()
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

function getReadingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
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
      rehypePlugins: [rehypeHighlight],
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
