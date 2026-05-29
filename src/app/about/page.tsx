import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SITE, ABOUT } from '@/lib/content'
import { getSiteSettings, urlFor } from '@/lib/sanity'

export const metadata = {
  title: 'About — Liam Strickland',
  description: 'Cape Town-based web developer and designer.',
}

// ─── Slot placeholder for portrait ──────────────────────────────────────────

function PortraitSlot() {
  return (
    <div
      style={{
        aspectRatio: '4/5',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'oklch(0.22 0.02 60)',
        backgroundImage: 'repeating-linear-gradient(45deg, transparent 0 6px, rgba(255,255,255,0.025) 6px 12px)',
        border: '1px solid var(--ls-line-soft)',
      }}
    >
      <span
        style={{
          position: 'absolute', bottom: 8, left: 10,
          fontFamily: 'var(--font-mono)', fontSize: 10,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'var(--ls-fg-dim)',
        }}
      >
        portrait · liam · 2026
      </span>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function AboutPage() {
  const settings = await getSiteSettings()

  return (
    <>
      <Header />

      <main>

        {/* HERO */}
        <div className="px-5 sm:px-8 lg:px-14" style={{ paddingTop: 56 }}>
          <p
            className="font-mono uppercase text-ls-muted m-0"
            style={{ fontSize: 11, letterSpacing: '0.12em' }}
          >
            About me & my work
          </p>
          <h1
            className="font-sans text-ls-fg m-0"
            style={{
              fontSize: 'clamp(40px, 6vw, 72px)',
              lineHeight: 1.04,
              letterSpacing: '-0.01em',
              maxWidth: '18ch',
              marginTop: 16,
            }}
          >
            A small practice for{' '}
            <em className="text-ls-accent" style={{ fontStyle: 'italic' }}>the web</em>{' '}
            and things that exist in{' '}
            <em className="text-ls-accent" style={{ fontStyle: 'italic' }}>physical space.</em>
          </h1>
        </div>

        {/* BODY — two column: bio left, disciplines right */}
        <div
          className="px-5 sm:px-8 lg:px-14 flex flex-col gap-12 sm:grid"
          style={{ paddingTop: 56, paddingBottom: 0, gridTemplateColumns: '1fr 1fr', gap: 80 }}
        >
          {/* Left: bio + CTAs */}
          <div>
            <p className="font-moonlight text-ls-fg m-0" style={{ fontSize: 16, lineHeight: 1.65, maxWidth: '38ch' }}>
              I&apos;m a Cape Town-based creative technologist — I build websites, direct design, and make things that exist in physical space.
            </p>
            <p className="font-moonlight text-ls-fg" style={{ fontSize: 16, lineHeight: 1.65, maxWidth: '38ch', marginTop: 22 }}>
              On the web side I design and develop for artists, studios, and independent brands: considered interfaces, clean code, built to last. Before going independent I spent two years as a frontend instructor at Le Wagon, teaching web development fundamentals and guiding student projects through to production.
            </p>
            <p className="font-moonlight text-ls-fg" style={{ fontSize: 16, lineHeight: 1.65, maxWidth: '38ch', marginTop: 22 }}>
              Away from screens I co-run{' '}
              <a
                href="https://studiopilz.net"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans"
                style={{ fontStyle: 'italic', color: 'var(--ls-accent)' }}
              >
                studio pilz
              </a>{' '}
              with my partner Liz — an ongoing project in CRT and generative media installation, working with obsolete technology, live audiovisual systems, and spaces that feel slightly out of time.
            </p>
            <p className="font-moonlight text-ls-fg" style={{ fontSize: 16, lineHeight: 1.65, maxWidth: '38ch', marginTop: 22, fontWeight: 500 }}>
              Open to web development, design direction, and creative technology projects.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-[14px]" style={{ marginTop: 36 }}>
              <a href={`mailto:${SITE.email}`} className="ls-cta">
                <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                  <rect x="0.5" y="0.5" width="14" height="11" rx="1.5" stroke="currentColor"/>
                  <path d="M1 1.5L7.5 7L14 1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {SITE.email}
              </a>
              <a href={SITE.bookingUrl} target="_blank" rel="noopener noreferrer" className="ls-cta font-moonlight">
                Book a call ↗
              </a>
            </div>
          </div>

          {/* Right: disciplines + elsewhere + clients */}
          <div>
            {/* Disciplines */}
            <p className="font-mono uppercase text-ls-muted m-0" style={{ fontSize: 11, letterSpacing: '0.14em' }}>
              Disciplines
            </p>
            <ol style={{ listStyle: 'none', padding: 0, margin: '20px 0 0', fontFamily: 'var(--font-sans)', fontSize: 'clamp(20px, 2.5vw, 28px)', lineHeight: 1.5 }}>
              {ABOUT.disciplines.map((disc, i) => (
                <li
                  key={disc}
                  className="flex items-baseline gap-[14px] border-t border-ls-line-soft"
                  style={{ padding: '12px 0', borderBottom: i === ABOUT.disciplines.length - 1 ? '1px solid var(--ls-line-soft)' : undefined }}
                >
                  <span className="font-mono text-ls-muted flex-shrink-0" style={{ fontSize: 11, letterSpacing: '0.06em' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-ls-fg">{disc}</span>
                </li>
              ))}
            </ol>

            {/* Elsewhere */}
            <p className="font-mono uppercase text-ls-muted m-0" style={{ fontSize: 11, letterSpacing: '0.14em', marginTop: 48 }}>
              Elsewhere
            </p>
            <div
              className="grid font-sans text-ls-fg"
              style={{ gridTemplateColumns: '1fr 1fr', gap: '6px 24px', marginTop: 16, fontSize: 15 }}
            >
              {ABOUT.social.map(({ label, url }) => (
                <a
                  key={label}
                  href={url}
                  target={url.startsWith('http') ? '_blank' : undefined}
                  rel={url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="ls-hover-link"
                >
                  {label} ↗
                </a>
              ))}
            </div>

            {/* Clients */}
            <p className="font-mono uppercase text-ls-muted m-0" style={{ fontSize: 11, letterSpacing: '0.14em', marginTop: 48 }}>
              Clients &amp; collaborators
            </p>
            <p
              className="font-moonlight text-ls-fg-dim"
              style={{ fontSize: 15, lineHeight: 1.7, marginTop: 14, maxWidth: '44ch' }}
            >
              {ABOUT.clients}
            </p>
          </div>
        </div>

        {/* PORTRAIT + COLOPHON */}
        <div
          className="px-5 sm:px-8 lg:px-14 flex flex-col gap-12 sm:grid sm:items-end"
          style={{ paddingTop: 32, paddingBottom: 64, gridTemplateColumns: '1fr 1fr', gap: 56 }}
        >
          {settings?.aboutPortrait?.asset?.url ? (
            <div style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden' }}>
              <Image
                src={urlFor(settings.aboutPortrait).width(1200).quality(88).auto('format').url()}
                alt={settings.aboutPortrait.alt || 'Liam Strickland'}
                fill
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
              />
            </div>
          ) : (
            <PortraitSlot />
          )}

          <div>
            {/* <p className="font-mono uppercase text-ls-muted m-0" style={{ fontSize: 11, letterSpacing: '0.14em' }}>
              Colophon
            </p> */}
            {/* <p className="font-moonlight text-ls-fg-dim" style={{ fontSize: 15, lineHeight: 1.7, marginTop: 14, maxWidth: '42ch' }}>
              This site is set in <em style={{ fontStyle: 'italic', color: 'var(--ls-fg)' }}>Basteleur</em> and Geist Mono.
              Built in Next.js, content in Sanity, hosted on Vercel.
              The accent is a slightly-off CRT phosphor green.
            </p> */}
            <p className="font-moonlight text-ls-fg-dim" style={{ fontSize: 15, lineHeight: 1.7, marginTop: 12, maxWidth: '42ch' }}>
              © 2026 Liam Strickland
            </p>
          </div>
        </div>

      </main>

      <Footer>↗ last updated · May 2026</Footer>
    </>
  )
}
