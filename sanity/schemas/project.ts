import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'display',
      title: 'Display',
      type: 'string',
      options: {
        list: [
          { title: 'Selected Work — homepage index', value: 'index' },
          { title: 'Archive — archive section', value: 'archive' },
          { title: 'Hidden — not shown anywhere', value: 'hidden' },
        ],
        layout: 'radio',
      },
      initialValue: 'index',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first in Selected Work',
      initialValue: 0,
    }),
    defineField({
      name: 'kind',
      title: 'Kind',
      type: 'string',
      description: 'e.g. Installation, Client · Studio, Identity, Client · Label',
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'Your role on the project — shown in the index row and meta block',
    }),
    defineField({
      name: 'blurb',
      title: 'Blurb',
      type: 'text',
      rows: 2,
      description: 'One-sentence description for the index hover / case-study lead-in',
    }),
    defineField({
      name: 'collaborators',
      title: 'Collaborators',
      type: 'string',
      description: 'Who you worked with — shown in the "With" meta row',
    }),
    defineField({
      name: 'cover',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Primary image used in the homepage peek and project header',
      fields: [{ name: 'alt', title: 'Alt Text', type: 'string' }],
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'description',
      title: 'Short Description (legacy)',
      type: 'text',
      rows: 3,
      description: 'Legacy field — use Blurb instead',
    }),
    defineField({
      name: 'body',
      title: 'Case Study Body',
      type: 'array',
      description: 'Structured case study content for the project detail page',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
          },
        },
        {
          type: 'object',
          name: 'sectionHeading',
          title: 'Section Heading',
          fields: [
            { name: 'heading', title: 'Heading Text', type: 'string' },
          ],
          preview: {
            select: { heading: 'heading' },
            prepare({ heading }) {
              return { title: `— ${heading}` }
            },
          },
        },
        {
          type: 'object',
          name: 'monoQuote',
          title: 'Mono Quote / Lead-in',
          fields: [
            { name: 'text', title: 'Text', type: 'string' },
          ],
          preview: {
            select: { text: 'text' },
            prepare({ text }) {
              return { title: text, subtitle: 'Mono lead-in' }
            },
          },
        },
        {
          type: 'object',
          name: 'pairedImages',
          title: 'Paired Images (2-up)',
          fields: [
            {
              name: 'imageA',
              title: 'Image A (left)',
              type: 'image',
              options: { hotspot: true },
              fields: [{ name: 'alt', title: 'Alt', type: 'string' }],
            },
            {
              name: 'imageB',
              title: 'Image B (right)',
              type: 'image',
              options: { hotspot: true },
              fields: [{ name: 'alt', title: 'Alt', type: 'string' }],
            },
          ],
          preview: {
            select: { imageA: 'imageA', imageB: 'imageB' },
            prepare({ imageA }) {
              return { title: 'Paired images', media: imageA }
            },
          },
        },
        {
          type: 'object',
          name: 'fullBleedImage',
          title: 'Full-Bleed Image',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              fields: [{ name: 'alt', title: 'Alt', type: 'string' }],
            },
          ],
          preview: {
            select: { image: 'image' },
            prepare({ image }) {
              return { title: 'Full-bleed image', media: image }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'fullDescription',
      title: 'Full Description (legacy)',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Legacy field — use Case Study Body instead',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', title: 'Alt Text', type: 'string' },
            { name: 'caption', title: 'Caption', type: 'string' },
            {
              name: 'showOnGallery',
              title: 'Show on Gallery',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'gridSpan',
              title: 'Grid Span',
              type: 'number',
              options: {
                list: [
                  { title: 'Normal (1)', value: 1 },
                  { title: 'Wide (2)', value: 2 },
                  { title: 'Full (3)', value: 3 },
                ],
              },
              initialValue: 1,
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'video',
      title: 'Demo Video',
      type: 'file',
      options: { accept: 'video/mp4,video/webm' },
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'url', title: 'URL', type: 'url' },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      display: 'display',
      year: 'year',
      media: 'cover',
      fallback: 'images.0',
    },
    prepare({ title, display, year, media, fallback }) {
      const label = display === 'archive' ? '↳ Archive' : display === 'hidden' ? '— Hidden' : '★ Index'
      return { title, subtitle: `${label}${year ? ` · ${year}` : ''}`, media: media || fallback }
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Year, Newest',
      name: 'yearDesc',
      by: [{ field: 'year', direction: 'desc' }],
    },
  ],
})
