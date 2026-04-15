'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState, useEffect, useMemo } from 'react'
import { urlFor } from '@/lib/sanity'
import type { GalleryProject, ProjectImage } from '@/lib/sanity'

type GalleryItem = {
  key: string
  image: ProjectImage
  projectTitle: string
  projectSlug: string
  globalIndex: number
}

function useNumCols() {
  const [numCols, setNumCols] = useState(3)
  useEffect(() => {
    const update = () =>
      setNumCols(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return numCols
}

// Greedy shortest-column distribution based on image aspect ratios
function distributeIntoColumns(items: GalleryItem[], numCols: number): GalleryItem[][] {
  const columns: GalleryItem[][] = Array.from({ length: numCols }, () => [])
  const heights = new Array(numCols).fill(0)
  for (const item of items) {
    const w = item.image.asset.metadata?.dimensions?.width || 1
    const h = item.image.asset.metadata?.dimensions?.height || 1
    const shortest = heights.indexOf(Math.min(...heights))
    columns[shortest].push(item)
    heights[shortest] += h / w
  }
  return columns
}

export default function Gallery({ data }: { data: GalleryProject[] }) {
  const numCols = useNumCols()

  const items = useMemo<GalleryItem[]>(() =>
    data.flatMap((p) =>
      (p.images ?? []).map((img, _i, _arr) => ({
        key: `${p.projectSlug}-${img._key}`,
        image: img,
        projectTitle: p.projectTitle,
        projectSlug: p.projectSlug,
        globalIndex: 0, // filled below
      }))
    ).map((item, i) => ({ ...item, globalIndex: i }))
  , [data])

  const columns = useMemo(
    () => distributeIntoColumns(items, numCols),
    [items, numCols]
  )

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p className="text-sm text-[var(--fg-muted)]">No images yet.</p>
      </div>
    )
  }

  return (
    <div className="px-6 py-8 flex gap-4">
      {columns.map((col, ci) => (
        <div key={ci} className="flex-1 flex flex-col gap-4">
          {col.map((item) => (
            <GalleryCard key={item.key} item={item} priority={item.globalIndex < 6} />
          ))}
        </div>
      ))}
    </div>
  )
}

function GalleryCard({ item, priority }: { item: GalleryItem; priority?: boolean }) {
  const { image, projectTitle, projectSlug, globalIndex } = item
  const w = image.asset.metadata?.dimensions?.width || 800
  const h = image.asset.metadata?.dimensions?.height || 600
  const src = urlFor(image.asset).width(900).quality(80).auto('format').url()

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: globalIndex * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link href={`/work/${projectSlug}`} className="group relative block overflow-hidden">
        <Image
          src={src}
          alt={image.alt || projectTitle}
          width={w}
          height={h}
          className="w-full h-auto block"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          placeholder={image.asset.metadata?.lqip ? 'blur' : 'empty'}
          blurDataURL={image.asset.metadata?.lqip}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
          <p className="text-sm font-medium text-white tracking-wide">{projectTitle}</p>
          {image.caption && (
            <p className="text-[11px] text-white/55 mt-0.5 font-mono">{image.caption}</p>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
