/**
 * Automatically resolves the site's base URL:
 * 1. NEXT_PUBLIC_SITE_URL (if custom domain is specified)
 * 2. Vercel deployment URL (auto-populated by Vercel on preview and production deploys)
 * 3. Localhost fallback for development
 */
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}
