import Link from 'next/link'
import Header from '@/components/Header'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="pt-16 flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
        <p className="text-xs text-[var(--fg-muted)] mb-3 uppercase tracking-widest">404</p>
        <p className="text-sm text-[var(--fg-muted)] mb-8">This page doesn&apos;t exist.</p>
        <Link href="/" className="text-sm border-b border-[var(--fg)] pb-px hover:opacity-50 transition-opacity">
          ← Back to work
        </Link>
      </main>
    </>
  )
}
