// Prepares raw markdown body text for full-text search indexing: strips code
// fences, inline code, images, and link URLs, then collapses whitespace and
// truncates so Algolia records stay within a sane size.
const SEARCH_CONTENT_MAX_LENGTH = 5000

export function cleanSearchContent(content: string) {
  return content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/[#>*_~\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function getSearchContent(content: string) {
  const cleaned = cleanSearchContent(content)

  if (cleaned.length <= SEARCH_CONTENT_MAX_LENGTH) {
    return cleaned
  }

  return `${cleaned.slice(0, SEARCH_CONTENT_MAX_LENGTH).trimEnd()}...`
}
