# Content Collections Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the unmaintained Contentlayer pipeline with Content Collections while preserving the current blog behavior, generated post shape, Algolia sync, static routes, and rendered Markdown output.

**Architecture:** Content Collections becomes the single content source. The Next adapter (`withContentCollections`) integrates content generation into Next builds, while the CLI (`content-collections build`) provides an explicit generation command for scripts such as Algolia sync. Application pages read posts through a small `lib/posts.ts` facade so future migrations do not require editing every route again.

**Tech Stack:** Next.js 16.2.x App Router, React 19, TypeScript, Content Collections (`@content-collections/core`, `@content-collections/next`, `@content-collections/cli`, `@content-collections/markdown`), Zod, Algolia v5, Tailwind CSS 3.4.x.

**Repository Policy:** Do not commit during implementation unless the user explicitly asks. Treat each checkpoint as a `git diff`/verification checkpoint instead of a commit.

---

## Decision Summary

Use **Content Collections** as the primary migration target.

Reasons:

- `@content-collections/next` declares peer support for Next `^12 || ^13 || ^14 || ^15 || ^16`.
- The Next adapter automatically adds content generation to the Next build process.
- The generated `allPosts` import model is close to the current `contentlayer/generated` usage.
- The Markdown package can compile Markdown to HTML during generation, preserving the current `post.body.html` rendering approach.

Keep **Velite** as a fallback only if Content Collections cannot reproduce the current Markdown output or fails under Next 16 build/dev. Do not implement both in the same pass.

## Current Findings To Preserve

- Current code imports `allPosts` from `contentlayer/generated` in app routes and `lib/posts.ts`.
- `.contentlayer` is ignored by git; clean builds fail when the generated directory is absent.
- Both Webpack and Turbopack builds pass when generated content exists.
- The actual root cause is missing generated content in clean environments, not Turbopack itself.
- The current project renders Markdown HTML via `post.body.html`, not MDX React components.
- `tsx` does not reliably resolve the old `contentlayer/generated` alias in standalone scripts, but it does resolve the new `content-collections` alias after generation.

## File Structure

### Create

- `content-collections.ts` - Defines the `posts` collection, validates frontmatter, compiles Markdown to HTML, computes `url`, `readingTime`, `_id`, and a Contentlayer-compatible `body` object.

### Modify

- `package.json` - Replace Contentlayer dependency with Content Collections dependencies and add `generate:content` plus a robust `sync:algolia` script.
- `package-lock.json` - Updated by npm install/uninstall commands.
- `next.config.ts` - Wrap the config with `withContentCollections`.
- `tsconfig.json` - Replace `contentlayer/generated` path alias with `content-collections`.
- `.gitignore` - Keep `.contentlayer` ignored for old local artifacts and add `.content-collections`.
- `eslint.config.mjs` - Ignore generated `.content-collections/**` output.
- `lib/posts.ts` - Become the application content facade.
- `app/page.tsx` - Read latest posts through `lib/posts.ts`.
- `app/posts/page.tsx` - Read sorted posts through `lib/posts.ts`.
- `app/posts/[slug]/page.tsx` - Read posts and static params through `lib/posts.ts`.
- `app/tags/page.tsx` - Read tag counts through `lib/posts.ts`.
- `app/tags/[tag]/page.tsx` - Read tags and tag posts through `lib/posts.ts`.
- `app/archive/page.tsx` - Read archive groups through `lib/posts.ts`.
- `scripts/sync-algolia.ts` - Import generated content through the `content-collections` alias after running generation.
- `README.md` - Correct Contentlayer references, Tailwind badge/version, clean generation workflow, and migration notes.
- `AGENTS.md` - Correct Next/Tailwind/content pipeline guidance.
- `FINAL_STATUS.md`, `CURRENT_PROGRESS.md`, `memory/blog-system-progress.md` - Mark old Contentlayer/Next 15/Tailwind 4 statements as historical or update to current facts.
- `docs/superpowers/plans/2026-04-30-blog-system.md` - Add an “outdated plan” note for `next-contentlayer`, `withContentlayer`, `next-contentlayer/hooks`, Algolia v4 `initIndex`, and `post.body.code` examples.

### Delete

- `contentlayer.config.ts` - Replaced by `content-collections.ts`.

---

## Task 1: Baseline And Dependency Migration

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Confirm the working tree before dependency changes**

Run:

