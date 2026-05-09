import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'graffiti',
  title: 'Graffiti Tags',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Drawing',
      type: 'image',
      description: 'The visitor tag drawing',
    }),
    defineField({
      name: 'approved',
      title: 'Approved',
      type: 'boolean',
      initialValue: false,
      description: 'Only approved tags appear in the graffiti gallery on the about page',
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      media: 'image',
      approved: 'approved',
      submittedAt: 'submittedAt',
    },
    prepare({ media, approved, submittedAt }) {
      return {
        title: approved ? '✓ Approved' : '⏳ Pending',
        subtitle: submittedAt ? new Date(submittedAt).toLocaleString() : 'Unknown time',
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Newest First',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
  ],
})
