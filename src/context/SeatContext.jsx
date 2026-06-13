import { createContext, useContext, useState, useMemo, useCallback } from 'react'
import { generateSeatMap, seatPrice, SEAT_STATUS, flatSeats } from '../data/seats'

const SeatContext = createContext(null)

const SERVICE_FEE_RATE = 0.05   // 5% of base fare

export function SeatProvider({ bus, children }) {
  // Generate a stable seat map for this bus
  const seatMap = useMemo(() => generateSeatMap(bus), [bus])

  const [activeDeck,   setActiveDeck]   = useState('lower')
  const [selectedIds,  setSelectedIds]  = useState(new Set())

  // Toggle a seat selected/unselected
  const toggleSeat = useCallback((seat) => {
    if (seat.status === SEAT_STATUS.BOOKED) return

    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(seat.id)) {
        next.delete(seat.id)
      } else {
        if (next.size >= 6) return prev   // max 6 seats per booking
        next.add(seat.id)
      }
      return next
    })
  }, [])

  // Collect selected seat objects (with live status overlay)
  const selectedSeats = useMemo(() => {
    const all = [
      ...flatSeats(seatMap.lower),
      ...flatSeats(seatMap.upper),
    ]
    return all.filter(s => selectedIds.has(s.id))
  }, [seatMap, selectedIds])

  // Pricing
  const baseFare = useMemo(
    () => selectedSeats.reduce((sum, s) => sum + seatPrice(bus.price, s), 0),
    [selectedSeats, bus.price]
  )
  const serviceFee = Math.round(baseFare * SERVICE_FEE_RATE)
  const totalFare  = baseFare + serviceFee

  // Resolve runtime status for a seat (overlays selected state)
  function getSeatStatus(seat) {
    if (seat.status === SEAT_STATUS.BOOKED) return SEAT_STATUS.BOOKED
    if (selectedIds.has(seat.id))           return SEAT_STATUS.SELECTED
    return SEAT_STATUS.AVAILABLE
  }

  return (
    <SeatContext.Provider value={{
      bus,
      seatMap,
      activeDeck,
      setActiveDeck,
      selectedIds,
      selectedSeats,
      toggleSeat,
      getSeatStatus,
      baseFare,
      serviceFee,
      totalFare,
    }}>
      {children}
    </SeatContext.Provider>
  )
}

export function useSeat() {
  const ctx = useContext(SeatContext)
  if (!ctx) throw new Error('useSeat must be inside SeatProvider')
  return ctx
}
