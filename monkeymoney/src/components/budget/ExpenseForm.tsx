import { useState } from 'react'
import { clsx } from 'clsx'
import { PlusCircle, Minus } from 'lucide-react'
import { db, localDateStr } from '../../db/db'
import { useToast } from '../ui/Toast'
import { CATEGORIES } from '../../types'
import { formatCurrency } from '../../lib/currency'
import { getEffectiveDailyLimit } from '../../lib/gamification'
import type { Settings } from '../../types'

interface Props {
  currency?: string
  monthlyLimit: number
  settings: Settings
  onLogged?: () => void
}

const CATEGORY_EMOJIS: Record<string, string> = {
  Groceries: '🛒',
  'Eating out': '🍜',
  'Rent & bills': '🏠',
  Transport: '🚌',
  Shopping: '🛍️',
  'Fun & outings': '🎉',
  Health: '💊',
  Education: '📚',
  Other: '📦',
}

export function ExpenseForm({ currency = 'INR', monthlyLimit, settings, onLogged }: Props) {
  const today = new Date()
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Groceries')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(localDateStr(today))
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useToast()

  const isPaused = settings.pausedCategories?.includes(category)
  const [overridePaused, setOverridePaused] = useState(false)

  const todayStr = localDateStr(today)
  const maxDate = todayStr

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isPaused && !overridePaused) {
      setOverridePaused(true)
      return
    }
    const amt = parseFloat(amount)
    if (isNaN(amt) || amt < 0) return
    setSubmitting(true)
    try {
      await db.expenses.add({ amount: amt, category, note: note.trim(), date, isNoSpend: false })
      const dateObj = new Date(date + 'T00:00:00')
      const y = dateObj.getFullYear(), m = dateObj.getMonth()
      const dailyLimit = getEffectiveDailyLimit(monthlyLimit, y, m, dateObj.getDate(), settings.dailyCap)
      const dayExpenses = await db.expenses.where('date').equals(date).toArray()
      const dayTotal = dayExpenses.reduce((s, ex) => s + ex.amount, 0)
      const isGreen = dayTotal <= dailyLimit
      showToast(
        isGreen ? '🟢 Under today\'s limit!' : '🔴 Over today\'s limit',
        { sub: `Day total: ${formatCurrency(dayTotal, currency)}`, type: isGreen ? 'success' : 'warning' }
      )
      setAmount('')
      setNote('')
      setDate(todayStr)
      setOverridePaused(false)
      onLogged?.()
    } finally {
      setSubmitting(false)
    }
  }

  async function handleNoSpend() {
    setSubmitting(true)
    try {
      await db.expenses.add({ amount: 0, category: 'Other', note: 'No-spend day', date: todayStr, isNoSpend: true })
      showToast('🧘 No-spend day logged!', { type: 'success', icon: '🧘' })
      onLogged?.()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-jungle-900 rounded-3xl p-5 border border-gray-100 dark:border-jungle-800 space-y-4">
      <h2 className="font-display font-bold text-lg text-gray-800 dark:text-gray-100">Log expense</h2>

      {/* Amount */}
      <div>
        <label htmlFor="amount" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
          Amount
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">{currency === 'INR' ? '₹' : currency}</span>
          <input
            id="amount"
            type="number"
            inputMode="decimal"
            min="0"
            step="1"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0"
            className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 dark:border-jungle-700 bg-gray-50 dark:bg-jungle-800 text-gray-900 dark:text-gray-100 font-display text-lg focus:outline-none focus:ring-2 ring-jungle-500"
            required
          />
        </div>
      </div>

      {/* Category chips */}
      <div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Category</p>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Category">
          {CATEGORIES.map(cat => {
            const paused = settings.pausedCategories?.includes(cat)
            return (
              <button
                key={cat}
                type="button"
                role="radio"
                aria-checked={category === cat}
                onClick={() => { setCategory(cat); setOverridePaused(false) }}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                  'focus-visible:ring-2 ring-jungle-500',
                  category === cat
                    ? 'bg-jungle-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-jungle-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-jungle-700',
                  paused && 'opacity-60'
                )}
              >
                <span>{CATEGORY_EMOJIS[cat]}</span>
                <span>{cat}</span>
                {paused && <span className="text-xs">(paused)</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Paused warning */}
      {isPaused && (
        <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-xl p-3">
          <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
            This category is paused for the month.
          </p>
          {overridePaused && (
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">Tap "Log it anyway" to confirm.</p>
          )}
        </div>
      )}

      {/* Note */}
      <div>
        <label htmlFor="note" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
          Note (optional)
        </label>
        <input
          id="note"
          type="text"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="What was this for?"
          maxLength={100}
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-jungle-700 bg-gray-50 dark:bg-jungle-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 ring-jungle-500"
        />
      </div>

      {/* Date */}
      <div>
        <label htmlFor="date" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
          Date
        </label>
        <input
          id="date"
          type="date"
          value={date}
          max={maxDate}
          onChange={e => setDate(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-jungle-700 bg-gray-50 dark:bg-jungle-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 ring-jungle-500"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-jungle-600 hover:bg-jungle-700 text-white font-semibold font-body transition-colors disabled:opacity-60 focus-visible:ring-2 ring-jungle-500 ring-offset-2"
        >
          <PlusCircle size={18} />
          {isPaused && overridePaused ? 'Log it anyway' : 'Log expense'}
        </button>
        <button
          type="button"
          onClick={handleNoSpend}
          disabled={submitting}
          title="Log a no-spend day"
          className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-banana-100 dark:bg-banana-900/30 hover:bg-banana-200 dark:hover:bg-banana-800/40 text-banana-700 dark:text-banana-300 font-semibold font-body transition-colors disabled:opacity-60 focus-visible:ring-2 ring-banana-500 ring-offset-2"
        >
          <Minus size={16} />
          <span className="text-sm">No spend</span>
        </button>
      </div>
    </form>
  )
}
