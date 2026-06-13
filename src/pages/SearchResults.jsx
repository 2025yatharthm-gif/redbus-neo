import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getBusesByRoute } from '../data/buses'
import { useFilterSort } from '../utils/useFilterSort'
import { buildQueryString } from '../utils/format'
import { CITIES } from '../data/mockData'
import BusCard from '../components/search/BusCard'
import BusCardSkeleton from '../components/search/BusCardSkeleton'
import FilterPanel from '../components/search/FilterPanel'
import SortBar from '../components/search/SortBar'
import EmptyState from '../components/search/EmptyState'
import styles from './SearchResults.module.css'

// ── Simulated load delay (ms) ────────────────────────────────
const LOAD_DELAY = 800

export default function SearchResults() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const from = searchParams.get('from') || ''
  const to   = searchParams.get('to')   || ''
  const date = searchParams.get('date') || ''

  // Inline search modification state
  const [editFrom, setEditFrom] = useState(from)
  const [editTo,   setEditTo]   = useState(to)
  const [editDate, setEditDate] = useState(date)

  const [isLoading, setIsLoading] = useState(true)

  // Simulate network fetch on route change
  useEffect(() => {
    setIsLoading(true)
    const t = setTimeout(() => setIsLoading(false), LOAD_DELAY)
    return () => clearTimeout(t)
  }, [from, to, date])

  const allBuses = useMemo(() => getBusesByRoute(from, to), [from, to])

  const {
    filters,
    sort,
    bounds,
    updateFilter,
    resetFilters,
    setSort,
    filtered,
    filteredCount,
  } = useFilterSort(allBuses)

  const displayDate = date
    ? new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
      })
    : ''

  function handleModifySearch() {
    if (!editFrom || !editTo || !editDate) return
    setSearchParams(buildQueryString({ from: editFrom, to: editTo, date: editDate }))
  }

  const todayStr = new Date().toISOString().split('T')[0]

  const noRoute = !from || !to

  return (
    <div className={styles.page}>

      {/* ── Inline search modification bar ────── */}
      <div className={styles.searchBar}>
        <div className={styles.searchBarInner}>

          <div className={styles.searchField}>
            <label className={styles.fieldLabel}>From</label>
            <select
              className={styles.fieldInput}
              value={editFrom}
              onChange={e => setEditFrom(e.target.value)}
            >
              <option value="">City</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <button
            className={styles.swapBtn}
            onClick={() => { setEditFrom(editTo); setEditTo(editFrom) }}
            title="Swap"
          >
            ⇄
          </button>

          <div className={styles.searchField}>
            <label className={styles.fieldLabel}>To</label>
            <select
              className={styles.fieldInput}
              value={editTo}
              onChange={e => setEditTo(e.target.value)}
            >
              <option value="">City</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className={styles.searchField}>
            <label className={styles.fieldLabel}>Date</label>
            <input
              type="date"
              className={styles.fieldInput}
              value={editDate}
              min={todayStr}
              onChange={e => setEditDate(e.target.value)}
            />
          </div>

          <button
            className={styles.searchBtn}
            onClick={handleModifySearch}
            disabled={!editFrom || !editTo || !editDate}
          >
            Search
          </button>

        </div>
      </div>

      {/* ── Route header ─────────────────────── */}
      {!noRoute && (
        <div className={styles.routeHeader}>
          <div className={styles.routeHeaderInner}>
            <div className={styles.routeTitle}>
              <span className={styles.routeCity}>{from}</span>
              <span className={styles.routeArrow}>→</span>
              <span className={styles.routeCity}>{to}</span>
            </div>
            {displayDate && (
              <span className={styles.routeDate}>{displayDate}</span>
            )}
          </div>
        </div>
      )}

      {/* ── Layout ───────────────────────────── */}
      <div className={styles.layout}>

        {/* Filter sidebar */}
        {!noRoute && (
          <FilterPanel
            filters={filters}
            bounds={bounds}
            onUpdate={updateFilter}
            onReset={resetFilters}
          />
        )}

        {/* Results column */}
        <section className={styles.resultsCol}>

          {noRoute ? (
            <div className={styles.noRoute}>
              <span className={styles.noRouteIcon}>🔍</span>
              <p className={styles.noRouteText}>Choose a departure and destination to see available buses.</p>
              <button className={styles.goHomeBtn} onClick={() => navigate('/')}>
                Search from home
              </button>
            </div>
          ) : (
            <>
              {/* Sort bar */}
              {!isLoading && (
                <SortBar sort={sort} onSort={setSort} count={filteredCount} />
              )}

              {/* Loading skeletons */}
              {isLoading && (
                <div className={styles.list}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <BusCardSkeleton key={i} />
                  ))}
                </div>
              )}

              {/* Bus cards */}
              {!isLoading && filteredCount > 0 && (
                <div className={styles.list}>
                  {filtered.map(bus => (
                    <BusCard key={bus.id} bus={bus} />
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!isLoading && filteredCount === 0 && (
                <EmptyState onReset={resetFilters} />
              )}
            </>
          )}

        </section>

      </div>
    </div>
  )
}
