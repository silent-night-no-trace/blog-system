import { allPosts } from 'contentlayer/generated'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

// 获取所有标签及其文章数量
function getAllTags() {
  const tagsMap = new Map<string, number>()

  allPosts.forEach(post => {
    post.tags.forEach(tag => {
      tagsMap.set(tag, (tagsMap.get(tag) || 0) + 1)
    })
  })

  return Array.from(tagsMap.entries())
    .sort((a, b) => b[1] - a[1]) // 按文章数量排序
}

export default function TagsPage() {
  const tags = getAllTags()

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
          {tags.map(([tag, count]) => (
            <Link key={tag} href={`/tags/${tag}`}>
              <Badge variant="primary" className="px-4 py-2 text-sm hover:opacity-80 transition-opacity">
                {tag} <span className="ml-1 opacity-75">({count})</span>
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
