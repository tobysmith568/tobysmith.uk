/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
  Alpine: import("alpinejs").Alpine;
}

declare namespace Cloudflare {
  // Secrets aren't declared in wrangler.jsonc (never committed), so `wrangler types` doesn't
  // know about them - set via `wrangler secret put` / `.dev.vars`, typed here by hand instead.
  interface Env {
    EMAIL_TO: string;
    EMAIL_FROM: string;
    TURNSTILE_SECRET_KEY: string;
  }
}
