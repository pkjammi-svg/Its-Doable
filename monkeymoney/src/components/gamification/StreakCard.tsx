interface Props {
  dailyStreak: number
  weeklyStreak: number
  bestDailyStreak: number
  bestWeeklyStreak: number
}

export function StreakCard({ dailyStreak, weeklyStreak, bestDailyStreak, bestWeeklyStreak }: Props) {
  return (
    <div className="bg-white dark:bg-jungle-800 rounded-3xl overflow-hidden shadow-md">
      <div className="bg-gradient-to-r from-amber-500 to-orange-400 px-5 py-3">
        <h3 className="font-display font-bold text-base text-white">Streaks 🔥</h3>
      </div>
      <div className="p-4 grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-jungle-600 to-emerald-500 rounded-2xl p-4 text-center shadow-sm">
          <div className="text-3xl font-display font-extrabold text-white tabular-nums">
            {dailyStreak}
          </div>
          <div className="text-xs font-medium text-white/80 font-body mt-1">day streak 🔥</div>
          <div className="text-xs text-white/60 font-body mt-1">best: {bestDailyStreak}</div>
        </div>
        <div className="bg-gradient-to-br from-banana-500 to-yellow-400 rounded-2xl p-4 text-center shadow-sm">
          <div className="text-3xl font-display font-extrabold text-jungle-900 tabular-nums">
            {weeklyStreak}
          </div>
          <div className="text-xs font-medium text-jungle-800/80 font-body mt-1">week streak 🌱</div>
          <div className="text-xs text-jungle-700/70 font-body mt-1">best: {bestWeeklyStreak}</div>
        </div>
      </div>
    </div>
  )
}
