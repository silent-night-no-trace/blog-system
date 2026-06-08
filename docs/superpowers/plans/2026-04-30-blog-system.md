# 博客系统实施计划

> Historical note: This plan reflects an earlier Contentlayer-based implementation. The active project has migrated to Content Collections. Do not follow the `next-contentlayer`, `withContentlayer`, `next-contentlayer/hooks`, Algolia v4 `initIndex`, or `post.body.code` examples in this document for current work.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 从 0-1 构建一个精美的 Next.js 15 博客系统，支持 Markdown 博文、Algolia 搜索、Giscus 评论、标签分类。

**Architecture:** 
- 前端：Next.js 15 App Router + TypeScript + Tailwind CSS
- 内容：Markdown 文件 + Contentlayer (类型安全)
- 搜索：Algolia (后端构建时同步索引，前端搜索)
- 评论：Giscus (GitHub Discussions)
- 部署：Vercel

**Tech Stack:**
- Next.js 15, TypeScript, Tailwind CSS, Shadcn/ui
- Contentlayer, MDX
- Algolia, Giscus
- Vercel, Git

---

## 开发环境准备

### Task 1: 项目初始化

**Files:**
- Create: `/Users/leon/.claude/projects/blog-system/package.json`
- Create: `/Users/leon/.claude/projects/blog-system/tsconfig.json`
- Create: `/Users/leon/.claude/projects/blog-system/tailwind.config.ts`
- Create: `/Users/leon/.claude/projects/blog-system/postcss.config.js`

- [ ] **Step 1: 创建 Next.js 项目**

```bash
cd /Users/leon/.claude/projects/blog-system
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```

- [ ] **Step 2: 安装额外依赖**

```bash
npm install contentlayer next-contentlayer@0.3.4 highlight.js remark remark-gfm rehype rehype-highlight
npm install @giscus/react @algolia/client-search algoliasearch react-icons lucide-react
npm install -D @tailwindcss/typography
```

- [ ] **Step 3: 配置 Tailwind CSS**

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss"

const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"SF Pro Display"', '-apple-system', 'BlinkMacSystemFont', 'PingFang SC', 'Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config

export default config
```

- [ ] **Step 4: 创建全局样式**

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Inter', sans-serif;
  background-color: #ffffff;
  color: #111827;
  line-height: 1.6;
}

/* Markdown 内容样式 */
.prose {
  max-width: 768px;
  margin: 0 auto;
}

.prose img {
  border-radius: 4px;
  margin: 1.5rem auto;
}

.prose a {
  color: #3b82f6;
  text-decoration: underline;
}

.prose blockquote {
  border-left: 4px solid #3b82f6;
  padding-left: 1rem;
  margin: 1.5rem 0;
  font-style: italic;
}
```

- [ ] **Step 5: 配置 Contentlayer**

