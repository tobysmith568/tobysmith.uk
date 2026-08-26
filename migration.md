# tobysmith.uk — Modernization Plan

A full technical, functional, and (eventually) aesthetic rework of the site. This document
breaks the work into independent stages. It will be deleted once the migration is complete.

## This is a living document — read this before touching any stage

This file, not the chat history of whichever session is doing the work, is the source of truth
for migration progress. Different sessions/agents will pick this up at different times, so
nothing that matters for continuing the work should live only in a conversation.

- **Before starting work:** read this whole file, especially the most recently completed
  stage's "Outcome / deviations" notes — they may change assumptions later stages were written
  against.
- **After finishing a stage:** mark its heading `✅ done`, and add an
  **`Outcome / deviations from the plan above:`** subsection immediately under its `Exit
criteria` line, documenting: what actually happened, anything that deviated from the plan as
  written, bugs/gotchas found along the way, and anything the _next_ stage needs to know that
  wasn't obvious when this plan was drafted. Follow the pattern already used in the
  [read-receipt modernization plan](https://github.com/tobysmith568/read-receipt/blob/ts/modernisation/docs/modernization-plan.md)
  this document was modeled on.
- **If a stage is only partially done or blocked:** say so explicitly in that stage's section
  (e.g. `⏸ in progress — see notes`) rather than leaving it looking untouched or silently
  stopping mid-stage with no record of why.
- Resolve items in "Open items" (at the end of this file) into the relevant stage's notes once
  decided, rather than leaving the decision only in chat.

## Ground rules

- **Single branch, big-bang cutover.** The whole migration happens on one long-lived branch —
  no intermediate PRs or merges to `main`, no per-stage production deploys. Continuous
  deployment resumes normally once this branch merges to `main` at the very end, which is the
  one and only deploy this migration triggers. That final merge/deploy is watched closely by
  hand rather than trusted to automation.
- **Local CI after every stage.** Since nothing runs through GitHub Actions until the final PR,
  each stage ends with running, locally, whatever the _current_ equivalent of lint/build/test is
  at that point in the migration (e.g. `pnpm exec prettier --check .` early on, `bun run lint`/
  `oxfmt --check` later; `astro check`/`astro build` or `wrangler deploy --dry-run` depending on
  the stage; the current e2e suite, Cypress or Playwright). Treat this as a manual gate exactly
  as strict as CI would be — don't move to the next stage on a red result.
- CI/CD workflow files (`integration.yml`/`deployment.yml`, once Stage 2 renames them) are still
  updated in the same stage that changes the
  tool/pipeline they invoke, so they're correct and ready to actually run the moment the final
  PR opens — they just won't execute for real until then.
- No stage silently drops test coverage. If a migration temporarily loses something (e.g. a
  Cypress test not yet ported to Playwright), that's called out explicitly, not silently carried
  forward.
- Later stages assume earlier stages are done — see "Depends on" per stage.
- `CLAUDE.md`/`.claude/` config (added in Stage 1) is a living document — amend it as the
  last step of every later stage so it never describes a stack that's already gone.
- A few decisions are intentionally deferred to the stage that actually needs them (exact
  number of spotlighted items on the index, per-post blog curation, the visual redesign) —
  see "Open items" at the end. Don't pre-decide these; revisit when that stage starts.
- **Never trust a GitHub Actions version pin (`@vN`) from this document, from chat, or from
  copying another of Toby's repos — check the action's own upstream repo (its releases/tags)
  for what's actually latest at the moment each stage is implemented.** Every `@vN` mentioned
  below reflects whatever was current when this plan (or the repo it was copied from) was
  written, not necessarily what's current when a stage actually runs.

## Current stack (baseline)

- Runtime/package manager: Node 22 + pnpm (`pnpm-lock.yaml`, `pnpm-workspace.yaml`)
- Framework: Astro 4.16, `output: "static"`, `build.format: "file"`
- Lint/format: no linter; Prettier (`@tobysmith568/prettier-config`)
- E2E tests: Cypress, run against a static preview build in CI (chrome + firefox)
- Bot protection: Google reCAPTCHA v2 (invisible), site key in `.env.production`
- Contact form: client-side `fetch` from `src/scripts/contact/sendContactEmail.ts` to a
  **separate** Cloudflare Worker, `tobysmith568/email.tobysmith.uk` (private repo) — validates
  the reCAPTCHA token, then sends a plaintext email via a Cloudflare `send_email` binding
- Hosting: static build deployed to GitHub Pages via `actions/deploy-pages`, custom domain
  `tobysmith.uk` — **DNS is already on Cloudflare nameservers** (confirmed via `dig`), so moving
  to a Cloudflare Worker needs no DNS provider migration, just pointing the existing zone at
  the Worker instead of GitHub Pages
- Content: `about.mdx`, `contact.astro`, `projects/*` + `[...slug]`, `blog/*` + `[...slug]`
  (10 posts) + RSS, `privacy`/`terms`/`cookies`/`third-party` policy pages
- No unit tests; `.idea/` project files are tracked in git — flagged during planning, but
  deliberately left as-is (Toby's call: no active JetBrains usage means no ongoing churn from
  it, not worth a cleanup step). Noting this explicitly so it doesn't read as a dropped thread.
- `src/content/config.ts` uses the legacy `defineCollection({ type: "content", ... })` shape
  (pre-Content-Layer-API), and `getCollection`/`entry.slug`/`entry.render()` are used throughout
  `blog/index.astro`, `blog/[...slug].astro`, `blog/rss.xml.ts`, `projects/index.astro`, and
  `projects/[...slug].astro` — all of this is Astro 4-era API that Stage 3's version bump directly
  affects (see that stage for specifics).
- `astro:assets`'s `<Image>` component is used in `projects/[...slug].astro` and
  `Projects/ProjectListItem.astro` (project logos) — relevant to the Cloudflare adapter, since
  Sharp-based image optimisation doesn't run inside the Workers runtime itself (see Stage 3).

## Decisions already made (from planning discussion)

- **Blog**: kept. Per-post curation (keep/rewrite/drop) happens later, as its own pass — not
  blocking any technical stage below.
- **About page**: dropped as a standalone route; its content is folded into the index page.
- **Contact page**: dropped as a standalone route, but `/contact` keeps working — it becomes a
  redirect to `/#contact` (an anchor on the index page), so existing links to it keep working
  and land the visitor on the form immediately. SSR makes this reliable (the target section is
  present in the initial HTML, unlike an SPA where the anchor might not exist yet when the
  browser tries to scroll); the header's `scroll-margin-top` needs sizing to the sticky nav so
  the section doesn't land underneath it.
- **Projects & Blog on the index**: both keep their own listing (`/projects`, `/blog`) and
  detail (`/projects/[slug]`, `/blog/[slug]`) pages unchanged. The index page additionally gets
  a spotlight section for each, with a "More →" link to the full listing. Projects are spotlighted
  via an explicit `featured: boolean` added to the content collection schema (editorial choice,
  independent of `sortWeight`); Blog spotlights the most recent posts by date (recency is already
  the right signal there). Exact spotlight count (2 vs 3) is a layout call, deferred to the
  design stage.
- **Backend consolidation**: confirmed `email.tobysmith.uk` is only used by this site (not
  shared with other properties), so its logic is folded directly into this repo's Worker rather
  than kept as a separate deployed service.
- **reCAPTCHA → Turnstile**: confirmed free for this site's traffic level.

## Stage 1 — AI tooling (`CLAUDE.md` + `.claude/`) ✅ done

**Depends on:** nothing. Do this first for agent context on every later stage.

- Run `/init` to scaffold `CLAUDE.md`: project purpose, architecture (`src/pages`, `src/content`
  collections, `src/components`), dev commands, required env vars, test commands, and the
  deployment path (this stage: still GitHub Pages; update again once Stage 4 lands).
- Add a project-level `.claude/settings.json` (committed) with sensible pre-approved permissions
  for this repo — use the `update-config` skill.
- Note in `CLAUDE.md` that it must be revisited at the end of every later stage.

**Exit criteria:** `CLAUDE.md` accurately describes the current (pre-migration) stack;
`.claude/settings.json` committed.

### Outcome / deviations from the plan above

Both files landed as planned, no deviations.
`CLAUDE.md` documents commands, the content-collection/routing/contact-form architecture, and
flags itself + `migration.md` as living documents to revisit each stage.
`.claude/settings.json` pre-approves the pnpm scripts (`install`/`dev`/`start`/`build`/`preview`,
plus `exec astro`/`exec prettier`/`exec cypress`), read-only git commands, and a few common
read-only shell commands (`ls`/`find`/`cat`) — no hooks or other config were needed for this
stage. One thing worth flagging for whoever picks up Stage 2 next: neither `.claude/` nor
`CLAUDE.md` existed before this stage, and running `pnpm install`/`pnpm exec prettier --check .`
as the local-CI gate surfaced that `migration.md` itself wasn't Prettier-clean (mixed
`*emphasis*`/`_emphasis_` markdown and a couple of mis-indented lines, from whatever generated
the original plan) — fixed here with `prettier --write` since it was purely cosmetic
(no wording changed); flagging in case that's surprising to see in this stage's diff.

