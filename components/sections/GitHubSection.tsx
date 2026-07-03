"use client";

/**
 * GitHubSection — Live GitHub profile and repositories via GitHub API.
 *
 * Fetches user profile + repos from the internal `/api/github` route handler
 * (which talks to GitHub's API server-side, caching for 1 hour).
 *
 * If the API is down or rate-limited, shows a clean fallback.
 * The repos displayed and the GitHub username are both controlled by
 * siteConfig.githubUsername + the FEATURED_NAMES list in /app/api/github/route.ts
 */

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiGithub, FiExternalLink, FiStar, FiGitBranch, FiUsers, FiAlertCircle,
} from "react-icons/fi";

import { SECTION_IDS, siteConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";
import SectionHeading from "@/components/ui/SectionHeading";
import type { GitHubRepo } from "@/app/api/github/route";

// Language colors (subset of GitHub's official palette)
const LANG_COLORS: Record<string, string> = {
  Python: "#3776AB",
  JavaScript: "#F7DF1E",
  TypeScript: "#3178C6",
  HTML: "#E34F26",
  CSS: "#1572B6",
  Java: "#B07219",
  "C++": "#F34B7D",
  Go: "#00ADD8",
  Rust: "#DEA584",
  default: "#6C63FF",
};

// ─── Profile summary card ─────────────────────────────────────────────────────

interface ProfileData {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  bio: string | null;
}

function ProfileCard({ profile }: { profile: ProfileData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
      className={cn(
        "glass rounded-2xl p-6 border border-white/8 flex flex-col items-center gap-4",
        "hover:border-primary/40 transition-colors duration-250"
      )}
    >
      {/* Avatar */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={profile.avatar_url}
        alt={`${profile.login} avatar`}
        className="w-24 h-24 rounded-full border-2 border-primary/30"
        loading="lazy"
        decoding="async"
        width={96}
        height={96}
      />

      {/* Name + username */}
      <div className="text-center">
        {profile.name && (
          <h3 className="font-display font-semibold text-white text-base">
            {profile.name}
          </h3>
        )}
        <p className="text-text-muted text-sm font-mono">@{profile.login}</p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs font-mono text-text-muted">
        <span className="flex items-center gap-1">
          <FiGithub size={12} className="text-primary/70" aria-hidden="true" />
          {profile.public_repos} repos
        </span>
        <span className="flex items-center gap-1">
          <FiUsers size={12} className="text-secondary/70" aria-hidden="true" />
          {profile.followers} followers
        </span>
      </div>

      {/* Bio */}
      {profile.bio && (
        <p className="text-text-muted text-xs font-body leading-relaxed text-center max-w-xs">
          {profile.bio}
        </p>
      )}

      {/* View on GitHub */}
      <a
        href={profile.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono",
          "border border-primary/40 text-primary",
          "hover:bg-primary/10 hover:border-primary",
          "transition-all duration-200"
        )}
      >
        <FiGithub size={12} aria-hidden="true" />
        View Profile
      </a>
    </motion.div>
  );
}

// ─── Repository card ──────────────────────────────────────────────────────────

function RepoCard({
  repo,
  comingSoon,
  index,
}: {
  repo: GitHubRepo | null;
  comingSoon?: boolean;
  index: number;
}) {
  if (!repo && !comingSoon) return null;

  const langColor = repo?.language ? (LANG_COLORS[repo.language] ?? LANG_COLORS.default) : LANG_COLORS.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.35,
        delay: Math.min(index * 0.07, 0.28),
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      }}
      className={cn(
        "glass rounded-xl p-5 border border-white/8 flex flex-col gap-4",
        "hover:border-primary/40 hover:shadow-card-hover",
        "transition-all duration-250 ease-out"
      )}
    >
      {/* Repo name */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-mono font-semibold text-white text-sm leading-snug break-all">
          {repo?.name ?? "Coming Soon"}
        </h3>
        {comingSoon && (
          <span className="text-[10px] font-mono text-yellow-400/70 px-2 py-0.5 rounded-full border border-yellow-400/20 bg-yellow-400/10 flex-shrink-0">
            Soon
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-text-muted font-body text-xs leading-relaxed flex-1 min-h-[2.5rem]">
        {repo?.description ?? "This repository is coming soon."}
      </p>

      {/* Stats row */}
      <div className="flex items-center gap-3 text-xs font-mono text-text-muted">
        {repo?.language && (
          <span className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: langColor }}
              aria-hidden="true"
            />
            {repo.language}
          </span>
        )}
        {repo && (
          <>
            <span className="flex items-center gap-1">
              <FiStar size={11} aria-hidden="true" />
              {repo.stargazers_count}
            </span>
            <span className="flex items-center gap-1">
              <FiGitBranch size={11} aria-hidden="true" />
              {repo.forks_count}
            </span>
          </>
        )}
      </div>

      {/* Actions */}
      {repo && (
        <div className="flex items-center gap-2 pt-1 border-t border-white/5">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${repo.name} on GitHub`}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono",
              "border border-white/10 text-text-muted",
              "hover:border-primary/50 hover:text-primary",
              "transition-all duration-200 min-h-[36px]"
            )}
          >
            <FiGithub size={12} aria-hidden="true" />
            GitHub
          </a>

          {repo.homepage && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${repo.name} demo`}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono",
                "border border-secondary/30 text-secondary",
                "hover:bg-secondary/10 hover:border-secondary/60",
                "transition-all duration-200 min-h-[36px]"
              )}
            >
              <FiExternalLink size={12} aria-hidden="true" />
              Demo
            </a>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ─── Fallback card ───────────────────────────────────────────────────────────

