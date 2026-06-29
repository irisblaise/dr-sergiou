import { defineField, defineType } from 'sanity'

// Mirrors the `Award` interface in src/data/types.ts.
export const award = defineType({
    name: 'award',
    title: 'Award',
    type: 'document',
    fields: [
        defineField({ name: 'subject', title: 'Subject', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'mediaType', title: 'Media type', type: 'string' }),
        defineField({ name: 'peopleInvolved', title: 'People involved', type: 'string' }),
        defineField({ name: 'description', title: 'Description', type: 'text' }),
        defineField({ name: 'date', title: 'Date', type: 'string' }),
        defineField({ name: 'image', title: 'Cover image', type: 'image', options: { hotspot: true } }),
        defineField({ name: 'assets', title: 'Assets', type: 'array', of: [{ type: 'impactAsset' }] }),
        defineField({
            name: 'order',
            title: 'Order',
            type: 'number',
            description: 'Display order (ascending) — preserves the original sequence.',
        }),
    ],
    orderings: [
        { title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
    ],
    preview: { select: { title: 'subject', subtitle: 'date', media: 'image' } },
})
