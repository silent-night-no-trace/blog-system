import type { Metadata } from 'next'
import { getSortedPosts } from '@/lib/posts'
import { PostCard } from '@/components/posts/post-card'

export const metadata: Metadata = {
  title: '全部文章',
  description: '浏览博客中的全部文章。',
  alternates: {
    canonical: '/posts',
  },
}

export default function PostsPage() {
  const posts = getSortedPosts()

  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            全部文章
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            共 {posts.length} 篇文章
          </p>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </div>
  )
}
