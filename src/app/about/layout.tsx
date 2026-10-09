import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBaseUrl } from "@/lib/siteUrl";

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  title: "About Us — Bangladesh's Leading Retail POS & ERP Platform",
  description:
    "Learn about Shomporko CRM & POS. Founded to empower local retailers, supermarkets, and wholesalers with automated cloud billing, barcode inventory, and staff management.",
  alternates: {
    canonical: `${baseUrl}/about`,
  },
  openGraph: {
    title: "About Shomporko CRM — The Modern Cloud POS for Bangladesh",
    description: "Built to replace outdated paper and offline desktop software with modern, reliable cloud ERP solutions.",
    url: `${baseUrl}/about`,
    images: [
      {
        url: "/somporko.webp",
        width: 1200,
        height: 630,
        alt: "About Shomporko CRM",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Shomporko CRM & POS",
    description: "Empowering retail and enterprise businesses across Bangladesh.",
    images: ["/somporko.webp"],
  },
};

const aboutPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Shomporko CRM & POS',
  url: `${baseUrl}/about`,
  mainEntity: {
    '@type': 'Organization',
    name: 'Shomporko CRM & POS',
    url: 'https://shomporko.com',
    description: 'Cloud ERP and retail Point of Sale billing provider based in Dhaka, Bangladesh.',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={aboutPageSchema} />
      {children}
    </>
  );
}
