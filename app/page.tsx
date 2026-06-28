import type { Metadata } from 'next'
import { getSortedPosts } from '@/lib/posts'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PostCard } from '@/components/posts/post-card'
import Link from 'next/link'

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
}

export default function HomePage() {
  // 获取最新的 3 篇文章
  const latestPosts = getSortedPosts().slice(0, 3)

  return (
    <div className="flex-1">
      {/* Hero section */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              欢迎来到我的博客
            </h1>
            <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400">
              分享关于技术、设计与生活的思考。
            </p>
            <Link href="/posts">
              <Badge variant="primary" className="px-4 py-2 text-sm">
                查看全部文章 →
              </Badge>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured posts */}
      <section className="py-16 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              最新文章
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* About section */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Card className="border-0 bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800">
            <CardContent className="py-12">
              <div className="text-center">
                <h2 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                  关于本博客
                </h2>
                <p className="mb-6 text-zinc-600 dark:text-zinc-400">
                  这是一个个人博客，记录我在 Web 开发、技术与设计方面的思考、经验与学习心得。
                </p>
                <div className="flex justify-center gap-4">
                  <Link href="/posts">
                    <Badge variant="primary">全部文章</Badge>
                  </Link>
                  <Link href="/tags">
                    <Badge>全部标签</Badge>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
