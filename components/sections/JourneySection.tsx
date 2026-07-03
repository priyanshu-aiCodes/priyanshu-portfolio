"use client";

/**
 * JourneySection — animated vertical timeline.
 */

import React from "react";
import { motion } from "framer-motion";
import {
  Target, Trophy, Code2, Gamepad2, BrainCircuit,
  Terminal, GraduationCap, Rocket, Sparkles, GitBranch, Lightbulb,
  type LucideIcon,
} from "lucide-react";

import { SECTION_IDS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import SectionHeading from "@/components/ui/SectionHeading";
import { timeline, type TimelineEntry, type TimelineCategory } from "@/data/timeline";

// ─── Icon registry ────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  Target, Trophy, Code2, Gamepad2, BrainCircuit,
  Terminal, GraduationCap, Rocket, Sparkles, GitBranch, Lightbulb,
};

// ─── Category colours ─────────────────────────────────────────────────────────

const CAT_STYLES: Record<TimelineCategory, { dot: string; ring: string; icon: string }> = {
  education:    { dot: "bg-primary",   ring: "border-primary/40",   icon: "text-primary"   },
  project:      { dot: "bg-secondary", ring: "border-secondary/40", icon: "text-secondary" },
  achievement:  { dot: "bg-accent",    ring: "border-accent/40",    icon: "text-accent"    },
  certification:{ dot: "bg-yellow-400",ring: "border-yellow-400/40",icon: "text-yellow-400"},
};

// ─── Single timeline entry ────────────────────────────────────────────────────

function Entry({
  entry,
  index,
}: {
  entry: TimelineEntry;
  index: number;
}) {
  const Icon = ICON_MAP[entry.iconName] ?? Code2;
  const styles = CAT_STYLES[entry.category];
  // Desktop: even index → left side, odd → right side
  const isLeft = index % 2 === 0;

  return (
    <div
      className={cn(
        "relative flex items-start gap-0",
        // Mobile: everything left of the line
        "flex-row",
        // Desktop: alternate sides
        "lg:flex-row lg:gap-0",
        isLeft ? "lg:flex-row-reverse" : "lg:flex-row"
      )}
    >
      {/* ── Card ─────────────────────────────────────────────────────────── */}
      <motion.div
        className={cn(
          "w-full lg:w-[calc(50%-2.5rem)]",
          isLeft ? "lg:pr-8 lg:text-right" : "lg:pl-8 lg:text-left",
          // Mobile always left
          "pl-8 lg:pl-0"
        )}
        initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.4, delay: 0.04, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] }}
      >
        <div
          className={cn(
            "glass rounded-xl p-5 border border-white/8",
            "hover:border-primary/30 transition-all duration-250",
            "hover:shadow-card"
          )}
        >
          {/* Date chip */}
          <span className="text-xs font-mono text-text-muted">{entry.date}</span>

          {/* Title */}
          <h3 className="font-display font-semibold text-white text-base mt-1 mb-0.5">
            {entry.title}
          </h3>

          {/* Context */}
          <p className={cn("text-xs font-mono mb-2", styles.icon)}>{entry.context}</p>

          {/* Description */}
          <p className="text-text-muted font-body text-sm leading-relaxed">
            {entry.description}
          </p>
        </div>
      </motion.div>

      {/* ── Centre dot (absolutely on the line) ──────────────────────────── */}
      <motion.div
        className={cn(
          // Mobile: absolute left at the line position
          "absolute left-0 top-5",
          // Desktop: centred on the axis
          "lg:static lg:flex-shrink-0 lg:mx-0",
          "flex items-center justify-center",
          "w-10 h-10 rounded-full border-2",
          "bg-bg-dark",
          styles.ring,
          "z-10"
        )}
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] as [number,number,number,number] }}
      >
        <Icon size={16} className={styles.icon} aria-hidden="true" />
      </motion.div>

      {/* ── Desktop spacer on the other side ─────────────────────────────── */}
      <div className="hidden lg:block lg:w-[calc(50%-2.5rem)]" />
    </div>
  );
}

// ─── Journey Section ──────────────────────────────────────────────────────────

export default function JourneySection() {
  return (
    <section
      id={SECTION_IDS.journey}
      aria-label="Learning Journey"
      className="relative py-24 px-4 md:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          title="My Journey"
          subtitle="The milestones that shaped my path as a developer."
          align="center"
          className="mb-16"
        />

        {/* ── Timeline container ──────────────────────────────────────────── */}
        <div className="relative">
          {/* Background line (faint) */}
          <div
            className={cn(
              // Mobile: left edge
              "absolute left-4 top-0 bottom-0 w-px bg-white/5",
              // Desktop: centre
              "lg:left-1/2 lg:-translate-x-px"
            )}
            aria-hidden="true"
          />

          {/* Filled gradient line — simple opacity fade-in instead of scroll-driven */}
          <motion.div
            className={cn(
              "absolute left-4 top-0 bottom-0 w-px",
              "bg-gradient-to-b from-primary to-secondary rounded-full",
              "lg:left-1/2 lg:-translate-x-px"
            )}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            aria-hidden="true"
          />

          {/* Entries */}
          <div className="flex flex-col gap-10 lg:gap-12">
            {timeline.map((entry, i) => (
              <Entry key={entry.id} entry={entry} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
