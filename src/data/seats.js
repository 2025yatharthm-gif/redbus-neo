/**
 * seats.js — Phase 3 seat data layer
 *
 * Generates a deterministic seat layout for any bus.
 * Layout depends on bus type (sleeper vs seater) and a seeded PRNG
 * so the same bus always produces the same seat map.
 */

// ─── Seat status constants ───────────────────────────────────
export const SEAT_STATUS = {
  AVAILABLE: 'available',
  BOOKED:    'booked',
  SELECTED:  'selected',   // client-side only
}

// ─── Seat attribute constants ────────────────────────────────
export const SEAT_ATTR = {
  WINDOW:       'window',
  AISLE:        'aisle',
  MIDDLE:       'middle',
  PREMIUM:      'premium',
  EXTRA_LEGROOM:'extra_legroom',
}

// ─── Simple seeded PRNG (Mulberry32) ────────────────────────
function seededRng(seed) {
  let s = seed
  return function () {
    s |= 0; s = s + 0x6D2B79F5 | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ─── Hash bus ID to numeric seed ────────────────────────────
function hashId(id) {
  let h = 0
  for (let i = 0; i < id.length; i++) {
    h = (Math.imul(31, h) + id.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

// ─── Seat attribute derivation ───────────────────────────────
/**
 * Given a column index and total columns, assign window/aisle/middle.
 * Columns: 0-indexed. Layout is [A, B | gap | C, D] for 4-wide
 */
function deriveAttr(col, totalCols, rng, isPremiumRow) {
  const attrs = []

  if (totalCols === 4) {
    // Columns: 0=A(window), 1=B(aisle), 2=C(aisle), 3=D(window)
    if (col === 0 || col === 3) attrs.push(SEAT_ATTR.WINDOW)
    else attrs.push(SEAT_ATTR.AISLE)
  } else if (totalCols === 3) {
    // Columns: 0=A(window), 1=B(middle), 2=C(window)
    if (col === 0 || col === 2) attrs.push(SEAT_ATTR.WINDOW)
    else attrs.push(SEAT_ATTR.MIDDLE)
  } else if (totalCols === 2) {
    // Sleeper: each berth is window
    attrs.push(SEAT_ATTR.WINDOW)
  }

  if (isPremiumRow) attrs.push(SEAT_ATTR.PREMIUM)
  if (rng() < 0.08) attrs.push(SEAT_ATTR.EXTRA_LEGROOM)

  return attrs
}

// ─── Build a single deck layout ─────────────────────────────
/**
 * @param {string}  busId
 * @param {boolean} isSleeper
 * @param {'lower'|'upper'} deck
 * @param {number}  totalSeats  - target total for this deck
 * @returns {Array<Array<Seat|null>>}  - rows of seats (null = aisle gap)
 */
function buildDeck(busId, isSleeper, deck, totalSeats) {
  const rng = seededRng(hashId(`${busId}-${deck}`))

  // Seater: 4-column [A B | gap | C D], Sleeper: 2-column [L | gap | U] style
  const cols = isSleeper ? 2 : 4
  const rows = Math.ceil(totalSeats / cols)

  // ~30–40% of seats randomly booked
  const bookedProbability = 0.3 + rng() * 0.15

  const layout = []  // Array of rows; each row is Array<Seat|null>

  let seatNumber = deck === 'upper' ? 100 : 1  // Upper deck starts at 100

  for (let r = 0; r < rows; r++) {
    const row = []
    const isPremiumRow = r === 0  // Front row = premium

    for (let c = 0; c < cols; c++) {
      // Insert aisle gap between col 1 and 2 for seater; between col 0 and 1 for sleeper
      if (!isSleeper && c === 2) row.push(null)  // aisle gap for seater
      if (isSleeper  && c === 1) row.push(null)  // aisle gap for sleeper

      const isBooked = rng() < bookedProbability
      const attrs    = deriveAttr(c, cols, rng, isPremiumRow)

      // Price premium for attributes
      let priceMult = 1.0
      if (attrs.includes(SEAT_ATTR.PREMIUM))      priceMult += 0.25
      if (attrs.includes(SEAT_ATTR.EXTRA_LEGROOM)) priceMult += 0.15
      if (attrs.includes(SEAT_ATTR.WINDOW))        priceMult += 0.05

      const id = `${busId}-${deck}-${r}-${c}`

      row.push({
        id,
        number: String(seatNumber),
        row:    r,
        col:    c,
        deck,
        status: isBooked ? SEAT_STATUS.BOOKED : SEAT_STATUS.AVAILABLE,
        attrs,
        priceMult: Math.round(priceMult * 100) / 100,
      })

      seatNumber++
    }

    layout.push(row)
  }

  return layout
}

// ─── Public API ──────────────────────────────────────────────

/**
 * Generate a full seat map for a bus.
 * @param {object} bus  - bus object from buses.js
 * @returns {{ lower: Array, upper: Array, hasTwoDecks: boolean }}
 */
export function generateSeatMap(bus) {
  const hasTwoDecks = bus.isSleeper
  const totalSeats  = 40

  const lowerCount = hasTwoDecks ? Math.ceil(totalSeats / 2) : totalSeats
  const upperCount = hasTwoDecks ? Math.floor(totalSeats / 2) : 0

  return {
    lower:       buildDeck(bus.id, bus.isSleeper, 'lower', lowerCount),
    upper:       hasTwoDecks ? buildDeck(bus.id, bus.isSleeper, 'upper', upperCount) : [],
    hasTwoDecks,
  }
}

/**
 * Compute the price for a single seat.
 */
export function seatPrice(baseFare, seat) {
  return Math.round(baseFare * seat.priceMult)
}

/**
 * Flat list of all seats in a layout.
 */
export function flatSeats(layout) {
  return layout.flat().filter(Boolean)
}