```bash
GIT_MASTER=1 git status --porcelain
```

Expected: existing intended source changes are visible, and no generated `.contentlayer` or `.content-collections` files are tracked.

- [ ] **Step 2: Remove Contentlayer**

Run:

```bash
npm uninstall contentlayer
```

Expected: `contentlayer` is removed from `package.json`, and `package-lock.json` is updated.

- [ ] **Step 3: Install Content Collections dependencies**

Run:

```bash
npm install -D @content-collections/core @content-collections/next @content-collections/cli @content-collections/markdown zod
```

Expected: `package.json` gains these dev dependencies:

```json
{
  "devDependencies": {
    "@content-collections/cli": "^0.1.9",
    "@content-collections/core": "^0.15.1",
    "@content-collections/markdown": "^0.1.4",
    "@content-collections/next": "^0.2.11",
    "zod": "^4.0.0"
  }
}
```

The exact patch versions may be newer. Keep npm’s resolved versions unless they conflict with Next 16.

- [ ] **Step 4: Update package scripts**

Edit `package.json` scripts to this shape:

```json
{
  "scripts": {
    "generate:content": "content-collections build",
    "sync:algolia": "npm run generate:content && tsx scripts/sync-algolia.ts",
    "dev": "next dev --webpack",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  }
}
```

Rationale:

- `next build` will use the Next adapter.
- `sync:algolia` needs explicit content generation because it can be run without a prior Next build.
- Keep `dev` on `--webpack` for now to avoid changing the local development bundler in the same migration. Turbopack can be re-enabled after the content migration is stable.

- [ ] **Step 5: Check dependency state**

Run:

```bash
npm ls contentlayer @content-collections/core @content-collections/next @content-collections/cli @content-collections/markdown zod
```

Expected:

- `contentlayer` is absent.
- all Content Collections packages are installed.
- npm does not report dependency errors.

---

## Task 2: Add Content Collections Configuration

**Files:**

- Create: `content-collections.ts`
- Delete later in Task 8: `contentlayer.config.ts`

- [ ] **Step 1: Create `content-collections.ts`**

Add this file:

```ts
import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMarkdown } from '@content-collections/markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import { z } from 'zod'

const wordsPerMinute = 200

function toIsoDate(value: string | Date) {
  return new Date(value).toISOString()
}

function getReadingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

const posts = defineCollection({
  name: 'posts',
  typeName: 'Post',
  directory: 'content/posts',
  include: '**/*.md',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.union([z.string(), z.date()]),
    tags: z.array(z.string()).default([]),
    excerpt: z.string(),
    coverImage: z.string().default(''),
    content: z.string(),
  }),
  transform: async (document, context) => {
    const html = await compileMarkdown(context, document, {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeHighlight],
    })

    return {
      ...document,
      _id: document._meta.filePath,
      date: toIsoDate(document.date),
      body: {
        raw: document.content,
        html,
      },
      url: `/posts/${document.slug}`,
      readingTime: getReadingTime(document.content),
    }
  },
})

export default defineConfig({
  content: [posts],
})
```

- [ ] **Step 2: Generate content once**

Run:

```bash
npm run generate:content
```

Expected:

- `.content-collections/generated` is created.
- output reports successful collection generation.
- no `contentlayer` CLI output appears.

- [ ] **Step 3: Verify generated post shape**

Run:

```bash
npx tsx -e "import { allPosts } from 'content-collections'; console.log(JSON.stringify({ count: allPosts.length, first: { slug: allPosts[0].slug, hasBodyHtml: Boolean(allPosts[0].body?.html), hasBodyRaw: Boolean(allPosts[0].body?.raw), readingTime: allPosts[0].readingTime } }))"
```

Expected shape:

```json
{"count":3,"first":{"slug":"nextjs-15-features","hasBodyHtml":true,"hasBodyRaw":true,"readingTime":1}}
```

The first slug can differ if Content Collections preserves a different source order. The required conditions are `count: 3`, `hasBodyHtml: true`, `hasBodyRaw: true`, and a positive `readingTime`.

---

## Task 3: Wire Content Collections Into Next And Tooling

**Files:**

- Modify: `next.config.ts`
- Modify: `tsconfig.json`
- Modify: `.gitignore`
- Modify: `eslint.config.mjs`

- [ ] **Step 1: Update `next.config.ts`**

Replace the file with:

