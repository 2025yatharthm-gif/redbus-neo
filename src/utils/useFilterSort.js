import { useState, useMemo } from 'react'
import { getPriceBounds } from '../data/buses'

export const SORT_OPTIONS = [
  { value: 'price_asc',    label: 'Cheapest first'    },
  { value: 'duration_asc', label: 'Fastest first'     },
  { value: 'rating_desc',  label: 'Highest rated'     },
  { value: 'departure_asc',label: 'Earliest departure'},
]

export const DEFAULT_FILTERS = {
  ac:       false,
  nonAc:    false,
  sleeper:  false,
  seater:   false,
  topRated: false,   // 4+ only
  priceMin: 0,
  priceMax: 9999,
}

/**
 * useFilterSort — manages filters + sort for a given bus array.
 * @param {Array} allBuses  — unfiltered buses for the current route
 */
export function useFilterSort(allBuses) {
  const bounds = useMemo(() => getPriceBounds(allBuses), [allBuses])

  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    priceMin: bounds.min,
    priceMax: bounds.max,
  })
  const [sort, setSort] = useState('price_asc')

  // Sync price bounds when route changes
  useMemo(() => {
    setFilters(f => ({
      ...f,
      priceMin: bounds.min,
      priceMax: bounds.max,
    }))
  }, [bounds.min, bounds.max])

  function updateFilter(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  function resetFilters() {
    setFilters({
      ...DEFAULT_FILTERS,
      priceMin: bounds.min,
      priceMax: bounds.max,
    })
  }

  const filtered = useMemo(() => {
    let result = [...allBuses]

    // AC / Non-AC (if either is checked, enforce; if neither, show all)
    const acActive    = filters.ac || filters.nonAc
    if (acActive) {
      result = result.filter(b =>
        (filters.ac    && b.isAC)  ||
        (filters.nonAc && !b.isAC)
      )
    }

    // Sleeper / Seater
    const seatActive  = filters.sleeper || filters.seater
    if (seatActive) {
      result = result.filter(b =>
        (filters.sleeper && b.isSleeper)  ||
        (filters.seater  && !b.isSleeper)
      )
    }

    // Top rated
    if (filters.topRated) {
      result = result.filter(b => b.rating >= 4.0)
    }

    // Price range
    result = result.filter(
      b => b.price >= filters.priceMin && b.price <= filters.priceMax
    )

    return result
  }, [allBuses, filters])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    switch (sort) {
      case 'price_asc':     return arr.sort((a, b) => a.price - b.price)
      case 'duration_asc':  return arr.sort((a, b) => a.durationMins - b.durationMins)
      case 'rating_desc':   return arr.sort((a, b) => b.rating - a.rating)
      case 'departure_asc': return arr.sort((a, b) => {
        const [ah, am] = a.departure.split(':').map(Number)
        const [bh, bm] = b.departure.split(':').map(Number)
        return (ah * 60 + am) - (bh * 60 + bm)
      })
      default:              return arr
    }
  }, [filtered, sort])

  return {
    filters,
    sort,
    bounds,
    updateFilter,
    resetFilters,
    setSort,
    filtered: sorted,
    totalCount: allBuses.length,
    filteredCount: sorted.length,
  }
}
