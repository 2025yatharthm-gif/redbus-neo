import { createContext, useContext, useState, useEffect, useCallback } from 'react'

// ── Currency definitions ─────────────────────────────────────
export const CURRENCIES = {
  INR: { code: 'INR', symbol: '₹', label: 'Indian Rupee',   rate: 1      },
  USD: { code: 'USD', symbol: '$', label: 'US Dollar',       rate: 0.012  },
  EUR: { code: 'EUR', symbol: '€', label: 'Euro',            rate: 0.011  },
  GBP: { code: 'GBP', symbol: '£', label: 'British Pound',   rate: 0.0095 },
}

// ── Theme definitions ────────────────────────────────────────
export const THEMES = {
  dark:  'dark',
  light: 'light',
}

const STORAGE_KEY = 'redbus_neo_settings'

const DEFAULTS = {
  theme:    THEMES.dark,
  currency: 'INR',
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

function saveSettings(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) } catch {}
}

// ── Context ──────────────────────────────────────────────────
const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings)

  // Apply theme to <html> data-theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme)
    saveSettings(settings)
  }, [settings])

  const setTheme = useCallback((theme) => {
    setSettings(s => ({ ...s, theme }))
  }, [])

  const setCurrency = useCallback((currency) => {
    setSettings(s => ({ ...s, currency }))
  }, [])

  const currency = CURRENCIES[settings.currency] || CURRENCIES.INR

  // Format a price in the active currency
  function formatCurrency(amountInr) {
    const converted = amountInr * currency.rate
    const locale    = settings.currency === 'INR' ? 'en-IN' : 'en-US'
    const formatted = converted < 100
      ? converted.toFixed(2)
      : Math.round(converted).toLocaleString(locale)
    return `${currency.symbol}${formatted}`
  }

  return (
    <SettingsContext.Provider value={{
      theme:    settings.theme,
      currency: settings.currency,
      currencyObj: currency,
      setTheme,
      setCurrency,
      formatCurrency,
      CURRENCIES,
      THEMES,
    }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be inside SettingsProvider')
  return ctx
}