```typescript
// contentlayer.config.ts
import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `**/*.md`,
  contentType: 'markdown',
  fields: {
    title: { type: 'string', required: true },
    slug: { type: 'string', required: true },
    date: { type: 'date', required: true },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    excerpt: { type: 'string', required: true },
    coverImage: { type: 'string', default: '' },
  },
  computedFields: {
    url: { type: 'string', resolve: (post) => `/posts/${post.slug}` },
    readingTime: {
      type: 'number',
      resolve: (post) => {
        const text = post.body.raw
        const wordsPerMinute = 200
        const words = text.trim().split(/\s+/).length
        return Math.ceil(words / wordsPerMinute)
      }
    }
  }
}))

export default makeSource({
  contentDirPath: 'content/posts',
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight],
  },
})
```

- [ ] **Step 6: 配置 Next.js**

```typescript
// next.config.js
const { withContentlayer } = require('next-contentlayer')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
}

module.exports = withContentlayer(nextConfig)
```

- [ ] **Step 7: 更新 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      { "name": "next" }
    ],
    "paths": {
      "@/*": ["./*"],
      "contentlayer/generated": ["./.contentlayer/generated"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", ".contentlayer/generated"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 8: 创建环境变量文件**

```bash
# .env.local
# Algolia 搜索
NEXT_PUBLIC_ALGOLIA_APP_ID=your_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=your_search_key
ALGOLIA_ADMIN_KEY=your_admin_key
ALGOLIA_INDEX_NAME=blog_posts

# Giscus 评论
NEXT_PUBLIC_GISCUS_REPO=your-username/your-repo
NEXT_PUBLIC_GISCUS_REPO_ID=your_repo_id
NEXT_PUBLIC_GISCUS_CATEGORY_ID=your_category_id
```

- [ ] **Step 9: 创建 .gitignore**

```
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/
build/
dist/

# Misc
.env*.local
.env.production
.env.development

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# Contentlayer
.contentlayer
```

---

## 数据层实现

### Task 2: 创建内容目录和工具函数

**Files:**
- Create: `/Users/leon/.claude/projects/blog-system/content/posts/example-post.md`
- Create: `/Users/leon/.claude/projects/blog-system/src/lib/posts.ts`
- Create: `/Users/leon/.claude/projects/blog-system/src/lib/tags.ts`

- [ ] **Step 1: 创建示例博文**

```markdown
---
title: "欢迎来到我的博客"
slug: welcome-to-my-blog
date: 2026-04-30
tags: ["博客", "介绍", "Next.js"]
excerpt: "这是一个使用 Next.js 15 构建的精美博客系统，支持 Markdown、搜索、标签等功能。"
coverImage: "/images/welcome.jpg"
---

# 欢迎来到我的博客

这是一个使用 **Next.js 15** 构建的精美博客系统。

## 主要特性

- ✅ 支持 Markdown 格式
- ✅ 优雅的苹果设计风格
- ✅ 强大的 Algolia 搜索
- ✅ Giscus 评论系统
- ✅ 标签分类功能

## 开发技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **搜索**: Algolia
- **评论**: Giscus

> 设计不仅仅是外观和感觉，设计是产品如何工作。—— 史蒂夫·乔布斯
```

- [ ] **Step 2: 创建博文数据加载工具**

```typescript
// src/lib/posts.ts
import { allPosts } from 'contentlayer/generated'

export type Post = (typeof allPosts)[0]

export function getSortedPosts(): Post[] {
  return allPosts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

export function getPostBySlug(slug: string): Post | undefined {
  return allPosts.find((post) => post.slug === slug)
}

export function getPostsByTag(tag: string): Post[] {
  return allPosts
    .filter((post) => post.tags.includes(tag))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getAllTags(): string[] {
  const tags = new Set<string>()
  allPosts.forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag))
  })
  return Array.from(tags).sort()
}

export function getTagCounts(): Map<string, number> {
  const tagCounts = new Map<string, number>()
  allPosts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
    })
  })
  return tagCounts
}
```

- [ ] **Step 3: 创建标签工具函数**

```typescript
// src/lib/tags.ts
import { getTagCounts, getAllTags } from './posts'

export interface TagWithCount {
  name: string
  count: number
  size: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

export function getTagCloud(): TagWithCount[] {
  const tagCounts = getTagCounts()
  const allTags = getAllTags()
  
  // 计算最大和最小数量，用于确定标签大小
  const counts = Array.from(tagCounts.values())
  const maxCount = Math.max(...counts)
  const minCount = Math.min(...counts)
  
  return allTags.map((tagName) => {
    const count = tagCounts.get(tagName) || 0
    
    // 根据数量分配大小
    let size: TagWithCount['size']
    if (count === maxCount) {
      size = '2xl'
    } else if (count > (maxCount + minCount) / 2) {
      size = 'xl'
    } else if (count > minCount) {
      size = 'lg'
    } else {
      size = 'md'
    }
    
    return { name: tagName, count, size }
  })
}
```

---

## 页面开发

### Task 3: 首页开发

**Files:**
- Modify: `/Users/leon/.claude/projects/blog-system/src/app/page.tsx`
- Create: `/Users/leon/.claude/projects/blog-system/src/components/PostCard.tsx`
- Create: `/Users/leon/.claude/projects/blog-system/src/components/TagCloud.tsx`
- Create: `/Users/leon/.claude/projects/blog-system/src/components/Navbar.tsx`
- Create: `/Users/leon/.claude/projects/blog-system/src/components/Footer.tsx`

- [ ] **Step 1: 创建导航栏组件**

```tsx
// src/components/Navbar.tsx
'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
              Blog
            </Link>
          </div>
          
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              首页
            </Link>
            <Link href="/archive" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              归档
            </Link>
            <Link href="/tags" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              标签
            </Link>
            <Link href="/search" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              搜索
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: 创建页脚组件**

```tsx
// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} My Blog. All rights reserved.</p>
          <p className="mt-2">
            Built with Next.js 15 & ❤️
          </p>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: 创建博文卡片组件**

```tsx
// src/components/PostCard.tsx
import Link from 'next/link'
import { Post } from '@/lib/posts'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="border-b border-gray-200 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="text-sm px-2 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
            <Link href={`/posts/${post.slug}`}>
              {post.title}
            </Link>
          </h2>
          
          <p className="mt-2 text-gray-600 text-base leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
          
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <time dateTime={post.date.toISOString().split('T')[0]}>
              {post.date.toLocaleDateString('zh-CN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </time>
            <span className="mx-2">•</span>
            <span>{post.readingTime} 分钟阅读</span>
          </div>
        </div>
      </div>
    </article>
  )
}
```

- [ ] **Step 4: 创建标签云组件**

```tsx
// src/components/TagCloud.tsx
'use client'

import Link from 'next/link'
import { getTagCloud } from '@/lib/tags'

const TAG_SIZES = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl font-bold',
}

export default function TagCloud() {
  const tags = getTagCloud()
  
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag.name}
          href={`/tags/${tag.name}`}
          className={`px-3 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors ${TAG_SIZES[tag.size]}`}
          title={`${tag.name} (${tag.count} 篇文章)`}
        >
          {tag.name}
        </Link>
      ))}
    </div>
  )
}
```

- [ ] **Step 5: 实现首页**

```tsx
// src/app/page.tsx
import { getSortedPosts, getAllTags } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import TagCloud from '@/components/TagCloud'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Home() {
  const posts = getSortedPosts()
  const allTags = getAllTags()
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            我的博客
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            分享技术、设计和生活中的思考
          </p>
        </section>
        
        {/* 标签云 */}
        {allTags.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">热门标签</h2>
            <TagCloud />
          </section>
        )}
        
        {/* 博文列表 */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">最新文章</h2>
          
          {posts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              还没有文章，快去创建第一篇吧！
            </div>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
```

---

### Task 4: 博文详情页

**Files:**
- Create: `/Users/leon/.claude/projects/blog-system/src/app/posts/[slug]/page.tsx`
- Create: `/Users/leon/.claude/projects/blog-system/src/components/MDXRenderer.tsx`

- [ ] **Step 1: 创建 Markdown 渲染组件**

```tsx
// src/components/MDXRenderer.tsx
import { useMDXComponent } from 'next-contentlayer/hooks'

interface MDXRendererProps {
  code: string
}

export default function MDXRenderer({ code }: MDXRendererProps) {
  const Component = useMDXComponent(code)
  
  return (
    <article className="prose prose-lg max-w-none">
      <Component />
    </article>
  )
}
```

- [ ] **Step 2: 实现博文详情页**

```tsx
// src/app/posts/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getPostBySlug, getSortedPosts } from '@/lib/posts'
import MDXRenderer from '@/components/MDXRenderer'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Comment from '@/components/Comment'

interface PostPageProps {
  params: {
    slug: string
  }
}

export default function PostPage({ params }: PostPageProps) {
  const post = getPostBySlug(params.slug)
  
  if (!post) {
    notFound()
  }
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 标题和元信息 */}
        <header className="mb-12">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-sm px-2 py-1 bg-gray-100 text-gray-700 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          
          <div className="flex items-center text-sm text-gray-500">
            <time dateTime={post.date.toISOString().split('T')[0]}>
              {post.date.toLocaleDateString('zh-CN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </time>
            <span className="mx-2">•</span>
            <span>{post.readingTime} 分钟阅读</span>
          </div>
        </header>
        
        {/* 内容 */}
        <div className="prose prose-lg max-w-none mb-12">
          <MDXRenderer code={post.body.code} />
        </div>
        
        {/* 评论 */}
        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">评论</h2>
          <Comment />
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
```

---

### Task 5: 标签页

**Files:**
- Create: `/Users/leon/.claude/projects/blog-system/src/app/tags/page.tsx`
- Create: `/Users/leon/.claude/projects/blog-system/src/app/tags/[tag]/page.tsx`

- [ ] **Step 1: 创建标签列表页**

```tsx
// src/app/tags/page.tsx
import { getAllTags, getTagCounts } from '@/lib/posts'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const TAG_SIZES = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl font-bold',
}

export default function TagsPage() {
  const allTags = getAllTags()
  const tagCounts = getTagCounts()
  
  // 计算最大和最小数量，用于确定标签大小
  const counts = Array.from(tagCounts.values())
  const maxCount = Math.max(...counts)
  const minCount = Math.min(...counts)
  
  const tagsWithSize = allTags.map((tag) => {
    const count = tagCounts.get(tag) || 0
    
    let size: keyof typeof TAG_SIZES
    if (count === maxCount) {
      size = '2xl'
    } else if (count > (maxCount + minCount) / 2) {
      size = 'xl'
    } else if (count > minCount) {
      size = 'lg'
    } else {
      size = 'md'
    }
    
    return { name: tag, count, size }
  })
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">所有标签</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tagsWithSize.map((tag) => (
            <Link
              key={tag.name}
              href={`/tags/${tag.name}`}
              className={`block p-6 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors ${TAG_SIZES[tag.size]}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-900">{tag.name}</span>
                <span className="text-gray-500 text-sm ml-3">({tag.count})</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
```

- [ ] **Step 2: 创建标签详情页**

```tsx
// src/app/tags/[tag]/page.tsx
import { notFound } from 'next/navigation'
import { getPostsByTag, getAllTags } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface TagPageProps {
  params: {
    tag: string
  }
}

export default function TagPage({ params }: TagPageProps) {
  const decodedTag = decodeURIComponent(params.tag)
  const posts = getPostsByTag(decodedTag)
  
  if (posts.length === 0) {
    notFound()
  }
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/tags" className="text-gray-600 hover:text-gray-900 text-sm">
            ← 所有标签
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">
            {decodedTag}
          </h1>
          <p className="text-gray-600 mt-1">
            共 {posts.length} 篇文章
          </p>
        </div>
        
        <div className="space-y-8">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
```

---

### Task 6: 搜索功能

**Files:**
- Create: `/Users/leon/.claude/projects/blog-system/src/app/search/page.tsx`
- Create: `/Users/leon/.claude/projects/blog-system/src/components/Search.tsx`
- Create: `/Users/leon/.claude/projects/blog-system/src/lib/search.ts`

- [ ] **Step 1: 创建搜索工具函数**

```typescript
// src/lib/search.ts
import algoliasearch from 'algoliasearch'

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || ''
const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || ''

export const searchClient = algoliasearch(appId, searchKey)
export const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'blog_posts'
```

- [ ] **Step 2: 创建搜索组件**

```tsx
// src/components/Search.tsx
'use client'

import { useEffect, useState } from 'react'
import { InstantSearch, SearchBox, Hits, Highlight, useInstantSearch } from 'react-instantsearch'
import { searchClient, indexName } from '@/lib/search'
import Link from 'next/link'

function Hit({ hit }: any) {
  return (
    <Link href={`/posts/${hit.slug}`} className="block p-4 border-b border-gray-200 hover:bg-gray-50">
      <h3 className="font-semibold text-gray-900">
        <Highlight attribute="title" hit={hit} />
      </h3>
      <p className="text-gray-600 text-sm mt-1">
        <Highlight attribute="excerpt" hit={hit} />
      </p>
      <div className="flex flex-wrap gap-2 mt-2">
        {hit.tags.map((tag: string) => (
          <span key={tag} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}

function NoResults() {
  const { results } = useInstantSearch()
  
  if (!results.__isArtificial && results.nbHits === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        没有找到相关结果 😕
      </div>
    )
  }
  
  return null
}

export default function Search() {
  return (
    <div className="max-w-2xl mx-auto">
      <InstantSearch searchClient={searchClient} indexName={indexName}>
        <SearchBox
          placeholder="搜索文章..."
          classNames={{
            root: 'mb-6',
            input: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          }}
        />
        
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <Hits hitComponent={Hit} />
          <NoResults />
        </div>
      </InstantSearch>
    </div>
  )
}
```

- [ ] **Step 3: 实现搜索页面**

```tsx
// src/app/search/page.tsx
import Search from '@/components/Search'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">搜索</h1>
        <Search />
      </main>
      
      <Footer />
    </div>
  )
}
```

- [ ] **Step 4: 创建 Algolia 数据同步脚本**

```typescript
// scripts/sync-algolia.ts
import algoliasearch from 'algoliasearch'
import { getSortedPosts } from '@/lib/posts'

const appId = process.env.ALGOLIA_APP_ID || ''
const adminKey = process.env.ALGOLIA_ADMIN_KEY || ''
const indexName = process.env.ALGOLIA_INDEX_NAME || 'blog_posts'

const client = algoliasearch(appId, adminKey)
const index = client.initIndex(indexName)

async function syncToAlgolia() {
  try {
    const posts = getSortedPosts()
    
    const records = posts.map((post) => ({
      objectID: post.slug,
      title: post.title,
      slug: post.slug,
      date: post.date.toISOString(),
      tags: post.tags,
      excerpt: post.excerpt,
      content: post.body.raw,
      readingTime: post.readingTime,
    }))
    
    // 清空旧数据并添加新数据
    await index.clearObjects()
    await index.saveObjects(records)
    
    // 设置索引配置
    await index.setSettings({
      searchableAttributes: ['title', 'content', 'tags', 'excerpt'],
      attributesForFaceting: ['tags'],
      ranking: [
        'typo',
        'geo',
        'words',
        'filters',
        'proximity',
        'attribute',
        'exact',
        'custom'
      ],
    })
    
    console.log(`✅ Successfully synced ${records.length} posts to Algolia`)
  } catch (error) {
    console.error('❌ Error syncing to Algolia:', error)
    process.exit(1)
  }
}

syncToAlgolia()
```

- [ ] **Step 5: 更新 package.json**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "sync:algolia": "tsx scripts/sync-algolia.ts"
  }
}
```

---

### Task 7: 评论系统

**Files:**
- Create: `/Users/leon/.claude/projects/blog-system/src/components/Comment.tsx`

- [ ] **Step 1: 创建评论组件**

```tsx
// src/components/Comment.tsx
'use client'

import Giscus from '@giscus/react'
import { useTheme } from 'next-themes'

export default function Comment() {
  const { theme } = useTheme()
  
  return (
    <Giscus
      repo={process.env.NEXT_PUBLIC_GISCUS_REPO || ''}
      repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID || ''}
      category="Comments"
      categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || ''}
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={theme === 'dark' ? 'dark' : 'light'}
      lang="zh-CN"
      loading="lazy"
    />
  )
}
```

---

### Task 8: 归档页面

**Files:**
- Create: `/Users/leon/.claude/projects/blog-system/src/app/archive/page.tsx`

- [ ] **Step 1: 实现归档页面**

```tsx
// src/app/archive/page.tsx
import { getSortedPosts } from '@/lib/posts'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function ArchivePage() {
  const posts = getSortedPosts()
  
  // 按年月分组
  const groupedPosts = posts.reduce((acc, post) => {
    const year = post.date.getFullYear()
    const month = post.date.toLocaleString('zh-CN', { month: 'long' })
    const key = `${year}-${month}`
    
    if (!acc[key]) {
      acc[key] = { year, month, posts: [] }
    }
    
    acc[key].posts.push(post)
    return acc
  }, {} as Record<string, { year: number; month: string; posts: typeof posts }>)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">文章归档</h1>
        
        <div className="space-y-8">
          {Object.entries(groupedPosts).map(([key, group]) => (
            <section key={key}>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                {group.year} 年 {group.month}
              </h2>
              
              <div className="space-y-4">
                {group.posts.map((post) => (
                  <article key={post.slug} className="border-l-4 border-blue-500 pl-4 py-2 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <Link href={`/posts/${post.slug}`} className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                        {post.title}
                      </Link>
                      <span className="text-sm text-gray-500">
                        {post.date.getDate()} 日
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-xs text-gray-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
```

---

### Task 9: 额外功能

**Files:**
- Create: `/Users/leon/.claude/projects/blog-system/src/app/rss.xml/route.ts`
- Create: `/Users/leon/.claude/projects/blog-system/src/app/sitemap.xml/route.ts`
- Create: `/Users/leon/.claude/projects/blog-system/src/app/robots.txt/route.ts`

- [ ] **Step 1: 创建 RSS 订阅**

```typescript
// src/app/rss.xml/route.ts
import { getSortedPosts } from '@/lib/posts'

export const dynamic = 'force-static'

export async function GET() {
  const posts = getSortedPosts()
  
  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>My Blog</title>
    <link>https://your-domain.com</link>
    <description>分享技术、设计和生活中的思考</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://your-domain.com/rss.xml" rel="self" type="application/rss+xml"/>
    
    ${posts.map((post) => `
    <item>
      <title>${post.title}</title>
      <link>https://your-domain.com/posts/${post.slug}</link>
      <description>${post.excerpt}</description>
      <pubDate>${post.date.toUTCString()}</pubDate>
      <guid>https://your-domain.com/posts/${post.slug}</guid>
    </item>
    `).join('')}
  </channel>
</rss>`

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/rss+xml',
    },
  })
}
```

- [ ] **Step 2: 创建 Sitemap**

```typescript
// src/app/sitemap.xml/route.ts
import { getSortedPosts, getAllTags } from '@/lib/posts'

export const dynamic = 'force-static'

export async function GET() {
  const baseUrl = 'https://your-domain.com'
  const posts = getSortedPosts()
  const allTags = getAllTags()
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/archive</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/tags</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  ${posts.map((post) => `
  <url>
    <loc>${baseUrl}/posts/${post.slug}</loc>
    <lastmod>${post.date.toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  `).join('')}
  
  ${allTags.map((tag) => `
  <url>
    <loc>${baseUrl}/tags/${encodeURIComponent(tag)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
  `).join('')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
```

- [ ] **Step 3: 创建 robots.txt**

```typescript
// src/app/robots.txt/route.ts
export const dynamic = 'force-static'

export async function GET() {
  const robots = `User-agent: *
Allow: /
Disallow: /private/

Sitemap: https://your-domain.com/sitemap.xml
`

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
```

---

### Task 10: 部署配置

**Files:**
- Create: `/Users/leon/.claude/projects/blog-system/vercel.json`

- [ ] **Step 1: 创建 Vercel 配置**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "rewrites": [
    {
      "source": "/sitemap.xml",
      "destination": "/sitemap.xml/route"
    },
    {
      "source": "/rss.xml",
      "destination": "/rss.xml/route"
    },
    {
      "source": "/robots.txt",
      "destination": "/robots.txt/route"
    }
  ]
}
```

- [ ] **Step 2: 测试构建**

```bash
npm run build
```

- [ ] **Step 3: 部署到 Vercel**

```bash
npm install -g vercel
vercel
```

按照提示完成部署。

---

## 测试清单

- [ ] 所有页面正常渲染
- [ ] 博文列表显示正确
- [ ] 博文详情页渲染 Markdown
- [ ] 标签云显示正确
- [ ] 标签筛选功能正常
- [ ] 搜索功能正常（需配置 Algolia）
- [ ] 评论系统正常（需配置 Giscus）
- [ ] 归档页面时间轴正确
- [ ] 响应式设计在手机/平板上正常
- [ ] RSS 订阅可访问
- [ ] Sitemap 可访问
- [ ] SEO 元标签正确

---

**执行计划完成。接下来可以选择：**

**1. Subagent-Driven (推荐)** - 为每个任务分派独立子代理，快速迭代

**2. Inline Execution** - 在当前会话中执行任务，分批检查

**你选择哪种方式？**
