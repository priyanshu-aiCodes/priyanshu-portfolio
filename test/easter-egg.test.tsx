/**
 * test/easter-egg.test.tsx — Task 18.10
 *
 * Unit tests for EasterEgg:
 * - Konami keydown listener is registered
 * - Modal opens on Konami trigger
 * - Modal closes on Escape
 * - Focus trap is active while modal is open
 */

import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import EasterEgg from "@/components/effects/EasterEgg";

// Konami code sequence
const KONAMI = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "b", "a",
];

function fireKonami() {
  for (const key of KONAMI) {
    fireEvent.keyDown(window, { key });
  }
}

describe("EasterEgg — 18.10", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing (no modal initially)", () => {
    render(<EasterEgg />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("registers a keydown listener on window (Konami listener)", () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    render(<EasterEgg />);
    const calls = addSpy.mock.calls.filter(([type]) => type === "keydown");
    expect(calls.length).toBeGreaterThan(0);
    addSpy.mockRestore();
  });

  it("modal opens when Konami code is entered", async () => {
    render(<EasterEgg />);
    fireKonami();
    await waitFor(() => {
      expect(screen.getByRole("dialog", { name: /you found the easter egg/i })).toBeInTheDocument();
    });
  });

  it("modal closes on Escape key", async () => {
    render(<EasterEgg />);
    fireKonami();
    await waitFor(() => screen.getByRole("dialog"));
    fireEvent.keyDown(window, { key: "Escape" });
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("modal close button is accessible and closes the modal", async () => {
    render(<EasterEgg />);
    fireKonami();
    await waitFor(() => screen.getByRole("dialog"));
    const closeBtn = screen.getByRole("button", { name: /close easter egg/i });
    expect(closeBtn).toBeInTheDocument();
    fireEvent.click(closeBtn);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("focus trap: close button receives focus when modal opens", async () => {
    render(<EasterEgg />);
    fireKonami();
    await waitFor(() => screen.getByRole("dialog"));
    const closeBtn = screen.getByRole("button", { name: /close easter egg/i });
    // The component calls closeRef.current?.focus() on mount
    expect(document.activeElement).toBe(closeBtn);
  });

  it("modal has aria-modal=true", async () => {
    render(<EasterEgg />);
    fireKonami();
    await waitFor(() => screen.getByRole("dialog"));
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
  });

  it("Konami code does not trigger from inside input fields", () => {
    render(
      <div>
        <input data-testid="field" type="text" />
        <EasterEgg />
      </div>
    );
    const input = screen.getByTestId("field");
    for (const key of KONAMI) {
      fireEvent.keyDown(input, { key, target: input });
    }
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
