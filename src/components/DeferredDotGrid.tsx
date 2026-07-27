'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import type { DotGridProps } from './DotGrid'

// Load the interactive dot field (pulls in GSAP) only after the page has
// painted, so it never blocks the hero / LCP. It's a decorative backdrop.
const DotGrid = dynamic(() => import('./DotGrid'), { ssr: false })

export default function DeferredDotGrid(props: DotGridProps) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
      cancelIdleCallback?: (id: number) => void
    }
    if (typeof w.requestIdleCallback === 'function') {
      const id = w.requestIdleCallback(() => setReady(true), { timeout: 1500 })
      return () => w.cancelIdleCallback?.(id)
    }
    const t = setTimeout(() => setReady(true), 300)
    return () => clearTimeout(t)
  }, [])

  if (!ready) return null
  return <DotGrid {...props} />
}
