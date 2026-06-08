import { algoliasearch } from 'algoliasearch'
import { loadEnvConfig } from '@next/env'
import { allPosts } from 'content-collections'

type ContentPost = (typeof allPosts)[number]

type AlgoliaPostRecord = {
  objectID: string
  title: string
  slug: string
  date: string
  tags: string[]
  excerpt: string
  content: string
  readingTime: number
}

const DRY_RUN_FLAG = '--dry-run'
const REPLACE_FLAG = '--replace'

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

function toAlgoliaRecord(post: ContentPost): AlgoliaPostRecord {
  return {
    objectID: post.slug,
    title: post.title,
    slug: post.slug,
    date: post.date,
    tags: post.tags,
    excerpt: post.excerpt,
    content: post.body.raw,
    readingTime: post.readingTime,
  }
}

async function syncToAlgolia() {
  const indexName = getIndexName()
  const records = [...allPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(toAlgoliaRecord)

  if (process.argv.includes(DRY_RUN_FLAG)) {
    console.log(`Prepared ${records.length} records for Algolia index "${indexName}".`)
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
      attributesForFaceting: ['tags'],
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
