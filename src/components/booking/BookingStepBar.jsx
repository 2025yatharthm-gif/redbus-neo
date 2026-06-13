import styles from './BookingStepBar.module.css'

const STEPS = [
  { num: 1, label: 'Select Seats' },
  { num: 2, label: 'Passengers'   },
  { num: 3, label: 'Payment'      },
  { num: 4, label: 'Confirmed'    },
]

/**
 * @param {{ current: 1|2|3|4, allDone?: boolean }} props
 * allDone=true marks every step as completed (used on confirmation page)
 */
export default function BookingStepBar({ current, allDone = false }) {
  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        {STEPS.map((step, idx) => {
          const done    = allDone || step.num < current
          const active  = !allDone && step.num === current
          const pending = !allDone && step.num > current

          return (
            <div key={step.num} className={styles.stepGroup}>
              {idx > 0 && (
                <div className={`${styles.line} ${done ? styles.lineDone : styles.linePending}`} />
              )}
              <div className={`${styles.step} ${done ? styles.done : active ? styles.active : styles.pending}`}>
                <div className={styles.circle}>
                  {done ? '✓' : step.num}
                </div>
                <span className={styles.label}>{step.label}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
