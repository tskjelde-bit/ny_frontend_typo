import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'siteConfig',
  title: 'Sideinnstillinger',
  type: 'document',
  fields: [
    defineField({
      name: 'navLinks',
      title: 'Navigasjonslenker',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Navn', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'href', title: 'URL', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'active', title: 'Aktiv', type: 'boolean', initialValue: false }),
            defineField({ name: 'hasDropdown', title: 'Har dropdown', type: 'boolean', initialValue: false }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'href' },
          },
        },
      ],
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA-knapp tekst',
      type: 'string',
      initialValue: 'Få verdivurdering',
    }),
    defineField({
      name: 'ctaUrl',
      title: 'CTA-knapp URL',
      type: 'string',
    }),
    defineField({
      name: 'newsletterTitle',
      title: 'Nyhetsbrev tittel',
      type: 'string',
    }),
    defineField({
      name: 'newsletterSubtitle',
      title: 'Nyhetsbrev undertittel',
      type: 'string',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Sideinnstillinger' };
    },
  },
});