```ts
import { withContentCollections } from '@content-collections/next'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  experimental: {
    mdxRs: true,
  },
}

export default withContentCollections(nextConfig)
```

Keep `withContentCollections` as the outermost plugin. There are no other Next plugins in this project.

- [ ] **Step 2: Update `tsconfig.json` paths and includes**

Change:

```json
"paths": {
  "@/*": ["./*"],
  "contentlayer/generated": ["./.contentlayer/generated"]
}
```

to:

```json
"paths": {
  "@/*": ["./*"],
  "content-collections": ["./.content-collections/generated"]
}
```

Change the `include` array from:

```json
[
  "next-env.d.ts",
  "**/*.ts",
  "**/*.tsx",
  ".next/types/**/*.ts",
  ".next/dev/types/**/*.ts",
  "**/*.mts",
  ".contentlayer/generated"
]
```

to:

```json
[
  "next-env.d.ts",
  "**/*.ts",
  "**/*.tsx",
  ".next/types/**/*.ts",
  ".next/dev/types/**/*.ts",
  "**/*.mts",
  ".content-collections/generated"
]
```

- [ ] **Step 3: Update `.gitignore` generated content ignores**

Keep the old Contentlayer ignore to protect against stale local artifacts, and add Content Collections:

```gitignore
# Contentlayer legacy artifacts
.contentlayer

# Content Collections
.content-collections
```

- [ ] **Step 4: Update `eslint.config.mjs` ignores**

Ensure the ignore list contains both generated directories:

```js
ignores: [
  '.next/**',
  'out/**',
  'next-env.d.ts',
  '.contentlayer/**',
  '.content-collections/**',
]
```

- [ ] **Step 5: Run type generation check**

Run:

```bash
npm run generate:content
npx tsc --noEmit
```

Expected: TypeScript still fails at this point because application files still import `contentlayer/generated`. Proceed to Task 4.

---

## Task 4: Add A Content Facade In `lib/posts.ts`

**Files:**

- Modify: `lib/posts.ts`

- [ ] **Step 1: Replace `lib/posts.ts`**

Replace the file with:

```ts
import { allPosts, type Post } from 'content-collections'

export type { Post }

export type ArchiveGroup = {
  year: number
  months: {
    month: number
    posts: Post[]
  }[]
}

export function getAllPosts() {
  return [...allPosts]
}

export function getSortedPosts() {
  return getAllPosts().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export function getPostBySlug(slug: string) {
  return allPosts.find((post) => post.slug === slug)
}

export function getPostsByTag(tag: string) {
  return getSortedPosts().filter((post) => post.tags.includes(tag))
}

export function getAllTags() {
  const tags = new Set<string>()

  allPosts.forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag))
  })

  return Array.from(tags).sort()
}

export function getTagsWithCounts() {
  const tagsMap = new Map<string, number>()

  allPosts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagsMap.set(tag, (tagsMap.get(tag) || 0) + 1)
    })
  })

  return Array.from(tagsMap.entries()).sort((a, b) => b[1] - a[1])
}

export function getArchive(): ArchiveGroup[] {
  const postsByYear = new Map<number, Map<number, Post[]>>()

  allPosts.forEach((post) => {
    const date = new Date(post.date)
    const year = date.getFullYear()
    const month = date.getMonth() + 1

    if (!postsByYear.has(year)) {
      postsByYear.set(year, new Map())
    }

    const monthsMap = postsByYear.get(year)!
    if (!monthsMap.has(month)) {
      monthsMap.set(month, [])
    }

    monthsMap.get(month)!.push(post)
  })

  return Array.from(postsByYear.entries())
    .sort(([yearA], [yearB]) => yearB - yearA)
    .map(([year, monthsMap]) => ({
      year,
      months: Array.from(monthsMap.entries())
        .sort(([monthA], [monthB]) => monthB - monthA)
        .map(([month, posts]) => ({
          month,
          posts: [...posts].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          ),
        })),
    }))
}
```

- [ ] **Step 2: Run the facade through `tsx`**

Run:

```bash
npm run generate:content
npx tsx -e "import { getSortedPosts } from './lib/posts'; console.log(getSortedPosts().map((post) => post.slug).join(','))"
```

Expected output includes all three slugs:

```text
welcome-to-my-blog,nextjs-15-features,tailwind-css-tips
```

The order should be date-descending. If the exact order is `welcome-to-my-blog,nextjs-15-features,tailwind-css-tips`, it matches the current dates.

