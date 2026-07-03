"use client"

/**
 * Toast — self-dismissing notification that slides in from the bottom-right.
 *
 * Uses framer-motion for the entrance / exit animation.
 * Supports three semantic types: success, error, and info.
 * Auto-dismisses after `durationMs` milliseconds.
 */

import React, { useEffect } from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { FiCheckCircle, FiXCircle, FiInfo, FiX } from "react-icons/fi"
import { cn } from "@/lib/utils"

interface ToastProps {
  /** The message to display */
  message: string
  /** Controls the icon and accent colour */
  type?: "success" | "error" | "info"
  /** Auto-dismiss delay in milliseconds — default 5000 */
  durationMs?: number
  /** Called when the toast should be removed from the DOM */
  onDismiss: () => void
}

// ─── Type configuration ───────────────────────────────────────────────────────

const typeConfig = {
  success: {
    icon: FiCheckCircle,
    styles: "border-success/30 text-success",
    iconAriaLabel: "Success",
  },
  error: {
    icon: FiXCircle,
    styles: "border-error/30 text-error",
    iconAriaLabel: "Error",
  },
  info: {
    icon: FiInfo,
    styles: "border-primary/30 text-primary",
    iconAriaLabel: "Information",
  },
} as const

// ─── Animation variants ────────────────────────────────────────────────────────

const toastVariants: Variants = {
  hidden: { x: 100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 28 },
  },
  exit: {
    x: 100,
    opacity: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] as [number,number,number,number] },
  },
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Toast({
  message,
  type = "info",
  durationMs = 5000,
  onDismiss,
}: ToastProps) {
  const { icon: Icon, styles, iconAriaLabel } = typeConfig[type]

  // Auto-dismiss timer
  useEffect(() => {
    const id = setTimeout(onDismiss, durationMs)
    return () => clearTimeout(id)
  }, [durationMs, onDismiss])

  return (
    <AnimatePresence>
      <motion.div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        variants={toastVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={cn(
          "glass fixed bottom-6 right-6 z-50 max-w-sm",
          "p-4 rounded-lg flex items-center gap-3",
          styles
        )}
      >
        {/* Status icon */}
        <Icon
          size={20}
          aria-label={iconAriaLabel}
          className="flex-shrink-0"
          aria-hidden="true"
        />

        {/* Message */}
        <p className="font-body text-sm flex-1 text-text-primary-dark">
          {message}
        </p>

        {/* Manual dismiss button */}
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className={cn(
            "flex-shrink-0 p-1 rounded-md transition-colors duration-150",
            "hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          )}
        >
          <FiX size={16} aria-hidden="true" />
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
