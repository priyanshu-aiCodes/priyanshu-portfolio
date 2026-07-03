"use client"

/**
 * Tooltip — simple accessible tooltip that appears above its trigger on
 * hover or keyboard focus.
 *
 * Uses the aria-describedby pattern: the tooltip content is rendered in a
 * visually-positioned span that is associated with the trigger element.
 * Show / hide is managed with useState on pointer and focus events.
 */

import React, { useState, useId } from "react"
import { cn } from "@/lib/utils"

interface TooltipProps {
  /** Text content shown in the tooltip */
  content: string
  children: React.ReactNode
  className?: string
}

export default function Tooltip({ content, children, className }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const tooltipId = useId()

  const show = () => setVisible(true)
  const hide = () => setVisible(false)

  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {/* Tooltip bubble */}
      <span
        id={tooltipId}
        role="tooltip"
        className={cn(
          // Positioning
          "absolute bottom-full left-1/2 -translate-x-1/2 mb-2",
          "whitespace-nowrap pointer-events-none",
          // Visual
          "glass py-1 px-2 text-xs text-text-primary-dark rounded-md z-50",
          // Transition
          "transition-all duration-150 ease-out",
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-1 select-none"
        )}
        aria-hidden={!visible}
      >
        {content}
        {/* Tiny arrow pointing down */}
        <span
          aria-hidden="true"
          className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white/10"
        />
      </span>

      {/* Trigger — clone child and inject aria-describedby */}
      {React.isValidElement(children)
        ? React.cloneElement(
            children as React.ReactElement<{ "aria-describedby"?: string }>,
            { "aria-describedby": visible ? tooltipId : undefined }
          )
        : children}
    </span>
  )
}
