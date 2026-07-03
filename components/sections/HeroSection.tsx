"use client";

/**
 * HeroSection — premium two-column hero.
 *
 * Left  : availability pill → giant gradient name → TypewriterText →
 *         tagline → magnetic CTA buttons → social icons
 * Right : animated avatar with rotating ring + orbiting tech icons
 * BG    : AmbientBlobs (rendered in layout) + ParticleBackground (opt-in)
 * Bottom: animated chevron scroll indicator
 */

import React, { useRef, useEffect, useState, useCallback, memo } from "react";
import dynamic from "next/dynamic";
import { motion, useMotionValue, useSpring, useReducedMotion, AnimatePresence } from "framer-motion";
import { FiDownload, FiArrowRight, FiChevronDown, FiX } from "react-icons/fi";
import { SiReact, SiPython, SiTypescript, SiNextdotjs } from "react-icons/si";

import { siteConfig, SECTION_IDS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import TypewriterText from "@/components/ui/TypewriterText";
import SocialLinks from "@/components/ui/SocialLinks";
import Tooltip from "@/components/ui/Tooltip";

const ParticleBackground = dynamic(
  () => import("@/components/effects/ParticleBackground"),
  { ssr: false }
);

// ─── Floating tech icon positions (around avatar) ────────────────────────────
// Only 2 icons on screen at once reduces simultaneous infinite animations from 4 → 2

const FLOATING_ICONS = [
  { Icon: SiReact,      color: "#61DAFB", label: "React",      top: "10%",  left: "-18%",  delay: 0   },
  { Icon: SiPython,     color: "#3776AB", label: "Python",     top: "65%",  left: "-15%",  delay: 1.2 },
  { Icon: SiTypescript, color: "#3178C6", label: "TypeScript", top: "8%",   right: "-18%", delay: 2.4 },
  { Icon: SiNextdotjs,  color: "#FFFFFF", label: "Next.js",    top: "65%",  right: "-15%", delay: 0.8 },
] as const;

// ─── Magnetic button hook ─────────────────────────────────────────────────────

function useMagnetic(strength = 0.35) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 20 });
  const sy = useSpring(y, { stiffness: 150, damping: 20 });

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      x.set((e.clientX - cx) * strength);
      y.set((e.clientY - cy) * strength);
    },
    [x, y, strength]
  );

  const onMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);
    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [onMouseMove, onMouseLeave]);

  return { ref, sx, sy };
}

// ─── Avatar component ─────────────────────────────────────────────────────────

