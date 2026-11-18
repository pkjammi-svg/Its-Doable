import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { formatCurrency } from '../../lib/currency'
import { CATEGORY_COLORS } from '../../types'
import type { CategoryTotal } from '../../lib/gamification'

interface Props {
  data: CategoryTotal[]
  currency?: string
  total: number
}

function CustomTooltip({ active, payload, currency }: { active?: boolean; payload?: Array<{ name: string; value: number }>; currency: string }) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="bg-white dark:bg-jungle-800 border border-gray-100 dark:border-jungle-700 rounded-xl shadow-lg p-3 text-sm font-body">
      <p className="font-semibold text-gray-800 dark:text-gray-100">{item.name}</p>
      <p className="text-gray-600 dark:text-gray-300">{formatCurrency(item.value, currency)}</p>
    </div>
  )
}

export function DonutChart({ data, currency = 'INR', total }: Props) {
  if (data.length === 0 || total === 0) {
    return (
      <div className="bg-white dark:bg-jungle-900 rounded-3xl p-5 shadow-sm">
        <h3 className="font-display font-bold text-base text-gray-800 dark:text-gray-100 mb-4">Spending by category</h3>
        <div className="text-center py-8 text-gray-400 dark:text-gray-500 font-body text-sm">
          No spending logged yet this month.
        </div>
      </div>
    )
  }

  const chartData = data.map(d => ({ name: d.category, value: d.total }))

  return (
    <div className="bg-white dark:bg-jungle-900 rounded-3xl p-5 shadow-sm">
      <h3 className="font-display font-bold text-base text-gray-800 dark:text-gray-100 mb-1">Spending by category</h3>
      <p className="text-xs text-gray-400 dark:text-gray-500 font-body mb-4">This month</p>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            strokeWidth={0}
          >
            {chartData.map(entry => (
              <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] ?? '#94a3b8'} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip currency={currency} />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="space-y-1.5 mt-2">
        {data.map(d => (
          <div key={d.category} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: CATEGORY_COLORS[d.category] ?? '#94a3b8' }}
            />
            <span className="text-xs text-gray-600 dark:text-gray-300 font-body flex-1 truncate">{d.category}</span>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 font-display tabular-nums">
              {formatCurrency(d.total, currency)}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500 font-body w-10 text-right">
              {((d.total / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
