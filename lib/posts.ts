import { allPosts, type Post } from 'content-collections'

export type { Post }

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

export function getPostsByTag(tag: string) {
  return getSortedPosts().filter((post) => post.tags.includes(tag))
}

export function getAllTags() {
  const tags = new Set<string>()

  allPosts.forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag))
  })

  return Array.from(tags).sort()
}

export function getTagsWithCounts() {
  const tagsMap = new Map<string, number>()

  allPosts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagsMap.set(tag, (tagsMap.get(tag) || 0) + 1)
    })
  })

  return Array.from(tagsMap.entries()).sort((a, b) => b[1] - a[1])
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
