/**
 * Purpose: Client-side email/password checks before hitting API.
 */
export function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());
}

export function minLength(v, n) {
  return String(v || '').length >= n;
}
