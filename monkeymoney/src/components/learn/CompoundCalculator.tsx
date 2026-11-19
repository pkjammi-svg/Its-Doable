import { useState, useMemo } from 'react'
import { formatCurrency } from '../../lib/currency'

function calcFV(monthly: number, years: number, annualRate: number): number {
  const r = annualRate / 100 / 12
  const n = years * 12
  if (r === 0) return monthly * n
  return monthly * ((Math.pow(1 + r, n) - 1) / r)
}

export function CompoundCalculator() {
  const [monthly, setMonthly] = useState(5000)
  const [years, setYears] = useState(10)

  const rates = [4, 8, 12]
  const invested = monthly * years * 12

  const results = useMemo(
    () => rates.map(r => ({ rate: r, fv: calcFV(monthly, years, r), growth: calcFV(monthly, years, r) - invested })),
    [monthly, years, invested] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl p-5 shadow-sm border border-emerald-100 dark:border-emerald-800/40 space-y-4">
      <div>
        <h3 className="font-display font-bold text-base text-gray-800 dark:text-gray-100 mb-1">Compound growth calculator</h3>
        <p className="text-xs text-amber-700 dark:text-amber-400 font-body bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl px-3 py-2 leading-relaxed">
          Example only. Real returns go up and down and are never promised.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 font-body mb-1.5" htmlFor="monthly-amt">
            Monthly amount (₹)
          </label>
          <input
            id="monthly-amt"
            type="number"
            value={monthly}
            onChange={e => setMonthly(Math.max(1, parseInt(e.target.value) || 0))}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-jungle-700 bg-white dark:bg-jungle-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ring-jungle-500"
            min="1"
            step="500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 font-body mb-1.5" htmlFor="years-input">
            Years
          </label>
          <input
            id="years-input"
            type="number"
            value={years}
            onChange={e => setYears(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-jungle-700 bg-white dark:bg-jungle-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ring-jungle-500"
            min="1"
            max="50"
          />
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-600 dark:text-gray-400 font-body mb-2">
          Total invested: <span className="font-semibold text-gray-700 dark:text-gray-200">{formatCurrency(invested)}</span>
        </p>
        <div className="space-y-2">
          {results.map(r => (
            <div key={r.rate} className="bg-white dark:bg-jungle-800 rounded-xl p-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 font-body">At {r.rate}% per year</p>
                  <p className="font-display font-bold text-lg text-gray-800 dark:text-gray-100 tabular-nums mt-0.5">
                    {formatCurrency(Math.round(r.fv))}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-green-600 dark:text-green-400 font-body">growth</p>
                  <p className="font-display font-semibold text-sm text-green-600 dark:text-green-400 tabular-nums">
                    +{formatCurrency(Math.round(r.growth))}
                  </p>
                </div>
              </div>
              <div className="mt-2 bg-gray-200 dark:bg-jungle-700 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${Math.min((r.fv / (results[2].fv || 1)) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
