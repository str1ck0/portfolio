import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import { getAllProjects, getProjectBySlug, urlFor } from '@/lib/sanity'

export const revalidate = 60

export async function generateStaticParams() {
  const projects = await getAllProjects()
  return projects.map((p) => ({ slug: p.slug.current }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return {}
  return {
    title: `${project.title} — Liam Strickland`,
    description: project.description,
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) notFound()

  return (
    <>
      <Header />
      <main className="pt-16 max-w-4xl mx-auto px-6 pb-24">
        {/* Back */}
        <Link
          href="/"
          className="inline-block text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors mt-10 mb-8"
        >
          <span className="text-xl">⬶ </span>Work
        </Link>

        {/* Title block */}
        <div className="mb-10 pb-8 border-b border-[var(--border)]">
          <h1 className="text-3xl sm:text-4xl font-medium tracking-tight leading-tight">
            {project.title}
          </h1>
          <div className="flex flex-wrap gap-4 mt-3 text-xs text-[var(--fg-muted)]">
            {project.year && <span>{project.year}</span>}
            {project.tags?.map((tag) => (
              <span key={tag} className="uppercase tracking-widest text-[10px]">{tag}</span>
            ))}
          </div>
          {project.description && (
            <p className="mt-5 text-sm leading-relaxed text-[var(--fg-muted)] max-w-prose font-[family-name:var(--font-moonlight)]">
              {project.description}
            </p>
          )}
          {project.links && project.links.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-5">
              {project.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs no-underline hover:opacity-50 transition-opacity"
                >
                  {link.title} ↗
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Video */}
        {project.video && (
          <div className="mb-3">
            <video
              src={project.video}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Images */}
        <div className="flex flex-col gap-3">
          {project.images?.map((image, i) => {
            const w = image.asset.metadata?.dimensions?.width || 1200
            const h = image.asset.metadata?.dimensions?.height || 800
            const src = urlFor(image.asset).width(2400).quality(95).auto('format').url()
            return (
              <div key={image._key}>
                <Image
                  src={src}
                  alt={image.alt || project.title}
                  width={w}
                  height={h}
                  className="w-full h-auto"
                  priority={i === 0}
                  placeholder={image.asset.metadata?.lqip ? 'blur' : 'empty'}
                  blurDataURL={image.asset.metadata?.lqip}
                />
                {image.caption && (
                  <p className="text-xs text-[var(--fg-muted)] mt-2">{image.caption}</p>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </>
  )
}
