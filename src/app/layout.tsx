import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: "Support Aryan — Open Source & AI Tools",
  description:
    "Support Aryan — building future-ready, open-source tools. Help fund forever-free AI & productivity projects.",
  openGraph: {
    title: "Support Aryan — Open Source & AI Tools",
    description:
      "Support Aryan — building future-ready, open-source tools.",
    url: "/",
    siteName: "Aryan — Donate",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Support Aryan — Open Source & AI Tools",
    description:
      "Support Aryan — building future-ready, open-source tools.",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plexMono.variable}`}>
      <body className="min-h-dvh bg-gradient-to-b from-slate-950 to-black text-slate-200 antialiased selection:bg-teal-500/30 selection:text-white">
        {/* Glass gradient backdrop */}
        <div className="pointer-events-none fixed inset-0 [mask-image:radial-gradient(400px_200px_at_top,white,transparent)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.12),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.10),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(16,185,129,0.10),transparent_45%)]" />
        </div>
        {children}
      </body>
    </html>
  );
}
