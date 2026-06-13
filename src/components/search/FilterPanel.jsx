import styles from './FilterPanel.module.css'

/**
 * FilterPanel — sidebar with all Phase 2 filters.
 * Receives filters + handlers from parent (SearchResults via useFilterSort).
 */
export default function FilterPanel({ filters, bounds, onUpdate, onReset }) {
  const hasActiveFilters =
    filters.ac ||
    filters.nonAc ||
    filters.sleeper ||
    filters.seater ||
    filters.topRated ||
    filters.priceMin > bounds.min ||
    filters.priceMax < bounds.max

  return (
    <aside className={styles.panel}>

      {/* ── Header ──────────────────────────── */}
      <div className={styles.header}>
        <h2 className={styles.title}>Filters</h2>
        {hasActiveFilters && (
          <button className={styles.resetBtn} onClick={onReset}>
            Clear all
          </button>
        )}
      </div>

      {/* ── AC / Non-AC ─────────────────────── */}
      <section className={styles.group}>
        <h3 className={styles.groupTitle}>Air conditioning</h3>
        <label className={styles.checkRow}>
          <input
            type="checkbox"
            className={styles.check}
            checked={filters.ac}
            onChange={e => onUpdate('ac', e.target.checked)}
          />
          <span className={styles.checkLabel}>AC</span>
        </label>
        <label className={styles.checkRow}>
          <input
            type="checkbox"
            className={styles.check}
            checked={filters.nonAc}
            onChange={e => onUpdate('nonAc', e.target.checked)}
          />
          <span className={styles.checkLabel}>Non-AC</span>
        </label>
      </section>

      <div className={styles.divider} />

      {/* ── Sleeper / Seater ─────────────────── */}
      <section className={styles.group}>
        <h3 className={styles.groupTitle}>Bus type</h3>
        <label className={styles.checkRow}>
          <input
            type="checkbox"
            className={styles.check}
            checked={filters.sleeper}
            onChange={e => onUpdate('sleeper', e.target.checked)}
          />
          <span className={styles.checkLabel}>Sleeper</span>
        </label>
        <label className={styles.checkRow}>
          <input
            type="checkbox"
            className={styles.check}
            checked={filters.seater}
            onChange={e => onUpdate('seater', e.target.checked)}
          />
          <span className={styles.checkLabel}>Seater</span>
        </label>
      </section>

      <div className={styles.divider} />

      {/* ── Rating ──────────────────────────── */}
      <section className={styles.group}>
        <h3 className={styles.groupTitle}>Rating</h3>
        <label className={styles.checkRow}>
          <input
            type="checkbox"
            className={styles.check}
            checked={filters.topRated}
            onChange={e => onUpdate('topRated', e.target.checked)}
          />
          <span className={styles.checkLabel}>
            4.0+ rated only
            <span className={styles.starHint}> ★</span>
          </span>
        </label>
      </section>

      <div className={styles.divider} />

      {/* ── Price range ─────────────────────── */}
      <section className={styles.group}>
        <h3 className={styles.groupTitle}>Price range</h3>

        <div className={styles.priceInputs}>
          <div className={styles.priceField}>
            <label className={styles.priceLabel}>Min</label>
            <div className={styles.priceInputWrap}>
              <span className={styles.priceCurrency}>₹</span>
              <input
                type="number"
                className={styles.priceInput}
                value={filters.priceMin}
                min={bounds.min}
                max={filters.priceMax}
                step={50}
                onChange={e => onUpdate('priceMin', Math.max(bounds.min, Number(e.target.value)))}
              />
            </div>
          </div>
          <span className={styles.priceSep}>—</span>
          <div className={styles.priceField}>
            <label className={styles.priceLabel}>Max</label>
            <div className={styles.priceInputWrap}>
              <span className={styles.priceCurrency}>₹</span>
              <input
                type="number"
                className={styles.priceInput}
                value={filters.priceMax}
                min={filters.priceMin}
                max={bounds.max}
                step={50}
                onChange={e => onUpdate('priceMax', Math.min(bounds.max, Number(e.target.value)))}
              />
            </div>
          </div>
        </div>

        {/* Visual range track */}
        <div className={styles.rangeTrack}>
          <div
            className={styles.rangeFill}
            style={{
              left:  `${((filters.priceMin - bounds.min) / (bounds.max - bounds.min)) * 100}%`,
              right: `${100 - ((filters.priceMax - bounds.min) / (bounds.max - bounds.min)) * 100}%`,
            }}
          />
        </div>
        <div className={styles.rangeBounds}>
          <span>₹{bounds.min}</span>
          <span>₹{bounds.max}</span>
        </div>

      </section>

    </aside>
  )
}
