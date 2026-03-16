'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTheme } from './ThemeProvider'

function YinYang({ inverted }: { inverted: boolean }) {
  const fg = inverted ? '#f0f0f0' : '#111111'
  const bg = inverted ? '#111111' : '#f0f0f0'
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="50" cy="50" r="50" fill={bg} />
      {/* Dark half — top semicircle + lower small circle + upper notch */}
      <path d="M50,0 A50,50,0,0,1,50,100 A25,25,0,0,1,50,50 A25,25,0,0,0,50,0" fill={fg} />
      {/* Small circle in dark half */}
      <circle cx="50" cy="25" r="12" fill={bg} />
      {/* Small circle in light half */}
      <circle cx="50" cy="75" r="12" fill={fg} />
      {/* Outer border */}
      <circle cx="50" cy="50" r="49" fill="none" stroke={fg} strokeWidth="2" />
    </svg>
  )
}

export default function Header() {
  const { theme, toggle } = useTheme()
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[var(--bg)] border-b border-[var(--border)] transition-colors duration-300">
      <Link
        href="/"
        className="flex items-center gap-2.5 hover:opacity-60 transition-opacity"
      >
        <Image src="/logo.png" alt="Logo" width={28} height={28} className="flex-shrink-0" />
        <span className="text-lg font-medium tracking-tight">Liam Strickland</span>
      </Link>

      <nav className="flex items-center gap-6">
        <Link
          href="/"
          className={`text-sm transition-opacity ${
            pathname === '/' ? 'opacity-100' : 'opacity-40 hover:opacity-100'
          }`}
        >
          Work
        </Link>
        <Link
          href="/about"
          className={`text-sm transition-opacity ${
            pathname === '/about' ? 'opacity-100' : 'opacity-40 hover:opacity-100'
          }`}
        >
          About
        </Link>

        {/* Yin-yang theme toggle */}
        <button
          onClick={toggle}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          className="w-[18px] h-[18px] flex-shrink-0 hover:opacity-50 transition-opacity"
          style={{ animation: 'spin-slow 12s linear infinite' }}
        >
          <YinYang inverted={theme === 'dark'} />
        </button>
      </nav>
    </header>
  )
}
