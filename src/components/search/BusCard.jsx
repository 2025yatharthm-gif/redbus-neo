import { useNavigate } from 'react-router-dom'
import { useSettings } from '../../context/SettingsContext'
import { getBusPersonality, getSleepComfortScore, getCrowdLevel } from '../../data/busEnrich'
import PersonalityTag from '../features/PersonalityTag'
import ComfortScore   from '../features/ComfortScore'
import CrowdMeter     from '../features/CrowdMeter'
import Badge from '../ui/Badge'
import styles from './BusCard.module.css'

export default function BusCard({ bus }) {
  const navigate    = useNavigate()
  const { formatCurrency } = useSettings()

  const personality = getBusPersonality(bus)
  const comfort     = getSleepComfortScore(bus)
  const crowd       = getCrowdLevel(bus)
  const badgeVariant = bus.isAC ? 'brand' : 'muted'

  function handleSelect() { navigate(`/seats/${bus.id}`) }

  return (
    <article
      className={styles.card}
      onClick={handleSelect}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleSelect()}
    >
      {/* ── Operator column ─────────────────── */}
      <div className={styles.operatorCol}>
        <div className={styles.operatorLogo}>{bus.operator.charAt(0)}</div>
        <div className={styles.operatorInfo}>
          <span className={styles.operatorName}>{bus.operator}</span>
          <Badge variant={badgeVariant}>{bus.type}</Badge>
          <PersonalityTag personality={personality} size="sm" />
          {bus.amenities.length > 0 && (
            <div className={styles.amenities}>
              {bus.amenities.map(a => (
                <span key={a} className={styles.amenityPill}>{a}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Route timeline ──────────────────── */}
      <div className={styles.routeCol}>
        <div className={styles.timePoint}>
          <span className={styles.time}>{bus.departure}</span>
          <span className={styles.city}>{bus.from}</span>
        </div>
        <div className={styles.timeline}>
          <span className={styles.dot} />
          <div className={styles.line}>
            <span className={styles.durationBadge}>{bus.duration}</span>
          </div>
          <span className={styles.dot} />
        </div>
        <div className={styles.timePoint}>
          <span className={styles.time}>{bus.arrival}</span>
          <span className={styles.city}>{bus.to}</span>
        </div>
      </div>

      {/* ── Meta column ─────────────────────── */}
      <div className={styles.metaCol}>
        <div className={styles.ratingRow}>
          <span className={styles.starIcon}>★</span>
          <span className={styles.ratingVal}>{bus.rating.toFixed(1)}</span>
        </div>
        <ComfortScore score={comfort} size="sm" />
        <CrowdMeter crowd={crowd} seatsAvailable={bus.seatsAvailable} />
        <span className={crowd.level === 'High Demand' ? styles.seatsLow : styles.seatsOk}>
          {bus.seatsAvailable} seat{bus.seatsAvailable !== 1 ? 's' : ''} left
        </span>
      </div>

      {/* ── Price + CTA ─────────────────────── */}
      <div className={styles.priceCol}>
        <div className={styles.priceBlock}>
          <span className={styles.priceFrom}>from</span>
          <span className={styles.price}>{formatCurrency(bus.price)}</span>
        </div>
        <button
          className={styles.cta}
          onClick={e => { e.stopPropagation(); handleSelect() }}
        >
          Select seats
        </button>
      </div>
    </article>
  )
}