const Avatar = memo(function Avatar({ reduced, onClick }: { reduced: boolean; onClick: () => void }) {
  return (
    <div className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80">
      {/* Outer slow-rotating decorative ring — slower = cheaper */}
      <motion.div
        className="absolute inset-0 rounded-full border border-primary/25"
        style={{ borderStyle: "dashed", willChange: "transform" }}
        animate={reduced ? {} : { rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      {/* Avatar image — clickable to open lightbox */}
      <button
        type="button"
        onClick={onClick}
        aria-label="View full profile photo"
        className={cn(
          "relative z-10 w-52 h-52 md:w-64 md:h-64 rounded-2xl overflow-hidden",
          "border-2 border-primary/40",
          "shadow-glow-primary cursor-pointer",
          "transition-transform duration-300 hover:scale-105",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/profile.jpg/publicprofile.jpg.png"
          alt="Priyanshu Sharma profile photo"
          className="w-full h-full object-cover"
          width={256}
          height={256}
          loading="eager"
        />
      </button>

      {/* Floating tech icons — use CSS float animation instead of Framer Motion for perf */}
      {FLOATING_ICONS.map(({ Icon, color, label, delay, ...pos }) => (
        <div
          key={label}
          className={cn(
            "absolute z-20 flex items-center justify-center",
            "w-11 h-11 rounded-xl glass border border-white/10",
            "shadow-card",
            !reduced && "animate-float"
          )}
          style={{
            ...pos,
            animationDelay: `${delay}s`,
            willChange: reduced ? undefined : "transform",
          }}
          aria-hidden="true"
        >
          <Icon size={20} color={color} />
        </div>
      ))}
    </div>
  );
});

// ─── Photo Lightbox ────────────────────────────────────────────────────────────

function PhotoLightbox({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Profile photo lightbox"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-bg-dark/90 backdrop-blur-[4px]" aria-hidden="true" />

      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close photo"
        className={cn(
          "absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center",
          "rounded-xl glass border border-white/10 text-text-muted",
          "hover:text-white hover:border-primary/40 transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        )}
      >
        <FiX size={18} aria-hidden="true" />
      </button>

      {/* Photo */}
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 rounded-2xl overflow-hidden border-2 border-primary/40 shadow-glow-primary"
        style={{ maxWidth: "min(90vw, 480px)", maxHeight: "80vh" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/profile.jpg/publicprofile.jpg.png"
          alt="Priyanshu Sharma"
          className="block w-full h-full object-cover"
          style={{ maxHeight: "80vh" }}
        />
      </motion.div>
    </motion.div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

const ROLES = [
  "Class 12 Student",
  "JEE Aspirant",
  "Python Developer",
  "AI Enthusiast",
];

export default function HeroSection() {
  const reduced = useReducedMotion() ?? false;
  const primaryBtn = useMagnetic();
  const outlineBtn = useMagnetic();
  const [isMounted, setIsMounted] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const openLightbox = useCallback(() => setLightboxOpen(true), []);
  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const scrollToProjects = () => {
    document
      .getElementById(SECTION_IDS.projects)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollDown = () => {
    document
      .getElementById(SECTION_IDS.about)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Staggered entrance variants — skipped when reduced motion is active
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: reduced ? 0 : 0.12 } },
  };

  const item = {
    hidden: reduced ? {} : { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] },
    },
  };

  return (
    <section
      id={SECTION_IDS.hero}
      aria-label="Hero"
      className="relative min-h-screen flex items-center overflow-hidden px-4 md:px-8"
    >
      {/* Optional particle canvas — reduced count for performance */}
      {isMounted && siteConfig.particlesEnabled && (
        <ParticleBackground particleCount={40} connectionDistance={120} opacity={0.15} />
      )}

      {/* ── Content grid ─────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* ── Left: text content ────────────────────────────────────────── */}
          <motion.div
            className="flex flex-col gap-6 items-start"
            variants={container}
            initial={reduced ? false : "hidden"}
            animate="visible"
          >
            {/* Availability pill */}
            <motion.div variants={item}>
              <span className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-xs font-mono text-text-muted border border-white/10">
                <span
                  className="w-2 h-2 rounded-full bg-secondary animate-pulse-dot"
                  aria-hidden="true"
                />
                Available for internships, hackathons &amp; collaboration →
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              variants={item}
              className="font-display font-bold gradient-text leading-none tracking-tight"
              style={{
                fontSize: "clamp(2.75rem, 7vw, 5.5rem)",
                letterSpacing: "-0.03em",
              }}
            >
              {siteConfig.ownerName}
            </motion.h1>

            {/* Typewriter roles */}
            <motion.div variants={item} className="h-8">
              <TypewriterText
                phrases={ROLES}
                className="text-primary text-lg md:text-xl font-mono"
              />
            </motion.div>

            {/* Tagline */}
            <motion.p
              variants={item}
              className="text-text-muted font-body text-md leading-relaxed max-w-lg"
            >
              I&apos;m a Class 12 student preparing for JEE while building
              real-world programming and AI projects. I enjoy learning new
              technologies, solving problems, and creating useful software. My
              goal is to become a software engineer and contribute to impactful
              AI products.
            </motion.p>

            {/* CTA buttons */}
            <motion.div variants={item} className="flex flex-wrap gap-3 mt-2">
              {/* Primary — magnetic */}
              <motion.div ref={primaryBtn.ref} style={{ x: primaryBtn.sx, y: primaryBtn.sy }}>
                <button
                  type="button"
                  onClick={scrollToProjects}
                  data-cursor="hover"
                  className={cn(
                    "inline-flex items-center gap-2 px-7 py-3.5 rounded-xl",
                    "bg-primary text-white text-sm font-body font-medium",
                    "hover:shadow-glow-primary hover:brightness-110 hover:scale-[1.02]",
                    "active:scale-[0.98] transition-all duration-[250ms] ease-out",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    "min-h-[44px]"
                  )}
                >
                  View Projects
                  <FiArrowRight size={16} aria-hidden="true" />
                </button>
              </motion.div>

              {/* Outline — magnetic, disabled when resume unavailable */}
              <motion.div ref={outlineBtn.ref} style={{ x: outlineBtn.sx, y: outlineBtn.sy }}>
                {siteConfig.resumeAvailable ? (
                  <a
                    href={siteConfig.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="hover"
                    className={cn(
                      "inline-flex items-center gap-2 px-7 py-3.5 rounded-xl",
                      "border border-primary/50 text-primary text-sm font-body font-medium",
                      "hover:bg-primary/10 hover:border-primary",
                      "transition-all duration-[250ms] ease-out",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      "min-h-[44px]"
                    )}
                  >
                    <FiDownload size={16} aria-hidden="true" />
                    Download Resume
                  </a>
                ) : (
                  <Tooltip content="Resume coming soon">
                    <button
                      type="button"
                      disabled
                      aria-disabled="true"
                      className={cn(
                        "inline-flex items-center gap-2 px-7 py-3.5 rounded-xl",
                        "border border-primary/30 text-primary/50 text-sm font-body font-medium",
                        "cursor-not-allowed opacity-50 min-h-[44px]"
                      )}
                    >
                      <FiDownload size={16} aria-hidden="true" />
                      Download Resume
                    </button>
                  </Tooltip>
                )}
              </motion.div>
            </motion.div>

            {/* Social links */}
            <motion.div variants={item}>
              <SocialLinks />
            </motion.div>
          </motion.div>

          {/* ── Right: avatar ─────────────────────────────────────────────── */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={reduced ? false : { opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] }}
          >
            <Avatar reduced={reduced} onClick={openLightbox} />
          </motion.div>
        </div>
      </div>

      {/* ── Scroll indicator — CSS animation avoids Framer Motion overhead ── */}
      <button
        type="button"
        onClick={scrollDown}
        aria-label="Scroll to About section"
        className={cn(
          "absolute bottom-10 left-1/2 -translate-x-1/2 z-10",
          "flex flex-col items-center gap-1 text-text-muted",
          "hover:text-primary transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm",
          !reduced && "animate-bounce-slow"
        )}
      >
        <span className="text-xs font-mono tracking-widest uppercase">scroll</span>
        <FiChevronDown size={20} aria-hidden="true" />
      </button>

      {/* ── Photo lightbox ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxOpen && <PhotoLightbox onClose={closeLightbox} />}
      </AnimatePresence>
    </section>
  );
}
