import mdx from "@astrojs/mdx";
import { defineConfig } from "astro/config";

import alpinejs from "@astrojs/alpinejs";

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
  integrations: [mdx(), alpinejs()],
  markdown: {
    shikiConfig: {
      theme: "light-plus"
    }
  }
});
