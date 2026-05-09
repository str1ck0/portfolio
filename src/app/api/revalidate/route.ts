import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (!process.env.SANITY_REVALIDATE_SECRET || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
  revalidatePath('/', 'layout')
  return NextResponse.json({ revalidated: true, timestamp: Date.now() })
}
