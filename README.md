# Liam Strickland Portfolio

A modern, interactive portfolio website built with Next.js 14, Sanity CMS, and Three.js.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **CMS**: Sanity.io
- **Styling**: Tailwind CSS
- **Animation**: Three.js (PixelBlast effect)
- **Language**: TypeScript
- **Deployment**: Vercel

---

## Project Structure

```
portfolio-25/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Homepage (main layout)
│   │   ├── layout.tsx          # Root layout (fonts, metadata)
│   │   ├── blog/
│   │   │   ├── page.tsx        # Blog listing
│   │   │   └── [slug]/page.tsx # Individual blog post
│   │   ├── work/
│   │   │   └── [tag]/page.tsx  # Tag-filtered projects
│   │   └── studio/             # Sanity Studio (embedded)
│   │
│   ├── components/             # React components
│   │   ├── Gallery.tsx         # Masonry image grid
│   │   ├── CollapsibleMenu.tsx # Sidebar navigation menu
│   │   ├── Background.tsx      # Background wrapper
│   │   ├── PixelBlast.tsx      # Three.js pixel animation
│   │   ├── ProjectDetail.tsx   # Project modal/lightbox
│   │   ├── ProjectOverlay.tsx  # Image hover overlay
│   │   ├── AboutText.tsx       # About text with links
│   │   └── SocialIcons.tsx     # Social media icons
│   │
│   └── lib/
│       └── sanity.ts           # Sanity client, queries, types
│
├── sanity/
│   └── schemas/                # Sanity CMS schemas
│       ├── project.ts          # Project document type
│       ├── blogPost.ts         # Blog post document type
│       └── siteSettings.ts     # Global settings singleton
│
└── public/
    └── logo.png                # Site logo
```

---

## Key Files Reference

### Layout & Pages

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | **Homepage** - Bento grid layout, sidebar, gallery container |
| `src/app/layout.tsx` | Root layout with fonts and metadata |
| `src/app/work/[tag]/page.tsx` | Tag-filtered project pages |
| `src/app/blog/page.tsx` | Blog listing page |

### Components

| File | Purpose |
|------|---------|
| `src/components/Gallery.tsx` | **Masonry grid** - CSS Grid layout, hover states, image sizing via `gridSpan` |
| `src/components/CollapsibleMenu.tsx` | **Sidebar menu** - About/Stack/Contact with hover/click expand |
| `src/components/Background.tsx` | Loads PixelBlast animation dynamically |
| `src/components/PixelBlast.tsx` | **Three.js animation** - Pixel pattern with liquid/ripple effects |
| `src/components/ProjectDetail.tsx` | **Modal** - Opens on image click, shows project details |
| `src/components/ProjectOverlay.tsx` | Hover overlay with project title/description |

### Data Layer

| File | Purpose |
|------|---------|
| `src/lib/sanity.ts` | Sanity client, GROQ queries, TypeScript interfaces |
| `sanity/schemas/project.ts` | Project schema (images, tags, gridSpan, etc.) |
| `sanity/schemas/siteSettings.ts` | Global settings (name, about, social) |

---

## Styling Guide

### Colors
- Background: `bg-black`
- Text: `text-white`, `text-white/60` (muted)
- Grid lines: `bg-white/20`

### Layout
- Sidebar width: `240px`
- Grid lines form a connected bento-style frame
- Gallery: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`

### Pointer Events
The layout uses a layered pointer-events system:
- **Background (z-0)**: `pointer-events-auto` - receives clicks in empty areas
- **Grid lines (z-10)**: `pointer-events-none` - visual only
- **Content (z-20)**: `pointer-events-none` container, `pointer-events-auto` on interactive elements

This allows the background animation to respond to mouse movement and clicks in gaps between content.

---

## Sanity CMS

### Access Studio
Navigate to `/studio` in development or production.

### Key Schemas

**Project** (`sanity/schemas/project.ts`)
- `title`, `slug`, `description`, `fullDescription`
- `images[]` - Array of images with:
  - `alt`, `caption`
  - `gridSpan` (1, 2, or 3) - controls column width in gallery
- `tags[]`, `technologies[]`
- `featured` - Show on homepage
- `order` - Display order

**Site Settings** (`sanity/schemas/siteSettings.ts`)
- `name` - Your name
- `aboutText`, `extendedAbout`
- `stack[]` - Technologies list
- `email`, `social[]`

### Image Grid Span
To control image sizes in the gallery:
1. Edit a project in Sanity Studio
2. Click on an image in the Images array
3. Set "Grid Span" to:
   - **1** = Normal (1 column)
   - **2** = Wide (2 columns)
   - **3** = Full width (3 columns)

---

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

---

## Architecture Notes

### Bento Grid Concept
The layout is designed as a modular bento-style grid with connected lines. Each cell is extensible - the sidebar and gallery are the current "widgets", but the structure supports adding more cells like:
- Spotify embed
- Sketchpad
- Mini-games
- Social feeds

To add a new widget:
1. Add a new cell to the grid in `src/app/page.tsx`
2. Update the grid lines in the overlay div
3. Create a new component for the widget content
4. Add `pointer-events-auto` to interactive elements

### Background Animation
`PixelBlast.tsx` creates an animated pixel pattern using Three.js with:
- Liquid effect following cursor
- Click ripples
- Configurable density, speed, and colors

The animation runs on a canvas that spans the full viewport at z-index 0.

---

## Troubleshooting

### "Encountered two children with same key"
Images missing `_key` in Sanity. The gallery uses index-based keys as fallback.

### Background not responding to mouse
Check pointer-events hierarchy. Content containers should be `pointer-events-none` with only interactive children having `pointer-events-auto`.

### Modal overlapping sidebar
The modal uses `left-[241px]` to offset from sidebar. Adjust if sidebar width changes.

### Name wrapping to two lines
Increase sidebar width in `page.tsx` (currently 240px). Update:
- `w-[240px]` on sidebar container
- `left-[240px]` on vertical divider
- `left-[241px]` on gallery and modal

---

## Future Ideas

- [ ] Draggable/resizable bento cells
- [ ] Spotify widget integration
- [ ] Interactive sketchpad cell
- [ ] Dark/light mode toggle
- [ ] Animated page transitions
- [ ] Blog with MDX support

---

## License

Private - Liam Strickland
