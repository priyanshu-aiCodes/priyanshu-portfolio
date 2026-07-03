"use client"

/**
 * AmbientBlobs — decorative full-screen background blobs.
 *
 * Three large blurred gradient circles that animate with the CSS
 * `animate-blob` keyframe defined in tailwind.config.ts.
 * Completely non-interactive and hidden from assistive technologies.
 */

import React from "react"
import { cn } from "@/lib/utils"

interface AmbientBlobsProps {
  className?: string
}

export default function AmbientBlobs({ className }: AmbientBlobsProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "fixed inset-0 z-0 overflow-hidden pointer-events-none",
        className
      )}
    >
      {/* Blob 1 — primary, top-left (reduced size + blur for performance) */}
      <div
        className={cn(
          "w-[400px] h-[400px] rounded-full blur-[80px] absolute pointer-events-none will-change-transform",
          "bg-primary/10 animate-blob",
          "top-[-120px] left-[-80px]"
        )}
      />

      {/* Blob 2 — secondary, mid-right */}
      <div
        className={cn(
          "w-[400px] h-[400px] rounded-full blur-[80px] absolute pointer-events-none will-change-transform",
          "bg-secondary/8 animate-blob",
          "top-[25%] right-[-120px]",
          "[animation-delay:3s]"
        )}
      />

      {/* Blob 3 — accent, bottom-center (removed for performance, keeping two blobs) */}
    </div>
  )
}
