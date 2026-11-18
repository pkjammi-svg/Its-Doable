import type { Expense, Level, RedZoneStatus, DailyCap } from '../types'
import { LEVELS } from '../types'

export function localDateStr(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function getDailyLimit(monthlyLimit: number, year: number, month: number): number {
  return monthlyLimit / getDaysInMonth(year, month)
}

export function getEffectiveDailyLimit(
  monthlyLimit: number,
  year: number,
  month: number,
  day: number,
  dailyCap?: DailyCap
): number {
  const normalLimit = getDailyLimit(monthlyLimit, year, month)
  if (!dailyCap?.enabled) return normalLimit
  const capDate = dailyCap.enabledFrom
  const checkDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  return checkDate >= capDate ? dailyCap.amount : normalLimit
}

export function isDayGreen(
  expenses: Expense[],
  dailyLimit: number,
  year: number,
  month: number,
  day: number
): boolean {
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const dayExpenses = expenses.filter(e => e.date === dateStr)
  if (dayExpenses.length === 0) return false
  const total = dayExpenses.reduce((sum, e) => sum + e.amount, 0)
  return total <= dailyLimit
}

export function getDailyStreak(
  expenses: Expense[],
  monthlyLimit: number,
  today: Date,
  dailyCap?: DailyCap
): number {
  let streak = 0
  const todayStr = localDateStr(today)
  const todayExpenses = expenses.filter(e => e.date === todayStr)

  const startDate = new Date(today)
  startDate.setHours(0, 0, 0, 0)
  if (todayExpenses.length === 0) {
    startDate.setDate(startDate.getDate() - 1)
  }

  const cursor = new Date(startDate)
  for (let i = 0; i < 400; i++) {
    const year = cursor.getFullYear()
    const month = cursor.getMonth()
    const day = cursor.getDate()
    const limit = getEffectiveDailyLimit(monthlyLimit, year, month, day, dailyCap)
    if (!isDayGreen(expenses, limit, year, month, day)) break
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

export function getWeeklyStreak(
  expenses: Expense[],
  monthlyLimit: number,
  today: Date
): number {
  let streak = 0

  // Find Monday of current week
  const dow = today.getDay()
  const daysFromMonday = dow === 0 ? 6 : dow - 1
  const currentMonday = new Date(today)
  currentMonday.setDate(currentMonday.getDate() - daysFromMonday)
  currentMonday.setHours(0, 0, 0, 0)

  // Start from last complete week
  const weekStart = new Date(currentMonday)
  weekStart.setDate(weekStart.getDate() - 7)

  for (let w = 0; w < 52; w++) {
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)

    const weekExpenses = expenses.filter(e => e.date >= localDateStr(weekStart) && e.date <= localDateStr(weekEnd))
    if (weekExpenses.length === 0) break

    let weekBudget = 0
    for (let d = 0; d < 7; d++) {
      const day = new Date(weekStart)
      day.setDate(day.getDate() + d)
      weekBudget += getDailyLimit(monthlyLimit, day.getFullYear(), day.getMonth())
    }

    const weekTotal = weekExpenses.reduce((sum, e) => sum + e.amount, 0)
    if (weekTotal > weekBudget) break

    streak++
    weekStart.setDate(weekStart.getDate() - 7)
  }

  return streak
}

export function calculateBananas(greenDays: number, greenWeeks: number, completedLessons: number): number {
  return greenDays * 10 + greenWeeks * 25 + completedLessons * 20
}

export function getLevel(bananas: number): Level {
  let level = LEVELS[0]
  for (const l of LEVELS) {
    if (bananas >= l.minBananas) level = l
    else break
  }
  return level
}

export interface BadgeState {
  totalExpenses: number
  dailyStreak: number
  weeklyStreak: number
  hasNoSpendDay: boolean
  completedLessons: number
}

export function getEarnedBadges(state: BadgeState): string[] {
  const earned: string[] = []
  if (state.totalExpenses >= 1) earned.push('first_log')
  if (state.dailyStreak >= 3) earned.push('streak_3')
  if (state.dailyStreak >= 7) earned.push('streak_7')
  if (state.dailyStreak >= 30) earned.push('streak_30')
  if (state.weeklyStreak >= 4) earned.push('weeks_4')
  if (state.hasNoSpendDay) earned.push('no_spend')
  if (state.completedLessons >= 5) earned.push('lessons_5')
  return earned
}

export function getRedZoneStatus(spent: number, limit: number): RedZoneStatus {
  if (limit <= 0) return null
  const pct = spent / limit
  if (pct >= 0.85) return 'red'
  if (pct >= 0.70) return 'amber'
  return null
}

export function getPauseEstimate(
  expenses: Expense[],
  category: string,
  year: number,
  month: number,
  today: Date
): number {
  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`
  const spent = expenses
    .filter(e => e.category === category && e.date.startsWith(monthStr))
    .reduce((sum, e) => sum + e.amount, 0)
  const dayOfMonth = today.getDate()
  if (dayOfMonth === 0) return 0
  const dailyAvg = spent / dayOfMonth
  const daysLeft = getDaysInMonth(year, month) - dayOfMonth
  return Math.round(dailyAvg * daysLeft)
}

export interface CategoryTotal {
  category: string
  total: number
}

export function getCategoryTotals(expenses: Expense[]): CategoryTotal[] {
  const map: Record<string, number> = {}
  for (const e of expenses) {
    map[e.category] = (map[e.category] ?? 0) + e.amount
  }
  return Object.entries(map)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)
}

export interface CategoryComparison {
  category: string
  thisMonth: number
  lastMonth: number
  change: number
  direction: 'up' | 'down' | 'same'
}

export function getCategoryComparison(
  thisMonthExpenses: Expense[],
  lastMonthExpenses: Expense[]
): CategoryComparison[] {
  const thisMap: Record<string, number> = {}
  const lastMap: Record<string, number> = {}
  for (const e of thisMonthExpenses) thisMap[e.category] = (thisMap[e.category] ?? 0) + e.amount
  for (const e of lastMonthExpenses) lastMap[e.category] = (lastMap[e.category] ?? 0) + e.amount

  const categories = new Set([...Object.keys(thisMap), ...Object.keys(lastMap)])
  return Array.from(categories)
    .map(cat => {
      const t = thisMap[cat] ?? 0
      const l = lastMap[cat] ?? 0
      const change = t - l
      const direction: 'up' | 'down' | 'same' = change > 0 ? 'up' : change < 0 ? 'down' : 'same'
      return { category: cat, thisMonth: t, lastMonth: l, change, direction }
    })
    .sort((a, b) => b.thisMonth - a.thisMonth)
}

export function getDaysLeft(year: number, month: number, today: Date): number {
  return getDaysInMonth(year, month) - today.getDate()
}

export function getBiggestNonEssentialCategory(
  expenses: Expense[],
  nonEssential: string[]
): string | null {
  const totals = getCategoryTotals(expenses.filter(e => nonEssential.includes(e.category)))
  return totals[0]?.category ?? null
}
