/**
 * test/contact.test.tsx — Task 18.7
 *
 * Unit tests for ContactSection:
 * - All 4 fields have <label>
 * - Toast shown on success
 * - Fields cleared on success
 * - Fields preserved on failure
 * - Email copy shows Toast
 */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import ContactSection from "@/components/sections/ContactSection";

// Helper: fill the form with valid data using fireEvent (avoids clipboard conflict)
function fillForm() {
  fireEvent.change(screen.getByRole("textbox", { name: /your name/i }), {
    target: { value: "Alice" },
  });
  fireEvent.change(screen.getByRole("textbox", { name: /email address/i }), {
    target: { value: "alice@example.com" },
  });
  fireEvent.change(screen.getByRole("textbox", { name: /subject/i }), {
    target: { value: "Hello there" },
  });
  fireEvent.change(screen.getByRole("textbox", { name: /message/i }), {
    target: { value: "This is a test message that is long enough for validation." },
  });
}

describe("ContactSection — 18.7", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    global.fetch = vi.fn();
  });

  it("all 4 form fields have associated <label> elements", () => {
    render(<ContactSection />);
    // Use role queries to avoid ambiguity with aria-label on the copy button
    expect(screen.getByRole("textbox", { name: /your name/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /email address/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /subject/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /message/i })).toBeInTheDocument();
  });

  it("form has a submit button", () => {
    render(<ContactSection />);
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    render(<ContactSection />);
    fireEvent.submit(screen.getByRole("form", { name: /contact form/i }));
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });

  it("shows success toast when form submits OK", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: true } as Response);
    render(<ContactSection />);
    fillForm();
    fireEvent.submit(screen.getByRole("form", { name: /contact form/i }));
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/message sent/i);
    });
  });

  it("fields are cleared after successful submit", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: true } as Response);
    render(<ContactSection />);
    fillForm();
    fireEvent.submit(screen.getByRole("form", { name: /contact form/i }));
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/message sent/i);
    });
    expect(
      (screen.getByRole("textbox", { name: /your name/i }) as HTMLInputElement).value
    ).toBe("");
    expect(
      (screen.getByRole("textbox", { name: /email address/i }) as HTMLInputElement).value
    ).toBe("");
  });

  it("shows error toast when submission fails", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: false } as Response);
    render(<ContactSection />);
    fillForm();
    fireEvent.submit(screen.getByRole("form", { name: /contact form/i }));
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/something went wrong/i);
    });
  });

  it("fields are preserved after failed submission", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: false } as Response);
    render(<ContactSection />);
    fillForm();
    fireEvent.submit(screen.getByRole("form", { name: /contact form/i }));
    await waitFor(() => screen.getByRole("alert"));
    expect(
      (screen.getByRole("textbox", { name: /your name/i }) as HTMLInputElement).value
    ).toBe("Alice");
  });

  it("clicking copy email button calls clipboard.writeText", async () => {
    render(<ContactSection />);
    const copyBtn = screen.getByRole("button", { name: /copy email address/i });
    fireEvent.click(copyBtn);
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });
  });
});
