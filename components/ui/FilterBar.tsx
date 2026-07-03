"use client"

/**
 * FilterBar — horizontal pill-button group for filtering a list by tag.
 *
 * Renders an "All" button followed by one button per unique tag.
 * The active tag receives a solid primary background; inactive tags use
 * the glass card style.
 */

import React from "react"
import { cn } from "@/lib/utils"

interface FilterBarProps {
  /** Full list of available filter tags */
  tags: string[]
  /** Currently active tag — use "All" to represent the unfiltered view */
  activeTag: string
  /** Callback when the user selects a different tag */
  onChange: (tag: string) => void
  className?: string
}

export default function FilterBar({
  tags,
  activeTag,
  onChange,
  className,
}: FilterBarProps) {
  const allTags = ["All", ...tags]

  return (
    <div
      role="group"
      aria-label="Filter projects"
      className={cn("flex flex-wrap gap-2", className)}
    >
      {allTags.map((tag) => {
        const isActive = tag === activeTag

        return (
          <button
            key={tag}
            type="button"
            onClick={() => onChange(tag)}
            aria-pressed={isActive}
            className={cn(
              "px-4 py-2 text-xs rounded-full transition-all duration-[250ms] ease-out",
              "font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark",
              isActive
                ? "bg-primary text-white shadow-glow-primary"
                : [
                    "glass text-text-muted",
                    "hover:border-primary/40 hover:text-white",
                  ].join(" ")
            )}
          >
            {tag}
          </button>
        )
      })}
    </div>
  )
}
