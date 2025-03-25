import { defineCollection, z } from 'astro:content';

const casies = defineCollection({
  type: 'content',
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.date(),
      thumbnail: image().optional(),
      tags: z.array(z.string()),
    }),
});

export const collections = {
  casies,
};
