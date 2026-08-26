# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **A migration is in progress.** See [migration.md](./migration.md) at the repo root for the full
> plan. That file states its own rule: it must be revisited and updated at the end of every stage
> so it never describes a stack that's already gone — check it before assuming anything below is
> still current, and update this file accordingly as stages land.

## Project

Toby Smith's personal portfolio and blog (tobysmith.uk), built with Astro + TypeScript, statically
generated and deployed to GitHub Pages.

## Commands

- `bun install` — install dependencies
- `bun run dev` / `bun run start` — start the Astro dev server
- `bun run build` — type-check (`astro check`) then build the static site to `dist/`
- `bun run preview` — serve the built `dist/` output locally
- `bunx prettier --check .` — lint/format check (no linter is configured, only Prettier via
  `@tobysmith568/prettier-config`); use `bunx prettier --write .` to fix
- `bunx astro sync` — regenerate content collection types after editing
  `src/content/config.ts`
- `bunx cypress open` (`bun run cypress`) — open the Cypress UI for interactive E2E runs
- `bunx cypress run --spec cypress/e2e/<file>.cy.ts` — run a single E2E spec headlessly
  (requires the site running locally first, e.g. `bun run preview` at `http://localhost:4321`,
  matching `cypress.config.ts`'s `baseUrl`)

CI (`.github/workflows/integration.yml`) runs Prettier, `bun run build`, and the Cypress suite
(Chrome + Firefox) against a `--mode development` build served via `bun run preview`.

## Architecture

- **Static Astro site**, `output: "static"`, `build.format: "file"` (routes emit as `foo.html`,
  not `foo/index.html`) — see `astro.config.mjs`.
- **Content collections** (`src/content/config.ts`, legacy `defineCollection({ type: "content" })`
  API, not the newer Content Layer API): `projects`, `blog`, `policies`. Each collection's schema
  is a Zod object; `blog` and `projects` both use `sortWeight` for manual ordering. Blog posts can
  set a frontmatter `slug` that overrides the filename-derived slug (e.g.
  `src/content/blog/10-graduated.mdx` → `/blog/graduated`).
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
- **Contact form flow**: `Contact/ContactForm.astro` renders the form and loads Google reCAPTCHA
  (invisible v2). On submit, `src/scripts/contact/parseFormData.ts` validates the `FormData`, then
  `src/scripts/contact/sendContactEmail.ts` does a client-side `fetch` to a **separate**,
  independently-deployed Cloudflare Worker at `https://email.tobysmith.uk` (a different repo,
  `tobysmith568/email.tobysmith.uk`), which verifies the reCAPTCHA token and sends the email. This
  site has no server-side code of its own today — the Worker is the only backend involved.
- **Images**: `astro:assets`'s `<Image>`/`Astro.assets` is used for project logos
  (`src/components/Projects/resolveProjectImage.ts`, `Projects/ProjectListItem.astro`,
  `projects/[...slug].astro`), which requires build-time (Sharp) image processing.
- **Styling**: component-scoped `<style lang="scss">` blocks (Sass) throughout, no global
  CSS framework.
- **`generate-license-file`** is invoked at render time in `third-party.astro` to build the
  third-party license listing, reading `package.json` from the process's working directory.
- **E2E tests** (Cypress) follow a page-object pattern: `cypress/e2e/**/*.cy.ts` specs pair with
  `cypress/page-objects/**/*.po.ts` — one page object per route, exposing selectors/actions rather
  than specs interacting with the DOM directly.
- **Env vars**: `PUBLIC_RECAPTCHA_SITE_KEY` (`.env.development`, `.env.production`) is the only
  client-exposed var; the reCAPTCHA secret key lives only in the separate `email.tobysmith.uk`
  Worker, not this repo.
- **Deployment** (current, pre-migration): GitHub Actions builds the static site and deploys it to
  GitHub Pages (`.github/workflows/deployment.yml` → `integration.yml` → `actions/deploy-pages`),
  custom domain `tobysmith.uk`. This is the stage-appropriate description for pre-Stage-3 work
  only — Stage 3 moves the site to SSR on a Cloudflare Worker, and Stage 10 is the actual
  production cutover; see migration.md.
- **Package manager**: Bun (`bun.lock`), since Stage 2 of the migration. `astro`/`cypress` are
  invoked directly via `bunx` (or `bun run <script>` for the `package.json` script aliases) —
  there's no `bunx`-equivalent-of-`pnpm exec` distinction to worry about, both resolve the same
  local binaries.
