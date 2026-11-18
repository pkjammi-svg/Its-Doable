export interface Expense {
  id?: number
  amount: number
  category: string
  note: string
  date: string // 'YYYY-MM-DD' local date
  isNoSpend: boolean
}

export interface Income {
  id?: number
  name: string
  amount: number
}

export interface DailyCap {
  enabled: boolean
  amount: number
  enabledFrom: string // 'YYYY-MM-DD'
}

export interface Settings {
  id?: number
  currency: string
  monthlyLimitOverride?: number
  dailyCap?: DailyCap
  pausedCategories: string[]
}

export interface LessonProgress {
  lessonId: string
  completed: boolean
  completedAt?: string
}

export interface Meta {
  id?: number
  earnedBadges: string[]
  bestDailyStreak: number
  bestWeeklyStreak: number
}

export const CATEGORIES = [
  'Groceries',
  'Eating out',
  'Rent & bills',
  'Transport',
  'Shopping',
  'Fun & outings',
  'Health',
  'Education',
  'Other',
] as const

export type Category = (typeof CATEGORIES)[number]

export const NON_ESSENTIAL_CATEGORIES: string[] = [
  'Eating out',
  'Transport',
  'Shopping',
  'Fun & outings',
  'Other',
]

export const ESSENTIAL_CATEGORIES: string[] = [
  'Groceries',
  'Rent & bills',
  'Health',
  'Education',
]

export interface CurrencyOption {
  code: string
  symbol: string
  locale: string
  name: string
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: 'INR', symbol: '₹', locale: 'en-IN', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', locale: 'en-US', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', locale: 'de-DE', name: 'Euro' },
  { code: 'GBP', symbol: '£', locale: 'en-GB', name: 'British Pound' },
]

export interface Level {
  name: string
  emoji: string
  minBananas: number
  nextAt?: number
}

export const LEVELS: Level[] = [
  { name: 'Baby Monkey', emoji: '🐒', minBananas: 0, nextAt: 150 },
  { name: 'Branch Hopper', emoji: '🌿', minBananas: 150, nextAt: 300 },
  { name: 'Vine Swinger', emoji: '🍃', minBananas: 300, nextAt: 450 },
  { name: 'Banana Banker', emoji: '🍌', minBananas: 450, nextAt: 600 },
  { name: 'Jungle CFO', emoji: '💼', minBananas: 600, nextAt: 750 },
  { name: 'Silverback Saver', emoji: '🦍', minBananas: 750 },
]

export interface Badge {
  id: string
  name: string
  description: string
  emoji: string
}

export const BADGES: Badge[] = [
  { id: 'first_log', name: 'First Step', description: 'Logged your first expense', emoji: '👣' },
  { id: 'streak_3', name: 'Hot Streak', description: '3 days in a row under budget', emoji: '🔥' },
  { id: 'streak_7', name: 'Week Warrior', description: '7-day green streak', emoji: '⚔️' },
  { id: 'streak_30', name: 'Monthly Master', description: '30-day green streak', emoji: '🏆' },
  { id: 'weeks_4', name: 'Green Month', description: '4 consecutive green weeks', emoji: '🌱' },
  { id: 'no_spend', name: 'Zero Hero', description: 'First no-spend day', emoji: '🧘' },
  { id: 'lessons_5', name: 'Money Wise', description: 'Completed 5 lessons', emoji: '📚' },
]

export type RedZoneStatus = 'amber' | 'red' | null

export const CATEGORY_COLORS: Record<string, string> = {
  Groceries: '#22c55e',
  'Eating out': '#f97316',
  'Rent & bills': '#6366f1',
  Transport: '#06b6d4',
  Shopping: '#ec4899',
  'Fun & outings': '#f59e0b',
  Health: '#14b8a6',
  Education: '#8b5cf6',
  Other: '#94a3b8',
}
