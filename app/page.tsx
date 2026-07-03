/**
 * app/page.tsx — Home page
 *
 * HeroSection is eagerly loaded (above the fold).
 * All remaining sections are lazy-loaded via dynamic imports so their JS
 * is only downloaded when the browser is idle / they scroll into view.
 * This significantly reduces the initial JS bundle size.
 */

"use client";

import HeroSection from "@/components/sections/HeroSection";
import dynamic from "next/dynamic";

// ─── Lazy-loaded sections ─────────────────────────────────────────────────────
// Each section gets its own chunk. `loading: () => null` keeps no layout shift
// — sections still reserve their natural height via min-height on the section tag.

const AboutSection = dynamic(
  () => import("@/components/sections/AboutSection"),
  { ssr: false, loading: () => null }
);

const SkillsSection = dynamic(
  () => import("@/components/sections/SkillsSection"),
  { ssr: false, loading: () => null }
);

const ProjectsSection = dynamic(
  () => import("@/components/sections/ProjectsSection"),
  { ssr: false, loading: () => null }
);

const JourneySection = dynamic(
  () => import("@/components/sections/JourneySection"),
  { ssr: false, loading: () => null }
);

const CertificatesSection = dynamic(
  () => import("@/components/sections/CertificatesSection"),
  { ssr: false, loading: () => null }
);

const GitHubSection = dynamic(
  () => import("@/components/sections/GitHubSection"),
  { ssr: false, loading: () => null }
);

const ResumeSection = dynamic(
  () => import("@/components/sections/ResumeSection"),
  { ssr: false, loading: () => null }
);

const ContactSection = dynamic(
  () => import("@/components/sections/ContactSection"),
  { ssr: false, loading: () => null }
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      {/* ── 1. Hero — eagerly loaded (above fold) ───────────────────────── */}
      <HeroSection />

      <div className="section-divider" aria-hidden="true" />

      {/* ── 2–9. Below-fold sections — lazy loaded ───────────────────────── */}
      <AboutSection />

      <div className="section-divider" aria-hidden="true" />

      <SkillsSection />

      <div className="section-divider" aria-hidden="true" />

      <ProjectsSection />

      <div className="section-divider" aria-hidden="true" />

      <JourneySection />

      <div className="section-divider" aria-hidden="true" />

      <CertificatesSection />

      <div className="section-divider" aria-hidden="true" />

      <GitHubSection />

      <div className="section-divider" aria-hidden="true" />

      <ResumeSection />

      <div className="section-divider" aria-hidden="true" />

      <ContactSection />
    </>
  );
}