## Stage 2 — Bun as package manager ✅ done

**Depends on:** nothing, but do early since every later stage's CI/local commands run through it.

- Replace `pnpm-lock.yaml` with `bun.lock`; run `bun install`.
- Update `package.json` (`packageManager` field, scripts — `astro`/`cypress` invocations don't
  need `bunx` since they're already `astro`/`cypress` binary names, but confirm).
- Remove `.npmrc` (pnpm/eslint/prettier-hoist specific) and `pnpm-workspace.yaml`; only add a
  `bunfig.toml` (`trustedDependencies`) if `sharp`/`esbuild`'s postinstall scripts need it under Bun.
- `ci.yml`/`cd.yml` currently checkout via the shared composite action
  `tobysmith568/actions/.github/actions/checkout-pnpm-project` — that action is pnpm-specific, so
  swap it for inline `oven-sh/setup-bun` + `actions/checkout` steps in this repo rather than
  assuming a bun equivalent exists (it doesn't today).
- Rename `ci.yml` → `integration.yml` and `cd.yml` → `deployment.yml` (Toby's current naming
  convention), and restyle both to match how his repos write these _now_, not the shape this
  repo's copies were written in. Confirmed via `gh search code` across his account — most repos
  (e.g. `tobythe.dev`, and notably `email.tobysmith.uk` itself, since it's already a Cloudflare
  Worker deploy — the closest existing reference for what Stage 3/10 need) share:
  - `name: Continuous Integration` / `name: Continuous Deployment` (not "CI"/"CD"), plus a
    dynamic `run-name:` — integration's interpolates the PR number when present, falling back to
    the ref name; deployment's just uses the ref name.
  - `defaults: run: shell: pwsh` at the workflow level (already true of this repo's `cd.yml`;
    carry it over to `ci.yml`→`integration.yml` too for consistency).
  - `integration.yml` triggers: `push` on `renovate/*`, `pull_request` on `main`, plus
    `workflow_call` (so `deployment.yml` can reuse it) — `tobythe.dev`'s version also excludes
    `renovate/*` from the `pull_request` trigger and adds `workflow_dispatch`; worth adopting both.
  - `deployment.yml` calls it via `uses: ./.github/workflows/integration.yml` with
    `secrets: inherit`, gated behind `concurrency` (`cancel-in-progress: false`).
  - Job/step naming is title-case and descriptive ("Run Continuous Integration", "Check
    Licenses") rather than the terser current style — match that tone when touching these files.
- Update README dev setup instructions.
- Spike/confirm: does `renovate.json` (extends `local>tobysmith568/renovate-config`) already
  handle `bun.lock`, or does the shared config need updating? Don't assume.

**Exit criteria:** local build/dev/test scripts all run cleanly via Bun; no behavior change.

### Outcome / deviations from the plan above

Landed close to plan, with a few real findings worth flagging for later stages:

- **Stale `pnpm-lock.yaml` masked dependency drift.** The old lockfile had pinned resolutions
  (e.g. `@astrojs/sitemap@3.1.5`, `zod@4.1.3`, `typescript@5.3.3`) well behind what `package.json`'s
  own `^` ranges actually allow. A first `bun install` with no prior `bun.lock` naturally resolves
  to the newest version matching each range — for most packages this was harmless, but
  `@astrojs/sitemap` jumped 3.1.5 → 3.7.3 and crashed `astro build` (`Cannot read properties of
undefined (reading 'reduce')` in its `astro:build:done` hook — an incompatibility with Astro
  4.16's older build-hook shape, not a Bun bug). Pinned `@astrojs/sitemap` back to the exact
  `3.1.5` that was actually validated working (no caret) rather than debugging a newer major-ish
  jump that's out of scope for this stage — Stage 3's fresh Astro 7 scaffold replaces this
  dependency wholesale anyway, so this pin is expected to be revisited/dropped there, not carried
  forever.
- **Prettier version drift, same root cause, different outcome.** `@tobysmith568/prettier-config`
  similarly drifted forward (2.1.0 → 2.2.1) and its newer bundled Prettier reformatted one file
  (`ContactForm.astro`, added parens around a `??`-inside-ternary expression). Unlike the sitemap
  case this was purely cosmetic, so — mirroring exactly how Stage 1 handled `migration.md`'s own
  Prettier drift — fixed with `prettier --write .` rather than pinning the config version.
- **`bunfig.toml` wasn't needed.** The plan anticipated `sharp`/`esbuild` postinstall scripts
  needing `trustedDependencies`; in practice those two are already on Bun's built-in default-trust
  list. The one package Bun actually blocked was `@parcel/watcher` (a transitive Vite/Astro dep,
  needed for file-watching in dev mode) — approved via `bun pm trust @parcel/watcher`. Also worth
  noting: Bun's `trustedDependencies` mechanism lives in `package.json` itself (`bun pm trust`
  writes it there directly), not in a separate `bunfig.toml` — the plan's phrasing implied the
  latter; no `bunfig.toml` file was added at all.
- **No bun-equivalent composite action existed**, confirming the plan's assumption —
  `tobysmith568/actions` only has `checkout-pnpm-project`. `integration.yml`/`deployment.yml` use
  inline `actions/checkout@v7` + `oven-sh/setup-bun@v2` instead. Both new workflow files were
  modeled on `email.tobysmith.uk`'s and `tobythe.dev`'s current `integration.yml`/`deployment.yml`
  (fetched live via `gh api`, not from memory) — naming, `run-name`, job titles, and the
  `pull_request` trigger's `renovate/*` exclusion / `workflow_dispatch` addition all match. Actual
  action version pins were checked against each action's own GitHub releases at implementation
  time (`actions/checkout@v7`, `oven-sh/setup-bun@v2`, `actions/upload-pages-artifact@v5`,
  `actions/upload-artifact@v7`, `actions/deploy-pages@v5`, `cypress-io/github-action@v7` — the
  last one bumped from the prior `@v6` since the workflow file was being rewritten wholesale
  anyway). Also gave the E2E job's per-browser artifact uploads distinct names
  (`E2E Screenshots (Chrome)` vs `(Firefox)`) — the old `ci.yml` gave both matrix legs the same
  artifact name, which is a latent conflict under `actions/upload-artifact@v4+`'s uniqueness
  requirement (silently never triggered before, since nothing uploads unless a test actually
  fails in both browsers in the same run).
- **`README.md` had no dev-setup instructions to update** — it's just project description +
  license notice today, no `pnpm install`-style section existed. Plan bullet was a no-op here.
- **Renovate**: confirmed (via `gh api` on the live `tobysmith568/renovate-config` repo, plus a
  web check of Renovate's own docs/issue tracker) that Renovate's `npm` manager does support
  `bun.lock` natively (text-format lockfile support landed upstream a while back; known gaps are
  workspace/monorepo-specific and don't apply here now that `pnpm-workspace.yaml` is gone) — so
  no shared-config change is needed for ordinary dependency-bump lockfile maintenance. One real
  gap found, left as a follow-up rather than fixed here (it's a shared repo used by other
  projects too, not this one): the shared config's "Package Managers" `packageRule` only matches
  `matchPackagePatterns: ["^pnpm$"]` for automerging `packageManager`-field version bumps, so
  future `packageManager: "bun@…"` bumps in this repo will still get individual Renovate PRs, just
  ungrouped/not-automerged, until that pattern is widened (or a `bun` rule added) in
  `tobysmith568/renovate-config` directly.
- **Local verification gap, not a regression:** the full Cypress E2E suite couldn't be run in this
  particular sandboxed session — its Electron-based test runner fails to launch here
  (`bad option: --no-sandbox` — Chromium's sandbox failing to initialize under this container's
  restrictions, falling back to a bare-Node arg parser that rejects Electron's own flags). This
  reproduces with or without Bun and is unrelated to this stage; `cypress install`/`cypress
version` both succeed under Bun, confirming the package itself resolves and installs correctly.
  The actual browser-driven run still needs verifying in an environment with full Electron/Chromium
  support (a real GitHub Actions runner, or a non-sandboxed machine) before this stage's E2E
  exit criterion is fully confirmed — flagging explicitly per the "no stage silently drops test
  coverage" ground rule, since this isn't the same as having run and passed it.
- `bun run build`, `bunx prettier --check .`, and `bun run dev` all verified clean locally.
  `astro.config.mjs` needed no changes — Astro's own script resolution (`astro`, `cypress` as
  binary names in `package.json`'s `scripts`) works unchanged under `bun run`/`bunx`, confirming
  the plan's assumption that no `bunx`-prefix rewiring was needed there.

## Stage 3 — Astro SSR + Cloudflare Worker hosting ✅ done

**Depends on:** Stage 2 (Bun). This is the biggest/riskiest stage — it changes the deployment
model, not just a tool — so it's done early, before stages that need to target the final shape.
**Nothing in this stage touches the live `tobysmith.uk` domain or retires GitHub Pages** — per
the big-bang ground rule, the actual production cutover is deliberately deferred to the final
Stage 10; this stage only needs the new setup working locally/in a non-production Cloudflare
preview.

- Rather than hand-patching `astro.config.mjs`/`package.json` forward across three major Astro
  versions (4→7) and bolting the Cloudflare adapter onto an old config shape, scaffold a **fresh**
  Astro 7 project (`bun create astro@latest`, then `astro add cloudflare`) to get the current
  idiomatic config/structure, and port this repo's actual content into it: `src/pages`,
  `src/components`, `src/layouts`, `src/content`, `src/assets`, `src/scripts`, `public/`. Diff
  the fresh scaffold's `astro.config.mjs`, `tsconfig.json`, `package.json`, and `.gitignore`
  against this repo's rather than assuming they're compatible as-is — this is what makes sure
  we're doing it the current recommended way rather than a config that's technically upgraded
  but still shaped like an Astro 4 project.
- Confirm the scaffold step above lands on `output: "server"` with `adapter: cloudflare()`
  (v13+, which is what requires Astro 6+ — already satisfied by targeting Astro 7).
- Config file: use **`wrangler.jsonc`**, not `wrangler.toml` — Cloudflare's own docs now
  explicitly recommend `.jsonc` for new projects and gate some newer Wrangler features to the
  JSON format only; `.toml` still works but isn't where new capability lands. Base shape (confirm
  exact values via `wrangler types` once the adapter's installed, rather than hand-copying this):
  `main` pointing at the adapter's own server entrypoint (`@astrojs/cloudflare/entrypoints/server`
  as of the current adapter — it generates this for you, not a path you write by hand), an
  `assets` binding pointing at the built client output, and `compatibility_flags: ["nodejs_compat"]`.
  This same file is where Stage 4's `send_email` binding gets added later.
- Note for local dev/testing (relevant again in Stage 8): as of the current adapter, `astro dev`/
  `astro preview` run through Cloudflare's own Vite plugin against the real `workerd` runtime
  rather than a plain Node dev server — dev-mode testing is already closer to production than it
  used to be, which is a plus for the "Playwright exercises the real code path" goal.
- Env vars/secrets: non-sensitive values go in `wrangler.jsonc`'s `vars`; secrets via
  `wrangler secret put`; both are read in Astro code via `astro:env/server` (typed) or the
  `cloudflare:workers` `env` import — relevant when porting the contact-form backend in Stage 4.
- Update `deployment.yml` to drop `actions/upload-pages-artifact`/`actions/deploy-pages` in favour
  of `cloudflare/wrangler-action` (pinned to `v3` as of when this plan was written — check
  [the action's own repo](https://github.com/cloudflare/wrangler-action/releases) for the actual
  latest at implementation time, per the ground rules), authenticated via `CLOUDFLARE_API_TOKEN` **and**
  `CLOUDFLARE_ACCOUNT_ID` GitHub secrets (both needed — confirmed from `email.tobysmith.uk`'s own
  `deployment.yml`, which already deploys a Worker this same way and is the closest existing
  reference for this exact move). That repo's `integration.yml` builds once (`build` job,
  artifact uploaded) and `deployment.yml` downloads that same artifact before calling
  `wrangler-action` — mirror that rather than building again inside the deploy job. This is just
  editing the workflow file; per the ground rules it won't actually run for real until the final
  cutover PR, so it doesn't touch anything live now.
- Cloudflare Workers custom domains are themselves just config — `wrangler.jsonc`'s
  `routes: [{ pattern, custom_domain: true }]` — and `wrangler deploy` provisions the DNS record
  and TLS certificate automatically, no dashboard step needed (confirmed against Cloudflare's own
  docs). That's good news for avoiding click-ops later, but it also means **this config entry
  must not be added yet**: `wrangler deploy` acts directly on the live Cloudflare account/zone
  regardless of which git branch or CI run triggers it, so adding the `tobysmith.uk` route now
  and running `wrangler deploy` — even manually, outside CI — would immediately repoint
  production at the still-incomplete Worker. Leave `routes` out of `wrangler.jsonc` entirely
  until Stage 10; without it, `wrangler deploy` targets a harmless `*.workers.dev` preview URL by
  default, which is what this stage validates against (`wrangler dev` locally, or a real deploy
  to that preview URL). Local preview deploys can authenticate via `wrangler login` (personal
  OAuth) without needing a stored API token at all — the `CLOUDFLARE_API_TOKEN`/
  `CLOUDFLARE_ACCOUNT_ID` GitHub secrets are only strictly needed once `deployment.yml` actually
  runs for real, in Stage 10.
- Confirm existing static pages (privacy/terms/cookies/third-party, project & blog detail pages)
  don't need per-request dynamic behaviour — mark them `export const prerender = true` where
  Astro's SSR mode would otherwise render them per-request for no benefit (mirrors how the
  read-receipt migration handled this).
- `third-party.astro` calls `generate-license-file` at render time reading `package.json` from
  `process.cwd()` — confirm this still resolves correctly under the Cloudflare adapter's runtime
  (no local filesystem/`package.json` access inside a Worker) or move it to a build-time step
  that bakes the license list into a static import instead.
- **Content Layer API migration — likely the single biggest breaking change in the whole 4→7
  jump, bigger than the adapter swap itself, so don't let it hide inside "port the content
  across":** `src/content/config.ts`'s `defineCollection({ type: "content", schema })` shape was
  replaced by the Content Layer API's `loader`-based collections (e.g. `defineCollection({
loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }), schema })`) starting in
  Astro 5. This touches more than the config file:
  - `entry.render()` (instance method) → a standalone `render(entry)` function imported from
    `astro:content` — affects `blog/[...slug].astro` and `projects/[...slug].astro`.
  - `entry.slug` isn't guaranteed to exist the same way under a loader-based collection — and
    this codebase specifically relies on **custom slugs set via frontmatter** (e.g.
    `slug: graduated` in `10-graduated.mdx`, distinct from the filename), which the legacy API
    handled natively but the Content Layer API doesn't out of the box. Either give the `glob()`
    loader a `generateId` callback that reads the frontmatter `slug` field, or keep `slug` as a
    plain schema field and reference `entry.data.slug` directly everywhere `entry.slug` is used
    today (`blog/index.astro`, `blog/[...slug].astro`, `blog/rss.xml.ts`, `projects/index.astro`,
    `projects/[...slug].astro`) — pick one approach and apply it consistently, don't mix.
  - Re-run `astro sync` (still the mechanism per the comment already in `config.ts`) after the
    schema shape changes, to regenerate types before relying on them.
- `astro:assets`'s `<Image>` component is used for project logos (`projects/[...slug].astro`,
  `Projects/ProjectListItem.astro`). Sharp-based image transforms don't run inside the deployed
  Workers runtime itself, but they _do_ still run at `astro build` time (a real Node process) for
  any route that's prerendered — which the bullet above already puts these routes under. Confirm
  this holds (build succeeds, images render) rather than assuming prerendering alone is a
  complete answer; if any image-bearing route is ever made non-prerendered later, Sharp would
  need swapping for Cloudflare's own image service at that point.
- `astro.config.mjs` currently sets `experimental: { clientPrerender: true }` and a `prefetch`
  block — experimental flags are exactly the kind of thing that graduates, changes shape, or
  disappears across three major versions. The fresh-scaffold diff should surface this, but
  explicitly confirm what (if anything) these became in Astro 7 rather than carrying the Astro-4
  shape forward unexamined.
- `@astrojs/sitemap` (generates `sitemap-index.xml`) is a real dependency — confirm it still
  works cleanly once `output` moves from `"static"` to `"server"` (it does support SSR, but
  verify against the actual current version rather than assuming, per this plan's own habit
  everywhere else).
- **Drop `sass` rather than re-adding it.** The fresh Astro 7 scaffold won't include it by
  default, and everything the existing `<style lang="scss">` blocks actually use
  (`BaseLayout.astro`, `ContactForm.astro`, `Footer.astro`, `Index/Hero.astro`) now has a native
  CSS equivalent with solid browser support: nested selectors/media queries (native CSS nesting,
  no preprocessor needed since 2023) and `lighten($primary, 30%)` for the `--primary-light`/
  `--primary-very-light` custom properties (`color-mix(in srgb, var(--primary) 70%, white)` does
  the same job natively). Convert these files to plain `<style>` (dropping `lang="scss"` and the
  `@use "sass:color"` import) while porting them across, rather than reinstating a preprocessor
  dependency for a feature set that no longer needs one. Also means Stage 11's design overhaul
  isn't inheriting `lighten()`-derived shades it'll likely replace anyway, and narrows Stage 7's
  oxfmt spike to plain CSS-in-`.astro`, not SCSS-in-`.astro`.
- Revisit `CLAUDE.md` — deployment path and architecture both change here.

**Exit criteria:** the Astro-7-on-Cloudflare-adapter setup builds and runs correctly under
`wrangler dev`/a `*.workers.dev` preview deploy, all existing pages render correctly under SSR —
**while `tobysmith.uk` itself keeps being served by GitHub Pages, unchanged, until Stage 10.**

### Outcome / deviations from the plan above

Landed close to plan overall, but with several real findings the plan explicitly flagged as
"confirm, don't assume" — worth reading closely since more than one of them contradicts what the
plan expected:

- **`output: "static"` kept, not `output: "server"`.** The plan assumed the fresh scaffold would
  land on `"server"` with per-route `prerender = true` opt-outs. It doesn't: `astro add
