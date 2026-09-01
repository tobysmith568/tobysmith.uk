# Prettier over oxfmt for formatting, dropped again shortly after adopting it

Formatting was originally split across two tools: oxfmt for everything it could parse, and
Prettier + `@tobysmith568/prettier-config`'s bundled `prettier-plugin-astro` scoped to `.astro`
only, since oxfmt genuinely can't format that extension (confirmed directly against this repo —
`oxfmt --check` on an explicit `.astro` path reports the file excluded, not a diff or an error).
That split has been dropped in favor of Prettier alone for the whole repo. oxlint's replacement by
ESLint (see `docs/adrs/0001-eslint-over-oxlint-and-biome.md`) is unrelated and unaffected — that
decision was made and stayed made independently of this one.

The reason for reversing course, not just a preference: unlike the linter decision, this split was
never backed by a capability gap. `bunx prettier --check .` against the entire repo, no scoping,
passes cleanly except one already-known, deliberately-excluded generated file
(`worker-configuration.d.ts`) — Prettier alone, with zero changes, already correctly formats every
`.astro` file _and_ everything oxfmt covered. oxfmt's only actual advantage was speed (~1.2s vs
~6.1s on this repo, timed directly) plus having been pre-configured to match this repo's style with
zero forced reformat. Weighed against the ESLint-over-oxlint decision made moments earlier — where
an even larger speed gap (oxlint ~0.09s vs ESLint ~1.6s) was explicitly ruled irrelevant at this
project's size, in exchange for closing a real capability gap — keeping oxfmt on speed grounds
alone, with no capability gap of its own to justify it, would have been inconsistent with that
reasoning. One formatter covering the whole repo, matching how one linter now covers the whole
repo, was judged more valuable than the speed difference.

Net effect: `oxfmt`/`.oxfmtrc.json` are gone; `prettier`/`.prettierignore` cover everything
(`dist`, `worker-configuration.d.ts` excluded). `bun run format`/`format:check` now run
`prettier --write .`/`prettier --check .` directly — no `.astro`-specific script needed since
there's no split left to express.
