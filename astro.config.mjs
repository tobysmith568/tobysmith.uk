import alpinejs from "@astrojs/alpinejs";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://tobysmith.uk",
  output: "static",
  trailingSlash: "never",

  build: {
    format: "file"
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport"
  },

  experimental: {
    clientPrerender: true
  },

  integrations: [mdx(), alpinejs(), sitemap()],

  markdown: {
    shikiConfig: {
      theme: "light-plus"
    }
  },

  adapter: cloudflare({
    // Every image-bearing route is prerendered, so images can be optimized once at build time
    // with Sharp - the adapter's default ("cloudflare-binding") instead defers to a runtime
    // Cloudflare Images binding via an on-demand /_image endpoint, which 404s because nothing
    // ever provisions that binding here.
    imageService: "compile"
  })
});
