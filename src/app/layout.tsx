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
  icons: {
    icon: "/assets/gitlog.png",
    shortcut: "/assets/gitlog.png",
    apple: "/assets/gitlog.png",
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

        {/* GitHub corner bookmark (top-left, true black triangle) */}
        <a
          href="https://github.com/aryan6673/donate"
          target="_blank"
          rel="noreferrer"
          aria-label="View repository on GitHub"
          title="View on GitHub"
          className="fixed top-0 left-0 z-50 block w-16 h-16 group"
          style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)", WebkitClipPath: "polygon(0 0, 100% 0, 0 100%)" }}
        >
          <span
            className="absolute top-0 left-0 block"
            style={{ width: 0, height: 0, borderTop: "64px solid #000", borderRight: "64px solid transparent" }}
          />
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute top-2 left-2 w-5 h-5 text-white transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
            aria-hidden="true"
          >
            <path d="M12 .5a12 12 0 00-3.79 23.4c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.2.08 1.84 1.23 1.84 1.23 1.07 1.84 2.81 1.31 3.49 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.48-1.34-5.48-5.95 0-1.31.47-2.38 1.23-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.62-2.81 5.65-5.49 5.95.43.37.81 1.1.81 2.22v3.29c0 .32.21.69.82.58A12 12 0 0012 .5z" />
          </svg>
          <span className="sr-only">GitHub</span>
        </a>

        {children}
      </body>
    </html>
  );
}
