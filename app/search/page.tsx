'use client'

import { useState } from 'react'
import { InstantSearch, SearchBox, Hits, Highlight, useInstantSearch } from 'react-instantsearch'
import { liteClient } from 'algoliasearch/lite'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

const searchClient = liteClient(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
)

function Hit({ hit }: { hit: any }) {
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
            {new Date(hit.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <span>·</span>
          <span>{hit.readingTime} min read</span>
        </div>
      </div>
    </Link>
  )
}

function NoResults() {
  const { indexUiState } = useInstantSearch()

  if (!indexUiState.query) {
    return (
      <div className="py-12 text-center text-zinc-500 dark:text-zinc-500">
        <p>Type to search articles...</p>
      </div>
    )
  }

  return (
    <div className="py-12 text-center">
      <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        No results found
      </h3>
      <p className="text-zinc-600 dark:text-zinc-400">
        Try different keywords or check the spelling.
      </p>
    </div>
  )
}

function LoadingIndicator() {
  return (
    <div className="py-12 text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900 dark:border-zinc-800 dark:border-t-zinc-100" />
    </div>
  )
}

export default function SearchPage() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <InstantSearch
          searchClient={searchClient}
          indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME!}
        >
          <SearchBox
            placeholder="Search articles..."
            classNames={{
              root: 'mb-8',
              form: 'relative',
              input: 'w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-base shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-100 dark:focus:ring-zinc-100',
              submit: 'hidden',
              reset: 'absolute right-3 top-1/2 -translate-y-1/2',
              loadingIndicator: 'hidden',
            }}
          />

          <div className="space-y-6">
            <Hits
              hitComponent={Hit}
              classNames={{
                root: '',
                list: '',
                item: '',
              }}
            />
          </div>

          <NoResults />
        </InstantSearch>
      </div>
    </div>
  )
}
