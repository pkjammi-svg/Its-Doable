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
        <div className="bg-gradient-to-br from-jungle-600 to-teal-500 rounded-2xl p-3 text-center shadow-md">
          <p className="text-2xl font-display font-extrabold text-white tabular-nums">{gs.dailyStreak}</p>
          <p className="text-[10px] font-body text-white/80 mt-0.5">day streak 🔥</p>
        </div>
        <div className="bg-gradient-to-br from-banana-500 to-yellow-400 rounded-2xl p-3 text-center shadow-md">
          <p className="text-2xl font-display font-extrabold text-jungle-900 tabular-nums">{gs.bananas}</p>
          <p className="text-[10px] font-body text-jungle-800/80 mt-0.5">🍌 bananas</p>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-violet-500 rounded-2xl p-3 text-center shadow-md">
          <p className="text-xl font-display font-extrabold text-white leading-tight mt-0.5">{gs.level.emoji}</p>
          <p className="text-[10px] font-body text-white/80 mt-0.5 truncate">{gs.level.name}</p>
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
