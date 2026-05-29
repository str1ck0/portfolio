import { SITE } from '@/lib/content'

export default function Footer({ children }: { children?: React.ReactNode }) {
  return (
    <footer
      className="flex justify-between items-end px-5 sm:px-8 lg:px-14 font-mono"
      style={{
        paddingTop: 28,
        paddingBottom: 28,
        fontSize: 11,
        letterSpacing: '0.04em',
        color: 'var(--ls-fg-dim)',
      }}
    >
      <span>© Liam Strickland — {SITE.location}</span>
      <span className="flex-1 text-center hidden sm:block">{children}</span>
      <span className="hidden sm:block">{SITE.email}</span>
    </footer>
  )
}
