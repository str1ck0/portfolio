'use client'

import { useEffect, useRef } from 'react'

export default function HoverVideo({
  src,
  poster,
  className,
  style,
  playOnHover = false,
}: {
  src: string
  poster?: string
  className?: string
  style?: React.CSSProperties
  /** Only load/play once the nearest link/parent is hovered, instead of autoplaying immediately. */
  playOnHover?: boolean
}) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    // React doesn't reflect `muted` as an HTML attribute during SSR, so the
    // browser's initial autoplay attempt sees an unmuted video and blocks it.
    // Setting the property then calling play() explicitly works regardless.
    video.muted = true

    if (!playOnHover) {
      video.play().catch(() => {})
      return
    }

    const container = video.closest('a') || video.parentElement
    if (!container) return
    const play = () => { video.play().catch(() => {}) }
    const pause = () => { video.pause(); video.currentTime = 0 }
    container.addEventListener('mouseenter', play)
    container.addEventListener('mouseleave', pause)
    return () => {
      container.removeEventListener('mouseenter', play)
      container.removeEventListener('mouseleave', pause)
    }
  }, [playOnHover])

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload={playOnHover ? 'none' : 'auto'}
      className={className}
      style={style}
    />
  )
}
