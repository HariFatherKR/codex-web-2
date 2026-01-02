'use client';

export const STORAGE_KEYS = {
  idea: 'copy-idea',
  results: 'copy-results',
  selectedIndex: 'copy-selected-index',
  recentIds: 'copy-recent-ids',
} as const;

export function setSessionValue<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(key, JSON.stringify(value));
}

export function getSessionValue<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const raw = sessionStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn('Failed to parse sessionStorage value', error);
    return fallback;
  }
}

export function clearSessionValues(keys: string[]) {
  if (typeof window === 'undefined') return;
  keys.forEach((key) => sessionStorage.removeItem(key));
}
