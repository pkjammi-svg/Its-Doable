import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'

export function useExpenses(year: number, month: number) {
  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`
  return useLiveQuery(
    () => db.expenses.where('date').startsWith(monthStr).toArray().then(a => a.sort((x, y) => y.date.localeCompare(x.date))),
    [monthStr]
  ) ?? []
}

export function useAllExpenses() {
  return useLiveQuery(() => db.expenses.toArray()) ?? []
}

export function useRecentExpenses(limit = 30) {
  return useLiveQuery(
    () => db.expenses.orderBy('date').reverse().limit(limit).toArray()
  ) ?? []
}

export function useIncomes() {
  return useLiveQuery(() => db.incomes.toArray()) ?? []
}

export function useSettings() {
  return useLiveQuery(() => db.settings.get(1)) ?? {
    id: 1,
    currency: 'INR',
    monthlyLimitOverride: undefined,
    dailyCap: undefined,
    pausedCategories: [] as string[],
  }
}

export function useMeta() {
  return useLiveQuery(() => db.meta.get(1)) ?? {
    id: 1,
    earnedBadges: [] as string[],
    bestDailyStreak: 0,
    bestWeeklyStreak: 0,
  }
}

export function useLessonProgress() {
  return useLiveQuery(() => db.lessonProgress.toArray()) ?? []
}

export function useMonthExpenses(year: number, month: number) {
  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`
  return useLiveQuery(
    () => db.expenses.where('date').startsWith(monthStr).toArray(),
    [monthStr]
  ) ?? []
}

export function useLast6MonthsExpenses() {
  return useLiveQuery(() => {
    const cutoff = new Date()
    cutoff.setMonth(cutoff.getMonth() - 6)
    const cutoffStr = cutoff.toISOString().slice(0, 7) // YYYY-MM
    return db.expenses.where('date').aboveOrEqual(cutoffStr + '-01').toArray()
  }) ?? []
}
