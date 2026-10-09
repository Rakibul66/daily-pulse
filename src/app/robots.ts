import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/siteUrl';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/pricing',
          '/about',
          '/contact',
          '/somporko.webp',
        ],
        disallow: [
          '/api/',
          '/_next/',
          '/admin/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/pricing',
          '/about',
          '/contact',
          '/somporko.webp',
        ],
        disallow: [
          '/api/',
          '/_next/',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/pricing',
          '/about',
          '/contact',
        ],
        disallow: [
          '/api/',
          '/_next/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
