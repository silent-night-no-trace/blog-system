import { existsSync } from 'node:fs'
import path from 'node:path'
import { allPosts } from 'content-collections'
import { normalizeTag } from '../lib/posts'

type ContentPost = (typeof allPosts)[number]

export function validatePosts(posts: ContentPost[] = allPosts) {
  const failures: string[] = []
  const slugCounts = new Map<string, number>()

  posts.forEach((post) => {
    slugCounts.set(post.slug, (slugCounts.get(post.slug) || 0) + 1)
  })

  posts.forEach((post) => {
    if ((slugCounts.get(post.slug) || 0) > 1) {
      failures.push(`Duplicate post slug: ${post.slug}`)
    }

    const date = new Date(post.date)
    if (!Number.isFinite(date.getTime())) {
      failures.push(`Invalid date for post "${post.slug}": ${post.date}`)
    }

    if (date.getTime() > Date.now()) {
      failures.push(`Future date for post "${post.slug}": ${post.date}`)
    }

    if (post.coverImage) {
      if (!post.coverImage.startsWith('/images/')) {
        failures.push(`Invalid coverImage for post "${post.slug}": ${post.coverImage}`)
      } else if (!existsSync(path.join(process.cwd(), 'public', post.coverImage))) {
        failures.push(`Missing coverImage file for post "${post.slug}": ${post.coverImage}`)
      }
    }

    post.tags.forEach((tag) => {
      if (!normalizeTag(tag)) {
        failures.push(`Invalid normalized tag for post "${post.slug}": ${tag}`)
      }
    })
  })

  return failures
}

const failures = validatePosts()

if (failures.length > 0) {
  console.error(failures.map((failure, index) => `${index + 1}. ${failure}`).join('\n'))
  process.exitCode = 1
} else {
  console.log(`Content validation passed for ${allPosts.length} posts.`)
}
