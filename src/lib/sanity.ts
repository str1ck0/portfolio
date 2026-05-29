import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = '2024-01-01'

export const client = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: process.env.NODE_ENV === 'production',
    })
  : null

const builder = client ? imageUrlBuilder(client) : null

export function urlFor(source: SanityImageSource) {
  if (!builder) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dummyBuilder: any = {
      width: () => dummyBuilder,
      height: () => dummyBuilder,
      quality: () => dummyBuilder,
      auto: () => dummyBuilder,
      url: () => '',
    }
    return dummyBuilder
  }
  return builder.image(source)
}

// ============================================
// GROQ Queries
// ============================================

const imageFields = `
  alt,
  crop,
  hotspot,
  asset-> {
    _id,
    url,
    metadata { dimensions, lqip }
  }
`

// Homepage: selected work index
export const indexProjectsQuery = `
  *[_type == "project" && !(display in ["archive", "hidden"])] | order(order asc) [0...6] {
    _id,
    title,
    "slug": slug.current,
    year,
    kind,
    role,
    "cover": coalesce(cover, images[0]) { ${imageFields} }
  }
`

// Homepage: archive section
export const archiveProjectsQuery = `
  *[_type == "project" && display == "archive"] | order(year desc) {
    _id,
    title,
    "slug": slug.current,
    year,
    kind,
    role
  }
`

// Homepage: recently section (3 latest posts)
export const recentPostsQuery = `
  *[_type == "blogPost"] | order(publishedAt desc) [0...3] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    kind,
    cta,
    "cover": featuredImage { ${imageFields} }
  }
`

// All projects (used for generateStaticParams)
export const allProjectsQuery = `
  *[_type == "project"] | order(order asc) {
    _id,
    title,
    slug,
    year,
    kind,
    role,
    blurb,
    description,
    featured,
    tags,
    technologies,
    "video": video.asset->url,
    "images": images[] {
      _key, alt, caption, gridSpan, crop, hotspot,
      asset-> { _id, url, metadata { dimensions, lqip } }
    },
    links
  }
`

// Single project detail (case study)
export const projectBySlugQuery = `
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    blurb,
    description,
    kind,
    role,
    collaborators,
    technologies,
    year,
    links,
    "video": video.asset->url,
    "cover": coalesce(cover, images[0]) { ${imageFields} },
    "body": body[] {
      ...,
      _type == "pairedImages" => {
        "imageA": imageA { ${imageFields} },
        "imageB": imageB { ${imageFields} }
      },
      _type == "fullBleedImage" => {
        "image": image { ${imageFields} }
      }
    },
    fullDescription,
    "images": images[] {
      _key, alt, caption, gridSpan, crop, hotspot,
      asset-> { _id, url, metadata { dimensions, lqip } }
    }
  }
`

// Lightweight project list for next-project navigation
export const projectNavQuery = `
  *[_type == "project" && !(display in ["archive", "hidden"])] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    year,
    role
  }
`

// All blog posts (used by blog page)
export const allBlogPostsQuery = `
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    kind,
    tags,
    "featuredImage": featuredImage { ${imageFields} }
  }
`

// Single blog post
export const blogPostBySlugQuery = `
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    kind,
    tags,
    "body": body[] {
      ...,
      _type == "image" => {
        ...,
        "asset": asset-> {
          _id,
          url,
          metadata { dimensions, lqip }
        }
      }
    },
    "featuredImage": featuredImage { ${imageFields} }
  }
`

// ============================================
// Fetcher Functions
// ============================================

export async function getIndexProjects(): Promise<IndexProject[]> {
  if (!client) return []
  return client.fetch(indexProjectsQuery)
}

export async function getArchiveProjects(): Promise<ArchiveProject[]> {
  if (!client) return []
  return client.fetch(archiveProjectsQuery)
}

export async function getRecentPosts(): Promise<RecentPost[]> {
  if (!client) return []
  return client.fetch(recentPostsQuery)
}

export async function getAllProjects(): Promise<Project[]> {
  if (!client) return []
  return client.fetch(allProjectsQuery)
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  if (!client) return null
  return client.fetch(projectBySlugQuery, { slug })
}

export async function getProjectNav(): Promise<ProjectNav[]> {
  if (!client) return []
  return client.fetch(projectNavQuery)
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  if (!client) return []
  return client.fetch(allBlogPostsQuery)
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!client) return null
  return client.fetch(blogPostBySlugQuery, { slug })
}

