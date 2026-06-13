import styles from './EmptyState.module.css'

/**
 * EmptyState — shown when filters produce zero results.
 */
export default function EmptyState({ onReset }) {
  return (
    <div className={styles.root}>
      <div className={styles.icon}>🚌</div>
      <h3 className={styles.title}>No buses match your filters</h3>
      <p className={styles.sub}>
        Try adjusting your price range, removing a filter, or searching a different date.
      </p>
      <button className={styles.btn} onClick={onReset}>
        Clear all filters
      </button>
    </div>
  )
}
