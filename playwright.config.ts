import { defineConfig, devices } from "@playwright/test";

// The suite runs against the built site served by `wrangler dev` (the real workerd runtime),
// not `astro preview` - the contact-form Action needs the actual Worker request path, bindings,
// and `cloudflare:workers` env. `bun run e2e:serve` builds with `--mode development` (so the
// always-passes Turnstile test key from `.env.development` is baked in) and starts wrangler on
// 8788. `E2E=true` makes astro.config.mjs swap the two external contact-form calls
// (Turnstile verify, email send) for the sentinel-driven stubs in src/actions/contact/testing/.
const PORT = 8788;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],

  use: {
    baseURL,
    trace: "on-first-retry"
  },

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } }
  ],

  webServer: {
    command: "bun run e2e:serve",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: { E2E: "true" }
  }
});
