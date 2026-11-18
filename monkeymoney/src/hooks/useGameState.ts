import { useEffect, useMemo } from 'react'
import { useAllExpenses, useIncomes, useSettings, useMeta, useLessonProgress } from './useDB'
import {
  getDailyStreak,
  getWeeklyStreak,
  calculateBananas,
  getLevel,
  getEarnedBadges,
  getRedZoneStatus,
  getCategoryTotals,
  getBiggestNonEssentialCategory,
  getDaysLeft,
  getPauseEstimate,
  getDaysInMonth,
} from '../lib/gamification'
import { updateMeta } from '../db/db'
import { NON_ESSENTIAL_CATEGORIES } from '../types'

export function useGameState() {
  const allExpenses = useAllExpenses()
  const incomes = useIncomes()
  const settings = useSettings()
  const meta = useMeta()
  const lessonProgress = useLessonProgress()

  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`

  const totalIncome = useMemo(() => incomes.reduce((s, i) => s + i.amount, 0), [incomes])
  const monthlyLimit = settings.monthlyLimitOverride ?? totalIncome

  const thisMonthExpenses = useMemo(
    () => allExpenses.filter(e => e.date.startsWith(monthStr)),
    [allExpenses, monthStr]
  )

  const totalSpent = useMemo(
    () => thisMonthExpenses.reduce((s, e) => s + e.amount, 0),
    [thisMonthExpenses]
  )

  const percentUsed = monthlyLimit > 0 ? (totalSpent / monthlyLimit) * 100 : 0

  const dailyStreak = useMemo(
    () => getDailyStreak(allExpenses, monthlyLimit, today, settings.dailyCap),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allExpenses, monthlyLimit, settings.dailyCap]
  )

  const weeklyStreak = useMemo(
    () => getWeeklyStreak(allExpenses, monthlyLimit, today),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allExpenses, monthlyLimit]
  )

  const completedLessons = useMemo(
    () => lessonProgress.filter(l => l.completed).length,
    [lessonProgress]
  )

  const hasNoSpendDay = useMemo(
    () => allExpenses.some(e => e.isNoSpend),
    [allExpenses]
  )

  const bananas = useMemo(
    () => calculateBananas(meta.bestDailyStreak, meta.bestWeeklyStreak, completedLessons),
    [meta.bestDailyStreak, meta.bestWeeklyStreak, completedLessons]
  )

  const level = useMemo(() => getLevel(bananas), [bananas])

  const earnedBadges = useMemo(
    () => getEarnedBadges({ totalExpenses: allExpenses.length, dailyStreak, weeklyStreak, hasNoSpendDay, completedLessons }),
    [allExpenses.length, dailyStreak, weeklyStreak, hasNoSpendDay, completedLessons]
  )

  const redZoneStatus = useMemo(
    () => getRedZoneStatus(totalSpent, monthlyLimit),
    [totalSpent, monthlyLimit]
  )

  const categoryTotals = useMemo(
    () => getCategoryTotals(thisMonthExpenses),
    [thisMonthExpenses]
  )

  const daysLeft = getDaysLeft(year, month, today)
  const daysInMonth = getDaysInMonth(year, month)
  const remaining = Math.max(0, monthlyLimit - totalSpent)
  const dailyCapAmount = daysLeft > 0 ? remaining / daysLeft : 0

  const biggestNonEssential = useMemo(
    () => getBiggestNonEssentialCategory(thisMonthExpenses, NON_ESSENTIAL_CATEGORIES),
    [thisMonthExpenses]
  )

  const pauseEstimate = useMemo(() => {
    if (!biggestNonEssential) return 0
    return getPauseEstimate(thisMonthExpenses, biggestNonEssential, year, month, today)
  }, [thisMonthExpenses, biggestNonEssential, year, month]) // eslint-disable-line react-hooks/exhaustive-deps

  // Persist best streaks
  useEffect(() => {
    if (dailyStreak > meta.bestDailyStreak || weeklyStreak > meta.bestWeeklyStreak) {
      updateMeta({
        bestDailyStreak: Math.max(dailyStreak, meta.bestDailyStreak),
        bestWeeklyStreak: Math.max(weeklyStreak, meta.bestWeeklyStreak),
      })
    }
  }, [dailyStreak, weeklyStreak, meta.bestDailyStreak, meta.bestWeeklyStreak])

  // Persist new badges
  useEffect(() => {
    const newBadges = earnedBadges.filter(b => !meta.earnedBadges.includes(b))
    if (newBadges.length > 0) {
      updateMeta({ earnedBadges: [...meta.earnedBadges, ...newBadges] })
    }
  }, [earnedBadges, meta.earnedBadges])

  const pacePercent = monthlyLimit > 0
    ? ((today.getDate() / daysInMonth) * monthlyLimit / monthlyLimit) * 100
    : 0

  return {
    today,
    year,
    month,
    totalIncome,
    monthlyLimit,
    totalSpent,
    remaining,
    percentUsed,
    pacePercent,
    dailyStreak,
    weeklyStreak,
    bananas,
    level,
    earnedBadges: meta.earnedBadges,
    newBadges: earnedBadges.filter(b => !meta.earnedBadges.includes(b)),
    redZoneStatus,
    categoryTotals,
    daysLeft,
    daysInMonth,
    dailyCapAmount,
    biggestNonEssential,
    pauseEstimate,
    hasNoSpendDay,
    completedLessons,
    settings,
    meta,
    thisMonthExpenses,
  }
}
