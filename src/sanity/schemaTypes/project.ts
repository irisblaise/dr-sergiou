import { defineField, defineType } from 'sanity'

// Mirrors the `Project` interface in src/data/types.ts. NOTE: `node` only
// sets display order (via the "Timeline position" ordering below) — rows are
// laid out at an even pixel rhythm in Projects.tsx, not at this literal value.
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
            title: 'Timeline order',
            type: 'number',
            description:
                'Sets this project\'s position in the timeline (lower = earlier/higher up). Rows are spaced evenly on the page — this is an order key, not a pixel position.',
            validation: (r) => r.required(),
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: { hotspot: true },
            fields: [
                defineField({
                    name: 'alt',
                    title: 'Alt text',
                    type: 'string',
                    description: 'Describe the image for screen readers and search engines.',
                    validation: (r) => r.required(),
                }),
            ],
        }),
    ],
    orderings: [
        { title: 'Timeline position', name: 'nodeAsc', by: [{ field: 'node', direction: 'asc' }] },
    ],
    preview: { select: { title: 'title', subtitle: 'dateRange', media: 'image' } },
})
