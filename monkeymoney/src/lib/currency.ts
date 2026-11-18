import { CURRENCY_OPTIONS } from '../types'

export function formatCurrency(amount: number, currencyCode = 'INR'): string {
  const opt = CURRENCY_OPTIONS.find(c => c.code === currencyCode) ?? CURRENCY_OPTIONS[0]
  if (currencyCode === 'INR') {
    const formatted = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount)
    return `₹${formatted}`
  }
  return new Intl.NumberFormat(opt.locale, {
    style: 'currency',
    currency: opt.code,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatCompact(amount: number, currencyCode = 'INR'): string {
  const opt = CURRENCY_OPTIONS.find(c => c.code === currencyCode) ?? CURRENCY_OPTIONS[0]
  if (amount >= 100000 && currencyCode === 'INR') {
    return `₹${(amount / 100000).toFixed(1)}L`
  }
  if (amount >= 1000) {
    return opt.symbol + (amount / 1000).toFixed(1) + 'k'
  }
  return formatCurrency(amount, currencyCode)
}

export function getCurrencySymbol(currencyCode = 'INR'): string {
  return CURRENCY_OPTIONS.find(c => c.code === currencyCode)?.symbol ?? '₹'
}

export function parseCurrencyInput(value: string): number {
  const cleaned = value.replace(/[^0-9.]/g, '')
  const num = parseFloat(cleaned)
  return isNaN(num) ? 0 : num
}
