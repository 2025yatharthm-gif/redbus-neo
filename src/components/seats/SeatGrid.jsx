import SeatCell from './SeatCell'
import styles from './SeatGrid.module.css'

/**
 * SeatGrid — renders one deck of seats.
 *
 * Layout philosophy: each row is rendered as a flex row.
 * `null` entries in the row array represent the aisle gap.
 */
export default function SeatGrid({ layout, isSleeper }) {
  if (!layout || layout.length === 0) return null

  return (
    <div className={styles.wrapper}>

      {/* Driver cabin indicator */}
      <div className={styles.cabin}>
        <div className={styles.cabinIcon}>
          <span>🚌</span>
        </div>
        <div className={styles.cabinLabel}>Driver</div>
        <div className={styles.windshield} />
      </div>

      {/* Column headers */}
      <ColumnHeaders isSleeper={isSleeper} />

      {/* Seat rows */}
      <div className={styles.rows}>
        {layout.map((row, rowIdx) => (
          <div key={rowIdx} className={styles.row}>
            {/* Row number label */}
            <span className={styles.rowLabel}>{rowIdx + 1}</span>

            {/* Seats + aisle gaps */}
            <div className={styles.rowSeats}>
              {row.map((seat, cellIdx) =>
                seat === null
                  ? <div key={`aisle-${cellIdx}`} className={styles.aisle} />
                  : <SeatCell key={seat.id} seat={seat} />
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

function ColumnHeaders({ isSleeper }) {
  const labels = isSleeper
    ? ['L', null, 'R']        // Lower/Upper berths with gap
    : ['A', 'B', null, 'C', 'D']

  return (
    <div className={styles.colHeaders}>
      <div className={styles.colHeaderSpacer} />
      <div className={styles.colHeaderRow}>
        {labels.map((lbl, i) =>
          lbl === null
            ? <div key={`gap-${i}`} className={styles.headerAisle} />
            : <div key={lbl} className={styles.headerCell}>{lbl}</div>
        )}
      </div>
    </div>
  )
}
