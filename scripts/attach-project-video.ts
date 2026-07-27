/**
 * Prep a screen recording and attach it as the lead demo video on a Sanity
 * `project` document — compresses the source to a web-ready MP4, extracts a
 * poster frame, uploads both, and patches the doc (video + videoPoster +
 * optional browserFrame). Existing doc fields are preserved.
 *
 * Usage:
 *   ts-node --compiler-options '{"module":"commonjs"}' scripts/attach-project-video.ts \
 *     --source "/path/to/recording.mov" \
 *     --slug studio-pilz \
 *     [--url studiopilz.art] [--alt "Studio Pilz website"] \
 *     [--width 1920] [--fps 30] [--no-frame] [--dry-run]
 *
 * Notes:
 *   - --url is the address-bar text for the browser frame. Omit to fall back
 *     to the doc's first live link. Pass --no-frame to skip the frame entirely.
 *   - --alt defaults to "<Project title> website".
 *   - Requires ffmpeg/ffprobe on PATH and SANITY_WRITE_TOKEN in .env.local.
 */
import { createClient } from '@sanity/client'
import { execFileSync } from 'child_process'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

function arg(name: string, fallback?: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  if (i !== -1 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--')) {
    return process.argv[i + 1]
  }
  return fallback
}
const flag = (name: string) => process.argv.includes(`--${name}`)

const source = arg('source')
const slug = arg('slug')
const url = arg('url')
const altOverride = arg('alt')
const width = arg('width', '1920')!
const fps = arg('fps', '30')!
const noFrame = flag('no-frame')
const dryRun = flag('dry-run')

if (!source || !slug) {
  console.error('✗ Missing required args. Need --source <path> and --slug <project-slug>.')
  process.exit(1)
}
const src: string = source
const projectSlug: string = slug
if (!fs.existsSync(src)) {
  console.error(`✗ Source video not found: ${src}`)
  process.exit(1)
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

async function main() {
  const doc = await client.fetch<{ _id: string; title: string; firstLink?: string } | null>(
    `*[_type == "project" && slug.current == $slug][0]{ _id, title, "firstLink": links[0].url }`,
    { slug: projectSlug },
  )
  if (!doc) {
    console.error(`✗ No project found with slug "${slug}".`)
    process.exit(1)
  }
  console.log(`→ Target: "${doc.title}" (${doc._id})`)

  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pv-'))
  const mp4 = path.join(workDir, `${slug}-demo.mp4`)
  const poster = path.join(workDir, `${slug}-poster.jpg`)

  console.log(`→ Encoding web MP4 (${width}w · ${fps}fps · H.264, audio stripped)…`)
  execFileSync('ffmpeg', [
    '-y', '-i', src,
    '-vf', `scale=${width}:-2:flags=lanczos,fps=${fps}`,
    '-c:v', 'libx264', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
    '-crf', '23', '-preset', 'slow', '-movflags', '+faststart', '-an',
    mp4,
  ], { stdio: ['ignore', 'ignore', 'inherit'] })

  console.log('→ Extracting poster frame (0.5s in)…')
  execFileSync('ffmpeg', [
    '-y', '-ss', '0.5', '-i', src,
    '-frames:v', '1', '-vf', `scale=${width}:-2:flags=lanczos`, '-q:v', '3',
    poster,
  ], { stdio: ['ignore', 'ignore', 'inherit'] })

  const mp4Mb = (fs.statSync(mp4).size / 1e6).toFixed(1)
  console.log(`  ✓ ${path.basename(mp4)} (${mp4Mb} MB), ${path.basename(poster)}`)

  const alt = altOverride || `${doc.title} website`
  const frameUrl = url ?? undefined

  if (dryRun) {
    console.log('\n— DRY RUN — encoded but not uploaded. Artifacts:')
    console.log(`  ${mp4}\n  ${poster}`)
    console.log(`  Would set browserFrame: ${noFrame ? 'disabled' : JSON.stringify({ enabled: true, url: frameUrl ?? '(first link)' })}`)
    return
  }

  console.log('→ Uploading video asset…')
  const videoAsset = await client.assets.upload('file', fs.createReadStream(mp4), {
    filename: `${slug}-demo.mp4`,
    contentType: 'video/mp4',
  })

  console.log('→ Uploading poster asset…')
  const posterAsset = await client.assets.upload('image', fs.createReadStream(poster), {
    filename: `${slug}-poster.jpg`,
  })

  const patch: Record<string, unknown> = {
    video: { _type: 'file', asset: { _type: 'reference', _ref: videoAsset._id } },
    videoPoster: {
      _type: 'image',
      asset: { _type: 'reference', _ref: posterAsset._id },
      alt,
    },
  }
  if (!noFrame) {
    patch.browserFrame = { enabled: true, ...(frameUrl ? { url: frameUrl } : {}) }
  }

  console.log('→ Patching document…')
  await client.patch(doc._id).set(patch).commit()

  fs.rmSync(workDir, { recursive: true, force: true })
  console.log(`✓ Done — demo video attached to "${doc.title}".`)
}

main().catch((err) => {
  console.error('✗ Failed:', err.message)
  process.exit(1)
})
