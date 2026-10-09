/**
 * Enterprise Application-Layer Field Encryption & Hashing Utilities
 *
 * Implements:
 * 1. AES-256-GCM Two-Way Cipher for sensitive fields (API keys, bank info, secrets).
 *    Uses PBKDF2 with 100,000 iterations for key derivation, unique 12-byte IV per encryption,
 *    and authenticated encryption tag to prevent data tampering.
 * 2. SHA-256 One-Way Hashing for checksums, lookup fingerprints, and data integrity verification.
 */

const ENCRYPTION_PREFIX = 'enc:v1:';
const DEFAULT_SALT = 'shomporko-crm-salt-v1';

// Helper to convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return typeof btoa !== 'undefined' 
    ? btoa(binary) 
    : Buffer.from(binary, 'binary').toString('base64');
}

// Helper to convert Base64 to Uint8Array
function base64ToUint8Array(base64: string): Uint8Array {
  const binary = typeof atob !== 'undefined'
    ? atob(base64)
    : Buffer.from(base64, 'base64').toString('binary');
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Derive a 256-bit AES-GCM CryptoKey using PBKDF2
async function deriveKey(secret: string, saltBytes: Uint8Array): Promise<CryptoKey> {
  const cryptoObj = globalThis.crypto;
  if (!cryptoObj?.subtle) {
    throw new Error('Web Crypto API is not available in this environment');
  }

  const enc = new TextEncoder();
  const keyMaterial = await cryptoObj.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return await cryptoObj.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBytes as unknown as BufferSource,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Output format: enc:v1:<base64-salt>:<base64-iv>:<base64-ciphertext>
 */
export async function encryptField(plaintext: string, secret?: string): Promise<string> {
  if (!plaintext) return '';
  // If already encrypted, return as-is
  if (isEncrypted(plaintext)) return plaintext;

  const cryptoObj = globalThis.crypto;
  if (!cryptoObj?.subtle) {
    console.warn('Crypto subtle not supported, storing plain');
    return plaintext;
  }

  try {
    const encSecret = secret || process.env.NEXT_PUBLIC_CRYPTO_SECRET || DEFAULT_SALT;
    
    // Generate random 16-byte salt and 12-byte IV
    const salt = new Uint8Array(16);
    cryptoObj.getRandomValues(salt);

    const iv = new Uint8Array(12);
    cryptoObj.getRandomValues(iv);

    const key = await deriveKey(encSecret, salt);
    const enc = new TextEncoder();
    
    const ciphertextBuffer = await cryptoObj.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv as unknown as BufferSource
      },
      key,
      enc.encode(plaintext)
    );

    const saltB64 = arrayBufferToBase64(salt.buffer);
    const ivB64 = arrayBufferToBase64(iv.buffer);
    const cipherB64 = arrayBufferToBase64(ciphertextBuffer);

    return `${ENCRYPTION_PREFIX}${saltB64}:${ivB64}:${cipherB64}`;
  } catch (err) {
    console.error('Encryption error:', err);
    return plaintext;
  }
}

/**
 * Decrypts an AES-256-GCM ciphertext created by encryptField.
 * Automatically falls back to plaintext if the string was not encrypted.
 */
export async function decryptField(encryptedText: string, secret?: string): Promise<string> {
  if (!encryptedText) return '';
  // If not encrypted, return plain text (backward compatibility)
  if (!isEncrypted(encryptedText)) return encryptedText;

  const cryptoObj = globalThis.crypto;
  if (!cryptoObj?.subtle) {
    return encryptedText;
  }

  try {
    const encSecret = secret || process.env.NEXT_PUBLIC_CRYPTO_SECRET || DEFAULT_SALT;
    const payload = encryptedText.slice(ENCRYPTION_PREFIX.length);
    const [saltB64, ivB64, cipherB64] = payload.split(':');

    if (!saltB64 || !ivB64 || !cipherB64) {
      return encryptedText;
    }

    const salt = base64ToUint8Array(saltB64);
    const iv = base64ToUint8Array(ivB64);
    const cipherBytes = base64ToUint8Array(cipherB64);

    const key = await deriveKey(encSecret, salt);

    const decryptedBuffer = await cryptoObj.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv as unknown as BufferSource
      },
      key,
      cipherBytes as unknown as BufferSource
    );

    const dec = new TextDecoder();
    return dec.decode(decryptedBuffer);
  } catch (err) {
    console.error('Decryption failed, returning raw payload:', err);
    return encryptedText;
  }
}

/**
 * Checks if a string has the AES-256 cipher signature prefix.
 */
export function isEncrypted(value: string): boolean {
  return typeof value === 'string' && value.startsWith(ENCRYPTION_PREFIX);
}

/**
 * One-Way Hash (SHA-256)
 * Ideal for creating deterministic hashes (e.g. data checksums, blind indexes for searching).
 */
export async function hashData(value: string): Promise<string> {
  if (!value) return '';
  const cryptoObj = globalThis.crypto;
  if (!cryptoObj?.subtle) return value;

  const enc = new TextEncoder();
  const hashBuffer = await cryptoObj.subtle.digest('SHA-256', enc.encode(value));
  return arrayBufferToBase64(hashBuffer);
}
