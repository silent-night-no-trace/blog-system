import type { Metadata } from 'next'
import Image from 'next/image'
import { getAllPosts, getPostBySlug, getSortedPosts, normalizeTag } from '@/lib/posts'
import { formatDate, formatReadingTime } from '@/lib/site'
import { notFound } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { GiscusComments } from '@/components/comments/giscus'

type PostPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      title: '文章未找到',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: post.url,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: post.url,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: 'summary',
      title: post.title,
      description: post.excerpt,
    },
  }
}

export default async function PostPage({
  params,
}: PostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const sortedPosts = getSortedPosts()
  const currentIndex = sortedPosts.findIndex((p) => p.slug === slug)
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
              {formatDate(post.date)}
            </time>
            <span>·</span>
            <span>{formatReadingTime(post.readingTime)}</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/tags/${normalizeTag(tag)}`}>
                <Badge variant="primary">{tag}</Badge>
              </Link>
            ))}
          </div>
        </header>

        {post.coverImage ? (
          <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-3xl border border-zinc-100 bg-zinc-100 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <Image
              src={post.coverImage}
              alt={`${post.title} 封面图`}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              unoptimized={post.coverImage.endsWith('.svg')}
            />
          </div>
        ) : null}

        {/* Post content */}
        <Card className="mb-8">
          <CardContent className="prose prose-zinc max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-zinc-900 dark:prose-headings:text-zinc-100 prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-xl prose-pre:bg-zinc-900 prose-pre:text-zinc-100 dark:prose-pre:bg-zinc-800 dark:prose-pre:text-zinc-100 prose-blockquote:border-l-4 prose-blockquote:border-zinc-300 dark:prose-blockquote:border-zinc-700">
            <div dangerouslySetInnerHTML={{ __html: post.body.html }} />
          </CardContent>
        </Card>

        {/* Comments */}
        <Card>
          <CardContent className="pt-6">
            <GiscusComments />
          </CardContent>
        </Card>

        {(prevPost || nextPost) && (
          <nav className="mt-8 grid gap-4 sm:grid-cols-2" aria-label="文章导航">
            {prevPost ? (
              <Link
                href={`/posts/${prevPost.slug}`}
                className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-zinc-100 dark:focus-visible:ring-offset-zinc-950"
              >
                <Card className="h-full hover:shadow-lg">
                  <CardContent className="pt-6">
                    <p className="mb-2 text-sm text-zinc-500 dark:text-zinc-500">上一篇</p>
                    <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {prevPost.title}
                    </h2>
                  </CardContent>
                </Card>
              </Link>
            ) : (
              <div />
            )}

            {nextPost && (
              <Link
                href={`/posts/${nextPost.slug}`}
                className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 sm:text-right dark:focus-visible:ring-zinc-100 dark:focus-visible:ring-offset-zinc-950"
              >
                <Card className="h-full hover:shadow-lg">
                  <CardContent className="pt-6">
                    <p className="mb-2 text-sm text-zinc-500 dark:text-zinc-500">下一篇</p>
                    <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {nextPost.title}
                    </h2>
                  </CardContent>
                </Card>
              </Link>
            )}
          </nav>
        )}
      </div>
    </article>
  )
}
