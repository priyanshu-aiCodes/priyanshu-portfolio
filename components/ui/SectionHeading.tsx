"use client"

/**
 * SectionHeading — animated section title with gradient text, optional subtitle,
 * and a small decorative gradient underline.
 *
 * Uses framer-motion `whileInView` so the entrance animation fires once as
 * the section scrolls into the viewport.
 */

import React from "react"
import { motion, useReducedMotion, type Variants } from "framer-motion"
import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  /** Main heading text — rendered with gradient-text class */
  title: string
  /** Optional supporting text below the title */
  subtitle?: string
  /** Horizontal alignment of all text and decorative elements */
  align?: "left" | "center" | "right"
  className?: string
}

// ─── Alignment helpers ────────────────────────────────────────────────────────

const alignmentMap: Record<NonNullable<SectionHeadingProps["align"]>, string> = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
}

// ─── Animation variants ────────────────────────────────────────────────────────

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] } },
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SectionHeading({
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={cn("flex flex-col gap-3", alignmentMap[align], className)}
      variants={fadeUpVariant}
      initial={reduced ? false : "hidden"}
      whileInView={reduced ? undefined : "visible"}
      animate={reduced ? "visible" : undefined}
      viewport={{ once: true, amount: 0.1 }}
    >
      {/* Title */}
      <h2
        className={cn(
          "gradient-text font-display text-3xl md:text-4xl font-bold tracking-tight"
        )}
      >
        {title}
      </h2>

      {/* Decorative gradient underline */}
      <div
        className="h-[2px] w-16 rounded-full bg-gradient-to-r from-primary to-secondary"
        aria-hidden="true"
      />

      {/* Optional subtitle */}
      {subtitle && (
        <p className="text-text-muted font-body text-md mt-3 max-w-xl">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
