import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { ThemeProvider } from '@/components/ThemeProvider'
import PageTransition from '@/components/PageTransition'
import { SITE } from '@/lib/content'
import './globals.css'

// Using Geist as default — swap out variable names once you've chosen your typefaces
const fontSans = localFont({
  src: './fonts/Basteleur-Bold.woff2',
  variable: '--font-sans',
  weight: '100 900',
})

const fontMoonlight = localFont({
  src: './fonts/Basteleur-Moonlight.woff2',
  variable: '--font-moonlight',
})

const fontMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-mono',
  weight: '100 900',
})

const description = 'Independent web development, design & creative direction. Cape Town, remote-first.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'Liam Strickland — Independent web dev & design',
    template: '%s — Liam Strickland',
  },
  description,
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    url: SITE.url,
    title: 'Liam Strickland — Independent web dev & design',
    description,
    locale: 'en_ZA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Liam Strickland — Independent web dev & design',
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
      <body className={`${fontSans.variable} ${fontMoonlight.variable} ${fontMono.variable} font-sans`}>
        <ThemeProvider>
          <PageTransition>
            {children}
          </PageTransition>
        </ThemeProvider>
      </body>
    </html>
  )
}
