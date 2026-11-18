import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer, Cell,
} from 'recharts'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { formatCurrency, formatCompact } from '../../lib/currency'
import { getCategoryComparison } from '../../lib/gamification'
import type { Expense } from '../../types'

interface MonthSummary {
  label: string
  total: number
  expenses: Expense[]
}

interface Props {
  monthlySummaries: MonthSummary[]
  monthlyLimit: number
  currency?: string
  currentMonthExpenses: Expense[]
  lastMonthExpenses: Expense[]
}

function BarTooltip({ active, payload, currency }: { active?: boolean; payload?: Array<{ value: number; payload: MonthSummary }>; currency: string }) {
  if (!active || !payload?.length) return null
  const { value, payload: p } = payload[0]
  return (
    <div className="bg-white dark:bg-jungle-800 border border-gray-100 dark:border-jungle-700 rounded-xl shadow-lg p-3 text-sm font-body">
      <p className="font-semibold text-gray-800 dark:text-gray-100">{p.label}</p>
      <p className="text-gray-600 dark:text-gray-300">{formatCurrency(value, currency)}</p>
    </div>
  )
}

export function MonthlyComparison({ monthlySummaries, monthlyLimit, currency = 'INR', currentMonthExpenses, lastMonthExpenses }: Props) {
  const comparison = useMemo(
    () => getCategoryComparison(currentMonthExpenses, lastMonthExpenses),
    [currentMonthExpenses, lastMonthExpenses]
  )

  const barData = monthlySummaries.map(m => ({ ...m, over: m.total > monthlyLimit }))

  return (
    <div className="space-y-4">
      {/* Bar chart */}
      <div className="bg-white dark:bg-jungle-900 rounded-3xl p-5 shadow-sm">
        <h3 className="font-display font-bold text-base text-gray-800 dark:text-gray-100 mb-1">6-month history</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 font-body mb-4">Dashed line = monthly limit</p>

        {monthlySummaries.length === 0 ? (
          <div className="text-center py-8 text-gray-400 dark:text-gray-500 font-body text-sm">Not enough data yet.</div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} barSize={28}>
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => formatCompact(v, currency)} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={48} />
              <Tooltip content={<BarTooltip currency={currency} />} />
              <ReferenceLine y={monthlyLimit} stroke="#f59e0b" strokeDasharray="5 3" strokeWidth={1.5} />
              <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.over ? '#ef4444' : '#2d6a4f'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Category comparison table */}
      <div className="bg-white dark:bg-jungle-900 rounded-3xl p-5 shadow-sm">
        <h3 className="font-display font-bold text-base text-gray-800 dark:text-gray-100 mb-1">This vs last month</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 font-body mb-4">By category</p>

        {comparison.length === 0 ? (
          <div className="text-center py-6 text-gray-400 dark:text-gray-500 font-body text-sm">No data to compare yet.</div>
        ) : (
          <div className="space-y-0">
            <div className="grid grid-cols-4 gap-2 text-xs font-medium text-gray-400 dark:text-gray-500 font-body pb-2 border-b border-gray-100 dark:border-jungle-800">
              <span className="col-span-2">Category</span>
              <span className="text-right">This month</span>
              <span className="text-right">Change</span>
            </div>
            {comparison.map(row => (
              <div key={row.category} className="grid grid-cols-4 gap-2 py-2.5 border-b border-gray-50 dark:border-jungle-800/50 last:border-0 items-center">
                <span className="col-span-2 text-xs font-medium text-gray-700 dark:text-gray-200 font-body truncate">{row.category}</span>
                <span className="text-right text-xs font-semibold font-display tabular-nums text-gray-800 dark:text-gray-100">
                  {row.thisMonth > 0 ? formatCurrency(row.thisMonth, currency) : '—'}
                </span>
                <div className="flex items-center justify-end gap-1">
                  {row.direction === 'up' && <TrendingUp size={12} className="text-red-500 shrink-0" />}
                  {row.direction === 'down' && <TrendingDown size={12} className="text-green-500 shrink-0" />}
                  {row.direction === 'same' && <Minus size={12} className="text-gray-400 shrink-0" />}
                  <span className={`text-xs font-semibold font-display tabular-nums ${
                    row.direction === 'up' ? 'text-red-500' : row.direction === 'down' ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    {row.change === 0 ? '—' : (row.change > 0 ? '+' : '') + formatCurrency(Math.abs(row.change), currency)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
