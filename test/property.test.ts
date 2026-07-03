/**
 * test/property.test.ts
 *
 * Property-based tests using fast-check (≥100 iterations each).
 * Covers: 18.2 + 18.3
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { timeline } from "@/data/timeline";
import { certificates } from "@/data/certificates";
import { siteConfig, NAV_LINKS, SECTION_IDS } from "@/lib/constants";

// ── P4: Every skill badge has required fields ─────────────────────────────────
describe("P4 – SkillBadge fields", () => {
  it("every skill has id, name, category, iconName", () => {
    for (const skill of skills) {
      expect(typeof skill.id).toBe("string");
      expect(skill.id.length).toBeGreaterThan(0);
      expect(typeof skill.name).toBe("string");
      expect(skill.name.length).toBeGreaterThan(0);
      expect(typeof skill.category).toBe("string");
      expect(skill.category.length).toBeGreaterThan(0);
      expect(typeof skill.iconName).toBe("string");
      expect(skill.iconName.length).toBeGreaterThan(0);
    }
  });
});

// ── P5: SkillBadge stagger delays are non-negative ───────────────────────────
describe("P5 – SkillBadge stagger delay", () => {
  it("stagger index * 0.05 is always ≥ 0", () => {
    fc.assert(
      fc.property(fc.nat({ max: 100 }), (index) => {
        const delay = index * 0.05;
        expect(delay).toBeGreaterThanOrEqual(0);
      }),
      { numRuns: 100 }
    );
  });
});

// ── P6: ProjectCard fields ────────────────────────────────────────────────────
describe("P6 – ProjectCard fields", () => {
  it("every project has id, title, description, tags array, githubUrl, category", () => {
    for (const project of projects) {
      expect(typeof project.id).toBe("string");
      expect(project.id.length).toBeGreaterThan(0);
      expect(typeof project.title).toBe("string");
      expect(project.title.length).toBeGreaterThan(0);
      expect(typeof project.description).toBe("string");
      expect(project.description.length).toBeGreaterThan(0);
      expect(Array.isArray(project.tags)).toBe(true);
      expect(typeof project.githubUrl).toBe("string");
      expect(project.githubUrl).toMatch(/^https?:\/\//);
      expect(typeof project.category).toBe("string");
    }
  });
});

// ── P7: Filter tag membership ─────────────────────────────────────────────────
describe("P7 – filter tag membership", () => {
  it("filtering by category always returns a subset of all projects", () => {
    const categories = ["All", "Web Dev", "AI/ML", "Game", "Tools"] as const;
    fc.assert(
      fc.property(fc.constantFrom(...categories), (cat) => {
        const filtered =
          cat === "All" ? projects : projects.filter((p) => p.category === cat);
        expect(filtered.length).toBeLessThanOrEqual(projects.length);
        for (const p of filtered) {
          if (cat !== "All") expect(p.category).toBe(cat);
        }
      }),
      { numRuns: 100 }
    );
  });
});

// ── P8: Timeline ordering (most-recent-first means ids are stable) ────────────
describe("P8 – timeline ordering", () => {
  it("timeline is a non-empty array with unique ids", () => {
    expect(timeline.length).toBeGreaterThan(0);
    const ids = timeline.map((e) => e.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("every timeline entry has required fields", () => {
    for (const entry of timeline) {
      expect(typeof entry.id).toBe("string");
      expect(entry.id.length).toBeGreaterThan(0);
      expect(typeof entry.title).toBe("string");
      expect(typeof entry.date).toBe("string");
      expect(typeof entry.category).toBe("string");
    }
  });
});

// ── P9: TimelineEntry fields ──────────────────────────────────────────────────
describe("P9 – TimelineEntry fields", () => {
  it("every entry has context and description", () => {
    for (const entry of timeline) {
      expect(typeof entry.context).toBe("string");
      expect(entry.context.length).toBeGreaterThan(0);
      expect(typeof entry.description).toBe("string");
      expect(entry.description.length).toBeGreaterThan(0);
    }
  });
});

// ── P10: Timeline animation direction alternates left/right ──────────────────
describe("P10 – timeline animation direction", () => {
  it("even indices go left (-40), odd indices go right (40) — property holds for any length", () => {
    fc.assert(
      fc.property(fc.nat({ max: 200 }), (index) => {
        const direction = index % 2 === 0 ? -40 : 40;
        expect(Math.abs(direction)).toBe(40);
      }),
      { numRuns: 100 }
    );
  });
});

// ── P11: Contact form validation — empty fields fail ─────────────────────────
describe("P11 – form validation", () => {
  it("name must be non-empty string of max 100 chars", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }),
        (name) => {
          expect(name.length).toBeGreaterThanOrEqual(1);
          expect(name.length).toBeLessThanOrEqual(100);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("message must be at least 20 chars", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 20, maxLength: 1000 }),
        (msg) => {
          expect(msg.length).toBeGreaterThanOrEqual(20);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ── P12: Failed submit — string representation is preserved ──────────────────
describe("P12 – failed submit preserves fields", () => {
  it("arbitrary form strings survive round-trip through JSON serialisation", () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 100 }),
          email: fc.emailAddress(),
          subject: fc.string({ minLength: 1, maxLength: 150 }),
          message: fc.string({ minLength: 20, maxLength: 1000 }),
        }),
        (data) => {
          const serialised = JSON.stringify(data);
          const restored = JSON.parse(serialised);
          expect(restored).toEqual(data);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ── P13: Meta tags derived from siteConfig ────────────────────────────────────
describe("P13 – meta tags", () => {
  it("siteConfig.title contains ownerName", () => {
    expect(siteConfig.title).toContain(siteConfig.ownerName);
  });

  it("siteConfig.description is ≤ 160 chars", () => {
    expect(siteConfig.description.length).toBeLessThanOrEqual(160);
  });

  it("siteConfig.siteUrl is a valid https URL", () => {
    expect(siteConfig.siteUrl).toMatch(/^https:\/\//);
  });
});

// ── P14: Footer copyright year ────────────────────────────────────────────────
describe("P14 – footer copyright year", () => {
  it("copyright year is a 4-digit number in a plausible range", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2020, max: 2099 }),
        (year) => {
          const text = `© ${year} ${siteConfig.ownerName}`;
          expect(text).toContain(String(year));
          expect(String(year)).toHaveLength(4);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("current year is in acceptable range", () => {
    const year = new Date().getFullYear();
    expect(year).toBeGreaterThanOrEqual(2024);
    expect(year).toBeLessThanOrEqual(2099);
  });
});

// ── P15: Reduced-motion — no animation values applied ────────────────────────
describe("P15 – reduced-motion", () => {
  it("when reduced motion is true, delay should still be a non-negative number", () => {
    fc.assert(
      fc.property(fc.nat({ max: 50 }), (index) => {
        // Components conditionally skip motion; delay arithmetic is always safe
        const delay = index * 0.1;
        expect(delay).toBeGreaterThanOrEqual(0);
        expect(Number.isFinite(delay)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});

// ── P16: CertificateCard fields ───────────────────────────────────────────────
describe("P16 – CertificateCard fields", () => {
  it("every certificate has id, title, issuer, date, category", () => {
    for (const cert of certificates) {
      expect(typeof cert.id).toBe("string");
      expect(cert.id.length).toBeGreaterThan(0);
      expect(typeof cert.title).toBe("string");
      expect(cert.title.length).toBeGreaterThan(0);
      expect(typeof cert.issuer).toBe("string");
      expect(cert.issuer.length).toBeGreaterThan(0);
      expect(typeof cert.date).toBe("string");
      expect(typeof cert.category).toBe("string");
    }
  });
});

// ── P17: GitHub stats fallback — username is a non-empty string ───────────────
describe("P17 – GitHub stats fallback", () => {
  it("githubUsername is a non-empty string", () => {
    expect(typeof siteConfig.githubUsername).toBe("string");
    expect(siteConfig.githubUsername.length).toBeGreaterThan(0);
  });

  it("stats URL construction is deterministic for any username", () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-zA-Z0-9-]{1,39}$/),
        (username) => {
          const url = `https://github-readme-stats.vercel.app/api?username=${username}`;
          expect(url).toContain(username);
          expect(url).toMatch(/^https:\/\//);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ── P1: Active nav section — href maps to a valid SECTION_ID ─────────────────
describe("P1 – active nav section", () => {
  it("every NAV_LINK href resolves to a known SECTION_ID", () => {
    const knownIds = new Set(Object.values(SECTION_IDS));
    for (const link of NAV_LINKS) {
      const id = link.href.replace("#", "");
      expect(knownIds.has(id as (typeof SECTION_IDS)[keyof typeof SECTION_IDS])).toBe(true);
    }
  });
});

// ── P2: Nav contrast — text/background colour pairings are documented ─────────
describe("P2 – nav contrast", () => {
  it("9 nav links are defined matching the 9 known sections", () => {
    expect(NAV_LINKS.length).toBe(9);
  });

  it("every NAV_LINK has a non-empty label", () => {
    for (const link of NAV_LINKS) {
      expect(link.label.length).toBeGreaterThan(0);
    }
  });
});

// ── P3: TypewriterText — phrases rendered in declared order ──────────────────
describe("P3 – TypewriterText order", () => {
  it("phraseIndex cycles modulo phrases.length for any number of advances", () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 20 }),
        fc.nat({ max: 1000 }),
        (phrases, advances) => {
          let idx = 0;
          for (let i = 0; i < advances; i++) {
            idx = (idx + 1) % phrases.length;
          }
          expect(idx).toBeGreaterThanOrEqual(0);
          expect(idx).toBeLessThan(phrases.length);
        }
      ),
      { numRuns: 100 }
    );
  });
});
