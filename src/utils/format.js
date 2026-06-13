/**
 * Format a price in Indian Rupees (legacy, used in contexts without SettingsContext).
 * @param {number} amount
 * @returns {string}  e.g. "₹1,299"
 */
export function formatPrice(amount) {
  return `₹${amount.toLocaleString('en-IN')}`
}

/**
 * Format a date object to "Mon DD, YYYY"
 * @param {Date} date
 * @returns {string}
 */
export function formatDate(date) {
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Build query string params from an object.
 * @param {Record<string, string>} params
 * @returns {string}
 */
export function buildQueryString(params) {
  return new URLSearchParams(params).toString()
}

/**
 * Performance rating label for a given millisecond value.
 */
export function perfRating(ms) {
  if (ms < 100)  return { label: 'Excellent', color: '#22C55E' }
  if (ms < 300)  return { label: 'Good',      color: '#84CC16' }
  if (ms < 800)  return { label: 'Fair',       color: '#F59E0B' }
  return              { label: 'Slow',       color: '#EF4444' }
}
