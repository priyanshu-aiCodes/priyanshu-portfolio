/**
 * lib/utils.ts — Shared utility functions
 *
 * Exports:
 *  - cn()           : merge Tailwind class names safely (clsx + twMerge)
 *  - clampText()    : truncate a string to N words
 *  - slugify()      : convert a string to a URL-safe slug
 *  - formatDate()   : format a date string to "Month Year"
 *  - isTouchDevice(): detect touch-only input (for hover vs tap logic)
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ─── cn ───────────────────────────────────────────────────────────────────────
/**
 * Merge Tailwind CSS class names without conflicts.
 *
 * Uses clsx for conditional class logic and tailwind-merge to deduplicate
 * conflicting utility classes (e.g. `p-4` + `p-2` → `p-2`).
 *
 * @example
 *   cn("px-4 py-2", isActive && "bg-primary", className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ─── clampText ────────────────────────────────────────────────────────────────
/**
 * Truncate `text` to at most `maxWords` words, appending `…` if truncated.
 *
 * @example
 *   clampText("Hello world foo bar", 2) // → "Hello world…"
 */
export function clampText(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "\u2026";
}

// ─── slugify ──────────────────────────────────────────────────────────────────
/**
 * Convert a string to a lowercase, hyphenated URL slug.
 *
 * @example
 *   slugify("Hello World!")  // → "hello-world"
 *   slugify("React + TypeScript")  // → "react-typescript"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ─── formatDate ───────────────────────────────────────────────────────────────
/**
 * Format an ISO date string (or any Date-parseable string) to "Month Year".
 *
 * @example
 *   formatDate("2024-03-15")  // → "March 2024"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

// ─── isTouchDevice ────────────────────────────────────────────────────────────
/**
 * Returns true when the primary input is touch (phone / tablet).
 * Used to switch reveal behaviour from hover → tap in FunFactCard etc.
 *
 * Safe to call during SSR — returns false on the server.
 */
export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

// ─── noop ─────────────────────────────────────────────────────────────────────
/** A no-op function useful as a default prop for optional callbacks. */
export const noop = (): void => undefined;
