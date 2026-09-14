# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Next.js dev server with Turbopack (localhost:3000)
npm run build    # Production build
npm start        # Serve the production build
npm run lint     # ESLint
npx tsc --noEmit # Type-check — see note below, this is the real gate
```

There is no test suite/framework in this repo.

**`npm run build` will not catch type or lint errors.** `next.config.ts` sets `typescript.ignoreBuildErrors: true` and `eslint.ignoreDuringBuilds: true`, so a build can succeed with broken types. Run `npx tsc --noEmit` yourself after any non-trivial change.

## Environment

Sanity connection vars live in `.env.local` (see `.env.local.example`):
- `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_TOKEN` — optional, for draft/preview mode
- `SANITY_REVALIDATE_SECRET` — checked by `src/app/api/revalidate/route.ts`, which a Sanity webhook (configured in Sanity's dashboard, not in this repo) presumably hits to bust the `revalidate = 60` ISR cache on content changes.

## Architecture

Next.js 15 App Router + TypeScript + Tailwind, content in Sanity (embedded Studio at `/studio`, config in `sanity.config.ts`, schemas in `sanity/schemas/`: `project`, `blogPost`, `siteSettings`). Pages are server components that fetch directly from `src/lib/sanity.ts` — that file is the single source of truth for GROQ queries, the `urlFor()` image-url builder, and the TypeScript interfaces mirroring each Sanity document shape. There's no separate data/service layer beyond it.

### Design tokens and theming

The visual system is CSS custom properties prefixed `--ls-*`, defined once in `src/app/globals.css` (`:root` = light, `.dark` = dark). Theme switching is hand-rolled in `src/components/ThemeProvider.tsx` (not `next-themes`): it toggles a `.dark` class on `<html>`, persists to `localStorage`, and falls back to `prefers-color-scheme`. Reusable interaction/utility classes (`.ls-hover-link`, `.ls-cta`, `.ls-cs-*` case-study layout helpers, `.ls-browser` device-frame chrome) also live in `globals.css` alongside Tailwind rather than as component-scoped styles.

Fonts are local variable fonts loaded via `next/font/local` in `src/app/layout.tsx`: Roobert (`--font-sans`, the workhorse — one variable file for upright, one for italic, weights 300–900) and Geist Mono (`--font-mono`). `--font-moonlight` is currently just aliased to `--font-sans` in `globals.css`, a placeholder for a future distinct display face.

### Case study pages (`src/app/work/[slug]/page.tsx`)

The most involved page. Key things that aren't obvious from a single read:

- **Lead media** (top hero image or video) is forced into a fixed `LEAD_MEDIA_ASPECT_RATIO` box (`1152 / 656`), optionally wrapped in `<BrowserFrame>` for a device-chrome look. A per-project `mediaCropAnchor` field (top/center/bottom) controls `object-position` when the source doesn't match that ratio exactly.
- **Body content** is Portable Text with custom block types beyond the standard `block`: `sectionHeading` (auto-numbered via a counter closed over per-request), `monoQuote`, `pairedImages` (two 4:5 images side by side), `fullBleedImage` (16:9, breaks out toward the viewport edge via `.ls-cs-fullbleed`). See `buildPortableTextComponents()`.
- A separate `images[]` array (rendered by `src/components/ProjectImages.tsx`) is a standalone full-width gallery with a click-to-zoom lightbox — used alongside or instead of the Portable Text body.

### `HoverVideo` (`src/components/HoverVideo.tsx`)

Works around a real bug, not a style choice: **React never emits the `muted` HTML attribute during SSR**, so Chrome's autoplay policy silently blocks any `autoPlay muted` `<video>` rendered from a server component — this affected every video on the site (case-study lead videos included) until this was added. It sets `.muted` via a ref and calls `.play()` explicitly, which Chrome allows regardless. It has two modes: default (autoplay immediately, used for case-study lead videos) and `playOnHover` (`preload="none"`, loads and plays only once the nearest `<a>` ancestor is hovered, pauses and resets on mouse-leave — used for homepage project-row previews so 10 rows don't all download video on page load).

### Image pipeline — two resize layers, keep them in sync

`urlFor(img).width(N)` (Sanity's own CDN resizer, in `src/lib/sanity.ts`) runs *before* Next.js's own image optimizer ever sees the file. Whatever `N` is becomes a hard ceiling — Next can downscale further per device but can never recover detail beyond it, so a low `N` on a large display slot produces visible upscale blur (this happened: the case-study `SanityImg` helper was capped at `width(1400)` while its lead-media slot renders past 1800px on common desktop windows). Next's own `deviceSizes` in `next.config.ts` is the second ceiling — it won't serve anything wider than the largest entry there regardless of source resolution. When bumping quality for a new large image slot, both numbers need raising together.

### Aspect-ratio and radius conventions

Not enforced by shared constants — currently duplicated per usage, so check these before adding a new image slot:

| Slot | Ratio | Where |
|---|---|---|
| Cover / lead media | `1152:656` (~1.756:1) | `work/[slug]/page.tsx` (`LEAD_MEDIA_ASPECT_RATIO`) |
| Homepage hover-peek | `648:369` — exact `0.5625×` of the lead-media box | `page.tsx` `ProjectRow` |
| Paired images | `4:5` | `work/[slug]/page.tsx` `pairedImages` |
| Full-bleed body image | `16:9` | `work/[slug]/page.tsx` `fullBleedImage` |
| OG/social share image | `1200×630` | `generateMetadata` in `work/[slug]/page.tsx` |

The homepage peek box is deliberately an exact fraction of the lead-media box so the same cover image crops identically (just smaller) in both places.

Most image containers share `borderRadius: 6` + `1px solid var(--ls-line-soft)` (portrait on `/about`, homepage hero slot, hover-peek, lead media, paired/full-bleed images, standalone gallery). The one deliberate exception: lead media wrapped in `<BrowserFrame>` skips its own radius, since the frame's 12px window-chrome already rounds the outer corners — adding both would double-round.

### Feature flags

`src/app/page.tsx` hides finished-but-not-ready sections behind module-level `const SHOW_X = false` flags (`SHOW_PROOF_STRIP`, `SHOW_ARCHIVE`) rather than deleting the code — check for these before assuming a missing section needs rebuilding.

### One-off content scripts

`scripts/*.ts` (`migrate-projects.ts`, `attach-project-video.ts`, `add-motherlode.ts`) are ad hoc Sanity data migrations, not part of the app runtime — not wired into any npm script.

## Loose ends from before the redesign

`src/components/Gallery.tsx` is a leftover from the pre-redesign layout and is currently unused (no imports anywhere in `src/`).

The blog (`/blog`, `/blog/[slug]`) is also a separate case: it predates the `ls-*` redesign and still uses the old `--fg-muted`/`--border` CSS variables. It hasn't been migrated and is low-priority/dormant per the site owner — don't assume it follows the design conventions above.
