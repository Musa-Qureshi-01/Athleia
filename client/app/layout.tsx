import type { Metadata } from "next";
import { Geist, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistDisplay = Geist({
  variable: "--font-display",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Axios",
  description:
    "Axios transforms engineering P&IDs, maintenance SOPs, and asset telemetry into verified, zero-hallucination AI reasoning for Fortune 500 industrial operations.",
  keywords: [
    "Industrial AI",
    "Enterprise Intelligence",
    "P&ID Reasoning",
    "Engineering AI",
    "Grounded AI",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico?v=5", sizes: "any" },
      { url: "/icon-32.png?v=5", type: "image/png", sizes: "32x32" },
      { url: "/icon-16.png?v=5", type: "image/png", sizes: "16x16" },
      { url: "/icon.png?v=5", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/icon-192.png?v=5", sizes: "192x192" }],
    shortcut: "/favicon.ico?v=5",
  },
  openGraph: {
    title: "Axios",
    description:
      "Trust. Precision. Industrial Intelligence. Grounded AI reasoning for enterprise engineering operations.",
    type: "website",
    images: [{ url: "/icon.png?v=5", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary",
    images: ["/icon.png?v=5"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistDisplay.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico?v=5" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-32.png?v=5" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-16.png?v=5" />
        <link rel="apple-touch-icon" href="/icon-192.png?v=5" />
      </head>
      <body
        className="bg-bg-primary text-text-primary antialiased"
        suppressHydrationWarning
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
