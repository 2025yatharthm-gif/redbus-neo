import { createContext, useContext, useState, useCallback } from 'react'

const BookingContext = createContext(null)

// ── Add-on definitions ──────────────────────────────────────
export const ADD_ONS = [
  {
    id:      'insurance',
    label:   'Travel Insurance',
    desc:    'Covers cancellation, delay & medical emergencies',
    icon:    '🛡️',
    price:   149,
    perSeat: false,
  },
  {
    id:      'luggage',
    label:   'Extra Luggage (10kg)',
    desc:    'Additional 10kg checked baggage allowance',
    icon:    '🧳',
    price:   199,
    perSeat: false,
  },
  {
    id:      'priority',
    label:   'Priority Boarding',
    desc:    'Board first, guaranteed overhead space',
    icon:    '⚡',
    price:   99,
    perSeat: false,
  },
]

const SERVICE_FEE_RATE = 0.05

// ── Cancellation charge rules ───────────────────────────────
/**
 * Returns { chargeRate, chargePct, refundPct, label }
 * hoursUntilDeparture: number of hours between now and departure
 */
export function getCancellationPolicy(hoursUntilDeparture) {
  if (hoursUntilDeparture > 24) {
    return { chargeRate: 0.10, chargePct: 10,  refundPct: 90,  label: 'More than 24 hrs before departure' }
  }
  if (hoursUntilDeparture > 12) {
    return { chargeRate: 0.25, chargePct: 25,  refundPct: 75,  label: '12–24 hrs before departure' }
  }
  if (hoursUntilDeparture > 6) {
    return { chargeRate: 0.50, chargePct: 50,  refundPct: 50,  label: '6–12 hrs before departure' }
  }
  return   { chargeRate: 1.00, chargePct: 100, refundPct: 0,   label: 'Less than 6 hrs before departure' }
}

/**
 * Given a booking, compute cancellation charges and refund.
 * Uses travelDate + bus.departure to find hours until departure.
 * Falls back to >24h policy when date is missing (upcoming booking demo).
 */
export function computeCancellation(booking) {
  let hoursUntilDeparture = 48 // safe default = generous refund for demo

  if (booking.travelDate && booking.bus?.departure) {
    const [h, m]     = booking.bus.departure.split(':').map(Number)
    const departure  = new Date(booking.travelDate + 'T00:00:00')
    departure.setHours(h, m, 0, 0)
    hoursUntilDeparture = (departure.getTime() - Date.now()) / 3_600_000
  }

  const policy         = getCancellationPolicy(hoursUntilDeparture)
  const cancellationFee = Math.round(booking.totalFare * policy.chargeRate)
  const refundAmount    = booking.totalFare - cancellationFee

  return { policy, cancellationFee, refundAmount, hoursUntilDeparture }
}

// ── Generators ──────────────────────────────────────────────
function generatePNR() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let pnr = ''
  for (let i = 0; i < 8; i++) pnr += chars[Math.floor(Math.random() * chars.length)]
  return pnr
}

function generateBookingId() {
  return 'RBN' + Date.now().toString(36).toUpperCase().slice(-6)
}

// ── Storage helpers ─────────────────────────────────────────
const STORAGE_KEY = 'redbus_neo_bookings'

function loadBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveBookings(bookings) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings)) } catch {}
}

// ── Provider ────────────────────────────────────────────────
export function BookingProvider({ children }) {
  const [draft,    setDraft]    = useState(null)
  const [bookings, setBookings] = useState(() => loadBookings())

  /** Called from SeatSelection → PassengerDetails */
  const initDraft = useCallback(({ bus, selectedSeats, baseFare, serviceFee, totalFare, travelDate }) => {
    setDraft({
      bus,
      selectedSeats,
      baseFare,
      serviceFee,
      totalFare,
      travelDate: travelDate || '',
      passengers: selectedSeats.map(seat => ({
        seatId:  seat.id,
        seatNum: seat.number,
        name:    '',
        age:     '',
        gender:  '',
      })),
      contact: { mobile: '', email: '' },
      addOns:  [],
    })
  }, [])

  const updateDraft = useCallback((patch) => {
    setDraft(prev => prev ? { ...prev, ...patch } : prev)
  }, [])

  function addOnTotal(addOns) {
    return addOns.reduce((sum, id) => {
      const a = ADD_ONS.find(x => x.id === id)
      return sum + (a ? a.price : 0)
    }, 0)
  }

  function getDraftTotal() {
    if (!draft) return 0
    return draft.totalFare + addOnTotal(draft.addOns)
  }

  /** Confirm booking after payment */
  const confirmBooking = useCallback(() => {
    if (!draft) return null

    const record = {
      bookingId:    generateBookingId(),
      pnr:          generatePNR(),
      bookedAt:     new Date().toISOString(),
      bus:          draft.bus,
      selectedSeats: draft.selectedSeats,
      passengers:   draft.passengers,
      contact:      draft.contact,
      addOns:       draft.addOns,
      baseFare:     draft.baseFare,
      serviceFee:   draft.serviceFee,
      addOnTotal:   addOnTotal(draft.addOns),
      totalFare:    getDraftTotal(),
      travelDate:   draft.travelDate,
      status:       'confirmed',
      cancelledAt:  null,
      refundAmount: null,
      cancellationFee: null,
    }

    const updated = [record, ...bookings]
    setBookings(updated)
    saveBookings(updated)
    setDraft(null)
    return record
  }, [draft, bookings])

  /** Cancel a confirmed booking */
  const cancelBooking = useCallback((bookingId, reason = '') => {
    const booking = bookings.find(b => b.bookingId === bookingId)
    if (!booking || booking.status === 'cancelled') return null

    const { cancellationFee, refundAmount } = computeCancellation(booking)

    const updated = bookings.map(b =>
      b.bookingId === bookingId
        ? {
            ...b,
            status:          'cancelled',
            cancelledAt:     new Date().toISOString(),
            cancellationFee,
            refundAmount,
            cancellationReason: reason,
          }
        : b
    )

    setBookings(updated)
    saveBookings(updated)
    return updated.find(b => b.bookingId === bookingId)
  }, [bookings])

  const clearDraft = useCallback(() => setDraft(null), [])

  return (
    <BookingContext.Provider value={{
      draft,
      bookings,
      initDraft,
      updateDraft,
      clearDraft,
      confirmBooking,
      cancelBooking,
      getDraftTotal,
      addOnTotal,
      ADD_ONS,
    }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be inside BookingProvider')
  return ctx
}
