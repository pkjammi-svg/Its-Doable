import { useState } from 'react'
import { Plus, Trash2, Check, X, Pencil } from 'lucide-react'
import { db, updateSettings } from '../../db/db'
import { formatCurrency } from '../../lib/currency'
import { CURRENCY_OPTIONS } from '../../types'
import type { Income } from '../../types'

interface Props {
  incomes: Income[]
  totalIncome: number
  settings: { currency: string; monthlyLimitOverride?: number }
  currency: string
}

export function IncomeSources({ incomes, totalIncome, settings, currency }: Props) {
  const [addName, setAddName] = useState('')
  const [addAmount, setAddAmount] = useState('')
  const [editId, setEditId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editAmount, setEditAmount] = useState('')
  const [limitInput, setLimitInput] = useState(String(settings.monthlyLimitOverride ?? ''))
  const [editingLimit, setEditingLimit] = useState(false)

  async function addIncome() {
    const amt = parseFloat(addAmount)
    if (!addName.trim() || isNaN(amt) || amt <= 0) return
    await db.incomes.add({ name: addName.trim(), amount: amt })
    setAddName(''); setAddAmount('')
  }

  async function deleteIncome(id: number) {
    await db.incomes.delete(id)
  }

  function startEdit(income: Income) {
    setEditId(income.id!); setEditName(income.name); setEditAmount(String(income.amount))
  }

  async function saveEdit() {
    if (!editId) return
    const amt = parseFloat(editAmount)
    if (!editName.trim() || isNaN(amt) || amt <= 0) return
    await db.incomes.update(editId, { name: editName.trim(), amount: amt })
    setEditId(null)
  }

  async function saveLimit() {
    const val = parseFloat(limitInput)
    await updateSettings({ monthlyLimitOverride: isNaN(val) || val <= 0 ? undefined : val })
    setEditingLimit(false)
  }

  async function changeCurrency(code: string) {
    await updateSettings({ currency: code })
  }

  return (
    <div className="space-y-4">
      {/* Currency selector */}
      <div className="bg-white dark:bg-jungle-800 rounded-3xl p-5 shadow-md">
        <h3 className="font-display font-bold text-base text-gray-800 dark:text-gray-100 mb-3">Currency</h3>
        <div className="flex flex-wrap gap-2">
          {CURRENCY_OPTIONS.map(opt => (
            <button
              key={opt.code}
              onClick={() => changeCurrency(opt.code)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors focus-visible:ring-2 ring-jungle-500 ${
                currency === opt.code
                  ? 'bg-jungle-600 text-white'
                  : 'bg-gray-100 dark:bg-jungle-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-jungle-700'
              }`}
            >
              {opt.symbol} {opt.name}
            </button>
          ))}
        </div>
      </div>

      {/* Income sources */}
      <div className="bg-white dark:bg-jungle-800 rounded-3xl p-5 shadow-md space-y-3">
        <h3 className="font-display font-bold text-base text-gray-800 dark:text-gray-100">Income sources</h3>

        {incomes.map(inc => (
          <div key={inc.id}>
            {editId === inc.id ? (
              <div className="bg-white dark:bg-jungle-800 rounded-xl p-3 space-y-2">
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-jungle-700 bg-white dark:bg-jungle-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ring-jungle-500"
                  placeholder="Source name"
                  aria-label="Income source name"
                />
                <input
                  type="number"
                  value={editAmount}
                  onChange={e => setEditAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-jungle-700 bg-white dark:bg-jungle-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ring-jungle-500"
                  placeholder="Amount"
                  aria-label="Amount"
                />
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="flex items-center gap-1 px-3 py-1.5 bg-jungle-600 text-white rounded-lg text-sm font-medium focus-visible:ring-2 ring-jungle-500">
                    <Check size={14} /> Save
                  </button>
                  <button onClick={() => setEditId(null)} className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 dark:bg-jungle-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium focus-visible:ring-2 ring-jungle-500">
                    <X size={14} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 font-body truncate">{inc.name}</p>
                </div>
                <p className="font-display font-bold text-sm tabular-nums text-jungle-700 dark:text-jungle-300">
                  {formatCurrency(inc.amount, currency)}
                </p>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(inc)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-jungle-800 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus-visible:ring-2 ring-jungle-500" aria-label="Edit income">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => deleteIncome(inc.id!)} className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 focus-visible:ring-2 ring-red-500" aria-label="Delete income">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add income */}
        <div className="border-t border-gray-100 dark:border-jungle-800 pt-3 space-y-2">
          <input
            value={addName}
            onChange={e => setAddName(e.target.value)}
            placeholder="Source name (e.g. Salary)"
            className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-jungle-700 bg-white dark:bg-jungle-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ring-jungle-500"
            aria-label="New income source name"
          />
          <div className="flex gap-2">
            <input
              type="number"
              value={addAmount}
              onChange={e => setAddAmount(e.target.value)}
              placeholder="Monthly amount"
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-jungle-700 bg-white dark:bg-jungle-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ring-jungle-500"
              aria-label="Monthly amount"
            />
            <button
              onClick={addIncome}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-jungle-600 hover:bg-jungle-700 text-white text-sm font-semibold transition-colors focus-visible:ring-2 ring-jungle-500 ring-offset-2"
            >
              <Plus size={16} /> Add
            </button>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100 dark:border-jungle-800">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 font-body">Total monthly income</span>
            <span className="font-display font-bold text-jungle-700 dark:text-jungle-300 text-base tabular-nums">
              {formatCurrency(totalIncome, currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Spending limit override */}
      <div className="bg-white dark:bg-jungle-800 rounded-3xl p-5 shadow-md">
        <h3 className="font-display font-bold text-base text-gray-800 dark:text-gray-100 mb-1">Monthly spending limit</h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 font-body mb-3">
          Defaults to your total income. Override it here.
        </p>
        {editingLimit ? (
          <div className="flex gap-2">
            <input
              type="number"
              value={limitInput}
              onChange={e => setLimitInput(e.target.value)}
              placeholder={String(totalIncome)}
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-jungle-700 bg-white dark:bg-jungle-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ring-jungle-500"
              aria-label="Monthly spending limit"
            />
            <button onClick={saveLimit} className="flex items-center gap-1 px-3 py-2 bg-jungle-600 text-white rounded-xl text-sm font-medium focus-visible:ring-2 ring-jungle-500">
              <Check size={14} /> Save
            </button>
            <button onClick={() => setEditingLimit(false)} className="flex items-center gap-1 px-3 py-2 bg-gray-200 dark:bg-jungle-700 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-medium focus-visible:ring-2 ring-jungle-500">
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <span className="font-display font-bold text-gray-800 dark:text-gray-100 text-lg tabular-nums">
              {formatCurrency(settings.monthlyLimitOverride ?? totalIncome, currency)}
              {!settings.monthlyLimitOverride && <span className="text-xs font-normal text-gray-600 dark:text-gray-400 ml-1">(auto)</span>}
            </span>
            <button
              onClick={() => { setLimitInput(String(settings.monthlyLimitOverride ?? totalIncome)); setEditingLimit(true) }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-jungle-800 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-jungle-700 transition-colors focus-visible:ring-2 ring-jungle-500"
            >
              <Pencil size={14} /> Edit
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
