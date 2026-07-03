"use client";

/**
 * SkillsSection — dual sub-section layout.
 *
 * Sub-section 1 — Proficiency Breakdown:
 *   Animated horizontal bar per category, driven by the skill count.
 *   No raw numbers — visual depth only.
 *
 * Sub-section 2 — Tech Icon Grid:
 *   SkillBadge cards organised by category label rows.
 *   5 categories: Languages | Web Development | AI/ML Tools |
 *                 Developer Tools | Currently Learning
 *   Staggered viewport entrance, 50ms between each badge.
 *   Hover: lift + brand-colour glow.
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import * as SI from "react-icons/si";
import { FiCode } from "react-icons/fi";

import { SECTION_IDS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import SectionHeading from "@/components/ui/SectionHeading";
import { skills, type Skill, type SkillCategory } from "@/data/skills";

// ─── Category meta ────────────────────────────────────────────────────────────

const CATEGORY_META: Record<
  SkillCategory,
  { label: string; emoji: string; color: string; barColor: string; bgColor: string }
> = {
  "Languages": {
    label: "Programming Languages",
    emoji: "⌨️",
    color: "text-primary",
    barColor: "bg-primary",
    bgColor: "bg-primary/10 border-primary/20",
  },
  "Web Development": {
    label: "Web Development",
    emoji: "🌐",
    color: "text-secondary",
    barColor: "bg-secondary",
    bgColor: "bg-secondary/10 border-secondary/20",
  },
  "AI/ML Tools": {
    label: "AI & ML Tools",
    emoji: "🤖",
    color: "text-accent",
    barColor: "bg-accent",
    bgColor: "bg-accent/10 border-accent/20",
  },
  "Developer Tools": {
    label: "Developer Tools",
    emoji: "🛠️",
    color: "text-yellow-400",
    barColor: "bg-yellow-400",
    bgColor: "bg-yellow-400/10 border-yellow-400/20",
  },
  "Currently Learning": {
    label: "Currently Learning",
    emoji: "🌱",
    color: "text-purple-400",
    barColor: "bg-purple-400",
    bgColor: "bg-purple-400/10 border-purple-400/20",
  },
};

const CATEGORY_ORDER: SkillCategory[] = [
  "Languages",
  "Web Development",
  "AI/ML Tools",
  "Developer Tools",
  "Currently Learning",
];

const PROFICIENCY_WIDTH: Record<string, string> = {
  Advanced:     "w-[88%]",
  Intermediate: "w-[60%]",
  Beginner:     "w-[30%]",
};

// ─── Resolve react-icons/si icon by string name ───────────────────────────────

function getIcon(iconName: string): React.ElementType {
  const icons = SI as Record<string, React.ElementType>;
  return icons[iconName] ?? FiCode;
}

// ─── Skill Badge ──────────────────────────────────────────────────────────────

function SkillBadge({ skill, index }: { skill: Skill; index: number }) {
  const Icon = getIcon(skill.iconName);
  const [imgError, setImgError] = useState(false);
  const brandColor = skill.brandColor ?? "#6C63FF";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: 0.3,
        delay: Math.min(index * 0.04, 0.3), // cap stagger delay at 300ms
        ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number],
      }}
      className={cn(
        "glass rounded-xl p-3 flex flex-col items-center gap-2",
        "cursor-default border border-white/8",
        "min-w-[80px] w-full",
        // CSS hover instead of Framer whileHover for better performance
        "transition-transform duration-200 hover:-translate-y-1"
      )}
      style={{ "--brand-color": brandColor } as React.CSSProperties}
      title={skill.name}
    >
      {/* Icon */}
      <div className="w-8 h-8 flex items-center justify-center">
        {!imgError ? (
          <Icon
            size={28}
            color={brandColor}
            aria-hidden="true"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-xs font-mono text-text-muted" aria-hidden="true">
            {skill.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      {/* Name */}
      <span className="text-xs font-mono text-text-muted text-center leading-tight">
        {skill.name}
      </span>

      {/* Proficiency dot */}
      {skill.proficiency && (
        <span
          className={cn(
            "text-[10px] font-mono px-1.5 py-0.5 rounded-full border",
            skill.proficiency === "Advanced"
              ? "text-secondary border-secondary/40 bg-secondary/10"
              : skill.proficiency === "Intermediate"
              ? "text-primary border-primary/40 bg-primary/10"
              : "text-text-muted border-white/15 bg-white/5"
          )}
        >
          {skill.proficiency}
        </span>
      )}
    </motion.div>
  );
}

// ─── Proficiency bar ──────────────────────────────────────────────────────────

function ProficiencyBar({
  category,
  count,
  maxCount,
  index,
}: {
  category: SkillCategory;
  count: number;
  maxCount: number;
  index: number;
}) {
  const meta = CATEGORY_META[category];
  const widthPct = Math.round((count / maxCount) * 100);

  return (
    <motion.div
      className="flex flex-col gap-2"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] }}
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-mono text-white/80">
          <span aria-hidden="true">{meta.emoji}</span>
          {meta.label}
        </span>
        <span className="text-xs font-mono text-text-muted">
          {count} skill{count !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", meta.barColor)}
          initial={{ width: 0 }}
          whileInView={{ width: `${widthPct}%` }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: index * 0.08 + 0.15, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] }}
          aria-hidden="true"
        />
      </div>
    </motion.div>
  );
}

