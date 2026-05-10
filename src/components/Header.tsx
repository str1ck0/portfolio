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

export default function Header() {
  const { theme, toggle } = useTheme()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[var(--bg)] border-b border-[var(--border)] transition-colors duration-300">
        <Link
          href="/"
          className="flex items-center gap-2.5 hover:opacity-60 transition-opacity"
          onClick={() => setMenuOpen(false)}
        >
          <Image src="/logo.png" alt="Logo" width={28} height={28} className="flex-shrink-0" />
          <span className="text-lg font-medium tracking-tight">Liam Strickland</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm transition-opacity ${
              pathname === '/' ? 'opacity-100' : 'opacity-40 hover:opacity-100'
            }`}
          >
            Work
          </Link>
          <Link
            href="/blog"
            className={`text-sm transition-opacity ${
              pathname.startsWith('/blog') ? 'opacity-100' : 'opacity-40 hover:opacity-100'
            }`}
          >
            Thoughts
          </Link>
          <Link
            href="/about"
            className={`text-sm transition-opacity ${
              pathname === '/about' ? 'opacity-100' : 'opacity-40 hover:opacity-100'
            }`}
          >
            About
          </Link>
          <button
            onClick={toggle}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            className="w-[18px] h-[18px] flex-shrink-0 hover:opacity-50 transition-opacity"
            style={{ animation: 'spin-slow 12s linear infinite' }}
          >
            <YinYang inverted={theme === 'dark'} />
          </button>
        </nav>

        {/* Mobile: yin-yang + wavy menu toggle */}
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
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            className="hover:opacity-50 transition-opacity"
          >
            <WavyMenuIcon />
          </button>
        </div>
      </header>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="fixed top-[61px] left-0 right-0 z-40 sm:hidden bg-[var(--bg)] border-b border-[var(--border)] flex flex-col items-end px-6 py-4 gap-4 transition-colors duration-300">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className={`text-sm transition-opacity ${
              pathname === '/' ? 'opacity-100' : 'opacity-40 hover:opacity-100'
            }`}
          >
            Work
          </Link>
          <Link
            href="/blog"
            onClick={() => setMenuOpen(false)}
            className={`text-sm transition-opacity ${
              pathname.startsWith('/blog') ? 'opacity-100' : 'opacity-40 hover:opacity-100'
            }`}
          >
            Blog
          </Link>
          <Link
            href="/about"
            onClick={() => setMenuOpen(false)}
            className={`text-sm transition-opacity ${
              pathname === '/about' ? 'opacity-100' : 'opacity-40 hover:opacity-100'
            }`}
          >
            About
          </Link>
        </div>
      )}
    </>
  )
}
