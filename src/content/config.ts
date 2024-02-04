import { defineCollection, z } from "astro:content";

// Made a change to this file?
// Run `npx astro sync` to update the type definitions

const projectsCollection = defineCollection({
  type: "content",
  schema: z.object({
    sortWeight: z.number(),
    title: z.string(),
    tagLine: z.string(),
    description: z.string(),
    image: z
      .object({
        url: z.string(),
        alt: z.string()
      })
      .optional(),
    tags: z.array(z.string()).optional()
  })
});

export const collections = {
  projects: projectsCollection
};
