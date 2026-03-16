import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { ThemeProvider } from '@/components/ThemeProvider'
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

export const metadata: Metadata = {
  title: 'Liam Strickland',
  description: 'Creative technologist — design, code, art, writing.',
  icons: {
    icon: [{ url: '/favicon.ico' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontMoonlight.variable} ${fontMono.variable} font-sans`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
