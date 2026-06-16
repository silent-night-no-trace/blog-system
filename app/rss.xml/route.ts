import { getSortedPosts } from '@/lib/posts'
import { getAbsoluteUrl, siteConfig } from '@/lib/site'

export const dynamic = 'force-static'

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function wrapCdata(value: string) {
  // Split any literal CDATA terminator so the payload can't break out of the section.
  return `<![CDATA[${value.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`
}

export async function GET() {
  const posts = getSortedPosts()
  const latestPost = posts[0]

  const items = posts
    .map((post) => {
      const url = getAbsoluteUrl(post.url)
      const categories = post.tags
        .map((tag) => `      <category>${escapeXml(tag)}</category>`)
        .join('\n')

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid>${escapeXml(url)}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <content:encoded>${wrapCdata(post.body.html)}</content:encoded>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
${categories}
    </item>`
    })
    .join('\n')

  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${escapeXml(getAbsoluteUrl('/'))}</link>
    <atom:link href="${escapeXml(getAbsoluteUrl('/rss.xml'))}" rel="self" type="application/rss+xml" />
    <description>${escapeXml(siteConfig.description)}</description>
    <language>${escapeXml(siteConfig.locale)}</language>
    <lastBuildDate>${new Date(latestPost?.date ?? Date.now()).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}
