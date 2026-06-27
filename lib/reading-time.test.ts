import { describe, it, expect } from 'vitest'
import { getReadingTime } from './reading-time'

describe('getReadingTime', () => {
  it('returns at least 1 minute for empty content', () => {
    expect(getReadingTime('')).toBe(1)
  })

  it('counts latin words at 200 wpm', () => {
    // 400 words → 2 minutes
    const words = Array.from({ length: 400 }, () => 'word').join(' ')
    expect(getReadingTime(words)).toBe(2)
  })

  it('counts CJK characters at 350 cpm', () => {
    // 350 han characters → 1 minute
    const cjk = '字'.repeat(350)
    expect(getReadingTime(cjk)).toBe(1)
  })

  it('combines CJK and latin counts', () => {
    // 200 words (1 min) + 350 cjk chars (1 min) → 2 minutes
    const words = Array.from({ length: 200 }, () => 'word').join(' ')
    const cjk = '字'.repeat(350)
    expect(getReadingTime(`${words} ${cjk}`)).toBe(2)
  })

  it('ignores whitespace-only content', () => {
    expect(getReadingTime('   \n\t  ')).toBe(1)
  })
})
