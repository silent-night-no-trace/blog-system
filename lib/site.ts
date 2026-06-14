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
