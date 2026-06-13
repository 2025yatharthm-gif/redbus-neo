import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../context/BookingContext'
import { formatPrice } from '../utils/format'
import BookingStepBar from '../components/booking/BookingStepBar'
import BookingSidebar from '../components/booking/BookingSidebar'
import styles from './Payment.module.css'

const METHODS = [
  { id: 'upi',    label: 'UPI',                icon: '⚡', desc: 'Pay via any UPI app' },
  { id: 'card',   label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
  { id: 'wallet', label: 'Wallet',              icon: '👛', desc: 'Paytm, PhonePe, MobiKwik' },
]

const UPI_APPS = ['GPay', 'PhonePe', 'Paytm', 'BHIM']

export default function Payment() {
  const navigate = useNavigate()
  const { draft, confirmBooking, getDraftTotal } = useBooking()

  const [method,     setMethod]     = useState('upi')
  const [upiId,      setUpiId]      = useState('')
  const [card,       setCard]       = useState({ number: '', expiry: '', cvv: '', name: '' })
  const [wallet,     setWallet]     = useState('')
  const [errors,     setErrors]     = useState({})
  const [status,     setStatus]     = useState('idle')  // idle | processing | success | failed
  const [confirmed,  setConfirmed]  = useState(null)

  const timerRef = useRef(null)

  useEffect(() => {
    if (!draft) navigate('/', { replace: true })
    return () => clearTimeout(timerRef.current)
  }, [draft, navigate])

  if (!draft && status !== 'success') return null

  /* ── Field helpers ── */
  function formatCardNumber(v) {
    return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  }
  function formatExpiry(v) {
    const d = v.replace(/\D/g, '').slice(0, 4)
    return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d
  }

  /* ── Validation ── */
  function validate() {
    const e = {}
    if (method === 'upi') {
      if (!upiId.trim()) e.upiId = 'Enter your UPI ID'
      else if (!/^[\w.-]+@[\w]+$/.test(upiId)) e.upiId = 'Invalid UPI ID format (e.g. name@upi)'
    }
    if (method === 'card') {
      if (!card.name.trim())              e.cardName   = 'Cardholder name required'
      if (card.number.replace(/\s/g,'').length !== 16) e.cardNumber = 'Enter a valid 16-digit card number'
      if (!card.expiry || card.expiry.length < 5)      e.cardExpiry = 'Enter expiry as MM/YY'
      if (!card.cvv || card.cvv.length < 3)            e.cardCvv    = 'Enter 3-digit CVV'
    }
    if (method === 'wallet' && !wallet) e.wallet = 'Select a wallet'
    return e
  }

  /* ── Payment submission ── */
  function handlePay() {
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length > 0) return

    setStatus('processing')
    timerRef.current = setTimeout(() => {
      // 90% success rate simulation
      if (Math.random() > 0.1) {
        const record = confirmBooking()
        setConfirmed(record)
        setStatus('success')
      } else {
        setStatus('failed')
      }
    }, 2200)
  }

  /* ── Success redirect ── */
  useEffect(() => {
    if (status === 'success' && confirmed) {
      timerRef.current = setTimeout(() => {
        navigate(`/booking-confirmation/${confirmed.bookingId}`, { state: { booking: confirmed } })
      }, 1200)
    }
  }, [status, confirmed, navigate])

  /* ── Processing overlay ── */
  if (status === 'processing') {
    return (
      <div className={styles.page}>
        <BookingStepBar current={3} />
        <div className={styles.processingScreen}>
          <div className={styles.processingSpinner} />
          <h2 className={styles.processingTitle}>Processing Payment</h2>
          <p className={styles.processingSub}>Please wait, do not close this window…</p>
          <p className={styles.processingAmount}>{formatPrice(getDraftTotal())}</p>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className={styles.page}>
        <BookingStepBar current={4} />
        <div className={styles.processingScreen}>
          <div className={styles.successIcon}>✓</div>
          <h2 className={styles.processingTitle}>Payment Successful!</h2>
          <p className={styles.processingSub}>Redirecting to your ticket…</p>
        </div>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className={styles.page}>
        <BookingStepBar current={3} />
        <div className={styles.processingScreen}>
          <div className={styles.failedIcon}>✕</div>
          <h2 className={styles.processingTitle}>Payment Failed</h2>
          <p className={styles.processingSub}>Your payment could not be processed. Please try again.</p>
          <button className={styles.retryBtn} onClick={() => setStatus('idle')}>Try Again</button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <BookingStepBar current={3} />

      <div className={styles.content}>
        <div className={styles.mainCol}>

          {/* ── Method selector ────────────────── */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Choose Payment Method</h2>

            <div className={styles.methodTabs}>
              {METHODS.map(m => (
                <button
                  key={m.id}
                  className={`${styles.methodTab} ${method === m.id ? styles.methodActive : ''}`}
                  onClick={() => { setMethod(m.id); setErrors({}) }}
                >
                  <span className={styles.methodIcon}>{m.icon}</span>
                  <div>
                    <div className={styles.methodLabel}>{m.label}</div>
                    <div className={styles.methodDesc}>{m.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* ── Method input panel ─────────────── */}
          <section className={styles.section}>
            <div className={styles.payCard}>

              {/* UPI */}
              {method === 'upi' && (
                <div className={styles.upiPanel}>
                  <div className={styles.upiApps}>
                    {UPI_APPS.map(app => (
                      <button
                        key={app}
                        className={`${styles.upiApp} ${upiId.endsWith('@' + app.toLowerCase()) ? styles.upiAppActive : ''}`}
                        onClick={() => setUpiId(prev => {
                          const base = prev.split('@')[0] || ''
                          return base + '@' + app.toLowerCase()
                        })}
                      >
                        {app}
                      </button>
                    ))}
                  </div>
                  <div className={styles.upiOr}>or enter UPI ID manually</div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>UPI ID *</label>
                    <input
                      className={`${styles.fieldInput} ${errors.upiId ? styles.fieldError : ''}`}
                      type="text"
                      placeholder="yourname@upi"
                      value={upiId}
                      onChange={e => { setUpiId(e.target.value); setErrors(p => ({ ...p, upiId: '' })) }}
                    />
                    {errors.upiId && <span className={styles.errorMsg}>{errors.upiId}</span>}
                  </div>
                </div>
              )}

              {/* Card */}
              {method === 'card' && (
                <div className={styles.cardPanel}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Card Number *</label>
                    <input
                      className={`${styles.fieldInput} ${errors.cardNumber ? styles.fieldError : ''}`}
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={card.number}
                      onChange={e => setCard(c => ({ ...c, number: formatCardNumber(e.target.value) }))}
                    />
                    {errors.cardNumber && <span className={styles.errorMsg}>{errors.cardNumber}</span>}
                  </div>
                  <div className={styles.cardRow}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Expiry *</label>
                      <input
                        className={`${styles.fieldInput} ${errors.cardExpiry ? styles.fieldError : ''}`}
                        type="text"
                        placeholder="MM/YY"
                        value={card.expiry}
                        onChange={e => setCard(c => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                      />
                      {errors.cardExpiry && <span className={styles.errorMsg}>{errors.cardExpiry}</span>}
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>CVV *</label>
                      <input
                        className={`${styles.fieldInput} ${errors.cardCvv ? styles.fieldError : ''}`}
                        type="password"
                        placeholder="•••"
                        maxLength={4}
                        value={card.cvv}
                        onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '') }))}
                      />
                      {errors.cardCvv && <span className={styles.errorMsg}>{errors.cardCvv}</span>}
                    </div>
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Cardholder Name *</label>
                    <input
                      className={`${styles.fieldInput} ${errors.cardName ? styles.fieldError : ''}`}
                      type="text"
                      placeholder="Name as on card"
                      value={card.name}
                      onChange={e => setCard(c => ({ ...c, name: e.target.value }))}
                    />
                    {errors.cardName && <span className={styles.errorMsg}>{errors.cardName}</span>}
                  </div>
                </div>
              )}

              {/* Wallet */}
              {method === 'wallet' && (
                <div className={styles.walletPanel}>
                  {['Paytm', 'PhonePe', 'MobiKwik', 'Airtel Money'].map(w => (
                    <button
                      key={w}
                      className={`${styles.walletOption} ${wallet === w ? styles.walletActive : ''}`}
                      onClick={() => { setWallet(w); setErrors(p => ({ ...p, wallet: '' })) }}
                    >
                      <span className={styles.walletRadio}>{wallet === w ? '●' : '○'}</span>
                      <span className={styles.walletName}>{w}</span>
                    </button>
                  ))}
                  {errors.wallet && <span className={styles.errorMsg}>{errors.wallet}</span>}
                </div>
              )}

            </div>
          </section>

          {/* ── Actions ────────────────────────── */}
          <div className={styles.actions}>
            <button className={styles.backBtn} onClick={() => navigate(-1)}>
              ← Back
            </button>
            <button className={styles.payBtn} onClick={handlePay}>
              Pay {formatPrice(getDraftTotal())} Securely
            </button>
          </div>

          <div className={styles.secureNote}>
            🔒 256-bit SSL encryption · PCI DSS compliant · 100% secure
          </div>

        </div>

        <BookingSidebar />
      </div>
    </div>
  )
}
