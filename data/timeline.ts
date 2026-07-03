/**
 * data/timeline.ts — Priyanshu Sharma's real learning journey
 *
 * Ordered most-recent-first.
 */

export type TimelineCategory =
  | "education"
  | "project"
  | "achievement"
  | "certification";

export interface TimelineEntry {
  id: string;
  date: string;
  title: string;
  context: string;
  description: string;
  category: TimelineCategory;
  iconName: string;
}

export const timeline: TimelineEntry[] = [
  // ── Future ────────────────────────────────────────────────────────────────
  {
    id: "future-goals",
    date: "Future",
    title: "Goals Ahead",
    context: "What I'm working towards",
    description:
      "Crack JEE and get into a great engineering college. Become a software engineer, build impactful AI products, contribute to open-source, start freelancing, and keep learning and building real-world projects every step of the way.",
    category: "achievement",
    iconName: "Rocket",
  },

  // ── 2026 ──────────────────────────────────────────────────────────────────
  {
    id: "portfolio-2026",
    date: "2026",
    title: "Building My Developer Portfolio",
    context: "Personal Project",
    description:
      "Started building this personal developer portfolio to document my journey, showcase my projects, and establish an online presence as I grow as a developer.",
    category: "project",
    iconName: "Code2",
  },
  {
    id: "hackathons-2026",
    date: "2026",
    title: "AI Bootcamps & Hackathons",
    context: "Events & Learning",
    description:
      "Participated in AI bootcamps and hackathons, engaging with the developer community, learning from peers, and applying skills under real constraints.",
    category: "achievement",
    iconName: "Trophy",
  },
  {
    id: "galaxy-rescue-2026",
    date: "2026",
    title: "Built Galaxy Rescue Shooter",
    context: "Personal Project",
    description:
      "Built a 2D space shooter game in Python using Pygame, complete with enemies, power-ups, and rescue missions — a fun way to deepen Python skills through a real creative project.",
    category: "project",
    iconName: "Gamepad2",
  },
  {
    id: "ai-study-buddy-2026",
    date: "2026",
    title: "Built AI Study Buddy",
    context: "Personal Project",
    description:
      "Created an AI-powered chatbot that helps students solve questions and understand concepts, combining Python, AI tools, and a simple HTML/CSS/JavaScript frontend.",
    category: "project",
    iconName: "BrainCircuit",
  },
  {
    id: "ai-web-2026",
    date: "2026",
    title: "Explored AI & Started Web Development",
    context: "Self-taught",
    description:
      "Began learning HTML, CSS, JavaScript, React, and Next.js. Also explored Artificial Intelligence and Prompt Engineering — understanding how to build with and on top of modern AI tools.",
    category: "education",
    iconName: "Sparkles",
  },

  // ── 2025 ──────────────────────────────────────────────────────────────────
  {
    id: "python-projects-2025",
    date: "2025",
    title: "Built First Python Projects",
    context: "Self-taught",
    description:
      "After learning the fundamentals, started applying Python to real problems — writing scripts, building small tools, and getting comfortable turning ideas into working software.",
    category: "project",
    iconName: "Terminal",
  },
  {
    id: "git-github-2025",
    date: "2025",
    title: "Learned Git & GitHub",
    context: "Self-taught",
    description:
      "Picked up version control with Git and started using GitHub to manage projects and track progress. A foundational step toward working like a real developer.",
    category: "education",
    iconName: "GitBranch",
  },
  {
    id: "python-start-2025",
    date: "2025",
    title: "Started Learning Python",
    context: "Self-taught",
    description:
      "Wrote the first lines of Python code and quickly became fascinated by how much could be built with a few clear instructions. Python opened the door to programming for me.",
    category: "education",
    iconName: "Code2",
  },

  // ── 2024 ──────────────────────────────────────────────────────────────────
  {
    id: "interest-tech-2024",
    date: "2024",
    title: "Developed Interest in Programming & Technology",
    context: "Personal",
    description:
      "Became genuinely curious about how software works and what could be built with code. This curiosity marked the beginning of a serious commitment to learning programming.",
    category: "education",
    iconName: "Lightbulb",
  },
  {
    id: "class-10-2024",
    date: "2024",
    title: "Completed ICSE Class 10 Board Examination",
    context: "School",
    description:
      "Successfully completed the ICSE Class 10 Board Examination and moved into the Science stream, setting the foundation for JEE preparation and a future in engineering.",
    category: "education",
    iconName: "GraduationCap",
  },
];
