import { allPosts, type Post } from 'content-collections'

export type { Post }

export type TagSummary = {
  label: string
  slug: string
  count: number
}

export type ArchiveGroup = {
  year: number
  months: {
    month: number
    posts: Post[]
  }[]
}

export function getAllPosts() {
  return [...allPosts]
}

export function getSortedPosts() {
  return getAllPosts().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export function getPostBySlug(slug: string) {
  return allPosts.find((post) => post.slug === slug)
}

export function normalizeTag(tag: string) {
  return tag
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\./g, '')
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getTagSummariesMap() {
  const tagsMap = new Map<string, TagSummary>()

  const getLabelScore = (tag: string) => {
    let score = tag.length

    if (/[A-Z]/.test(tag)) {
      score += 10
    }

    if (/[^a-z0-9\u4e00-\u9fff]/i.test(tag)) {
      score += 10
    }

    return score
  }

  allPosts.forEach((post) => {
    post.tags.forEach((tag) => {
      const slug = normalizeTag(tag)

      if (!slug) {
        return
      }

      const existing = tagsMap.get(slug)
      if (existing) {
        existing.count += 1

        if (getLabelScore(tag) > getLabelScore(existing.label)) {
          existing.label = tag
        }

        return
      }

      tagsMap.set(slug, {
        label: tag,
        slug,
        count: 1,
      })
    })
  })

  return tagsMap
}

export function getPostsByTag(tag: string) {
  const normalizedTag = normalizeTag(tag)

  return getSortedPosts().filter((post) =>
    post.tags.some((postTag) => normalizeTag(postTag) === normalizedTag)
  )
}

export function getAllTags() {
  return getTagsWithCounts().map((tag) => tag.slug)
}

export function getTagBySlug(tag: string) {
  return getTagSummariesMap().get(normalizeTag(tag))
}

export function getTagsWithCounts(): TagSummary[] {
  return Array.from(getTagSummariesMap().values()).sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count
    }

    return a.label.localeCompare(b.label)
  })
}

export function getArchive(): ArchiveGroup[] {
  const postsByYear = new Map<number, Map<number, Post[]>>()

  allPosts.forEach((post) => {
    const date = new Date(post.date)
    const year = date.getFullYear()
    const month = date.getMonth() + 1

    if (!postsByYear.has(year)) {
      postsByYear.set(year, new Map())
    }

    const monthsMap = postsByYear.get(year)!
    if (!monthsMap.has(month)) {
      monthsMap.set(month, [])
    }

    monthsMap.get(month)!.push(post)
  })

  return Array.from(postsByYear.entries())
    .sort(([yearA], [yearB]) => yearB - yearA)
    .map(([year, monthsMap]) => ({
      year,
      months: Array.from(monthsMap.entries())
        .sort(([monthA], [monthB]) => monthB - monthA)
        .map(([month, posts]) => ({
          month,
          posts: [...posts].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          ),
        })),
    }))
}
