/**
 * data/projects.ts — Real projects by Priyanshu Sharma
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProjectCategory = "All" | "Web Dev" | "AI/ML" | "Tools" | "Game";

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  category: ProjectCategory;
  coverImage?: string;
  screenshots?: string[];
  githubUrl: string;
  liveUrl?: string;
  featured?: boolean;
  architectureOverview?: string;
  challenges?: string;
  comingSoon?: boolean;
}

// ─── Data ────────────────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    id: "galaxy-rescue-shooter",
    title: "Galaxy Rescue Shooter",
    description:
      "A 2D space shooter game built using Python and Pygame with enemies, power-ups, and rescue missions.",
    longDescription:
      "Galaxy Rescue Shooter is a 2D arcade-style space shooter built with Python and Pygame. The player pilots a spacecraft, fights waves of enemy ships, collects power-ups, and completes rescue missions. The game features sprite-based collision detection and a game loop built from scratch.",
    tags: ["Python", "Pygame"],
    category: "Game",
    githubUrl: "https://github.com/priyanshu-aiCodes/Galaxy-Rescue-Shooter",
    liveUrl: "https://priyanshu-aicodes.github.io/Galaxy-Rescue-Shooter/",
    featured: true,
  },
  {
    id: "ai-study-buddy",
    title: "AI Study Buddy",
    description:
      "An AI chatbot that helps students solve questions and learn concepts using Python and a simple web interface.",
    longDescription:
      "AI Study Buddy is a chatbot built to help students get answers to their questions and understand concepts. It uses Python for the AI logic and a simple HTML, CSS, and JavaScript frontend. Students can type in a question and receive a helpful response to guide their learning.",
    tags: ["Python", "AI", "HTML", "CSS", "JavaScript"],
    category: "AI/ML",
    githubUrl: "https://github.com/priyanshu-aiCodes/AI-Study-Buddy",
    featured: true,
  },
  {
    id: "bluetooth-rc-car",
    title: "Bluetooth RC Car",
    description:
      "An Arduino-based Bluetooth-controlled RC car with motor control and custom hardware.",
    longDescription:
      "A hardware project where I built a remote-controlled car using an Arduino microcontroller and a Bluetooth module. The car receives movement commands from a smartphone app and drives motors through an L298N motor driver. The firmware is written in C++ using the Arduino framework.",
    tags: ["Arduino", "C++", "Bluetooth"],
    category: "Tools",
    githubUrl: "https://github.com/priyanshu-aiCodes/Bluetooth-RC-Car",
    featured: true,
  },
  {
    id: "jee-study-tracker",
    title: "JEE Study Tracker",
    description:
      "A study tracker to log JEE preparation progress — coming soon.",
    longDescription:
      "JEE Study Tracker is a planned project to help track study sessions, chapter progress, and revision schedules for JEE preparation. Currently in development.",
    tags: ["Coming Soon"],
    category: "Web Dev",
    githubUrl: "https://github.com/priyanshu-aiCodes",
    featured: false,
    comingSoon: true,
  },
];
