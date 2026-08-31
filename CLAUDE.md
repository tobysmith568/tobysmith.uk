# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **A migration is in progress.** See [migration.md](./migration.md) at the repo root for the full
> plan; it is kept current as work lands, so check it before assuming anything below is still
> accurate, and keep this file in step with it. The technical rework (framework, hosting, tooling,
> tests, backend) plus the general cleanup pass are code-complete and on this branch; what
> remains is the **collaborative visual redesign** and then the **production cutover** (the one
> real deploy — flip DNS, retire GitHub Pages, decommission the old email Worker). The redesign
> was deliberately moved ahead of the cutover so the site goes live once, already looking the way
> it should — see migration.md. Delete this blockquote and the GitHub-Pages / old-Worker caveats
> below once the cutover has landed.

## Project

Toby Smith's personal portfolio and blog (tobysmith.uk), built with Astro + TypeScript. The
codebase now targets Cloudflare Workers hosting, but **production is still served by GitHub
Pages, unchanged, until the production cutover** — see the Deployment bullet below and
migration.md.

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
- `bun run lint` (`eslint .`) — lint check; `bunx eslint . --fix` to autofix. `eslint.config.mjs`
  (flat config) layers `typescript-eslint/recommended`, `eslint-plugin-astro`'s `flat/recommended`
  and `flat/jsx-a11y-recommended` (real `.astro` **template** a11y linting), plus
  `eslint-plugin-playwright`'s `flat/recommended` scoped to `e2e/**` + `playwright.config.ts`. The
  handful of rule overrides are commented inline in that file.
  `docs/adrs/0001-eslint-over-oxlint-and-biome.md` records why ESLint over oxlint/Biome.
- `bun run format:check` (`prettier --check .`) — whole-repo format check via Prettier +
  `@tobysmith568/prettier-config` (bundles `prettier-plugin-astro`, so `.astro` goes through the
  same tool as everything else); `bun run format` (`prettier --write .`) to fix.
  `worker-configuration.d.ts` and `dist` are in `.prettierignore`.
  `docs/adrs/0002-prettier-over-oxfmt.md` records why Prettier over oxfmt.
- `bunx astro sync` — regenerate content collection types after editing `src/content.config.ts`
- `bun run e2e` (`playwright test`) — run the Playwright E2E suite (chromium + firefox
  projects). Playwright's own `webServer` runs `bun run e2e:serve`
  (`generate:licenses` → `astro build --mode development` → `wrangler dev --port 8788`) and
  waits on `http://localhost:8788` (`playwright.config.ts`'s `baseURL`); locally it reuses an
  already-running server on that port. `bun run e2e:ui` opens the Playwright UI. Needs
  `.dev.vars` present (copy `.dev.vars.example`) and browsers installed
  (`bunx playwright install chromium firefox`). See "E2E tests" under Architecture for the
  contact-form stubbing.

`bun run dev`/`start`/`build` all run `bun run generate:licenses` first via `pre*` package.json
script hooks (Bun supports npm-style lifecycle hooks) — see "License list" below.

CI (`.github/workflows/integration.yml`) runs ESLint, Prettier, `bun run build`, and the
Playwright suite (chromium + firefox). The `e2e` job installs Playwright browsers, copies
`.dev.vars.example` → `.dev.vars`, then runs `bunx playwright test` — the `webServer` in
`playwright.config.ts` handles the licenses/build/`wrangler dev` chain itself (so there's no
separate build step for that job, and `E2E=true` reaches `astro build` via `webServer.env`).
`integration.yml` triggers on PRs to `main` and pushes to `renovate/*`, and is also
`workflow_call`ed by `deployment.yml` (which runs on push to `main` — harmless until the cutover
adds a `routes` entry, see Deployment). `.github/workflows/codeql-analysis.yml` runs CodeQL
separately.

## Architecture

- **Non-obvious tooling/architecture decisions are recorded as ADRs in `docs/adrs/`** (one
  decision per file, numbered, no template — see the existing files for the expected shape/tone)
  rather than only in this file or `migration.md` — check there before re-litigating a choice
  that already has a documented rationale.
- **Astro site on the Cloudflare adapter** (`@astrojs/cloudflare`, `output: "static"` — the
  default and Astro's own recommendation for a mostly-static site; adding an adapter does _not_
  itself switch to on-demand rendering), `build.format: "file"` (routes emit as `foo.html`, not
  `foo/index.html`) — see `astro.config.mjs`. Every page route is still prerendered; the one
  on-demand routes are the `/_actions/*` endpoint Astro injects for the contact-form Action (see
  below) — Astro registers it with `prerender: false` automatically, it isn't a file under
  `src/pages` — and `contact.astro`'s own explicit `export const prerender = false` (see
  the Routing bullet below).
  `adapter: cloudflare({ imageService: "compile" })` — the adapter's default image service
  (`"cloudflare-binding"`) defers `<Image>` to a runtime Cloudflare Images binding via an
  on-demand `/_image` endpoint, which 404s since nothing provisions that binding; `"compile"`
  keeps Sharp-based build-time optimization instead, which is correct since every image-bearing
  route is prerendered anyway.
  Also set in `astro.config.mjs`: `site: "https://tobysmith.uk"` (used by the sitemap + RSS),
  `trailingSlash: "never"`, `prefetch` (`prefetchAll` / `viewport` strategy),
  `experimental: { clientPrerender: true }`, and a Shiki `light-plus` code theme.
