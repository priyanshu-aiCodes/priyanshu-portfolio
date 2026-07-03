"use client";

/**
 * EasterEgg — Task 16
 *
 * Triggered by the Konami code: ↑ ↑ ↓ ↓ ← → ← → B A
 *
 * When triggered:
 *  - Renders a fun confetti-style modal that is completely isolated
 *    from navigation state, scroll position, and all data.
 *  - Dismissible via a close button or the Escape key.
 *  - Focus is trapped inside while open; restored on close.
 *  - Entrance animation completes within 600 ms.
 *
 * Isolation guarantees (Task 16.3):
 *  - No router navigation, no scroll manipulation, no state outside the modal.
 *  - Mounted via dynamic import with ssr:false so it adds zero bytes to
 *    the initial page bundle.
 */

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FiX } from "react-icons/fi";
import { cn } from "@/lib/utils";

// ─── Konami code sequence ─────────────────────────────────────────────────────

const KONAMI = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "b", "a",
];

// ─── Confetti particle (pure CSS, no canvas) ──────────────────────────────────

const CONFETTI_COLORS = [
  "#6C63FF", "#00D4AA", "#FF6B6B",
  "#FFD700", "#00BFFF", "#FF69B4",
];

function ConfettiPiece({ index }: { index: number }) {
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const left   = `${Math.random() * 100}%`;
  const delay  = `${Math.random() * 0.6}s`;
  const dur    = `${0.8 + Math.random() * 0.6}s`;
  const size   = `${6 + Math.floor(Math.random() * 6)}px`;
  const shape  = index % 3 === 0 ? "50%" : "2px";

  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        top: "-10px",
        left,
        width: size,
        height: size,
        borderRadius: shape,
        backgroundColor: color,
        animationName: "confetti-fall",
        animationDuration: dur,
        animationDelay: delay,
        animationTimingFunction: "ease-in",
        animationFillMode: "both",
      }}
    />
  );
}

// ─── Focus trap helper ────────────────────────────────────────────────────────

function trapFocus(container: HTMLElement, e: KeyboardEvent) {
  const focusable = container.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];

  if (e.key !== "Tab") return;

  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  }
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function EasterEggModal({ onClose }: { onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const closeRef     = useRef<HTMLButtonElement>(null);
  const reduced      = useReducedMotion() ?? false;

  // Move focus to close button on mount
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // Escape key + focus trap
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (containerRef.current) trapFocus(containerRef.current, e);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const CONFETTI_COUNT = reduced ? 0 : 30;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="You found the Easter egg!"
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-bg-dark/85 backdrop-blur-[4px]"
        aria-hidden="true"
      />

      {/* Confetti layer */}
      <div
        className="absolute inset-x-0 top-0 h-64 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        {Array.from({ length: CONFETTI_COUNT }).map((_, i) => (
          <ConfettiPiece key={i} index={i} />
        ))}
      </div>

      {/* Panel */}
      <motion.div
        ref={containerRef}
        className={cn(
          "relative z-10 glass rounded-2xl p-8 w-full max-w-md text-center",
          "border border-primary/30"
        )}
        initial={reduced ? false : { scale: 0.85, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={reduced ? {} : { scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {/* Close button */}
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close Easter egg"
          className={cn(
            "absolute top-4 right-4 w-8 h-8 flex items-center justify-center",
            "rounded-lg text-text-muted hover:text-white hover:bg-white/10",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          )}
        >
          <FiX size={16} aria-hidden="true" />
        </button>

        {/* Content */}
        <div className="text-5xl mb-4" aria-hidden="true">🎉</div>

        <h2 className="font-display font-bold text-2xl gradient-text mb-2">
          You Found It!
        </h2>

        <p className="text-text-muted font-mono text-sm mb-1">
          ↑ ↑ ↓ ↓ ← → ← → B A
        </p>

        <p className="text-white/70 font-body text-sm leading-relaxed mb-6">
          The legendary Konami Code — unlocked by someone who clearly knows
          their gaming history. 🕹️ You deserve a JEE rank just for this.
        </p>

        {/* Fun JEE fact */}
        <div className="glass rounded-xl p-4 border border-secondary/20 text-left mb-6">
          <p className="text-secondary text-xs font-mono mb-1">Fun Fact</p>
          <p className="text-text-muted text-xs font-body leading-relaxed">
            The Konami Code was first used in 1986 — about the same time the
            JEE syllabus for calculus was being finalised. Coincidence? 
            Probably not.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className={cn(
            "inline-flex items-center justify-center gap-2 w-full",
            "px-5 py-3 rounded-xl bg-primary text-white text-sm font-mono",
            "hover:brightness-110 transition-all duration-200 min-h-[44px]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          )}
        >
          Back to grinding 📚
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── EasterEgg root — manages sequence detection and modal lifecycle ──────────

export default function EasterEgg() {
  const [open, setOpen]         = useState(false);
  const sequenceRef             = useRef<string[]>([]);
  const previousFocusRef        = useRef<HTMLElement | null>(null);

  const openModal = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    // Restore focus after AnimatePresence exit (next tick)
    requestAnimationFrame(() => {
      previousFocusRef.current?.focus();
    });
  }, []);

  // Konami code listener
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Don't interfere with form inputs
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      sequenceRef.current.push(e.key);

      // Keep only the last N keys where N = Konami sequence length
      if (sequenceRef.current.length > KONAMI.length) {
        sequenceRef.current.shift();
      }

      if (sequenceRef.current.join(",") === KONAMI.join(",")) {
        sequenceRef.current = [];
        openModal();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openModal]);

  // Also print a console hint on mount (the "hidden console message" trigger
  // from the requirements as an alternative discovery path)
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(
      "%c🕹️  Psst! Try the Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A",
      "color: #6C63FF; font-size: 14px; font-weight: bold;"
    );
  }, []);

  return (
    <AnimatePresence>
      {open && <EasterEggModal onClose={closeModal} />}
    </AnimatePresence>
  );
}
