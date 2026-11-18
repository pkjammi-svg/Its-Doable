import Dexie, { type EntityTable } from 'dexie'
import type { Expense, Income, Settings, LessonProgress, Meta } from '../types'

class MonkeyMoneyDB extends Dexie {
  expenses!: EntityTable<Expense, 'id'>
  incomes!: EntityTable<Income, 'id'>
  settings!: EntityTable<Settings, 'id'>
  lessonProgress!: EntityTable<LessonProgress, 'lessonId'>
  meta!: EntityTable<Meta, 'id'>

  constructor() {
    super('MonkeyMoneyDB')
    this.version(1).stores({
      expenses: '++id, date, category',
      incomes: '++id',
      settings: '++id',
      lessonProgress: 'lessonId',
      meta: '++id',
    })
  }
}

export const db = new MonkeyMoneyDB()

const DEFAULT_SETTINGS: Settings = {
  id: 1,
  currency: 'INR',
  monthlyLimitOverride: undefined,
  dailyCap: undefined,
  pausedCategories: [],
}

const DEFAULT_META: Meta = {
  id: 1,
  earnedBadges: [],
  bestDailyStreak: 0,
  bestWeeklyStreak: 0,
}

export async function getSettings(): Promise<Settings> {
  const s = await db.settings.get(1)
  if (!s) {
    await db.settings.put(DEFAULT_SETTINGS)
    return DEFAULT_SETTINGS
  }
  return s
}

export async function getMeta(): Promise<Meta> {
  const m = await db.meta.get(1)
  if (!m) {
    await db.meta.put(DEFAULT_META)
    return DEFAULT_META
  }
  return m
}

export async function updateSettings(patch: Partial<Settings>) {
  const s = await getSettings()
  await db.settings.put({ ...s, ...patch, id: 1 })
}

export async function updateMeta(patch: Partial<Meta>) {
  const m = await getMeta()
  await db.meta.put({ ...m, ...patch, id: 1 })
}

export function localDateStr(date: Date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// JSON export
export async function exportData(): Promise<string> {
  const [expenses, incomes, settings, lessonProgress, meta] = await Promise.all([
    db.expenses.toArray(),
    db.incomes.toArray(),
    db.settings.toArray(),
    db.lessonProgress.toArray(),
    db.meta.toArray(),
  ])
  return JSON.stringify(
    { version: 1, exportedAt: new Date().toISOString(), expenses, incomes, settings, lessonProgress, meta },
    null,
    2
  )
}

// JSON import (overwrites existing data)
export async function importData(json: string): Promise<void> {
  const data = JSON.parse(json) as {
    expenses: Expense[]
    incomes: Income[]
    settings: Settings[]
    lessonProgress: LessonProgress[]
    meta: Meta[]
  }
  await db.transaction('rw', [db.expenses, db.incomes, db.settings, db.lessonProgress, db.meta], async () => {
    await db.expenses.clear()
    await db.incomes.clear()
    await db.settings.clear()
    await db.lessonProgress.clear()
    await db.meta.clear()
    if (data.expenses?.length) await db.expenses.bulkAdd(data.expenses.map(e => ({ ...e, id: undefined })))
    if (data.incomes?.length) await db.incomes.bulkAdd(data.incomes.map(e => ({ ...e, id: undefined })))
    if (data.settings?.length) await db.settings.bulkAdd(data.settings)
    if (data.lessonProgress?.length) await db.lessonProgress.bulkAdd(data.lessonProgress)
    if (data.meta?.length) await db.meta.bulkAdd(data.meta)
  })
}

export async function clearAllData(): Promise<void> {
  await db.transaction('rw', [db.expenses, db.incomes, db.settings, db.lessonProgress, db.meta], async () => {
    await db.expenses.clear()
    await db.incomes.clear()
    await db.settings.clear()
    await db.lessonProgress.clear()
    await db.meta.clear()
  })
}