- **Content collections** (`src/content.config.ts` — the Content Layer API requires this exact
  filename, not `src/content/config.ts`; `glob()` loaders): `projects`, `blog`, `policies`. Each
  collection's schema is a Zod object; `blog` and `projects` both use `sortWeight` for manual
  ordering. Entry identity works differently per collection: `blog`'s schema has a required
  `slug` field (e.g. `src/content/blog/10-graduated.mdx` → `slug: graduated`) — routing/links use
  `entry.data.slug`, not `entry.id`. `projects` and `policies` have no such field, so
  `entry.id` (the filename, extension stripped) is the routing key instead — e.g.
  `policies/privacy.mdx` → `entry.id === "privacy"`. `projects` also has a required `featured`
  boolean — an explicit editorial flag driving the index page's Projects
  spotlight, independent of `sortWeight`; two of the four projects are currently `featured: true`.
- **Routing**: `src/pages/blog/[...slug].astro` and `src/pages/projects/[...slug].astro` are
  `getStaticPaths()`-driven detail pages reading from the collections above; `blog/index.astro`
  and `projects/index.astro` are their listings. `blog/rss.xml.ts` builds the RSS feed from the
  `blog` collection (via `@astrojs/rss`); `blog/rss.ts` just re-exports its `GET` handler so
  `/blog/rss` and `/blog/rss.xml` both work.
  `cookies.astro`/`privacy.astro`/`terms.astro`/`third-party.astro` are standalone one-off pages.
  `about.astro` no longer exists (its content was folded into `index.astro`, see below) and
  `contact.astro` is now a redirect-only route (`export const prerender = false` + a bare
  `return Astro.redirect("/#contact")` in its frontmatter) — the only on-demand page route besides
  Astro's own injected `/_actions/*` endpoint; making it on-demand gets a real `302`, not the
  2-second client-side meta-refresh a prerendered `Astro.redirect()` would otherwise emit for a
  static route.
