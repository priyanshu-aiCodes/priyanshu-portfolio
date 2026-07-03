"use client";

/**
 * Nav — fixed glassmorphism navigation bar.
 *
 * Desktop layout:  [Logo/Name]  [anchor links]  [ThemeToggle + Resume CTA]
 * Mobile layout:   [Logo/Name]  [hamburger]     [ThemeToggle]
 *                  → hamburger opens a full-screen overlay
 *
 * Behaviour:
 *  - Glassmorphism background that intensifies once page is scrolled > 80px
 *  - Active link highlighted with a colored underline dot (from IntersectionObserver)
 *  - Smooth-scroll to target section on anchor click
 *  - All links meet 44×44px touch-target requirement
 *  - WCAG AA contrast on nav text/links
 *  - Closes mobile menu when a link is tapped or overlay is tapped
 */

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { FiMenu, FiX, FiSun, FiMoon, FiDownload } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { NAV_LINKS, siteConfig } from "@/lib/constants";
import { useTheme } from "./ThemeProvider";
import { useActiveSection } from "./ActiveSectionProvider";

// ─── Mobile menu animation ────────────────────────────────────────────────────

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const menuItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Nav() {
  const { theme, toggle } = useTheme();
  const { activeSection } = useActiveSection();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // ── Track scroll position ────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Lock body scroll when mobile menu is open ────────────────────────────
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // ── Close menu on Escape ─────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleNavClick = useCallback(
    (href: string) => {
      setMenuOpen(false);
      const id = href.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    []
  );

  const isActive = (href: string) =>
    activeSection === href.replace("#", "");

  return (
    <>
      {/* ── Main nav bar ─────────────────────────────────────────────────── */}
      <header
        role="banner"
        className={cn(
          "fixed top-0 left-0 right-0 z-40 h-16",
          "glass-nav transition-all duration-300",
          scrolled && "scrolled"
        )}
      >
        <nav
          aria-label="Main navigation"
          className="max-w-7xl mx-auto h-full px-4 md:px-8 flex items-center justify-between gap-4"
        >
          {/* Logo / Name */}
          <button
            type="button"
            onClick={() => handleNavClick("#hero")}
            className={cn(
              "font-display font-bold text-lg gradient-text-brand",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              "focus-visible:ring-offset-bg-dark rounded-sm transition-opacity hover:opacity-80"
            )}
            aria-label="Go to top"
          >
            {siteConfig.ownerName.split(" ")[0]}
            <span className="text-primary">.</span>
          </button>

          {/* Desktop links — hidden on mobile */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <button
                  type="button"
                  onClick={() => handleNavClick(href)}
                  className={cn(
                    "relative px-3 py-2 text-xs font-body font-medium rounded-md",
                    "transition-all duration-200 ease-out",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    "focus-visible:ring-offset-1 focus-visible:ring-offset-bg-dark",
                    isActive(href)
                      ? "text-white"
                      : "text-text-muted hover:text-white hover:bg-white/5"
                  )}
                  aria-current={isActive(href) ? "location" : undefined}
                >
                  {label}
                  {/* Active underline dot */}
                  {isActive(href) && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* Right-side controls */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggle}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className={cn(
                "w-11 h-11 flex items-center justify-center rounded-lg",
                "text-text-muted hover:text-white hover:bg-white/5",
                "transition-all duration-200 ease-out",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              )}
            >
              {theme === "dark" ? (
                <FiSun size={18} aria-hidden="true" />
              ) : (
                <FiMoon size={18} aria-hidden="true" />
              )}
            </button>

            {/* Resume CTA — desktop only, shown when available */}
            {siteConfig.resumeAvailable && (
              <a
                href={siteConfig.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "hidden md:inline-flex items-center gap-1.5",
                  "px-4 py-2 text-xs font-body font-medium rounded-lg",
                  "border border-primary/50 text-primary",
                  "hover:bg-primary/10 hover:border-primary",
                  "transition-all duration-200 ease-out",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                )}
              >
                <FiDownload size={13} aria-hidden="true" />
                Resume
              </a>
            )}

            {/* Hamburger — mobile only */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className={cn(
                "md:hidden w-11 h-11 flex items-center justify-center rounded-lg",
                "text-text-muted hover:text-white hover:bg-white/5",
                "transition-all duration-200 ease-out",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              )}
            >
              {menuOpen ? (
                <FiX size={20} aria-hidden="true" />
              ) : (
                <FiMenu size={20} aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* ── Mobile full-screen menu overlay ──────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "fixed inset-0 z-30 md:hidden",
              "flex flex-col items-center justify-center",
              "bg-bg-dark/97"
            )}
            // Close when tapping the backdrop (outside the links)
            onClick={(e) => {
              if (e.target === e.currentTarget) setMenuOpen(false);
            }}
          >
            {/* Links list */}
            <ul className="flex flex-col items-center gap-2 w-full px-8" role="list">
              {NAV_LINKS.map(({ label, href }, i) => (
                <motion.li
                  key={href}
                  custom={i}
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="visible"
                  className="w-full"
                >
                  <button
                    type="button"
                    onClick={() => handleNavClick(href)}
                    className={cn(
                      "w-full min-h-[56px] flex items-center justify-center",
                      "text-xl font-display font-semibold tracking-tight",
                      "rounded-xl transition-all duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      isActive(href)
                        ? "text-primary"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    )}
                    aria-current={isActive(href) ? "location" : undefined}
                  >
                    {label}
                  </button>
                </motion.li>
              ))}

              {/* Resume link in mobile menu */}
              {siteConfig.resumeAvailable && (
                <motion.li
                  custom={NAV_LINKS.length}
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="visible"
                  className="w-full mt-4"
                >
                  <a
                    href={siteConfig.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "w-full min-h-[56px] flex items-center justify-center gap-2",
                      "text-lg font-body font-medium",
                      "border border-primary/50 text-primary rounded-xl",
                      "hover:bg-primary/10 transition-all duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    )}
                  >
                    <FiDownload size={18} aria-hidden="true" />
                    Download Resume
                  </a>
                </motion.li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
