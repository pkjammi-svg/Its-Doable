import { useState, useMemo } from 'react'
import { formatCurrency } from '../../lib/currency'

function calcMonthsLast(corpus: number, monthlyWithdraw: number, annualRate: number): number {
  if (monthlyWithdraw <= 0) return 0
  const r = annualRate / 100 / 12
  if (r === 0) return Math.floor(corpus / monthlyWithdraw)
  if (monthlyWithdraw <= corpus * r) return Infinity
  return Math.ceil(Math.log(monthlyWithdraw / (monthlyWithdraw - corpus * r)) / Math.log(1 + r))
}

function corpusOverTime(
  corpus: number,
  monthlyWithdraw: number,
  annualRate: number,
  months: number
): number[] {
  const r = annualRate / 100 / 12
  const pts: number[] = [corpus]
  let bal = corpus
  for (let m = 1; m <= months; m++) {
    bal = bal * (1 + r) - monthlyWithdraw
    if (bal < 0) { pts.push(0); break }
    pts.push(bal)
  }
  return pts
}

export function SWPCalculator() {
  const [corpus, setCorpus] = useState(1000000)
  const [withdrawal, setWithdrawal] = useState(10000)
  const [rate, setRate] = useState(8)

  const monthsLast = useMemo(
    () => calcMonthsLast(corpus, withdrawal, rate),
    [corpus, withdrawal, rate]
  )

  const isForever = monthsLast === Infinity
  const displayMonths = isForever ? 600 : Math.min(monthsLast, 600)
  const totalWithdrawn = isForever ? null : withdrawal * monthsLast

  const points = useMemo(
    () => corpusOverTime(corpus, withdrawal, rate, displayMonths),
    [corpus, withdrawal, rate, displayMonths]
  )

  const maxVal = corpus
  const toY = (v: number) => 5 + (1 - v / maxVal) * 90

  const chartPath = points
    .map((v, i) => {
      const x = (i / Math.max(points.length - 1, 1)) * 100
      return `${i === 0 ? 'M' : 'L'} ${x} ${toY(v)}`
    })
    .join(' ')

  const yearsLabel = isForever
    ? 'corpus lasts indefinitely ✓'
    : monthsLast >= 1200
    ? `${(monthsLast / 12).toFixed(0)}+ years`
    : `${Math.floor(monthsLast / 12)}y ${monthsLast % 12}m`

  return (
    <div className="bg-white dark:bg-jungle-800 rounded-3xl p-5 shadow-md space-y-4">
      <div>
        <h3 className="font-display font-bold text-base text-gray-800 dark:text-gray-100 mb-1">
          SWP Calculator
        </h3>
        <p className="text-xs text-amber-700 dark:text-amber-400 font-body bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl px-3 py-2 leading-relaxed">
          Learning only. Not financial advice. Talk to a registered financial adviser or a trusted adult for decisions about your own money.
        </p>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 font-body mb-1.5">
            Starting corpus (₹)
          </label>
          <input
            type="number"
            value={corpus}
            onChange={e => setCorpus(Math.max(1000, parseInt(e.target.value) || 0))}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-jungle-700 bg-white dark:bg-jungle-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ring-violet-500"
            min="1000" step="10000"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 font-body mb-1.5">
              Monthly withdrawal (₹)
            </label>
            <input
              type="number"
              value={withdrawal}
              onChange={e => setWithdrawal(Math.max(100, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-jungle-700 bg-white dark:bg-jungle-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ring-violet-500"
              min="100" step="500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 font-body mb-1.5">
              Return rate (% p.a.)
            </label>
            <input
              type="number"
              value={rate}
              onChange={e => setRate(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-jungle-700 bg-white dark:bg-jungle-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ring-violet-500"
              min="0" max="30" step="0.5"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white dark:bg-jungle-800 rounded-2xl p-4 space-y-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 font-body uppercase tracking-wide">Corpus</p>
            <p className="font-display font-bold text-sm text-gray-800 dark:text-gray-100 tabular-nums mt-0.5">
              {formatCurrency(corpus)}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 font-body uppercase tracking-wide">Lasts</p>
            <p className={`font-display font-bold text-sm tabular-nums mt-0.5 ${isForever ? 'text-green-600 dark:text-green-400' : 'text-violet-700 dark:text-violet-300'}`}>
              {yearsLabel}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 font-body uppercase tracking-wide">Total out</p>
            <p className="font-display font-bold text-sm text-gray-800 dark:text-gray-100 tabular-nums mt-0.5">
              {totalWithdrawn != null ? formatCurrency(Math.round(totalWithdrawn)) : '∞'}
            </p>
          </div>
        </div>

        {/* Sustainability note */}
        {isForever ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl px-3 py-2">
            <p className="text-xs text-green-700 dark:text-green-400 font-body">
              At this rate, monthly returns ({formatCurrency(Math.round(corpus * rate / 100 / 12))}) cover your withdrawal — the corpus grows or stays stable indefinitely.
            </p>
          </div>
        ) : (
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-xl px-3 py-2">
            <p className="text-xs text-orange-700 dark:text-orange-400 font-body">
              Tip: reduce monthly withdrawal to ≤{formatCurrency(Math.round(corpus * rate / 100 / 12))} and the corpus never runs out.
            </p>
          </div>
        )}

        {/* Corpus depletion chart */}
        <div>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-body mb-1">Corpus over time</p>
          <svg viewBox="0 0 100 100" className="w-full" preserveAspectRatio="none" style={{ height: 90 }}>
            <defs>
              <linearGradient id="swpGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <path
              d={chartPath + ` L 100 95 L 0 95 Z`}
              fill="url(#swpGrad)"
            />
            <path d={chartPath} fill="none" stroke="#8b5cf6" strokeWidth="1.2" />
            <line x1="0" y1="95" x2="100" y2="95" stroke="#e5e7eb" strokeWidth="0.4" />
          </svg>
          <div className="flex justify-between mt-0.5">
            <span className="text-[10px] text-gray-400 font-body">now</span>
            {!isForever && (
              <span className="text-[10px] text-gray-400 font-body">{yearsLabel}</span>
            )}
          </div>
        </div>
      </div>

      <p className="text-[10px] text-gray-400 dark:text-gray-500 font-body">
        Returns shown are illustrative only and assume a constant rate — actual returns vary. Past performance does not guarantee future results.
      </p>
    </div>
  )
}
