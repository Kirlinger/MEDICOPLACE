/**
 * Server-side validation utilities.
 * These mirror client-side validation but are authoritative —
 * never trust client-side validation alone.
 */

/** Validate email format */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(trimmed);
}

/** Validate Haitian phone number */
export function isValidPhone(phone: string, required = false): boolean {
  if (!phone || typeof phone !== 'string') return !required;
  const trimmed = phone.trim();
  if (!trimmed) return !required;
  const phoneRegex = /^\+?509\s?\d{2}\s?\d{2}\s?\d{4}$/;
  return phoneRegex.test(trimmed.replace(/-/g, ''));
}

/** Validate name fields */
export function isValidName(name: string): boolean {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  if (trimmed.length < 1 || trimmed.length > 100) return false;
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
  return nameRegex.test(trimmed);
}

/** Validate password meets strength requirements */
export function isStrongPassword(password: string): { valid: boolean; reason?: string } {
  if (!password || typeof password !== 'string') return { valid: false, reason: 'Mot de passe requis' };
  if (password.length < 8) return { valid: false, reason: 'Au moins 8 caractères requis' };
  if (password.length > 128) return { valid: false, reason: 'Mot de passe trop long' };
  if (!/[A-Z]/.test(password)) return { valid: false, reason: 'Une majuscule requise' };
  if (!/[a-z]/.test(password)) return { valid: false, reason: 'Une minuscule requise' };
  if (!/\d/.test(password)) return { valid: false, reason: 'Un chiffre requis' };
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) return { valid: false, reason: 'Un caractère spécial requis' };
  return { valid: true };
}

/** Validate address */
export function isValidAddress(address: string): boolean {
  if (!address || typeof address !== 'string') return false;
  const trimmed = address.trim();
  return trimmed.length >= 3 && trimmed.length <= 200;
}

/** Validate a positive integer quantity */
export function isValidQuantity(quantity: number, min = 1, max = 99): boolean {
  return Number.isInteger(quantity) && quantity >= min && quantity <= max;
}

/** Sanitize a string by trimming and limiting length */
export function sanitize(input: unknown, maxLength = 500): string {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, maxLength);
}

/** Validate a date of birth (must be reasonable age) */
export function isValidDateOfBirth(dateStr: string): boolean {
  if (!dateStr || typeof dateStr !== 'string') return true; // optional field
  const trimmed = dateStr.trim();
  if (!trimmed) return true;
  // Must match YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return false;
  const [year, month, day] = trimmed.split('-').map(Number);
  // Validate components are reasonable
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const date = new Date(year, month - 1, day);
  if (isNaN(date.getTime())) return false;
  // Compare date-only (avoid timezone issues)
  const now = new Date();
  const todayYear = now.getFullYear();
  const todayMonth = now.getMonth();
  const todayDay = now.getDate();
  // Must not be in the future (date-only comparison)
  if (year > todayYear || (year === todayYear && (month - 1 > todayMonth || (month - 1 === todayMonth && day > todayDay)))) return false;
  // Must be at most 150 years old
  if (todayYear - year > 150) return false;
  return true;
}

/** Generic error response (never expose internal details) */
export function safeError(message: string, status = 400): Response {
  return Response.json({ error: message }, { status });
}
