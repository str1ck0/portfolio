'use client'

import { useRef, useState, useCallback, useEffect } from 'react'

// ── SVG outline filter (embeds into each sticker for the white border look) ──

const FILTER = `<defs><filter id="o" x="-20%" y="-20%" width="140%" height="140%"><feMorphology in="SourceAlpha" operator="dilate" radius="6" result="d"/><feFlood flood-color="white" result="c"/><feComposite in="c" in2="d" operator="in" result="ol"/><feMerge><feMergeNode in="ol"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`

function sticker(content: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -8 116 116">${FILTER}<g filter="url(#o)">${content}</g></svg>`
}

// ── Sticker designs ──────────────────────────────────────────────────────────

const STICKER_SVGS: Record<string, string> = {
  crown: sticker(`
    <polygon points="10,80 10,45 30,62 50,20 70,62 90,45 90,80" fill="#FFD700"/>
    <rect x="10" y="76" width="80" height="14" rx="3" fill="#E8B800"/>
    <circle cx="50" cy="20" r="6" fill="#FF3333"/>
    <circle cx="30" cy="62" r="5" fill="#FF3333"/>
    <circle cx="70" cy="62" r="5" fill="#FF3333"/>
  `),
  star: sticker(`
    <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="#FF5500"/>
  `),
  bolt: sticker(`
    <path d="M62,5 L35,50 L56,50 L38,95 L78,42 L55,42 L72,5 Z" fill="#FFEE00"/>
  `),
  flame: sticker(`
    <path d="M50,90 C25,85 18,65 22,50 C26,37 35,30 28,15 C38,28 42,40 50,35 C52,26 57,14 67,8 C63,28 72,42 74,52 C80,68 72,88 50,90 Z" fill="#FF4400"/>
    <path d="M50,80 C35,75 30,62 35,52 C38,45 44,40 42,32 C48,38 49,46 53,42 C56,35 59,26 65,20 C61,35 67,44 68,52 C72,64 65,78 50,80 Z" fill="#FF9900"/>
  `),
  peace: sticker(`
    <circle cx="50" cy="50" r="38" fill="none" stroke="#8822FF" stroke-width="10"/>
    <line x1="50" y1="12" x2="50" y2="88" stroke="#8822FF" stroke-width="10"/>
    <line x1="50" y1="50" x2="18" y2="78" stroke="#8822FF" stroke-width="10"/>
    <line x1="50" y1="50" x2="82" y2="78" stroke="#8822FF" stroke-width="10"/>
  `),
  heart: sticker(`
    <path d="M50,82 C50,82 12,56 12,34 C12,21 22,13 33,13 C41,13 48,19 50,25 C52,19 59,13 67,13 C78,13 88,21 88,34 C88,56 50,82 50,82 Z" fill="#FF1155"/>
  `),
  skull: sticker(`
    <ellipse cx="50" cy="42" rx="30" ry="32" fill="#F0F0F0"/>
    <rect x="26" y="64" width="48" height="22" rx="8" fill="#F0F0F0"/>
    <ellipse cx="37" cy="40" rx="10" ry="11" fill="#222"/>
    <ellipse cx="63" cy="40" rx="10" ry="11" fill="#222"/>
    <rect x="36" y="66" width="7" height="16" rx="2" fill="#C8C8C8"/>
    <rect x="47" y="66" width="7" height="16" rx="2" fill="#C8C8C8"/>
    <rect x="57" y="66" width="7" height="16" rx="2" fill="#C8C8C8"/>
  `),
  eye: sticker(`
    <ellipse cx="50" cy="50" rx="42" ry="26" fill="white"/>
    <circle cx="50" cy="50" r="18" fill="#1B4FCC"/>
    <circle cx="50" cy="50" r="10" fill="#111"/>
    <circle cx="43" cy="43" r="4" fill="white"/>
    <ellipse cx="50" cy="50" rx="42" ry="26" fill="none" stroke="#222" stroke-width="4"/>
  `),
  drip: sticker(`
    <rect x="18" y="8" width="64" height="36" rx="8" fill="#22CC44"/>
    <path d="M30,44 Q28,64 32,80 Q36,92 40,80 Q44,68 38,44 Z" fill="#22CC44"/>
    <path d="M52,44 Q50,70 54,86 Q58,98 62,86 Q66,72 60,44 Z" fill="#22CC44"/>
  `),
  spray: sticker(`
    <rect x="30" y="30" width="40" height="56" rx="10" fill="#33AAFF"/>
    <rect x="36" y="18" width="28" height="16" rx="6" fill="#33AAFF"/>
    <rect x="43" y="8" width="14" height="14" rx="4" fill="#888"/>
    <rect x="34" y="56" width="32" height="12" rx="4" fill="#1188CC"/>
    <circle cx="74" cy="18" r="7" fill="#FF4444"/>
  `),
}

const STICKER_KEYS = Object.keys(STICKER_SVGS)

function stickerUrl(key: string) {
  return `data:image/svg+xml,${encodeURIComponent(STICKER_SVGS[key])}`
}

// ── Types ────────────────────────────────────────────────────────────────────

interface StickerInstance {
  id: string
  key: string
  x: number
  y: number
  size: number
}

// ── Pen colors ───────────────────────────────────────────────────────────────

const COLORS = [
  '#111111', '#f5f5f5', '#e63946', '#457b9d',
  '#2d6a4f', '#f4a261', '#9b5de5', '#f72585',
]

// ── Icons ────────────────────────────────────────────────────────────────────

function MarkerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19l7-7 3 3-7 7-3-3z"/>
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
      <path d="M2 2l7.586 7.586"/>
      <circle cx="11" cy="11" r="2"/>
    </svg>
  )
}

function StickerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 8v4l3 3"/>
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  )
}

// ── Component ────────────────────────────────────────────────────────────────

export default function GraffitiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [active, setActive] = useState(false)
  const [colorIdx, setColorIdx] = useState(0)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [stickers, setStickers] = useState<StickerInstance[]>([])
  const [showPicker, setShowPicker] = useState(false)
  const lastPos = useRef<{ x: number; y: number } | null>(null)
  const dragRef = useRef<{
    id: string
    type: 'move' | 'resize'
    startX: number
    startY: number
    origX: number
    origY: number
    origSize: number
  } | null>(null)

  const color = COLORS[colorIdx]
  const hasAnything = hasDrawn || stickers.length > 0

  // ── Canvas init & resize ─────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const onResize = () => {
      const dataUrl = canvas.toDataURL()
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const img = new window.Image()
      img.onload = () => canvas.getContext('2d')?.drawImage(img, 0, 0)
      img.src = dataUrl
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // ── Drawing ──────────────────────────────────────────────────────────────

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    if ('touches' in e) return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top }
  }

  const startDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true)
    setHasDrawn(true)
    lastPos.current = getPos(e)
  }, [])

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx || !lastPos.current) return
    const pos = getPos(e)
    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = color
    ctx.lineWidth = 10
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.globalAlpha = 0.88
    ctx.stroke()
    lastPos.current = pos
  }, [isDrawing, color])

  const stopDraw = useCallback(() => {
    setIsDrawing(false)
    lastPos.current = null
  }, [])

  const cycleColor = useCallback(() => setColorIdx(i => (i + 1) % COLORS.length), [])

  // ── Sticker drag (window-level for smooth tracking) ──────────────────────

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const d = dragRef.current
      if (!d) return
      setStickers(prev => prev.map(st => {
        if (st.id !== d.id) return st
        if (d.type === 'move') {
          return { ...st, x: d.origX + e.clientX - d.startX, y: d.origY + e.clientY - d.startY }
        }
        const delta = (e.clientX - d.startX + e.clientY - d.startY) / 2
        return { ...st, size: Math.max(40, d.origSize + delta) }
      }))
    }
    const onUp = () => { dragRef.current = null }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp) }
  }, [])

  // ── Sticker actions ──────────────────────────────────────────────────────

  const addSticker = useCallback((key: string) => {
    setStickers(s => [...s, {
      id: `${key}-${Date.now()}`,
      key,
      x: window.innerWidth / 2 - 50,
      y: window.innerHeight / 2 - 50,
      size: 100,
    }])
    setShowPicker(false)
  }, [])

  const removeSticker = useCallback((id: string) => {
    setStickers(s => s.filter(st => st.id !== id))
  }, [])

  // ── Clear ────────────────────────────────────────────────────────────────

  const clearAll = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)
    setStickers([])
    setHasDrawn(false)
    setStatus('idle')
  }, [])

  // ── Save (composites stickers onto canvas then uploads) ──────────────────

  const save = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas || !hasAnything) return
    setStatus('saving')
    try {
      const temp = document.createElement('canvas')
      temp.width = canvas.width
      temp.height = canvas.height
      const ctx = temp.getContext('2d')!
      ctx.drawImage(canvas, 0, 0)

      await Promise.all(stickers.map(st => new Promise<void>(resolve => {
        const img = new window.Image()
        img.onload = () => { ctx.drawImage(img, st.x, st.y, st.size, st.size); resolve() }
        img.onerror = () => resolve()
        img.src = stickerUrl(st.key)
      })))

      const base64 = temp.toDataURL('image/png').split(',')[1]
      const res = await fetch('/api/graffiti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: base64 }),
      })
      if (!res.ok) throw new Error()
      setStatus('saved')
      setTimeout(clearAll, 3000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }, [hasAnything, stickers, clearAll])

  const close = useCallback(() => {
    setActive(false)
    setShowPicker(false)
  }, [])

  return (
    <>
      {/* Drawing canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-40"
        style={{ pointerEvents: active ? 'all' : 'none', cursor: active ? 'crosshair' : 'default' }}
        onMouseDown={active ? startDraw : undefined}
        onMouseMove={active ? draw : undefined}
        onMouseUp={active ? stopDraw : undefined}
        onMouseLeave={active ? stopDraw : undefined}
        onTouchStart={active ? startDraw : undefined}
        onTouchMove={active ? draw : undefined}
        onTouchEnd={active ? stopDraw : undefined}
        onDoubleClick={active ? cycleColor : undefined}
      />

      {/* Sticker layer — only visible when graffiti mode is on */}
      {active && stickers.map(st => (
        <div
          key={st.id}
          className="fixed"
          style={{ left: st.x, top: st.y, width: st.size, height: st.size, zIndex: 45 }}
        >
          {/* Sticker image — drag to move */}
          <img
            src={stickerUrl(st.key)}
            alt={st.key}
            width={st.size}
            height={st.size}
            draggable={false}
            className="w-full h-full select-none cursor-grab active:cursor-grabbing"
            onPointerDown={e => {
              e.stopPropagation()
              dragRef.current = { id: st.id, type: 'move', startX: e.clientX, startY: e.clientY, origX: st.x, origY: st.y, origSize: st.size }
            }}
          />
          {/* Delete button */}
          <button
            className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-[var(--fg)] text-[var(--bg)] text-xs flex items-center justify-center leading-none shadow hover:opacity-70 transition-opacity"
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); removeSticker(st.id) }}
            aria-label="Remove sticker"
          >
            ×
          </button>
          {/* Resize handle */}
          <div
            className="absolute -bottom-2 -right-2 w-4 h-4 rounded-sm bg-[var(--fg)] opacity-60 hover:opacity-100 cursor-se-resize transition-opacity"
            onPointerDown={e => {
              e.stopPropagation()
              dragRef.current = { id: st.id, type: 'resize', startX: e.clientX, startY: e.clientY, origX: st.x, origY: st.y, origSize: st.size }
            }}
          />
        </div>
      ))}

      {/* Toolbar */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {active && (
          <div className="flex flex-col items-end gap-2">

            {/* Color palette */}
            <div className="flex gap-1.5 bg-[var(--bg)] border border-[var(--border)] rounded-full px-3 py-2 shadow-lg">
              {COLORS.map((c, i) => (
                <button
                  key={c}
                  onClick={() => setColorIdx(i)}
                  className="rounded-full transition-transform"
                  style={{
                    width: 18, height: 18, background: c,
                    border: i === colorIdx ? '2px solid var(--fg)' : '2px solid transparent',
                    transform: i === colorIdx ? 'scale(1.25)' : 'scale(1)',
                  }}
                />
              ))}
            </div>

            {/* Sticker picker panel */}
            {showPicker && (
              <div className="grid grid-cols-5 gap-1.5 bg-[var(--bg)] border border-[var(--border)] rounded-xl p-2.5 shadow-lg">
                {STICKER_KEYS.map(key => (
                  <button
                    key={key}
                    onClick={() => addSticker(key)}
                    title={key}
                    className="w-11 h-11 hover:scale-110 transition-transform p-0.5"
                  >
                    <img src={stickerUrl(key)} alt={key} className="w-full h-full" draggable={false} />
                  </button>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 items-center flex-wrap justify-end">
              <button
                onClick={() => setShowPicker(p => !p)}
                title="Stickers"
                className={`text-xs px-3 py-1.5 border border-[var(--border)] rounded-full hover:opacity-60 transition-opacity shadow flex items-center gap-1.5 ${showPicker ? 'bg-[var(--fg)] text-[var(--bg)]' : 'bg-[var(--bg)]'}`}
              >
                <StickerIcon /> stickers
              </button>
              {hasAnything && (
                <button onClick={clearAll} className="text-xs px-3 py-1.5 bg-[var(--bg)] border border-[var(--border)] rounded-full hover:opacity-60 transition-opacity shadow">
                  clear
                </button>
              )}
              {hasAnything && (
                <button
                  onClick={save}
                  disabled={status === 'saving'}
                  className="text-xs px-3 py-1.5 bg-[var(--fg)] text-[var(--bg)] rounded-full hover:opacity-70 transition-opacity shadow disabled:opacity-40"
                >
                  {status === 'saving' ? 'saving...' : status === 'saved' ? 'sent ✓' : status === 'error' ? 'error ✗' : 'leave tag'}
                </button>
              )}
              <button onClick={close} className="text-xs px-3 py-1.5 bg-[var(--bg)] border border-[var(--border)] rounded-full hover:opacity-60 transition-opacity shadow">
                done
              </button>
            </div>

            <p className="text-[10px] opacity-40 text-right">double-click canvas to cycle colour</p>
          </div>
        )}

        {/* Toggle button */}
        <button
          onClick={() => setActive(a => !a)}
          title={active ? 'Close tagger' : 'Tag this page'}
          className="w-11 h-11 rounded-full bg-[var(--fg)] text-[var(--bg)] flex items-center justify-center shadow-lg hover:opacity-80 transition-opacity"
          style={{ outline: active ? '2px solid var(--fg)' : 'none', outlineOffset: '2px' }}
        >
          <MarkerIcon />
        </button>
      </div>
    </>
  )
}
