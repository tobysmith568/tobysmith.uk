import mdx from "@astrojs/mdx";
import { defineConfig } from "astro/config";

// https://astro.build/config

export default defineConfig({
  site: "https://tobysmith.uk",

  output: "static",
  trailingSlash: "never",

  prefetch: {
    prefetchAll: true
  },
  experimental: {
    clientPrerender: true
  },

  integrations: [mdx()]
});
