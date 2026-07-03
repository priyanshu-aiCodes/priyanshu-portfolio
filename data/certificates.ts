/**
 * data/certificates.ts — Real certificates by Priyanshu Sharma
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type CertificateCategory =
  | "Programming"
  | "AI/ML"
  | "Web Dev"
  | "Game Dev"
  | "Other";

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  /** Path to the PDF in /public/certificates/ — for preview + download */
  credentialUrl?: string;
  /** Path to issuer logo under /public/images/ — omit to use Lucide fallback */
  logoUrl?: string;
  category: CertificateCategory;
}

// ─── Data ────────────────────────────────────────────────────────────────────

export const certificates: Certificate[] = [
  {
    id: "ai-chatbot-development",
    title: "AI Chatbot Development",
    issuer: "Vedam School of Technology",
    date: "Completed",
    description:
      "Completed an AI Chatbot Development bootcamp covering AI-powered chatbot fundamentals, prompt engineering, and practical chatbot development.",
    credentialUrl: "/certificates/AI Chatbot Development Bootcamp.pdf",
    category: "AI/ML",
  },
  {
    id: "introduction-to-programming",
    title: "Introduction To Programming",
    issuer: "Vedam School of Technology",
    date: "Completed",
    description:
      "Completed the Introduction to Programming CodeSprint bootcamp, covering programming fundamentals, logical thinking, and problem-solving skills.",
    credentialUrl: "/certificates/Introduction To Programming CodeSprint.pdf",
    category: "Programming",
  },
  {
    id: "2d-game-development-bootcamp",
    title: "2D Game Development Bootcamp",
    issuer: "Vedam School of Technology",
    date: "Completed",
    description:
      "Completed a Python-based 2D Game Development bootcamp, learning to build interactive games from scratch using Pygame.",
    credentialUrl: "/certificates/2D Game Development.pdf",
    category: "Game Dev",
  },
];
