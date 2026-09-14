# Liam Strickland Portfolio

Personal portfolio site — Next.js App Router + Sanity CMS, freelance full-stack developer & designer positioning.

## Redesign

The site went through a full visual redesign the week of Sep 1–7, 2026, on the `redesign/2026-09` branch (merged to `main` via PR #7 and #8): new typeface (Roobert), a blue-black/turquoise `--ls-*` design-token system replacing the old visual identity, and copy repositioned around full-stack dev + design work with AI in the loop. See `CLAUDE.md` for the resulting architecture and conventions in detail.

## Tech Stack

- **Framework**: Next.js 15 (App Router), TypeScript
- **CMS**: Sanity.io (embedded Studio at `/studio`)
- **Styling**: Tailwind CSS + a custom `--ls-*` design-token system (`src/app/globals.css`)
- **Deployment**: Vercel

## Project Structure

```
src/
├── app/
│   ├── page.tsx               # Homepage — hero, project index, recent posts
│   ├── about/page.tsx         # About page
│   ├── work/[slug]/page.tsx   # Case study pages
│   ├── blog/                  # Blog (pre-redesign styling, currently dormant)
│   ├── studio/[[...tool]]/    # Embedded Sanity Studio
│   ├── api/revalidate/        # ISR revalidation webhook endpoint
│   └── globals.css            # Design tokens + shared utility classes
├── components/                # Header, Footer, HoverVideo, BrowserFrame, ProjectImages, etc.
└── lib/
    ├── sanity.ts               # Sanity client, GROQ queries, urlFor(), TS types
    └── content.ts               # Static site copy (bio, socials, background)

sanity/schemas/                 # project, blogPost, siteSettings
scripts/                        # one-off Sanity data migration scripts
```

## Development

```bash
npm install
npm run dev       # http://localhost:3000 (Turbopack)
npm run build
npm start
npm run lint
npx tsc --noEmit  # type-check — see note below
```

`npm run build` does **not** fail on type or lint errors (`next.config.ts` sets `ignoreBuildErrors` / `ignoreDuringBuilds`). Run `npx tsc --noEmit` to actually verify types.

There is no test suite in this repo currently.

### Environment Variables

Create `.env.local` (see `.env.local.example`):

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production

# Optional — draft/preview mode
SANITY_API_TOKEN=your-api-token

# Required for the /api/revalidate webhook
SANITY_REVALIDATE_SECRET=your-secret
```

## Sanity CMS

Studio lives at `/studio` in both dev and production. Schemas (`sanity/schemas/`):

- **`project`** — case studies: `cover`, `video` + `videoPoster` + `mediaCropAnchor`, `browserFrame` (device-chrome toggle), a Portable Text `body` with custom block types (`sectionHeading`, `monoQuote`, `pairedImages`, `fullBleedImage`), and a standalone `images[]` gallery.
- **`blogPost`** — dormant; the blog hasn't been migrated to the redesigned token system.
- **`siteSettings`** — singleton for global content (portrait, homepage settings).

## License

Private — Liam Strickland
