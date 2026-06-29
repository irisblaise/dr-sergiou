import { defineField, defineType } from 'sanity'

// Mirrors the `Skill` interface in src/data/types.ts:
// key (fixed union, drives the radial node positions) / label / detail / image.
export const skill = defineType({
    name: 'skill',
    title: 'Skill',
    type: 'document',
    fields: [
        defineField({
            name: 'key',
            title: 'Key',
            type: 'string',
            description:
                'Stable identifier that drives the radial node layout — must be one of the fixed set.',
            options: {
                list: ['neuro', 'coding', 'forensic', 'vr', 'behavior', 'music'],
            },
            validation: (r) => r.required(),
        }),
        defineField({
            name: 'label',
            title: 'Label',
            type: 'string',
            description: 'Space Mono all-caps eyebrow, e.g. "NEURO".',
            validation: (r) => r.required(),
        }),
        defineField({
            name: 'detail',
            title: 'Detail',
            type: 'text',
            rows: 2,
            description: "Multi-item detail; '|' separators kept as written.",
        }),
        defineField({
            name: 'image',
            title: 'Node image',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'order',
            title: 'Order',
            type: 'number',
            description: 'Display order (ascending) — preserves the original array sequence.',
        }),
    ],
    orderings: [
        { title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
    ],
    preview: { select: { title: 'label', subtitle: 'detail', media: 'image' } },
})
