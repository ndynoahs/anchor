// ============================================================
// Anchor — App Constants
// ============================================================

export const API_BASE_URL = 'http://localhost:4000/api/v1';

export const APP_NAME = 'Anchor';

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'anchor_access_token',
  REFRESH_TOKEN: 'anchor_refresh_token',
  USER_PREFERENCES: 'anchor_user_preferences',
  ONBOARDING_COMPLETE: 'anchor_onboarding_complete',
} as const;

export const COLORS = {
  // Primary palette
  primary: '#1d9d8e',
  primaryDark: '#147e72',
  primaryLight: '#35b9a8',

  // Background
  bg: '#0f1e2e',
  bgCard: '#1d2f43',
  bgSurface: '#28415b',
  bgInput: '#1d2f43',

  // Text
  textPrimary: '#f0f4f8',
  textSecondary: '#b3c2d6',
  textMuted: '#6b8aa8',
  textInverse: '#0f1e2e',

  // UI
  border: '#2f4f6e',
  borderLight: '#3f6488',
  error: '#e84a4a',
  success: '#4ade80',
  warning: '#f59e0b',
  info: '#63d3c4',

  // States
  disabled: '#3f6488',
  overlay: 'rgba(0, 0, 0, 0.6)',
} as const;

export const FONTS = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  weights: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
} as const;

export const MOOD_EMOJIS: Record<string, string> = {
  great: '🌟',
  good: '🙂',
  neutral: '😐',
  low: '😔',
  crisis: '🆘',
};

export const TRIGGER_LABELS: Record<string, string> = {
  stress: 'Stress',
  lonely: 'Loneliness',
  angry: 'Anger',
  sad: 'Sadness',
  anxious: 'Anxiety',
  celebrating: 'Celebrating',
  other: 'Other',
};