"use client"

/**
 * Button — polymorphic button/link component with variant + size support.
 *
 * Renders as a <button> by default. When `href` is provided, renders as
 * a Next.js <Link>. When both `href` and `external` are set, opens in a
 * new tab with the appropriate rel attribute.
 */

import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface ButtonProps {
  /** Visual style of the button */
  variant?: "primary" | "secondary" | "ghost" | "outline"
  /** Size preset controlling padding, font size, and border radius */
  size?: "sm" | "md" | "lg"
  /** When set, renders the component as a Next.js Link */
  href?: string
  /** Disables the button and applies reduced-opacity cursor */
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
  className?: string
  "aria-label"?: string
  type?: "button" | "submit" | "reset"
  /** When true AND href is set, opens the link in a new browser tab */
  external?: boolean
}

// ─── Style maps ───────────────────────────────────────────────────────────────

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: [
    "bg-primary text-white",
    "hover:shadow-glow-primary hover:scale-[1.02] hover:brightness-110",
    "active:scale-[0.98]",
  ].join(" "),

  secondary: [
    "bg-secondary/10 text-secondary border border-secondary/30",
    "hover:bg-secondary/20 hover:border-secondary/50",
    "active:bg-secondary/25",
  ].join(" "),

  ghost: [
    "bg-transparent text-text-muted",
    "hover:text-white hover:bg-white/5",
    "active:bg-white/10",
  ].join(" "),

  outline: [
    "border border-primary/50 text-primary bg-transparent",
    "hover:bg-primary/10 hover:border-primary",
    "active:bg-primary/15",
  ].join(" "),
}

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-4 py-2 text-xs rounded-md min-h-[44px] min-w-[44px]",
  md: "px-6 py-3 text-sm rounded-lg min-h-[44px] min-w-[44px]",
  lg: "px-8 py-4 text-md rounded-xl min-h-[44px] min-w-[44px]",
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Button({
  variant = "primary",
  size = "md",
  href,
  disabled = false,
  children,
  onClick,
  className,
  "aria-label": ariaLabel,
  type = "button",
  external = false,
}: ButtonProps) {
  const baseStyles = [
    "inline-flex items-center justify-center gap-2 font-body font-medium",
    "transition-all duration-[250ms] ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark",
    "select-none cursor-pointer",
    disabled && "opacity-50 cursor-not-allowed pointer-events-none",
  ]
    .filter(Boolean)
    .join(" ")

  const combined = cn(baseStyles, variantStyles[variant], sizeStyles[size], className)

  // Render as external anchor link
  if (href && external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={combined}
        aria-disabled={disabled}
      >
        {children}
      </a>
    )
  }

  // Render as Next.js Link
  if (href) {
    return (
      <Link
        href={href}
        aria-label={ariaLabel}
        className={combined}
        aria-disabled={disabled}
      >
        {children}
      </Link>
    )
  }

  // Render as plain button
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={combined}
    >
      {children}
    </button>
  )
}
