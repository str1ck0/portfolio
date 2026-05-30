'use client'

import { useCallback, useEffect, useMemo, useRef } from 'react'
import { gsap } from 'gsap'
import { InertiaPlugin } from 'gsap/InertiaPlugin'

gsap.registerPlugin(InertiaPlugin)

/**
 * Interactive dot field — the React Bits "Dot Grid", ported to TypeScript.
 * https://reactbits.dev — uses GSAP InertiaPlugin for velocity-based push +
 * elastic return. Adapted here to be:
 *   - theme-aware (re-colours when the .dark class toggles on <html>)
 *   - reduced-motion safe (renders a static field, no interaction)
 *   - a backdrop (pointer-events: none; pointer tracked on window)
 *
 * Place inside a position:relative parent; it fills the parent.
 */

type Dot = {
  cx: number
  cy: number
  xOffset: number
  yOffset: number
  _inertiaApplied: boolean
}

type Rgb = { r: number; g: number; b: number }

// theme palettes (hex), tuned to the --ls tokens
const THEME = {
  dark: { base: '#3c3e3a', active: '#529668' },
  light: { base: '#c4c0b4', active: '#468058' },
}

function hexToRgb(hex: string): Rgb {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
  if (!m) return { r: 0, g: 0, b: 0 }
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
}

function throttle<A extends unknown[]>(func: (...args: A) => void, limit: number) {
  let lastCall = 0
  return function (this: unknown, ...args: A) {
    const now = performance.now()
    if (now - lastCall >= limit) {
      lastCall = now
      func.apply(this, args)
    }
  }
}

