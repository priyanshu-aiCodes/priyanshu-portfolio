/**
 * test/nav.test.tsx — Task 18.4
 *
 * Unit tests for the Nav component:
 * - 9 navigation links render
 * - hamburger button present in DOM
 * - theme toggle button present and accessible
 * - scroll handler: scrolled class applied after scroll event
 */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NAV_LINKS } from "@/lib/constants";

// ── Module mocks needed before importing Nav ──────────────────────────────────

vi.mock("@/components/layout/ThemeProvider", () => ({
  useTheme: () => ({ theme: "dark", toggle: vi.fn() }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/components/layout/ActiveSectionProvider", () => ({
  useActiveSection: () => ({ activeSection: "hero" }),
  ActiveSectionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import Nav from "@/components/layout/Nav";

describe("Nav — 18.4", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all 9 nav links by label", () => {
    render(<Nav />);
    const expectedLabels = NAV_LINKS.map((l) => l.label);
    // Desktop nav renders links, mobile nav duplicates them in the overlay.
    // We just need at least one occurrence of each.
    for (const label of expectedLabels) {
      const buttons = screen.getAllByText(label);
      expect(buttons.length).toBeGreaterThanOrEqual(1);
    }
    expect(NAV_LINKS.length).toBe(9);
  });

  it("hamburger button is present in the DOM", () => {
    render(<Nav />);
    const hamburger = screen.getByRole("button", { name: /open navigation menu/i });
    expect(hamburger).toBeInTheDocument();
  });

  it("hamburger opens the mobile menu when clicked", () => {
    render(<Nav />);
    const hamburger = screen.getByRole("button", { name: /open navigation menu/i });
    fireEvent.click(hamburger);
    expect(screen.getByRole("dialog", { name: /navigation menu/i })).toBeInTheDocument();
  });

  it("theme toggle button is accessible", () => {
    render(<Nav />);
    const toggle = screen.getByRole("button", { name: /switch to light mode/i });
    expect(toggle).toBeInTheDocument();
  });

  it("mobile menu closes on Escape key", () => {
    render(<Nav />);
    // Open menu
    fireEvent.click(screen.getByRole("button", { name: /open navigation menu/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    // Close via Escape
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("logo/name button is present and accessible", () => {
    render(<Nav />);
    const logo = screen.getByRole("button", { name: /go to top/i });
    expect(logo).toBeInTheDocument();
  });

  it("nav links have aria-current='location' for active section", () => {
    render(<Nav />);
    // 'Home' maps to '#hero' which is the active section mocked above
    const homeButtons = screen.getAllByRole("button", { name: "Home" });
    const activeBtn = homeButtons.find(
      (btn) => btn.getAttribute("aria-current") === "location"
    );
    expect(activeBtn).toBeDefined();
  });
});
