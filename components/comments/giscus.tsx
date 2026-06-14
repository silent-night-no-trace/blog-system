'use client'

import Giscus from '@giscus/react'
import { useTheme } from 'next-themes'
import { Component, type PropsWithChildren, type ReactNode } from 'react'

type GiscusErrorBoundaryState = {
  hasError: boolean
}

function CommentNotice({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm dark:border-zinc-800 dark:bg-zinc-900/60">
      <h2 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">
        {title}
      </h2>
      <div className="text-zinc-600 dark:text-zinc-400">{children}</div>
    </div>
  )
}

class GiscusErrorBoundary extends Component<PropsWithChildren, GiscusErrorBoundaryState> {
  state: GiscusErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError(): GiscusErrorBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <CommentNotice title="评论暂时不可用">
          Giscus 加载失败。文章内容不受影响，请稍后刷新页面再试。
        </CommentNotice>
      )
    }

    return this.props.children
  }
}

export function GiscusComments() {
  const { resolvedTheme } = useTheme()
  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY || 'Announcements'
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID

  if (!repo || !repoId || !categoryId) {
    return (
      <div className="pt-8">
        <CommentNotice title="评论未配置">
          设置 Giscus public 环境变量后即可启用评论。当前文章阅读不受影响。
        </CommentNotice>
      </div>
    )
  }

  return (
    <div className="pt-8">
      <p className="mb-4 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400">
        评论由 GitHub Discussions 提供。若当前文章还没有对应讨论，首次提交评论时 Giscus 会自动创建。
      </p>
      <GiscusErrorBoundary>
        <Giscus
          repo={repo as `${string}/${string}`}
          repoId={repoId}
          category={category}
          categoryId={categoryId}
          mapping="pathname"
          strict="0"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
          lang="zh-CN"
          loading="lazy"
        />
      </GiscusErrorBoundary>
    </div>
  )
}
