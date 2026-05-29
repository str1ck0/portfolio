import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FadeUp from '@/components/FadeUp'
import DotGrid from '@/components/DotGrid'
import {
  getIndexProjects,
  getArchiveProjects,
  getRecentPosts,
  getSiteSettings,
  urlFor,
  type IndexProject,
  type ArchiveProject,
  type RecentPost,
} from '@/lib/sanity'

export const revalidate = 60

// ─── Slot placeholder ──────────────────────────────────────────────────────

function Slot({ label, tone = 'default', className, style }: {
  label?: string
  tone?: 'default' | 'warm' | 'mossy'
  className?: string
  style?: React.CSSProperties
}) {
  const bg =
    tone === 'warm' ? 'oklch(0.22 0.02 60)' :
    tone === 'mossy' ? 'oklch(0.22 0.02 140)' :
    'var(--ls-bg-elev)'

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: bg,
        backgroundImage: 'repeating-linear-gradient(45deg, transparent 0 6px, rgba(255,255,255,0.025) 6px 12px)',
        border: '1px solid var(--ls-line-soft)',
        ...style,
      }}
    >
      {label && (
        <span
          style={{
            position: 'absolute', bottom: 8, left: 10,
            fontFamily: 'var(--font-mono)', fontSize: 10,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--ls-fg-dim)',
          }}
        >
          {label}
        </span>
      )}
    </div>
  )
}

// ─── Project index row ──────────────────────────────────────────────────────

function ProjectRow({ project, n, total }: {
  project: IndexProject
  n: number
  total: number
}) {
  const num = String(n).padStart(2, '0')
  const tot = String(total).padStart(2, '0')
  const hasImage = !!project.cover?.asset?.url

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group relative border-t border-ls-line-soft block"
    >
      {/* Hover bg overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[250ms] pointer-events-none"
        style={{ background: 'oklch(0.18 0.008 70)' }}
      />

      {/* Row grid */}
      <div
        className="ls-project-row-grid relative px-5 sm:px-8 lg:px-14 py-[22px] grid items-center gap-4 md:gap-6"
      >
        {/* Number */}
        <span className="font-mono text-ls-muted" style={{ fontSize: 11, letterSpacing: '0.05em' }}>
          {num} / {tot}
        </span>

        {/* Title */}
        <span
          className="font-sans text-ls-fg group-hover:text-ls-accent transition-colors duration-200"
          style={{ fontSize: 'clamp(18px, 2.2vw, 30px)', lineHeight: 1.1, letterSpacing: '-0.01em' }}
        >
          {project.title}
        </span>

        {/* Role */}
        <span className="font-mono text-ls-fg-dim hidden md:block" style={{ fontSize: 11, letterSpacing: '0.06em' }}>
          {project.role}
        </span>

        {/* Kind */}
        <span className="font-mono text-ls-fg-dim hidden md:block" style={{ fontSize: 11, letterSpacing: '0.06em' }}>
          {project.kind}
        </span>

        {/* Year */}
        <span className="font-mono text-ls-fg-dim text-right" style={{ fontSize: 11, letterSpacing: '0.06em' }}>
          {project.year} →
        </span>
      </div>

      {/* Peek image */}
      <div
        className="absolute top-1/2 hidden md:block pointer-events-none z-10
          -translate-x-1/2 -translate-y-1/2
          opacity-0 scale-[0.96]
          group-hover:opacity-100 group-hover:scale-100
          transition-all duration-[350ms] ease-[cubic-bezier(.2,.7,.3,1)]"
        style={{ left: '60%', width: 480, height: 300 }}
      >
        {hasImage ? (
          <Image
            src={urlFor(project.cover!).width(960).quality(85).auto('format').url()}
            alt={project.cover!.alt || project.title}
            width={480}
            height={300}
            className="w-full h-full object-cover"
            style={{ border: '1px solid var(--ls-line-soft)' }}
          />
        ) : (
          <Slot label={project.title.toLowerCase()} tone="warm" style={{ width: '100%', height: '100%' }} />
        )}
      </div>
    </Link>
  )
}

// ─── Recently entry ─────────────────────────────────────────────────────────

