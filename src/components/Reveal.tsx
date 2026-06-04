'use client'

import { useEffect, useRef, useState } from 'react'

type RevealProps = {
  children: React.ReactNode
  /** Stagger delay in ms before this block animates in. */
  delay?: number
  /** Optional className passed through to the wrapper. */
  className?: string
  style?: React.CSSProperties
  as?: React.ElementType
}

export default function Reveal({ children, delay = 0, className, style, as: Tag = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Respect reduced-motion: show immediately, no animation.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true)
            observer.disconnect()
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`ls-reveal${shown ? ' ls-reveal-in' : ''}${className ? ` ${className}` : ''}`}
      style={{ ...style, transitionDelay: shown ? `${delay}ms` : '0ms' }}
    >
      {children}
    </Tag>
  )
}
