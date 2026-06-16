import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold">
          Blog
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/posts"
            className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
          >
            文章
          </Link>
          <Link
            href="/tags"
            className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
          >
            标签
          </Link>
          <Link
            href="/archive"
            className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
          >
            归档
          </Link>
          <Link
            href="/search"
            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
          >
            搜索
          </Link>
        </nav>
      </div>
    </header>
  )
}
