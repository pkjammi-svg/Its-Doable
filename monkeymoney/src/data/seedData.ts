import { db, clearAllData, localDateStr } from '../db/db'
import type { Income, Settings } from '../types'

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return localDateStr(d)
}

function monthDate(monthsBack: number, day: number): string {
  const d = new Date()
  d.setMonth(d.getMonth() - monthsBack)
  d.setDate(day)
  return localDateStr(d)
}

export async function seedSampleData() {
  await clearAllData()

  // Income
  const incomes: Income[] = [
    { name: 'Salary', amount: 28000 },
    { name: 'Freelance', amount: 2000 },
  ]
  await db.incomes.bulkAdd(incomes)

  // Settings
  const settings: Settings = {
    id: 1,
    currency: 'INR',
    monthlyLimitOverride: 30000,
    dailyCap: undefined,
    pausedCategories: [],
  }
  await db.settings.put(settings)

  // ---- Month 1 (3 months back): ₹24,500 — good month ----
  const m3Expenses = [
    { amount: 10000, category: 'Rent & bills', note: 'Rent', date: monthDate(3, 1), isNoSpend: false },
    { amount: 800, category: 'Rent & bills', note: 'Electricity', date: monthDate(3, 5), isNoSpend: false },
    { amount: 650, category: 'Groceries', note: 'Weekly groceries', date: monthDate(3, 3), isNoSpend: false },
    { amount: 580, category: 'Groceries', note: 'Fruits & veg', date: monthDate(3, 8), isNoSpend: false },
    { amount: 720, category: 'Groceries', note: 'Weekly groceries', date: monthDate(3, 14), isNoSpend: false },
    { amount: 600, category: 'Groceries', note: 'Monthly essentials', date: monthDate(3, 20), isNoSpend: false },
    { amount: 350, category: 'Groceries', note: 'Top-up', date: monthDate(3, 25), isNoSpend: false },
    { amount: 280, category: 'Eating out', note: 'Lunch with friends', date: monthDate(3, 7), isNoSpend: false },
    { amount: 350, category: 'Eating out', note: 'Dinner', date: monthDate(3, 12), isNoSpend: false },
    { amount: 220, category: 'Eating out', note: 'Cafe', date: monthDate(3, 18), isNoSpend: false },
    { amount: 320, category: 'Eating out', note: 'Pizza night', date: monthDate(3, 24), isNoSpend: false },
    { amount: 450, category: 'Transport', note: 'Metro monthly pass', date: monthDate(3, 2), isNoSpend: false },
    { amount: 180, category: 'Transport', note: 'Uber rides', date: monthDate(3, 15), isNoSpend: false },
    { amount: 1200, category: 'Shopping', note: 'T-shirts', date: monthDate(3, 10), isNoSpend: false },
    { amount: 800, category: 'Shopping', note: 'Books', date: monthDate(3, 22), isNoSpend: false },
    { amount: 1500, category: 'Fun & outings', note: 'Movie + dinner outing', date: monthDate(3, 16), isNoSpend: false },
    { amount: 500, category: 'Fun & outings', note: 'Board game night', date: monthDate(3, 28), isNoSpend: false },
    { amount: 400, category: 'Health', note: 'Pharmacy', date: monthDate(3, 9), isNoSpend: false },
    { amount: 1000, category: 'Education', note: 'Online course', date: monthDate(3, 4), isNoSpend: false },
    { amount: 0, category: 'Other', note: 'No spend day', date: monthDate(3, 11), isNoSpend: true },
    { amount: 0, category: 'Other', note: 'No spend day', date: monthDate(3, 17), isNoSpend: true },
    { amount: 0, category: 'Other', note: 'No spend day', date: monthDate(3, 23), isNoSpend: true },
  ]

  // ---- Month 2 (2 months back): ₹31,500 — over budget ----
  const m2Expenses = [
    { amount: 10000, category: 'Rent & bills', note: 'Rent', date: monthDate(2, 1), isNoSpend: false },
    { amount: 900, category: 'Rent & bills', note: 'Electricity + internet', date: monthDate(2, 5), isNoSpend: false },
    { amount: 700, category: 'Groceries', note: 'Weekly shop', date: monthDate(2, 4), isNoSpend: false },
    { amount: 650, category: 'Groceries', note: 'Fruits & veg', date: monthDate(2, 10), isNoSpend: false },
    { amount: 800, category: 'Groceries', note: 'Weekly shop', date: monthDate(2, 17), isNoSpend: false },
    { amount: 700, category: 'Groceries', note: 'Monthly top-up', date: monthDate(2, 24), isNoSpend: false },
    { amount: 500, category: 'Eating out', note: 'Restaurant', date: monthDate(2, 6), isNoSpend: false },
    { amount: 650, category: 'Eating out', note: 'Brunch', date: monthDate(2, 9), isNoSpend: false },
    { amount: 420, category: 'Eating out', note: 'Swiggy/Zomato', date: monthDate(2, 14), isNoSpend: false },
    { amount: 580, category: 'Eating out', note: 'Dinner out', date: monthDate(2, 20), isNoSpend: false },
    { amount: 350, category: 'Eating out', note: 'Quick lunch', date: monthDate(2, 25), isNoSpend: false },
    { amount: 500, category: 'Eating out', note: 'Weekend brunch', date: monthDate(2, 28), isNoSpend: false },
    { amount: 500, category: 'Transport', note: 'Metro + auto', date: monthDate(2, 2), isNoSpend: false },
    { amount: 400, category: 'Transport', note: 'Uber extra', date: monthDate(2, 18), isNoSpend: false },
    { amount: 2200, category: 'Fun & outings', note: 'Concert tickets', date: monthDate(2, 8), isNoSpend: false },
    { amount: 1500, category: 'Fun & outings', note: 'Weekend trip', date: monthDate(2, 22), isNoSpend: false },
    { amount: 800, category: 'Fun & outings', note: 'Birthday dinner', date: monthDate(2, 27), isNoSpend: false },
    { amount: 1800, category: 'Shopping', note: 'New clothes', date: monthDate(2, 11), isNoSpend: false },
    { amount: 1500, category: 'Shopping', note: 'Gadget accessory', date: monthDate(2, 19), isNoSpend: false },
    { amount: 700, category: 'Shopping', note: 'Random shopping', date: monthDate(2, 26), isNoSpend: false },
    { amount: 800, category: 'Health', note: 'Doctor + meds', date: monthDate(2, 13), isNoSpend: false },
    { amount: 500, category: 'Other', note: 'Miscellaneous', date: monthDate(2, 29), isNoSpend: false },
  ]

  // ---- Month 3 (last month): ₹22,000 — recovery ----
  const m1Expenses = [
    { amount: 10000, category: 'Rent & bills', note: 'Rent', date: monthDate(1, 1), isNoSpend: false },
    { amount: 700, category: 'Rent & bills', note: 'Utilities', date: monthDate(1, 5), isNoSpend: false },
    { amount: 600, category: 'Groceries', note: 'Weekly shop', date: monthDate(1, 3), isNoSpend: false },
    { amount: 550, category: 'Groceries', note: 'Fruits', date: monthDate(1, 9), isNoSpend: false },
    { amount: 650, category: 'Groceries', note: 'Weekly shop', date: monthDate(1, 15), isNoSpend: false },
    { amount: 600, category: 'Groceries', note: 'Top-up', date: monthDate(1, 22), isNoSpend: false },
    { amount: 300, category: 'Eating out', note: 'One lunch', date: monthDate(1, 7), isNoSpend: false },
    { amount: 350, category: 'Eating out', note: 'Dinner', date: monthDate(1, 16), isNoSpend: false },
    { amount: 280, category: 'Eating out', note: 'Quick bite', date: monthDate(1, 24), isNoSpend: false },
    { amount: 400, category: 'Transport', note: 'Metro pass', date: monthDate(1, 2), isNoSpend: false },
    { amount: 300, category: 'Transport', note: 'Auto + Uber', date: monthDate(1, 20), isNoSpend: false },
    { amount: 800, category: 'Fun & outings', note: 'Movie', date: monthDate(1, 11), isNoSpend: false },
    { amount: 600, category: 'Fun & outings', note: 'Park outing', date: monthDate(1, 18), isNoSpend: false },
    { amount: 1000, category: 'Shopping', note: 'Essentials only', date: monthDate(1, 13), isNoSpend: false },
    { amount: 700, category: 'Health', note: 'Pharmacy', date: monthDate(1, 8), isNoSpend: false },
    { amount: 1000, category: 'Education', note: 'Course renewal', date: monthDate(1, 4), isNoSpend: false },
    { amount: 0, category: 'Other', note: 'No spend', date: monthDate(1, 6), isNoSpend: true },
    { amount: 0, category: 'Other', note: 'No spend', date: monthDate(1, 12), isNoSpend: true },
    { amount: 0, category: 'Other', note: 'No spend', date: monthDate(1, 17), isNoSpend: true },
    { amount: 0, category: 'Other', note: 'No spend', date: monthDate(1, 23), isNoSpend: true },
  ]

  // ---- This month: some current expenses ----
  const thisMonthExpenses = [
    { amount: 10000, category: 'Rent & bills', note: 'Rent', date: daysAgo(Math.min(new Date().getDate() - 1, 20)), isNoSpend: false },
    { amount: 650, category: 'Groceries', note: 'Weekly shop', date: daysAgo(6), isNoSpend: false },
    { amount: 580, category: 'Groceries', note: 'Fruits & veg', date: daysAgo(3), isNoSpend: false },
    { amount: 350, category: 'Eating out', note: 'Lunch', date: daysAgo(5), isNoSpend: false },
    { amount: 400, category: 'Transport', note: 'Metro pass', date: daysAgo(10), isNoSpend: false },
    { amount: 0, category: 'Other', note: 'No spend', date: daysAgo(2), isNoSpend: true },
    { amount: 300, category: 'Eating out', note: 'Dinner', date: daysAgo(1), isNoSpend: false },
  ]

  await db.expenses.bulkAdd([...m3Expenses, ...m2Expenses, ...m1Expenses, ...thisMonthExpenses])

  await db.meta.put({
    id: 1,
    earnedBadges: ['first_log', 'streak_3', 'no_spend'],
    bestDailyStreak: 7,
    bestWeeklyStreak: 3,
  })
}
