/**
 * Badge — compact label chip with semantic colour variants.
 *
 * Intentionally a server component (no interactivity needed).
 */

import React from "react"
import { cn } from "@/lib/utils"

interface BadgeProps {
  /** Text displayed inside the badge */
  label: string
  /** Controls background, border, and text colour */
  variant?: "primary" | "featured" | "tech" | "success" | "warning"
  className?: string
}

// ─── Style map ────────────────────────────────────────────────────────────────

const variantStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  primary: "bg-primary/15 text-primary border border-primary/30",
  featured:
    "bg-gradient-to-r from-primary/20 to-secondary/20 text-white border border-primary/40",
  tech: "bg-white/5 text-text-muted border border-white/10",
  success: "bg-success/15 text-success border border-success/30",
  warning: "bg-warning/15 text-warning border border-warning/30",
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Badge({
  label,
  variant = "tech",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "px-2.5 py-0.5 text-xs font-mono rounded-full inline-flex items-center",
        variantStyles[variant],
        className
      )}
    >
      {label}
    </span>
  )
}
