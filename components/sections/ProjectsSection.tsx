"use client";

/**
 * ProjectsSection — Featured Projects with filter, glassmorphism cards,
 * hover animations, project detail modal, and tech stack badges.
 *
 * Task 17.1: ProjectModal is dynamically imported with ssr:false so its
 * JS is excluded from the initial page bundle and only loaded on demand.
 */

import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { FiGithub, FiExternalLink, FiStar, FiChevronRight } from "react-icons/fi";

import { SECTION_IDS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import SectionHeading from "@/components/ui/SectionHeading";
import Badge from "@/components/ui/Badge";
import { projects, type Project, type ProjectCategory } from "@/data/projects";

// ─── Task 17.1 — Dynamic import: modal JS excluded from initial bundle ────────
const ProjectModal = dynamic(
  () => import("@/components/ui/ProjectModal"),
  { ssr: false }
);

// ─── Filter categories ────────────────────────────────────────────────────────

const CATEGORIES: ProjectCategory[] = ["All", "Web Dev", "AI/ML", "Game", "Tools"];

const CATEGORY_COLORS: Record<ProjectCategory, string> = {
  "All":     "text-white",
  "Web Dev": "text-primary",
  "AI/ML":   "text-secondary",
  "Game":    "text-accent",
  "Tools":   "text-yellow-400",
};

// ─── Project Card ─────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (p: Project) => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3), ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] }}
      className={cn(
        "glass rounded-2xl overflow-hidden flex flex-col group",
        "border border-white/8 hover:border-primary/50",
        "transition-all duration-250 ease-out",
        "hover:shadow-card-hover hover:scale-[1.015]"
      )}
    >
      {/* Cover / placeholder */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-surface-dark to-bg-dark flex-shrink-0">
        {project.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.coverImage}
            alt={`${project.title} cover`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        ) : (
          /* Static gradient placeholder — no Framer infinite animation */
          <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
            <span className="font-display text-4xl font-bold gradient-text relative z-10 select-none">
              {project.title.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}

        {/* Featured badge */}
        {project.featured && !project.comingSoon && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-primary/80 to-secondary/80 text-white text-xs font-mono backdrop-blur-sm">
            <FiStar size={10} aria-hidden="true" />
            Featured
          </div>
        )}

        {/* Coming Soon badge */}
        {project.comingSoon && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-white/60 text-xs font-mono backdrop-blur-sm border border-white/15">
            Coming Soon
          </div>
        )}

        {/* Category chip */}
        <div className="absolute top-3 right-3 px-2 py-0.5 glass rounded-full text-xs font-mono border border-white/15">
          <span className={CATEGORY_COLORS[project.category]}>{project.category}</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        <h3 className="font-display font-semibold text-white text-lg leading-snug">
          {project.title}
        </h3>
        <p className="text-text-muted font-body text-sm leading-relaxed flex-1">
          {project.description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.tags.map((tag) => (
            <Badge key={tag} label={tag} variant="tech" />
          ))}
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex items-center gap-2 px-5 pb-5 mt-auto">
        {project.comingSoon ? (
          <span className="text-xs font-mono text-text-muted/50 italic">
            In development…
          </span>
        ) : (
          <>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} on GitHub`}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono",
                "border border-white/10 text-text-muted",
                "hover:border-primary/50 hover:text-primary",
                "transition-all duration-200 min-h-[36px]"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <FiGithub size={13} aria-hidden="true" />
              GitHub
            </a>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${project.title} live demo`}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono",
                  "border border-secondary/30 text-secondary",
                  "hover:bg-secondary/10 hover:border-secondary/60",
                  "transition-all duration-200 min-h-[36px]"
                )}
                onClick={(e) => e.stopPropagation()}
              >
                <FiExternalLink size={13} aria-hidden="true" />
                Live Demo
              </a>
            )}

            <button
              type="button"
              onClick={() => onOpen(project)}
              aria-label={`View details for ${project.title}`}
              className={cn(
                "ml-auto flex items-center gap-1 text-xs font-mono text-text-muted",
                "hover:text-white transition-colors duration-200 min-h-[36px] px-2"
              )}
            >
              Details
              <FiChevronRight size={13} aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </motion.article>
  );
}

// ─── Projects Section ─────────────────────────────────────────────────────────

export default function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const handleOpen = useCallback((p: Project) => setSelectedProject(p), []);
  const handleClose = useCallback(() => setSelectedProject(null), []);

  // Only show categories that have projects
  const availableCategories = CATEGORIES.filter(
    (c) => c === "All" || projects.some((p) => p.category === c)
  );

  return (
    <>
      <section
        id={SECTION_IDS.projects}
        aria-label="Featured Projects"
        className="relative py-24 px-4 md:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Featured Projects"
            subtitle="Things I've built and projects I'm working on."
            align="center"
            className="mb-12"
          />

          {/* Filter bar */}
          <div
            role="group"
            aria-label="Filter projects by category"
            className="flex flex-wrap gap-2 justify-center mb-10"
          >
            {availableCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
                className={cn(
                  "px-4 py-2 text-xs font-mono rounded-full transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  "min-h-[44px]",
                  activeCategory === cat
                    ? "bg-primary text-white shadow-glow-primary"
                    : "glass text-text-muted border border-white/10 hover:border-primary/40 hover:text-white"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid — no layout prop to avoid expensive Framer layout animations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {filtered.length > 0 ? (
                filtered.map((project, i) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={i}
                    onOpen={handleOpen}
                  />
                ))
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="col-span-full glass rounded-2xl p-10 text-center text-text-muted font-mono text-sm"
                >
                  No projects in this category yet.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Modal portal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={handleClose} />
        )}
      </AnimatePresence>
    </>
  );
}
