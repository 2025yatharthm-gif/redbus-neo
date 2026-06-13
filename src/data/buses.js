/**
 * buses.js — Phase 5.2 expanded data layer
 * 400+ buses across 80 routes covering all major Indian cities.
 */

// ─── Operators ───────────────────────────────────────────────
const OPERATORS = [
  'VRL Travels',
  'SRS Travels',
  'Orange Travels',
  'Shivneri',
  'IntrCity SmartBus',
  'Neeta Travels',
  'Paulo Travels',
  'Kallada Travels',
  'KSRTC',
  'National Travels',
  'Parveen Travels',
  'Chartered Bus',
  'KPN Travels',
  'Zingbus',
  'Sharma Travels',
  'Jabbar Travels',
  'MSRTC',
  'GSRTC',
  'Raj National Express',
  'Greenline Travels',
  'Konduskar Travels',
  'Paulo Scania',
  'Eagle Travels',
  'Dolphin Travels',
  'Sugama Tourist',
]

// ─── Bus types ───────────────────────────────────────────────
export const BUS_TYPES = [
  'AC Sleeper',
  'AC Seater',
  'Non-AC Sleeper',
  'Non-AC Seater',
  'Volvo Multi Axle',
  'Bharat Benz Sleeper',
  'Semi Sleeper',
  'Luxury Sleeper',
  'Electric Coach',
]

// ─── Amenity sets by tier ────────────────────────────────────
const AMENITY_SETS = {
  luxury:   ['WiFi', 'Charging', 'Blanket', 'Water', 'Snacks', 'Entertainment'],
  premium:  ['WiFi', 'Charging', 'Blanket', 'Water', 'Snacks'],
  standard: ['WiFi', 'Charging', 'Blanket'],
  basic:    ['Charging'],
  minimal:  [],
}

