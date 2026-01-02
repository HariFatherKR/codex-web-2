'use client';

export const STORAGE_KEYS = {
  idea: 'copy-idea',
  results: 'copy-results',
  selectedIndex: 'copy-selected-index',
  recentIds: 'copy-recent-ids',
  generationId: 'copy-generation-id',
} as const;

export const LOCAL_KEYS = {
  clientSessionId: 'copy-client-session-id',
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

export function setLocalValue<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getLocalValue<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn('Failed to parse localStorage value', error);
    return fallback;
  }
}

export function getOrCreateClientSessionId() {
  if (typeof window === 'undefined') return '';
  const existing = getLocalValue<string | null>(LOCAL_KEYS.clientSessionId, null);
  if (existing) return existing;

  const id = crypto.randomUUID();
  setLocalValue(LOCAL_KEYS.clientSessionId, id);
  return id;
}
