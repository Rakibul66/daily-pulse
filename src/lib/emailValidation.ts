/**
 * Email validation utilities for registration and security
 * Blocks disposable/throwaway domains and enforces genuine business/personal emails.
 */

// Common disposable/burner email service domains
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  'temp-mail.org',
  '10minutemail.com',
  'guerrillamail.com',
  'guerrillamail.info',
  'guerrillamail.biz',
  'guerrillamail.de',
  'guerrillamail.net',
  'guerrillamail.org',
  'sharklasers.com',
  'grr.la',
  'yopmail.com',
  'yopmail.fr',
  'yopmail.net',
  'throwawaymail.com',
  'trashmail.com',
  'trashmail.net',
  'dispostable.com',
  'fakeinbox.com',
  'getairmail.com',
  'mytemp.email',
  'burnermail.io',
  'generator.email',
  'inboxkitten.com',
  'dropmail.me',
  'crazymailing.com',
  'fakemailgenerator.com',
  'nada.ltd',
  'getnada.com',
  'mohmal.com',
  'tempail.com',
  'tempinbox.com',
  'emailondeck.com',
  'tempmailaddress.com',
  'minutemailbox.com',
  'throwawayemailaddress.com',
]);

const STRICT_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;

export function validateRegistrationEmail(email: string): { valid: boolean; error?: string } {
  const trimmed = (email || '').trim().toLowerCase();

  if (!trimmed) {
    return { valid: false, error: 'Email address is required.' };
  }

  if (!STRICT_EMAIL_REGEX.test(trimmed)) {
    return { valid: false, error: 'Please enter a valid email address (e.g., name@yourcompany.com).' };
  }

  const parts = trimmed.split('@');
  if (parts.length !== 2) {
    return { valid: false, error: 'Invalid email format.' };
  }

  const [localPart, domain] = parts;

  if (localPart.length > 64) {
    return { valid: false, error: 'Email username is too long.' };
  }

  if (domain.length > 255) {
    return { valid: false, error: 'Email domain is too long.' };
  }

  // Check for disposable domain
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return {
      valid: false,
      error: 'Disposable or temporary email addresses are not allowed. Please use your genuine business or personal email.',
    };
  }

  // Check for common fake patterns (e.g. test@test.com, asdf@asdf.com)
  const fakeDomains = ['test.com', 'example.com', 'sample.com', 'fake.com', 'none.com'];
  if (fakeDomains.includes(domain)) {
    return {
      valid: false,
      error: 'Please register with a real, active email address so you can receive verification and invoice receipts.',
    };
  }

  return { valid: true };
}
