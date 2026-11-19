import { SpendingMeter } from '../components/ui/SpendingMeter'
import { StreakCard } from '../components/gamification/StreakCard'
import { DonutChart } from '../components/budget/DonutChart'
import { RedZoneAlert } from '../components/budget/RedZoneAlert'
import { useGameState } from '../hooks/useGameState'

export function DashboardPage() {
  const gs = useGameState()

  return (
    <div className="space-y-4">
      {/* Hero meter */}
      <SpendingMeter
        spent={gs.totalSpent}
        limit={gs.monthlyLimit}
        pacePercent={gs.pacePercent}
        currency={gs.settings.currency}
        daysLeft={gs.daysLeft}
      />

      {/* Red zone alert */}
      {gs.redZoneStatus && (
        <RedZoneAlert
          status={gs.redZoneStatus}
          percentUsed={gs.percentUsed}
          biggestNonEssential={gs.biggestNonEssential}
          pauseEstimate={gs.pauseEstimate}
          remaining={gs.remaining}
          daysLeft={gs.daysLeft}
          dailyCapAmount={gs.dailyCapAmount}
          currency={gs.settings.currency}
          settings={gs.settings}
        />
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/40 rounded-2xl p-3 text-center">
          <p className="text-2xl font-display font-extrabold text-green-600 dark:text-green-400 tabular-nums">{gs.dailyStreak}</p>
          <p className="text-[10px] font-body text-green-600/70 dark:text-green-400/70 mt-0.5">day streak 🔥</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800/40 rounded-2xl p-3 text-center">
          <p className="text-2xl font-display font-extrabold text-yellow-600 dark:text-yellow-400 tabular-nums">{gs.bananas}</p>
          <p className="text-[10px] font-body text-yellow-600/70 dark:text-yellow-400/70 mt-0.5">🍌 bananas</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/40 rounded-2xl p-3 text-center">
          <p className="text-xl font-display font-extrabold text-purple-600 dark:text-purple-300 leading-tight mt-0.5">{gs.level.emoji}</p>
          <p className="text-[10px] font-body text-purple-600/70 dark:text-purple-400/70 mt-0.5 truncate">{gs.level.name}</p>
        </div>
      </div>

      {/* Daily cap badge */}
      {gs.settings.dailyCap?.enabled && (
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl px-4 py-2.5 flex items-center gap-2">
          <span className="text-sm">🎯</span>
          <p className="text-xs font-medium text-purple-800 dark:text-purple-200 font-body">
            Daily cap active: {gs.settings.currency === 'INR' ? '₹' : gs.settings.currency}{gs.settings.dailyCap.amount.toFixed(0)}/day
          </p>
        </div>
      )}

      {/* Streaks */}
      <StreakCard
        dailyStreak={gs.dailyStreak}
        weeklyStreak={gs.weeklyStreak}
        bestDailyStreak={gs.meta.bestDailyStreak}
        bestWeeklyStreak={gs.meta.bestWeeklyStreak}
      />

      {/* Donut chart */}
      <DonutChart
        data={gs.categoryTotals}
        currency={gs.settings.currency}
        total={gs.totalSpent}
      />
    </div>
  )
}
