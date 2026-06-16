'use client'

import { InstantSearch, SearchBox, Hits, Highlight, useInstantSearch } from 'react-instantsearch'
import { liteClient } from 'algoliasearch/lite'
import type { Hit as AlgoliaHit } from 'instantsearch.js'
import Link from 'next/link'
import { AlertCircle, FileSearch, Loader2, SearchIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatReadingTime } from '@/lib/site'

type BlogSearchHit = {
  title: string
  slug: string
  date: string
  tags?: string[]
  excerpt: string
  readingTime: number
}

const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const algoliaSearchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
const algoliaIndexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME
const searchClient = algoliaAppId && algoliaSearchKey
  ? liteClient(algoliaAppId, algoliaSearchKey)
  : null

function Hit({ hit }: { hit: AlgoliaHit<BlogSearchHit> }) {
  return (
    <Link href={`/posts/${hit.slug}`} className="block">
      <div className="mb-6 last:mb-0">
        <h3 className="mb-2 text-xl font-bold text-zinc-900 hover:text-black dark:text-zinc-100 dark:hover:text-white">
          <Highlight attribute="title" hit={hit} />
        </h3>

        <p className="mb-3 text-zinc-600 dark:text-zinc-400">
          <Highlight attribute="excerpt" hit={hit} />
        </p>

        <div className="mb-3 flex flex-wrap gap-2">
          {hit.tags?.map((tag: string) => (
            <Badge key={tag} variant="primary">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-500">
          <time dateTime={hit.date}>
            {formatDate(hit.date)}
          </time>
          <span>·</span>
          <span>{formatReadingTime(hit.readingTime)}</span>
        </div>
      </div>
    </Link>
  )
}

function SearchResults() {
  const { error, indexUiState, results, status } = useInstantSearch({ catchError: true })
  const query = indexUiState.query?.trim() || ''
  const hasQuery = Boolean(query)
  const isSearching = status === 'loading' || status === 'stalled'

  if (!hasQuery) {
    return (
      <div className="rounded-2xl border border-zinc-100 bg-white px-6 py-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <SearchIcon className="mx-auto mb-3 h-6 w-6 text-zinc-400" aria-hidden="true" />
        <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          开始搜索
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          输入关键词以搜索文章标题、摘要、标签和正文。
        </p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-12 text-center dark:border-red-900/50 dark:bg-red-950/20">
        <AlertCircle className="mx-auto mb-3 h-6 w-6 text-red-500 dark:text-red-300" aria-hidden="true" />
        <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          搜索暂时不可用
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {error?.message || '请稍后再试。'}
        </p>
      </div>
    )
  }

  if (isSearching) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl border border-zinc-100 bg-white px-6 py-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-zinc-400" aria-hidden="true" />
        <p className="font-medium text-zinc-900 dark:text-zinc-100">搜索中…</p>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          正在查找与 <q>{query}</q> 匹配的文章。
        </p>
      </div>
    )
  }

  if (results.nbHits === 0) {
    return (
      <div className="rounded-2xl border border-zinc-100 bg-white px-6 py-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <FileSearch className="mx-auto mb-3 h-6 w-6 text-zinc-400" aria-hidden="true" />
        <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          未找到结果
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          换个关键词或检查拼写后再试。
        </p>
      </div>
    )
  }

  return (
    <>
      <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400" aria-live="polite">
        找到 {results.nbHits.toLocaleString('zh-CN')} 个与 <q>{query}</q> 匹配的结果。
      </p>

      <div className="space-y-6">
        <Hits<BlogSearchHit>
          hitComponent={Hit}
          classNames={{
            root: '',
            list: '',
            item: '',
          }}
        />
      </div>
    </>
  )
}

export function SearchClient() {
  if (!searchClient || !algoliaIndexName) {
    return (
      <div className="py-12">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-3 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            搜索未配置
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            配置 Algolia 环境变量后即可启用文章搜索。
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            搜索
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            按标题、摘要、标签或正文搜索文章。
          </p>
        </div>

        <InstantSearch
          searchClient={searchClient}
          indexName={algoliaIndexName}
        >
          <SearchBox
            placeholder="搜索文章…"
            translations={{
              submitButtonTitle: '提交搜索',
              resetButtonTitle: '清除搜索词',
            }}
            classNames={{
              root: 'mb-8',
              form: 'relative',
              input: 'w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-base shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-100 dark:focus:ring-zinc-100',
              submit: 'hidden',
              reset: 'absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-zinc-500 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 dark:focus-visible:ring-zinc-100',
              loadingIndicator: 'hidden',
            }}
          />

          <SearchResults />
        </InstantSearch>
      </div>
    </div>
  )
}
