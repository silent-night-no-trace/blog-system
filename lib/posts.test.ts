import { describe, it, expect } from 'vitest'
import { normalizeTag, getArchive, type Post } from './posts'

// Minimal Post fixture — only the fields the functions under test touch need
// to be populated; the rest is cast away since Post is a generated union type.
function makePost(slug: string, date: string, tags: string[] = []): Post {
  return {
    title: slug,
    slug,
    date,
    tags,
    excerpt: '',
    coverImage: '',
    content: '',
    _id: slug,
    body: { raw: '', html: '' },
    url: `/posts/${slug}`,
    readingTime: 1,
  } as unknown as Post
}

describe('normalizeTag', () => {
  it('lowercases and hyphenates ascii tags', () => {
    expect(normalizeTag('Hello World')).toBe('hello-world')
  })

  it('strips dots and merges nextjs variants', () => {
    expect(normalizeTag('Next.js')).toBe('nextjs')
    expect(normalizeTag('nextjs')).toBe('nextjs')
  })

  it('strips latin diacritics', () => {
    expect(normalizeTag('café')).toBe('cafe')
  })

  it('preserves chinese characters', () => {
    expect(normalizeTag('博客')).toBe('博客')
  })

  it('preserves japanese kana', () => {
    expect(normalizeTag('テスト')).toBe('テスト')
  })

  it('preserves korean hangul through NFKD/NFC round-trip', () => {
    expect(normalizeTag('한국어')).toBe('한국어')
  })

  it('returns empty for tags with no slug characters', () => {
    expect(normalizeTag('!!!')).toBe('')
    expect(normalizeTag('   ')).toBe('')
  })
})

describe('getArchive', () => {
  it('groups posts by year descending then month descending', () => {
    const posts = [
      makePost('a', '2026-01-10'),
      makePost('b', '2026-03-15'),
      makePost('c', '2025-12-01'),
    ]
    const archive = getArchive(posts)

    expect(archive.map((g) => g.year)).toEqual([2026, 2025])
    expect(archive[0].months.map((m) => m.month)).toEqual([3, 1])
  })

  it('sorts posts within a month newest-first', () => {
    const posts = [
      makePost('early', '2026-03-01'),
      makePost('late', '2026-03-31'),
      makePost('mid', '2026-03-15'),
    ]
    const archive = getArchive(posts)
    const monthPosts = archive[0].months[0].posts

    expect(monthPosts.map((p) => p.slug)).toEqual(['late', 'mid', 'early'])
  })

  it('returns an empty array when there are no posts', () => {
    expect(getArchive([])).toEqual([])
  })
})
