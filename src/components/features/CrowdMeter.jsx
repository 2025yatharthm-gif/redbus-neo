import styles from './CrowdMeter.module.css'

export default function CrowdMeter({ crowd, seatsAvailable }) {
  return (
    <div className={styles.wrap}>
      <span className={styles.icon}>{crowd.icon}</span>
      <div className={styles.right}>
        <div className={styles.bar}>
          <div
            className={styles.fill}
            style={{ width: `${crowd.bar}%`, background: crowd.color }}
          />
        </div>
        <span className={styles.label} style={{ color: crowd.color }}>
          {crowd.level}
        </span>
      </div>
    </div>
  )
}
