import { useState } from 'react'
import { AlertTriangle, X, Pause, Gauge, Undo2 } from 'lucide-react'
import { updateSettings } from '../../db/db'
import { formatCurrency } from '../../lib/currency'
import type { RedZoneStatus } from '../../types'

interface Props {
  status: RedZoneStatus
  percentUsed: number
  biggestNonEssential: string | null
  pauseEstimate: number
  remaining: number
  daysLeft: number
  dailyCapAmount: number
  currency?: string
  settings: { pausedCategories: string[]; dailyCap?: { enabled: boolean; amount: number; enabledFrom: string } }
}

export function RedZoneAlert({
  status,
  percentUsed,
  biggestNonEssential,
  pauseEstimate,
  remaining,
  daysLeft,
  dailyCapAmount,
  currency = 'INR',
  settings,
}: Props) {
  const [dismissed, setDismissed] = useState(false)

  if (!status || dismissed) return null

  const isPaused = biggestNonEssential && settings.pausedCategories?.includes(biggestNonEssential)
  const isCapOn = settings.dailyCap?.enabled
  const noRemaining = remaining <= 0

  async function pauseCategory() {
    if (!biggestNonEssential) return
    const current = settings.pausedCategories ?? []
    if (!current.includes(biggestNonEssential)) {
      await updateSettings({ pausedCategories: [...current, biggestNonEssential] })
    }
  }

  async function unpauseCategory() {
    if (!biggestNonEssential) return
    await updateSettings({ pausedCategories: settings.pausedCategories.filter(c => c !== biggestNonEssential) })
  }

  async function enableCap() {
    const today = new Date()
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    await updateSettings({ dailyCap: { enabled: true, amount: dailyCapAmount, enabledFrom: dateStr } })
  }

  async function goNoSpend() {
    const today = new Date()
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    await updateSettings({ dailyCap: { enabled: true, amount: 0, enabledFrom: dateStr } })
  }

  async function disableCap() {
    await updateSettings({ dailyCap: undefined })
  }

  return (
    <div
      role="alert"
      className={`rounded-3xl p-5 shadow-sm ${
        status === 'red'
          ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
      }`}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          size={20}
          className={`shrink-0 mt-0.5 ${status === 'red' ? 'text-red-500' : 'text-amber-500'}`}
        />
        <div className="flex-1 min-w-0">
          <p className={`font-display font-bold text-sm ${status === 'red' ? 'text-red-800 dark:text-red-200' : 'text-amber-800 dark:text-amber-200'}`}>
            {status === 'red' ? `${percentUsed.toFixed(0)}% of budget used` : 'Approaching your limit'}
          </p>
          <p className={`text-xs mt-0.5 font-body ${status === 'red' ? 'text-red-700 dark:text-red-300' : 'text-amber-700 dark:text-amber-300'}`}>
            {noRemaining
              ? 'You\'ve used your full budget for the month.'
              : `${formatCurrency(remaining, currency)} remaining for ${daysLeft} days`}
          </p>

          {/* Options */}
          <div className="mt-3 space-y-2">
            {/* Option A: Pause category */}
            {biggestNonEssential && (
              <div>
                {isPaused ? (
                  <button
                    onClick={unpauseCategory}
                    className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-sm font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors focus-visible:ring-2 ring-green-500"
                  >
                    <Undo2 size={15} />
                    <span>Unpause {biggestNonEssential}</span>
                  </button>
                ) : (
                  <button
                    onClick={pauseCategory}
                    className={`flex flex-col items-start w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors focus-visible:ring-2 ${
                      status === 'red'
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-900/50 ring-red-500'
                        : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-900/50 ring-amber-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Pause size={15} />
                      <span>Pause {biggestNonEssential} for the month</span>
                    </div>
                    <span className="text-xs opacity-75 mt-0.5 pl-6">
                      Estimated saving: {formatCurrency(pauseEstimate, currency)}
                    </span>
                  </button>
                )}
              </div>
            )}

            {/* Option B: Daily cap or go no-spend */}
            <div>
              {isCapOn ? (
                <button
                  onClick={disableCap}
                  className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-sm font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors focus-visible:ring-2 ring-green-500"
                >
                  <Undo2 size={15} />
                  <span>Remove daily cap</span>
                </button>
              ) : noRemaining ? (
                <button
                  onClick={goNoSpend}
                  className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors focus-visible:ring-2 ${
                    status === 'red'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-900/50 ring-red-500'
                      : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-900/50 ring-amber-500'
                  }`}
                >
                  <Gauge size={15} />
                  <span>Go no-spend for the rest of the month</span>
                </button>
              ) : (
                <button
                  onClick={enableCap}
                  className={`flex flex-col items-start w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors focus-visible:ring-2 ${
                    status === 'red'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-900/50 ring-red-500'
                      : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-900/50 ring-amber-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Gauge size={15} />
                    <span>Set daily cap: {formatCurrency(dailyCapAmount, currency)}/day</span>
                  </div>
                  <span className="text-xs opacity-75 mt-0.5 pl-6">
                    {formatCurrency(remaining, currency)} ÷ {daysLeft} days remaining
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 focus-visible:ring-2 ring-jungle-500"
          aria-label="Dismiss alert"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
