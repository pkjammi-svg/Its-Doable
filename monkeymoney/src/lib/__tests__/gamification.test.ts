import { describe, it, expect } from 'vitest'
import type { Expense } from '../../types'
import {
  getDailyLimit,
  getDaysInMonth,
  isDayGreen,
  getDailyStreak,
  getWeeklyStreak,
  calculateBananas,
  getLevel,
  getEarnedBadges,
  getRedZoneStatus,
  getCategoryComparison,
  getPauseEstimate,
} from '../gamification'

const makeExpense = (id: number, amount: number, date: string, category = 'Groceries', isNoSpend = false): Expense => ({
  id,
  amount,
  category,
  note: '',
  date,
  isNoSpend,
})

describe('getDaysInMonth', () => {
  it('returns 31 for January', () => expect(getDaysInMonth(2024, 0)).toBe(31))
  it('returns 29 for February 2024 (leap year)', () => expect(getDaysInMonth(2024, 1)).toBe(29))
  it('returns 28 for February 2023', () => expect(getDaysInMonth(2023, 1)).toBe(28))
  it('returns 30 for April', () => expect(getDaysInMonth(2024, 3)).toBe(30))
})

describe('getDailyLimit', () => {
  it('divides monthly limit by days in month', () => {
    expect(getDailyLimit(3100, 2024, 0)).toBeCloseTo(100)
    expect(getDailyLimit(3000, 2024, 3)).toBe(100)
  })
  it('handles leap year February', () => {
    expect(getDailyLimit(2900, 2024, 1)).toBeCloseTo(100)
  })
})

describe('isDayGreen', () => {
  it('returns false for empty expenses', () => {
    expect(isDayGreen([], 100, 2024, 0, 15)).toBe(false)
  })
  it('returns true when at least one expense and total <= limit', () => {
    const expenses = [makeExpense(1, 50, '2024-01-15')]
    expect(isDayGreen(expenses, 100, 2024, 0, 15)).toBe(true)
  })
  it('returns true when total exactly equals limit', () => {
    const expenses = [makeExpense(1, 100, '2024-01-15')]
    expect(isDayGreen(expenses, 100, 2024, 0, 15)).toBe(true)
  })
  it('returns false when total exceeds limit', () => {
    const expenses = [makeExpense(1, 101, '2024-01-15')]
    expect(isDayGreen(expenses, 100, 2024, 0, 15)).toBe(false)
  })
  it('returns true for no-spend day (0 amount)', () => {
    const expenses = [makeExpense(1, 0, '2024-01-15', 'Other', true)]
    expect(isDayGreen(expenses, 100, 2024, 0, 15)).toBe(true)
  })
  it('ignores expenses from other days', () => {
    const expenses = [makeExpense(1, 200, '2024-01-16')]
    expect(isDayGreen(expenses, 100, 2024, 0, 15)).toBe(false)
  })
})

describe('getDailyStreak', () => {
  it('returns 0 for empty expenses', () => {
    expect(getDailyStreak([], 3000, new Date('2024-01-15'))).toBe(0)
  })

  it('returns 1 for one green day today', () => {
    const expenses = [makeExpense(1, 50, '2024-01-15')]
    expect(getDailyStreak(expenses, 3100, new Date('2024-01-15'))).toBe(1)
  })

  it('returns 2 for two consecutive green days', () => {
    const expenses = [
      makeExpense(1, 50, '2024-01-14'),
      makeExpense(2, 50, '2024-01-15'),
    ]
    expect(getDailyStreak(expenses, 3100, new Date('2024-01-15'))).toBe(2)
  })

  it('breaks streak at over-limit day', () => {
    const expenses = [
      makeExpense(1, 50, '2024-01-13'),
      makeExpense(2, 500, '2024-01-14'), // over limit
      makeExpense(3, 50, '2024-01-15'),
    ]
    expect(getDailyStreak(expenses, 3100, new Date('2024-01-15'))).toBe(1)
  })

  it('uses yesterday if nothing logged today', () => {
    const expenses = [
      makeExpense(1, 50, '2024-01-14'),
      makeExpense(2, 50, '2024-01-15'),
    ]
    // Nothing on Jan 16; yesterday (Jan 15) is green, so streak = 2
    expect(getDailyStreak(expenses, 3100, new Date('2024-01-16'))).toBe(2)
  })

  it('handles month boundary correctly', () => {
    const expenses = [
      makeExpense(1, 50, '2024-01-31'),
      makeExpense(2, 50, '2024-02-01'),
    ]
    expect(getDailyStreak(expenses, 3000, new Date('2024-02-01'))).toBe(2)
  })

  it('handles deleted expenses (empty array for that day)', () => {
    // After deleting Jan 15 entry, Jan 15 has no entries
    const remaining = [makeExpense(1, 50, '2024-01-14')]
    // On Jan 15 with nothing logged, checks yesterday (Jan 14) → streak = 1
    expect(getDailyStreak(remaining, 3100, new Date('2024-01-15'))).toBe(1)
  })

  it('uses cap amount for days after cap was enabled', () => {
    const dailyCap = { enabled: true, amount: 50, enabledFrom: '2024-01-15' }
    const expenses = [
      makeExpense(1, 80, '2024-01-14'), // 80 < normal limit ~100 → green
      makeExpense(2, 45, '2024-01-15'), // 45 < cap 50 → green
      makeExpense(3, 60, '2024-01-16'), // 60 > cap 50 → NOT green
    ]
    expect(getDailyStreak(expenses, 3100, new Date('2024-01-16'), dailyCap)).toBe(0)
    expect(getDailyStreak(expenses.slice(0, 2), 3100, new Date('2024-01-15'), dailyCap)).toBe(2)
  })

  it('no-spend day (₹0 entry) keeps streak alive', () => {
    const expenses = [
      makeExpense(1, 50, '2024-01-14'),
      makeExpense(2, 0, '2024-01-15', 'Other', true), // no-spend
    ]
    expect(getDailyStreak(expenses, 3100, new Date('2024-01-15'))).toBe(2)
  })
})

