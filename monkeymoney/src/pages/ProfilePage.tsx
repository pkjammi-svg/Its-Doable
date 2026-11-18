import { useState } from 'react'
import { Download, Upload, Trash2, FlaskConical } from 'lucide-react'
import { IncomeSources } from '../components/budget/IncomeSources'
import { BadgeGrid } from '../components/gamification/BadgeGrid'
import { useIncomes, useSettings, useMeta } from '../hooks/useDB'
import { useGameState } from '../hooks/useGameState'
import { exportData, importData, clearAllData } from '../db/db'
import { seedSampleData } from '../data/seedData'
import { useToast } from '../components/ui/Toast'

export function ProfilePage() {
  const incomes = useIncomes()
  const settings = useSettings()
  const meta = useMeta()
  const gs = useGameState()
  const { showToast } = useToast()
  const [confirmClear, setConfirmClear] = useState(false)
  const [confirmSeed, setConfirmSeed] = useState(false)

  async function handleExport() {
    try {
      const json = await exportData()
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `monkeymoney-backup-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
      showToast('✅ Data exported!', { type: 'success' })
    } catch {
      showToast('Export failed', { type: 'error' })
    }
  }

  async function handleImport() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      try {
        const text = await file.text()
        await importData(text)
        showToast('✅ Data imported!', { type: 'success' })
      } catch {
        showToast('Import failed — invalid file', { type: 'error' })
      }
    }
    input.click()
  }

  async function handleClear() {
    await clearAllData()
    setConfirmClear(false)
    showToast('All data cleared', { type: 'info' })
  }

  async function handleSeed() {
    await seedSampleData()
    setConfirmSeed(false)
    showToast('🐒 Sample data loaded!', { type: 'success' })
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display font-bold text-xl text-gray-800 dark:text-gray-100">Profile</h1>

      {/* Income & settings */}
      <IncomeSources
        incomes={incomes}
        totalIncome={gs.totalIncome}
        settings={settings}
        currency={settings.currency}
      />

      {/* Badges & level */}
      <BadgeGrid earnedBadges={meta.earnedBadges} bananas={gs.bananas} level={gs.level} />

      {/* Data management */}
      <div className="bg-white dark:bg-jungle-900 rounded-3xl p-5 shadow-sm space-y-3">
        <h3 className="font-display font-bold text-base text-gray-800 dark:text-gray-100">Data</h3>

        <button
          onClick={handleExport}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-jungle-800 hover:bg-gray-100 dark:hover:bg-jungle-700 text-gray-700 dark:text-gray-200 text-sm font-medium transition-colors focus-visible:ring-2 ring-jungle-500"
        >
          <Download size={18} className="text-jungle-600 dark:text-jungle-400" />
          Export backup (JSON)
        </button>

        <button
          onClick={handleImport}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-jungle-800 hover:bg-gray-100 dark:hover:bg-jungle-700 text-gray-700 dark:text-gray-200 text-sm font-medium transition-colors focus-visible:ring-2 ring-jungle-500"
        >
          <Upload size={18} className="text-jungle-600 dark:text-jungle-400" />
          Import from backup
        </button>

        {/* Seed data */}
        {!confirmSeed ? (
          <button
            onClick={() => setConfirmSeed(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-banana-50 dark:bg-banana-900/20 hover:bg-banana-100 dark:hover:bg-banana-900/30 text-banana-800 dark:text-banana-200 text-sm font-medium transition-colors focus-visible:ring-2 ring-banana-500"
          >
            <FlaskConical size={18} />
            Load sample data (3 months preview)
          </button>
        ) : (
          <div className="bg-banana-50 dark:bg-banana-900/20 rounded-2xl p-3 space-y-2">
            <p className="text-sm text-banana-800 dark:text-banana-200 font-body">This will replace all your data with sample data.</p>
            <div className="flex gap-2">
              <button onClick={handleSeed} className="flex-1 py-2 rounded-xl bg-banana-500 text-white text-sm font-semibold focus-visible:ring-2 ring-banana-500">Yes, load sample</button>
              <button onClick={() => setConfirmSeed(false)} className="flex-1 py-2 rounded-xl bg-gray-200 dark:bg-jungle-700 text-gray-700 dark:text-gray-200 text-sm font-semibold focus-visible:ring-2 ring-jungle-500">Cancel</button>
            </div>
          </div>
        )}

        {/* Clear data */}
        {!confirmClear ? (
          <button
            onClick={() => setConfirmClear(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300 text-sm font-medium transition-colors focus-visible:ring-2 ring-red-500"
          >
            <Trash2 size={18} />
            Clear all data
          </button>
        ) : (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-3 space-y-2">
            <p className="text-sm text-red-800 dark:text-red-200 font-body">Are you sure? This cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={handleClear} className="flex-1 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold focus-visible:ring-2 ring-red-500">Yes, clear</button>
              <button onClick={() => setConfirmClear(false)} className="flex-1 py-2 rounded-xl bg-gray-200 dark:bg-jungle-700 text-gray-700 dark:text-gray-200 text-sm font-semibold focus-visible:ring-2 ring-jungle-500">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
