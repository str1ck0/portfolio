import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { ThemeProvider } from '@/components/ThemeProvider'
import PageTransition from '@/components/PageTransition'
import { SITE } from '@/lib/content'
import './globals.css'

// Roobert, built from the variable original with the MONO axis pinned to 0 and
// ital pinned per file — keeps the full 300–900 weight range at ~125 KB each.
const fontSans = localFont({
  src: [
    { path: './fonts/Roobert-Upright.woff2', weight: '300 900', style: 'normal' },
    { path: './fonts/Roobert-Italic.woff2', weight: '300 900', style: 'italic' },
  ],
  variable: '--font-sans',
  display: 'swap',
  fallback: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
})

const fontMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-mono',
  weight: '100 900',
})

const description = 'Freelance full-stack web developer and designer. Fast, considered websites and web apps, designed and built end to end — AI-native, remote-first from Cape Town.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'Liam Strickland — Full-stack web developer & designer',
    template: '%s — Liam Strickland',
  },
  description,
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    url: SITE.url,
    title: 'Liam Strickland — Full-stack web developer & designer',
    description,
    locale: 'en_ZA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Liam Strickland — Full-stack web developer & designer',
    description,
  },
  icons: {
    icon: [{ url: '/favicon.ico' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontMono.variable} font-sans`}>
        <ThemeProvider>
          <PageTransition>
            {children}
          </PageTransition>
        </ThemeProvider>
      </body>
    </html>
  )
}
