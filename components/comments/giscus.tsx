'use client'

import Giscus from '@giscus/react'
import { useTheme } from 'next-themes'

export function GiscusComments({ slug }: { slug: string }) {
  const { theme, resolvedTheme } = useTheme()

  return (
    <div className="pt-8">
      <Giscus
        repo={process.env.NEXT_PUBLIC_GISCUS_REPO! as `${string}/${string}`}
        repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID!}
        category={process.env.NEXT_PUBLIC_GISCUS_CATEGORY || "Announcements"}
        categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID!}
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        lang="en"
        loading="lazy"
      />
    </div>
  )
}
