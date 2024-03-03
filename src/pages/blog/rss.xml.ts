import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async _context => {
  const blog = await getCollection("blog");
  const year = new Date().getFullYear();

  return rss({
    title: "Toby Smith's Blog",
    description: "Blog posts written by Toby about things he creates or finds interesting.",
    site: "https://tobysmith.uk/blog",

    items: blog.map(post => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/blog/${post.slug}`
    })),

    customData: [
      `<language>en-gb</language>`,
      `<copyright>${year} Toby Smith. All rights reserved.</copyright>`,
      `<lastBuildDate>${new Date()}</lastBuildDate>`,
      `<webMaster>contact@tobythe.dev (Toby Smith)</webMaster>`,
      `<ttl>7200</ttl>`
    ].join("")
  });
};
