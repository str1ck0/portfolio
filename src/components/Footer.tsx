import { SITE } from '@/lib/content'

export default function Footer({ children }: { children?: React.ReactNode }) {
  return (
    <footer
      className="flex justify-between items-end px-5 sm:px-8 lg:px-14 font-mono"
      style={{
        paddingTop: 40,
        paddingBottom: 40,
        fontSize: 11,
        letterSpacing: '0.04em',
        background: 'var(--ls-accent)',
        color: 'oklch(0.97 0.010 70)',
      }}
    >
      <span>© Liam Strickland — {SITE.location}</span>
      <span className="flex-1 text-center hidden sm:block">{children}</span>
      <a href={`mailto:${SITE.email}`} className="ls-footer-link hidden sm:block">
        {SITE.email}
      </a>
    </footer>
  )
}
