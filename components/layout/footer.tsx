import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-3 text-sm text-zinc-600 dark:text-zinc-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Blog. 保留所有权利。</p>
          <Link
            href="/rss.xml"
            className="rounded-md hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:hover:text-zinc-100 dark:focus-visible:ring-zinc-100 dark:focus-visible:ring-offset-zinc-950"
          >
            RSS
          </Link>
        </div>
      </div>
    </footer>
  )
}