// ============================================
// Types
// ============================================

export interface SanityImageCrop {
  top: number; bottom: number; left: number; right: number
}

export interface SanityImageHotspot {
  x: number; y: number; width: number; height: number
}

export interface SanityImageAsset {
  _id: string
  url: string
  metadata?: {
    dimensions?: { width: number; height: number }
    lqip?: string
  }
}

export interface SanityImage {
  alt?: string
  crop?: SanityImageCrop
  hotspot?: SanityImageHotspot
  asset: SanityImageAsset
}

export interface ProjectImage extends SanityImage {
  _key: string
  caption?: string
  gridSpan?: number
}

// Homepage index project
export interface IndexProject {
  _id: string
  title: string
  slug: string
  year?: number
  kind?: string
  role?: string
  cover?: SanityImage
}

// Homepage archive project
export interface ArchiveProject {
  _id: string
  title: string
  slug: string
  year?: number
  kind?: string
  role?: string
}

// Homepage recently post
export interface RecentPost {
  _id: string
  title: string
  slug: string
  publishedAt: string
  excerpt?: string
  kind?: string
  cta?: string
  cover?: SanityImage
}

// Lightweight nav project
export interface ProjectNav {
  _id: string
  title: string
  slug: string
  year?: number
  role?: string
}

// Full project (for detail page)
export interface ProjectDetail {
  _id: string
  title: string
  slug: { current: string }
  blurb?: string
  description?: string
  kind?: string
  role?: string
  collaborators?: string
  technologies?: string[]
  year?: number
  video?: string
  cover?: SanityImage
  body?: CaseStudyBlock[]
  fullDescription?: unknown[]
  images?: ProjectImage[]
  links?: { title: string; url: string }[]
}

export type CaseStudyBlock =
  | { _key: string; _type: 'block'; [k: string]: unknown }
  | { _key: string; _type: 'sectionHeading'; heading: string }
  | { _key: string; _type: 'monoQuote'; text: string }
  | { _key: string; _type: 'pairedImages'; imageA?: SanityImage; imageB?: SanityImage }
  | { _key: string; _type: 'fullBleedImage'; image?: SanityImage }

// Full project (legacy list)
export interface Project {
  _id: string
  title: string
  slug: { current: string }
  featured?: boolean
  description?: string
  blurb?: string
  kind?: string
  role?: string
  tags?: string[]
  technologies?: string[]
  year?: number
  video?: string
  images?: ProjectImage[]
  links?: { title: string; url: string }[]
}

// Blog post
export interface BlogPost {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string
  excerpt?: string
  kind?: string
  cta?: string
  body?: unknown[]
  tags?: string[]
  featuredImage?: SanityImage
}

// Legacy (kept for Gallery component backward compat)
export interface GalleryProject {
  projectTitle: string
  projectSlug: string
  video?: string
  images: ProjectImage[]
}

export interface SiteSettings {
  _id: string
  name: string
  email?: string
  social?: { platform: string; url: string }[]
  homepagePortrait?: SanityImage
  aboutPortrait?: SanityImage
}

export interface AboutLink {
  word: string
  linkType: 'blog' | 'tag' | 'external'
  tag?: string
  url?: string
}

export interface SocialLink {
  platform: string
  url: string
}

// Keep for any remaining usages
export async function getGalleryImages(): Promise<GalleryProject[]> {
  if (!client) return []
  const query = `
    *[_type == "project" && (count(images[showOnGallery == true]) > 0 || defined(video))] | order(order asc) {
      "projectTitle": title,
      "projectSlug": slug.current,
      "video": video.asset->url,
      "images": images[showOnGallery == true] {
        _key, alt, caption, gridSpan, crop, hotspot,
        asset-> { _id, url, metadata { dimensions, lqip } }
      }
    }
  `
  return client.fetch(query)
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!client) return null
  const query = `
    *[_type == "siteSettings"][0] {
      _id, name, email, social,
      "homepagePortrait": homepagePortrait { alt, crop, hotspot, asset-> { _id, url, metadata { dimensions, lqip } } },
      "aboutPortrait": aboutPortrait { alt, crop, hotspot, asset-> { _id, url, metadata { dimensions, lqip } } }
    }
  `
  return client.fetch(query)
}
