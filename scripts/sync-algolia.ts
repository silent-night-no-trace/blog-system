import { algoliasearch } from 'algoliasearch'
import { loadEnvConfig } from '@next/env'
import { allPosts } from 'content-collections'
import { normalizeTag } from '../lib/posts'

type ContentPost = (typeof allPosts)[number]

type AlgoliaPostRecord = {
  objectID: string
  title: string
  slug: string
  date: string
  tags: string[]
  tagSlugs: string[]
  excerpt: string
  content: string
  readingTime: number
}

const DRY_RUN_FLAG = '--dry-run'
const REPLACE_FLAG = '--replace'
const SEARCH_CONTENT_MAX_LENGTH = 5000

loadEnvConfig(process.cwd())

function getRequiredEnv(name: string) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

function getIndexName() {
  return process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'blog_posts'
}

function cleanSearchContent(content: string) {
  return content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/[#>*_~\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getSearchContent(content: string) {
  const cleaned = cleanSearchContent(content)

  if (cleaned.length <= SEARCH_CONTENT_MAX_LENGTH) {
    return cleaned
  }

  return `${cleaned.slice(0, SEARCH_CONTENT_MAX_LENGTH).trimEnd()}...`
}

function toAlgoliaRecord(post: ContentPost): AlgoliaPostRecord {
  return {
    objectID: post.slug,
    title: post.title,
    slug: post.slug,
    date: post.date,
    tags: post.tags,
    tagSlugs: Array.from(new Set(post.tags.map(normalizeTag).filter(Boolean))),
    excerpt: post.excerpt,
    content: getSearchContent(post.body.raw),
    readingTime: post.readingTime,
  }
}

async function syncToAlgolia() {
  const indexName = getIndexName()
  const records = [...allPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(toAlgoliaRecord)

  if (process.argv.includes(DRY_RUN_FLAG)) {
    const totalContentChars = records.reduce(
      (total, record) => total + record.content.length,
      0
    )

    console.log(`Prepared ${records.length} records for Algolia index "${indexName}".`)
    console.log(`Total searchable content: ${totalContentChars} chars.`)
    return
  }

  const client = algoliasearch(
    getRequiredEnv('NEXT_PUBLIC_ALGOLIA_APP_ID'),
    getRequiredEnv('ALGOLIA_ADMIN_KEY')
  )

  if (process.argv.includes(REPLACE_FLAG)) {
    const clearTask = await client.clearObjects({ indexName })
    await client.waitForTask({ indexName, taskID: clearTask.taskID })
  }

  await client.saveObjects({
    indexName,
    objects: records,
    waitForTasks: true,
  })

  const settingsTask = await client.setSettings({
    indexName,
      indexSettings: {
        searchableAttributes: ['title', 'content', 'tags', 'excerpt'],
        attributesForFaceting: ['tags', 'tagSlugs'],
      },
  })
  await client.waitForTask({ indexName, taskID: settingsTask.taskID })

  console.log(`Synced ${records.length} posts to Algolia index "${indexName}".`)
}

syncToAlgolia().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)

  console.error(`Failed to sync Algolia index: ${message}`)
  process.exitCode = 1
})
