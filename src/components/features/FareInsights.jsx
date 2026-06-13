import { useSettings } from '../../context/SettingsContext'
import styles from './FareInsights.module.css'

export default function FareInsights({ insights }) {
  const { formatCurrency } = useSettings()
  if (!insights) return null
  const { current, average, savings, pct, isCheap } = insights

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>💡 Fare Insights</span>
      </div>
      <div className={styles.grid}>
        <div className={styles.item}>
          <span className={styles.itemLabel}>Current Fare</span>
          <span className={styles.itemVal}>{formatCurrency(current)}</span>
        </div>
        <div className={styles.item}>
          <span className={styles.itemLabel}>Route Average</span>
          <span className={styles.itemVal}>{formatCurrency(average)}</span>
        </div>
        <div className={`${styles.item} ${styles.savingsItem}`}>
          <span className={styles.itemLabel}>{isCheap ? 'You Save' : 'Above avg by'}</span>
          <span className={styles.savingsVal} style={{ color: isCheap ? '#22C55E' : '#EF4444' }}>
            {isCheap ? '↓' : '↑'} {formatCurrency(Math.abs(savings))} ({pct}%)
          </span>
        </div>
      </div>
      {isCheap && (
        <div className={styles.badge}>🎯 Great deal on this route!</div>
      )}
    </div>
  )
}
