export function Footer() {
  return (
    <footer className="border-t bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          <p>© {new Date().getFullYear()} Blog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
