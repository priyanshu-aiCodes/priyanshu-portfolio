/**
 * data/skills.ts — Technical skills data
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProficiencyLevel = "Beginner" | "Intermediate" | "Advanced";

export type SkillCategory =
  | "Languages"
  | "Web Development"
  | "AI/ML Tools"
  | "Developer Tools"
  | "Currently Learning";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  /** react-icons/si component name — e.g. "SiReact" */
  iconName: string;
  /** Hex brand colour for hover glow — falls back to primary */
  brandColor?: string;
  proficiency?: ProficiencyLevel;
}

// ─── Data ────────────────────────────────────────────────────────────────────

export const skills: Skill[] = [
  // ── Languages ────────────────────────────────────────────────────────────
  { id: "python", name: "Python", category: "Languages", iconName: "SiPython", brandColor: "#3776AB", proficiency: "Intermediate" },
  { id: "html",   name: "HTML5",  category: "Languages", iconName: "SiHtml5",  brandColor: "#E34F26", proficiency: "Intermediate" },

  // ── Web Development ───────────────────────────────────────────────────────
  { id: "css",    name: "CSS3",    category: "Web Development", iconName: "SiCss3",      brandColor: "#1572B6", proficiency: "Beginner" },
  { id: "js",     name: "JavaScript", category: "Web Development", iconName: "SiJavascript", brandColor: "#F7DF1E", proficiency: "Beginner" },
  { id: "react",  name: "React",   category: "Web Development", iconName: "SiReact",     brandColor: "#61DAFB", proficiency: "Beginner" },
  { id: "nextjs", name: "Next.js", category: "Web Development", iconName: "SiNextdotjs", brandColor: "#FFFFFF", proficiency: "Beginner" },

  // ── Developer Tools ───────────────────────────────────────────────────────
  { id: "git",    name: "Git",     category: "Developer Tools", iconName: "SiGit",              brandColor: "#F05032", proficiency: "Intermediate" },
  { id: "github", name: "GitHub",  category: "Developer Tools", iconName: "SiGithub",           brandColor: "#FFFFFF", proficiency: "Intermediate" },
  { id: "vscode", name: "VS Code", category: "Developer Tools", iconName: "SiVisualstudiocode", brandColor: "#007ACC", proficiency: "Intermediate" },
  { id: "canva",  name: "Canva",   category: "Developer Tools", iconName: "SiCanva",            brandColor: "#00C4CC", proficiency: "Intermediate" },

  // ── AI/ML Tools ───────────────────────────────────────────────────────────
  { id: "chatgpt",  name: "ChatGPT",  category: "AI/ML Tools", iconName: "SiOpenai",  brandColor: "#74AA9C", proficiency: "Intermediate" },
  { id: "kiro-ai",  name: "Kiro AI",  category: "AI/ML Tools", iconName: "SiOpenai",  brandColor: "#6C63FF", proficiency: "Intermediate" },
];
