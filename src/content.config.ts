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
    tags: z.array(z.string()).optional(),
    // Shown as a row of links on the project's detail page (source / npm / live site).
    // All optional - not every project is on npm or has a live site.
    links: z
      .object({
        source: z.string().optional(),
        npm: z.string().optional(),
        site: z.string().optional()
      })
      .optional(),
    featured: z.boolean()
  })
});

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
  schema: z.object({
    sortWeight: z.number(),
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    date: z.date(),
    // Drives the index page's blog spotlight - mirrors the `projects` collection's `featured`
    // field exactly (see redesign.md's Decision log). No fixed spotlight count; the index shows
    // every post with featured: true.
    featured: z.boolean()
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
