import { defineField, defineType } from 'sanity'

// Singleton: global SEO/social defaults. One document (_id "siteSettings").
export const siteSettings = defineType({
    name: 'siteSettings',
    title: 'Site Settings',
    type: 'document',
    fields: [
        defineField({ name: 'siteName', title: 'Site name', type: 'string' }),
        defineField({ name: 'siteUrl', title: 'Site URL', type: 'url' }),
        defineField({ name: 'defaultSeo', title: 'Default SEO', type: 'seo' }),
        defineField({
            name: 'socialLinks',
            title: 'Social / profile links',
            description: 'Used for structured data (sameAs) — LinkedIn, Google Scholar, ORCID, etc.',
            type: 'array',
            of: [{ type: 'url' }],
        }),
    ],
    preview: { prepare: () => ({ title: 'Site Settings' }) },
})
