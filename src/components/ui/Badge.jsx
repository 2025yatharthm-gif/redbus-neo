import styles from './Badge.module.css'

/**
 * @param {'brand'|'success'|'warning'|'muted'} variant
 */
export default function Badge({ children, variant = 'muted' }) {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {children}
    </span>
  )
}
