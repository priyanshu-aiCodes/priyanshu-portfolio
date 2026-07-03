/**
 * app/api/github/route.ts
 *
 * Server-side proxy for the GitHub REST API.
 * Fetches profile + selected repos in one request, caches for 1 hour.
 *
 * To change the GitHub username, edit siteConfig.githubUsername in
 * lib/constants.ts — this route reads it from there automatically.
 */

import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/constants";

// Repos to feature — matches by name (case-insensitive substring)
const FEATURED_NAMES = [
  "Galaxy-Rescue-Shooter",
  "AI-Study-Buddy",
  "Pro-AI-ChatBot",
];

// Repo to show as "Coming Soon" even if not public yet
const COMING_SOON_NAMES = ["JEE-Study-Tracker"];

export const revalidate = 3600; // ISR: re-fetch at most once per hour

export async function GET() {
  const username = siteConfig.githubUsername;
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  // Optionally add a personal access token via env var to raise rate limit
  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    // Fetch profile and repos in parallel
    const [profileRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers,
        next: { revalidate: 3600 },
      }),
      fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
        { headers, next: { revalidate: 3600 } }
      ),
    ]);

    // Handle rate-limit or auth errors gracefully
    if (profileRes.status === 403 || profileRes.status === 429) {
      return NextResponse.json(
        { error: "rate_limited" },
        { status: 429, headers: { "Cache-Control": "public, max-age=300" } }
      );
    }
    if (!profileRes.ok || !reposRes.ok) {
      return NextResponse.json(
        { error: "fetch_failed" },
        { status: 502 }
      );
    }

    const profile = await profileRes.json();
    const allRepos: GitHubRepo[] = await reposRes.json();

    // Filter to only featured repos (by name, case-insensitive)
    const featured = FEATURED_NAMES.map((name) => {
      const repo = allRepos.find(
        (r) => r.name.toLowerCase() === name.toLowerCase()
      );
      return repo ?? null; // null = not yet public
    });

    return NextResponse.json(
      {
        profile: {
          login: profile.login,
          name: profile.name,
          avatar_url: profile.avatar_url,
          html_url: profile.html_url,
          public_repos: profile.public_repos,
          followers: profile.followers,
          following: profile.following,
          bio: profile.bio,
        },
        featured,
        comingSoonNames: COMING_SOON_NAMES,
      },
      {
        headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300" },
      }
    );
  } catch {
    return NextResponse.json({ error: "network_error" }, { status: 503 });
  }
}

// Shared type used by both route and client component
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics: string[];
}
