import { useState, useMemo } from 'react'
import { formatCurrency } from '../../lib/currency'

const INSTRUMENTS = [
  { id: 'equity',   label: 'Equity',         rate: 12, hint: 'Stocks / equity funds — historically ~10–14% p.a., high risk' },
  { id: 'hybrid',   label: 'Hybrid',          rate: 10, hint: 'Mix of equity + debt — historically ~8–12% p.a., medium risk' },
  { id: 'debt',     label: 'Debt',            rate:  7, hint: 'Bonds / debt funds — typically ~6–9% p.a., lower risk' },
  { id: 'gold',     label: 'Gold',            rate:  8, hint: 'Gold / gold savings — historically ~7–10% p.a.' },
  { id: 'ppf',      label: 'PPF',             rate: 7.1, hint: 'Public Provident Fund — currently 7.1% p.a., govt-backed' },
  { id: 'fd',       label: 'Fixed Deposit',   rate:  6.5, hint: 'Bank FD — typically 6–7.5% p.a., capital protected' },
  { id: 'reits',    label: 'REITs',           rate:  9, hint: 'Real-estate investment trusts — typically 8–11% p.a.' },
]

function sipFV(monthly: number, years: number, annualRate: number): number {
  const r = annualRate / 100 / 12
  const n = years * 12
  if (r === 0) return monthly * n
  return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
}

function growthPoints(monthly: number, years: number, annualRate: number): number[] {
  const pts: number[] = []
  for (let y = 1; y <= years; y++) pts.push(sipFV(monthly, y, annualRate))
  return pts
}

export function SIPCalculator() {
  const [monthly, setMonthly] = useState(5000)
  const [years, setYears] = useState(10)
  const [instrId, setInstrId] = useState('equity')
  const [customRate, setCustomRate] = useState<number | null>(null)

  const instr = INSTRUMENTS.find(i => i.id === instrId)!
  const rate = customRate ?? instr.rate
  const invested = monthly * years * 12
  const corpus = useMemo(() => sipFV(monthly, years, rate), [monthly, years, rate])
  const gain = corpus - invested
  const gainPct = invested > 0 ? (gain / invested) * 100 : 0

  const points = useMemo(() => growthPoints(monthly, years, rate), [monthly, years, rate])
  const investedLine = useMemo(
    () => Array.from({ length: years }, (_, i) => monthly * (i + 1) * 12),
    [monthly, years]
  )
  const maxVal = Math.max(...points, invested)

  const toY = (v: number) => 100 - (v / maxVal) * 95

  const corpusPath = points
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${(i / (years - 1)) * 100} ${toY(v)}`)
    .join(' ')

  const investedPath = investedLine
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${(i / (years - 1)) * 100} ${toY(v)}`)
    .join(' ')

  return (
    <div className="bg-teal-50 dark:bg-teal-900/20 rounded-3xl p-5 shadow-sm border border-teal-100 dark:border-teal-800/40 space-y-4">
      <div>
        <h3 className="font-display font-bold text-base text-gray-800 dark:text-gray-100 mb-1">
          SIP Calculator
        </h3>
        <p className="text-xs text-amber-700 dark:text-amber-400 font-body bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl px-3 py-2 leading-relaxed">
          Learning only. Not financial advice. Talk to a registered financial adviser or a trusted adult for decisions about your own money.
        </p>
      </div>

      {/* Instrument picker */}
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 font-body mb-2">
          Instrument type
        </label>
        <div className="flex flex-wrap gap-2">
          {INSTRUMENTS.map(ins => (
            <button
              key={ins.id}
              onClick={() => { setInstrId(ins.id); setCustomRate(null) }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium font-body border transition-colors ${
                instrId === ins.id
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-white dark:bg-jungle-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-jungle-600 hover:border-teal-400'
              }`}
            >
              {ins.label}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5 font-body">{instr.hint}</p>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 font-body mb-1.5">
            Monthly SIP (₹)
          </label>
          <input
            type="number"
            value={monthly}
            onChange={e => setMonthly(Math.max(100, parseInt(e.target.value) || 0))}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-jungle-700 bg-white dark:bg-jungle-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ring-teal-500"
            min="100" step="500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 font-body mb-1.5">
            Duration (years)
          </label>
          <input
            type="number"
            value={years}
            onChange={e => setYears(Math.max(1, Math.min(40, parseInt(e.target.value) || 1)))}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-jungle-700 bg-white dark:bg-jungle-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ring-teal-500"
            min="1" max="40"
          />
        </div>
      </div>

      {/* Expected return rate */}
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 font-body mb-1.5">
          Expected return (% p.a.) — typical for {instr.label}: {instr.rate}%
        </label>
        <input
          type="number"
          value={customRate ?? instr.rate}
          onChange={e => setCustomRate(parseFloat(e.target.value) || instr.rate)}
          className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-jungle-700 bg-white dark:bg-jungle-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ring-teal-500"
          min="0.1" max="30" step="0.1"
        />
      </div>

      {/* Results */}
      <div className="bg-white dark:bg-jungle-800 rounded-2xl p-4 space-y-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 font-body uppercase tracking-wide">Invested</p>
            <p className="font-display font-bold text-sm text-gray-800 dark:text-gray-100 tabular-nums mt-0.5">
              {formatCurrency(Math.round(invested))}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 font-body uppercase tracking-wide">Est. gains</p>
            <p className="font-display font-bold text-sm text-green-600 dark:text-green-400 tabular-nums mt-0.5">
              +{formatCurrency(Math.round(gain))}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 font-body uppercase tracking-wide">Corpus</p>
            <p className="font-display font-bold text-sm text-teal-700 dark:text-teal-300 tabular-nums mt-0.5">
              {formatCurrency(Math.round(corpus))}
            </p>
          </div>
        </div>

        {/* Stacked bar */}
        <div>
          <div className="flex h-3 rounded-full overflow-hidden bg-gray-100 dark:bg-jungle-700">
            <div
              className="bg-blue-400 h-full transition-all"
              style={{ width: `${Math.min((invested / corpus) * 100, 100)}%` }}
            />
            <div className="bg-green-500 h-full flex-1" />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-blue-500 font-body">■ Invested</span>
            <span className="text-[10px] text-green-500 font-body">■ Growth ({gainPct.toFixed(0)}%)</span>
          </div>
        </div>

        {/* SVG growth chart */}
        {years > 1 && (
          <div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-body mb-1">Corpus growth over time</p>
            <svg viewBox="0 0 100 105" className="w-full" preserveAspectRatio="none" style={{ height: 90 }}>
              <path d={investedPath} fill="none" stroke="#93c5fd" strokeWidth="0.8" strokeDasharray="1.5 1" />
              <path d={corpusPath} fill="none" stroke="#10b981" strokeWidth="1.2" />
              <line x1="0" y1="100" x2="100" y2="100" stroke="#e5e7eb" strokeWidth="0.4" />
              <text x="0" y="104" fill="#9ca3af" fontSize="4" fontFamily="system-ui">0</text>
              <text x="96" y="104" fill="#9ca3af" fontSize="4" fontFamily="system-ui">{years}y</text>
            </svg>
            <div className="flex gap-3 justify-center">
              <span className="text-[10px] text-blue-400 font-body">— invested</span>
              <span className="text-[10px] text-green-500 font-body">— corpus</span>
            </div>
          </div>
        )}
      </div>

      <p className="text-[10px] text-gray-400 dark:text-gray-500 font-body">
        Returns shown are illustrative only and assume a constant rate — actual returns vary. Past performance does not guarantee future results.
      </p>
    </div>
  )
}
