import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProjectImages from '@/components/ProjectImages'
import Reveal from '@/components/Reveal'
import {
  getAllProjects,
  getProjectBySlug,
  getProjectNav,
  urlFor,
  type ProjectDetail,
  type SanityImage,
  type CaseStudyBlock,
} from '@/lib/sanity'

export const revalidate = 60

export async function generateStaticParams() {
  const projects = await getAllProjects()
  return projects.map((p) => ({ slug: p.slug.current }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return {}
  const description = project.blurb || project.description
  const ogImage = project.cover?.asset?.url
    ? urlFor(project.cover).width(1200).height(630).fit('crop').auto('format').url()
    : undefined
  return {
    title: project.title,
    description,
    openGraph: {
      type: 'article',
      title: project.title,
      description,
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: project.title }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function SanityImg({ img, className, style, priority }: {
  img: SanityImage
  className?: string
  style?: React.CSSProperties
  priority?: boolean
}) {
  const origW = img.asset.metadata?.dimensions?.width || 800
  const origH = img.asset.metadata?.dimensions?.height || 600
  const w = Math.round(origW * (1 - (img.crop?.left || 0) - (img.crop?.right || 0)))
  const h = Math.round(origH * (1 - (img.crop?.top || 0) - (img.crop?.bottom || 0)))

  return (
    <Image
      src={urlFor(img).width(1400).quality(88).auto('format').url()}
      alt={img.alt || ''}
      width={w}
      height={h}
      className={className}
      style={style}
      placeholder={img.asset.metadata?.lqip ? 'blur' : 'empty'}
      blurDataURL={img.asset.metadata?.lqip}
      priority={priority}
    />
  )
}

// ─── Portable text components for body blocks ────────────────────────────────

function buildPortableTextComponents(sectionCount: { n: number }) {
  return {
    block: {
      normal: ({ children }: { children?: React.ReactNode }) => (
        <p className="font-moonlight text-ls-fg-dim ls-prose" style={{ fontSize: 15.5, lineHeight: 1.65, maxWidth: '60ch', margin: '0 0 1em' }}>
          {children}
        </p>
      ),
    },
    types: {
      sectionHeading: ({ value }: { value: { heading: string } }) => {
        const n = ++sectionCount.n
        return (
          <h4
            className="font-mono uppercase text-ls-muted"
            style={{ fontSize: 10.5, letterSpacing: '0.14em', marginBottom: 12, marginTop: 0 }}
          >
            — {String(n).padStart(2, '0')} / {value.heading}
          </h4>
        )
      },
      monoQuote: ({ value }: { value: { text: string } }) => (
        <p
          className="font-mono text-ls-fg"
          style={{ fontSize: 13, letterSpacing: '0.06em', lineHeight: 1.6, maxWidth: '50ch', margin: '0 0 1em' }}
        >
          → {value.text}
        </p>
      ),
      pairedImages: ({ value }: { value: { imageA?: SanityImage; imageB?: SanityImage } }) => (
        <div className="ls-cs-wide ls-cs-pair">
          {value.imageA?.asset && (
            <div style={{ aspectRatio: '4/5', overflow: 'hidden' }}>
              <SanityImg img={value.imageA} className="w-full h-full object-cover" />
            </div>
          )}
          {value.imageB?.asset && (
            <div style={{ aspectRatio: '4/5', overflow: 'hidden' }}>
              <SanityImg img={value.imageB} className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      ),
      fullBleedImage: ({ value }: { value: { image?: SanityImage } }) => (
        value.image?.asset ? (
          <div className="ls-cs-wide" style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
            <SanityImg img={value.image} className="w-full h-full object-cover" />
          </div>
        ) : null
      ),
    },
  }
}

// ─── Meta row ────────────────────────────────────────────────────────────────

function MetaRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div
      className="flex justify-between gap-3 font-mono"
      style={{ padding: '6px 0', borderBottom: '1px dashed var(--ls-line-soft)', fontSize: 11 }}
    >
      <span className="uppercase text-ls-muted" style={{ letterSpacing: '0.1em' }}>{label}</span>
      <span className="text-ls-fg">{value}</span>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [project, allNav] = await Promise.all([
    getProjectBySlug(slug),
    getProjectNav(),
  ])

  if (!project) notFound()

  // Find next project (wraps around)
  const idx = allNav.findIndex((p) => p.slug === slug)
  const next = allNav[idx + 1] || allNav[0]

  const tech = project.technologies?.join(' · ')
  const kindNum = allNav.findIndex((p) => p.slug === slug) + 1

  // Determine if we have new-style body content
  const hasBody = project.body && project.body.length > 0
  const sectionCount = { n: 0 }

  return (
    <>
      <Header />

      <main>

        {/* BREADCRUMB */}
        <div className="px-5 sm:px-8 lg:px-14 flex items-center gap-[14px]">
          <Link
            href="/"
            className="font-mono uppercase text-ls-muted"
            style={{ fontSize: 11, letterSpacing: '0.1em' }}
          >
            ← Work
          </Link>
          <span className="font-mono text-ls-muted" style={{ fontSize: 11 }}>/</span>
          <span className="font-mono uppercase text-ls-fg-dim" style={{ fontSize: 11, letterSpacing: '0.1em' }}>
            {String(kindNum).padStart(2, '0')} · {project.kind || 'Project'}
          </span>
        </div>

        {/* TITLE BLOCK */}
        <div
          className="ls-cs ls-cs-title px-5 sm:px-8 lg:px-14 border-b border-ls-line-soft"
          style={{ paddingTop: 56, paddingBottom: 56 }}
        >
          <h1
            className="font-sans text-ls-fg m-0"
            style={{ fontSize: 'clamp(48px, 7vw, 88px)', lineHeight: 0.96, letterSpacing: '-0.015em' }}
          >
            {project.title.includes('—') ? (
              <>
                {project.title.split('—')[0].trim()} —<br />
                <em className="text-ls-accent" style={{ fontStyle: 'italic' }}>
                  {project.title.split('—')[1]?.trim()}
                </em>
              </>
            ) : (
              project.title
            )}
          </h1>

          {/* Meta block */}
          <div className="w-full">
            <MetaRow label="Year" value={project.year?.toString()} />
            <MetaRow label="Discipline" value={project.kind} />
            <MetaRow label="Role" value={project.role} />
            <MetaRow label="With" value={project.collaborators} />
            <MetaRow label="Tech" value={tech} />
            {project.links && project.links.length > 0 && (
              <div style={{ paddingTop: 16 }}>
                {project.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ls-hover-link font-mono text-ls-muted block"
                    style={{ fontSize: 11, letterSpacing: '0.08em', marginBottom: 4 }}
                  >
                    {link.title} ↗
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* LEAD IMAGE */}
        {(project.cover?.asset?.url || project.video) && (
          <Reveal className="px-5 sm:px-8 lg:px-14" style={{ marginTop: 32 }}>
            {project.video ? (
              <video
                src={project.video}
                autoPlay muted loop playsInline
                className="w-full h-auto"
                style={{ aspectRatio: '16/8', objectFit: 'cover' }}
              />
            ) : project.cover?.asset?.url && (
              <div style={{ aspectRatio: '16/8', overflow: 'hidden' }}>
                <SanityImg
                  img={project.cover}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            )}
          </Reveal>
        )}

        {/* BODY — new case study format */}
        {hasBody && (
          <Reveal>
            <CaseStudyBody project={project} sectionCount={sectionCount} />
          </Reveal>
        )}

        {/* Image grid — shown after body if both exist, or standalone for legacy projects */}
        {project.images && project.images.length > 0 && (
          <Reveal className="px-5 sm:px-8 lg:px-14" style={{ marginTop: 56 }}>
            {!hasBody && (project.blurb || project.description) ? (
              <p
                className="font-sans text-ls-fg"
                style={{ fontSize: 24, lineHeight: 1.3, maxWidth: '30ch', marginBottom: 40 }}
              >
                {project.blurb || project.description}
              </p>
            ) : null}
            <ProjectImages images={project.images} projectTitle={project.title} />
          </Reveal>
        )}

        {/* NEXT PROJECT */}
        {next && next.slug !== slug && (
          <Reveal
            className="px-5 sm:px-8 lg:px-14 flex justify-between items-end border-t border-ls-line-soft"
            style={{ paddingTop: 96, paddingBottom: 56, marginTop: 96 }}
          >
            <div>
              <p className="font-mono uppercase text-ls-muted m-0" style={{ fontSize: 11, letterSpacing: '0.12em' }}>
                Next →
              </p>
              <h3
                className="font-sans text-ls-fg m-0"
                style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', marginTop: 10, letterSpacing: '-0.01em' }}
              >
                {next.title}
              </h3>
              <p className="font-mono text-ls-muted m-0" style={{ fontSize: 11, letterSpacing: '0.08em', marginTop: 8 }}>
                {next.role}{next.role && next.year ? ' · ' : ''}{next.year}
              </p>
            </div>
            <Link href={`/work/${next.slug}`} className="ls-cta">
              Continue →
            </Link>
          </Reveal>
        )}

      </main>

      <Footer>↗ © 2026 · all images unless noted</Footer>
    </>
  )
}

// ─── Case study body layout ──────────────────────────────────────────────────

function CaseStudyBody({ project, sectionCount }: {
  project: ProjectDetail
  sectionCount: { n: number }
}) {
  if (!project.body) return null

  // Split body blocks into "sections" separated by sectionHeadings
  // Render as: lead (first non-section block) + right column of sections
  // For now, render all blocks linearly in the two-column layout
  const leadText = project.blurb || project.description
  const components = buildPortableTextComponents(sectionCount)

  return (
    <div
      className="ls-cs ls-cs-grid px-5 sm:px-8 lg:px-14"
      style={{ paddingTop: 'clamp(56px, 8vw, 96px)' }}
    >
      {/* Lead */}
      <div>
        {leadText && (
          <p
            className="font-sans text-ls-fg"
            style={{ fontSize: 'clamp(20px, 4vw, 24px)', lineHeight: 1.3, maxWidth: '30ch', margin: 0 }}
          >
            {leadText}
          </p>
        )}
      </div>

      {/* Body sections */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 36 }}>
        <PortableText
          value={project.body as Parameters<typeof PortableText>[0]['value']}
          components={components as Parameters<typeof PortableText>[0]['components']}
        />
      </div>
    </div>
  )
}
