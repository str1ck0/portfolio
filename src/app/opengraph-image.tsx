import { ImageResponse } from 'next/og'

export const alt = 'Liam Strickland — Full-stack web developer & designer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Branded default OG image, used for any route without its own image.
export default function OpengraphImage() {
  const bg = '#080b0f'
  const fg = '#eff0f1'
  const dim = '#8899aa'
  const accent = '#39bba5'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: bg,
          padding: '72px 80px',
          fontFamily: 'Helvetica, Arial, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: accent }} />
          <div style={{ color: dim, fontSize: 26, letterSpacing: 4, textTransform: 'uppercase' }}>
            Full-stack web developer &amp; designer
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ color: fg, fontSize: 96, fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.025em' }}>
            Liam Strickland
          </div>
          <div style={{ color: dim, fontSize: 34, maxWidth: 860, lineHeight: 1.3 }}>
            I design and build web products end to end — and ship them fast.
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', color: dim, fontSize: 24 }}>
          <span>Cape Town · Remote-first · Open to roles</span>
          <span style={{ color: accent }}>liamstrickland.dev</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
