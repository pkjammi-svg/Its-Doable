import { useEffect, useState } from 'react'
import { BottomNav } from './BottomNav'

interface Props {
  children: React.ReactNode
}

export function Layout({ children }: Props) {
  const [dark, setDark] = useState(() => {
    try {
      const stored = localStorage.getItem('mm-theme')
      if (stored === 'dark') return true
      if (stored === 'light') return false
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    } catch { return false }
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try { localStorage.setItem('mm-theme', dark ? 'dark' : 'light') } catch {}
  }, [dark])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-jungle-950 font-body transition-colors">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-jungle-900/80 backdrop-blur-md border-b border-gray-100 dark:border-jungle-800">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-7 h-7" viewBox="0 0 36 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="20" r="5" fill="#8B6914"/>
              <circle cx="8" cy="20" r="3" fill="#D4956A"/>
              <circle cx="28" cy="20" r="5" fill="#8B6914"/>
              <circle cx="28" cy="20" r="3" fill="#D4956A"/>
              <circle cx="18" cy="18" r="11" fill="#8B6914"/>
              <ellipse cx="18" cy="22" rx="7" ry="5.5" fill="#D4956A"/>
              <circle cx="13.5" cy="15.5" r="2.5" fill="white"/>
              <circle cx="22.5" cy="15.5" r="2.5" fill="white"/>
              <circle cx="14" cy="16" r="1.3" fill="#1a0a00"/>
              <circle cx="23" cy="16" r="1.3" fill="#1a0a00"/>
              <ellipse cx="18" cy="21" rx="2" ry="1.4" fill="#5C3D1A"/>
              <path d="M 14.5 24.5 Q 18 27 21.5 24.5" stroke="#5C3D1A" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
            </svg>
            <span className="font-display font-bold text-lg text-jungle-700 dark:text-jungle-200 tracking-tight">
              MonkeyMoney
            </span>
          </div>
          <button
            onClick={() => setDark(d => !d)}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-jungle-800 dark:text-gray-400 transition-colors focus-visible:ring-2 ring-jungle-500"
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 pb-28 pt-4">
        {children}
      </main>

      <BottomNav />
    </div>
  )
}
