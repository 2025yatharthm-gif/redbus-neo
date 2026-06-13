import styles from './CarbonCard.module.css'

export default function CarbonCard({ saved, dist, compact = false }) {
  const trees = Math.round(saved / 22 * 10) / 10  // 1 tree absorbs ~22kg CO2/yr

  if (compact) {
    return (
      <div className={styles.compact}>
        <span className={styles.leaf}>🌿</span>
        <span className={styles.compactText}>Saved <strong>{saved} kg CO₂</strong> vs driving</span>
      </div>
    )
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.icon}>🌱</span>
        <span className={styles.title}>Your Carbon Impact</span>
      </div>
      <div className={styles.body}>
        <div className={styles.bigStat}>
          <span className={styles.bigNum}>{saved}</span>
          <span className={styles.bigUnit}>kg CO₂ saved</span>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statVal}>{dist} km</span>
            <span className={styles.statLabel}>Journey distance</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statVal}>≈{trees}</span>
            <span className={styles.statLabel}>Trees' daily work</span>
          </div>
        </div>
      </div>
      <p className={styles.sub}>vs travelling the same route by solo car</p>
    </div>
  )
}
