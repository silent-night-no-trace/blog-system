import type { Metadata } from 'next'
import { SearchClient } from './search-client'

export const metadata: Metadata = {
  title: '搜索',
  description: '搜索博客文章标题、摘要、标签和正文内容。',
  alternates: {
    canonical: '/search',
  },
}

export default function SearchPage() {
  return <SearchClient />
}