function FallbackMessage({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass rounded-xl p-8 border border-white/8 flex flex-col items-center gap-3 text-center max-w-md mx-auto"
    >
      <FiAlertCircle size={32} className="text-text-muted/30" aria-hidden="true" />
      <p className="text-text-muted text-sm font-body leading-relaxed">{message}</p>
      <a
        href={`https://github.com/${siteConfig.githubUsername}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono",
          "border border-primary/40 text-primary",
          "hover:bg-primary/10 hover:border-primary",
          "transition-all duration-200"
        )}
      >
        <FiGithub size={13} aria-hidden="true" />
        View Profile on GitHub
      </a>
    </motion.div>
  );
}

// ─── GitHub Section ───────────────────────────────────────────────────────────

export default function GitHubSection() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [repos, setRepos] = useState<(GitHubRepo | null)[]>([]);
  const [comingSoon, setComingSoon] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/github")
      .then((res) => {
        if (!res.ok) {
          if (res.status === 429) throw new Error("rate_limited");
          throw new Error("fetch_failed");
        }
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        setProfile(data.profile);
        setRepos(data.featured);
        setComingSoon(data.comingSoonNames ?? []);
        setError(null);
      })
      .catch((err: Error) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      id={SECTION_IDS.github}
      aria-label="GitHub"
      className="relative py-24 px-4 md:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="GitHub"
          subtitle={`Open-source work and projects by @${siteConfig.githubUsername}`}
          align="center"
          className="mb-12"
        />

        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <FallbackMessage
            message={
              error === "rate_limited"
                ? "GitHub API rate limit reached. Please try again later or view the profile directly."
                : "Unable to load GitHub data right now. Please check back soon."
            }
          />
        )}

        {!loading && !error && profile && (
          <>
            {/* ── Profile summary ─────────────────────────────────────────── */}
            <div className="mb-10 max-w-sm mx-auto">
              <ProfileCard profile={profile} />
            </div>

            {/* ── Featured repositories ───────────────────────────────────── */}
            <div>
              <h3 className="font-display text-lg font-semibold text-white/80 text-center mb-6">
                Featured Repositories
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {repos.map((repo, i) => (
                  <RepoCard
                    key={repo?.id ?? `coming-soon-${i}`}
                    repo={repo}
                    comingSoon={!repo && comingSoon.some((name) => name.toLowerCase().includes("jee"))}
                    index={i}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
