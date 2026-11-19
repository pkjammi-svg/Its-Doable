import { NavLink } from 'react-router-dom'
import { clsx } from 'clsx'
import { Home, Receipt, BarChart2, BookOpen, User } from 'lucide-react'

const NAV = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/expenses', label: 'Expenses', icon: Receipt },
  { to: '/compare', label: 'Compare', icon: BarChart2 },
  { to: '/learn', label: 'Learn', icon: BookOpen },
  { to: '/profile', label: 'Profile', icon: User },
]

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-jungle-900/90 backdrop-blur-md border-t border-gray-200 dark:border-jungle-800"
      aria-label="Main navigation"
    >
      <div className="max-w-2xl mx-auto flex">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              clsx(
                'flex-1 flex flex-col items-center gap-0.5 py-3 text-[10px] font-medium font-body transition-colors',
                'focus-visible:ring-2 ring-jungle-500 ring-inset',
                isActive
                  ? 'text-jungle-600 dark:text-jungle-300'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              )
            }
            aria-label={label}
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className={clsx(isActive && 'scale-110 transition-transform motion-reduce:scale-100')}
                />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
      {/* iOS safe area */}
      <div className="h-safe-b" style={{ height: 'env(safe-area-inset-bottom)' }} />
    </nav>
  )
}
