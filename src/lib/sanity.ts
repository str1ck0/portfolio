import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = '2024-01-01'

// Only create client if we have a project ID
export const client = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: process.env.NODE_ENV === 'production',
    })
  : null

// Image URL builder (only create if client exists)
const builder = client ? imageUrlBuilder(client) : null

export function urlFor(source: SanityImageSource) {
  if (!builder) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dummyBuilder: any = {
      width: () => dummyBuilder,
      height: () => dummyBuilder,
      quality: () => dummyBuilder,
      url: () => '',
    }
    return dummyBuilder
  }
  return builder.image(source)
}

// ============================================
// GROQ Queries
// ============================================

// Get all images marked showOnGallery, flat list with project context
export const galleryImagesQuery = `
  *[_type == "project" && (count(images[showOnGallery == true]) > 0 || defined(video))] | order(order asc) {
    "projectTitle": title,
    "projectSlug": slug.current,
    "video": video.asset->url,
    "images": images[showOnGallery == true] {
      _key,
      alt,
      caption,
      gridSpan,
      asset-> {
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    }
  }
`

// Get all projects
export const allProjectsQuery = `
  *[_type == "project"] | order(order asc) {
    _id,
    title,
    slug,
    featured,
    description,
    fullDescription,
    tags,
    technologies,
    year,
    "video": video.asset->url,
    "images": images[] {
      _key,
      alt,
      caption,
      gridSpan,
      asset-> {
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    },
    links
  }
`

// Get projects by tag
export const projectsByTagQuery = `
  *[_type == "project" && $tag in tags] | order(order asc) {
    _id,
    title,
    slug,
    featured,
    description,
    tags,
    technologies,
    year,
    "video": video.asset->url,
    "images": images[] {
      _key,
      alt,
      caption,
      gridSpan,
      asset-> {
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    },
    links
  }
`

// Get single project by slug
export const projectBySlugQuery = `
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    fullDescription,
    tags,
    technologies,
    year,
    "video": video.asset->url,
    "images": images[] {
      _key,
      alt,
      caption,
      gridSpan,
      asset-> {
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    },
    links
  }
`

// Get all blog posts
export const allBlogPostsQuery = `
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    tags,
    "featuredImage": featuredImage {
      alt,
      asset-> {
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    }
  }
`

// Get single blog post by slug
export const blogPostBySlugQuery = `
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
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
    "featuredImage": featuredImage {
      alt,
      asset-> {
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    }
  }
`

// Get site settings
export const siteSettingsQuery = `
  *[_type == "siteSettings"][0] {
    _id,
    name,
    aboutText,
    aboutLinks,
    extendedAbout,
    "aboutImage": aboutImage {
      alt,
      asset-> {
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    },
    "aboutImagesTop": aboutImagesTop[] {
      alt,
      asset-> {
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    },
    "aboutImagesBottom": aboutImagesBottom[] {
      alt,
      asset-> {
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    },
    stack,
    email,
    social,
    galleryInterval
  }
`

// Get approved graffiti tags
export const graffitiQuery = `
  *[_type == "graffiti" && approved == true] | order(submittedAt desc) {
    _id,
    submittedAt,
    "image": image {
      asset-> {
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    }
  }
`

// ============================================
// Fetcher Functions
// ============================================

export async function getGalleryImages(): Promise<GalleryProject[]> {
  if (!client) return []
  return client.fetch(galleryImagesQuery)
}

export async function getAllProjects(): Promise<Project[]> {
  if (!client) return []
  return client.fetch(allProjectsQuery)
}

export async function getProjectsByTag(tag: string): Promise<Project[]> {
  if (!client) return []
  return client.fetch(projectsByTagQuery, { tag } as Record<string, string>)
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!client) return null
  return client.fetch(projectBySlugQuery, { slug })
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  if (!client) return []
  return client.fetch(allBlogPostsQuery)
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!client) return null
  return client.fetch(blogPostBySlugQuery, { slug })
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!client) return null
  return client.fetch(siteSettingsQuery)
}

export async function getGraffiti(): Promise<GraffitiTag[]> {
  if (!client) return []
  return client.fetch(graffitiQuery)
}

// ============================================
// Types
// ============================================

export interface Project {
  _id: string
  title: string
  slug: { current: string }
  featured?: boolean
  description?: string
  fullDescription?: unknown[]
  tags?: string[]
  technologies?: string[]
  year?: number
  video?: string
  images?: ProjectImage[]
  links?: { title: string; url: string }[]
}

export interface GalleryProject {
  projectTitle: string
  projectSlug: string
  video?: string
  images: ProjectImage[]
}

export interface ProjectImage {
  _key: string
  alt?: string
  caption?: string
  gridSpan?: number
  asset: {
    _id: string
    url: string
    metadata?: {
      dimensions?: { width: number; height: number }
      lqip?: string
    }
  }
}

export interface BlogPost {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string
  excerpt?: string
  body?: unknown[]
  tags?: string[]
  featuredImage?: {
    alt?: string
    asset: {
      _id: string
      url: string
      metadata?: {
        dimensions?: { width: number; height: number }
        lqip?: string
      }
    }
  }
}

export interface AboutImage {
  alt?: string
  asset: {
    _id: string
    url: string
    metadata?: {
      dimensions?: { width: number; height: number }
      lqip?: string
    }
  }
}

export interface SiteSettings {
  _id: string
  name: string
  aboutText?: string
  aboutLinks?: AboutLink[]
  extendedAbout?: unknown[]
  aboutImage?: AboutImage
  aboutImagesTop?: AboutImage[]
  aboutImagesBottom?: AboutImage[]
  stack?: string[]
  email?: string
  social?: SocialLink[]
  galleryInterval?: number
}

export interface GraffitiTag {
  _id: string
  submittedAt: string
  image?: {
    asset: {
      _id: string
      url: string
      metadata?: {
        dimensions?: { width: number; height: number }
        lqip?: string
      }
    }
  }
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
