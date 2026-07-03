"use client"

/**
 * ScrollProgressBar — thin gradient bar fixed to the top of the viewport.
 *
 * Uses framer-motion's `useScroll` hook to read the page scroll progress
 * (0 → 1) and binds it directly to the `scaleX` transform so there is
 * zero JS re-render overhead — framer drives the value natively.
 */

import React from "react"
import { motion, useScroll } from "framer-motion"

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      aria-hidden="true"
      style={{
        scaleX: scrollYProgress,
        transformOrigin: "left",
        background: "linear-gradient(to right, #6C63FF, #00D4AA)",
      }}
      className="fixed top-0 left-0 right-0 h-[3px] w-full z-50 pointer-events-none"
    />
  )
}
