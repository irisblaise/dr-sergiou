import { defineField, defineType } from 'sanity'

// Singleton: the landing-page copy. One document (_id "homePage").
// The hero headline is rendered with its own line breaks in the component; the
// six "passions" drive both the section list and the brain-animation anchors, so
// keep them as an ordered list of {number, title, description}.
export const homePage = defineType({
    name: 'homePage',
    title: 'Home Page',
    type: 'document',
    fields: [
        defineField({
            name: 'heroHeadline',
            title: 'Hero headline',
            type: 'string',
        }),
        defineField({
            name: 'heroIntro',
            title: 'Hero intro paragraphs',
            type: 'array',
            of: [{ type: 'text', rows: 3 }],
            description: 'The first paragraph’s opening "Hello there," is emphasised automatically.',
        }),
        defineField({
            name: 'passions',
            title: 'Passions',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({ name: 'number', title: 'Number', type: 'string', description: 'e.g. "No.1"' }),
                        defineField({ name: 'title', title: 'Title', type: 'string' }),
                        defineField({ name: 'description', title: 'Description', type: 'text', rows: 5 }),
                    ],
                    preview: { select: { title: 'title', subtitle: 'number' } },
                },
            ],
        }),
        defineField({
            name: 'fullBio',
            title: 'Full bio (reference copy)',
            type: 'text',
            rows: 5,
        }),
    ],
    preview: { select: { title: 'heroHeadline' }, prepare: ({ title }) => ({ title: 'Home Page', subtitle: title }) },
})
