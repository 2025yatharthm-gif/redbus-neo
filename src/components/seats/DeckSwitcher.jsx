import { useSeat } from '../../context/SeatContext'
import styles from './DeckSwitcher.module.css'

export default function DeckSwitcher() {
  const { seatMap, activeDeck, setActiveDeck, selectedIds } = useSeat()

  if (!seatMap.hasTwoDecks) return null

  // Count selected seats per deck
  const lowerSelected = [...selectedIds].filter(id => id.includes('-lower-')).length
  const upperSelected = [...selectedIds].filter(id => id.includes('-upper-')).length

  const decks = [
    { key: 'lower', label: 'Lower Deck', icon: '🪑', count: lowerSelected },
    { key: 'upper', label: 'Upper Deck', icon: '🛏️', count: upperSelected },
  ]

  return (
    <div className={styles.switcher}>
      {decks.map(deck => (
        <button
          key={deck.key}
          className={activeDeck === deck.key
            ? `${styles.tab} ${styles.tabActive}`
            : styles.tab
          }
          onClick={() => setActiveDeck(deck.key)}
        >
          <span className={styles.tabIcon}>{deck.icon}</span>
          <span className={styles.tabLabel}>{deck.label}</span>
          {deck.count > 0 && (
            <span className={styles.tabBadge}>{deck.count}</span>
          )}
        </button>
      ))}
    </div>
  )
}
