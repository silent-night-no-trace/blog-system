import { describe, it, expect } from 'vitest'
import { cleanSearchContent, getSearchContent } from './search-content'

describe('cleanSearchContent', () => {
  it('strips fenced code blocks', () => {
    const input = 'intro\n```js\nconst x = 1\n```\ntail'
    expect(cleanSearchContent(input)).toBe('intro tail')
  })

  it('unwraps inline code', () => {
    expect(cleanSearchContent('use `npm` here')).toBe('use npm here')
  })

  it('strips image syntax but keeps alt text absent', () => {
    expect(cleanSearchContent('before ![alt](img.png) after')).toBe('before after')
  })

  it('keeps link text, drops the url', () => {
    expect(cleanSearchContent('see [docs](https://x.com/y) now')).toBe('see docs now')
  })

  it('collapses markdown punctuation and whitespace', () => {
    expect(cleanSearchContent('## Title\n**bold** _em_')).toBe('Title bold em')
  })
})

describe('getSearchContent', () => {
  it('returns cleaned content unchanged when under the cap', () => {
    expect(getSearchContent('hello world')).toBe('hello world')
  })

  it('truncates with an ellipsis when over the cap', () => {
    const long = 'a'.repeat(6000)
    const result = getSearchContent(long)
    expect(result.endsWith('...')).toBe(true)
    // 5000 chars + '...'
    expect(result.length).toBe(5003)
  })
})
