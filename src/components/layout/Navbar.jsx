import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useBooking }  from '../../context/BookingContext'
import { useSettings } from '../../context/SettingsContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const navigate       = useNavigate()
  const { bookings }   = useBooking()
  const { theme, setTheme } = useSettings()

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>

        {/* Brand */}
        <Link to="/" className={styles.brand}>
          <span className={styles.brandIcon}>🚌</span>
          <span className={styles.brandName}>
            Red<span className={styles.brandAccent}>Bus</span>
            <span className={styles.brandTag}>NEO</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className={styles.links}>
          {[
            { to: '/',            label: 'Home',        end: true  },
            { to: '/results',     label: 'Search',      end: false },
            { to: '/my-bookings', label: 'My Bookings', end: false, badge: bookings.length },
            { to: '/achievements',label: 'Achievements',end: false },
          ].map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.linkActive}` : styles.link
              }
            >
              {item.label}
              {item.badge > 0 && (
                <span className={styles.badge}>{item.badge}</span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Right actions */}
        <div className={styles.actions}>
          {/* Theme toggle */}
          <button
            className={styles.iconBtn}
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Performance link */}
          <NavLink
            to="/performance"
            className={({ isActive }) =>
              isActive ? `${styles.iconBtn} ${styles.iconBtnActive}` : styles.iconBtn
            }
            title="Performance Dashboard"
            aria-label="Performance"
          >
            ⚡
          </NavLink>

          {/* Settings link */}
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive ? `${styles.iconBtn} ${styles.iconBtnActive}` : styles.iconBtn
            }
            title="Settings"
            aria-label="Settings"
          >
            ⚙️
          </NavLink>
        </div>

      </nav>
    </header>
  )
}
