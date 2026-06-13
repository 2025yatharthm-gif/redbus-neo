import { useSettings } from '../context/SettingsContext'
import styles from './Settings.module.css'

export default function Settings() {
  const { theme, currency, setTheme, setCurrency, CURRENCIES, THEMES } = useSettings()

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.sub}>Customize your RedBus Neo experience</p>
        </div>
      </div>

      <div className={styles.content}>

        {/* ── Theme ─────────────────────────── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Appearance</h2>
          <p className={styles.sectionSub}>Choose how RedBus Neo looks to you</p>

          <div className={styles.themeGrid}>
            <button
              className={`${styles.themeCard} ${theme === THEMES.dark ? styles.themeActive : ''}`}
              onClick={() => setTheme(THEMES.dark)}
            >
              <div className={styles.themePreview} data-preview="dark">
                <div className={styles.previewBar} />
                <div className={styles.previewLines}>
                  <div className={styles.previewLine} />
                  <div className={styles.previewLine} style={{ width: '60%' }} />
                </div>
              </div>
              <div className={styles.themeInfo}>
                <span className={styles.themeLabel}>🌙 Dark Mode</span>
                <span className={styles.themeDesc}>Easy on the eyes at night</span>
              </div>
              {theme === THEMES.dark && <span className={styles.themeCheck}>✓</span>}
            </button>

            <button
              className={`${styles.themeCard} ${theme === THEMES.light ? styles.themeActive : ''}`}
              onClick={() => setTheme(THEMES.light)}
            >
              <div className={styles.themePreview} data-preview="light">
                <div className={styles.previewBar} />
                <div className={styles.previewLines}>
                  <div className={styles.previewLine} />
                  <div className={styles.previewLine} style={{ width: '60%' }} />
                </div>
              </div>
              <div className={styles.themeInfo}>
                <span className={styles.themeLabel}>☀️ Light Mode</span>
                <span className={styles.themeDesc}>Clean and bright interface</span>
              </div>
              {theme === THEMES.light && <span className={styles.themeCheck}>✓</span>}
            </button>
          </div>
        </section>

        {/* ── Currency ──────────────────────── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Currency</h2>
          <p className={styles.sectionSub}>All fares will be displayed in your chosen currency</p>

          <div className={styles.currencyGrid}>
            {Object.values(CURRENCIES).map(c => (
              <button
                key={c.code}
                className={`${styles.currencyCard} ${currency === c.code ? styles.currencyActive : ''}`}
                onClick={() => setCurrency(c.code)}
              >
                <span className={styles.currencySymbol}>{c.symbol}</span>
                <div className={styles.currencyInfo}>
                  <span className={styles.currencyCode}>{c.code}</span>
                  <span className={styles.currencyLabel}>{c.label}</span>
                </div>
                {currency === c.code && <span className={styles.currencyCheck}>✓</span>}
              </button>
            ))}
          </div>

          {currency !== 'INR' && (
            <div className={styles.rateNote}>
              Rates are indicative. Actual charges are in INR.
            </div>
          )}
        </section>

        {/* ── About ─────────────────────────── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>About</h2>
          <div className={styles.aboutCard}>
            <div className={styles.aboutBrand}>🚌 RedBus <span style={{ color: 'var(--color-brand)' }}>Neo</span></div>
            <div className={styles.aboutGrid}>
              <div className={styles.aboutItem}>
                <span className={styles.aboutLabel}>Version</span>
                <span className={styles.aboutVal}>5.0.0</span>
              </div>
              <div className={styles.aboutItem}>
                <span className={styles.aboutLabel}>Phases</span>
                <span className={styles.aboutVal}>1 – 5 Complete</span>
              </div>
              <div className={styles.aboutItem}>
                <span className={styles.aboutLabel}>Routes</span>
                <span className={styles.aboutVal}>6 major routes</span>
              </div>
              <div className={styles.aboutItem}>
                <span className={styles.aboutLabel}>Buses</span>
                <span className={styles.aboutVal}>60 mock buses</span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
