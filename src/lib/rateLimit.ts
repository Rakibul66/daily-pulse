/**
 * Central Rate Limiting, Anti-Spam & Action-Locking Utility
 * Protects public forms, AI endpoints, authentication workflows, and financial
 * operations from rapid clicking, duplicate transactions, brute-force, and bot spam.
 */

interface RateLimitRecord {
  timestamps: number[];
  lockUntil?: number;
}

const STORAGE_PREFIX = 'dp_rl_';

// In-memory locks for immediate action debouncing
const actionLocks = new Map<string, number>();

/**
 * Retrieve rate limit records for a given action key (synced with localStorage)
 */
function getRecord(key: string): RateLimitRecord {
  if (typeof window === 'undefined') {
    return { timestamps: [] };
  }
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (!raw) return { timestamps: [] };
    const parsed = JSON.parse(raw);
    return {
      timestamps: Array.isArray(parsed.timestamps) ? parsed.timestamps : [],
      lockUntil: typeof parsed.lockUntil === 'number' ? parsed.lockUntil : undefined,
    };
  } catch {
    return { timestamps: [] };
  }
}

/**
 * Persist rate limit records
 */
function saveRecord(key: string, record: RateLimitRecord): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(record));
  } catch {
    // Ignore storage quota errors
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
  message?: string;
}

/**
 * Check whether an action is currently allowed within a sliding time window.
 * If allowed, automatically records this attempt.
 *
 * @param key Unique key for this action / resource (e.g. 'contact_form', 'auth_login')
 * @param maxAttempts Maximum attempts permitted within windowMs
 * @param windowMs Time window in milliseconds (e.g. 60000 for 1 minute)
 * @param penaltyLockMs Optional lockout duration if exceeded (e.g. 60000 for 1 min lockout)
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number,
  penaltyLockMs: number = 0
): RateLimitResult {
  const now = Date.now();
  const record = getRecord(key);

  // 1. Check if explicitly locked out
  if (record.lockUntil && record.lockUntil > now) {
    const retryAfterSeconds = Math.ceil((record.lockUntil - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
      message: `Too many requests. Please wait ${retryAfterSeconds} second${retryAfterSeconds > 1 ? 's' : ''} before trying again.`,
    };
  }

  // 2. Filter out timestamps outside the sliding window
  const recentTimestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  // 3. Check threshold
  if (recentTimestamps.length >= maxAttempts) {
    const lockUntil = penaltyLockMs > 0 ? now + penaltyLockMs : recentTimestamps[0] + windowMs;
    const retryAfterSeconds = Math.ceil((lockUntil - now) / 1000);
    saveRecord(key, { timestamps: recentTimestamps, lockUntil });

    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
      message: `Rate limit reached (${maxAttempts} attempts per ${Math.round(windowMs / 1000)}s). Please wait ${retryAfterSeconds}s.`,
    };
  }

  // 4. Record current attempt and allow
  recentTimestamps.push(now);
  saveRecord(key, { timestamps: recentTimestamps });

  return {
    allowed: true,
    remaining: Math.max(0, maxAttempts - recentTimestamps.length),
    retryAfterSeconds: 0,
  };
}

/**
 * Reset rate limit counter for a specific key (e.g. upon successful authentication)
 */
export function resetRateLimit(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  } catch {
    // Ignore
  }
}

/**
 * Action Locker (Debouncer / Double-submit Guard)
 * Ensures an async action cannot be fired again until cooldownMs has elapsed.
 * Perfect for POS checkout, Invoice save, Payment recording, and Deletes.
 *
 * @param lockKey Key identifying this action instance
 * @param cooldownMs Minimum wait time between calls (default 2000ms)
 * @param fn The async function to execute
 */
export async function withActionLock<T>(
  lockKey: string,
  cooldownMs: number,
  fn: () => Promise<T>
): Promise<T> {
  const now = Date.now();
  const lockedUntil = actionLocks.get(lockKey);

  if (lockedUntil && lockedUntil > now) {
    const waitSec = ((lockedUntil - now) / 1000).toFixed(1);
    throw new Error(`Please wait ${waitSec}s before retrying this action to prevent duplicates.`);
  }

  // Acquire lock
  actionLocks.set(lockKey, now + cooldownMs);

  try {
    return await fn();
  } finally {
    // Retain lock until cooldown expires
    setTimeout(() => {
      actionLocks.delete(lockKey);
    }, cooldownMs);
  }
}

/**
 * Pre-configured presets for key application flows
 */
export const RATE_LIMIT_PRESETS = {
  // Public contact inquiry: 3 submissions per 5 minutes, 3-minute penalty lockout
  CONTACT_FORM: { max: 3, windowMs: 5 * 60 * 1000, penaltyMs: 3 * 60 * 1000 },
  // Auth login: 5 failed attempts per 60 seconds, 60-second penalty lockout
  AUTH_LOGIN: { max: 5, windowMs: 60 * 1000, penaltyMs: 60 * 1000 },
  // Auth password reset: 2 requests per 5 minutes
  AUTH_FORGOT_PASSWORD: { max: 2, windowMs: 5 * 60 * 1000, penaltyMs: 5 * 60 * 1000 },
  // AI Lead prospecting: 5 requests per 60 seconds
  AI_PROSPECT: { max: 5, windowMs: 60 * 1000, penaltyMs: 30 * 1000 },
  // Financial transaction submit cooldown (POS, Payment, Invoice)
  FINANCIAL_COOLDOWN_MS: 2000,
};
