import { useMemo } from 'react'
import { MonthlyComparison } from '../components/budget/MonthlyComparison'
import { useLast6MonthsExpenses, useSettings, useIncomes } from '../hooks/useDB'

export function ComparePage() {
  const allExpenses = useLast6MonthsExpenses()
  const settings = useSettings()
  const incomes = useIncomes()
  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0)
  const monthlyLimit = settings.monthlyLimitOverride ?? totalIncome

  const today = new Date()

  const monthlySummaries = useMemo(() => {
    const summaries = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const y = d.getFullYear()
      const m = d.getMonth()
      const monthStr = `${y}-${String(m + 1).padStart(2, '0')}`
      const label = d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
      const expenses = allExpenses.filter(e => e.date.startsWith(monthStr))
      const total = expenses.reduce((s, e) => s + e.amount, 0)
      summaries.push({ label, total, expenses })
    }
    return summaries
  }, [allExpenses]) // eslint-disable-line react-hooks/exhaustive-deps

  const thisMonthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  const lastMonthStr = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`

  const thisMonthExpenses = allExpenses.filter(e => e.date.startsWith(thisMonthStr))
  const lastMonthExpenses = allExpenses.filter(e => e.date.startsWith(lastMonthStr))

  return (
    <div className="space-y-4">
      <h1 className="font-display font-bold text-xl text-gray-800 dark:text-gray-100">Monthly comparison</h1>
      <MonthlyComparison
        monthlySummaries={monthlySummaries}
        monthlyLimit={monthlyLimit}
        currency={settings.currency}
        currentMonthExpenses={thisMonthExpenses}
        lastMonthExpenses={lastMonthExpenses}
      />
    </div>
  )
}
