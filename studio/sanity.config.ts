import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

export default defineConfig({
  name: 'innsikt',
  title: 'Innsikt — Boligmarkedet i Oslo',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'your-project-id',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Innhold')
          .items([
            S.listItem()
              .title('Bydeler')
              .child(S.documentTypeList('district').title('Bydeler')),
            S.listItem()
              .title('Blogginnlegg')
              .child(S.documentTypeList('blogPost').title('Blogginnlegg')),
            S.divider(),
            S.listItem()
              .title('Oslo-snitt')
              .child(
                S.document()
                  .schemaType('cityAverages')
                  .documentId('cityAverages')
                  .title('Oslo-snitt')
              ),
            S.listItem()
              .title('Sideinnstillinger')
              .child(
                S.document()
                  .schemaType('siteConfig')
                  .documentId('siteConfig')
                  .title('Sideinnstillinger')
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
