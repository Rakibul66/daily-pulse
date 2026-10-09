import React from 'react';

interface JsonLdProps {
  data: Record<string, any>;
}

export const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export const defaultOrganizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Shomporko CRM & POS',
  alternateName: 'Shomporko ERP',
  url: 'https://shomporko.com',
  logo: 'https://shomporko.com/somporko.webp',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+8801315861003',
    contactType: 'customer service',
    areaServed: ['BD', 'Global'],
    availableLanguage: ['en', 'bn'],
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Dhaka',
    addressCountry: 'BD',
  },
  sameAs: [
    'https://wa.me/8801315861003',
  ],
};

export const defaultSoftwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Shomporko CRM & POS',
  operatingSystem: 'All (Web, Windows, macOS, Android, iOS, Cloud)',
  applicationCategory: 'BusinessApplication',
  applicationSubCategory: 'Point of Sale & Enterprise Resource Planning',
  url: 'https://shomporko.com',
  image: 'https://shomporko.com/somporko.webp',
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'BDT',
    lowPrice: '650',
    highPrice: '2900',
    offerCount: '3',
    offers: [
      {
        '@type': 'Offer',
        name: 'Starter POS Plan',
        price: '650',
        priceCurrency: 'BDT',
        availability: 'https://schema.org/InStock',
        description: 'Single counter POS billing for small retail and pharmacy stores.',
      },
      {
        '@type': 'Offer',
        name: 'Growth CRM & POS Plan',
        price: '1450',
        priceCurrency: 'BDT',
        availability: 'https://schema.org/InStock',
        description: 'Multi-user CRM, Inventory & POS for growing brands with 3 branches.',
      },
      {
        '@type': 'Offer',
        name: 'Enterprise Cloud ERP Plan',
        price: '2900',
        priceCurrency: 'BDT',
        availability: 'https://schema.org/InStock',
        description: 'Unlimited branches, complete accounting, HRM payroll and automated billing.',
      },
    ],
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    ratingCount: '128',
    bestRating: '5',
    worstRating: '1',
  },
  featureList: [
    'Cloud-based Point of Sale (POS)',
    'Thermal Receipt and Chalan Printing (80mm & 58mm)',
    'Barcode Scanner Hardware Integration',
    'Real-time Multi-branch Inventory Tracking',
    'Sales CRM and Lead Pipeline Management',
    'HRM, Biometric Attendance and Payroll Management',
    'Food Catering and Meal Logs Settlement',
    'Partner Equity, Capital and Dividend Accounting',
    'Purchase Orders and Vendor Settlement',
  ],
};

export const defaultWebsiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Shomporko CRM & POS',
  url: 'https://shomporko.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://shomporko.com/pricing?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};
