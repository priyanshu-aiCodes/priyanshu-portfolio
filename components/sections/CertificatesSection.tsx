"use client";

/**
 * CertificatesSection — Certificates & Achievements.
 *
 * Each CertificateCard shows:
 *  - Organisation icon (Lucide Award fallback)
 *  - Certificate title + issuer
 *  - Description
 *  - Category chip
 *  - Completed status + date (if available)
 *  - "View Certificate" button (placeholder until credentialUrl is added)
 *
 * Below the grid: a real achievements list.
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Award, ExternalLink, Download, CheckCircle, Star } from "lucide-react";

import { SECTION_IDS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import SectionHeading from "@/components/ui/SectionHeading";
import { certificates, type Certificate, type CertificateCategory } from "@/data/certificates";

// ─── Achievements data ────────────────────────────────────────────────────────

const ACHIEVEMENTS = [
  "Built Galaxy Rescue Shooter — a 2D space shooter game using Python and Pygame.",
  "Built AI Study Buddy — an AI-powered chatbot to help students learn.",
  "Built this personal developer portfolio using Next.js, TypeScript, and Tailwind CSS.",
  "Completed three bootcamps from Vedam School of Technology.",
  "Continuously learning software development while preparing for JEE.",
];

// ─── Category meta ────────────────────────────────────────────────────────────

const CAT_STYLES: Record<CertificateCategory, { color: string; bg: string; border: string }> = {
  "Programming": { color: "text-primary",    bg: "bg-primary/10",    border: "border-primary/30"    },
  "AI/ML":       { color: "text-secondary",  bg: "bg-secondary/10",  border: "border-secondary/30"  },
  "Web Dev":     { color: "text-accent",     bg: "bg-accent/10",     border: "border-accent/30"     },
  "Game Dev":    { color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/30" },
  "Other":       { color: "text-text-muted", bg: "bg-white/5",       border: "border-white/15"      },
};

const FILTER_CATEGORIES: Array<"All" | CertificateCategory> = [
  "All", "Programming", "AI/ML", "Game Dev", "Web Dev", "Other",
];

// ─── Certificate Card ─────────────────────────────────────────────────────────

function CertCard({ cert, index }: { cert: Certificate; index: number }) {
  const catStyle = CAT_STYLES[cert.category];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.35,
        delay: Math.min(index * 0.06, 0.3), // cap at 300ms
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      }}
      className={cn(
        "glass rounded-2xl p-5 flex flex-col gap-4",
        "border border-white/8",
        "hover:border-primary/40 hover:shadow-card-hover",
        "transition-all duration-250 ease-out group",
        "overflow-hidden relative shimmer-on-hover"
      )}
    >
      {/* Header row: icon + category chip */}
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0",
            "border border-white/10 bg-white/5"
          )}
        >
          <Award size={20} className="text-primary/70" aria-hidden="true" />
        </div>

        <span
          className={cn(
            "text-xs font-mono px-2.5 py-0.5 rounded-full border",
            catStyle.color, catStyle.bg, catStyle.border
          )}
        >
          {cert.category}
        </span>
      </div>

      {/* Title + issuer */}
      <div>
        <h3 className="font-display font-semibold text-white text-sm leading-snug mb-1">
          {cert.title}
        </h3>
        <p className="text-text-muted font-body text-xs leading-relaxed">
          {cert.issuer}
        </p>
      </div>

      {/* Description */}
      <p className="text-text-muted font-body text-xs leading-relaxed flex-1">
        {cert.description}
      </p>

      {/* Footer: status + action buttons */}
      <div className="flex flex-col gap-2 pt-1 border-t border-white/5">
        {/* Completed status */}
        <span className="flex items-center gap-1.5 text-xs font-mono text-text-muted">
          <CheckCircle size={11} className="text-secondary/70" aria-hidden="true" />
          {cert.date ? cert.date : "Completed"}
        </span>

        {/* Preview + Download buttons */}
        {cert.credentialUrl ? (
          <div className="flex items-center gap-2">
            {/* Preview — opens PDF in new tab */}
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Preview certificate: ${cert.title}`}
              className={cn(
                "flex items-center gap-1.5 text-xs font-mono flex-1 justify-center",
                "px-3 py-1.5 rounded-lg border",
                "border-primary/30 text-primary/80",
                "hover:bg-primary/10 hover:border-primary/60 hover:text-primary",
                "transition-all duration-200 min-h-[36px]"
              )}
            >
              <ExternalLink size={11} aria-hidden="true" />
              Preview
            </a>

            {/* Download — triggers download */}
            <a
              href={cert.credentialUrl}
              download
              aria-label={`Download certificate: ${cert.title}`}
              className={cn(
                "flex items-center gap-1.5 text-xs font-mono flex-1 justify-center",
                "px-3 py-1.5 rounded-lg border",
                "border-secondary/30 text-secondary/80",
                "hover:bg-secondary/10 hover:border-secondary/60 hover:text-secondary",
                "transition-all duration-200 min-h-[36px]"
              )}
            >
              <Download size={11} aria-hidden="true" />
              Download
            </a>
          </div>
        ) : (
          <span
            className={cn(
              "flex items-center gap-1.5 text-xs font-mono",
              "px-3 py-1.5 rounded-lg border",
              "border-white/10 text-text-muted/40 cursor-default"
            )}
          >
            <ExternalLink size={11} aria-hidden="true" />
            Certificate link coming soon
          </span>
        )}
      </div>
    </motion.article>
  );
}

// ─── Certificates Section ─────────────────────────────────────────────────────

export default function CertificatesSection() {
  const [activeFilter, setActiveFilter] = useState<"All" | CertificateCategory>("All");

  const filtered =
    activeFilter === "All"
      ? certificates
      : certificates.filter((c) => c.category === activeFilter);

  const availableFilters = FILTER_CATEGORIES.filter(
    (f) => f === "All" || certificates.some((c) => c.category === f)
  );

  return (
    <section
      id={SECTION_IDS.certificates}
      aria-label="Certificates and Achievements"
      className="relative py-24 px-4 md:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          title="Certificates & Achievements"
          subtitle="Bootcamps completed and milestones reached."
          align="center"
          className="mb-12"
        />

        {/* Filter bar */}
        <div
          role="group"
          aria-label="Filter certificates by category"
          className="flex flex-wrap gap-2 justify-center mb-10"
        >
          {availableFilters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              aria-pressed={activeFilter === f}
              className={cn(
                "px-4 py-2 text-xs font-mono rounded-full transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]",
                activeFilter === f
                  ? "bg-primary text-white shadow-glow-primary"
                  : "glass text-text-muted border border-white/10 hover:border-primary/40 hover:text-white"
              )}
            >
              {f}
              <span className="ml-1.5 opacity-50">
                ({f === "All"
                  ? certificates.length
                  : certificates.filter((c) => c.category === f).length})
              </span>
            </button>
          ))}
        </div>

        {/* Certificates grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((cert, i) => (
            <CertCard key={cert.id} cert={cert} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="glass rounded-xl p-10 text-center text-text-muted font-mono text-sm">
            No certificates in this category yet.
          </div>
        )}

        {/* ── Achievements ─────────────────────────────────────────────────── */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
        >
          <h3 className="font-display text-xl font-semibold text-white/80 text-center mb-8">
            Achievements
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {ACHIEVEMENTS.map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.3,
                  delay: Math.min(i * 0.06, 0.25),
                  ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
                }}
                className={cn(
                  "glass rounded-xl p-4 border border-white/8",
                  "hover:border-primary/30 transition-all duration-250",
                  "flex items-start gap-3"
                )}
              >
                <Star
                  size={14}
                  className="text-primary/70 flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <p className="text-text-muted font-body text-sm leading-relaxed">
                  {text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