// ─── Helpers ─────────────────────────────────────────────────
export function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function addMins(base, mins) {
  const total = timeToMinutes(base) + mins
  const h = Math.floor(total / 60) % 24
  const m = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function minsToLabel(mins) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

// ─── Route definitions ───────────────────────────────────────
// baseMins: realistic road travel duration
// distKm:   approximate road distance (for carbon calc)
const ROUTES = [
  // Maharashtra
  { from: 'Mumbai',     to: 'Pune',        baseMins: 210,  distKm: 150  },
  { from: 'Pune',       to: 'Mumbai',      baseMins: 210,  distKm: 150  },
  { from: 'Mumbai',     to: 'Nashik',      baseMins: 210,  distKm: 165  },
  { from: 'Nashik',     to: 'Mumbai',      baseMins: 210,  distKm: 165  },
  { from: 'Mumbai',     to: 'Goa',         baseMins: 510,  distKm: 600  },
  { from: 'Goa',        to: 'Mumbai',      baseMins: 510,  distKm: 600  },
  { from: 'Mumbai',     to: 'Nagpur',      baseMins: 750,  distKm: 870  },
  { from: 'Nagpur',     to: 'Mumbai',      baseMins: 750,  distKm: 870  },
  { from: 'Mumbai',     to: 'Aurangabad',  baseMins: 360,  distKm: 330  },
  { from: 'Aurangabad', to: 'Mumbai',      baseMins: 360,  distKm: 330  },
  { from: 'Mumbai',     to: 'Kolhapur',    baseMins: 360,  distKm: 380  },
  { from: 'Kolhapur',   to: 'Mumbai',      baseMins: 360,  distKm: 380  },
  { from: 'Pune',       to: 'Nashik',      baseMins: 240,  distKm: 210  },
  { from: 'Pune',       to: 'Nagpur',      baseMins: 660,  distKm: 710  },
  { from: 'Pune',       to: 'Goa',         baseMins: 420,  distKm: 460  },
  { from: 'Goa',        to: 'Pune',        baseMins: 420,  distKm: 460  },
  { from: 'Pune',       to: 'Kolhapur',    baseMins: 240,  distKm: 230  },
  { from: 'Nashik',     to: 'Pune',        baseMins: 240,  distKm: 210  },
  // Gujarat
  { from: 'Mumbai',     to: 'Ahmedabad',   baseMins: 450,  distKm: 530  },
  { from: 'Ahmedabad',  to: 'Mumbai',      baseMins: 450,  distKm: 530  },
  { from: 'Mumbai',     to: 'Surat',       baseMins: 270,  distKm: 285  },
  { from: 'Surat',      to: 'Mumbai',      baseMins: 270,  distKm: 285  },
  { from: 'Ahmedabad',  to: 'Surat',       baseMins: 195,  distKm: 265  },
  { from: 'Surat',      to: 'Ahmedabad',   baseMins: 195,  distKm: 265  },
  { from: 'Ahmedabad',  to: 'Vadodara',    baseMins: 120,  distKm: 110  },
  { from: 'Vadodara',   to: 'Ahmedabad',   baseMins: 120,  distKm: 110  },
  { from: 'Ahmedabad',  to: 'Rajkot',      baseMins: 210,  distKm: 215  },
  { from: 'Rajkot',     to: 'Ahmedabad',   baseMins: 210,  distKm: 215  },
  { from: 'Surat',      to: 'Vadodara',    baseMins: 120,  distKm: 155  },
  // Delhi NCR & Rajasthan
  { from: 'Delhi',      to: 'Jaipur',      baseMins: 300,  distKm: 280  },
  { from: 'Jaipur',     to: 'Delhi',       baseMins: 300,  distKm: 280  },
  { from: 'Delhi',      to: 'Agra',        baseMins: 210,  distKm: 235  },
  { from: 'Agra',       to: 'Delhi',       baseMins: 210,  distKm: 235  },
  { from: 'Delhi',      to: 'Chandigarh',  baseMins: 270,  distKm: 265  },
  { from: 'Chandigarh', to: 'Delhi',       baseMins: 270,  distKm: 265  },
  { from: 'Delhi',      to: 'Udaipur',     baseMins: 720,  distKm: 670  },
  { from: 'Udaipur',    to: 'Delhi',       baseMins: 720,  distKm: 670  },
  { from: 'Delhi',      to: 'Jodhpur',     baseMins: 540,  distKm: 600  },
  { from: 'Jodhpur',    to: 'Delhi',       baseMins: 540,  distKm: 600  },
  { from: 'Delhi',      to: 'Kota',        baseMins: 390,  distKm: 435  },
  { from: 'Jaipur',     to: 'Udaipur',     baseMins: 330,  distKm: 400  },
  { from: 'Udaipur',    to: 'Jaipur',      baseMins: 330,  distKm: 400  },
  { from: 'Jaipur',     to: 'Jodhpur',     baseMins: 300,  distKm: 330  },
  { from: 'Jodhpur',    to: 'Jaipur',      baseMins: 300,  distKm: 330  },
  { from: 'Delhi',      to: 'Amritsar',    baseMins: 450,  distKm: 455  },
  { from: 'Amritsar',   to: 'Delhi',       baseMins: 450,  distKm: 455  },
  { from: 'Delhi',      to: 'Dehradun',    baseMins: 330,  distKm: 300  },
  { from: 'Dehradun',   to: 'Delhi',       baseMins: 330,  distKm: 300  },
  // Karnataka
  { from: 'Bengaluru',  to: 'Chennai',     baseMins: 390,  distKm: 345  },
  { from: 'Chennai',    to: 'Bengaluru',   baseMins: 390,  distKm: 345  },
  { from: 'Bengaluru',  to: 'Mysore',      baseMins: 180,  distKm: 145  },
  { from: 'Mysore',     to: 'Bengaluru',   baseMins: 180,  distKm: 145  },
  { from: 'Bengaluru',  to: 'Hubli',       baseMins: 360,  distKm: 415  },
  { from: 'Hubli',      to: 'Bengaluru',   baseMins: 360,  distKm: 415  },
  { from: 'Bengaluru',  to: 'Mangalore',   baseMins: 420,  distKm: 360  },
  { from: 'Mangalore',  to: 'Bengaluru',   baseMins: 420,  distKm: 360  },
  { from: 'Bengaluru',  to: 'Hyderabad',   baseMins: 570,  distKm: 570  },
  { from: 'Bengaluru',  to: 'Goa',         baseMins: 480,  distKm: 600  },
  { from: 'Goa',        to: 'Bengaluru',   baseMins: 480,  distKm: 600  },
  // Tamil Nadu
  { from: 'Chennai',    to: 'Coimbatore',  baseMins: 480,  distKm: 500  },
  { from: 'Coimbatore', to: 'Chennai',     baseMins: 480,  distKm: 500  },
  { from: 'Chennai',    to: 'Madurai',     baseMins: 480,  distKm: 460  },
  { from: 'Madurai',    to: 'Chennai',     baseMins: 480,  distKm: 460  },
  { from: 'Chennai',    to: 'Tirupati',    baseMins: 210,  distKm: 155  },
  { from: 'Coimbatore', to: 'Bengaluru',   baseMins: 360,  distKm: 360  },
  { from: 'Bengaluru',  to: 'Coimbatore',  baseMins: 360,  distKm: 360  },
  // Telangana & Andhra Pradesh
  { from: 'Hyderabad',  to: 'Bengaluru',   baseMins: 570,  distKm: 570  },
  { from: 'Hyderabad',  to: 'Chennai',     baseMins: 510,  distKm: 630  },
  { from: 'Chennai',    to: 'Hyderabad',   baseMins: 510,  distKm: 630  },
  { from: 'Hyderabad',  to: 'Vijayawada',  baseMins: 330,  distKm: 275  },
  { from: 'Vijayawada', to: 'Hyderabad',   baseMins: 330,  distKm: 275  },
  { from: 'Hyderabad',  to: 'Warangal',    baseMins: 150,  distKm: 150  },
  { from: 'Warangal',   to: 'Hyderabad',   baseMins: 150,  distKm: 150  },
  { from: 'Hyderabad',  to: 'Tirupati',    baseMins: 450,  distKm: 530  },
  // Cross-region long routes
  { from: 'Mumbai',     to: 'Hyderabad',   baseMins: 720,  distKm: 710  },
  { from: 'Hyderabad',  to: 'Mumbai',      baseMins: 720,  distKm: 710  },
  { from: 'Mumbai',     to: 'Bengaluru',   baseMins: 720,  distKm: 985  },
  { from: 'Bengaluru',  to: 'Mumbai',      baseMins: 720,  distKm: 985  },
  { from: 'Delhi',      to: 'Mumbai',      baseMins: 1080, distKm: 1450 },
  { from: 'Mumbai',     to: 'Delhi',       baseMins: 1080, distKm: 1450 },
  { from: 'Pune',       to: 'Hyderabad',   baseMins: 600,  distKm: 560  },
  { from: 'Hyderabad',  to: 'Pune',        baseMins: 600,  distKm: 560  },
]

// ─── Departure time pools (morning / afternoon / evening / overnight) ──
const DEPARTURE_SLOTS = [
  '04:30', '05:00', '05:30', '06:00', '06:30',
  '07:00', '07:30', '08:00', '08:30', '09:00',
  '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '17:30', '18:00',
  '18:30', '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30', '22:00', '22:30', '23:00',
  '23:30',
]

// ─── Bus builder ─────────────────────────────────────────────
function buildBus(id, route, slotIdx, operatorIdx, typeIdx) {
  const type     = BUS_TYPES[typeIdx % BUS_TYPES.length]
  const operator = OPERATORS[operatorIdx % OPERATORS.length]
  const departure = DEPARTURE_SLOTS[slotIdx % DEPARTURE_SLOTS.length]

  const isNonAC   = /non-ac/i.test(type)
  const isAC      = !isNonAC && (/\bac\b|volvo|scania|bharat|luxury|electric|semi/i.test(type))
  const isSleeper = /sleeper/i.test(type)
  const isLuxury  = /luxury|volvo|bharat|electric/i.test(type)

  // Duration: ±12% jitter
  const seed = (id * 7 + slotIdx * 13 + operatorIdx * 3) % 100
  const jitter = Math.round(((seed - 50) / 100) * route.baseMins * 0.12)
  const durationMins = Math.max(60, route.baseMins + jitter)

  const arrival = addMins(departure, durationMins)

  // Pricing — realistic tiers based on distance + bus quality
  const distanceFactor = route.distKm / 100
  let basePrice
  if (isLuxury && isSleeper)      basePrice = Math.round(distanceFactor * 320)
  else if (isLuxury)               basePrice = Math.round(distanceFactor * 260)
  else if (isAC && isSleeper)      basePrice = Math.round(distanceFactor * 230)
  else if (isAC)                   basePrice = Math.round(distanceFactor * 180)
  else if (isSleeper)              basePrice = Math.round(distanceFactor * 150)
  else                             basePrice = Math.round(distanceFactor * 110)

  // ±15% price jitter
  const priceJitter = ((id * 11 + slotIdx * 7) % 31) - 15
  const price = Math.max(199, Math.round((basePrice * (1 + priceJitter / 100)) / 10) * 10)

  // Rating: 3.8–5.0
  const ratingBase = 3.8 + ((id * 17 + operatorIdx * 11) % 25) / 20.8
  const rating = Math.round(Math.min(5.0, ratingBase) * 10) / 10

  // Seats: 0–42 with variety
  const seatSeed = (id * 23 + slotIdx * 17) % 100
  const seatsAvailable = seatSeed < 8 ? 0
    : seatSeed < 18 ? 2 + (seatSeed % 4)   // very low (2–5)
    : seatSeed < 40 ? 6 + (seatSeed % 10)  // low-mid (6–15)
    : seatSeed < 70 ? 16 + (seatSeed % 15) // mid (16–30)
    : 31 + (seatSeed % 12)                  // high (31–42)

  // Amenities
  let amenityTier = 'minimal'
  if (isLuxury)               amenityTier = 'luxury'
  else if (isAC && isSleeper) amenityTier = 'premium'
  else if (isAC)              amenityTier = 'standard'
  else if (isSleeper)         amenityTier = 'basic'

  return {
    id:             `bus-${String(id).padStart(4, '0')}`,
    operator,
    type,
    from:           route.from,
    to:             route.to,
    departure,
    arrival,
    durationMins,
    duration:       minsToLabel(durationMins),
    price,
    rating,
    seatsAvailable,
    amenities:      AMENITY_SETS[amenityTier],
    isAC,
    isSleeper,
    distKm:         route.distKm,
  }
}

// ─── Generate buses ──────────────────────────────────────────
// Each route gets 5–7 buses spread across departure slots
const ALL_BUSES = []
let busId = 1

ROUTES.forEach((route, routeIdx) => {
  // Number of buses: short routes get more options, long routes fewer
  const busCount = route.distKm < 200 ? 5 : route.distKm < 500 ? 7 : route.distKm < 900 ? 6 : 5

  // Spread slots evenly + use varied types and operators
  for (let i = 0; i < busCount; i++) {
    const slotIdx    = Math.floor((i / busCount) * DEPARTURE_SLOTS.length) + (routeIdx % 3)
    const operatorIdx = (busId + routeIdx * 3 + i * 7) % OPERATORS.length
    const typeIdx     = (i + routeIdx + busId) % BUS_TYPES.length

    ALL_BUSES.push(buildBus(busId, route, slotIdx, operatorIdx, typeIdx))
    busId++
  }
})

export default ALL_BUSES

// ─── Route lookup helpers ────────────────────────────────────
export function getBusesByRoute(from, to) {
  if (!from || !to) return []
  return ALL_BUSES.filter(
    b =>
      b.from.toLowerCase() === from.toLowerCase() &&
      b.to.toLowerCase()   === to.toLowerCase()
  )
}

export function getPriceBounds(buses) {
  if (!buses.length) return { min: 0, max: 5000 }
  const prices = buses.map(b => b.price)
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  }
}
