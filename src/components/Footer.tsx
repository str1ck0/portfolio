import { SITE, ABOUT } from '@/lib/content'

// 16×16 marks, drawn to sit on the same optical weight as the mono type
// beside them. Anything without a dedicated mark falls back to the arrow.
function SocialIcon({ label }: { label: string }) {
  const key = label.toLowerCase()

  if (key === 'github') {
    return (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0016 8c0-4.42-3.58-8-8-8z" />
      </svg>
    )
  }

  if (key === 'linkedin') {
    return (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M13.632 13.635h-2.37V9.922c0-.886-.018-2.025-1.234-2.025-1.235 0-1.424.964-1.424 1.96v3.778h-2.37V6H8.51v1.04h.03c.318-.6 1.092-1.233 2.247-1.233 2.4 0 2.845 1.58 2.845 3.637v4.19zM3.558 4.955a1.376 1.376 0 11-.001-2.751 1.376 1.376 0 01.001 2.751zm1.187 8.68H2.37V6h2.375v7.635zM14.816 0H1.18C.528 0 0 .516 0 1.153v13.694C0 15.484.528 16 1.18 16h13.635c.652 0 1.185-.516 1.185-1.153V1.153C16 .516 15.467 0 14.815 0z" />
      </svg>
    )
  }

  if (key === 'instagram') {
    return (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
        <rect x="1.4" y="1.4" width="13.2" height="13.2" rx="4" />
        <circle cx="8" cy="8" r="3.1" />
        <circle cx="11.9" cy="4.1" r="0.85" fill="currentColor" stroke="none" />
      </svg>
    )
  }

  if (key === 'studio pilz') {
    // Traced from the Studio Pilz mark: domed cap with a flat, round-cornered
    // underside, and a stem tucked beneath it.
    return (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M8 2.1c3.26 0 5.9 2.72 5.9 6.07 0 .62-.49 1.13-1.1 1.13H3.2c-.61 0-1.1-.51-1.1-1.13C2.1 4.82 4.74 2.1 8 2.1Z" />
        <path d="M6.65 8.6h2.7v4.36c0 .52-.41.94-.92.94H7.57c-.51 0-.92-.42-.92-.94V8.6Z" />
      </svg>
    )
  }

  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5.5 10.5 10.5 5.5M6.4 5.5h4.1v4.1" />
    </svg>
  )
}

export default function Footer({ children }: { children?: React.ReactNode }) {
  return (
    <footer
      className="px-5 sm:px-8 lg:px-14"
      style={{
        marginTop: 'clamp(96px, 12vw, 180px)',
        borderTop: '1px solid var(--ls-line-soft)',
        paddingTop: 36,
        paddingBottom: 44,
      }}
    >
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        {/* Identity */}
        <div>
          <a
            href={`mailto:${SITE.email}`}
            className="ls-footer-link font-sans inline-block text-ls-fg"
            style={{ fontSize: 16 }}
          >
            {SITE.email}
          </a>
          <p
            className="font-mono text-ls-muted m-0"
            style={{ fontSize: 11, letterSpacing: '0.04em', marginTop: 10 }}
          >
            © 2026 Liam Strickland
          </p>
          {children && (
            <p
              className="font-mono text-ls-muted m-0"
              style={{ fontSize: 11, letterSpacing: '0.04em', marginTop: 4 }}
            >
              {children}
            </p>
          )}
        </div>

        {/* Elsewhere — mirrors the About page list, with marks */}
        <nav className="flex flex-wrap items-center gap-x-7 gap-y-3">
          {ABOUT.social.map(({ label, url }) => (
            <a
              key={label}
              href={url}
              target={url.startsWith('http') ? '_blank' : undefined}
              rel={url.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="ls-footer-link font-mono uppercase text-ls-fg-dim inline-flex items-center gap-2"
              style={{ fontSize: 11, letterSpacing: '0.08em' }}
            >
              <SocialIcon label={label} />
              {label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