- **Index page** (`src/pages/index.astro`) composes five sections from `src/components/Index/`:
  `Hero.astro` (name/tagline, pre-existing), `About.astro` (folded in from the old
  `/about` page's content, typos fixed), `ProjectsSpotlight.astro` (featured projects, reusing
  `Projects/ProjectListItem.astro`, "More projects →" link to `/projects`), `BlogSpotlight.astro`
  (most recent posts by `sortWeight` — count currently hardcoded to 2, an explicit placeholder
  deferred to a future design pass per migration.md's "Open items"; "More posts →" link to
  `/blog`), and `ContactSection.astro` (wraps `Contact/ContactForm.astro`, `id="contact"` — the
  target of `contact.astro`'s redirect above).
- **Layouts**: `BaseLayout.astro` wraps every page (header/nav/footer, `<head>`). `ProseLayout.astro`
  and the `Prose.astro` component style long-form content (blog posts, policy pages); `Index/About.astro`
  also wraps its prose in `Prose.astro` directly (it isn't itself a full page, so it doesn't go
  through `ProseLayout`).
  `PolicyLayout.astro` wraps the policy pages specifically.
- **Header/nav** (`BaseLayout/Header.astro`): desktop nav links to `/projects`, `/blog`, and
  `/#contact` (no `/about` link — that page is gone); `Header.astro` owns the link list and
  passes it to `MobileMenu.astro` as a `links` prop. Below 640px the links are hidden and an
  icon `<button>` ("Open menu") shows instead — these are plain media queries on the elements,
  not `.desktop-only`/`.mobile-only` helper classes (those were removed after they lost a
  specificity fight and rendered both at once). Mobile nav (`BaseLayout/MobileMenu.astro`) uses
  Alpine.js: `x-data="{ mobileMenuOpen: false }"` on the `<nav>` in `Header.astro`, the toggle
  button sets it `true`, and the drawer has its own close button + `@keydown.escape.window`; an
  `x-effect` locks body scroll while open. `x-show`/`x-cloak`/`x-transition` on the drawer root —
  the child component's `x-show` sees the parent's `x-data` because Alpine scopes by rendered-DOM
  nesting, not Astro component identity. `[x-cloak] { display: none !important; }` in
  `global.css` prevents a flash of the unhydrated drawer. The drawer had a real z-index bug once
  (painted behind page content) — it carries an explicit `z-index: 100` now.
- **Contact form flow**: `Contact/ContactForm.astro` (rendered on the index page inside
  `Index/ContactSection.astro` — see the Index page bullet above) renders the form
  and loads Cloudflare
  Turnstile (`managed` mode, explicit client-side rendering so the challenge can be deferred until
  form submit — `turnstile.render()` with `execution: "execute"`, then `turnstile.execute()` on
  submit, mirroring the old invisible-reCAPTCHA UX). On submit,
  `src/scripts/contact/parseFormData.ts` validates the `FormData` client-side, then
  `src/scripts/contact/sendContactEmail.ts` calls the `contact` Astro Action (`src/actions/index.ts`,
  same-origin, no CORS needed) — Astro auto-injects its RPC endpoint at `/_actions/contact`. The
  action re-validates input with its own Zod schema, verifies the Turnstile token server-side
  (`src/actions/contact/verifyTurnstileToken.ts`, against Cloudflare's own siteverify endpoint),
  then sends the email (`src/actions/contact/sendPlainTextEmail.ts`, via `mimetext` + the `SEB`
  `send_email` binding declared in `wrangler.jsonc`). On a send failure the action logs the real
  error server-side (`console.error`, visible in Worker tail logs) and throws an `ActionError`
  with a generic user-facing message — raw error strings can carry internal binding detail, so
  they never reach the browser. **This backend used to live in a separate Cloudflare Worker repo
  (`tobysmith568/email.tobysmith.uk`) — folded into this repo.** That old Worker is still deployed
  and still what production actually uses until the production cutover; don't decommission it yet.
- **Images**: `astro:assets`'s `<Image>`/`Astro.assets` is used for project logos
  (`src/components/Projects/resolveProjectImage.ts`, `Projects/ProjectListItem.astro`,
  `projects/[...slug].astro`), which requires build-time (Sharp) image processing — see the
  `imageService: "compile"` note above; this breaks (404s) without it.
- **Styling**: plain component-scoped `<style>` blocks with native CSS nesting, no preprocessor
  (Sass was dropped; `lighten()` → `color-mix(in srgb, ...)`). Design tokens live in
  `src/styles/tokens.css`, shared resets + utilities in `src/styles/global.css` (both imported
  once from `BaseLayout.astro`): `.wrap` (page shell at `--shell`), `.section` (the two-track
  label-gutter grid used by the Index sections — mono `.eyebrow` in a `--gutter` column on
  ≥960px, body at `--measure`, 1px `--ink` opening rule), `.eyebrow`, `.text-link` / `.more`
  (link + section-action affordances, resting `--underline` → `--accent` on hover), `.sr-only`.
  Icons are inline SVG via `src/components/Icon.astro` (`name` prop; geometric, 1.5px stroke,
  `currentColor`) — no icon dependency, no SVG asset files.
- **License list**: `scripts/generate-licenses.mjs` runs `generate-license-file`'s
  `getProjectLicenses` as a standalone `bun` script (via the `generate:licenses` package.json
  script, wired in as a `pre*` hook on `dev`/`start`/`build`) and writes
  `src/data/licenses.generated.json` (gitignored). `third-party.astro` statically imports that
  file rather than calling `getProjectLicenses` at render time — it used to, but that dependency
  chain uses `__dirname`, which is undefined once the Cloudflare adapter bundles prerendered
  pages into ESM chunks (via rolldown) for its build-time prerenderer, so calling it from inside
  the page crashed the build. `generate-license-file` has no `bun.lock`-specific code path (it
  only special-cases `pnpm-lock.yaml`, else falls back to walking the installed `node_modules`
  tree via `@npmcli/arborist`) — that fallback is what runs here and it resolves the full tree
  correctly from Bun's node-compatible `node_modules`, so no config is needed, but a
  `bun install` must have populated `node_modules` first (the `generate:licenses` script and the
  CI jobs that call it all run after `bun install`).
- **E2E tests** (Playwright, `playwright.config.ts`) follow a page-object pattern:
  `e2e/**/*.spec.ts` specs pair with `e2e/page-objects/**/*.po.ts` — one page object per route
  (constructor takes `Page`, getters return `Locator`), exposing selectors/actions rather than
  specs touching the DOM directly. Suite runs against the built site under `wrangler dev` (real
  workerd), not `astro preview`, so the contact-form Action's real request path is exercised.
  The **contact-form flow is tested end-to-end** — real `/_actions/contact` route, Zod schema,
  `ActionError` mapping, `#result-message` UI, and (happy path) a real server-side Turnstile
  siteverify call + a real local `SEB` email send (`.wrangler/tmp/`). Only the two external
  boundaries are stubbed, both driven by test input so a single server covers every outcome:
  - **Server side**: `astro.config.mjs`'s `e2e-contact-stubs` Vite plugin (active only when
    `E2E=true`) redirects `src/actions/contact/{verifyTurnstileToken,sendPlainTextEmail}` to the
    stubs in `src/actions/contact/testing/`. Those delegate to the real implementation unless
    the token is exactly `e2e-turnstile-fail` or the message contains `[e2e:send-fail]`, which
    force the respective failure branches. Never imported in a normal build (tree-shaken out).
  - **Browser side**: `e2e/support/turnstile.ts`'s `stubTurnstile(page)` blocks the real
    `challenges.cloudflare.com/turnstile/*` script and installs a fake `window.turnstile` via
    `page.addInitScript` that keeps the same `render`/`execute` contract — the real widget is
    third-party UI that's flaky to automate. The token it issues still travels to the real Action.
- **Env vars**: `PUBLIC_TURNSTILE_SITE_KEY` (`.env.development`, `.env.production`) is the only
  client-exposed var — `.env.development` uses Cloudflare's published "always passes" invisible
  test sitekey; `.env.production` still has a `REPLACE_ME` placeholder pending one Toby-only step
  (see migration.md). Server-side, the contact Action reads bindings/secrets via
  `import { env } from "cloudflare:workers"` (the current adapter's `Astro.locals.runtime.env` was
  removed — using it now throws, pointing at this import instead). `TURNSTILE_ENDPOINT` is a plain,
  non-sensitive `vars` entry in `wrangler.jsonc`; `EMAIL_TO`/`EMAIL_FROM`/`TURNSTILE_SECRET_KEY` are
  real Worker secrets (`wrangler secret put`, never committed) and are typed by hand in
  `src/env.d.ts` (augmenting `Cloudflare.Env`) since `wrangler types` only knows about bindings/vars
  actually declared in `wrangler.jsonc`. Locally, `wrangler dev`/`astro dev`/`astro build` read
  `.dev.vars` (gitignored) for these instead — seeded with Cloudflare's published "always passes"
  Turnstile test secret. `.dev.vars.example` (committed, all-public test values) is what a new
  checkout / the CI E2E job copies to `.dev.vars`. `scripts/setup-turnstile.ts` (run manually,
  not in CI) creates the real widget via the Cloudflare API and prints the real sitekey/secret.
- **Deployment**: `wrangler.jsonc` configures the Cloudflare Worker (`name: "tobysmith-uk"`,
  `main` pointing at the adapter's own generated server entrypoint, an `ASSETS` binding at
  `./dist`, a `send_email` binding named `SEB` with **no** `destination_address` — this repo is
  public, so the real recipient only ever lives in the `EMAIL_TO` secret, never committed —
  `compatibility_flags: ["global_fetch_strictly_public"]` (not `nodejs_compat` — nothing in the
  deployed bundle uses Node builtins), and `observability.enabled`).
  `deployment.yml` builds via `integration.yml`, downloads that build artifact, then deploys with
  `cloudflare/wrangler-action`, which also pushes `EMAIL_TO`/`EMAIL_FROM`/`TURNSTILE_SECRET_KEY` as
  real Worker secrets (via its `secrets:` input, sourced from matching GitHub Actions secrets) —
  those three don't exist as GitHub secrets yet, so this step is unexercised until the production
  cutover anyway.
  **This is still not what's live in production** —
  per the migration's big-bang ground rule, `tobysmith.uk` keeps being served by GitHub Pages
  unchanged until the production cutover explicitly happens; `wrangler.jsonc` deliberately has no
  `routes` entry yet, so `wrangler deploy` only ever targets a harmless `*.workers.dev` preview URL
  until then. `wrangler dev`/`wrangler deploy` for local preview auth via `wrangler login`
  (personal OAuth) with no stored token needed; the `CLOUDFLARE_API_TOKEN`/`CLOUDFLARE_ACCOUNT_ID`
  GitHub secrets `deployment.yml` reads are only required once it runs for real, at the production
  cutover. See migration.md.
- **Package manager**: Bun (`bun.lock`). `astro`/`wrangler`/`playwright` are
  invoked directly via `bunx` (or `bun run <script>` for the `package.json` script aliases) —
  there's no `bunx`-equivalent-of-`pnpm exec` distinction to worry about, both resolve the same
  local binaries.
