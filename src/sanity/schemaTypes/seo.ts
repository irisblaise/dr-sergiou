import { defineField, defineType } from 'sanity'

// Reusable SEO fields — embedded on document schemas (siteSettings, homePage).
export const seo = defineType({
    name: 'seo',
    title: 'SEO',
    type: 'object',
    options: { collapsible: true, collapsed: true },
    fields: [
        defineField({
            name: 'metaTitle',
            title: 'Meta title',
            type: 'string',
            description:
                'Overrides the page <title>. Falls back to the page content if left blank. ~60 characters.',
            validation: (r) => r.max(60).warning('Longer titles get truncated in search results.'),
        }),
        defineField({
            name: 'metaDescription',
            title: 'Meta description',
            type: 'text',
            rows: 3,
            description:
                'Falls back to a trimmed content excerpt if left blank. ~155 characters.',
            validation: (r) => r.max(160).warning('Longer descriptions get truncated in search results.'),
        }),
        defineField({
            name: 'ogImage',
            title: 'Social share image',
            type: 'image',
            description:
                'Open Graph / Twitter card image. Recommended 1200×630. Falls back to the site default.',
            options: { hotspot: true },
            fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
        }),
        defineField({
            name: 'noIndex',
            title: 'Hide from search engines',
            type: 'boolean',
            initialValue: false,
        }),
    ],
})
