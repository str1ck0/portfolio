'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { urlFor } from '@/lib/sanity'
import type { GalleryProject, ProjectImage } from '@/lib/sanity'

type GalleryItem = {
  key: string
  image: ProjectImage
  projectTitle: string
  projectSlug: string
}

const ROW_SIZE = 4  // px — matches gridAutoRows
const GAP = 16      // px — gap between items

export default function Gallery({ data }: { data: GalleryProject[] }) {
  const items: GalleryItem[] = data.flatMap((p) =>
    (p.images ?? []).map((img) => ({
      key: `${p.projectSlug}-${img._key}`,
      image: img,
      projectTitle: p.projectTitle,
      projectSlug: p.projectSlug,
    }))
  )

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p className="text-sm text-[var(--fg-muted)]">No images yet.</p>
      </div>
    )
  }

  return (
    <div
      className="px-6 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4"
      style={{ gridAutoRows: `${ROW_SIZE}px`, rowGap: 0 }}
    >
      {items.map((item, i) => (
        <GalleryCard key={item.key} item={item} index={i} priority={i < 6} />
      ))}
    </div>
  )
}

function GalleryCard({ item, index, priority }: { item: GalleryItem; index: number; priority?: boolean }) {
  const { image, projectTitle, projectSlug } = item
  const span = Math.min(Math.max(image.gridSpan ?? 1, 1), 3)
  const w = image.asset.metadata?.dimensions?.width || 800
  const h = image.asset.metadata?.dimensions?.height || 600
  const src = urlFor(image.asset).width(span === 1 ? 900 : span === 2 ? 1600 : 1920).quality(80).auto('format').url()

  const innerRef = useRef<HTMLDivElement>(null)
  const [rowSpan, setRowSpan] = useState(300) // initial estimate

  useEffect(() => {
    const el = innerRef.current
    if (!el) return
    const update = () => {
      const height = el.getBoundingClientRect().height
      if (height > 0) setRowSpan(Math.ceil((height + GAP) / ROW_SIZE))
    }
    const ro = new ResizeObserver(update)
    ro.observe(el)
    update()
    return () => ro.disconnect()
  }, [])

  const colSpanClass =
    span === 3 ? 'sm:col-span-2 lg:col-span-3'
    : span === 2 ? 'sm:col-span-2'
    : ''

  return (
    <div
      className={colSpanClass}
      style={{ gridRowEnd: `span ${rowSpan}`, alignSelf: 'start' }}
    >
      <motion.div
        ref={innerRef}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Link href={`/work/${projectSlug}`} className="group relative block overflow-hidden">
          <Image
            src={src}
            alt={image.alt || projectTitle}
            width={w}
            height={h}
            className="w-full h-auto block"
            sizes={
              span === 3 ? '100vw'
              : span === 2 ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 66vw'
              : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
            }
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
    </div>
  )
}
