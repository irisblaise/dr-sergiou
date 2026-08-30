<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# House rules

Converged on during the src/ cleanup (see the Codebase Diagnostic). Follow these so the same problems don't re-accumulate.

1. Check `styles/_breakpoints.scss`, `_typography.scss`, `_layout.scss`, and `_pill.scss` before writing a new `@media` query or retyping the intro eyebrow/heading/body recipe — extend the shared partial instead of inlining a magic number.
2. A color used more than once, or that needs a specific contrast ratio, becomes a CSS custom property in `styles/global.scss` — never a bare hex duplicated across files.
3. When a page has a Sanity `pageContent`/`homePage` field, the JSX has to actually render it. When wiring a new CMS field, verify it reaches the markup — don't just verify the fetch.
4. Never ship a second permanent "classic"/"redesign" copy of a page. Explore a redesign on a branch or behind a dev-only toggle, and delete the losing variant the moment a design is finalized.
5. Shared browser-effect logic — resize+fonts-ready bootstrapping, a reduced-motion check, a repeated breakpoint literal — belongs in `src/lib/`. Check there before writing a new inline copy.
6. `styled-components` is reserved for the Sanity Studio embed (`src/app/studio/`) only — it's a peer-dependency shim for Studio's own internal styling, not a second app-styling system. Every other page/component uses SCSS Modules.
7. Component/file names are PascalCase, matching their default export exactly.
