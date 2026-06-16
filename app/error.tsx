'use client'

import { useEffect } from 'react'
import { buttonVariants } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-1 items-center justify-center py-24">
      <div className="mx-auto max-w-md px-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          出错了
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          页面加载时发生错误。你可以重试，或稍后再访问。
        </p>
        <button
          type="button"
          onClick={reset}
          className={buttonVariants({ variant: 'primary', className: 'mt-8' })}
        >
          重试
        </button>
      </div>
    </div>
  )
}
