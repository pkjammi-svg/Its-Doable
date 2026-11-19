import { useState } from 'react'
import { Trash2, Pencil, Check, X } from 'lucide-react'
import { clsx } from 'clsx'
import { db, localDateStr } from '../../db/db'
import { formatCurrency } from '../../lib/currency'
import { CATEGORIES } from '../../types'
import type { Expense } from '../../types'

const EMOJI: Record<string, string> = {
  Groceries: '🛒', 'Eating out': '🍜', 'Rent & bills': '🏠', Transport: '🚌',
  Shopping: '🛍️', 'Fun & outings': '🎉', Health: '💊', Education: '📚', Other: '📦',
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  const yesterday = new Date(); yesterday.setDate(today.getDate() - 1)
  if (dateStr === localDateStr(today)) return 'Today'
  if (dateStr === localDateStr(yesterday)) return 'Yesterday'
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function EditRow({ expense, onDone }: { expense: Expense; currency?: string; onDone: () => void }) {
  const [amount, setAmount] = useState(String(expense.amount))
  const [category, setCategory] = useState(expense.category)
  const [note, setNote] = useState(expense.note)

  async function save() {
    const amt = parseFloat(amount)
    if (isNaN(amt) || amt < 0) return
    await db.expenses.update(expense.id!, { amount: amt, category, note })
    onDone()
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-3 space-y-2">
      <div className="flex gap-2">
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="w-28 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-jungle-700 bg-white dark:bg-jungle-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ring-jungle-500"
          aria-label="Amount"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="flex-1 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-jungle-700 bg-white dark:bg-jungle-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ring-jungle-500"
          aria-label="Category"
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <input
        type="text"
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Note"
        className="w-full px-2 py-1.5 rounded-lg border border-gray-200 dark:border-jungle-700 bg-white dark:bg-jungle-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ring-jungle-500"
        aria-label="Note"
      />
      <div className="flex gap-2">
        <button
          onClick={save}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-jungle-600 text-white text-sm font-medium focus-visible:ring-2 ring-jungle-500"
          aria-label="Save changes"
        >
          <Check size={14} /> Save
        </button>
        <button
          onClick={onDone}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-jungle-700 text-gray-700 dark:text-gray-200 text-sm font-medium focus-visible:ring-2 ring-jungle-500"
          aria-label="Cancel editing"
        >
          <X size={14} /> Cancel
        </button>
      </div>
    </div>
  )
}

interface Props {
  expenses: Expense[]
  currency?: string
  limit?: number
}

export function ExpenseList({ expenses, currency = 'INR', limit = 50 }: Props) {
  const [editId, setEditId] = useState<number | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  const shown = expenses.slice(0, limit)

  if (shown.length === 0) {
    return (
      <div className="bg-gray-100 dark:bg-jungle-900 rounded-3xl p-8 text-center shadow-sm border border-gray-200 dark:border-jungle-800">
        <div className="text-4xl mb-2">🐒</div>
        <p className="text-gray-600 dark:text-gray-400 font-body text-sm">No expenses yet. Log your first one!</p>
      </div>
    )
  }

  async function deleteExpense(id: number) {
    await db.expenses.delete(id)
    setConfirmDeleteId(null)
  }

  return (
    <div className="bg-gray-100 dark:bg-jungle-900 rounded-3xl overflow-hidden shadow-sm border border-gray-200 dark:border-jungle-800">
      <div className="divide-y divide-gray-200 dark:divide-jungle-800">
        {shown.map(exp => (
          <div key={exp.id}>
            {editId === exp.id ? (
              <div className="p-3">
                <EditRow expense={exp} onDone={() => setEditId(null)} />
              </div>
            ) : (
              <div className={clsx('flex items-center gap-3 px-4 py-3', exp.isNoSpend && 'opacity-70')}>
                <span className="text-2xl shrink-0 leading-none">{EMOJI[exp.category] ?? '📦'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 font-body truncate">
                      {exp.isNoSpend ? 'No-spend day' : exp.category}
                    </p>
                    {exp.isNoSpend && <span className="text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-full px-1.5 py-0.5">🧘</span>}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-body truncate">
                    {exp.note || formatDate(exp.date)} {exp.note && <span className="text-gray-400 dark:text-gray-500">· {formatDate(exp.date)}</span>}
                  </p>
                </div>
                <p className={clsx(
                  'font-display font-bold text-sm tabular-nums shrink-0',
                  exp.isNoSpend ? 'text-green-600 dark:text-green-400' : 'text-gray-800 dark:text-gray-100'
                )}>
                  {exp.isNoSpend ? '₹0' : formatCurrency(exp.amount, currency)}
                </p>
                {confirmDeleteId === exp.id ? (
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => deleteExpense(exp.id!)}
                      className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/60 focus-visible:ring-2 ring-red-500"
                      aria-label="Confirm delete"
                    ><Check size={14} /></button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="p-1.5 rounded-lg bg-gray-100 dark:bg-jungle-800 text-gray-600 dark:text-gray-400 focus-visible:ring-2 ring-jungle-500"
                      aria-label="Cancel"
                    ><X size={14} /></button>
                  </div>
                ) : (
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => setEditId(exp.id!)}
                      className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-jungle-800 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus-visible:ring-2 ring-jungle-500"
                      aria-label={`Edit expense: ${exp.category}`}
                    ><Pencil size={14} /></button>
                    <button
                      onClick={() => setConfirmDeleteId(exp.id!)}
                      className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 focus-visible:ring-2 ring-red-500"
                      aria-label={`Delete expense: ${exp.category}`}
                    ><Trash2 size={14} /></button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {expenses.length > limit && (
        <p className="text-center text-xs text-gray-600 dark:text-gray-400 py-2 font-body">
          Showing {limit} of {expenses.length} expenses
        </p>
      )}
    </div>
  )
}
