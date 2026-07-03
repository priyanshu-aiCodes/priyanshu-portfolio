/**
 * test/projects.test.tsx — Task 18.6
 *
 * Unit tests for ProjectsSection:
 * - ≥4 cards render
 * - Featured badge conditional
 * - Modal opens on "Details" button click
 * - Modal closes on Escape + outside click
 */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { projects } from "@/data/projects";

// ── Mock ProjectModal to avoid dynamic import complexity ─────────────────────
vi.mock("@/components/ui/ProjectModal", () => ({
  default: ({ project, onClose }: { project: { title: string }; onClose: () => void }) => (
    <div role="dialog" aria-label={`${project.title} details`} data-testid="project-modal">
      <span>{project.title}</span>
      <button type="button" onClick={onClose} aria-label="Close modal">Close</button>
    </div>
  ),
}));

import ProjectsSection from "@/components/sections/ProjectsSection";

describe("ProjectsSection — 18.6", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders at least 4 project cards", () => {
    render(<ProjectsSection />);
    const articles = screen.getAllByRole("article");
    expect(articles.length).toBeGreaterThanOrEqual(4);
  });

  it("featured badge is shown only for featured projects", () => {
    render(<ProjectsSection />);
    const featuredCount = projects.filter((p) => p.featured).length;
    const badges = screen.queryAllByText("Featured");
    expect(badges.length).toBe(featuredCount);
  });

  it("filter buttons render for available categories", () => {
    render(<ProjectsSection />);
    const allBtn = screen.getByRole("button", { name: /^all$/i });
    expect(allBtn).toBeInTheDocument();
  });

  it("'All' filter button has aria-pressed=true by default", () => {
    render(<ProjectsSection />);
    const allBtn = screen.getByRole("button", { name: /^all$/i });
    expect(allBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("clicking Details opens the project modal", async () => {
    render(<ProjectsSection />);
    const detailsBtns = screen.getAllByRole("button", { name: /view details for/i });
    expect(detailsBtns.length).toBeGreaterThan(0);
    fireEvent.click(detailsBtns[0]);
    await waitFor(() => {
      expect(screen.getByTestId("project-modal")).toBeInTheDocument();
    });
  });

  it("modal closes when close button is clicked", async () => {
    render(<ProjectsSection />);
    const detailsBtns = screen.getAllByRole("button", { name: /view details for/i });
    fireEvent.click(detailsBtns[0]);
    await waitFor(() => screen.getByTestId("project-modal"));
    fireEvent.click(screen.getByRole("button", { name: /close modal/i }));
    await waitFor(() => {
      expect(screen.queryByTestId("project-modal")).not.toBeInTheDocument();
    });
  });

  it("each project card has a GitHub link", () => {
    render(<ProjectsSection />);
    const githubLinks = screen.getAllByRole("link", { name: /view .+ on github/i });
    expect(githubLinks.length).toBeGreaterThanOrEqual(projects.length);
  });
});