export default function DotGrid({
  dotSize = 2,
  gap = 14,
  baseColor,
  activeColor,
  proximity = 130,
  speedTrigger = 100,
  shockRadius = 240,
  shockStrength = 5,
  maxSpeed = 5000,
  resistance = 750,
  returnDuration = 1.5,
  className,
  style,
}: {
  dotSize?: number
  gap?: number
  /** override theme colour (hex). Falls back to a theme-aware default. */
  baseColor?: string
  activeColor?: string
  proximity?: number
  speedTrigger?: number
  shockRadius?: number
  shockStrength?: number
  maxSpeed?: number
  resistance?: number
  returnDuration?: number
  className?: string
  style?: React.CSSProperties
}) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dotsRef = useRef<Dot[]>([])
  const pointerRef = useRef({ x: 0, y: 0, vx: 0, vy: 0, speed: 0, lastTime: 0, lastX: 0, lastY: 0 })

  // current colours (mutable so the draw loop sees theme changes without re-init)
  const colorsRef = useRef<{ base: Rgb; active: Rgb; baseHex: string }>({
    base: { r: 60, g: 62, b: 58 },
    active: { r: 82, g: 150, b: 104 },
    baseHex: THEME.dark.base,
  })

  const reduce = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  )

  const circlePath = useMemo(() => {
    if (typeof window === 'undefined' || !window.Path2D) return null
    const p = new Path2D()
    p.arc(0, 0, dotSize / 2, 0, Math.PI * 2)
    return p
  }, [dotSize])

  // keep colours in sync with the override props / theme class
  useEffect(() => {
    function apply() {
      const isDark = document.documentElement.classList.contains('dark')
      const baseHex = baseColor ?? (isDark ? THEME.dark.base : THEME.light.base)
      const activeHex = activeColor ?? (isDark ? THEME.dark.active : THEME.light.active)
      colorsRef.current = { base: hexToRgb(baseHex), active: hexToRgb(activeHex), baseHex }
    }
    apply()
    const obs = new MutationObserver(apply)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [baseColor, activeColor])

  const buildGrid = useCallback(() => {
    const wrap = wrapperRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    const { width, height } = wrap.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1

    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.scale(dpr, dpr)

    const cell = dotSize + gap
    const cols = Math.floor((width + gap) / cell)
    const rows = Math.floor((height + gap) / cell)

    const gridW = cell * cols - gap
    const gridH = cell * rows - gap
    const startX = (width - gridW) / 2 + dotSize / 2
    const startY = (height - gridH) / 2 + dotSize / 2

    const dots: Dot[] = []
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        dots.push({ cx: startX + x * cell, cy: startY + y * cell, xOffset: 0, yOffset: 0, _inertiaApplied: false })
      }
    }
    dotsRef.current = dots
  }, [dotSize, gap])

  // render loop
  useEffect(() => {
    if (!circlePath) return
    let rafId = 0
    const proxSq = proximity * proximity

    const draw = () => {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const { x: px, y: py } = pointerRef.current
      const { base, active, baseHex } = colorsRef.current

      for (const dot of dotsRef.current) {
        const ox = dot.cx + dot.xOffset
        const oy = dot.cy + dot.yOffset
        const dx = dot.cx - px
        const dy = dot.cy - py
        const dsq = dx * dx + dy * dy

        let fill = baseHex
        if (dsq <= proxSq) {
          const dist = Math.sqrt(dsq)
          const t = 1 - dist / proximity
          const r = Math.round(base.r + (active.r - base.r) * t)
          const g = Math.round(base.g + (active.g - base.g) * t)
          const b = Math.round(base.b + (active.b - base.b) * t)
          fill = `rgb(${r},${g},${b})`
        }

        ctx.save()
        ctx.translate(ox, oy)
        ctx.fillStyle = fill
        ctx.fill(circlePath)
        ctx.restore()
      }

      rafId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(rafId)
  }, [proximity, circlePath])

  // grid build + resize
  useEffect(() => {
    buildGrid()
    const wrap = wrapperRef.current
    if (!wrap) return
    const ro = new ResizeObserver(buildGrid)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [buildGrid])

  // interaction (skipped entirely for reduced motion)
  useEffect(() => {
    if (reduce) return

    const onMove = (e: MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const now = performance.now()
      const pr = pointerRef.current
      const dt = pr.lastTime ? now - pr.lastTime : 16
      const dx = e.clientX - pr.lastX
      const dy = e.clientY - pr.lastY
      let vx = (dx / dt) * 1000
      let vy = (dy / dt) * 1000
      let speed = Math.hypot(vx, vy)
      if (speed > maxSpeed) {
        const scale = maxSpeed / speed
        vx *= scale
        vy *= scale
        speed = maxSpeed
      }
      pr.lastTime = now
      pr.lastX = e.clientX
      pr.lastY = e.clientY
      pr.vx = vx
      pr.vy = vy
      pr.speed = speed

      const rect = canvas.getBoundingClientRect()
      pr.x = e.clientX - rect.left
      pr.y = e.clientY - rect.top

      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - pr.x, dot.cy - pr.y)
        if (speed > speedTrigger && dist < proximity && !dot._inertiaApplied) {
          dot._inertiaApplied = true
          gsap.killTweensOf(dot)
          const pushX = dot.cx - pr.x + vx * 0.005
          const pushY = dot.cy - pr.y + vy * 0.005
          gsap.to(dot, {
            inertia: { xOffset: pushX, yOffset: pushY, resistance },
            onComplete: () => {
              gsap.to(dot, {
                xOffset: 0,
                yOffset: 0,
                duration: returnDuration,
                ease: 'elastic.out(1,0.75)',
              })
              dot._inertiaApplied = false
            },
          })
        }
      }
    }

    const onClick = (e: MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const cx = e.clientX - rect.left
      const cy = e.clientY - rect.top
      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - cx, dot.cy - cy)
        if (dist < shockRadius && !dot._inertiaApplied) {
          dot._inertiaApplied = true
          gsap.killTweensOf(dot)
          const falloff = Math.max(0, 1 - dist / shockRadius)
          const pushX = (dot.cx - cx) * shockStrength * falloff
          const pushY = (dot.cy - cy) * shockStrength * falloff
          gsap.to(dot, {
            inertia: { xOffset: pushX, yOffset: pushY, resistance },
            onComplete: () => {
              gsap.to(dot, {
                xOffset: 0,
                yOffset: 0,
                duration: returnDuration,
                ease: 'elastic.out(1,0.75)',
              })
              dot._inertiaApplied = false
            },
          })
        }
      }
    }

    const throttledMove = throttle(onMove, 50)
    window.addEventListener('mousemove', throttledMove, { passive: true })
    window.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('mousemove', throttledMove)
      window.removeEventListener('click', onClick)
    }
  }, [reduce, maxSpeed, speedTrigger, proximity, resistance, returnDuration, shockRadius, shockStrength])

  return (
    <div ref={wrapperRef} className={className} style={{ pointerEvents: 'none', ...style }}>
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      />
    </div>
  )
}