// ─── Skills Section ───────────────────────────────────────────────────────────

export default function SkillsSection() {
  const categoryCounts = CATEGORY_ORDER.reduce<Record<SkillCategory, number>>(
    (acc, cat) => {
      acc[cat] = skills.filter((s) => s.category === cat).length;
      return acc;
    },
    {} as Record<SkillCategory, number>
  );

  const maxCount = Math.max(...Object.values(categoryCounts));

  return (
    <section
      id={SECTION_IDS.skills}
      aria-label="Skills and Tech Stack"
      className="relative py-24 px-4 md:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          title="Skills & Tech Stack"
          subtitle="What I know, what I'm learning, and the tools I use every day."
          align="center"
          className="mb-16"
        />

        {/* ── Sub-section 1: Proficiency breakdown ─────────────────────── */}
        <motion.div
          className="glass rounded-2xl p-6 md:p-8 mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] }}
        >
          <h3 className="font-display text-lg font-semibold text-white/80 mb-6">
            Proficiency by Category
          </h3>
          <div className="flex flex-col gap-5">
            {CATEGORY_ORDER.map((cat, i) => (
              <ProficiencyBar
                key={cat}
                category={cat}
                count={categoryCounts[cat]}
                maxCount={maxCount}
                index={i}
              />
            ))}
          </div>
        </motion.div>

        {/* ── Sub-section 2: Tech icon grid by category ─────────────────── */}
        <div className="flex flex-col gap-10">
          {CATEGORY_ORDER.map((cat) => {
            const catSkills = skills.filter((s) => s.category === cat);
            const meta = CATEGORY_META[cat];
            if (catSkills.length === 0) return null;

            return (
              <div key={cat}>
                {/* Category header */}
                <motion.div
                  className="flex items-center gap-3 mb-5"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] }}
                >
                  <span
                    className={cn(
                      "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold",
                      meta.bgColor,
                      meta.color
                    )}
                  >
                    <span aria-hidden="true">{meta.emoji}</span>
                    {meta.label}
                  </span>
                  <div className="flex-1 h-px bg-white/5" aria-hidden="true" />
                </motion.div>

                {/* Badge grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-3">
                  {catSkills.map((skill, i) => (
                    <SkillBadge key={skill.id} skill={skill} index={i} />
                  ))}
                </div>

                {/* Category divider */}
                <div className="section-divider mt-8" aria-hidden="true" />
              </div>
            );
          })}
        </div>

        {/* ── Proficiency legend ─────────────────────────────────────────── */}
        <motion.div
          className="flex flex-wrap gap-4 justify-center mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {(["Advanced", "Intermediate", "Beginner"] as const).map((lvl) => (
            <span
              key={lvl}
              className={cn(
                "inline-flex items-center gap-1.5 text-xs font-mono",
                PROFICIENCY_WIDTH[lvl] ? "opacity-90" : "opacity-60"
              )}
            >
              <span
                className={cn(
                  "w-2 h-2 rounded-full",
                  lvl === "Advanced"
                    ? "bg-secondary"
                    : lvl === "Intermediate"
                    ? "bg-primary"
                    : "bg-white/30"
                )}
                aria-hidden="true"
              />
              <span className="text-text-muted">{lvl}</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
