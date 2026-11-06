import { defineField, defineType } from 'sanity'

// Shared gallery asset used by Award + Media Item. The frontend flattens this to
// the `ImpactAsset` shape ({ type, src }) in the GROQ query — image assets resolve
// to a CDN url, videos use the raw videoUrl.
export const impactAsset = defineType({
    name: 'impactAsset',
    title: 'Asset',
    type: 'object',
    fields: [
        defineField({
            name: 'type',
            title: 'Type',
            type: 'string',
            options: { list: ['image', 'video'], layout: 'radio' },
            initialValue: 'image',
            validation: (r) => r.required(),
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: { hotspot: true },
            hidden: ({ parent }) => parent?.type !== 'image',
            fields: [
                defineField({
                    name: 'alt',
                    title: 'Alt text',
                    type: 'string',
                    description: 'Describe the image for screen readers and search engines.',
                }),
            ],
        }),
        defineField({
            name: 'videoUrl',
            title: 'Video URL',
            type: 'url',
            hidden: ({ parent }) => parent?.type !== 'video',
        }),
    ],
    preview: { select: { title: 'type', media: 'image' } },
})
