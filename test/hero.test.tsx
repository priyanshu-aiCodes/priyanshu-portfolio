/**
 * test/hero.test.tsx — Task 18.5
 *
 * Unit tests for HeroSection:
 * - Resume button disabled when resumeAvailable:false
 * - Particle canvas toggled by particlesEnabled
 * - Social links have correct href + aria-label
 */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// ── Mocks ─────────────────────────────────────────────────────────────────────
// vi.mock factory is hoisted — use inline literals, no top-level variables.

vi.mock("@/lib/constants", async () => {
  const actual = await vi.importActual<typeof import("@/lib/constants")>("@/lib/constants");
  return {
    ...actual,
    siteConfig: {
      ownerName: "Test User",
      resumeUrl: "/resume.pdf",
      resumeAvailable: false,
      particlesEnabled: false,
      githubUsername: "testuser",
      email: "test@example.com",
      siteUrl: "https://example.com",
      title: "Test User — Developer",
      description: "Test description",
      ogImage: "/og.png",
      socialLinks: [
        { platform: "github",   url: "https://github.com/testuser",          label: "View GitHub profile"       },
        { platform: "linkedin", url: "https://linkedin.com/in/test",         label: "View LinkedIn profile"     },
        { platform: "twitter",  url: "https://twitter.com/test",             label: "View Twitter / X profile"  },
        { platform: "email",    url: "mailto:test@example.com",              label: "Send an email"             },
      ],
    },
    SECTION_IDS: actual.SECTION_IDS,
    NAV_LINKS: actual.NAV_LINKS,
  };
});

vi.mock("@/components/effects/ParticleBackground", () => ({
  default: () => <canvas data-testid="particle-canvas" />,
}));

import HeroSection from "@/components/sections/HeroSection";

describe("HeroSection — 18.5", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("resume button is disabled when resumeAvailable is false", () => {
    render(<HeroSection />);
    const btn = screen.getByRole("button", { name: /download resume/i });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-disabled", "true");
  });

  it("particle canvas is NOT rendered when particlesEnabled is false", () => {
    render(<HeroSection />);
    expect(screen.queryByTestId("particle-canvas")).not.toBeInTheDocument();
  });

  it("social links render with correct aria-labels", () => {
    render(<HeroSection />);
    const labels = [
      "View GitHub profile",
      "View LinkedIn profile",
      "View Twitter / X profile",
      "Send an email",
    ];
    for (const label of labels) {
      const elements = screen.getAllByRole("link", { name: label });
      expect(elements.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("social links have correct href values", () => {
    render(<HeroSection />);
    const links = [
      { label: "View GitHub profile",      href: "https://github.com/testuser"      },
      { label: "View LinkedIn profile",    href: "https://linkedin.com/in/test"     },
      { label: "View Twitter / X profile", href: "https://twitter.com/test"         },
      { label: "Send an email",            href: "mailto:test@example.com"           },
    ];
    for (const { label, href } of links) {
      const elements = screen.getAllByRole("link", { name: label });
      expect(elements[0]).toHaveAttribute("href", href);
    }
  });

  it("View My Work button is present", () => {
    render(<HeroSection />);
    expect(screen.getByRole("button", { name: /view my work/i })).toBeInTheDocument();
  });

  it("availability pill is visible", () => {
    render(<HeroSection />);
    expect(screen.getByText(/available for opportunities/i)).toBeInTheDocument();
  });
});
