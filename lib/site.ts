export const siteConfig = {
  name: 'Blog',
  description: '使用 Next.js 16、Content Collections、Algolia 和 Giscus 构建的个人博客。',
  locale: 'zh-CN',
}

export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
)

export function getAbsoluteUrl(path: string) {
  return new URL(path, siteUrl).toString()
}

export function formatDate(value: string | Date, variant: 'full' | 'compact' = 'full') {
  return new Date(value).toLocaleDateString(
    'zh-CN',
    variant === 'compact'
      ? { month: 'long', day: 'numeric' }
      : { year: 'numeric', month: 'long', day: 'numeric' }
  )
}

export function formatMonth(month: number) {
  return new Date(2000, month - 1).toLocaleString('zh-CN', { month: 'long' })
}

export function formatReadingTime(minutes: number) {
  return `${minutes} 分钟阅读`
}
