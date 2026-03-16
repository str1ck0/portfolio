import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Your Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'aboutText',
      title: 'About Text',
      type: 'text',
      rows: 3,
      description: 'e.g. "I write, code, do installations, paint..."',
    }),
    defineField({
      name: 'aboutLinks',
      title: 'About Text Links',
      type: 'array',
      description: 'Words in your about text that become clickable links',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'word',
              title: 'Word',
              type: 'string',
              description: 'The word in your about text to make clickable',
            },
            {
              name: 'linkType',
              title: 'Link Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Blog', value: 'blog' },
                  { title: 'Tag Filter', value: 'tag' },
                  { title: 'External URL', value: 'external' },
                ],
              },
            },
            {
              name: 'tag',
              title: 'Tag',
              type: 'string',
              description: 'If Link Type is "Tag Filter", which tag to filter by',
              hidden: ({ parent }) => parent?.linkType !== 'tag',
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              description: 'If Link Type is "External URL"',
              hidden: ({ parent }) => parent?.linkType !== 'external',
            },
          ],
          preview: {
            select: {
              word: 'word',
              linkType: 'linkType',
              tag: 'tag',
            },
            prepare({ word, linkType, tag }) {
              return {
                title: word,
                subtitle: linkType === 'tag' ? `→ /work/${tag}` : linkType === 'blog' ? '→ /blog' : 'External',
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'extendedAbout',
      title: 'Extended About',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Longer about text shown when About section is expanded',
    }),
    defineField({
      name: 'stack',
      title: 'Disciplines',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Drag to reorder. e.g. Creative Direction, Software Engineering, Writing',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'social',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Display Name',
              type: 'string',
              description: 'e.g. Instagram, Studio Pilz, GitHub',
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
            },
          ],
          preview: {
            select: {
              platform: 'platform',
              url: 'url',
            },
            prepare({ platform, url }) {
              return {
                title: platform,
                subtitle: url,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'galleryInterval',
      title: 'Gallery Auto-Cycle Interval (seconds)',
      type: 'number',
      initialValue: 6,
      description: 'How often the gallery image changes automatically',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
      }
    },
  },
})
