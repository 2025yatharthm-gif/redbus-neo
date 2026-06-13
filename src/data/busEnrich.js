/**
 * busEnrich.js — Phase 5 enrichment layer
 *
 * All functions are deterministic (seeded on bus ID) so the
 * same bus always gets the same personality, score, etc.
 * This keeps the UI consistent without a backend.
 */

// ── Seeded RNG ───────────────────────────────────────────────
function seeded(id, salt = 0) {
  let h = salt
  for (let i = 0; i < id.length; i++) {
    h = (Math.imul(31, h) + id.charCodeAt(i)) | 0
  }
  h = Math.abs(h)
  // Single LCG step
  h = (Math.imul(h, 1664525) + 1013904223) | 0
  return (h >>> 0) / 0xFFFFFFFF
}

function seededInt(id, salt, min, max) {
  return min + Math.floor(seeded(id, salt) * (max - min + 1))
}

// ── 1. Bus Personality ───────────────────────────────────────
const PERSONALITIES = [
  { tag: 'Comfort King',    icon: '👑', color: '#F59E0B', desc: 'Maximises passenger comfort at every step'     },
  { tag: 'Budget Hero',     icon: '💰', color: '#22C55E', desc: 'Best value for money on this route'             },
  { tag: 'Reliable Choice', icon: '🛡️', color: '#3B82F6', desc: 'Consistently on-time, rarely cancels'          },
  { tag: 'Premium Express', icon: '⚡', color: '#8B5CF6', desc: 'Fastest journey with luxury seating'            },
  { tag: 'Night Rider',     icon: '🌙', color: '#6366F1', desc: 'Optimised for overnight journeys'               },
  { tag: 'Family Friendly', icon: '👨‍👩‍👧', color: '#EC4899', desc: 'Wide aisles, extra luggage space, friendly crew' },
  { tag: 'Eco Traveler',    icon: '🌿', color: '#10B981', desc: 'Lowest carbon footprint on this route'          },
]

export function getBusPersonality(bus) {
  // Bias toward certain personalities based on bus properties
  if (!bus.isAC && bus.price < 400)    return PERSONALITIES[1] // Budget Hero
  if (bus.isAC && bus.isSleeper && bus.rating >= 4.5) return PERSONALITIES[0] // Comfort King
  if (bus.type.includes('Volvo') || bus.type.includes('Scania')) return PERSONALITIES[3] // Premium

  const idx = seededInt(bus.id, 42, 0, PERSONALITIES.length - 1)
  return PERSONALITIES[idx]
}

// ── 2. Sleep Comfort Score ────────────────────────────────────
/**
 * Returns a score 1–10 based on bus characteristics.
 */
export function getSleepComfortScore(bus) {
  let score = 5

  if (bus.isSleeper)  score += 2.5
  if (bus.isAC)       score += 1.5
  if (bus.amenities.includes('Blanket')) score += 0.5
  if (bus.amenities.includes('WiFi'))    score += 0.3

  // Duration bonus: longer journey = more time to sleep
  if (bus.durationMins >= 480) score += 0.7
  else if (bus.durationMins < 180) score -= 1.5

  // Occupancy penalty
  const occupancy = (40 - bus.seatsAvailable) / 40
  score -= occupancy * 0.5

  // Small seeded jitter ±0.3
  score += (seeded(bus.id, 77) - 0.5) * 0.6

  return Math.min(10, Math.max(1, Math.round(score * 10) / 10))
}

// ── 3. Crowd / Demand Meter ──────────────────────────────────
export function getCrowdLevel(bus) {
  const occupancy = (40 - bus.seatsAvailable) / 40

  if (occupancy >= 0.75 || bus.seatsAvailable <= 5)
    return { level: 'High Demand',     color: '#EF4444', bar: 90, icon: '🔥' }
  if (occupancy >= 0.45)
    return { level: 'Moderate Demand', color: '#F59E0B', bar: 55, icon: '📈' }
  return   { level: 'Low Demand',      color: '#22C55E', bar: 20, icon: '✅' }
}

// ── 4. Carbon Savings ────────────────────────────────────────
const CO2_PER_KM_CAR  = 0.21  // kg per km (avg petrol car)
const CO2_PER_KM_BUS  = 0.05  // kg per km per passenger

