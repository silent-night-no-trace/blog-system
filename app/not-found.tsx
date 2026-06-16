import Link from 'next/link'
import type { Metadata } from 'next'
import { buttonVariants } from '@/components/ui/button'

export const metadata: Metadata = {
  title: '页面未找到',
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center py-24">
      <div className="mx-auto max-w-md px-4 text-center sm:px-6 lg:px-8">
        <p className="text-5xl font-bold text-zinc-900 dark:text-zinc-100">404</p>
        <h1 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          页面未找到
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          你访问的页面不存在或已被移动。
        </p>
        <Link href="/" className={buttonVariants({ variant: 'primary', className: 'mt-8' })}>
          返回首页
        </Link>
      </div>
    </div>
  )
}
