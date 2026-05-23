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
  disableImportAliasWarning: true,
})
