import styles from './ComfortScore.module.css'

function scoreColor(s) {
  if (s >= 8) return '#22C55E'
  if (s >= 6) return '#84CC16'
  if (s >= 4) return '#F59E0B'
  return '#EF4444'
}

export default function ComfortScore({ score, size = 'sm' }) {
  const color = scoreColor(score)
  const pct   = (score / 10) * 100

  return (
    <div className={`${styles.wrap} ${styles[size]}`} title={`Sleep Comfort Score: ${score}/10`}>
      <span className={styles.icon}>😴</span>
      <div className={styles.bar}>
        <div className={styles.fill} style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className={styles.val} style={{ color }}>{score.toFixed(1)}</span>
    </div>
  )
}
