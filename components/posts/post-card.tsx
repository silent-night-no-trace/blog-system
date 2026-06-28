import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { Post } from '@/lib/posts'
import { formatDate, formatReadingTime } from '@/lib/site'

type PostCardProps = {
  post: Post
  variant?: 'default' | 'compact'
}

export function PostCard({ post, variant = 'default' }: PostCardProps) {
  const isCompact = variant === 'compact'

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-zinc-100 dark:focus-visible:ring-offset-zinc-950"
    >
      <Card className={`group ${isCompact ? 'hover:shadow-sm' : 'hover:shadow-lg'}`}>
        <CardContent className={isCompact ? 'py-3' : 'pt-6'}>
          <div className={isCompact ? 'mb-2 flex flex-wrap gap-2' : 'mb-3 flex flex-wrap gap-2'}>
            {post.tags.map((tag) => (
              <Badge key={tag} variant={isCompact ? 'default' : 'primary'} className={isCompact ? 'text-xs' : undefined}>
                {tag}
              </Badge>
            ))}
          </div>

          {isCompact ? (
            <h4 className="mb-2 text-base font-bold text-zinc-900 group-hover:text-black dark:text-zinc-100 dark:group-hover:text-white">
              {post.title}
            </h4>
          ) : (
            <h2 className="mb-2 text-xl font-bold text-zinc-900 group-hover:text-black dark:text-zinc-100 dark:group-hover:text-white">
              {post.title}
            </h2>
          )}

          {!isCompact && (
            <p className="mb-4 text-zinc-600 dark:text-zinc-400">
              {post.excerpt}
            </p>
          )}

          <div className={`flex items-center gap-4 text-zinc-500 dark:text-zinc-500 ${isCompact ? 'text-sm' : 'text-sm'}`}>
            <time dateTime={post.date}>
              {formatDate(post.date, isCompact ? 'compact' : 'full')}
            </time>
            <span>·</span>
            <span>{formatReadingTime(post.readingTime)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
