import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearch } from '../context/SearchContext'
import { POPULAR_ROUTES, CITIES } from '../data/mockData'
import { buildQueryString } from '../utils/format'
import { useSettings } from '../context/SettingsContext'
import { usePerformance } from '../context/PerformanceContext'
import Button from '../components/ui/Button'
import styles from './Home.module.css'

export default function Home() {
  const navigate = useNavigate()
  const { search, updateSearch } = useSearch()
  const { formatCurrency } = useSettings()
  const { startTimer, endTimer } = usePerformance()

  useEffect(() => {
    startTimer('home_render')
    return () => { endTimer('home_render', 'Home Page Render') }
  }, [])

  const [from, setFrom] = useState(search.from || '')
  const [to, setTo]     = useState(search.to   || '')
  const [date, setDate] = useState(search.date  || '')

  function handleSearch() {
    if (!from || !to || !date) return
    updateSearch({ from, to, date })
    navigate(`/results?${buildQueryString({ from, to, date })}`)
  }

  function handleSwap() {
    setFrom(to)
    setTo(from)
  }

  function handlePopularRoute(route) {
    setFrom(route.from)
    setTo(route.to)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const d = tomorrow.toISOString().split('T')[0]
    setDate(d)
    updateSearch({ from: route.from, to: route.to, date: d })
    navigate(`/results?${buildQueryString({ from: route.from, to: route.to, date: d })}`)
  }

  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <div className={styles.page}>

      {/* ── Hero ─────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroMeta}>India's most trusted bus booking</div>
          <h1 className={styles.heroTitle}>
            Where are you<br />
            <span className={styles.heroAccent}>headed next?</span>
          </h1>
          <p className={styles.heroSub}>
            20,000+ routes · 3,000+ operators · Live seat selection
          </p>
        </div>
      </section>

      {/* ── Search Card ───────────────────────── */}
      <section className={styles.searchSection}>
        <div className={styles.searchCard}>
          <div className={styles.searchRow}>

            {/* From */}
            <div className={styles.searchField}>
              <label className={styles.fieldLabel}>From</label>
              <select
                className={styles.fieldInput}
                value={from}
                onChange={e => setFrom(e.target.value)}
              >
                <option value="">Select city</option>
                {CITIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Swap */}
            <button
              className={styles.swapBtn}
              onClick={handleSwap}
              title="Swap cities"
            >
              ⇄
            </button>

            {/* To */}
            <div className={styles.searchField}>
              <label className={styles.fieldLabel}>To</label>
              <select
                className={styles.fieldInput}
                value={to}
                onChange={e => setTo(e.target.value)}
              >
                <option value="">Select city</option>
                {CITIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className={styles.searchField}>
              <label className={styles.fieldLabel}>Date</label>
              <input
                type="date"
                className={styles.fieldInput}
                value={date}
                min={todayStr}
                onChange={e => setDate(e.target.value)}
              />
            </div>

            {/* CTA */}
            <Button size="lg" onClick={handleSearch} disabled={!from || !to || !date}>
              Search buses
            </Button>

          </div>
        </div>
      </section>

      {/* ── Popular Routes ───────────────────── */}
      <section className={styles.routesSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Popular routes</h2>
          <div className={styles.routesGrid}>
            {POPULAR_ROUTES.map(route => (
              <button
                key={route.id}
                className={styles.routeCard}
                onClick={() => handlePopularRoute(route)}
              >
                <div className={styles.routeRow}>
                  <span className={styles.routeCity}>{route.from}</span>
                  <span className={styles.routeArrow}>→</span>
                  <span className={styles.routeCity}>{route.to}</span>
                </div>
                <div className={styles.routeMeta}>
                  <span className={styles.routeDuration}>{route.duration}</span>
                  <span className={styles.routePrice}>from {formatCurrency(route.price)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust strip ──────────────────────── */}
      <section className={styles.trustSection}>
        <div className={styles.container}>
          <div className={styles.trustGrid}>
            {[
              { icon: '🛡️', label: 'Secure Payments',   desc: 'PCI DSS compliant' },
              { icon: '🎟️', label: 'Instant Confirmation', desc: 'Ticket in seconds' },
              { icon: '↩️', label: 'Easy Cancellation',  desc: 'No hidden charges' },
              { icon: '⭐', label: '4.5M+ Reviews',       desc: 'Verified passengers' },
            ].map(item => (
              <div key={item.label} className={styles.trustItem}>
                <span className={styles.trustIcon}>{item.icon}</span>
                <div>
                  <div className={styles.trustLabel}>{item.label}</div>
                  <div className={styles.trustDesc}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
