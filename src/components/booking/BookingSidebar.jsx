import { useBooking }  from '../../context/BookingContext'
import { useSettings } from '../../context/SettingsContext'
import styles from './BookingSidebar.module.css'

export default function BookingSidebar() {
  const { draft, getDraftTotal, addOnTotal, ADD_ONS } = useBooking()
  const { formatCurrency } = useSettings()

  if (!draft) return null

  const { bus, selectedSeats, baseFare, serviceFee, addOns } = draft
  const grandTotal = getDraftTotal()

  return (
    <aside className={styles.sidebar}>
      <h3 className={styles.title}>Order Summary</h3>

      <div className={styles.busBlock}>
        <div className={styles.busOp}>{bus.operator}</div>
        <div className={styles.busRoute}>{bus.from} → {bus.to}</div>
        <div className={styles.busMeta}>{bus.departure} · {bus.duration} · {bus.type}</div>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.sectionLabel}>Seats</div>
        <div className={styles.seatList}>
          {selectedSeats.map(s => (
            <div key={s.id} className={styles.seatRow}>
              <span className={styles.seatNum}>Seat #{s.number}</span>
              <span className={styles.seatFare}>{formatCurrency(Math.round(bus.price * s.priceMult))}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.fareBlock}>
        <div className={styles.fareRow}>
          <span className={styles.fareLabel}>Base fare</span>
          <span className={styles.fareVal}>{formatCurrency(baseFare)}</span>
        </div>
        <div className={styles.fareRow}>
          <span className={styles.fareLabel}>Service fee (5%)</span>
          <span className={styles.fareVal}>{formatCurrency(serviceFee)}</span>
        </div>
        {addOns.map(id => {
          const addon = ADD_ONS.find(a => a.id === id)
          return addon ? (
            <div key={id} className={styles.fareRow}>
              <span className={styles.fareLabel}>{addon.icon} {addon.label}</span>
              <span className={styles.fareVal}>{formatCurrency(addon.price)}</span>
            </div>
          ) : null
        })}
      </div>

      <div className={styles.divider} />

      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>Total payable</span>
        <span className={styles.totalVal}>{formatCurrency(grandTotal)}</span>
      </div>

      <p className={styles.note}>Inclusive of all taxes &amp; fees.</p>
    </aside>
  )
}
