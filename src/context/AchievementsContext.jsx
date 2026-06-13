import { createContext, useContext, useState, useEffect, useCallback } from 'react'

// ── Achievement definitions ──────────────────────────────────
export const ACHIEVEMENT_DEFS = [
  {
    id:    'first_booking',
    icon:  '🎉',
    label: 'First Journey',
    desc:  'Complete your very first booking',
    check: (bookings) => bookings.length >= 1,
  },
  {
    id:    'explorer',
    icon:  '🗺️',
    label: 'Explorer',
    desc:  'Book trips on 3 different routes',
    check: (bookings) => {
      const routes = new Set(bookings.map(b => `${b.bus.from}-${b.bus.to}`))
      return routes.size >= 3
    },
  },
  {
    id:    'weekend_traveler',
    icon:  '🌅',
    label: 'Weekend Traveler',
    desc:  'Book 3 or more trips total',
    check: (bookings) => bookings.length >= 3,
  },
  {
    id:    'night_rider',
    icon:  '🌙',
    label: 'Night Rider',
    desc:  'Book a bus departing after 21:00',
    check: (bookings) => bookings.some(b => {
      const [h] = b.bus.departure.split(':').map(Number)
      return h >= 21
    }),
  },
  {
    id:    'premium_passenger',
    icon:  '👑',
    label: 'Premium Passenger',
    desc:  'Book an AC Sleeper or Volvo bus',
    check: (bookings) => bookings.some(b =>
      b.bus.isAC && b.bus.isSleeper
    ),
  },
  {
    id:    'early_bird',
    icon:  '🌄',
    label: 'Early Bird',
    desc:  'Book a bus departing before 07:00',
    check: (bookings) => bookings.some(b => {
      const [h] = b.bus.departure.split(':').map(Number)
      return h < 7
    }),
  },
  {
    id:    'group_traveler',
    icon:  '👥',
    label: 'Group Traveler',
    desc:  'Book 4 or more seats in one trip',
    check: (bookings) => bookings.some(b => b.selectedSeats.length >= 4),
  },
  {
    id:    'frequent_flyer',
    icon:  '⚡',
    label: 'Frequent Traveler',
    desc:  'Complete 5 or more bookings',
    check: (bookings) => bookings.length >= 5,
  },
]

const STORAGE_KEY = 'redbus_neo_achievements'

const AchievementsContext = createContext(null)

export function AchievementsProvider({ children }) {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })

  function saveUnlocked(list) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)) } catch {}
  }

  // Evaluate all achievements against current bookings, unlock new ones
  const evaluate = useCallback((bookings) => {
    const newUnlocked = [...unlocked]
    let changed = false

    for (const def of ACHIEVEMENT_DEFS) {
      if (!newUnlocked.includes(def.id) && def.check(bookings)) {
        newUnlocked.push(def.id)
        changed = true
      }
    }

    if (changed) {
      setUnlocked(newUnlocked)
      saveUnlocked(newUnlocked)
    }

    return newUnlocked
  }, [unlocked])

  const isUnlocked = (id) => unlocked.includes(id)

  const achievements = ACHIEVEMENT_DEFS.map(def => ({
    ...def,
    unlocked: unlocked.includes(def.id),
  }))

  return (
    <AchievementsContext.Provider value={{ achievements, unlocked, evaluate, isUnlocked }}>
      {children}
    </AchievementsContext.Provider>
  )
}

export function useAchievements() {
  const ctx = useContext(AchievementsContext)
  if (!ctx) throw new Error('useAchievements must be inside AchievementsProvider')
  return ctx
}
