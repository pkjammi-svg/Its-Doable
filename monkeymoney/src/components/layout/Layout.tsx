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
      <header className="sticky top-0 z-30 bg-gradient-to-r from-jungle-700 to-jungle-500 dark:from-jungle-800 dark:to-jungle-700 border-b border-jungle-600 dark:border-jungle-700 shadow-md">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Coin logo mark: yellow ring + green disc + monkey face */}
            <svg className="w-8 h-8" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Yellow coin ring */}
              <circle cx="100" cy="100" r="99" fill="#f5c518"/>
              {/* Green disc */}
              <circle cx="100" cy="100" r="90" fill="#2d6a4f"/>
              {/* Ears */}
              <circle cx="63" cy="95" r="20" fill="#8B6914"/>
              <circle cx="63" cy="95" r="13" fill="#D4956A"/>
              <circle cx="137" cy="95" r="20" fill="#8B6914"/>
              <circle cx="137" cy="95" r="13" fill="#D4956A"/>
              {/* Head */}
              <circle cx="100" cy="91" r="44" fill="#8B6914"/>
              {/* Muzzle */}
              <ellipse cx="100" cy="111" rx="27" ry="21" fill="#D4956A"/>
              {/* Eye whites */}
              <circle cx="85" cy="83" r="11.5" fill="white"/>
              <circle cx="115" cy="83" r="11.5" fill="white"/>
              {/* Pupils */}
              <circle cx="87" cy="85" r="6" fill="#1a0a00"/>
              <circle cx="117" cy="85" r="6" fill="#1a0a00"/>
              {/* Eye shine */}
              <circle cx="90" cy="82" r="2.5" fill="white"/>
              <circle cx="120" cy="82" r="2.5" fill="white"/>
              {/* Nose */}
              <ellipse cx="100" cy="107" rx="6" ry="4" fill="#5C3D1A"/>
              {/* Smile */}
              <path d="M 89 114 Q 100 124 111 114" stroke="#5C3D1A" strokeWidth="3" fill="none" strokeLinecap="round"/>
            </svg>
            <span className="font-display font-bold text-lg text-white tracking-tight">
              Monkey<span className="text-banana-300">Money</span>
            </span>
          </div>
          <button
            onClick={() => setDark(d => !d)}
            className="w-8 h-8 flex items-center justify-center rounded-full text-white/80 hover:bg-jungle-600 dark:hover:bg-jungle-700 transition-colors focus-visible:ring-2 ring-white/50"
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
