import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Paintball Sousse | #1 Paintball Experience in Tunisia",
  description:
    "Book the ultimate paintball experience in Sousse, Tunisia. Groups, team building, birthdays, tournaments. Near Mall of Sousse. +216 46 209 091",
  keywords: [
    "paintball sousse",
    "paintball tunisia",
    "team building sousse",
    "outdoor activities sousse",
  ],
  metadataBase: new URL("https://paintballsousse.tn"),
  openGraph: {
    title: "Paintball Sousse",
    description: "Feel the adrenaline. Book your paintball session today.",
    url: "https://paintballsousse.tn",
    siteName: "Paintball Sousse",
    images: [{ url: "/logo.svg", width: 1200, height: 630, alt: "Paintball Sousse" }],
    locale: "fr_TN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Paintball Sousse",
    description: "Feel the adrenaline. Book your paintball session today.",
  },
  manifest: "/manifest.json",
  alternates: { canonical: "https://paintballsousse.tn" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#E8001C",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Orbitron:wght@500;700;800&family=Rajdhani:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-dvh overflow-x-hidden">
        <div className="grain-overlay" aria-hidden />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
