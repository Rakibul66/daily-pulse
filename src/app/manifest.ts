import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Shomporko CRM & POS - Cloud ERP & Business Management',
    short_name: 'Shomporko CRM',
    description: 'Cloud-based Point of Sale, ERP, Invoicing, Inventory and Multi-branch CRM software for modern retail and wholesale businesses in Bangladesh.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#4F46E5',
    icons: [
      {
        src: '/somporko.webp',
        sizes: '192x192 512x512',
        type: 'image/webp',
        purpose: 'any',
      },
    ],
  };
}
