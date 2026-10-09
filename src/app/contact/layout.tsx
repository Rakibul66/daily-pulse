import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBaseUrl } from "@/lib/siteUrl";

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  title: "Contact Sales & Free Software Demo in Dhaka | Shomporko CRM",
  description:
    "Book a free live demo or consult with our retail software specialists. Call or WhatsApp +8801315861003. Get rapid onboarding, POS hardware setup, and 24/7 dedicated support.",
  alternates: {
    canonical: `${baseUrl}/contact`,
  },
  openGraph: {
    title: "Contact Shomporko CRM & POS — Book Free Live Demo",
    description: "Connect with our sales and technical support team for live POS demonstration and hardware assistance in Bangladesh.",
    url: `${baseUrl}/contact`,
    images: [
      {
        url: "/somporko.webp",
        width: 1200,
        height: 630,
        alt: "Contact Shomporko CRM",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Shomporko CRM & POS Team",
    description: "Book a free demo or get hardware assistance. Call +8801315861003.",
    images: ["/somporko.webp"],
  },
};

const contactPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Shomporko CRM & POS',
  url: `${baseUrl}/contact`,
  mainEntity: {
    '@type': 'LocalBusiness',
    name: 'Shomporko CRM & POS Technologies',
    image: 'https://shomporko.com/somporko.webp',
    telephone: '+8801315861003',
    email: 'contact@shomporko.com',
    priceRange: '৳৳',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Banani / Gulshan Commercial Area',
      addressLocality: 'Dhaka',
      postalCode: '1212',
      addressCountry: 'BD',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '23.7937',
      longitude: '90.4066',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Saturday',
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
        ],
        opens: '09:00',
        closes: '20:00',
      },
    ],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={contactPageSchema} />
      {children}
    </>
  );
}
