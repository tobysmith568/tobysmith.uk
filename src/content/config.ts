import { defineCollection, z } from "astro:content";

// Made a change to this file?
// Run `npx astro sync` to update the type definitions

const projectsCollection = defineCollection({
  type: "content",
  schema: z.object({
    sortWeight: z.number(),
    title: z.string(),
    tagLine: z.string(),
    tags: z.array(z.string()).optional()
  })
});

const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    sortWeight: z.number(),
    title: z.string(),
    description: z.string(),
    date: z.date()
  })
});

const policiesCollection = defineCollection({
  type: "content",
  schema: z.object({})
});

export const collections = {
  projects: projectsCollection,
  blog: blogCollection,
  policies: policiesCollection
};