function RecentEntry({ post }: { post: RecentPost }) {
  const d = new Date(post.publishedAt)
  const dateStr = `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getFullYear()).slice(-2)}`
  const cta = post.cta || (post.kind === 'Launch' ? 'View project →' : post.kind === 'Studio log' ? 'Continue →' : 'Read more →')
  const href = `/blog/${post.slug}`

  return (
    <li
      className="ls-recent-entry-grid grid items-start border-b border-ls-line-soft"
      style={{ padding: '24px 0' }}
    >
      {/* Date + kind */}
      <div>
        <p className="font-mono text-ls-muted m-0" style={{ fontSize: 11, letterSpacing: '0.08em' }}>
          {dateStr}
        </p>
        {post.kind && (
          <p className="font-mono uppercase text-ls-accent m-0" style={{ fontSize: 10.5, letterSpacing: '0.14em', marginTop: 10 }}>
            [{post.kind}]
          </p>
        )}
      </div>

      {/* Title + lead + CTA */}
      <div>
        <Link href={href} className="ls-hover-link font-sans block text-ls-fg" style={{ fontSize: 'clamp(20px, 2.5vw, 30px)', lineHeight: 1.15, letterSpacing: '-0.005em' }}>
          {post.title}
        </Link>
        {post.excerpt && (
          <p className="font-moonlight text-ls-fg-dim" style={{ margin: '10px 0 0', fontSize: 15, lineHeight: 1.6, maxWidth: '50ch' }}>
            {post.excerpt}
          </p>
        )}
        <Link href={href} className="ls-hover-link font-mono uppercase text-ls-accent inline-block" style={{ marginTop: 14, fontSize: 11, letterSpacing: '0.08em' }}>
          {cta}
        </Link>
      </div>

      {/* Thumbnail */}
      <div className="hidden md:block">
        {post.cover?.asset?.url ? (
          <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
            <Image
              src={urlFor(post.cover).width(480).quality(85).auto('format').url()}
              alt={post.cover.alt || post.title}
              width={240}
              height={180}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <Slot style={{ aspectRatio: '4/3' }} />
        )}
      </div>
    </li>
  )
}

// ─── Archive row ─────────────────────────────────────────────────────────────

function ArchiveRow({ item }: { item: ArchiveProject }) {
  return (
    <li
      className="grid items-baseline border-b border-ls-line-soft"
      style={{ gridTemplateColumns: '50px 1fr 120px', gap: 16, padding: '16px 0' }}
    >
      <span className="font-mono text-ls-muted" style={{ fontSize: 11, letterSpacing: '0.08em' }}>
        {item.year}
      </span>
      <div>
        <Link href={`/work/${item.slug}`} className="ls-hover-link font-sans text-ls-fg" style={{ fontSize: 20, lineHeight: 1.25 }}>
          {item.title}
        </Link>
        {item.role && (
          <p className="font-mono uppercase text-ls-muted m-0" style={{ fontSize: 10.5, letterSpacing: '0.08em', marginTop: 4 }}>
            {item.role}
          </p>
        )}
      </div>
      <span className="font-mono uppercase text-ls-muted text-right" style={{ fontSize: 10.5, letterSpacing: '0.08em' }}>
        {item.kind}
      </span>
    </li>
  )
}

// ─── Marquee config ──────────────────────────────────────────────────────────

const marqueeItems = [
  'full-stack web development',
  'graphic design',
  'creative direction',
  'event production',
  'full-stack web development',
  'graphic design',
  'creative direction',
  'event production',
]

