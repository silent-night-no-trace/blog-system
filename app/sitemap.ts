import type { MetadataRoute } from 'next'
import { getAllPosts, getAllTags } from '@/lib/posts'
import { getAbsoluteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: getAbsoluteUrl('/'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: getAbsoluteUrl('/posts'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: getAbsoluteUrl('/tags'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: getAbsoluteUrl('/archive'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: getAbsoluteUrl('/search'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  const postRoutes = getAllPosts().map((post) => ({
    url: getAbsoluteUrl(post.url),
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const tagRoutes = getAllTags().map((tag) => ({
    url: getAbsoluteUrl(`/tags/${tag}`),
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...postRoutes, ...tagRoutes]
}
