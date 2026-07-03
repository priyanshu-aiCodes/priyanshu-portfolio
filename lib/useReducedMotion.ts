/**
 * lib/useReducedMotion.ts — Task 15.1
 *
 * Thin wrapper around Framer Motion's built-in useReducedMotion hook.
 *
 * Usage:
 *   const reduced = useReducedMotion();
 *   // Pass `reduced` as a condition to skip animate props or use
 *   // `initial={false}` / `animate={reduced ? "visible" : "hidden"}`
 *
 * Returns `true` when the OS "Reduce Motion" preference is active,
 * `false` otherwise. SSR-safe (returns false on the server).
 */

"use client";

export { useReducedMotion } from "framer-motion";
