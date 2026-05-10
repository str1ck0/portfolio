'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { urlFor, type ProjectImage } from '@/lib/sanity'

export default function ProjectImages({ images, projectTitle }: { images: ProjectImage[]; projectTitle: string }) {
  const [lightbox, setLightbox] = useState<ProjectImage | null>(null)

  const close = useCallback(() => setLightbox(null), [])

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, close])

  return (
    <>
      <div className="flex flex-col gap-3">
        {images.map((image, i) => {
          if (!image.asset) return null
          const origW = image.asset.metadata?.dimensions?.width || 1200
          const origH = image.asset.metadata?.dimensions?.height || 800
          const crop = image.crop
          const w = Math.round(origW * (1 - (crop?.left || 0) - (crop?.right || 0)))
          const h = Math.round(origH * (1 - (crop?.top || 0) - (crop?.bottom || 0)))
          const src = urlFor(image).width(1200).quality(85).auto('format').url()
          return (
            <div key={image._key}>
              <button
                onClick={() => setLightbox(image)}
                className="block w-full text-left cursor-zoom-in"
                aria-label={`View full size: ${image.alt || projectTitle}`}
              >
                <Image
                  src={src}
                  alt={image.alt || projectTitle}
                  width={w}
                  height={h}
                  className="w-full h-auto"
                  priority={i === 0}
                  placeholder={image.asset.metadata?.lqip ? 'blur' : 'empty'}
                  blurDataURL={image.asset.metadata?.lqip}
                />
              </button>
              {image.caption && (
                <p className="text-xs text-[var(--fg-muted)] mt-2">{image.caption}</p>
              )}
            </div>
          )
        })}
      </div>

      {/* Lightbox */}
      {lightbox && lightbox.asset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={close}
        >
          <button
            onClick={close}
            className="absolute top-4 right-5 text-white/60 hover:text-white text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
          <div
            className="relative max-w-[95vw] max-h-[95vh]"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={urlFor(lightbox).quality(100).url()}
              alt={lightbox.alt || projectTitle}
              width={Math.round((lightbox.asset.metadata?.dimensions?.width || 2400) * (1 - (lightbox.crop?.left || 0) - (lightbox.crop?.right || 0)))}
              height={Math.round((lightbox.asset.metadata?.dimensions?.height || 1600) * (1 - (lightbox.crop?.top || 0) - (lightbox.crop?.bottom || 0)))}
              className="max-w-[95vw] max-h-[95vh] object-contain"
              quality={100}
              unoptimized
            />
            {lightbox.caption && (
              <p className="text-xs text-white/50 mt-2 text-center">{lightbox.caption}</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