cloudflare` left `output: "static"` untouched, and Astro's own current docs explicitly recommend
  starting with `"static"` (the default) plus per-route `export const prerender = false` unless
  _most_ routes need on-demand rendering — which isn't remotely true here (zero dynamic routes
  exist yet; Stage 4 adds the first). So **no `prerender` flags were added anywhere in this
  stage** — every route is already prerendered by default, and `dist/server/` builds empty
  (confirmed by inspecting it after a build). Stage 4's contact-form route will be the first
  place `export const prerender = false` actually appears. This also means Stage 4's "needs a
  server context" dependency note still holds — `output: "static"` + an adapter still lets
  individual routes opt into on-demand rendering, it just isn't the default for all of them.
- **Content config had to move to `src/content.config.ts`.** Astro 6 removed support for
  `src/content/config.ts` entirely (`[LegacyContentConfigError]`, fails `astro sync`/`astro
build` outright) even with a `loader` already defined — the plan didn't call this filename
  change out explicitly. Moved via `git mv`; the `glob()` `base` paths didn't need touching since
  they're already relative to the project root, not the config file.
- **The `generateId`-vs-schema-field decision didn't end up mattering much.** Confirmed with Toby
  up front: kept `slug` as a plain schema field, referenced `entry.data.slug` everywhere for
  `blog`. Turns out moot either way for `blog` specifically — Astro's built-in `glob()` loader
  default `generateId` already checks `data.slug` first and uses it verbatim if present, so
  `entry.id` and `entry.data.slug` are identical for blog posts regardless. Where the choice
  _did_ matter: `projects` and `policies` have no `slug` field at all (never did — the old
  `entry.slug` for those was always filename-derived), so those now use `entry.id` instead
  (verified via a `dist/` diff of the old build: `p.slug === "privacy"` → `p.id === "privacy"`,
  `resolveProjectImage(entry.slug)` → `resolveProjectImage(entry.id)`, etc.). Also had to swap
  `entry.render()` (instance method, removed) for the standalone `render(entry)` import from
  `astro:content` everywhere, per the plan.
- **`astro add cloudflare`'s own `tsconfig.json` patch silently broke type-checking almost
  entirely — caught this one late, via the IDE showing `getCollection` typed as
  `(...args: any[]) => any` instead of its real signature.** The patch set
  `"include": ["./worker-configuration.d.ts"]`. TypeScript's `extends` does **not** merge
  `include`/`exclude` arrays — a child's `include` fully replaces whatever the base config
  declares, and `astro/tsconfigs/base.json` (extended transitively via `strictest.json` →
  `strict.json` → `base.json`) declares `"include": ["${configDir}/.astro/types.d.ts",
"${configDir}/**/*"]`. So the patch didn't just drop the ambient `astro:content` module types
  (hence `getCollection`'s type falling back to `any`) — it dropped `**/*` too, meaning
  `astro check` was barely checking anything. The tell was in plain sight the whole time and got
  missed: `astro check`'s own output said `Result (1 file)` on every run in this stage, on a repo
  with 60+ source files, and "0 errors" from checking essentially nothing read as a clean pass.
  Fixed by writing out the full include list explicitly:
  `"include": [".astro/types.d.ts", "**/*", "./worker-configuration.d.ts"]` (matching what a
  fresh `astro add cloudflare` scaffold's tsconfig looks like once merged by hand). Re-running
  `astro check` after the fix reports `Result (66 files)`, still 0 errors (15 pre-existing Zod v4
  deprecation hints, unrelated). **Flagging this pattern specifically because `astro add`'s
  config patches aren't guaranteed to compose safely with an existing custom `tsconfig.json`** —
  worth double-checking the file count in `astro check`'s own output after any future `astro add`
  run, not just trusting "0 errors".
