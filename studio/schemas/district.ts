import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'district',
  title: 'Bydel',
  type: 'document',
  fields: [
    defineField({
      name: 'districtId',
      title: 'ID (slug)',
      type: 'string',
      description: 'Unik ID, f.eks. "gamle-oslo", "grunerlokka"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Navn',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'priceChange',
      title: 'Prisendring (%)',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'avgDaysOnMarket',
      title: 'Gj.snittlig salgstid (dager)',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pricePerSqm',
      title: 'Pris per m2 (kr)',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'medianPrice',
      title: 'Medianpris (kr)',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Beskrivelse',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lat',
      title: 'Breddegrad',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lng',
      title: 'Lengdegrad',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'districtId',
    },
  },
});