describe('getWeeklyStreak', () => {
  it('returns 0 for empty data', () => {
    expect(getWeeklyStreak([], 30000, new Date('2024-01-15'))).toBe(0)
  })

  it('counts a complete green week', () => {
    // Week of Jan 1–7 2024 (Mon–Sun)
    const expenses = []
    for (let d = 1; d <= 7; d++) {
      expenses.push(makeExpense(d, 80, `2024-01-0${d}`))
    }
    // On Jan 8 (next Monday), last week should be counted
    expect(getWeeklyStreak(expenses, 3100, new Date('2024-01-08'))).toBe(1)
  })

  it('handles week spanning two months', () => {
    // Jan 29 (Mon) – Feb 4 (Sun) 2024
    const expenses: Expense[] = []
    for (let d = 29; d <= 31; d++) {
      expenses.push(makeExpense(d, 90, `2024-01-${d}`))
    }
    for (let d = 1; d <= 4; d++) {
      expenses.push(makeExpense(d + 100, 90, `2024-02-0${d}`))
    }
    // On Feb 5, the cross-month week should be counted
    expect(getWeeklyStreak(expenses, 3100, new Date('2024-02-05'))).toBeGreaterThanOrEqual(1)
  })

  it('breaks when a week has no entries', () => {
    const week1 = [1, 2, 3, 4, 5, 6, 7].map(d => makeExpense(d, 80, `2024-01-0${d}`))
    // Skip week 2 (Jan 8–14) entirely
    const week3 = [15, 16, 17, 18, 19, 20, 21].map(d => makeExpense(d + 20, 80, `2024-01-${d}`))
    expect(getWeeklyStreak([...week1, ...week3], 3100, new Date('2024-01-22'))).toBe(1)
  })
})

describe('calculateBananas', () => {
  it('gives correct points', () => {
    expect(calculateBananas(10, 2, 3)).toBe(10 * 10 + 2 * 25 + 3 * 20) // 210
  })
  it('returns 0 for all zeros', () => {
    expect(calculateBananas(0, 0, 0)).toBe(0)
  })
})

describe('getLevel', () => {
  it('returns Baby Monkey for 0 bananas', () => expect(getLevel(0).name).toBe('Baby Monkey'))
  it('returns Branch Hopper at 150', () => expect(getLevel(150).name).toBe('Branch Hopper'))
  it('returns Branch Hopper at 149', () => expect(getLevel(149).name).toBe('Baby Monkey'))
  it('returns Vine Swinger at 300', () => expect(getLevel(300).name).toBe('Vine Swinger'))
  it('returns Silverback Saver at 750+', () => {
    expect(getLevel(750).name).toBe('Silverback Saver')
    expect(getLevel(9999).name).toBe('Silverback Saver')
  })
})

