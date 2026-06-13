import { SORT_OPTIONS } from '../../utils/useFilterSort'
import styles from './SortBar.module.css'

/**
 * SortBar — pill-style sort buttons rendered above bus list.
 */
export default function SortBar({ sort, onSort, count }) {
  return (
    <div className={styles.bar}>
      <span className={styles.count}>
        {count} bus{count !== 1 ? 'es' : ''} found
      </span>

      <div className={styles.pills}>
        {SORT_OPTIONS.map(opt => (
          <button
            key={opt.value}
            className={sort === opt.value ? `${styles.pill} ${styles.pillActive}` : styles.pill}
            onClick={() => onSort(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