---

## Task 5: Migrate App Routes To The Facade

**Files:**

- Modify: `app/page.tsx`
- Modify: `app/posts/page.tsx`
- Modify: `app/posts/[slug]/page.tsx`
- Modify: `app/tags/page.tsx`
- Modify: `app/tags/[tag]/page.tsx`
- Modify: `app/archive/page.tsx`

- [ ] **Step 1: Update `app/page.tsx`**

Replace:

```ts
import { allPosts } from 'contentlayer/generated'
```

with:

```ts
import { getSortedPosts } from '@/lib/posts'
```

Replace:

```ts
const latestPosts = allPosts
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 3)
```

with:

```ts
const latestPosts = getSortedPosts().slice(0, 3)
```

- [ ] **Step 2: Update `app/posts/page.tsx`**

Replace:

```ts
import { allPosts } from 'contentlayer/generated'
```

with:

```ts
import { getSortedPosts } from '@/lib/posts'
```

Replace:

```ts
const posts = allPosts.sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
)
```

with:

```ts
const posts = getSortedPosts()
```

- [ ] **Step 3: Update `app/posts/[slug]/page.tsx` imports and static params**

Replace:

```ts
import { allPosts } from 'contentlayer/generated'
```

with:

```ts
import { getAllPosts, getPostBySlug, getSortedPosts } from '@/lib/posts'
```

Replace `generateStaticParams` with:

```ts
export function generateStaticParams() {
  return getAllPosts().map((post) => ({
    slug: post.slug,
  }))
}
```

Replace:

```ts
const post = allPosts.find((p) => p.slug === slug)
```

with:

```ts
const post = getPostBySlug(slug)
```

Replace:

```ts
const sortedPosts = [...allPosts].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
)
```

with:

```ts
const sortedPosts = getSortedPosts()
```

- [ ] **Step 4: Update `app/tags/page.tsx`**

Replace:

```ts
import { allPosts } from 'contentlayer/generated'
```

with:

```ts
import { getTagsWithCounts } from '@/lib/posts'
```

Delete the local `getAllTags()` function.

Replace:

```ts
const tags = getAllTags()
```

with:

```ts
const tags = getTagsWithCounts()
```

- [ ] **Step 5: Update `app/tags/[tag]/page.tsx`**

Replace:

```ts
import { allPosts } from 'contentlayer/generated'
```

with:

```ts
import { getAllTags, getPostsByTag } from '@/lib/posts'
```

Replace `generateStaticParams` with:

```ts
export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }))
}
```

Replace:

```ts
const posts = allPosts
  .filter(post => post.tags.includes(decodedTag))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
```

with:

```ts
const posts = getPostsByTag(decodedTag)
```

- [ ] **Step 6: Update `app/archive/page.tsx`**

Replace:

```ts
import { allPosts } from 'contentlayer/generated'
```

with:

```ts
import { getAllPosts, getArchive } from '@/lib/posts'
```

Delete the local `ArchiveGroup` interface and local `getArchive()` function.

In `ArchivePage`, keep:

```ts
const archive = getArchive()
```

Replace:

```tsx
{allPosts.length} articles in total
```

with:

```tsx
{getAllPosts().length} articles in total
```

- [ ] **Step 7: Search for leftover Contentlayer imports**

Run:

```bash
rg -n "contentlayer/generated|contentlayer/source-files|next-contentlayer|withContentlayer|useMDXComponent" app lib components scripts contentlayer.config.ts package.json next.config.ts tsconfig.json
```

Expected: only `contentlayer.config.ts` appears, because it has not been deleted until Task 8. No app route should import Contentlayer.

---

## Task 6: Migrate Algolia Sync

**Files:**

- Modify: `scripts/sync-algolia.ts`

- [ ] **Step 1: Update generated content import**

Replace:

```ts
import { allPosts } from '../.contentlayer/generated/index.mjs'
```

with:

```ts
import { allPosts } from 'content-collections'
```

- [ ] **Step 2: Keep the record mapping compatible**

Ensure `toAlgoliaRecord` still reads these fields:

```ts
function toAlgoliaRecord(post: ContentPost): AlgoliaPostRecord {
  return {
    objectID: post.slug,
    title: post.title,
    slug: post.slug,
    date: post.date,
    tags: post.tags,
    excerpt: post.excerpt,
    content: post.body.raw,
    readingTime: post.readingTime,
  }
}
```

