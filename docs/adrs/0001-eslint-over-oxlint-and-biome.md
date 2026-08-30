# ESLint over oxlint for linting

ESLint (`eslint-plugin-astro`'s `flat/recommended` + `flat/jsx-a11y-recommended`, layered with
`typescript-eslint`'s `recommended`) replaced oxlint as the linter. This decision is about linting
alone — at the time it was made, formatting was still split across oxfmt/Prettier; that formatting
split was itself dropped shortly after, for unrelated reasons — see
`docs/adrs/0002-prettier-over-oxfmt.md`. Don't read anything below as describing the current
formatter setup, only the linter one.

oxlint was dropped rather than kept alongside ESLint because it cannot see `.astro` template
markup at all, only the frontmatter script block, and no combination of its own features closes
that gap — confirmed directly, not assumed: its native `--jsx-a11y-plugin` and its alpha
`jsPlugins` mechanism (which can load real ESLint plugins) were both tested against an `.astro`
file with a deliberately injected accessibility bug and caught nothing, because both still only
ever operate on the AST oxlint's own parser builds, which for `.astro` never includes the template.
Once ESLint covers everything oxlint did (frontmatter/script linting) and also reaches the
template, running oxlint alongside it would only add a second linter opining on the same
frontmatter code for no benefit. The resulting speed cost — oxlint ran this repo in ~0.09s, this
ESLint setup takes ~1.6s — is irrelevant at this project's size.

Biome was evaluated first (see git history/prior discussion) and genuinely does see `.astro`
template markup too, but was rejected in favor of this setup for its own reasons: its Astro support
sits behind an explicitly experimental flag with open upstream bugs, and its formatter disagreed
with this repo's Prettier-derived style on 24 of 33 `.astro` files even after aligning settings —
a real reformat cost this decision avoids entirely by leaving formatting untouched. Coverage isn't
a clean win for either tool, and that's worth being honest about rather than glossing over: both
Biome's default preset and this ESLint setup catch the same one confirmed real bug this repo had
(`Hero.astro`'s redundant "picture" in alt text, now fixed) but each also catches something the
other doesn't — Biome flagged a real security gap (`third-party.astro`'s `target="_blank"` missing
`rel="noopener"`, still unfixed and still uncaught by this setup, since that's outside
`jsx-a11y`'s scope) and a debatable `aria-label`-on-`<span>` finding neither `jsx-a11y-recommended`
nor `jsx-a11y-strict` reproduce. So the case for ESLint over Biome here is stability and avoiding a
forced reformat, not strictly broader bug coverage.

One non-obvious wiring detail worth recording since getting it wrong silently produces false
positives: `eslint-plugin-astro`'s `jsx-a11y-*` configs aren't a bare re-export of
`eslint-plugin-jsx-a11y`'s rules — they wrap each rule under an `astro/` prefix and remap Astro's
plain-HTML `for` attribute to the `htmlFor` name `jsx-a11y`'s rules expect internally. Wiring
`eslint-plugin-jsx-a11y` in by hand instead (spreading its own `flatConfigs.recommended.rules`
directly) skips that remapping and produces a real false positive:
`label-has-associated-control` flags every correctly-`for`/`id`-associated `<label>` in
`ContactForm.astro` as unassociated, because it never receives the `for` → `htmlFor` translation.
Use `eslintPluginAstro.configs["flat/jsx-a11y-recommended"]`/`"flat/jsx-a11y-strict"`, not
`eslint-plugin-jsx-a11y` directly.

The remaining false positives needed the same kind of targeted overrides oxlint's own config
already carried: `no-unused-vars` needs `argsIgnorePattern: "^_"` for this repo's
intentionally-unused-callback-param convention; `triple-slash-reference` is off for `src/env.d.ts`
(Astro's own idiomatic ambient-types wiring); `no-unused-expressions` is off under `cypress/**`
(Chai's getter-style assertions); and `ContactForm.astro`'s `isValid` needed an inline
`eslint-disable-next-line` — it's only referenced from an Alpine `x-bind:disabled` directive
string, invisible to static analysis, the same class of frontmatter/template-boundary blind spot
every tool evaluated for this decision has in some form.
