import { defineField, defineType } from 'sanity'

// Mirrors the `Project` interface in src/data/types.ts. NOTE: `node` (the px
// Y-position down the timeline canvas) is layout-critical — do not drop it.
export const project = defineType({
    name: 'project',
    title: 'Project',
    type: 'document',
    fields: [
        defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'description', title: 'Description', type: 'text' }),
        defineField({ name: 'link', title: 'Link', type: 'url' }),
        defineField({
            name: 'dateRange',
            title: 'Date range',
            type: 'string',
            description: 'Display range, e.g. "2025 – Current".',
        }),
        defineField({
            name: 'year',
            title: 'Leading year',
            type: 'string',
            description: 'Drives the timeline year marker, e.g. "2025".',
        }),
        defineField({
            name: 'color',
            title: 'Accent colour',
            type: 'string',
            description: 'Hex / CSS colour for the timeline node + date label.',
        }),
        defineField({
            name: 'node',
            title: 'Timeline node (px)',
            type: 'number',
            description:
                'Y position (px) down the 1526px timeline canvas — the anchor shared by the row and its spine marker.',
            validation: (r) => r.required(),
        }),
        defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    ],
    orderings: [
        { title: 'Timeline position', name: 'nodeAsc', by: [{ field: 'node', direction: 'asc' }] },
    ],
    preview: { select: { title: 'title', subtitle: 'dateRange', media: 'image' } },
})
