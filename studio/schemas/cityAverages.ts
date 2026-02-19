import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'cityAverages',
  title: 'Oslo-snitt',
  type: 'document',
  fields: [
    defineField({
      name: 'priceTrend',
      title: 'Pristrend (%)',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'daysOnMarket',
      title: 'Gj.snittlig salgstid (dager)',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'medianPrice',
      title: 'Medianpris (mill. kr)',
      type: 'number',
      description: 'Oppgi i millioner, f.eks. 5.8',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'avgSqmPrice',
      title: 'Gj.snittlig m2-pris (kr)',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Oslo-snitt' };
    },
  },
});
