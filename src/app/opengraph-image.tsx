import { ImageResponse } from 'next/og'

export const alt = 'Liam Strickland — Independent web dev & design'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Branded default OG image, used for any route without its own image.
export default function OpengraphImage() {
  const bg = '#1b1a17'
  const fg = '#f0ede2'
  const dim = '#9a978c'
  const accent = '#5a9e6a'

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
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: accent }} />
          <div style={{ color: dim, fontSize: 26, letterSpacing: 4, textTransform: 'uppercase' }}>
            Independent web dev &amp; design
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ color: fg, fontSize: 96, fontWeight: 700, lineHeight: 1.05 }}>
            Liam Strickland
          </div>
          <div style={{ color: dim, fontSize: 34, maxWidth: 820, lineHeight: 1.3 }}>
            Bespoke web development, design &amp; creative direction.
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', color: dim, fontSize: 24 }}>
          <span>Cape Town · Remote-first</span>
          <span style={{ color: accent }}>liamstrickland.dev</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
