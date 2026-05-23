import { allPosts } from 'contentlayer/generated'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface ArchiveGroup {
  year: number
  months: {
    month: number
    posts: typeof allPosts
  }[]
}

// 按年月分组文章
function getArchive(): ArchiveGroup[] {
  const postsByYear = new Map<number, Map<number, typeof allPosts>>()

  allPosts.forEach(post => {
    const date = new Date(post.date)
    const year = date.getFullYear()
    const month = date.getMonth() + 1 // 1-12

    if (!postsByYear.has(year)) {
      postsByYear.set(year, new Map())
    }

    const monthsMap = postsByYear.get(year)!
    if (!monthsMap.has(month)) {
      monthsMap.set(month, [])
    }

    monthsMap.get(month)!.push(post)
  })

  // 转换为数组并排序
  return Array.from(postsByYear.entries())
    .sort(([yearA], [yearB]) => yearB - yearA) // 年份降序
    .map(([year, monthsMap]) => ({
      year,
      months: Array.from(monthsMap.entries())
        .sort(([monthA], [monthB]) => monthB - monthA) // 月份降序
        .map(([month, posts]) => ({
          month,
          posts: posts.sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        }))
    }))
}

export default function ArchivePage() {
  const archive = getArchive()

  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Archive
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            {allPosts.length} articles in total
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
                      {new Date(2000, monthGroup.month - 1).toLocaleString('en-US', { month: 'long' })}
                      {' '}
                      <Badge variant="default" className="ml-2">
                        {monthGroup.posts.length}
                      </Badge>
                    </h3>

                    <div className="space-y-4 border-l-2 border-zinc-200 pl-4 dark:border-zinc-800">
                      {monthGroup.posts.map((post) => (
                        <Link key={post._id} href={`/posts/${post.slug}`}>
                          <Card className="group hover:shadow-sm">
                            <CardContent className="py-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="mb-2 text-base font-bold text-zinc-900 group-hover:text-black dark:text-zinc-100 dark:group-hover:text-white">
                                    {post.title}
                                  </h4>

                                  <div className="mb-2 flex flex-wrap gap-2">
                                    {post.tags.map((tag) => (
                                      <Badge key={tag} variant="default" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>

                                  <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-500">
                                    <time dateTime={post.date}>
                                      {new Date(post.date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                      })}
                                    </time>
                                    <span>·</span>
                                    <span>{post.readingTime} min read</span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
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
