import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

// Made a change to this file?
// Run `bunx astro sync` to update the type definitions

const projectsCollection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
  schema: z.object({
    sortWeight: z.number(),
    title: z.string(),
    tagLine: z.string(),
    tags: z.array(z.string()).optional()
  })
});

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
  schema: z.object({
    sortWeight: z.number(),
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    date: z.date()
  })
});

const policiesCollection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/policies" }),
  schema: z.object({})
});

export const collections = {
  projects: projectsCollection,
  blog: blogCollection,
  policies: policiesCollection
};
