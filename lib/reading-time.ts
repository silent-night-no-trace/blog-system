// Reading-time estimation that handles CJK text, which has no whitespace
// word boundaries. CJK characters and non-CJK words are counted separately
// and combined at their respective reading speeds.
const wordsPerMinute = 200
const cjkCharsPerMinute = 350
const cjkPattern = /[一-鿿぀-ヿ가-힯]/g

export function getReadingTime(content: string) {
  const cjkChars = (content.match(cjkPattern) || []).length
  const words = content.replace(cjkPattern, ' ').trim().split(/\s+/).filter(Boolean).length
  const minutes = cjkChars / cjkCharsPerMinute + words / wordsPerMinute
  return Math.max(1, Math.ceil(minutes))
}
