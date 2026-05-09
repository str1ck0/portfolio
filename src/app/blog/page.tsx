'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import { getAllBlogPosts, type BlogPost } from '@/lib/sanity'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    getAllBlogPosts().then(setPosts)
  }, [])

  const filtered = posts.filter(p => {
    const q = query.toLowerCase()
    return (
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.excerpt?.toLowerCase().includes(q) ||
      p.tags?.some(t => t.toLowerCase().includes(q))
    )
  })

  return (
    <>
      <Header />
      <main className="pt-16 max-w-2xl mx-auto px-6 pb-24">
        <div className="mt-16 space-y-12">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h1 className="text-2xl tracking-tight">Writing</h1>
            <input
              type="search"
              placeholder="Search..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full sm:w-56 text-sm bg-transparent border-b border-[var(--border)] pb-1 outline-none placeholder:text-[var(--fg-muted)] focus:border-[var(--fg)] transition-colors"
            />
          </div>

          {filtered.length === 0 && (
            <p className="text-sm text-[var(--fg-muted)]">
              {posts.length === 0 ? 'No posts yet.' : 'No results.'}
            </p>
          )}

          <ul className="divide-y divide-[var(--border)]">
            {filtered.map(post => (
              <li key={post._id}>
                <Link
                  href={`/blog/${post.slug.current}`}
                  className="group flex gap-5 py-8 hover:opacity-80 transition-opacity"
                >
                  {post.featuredImage && (
                    <div className="flex-shrink-0 w-24 h-24 overflow-hidden">
                      <Image
                        src={post.featuredImage.asset.url}
                        alt={post.featuredImage.alt || post.title}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                        placeholder={post.featuredImage.asset.metadata?.lqip ? 'blur' : 'empty'}
                        blurDataURL={post.featuredImage.asset.metadata?.lqip}
                      />
                    </div>
                  )}
                  <div className="flex flex-col justify-center gap-1.5 min-w-0">
                    <p className="text-xs text-[var(--fg-muted)]">{formatDate(post.publishedAt)}</p>
                    <h2 className="text-base font-medium leading-snug">{post.title}</h2>
                    {post.excerpt && (
                      <p className="text-sm text-[var(--fg-muted)] line-clamp-2 leading-relaxed">{post.excerpt}</p>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {post.tags.map(t => (
                          <span key={t} className="text-[10px] uppercase tracking-wider px-2 py-0.5 border border-[var(--border)] rounded-full">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>

        </div>
      </main>
    </>
  )
}