The Content Collections transform in Task 2 intentionally preserves `body.raw` and `readingTime` for this script. `sync:algolia` runs `npm run generate:content` first, so the generated alias exists before `tsx` evaluates the script.

- [ ] **Step 3: Run dry-run sync from clean generated state**

Run:

```bash
rm -rf .content-collections
npm run sync:algolia -- --dry-run
```

Expected:

```text
Prepared 3 records for Algolia index "blog_posts".
```

This confirms `sync:algolia` can generate content before importing `content-collections`.

---

## Task 7: Remove Contentlayer Runtime Surface

**Files:**

- Delete: `contentlayer.config.ts`
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Delete `contentlayer.config.ts`**

Remove the file. Its responsibilities moved to `content-collections.ts`.

- [ ] **Step 2: Verify no Contentlayer runtime imports remain**

Run:

```bash
rg -n "contentlayer|next-contentlayer|withContentlayer|useMDXComponent" . --glob '!node_modules/**' --glob '!.next/**' --glob '!.contentlayer/**' --glob '!.content-collections/**' --glob '!docs/superpowers/plans/2026-04-30-blog-system.md' --glob '!memory/blog-system-progress.md'
```

Expected: only historical documentation files and migration notes contain Contentlayer references.

- [ ] **Step 3: Remove old generated output locally**

Run:

```bash
rm -rf .contentlayer
```

Expected: no tracked files change, because `.contentlayer` is ignored.

---

## Task 8: Update Documentation And Historical Notes

**Files:**

- Modify: `README.md`
- Modify: `AGENTS.md`
- Modify: `FINAL_STATUS.md`
- Modify: `CURRENT_PROGRESS.md`
- Modify: `memory/blog-system-progress.md`
- Modify: `docs/superpowers/plans/2026-04-30-blog-system.md`

- [ ] **Step 1: Update `README.md` tech stack**

Make these content changes:

```md
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?logo=tailwind-css)
```

```md
| 内容 | Content Collections | current |
| 构建 | Next.js + Content Collections adapter | - |
```

Replace references that imply Contentlayer is active with Content Collections. Keep Algolia v5 environment variable names unchanged:

```env
NEXT_PUBLIC_ALGOLIA_APP_ID=your_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=your_search_key
ALGOLIA_ADMIN_KEY=your_admin_key
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=blog_posts
```

- [ ] **Step 2: Add README migration note**

Add a short note under development commands:

```md
Content is generated by Content Collections. `npm run build` generates content through the Next adapter. `npm run sync:algolia` runs `npm run generate:content` first so the search index can be updated from a clean checkout.
```

- [ ] **Step 3: Update `AGENTS.md` stack facts**

Change:

```md
Next.js 15 博客系统 - 苹果设计风格
- **框架**: Next.js 15 (App Router)
- **样式**: Tailwind CSS 4
- **内容**: Contentlayer
```

to:

```md
Next.js 16 博客系统 - 苹果设计风格
- **框架**: Next.js 16 (App Router)
- **样式**: Tailwind CSS 3.4.x
- **内容**: Content Collections
```

- [ ] **Step 4: Update status docs**

In `FINAL_STATUS.md`, `CURRENT_PROGRESS.md`, and `memory/blog-system-progress.md`, update active stack references:

```md
- Next.js 16.2.x (App Router)
- Tailwind CSS 3.4.x
- Content Collections
- Algolia v5
```

Where the file describes historical setup, label it explicitly:

```md
历史记录：早期计划使用 Contentlayer/next-contentlayer；当前实现已迁移到 Content Collections。
```

- [ ] **Step 5: Mark the old implementation plan as historical**

At the top of `docs/superpowers/plans/2026-04-30-blog-system.md`, add:

```md
> Historical note: This plan reflects an earlier Contentlayer-based implementation. The active project has migrated to Content Collections. Do not follow the `next-contentlayer`, `withContentlayer`, `next-contentlayer/hooks`, Algolia v4 `initIndex`, or `post.body.code` examples in this document for current work.
```

---

## Task 9: Static Verification

**Files:**

- Verify all changed files.

- [ ] **Step 1: Generate content from a clean state**

Run a safe generated-directory cleanup, then generate content:

```bash
node -e "const fs=require('fs'); for (const dir of ['.contentlayer', '.content-collections']) fs.rmSync(dir, { recursive: true, force: true });"
npm run generate:content
```

