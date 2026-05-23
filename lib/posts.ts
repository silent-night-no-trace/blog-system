import { allPosts } from 'contentlayer/generated'

export function getSortedPosts() {
  return allPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export function getPostsByTag(tag: string) {
  return allPosts
    .filter(post => post.tags.includes(tag))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getAllTags() {
  const tags = new Set<string>()
  allPosts.forEach(post => {
    post.tags.forEach(tag => tags.add(tag))
  })
  return Array.from(tags).sort()
}

export function getArchive() {
  const postsByYear = new Map<number, Map<number, typeof allPosts>>()

  allPosts.forEach(post => {
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
          posts: posts.sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        }))
    }))
}
