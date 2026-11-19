import { ExpenseForm } from '../components/budget/ExpenseForm'
import { ExpenseList } from '../components/budget/ExpenseList'
import { useRecentExpenses, useSettings, useIncomes } from '../hooks/useDB'

export function ExpensesPage() {
  const expenses = useRecentExpenses(60)
  const settings = useSettings()
  const incomes = useIncomes()
  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0)
  const monthlyLimit = settings.monthlyLimitOverride ?? totalIncome

  return (
    <div className="space-y-4">
      <ExpenseForm
        currency={settings.currency}
        monthlyLimit={monthlyLimit}
        settings={settings}
      />
      <div>
        <h3 className="font-display font-bold text-sm text-gray-600 dark:text-gray-400 mb-2 px-1">Recent expenses</h3>
        <ExpenseList expenses={expenses} currency={settings.currency} />
      </div>
    </div>
  )
}