- **The Cloudflare adapter's default image service silently breaks `<Image>` — this is the
  single biggest finding of this stage.** The plan's assumption ("Sharp still runs at build time
  for prerendered routes, confirm rather than assume") turned out to be half right: prerendering
  itself is fine, but `@astrojs/cloudflare` (v14.x) defaults `imageService` to
  `"cloudflare-binding"` _regardless of prerender status_, which makes `<Image>` emit a
  runtime-only `/_image?href=...` on-demand URL instead of a static file — confirmed by building,
  running `wrangler dev`, and getting a real `404` fetching that URL (no `IMAGES` binding is
  provisioned, nor should one be for a project with no runtime image needs). Fixed by passing
  `adapter: cloudflare({ imageService: "compile" })`, which restores Sharp-based build-time
  optimization for prerendered routes (verified: `astro build` logs "generating optimized
  images" again, and the built HTML references a static `/_astro/*.svg` file, which 200s under
  `wrangler dev`). Anyone hitting broken project-logo images after a future Astro/adapter bump
  should check this setting first.
- **`generate-license-file` can't run inside `third-party.astro` anymore.** The plan flagged this
  as needing confirmation ("no local filesystem/`package.json` access inside a Worker") and
  offered a fallback ("move it to a build-time step that bakes the license list into a static
  import instead") — needed it. The failure mode wasn't filesystem access (that page is
  prerendered, so it still runs in real Node at build time) but `ReferenceError: __dirname is not
defined`: the Cloudflare adapter's prerenderer bundles prerendered pages' server code into ESM
  chunks via rolldown, and something in `generate-license-file`'s dependency chain relies on CJS's
  `__dirname`, which isn't defined in that bundled context. Took the plan's fallback: added
  `scripts/generate-licenses.mjs` (run via `bun`, never bundled by Astro at all) that writes
  `src/data/licenses.generated.json` (gitignored), wired in via `predev`/`prestart`/`prebuild`
  `package.json` script hooks (confirmed Bun honours npm-style `pre*`/`post*` script lifecycle
  hooks) — `third-party.astro` now does a static `import licenses from
"../data/licenses.generated.json"`. One gap this created: the CI `e2e` job calls `bunx astro
build --mode development` directly rather than `bun run build`, so it doesn't get the `prebuild`
  hook — added an explicit `generate:licenses` step there too, otherwise that build would fail on
  a missing import.
