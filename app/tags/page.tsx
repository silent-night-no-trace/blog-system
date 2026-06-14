import type { Metadata } from 'next'
import { getTagsWithCounts } from '@/lib/posts'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '标签',
  description: '按标签浏览博客文章。',
  alternates: {
    canonical: '/tags',
  },
}

export default function TagsPage() {
  const tags = getTagsWithCounts()

  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Tags
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            {tags.length} tags found
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <Link key={tag.slug} href={`/tags/${tag.slug}`}>
              <Badge variant="primary" className="px-4 py-2 text-sm hover:opacity-80 transition-opacity">
                {tag.label} <span className="ml-1 opacity-75">({tag.count})</span>
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
