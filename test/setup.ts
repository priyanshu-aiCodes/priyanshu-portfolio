/**
 * test/setup.ts — Global test setup
 *
 * - Imports @testing-library/jest-dom matchers (toBeInTheDocument, etc.)
 * - Mocks framer-motion so animation wrappers render children without
 *   requiring a real DOM animation engine.
 * - Mocks next/dynamic to render the real component synchronously in tests.
 * - Mocks window.matchMedia (not available in jsdom).
 * - Mocks IntersectionObserver (not available in jsdom).
 * - Mocks navigator.clipboard for copy-email tests.
 */

import "@testing-library/jest-dom";
import { vi } from "vitest";

// ── matchMedia stub ───────────────────────────────────────────────────────────
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// ── IntersectionObserver stub ─────────────────────────────────────────────────
const IntersectionObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);

// ── ResizeObserver stub ───────────────────────────────────────────────────────
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
vi.stubGlobal("ResizeObserver", ResizeObserverMock);

// ── Clipboard stub ────────────────────────────────────────────────────────────
Object.defineProperty(navigator, "clipboard", {
  writable: true,
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(""),
  },
});

// ── framer-motion: pass-through stubs so components render ───────────────────
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual<typeof import("framer-motion")>("framer-motion");
  const React = await import("react");

  // Wrap with forwardRef so refs still work (e.g. EasterEgg focus trap)
  const makeStub = (tag: string) =>
    React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & Record<string, unknown>>(
      ({ children, ...rest }, ref) => {
        // Strip framer props that would cause React warnings
        const safeProps: Record<string, unknown> = {};
        const FRAMER_PROPS = new Set([
          "initial","animate","exit","variants","transition","whileHover",
          "whileTap","whileInView","whileFocus","layout","layoutId",
          "viewport","drag","dragConstraints","onDrag","onDragStart",
          "onDragEnd","custom","style",
        ]);
        for (const [k, v] of Object.entries(rest)) {
          if (!FRAMER_PROPS.has(k)) safeProps[k] = v;
        }
        return React.createElement(tag, { ...safeProps, ref }, children as React.ReactNode);
      }
    );

  return {
    ...actual,
    motion: new Proxy(
      {},
      {
        get: (_t, prop: string) => {
          const tag = ["button","a","ul","li","nav","header","form","article"].includes(prop)
            ? prop
            : "div";
          return makeStub(tag);
        },
      }
    ),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
    useReducedMotion: () => false,
    useMotionValue: (initial: unknown) => ({ get: () => initial, set: vi.fn() }),
    useSpring: (val: unknown) => val,
    useTransform: (_v: unknown, _i: unknown, output: unknown[]) => ({ get: () => output[0] }),
    useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
  };
});

// ── next/dynamic: render component synchronously ──────────────────────────────
vi.mock("next/dynamic", () => ({
  default: (loader: () => Promise<{ default: React.ComponentType }>) => {
    // Return a component that lazily renders — but synchronously in tests
    // we just return a placeholder (most dynamic components are non-critical)
    const React = require("react");
    const Comp = React.lazy(loader);
    return function DynamicWrapper(props: Record<string, unknown>) {
      return React.createElement(
        React.Suspense,
        { fallback: null },
        React.createElement(Comp, props)
      );
    };
  },
}));
