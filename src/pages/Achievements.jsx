import { useAchievements } from '../context/AchievementsContext'
import { useBooking } from '../context/BookingContext'
import styles from './Achievements.module.css'

export default function Achievements() {
  const { achievements } = useAchievements()
  const { bookings } = useBooking()

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalCount    = achievements.length
  const pct           = Math.round((unlockedCount / totalCount) * 100)

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.title}>🏆 Achievements</h1>
          <p className={styles.sub}>
            Complete bookings to unlock travel badges
          </p>
        </div>
      </div>

      <div className={styles.content}>

        {/* Progress bar */}
        <div className={styles.progressCard}>
          <div className={styles.progressTop}>
            <span className={styles.progressLabel}>
              {unlockedCount} of {totalCount} unlocked
            </span>
            <span className={styles.progressPct}>{pct}%</span>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${pct}%` }} />
          </div>
          {bookings.length === 0 && (
            <p className={styles.progressHint}>
              Complete your first booking to start earning badges!
            </p>
          )}
        </div>

        {/* Achievement grid */}
        <div className={styles.grid}>
          {achievements.map(a => (
            <div
              key={a.id}
              className={`${styles.card} ${a.unlocked ? styles.cardUnlocked : styles.cardLocked}`}
            >
              <div className={styles.cardIcon}>
                {a.unlocked ? a.icon : '🔒'}
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardLabel}>{a.label}</div>
                <div className={styles.cardDesc}>{a.desc}</div>
              </div>
              {a.unlocked && (
                <div className={styles.cardBadge}>Unlocked</div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
