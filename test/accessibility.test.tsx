/**
 * test/accessibility.test.tsx — Task 18.8
 *
 * Accessibility tests using axe-core:
 * - Each section tested for zero axe violations
 * - Semantic landmarks present
 * - SectionHeading renders h2 elements
 *
 * NOTE: axe-core in jsdom is a best-effort static analysis pass.
 * Full a11y validation still requires manual testing with assistive tech.
 */

import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { expect as jestExpect } from "vitest";

// Extend vitest's expect with axe matchers
jestExpect.extend(toHaveNoViolations);

// ── Mocks ─────────────────────────────────────────────────────────────────────
vi.mock("@/lib/constants", async () => {
  const actual = await vi.importActual<typeof import("@/lib/constants")>("@/lib/constants");
  return {
    ...actual,
    siteConfig: {
      ...actual.siteConfig,
      resumeAvailable: false,
      githubUsername: "testuser",
      socialLinks: [
        { platform: "github",   url: "https://github.com/testuser",   label: "View GitHub profile"  },
        { platform: "linkedin", url: "https://linkedin.com/in/test",  label: "View LinkedIn profile" },
        { platform: "twitter",  url: "https://twitter.com/test",      label: "View Twitter / X profile" },
        { platform: "email",    url: "mailto:test@example.com",       label: "Send an email" },
      ],
    },
  };
});

vi.mock("@/components/layout/ThemeProvider", () => ({
  useTheme: () => ({ theme: "dark", toggle: vi.fn() }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/components/layout/ActiveSectionProvider", () => ({
  useActiveSection: () => ({ activeSection: "hero" }),
  ActiveSectionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/components/ui/ProjectModal", () => ({
  default: () => null,
}));

import Nav from "@/components/layout/Nav";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import CertificatesSection from "@/components/sections/CertificatesSection";
import ContactSection from "@/components/sections/ContactSection";
import ResumeSection from "@/components/sections/ResumeSection";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";

// ── Helpers ───────────────────────────────────────────────────────────────────

async function renderAndCheckA11y(ui: React.ReactElement) {
  const { container } = render(ui);
  const results = await axe(container);
  // @ts-expect-error — toHaveNoViolations added via extend
  jestExpect(results).toHaveNoViolations();
}

// ── SectionHeading ────────────────────────────────────────────────────────────

describe("SectionHeading accessibility", () => {
  it("renders an h2 element", () => {
    render(<SectionHeading title="Test Heading" />);
    expect(screen.getByRole("heading", { level: 2, name: /test heading/i })).toBeInTheDocument();
  });

  it("has zero axe violations", async () => {
    await renderAndCheckA11y(<SectionHeading title="Accessibility Test" subtitle="Subtitle" />);
  });
});

// ── Nav ───────────────────────────────────────────────────────────────────────

describe("Nav accessibility — 18.8", () => {
  it("contains a <nav> landmark", () => {
    render(<Nav />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("has zero axe violations", async () => {
    await renderAndCheckA11y(<Nav />);
  });
});

// ── HeroSection ───────────────────────────────────────────────────────────────

describe("HeroSection accessibility — 18.8", () => {
  it("section has aria-label='Hero'", () => {
    render(<HeroSection />);
    expect(screen.getByRole("region", { name: /^hero$/i })).toBeInTheDocument();
  });

  it("has zero axe violations", async () => {
    await renderAndCheckA11y(<HeroSection />);
  });
});

// ── AboutSection ──────────────────────────────────────────────────────────────

describe("AboutSection accessibility — 18.8", () => {
  it("section has aria-label='About'", () => {
    render(<AboutSection />);
    expect(screen.getByRole("region", { name: /^about$/i })).toBeInTheDocument();
  });

  it("has zero axe violations", async () => {
    await renderAndCheckA11y(<AboutSection />);
  });
});

// ── SkillsSection ─────────────────────────────────────────────────────────────

describe("SkillsSection accessibility — 18.8", () => {
  it("section has aria-label", () => {
    render(<SkillsSection />);
    expect(screen.getByRole("region", { name: /skills and tech stack/i })).toBeInTheDocument();
  });

  it("has zero axe violations", async () => {
    await renderAndCheckA11y(<SkillsSection />);
  });
});

// ── ProjectsSection ───────────────────────────────────────────────────────────

describe("ProjectsSection accessibility — 18.8", () => {
  it("section has aria-label", () => {
    render(<ProjectsSection />);
    expect(screen.getByRole("region", { name: /featured projects/i })).toBeInTheDocument();
  });

  it("has zero axe violations", async () => {
    await renderAndCheckA11y(<ProjectsSection />);
  });
});

// ── CertificatesSection ───────────────────────────────────────────────────────

describe("CertificatesSection accessibility — 18.8", () => {
  it("section has aria-label", () => {
    render(<CertificatesSection />);
    expect(screen.getByRole("region", { name: /certificates and achievements/i })).toBeInTheDocument();
  });

  it("has zero axe violations", async () => {
    await renderAndCheckA11y(<CertificatesSection />);
  });
});

// ── ContactSection ────────────────────────────────────────────────────────────

describe("ContactSection accessibility — 18.8", () => {
  it("form has aria-label='Contact form'", () => {
    render(<ContactSection />);
    expect(screen.getByRole("form", { name: /contact form/i })).toBeInTheDocument();
  });

  it("has zero axe violations", async () => {
    await renderAndCheckA11y(<ContactSection />);
  });
});

// ── ResumeSection ─────────────────────────────────────────────────────────────

describe("ResumeSection accessibility — 18.8", () => {
  it("section has aria-label='Resume'", () => {
    render(<ResumeSection />);
    expect(screen.getByRole("region", { name: /^resume$/i })).toBeInTheDocument();
  });

  it("has zero axe violations", async () => {
    await renderAndCheckA11y(<ResumeSection />);
  });
});

// ── Footer ────────────────────────────────────────────────────────────────────

describe("Footer accessibility — 18.8", () => {
  it("has zero axe violations", async () => {
    await renderAndCheckA11y(<Footer />);
  });
});
