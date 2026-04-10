interface WindowTitleBarProps {
  currentFile: string
}

export default function WindowTitleBar({ currentFile }: WindowTitleBarProps) {
  return (
    <header className="flex justify-between items-center border-b-2 border-black dark:border-white p-3 shrink-0">
      <div className="text-xl font-bold">{currentFile}</div>
      <div className="flex gap-2">
        <div className="w-4 h-4 border-2 border-black dark:border-white rounded-full"></div>
        <div className="w-4 h-4 border-2 border-black dark:border-white rounded-full"></div>
      </div>
    </header>
  )
}
