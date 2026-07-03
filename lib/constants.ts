/**
 * lib/constants.ts — Site-wide configuration
 *
 * ⚠️  PERSONALISE THIS FILE before deploying.
 *
 * All components and sections pull data from this single source of truth.
 * To update personal details, edit only this file — no component hunts needed.
 *
 * Exported:
 *  - SocialLink interface
 *  - SiteConfig interface
 *  - siteConfig : SiteConfig  (the live data object)
 *  - NAV_LINKS  : readonly list of anchor links
 *  - SECTION_IDS: readonly map of section id strings
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type SocialPlatform = "github" | "linkedin" | "email";

export interface SocialLink {
  /** Platform identifier used to pick the correct icon */
  platform: SocialPlatform;
  /** Full URL (or mailto: for email) */
  url: string;
  /** Accessible label for screen readers */
  label: string;
}

export interface SiteConfig {
  /** Full display name shown in Hero and footer */
  ownerName: string;
  /** <title> tag value — format: "[Name] — Developer & JEE Aspirant" */
  title: string;
  /** <meta description> — max 160 characters */
  description: string;
  /** Contact / clipboard email */
  email: string;
  /** Path to resume PDF in /public — e.g. "/resume.pdf" */
  resumeUrl: string;
  /** Whether the resume file actually exists and should be linked */
  resumeAvailable: boolean;
  /** Path to OG image in /public — must be 1200×630 px */
  ogImage: string;
  /** Canonical site URL — no trailing slash */
  siteUrl: string;
  /** Social link buttons shown in Hero and Footer */
  socialLinks: SocialLink[];
  /** Whether to mount ParticleBackground in the Hero section */
  particlesEnabled: boolean;
  /** GitHub username — used for GitHub Stats section embeds */
  githubUsername: string;
}

// ─── Site configuration ───────────────────────────────────────────────────────
/**
 * Replace every "Your …" placeholder with your real data.
 */
export const siteConfig: SiteConfig = {
  ownerName: "Priyanshu Sharma",
  title: "Priyanshu Sharma | AI Developer & JEE Aspirant",
  description:
    "Priyanshu Sharma is an AI Developer, Python Programmer, Web Developer, and JEE Aspirant. Explore my projects, certifications, GitHub, and resume.",
  email: "priyanshuofficial9898@gmail.com",
  resumeUrl: "/resume/Priyanshu_Sharma_Premium_Resume.pdf",
  resumeAvailable: true,
  ogImage: "/og-image.png",
  siteUrl: "https://priyanshu-aicodes.vercel.app",
  particlesEnabled: true,
  githubUsername: "priyanshu-aiCodes",

  socialLinks: [
    {
      platform: "github",
      url: "https://github.com/priyanshu-aiCodes",
      label: "View GitHub profile",
    },
    {
      platform: "linkedin",
      url: "https://www.linkedin.com/in/priyanshu-sharma-084386415/",
      label: "View LinkedIn profile",
    },
    {
      platform: "email",
      url: "mailto:priyanshuofficial9898@gmail.com",
      label: "Send an email",
    },
  ],
};

// ─── Navigation links ─────────────────────────────────────────────────────────

export interface NavLink {
  label: string;
  /** Matches the id="" on the corresponding <section> */
  href: string;
}

/**
 * Ordered list of Nav anchor links.
 * The `href` values must exactly match the `id` attributes on each <section>.
 */
export const NAV_LINKS: readonly NavLink[] = [
  { label: "Home",         href: "#hero" },
  { label: "About",        href: "#about" },
  { label: "Skills",       href: "#skills" },
  { label: "Projects",     href: "#projects" },
  { label: "Journey",      href: "#journey" },
  { label: "Certificates", href: "#certificates" },
  { label: "GitHub",       href: "#github" },
  { label: "Resume",       href: "#resume" },
  { label: "Contact",      href: "#contact" },
] as const;

// ─── Section IDs ──────────────────────────────────────────────────────────────

/**
 * Central registry of all section `id` values.
 * Import this wherever you need to reference a section programmatically
 * (IntersectionObserver, scroll-to helpers, etc.).
 */
export const SECTION_IDS = {
  hero:         "hero",
  about:        "about",
  skills:       "skills",
  projects:     "projects",
  journey:      "journey",
  certificates: "certificates",
  github:       "github",
  resume:       "resume",
  contact:      "contact",
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];
