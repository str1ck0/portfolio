---
name: attach-project-video
description: Prep a screen recording and attach it as the lead demo video on a Sanity `project` doc in this portfolio — compress to a web MP4, extract a poster, upload both, and (optionally) wrap it in a browser frame. Use when the user wants to add/replace a demo video for a project (e.g. "prep this video for the Studio Pilz project", "add a browser-frame video like Motherlode").
---

# Attach a demo video to a project

Turns a raw screen recording (usually a `.mov` on the Desktop) into the lead media
for a case-study page: a compressed web MP4 + poster image, uploaded to Sanity and
patched onto the `project` document, optionally inside the browser-window frame
(traffic lights + address bar) used on Motherlode/Studio Pilz.

The whole flow is handled by `scripts/attach-project-video.ts`. Prefer it over doing
the steps by hand — it encodes, uploads, resolves the doc by slug, and patches in one
shot while preserving existing fields.

## Steps

1. **Identify the target project.** You need its slug. If the user names a project by
   title, resolve the slug first:
   ```
   query_documents: *[_type == "project" && title match "pilz*"]{title, slug, "firstLink": links[0].url}
   ```
   (projectId `ucqrzxxd`, dataset `production`.)

2. **Probe the source** so you can report the before size and sanity-check it:
   ```
   ffprobe -v error -show_entries format=duration,size:stream=width,height,codec_name,codec_type -of default=noprint_wrappers=1 "<source>"
   ```

3. **Run the script** from the repo root:
   ```
   node_modules/.bin/ts-node --compiler-options '{"module":"commonjs"}' \
     scripts/attach-project-video.ts \
     --source "/Users/stricko/Desktop/Screen Recording ....mov" \
     --slug <project-slug> \
     --url <address-bar-text>
   ```
   Add `--dry-run` first if you want to encode + preview the patch without uploading.

## Flags

- `--source <path>` (required) — the raw recording.
- `--slug <slug>` (required) — target project's slug.
- `--url <text>` — address-bar text for the browser frame (e.g. `studiopilz.art`).
  Omit to fall back to the doc's first live link. Strip the `www.` for a cleaner bar.
- `--no-frame` — attach the video without a browser frame.
- `--alt "<text>"` — poster alt text (defaults to `"<Project title> website"`).
- `--width 1920` / `--fps 30` — encode overrides (defaults are good for retina recordings).
- `--dry-run` — encode + print the intended patch, no uploads/writes.

## What the script does

- Encodes H.264 MP4: scaled to `--width` (default 1920, aspect kept, even dims),
  `--fps` (default 30), yuv420p, `crf 23 -preset slow`, `+faststart`, **audio stripped**.
  A ~100 MB retina `.mov` typically lands ~8 MB.
- Extracts a poster JPG from 0.5s in (avoids a black first frame).
- Uploads both to Sanity, then `patch().set()` on the doc: `video`, `videoPoster`
  (with alt), and `browserFrame { enabled, url }` unless `--no-frame`.
- Existing doc fields (blurb, links, order, …) are left untouched.

## Rendering (for reference)

`src/app/work/[slug]/page.tsx` renders the lead media: if `project.video` exists it
uses a `<video>` with `videoPoster` as the poster; when `browserFrame.enabled` it wraps
that in `<BrowserFrame url={browserFrame.url || links[0].url}>`. `BrowserFrame` strips
the protocol and trailing slash from the URL for display. No page changes are needed —
this skill is data-only.

## After running

- Verify: `query_documents` for the doc, selecting `browserFrame`, `video.asset->url`,
  `videoPoster.asset->url`.
- Encoded files live in an OS temp dir and are cleaned up; the assets live on Sanity's
  CDN. Don't commit media into the repo unless asked.
- Requires `ffmpeg`/`ffprobe` on PATH and `SANITY_WRITE_TOKEN` in `.env.local`.
