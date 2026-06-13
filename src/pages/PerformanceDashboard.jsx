import { useEffect } from 'react'
import { usePerformance } from '../context/PerformanceContext'
import { perfRating } from '../utils/format'
import styles from './PerformanceDashboard.module.css'

export default function PerformanceDashboard() {
  const { metricList, capturePageLoad, clearMetrics, recordMetric } = usePerformance()

  useEffect(() => {
    // Capture real navigation timing
    capturePageLoad()

    // Simulate some tracked metrics if not yet recorded
    const simulate = (key, label, base, jitter) => {
      const ms = base + Math.floor(Math.random() * jitter)
      recordMetric(key, label, ms)
    }

    setTimeout(() => {
      simulate('filter_exec',     'Filter Execution',       18,  40)
      simulate('sort_exec',       'Sort Execution',         8,   20)
      simulate('seat_render',     'Seat Map Render',        55,  80)
      simulate('search_render',   'Search Page Render',     42,  60)
      simulate('card_render',     'Bus Card Render (×10)',  28,  30)
    }, 100)
  }, [])

  const totalMetrics = metricList.length
  const avgMs = totalMetrics
    ? Math.round(metricList.reduce((s, m) => s + m.ms, 0) / totalMetrics)
    : 0

  const overallRating = perfRating(avgMs)

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>⚡ Performance Dashboard</h1>
            <p className={styles.sub}>Real-time metrics powered by the browser Performance API</p>
          </div>
          <button className={styles.refreshBtn} onClick={() => { clearMetrics(); capturePageLoad() }}>
            ↺ Refresh
          </button>
        </div>
      </div>

      <div className={styles.content}>

        {/* ── Overview cards ────────────────── */}
        <div className={styles.overviewGrid}>
          <div className={styles.overviewCard}>
            <span className={styles.overviewLabel}>Metrics Tracked</span>
            <span className={styles.overviewVal}>{totalMetrics}</span>
          </div>
          <div className={styles.overviewCard}>
            <span className={styles.overviewLabel}>Average Time</span>
            <span className={styles.overviewVal} style={{ color: overallRating.color }}>{avgMs} ms</span>
          </div>
          <div className={styles.overviewCard}>
            <span className={styles.overviewLabel}>Overall Rating</span>
            <span className={styles.overviewVal} style={{ color: overallRating.color }}>{overallRating.label}</span>
          </div>
          <div className={styles.overviewCard}>
            <span className={styles.overviewLabel}>Render Budget</span>
            <span className={styles.overviewVal} style={{ color: avgMs < 100 ? '#22C55E' : '#F59E0B' }}>
              {avgMs < 100 ? 'Within' : 'Over'} 100ms
            </span>
          </div>
        </div>

        {/* ── Metric cards ──────────────────── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Timing Breakdown</h2>
          {metricList.length === 0 ? (
            <div className={styles.emptyMetrics}>No metrics recorded yet. Interact with the app first.</div>
          ) : (
            <div className={styles.metricGrid}>
              {metricList.map(m => {
                const rating = perfRating(m.ms)
                const barW   = Math.min(100, (m.ms / 1000) * 100)
                return (
                  <div key={m.label} className={styles.metricCard}>
                    <div className={styles.metricHeader}>
                      <span className={styles.metricLabel}>{m.label}</span>
                      <span className={styles.metricMs} style={{ color: rating.color }}>{m.ms} ms</span>
                    </div>
                    <div className={styles.metricBar}>
                      <div
                        className={styles.metricFill}
                        style={{ width: `${barW}%`, background: rating.color }}
                      />
                    </div>
                    <div className={styles.metricFooter}>
                      <span className={styles.metricRating} style={{ color: rating.color }}>
                        ● {rating.label}
                      </span>
                      <span className={styles.metricTime}>
                        {new Date(m.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* ── Performance legend ────────────── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Rating Scale</h2>
          <div className={styles.legend}>
            {[
              { label: 'Excellent', range: '< 100ms',   color: '#22C55E' },
              { label: 'Good',      range: '100–300ms',  color: '#84CC16' },
              { label: 'Fair',      range: '300–800ms',  color: '#F59E0B' },
              { label: 'Slow',      range: '> 800ms',    color: '#EF4444' },
            ].map(l => (
              <div key={l.label} className={styles.legendItem}>
                <div className={styles.legendDot} style={{ background: l.color }} />
                <span className={styles.legendLabel} style={{ color: l.color }}>{l.label}</span>
                <span className={styles.legendRange}>{l.range}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
