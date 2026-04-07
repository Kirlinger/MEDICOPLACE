/**
 * Input validation and sanitization utilities for MEDICOPLACE.
 * Provides client-side protection against XSS, injection, and malformed data.
 */

/** Sanitize a string by escaping HTML entities to prevent XSS */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/** Validate email format */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

/** Validate Haitian phone number format (+509 XX XX XXXX) */
export function isValidPhone(phone: string): boolean {
  if (!phone || phone.trim() === '') return true; // optional field
  const phoneRegex = /^\+?509\s?\d{2}\s?\d{2}\s?\d{4}$/;
  return phoneRegex.test(phone.trim().replace(/-/g, ''));
}

/** Password strength requirements */
export interface PasswordStrength {
  isValid: boolean;
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

/** Check password strength */
export function checkPasswordStrength(password: string): PasswordStrength {
  const result: PasswordStrength = {
    hasMinLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    isValid: false,
  };
  result.isValid =
    result.hasMinLength &&
    result.hasUpperCase &&
    result.hasLowerCase &&
    result.hasNumber &&
    result.hasSpecialChar;
  return result;
}

/** Validate that a string is not empty after trimming */
export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

/** Validate name fields (no special characters that could be injection) */
export function isValidName(name: string): boolean {
  if (!name.trim()) return false;
  // Allow letters, accented chars, hyphens, apostrophes, spaces
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]{1,100}$/;
  return nameRegex.test(name.trim());
}

/** Validate that passwords match */
export function passwordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword && password.length > 0;
}

/** Limit input length to prevent abuse */
export function truncateInput(input: string, maxLength: number): string {
  return input.slice(0, maxLength);
}

/** Validate a positive integer quantity within bounds */
export function isValidQuantity(quantity: number, min = 1, max = 99): boolean {
  return Number.isInteger(quantity) && quantity >= min && quantity <= max;
}

/** Clamp a quantity to valid bounds */
export function clampQuantity(quantity: number, min = 1, max = 99): number {
  return Math.max(min, Math.min(max, Math.floor(quantity)));
}

/** Validate card-free payment fields (shipping address) */
export function isValidAddress(address: string): boolean {
  if (!address.trim()) return false;
  return address.trim().length >= 3 && address.trim().length <= 200;
}
