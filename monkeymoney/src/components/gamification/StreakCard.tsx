interface Props {
  dailyStreak: number
  weeklyStreak: number
  bestDailyStreak: number
  bestWeeklyStreak: number
}

export function StreakCard({ dailyStreak, weeklyStreak, bestDailyStreak, bestWeeklyStreak }: Props) {
  return (
    <div className="bg-white dark:bg-jungle-900 rounded-3xl p-5 shadow-sm">
      <h3 className="font-display font-bold text-base text-gray-800 dark:text-gray-100 mb-4">Streaks</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 text-center">
          <div className="text-3xl font-display font-extrabold text-green-600 dark:text-green-400 tabular-nums">
            {dailyStreak}
          </div>
          <div className="text-xs font-medium text-green-700 dark:text-green-300 font-body mt-1">day streak 🔥</div>
          <div className="text-xs text-gray-400 dark:text-gray-500 font-body mt-1">best: {bestDailyStreak}</div>
        </div>
        <div className="bg-banana-50 dark:bg-banana-900/20 rounded-2xl p-4 text-center">
          <div className="text-3xl font-display font-extrabold text-banana-600 dark:text-banana-400 tabular-nums">
            {weeklyStreak}
          </div>
          <div className="text-xs font-medium text-banana-700 dark:text-banana-300 font-body mt-1">week streak 🌱</div>
          <div className="text-xs text-gray-400 dark:text-gray-500 font-body mt-1">best: {bestWeeklyStreak}</div>
        </div>
      </div>
    </div>
  )
}
