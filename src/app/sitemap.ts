import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/content'
import { getAllProjects } from '@/lib/sanity'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, priority: 1 },
    { url: `${base}/about`, lastModified: now, priority: 0.8 },
  ]

  const projects = await getAllProjects()
  const workRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${base}/work/${p.slug.current}`,
    lastModified: now,
    priority: 0.7,
  }))

  return [...staticRoutes, ...workRoutes]
}
