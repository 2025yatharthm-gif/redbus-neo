import { useSeat } from '../../context/SeatContext'
import { SEAT_STATUS, SEAT_ATTR } from '../../data/seats'
import styles from './SeatCell.module.css'

// Attribute icon map
const ATTR_ICONS = {
  [SEAT_ATTR.WINDOW]:       '🪟',
  [SEAT_ATTR.AISLE]:        null,   // no icon, implied by position
  [SEAT_ATTR.MIDDLE]:       null,
  [SEAT_ATTR.PREMIUM]:      '⭐',
  [SEAT_ATTR.EXTRA_LEGROOM]:'↕',
}

export default function SeatCell({ seat }) {
  const { toggleSeat, getSeatStatus } = useSeat()

  const status = getSeatStatus(seat)
  const isBooked   = status === SEAT_STATUS.BOOKED
  const isSelected = status === SEAT_STATUS.SELECTED

  const hasPremium     = seat.attrs.includes(SEAT_ATTR.PREMIUM)
  const hasExtraLegroom = seat.attrs.includes(SEAT_ATTR.EXTRA_LEGROOM)
  const hasWindow      = seat.attrs.includes(SEAT_ATTR.WINDOW)

  const classNames = [
    styles.seat,
    styles[status],
    hasPremium      ? styles.premium      : '',
    hasExtraLegroom ? styles.extraLegroom : '',
  ].filter(Boolean).join(' ')

  const tooltipParts = []
  if (hasPremium)      tooltipParts.push('Premium')
  if (hasExtraLegroom) tooltipParts.push('Extra Legroom')
  if (hasWindow)       tooltipParts.push('Window')
  if (isBooked)        tooltipParts.push('Booked')
  const tooltip = tooltipParts.join(' · ') || `Seat ${seat.number}`

  return (
    <button
      className={classNames}
      onClick={() => toggleSeat(seat)}
      disabled={isBooked}
      title={`Seat ${seat.number}${tooltip ? ' — ' + tooltip : ''}`}
      aria-label={`Seat ${seat.number}, ${status}${tooltip ? ', ' + tooltip : ''}`}
      aria-pressed={isSelected}
    >
      <span className={styles.number}>{seat.number}</span>

      {/* Attribute indicators */}
      {!isBooked && (
        <span className={styles.icons}>
          {hasPremium      && <span className={styles.attrIcon}>⭐</span>}
          {hasExtraLegroom && <span className={styles.attrIcon} style={{ fontSize: '9px', fontWeight: 700, fontFamily: 'monospace' }}>↕</span>}
        </span>
      )}

      {isBooked && <span className={styles.bookedX}>✕</span>}
    </button>
  )
}
