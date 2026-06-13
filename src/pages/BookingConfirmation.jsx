import { useEffect, useRef, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useBooking }      from '../context/BookingContext'
import { useAchievements } from '../context/AchievementsContext'
import { formatPrice }     from '../utils/format'
import { getCarbonSavings } from '../data/busEnrich'
import BookingStepBar    from '../components/booking/BookingStepBar'
import CancellationModal from '../components/booking/CancellationModal'
import CarbonCard        from '../components/features/CarbonCard'
import styles from './BookingConfirmation.module.css'

export default function BookingConfirmation() {
  const { bookingId }              = useParams()
  const { state }                  = useLocation()
  const navigate                   = useNavigate()
  const { bookings, cancelBooking } = useBooking()
  const { evaluate, achievements } = useAchievements()
  const evaluated                  = useRef(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  // Resolve booking: from navigation state (fast) or stored bookings (refresh/deep-link)
  const booking = state?.booking
    ? (bookings.find(b => b.bookingId === state.booking.bookingId) || state.booking)
    : bookings.find(b => b.bookingId === bookingId)

  useEffect(() => {
    if (!booking) { navigate('/', { replace: true }); return }
    if (!evaluated.current) {
      evaluate(bookings)
      evaluated.current = true
    }
  }, [booking, bookings, evaluate, navigate])

  if (!booking) return null

  const {
    bus, passengers, selectedSeats, contact, addOns,
    baseFare, serviceFee, addOnTotal, totalFare,
    pnr, bookedAt, travelDate, status,
  } = booking

  const isCancelled = status === 'cancelled'

  // Is this an upcoming (cancellable) booking?
  const now = new Date()
  const isUpcoming = !isCancelled && (
    !travelDate || new Date(travelDate + 'T23:59:59') >= now
  )

  const journeyDate = travelDate
    ? new Date(travelDate + 'T00:00:00').toLocaleDateString('en-IN', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      })
    : 'Not specified'

  const bookedDateStr = new Date(bookedAt).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  const carbon = getCarbonSavings(bus, passengers.length)
  const newlyUnlocked = achievements.filter(a => a.unlocked)

  function handleCancelConfirm(bid, reason) {
    cancelBooking(bid, reason)
    // Modal handles showing success state; we let it close itself
  }

  function handlePrint() { window.print() }

  return (
    <div className={styles.page}>
      {/* allDone=true so step 4 shows ✓ */}
      <BookingStepBar current={4} allDone={true} />

      {/* ── Success / Cancelled banner ──────── */}
      {isCancelled ? (
        <div className={styles.cancelledBanner}>
          <div className={styles.successBannerInner}>
            <div className={styles.cancelledCheck}>✕</div>
            <div>
              <div className={styles.successTitle}>Booking Cancelled</div>
              <div className={styles.successSub}>
                {booking.refundAmount > 0
                  ? `Refund of ${formatPrice(booking.refundAmount)} will be processed within 5–7 business days.`
                  : 'No refund applicable as per cancellation policy.'}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.successBanner}>
          <div className={styles.successBannerInner}>
            <div className={styles.successCheck}>✓</div>
            <div>
              <div className={styles.successTitle}>Booking Confirmed!</div>
              <div className={styles.successSub}>
                Your e-ticket has been sent to {contact.email}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.content}>

        {/* ── Ticket card ─────────────────────── */}
        <div className={`${styles.ticketWrap} ${isCancelled ? styles.ticketCancelled : ''}`}>

          <div className={styles.ticketHeader}>
            <div className={styles.ticketBrand}>
              <span className={styles.ticketBrandIcon}>🚌</span>
              <span>Red<span className={styles.ticketBrandRed}>Bus</span> NEO</span>
            </div>
            <div className={styles.ticketMeta}>
              <div className={styles.pnrBlock}>
                <span className={styles.metaLabel}>PNR</span>
                <span className={styles.pnrVal}>{pnr}</span>
              </div>
              <div className={styles.bookingIdBlock}>
                <span className={styles.metaLabel}>Booking ID</span>
                <span className={styles.metaVal}>{booking.bookingId}</span>
              </div>
              {isCancelled && (
                <div className={styles.cancelBadgeHeader}>CANCELLED</div>
              )}
            </div>
          </div>

          <div className={styles.perforation}>
            <div className={styles.perfLeft} />
            <div className={styles.perfDots} />
            <div className={styles.perfRight} />
          </div>

          {/* Journey */}
          <div className={styles.journeySection}>
            <div className={styles.journeyRoute}>
              <div className={styles.journeyStop}>
                <span className={styles.journeyTime}>{bus.departure}</span>
                <span className={styles.journeyCity}>{bus.from}</span>
              </div>
              <div className={styles.journeyMid}>
                <span className={styles.journeyDuration}>{bus.duration}</span>
                <div className={styles.journeyArrowLine}>
                  <div className={styles.journeyLine} />
                  <span className={styles.journeyArrow}>→</span>
                </div>
              </div>
              <div className={styles.journeyStop}>
                <span className={styles.journeyTime}>{bus.arrival}</span>
                <span className={styles.journeyCity}>{bus.to}</span>
              </div>
            </div>
            <div className={styles.journeyMeta}>
              {[
                { label: 'Date',      val: journeyDate  },
                { label: 'Operator',  val: bus.operator },
                { label: 'Bus Type',  val: bus.type     },
                { label: 'Booked On', val: bookedDateStr },
              ].map(item => (
                <div key={item.label} className={styles.jMetaItem}>
                  <span className={styles.jMetaLabel}>{item.label}</span>
                  <span className={styles.jMetaVal}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.perforation}>
            <div className={styles.perfLeft} />
            <div className={styles.perfDots} />
            <div className={styles.perfRight} />
          </div>

          {/* Passengers */}
          <div className={styles.passSection}>
            <h3 className={styles.passTitle}>Passengers</h3>
            <div className={styles.passList}>
              {passengers.map((p, i) => (
                <div key={i} className={styles.passRow}>
                  <div className={styles.passInfo}>
                    <span className={styles.passName}>{p.name || '—'}</span>
                    <span className={styles.passMeta}>
                      {p.gender && p.gender !== 'prefer_not' ? p.gender : '—'}
                      {p.age ? `, ${p.age} yrs` : ''}
                    </span>
                  </div>
                  <div className={styles.passSeat}>Seat #{p.seatNum}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.perforation}>
            <div className={styles.perfLeft} />
            <div className={styles.perfDots} />
            <div className={styles.perfRight} />
          </div>

          {/* Fare */}
          <div className={styles.fareSection}>
            <div className={styles.fareGrid}>
              <div className={styles.fareItem}>
                <span className={styles.fareLabel}>Base fare</span>
                <span className={styles.fareVal}>{formatPrice(baseFare)}</span>
              </div>
              <div className={styles.fareItem}>
                <span className={styles.fareLabel}>Service fee</span>
                <span className={styles.fareVal}>{formatPrice(serviceFee)}</span>
              </div>
              {addOns && addOns.length > 0 && (
                <div className={styles.fareItem}>
                  <span className={styles.fareLabel}>Add-ons</span>
                  <span className={styles.fareVal}>{formatPrice(addOnTotal)}</span>
                </div>
              )}
              {isCancelled && booking.cancellationFee != null && (
                <div className={styles.fareItem}>
                  <span className={styles.fareLabel}>Cancellation Fee</span>
                  <span className={styles.fareVal} style={{ color: '#EF4444' }}>
                    − {formatPrice(booking.cancellationFee)}
                  </span>
                </div>
              )}
              <div className={`${styles.fareItem} ${styles.fareTotal}`}>
                <span className={styles.fareTotalLabel}>
                  {isCancelled ? 'Refund Amount' : 'Total Paid'}
                </span>
                <span
                  className={styles.fareTotalVal}
                  style={{ color: isCancelled ? (booking.refundAmount > 0 ? '#22C55E' : '#EF4444') : undefined }}
                >
                  {isCancelled
                    ? (booking.refundAmount > 0 ? formatPrice(booking.refundAmount) : 'No Refund')
                    : formatPrice(totalFare)
                  }
                </span>
              </div>
            </div>
            <div className={styles.contactRow}>
              <span className={styles.contactIcon}>📱</span>
              <span className={styles.contactVal}>{contact.mobile}</span>
              <span className={styles.contactIcon}>✉️</span>
              <span className={styles.contactVal}>{contact.email}</span>
            </div>
          </div>

          {/* QR (only for confirmed) */}
          {!isCancelled && (
            <div className={styles.qrSection}>
              <div className={styles.qrBox}>
                <div className={styles.qrGrid}>
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} className={`${styles.qrCell} ${(i * 7 + i) % 3 === 0 ? styles.qrDark : ''}`} />
                  ))}
                </div>
              </div>
              <div className={styles.qrLabel}>Show this QR at boarding</div>
            </div>
          )}

        </div>

        {/* ── Carbon savings (confirmed only) ── */}
        {!isCancelled && <CarbonCard saved={carbon.saved} dist={carbon.dist} />}

        {/* ── Achievements ─────────────────── */}
        {!isCancelled && newlyUnlocked.length > 0 && (
          <div className={styles.achievementsCard}>
            <div className={styles.achievementsTitle}>🏆 Achievements Unlocked</div>
            <div className={styles.achievementsList}>
              {newlyUnlocked.map(a => (
                <div key={a.id} className={styles.achievementChip}>
                  <span>{a.icon}</span>
                  <span>{a.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Actions ─────────────────────── */}
        <div className={styles.actions}>
          {isUpcoming && (
            <button
              className={styles.cancelTicketBtn}
              onClick={() => setShowCancelModal(true)}
            >
              ✕ Cancel Ticket
            </button>
          )}
          <button className={styles.printBtn} onClick={handlePrint}>
            🖨️ Print Ticket
          </button>
          <button className={styles.bookingsBtn} onClick={() => navigate('/my-bookings')}>
            📋 My Bookings
          </button>
          <button className={styles.homeBtn} onClick={() => navigate('/')}>
            🏠 Book Another
          </button>
        </div>

      </div>

      {/* Cancellation modal */}
      {showCancelModal && (
        <CancellationModal
          booking={booking}
          onConfirm={handleCancelConfirm}
          onClose={() => setShowCancelModal(false)}
        />
      )}
    </div>
  )
}