// Road distance estimates (km) for all routes
const ROUTE_DISTANCES = {
  // Maharashtra
  'Mumbai-Pune':          150,  'Pune-Mumbai':          150,
  'Mumbai-Nashik':        165,  'Nashik-Mumbai':        165,
  'Mumbai-Goa':           600,  'Goa-Mumbai':           600,
  'Mumbai-Nagpur':        870,  'Nagpur-Mumbai':        870,
  'Mumbai-Aurangabad':    330,  'Aurangabad-Mumbai':    330,
  'Mumbai-Kolhapur':      380,  'Kolhapur-Mumbai':      380,
  'Mumbai-Ahmedabad':     530,  'Ahmedabad-Mumbai':     530,
  'Mumbai-Surat':         285,  'Surat-Mumbai':         285,
  'Mumbai-Hyderabad':     710,  'Hyderabad-Mumbai':     710,
  'Mumbai-Bengaluru':     985,  'Bengaluru-Mumbai':     985,
  'Mumbai-Delhi':        1450,  'Delhi-Mumbai':        1450,
  'Pune-Nashik':          210,  'Nashik-Pune':          210,
  'Pune-Nagpur':          710,  'Nagpur-Pune':          710,
  'Pune-Goa':             460,  'Goa-Pune':             460,
  'Pune-Kolhapur':        230,  'Kolhapur-Pune':        230,
  'Pune-Hyderabad':       560,  'Hyderabad-Pune':       560,
  // Gujarat
  'Ahmedabad-Surat':      265,  'Surat-Ahmedabad':      265,
  'Ahmedabad-Vadodara':   110,  'Vadodara-Ahmedabad':   110,
  'Ahmedabad-Rajkot':     215,  'Rajkot-Ahmedabad':     215,
  'Surat-Vadodara':       155,  'Vadodara-Surat':       155,
  // Delhi & North India
  'Delhi-Jaipur':         280,  'Jaipur-Delhi':         280,
  'Delhi-Agra':           235,  'Agra-Delhi':           235,
  'Delhi-Chandigarh':     265,  'Chandigarh-Delhi':     265,
  'Delhi-Udaipur':        670,  'Udaipur-Delhi':        670,
  'Delhi-Jodhpur':        600,  'Jodhpur-Delhi':        600,
  'Delhi-Kota':           435,
  'Delhi-Amritsar':       455,  'Amritsar-Delhi':       455,
  'Delhi-Dehradun':       300,  'Dehradun-Delhi':       300,
  'Jaipur-Udaipur':       400,  'Udaipur-Jaipur':       400,
  'Jaipur-Jodhpur':       330,  'Jodhpur-Jaipur':       330,
  // Karnataka
  'Bengaluru-Chennai':    345,  'Chennai-Bengaluru':    345,
  'Bengaluru-Mysore':     145,  'Mysore-Bengaluru':     145,
  'Bengaluru-Hubli':      415,  'Hubli-Bengaluru':      415,
  'Bengaluru-Mangalore':  360,  'Mangalore-Bengaluru':  360,
  'Bengaluru-Hyderabad':  570,  'Hyderabad-Bengaluru':  570,
  'Bengaluru-Goa':        600,  'Goa-Bengaluru':        600,
  'Bengaluru-Coimbatore': 360,  'Coimbatore-Bengaluru': 360,
  // Tamil Nadu
  'Chennai-Coimbatore':   500,  'Coimbatore-Chennai':   500,
  'Chennai-Madurai':      460,  'Madurai-Chennai':      460,
  'Chennai-Tirupati':     155,  'Tirupati-Chennai':     155,
  'Chennai-Hyderabad':    630,  'Hyderabad-Chennai':    630,
  // Telangana & AP
  'Hyderabad-Vijayawada': 275,  'Vijayawada-Hyderabad': 275,
  'Hyderabad-Warangal':   150,  'Warangal-Hyderabad':   150,
  'Hyderabad-Tirupati':   530,
}

export function getCarbonSavings(bus, passengerCount = 1) {
  const key  = `${bus.from}-${bus.to}`
  const dist = ROUTE_DISTANCES[key] || 300
  const carCo2 = CO2_PER_KM_CAR * dist * passengerCount
  const busCo2 = CO2_PER_KM_BUS * dist * passengerCount
  const saved  = Math.round((carCo2 - busCo2) * 10) / 10
  return { saved, dist, unit: 'kg CO₂' }
}

// ── 5. Fare Insights ─────────────────────────────────────────
export function getFareInsights(bus, allRouteBuses) {
  if (!allRouteBuses || allRouteBuses.length < 2) return null

  const prices = allRouteBuses.map(b => b.price)
  const avg    = Math.round(prices.reduce((s, p) => s + p, 0) / prices.length)
  const savings = avg - bus.price
  const pct     = Math.round(Math.abs(savings) / avg * 100)

  return {
    current: bus.price,
    average: avg,
    savings,
    pct,
    isCheap: savings > 0,
  }
}

// ── 6. Travel Conditions ─────────────────────────────────────
const WEATHER_OPTS = [
  { label: 'Clear', icon: '☀️', color: '#F59E0B' },
  { label: 'Cloudy', icon: '⛅', color: '#9CA3AF' },
  { label: 'Light Rain', icon: '🌦️', color: '#60A5FA' },
  { label: 'Windy', icon: '💨', color: '#A78BFA' },
  { label: 'Humid', icon: '🌫️', color: '#6B7280' },
]

const TRAFFIC_OPTS = [
  { label: 'Light Traffic',    color: '#22C55E', bar: 20 },
  { label: 'Moderate Traffic', color: '#F59E0B', bar: 55 },
  { label: 'Heavy Traffic',    color: '#EF4444', bar: 85 },
]

const ROAD_OPTS = [
  { label: 'Excellent Roads',  icon: '🛣️',  score: 9 },
  { label: 'Good Roads',       icon: '🛤️',  score: 7 },
  { label: 'Average Roads',    icon: '🚧',  score: 5 },
  { label: 'Rough Patches',    icon: '⚠️',  score: 3 },
]

export function getTravelConditions(bus) {
  const w = seededInt(bus.id, 11, 0, WEATHER_OPTS.length  - 1)
  const t = seededInt(bus.id, 22, 0, TRAFFIC_OPTS.length  - 1)
  const r = seededInt(bus.id, 33, 0, ROAD_OPTS.length     - 1)

  return {
    weather: WEATHER_OPTS[w],
    traffic: TRAFFIC_OPTS[t],
    road:    ROAD_OPTS[r],
  }
}
