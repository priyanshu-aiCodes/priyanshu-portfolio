"use client";

/**
 * ActiveSectionProvider — tracks which section is currently in the viewport.
 *
 * Uses a single IntersectionObserver that watches every element whose `id`
 * appears in SECTION_IDS.  When a section crosses the 20% threshold, it
 * becomes the "active" section and the Nav highlights the matching link.
 *
 * The observer is set up after the first paint so it never runs on the server.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { SECTION_IDS, type SectionId } from "@/lib/constants";

// ─── Context ──────────────────────────────────────────────────────────────────

interface ActiveSectionContextValue {
  /** The id of the section currently intersecting the viewport, or null */
  activeSection: SectionId | null;
}

const ActiveSectionContext = createContext<ActiveSectionContextValue>({
  activeSection: null,
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ActiveSectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);

  useEffect(() => {
    const sectionIds = Object.values(SECTION_IDS) as SectionId[];

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first intersecting entry (most visible)
        const intersecting = entries.find((e) => e.isIntersecting);
        if (intersecting) {
          setActiveSection(intersecting.target.id as SectionId);
        } else {
          // If no entry is intersecting, clear active — but only clear when ALL
          // observed entries are leaving (avoids clearing between sections)
          const allLeaving = entries.every((e) => !e.isIntersecting);
          if (allLeaving && entries.length === sectionIds.length) {
            setActiveSection(null);
          }
        }
      },
      {
        // Trigger when 20% of a section is visible
        threshold: 0.2,
        // Negative top margin so the nav bar doesn't interfere
        rootMargin: "-64px 0px 0px 0px",
      }
    );

    // Observe every section element that exists in the DOM
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <ActiveSectionContext.Provider value={{ activeSection }}>
      {children}
    </ActiveSectionContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useActiveSection(): ActiveSectionContextValue {
  return useContext(ActiveSectionContext);
}
