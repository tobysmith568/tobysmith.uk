import alpinejs from "@astrojs/alpinejs";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

// E2E only (`E2E=true`, set by the Playwright webServer): redirect the two contact-form calls
// that would otherwise hit Cloudflare/Google - Turnstile verification and the email send - to
// the sentinel-driven stubs in src/actions/contact/testing/. Everything else in the action
// (routing, Zod, error mapping, MIME construction) still runs for real. The stubs are never
// imported in a normal build, so they tree-shake out of production entirely.
const isE2E = process.env.E2E === "true";

/** @type {import("vite").Plugin} */
const e2eContactStubs = {
  name: "e2e-contact-stubs",
  enforce: "pre",
  async resolveId(source, importer) {
    if (!importer || importer.includes("/actions/contact/testing/")) {
      return null;
    }

    if (!/\/contact\/(verifyTurnstileToken|sendPlainTextEmail)$/.test(source)) {
      return null;
    }

    return this.resolve(source.replace("/contact/", "/contact/testing/"), importer, {
      skipSelf: true
    });
  }
};

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

  vite: {
    plugins: isE2E ? [e2eContactStubs] : []
  },

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
