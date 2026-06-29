// ============================================================
// Anchor — Utility Functions
// ============================================================

import { STORAGE_KEYS } from '../constants';

/**
 * Format a date string to a relative time (e.g., "2m ago", "1h ago")
 */
export function formatRelativeTime(dateString: string): string {
  const now = Date.now();
  const date = new Date(dateString).getTime();
  const diffMs = now - date;

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;

  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Truncate text to a max length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Generate a random anonymous-style username
 */
export function generateAnonymousUsername(): string {
  const adjectives = ['Calm', 'Quiet', 'Gentle', 'Brave', 'Kind', 'Wise', 'Bright', 'Steady', 'True', 'Free'];
  const nouns = ['Wave', 'Path', 'Star', 'Leaf', 'Moon', 'Tide', 'Sky', 'Seed', 'Light', 'Stone'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 999) + 1;
  return `${adj}${noun}${num}`;
}

/**
 * Validate a username (3-20 chars, alphanumeric + underscores)
 */
export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

/**
 * Validate a password (min 8 chars, at least 1 letter and 1 number)
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
}

/**
 * Generate auth headers from stored tokens
 */
export function getAuthHeaders(): Record<string, string> {
  // This will be used with the secure store in the actual auth service
  return {};
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Check if the user has completed onboarding
 */
export function hasCompletedOnboarding(): boolean {
  // Will be connected to secure store / async storage
  return false;
}

export { STORAGE_KEYS };