- **`wrangler.jsonc`'s auto-generated `name` needed a manual fix.** `astro add cloudflare`
  defaulted it to `"tobysmith.uk"` (from `package.json`'s `name`), but Cloudflare Worker names
  can't contain dots — changed to `"tobysmith-uk"`, matching the existing
  `email-tobysmith-uk` convention. Confirmed the rest of the generated config (`main`,
  `assets.directory: "./dist"`, `compatibility_flags: ["global_fetch_strictly_public"]` rather
  than the plan's assumed `nodejs_compat`, which isn't needed since nothing in the deployed worker
  bundle uses Node builtins — `third-party.astro`'s `node:path` import is gone now anyway, see
  above) works as-is — verified end to end with a real `wrangler dev` run (see below), not just a
  build. Also confirmed (by directly testing, not assuming) that Wrangler auto-detects and
  redirects to the `dist/client/wrangler.json` snapshot Astro's build writes ("Using redirected
  Wrangler configuration") — the root `wrangler.jsonc`'s `assets.directory: "./dist"` is correct
  as-is even though the actual static files land in `dist/client/`, because that redirect layer
  handles the resolution. No hand-editing needed there, despite the client/server split being a
  visible surprise the first time `bun run build` ran (old Astro 4 output was flat `dist/`, this
  is `dist/client/` + `dist/server/`).
- **SCSS→CSS conversion touched 7 files, not the 4 the plan named as examples** (`BaseLayout`,
  `ContactForm`, `Footer`, `Index/Hero` were explicit; `Blog/BlogListItem`,
  `BaseLayout/HeaderMenuItem`, `Projects/ProjectListItem` also had `lang="scss"` and needed the
  same treatment). Only `BaseLayout.astro` used an actual Sass-only feature (`lighten($primary,
30%)`/`lighten($primary, 41%)` for the `--primary-light`/`--primary-very-light` custom
  properties) — replaced with `color-mix(in srgb, dodgerblue 70%, white)` /
  `color-mix(in srgb, dodgerblue 59%, white)` respectively (the plan's own suggested formula,
  `100 - lighten%`, extended to the second shade it didn't spell out). Everything else was
  already native-CSS-compatible nesting (`&:hover` etc.), so just needed `lang="scss"` dropped.
  One genuine dead-code find along the way: `Footer.astro` declared `$noHoverTextColor: lightgray;`
  but never referenced it anywhere, even in the original Sass — deleted rather than ported, since
  plain CSS has no `$variable` syntax to translate it into and it did nothing before either.
- **Action version pins, checked live per the ground rules, not copied from the plan**:
  `cloudflare/wrangler-action` is at a new major, `v4.0.0` (the plan assumed `v3`) —
  `actions/download-artifact` similarly jumped to `v8` (its GitHub _Releases_ list is stale/
  incomplete for some reason and undersells this — had to check its _tags_ instead to find the
  real latest). `actions/checkout@v7` and `actions/upload-artifact@v7`, already pinned from Stage
  2, were already current and untouched.
- **Fetched `email.tobysmith.uk`'s live workflow files via `gh api`** (the plan's suggested
  closest reference for this exact wrangler-action move) to confirm the checkout →
  download-artifact → wrangler-action shape, and adapted it to this repo's Bun/`wrangler.jsonc`
  conventions rather than that repo's still-pnpm/`wrangler.toml` ones. Incidentally saw that
  repo's real (private) `EMAIL_TO`-equivalent destination address in its `wrangler.toml` while
  doing so — not used or stored anywhere in this repo, consistent with Stage 4's own explicit
  instruction to never commit that literal address here.
- **Local CI, run for real this stage, not just `astro build`**: `bun run build`, `astro check`
  (0 errors), `bunx prettier --check .`, `bun run dev`, `bun run preview`, and a real `bunx
wrangler dev` all verified — including hitting every route (`/`, `/blog`, a blog post, `/projects`,
  a project with a logo image and one without, `/third-party`, all three policy pages, `/about`,
  `/contact`, the RSS feed, the sitemap) and confirming 200s, not just that the process boots.
  Cypress itself still can't run in this sandbox (same Electron/`--no-sandbox` issue Stage 2's
  notes already flagged as unrelated to any particular stage) — not a new gap, but still means the
  actual E2E suite needs running on a real machine/CI runner before this stage's coverage is fully
  confirmed, per the "no stage silently drops test coverage" ground rule. `astro preview`/`astro
dev` booting and serving real 200s under the Cloudflare adapter is the closest local proxy
  available here.
