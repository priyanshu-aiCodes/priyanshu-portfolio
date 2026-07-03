"use client";

/**
 * ResumeSection — Resume status and current focus.
 */

import React from "react";
import { motion } from "framer-motion";
import { FileText, Download, Target, Code2, Briefcase, Clock } from "lucide-react";

import { SECTION_IDS, siteConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";
import SectionHeading from "@/components/ui/SectionHeading";

// ─── Current status data ──────────────────────────────────────────────────────

const STATUS_ITEMS = [
  {
    icon: Target,
    label: "Status",
    value: "Resume Available",
    color: "text-secondary",
  },
  {
    icon: Code2,
    label: "Current Focus",
    value: "JEE Preparation + AI + Full Stack Development",
    color: "text-primary",
  },
  {
    icon: Briefcase,
    label: "Experience Level",
    value: "Student Developer",
    color: "text-secondary",
  },
  {
    icon: Clock,
    label: "Availability",
    value: "Open to internships and collaborations after JEE",
    color: "text-accent",
  },
];

// ─── Pre-defined animation variants (avoid inline object creation) ─────────────

const containerVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

function makeItemVariants(delay: number) {
  return {
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 as number },
    transition: {
      duration: 0.4,
      delay,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  };
}

// ─── Resume Section ───────────────────────────────────────────────────────────

export default function ResumeSection() {
  const { ownerName, resumeUrl } = siteConfig;

  return (
    <section
      id={SECTION_IDS.resume}
      aria-label="Resume"
      className="relative py-24 px-4 md:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          title="Resume"
          subtitle="A snapshot of my current skills, projects and learning journey."
          align="center"
          className="mb-12"
        />

        {/* ── Resume card ─────────────────────────────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="glass rounded-2xl p-8 border border-white/8 flex flex-col gap-8"
        >
          {/* Header: document icon + description */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Icon */}
            <div className="relative flex items-center justify-center w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-white/5">
              <FileText size={48} className="text-primary/40" aria-hidden="true" />
            </div>

            {/* Description */}
            <div className="flex-1">
              <h3 className="font-display font-semibold text-white text-lg mb-2">
                {ownerName}
              </h3>
              <p className="text-text-muted font-body text-sm leading-relaxed">
                I am currently a Class 12 student preparing for JEE while actively learning
                programming, AI, Python and modern web development. I enjoy building real-world
                projects and continuously improving my skills through bootcamps, hackathons and
                self-learning.
              </p>
            </div>
          </div>

          {/* ── Current Status Grid ───────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {STATUS_ITEMS.map(({ icon: Icon, label, value, color }, i) => (
              <motion.div
                key={label}
                {...makeItemVariants(0.1 + i * 0.05)}
                className={cn(
                  "flex items-start gap-3 p-4 rounded-xl border border-white/8",
                  "hover:border-primary/30 transition-colors duration-250"
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-lg",
                    "bg-white/5 border border-white/10"
                  )}
                >
                  <Icon size={16} className={color} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-mono text-text-muted/60 mb-0.5">{label}</p>
                  <p className="text-sm font-body text-white/90 leading-snug">{value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── Action Buttons ────────────────────────────────────────────── */}
          <motion.div {...makeItemVariants(0.3)} className="flex flex-col sm:flex-row gap-3 pt-2">
            {/* View in browser */}
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View resume in new tab"
              className={cn(
                "flex-1 flex items-center justify-center gap-2",
                "px-6 py-3.5 rounded-xl text-sm font-mono",
                "border border-primary/50 text-primary",
                "hover:bg-primary/10 hover:border-primary",
                "transition-all duration-250 ease-out min-h-[44px]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              )}
            >
              <FileText size={15} aria-hidden="true" />
              View Resume
            </a>

            {/* Download PDF */}
            <a
              href={resumeUrl}
              download="Priyanshu_Sharma_Resume.pdf"
              aria-label="Download resume as PDF"
              className={cn(
                "flex-1 flex items-center justify-center gap-2",
                "px-6 py-3.5 rounded-xl text-sm font-mono",
                "bg-primary text-white",
                "hover:brightness-110 hover:shadow-glow-primary",
                "transition-all duration-250 ease-out min-h-[44px]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              )}
            >
              <Download size={15} aria-hidden="true" />
              Download PDF
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
