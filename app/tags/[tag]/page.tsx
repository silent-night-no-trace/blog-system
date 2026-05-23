import { allPosts } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function TagPage({ params }: { params: { tag: string } }) {
  const decodedTag = decodeURIComponent(params.tag)
  const posts = allPosts
    .filter(post => post.tags.includes(decodedTag))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (posts.length === 0) {
    notFound()
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/tags" className="mb-4 inline-block text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            ← All Tags
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              {decodedTag}
            </h1>
            <Badge variant="primary">{posts.length} posts</Badge>
          </div>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Articles tagged with "{decodedTag}"
          </p>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <Link key={post._id} href={`/posts/${post.slug}`}>
              <Card className="group hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="primary">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <h2 className="mb-2 text-xl font-bold text-zinc-900 group-hover:text-black dark:text-zinc-100 dark:group-hover:text-white">
                    {post.title}
                  </h2>

                  <p className="mb-4 text-zinc-600 dark:text-zinc-400">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-500">
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
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
