import { defineField, defineType } from 'sanity'

// Mirrors the `Publication` interface in src/data/types.ts, including the
// `cover` (spine) object and the optional `accolade` (PhD / award badge).
export const publication = defineType({
    name: 'publication',
    title: 'Publication',
    type: 'document',
    fields: [
        defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'authors', title: 'Authors', type: 'string' }),
        defineField({ name: 'journal', title: 'Journal', type: 'string' }),
        defineField({ name: 'year', title: 'Year', type: 'number', validation: (r) => r.required() }),
        defineField({
            name: 'kind',
            title: 'Kind',
            type: 'string',
            options: {
                list: ['RESEARCH ARTICLE', 'REVIEW', 'BOOK CHAPTER', 'DISSERTATION', 'REPORT'],
            },
            validation: (r) => r.required(),
        }),
        defineField({
            name: 'topics',
            title: 'Topics',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: ['Neuroscience', 'Behavior', 'Forensic', 'Neuromodulation', 'Technology'],
            },
        }),
        defineField({ name: 'authorship', title: 'Authorship', type: 'string' }),
        defineField({
            name: 'abstract',
            title: 'Abstract',
            type: 'text',
            description: 'TODO(client): real abstracts were not in the ported data.',
        }),
        defineField({ name: 'link', title: 'DOI / external link', type: 'url' }),
        defineField({ name: 'pdf', title: 'PDF', type: 'file', options: { accept: '.pdf' } }),
        defineField({
            name: 'cover',
            title: 'Cover (spine)',
            type: 'object',
            options: { columns: 2 },
            fields: [
                defineField({ name: 'bg', title: 'Background colour', type: 'string' }),
                defineField({
                    name: 'text',
                    title: 'Text colour',
                    type: 'string',
                    options: { list: ['light', 'dark'] },
                    initialValue: 'dark',
                }),
            ],
        }),
        defineField({
            name: 'accolade',
            title: 'Accolade (optional)',
            type: 'object',
            description: 'A distinction shown on the spine icon + detail card.',
            options: { columns: 2, collapsible: true, collapsed: true },
            fields: [
                defineField({
                    name: 'type',
                    title: 'Type',
                    type: 'string',
                    options: { list: ['phd', 'award'] },
                }),
                defineField({ name: 'label', title: 'Label', type: 'string' }),
            ],
        }),
    ],
    orderings: [
        { title: 'Year (newest)', name: 'yearDesc', by: [{ field: 'year', direction: 'desc' }] },
    ],
    preview: { select: { title: 'title', subtitle: 'journal' } },
})
