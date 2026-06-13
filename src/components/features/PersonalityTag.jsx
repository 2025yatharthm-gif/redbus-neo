import styles from './PersonalityTag.module.css'

export default function PersonalityTag({ personality, size = 'sm' }) {
  if (!personality) return null
  return (
    <div
      className={`${styles.tag} ${styles[size]}`}
      style={{ '--tag-color': personality.color }}
      title={personality.desc}
    >
      <span className={styles.icon}>{personality.icon}</span>
      <span className={styles.label}>{personality.tag}</span>
    </div>
  )
}
