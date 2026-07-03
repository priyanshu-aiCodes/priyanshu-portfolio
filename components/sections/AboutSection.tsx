"use client";

/**
 * AboutSection — split layout: illustration left, text right.
 */

import React, { useState, memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  FiBook,
  FiCode,
  FiTarget,
  FiZap,
  FiTrendingUp,
  FiStar,
} from "react-icons/fi";

import { SECTION_IDS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import SectionHeading from "@/components/ui/SectionHeading";

// ─── Currently block data ─────────────────────────────────────────────────────

const CURRENTLY = [
  {
    icon: FiBook,
    emoji: "📚",
    label: "Studying",
    text: "JEE Physics, Chemistry & Maths — preparing for the exam",
    color: "text-primary",
    bg: "bg-primary/10 border-primary/20",
  },
  {
    icon: FiCode,
    emoji: "💻",
    label: "Learning",
    text: "JavaScript, React, and Next.js — building my web dev skills",
    color: "text-secondary",
    bg: "bg-secondary/10 border-secondary/20",
  },
  {
    icon: FiTarget,
    emoji: "🤖",
    label: "Exploring",
    text: "AI development and practical machine learning applications",
    color: "text-accent",
    bg: "bg-accent/10 border-accent/20",
  },
  {
    icon: FiZap,
    emoji: "🚀",
    label: "Working towards",
    text: "Cracking JEE, freelancing, and joining hackathons",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10 border-yellow-400/20",
  },
] as const;

// ─── Fun fact data ────────────────────────────────────────────────────────────

const FUN_FACTS = [
  { icon: FiCode,       fact: "Started programming with Python and built my first projects with it",   label: "Python first"   },
  { icon: FiBook,       fact: "Balancing JEE prep and coding every single day",                        label: "Dual track"     },
  { icon: FiTrendingUp, fact: "Recently picked up JavaScript, React, and Next.js",                     label: "Web learner"    },
  { icon: FiStar,       fact: "Goal: become a software engineer and build impactful AI products",      label: "Big goals"      },
] as const;

// ─── Fun Fact Card — memoized to prevent re-renders from parent state ─────────

const FunFactCard = memo(function FunFactCard({
  icon: Icon,
  fact,
  label,
  index,
  reduced,
}: {
  icon: React.ElementType;
  fact: string;
  label: string;
  index: number;
  reduced: boolean;
}) {
  const [revealed, setReveal] = useState(false);

  return (
    <motion.div
      className={cn(
        "glass p-4 rounded-xl cursor-pointer select-none",
        "border border-white/8 hover:border-primary/40",
        "transition-all duration-250 ease-out group",
        "min-h-[44px]"
      )}
      initial={reduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] }}
      onHoverStart={() => setReveal(true)}
      onHoverEnd={() => setReveal(false)}
      onTap={() => setReveal((v) => !v)}
      role="button"
      tabIndex={0}
      aria-expanded={revealed}
      aria-label={`Fun fact: ${label}`}
      onKeyDown={(e) => e.key === "Enter" && setReveal((v) => !v)}
      whileHover={reduced ? {} : { scale: 1.02 }}
      whileTap={reduced ? {} : { scale: 0.98 }}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/25 transition-colors">
          <Icon size={16} className="text-primary" aria-hidden="true" />
        </div>
        <span className="text-xs font-mono text-text-muted group-hover:text-white transition-colors">
          {label}
        </span>
        <motion.span
          className="ml-auto text-text-muted/50 text-xs"
          animate={{ rotate: revealed ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          aria-hidden="true"
        >
          ▾
        </motion.span>
      </div>

      <motion.p
        className="text-text-muted text-xs font-body leading-relaxed overflow-hidden"
        initial={false}
        animate={revealed ? { height: "auto", opacity: 1, marginTop: 10 } : { height: 0, opacity: 0, marginTop: 0 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] }}
      >
        {fact}
      </motion.p>
    </motion.div>
  );
});

// ─── About Section ────────────────────────────────────────────────────────────

export default function AboutSection() {
  // Single useReducedMotion call — passed down instead of each card calling it
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      id={SECTION_IDS.about}
      aria-label="About"
      className="relative py-24 px-4 md:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          title="About Me"
          subtitle="Class 12 student, JEE aspirant, and aspiring software engineer."
          align="center"
          className="mb-16"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* ── Left: portrait card ───────────────────────────────────────── */}
          <motion.div
            className="flex flex-col gap-6 items-center lg:items-start"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] }}
          >
            {/* Avatar card */}
            <div
              className={cn(
                "relative w-64 h-64 rounded-2xl overflow-hidden",
                "border-2 border-primary/30 shadow-glow-primary"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/profile.jpg/publicprofile.jpg.png"
                alt="Priyanshu Sharma"
                className="w-full h-full object-cover"
                width={256}
                height={256}
                loading="lazy"
                decoding="async"
              />
              {/* Decorative corner badge */}
              <div className="absolute top-3 right-3 px-2 py-1 glass rounded-md text-xs font-mono text-secondary border border-secondary/20">
                Class 12
              </div>
            </div>

            {/* Fun fact cards */}
            <div className="w-full max-w-sm grid grid-cols-1 gap-3">
              {FUN_FACTS.map((f, i) => (
                <FunFactCard key={f.label} {...f} index={i} reduced={reduced} />
              ))}
            </div>
          </motion.div>

          {/* ── Right: text + currently block ─────────────────────────────── */}
          <motion.div
            className="flex flex-col gap-8"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] }}
          >
            {/* Narrative */}
            <div className="flex flex-col gap-4">
              <h3 className="font-display text-xl font-semibold text-white/90">
                Hey, I&apos;m{" "}
                <span className="gradient-text-brand">Priyanshu Sharma</span> 👋
              </h3>
              <div className="space-y-3 text-text-muted font-body text-md leading-relaxed">
                <p>
                  I&apos;m a Class 12 student currently preparing for JEE while
                  exploring software development and artificial intelligence. I
                  enjoy building practical projects that help people and
                  improve my skills.
                </p>
                <p>
                  I started programming with Python and gradually learned Git,
                  GitHub, HTML, and AI tools. Recently I&apos;ve started learning
                  JavaScript, React, and Next.js — and I&apos;m enjoying the
                  process of connecting ideas to working software.
                </p>
                <p>
                  My goal is to become a software engineer, build AI products
                  that have real impact, and keep learning every day — one
                  project at a time.
                </p>
              </div>
            </div>

            {/* Currently block */}
            <div>
              <h3 className="font-display text-lg font-semibold text-white/80 mb-4">
                Currently &amp; Goals —
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CURRENTLY.map(({ emoji, label, text, bg, color }, i) => (
                  <motion.div
                    key={label}
                    className={cn(
                      "flex items-start gap-3 p-3.5 rounded-xl border",
                      "transition-transform duration-200 hover:scale-[1.02]",
                      bg
                    )}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.3, delay: Math.min(i * 0.06, 0.25), ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] }}
                  >
                    <span className="text-xl mt-0.5 flex-shrink-0" aria-hidden="true">
                      {emoji}
                    </span>
                    <div className="min-w-0">
                      <p className={cn("text-xs font-mono font-semibold mb-0.5", color)}>
                        {label}
                      </p>
                      <p className="text-text-muted text-xs font-body leading-relaxed">
                        {text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
