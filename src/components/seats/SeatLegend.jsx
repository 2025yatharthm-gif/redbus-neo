import styles from './SeatLegend.module.css'

const ITEMS = [
  {
    type: 'status',
    className: 'available',
    label: 'Available',
  },
  {
    type: 'status',
    className: 'selected',
    label: 'Selected',
  },
  {
    type: 'status',
    className: 'booked',
    label: 'Booked',
  },
  {
    type: 'attr',
    className: 'premium',
    icon: '⭐',
    label: 'Premium',
  },
  {
    type: 'attr',
    className: 'extraLegroom',
    icon: '↕',
    label: 'Extra Legroom',
  },
]

export default function SeatLegend() {
  return (
    <div className={styles.legend}>
      {ITEMS.map(item => (
        <div key={item.label} className={styles.item}>
          <div className={`${styles.swatch} ${styles[item.className]}`}>
            {item.icon && <span className={styles.swatchIcon}>{item.icon}</span>}
          </div>
          <span className={styles.label}>{item.label}</span>
        </div>
      ))}
    </div>
  )
}
