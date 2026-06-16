import type { Metadata } from 'next'
import { getAllPosts, getArchive } from '@/lib/posts'
import { formatMonth } from '@/lib/site'
import { Badge } from '@/components/ui/badge'
import { PostCard } from '@/components/posts/post-card'

export const metadata: Metadata = {
  title: '归档',
  description: '按年月浏览博客文章归档。',
  alternates: {
    canonical: '/archive',
  },
}

export default function ArchivePage() {
  const archive = getArchive()

  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            归档
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            共 {getAllPosts().length} 篇文章
          </p>
        </div>

        <div className="space-y-8">
          {archive.map((yearGroup) => (
            <div key={yearGroup.year}>
              <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {yearGroup.year}
              </h2>

              <div className="space-y-6">
                {yearGroup.months.map((monthGroup) => (
                  <div key={monthGroup.month}>
                    <h3 className="mb-4 text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                      {formatMonth(monthGroup.month)}
                      {' '}
                      <Badge variant="default" className="ml-2">
                        {monthGroup.posts.length}
                      </Badge>
                    </h3>

                    <div className="space-y-4 border-l-2 border-zinc-200 pl-4 dark:border-zinc-800">
                      {monthGroup.posts.map((post) => (
                        <PostCard key={post._id} post={post} variant="compact" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
