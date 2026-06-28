import type { Metadata } from 'next'
import { getAllTags, getPostsByTag, getTagBySlug } from '@/lib/posts'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { PostCard } from '@/components/posts/post-card'
import Link from 'next/link'

type TagPageProps = {
  params: Promise<{ tag: string }>
}

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }))
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  const tagSummary = getTagBySlug(decodedTag)
  const posts = getPostsByTag(decodedTag)

  if (!tagSummary || posts.length === 0) {
    return {
      title: '标签未找到',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  return {
    title: `${tagSummary.label} 标签`,
    description: `浏览 ${posts.length} 篇带有「${tagSummary.label}」标签的文章。`,
    alternates: {
      canonical: `/tags/${tagSummary.slug}`,
    },
    openGraph: {
      title: `${tagSummary.label} 标签`,
      description: `浏览 ${posts.length} 篇带有「${tagSummary.label}」标签的文章。`,
      url: `/tags/${tagSummary.slug}`,
      type: 'website',
    },
  }
}

export default async function TagPage({
  params,
}: TagPageProps) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  const tagSummary = getTagBySlug(decodedTag)
  const posts = getPostsByTag(decodedTag)

  if (!tagSummary || posts.length === 0) {
    notFound()
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/tags" className="mb-4 inline-block text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            ← 全部标签
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              {tagSummary.label}
            </h1>
            <Badge variant="primary">{posts.length} 篇文章</Badge>
          </div>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            带有「{tagSummary.label}」标签的文章
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
