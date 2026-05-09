import { createClient } from '@sanity/client'
import { NextRequest, NextResponse } from 'next/server'

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

export async function POST(req: NextRequest) {
  try {
    const { imageData } = await req.json()
    if (!imageData) {
      return NextResponse.json({ error: 'No image data' }, { status: 400 })
    }

    if (!process.env.SANITY_WRITE_TOKEN) {
      return NextResponse.json({ error: 'Write token not configured' }, { status: 500 })
    }

    const buffer = Buffer.from(imageData, 'base64')
    const asset = await writeClient.assets.upload('image', buffer, {
      contentType: 'image/png',
      filename: `graffiti-${Date.now()}.png`,
    })

    await writeClient.create({
      _type: 'graffiti',
      image: {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
      },
      approved: false,
      submittedAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Graffiti save error:', err)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
