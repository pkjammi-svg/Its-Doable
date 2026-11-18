import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { clsx } from 'clsx'
import { X } from 'lucide-react'

interface Toast {
  id: string
  message: string
  sub?: string
  type: 'success' | 'info' | 'warning' | 'error'
  icon?: string
}

interface ToastContextType {
  showToast: (message: string, opts?: { sub?: string; type?: Toast['type']; icon?: string }) => void
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} })

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
    timers.current.delete(id)
  }, [])

  const showToast = useCallback((message: string, opts?: { sub?: string; type?: Toast['type']; icon?: string }) => {
    const id = Math.random().toString(36).slice(2)
    const toast: Toast = { id, message, sub: opts?.sub, type: opts?.type ?? 'info', icon: opts?.icon }
    setToasts(prev => [...prev.slice(-2), toast])
    const t = setTimeout(() => removeToast(id), 4000)
    timers.current.set(id, t)
  }, [removeToast])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center w-full max-w-sm px-4 pointer-events-none"
      >
        {toasts.map(t => (
          <div
            key={t.id}
            className={clsx(
              'pointer-events-auto w-full rounded-2xl px-4 py-3 shadow-lg flex items-start gap-3 animate-slide-up',
              'motion-reduce:animate-none',
              t.type === 'success' && 'bg-green-500 text-white',
              t.type === 'warning' && 'bg-amber-500 text-white',
              t.type === 'error' && 'bg-red-500 text-white',
              t.type === 'info' && 'bg-jungle-600 text-white',
            )}
          >
            {t.icon && <span className="text-xl shrink-0 leading-none mt-0.5">{t.icon}</span>}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm font-body leading-snug">{t.message}</p>
              {t.sub && <p className="text-xs opacity-90 mt-0.5 font-body">{t.sub}</p>}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="shrink-0 opacity-80 hover:opacity-100 transition-opacity"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