const marqueeColors = {
  background: 'oklch(0.48 0.08 142)',
  text: '',
  separator: 'inherit',
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function Home() {
  const [projects, archive, posts, settings] = await Promise.all([
    getIndexProjects(),
    getArchiveProjects(),
    getRecentPosts(),
    getSiteSettings(),
  ])

  const total = projects.length

  return (
    <>
      <Header showStatus />

      <main>

        {/* INTRO */}
        <div
          className="relative px-5 sm:px-8 lg:px-14 flex flex-col gap-8 lg:grid lg:gap-20 lg:items-end"
          style={{ paddingTop: 'clamp(80px, 10vw, 140px)', paddingBottom: 'clamp(80px, 10vw, 140px)', gridTemplateColumns: '1.4fr 1fr', overflow: 'hidden' }}
        >
          <DotGrid className="absolute inset-0" style={{ zIndex: 0 }} />
          <FadeUp delay={0.05} style={{ position: 'relative', zIndex: 1 }}>
            <h1 className="font-sans m-0" style={{ fontSize: 'clamp(30px, 4vw, 64px)', lineHeight: 1.1, letterSpacing: '-0.01em', maxWidth: '16ch' }}>
              Bespoke web development, design & creative direction{' '}
              {/* <em className="text-ls-accent" style={{ fontStyle: 'italic' }}>spaces out of time</em>. */}
            </h1>
          </FadeUp>
          <FadeUp delay={0.15} style={{ position: 'relative', zIndex: 1 }}>
            <div>
              <p className="font-mono uppercase text-ls-muted m-0" style={{ fontSize: 11, letterSpacing: '0.12em' }}>
                📍 Cape Town · Remote first · Freelance
              </p>
              <p className="font-moonlight text-ls-fg-dim" style={{ fontSize: 15, lineHeight: 1.55, margin: '12px 0 0', maxWidth: '42ch' }}>
                Considered websites and design direction for creatives, studios and independent brands.{' '}
                {/* <span className="text-ls-fg">studio pilz</span>. */}
              </p>
              <a
                href="#selected-work"
                className="ls-scroll-cta font-mono uppercase inline-flex items-center gap-[10px] text-ls-muted"
                style={{ marginTop: 28, marginBottom: 12,fontSize: 16, letterSpacing: '0.12em', textDecoration: 'none' }}
              >
                Explore my work
                <span className="ls-bounce-arrow">↓</span>
              </a>
            </div>
          </FadeUp>
        </div>

        {/* PROJECT INDEX */}
        <div id="selected-work">
          <div className="flex justify-between items-baseline px-5 sm:px-8 lg:px-14" style={{ paddingBottom: 16, marginTop: 20 }}>
            <p className="font-mono uppercase text-ls-muted m-0" style={{ fontSize: 11, letterSpacing: '0.12em' }}>
              Selected projects
            </p>
            <p className="font-mono uppercase text-ls-muted m-0 hidden md:block" style={{ fontSize: 11, letterSpacing: '0.12em' }}>
              {/* {String(total).padStart(2, '0')} projects · hover for preview */}
              (2022-2026)
            </p>
          </div>

          {projects.map((p, i) => (
            <FadeUp key={p._id} delay={i * 0.06}>
              <ProjectRow project={p} n={i + 1} total={total} />
            </FadeUp>
          ))}

          <div className="border-t border-ls-line-soft" />
        </div>

        {/* AVAILABLE RIBBON */}
        <FadeUp>
        <div style={{ paddingTop: 72 }}>
          <p
            className="font-mono uppercase text-ls-muted m-0 px-5 sm:px-8 lg:px-14"
            style={{ fontSize: 11, letterSpacing: '0.12em', paddingBottom: 20 }}
          >
            Taking on new projects for Q3 / Q4 2026
          </p>
          <div style={{ overflow: 'hidden', background: marqueeColors.background, padding: '8px 0' }}>
          <div
            className="ls-marquee-track uppercase"
            style={{
              fontSize: 'clamp(20px, 1.2vw, 72px)',
              lineHeight: 1.2,
              letterSpacing: '0.04em',
              color: marqueeColors.text,
            }}
          >
            {[0, 1].map((i) => (
              <span key={i} style={{ whiteSpace: 'nowrap', paddingRight: '0em' }}>
                {marqueeItems.map((item, j) => (
                  <span key={j}>
                    {item}
                    <span style={{ padding: '0 0.4em', color: marqueeColors.separator, fontSize: '0.8em' }}>✦</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
          </div>
        </div>
        </FadeUp>

        {/* RECENTLY */}
        {posts.length > 0 && (
          <FadeUp>
          <div className="px-5 sm:px-8 lg:px-14" style={{ paddingTop: 'clamp(72px, 8vw, 120px)' }}>
            <div className="flex justify-between items-baseline border-b border-ls-line-soft" style={{ paddingBottom: 16 }}>
              <h2 className="font-sans text-ls-fg m-0" style={{ fontSize: 'clamp(32px, 4vw, 48px)', letterSpacing: '-0.01em' }}>
                Recently
              </h2>
              <Link href="/blog" className="ls-nav-link font-mono uppercase text-ls-muted hidden sm:block" style={{ fontSize: 11, letterSpacing: '0.12em' }}>
                All writing &amp; notes →
              </Link>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {posts.map((post, i) => (
                <FadeUp key={post._id} delay={i * 0.08}>
                  <RecentEntry post={post} />
                </FadeUp>
              ))}
            </ul>
          </div>
          </FadeUp>
        )}

        {/* TYPOGRAPHIC BREAK
        <FadeUp>
        <div className="px-5 sm:px-8 lg:px-14" style={{ paddingTop: 100 }}>
          <div className="flex items-center gap-6">
            <div className="flex-1" style={{ height: 1, background: 'var(--ls-line-soft)' }} />
            <span className="inline-flex items-center gap-[18px] text-ls-fg-dim">
              <span style={{ fontSize: 14 }}>✦</span>
              <span style={{ fontSize: 9, opacity: 0.7 }}>◯</span>
              <span style={{ fontSize: 14 }}>✦</span>
            </span>
            <div className="flex-1" style={{ height: 1, background: 'var(--ls-line-soft)' }} />
          </div>
          <p className="font-sans text-ls-fg-dim text-center m-0" style={{ fontStyle: 'italic', fontSize: 22, marginTop: 22 }}>
            Older work, smaller things — the earlier years.
          </p>
        </div>
        </FadeUp> */}

        {/* ARCHIVE */}
        {archive.length > 0 && (
          <FadeUp>
          <div className="px-5 sm:px-8 lg:px-14" style={{ paddingTop: 60 }}>
            <div className="flex justify-between items-baseline border-b border-ls-line-soft" style={{ paddingBottom: 16 }}>
              <h2 className="font-sans text-ls-fg m-0" style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', letterSpacing: '-0.01em' }}>
                Archive
              </h2>
              <span className="font-mono uppercase text-ls-muted hidden sm:block" style={{ fontSize: 11, letterSpacing: '0.12em' }}>
                {archive[archive.length - 1]?.year} — {archive[0]?.year} · {String(archive.length).padStart(2, '0')} items
              </span>
            </div>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', columnGap: 56 }}>
              {[0, 1].map((col) => {
                const half = Math.ceil(archive.length / 2)
                const items = archive.slice(col * half, col * half + half)
                return (
                  <ul key={col} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {items.map((item) => <ArchiveRow key={item._id} item={item} />)}
                  </ul>
                )
              })}
            </div>
          </div>
          </FadeUp>
        )}

        {/* PORTRAIT + SHORT BIO */}
        <FadeUp>
        <div
          className="px-5 sm:px-8 lg:px-14 flex flex-col-reverse gap-12 sm:grid sm:gap-20 sm:items-center"
          style={{ paddingTop: 'clamp(64px, 8vw, 120px)', gridTemplateColumns: '320px 1fr' }}
        >
          {settings?.homepagePortrait?.asset?.url ? (
            <div style={{ position: 'relative', width: '100%', height: 400 }}>
              <Image
                src={urlFor(settings.homepagePortrait).width(640).quality(88).auto('format').url()}
                alt={settings.homepagePortrait.alt || 'Liam Strickland'}
                fill
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
              />
            </div>
          ) : (
            <Slot label="portrait · liam · 2026" tone="warm" style={{ width: '100%', height: 400 }} />
          )}
          <div>
            <p className="font-mono uppercase text-ls-muted m-0" style={{ fontSize: 11, letterSpacing: '0.12em' }}>
              who am i?
            </p>
            <p
              className="font-sans text-ls-fg m-0"
              style={{ fontSize: 'clamp(24px, 3vw, 40px)', lineHeight: 1.2, marginTop: 16, maxWidth: '22ch', letterSpacing: '-0.005em' }}
            >
              I&apos;m a freelance{' '}
              <em className="text-ls-accent" style={{ fontStyle: 'italic' }}>
                web developer, graphic designer and artist
              </em>{' '}
              working across screens and ephemeral spaces.
            </p>
            <div className="flex flex-wrap gap-[14px]" style={{ marginTop: 36 }}>
              <a href="mailto:hello@liamstrickland.dev" className="ls-cta font-moonlight">
                <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                  <rect x="0.5" y="0.5" width="14" height="11" rx="1.5" stroke="currentColor"/>
                  <path d="M1 1.5L7.5 7L14 1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                hello@liamstrickland.dev
              </a>
              <Link href="/about" className="ls-cta font-moonlight">
                About me →
              </Link>
            </div>
          </div>
        </div>
        </FadeUp>

      </main>

      <div style={{ marginTop: 'clamp(56px, 7vw, 96px)' }}>
        <Footer>website made with ♥ by LS</Footer>
      </div>
    </>
  )
}
