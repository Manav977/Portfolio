import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './config';

const ADMIN_ATTEMPT_KEY = 'portfolio-admin-attempts';
const ADMIN_MAX_ATTEMPTS = 5;
const ADMIN_LOCKOUT_MS = 15 * 60 * 1000;
export const ADMIN_SESSION_TIMEOUT_MS = 30 * 60 * 1000;

const allowedAdminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const parseStoredAttempts = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(ADMIN_ATTEMPT_KEY);
    const parsedValue = rawValue ? JSON.parse(rawValue) : [];

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter((value) => Number.isFinite(value));
  } catch (error) {
    return [];
  }
};

const saveAttempts = (attempts) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(ADMIN_ATTEMPT_KEY, JSON.stringify(attempts));
};

const getRecentAttempts = () => {
  const cutoff = Date.now() - ADMIN_LOCKOUT_MS;
  const recentAttempts = parseStoredAttempts().filter((timestamp) => timestamp > cutoff);
  saveAttempts(recentAttempts);
  return recentAttempts;
};

export function isAdminAllowlistConfigured() {
  return allowedAdminEmails.length > 0;
}

export function isAllowedAdminEmail(email = '') {
  if (!allowedAdminEmails.length) {
    return true;
  }

  return allowedAdminEmails.includes(email.trim().toLowerCase());
}

export function getAdminCooldownMs() {
  const recentAttempts = getRecentAttempts();

  if (recentAttempts.length < ADMIN_MAX_ATTEMPTS) {
    return 0;
  }

  const oldestAttempt = recentAttempts[0];
  return Math.max(0, ADMIN_LOCKOUT_MS - (Date.now() - oldestAttempt));
}

export function recordFailedAdminAttempt() {
  const recentAttempts = getRecentAttempts();
  recentAttempts.push(Date.now());
  saveAttempts(recentAttempts);
}

export function clearFailedAdminAttempts() {
  saveAttempts([]);
}

export async function loginAdmin(email, password) {
  if (!isAllowedAdminEmail(email)) {
    throw new Error('unauthorized-admin');
  }

  const credentials = await signInWithEmailAndPassword(auth, email, password);

  if (!isAllowedAdminEmail(credentials.user?.email)) {
    await signOut(auth);
    throw new Error('unauthorized-admin');
  }

  clearFailedAdminAttempts();
  return credentials.user;
}

export async function logoutAdmin() {
  await signOut(auth);
}
