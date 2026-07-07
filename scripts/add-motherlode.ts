import { createClient } from '@sanity/client'
import * as fs from 'fs'
import * as dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

const MEDIA = '/Users/stricko/Desktop/WORK/PROJECTS/Motherlode'
const DOC_ID = 'project-motherlode'

async function main() {
  console.log('→ Uploading demo video (MP4)…')
  const videoAsset = await client.assets.upload(
    'file',
    fs.createReadStream(`${MEDIA}/motherlode-demo.mp4`),
    { filename: 'motherlode-demo.mp4', contentType: 'video/mp4' },
  )

  console.log('→ Uploading poster image…')
  const posterAsset = await client.assets.upload(
    'image',
    fs.createReadStream(`${MEDIA}/motherlode-poster.jpg`),
    { filename: 'motherlode-poster.jpg' },
  )

  const doc = {
    _id: DOC_ID,
    _type: 'project',
    title: 'Motherlode',
    slug: { _type: 'slug', current: 'motherlode' },
    display: 'index',
    order: 0,
    kind: 'Personal · Interactive',
    role: 'Design & Build',
    year: 2026,
    blurb:
      'A Y2K meme-crypto landing page — a glowing WebGL orb, a matrix-shader background, procedural Web Audio, and a pile of hidden easter eggs.',
    technologies: ['React', 'TypeScript', 'Three.js', 'OGL / WebGL', 'Vite', 'Vercel'],
    video: { _type: 'file', asset: { _type: 'reference', _ref: videoAsset._id } },
    videoPoster: {
      _type: 'image',
      asset: { _type: 'reference', _ref: posterAsset._id },
      alt: 'Motherlode — glowing green orb on a matrix background',
    },
    cover: {
      _type: 'image',
      asset: { _type: 'reference', _ref: posterAsset._id },
      alt: 'Motherlode — glowing green orb on a matrix background',
    },
    browserFrame: { enabled: true, url: 'motherlode.crypto' },
    links: [
      { _key: 'live', _type: 'object', title: 'Live site', url: 'https://motherlode-landing.vercel.app' },
    ],
  }

  console.log('→ Writing project document (createOrReplace)…')
  await client.createOrReplace(doc)

  console.log(`✓ Done — "Motherlode" is live in the "${client.config().dataset}" dataset.`)
}

main().catch((err) => {
  console.error('✗ Failed:', err.message)
  process.exit(1)
})
