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

// Parse a post date that is stored as a date-only string (YYYY-MM-DD) or a
// Date, returning a Date built from year/month/day components. This avoids
// the timezone drift of `new Date('YYYY-MM-DD')`, which ES parses as UTC
// midnight and can render as the previous calendar day in negative offsets.
export function parsePostDate(value: string | Date): Date {
  if (value instanceof Date) {
    return value
  }

  const [datePart] = value.split('T')
  const [year, month, day] = datePart.split('-').map(Number)

  return new Date(year, (month || 1) - 1, day || 1)
}

export function formatDate(value: string | Date, variant: 'full' | 'compact' = 'full') {
  return parsePostDate(value).toLocaleDateString(
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
