import styles from './TravelConditions.module.css'

export default function TravelConditions({ conditions }) {
  const { weather, traffic, road } = conditions
  return (
    <div className={styles.card}>
      <div className={styles.title}>🗺️ Travel Conditions</div>
      <div className={styles.grid}>
        <div className={styles.item}>
          <span className={styles.itemIcon}>{weather.icon}</span>
          <div className={styles.itemBody}>
            <span className={styles.itemLabel}>Weather</span>
            <span className={styles.itemVal} style={{ color: weather.color }}>{weather.label}</span>
          </div>
        </div>

        <div className={styles.item}>
          <span className={styles.itemIcon}>🚗</span>
          <div className={styles.itemBody}>
            <span className={styles.itemLabel}>Traffic</span>
            <div className={styles.trafficBar}>
              <div className={styles.trafficFill} style={{ width: `${traffic.bar}%`, background: traffic.color }} />
            </div>
            <span className={styles.itemVal} style={{ color: traffic.color }}>{traffic.label}</span>
          </div>
        </div>

        <div className={styles.item}>
          <span className={styles.itemIcon}>{road.icon}</span>
          <div className={styles.itemBody}>
            <span className={styles.itemLabel}>Road Quality</span>
            <div className={styles.roadScore}>
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className={`${styles.roadDot} ${i < road.score ? styles.roadDotFill : ''}`} />
              ))}
            </div>
            <span className={styles.itemVal}>{road.label}</span>
          </div>
        </div>
      </div>
      <p className={styles.disclaimer}>Conditions are estimated based on historical data.</p>
    </div>
  )
}
