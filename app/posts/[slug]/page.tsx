import { allPosts } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { GiscusComments } from '@/components/comments/giscus'

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = allPosts.find((p) => p.slug === params.slug)

  if (!post) {
    notFound()
  }

  // Find next and previous posts
  const sortedPosts = allPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const currentIndex = sortedPosts.findIndex((p) => p.slug === params.slug)
  const prevPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null
  const nextPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null

  return (
    <article className="py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Post header */}
        <header className="mb-8">
          <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-zinc-100">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-500">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span>·</span>
            <span>{post.readingTime} min read</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/tags/${tag}`}>
                <Badge variant="primary">{tag}</Badge>
              </Link>
            ))}
          </div>
        </header>

        {/* Post content */}
        <Card className="mb-8">
          <CardContent className="prose prose-zinc max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-zinc-900 dark:prose-headings:text-zinc-100 prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-xl prose-pre:bg-zinc-900 prose-pre:text-zinc-100 dark:prose-pre:bg-zinc-800 dark:prose-pre:text-zinc-100 prose-blockquote:border-l-4 prose-blockquote:border-zinc-300 dark:prose-blockquote:border-zinc-700">
            <div dangerouslySetInnerHTML={{ __html: post.body.html }} />
          </CardContent>
        </Card>

        {/* Comments */}
        <Card>
          <CardContent className="pt-6">
            <GiscusComments slug={params.slug} />
          </CardContent>
        </Card>
      </div>
    </article>
  )
}
