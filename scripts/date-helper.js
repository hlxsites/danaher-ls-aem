/**
 * Format date expressed in UTC seconds
 * @param {number} date
 * @returns new string with the formatted date
 */

// eslint-disable-next-line import/prefer-default-export
export function formatDateUTCSeconds(date, options = {}) {
  const dateObj = new Date(0);
  dateObj.setUTCSeconds(date);

  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    ...options,
  });
}
