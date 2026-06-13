import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import ALL_BUSES from '../data/buses'
import { SeatProvider, useSeat } from '../context/SeatContext'
import SeatGrid from '../components/seats/SeatGrid'
import DeckSwitcher from '../components/seats/DeckSwitcher'
import SeatLegend from '../components/seats/SeatLegend'
import PriceSummary from '../components/seats/PriceSummary'
import Badge from '../components/ui/Badge'
import { formatPrice } from '../utils/format'
import styles from './SeatSelection.module.css'

/* ── Route guard: resolve bus from URL param ── */
export default function SeatSelection() {
  const { busId } = useParams()
  const navigate  = useNavigate()

  const bus = ALL_BUSES.find(b => b.id === busId)

  if (!bus) {
    return (
      <div className={styles.notFoundPage}>
        <div className={styles.notFoundCard}>
          <div className={styles.notFoundIcon}>🚌</div>
          <h2 className={styles.notFoundTitle}>Bus not found</h2>
          <p className={styles.notFoundSub}>
            The bus ID <code className={styles.notFoundCode}>{busId}</code> doesn't exist.
            It may have been removed or the link is incorrect.
          </p>
          <button className={styles.notFoundBtn} onClick={() => navigate('/results')}>
            ← Back to search results
          </button>
        </div>
      </div>
    )
  }

  return (
    <SeatProvider bus={bus}>
      <SeatSelectionInner />
    </SeatProvider>
  )
}

/* ── Inner: has access to SeatContext ──────── */
function SeatSelectionInner() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { bus, seatMap, activeDeck, selectedSeats } = useSeat()

  // Build back URL preserving search params
  const backUrl = searchParams.toString()
    ? `/results?${searchParams.toString()}`
    : '/results'

  const currentLayout = activeDeck === 'lower' ? seatMap.lower : seatMap.upper

  return (
    <div className={styles.page}>

      {/* ── Breadcrumb ──────────────────────── */}
      <div className={styles.breadcrumb}>
        <div className={styles.breadcrumbInner}>
          <button className={styles.backBtn} onClick={() => navigate(backUrl)}>
            ← Back to results
          </button>
          <div className={styles.breadcrumbStep}>
            <span className={styles.stepActive}>1. Select Seats</span>
            <span className={styles.stepSep}>›</span>
            <span className={styles.stepInactive}>2. Passenger Details</span>
            <span className={styles.stepSep}>›</span>
            <span className={styles.stepInactive}>3. Payment</span>
          </div>
        </div>
      </div>

      {/* ── Bus info bar ────────────────────── */}
      <div className={styles.busBar}>
        <div className={styles.busBarInner}>

          <div className={styles.busBarLeft}>
            <div className={styles.busOpLogo}>
              {bus.operator.charAt(0)}
            </div>
            <div className={styles.busOpInfo}>
              <span className={styles.busOpName}>{bus.operator}</span>
              <Badge variant={bus.isAC ? 'brand' : 'muted'}>{bus.type}</Badge>
            </div>
          </div>

          <div className={styles.busBarRoute}>
            <div className={styles.busBarTimeGroup}>
              <span className={styles.busBarTime}>{bus.departure}</span>
              <span className={styles.busBarCity}>{bus.from}</span>
            </div>
            <div className={styles.busBarMid}>
              <span className={styles.busBarDuration}>{bus.duration}</span>
              <div className={styles.busBarLine} />
            </div>
            <div className={styles.busBarTimeGroup}>
              <span className={styles.busBarTime}>{bus.arrival}</span>
              <span className={styles.busBarCity}>{bus.to}</span>
            </div>
          </div>

          <div className={styles.busBarRight}>
            <span className={styles.busBarPriceLabel}>from</span>
            <span className={styles.busBarPrice}>{formatPrice(bus.price)}</span>
            {bus.amenities.length > 0 && (
              <div className={styles.busBarAmenities}>
                {bus.amenities.map(a => (
                  <span key={a} className={styles.amenityPill}>{a}</span>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── Main content ────────────────────── */}
      <div className={styles.content}>

        {/* Left: seat map panel */}
        <div className={styles.seatPanel}>

          <div className={styles.seatPanelHeader}>
            <h2 className={styles.seatPanelTitle}>Select your seat</h2>
            <span className={styles.seatPanelSub}>
              {bus.seatsAvailable} seats available · max 6 per booking
            </span>
          </div>

          {/* Deck switcher (sleeper buses only) */}
          {seatMap.hasTwoDecks && <DeckSwitcher />}

          {/* Deck label for context */}
          {seatMap.hasTwoDecks && (
            <div className={styles.deckLabel}>
              {activeDeck === 'lower' ? '🪑 Lower Deck — Seater berths' : '🛏️ Upper Deck — Sleeper berths'}
            </div>
          )}

          {/* The seat map itself */}
          <div className={styles.seatMapWrap}>
            <SeatGrid layout={currentLayout} isSleeper={bus.isSleeper} />
          </div>

          {/* Legend */}
          <SeatLegend />

          {/* Mobile: selected seat count strip */}
          {selectedSeats.length > 0 && (
            <div className={styles.mobileSelectionStrip}>
              <span className={styles.mobileStripLabel}>
                {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} selected
              </span>
              <span className={styles.mobileStripScroll}>↓ Scroll for summary</span>
            </div>
          )}

        </div>

        {/* Right: price summary sidebar */}
        <div className={styles.summaryCol}>
          <PriceSummary />
        </div>

      </div>
    </div>
  )
}
