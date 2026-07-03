"use client";

/**
 * ContactSection — Contact info + form (integration coming soon).
 *
 * Shows a personal intro card, email copy, and social links on the left.
 * The form is fully rendered with all fields but submission is disabled
 * until a form backend (e.g. Formspree or EmailJS) is configured.
 */

import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSend, FiGithub, FiLinkedin, FiMail,
  FiCopy, FiCheck, FiAlertCircle, FiInfo,
} from "react-icons/fi";

import { SECTION_IDS, siteConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";
import SectionHeading from "@/components/ui/SectionHeading";

// ─── Validation schema ────────────────────────────────────────────────────────

const schema = z.object({
  name:    z.string().min(1, "Name is required").max(100, "Max 100 characters"),
  email:   z.string().min(1, "Email is required").email("Enter a valid email address"),
  subject: z.string().min(1, "Subject is required").max(150, "Max 150 characters"),
  message: z.string().min(20, "Message must be at least 20 characters").max(1000, "Max 1000 characters"),
});

type FormData = z.infer<typeof schema>;

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({ id, label, error, children }: {
  id: string; label: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-mono text-text-muted/80">{label}</label>
      {children}
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key={error}
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="text-error text-xs font-mono flex items-center gap-1"
          >
            <FiAlertCircle size={11} aria-hidden="true" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputClass = cn(
  "w-full px-4 py-3 rounded-xl text-sm font-body text-white",
  "bg-white/5 border border-white/10",
  "placeholder:text-text-muted/40",
  "focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/50",
  "transition-colors duration-200"
);

// ─── Social icon map ──────────────────────────────────────────────────────────

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  github:   FiGithub,
  linkedin: FiLinkedin,
  email:    FiMail,
};

// ─── Contact Section ──────────────────────────────────────────────────────────

export default function ContactSection() {
  const [copied, setCopied] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // clipboard unavailable — user can copy manually
    }
  }, []);

  // Form submit is disabled pending backend setup
  const onSubmit = useCallback((_data: FormData) => {
    void _data; // backend not yet connected — form integration coming soon
  }, []);

  return (
    <section
      id={SECTION_IDS.contact}
      aria-label="Contact"
      className="relative py-24 px-4 md:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Get In Touch"
          subtitle="Have a project idea, or just want to connect? Reach out."
          align="center"
          className="mb-12"
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">

          {/* ── Left: contact info ────────────────────────────────────────── */}
          <motion.div
            className="lg:col-span-2 flex flex-col gap-5"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
          >
            {/* Identity card */}
            <div className="glass rounded-2xl p-5 border border-white/8">
              <p className="font-display font-semibold text-white text-base mb-0.5">
                {siteConfig.ownerName}
              </p>
              <p className="text-primary text-xs font-mono mb-3">Student Developer</p>
              <p className="text-text-muted font-body text-sm leading-relaxed">
                Currently focused on JEE preparation, AI, and full-stack development.
                Open to internships and collaborations after JEE.
              </p>
            </div>

            {/* Email copy */}
            <div className="glass rounded-2xl p-4 border border-white/8">
              <p className="text-xs font-mono text-text-muted/60 mb-2">Email</p>
              <div className="flex items-center gap-2">
                <span className="text-white text-sm font-mono flex-1 truncate">
                  {siteConfig.email}
                </span>
                <button
                  type="button"
                  onClick={copyEmail}
                  aria-label="Copy email address"
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono",
                    "border border-white/10 transition-all duration-200 min-h-[36px]",
                    copied
                      ? "border-success/40 text-success bg-success/10"
                      : "text-text-muted hover:text-white hover:border-white/20"
                  )}
                >
                  {copied
                    ? <><FiCheck size={12} aria-hidden="true" /> Copied</>
                    : <><FiCopy size={12} aria-hidden="true" /> Copy</>}
                </button>
              </div>
            </div>

            {/* Social links */}
            <div className="glass rounded-2xl p-4 border border-white/8">
              <p className="text-xs font-mono text-text-muted/60 mb-3">Find me on</p>
              <div className="flex flex-col gap-2">
                {siteConfig.socialLinks.map((link) => {
                  const Icon = SOCIAL_ICONS[link.platform] ?? FiMail;
                  const isEmail = link.platform === "email";
                  return (
                    <a
                      key={link.platform}
                      href={link.url}
                      aria-label={link.label}
                      {...(!isEmail && { target: "_blank", rel: "noopener noreferrer" })}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl",
                        "border border-white/8 text-text-muted text-sm font-body",
                        "hover:border-primary/30 hover:text-white hover:bg-white/3",
                        "transition-all duration-200 min-h-[44px]"
                      )}
                    >
                      <Icon size={15} className="text-primary/70 flex-shrink-0" aria-hidden="true" />
                      <span className="capitalize">{link.platform}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* ── Right: form ───────────────────────────────────────────────── */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              aria-label="Contact form"
              className="glass rounded-2xl p-6 border border-white/8 flex flex-col gap-5"
            >
              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field id="name" label="Your Name *" error={errors.name?.message}>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your name"
                    className={cn(inputClass, errors.name && "border-error/50 focus:ring-error/40")}
                    {...register("name")}
                  />
                </Field>
                <Field id="email" label="Email Address *" error={errors.email?.message}>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="your@email.com"
                    className={cn(inputClass, errors.email && "border-error/50 focus:ring-error/40")}
                    {...register("email")}
                  />
                </Field>
              </div>

              {/* Subject */}
              <Field id="subject" label="Subject *" error={errors.subject?.message}>
                <input
                  id="subject"
                  type="text"
                  placeholder="What's this about?"
                  className={cn(inputClass, errors.subject && "border-error/50 focus:ring-error/40")}
                  {...register("subject")}
                />
              </Field>

              {/* Message */}
              <Field id="message" label="Message *" error={errors.message?.message}>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Write your message here..."
                  className={cn(inputClass, "resize-none", errors.message && "border-error/50 focus:ring-error/40")}
                  {...register("message")}
                />
              </Field>

              <div className={cn(
                "flex items-start gap-2.5 px-4 py-3 rounded-xl",
                "bg-primary/5 border border-primary/20 text-xs font-mono text-text-muted"
              )}>
                <FiInfo size={13} className="text-primary/60 flex-shrink-0 mt-0.5" aria-hidden="true" />
                Form integration coming soon. In the meantime, reach me directly at{" "}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-primary hover:underline ml-1"
                >
                  {siteConfig.email}
                </a>
              </div>

              {/* Submit (disabled until backend is wired) */}
              <button
                type="button"
                disabled
                aria-disabled="true"
                className={cn(
                  "flex items-center justify-center gap-2",
                  "px-6 py-3.5 rounded-xl text-sm font-mono text-white/50",
                  "bg-primary/30 border border-primary/20",
                  "cursor-not-allowed min-h-[44px]"
                )}
              >
                <FiSend size={14} aria-hidden="true" />
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
