"use client";

/**
 * Footer — clean, minimal site footer.
 *
 * Sections:
 *  - Logo + short tagline
 *  - Quick nav links (Home, About, Projects, Contact)
 *  - Social icon links (same as Hero)
 *  - "Built with" tech credits
 *  - Copyright line with dynamic year
 *  - "Back to top" button
 */

import React from "react";
import { FiArrowUp } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/constants";
import SocialLinks from "@/components/ui/SocialLinks";

// ─── Quick nav items shown in footer ─────────────────────────────────────────

const FOOTER_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const TECH_CREDITS = [
  "Next.js 14",
  "TypeScript",
  "Tailwind CSS",
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Footer() {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    const hero = document.getElementById("hero");
    if (hero) {
      hero.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNavClick = (href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer
      aria-label="Site footer"
      className="relative z-10 border-t border-white/5"
    >
      {/* Section divider above footer */}
      <div className="section-divider" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* ── Main footer grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Column 1 — Logo + tagline + socials */}
          <div className="flex flex-col gap-4">
            <span className="font-display font-bold text-xl gradient-text-brand">
              {siteConfig.ownerName.split(" ")[0]}
              <span className="text-primary">.</span>
            </span>
            <p className="text-text-muted text-sm font-body leading-relaxed max-w-xs">
              Class 12 student preparing for JEE while learning programming,
              AI, and web development.
            </p>
            <SocialLinks iconSize={18} />
          </div>

          {/* Column 2 — Quick navigation */}
          <nav aria-label="Footer navigation">
            <h3 className="text-white/50 text-xs font-mono uppercase tracking-widest mb-4">
              Navigation
            </h3>
            <ul className="flex flex-col gap-2" role="list">
              {FOOTER_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <button
                    type="button"
                    onClick={() => handleNavClick(href)}
                    className={cn(
                      "text-text-muted text-sm font-body",
                      "hover:text-primary transition-colors duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      "focus-visible:ring-offset-1 rounded-sm"
                    )}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 3 — Built with */}
          <div>
            <h3 className="text-white/50 text-xs font-mono uppercase tracking-widest mb-4">
              Built with
            </h3>
            <ul className="flex flex-col gap-2" role="list">
              {TECH_CREDITS.map((tech) => (
                <li
                  key={tech}
                  className="text-text-muted text-sm font-body"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ───────────────────────────────────────────────── */}
        <div
          className={cn(
            "flex flex-col sm:flex-row items-center justify-between gap-4",
            "pt-8 border-t border-white/5"
          )}
        >
          {/* Copyright */}
          <p className="text-text-muted text-xs font-mono text-center sm:text-left">
            © {year} {siteConfig.ownerName}. Built with Next.js, TypeScript &amp; Tailwind CSS.
          </p>

          {/* Back to top */}
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className={cn(
              "flex items-center gap-2 text-xs font-body text-text-muted",
              "hover:text-primary transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              "focus-visible:ring-offset-1 rounded-sm group"
            )}
          >
            Back to top
            <span
              className={cn(
                "flex items-center justify-center w-7 h-7 rounded-md",
                "border border-white/10 group-hover:border-primary/50",
                "transition-colors duration-200"
              )}
            >
              <FiArrowUp size={13} aria-hidden="true" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
