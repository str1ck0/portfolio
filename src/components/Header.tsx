'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTheme } from './ThemeProvider'
import { useState } from 'react'

function YinYang({ inverted }: { inverted: boolean }) {
  const fg = inverted ? '#f0f0f0' : '#111111'
  const bg = inverted ? '#111111' : '#f0f0f0'
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill={bg} />
      <path d="M50,0 A50,50,0,0,1,50,100 A25,25,0,0,1,50,50 A25,25,0,0,0,50,0" fill={fg} />
      <circle cx="50" cy="25" r="8" fill={fg} />
      <circle cx="50" cy="75" r="8" fill={bg} />
      <circle cx="50" cy="50" r="49" fill="none" stroke={fg} strokeWidth="2" />
    </svg>
  )
}

function WavyMenuIcon() {
  return (
    <svg viewBox="0 0 22 16" width="22" height="16" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M1,2.5 C3.5,0.5 4.5,4.5 7,2.5 C9.5,0.5 10.5,4.5 13,2.5 C15.5,0.5 16.5,4.5 19,2.5 C20.5,1.5 21,2 21,2.5" />
      <path d="M1,8 C3.5,6 4.5,10 7,8 C9.5,6 10.5,10 13,8 C15.5,6 16.5,10 19,8 C20.5,7 21,7.5 21,8" />
      <path d="M1,13.5 C3.5,11.5 4.5,15.5 7,13.5 C9.5,11.5 10.5,15.5 13,13.5 C15.5,11.5 16.5,15.5 19,13.5 C20.5,12.5 21,13 21,13.5" />
    </svg>
  )
}

const NAV_LINKS = [
  { href: '/', label: 'Work', match: (p: string) => p === '/' },
  { href: '/blog', label: 'Thoughts', match: (p: string) => p.startsWith('/blog') },
  { href: '/about', label: 'About', match: (p: string) => p === '/about' },
]

export default function Header({ showStatus }: { showStatus?: boolean }) {
  const { theme, toggle } = useTheme()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav
        className="flex items-center justify-between px-5 sm:px-8 lg:px-14"
        style={{ paddingTop: 26, paddingBottom: 26 }}
      >
        {/* Left: logo + name */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 hover:opacity-60 transition-opacity"
            onClick={() => setMenuOpen(false)}
          >
            <Image src="/logo.png" alt="Logo" width={28} height={28} className="flex-shrink-0" />
            <span className="font-sans leading-none" style={{ fontSize: 22, letterSpacing: 0 }}>
              Liam Strickland
            </span>
          </Link>
          {showStatus && (
            <span
              className="hidden lg:inline font-mono uppercase"
              style={{ fontSize: 11, letterSpacing: '0.08em', color: 'var(--ls-muted)', marginLeft: 14 }}
            >
              Independent web dev & design
            </span>
          )}
        </div>

        {/* Desktop: nav links + yin-yang */}
        <div className="hidden sm:flex items-center gap-[38px] font-sans" style={{ fontSize: 14 }}>
          {NAV_LINKS.map(({ href, label, match }) => (
            <Link
              key={href}
              href={href}
              className={`ls-nav-link${match(pathname) ? ' ls-nav-active' : ''}`}
            >
              {label}
            </Link>
          ))}
          <button
            onClick={toggle}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            className="w-[18px] h-[18px] flex-shrink-0 hover:opacity-50 transition-opacity"
            style={{ animation: 'spin-slow 12s linear infinite' }}
          >
            <YinYang inverted={theme === 'dark'} />
          </button>
        </div>

        {/* Mobile: yin-yang + wavy menu */}
        <div className="flex sm:hidden items-center gap-4">
          <button
            onClick={toggle}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            className="w-[18px] h-[18px] flex-shrink-0 hover:opacity-50 transition-opacity"
            style={{ animation: 'spin-slow 12s linear infinite' }}
          >
            <YinYang inverted={theme === 'dark'} />
          </button>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            className="hover:opacity-50 transition-opacity"
            style={{ color: 'var(--ls-fg)' }}
          >
            <WavyMenuIcon />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="sm:hidden flex flex-col items-end px-6 py-4 gap-4 font-sans border-b"
          style={{ borderColor: 'var(--ls-line-soft)', background: 'var(--ls-bg)', fontSize: 14 }}
        >
          {NAV_LINKS.map(({ href, label, match }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`ls-nav-link${match(pathname) ? ' ls-nav-active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
