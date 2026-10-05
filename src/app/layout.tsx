import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

export const metadata: Metadata = {
  title: "ApnarSoftware - The Ultimate POS & ERP Solution",
  description:
    "Track morning goals, end-of-day reports, competitor insights, and export beautiful PDF & formatted summaries.",
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
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="font-sans antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
