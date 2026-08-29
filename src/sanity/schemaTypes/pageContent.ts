import { defineField, defineType } from 'sanity'

export const pageContent = defineType({
    name: 'pageContent',
    title: 'Page Content',
    type: 'document',
    fields: [
        defineField({
            name: 'page',
            title: 'Page',
            type: 'string',
            description: 'Unique page identifier, such as home, projects, skills, publications, impact, or contact.',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'heading',
            title: 'Heading',
            type: 'string',
            description: 'Main H1 line shown on the page.',
        }),
        defineField({
            name: 'eyebrow',
            title: 'Eyebrow',
            type: 'string',
            description: 'Small uppercase label above the heading.',
        }),
        defineField({
            name: 'intro',
            title: 'Intro paragraphs',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Editable text paragraphs for the page intro section.',
        }),
        defineField({
            name: 'body',
            title: 'Body text',
            type: 'text',
            rows: 6,
            description: 'Optional longer text block for page-specific copy.',
        }),
        defineField({
            name: 'contactDetails',
            title: 'Contact details',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'label', type: 'string', title: 'Label' },
                        { name: 'value', type: 'string', title: 'Value' },
                        { name: 'href', type: 'string', title: 'Link URL' },
                        { name: 'note', type: 'string', title: 'Note' },
                    ],
                    preview: {
                        select: { title: 'label', subtitle: 'value' },
                    },
                },
            ],
            description: 'Editable contact entries like email, ForNeurotech, and other contact channels.',
        }),
        defineField({
            name: 'position',
            title: 'Current position',
            type: 'string',
            description: 'Role or title shown in the contact page sidebar.',
        }),
        defineField({
            name: 'institution',
            title: 'Institution',
            type: 'string',
            description: 'Institution or organisation shown under the current position.',
        }),
        defineField({
            name: 'socialLinks',
            title: 'Social links',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'label', type: 'string', title: 'Label' },
                        { name: 'href', type: 'string', title: 'URL' },
                    ],
                    preview: {
                        select: { title: 'label', subtitle: 'href' },
                    },
                },
            ],
            description: 'Editable social links shown on the contact page.',
        }),
    ],
    preview: {
        select: { title: 'page', subtitle: 'heading' },
        prepare: ({ title, subtitle }) => ({
            title: title || 'Page content',
            subtitle: subtitle || 'Editable text',
        }),
    },
})
