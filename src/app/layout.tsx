import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { 
  JsonLd, 
  defaultOrganizationSchema, 
  defaultSoftwareSchema, 
  defaultWebsiteSchema 
} from "@/components/seo/JsonLd";
import { getBaseUrl } from "@/lib/siteUrl";

const baseUrl = getBaseUrl();

export const viewport: Viewport = {
  themeColor: '#4F46E5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Shomporko CRM & POS — Cloud ERP, Retail Billing & Business Software in Bangladesh",
    template: "%s | Shomporko CRM",
  },
  description:
    "The #1 Cloud-based CRM, Point of Sale (POS), and ERP software for retail shops, restaurants, supermarkets, and wholesalers in Bangladesh. Features fast billing, barcode scanner integration, 80mm thermal receipt printing, real-time inventory tracking, HRM payroll, and multi-branch management.",
  applicationName: "Shomporko CRM & POS",
  authors: [{ name: "Shomporko Technologies", url: baseUrl }],
  generator: "Next.js",
  keywords: [
    "CRM software Bangladesh",
    "POS software Dhaka",
    "Point of Sale Bangladesh",
    "Retail POS billing system",
    "Cloud ERP software Bangladesh",
    "Barcode scanner POS machine",
    "Thermal receipt printer billing software",
    "Super shop inventory management software",
    "Pharmacy POS software Bangladesh",
    "Restaurant billing software POS",
    "Wholesale invoicing software",
    "HRM payroll software Bangladesh",
    "Multi branch store management",
    "Shomporko CRM",
    "Bangla POS software",
    "Small business accounting software",
  ],
  creator: "Shomporko Technologies",
  publisher: "Shomporko Technologies",
  category: "Business & Productivity Software",
  classification: "Enterprise Resource Planning & Point of Sale",
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    title: "Shomporko CRM & POS — Cloud ERP, Retail Billing & Business Software",
    description:
      "All-in-one POS, CRM & ERP for modern retail and wholesale businesses in Bangladesh. Manage sales, inventory, barcode billing, staff payroll, and multi-branch stores seamlessly.",
    siteName: "Shomporko CRM",
    images: [
      {
        url: "/somporko.webp",
        width: 1200,
        height: 630,
        alt: "Shomporko CRM & POS Platform Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shomporko CRM & POS — The Ultimate Cloud POS & ERP Solution",
    description:
      "Streamline sales, barcode billing, inventory, and payroll with Bangladesh's most modern cloud business management platform.",
    creator: "@shomporko",
    images: ["/somporko.webp"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/somporko.webp",
    shortcut: "/favicon.ico",
    apple: "/somporko.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Preconnect to Firebase APIs to eliminate DNS/TLS latency on first load */}
        <link rel="preconnect" href="https://firestore.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://identitytoolkit.googleapis.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <JsonLd data={defaultOrganizationSchema} />
        <JsonLd data={defaultSoftwareSchema} />
        <JsonLd data={defaultWebsiteSchema} />
      </head>
      <body suppressHydrationWarning className="font-sans antialiased bg-white text-black min-h-screen selection:bg-indigo-600 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
