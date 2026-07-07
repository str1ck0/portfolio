import type { ReactNode } from 'react'

/**
 * Wraps media (a demo video or screenshot) in a browser window —
 * traffic-light controls + an address bar — so the work reads as a
 * live product rather than a floating rectangle.
 */
export default function BrowserFrame({
  url,
  children,
  className,
}: {
  url?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`ls-browser${className ? ` ${className}` : ''}`}>
      <div className="ls-browser-bar">
        <span className="ls-browser-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        {url && <span className="ls-browser-url font-mono">{formatUrl(url)}</span>}
      </div>
      <div className="ls-browser-viewport">{children}</div>
    </div>
  )
}

function formatUrl(url: string) {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
}
