"use client"

/**
 * SocialLinks — renders icon buttons for every entry in siteConfig.socialLinks.
 *
 * Each link is a 44×44 px touch target.  Email links use `mailto:`, all others
 * open in a new tab.  The platform-to-icon mapping lives in this file so the
 * icon bundle is tree-shaken correctly.
 */

import React from "react"
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi"
import { siteConfig } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { SocialPlatform } from "@/lib/constants"

// ─── Props ────────────────────────────────────────────────────────────────────

interface SocialLinksProps {
  className?: string
  /** Icon size in pixels — defaults to 20 */
  iconSize?: number
}

// ─── Icon registry ────────────────────────────────────────────────────────────

const iconMap: Record<SocialPlatform, React.ElementType> = {
  github:   FiGithub,
  linkedin: FiLinkedin,
  email:    FiMail,
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SocialLinks({ className, iconSize = 20 }: SocialLinksProps) {
  return (
    <ul
      className={cn("flex items-center gap-2 list-none p-0 m-0", className)}
      aria-label="Social media links"
    >
      {siteConfig.socialLinks.map((link) => {
        const Icon = iconMap[link.platform]
        const isEmail = link.platform === "email"

        return (
          <li key={link.platform}>
            <a
              href={link.url}
              aria-label={link.label}
              {...(!isEmail && {
                target: "_blank",
                rel: "noopener noreferrer",
              })}
              className={cn(
                // 44×44 touch target
                "flex items-center justify-center w-11 h-11 rounded-lg",
                "text-text-muted",
                "transition-all duration-[250ms] ease-out",
                "hover:text-primary hover:shadow-glow-primary hover:bg-white/5",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark"
              )}
            >
              <Icon size={iconSize} aria-hidden="true" />
            </a>
          </li>
        )
      })}
    </ul>
  )
}