Expected:

- `.content-collections/generated` exists.
- `.contentlayer` does not need to exist.
- generation exits 0 without Contentlayer/Clipanion errors.

- [ ] **Step 2: Run lint**

Run:

```bash
npm run lint
```

Expected: exits 0.

- [ ] **Step 3: Run typecheck**

Run:

```bash
npx tsc --noEmit
```

Expected: exits 0.

- [ ] **Step 4: Run production build from clean generated state**

Run a safe generated-directory cleanup, then build:

```bash
node -e "const fs=require('fs'); for (const dir of ['.contentlayer', '.content-collections']) fs.rmSync(dir, { recursive: true, force: true });"
npm run build
```

Expected:

- Content Collections generation runs through the Next adapter.
- Next build exits 0.
- build output still shows `/posts/[slug]` and `/tags/[tag]` as SSG.

- [ ] **Step 5: Run Algolia dry-run from clean generated state**

Run:

```bash
rm -rf .content-collections
npm run sync:algolia -- --dry-run
```

Expected:

```text
Prepared 3 records for Algolia index "blog_posts".
```

- [ ] **Step 6: Check worktree**

Run:

```bash
GIT_MASTER=1 git status --porcelain
```

Expected: only planned source/documentation/package files are modified; no `.contentlayer`, `.content-collections`, `.next`, or Playwright artifacts are tracked.

---

## Task 10: Browser QA

**Files:**

- Verify running app behavior.

- [ ] **Step 1: Start production server**

Run:

```bash
npm run start -- --port 3127
```

Expected: production server starts on `http://localhost:3127`.

- [ ] **Step 2: Verify core routes with HTTP checks**

Run:

```bash
node -e "const paths=['/','/posts','/posts/welcome-to-my-blog','/tags','/tags/nextjs','/archive','/search']; Promise.all(paths.map(async p => { const r = await fetch('http://localhost:3127' + p); console.log(p, r.status); if (!r.ok) process.exitCode = 1 }))"
```

Expected:

```text
/ 200
/posts 200
/posts/welcome-to-my-blog 200
/tags 200
/tags/nextjs 200
/archive 200
/search 200
```

- [ ] **Step 3: Browser-check article detail**

Use Playwright to open:

```text
http://localhost:3127/posts/welcome-to-my-blog
```

Expected visible content:

- `欢迎来到我的博客`
- `1 min read`
- tags including `博客`, `介绍`, `Next.js`
- rendered Markdown headings and list items

- [ ] **Step 4: Browser-check search**

Open:

```text
http://localhost:3127/search
```

Expected:

- empty query shows `Type to search articles...`
- searching `Next.js` returns current Algolia hits
- no erroneous `No results found` while hits are visible

- [ ] **Step 5: Clean runtime artifacts**

Run:

```bash
npm exec --yes --package @playwright/cli -- playwright-cli close-all
rm -rf .playwright-cli
```

Stop the production server process after browser QA.

---

## Fallback Path: Velite

Use Velite only if Content Collections fails one of these gates:

- `withContentCollections(nextConfig)` cannot build under Next 16.2.x.
- `content-collections build` cannot generate from a clean checkout.
- Markdown HTML output cannot preserve the current rendered article surface.
- Generated TypeScript types are unstable or incompatible with route generation.

If fallback is triggered, stop the Content Collections implementation and create a separate Velite migration plan with these principles:

- Generate `.velite` content before build.
- Preserve the same `Post` shape through `lib/posts.ts`.
- Keep Algolia sync reading generated content from a clean generation command.
- Do not migrate to MDX runtime in the same pass unless explicitly requested.

---

## Self-Review

**Spec coverage:** The plan replaces Contentlayer, addresses clean generated content, keeps current route/search behavior, updates documentation, and includes verification through build, typecheck, Algolia dry-run, HTTP checks, and browser QA.

**Gap scan:** No unresolved gaps are present. Version ranges are intentionally shown as expected npm-resolved examples and should be accepted when npm resolves compatible newer patch versions.

**Type consistency:** The generated `Post` shape keeps current fields used by pages and scripts: `_id`, `slug`, `date`, `tags`, `excerpt`, `coverImage`, `body.raw`, `body.html`, `url`, and `readingTime`. Routes import through `lib/posts.ts`; `scripts/sync-algolia.ts` imports `content-collections` after generation because standalone `tsx` resolves the new generated alias reliably.
