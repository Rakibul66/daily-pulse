import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBaseUrl } from "@/lib/siteUrl";

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  title: "Pricing & Plans — Transparent POS & ERP Software Pricing in Bangladesh",
  description:
    "Affordable POS & CRM pricing starting at ৳650/month. View Starter POS, Growth CRM & Enterprise ERP plans with wired/wireless barcode scanners, thermal receipt printers, and cash drawers.",
  alternates: {
    canonical: `${baseUrl}/pricing`,
  },
  openGraph: {
    title: "Shomporko CRM & POS Pricing Plans — Starting at ৳650/mo",
    description: "Compare features, POS hardware machines, multi-branch licensing, and enterprise cloud ERP plans for your retail or wholesale store.",
    url: `${baseUrl}/pricing`,
    images: [
      {
        url: "/somporko.webp",
        width: 1200,
        height: 630,
        alt: "Shomporko CRM Pricing Plans",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shomporko CRM & POS Pricing — Transparent & Affordable",
    description: "Low-cost cloud POS starting at ৳650/mo. Single counter, multi-branch, and enterprise bundles.",
    images: ["/somporko.webp"],
  },
};

const pricingFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does Shomporko POS software cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Shomporko CRM pricing starts at ৳650 BDT per month for the Starter POS plan (or ৳6,500/year with 2 months free). The Growth CRM plan is ৳1,450/month and the Enterprise Cloud ERP plan is ৳2,900/month.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Shomporko POS support barcode scanners and thermal printers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Shomporko POS has built-in native support for USB wired and Bluetooth wireless 1D/2D barcode scanners, 80mm and 58mm thermal receipt printers, barcode label sticker printers, and automated electric cash drawers.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I manage multiple retail branch stores with one account?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! The Growth and Enterprise plans include multi-branch architecture, enabling central warehouse inventory transfers, branch-specific sales tracking, and aggregated business analytics.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my business data secure and backed up automatically?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. All transactions, sales invoices, inventory logs, and customer records are encrypted and synced in real-time to Google Cloud Firestore with automatic daily backups.',
      },
    },
  ],
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={pricingFaqSchema} />
      {children}
    </>
  );
}
