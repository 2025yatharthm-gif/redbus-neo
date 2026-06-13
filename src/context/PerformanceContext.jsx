import { createContext, useContext, useState, useCallback, useRef } from 'react'

const PerformanceContext = createContext(null)

export function PerformanceProvider({ children }) {
  const [metrics, setMetrics] = useState({})
  const timers = useRef({})

  // Start a timer for a named operation
  const startTimer = useCallback((key) => {
    timers.current[key] = performance.now()
  }, [])

  // End timer and record the elapsed ms
  const endTimer = useCallback((key, label) => {
    if (!timers.current[key]) return
    const elapsed = performance.now() - timers.current[key]
    delete timers.current[key]
    setMetrics(prev => ({
      ...prev,
      [key]: {
        label:     label || key,
        ms:        Math.round(elapsed),
        timestamp: Date.now(),
      },
    }))
    return Math.round(elapsed)
  }, [])

  // Record a one-shot metric (e.g. from Navigation Timing API)
  const recordMetric = useCallback((key, label, ms) => {
    setMetrics(prev => ({
      ...prev,
      [key]: { label, ms: Math.round(ms), timestamp: Date.now() },
    }))
  }, [])

  // Capture page load metrics from Navigation Timing API
  const capturePageLoad = useCallback(() => {
    if (typeof window === 'undefined') return
    try {
      const nav = performance.getEntriesByType('navigation')[0]
      if (nav) {
        recordMetric('page_load',    'Page Load',        nav.loadEventEnd - nav.startTime)
        recordMetric('dom_ready',    'DOM Ready',        nav.domContentLoadedEventEnd - nav.startTime)
        recordMetric('ttfb',         'Time to First Byte', nav.responseStart - nav.requestStart)
        recordMetric('dom_parse',    'DOM Parse',        nav.domInteractive - nav.responseEnd)
      }
    } catch {}
  }, [recordMetric])

  const clearMetrics = useCallback(() => setMetrics({}), [])

  const metricList = Object.values(metrics).sort((a, b) => a.label.localeCompare(b.label))

  function getScore(ms) {
    if (ms < 100)  return { label: 'Excellent', color: '#22C55E' }
    if (ms < 300)  return { label: 'Good',      color: '#84CC16' }
    if (ms < 800)  return { label: 'Fair',       color: '#F59E0B' }
    return              { label: 'Slow',       color: '#EF4444' }
  }

  return (
    <PerformanceContext.Provider value={{
      metrics, metricList,
      startTimer, endTimer,
      recordMetric, capturePageLoad,
      clearMetrics, getScore,
    }}>
      {children}
    </PerformanceContext.Provider>
  )
}

export function usePerformance() {
  const ctx = useContext(PerformanceContext)
  if (!ctx) throw new Error('usePerformance must be inside PerformanceProvider')
  return ctx
}