- **Dependency versions**: `astro` → `^7.2.7`; `@astrojs/mdx` → `^7.0.8` (tracks Astro's major in
  lockstep, not the plan-era `^4.x`); `@astrojs/sitemap` → `^3.7.3`, **unpinning** the exact
  `3.1.5` Stage 2 had pinned after it crashed under Astro 4.16 — Stage 2's own notes predicted
  this pin would be "revisited/dropped" once Stage 3's fresh Astro 7 base landed, and it works
  cleanly now; `@astrojs/alpinejs` → `^1.0.0`; `@astrojs/check` → `^0.9.10`; `@astrojs/rss` →
  `^4.0.19`; added `@astrojs/cloudflare` `^14.2.5` and `wrangler` `^4.126.0`; removed `sass`
  entirely. `dayjs`/`zod`/`sharp`/`generate-license-file`/`typescript` untouched (not
  Astro-version-coupled).
- **Scope held at the stage boundary**: `about.astro`/`contact.astro` were ported as standalone
  routes unchanged (folding them into the index is Stage 6's job), and `MobileMenu.astro`'s
  known-broken `display: none` mobile nav was left exactly as broken as before (also Stage 6) —
  flagging explicitly so it doesn't read as something this stage missed.

## Stage 4 — Fold the email-sending backend into this repo

**Depends on:** Stage 3 (needs a server context to run request-handling code in). Requires `gh`
access to the private `tobysmith568/email.tobysmith.uk` repo to confirm nothing's changed there
since this plan was written — but shouldn't _require_ it: the logic is small enough to inline
below so this stage is executable even for an agent/session without access to that repo. Treat
the snapshot below as a starting point to verify against the live repo, not a substitute for
checking it if access is available.

<details>
<summary>Reference: <code>email.tobysmith.uk</code>'s current logic (inlined as of this plan's
writing)</summary>

`wrangler.toml` — note the worker uses a `send_email` binding named `SEB`, `EMAIL_TO`/`EMAIL_FROM`
as secrets, and `RECAPTCHA_SECRET_KEY`/`RECAPTCHA_ENDPOINT` as secrets (Turnstile equivalents come
in Stage 5, not this one):

```toml
name = "email-tobysmith-uk"
main = "src/index.ts"
compatibility_date = "2024-01-29"

send_email = [
  { name = "SEB", destination_address = "<redacted — see note below>" },
]
```

