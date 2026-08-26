# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **A migration is in progress.** See [migration.md](./migration.md) at the repo root for the full
> plan. That file states its own rule: it must be revisited and updated at the end of every stage
> so it never describes a stack that's already gone — check it before assuming anything below is
> still current, and update this file accordingly as stages land.

## Project

Toby Smith's personal portfolio and blog (tobysmith.uk), built with Astro + TypeScript. The
codebase now targets Cloudflare Workers hosting (Stage 3 of the migration), but **production is
still served by GitHub Pages, unchanged, until Stage 10's cutover** — see the Deployment bullet
below and migration.md.

## Commands

- `bun install` — install dependencies
- `bun run dev` / `bun run start` — start the Astro dev server (runs through the Cloudflare
  adapter's Vite plugin against the real `workerd` runtime, not a plain Node server)
- `bun run build` — type-check (`astro check`) then build to `dist/` (`dist/client/` static
  assets + `dist/server/` worker code, per the Cloudflare adapter's output shape)
- `bun run preview` — serve the built `dist/` output locally via `workerd`
- `bunx wrangler dev` — run the built site as an actual Worker locally (auto-detects
  `dist/client/wrangler.json`, a redirected config Astro's build writes); needs a build first
- `bun run generate-types` (`wrangler types`) — regenerate `worker-configuration.d.ts` after
  editing `wrangler.jsonc`
- `bunx prettier --check .` — lint/format check (no linter is configured, only Prettier via
  `@tobysmith568/prettier-config`); use `bunx prettier --write .` to fix
- `bunx astro sync` — regenerate content collection types after editing `src/content.config.ts`
- `bunx cypress open` (`bun run cypress`) — open the Cypress UI for interactive E2E runs
- `bunx cypress run --spec cypress/e2e/<file>.cy.ts` — run a single E2E spec headlessly
  (requires the site running locally first, e.g. `bun run preview` at `http://localhost:4321`,
  matching `cypress.config.ts`'s `baseUrl`)

`bun run dev`/`start`/`build` all run `bun run generate:licenses` first via `pre*` package.json
script hooks (Bun supports npm-style lifecycle hooks) — see "License list" below.

CI (`.github/workflows/integration.yml`) runs Prettier, `bun run build`, and the Cypress suite
(Chrome + Firefox) against a `--mode development` build served via `bun run preview`. The `e2e`
job calls `astro build` directly rather than `bun run build`, so it has its own explicit
`bun run generate:licenses` step first (the `prebuild` hook only fires for `bun run build`).

## Architecture

- **Astro site on the Cloudflare adapter** (`@astrojs/cloudflare`, `output: "static"` — the
  default and Astro's own recommendation for a mostly-static site; adding an adapter does _not_
  itself switch to on-demand rendering), `build.format: "file"` (routes emit as `foo.html`, not
  `foo/index.html`) — see `astro.config.mjs`. Every page route is still prerendered; the one
  on-demand route is the `/_actions/*` endpoint Astro injects for the contact-form Action (see
  below) — Astro registers it with `prerender: false` automatically, it isn't a file under
  `src/pages`.
  `adapter: cloudflare({ imageService: "compile" })` — the adapter's default image service
  (`"cloudflare-binding"`) defers `<Image>` to a runtime Cloudflare Images binding via an
  on-demand `/_image` endpoint, which 404s since nothing provisions that binding; `"compile"`
  keeps Sharp-based build-time optimization instead, which is correct since every image-bearing
  route is prerendered anyway.
- **Content collections** (`src/content.config.ts` — the Content Layer API requires this exact
  filename, not `src/content/config.ts`; `glob()` loaders): `projects`, `blog`, `policies`. Each
  collection's schema is a Zod object; `blog` and `projects` both use `sortWeight` for manual
  ordering. Entry identity works differently per collection: `blog`'s schema has a required
  `slug` field (e.g. `src/content/blog/10-graduated.mdx` → `slug: graduated`) — routing/links use
  `entry.data.slug`, not `entry.id`. `projects` and `policies` have no such field, so
  `entry.id` (the filename, extension stripped) is the routing key instead — e.g.
  `policies/privacy.mdx` → `entry.id === "privacy"`.
- **Routing**: `src/pages/blog/[...slug].astro` and `src/pages/projects/[...slug].astro` are
  `getStaticPaths()`-driven detail pages reading from the collections above; `blog/index.astro`
  and `projects/index.astro` are their listings. `blog/rss.xml.ts` builds the RSS feed from the
  `blog` collection (via `@astrojs/rss`); `blog/rss.ts` just re-exports its `GET` handler so
  `/blog/rss` and `/blog/rss.xml` both work.
  `about.astro`/`contact.astro`/`cookies.astro`/`privacy.astro`/`terms.astro`/`third-party.astro`
  are standalone one-off pages.
- **Layouts**: `BaseLayout.astro` wraps every page (header/nav/footer, `<head>`). `ProseLayout.astro`
  and the `Prose.astro` component style long-form content (blog posts, policy pages).
  `PolicyLayout.astro` wraps the policy pages specifically.
- **Contact form flow**: `Contact/ContactForm.astro` renders the form and loads Cloudflare
  Turnstile (`managed` mode, explicit client-side rendering so the challenge can be deferred until
  form submit — `turnstile.render()` with `execution: "execute"`, then `turnstile.execute()` on
  submit, mirroring the old invisible-reCAPTCHA UX). On submit,
  `src/scripts/contact/parseFormData.ts` validates the `FormData` client-side, then
  `src/scripts/contact/sendContactEmail.ts` calls the `contact` Astro Action (`src/actions/index.ts`,
  same-origin, no CORS needed) — Astro auto-injects its RPC endpoint at `/_actions/contact`. The
  action re-validates input with its own Zod schema, verifies the Turnstile token server-side
  (`src/actions/contact/verifyTurnstileToken.ts`, against Cloudflare's own siteverify endpoint),
  then sends the email (`src/actions/contact/sendPlainTextEmail.ts`, via `mimetext` + the `SEB`
  `send_email` binding declared in `wrangler.jsonc`). **This backend used to live in a separate
  Cloudflare Worker repo (`tobysmith568/email.tobysmith.uk`) — folded into this repo in Stage 4.**
  That old Worker is still deployed and still what production actually uses (GitHub Pages/its own
  Worker) until Stage 10's cutover; don't decommission it yet.
- **Images**: `astro:assets`'s `<Image>`/`Astro.assets` is used for project logos
  (`src/components/Projects/resolveProjectImage.ts`, `Projects/ProjectListItem.astro`,
  `projects/[...slug].astro`), which requires build-time (Sharp) image processing — see the
  `imageService: "compile"` note above; this breaks (404s) without it.
- **Styling**: plain component-scoped `<style>` blocks (native CSS nesting), no preprocessor —
  Sass was dropped in Stage 3 (nothing here used a Sass feature without a native CSS equivalent
  except `BaseLayout.astro`'s `lighten()` calls, replaced with `color-mix(in srgb, ...)`).
- **License list**: `scripts/generate-licenses.mjs` runs `generate-license-file`'s
  `getProjectLicenses` as a standalone `bun` script (via the `generate:licenses` package.json
  script, wired in as a `pre*` hook on `dev`/`start`/`build`) and writes
  `src/data/licenses.generated.json` (gitignored). `third-party.astro` statically imports that
  file rather than calling `getProjectLicenses` at render time — it used to, but that dependency
  chain uses `__dirname`, which is undefined once the Cloudflare adapter bundles prerendered
  pages into ESM chunks (via rolldown) for its build-time prerenderer, so calling it from inside
  the page crashed the build.
- **E2E tests** (Cypress) follow a page-object pattern: `cypress/e2e/**/*.cy.ts` specs pair with
  `cypress/page-objects/**/*.po.ts` — one page object per route, exposing selectors/actions rather
  than specs interacting with the DOM directly.
- **Env vars**: `PUBLIC_TURNSTILE_SITE_KEY` (`.env.development`, `.env.production`) is the only
  client-exposed var — `.env.development` uses Cloudflare's published "always passes" invisible
  test sitekey; `.env.production` still has a `REPLACE_ME` placeholder pending Stage 5's one
  Toby-only step (see migration.md). Server-side, the contact Action reads bindings/secrets via
  `import { env } from "cloudflare:workers"` (the current adapter's `Astro.locals.runtime.env` was
  removed — using it now throws, pointing at this import instead). `TURNSTILE_ENDPOINT` is a plain,
  non-sensitive `vars` entry in `wrangler.jsonc`; `EMAIL_TO`/`EMAIL_FROM`/`TURNSTILE_SECRET_KEY` are
  real Worker secrets (`wrangler secret put`, never committed) and are typed by hand in
  `src/env.d.ts` (augmenting `Cloudflare.Env`) since `wrangler types` only knows about bindings/vars
  actually declared in `wrangler.jsonc`. Locally, `wrangler dev`/`astro dev`/`astro build` read
  `.dev.vars` (gitignored) for these instead — seeded with Cloudflare's published "always passes"
  Turnstile test secret. `scripts/setup-turnstile.ts` (run manually, not in CI) creates the real
  widget via the Cloudflare API and prints the real sitekey/secret.
- **Deployment**: `wrangler.jsonc` configures the Cloudflare Worker (`name: "tobysmith-uk"`,
  `main` pointing at the adapter's own generated server entrypoint, an `assets` binding at
  `./dist`, a `send_email` binding named `SEB` with **no** `destination_address` — this repo is
  public, so the real recipient only ever lives in the `EMAIL_TO` secret, never committed).
  `deployment.yml` builds via `integration.yml`, downloads that build artifact, then deploys with
  `cloudflare/wrangler-action`, which also pushes `EMAIL_TO`/`EMAIL_FROM`/`TURNSTILE_SECRET_KEY` as
  real Worker secrets (via its `secrets:` input, sourced from matching GitHub Actions secrets) —
  those three don't exist as GitHub secrets yet, so this step is unexercised until Stage 10 anyway.
  **This is still not what's live in production** —
  per the migration's big-bang ground rule, `tobysmith.uk` keeps being served by GitHub Pages
  unchanged until Stage 10 explicitly cuts over; `wrangler.jsonc` deliberately has no `routes`
  entry yet, so `wrangler deploy` only ever targets a harmless `*.workers.dev` preview URL until
  then. `wrangler dev`/`wrangler deploy` for local preview auth via `wrangler login` (personal
  OAuth) with no stored token needed; the `CLOUDFLARE_API_TOKEN`/`CLOUDFLARE_ACCOUNT_ID` GitHub
  secrets `deployment.yml` reads are only required once it runs for real, in Stage 10. See
  migration.md.
- **Package manager**: Bun (`bun.lock`), since Stage 2 of the migration. `astro`/`cypress` are
  invoked directly via `bunx` (or `bun run <script>` for the `package.json` script aliases) —
  there's no `bunx`-equivalent-of-`pnpm exec` distinction to worry about, both resolve the same
  local binaries.
