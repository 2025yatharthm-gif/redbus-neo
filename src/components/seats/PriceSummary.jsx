import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSettings } from '../../context/SettingsContext'
import { useSeat } from '../../context/SeatContext'
import { useBooking } from '../../context/BookingContext'
import { formatPrice } from '../../utils/format'
import { SEAT_ATTR } from '../../data/seats'
import styles from './PriceSummary.module.css'

export default function PriceSummary() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { bus, selectedSeats, baseFare, serviceFee, totalFare } = useSeat()
  const { formatCurrency } = useSettings()
  const { initDraft } = useBooking()

  const hasSelection = selectedSeats.length > 0

  function handleProceed() {
    // Initialise booking draft and hand off to passenger details
    initDraft({
      bus,
      selectedSeats,
      baseFare,
      serviceFee,
      totalFare,
      travelDate: searchParams.get('date') || '',
    })
    navigate('/passengers')
  }

  return (
    <aside className={styles.card}>
      <h3 className={styles.title}>Booking Summary</h3>

      {/* Bus info */}
      <div className={styles.busInfo}>
        <div className={styles.busOp}>{bus.operator}</div>
        <div className={styles.busRoute}>{bus.from} → {bus.to}</div>
        <div className={styles.busTimes}>{bus.departure} · {bus.duration}</div>
      </div>

      <div className={styles.divider} />

      {/* Selected seats list */}
      {hasSelection ? (
        <div className={styles.seatList}>
          <div className={styles.seatListHeader}>
            <span className={styles.label}>Selected seats</span>
            <span className={styles.seatCount}>{selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''}</span>
          </div>
          <div className={styles.seats}>
            {selectedSeats.map(seat => (
              <SeatChip key={seat.id} seat={seat} baseFare={bus.price} />
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.emptyHint}>
          <span className={styles.emptyIcon}>💺</span>
          <span className={styles.emptyText}>Select seats to see pricing</span>
        </div>
      )}

      {/* Fare breakdown */}
      {hasSelection && (
        <>
          <div className={styles.divider} />
          <div className={styles.fareRows}>
            <div className={styles.fareRow}>
              <span className={styles.fareLabel}>Base fare</span>
              <span className={styles.fareVal}>{formatPrice(baseFare)}</span>
            </div>
            <div className={styles.fareRow}>
              <span className={styles.fareLabel}>Service fee (5%)</span>
              <span className={styles.fareVal}>{formatPrice(serviceFee)}</span>
            </div>
          </div>
          <div className={styles.divider} />
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalVal}>{formatPrice(totalFare)}</span>
          </div>
        </>
      )}

      {/* CTA */}
      <button
        className={styles.cta}
        disabled={!hasSelection}
        onClick={handleProceed}
      >
        {hasSelection
          ? `Continue · ${formatPrice(totalFare)}`
          : 'Select seats to continue'
        }
      </button>

      {hasSelection && (
        <p className={styles.disclaimer}>
          Fare includes all taxes. Free cancellation up to 2 hrs before departure.
        </p>
      )}
    </aside>
  )
}

function SeatChip({ seat, baseFare }) {
  const { toggleSeat } = useSeat()
  const isPremium = seat.attrs.includes(SEAT_ATTR.PREMIUM)
  const isWindow  = seat.attrs.includes(SEAT_ATTR.WINDOW)
  const isExtra   = seat.attrs.includes(SEAT_ATTR.EXTRA_LEGROOM)
  const price     = Math.round(baseFare * seat.priceMult)
  const tags      = []
  if (isPremium) tags.push('Premium')
  if (isWindow)  tags.push('Window')
  if (isExtra)   tags.push('+Legroom')

  return (
    <div className={styles.chip}>
      <div className={styles.chipLeft}>
        <span className={styles.chipNumber}>#{seat.number}</span>
        {tags.length > 0 && <span className={styles.chipTags}>{tags.join(' · ')}</span>}
      </div>
      <div className={styles.chipRight}>
        <span className={styles.chipPrice}>{formatPrice(price)}</span>
        <button className={styles.chipRemove} onClick={() => toggleSeat(seat)} title="Remove seat">
          ✕
        </button>
      </div>
    </div>
  )
}
