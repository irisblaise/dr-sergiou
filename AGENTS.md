<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# House rules

Converged on during the src/ cleanup (see the Codebase Diagnostic) and the later componentization pass. Follow these so the same problems don't re-accumulate.

1. Check `styles/_breakpoints.scss`, `_typography.scss`, `_layout.scss`, and `_pill.scss` before writing a new `@media` query or retyping the intro eyebrow/heading/body recipe — extend the shared partial instead of inlining a magic number.
2. A color used more than once, or that needs a specific contrast ratio, becomes a CSS custom property in `styles/global.scss` — never a bare hex duplicated across files.
3. When a page has a Sanity `pageContent`/`homePage` field, the JSX has to actually render it. When wiring a new CMS field, verify it reaches the markup — don't just verify the fetch.
4. Never ship a second permanent "classic"/"redesign" copy of a page. Explore a redesign on a branch or behind a dev-only toggle, and delete the losing variant the moment a design is finalized.
5. Shared browser-effect logic — resize+fonts-ready bootstrapping, a reduced-motion check, a repeated breakpoint literal, a `matchMedia` subscription — belongs in `src/lib/`. Check there before writing a new inline copy.
6. `styled-components` is reserved for the Sanity Studio embed (`src/app/studio/`) only — it's a peer-dependency shim for Studio's own internal styling, not a second app-styling system. Every other page/component uses SCSS Modules.
7. Component/file names are PascalCase, matching their default export exactly.
8. `src/components/ui/` holds pure, presentational primitives with no Sanity or Next.js-routing knowledge (`PageIntro`, `ArrowLink`, `Chip`). Check there before writing a new page-intro heading/eyebrow/paragraphs block, a "label + arrow" CTA link, or a pill/chip toggle button — add a prop to the existing primitive rather than hand-rolling the markup again.
9. The Sanity `pageContent?.field ?? default` fallback-shaping logic belongs in `lib/pageIntro.ts`'s `resolvePageIntro()` — call it, don't retype the three-line fallback per page.
10. Before merging two effects that look similar (e.g. two resize handlers), check they actually solve the same problem first. One may need a `ResizeObserver` where the other only needs `window`'s `resize` event, or rAF-throttle its recompute where the other doesn't — a shared hook should only unify logic that's genuinely identical. Forcing a merge that quietly drops real capability is a regression, not a cleanup; it's fine to leave two similar-looking effects separate.
11. Prefer adjusting state during render over calling `setState` inside a `useEffect` when synchronizing one piece of local React state with another — no external system is involved, so the effect is unnecessary (see https://react.dev/learn/you-might-not-need-an-effect; this is what `eslint-plugin-react-hooks`'s `set-state-in-effect` warning flags). Reserve `useEffect` for effects that genuinely synchronize with something outside React — a browser API, a subscription — and even then, check `src/lib/` first (rule 5) before writing a new one-off effect.
12. When a component sets a CSS custom property inline per-instance (e.g. BookSpine's `--ink-on`/`--cover`), the consuming SCSS must reference that exact property. Swapping it for a similarly-named global token (e.g. `--spine-ink`) silently collapses all per-instance variation — that's how the book-spine legibility regression happened, where every cover's text fell back to one fixed color instead of each cover's own contrasting ink.
