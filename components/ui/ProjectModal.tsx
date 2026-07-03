"use client";

/**
 * ProjectModal — Task 17.1
 *
 * Extracted from ProjectsSection so it can be dynamically imported
 * with { ssr: false }, keeping its JS out of the initial page bundle.
 * The modal is only ever needed after a user explicitly clicks "Details".
 */

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FiGithub, FiExternalLink, FiX, FiStar } from "react-icons/fi";

import { cn } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import { type Project, type ProjectCategory } from "@/data/projects";

// ─── Category colour map (duplicated from ProjectsSection to keep this
//     component self-contained and avoid a shared import cycle) ─────────────

const CATEGORY_COLORS: Record<ProjectCategory, string> = {
  "All":     "text-white",
  "Web Dev": "text-primary",
  "AI/ML":   "text-secondary",
  "Game":    "text-accent",
  "Tools":   "text-yellow-400",
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-bg-dark/80 backdrop-blur-[4px]"
        aria-hidden="true"
      />

      {/* Panel */}
      <motion.div
        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto glass rounded-2xl p-6 md:p-8"
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
      >
        {/* Close */}
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-lg text-text-muted hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <FiX size={18} aria-hidden="true" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 mb-5 pr-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {project.featured && (
                <span className="flex items-center gap-1 text-xs font-mono text-primary">
                  <FiStar size={10} aria-hidden="true" /> Featured
                </span>
              )}
              <span className={cn("text-xs font-mono", CATEGORY_COLORS[project.category])}>
                {project.category}
              </span>
            </div>
            <h3 className="font-display font-bold text-2xl gradient-text">
              {project.title}
            </h3>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tags.map((tag) => (
            <Badge key={tag} label={tag} variant="tech" />
          ))}
        </div>

        {/* Long description */}
        <p className="text-text-muted font-body text-sm leading-relaxed mb-5">
          {project.longDescription}
        </p>

        {/* Architecture */}
        {project.architectureOverview && (
          <div className="mb-4">
            <h4 className="text-xs font-mono text-white/60 uppercase tracking-widest mb-2">
              Architecture
            </h4>
            <p className="text-text-muted text-sm font-body leading-relaxed">
              {project.architectureOverview}
            </p>
          </div>
        )}

        {/* Challenges */}
        {project.challenges && (
          <div className="mb-6">
            <h4 className="text-xs font-mono text-white/60 uppercase tracking-widest mb-2">
              Key Challenge
            </h4>
            <p className="text-text-muted text-sm font-body leading-relaxed">
              {project.challenges}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 flex-wrap">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-mono",
              "border border-white/15 text-text-muted hover:text-white hover:border-primary/50",
              "transition-all duration-200 min-h-[44px]"
            )}
          >
            <FiGithub size={15} aria-hidden="true" />
            View on GitHub
          </a>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-mono",
                "bg-secondary/15 border border-secondary/40 text-secondary",
                "hover:bg-secondary/25 transition-all duration-200 min-h-[44px]"
              )}
            >
              <FiExternalLink size={15} aria-hidden="true" />
              Live Demo
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
