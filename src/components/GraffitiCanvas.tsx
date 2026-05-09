'use client'

import { useRef, useState, useCallback, useEffect } from 'react'

const COLORS = [
  '#111111', '#f5f5f5', '#e63946', '#457b9d',
  '#2d6a4f', '#f4a261', '#9b5de5', '#f72585',
]

function MarkerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.586 7.586" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

export default function GraffitiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [active, setActive] = useState(false)
  const [colorIdx, setColorIdx] = useState(0)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const lastPos = useRef<{ x: number; y: number } | null>(null)

  const color = COLORS[colorIdx]

  // Resize canvas to window without clearing
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const handleResize = () => {
      // Save current drawing
      const img = canvas.toDataURL()
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const image = new window.Image()
      image.onload = () => ctx.drawImage(image, 0, 0)
      image.src = img
    }
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      }
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
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

  const cycleColor = useCallback(() => {
    setColorIdx(i => (i + 1) % COLORS.length)
  }, [])

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx?.clearRect(0, 0, canvas.width, canvas.height)
    setHasDrawn(false)
    setStatus('idle')
  }, [])

  const saveGraffiti = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas || !hasDrawn) return
    setStatus('saving')

    try {
      const dataUrl = canvas.toDataURL('image/png')
      const base64 = dataUrl.split(',')[1]
      const res = await fetch('/api/graffiti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: base64 }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('saved')
      clearCanvas()
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }, [hasDrawn, clearCanvas])

  const close = useCallback(() => {
    setActive(false)
    setStatus('idle')
  }, [])

  return (
    <>
      {/* Canvas overlay */}
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

      {/* Controls — always above canvas */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {active && (
          <div className="flex flex-col items-end gap-2">
            {/* Color palette */}
            <div className="flex gap-1.5 bg-[var(--bg)] border border-[var(--border)] rounded-full px-3 py-2 shadow-lg">
              {COLORS.map((c, i) => (
                <button
                  key={c}
                  onClick={() => setColorIdx(i)}
                  title={`Color ${i + 1}`}
                  className="rounded-full transition-transform"
                  style={{
                    width: 18,
                    height: 18,
                    background: c,
                    border: i === colorIdx ? '2px solid var(--fg)' : '2px solid transparent',
                    transform: i === colorIdx ? 'scale(1.25)' : 'scale(1)',
                  }}
                />
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              {hasDrawn && (
                <button
                  onClick={clearCanvas}
                  className="text-xs px-3 py-1.5 bg-[var(--bg)] border border-[var(--border)] rounded-full hover:opacity-60 transition-opacity shadow"
                >
                  clear
                </button>
              )}
              {hasDrawn && (
                <button
                  onClick={saveGraffiti}
                  disabled={status === 'saving'}
                  className="text-xs px-3 py-1.5 bg-[var(--fg)] text-[var(--bg)] rounded-full hover:opacity-70 transition-opacity shadow disabled:opacity-40"
                >
                  {status === 'saving' ? 'saving...' : status === 'saved' ? 'sent ✓' : status === 'error' ? 'error ✗' : 'leave tag'}
                </button>
              )}
              <button
                onClick={close}
                className="text-xs px-3 py-1.5 bg-[var(--bg)] border border-[var(--border)] rounded-full hover:opacity-60 transition-opacity shadow flex items-center gap-1"
              >
                <CloseIcon /> done
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
          style={{ border: active ? '2px solid var(--bg)' : 'none', outline: active ? '2px solid var(--fg)' : 'none' }}
        >
          <MarkerIcon />
        </button>
      </div>
    </>
  )
}