describe('getEarnedBadges', () => {
  it('awards first_log on first expense', () => {
    const state = { totalExpenses: 1, dailyStreak: 1, weeklyStreak: 0, hasNoSpendDay: false, completedLessons: 0 }
    expect(getEarnedBadges(state)).toContain('first_log')
  })
  it('does not award first_log with 0 expenses', () => {
    const state = { totalExpenses: 0, dailyStreak: 0, weeklyStreak: 0, hasNoSpendDay: false, completedLessons: 0 }
    expect(getEarnedBadges(state)).not.toContain('first_log')
  })
  it('awards streak_3 at 3+ day streak', () => {
    const state = { totalExpenses: 5, dailyStreak: 3, weeklyStreak: 0, hasNoSpendDay: false, completedLessons: 0 }
    expect(getEarnedBadges(state)).toContain('streak_3')
    expect(getEarnedBadges(state)).not.toContain('streak_7')
  })
  it('awards all streak badges at 30', () => {
    const state = { totalExpenses: 50, dailyStreak: 30, weeklyStreak: 0, hasNoSpendDay: false, completedLessons: 0 }
    const badges = getEarnedBadges(state)
    expect(badges).toContain('streak_3')
    expect(badges).toContain('streak_7')
    expect(badges).toContain('streak_30')
  })
  it('awards no_spend badge', () => {
    const state = { totalExpenses: 1, dailyStreak: 0, weeklyStreak: 0, hasNoSpendDay: true, completedLessons: 0 }
    expect(getEarnedBadges(state)).toContain('no_spend')
  })
  it('awards lessons_5 at 5+ lessons', () => {
    const state = { totalExpenses: 10, dailyStreak: 0, weeklyStreak: 0, hasNoSpendDay: false, completedLessons: 5 }
    expect(getEarnedBadges(state)).toContain('lessons_5')
  })
  it('awards weeks_4 at 4 consecutive green weeks', () => {
    const state = { totalExpenses: 50, dailyStreak: 28, weeklyStreak: 4, hasNoSpendDay: false, completedLessons: 0 }
    expect(getEarnedBadges(state)).toContain('weeks_4')
  })
})

describe('getRedZoneStatus', () => {
  it('returns null below 70%', () => expect(getRedZoneStatus(600, 1000)).toBeNull())
  it('returns null at 69.9%', () => expect(getRedZoneStatus(699, 1000)).toBeNull())
  it('returns amber at exactly 70%', () => expect(getRedZoneStatus(700, 1000)).toBe('amber'))
  it('returns amber at 84.9%', () => expect(getRedZoneStatus(849, 1000)).toBe('amber'))
  it('returns red at exactly 85%', () => expect(getRedZoneStatus(850, 1000)).toBe('red'))
  it('returns red above 85%', () => expect(getRedZoneStatus(950, 1000)).toBe('red'))
  it('returns null for zero limit', () => expect(getRedZoneStatus(100, 0)).toBeNull())
})

describe('getCategoryComparison', () => {
  it('shows increase correctly', () => {
    const thisMonth = [makeExpense(1, 2000, '2024-02-01', 'Groceries'), makeExpense(2, 500, '2024-02-01', 'Transport')]
    const lastMonth = [makeExpense(3, 1500, '2024-01-01', 'Groceries'), makeExpense(4, 600, '2024-01-01', 'Transport')]
    const comparison = getCategoryComparison(thisMonth, lastMonth)
    const groceries = comparison.find(c => c.category === 'Groceries')
    expect(groceries?.change).toBe(500)
    expect(groceries?.direction).toBe('up')
    const transport = comparison.find(c => c.category === 'Transport')
    expect(transport?.change).toBe(-100)
    expect(transport?.direction).toBe('down')
  })

  it('handles categories that only appear in one month', () => {
    const thisMonth = [makeExpense(1, 2000, '2024-02-01', 'Groceries')]
    const lastMonth = [makeExpense(2, 1000, '2024-01-01', 'Shopping')]
    const comparison = getCategoryComparison(thisMonth, lastMonth)
    const shopping = comparison.find(c => c.category === 'Shopping')
    expect(shopping?.thisMonth).toBe(0)
    expect(shopping?.lastMonth).toBe(1000)
  })

  it('handles empty arrays', () => {
    expect(getCategoryComparison([], [])).toHaveLength(0)
  })
})

describe('getPauseEstimate', () => {
  it('calculates estimated saving correctly', () => {
    const expenses = [
      makeExpense(1, 1500, '2024-01-01', 'Eating out'),
      makeExpense(2, 1500, '2024-01-15', 'Eating out'),
    ]
    // 3000 spent in 15 days → 200/day avg, 16 days left in Jan
    const estimate = getPauseEstimate(expenses, 'Eating out', 2024, 0, new Date('2024-01-15'))
    expect(estimate).toBe(Math.round(200 * 16))
  })
})
