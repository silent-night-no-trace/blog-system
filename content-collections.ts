import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMarkdown } from '@content-collections/markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import { z } from 'zod'

const wordsPerMinute = 200

function toIsoDate(value: string | Date) {
  return new Date(value).toISOString()
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
    slug: z.string(),
    date: z.union([z.string(), z.date()]),
    tags: z.array(z.string()).default([]),
    excerpt: z.string(),
    coverImage: z.string().default(''),
    content: z.string(),
  }),
  transform: async (document, context) => {
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
