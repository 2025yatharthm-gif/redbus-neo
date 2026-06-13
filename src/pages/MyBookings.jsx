import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../context/BookingContext'
import { formatPrice } from '../utils/format'
import CancellationModal from '../components/booking/CancellationModal'
import styles from './MyBookings.module.css'

export default function MyBookings() {
  const navigate = useNavigate()
  const { bookings, cancelBooking } = useBooking()
  const [cancellingId, setCancellingId] = useState(null)

  const now = new Date()

  // Partition bookings into three groups
  const upcoming = bookings.filter(b =>
    b.status !== 'cancelled' &&
    (!b.travelDate || new Date(b.travelDate + 'T23:59:59') >= now)
  )

  const past = bookings.filter(b =>
    b.status !== 'cancelled' &&
    b.travelDate &&
    new Date(b.travelDate + 'T23:59:59') < now
  )

  const cancelled = bookings.filter(b => b.status === 'cancelled')

  // Booking being cancelled (for the modal)
  const cancellingBooking = cancellingId
    ? bookings.find(b => b.bookingId === cancellingId)
    : null

  function handleCancelConfirm(bookingId, reason) {
    cancelBooking(bookingId, reason)
    // keep modal open to show success state — modal handles close
  }

  function handleModalClose() {
    setCancellingId(null)
  }

  if (bookings.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderInner}>
            <h1 className={styles.pageTitle}>My Bookings</h1>
          </div>
        </div>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🎟️</div>
          <h2 className={styles.emptyTitle}>No bookings yet</h2>
          <p className={styles.emptySub}>Your confirmed bookings will appear here.</p>
          <button className={styles.searchBtn} onClick={() => navigate('/')}>Search Buses</button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <h1 className={styles.pageTitle}>My Bookings</h1>
          <span className={styles.pageCount}>{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className={styles.content}>

        {upcoming.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionDot} style={{ background: 'var(--color-success)' }} />
              Upcoming
            </h2>
            <div className={styles.cardList}>
              {upcoming.map(b => (
                <BookingCard
                  key={b.bookingId}
                  booking={b}
                  navigate={navigate}
                  onCancel={() => setCancellingId(b.bookingId)}
                />
              ))}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionDot} style={{ background: 'var(--color-text-muted)' }} />
              Past Journeys
            </h2>
            <div className={styles.cardList}>
              {past.map(b => (
                <BookingCard key={b.bookingId} booking={b} navigate={navigate} isPast />
              ))}
            </div>
          </section>
        )}

        {cancelled.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionDot} style={{ background: '#EF4444' }} />
              Cancelled
            </h2>
            <div className={styles.cardList}>
              {cancelled.map(b => (
                <BookingCard key={b.bookingId} booking={b} navigate={navigate} isCancelled />
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Cancellation modal */}
      {cancellingBooking && (
        <CancellationModal
          booking={cancellingBooking}
          onConfirm={handleCancelConfirm}
          onClose={handleModalClose}
        />
      )}
    </div>
  )
}

function BookingCard({ booking, navigate, isPast, isCancelled, onCancel }) {
  const { bus, pnr, selectedSeats, totalFare, travelDate,
          passengers, bookingId, cancelledAt, refundAmount } = booking

  const dateStr = travelDate
    ? new Date(travelDate + 'T00:00:00').toLocaleDateString('en-IN', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
      })
    : 'Date not set'

  const cancelledDateStr = cancelledAt
    ? new Date(cancelledAt).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric'
      })
    : null

  let statusLabel = 'Confirmed'
  let statusDotClass = styles.dotUpcoming
  if (isPast)      { statusLabel = 'Completed';  statusDotClass = styles.dotPast }
  if (isCancelled) { statusLabel = 'Cancelled';  statusDotClass = styles.dotCancelled }

  return (
    <div className={`${styles.card} ${isPast ? styles.cardPast : ''} ${isCancelled ? styles.cardCancelled : ''}`}>

      {/* Header */}
      <div className={styles.cardHeader}>
        <div className={styles.cardPnr}>
          <span className={styles.pnrLabel}>PNR</span>
          <span className={styles.pnrVal}>{pnr}</span>
        </div>
        <div className={styles.cardStatus}>
          <span className={`${styles.statusDot} ${statusDotClass}`} />
          {statusLabel}
        </div>
      </div>

      {/* Route */}
      <div className={styles.cardRoute}>
        <div className={styles.cardStop}>
          <span className={styles.cardTime}>{bus.departure}</span>
          <span className={styles.cardCity}>{bus.from}</span>
        </div>
        <div className={styles.cardMid}>
          <span className={styles.cardDuration}>{bus.duration}</span>
          <div className={styles.cardLine} />
        </div>
        <div className={styles.cardStop}>
          <span className={styles.cardTime}>{bus.arrival}</span>
          <span className={styles.cardCity}>{bus.to}</span>
        </div>
      </div>

      {/* Meta */}
      <div className={styles.cardMeta}>
        <div className={styles.cardMetaItem}>
          <span className={styles.cardMetaLabel}>Date</span>
          <span className={styles.cardMetaVal}>{dateStr}</span>
        </div>
        <div className={styles.cardMetaItem}>
          <span className={styles.cardMetaLabel}>Operator</span>
          <span className={styles.cardMetaVal}>{bus.operator}</span>
        </div>
        <div className={styles.cardMetaItem}>
          <span className={styles.cardMetaLabel}>Seats</span>
          <span className={styles.cardMetaVal}>{selectedSeats.map(s => '#' + s.number).join(', ')}</span>
        </div>
        <div className={styles.cardMetaItem}>
          <span className={styles.cardMetaLabel}>Passengers</span>
          <span className={styles.cardMetaVal}>{passengers.length}</span>
        </div>

        {/* Extra info for cancelled */}
        {isCancelled && cancelledDateStr && (
          <div className={styles.cardMetaItem}>
            <span className={styles.cardMetaLabel}>Cancelled On</span>
            <span className={styles.cardMetaVal}>{cancelledDateStr}</span>
          </div>
        )}
        {isCancelled && refundAmount != null && (
          <div className={styles.cardMetaItem}>
            <span className={styles.cardMetaLabel}>Refund</span>
            <span className={styles.cardMetaVal} style={{ color: refundAmount > 0 ? '#22C55E' : '#EF4444' }}>
              {refundAmount > 0 ? formatPrice(refundAmount) : 'No refund'}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={styles.cardFooter}>
        <span className={styles.cardFare}>{formatPrice(totalFare)}</span>
        <div className={styles.cardFooterActions}>
          {!isCancelled && !isPast && onCancel && (
            <button className={styles.cardCancelBtn} onClick={onCancel}>
              Cancel Booking
            </button>
          )}
          <button
            className={styles.cardViewBtn}
            onClick={() => navigate(`/booking-confirmation/${bookingId}`)}
          >
            View Ticket →
          </button>
        </div>
      </div>

    </div>
  )
}
