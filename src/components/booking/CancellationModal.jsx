import { useState } from 'react'
import { computeCancellation } from '../../context/BookingContext'
import { formatPrice } from '../../utils/format'
import styles from './CancellationModal.module.css'

const CANCEL_REASONS = [
  'Change in plans',
  'Found a better option',
  'Work / personal emergency',
  'Travel not required anymore',
  'Booked by mistake',
  'Others',
]

/**
 * CancellationModal
 * @param {object} booking     - the booking to cancel
 * @param {function} onConfirm - called with (bookingId, reason)
 * @param {function} onClose   - called to dismiss modal
 */
export default function CancellationModal({ booking, onConfirm, onClose }) {
  const [reason,    setReason]    = useState('')
  const [confirmed, setConfirmed] = useState(false)

  const { policy, cancellationFee, refundAmount } = computeCancellation(booking)

  const noRefund = refundAmount <= 0

  function handleConfirm() {
    onConfirm(booking.bookingId, reason)
    setConfirmed(true)
  }

  // ── Success state ─────────────────────────────────────────
  if (confirmed) {
    return (
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={e => e.stopPropagation()}>
          <div className={styles.successState}>
            <div className={styles.successIcon}>✓</div>
            <h3 className={styles.successTitle}>Booking Cancelled</h3>
            <p className={styles.successSub}>
              Your booking has been cancelled successfully.
            </p>
            {refundAmount > 0 ? (
              <div className={styles.refundNote}>
                <span className={styles.refundIcon}>💰</span>
                Refund of <strong>{formatPrice(refundAmount)}</strong> will be processed within 5–7 business days.
              </div>
            ) : (
              <div className={styles.noRefundNote}>
                No refund applicable as per cancellation policy.
              </div>
            )}
            <button className={styles.doneBtn} onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Confirmation state ────────────────────────────────────
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.warningIcon}>⚠️</div>
          <div className={styles.headerText}>
            <h3 className={styles.title}>Cancel Booking</h3>
            <p className={styles.subtitle}>PNR: <strong>{booking.pnr}</strong></p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Route summary */}
        <div className={styles.routeSummary}>
          <span className={styles.routeCity}>{booking.bus.from}</span>
          <span className={styles.routeArrow}>→</span>
          <span className={styles.routeCity}>{booking.bus.to}</span>
          <span className={styles.routeDate}>
            {booking.travelDate
              ? new Date(booking.travelDate + 'T00:00:00').toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })
              : '—'}
          </span>
        </div>

        {/* Policy info */}
        <div className={styles.policyBadge}>
          <span className={styles.policyIcon}>ℹ️</span>
          {policy.label}
        </div>

        {/* Charges breakdown */}
        <div className={styles.chargesCard}>
          <div className={styles.chargeRow}>
            <span className={styles.chargeLabel}>Total Paid</span>
            <span className={styles.chargeVal}>{formatPrice(booking.totalFare)}</span>
          </div>
          <div className={styles.chargeRow}>
            <span className={styles.chargeLabel}>Cancellation Fee ({policy.chargePct}%)</span>
            <span className={styles.chargeNeg}>− {formatPrice(cancellationFee)}</span>
          </div>
          <div className={styles.chargeDivider} />
          <div className={styles.chargeRow}>
            <span className={styles.refundLabel}>Refund Amount</span>
            <span
              className={styles.refundVal}
              style={{ color: noRefund ? '#EF4444' : '#22C55E' }}
            >
              {noRefund ? 'No Refund' : formatPrice(refundAmount)}
            </span>
          </div>
        </div>

        {/* Reason */}
        <div className={styles.reasonGroup}>
          <label className={styles.reasonLabel}>Reason for cancellation (optional)</label>
          <select
            className={styles.reasonSelect}
            value={reason}
            onChange={e => setReason(e.target.value)}
          >
            <option value="">Select a reason</option>
            {CANCEL_REASONS.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button className={styles.goBackBtn} onClick={onClose}>
            Go Back
          </button>
          <button className={styles.confirmBtn} onClick={handleConfirm}>
            Yes, Cancel Booking
          </button>
        </div>

      </div>
    </div>
  )
}
