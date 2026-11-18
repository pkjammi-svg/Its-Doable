import { useMemo } from 'react'
import { clsx } from 'clsx'
import { formatCurrency } from '../../lib/currency'

interface Props {
  spent: number
  limit: number
  pacePercent: number
  currency?: string
  daysLeft: number
}

function MonkeyOnMeter({ pct }: { pct: number }) {
  return (
    <svg viewBox="0 0 36 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-10 drop-shadow-sm">
      {/* Tail */}
      <path d="M18 36 Q28 38 30 32 Q32 26 26 24" stroke="#8B6914" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Body */}
      <ellipse cx="18" cy="30" rx="8" ry="7" fill={pct >= 85 ? '#ef4444' : pct >= 70 ? '#f59e0b' : '#2d6a4f'}/>
      {/* Ears */}
      <circle cx="8" cy="20" r="5" fill="#8B6914"/>
      <circle cx="8" cy="20" r="3" fill="#D4956A"/>
      <circle cx="28" cy="20" r="5" fill="#8B6914"/>
      <circle cx="28" cy="20" r="3" fill="#D4956A"/>
      {/* Head */}
      <circle cx="18" cy="18" r="11" fill="#8B6914"/>
      {/* Face */}
      <ellipse cx="18" cy="22" rx="7" ry="5.5" fill="#D4956A"/>
      {/* Eyes */}
      <circle cx="13.5" cy="15.5" r="2.5" fill="white"/>
      <circle cx="22.5" cy="15.5" r="2.5" fill="white"/>
      <circle cx="14" cy="16" r="1.3" fill="#1a0a00"/>
      <circle cx="23" cy="16" r="1.3" fill="#1a0a00"/>
      <circle cx="14.5" cy="15.5" r="0.5" fill="white"/>
      <circle cx="23.5" cy="15.5" r="0.5" fill="white"/>
      {/* Nose */}
      <ellipse cx="18" cy="21" rx="2" ry="1.4" fill="#5C3D1A"/>
      {/* Mouth */}
      <path d="M 14.5 24.5 Q 18 27 21.5 24.5" stroke="#5C3D1A" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

export function SpendingMeter({ spent, limit, pacePercent, currency = 'INR', daysLeft }: Props) {
  const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0
  const remaining = Math.max(0, limit - spent)

  const meterColor = useMemo(() => {
    if (pct >= 85) return 'bg-red-500'
    if (pct >= 70) return 'bg-amber-500'
    return 'bg-green-500'
  }, [pct])

  const meterGlow = useMemo(() => {
    if (pct >= 85) return 'shadow-red-500/30'
    if (pct >= 70) return 'shadow-amber-500/30'
    return 'shadow-green-500/30'
  }, [pct])

  // SVG gauge (semicircle)
  const R = 70
  const CX = 100
  const CY = 90
  const startAngle = 200
  const endAngle = -20
  const totalAngle = startAngle - endAngle

  function polar(angle: number) {
    const rad = (angle * Math.PI) / 180
    return { x: CX + R * Math.cos(rad), y: CY - R * Math.sin(rad) }
  }

  function arcPath(from: number, to: number) {
    const s = polar(from)
    const e = polar(to)
    const large = Math.abs(from - to) > 180 ? 1 : 0
    const sweep = from > to ? 0 : 1
    return `M ${s.x} ${s.y} A ${R} ${R} 0 ${large} ${sweep} ${e.x} ${e.y}`
  }

  const fillAngle = startAngle - (pct / 100) * totalAngle
  const paceAngle = startAngle - (pacePercent / 100) * totalAngle
  const monkeyPos = polar(fillAngle)

  return (
    <div className="bg-white dark:bg-jungle-900 rounded-3xl p-5 shadow-sm">
      <div className="relative mx-auto" style={{ maxWidth: 220 }}>
        <svg viewBox="0 0 200 110" className="w-full overflow-visible">
          {/* Track */}
          <path
            d={arcPath(startAngle, endAngle)}
            stroke="currentColor"
            className="text-gray-100 dark:text-jungle-800"
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
          />
          {/* Fill */}
          {pct > 0 && (
            <path
              d={arcPath(startAngle, fillAngle)}
              stroke={pct >= 85 ? '#ef4444' : pct >= 70 ? '#f59e0b' : '#22c55e'}
              strokeWidth="14"
              fill="none"
              strokeLinecap="round"
              className="transition-all duration-700 motion-reduce:transition-none"
            />
          )}
          {/* Pace marker */}
          {pacePercent > 0 && pacePercent < 100 && (
            <g transform={`translate(${polar(paceAngle).x}, ${polar(paceAngle).y})`}>
              <circle r="5" fill="white" stroke="#94a3b8" strokeWidth="1.5"/>
              <circle r="2" fill="#94a3b8"/>
            </g>
          )}
          {/* Monkey at current position */}
          {pct > 0 && (
            <foreignObject
              x={monkeyPos.x - 18}
              y={monkeyPos.y - 22}
              width="36"
              height="40"
              className="overflow-visible animate-monkey-ride motion-reduce:animate-none"
            >
              <MonkeyOnMeter pct={pct} />
            </foreignObject>
          )}
        </svg>

        {/* Center text */}
        <div className="text-center -mt-2">
          <p className="text-3xl font-bold font-display text-jungle-700 dark:text-jungle-200 tabular-nums">
            {formatCurrency(remaining, currency)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-body mt-0.5">left this month</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-jungle-800">
        <div className="text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500 font-body">spent</p>
          <p className="text-sm font-semibold font-display text-gray-700 dark:text-gray-200 tabular-nums">
            {formatCurrency(spent, currency)}
          </p>
        </div>
        <div className="text-center">
          <span
            className={clsx(
              'inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-bold font-display shadow-md',
              meterGlow,
              pct >= 85 ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
              : pct >= 70 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
              : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
            )}
          >
            {pct.toFixed(0)}%
          </span>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-body mt-0.5">used</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500 font-body">days left</p>
          <p className="text-sm font-semibold font-display text-gray-700 dark:text-gray-200">{daysLeft}</p>
        </div>
      </div>

      {/* Pace indicator */}
      <div className="mt-3">
        <div className="relative h-2 bg-gray-100 dark:bg-jungle-800 rounded-full overflow-hidden">
          <div
            className={clsx('h-full rounded-full transition-all duration-700 motion-reduce:transition-none', meterColor)}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 font-body mt-1">
          <span>₹0</span>
          <span className="text-gray-400 dark:text-gray-500">on pace ◆</span>
          <span>{formatCurrency(limit, currency)}</span>
        </div>
      </div>
    </div>
  )
}
