import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Auto Link | AI Used Cars in Ranchi",
  description:
    "Premium AI-powered used car marketplace, dealership CRM, WhatsApp negotiation, and verified car listings for Ranchi and Jharkhand.",
  keywords: [
    "used cars in Ranchi",
    "best car dealer in Ranchi",
    "second hand cars Jharkhand",
    "Auto Link",
    "used car marketplace"
  ],
  openGraph: {
    title: "Auto Link - Driven By Trust",
    description:
      "Trusted used cars, transparent 2% fee, verified listings, and instant WhatsApp negotiation.",
    type: "website",
    locale: "en_IN"
  },
  manifest: "/manifest.json"
};

export const viewport: Viewport = {
  themeColor: "#050506",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
