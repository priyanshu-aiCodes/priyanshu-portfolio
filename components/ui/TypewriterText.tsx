"use client"

/**
 * TypewriterText — cycles through an array of phrases with a typing animation.
 *
 * Features:
 * - Configurable type / delete / pause speeds
 * - Blinking cursor rendered after the current text
 * - Respects prefers-reduced-motion: skips animation, shows first phrase only
 */

import React, { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface TypewriterTextProps {
  /** Array of strings to cycle through */
  phrases: string[]
  /** Milliseconds between each typed character — default 80 */
  typeSpeedMs?: number
  /** Milliseconds between each deleted character — default 50 */
  deleteSpeedMs?: number
  /** Milliseconds to pause on a completed phrase — default 2500 */
  pauseMs?: number
  className?: string
}

export default function TypewriterText({
  phrases,
  typeSpeedMs = 80,
  deleteSpeedMs = 50,
  pauseMs = 2500,
  className,
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState("")
  const [cursorVisible, setCursorVisible] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Refs so the effect closure always reads current values
  const phraseIndexRef = useRef(0)
  const charIndexRef = useRef(0)
  const isDeletingRef = useRef(false)

  // ── Detect prefers-reduced-motion once on mount ──────────────────────────
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  // ── Typewriter loop ───────────────────────────────────────────────────────
  useEffect(() => {
    if (reducedMotion || phrases.length === 0) return

    let timeoutId: ReturnType<typeof setTimeout>

    const tick = () => {
      const currentPhrase = phrases[phraseIndexRef.current]
      const isDeleting = isDeletingRef.current

      if (!isDeleting) {
        // Still typing
        if (charIndexRef.current < currentPhrase.length) {
          charIndexRef.current += 1
          setDisplayText(currentPhrase.slice(0, charIndexRef.current))
          timeoutId = setTimeout(tick, typeSpeedMs)
        } else {
          // Pause at end of phrase, then start deleting
          isDeletingRef.current = true
          timeoutId = setTimeout(tick, pauseMs)
        }
      } else {
        // Deleting
        if (charIndexRef.current > 0) {
          charIndexRef.current -= 1
          setDisplayText(currentPhrase.slice(0, charIndexRef.current))
          timeoutId = setTimeout(tick, deleteSpeedMs)
        } else {
          // Advance to next phrase
          isDeletingRef.current = false
          phraseIndexRef.current = (phraseIndexRef.current + 1) % phrases.length
          timeoutId = setTimeout(tick, typeSpeedMs)
        }
      }
    }

    timeoutId = setTimeout(tick, typeSpeedMs)
    return () => clearTimeout(timeoutId)
  }, [reducedMotion, phrases, typeSpeedMs, deleteSpeedMs, pauseMs])

  // ── Cursor blink ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (reducedMotion) return
    const id = setInterval(() => setCursorVisible((v) => !v), 500)
    return () => clearInterval(id)
  }, [reducedMotion])

  // ── Reduced-motion fallback ───────────────────────────────────────────────
  if (reducedMotion) {
    return (
      <span className={cn("font-mono", className)} aria-live="off">
        {phrases[0] ?? ""}
      </span>
    )
  }

  return (
    <span
      className={cn("font-mono", className)}
      aria-live="polite"
      aria-atomic="true"
    >
      {displayText}
      <span
        aria-hidden="true"
        style={{ opacity: cursorVisible ? 1 : 0, transition: "opacity 100ms" }}
        className="text-primary"
      >
        |
      </span>
    </span>
  )
}
