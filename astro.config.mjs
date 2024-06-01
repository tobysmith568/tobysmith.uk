import alpinejs from "@astrojs/alpinejs";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://tobysmith.uk",
  output: "static",
  trailingSlash: "never",
  build: {
    format: "file"
  },
  prefetch: {
    prefetchAll: true
  },
  experimental: {
    clientPrerender: true
  },
  integrations: [mdx(), alpinejs(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: "light-plus"
    }
  }
});