> **This repo is public; the old one was private — don't carry the literal address forward.**
> Per [Cloudflare's send-binding docs](https://developers.cloudflare.com/email-service/configuration/send-bindings/),
> if a `send_email` binding declares **no** `destination_address`/`allowed_destination_addresses`
> at all, it can still only send to addresses already verified under the account's Email Routing
> setup — the restriction fields are an _extra_ narrowing, not what makes an address usable in the
> first place. So in this repo's `wrangler.jsonc`, declare the binding with **no destination
> field whatsoever** (`{ "name": "SEB" }`), and keep the real address only in the `EMAIL_TO`
> Worker _secret_ (`wrangler secret put`, never committed) — which the plan already has the
> recipient coming from at runtime anyway (see `src/index.ts` below). Confirm this behaviour
> against the actual current docs before relying on it, per the ground rules, since this is
> exactly the kind of detail worth not taking on faith.

`src/env.ts` — zod-validated env shape:

```ts
import { z } from "zod";

const envValidator = z
  .object({
    RECAPTCHA_SECRET_KEY: z.string().min(1),
    RECAPTCHA_ENDPOINT: z.string().min(1).url(),
    EMAIL_TO: z.string().min(1).email(),
    EMAIL_FROM: z.string().min(1).email(),
    SEB: z.object({ send: z.function(z.tuple([z.any()]), z.void()) })
  })
  .transform(
    obj =>
      ({
        recaptcha: { secretKey: obj.RECAPTCHA_SECRET_KEY, endpoint: obj.RECAPTCHA_ENDPOINT },
        email: { to: obj.EMAIL_TO, from: obj.EMAIL_FROM },
        SEB: obj.SEB
      }) as const
  );

export type Env = z.infer<typeof envValidator>;
export const getEnv = (env: unknown): Env => envValidator.parse(env);
```

`src/index.ts` — the fetch handler (CORS/`allowedOrigins` here is the piece Stage 4 removes
entirely once the form is same-origin; the `X-Test` mock-response header is a testing hook worth
knowing about even though it isn't ported forward):

```ts
const allowedOrigins = ["https://tobysmith.com", "http://localhost:4321"]; // note the stale .com

export default {
  async fetch(request, unparsedEnv, _ctx) {
    if (request.method === "GET")
      return new Response("Welcome to email.tobysmith.uk", { status: 200 });

    const origin = request.headers.get("Origin");
    const accessControlAllowOrigin = !!origin && allowedOrigins.includes(origin) ? origin : "null";
    const headers = {
      "Access-Control-Allow-Origin": accessControlAllowOrigin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") return new Response(null, { headers, status: 204 });
    if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });

    const env = getEnv(unparsedEnv);
    const parsedBody = parseRequestBody(await request.json());
    if (!parsedBody.success)
      return new Response(JSON.stringify(parsedBody.errors, null, 2), { status: 400 });

    const { name, email, message, recaptchaToken } = parsedBody.data;
    const recaptchaValidation = await verifyRecaptchaToken(recaptchaToken, env);
    if (!recaptchaValidation.success)
      return new Response(recaptchaValidation.error, { status: 400 });

    const subject = `New message from ${name} via tobysmith.uk`;
    const text = `The following message is from ${name}, ${email}\n\n${message}`;
    const emailResult = await sendPlainTextEmail(name, subject, text, env, env.SEB);
    if (!emailResult.success) return new Response(emailResult.error, { status: 500 });

    return new Response(null, { status: 204, headers });
  }
};
```

`src/parse-request-body.ts` — zod validation of the POST body (`name`/`email`/`message`/
`recaptchaToken`, each with a custom `required_error`/min-length/format message), returning
`{ success: true, data }` or `{ success: false, errors: string[] }`.

`src/send-email.ts` — builds a MIME message with the `mimetext` package
(`createMimeMessage()`, `setSender`/`setRecipient`/`setSubject`/`addMessage`), wraps it in a
Cloudflare `EmailMessage` (from `cloudflare:email`), and calls `seb.send(email)`, returning
`{ success: true }` or `{ success: false, error }`.

`src/validate-recaptcha-token.ts` — POSTs `secret`+`response` as query params to
`RECAPTCHA_ENDPOINT`, checks the JSON response's `success` boolean and surfaces
`error-codes` on failure. **This file specifically gets replaced, not just ported, in Stage 5** —
Turnstile's siteverify request/response shape differs from reCAPTCHA's.

`package.json` dependency of note: `mimetext` (MIME message construction) needs to come along
into this repo; `@cloudflare/workers-types` should already be available via `@astrojs/cloudflare`.

</details>

- Port the logic above into this repo, as either an Astro API route
  (`src/pages/api/contact.ts`) or an Astro Action — Actions are worth preferring here: same-origin,
  type-safe against the existing zod schema, and removes the need for manual `fetch`/CORS handling
  entirely from `sendContactEmail.ts`.
- Add the `send_email` binding (`SEB`) to this repo's `wrangler.jsonc` — **with no
  `destination_address`/`allowed_destination_addresses` field at all**, unlike the old worker's
  config. This repo is public (the old one was private), so the literal address can't be
  committed here without undermining the whole point of having a contact form instead of a
  visible email link. See the reference appendix below for why omitting the field entirely is
  still safe (Cloudflare restricts sending to already-verified Email Routing addresses either
  way) — the real address lives only in the `EMAIL_TO` Worker secret, never in a committed file.
- Drop the old worker's CORS logic (`allowedOrigins`) entirely — once the form posts same-origin,
  cross-origin handling isn't needed. (Note: the old worker's `allowedOrigins` list contained
  `https://tobysmith.com`, not `.uk` — likely a stale/wrong entry; moot once this lands, but worth
  knowing it existed.)
- Move `EMAIL_TO`/`EMAIL_FROM` and the reCAPTCHA secret to this repo's Worker secrets
  (`wrangler secret put`), sourced from new GitHub Actions secrets for CI-driven deploys.
- Confirm working end-to-end (submit a real message, confirm delivery) against the non-production
  preview deploy from Stage 3 — **do not** decommission the live `email.tobysmith.uk` Worker or
  archive its repo yet. The old worker keeps serving the still-live production site until
  Stage 10's cutover confirms the new setup is stable in production; only then is it safe to
  decommission/archive without a rollback path disappearing mid-migration.

**Exit criteria:** the new same-origin contact-form flow is confirmed working against a
non-production preview; the old `email.tobysmith.uk` Worker is untouched and still what
production actually uses.

## Stage 5 — reCAPTCHA → Cloudflare Turnstile

**Depends on:** Stage 4 (touches the now-single copy of the token-validation code).

- Create the Turnstile widget via the Cloudflare API rather than the dashboard —
  `POST /accounts/{account_id}/challenges/widgets` (`domains`, `mode`, `name`) returns the
  `sitekey`/`secret` directly. Needs an API token scoped to `Turnstile Sites Write` (or
  `Account Settings Write`) — confirm current scope names against
  [Cloudflare's own docs](https://developers.cloudflare.com/turnstile/) at implementation time,
  per the ground rules. Small one-off script (e.g. `scripts/setup-turnstile.ts`, run manually
  once, not part of CI) — check-then-create by widget `name` so it's safe to re-run rather than
  creating duplicates. This is the "light IaC" version of what read-receipt's `infra/` package
  did for GCP, scaled to what this actually needs: one API call, not a resource-class package —
  see the note in Stage 10 about why a full `infra/`-style package isn't proportionate here.
- Swap `ContactForm.astro`: replace the reCAPTCHA script tag/widget div with Turnstile's
  equivalent (invisible/managed mode to match current UX), update the disclosure text and links
  currently pointing at Google's Privacy Policy/Terms.
- Swap `validate-recaptcha-token.ts` → Turnstile's siteverify endpoint (different request/response
  shape than reCAPTCHA's — don't assume it's a drop-in field-for-field swap).
- Replace `PUBLIC_RECAPTCHA_SITE_KEY` (`.env.development`/`.env.production`) and the
  `RECAPTCHA_SECRET_KEY`/`RECAPTCHA_ENDPOINT` Worker secrets with Turnstile equivalents.
- Confirm the privacy/cookies policy content doesn't specifically reference reCAPTCHA anywhere
  needing an update (checked: it currently doesn't).

**Exit criteria:** contact form is protected by Turnstile, no reCAPTCHA references (script,
secrets, disclosure text) remain anywhere in the codebase.

## Stage 6 — Information architecture: fold About/Contact into the index, add spotlights

**Depends on:** Stage 5 (contact form's final shape/location should be settled before it's
moved into the index, rather than moved twice).

- Merge `about.mdx`'s content into `index.astro` as a new section (fix the existing typos —
  "arocss" → "across", "peronal" → "personal" — while rewriting it in).
- Move `ContactForm.astro` into a section on `index.astro`; delete `contact.astro`; add a
  redirect route so `/contact` → `/#contact` (`Astro.redirect()`), with `scroll-margin-top` set
  on the contact section sized to the sticky header's height.
- Add `featured: boolean` to the `projects` collection schema in `src/content/config.ts`; mark
  the initial featured set (Toby's call, not a technical decision).
- Build the index page's Projects and Blog spotlight sections (see "Decisions already made"
  above for the featured/recency logic) with "More →" links to `/projects` and `/blog`.
- Update `Header.astro`'s nav: `About` link removed; decide `Contact`'s nav treatment (own
  in-page anchor link vs. dropped from nav entirely) — Toby's call.
- Fix `MobileMenu.astro` while touching nav markup anyway: it's currently missing Blog/Contact
  links entirely and is hard-disabled (`style="display: none"` with a literal
  `<!--TODO: Remove display none when mobile menu is ready-->`) — meaning mobile visitors
  currently have **no working navigation** beyond the home link. This needs a real fix, not just
  a copy-paste of the desktop links, since the nav itself is changing shape in this same stage.
- Update `cypress`/Playwright fixtures referencing `/about` and `/contact` as standalone pages
  (moot once Stage 7 ports specs anyway, but don't leave broken Cypress specs mid-stage).

**Exit criteria:** `/about` and `/contact` no longer exist as standalone pages; `/contact`
redirects and lands the visitor on a working form; index page has working Projects/Blog
spotlights; mobile nav actually works.

## Stage 7 — oxlint + oxfmt instead of no-linting/Prettier

**Depends on:** Stage 6 — target the final file layout once, not before/after an IA change that
touches which files exist.

- Add `oxlint` config; run once repo-wide and review the diff/findings before committing to
  fixing everything blind.
- Spike/confirm oxlint's and oxfmt's `.astro`/`.mdx` support before relying on it — these are
  newer surface area for Oxc tooling than plain `.ts`. If oxfmt can't format `.astro`/`.mdx` yet,
  the fallback is keeping Prettier scoped to just those extensions (via `.prettierrc`
  overrides/ignore patterns) rather than blocking the whole migration on full Oxc coverage —
  mirrors the gap the read-receipt migration hit with Biome's Astro support.
- Remove `@tobysmith568/prettier-config`/Prettier entirely if the spike above says full coverage
  works; otherwise document the scoped-Prettier fallback in `CLAUDE.md`.
- Replace the `Lint` job in `integration.yml` accordingly.
- Update `.vscode/extensions.json`/`settings.json`: drop the stale `dbaeumer.vscode-eslint`
  recommendation (there's never been an ESLint config in this repo) and `esbenp.prettier-vscode`
  (unless the fallback above keeps Prettier around for some files), add oxc's VS Code extension.

**Exit criteria:** lint/format run in CI via oxlint/oxfmt (or the documented scoped-Prettier
fallback); no stale ESLint references anywhere.

## Stage 8 — Cypress → Playwright

**Depends on:** Stage 6 (final routes/markup) and Stage 5 (final contact-form flow) — specs
should be written once against the finished shape.

- Port each `cypress/e2e/*.cy.ts` spec (and its page-object) to Playwright, against the final
  index/projects/blog/contact structure. `about.cy.ts`/`contact.cy.ts` as standalone-page specs
  go away; their assertions move into `index.cy.ts` (renamed appropriately) for the folded-in
  sections.
- Since the contact form now posts same-origin to this Worker (Stage 4), Playwright can exercise
  the real code path end-to-end rather than mocking a separate origin — decide whether to hit a
  real (test) email destination or stub the `send_email` binding for CI; either way, this is a
  strictly better test than what Cypress could do against the old cross-origin setup.
- Update the `e2e` CI job: swap `cypress-io/github-action` for Playwright, run against
  `wrangler dev`/`astro preview` as appropriate for local SSR testing, keep the chromium+firefox
  matrix (project names, not browser names).
- Remove `cypress.config.ts`, `cypress/` entirely, Cypress deps.

**Exit criteria:** full e2e coverage (including the real contact-form submission path) passing
under Playwright in CI; Cypress fully removed.

## Stage 9 — General cleanup / code review pass

**Depends on:** all above stages.

- Remove stray `console.log` calls (`parseFormData.ts`, the contact form's inline script).
- Review `privacy.mdx`/`cookies.mdx` — the current TermsFeed-generated boilerplate references
  "Analytics"/advertising partners the site doesn't actually have (no analytics/ad tech in use
  today); trim to match reality rather than carrying inaccurate legal text forward. Also update
  the Turnstile-vs-reCAPTCHA third-party disclosure if Stage 5 didn't already cover the
  policy pages.
- Confirm `generate-license-file`/license tooling correctly understands `bun.lock` (not just
  `package.json`) — this bit the read-receipt migration for a different license tool; verify
  rather than assume.
- Sweep for dead code/leftover references to pnpm, Cypress, reCAPTCHA, or GitHub Pages that
  earlier stages might have missed.
- Run `/code-review` (or the `ultrareview` cloud pass) once the above is committed.
- Run `/security-review` as well, not just `/code-review` — this migration moved secret-handling
  code (Turnstile/reCAPTCHA validation, email-sending credentials) into this repo for the first
  time and introduced new CI secrets (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`,
  Turnstile/email secrets) — worth a dedicated security pass rather than assuming general code
  review coverage catches secret-handling issues.

**Exit criteria:** clean `/code-review` and `/security-review` passes; no orphaned deps/config/
references from earlier stages; policy pages describe the site as it actually behaves.

## Stage 10 — Production cutover

**Depends on:** Stages 1–9 all complete and locally verified. This is the single point in the
whole migration where anything actually goes live — the big-bang merge the ground rules describe,
watched by hand rather than trusted to automation.

**On IaC scope:** unlike read-receipt's Stage 8 (a bespoke `infra/` TypeScript package wrapping
`gcloud`), this migration doesn't need one. That stage existed because of real, serious GCP
findings — a no-expiry service-account key, an overprivileged runtime identity, plaintext
secrets, orphaned IAM grants. Nothing here has that shape: the custom domain is one `routes`
config line `wrangler deploy` applies for us (see below), the `send_email` binding is already
declarative in `wrangler.jsonc` (Stage 4), and Turnstile got its own tiny one-off script rather
than a dashboard click (Stage 5). Building a resource-class package for a single config line and
one API call would be solving a problem this project doesn't have — the two items below are the
entirety of what's left manual, and both are inherently one-time.

- **The one unavoidable manual step, and it should already be done by this point:** create the
  scoped `CLOUDFLARE_API_TOKEN` (+ note the `CLOUDFLARE_ACCOUNT_ID`) that `deployment.yml` needs
  as GitHub secrets. Every stage before this one could use `wrangler login` (personal OAuth) for
  local preview deploys with no stored token at all — this is the first point a real, portable
  API token is actually required, since GitHub Actions can't do interactive OAuth. Creating it is
  a one-time bootstrap, the same shape as read-receipt's WIF bootstrap needing a human once — not
  something worth scripting away for a personal project.
- Add `routes: [{ "pattern": "tobysmith.uk", "custom_domain": true }]` to `wrangler.jsonc` — this
  is the actual cutover action, expressed as a one-line config change rather than a dashboard
  click, per the Stage 3 finding that Wrangler provisions the DNS record and TLS certificate for
  a custom domain automatically on deploy. This is deliberately the _only_ thing that changes in
  this stage that couldn't have been done earlier.
- Re-run the full local verification suite one final time immediately before merging (lint,
  build, typecheck, Playwright) — the same "local CI" discipline as every stage, but as a last
  gate before the one real deploy.
- Merge the migration branch to `main`. This is the first time any of this work runs through
  GitHub Actions for real — watch the `deployment.yml` run (including it actually provisioning
  the custom domain) rather than assuming it'll behave like the local dry-runs did.
- Verify the live domain end-to-end, not just the preview URL: every route renders, the
  `/contact` → `/#contact` redirect lands correctly, and — most importantly — submit one real
  message through the live contact form and confirm actual delivery (Turnstile + email send
  both exercised for real, against production, for the first time).
- **Rollback path, made explicit rather than assumed:** if the Worker misbehaves post-merge, the
  fix is to remove the `routes` entry just added to `wrangler.jsonc` and redeploy (or revert it
  via the Cloudflare dashboard directly, faster in an emergency) — this repoints `tobysmith.uk`'s
  DNS back at nothing-changed, and GitHub Pages, deliberately left untouched at this point (see
  below), immediately starts serving the domain again exactly as it did before this stage. This
  is _why_ GitHub Pages retirement is the last thing this stage does, not an early one — don't
  reorder that without preserving an equivalent rollback path.
- Keep a closer eye than usual on the live site for a while after cutover (errors, delivery
  failures) before treating it as done — this window is what the rollback path above exists for.
- Only once genuinely confident the cutover is stable: retire the GitHub Pages configuration
  (scriptable via `gh api -X DELETE repos/tobysmith568/tobysmith.uk/pages` rather than clicking
  through repo Settings → Pages) — this is what actually forecloses the rollback path above, so
  don't do it early just to tidy up.
- Only after that: decommission the old `email.tobysmith.uk` Worker deployment, then archive
  (not delete) its repo — reconfirm with Toby immediately before this step, since it's the one
  genuinely hard-to-reverse action in the whole migration.

**Exit criteria:** `tobysmith.uk` served entirely by the new Cloudflare Worker in production;
GitHub Pages fully retired; the old email worker decommissioned and its repo archived; a real
contact-form submission confirmed delivered end-to-end on the live domain.

## Stage 11 — Visual redesign

**Depends on:** Stage 10 (design against what's actually live, not a preview). Unlike every
stage above, this one runs under normal continuous deployment again, in its own small PRs —
the big-bang/single-branch approach was specifically about the technical rewrite, not this.

Deliberately unscoped here — this is a collaborative design pass done together, not a solo
technical stage. Keeps the dodger-blue identity but reworks it beyond the current plain look;
also the point at which the deferred spotlight-count (2 vs 3 cards) and any remaining blog-post
curation calls (see "Open items") get made, since they're layout/content decisions best made
with the new design in front of us.

## Suggested order

1. AI tooling — context for every stage after this
2. Bun — foundation for every later stage's commands
3. Astro SSR + Cloudflare hosting (preview-only, prod untouched) — biggest/riskiest, done early
   so later stages target it once
4. Fold in the email backend (preview-only, old worker stays live in prod) — needs Stage 3's
   server context
5. Turnstile — touches the token-validation code Stage 4 just consolidated
6. IA overhaul (About/Contact into index, spotlights, mobile nav fix) — needs Stage 5's
   settled contact-form shape
7. oxlint/oxfmt — targets the final file layout after Stage 6's page changes
8. Playwright — specs written once, against the fully-settled shape
9. General code review — final technical pass
10. **Production cutover** — the one and only real deploy: DNS flip, GitHub Pages retirement,
    old email worker decommissioned, watched closely by hand
11. Visual redesign — collaborative, back to normal continuous deployment

## Open items (intentionally deferred, not blocking)

- **Blog per-post curation** (keep/rewrite/drop each of the 10 posts) — do this as its own pass,
  whenever it's convenient; not gated on any stage above.
- **Exact spotlight count** on the index (2 vs 3 projects/posts) — a layout call, decide during
  Stage 11.
- **Contact's nav treatment** (own link vs. anchor-only) — Toby's call during Stage 6.
- **Initial `featured: true` project set** — Toby's call during Stage 6.
- **Archiving `email.tobysmith.uk`** — confirm with Toby immediately before archiving, during
  Stage 10, only after the new setup is confirmed stable in production.
