import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import { PortableText } from '@portabletext/react'
import { getBlogPostBySlug, getAllBlogPosts, urlFor } from '@/lib/sanity'

export const revalidate = 60

export async function generateStaticParams() {
  const posts = await getAllBlogPosts()
  return posts.map(p => ({ slug: p.slug.current }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return {}
  return {
    title: `${post.title} — Liam Strickland`,
    description: post.excerpt,
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function getYouTubeId(url: string) {
  const m = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  return m?.[1]
}

function getVimeoId(url: string) {
  const m = url.match(/vimeo\.com\/(\d+)/)
  return m?.[1]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const portableTextComponents: Parameters<typeof PortableText>[0]['components'] = {
  types: {
    image: ({ value }: { value: { asset?: { _id?: string; url: string; metadata?: { dimensions?: { width: number; height: number }; lqip?: string } }; crop?: { top: number; bottom: number; left: number; right: number }; hotspot?: { x: number; y: number }; alt?: string; caption?: string } }) => {
      if (!value?.asset?.url) return null
      const { width: origW = 800, height: origH = 600 } = value.asset.metadata?.dimensions || {}
      const width = Math.round(origW * (1 - (value.crop?.left || 0) - (value.crop?.right || 0)))
      const height = Math.round(origH * (1 - (value.crop?.top || 0) - (value.crop?.bottom || 0)))
      return (
        <figure className="my-8">
          <Image
            src={urlFor(value).width(1200).quality(85).auto('format').url()}
            alt={value.alt || ''}
            width={width}
            height={height}
            className="w-full object-cover"
            placeholder={value.asset.metadata?.lqip ? 'blur' : 'empty'}
            blurDataURL={value.asset.metadata?.lqip}
          />
          {value.caption && (
            <figcaption className="mt-2 text-xs text-[var(--fg-muted)] text-center">{value.caption}</figcaption>
          )}
        </figure>
      )
    },
    videoEmbed: ({ value }: { value: { url?: string } }) => {
      if (!value?.url) return null
      const ytId = getYouTubeId(value.url)
      const vimeoId = getVimeoId(value.url)
      if (ytId) {
        return (
          <div className="my-8 aspect-video">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${ytId}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )
      }
      if (vimeoId) {
        return (
          <div className="my-8 aspect-video">
            <iframe
              src={`https://player.vimeo.com/video/${vimeoId}`}
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        )
      }
      return (
        <div className="my-8 aspect-video">
          <video src={value.url} controls className="w-full h-full" />
        </div>
      )
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    codeBlock: ({ value }: { value: { code?: string; language?: string; filename?: string } }) => (
      <div className="my-6">
        {value.filename && (
          <div className="text-xs font-mono text-[var(--fg-muted)] border border-b-0 border-[var(--border)] px-4 py-1.5 rounded-t">
            {value.filename}
          </div>
        )}
        <pre className={`font-mono text-sm overflow-x-auto p-4 border border-[var(--border)] ${value.filename ? 'rounded-b' : 'rounded'} bg-[var(--bg)]`}>
          <code>{value.code}</code>
        </pre>
      </div>
    ),
  },
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) notFound()

  return (
    <>
      <Header />
      <main className="pt-16 max-w-2xl mx-auto px-6 pb-24">
        <div className="mt-12">

          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors mb-10"
          >
            ← Writing
          </Link>

          <article>
            {/* Header */}
            <header className="mb-10 space-y-4">
              <p className="text-xs text-[var(--fg-muted)] uppercase tracking-widest">
                {formatDate(post.publishedAt)}
              </p>
              <h1 className="text-3xl leading-tight tracking-tight">{post.title}</h1>
              {post.excerpt && (
                <p className="text-lg text-[var(--fg-muted)] leading-relaxed font-moonlight">{post.excerpt}</p>
              )}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map(t => (
                    <span key={t} className="text-[10px] uppercase tracking-wider px-2 py-0.5 border border-[var(--border)] rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Featured image */}
            {post.featuredImage && (
              <div className="mb-10">
                <Image
                  src={urlFor(post.featuredImage).width(1200).quality(85).auto('format').url()}
                  alt={post.featuredImage.alt || post.title}
                  width={Math.round((post.featuredImage.asset.metadata?.dimensions?.width || 800) * (1 - (post.featuredImage.crop?.left || 0) - (post.featuredImage.crop?.right || 0)))}
                  height={Math.round((post.featuredImage.asset.metadata?.dimensions?.height || 500) * (1 - (post.featuredImage.crop?.top || 0) - (post.featuredImage.crop?.bottom || 0)))}
                  className="w-full object-cover"
                  placeholder={post.featuredImage.asset.metadata?.lqip ? 'blur' : 'empty'}
                  blurDataURL={post.featuredImage.asset.metadata?.lqip}
                  priority
                />
              </div>
            )}

            {/* Body */}
            {post.body && (
              <div className="font-moonlight prose prose-lg max-w-none text-[var(--fg)] prose-p:text-[var(--fg)] prose-headings:text-[var(--fg)] prose-a:text-[var(--fg)] prose-strong:text-[var(--fg)] prose-code:text-[var(--fg)] prose-blockquote:text-[var(--fg-muted)] prose-blockquote:border-[var(--border)]">
                <PortableText
                  value={post.body as Parameters<typeof PortableText>[0]['value']}
                  components={portableTextComponents}
                />
              </div>
            )}
          </article>

        </div>
      </main>
    </>
  )
}
