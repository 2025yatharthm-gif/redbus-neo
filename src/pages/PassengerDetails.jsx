import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../context/BookingContext'
import { formatPrice } from '../utils/format'
import BookingStepBar from '../components/booking/BookingStepBar'
import BookingSidebar from '../components/booking/BookingSidebar'
import styles from './PassengerDetails.module.css'

/* ── Validation helpers ──────────────────────────────────────── */
function validatePassenger(p) {
  const errs = {}
  if (!p.name.trim())               errs.name   = 'Full name is required'
  if (!p.age || isNaN(p.age) || Number(p.age) < 1 || Number(p.age) > 120)
                                     errs.age    = 'Enter a valid age (1–120)'
  if (!p.gender)                     errs.gender = 'Select a gender'
  return errs
}

function validateContact(c) {
  const errs = {}
  if (!c.mobile.trim())              errs.mobile = 'Mobile number is required'
  else if (!/^\d{10}$/.test(c.mobile.replace(/\s/g, '')))
                                     errs.mobile = 'Enter a valid 10-digit mobile number'
  if (!c.email.trim())               errs.email  = 'Email address is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email))
                                     errs.email  = 'Enter a valid email address'
  return errs
}

export default function PassengerDetails() {
  const navigate = useNavigate()
  const { draft, updateDraft, ADD_ONS, addOnTotal, getDraftTotal } = useBooking()

  const [passengerErrors, setPassengerErrors] = useState([])
  const [contactErrors,   setContactErrors]   = useState({})
  const [submitted,       setSubmitted]        = useState(false)

  // Guard: if no draft, redirect home
  useEffect(() => {
    if (!draft) navigate('/', { replace: true })
  }, [draft, navigate])

  if (!draft) return null

  const { passengers, contact, addOns, travelDate } = draft
  const todayStr = new Date().toISOString().split('T')[0]

  // ── Handlers ─────────────────────────────────────────────────
  function handlePassengerChange(idx, field, value) {
    const updated = passengers.map((p, i) =>
      i === idx ? { ...p, [field]: value } : p
    )
    updateDraft({ passengers: updated })

    // Clear error on edit
    if (submitted) {
      const errs = [...passengerErrors]
      if (errs[idx]) {
        errs[idx] = { ...errs[idx], [field]: undefined }
        setPassengerErrors(errs)
      }
    }
  }

  function handleContactChange(field, value) {
    updateDraft({ contact: { ...contact, [field]: value } })
    if (submitted) {
      setContactErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  function handleAddOnToggle(id) {
    const next = addOns.includes(id)
      ? addOns.filter(a => a !== id)
      : [...addOns, id]
    updateDraft({ addOns: next })
  }

  function handleSubmit() {
    setSubmitted(true)

    // Validate all passengers
    const pErrs = passengers.map(validatePassenger)
    const cErrs = validateContact(contact)

    setPassengerErrors(pErrs)
    setContactErrors(cErrs)

    const hasPassengerErr = pErrs.some(e => Object.keys(e).length > 0)
    const hasContactErr   = Object.keys(cErrs).length > 0

    if (hasPassengerErr || hasContactErr) return

    navigate('/payment')
  }

  return (
    <div className={styles.page}>
      <BookingStepBar current={2} />

      <div className={styles.content}>
        <div className={styles.mainCol}>

          {/* ── Passenger forms ─────────────────── */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Passenger Details</h2>
            <p className={styles.sectionSub}>Fill in details for each passenger</p>

            <div className={styles.passengerList}>
              {passengers.map((p, idx) => {
                const errs = passengerErrors[idx] || {}
                return (
                  <div key={p.seatId} className={styles.passengerCard}>
                    <div className={styles.passengerCardHeader}>
                      <div className={styles.passengerNum}>
                        <span className={styles.passengerIcon}>👤</span>
                        Passenger {idx + 1}
                      </div>
                      <div className={styles.seatTag}>Seat #{p.seatNum}</div>
                    </div>

                    <div className={styles.fieldGrid}>
                      <div className={`${styles.fieldGroup} ${styles.fieldFull}`}>
                        <label className={styles.fieldLabel}>Full Name *</label>
                        <input
                          className={`${styles.fieldInput} ${errs.name ? styles.fieldError : ''}`}
                          type="text"
                          placeholder="e.g. Rahul Sharma"
                          value={p.name}
                          onChange={e => handlePassengerChange(idx, 'name', e.target.value)}
                        />
                        {errs.name && <span className={styles.errorMsg}>{errs.name}</span>}
                      </div>

                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Age *</label>
                        <input
                          className={`${styles.fieldInput} ${errs.age ? styles.fieldError : ''}`}
                          type="number"
                          placeholder="25"
                          min="1"
                          max="120"
                          value={p.age}
                          onChange={e => handlePassengerChange(idx, 'age', e.target.value)}
                        />
                        {errs.age && <span className={styles.errorMsg}>{errs.age}</span>}
                      </div>

                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Gender *</label>
                        <select
                          className={`${styles.fieldInput} ${styles.fieldSelect} ${errs.gender ? styles.fieldError : ''}`}
                          value={p.gender}
                          onChange={e => handlePassengerChange(idx, 'gender', e.target.value)}
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer_not">Prefer not to say</option>
                        </select>
                        {errs.gender && <span className={styles.errorMsg}>{errs.gender}</span>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* ── Contact details ──────────────────── */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Contact Details</h2>
            <p className={styles.sectionSub}>Your ticket and booking updates will be sent here</p>

            <div className={styles.contactCard}>
              <div className={styles.fieldGrid}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Mobile Number *</label>
                  <div className={styles.phoneWrap}>
                    <span className={styles.phonePrefix}>+91</span>
                    <input
                      className={`${styles.fieldInput} ${styles.phoneInput} ${contactErrors.mobile ? styles.fieldError : ''}`}
                      type="tel"
                      placeholder="98765 43210"
                      value={contact.mobile}
                      maxLength={10}
                      onChange={e => handleContactChange('mobile', e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                  {contactErrors.mobile && <span className={styles.errorMsg}>{contactErrors.mobile}</span>}
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Email Address *</label>
                  <input
                    className={`${styles.fieldInput} ${contactErrors.email ? styles.fieldError : ''}`}
                    type="email"
                    placeholder="you@example.com"
                    value={contact.email}
                    onChange={e => handleContactChange('email', e.target.value)}
                  />
                  {contactErrors.email && <span className={styles.errorMsg}>{contactErrors.email}</span>}
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Journey Date *</label>
                  <input
                    className={styles.fieldInput}
                    type="date"
                    min={todayStr}
                    value={travelDate || ''}
                    onChange={e => updateDraft({ travelDate: e.target.value })}
                  />
                  {!travelDate && submitted && (
                    <span className={styles.errorMsg}>Please select a journey date</span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ── Add-ons ─────────────────────────── */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Travel Add-ons</h2>
            <p className={styles.sectionSub}>Optional services to enhance your journey</p>

            <div className={styles.addOnGrid}>
              {ADD_ONS.map(addon => {
                const selected = addOns.includes(addon.id)
                return (
                  <button
                    key={addon.id}
                    className={`${styles.addOnCard} ${selected ? styles.addOnSelected : ''}`}
                    onClick={() => handleAddOnToggle(addon.id)}
                  >
                    <div className={styles.addOnTop}>
                      <span className={styles.addOnIcon}>{addon.icon}</span>
                      <div className={styles.addOnCheck}>
                        {selected ? '✓' : '+'}
                      </div>
                    </div>
                    <div className={styles.addOnLabel}>{addon.label}</div>
                    <div className={styles.addOnDesc}>{addon.desc}</div>
                    <div className={styles.addOnPrice}>{formatPrice(addon.price)}</div>
                  </button>
                )
              })}
            </div>

            {addOns.length > 0 && (
              <div className={styles.addOnTotal}>
                Add-ons total: <strong>{formatPrice(addOnTotal(addOns))}</strong>
              </div>
            )}
          </section>

          {/* ── Actions ─────────────────────────── */}
          <div className={styles.actions}>
            <button className={styles.backBtn} onClick={() => navigate(-1)}>
              ← Back
            </button>
            <button className={styles.continueBtn} onClick={handleSubmit}>
              Continue to Payment · {formatPrice(getDraftTotal())}
            </button>
          </div>

        </div>

        {/* Right sidebar */}
        <BookingSidebar />
      </div>
    </div>
  )
}
