"use client"

interface WindowFooterProps {
  isDark: boolean
  onToggleTheme: () => void
}

export default function WindowFooter({ isDark, onToggleTheme }: WindowFooterProps) {
  return (
    <footer className="border-t-2 border-black dark:border-white p-3 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-2">
        <button className="bg-white dark:bg-black border-2 border-black dark:border-white text-black dark:text-white px-3 py-1 text-sm">
          NULITAS
        </button>
        <button
          onClick={onToggleTheme}
          className="bg-white dark:bg-black border-2 border-black dark:border-white text-black dark:text-white px-3 py-1 text-sm"
          aria-label="Toggle Theme"
        >
          {isDark ? "DARK" : "LIGHT"}
        </button>
        <span className="text-base">THEME</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-base">PWR</span>
        <div className="w-3 h-3 rounded-full border-2 border-black dark:border-white bg-green-400"></div>
      </div>
    </footer>
  )
}
