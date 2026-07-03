/**
 * app/layout.tsx — Root layout
 *
 * Responsibilities:
 *  - Load all Google Fonts via next/font (zero layout shift, display: swap)
 *  - Mount ThemeProvider (dark/light toggle + localStorage persistence)
 *  - Mount ActiveSectionProvider (IntersectionObserver for Nav active link)
 *  - Mount global visual effects: GridBackground, AmbientBlobs,
 *    ScrollProgressBar, CustomCursor (dynamic, desktop-only)
 *  - Render Nav and Footer wrapping all page content
 *  - SEO metadata derived from siteConfig
 */

import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";

import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { ActiveSectionProvider } from "@/components/layout/ActiveSectionProvider";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import GridBackground from "@/components/effects/GridBackground";
import AmbientBlobs from "@/components/effects/AmbientBlobs";
import ScrollProgressBar from "@/components/effects/ScrollProgressBar";
import { siteConfig } from "@/lib/constants";

// ─── Task 16 — EasterEgg: dynamic import so it's excluded from initial bundle ──
const EasterEgg = dynamic(
  () => import("@/components/effects/EasterEgg"),
  { ssr: false }
);

// ─── Font definitions ──────────────────────────────────────────────────────────

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

// ─── Metadata ─────────────────────────────────────────────────────────────────
// Task 14.1 — Full SEO metadata: title, description, OG, Twitter Card, keywords,
// robots directive, and canonical URL via metadataBase.

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: siteConfig.title,
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  keywords: [
    "Priyanshu Sharma",
    "AI developer",
    "Python developer",
    "web developer",
    "JEE aspirant",
    "portfolio",
    "Next.js",
    "React",
    "machine learning",
    "student developer",
  ],
  authors: [{ name: siteConfig.ownerName }],
  creator: siteConfig.ownerName,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.ownerName,
    title: "Priyanshu Sharma | AI Developer & JEE Aspirant",
    description:
      "AI Developer, Python Programmer, Web Developer, and JEE Aspirant. Explore my projects, certifications, GitHub, and resume.",
    url: siteConfig.siteUrl,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Priyanshu Sharma — AI Developer & JEE Aspirant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Priyanshu Sharma | AI Developer & JEE Aspirant",
    description:
      "AI Developer, Python Programmer, Web Developer, and JEE Aspirant. Explore my projects, certifications, GitHub, and resume.",
    images: [siteConfig.ogImage],
  },
};

// ─── Root layout ───────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-bg-dark font-body antialiased">
        {/* ── Skip-to-content — Task 15.5 (keyboard/screen-reader users) ── */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>

        <ThemeProvider>
          <ActiveSectionProvider>
            {/* ── Z-layer 0: fixed decorative background ──────────────── */}
            <GridBackground opacity={0.04} />
            <AmbientBlobs />

            {/* ── Z-layer 50: progress bar ────────────────────────────── */}
            <ScrollProgressBar />

            {/* ── Z-layer 40: fixed navigation ────────────────────────── */}
            <Nav />

            {/* ── Main content — offset by nav height ─────────────────── */}
            {/* page-enter class applies the 400ms fade-in (Task 15.7).   */}
            {/* Suppressed automatically when prefers-reduced-motion:reduce */}
            <main
              id="main-content"
              className="relative z-10 min-h-screen pt-16 page-enter"
            >
              {children}
            </main>

            {/* ── Footer ──────────────────────────────────────────────── */}
            <div className="relative z-10">
              <Footer />
            </div>

            {/* ── Task 16: Easter egg — isolated, dynamic, no side-effects ── */}
            <EasterEgg />
          </ActiveSectionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
