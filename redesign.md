# tobysmith.uk — Visual redesign (Stage 10)

The working document for the collaborative visual redesign. It is the companion to
[migration.md](./migration.md)'s **Stage 10** — that stage's entry stays a short summary of _why_
and _when_; this file is where the design work actually happens and where every decision is
recorded. Like migration.md, it is a living document and will be deleted once the migration is
complete.

## How to use this document

- migration.md Stage 10 is the anchor: the rationale for redesigning before the cutover, the
  scope guardrails, the exit criteria. Don't restate those here — link back to them.
- **The body sections (Direction → Tokens → Layouts → Components → Copy) always describe the
  current agreed spec.** The **Decision log** at the end is the append-only chronological trail of
  how we got there, including reversals.
- **Update this file in the same session a decision is made**, not afterwards. If we reverse a
  decision, edit the body to the new truth _and_ add a Decision log line saying what changed and
  why.
- Any session picking this up mid-redesign: read this whole file first, then the most recent
  Decision log entries and the Open questions.

## Where things stand

_Snapshot — 2026-08-31. Keep this current; the Decision log has the full trail._

**Done and in `src/` (all green: `bun run lint` / `build` / `e2e` — 120 Playwright tests):**

- Direction (**"Public API"**), tokens (type, colour, space, motion, primitives) — locked, and
  revised several times against real previews (see Decision log).
- **Light + dark themes** with a header toggle (system / light / dark).
- **Global shell** — Header (nav + theme toggle + mobile menu button), MobileMenu drawer, Footer,
  `BaseLayout`. The `.wrap` / `.section` / `.doc` layout system, the `.mono` / `.eyebrow` /
  `.text-link` / `.more` / `.icon-button` utilities, `Icon.astro`.
- **Index page** in full — Hero (frontmatter block, one-shot role settle, hover easter egg),
  About, ProjectsSpotlight, BlogSpotlight, ContactSection, ContactForm. Pending Toby's final
  visual sign-off but no known issues.
- **Prose system** — `Prose.astro` + `ProseLayout` + `PolicyLayout`; Shiki dual code themes.
- **Listing pages** — `/blog` (grouped by year) and `/projects` (manifest + tags) had their
  dedicated pass on 2026-08-31 (Decision log). New `.listing` / `.entry-group` utilities.
- **Detail templates** — blog post + project both passed on 2026-08-31 (shared `.entry-head`;
  project header rebuilt left-aligned with logo + tags + `source`/`npm`/`site` links).
- The policy pages + 404 **inherit** the system (tokens, `.doc` gutter, shared prose
  components, the icon set) and are internally consistent, but have **not had a dedicated
  design pass** — see the subsections under Page layouts.

**Next, in rough order:**

1. **Per-page layout passes** — policy pages, then 404. Both are low-stakes ("not a showcase" /
   "get the visitor back somewhere useful"); this is the last of the layout work.
2. **Copy pass** — mostly untouched (a couple of one-off fixes logged). Best done after the
   layouts settle.
3. **Cross-cutting QA** — responsive / keyboard / reduced-motion / axe-Lighthouse sweep.
4. **Wrap-up** — finish `CLAUDE.md`, fold migration.md's Open items (spotlight count is decided
   via `featured`; blog curation still open) into its stage notes, final CI gate.

**Needs Toby (see Open questions):** the concrete Definition-of-done checklist; blog per-post
curation in scope or deferred; whether to wait for a purpose-shot profile photo; **verify the
project `links` npm package names** — the rest were best-effort guesses from the content and
Toby has already corrected them where wrong (`generate-license-file`'s `source` is
`TobyAndToby`, not `tobysmith568`; `license-cop`'s `site` is `license-cop.js.org`, confirmed).

## Working agreement — the rules

How this collaboration runs. Agreed up front; changes to these rules are themselves logged.

- **Interactive by default.** Toby makes the taste calls. Claude proposes options _with a
  recommendation and its reasoning_ — it doesn't pick silently, and it doesn't present a flat list
  with no opinion. Any fork that would send real work in a direction goes to Toby before that work
  starts.
- **`/frontend-design` every time.** Every working session on the redesign begins by invoking the
  `frontend-design` skill and following its process (brainstorm a compact token plan → critique it
  against the generic-default clusters → build → critique again). Not optional, including for
  "just a small tweak".
- **Suggestions as local HTML previews.** When Claude wants to show something visual, it writes a
  self-contained `.html` file into Toby's scratchpad directory (path is printed per session; this
  session:
  `/tmp/claude-1000/-home-tobys-src-tobysmith568-tobysmith-uk/9b2adfe0-7e5a-46d3-a091-93860188f79a/scratchpad`)
  so Toby opens it in a browser locally. These are throwaway — never committed, never part of the
  build. Multiple options = multiple files, or one file with the variants clearly separated.
- **Nothing lands in `src/` until the direction is agreed.** Explore in previews first. Once the
  token system and the index layout are signed off, implementation can start; later pages can then
  proceed in parallel, each with its own sign-off.
- **One decision, or a small batch, at a time.** Resolve direction, then foundational tokens, then
  layouts, then components, then copy — in that order (see _Sequencing_ below). Don't fan out into
  dozens of micro-decisions in one exchange.
- **Scope guardrails** (from migration.md): dodger-blue stays in the palette — it can become far
  more subtle, no longer the loud primary it is today, but it isn't dropped; design against the
  `*.workers.dev` preview / `wrangler dev`, not the live domain; production stays on GitHub Pages
  throughout.
- **Quality floor, non-negotiable and built in without ceremony:** responsive down to mobile,
  visible keyboard focus, `prefers-reduced-motion` respected, semantic HTML, real alt text.
- **Local CI gate after anything lands in `src/`:** `bun run lint`, `bun run format:check`,
  `bun run build` (`astro check`), `bun run e2e` — all green locally before moving on, exactly as
  every migration stage.
- **Playwright will churn.** Selectors and visible copy _will_ change. Update
  `e2e/page-objects/**` and the specs alongside the components in the same commit — no silent
  coverage loss, no letting the suite rot.
- **Stack constraints stay:** Astro `output: "static"`; component-scoped `<style>` with native CSS
  nesting, no preprocessor; Alpine.js is available for interactivity; Shiki for code blocks
  (`light-plus` / `dark-plus` dual themes since dark mode landed — see Decision log); fonts
  self-hosted via `@fontsource*` or equivalent — no external font CDN (CSP + performance).

## Definition of done

migration.md sets the bar as _"this is the public face I want the site to launch with"_ — not a
finished wishlist; leftover polish ships as ordinary small PRs after the cutover. Pin the concrete
version with Toby at the start of the stage:

- [ ] **TBD** — the concrete, per-page "good enough to launch" checklist (needs Toby)
- [x] Blog posts marked `featured: true`/`false` — resolved, see Decision log
- [ ] Blog per-post curation — confirmed in scope for Stage 10 or explicitly deferred (migration.md
      tracks it as a separate, non-blocking pass)
- [ ] `CLAUDE.md` architecture/styling notes — _in progress_, kept in step as work lands
      (styling, icons, theming, mobile nav all updated); the "current plain look" framing is
      gated on the cutover per CLAUDE.md's own blockquote, so it stays until Stage 11
- [ ] migration.md Open items resolved into their stage notes — **still to do**; the deferred
      spotlight-count (2 vs 3) is now decided (editorial `featured` boolean, no fixed count), so
      that item can be closed out in migration.md

## The brief

### Subject

Toby Smith — London-based Senior Software Developer at Trayport (React frontends, C# backends),
npm package author, TypeScript-first with some Rust and C#, background in games development
(Unity, OpenGL). The site is his personal portfolio and blog at tobysmith.uk.

### Audience

Rough priority order — refine with Toby:

1. Developers who landed on a blog post from a search and might look around
2. Potential employers / collaborators sizing him up
3. People following a link to a specific project

Explicitly _not_ optimised for: keyword-scanning recruiters, general non-technical public.

### What each surface is for

- **Index** — "who is this, what do they make, how do I reach them" in one scroll: hero, about,
  projects spotlight, blog spotlight, contact form.
- **Projects** (`/projects`, `/projects/[slug]`) — the portfolio proper: a list plus per-project
  long-form write-ups (4 projects, MDX).
- **Blog** (`/blog`, `/blog/[slug]`, RSS) — 10 technical posts, dev-notebook style.
- **Policies** (`/terms`, `/privacy`, `/cookies`, `/third-party`) — legal text and the license
  list; low-traffic, must stay legible, not a showcase.
- **404** — get the visitor back to something useful.

### Voice

First-person, informal, dry ("Burrito over-filler" sits in the rotating job titles; the site is
"a place for me to share cool things I find or create"). The redesign keeps that voice — copy
changes tighten and focus it, they don't corporatise it.

### In scope / free to change

Everything visual — layouts, typography, colour beyond "still recognisably dodger-blue", spacing,
motion, component styling, section order — and wording: headings, taglines, CTA labels, form copy,
meta descriptions, error and empty states. Blog _post bodies_ are out of scope here (that's the
separate curation pass).

### Fixed

Route URLs (migration.md locked them), the content-collection schemas, the contact-form flow and
its Turnstile integration, the tech stack.

### What we're replacing

Blinker (sans) + Fira Code, dodger-blue accent, an 800px centred column, a solid-blue nav bar,
underline-colour-shift links, one CSS animation (the rotating hero job title), justified prose,
and a corner-bracket blockquote. Functional and generic — per migration.md, "neither the old
production site nor where the site is meant to end up."

### Inventory (coverage tracking)

- **Pages:** index, projects index, project detail, blog index, blog detail, terms, privacy,
  cookies, third-party, 404. (`/contact` is a redirect only — no UI.)
- **Layouts:** BaseLayout, ProseLayout, PolicyLayout.
- **Shared components:** Header, MobileMenu, Footer, Prose, Anchor, Footnote, ArticleImage, Icon
  (new), ProjectListItem, BlogListItem, ContactForm, and the Index sections (Hero, About,
  ProjectsSpotlight, BlogSpotlight, ContactSection). (`HeaderMenuItem` and `HR` were deleted in
  the Index build — see Decision log.)

## Sequencing — what we decide, in what order

Short answer to "fonts before layout?": **direction first, then the foundational tokens
(type, colour, spacing, motion), then page layouts, then components, then copy.** Reasoning:

1. **Design direction** — mood, thesis, the signature element, the anti-goals, the one deliberate
   risk. Everything downstream serves this; choosing type or colour first is how you back into a
   generic default.
2. **Information architecture** — which sections and pages exist and in what order. Almost
   independent of the visual choices and low-controversy here (migration.md already made the big
   IA moves), so lock it early and cheaply. Includes what drives the index spotlights (decided —
   see Decision log).
3. **Typography** — before layout, because the type scale and line-height set the vertical rhythm
   that layout spacing is derived from. Display + body + mono, scale, weights, measure.
4. **Colour** — palette as named hex, semantic roles, light/dark decision, code-block theme.
   Roughly parallel with type; both feed everything visual.
5. **Spacing, grid, breakpoints** — derived from the type rhythm; the skeleton every layout
   shares.
6. **Motion** — duration scale, easings, the page-load moment, scroll reveals, hover behaviour,
   reduced-motion. Decided as a system now so it isn't sprinkled on ad hoc later.
7. **Other primitives** — radius, rules and borders, shadows, icon style, image treatment.
8. **Page layouts** — index first (it's the thesis and exercises the most components), then
   projects, blog, policies, 404, then header and footer.
9. **Component specs** — buttons, form fields, list items, prose elements, code blocks, links —
   finalised once the layouts that use them are settled.
10. **Copy pass** — headings, taglines, CTA labels, form / error / empty-state text, meta
    descriptions.
11. **Build sequence** — see the final section.

Decisions can loop back — settling the index layout may send us back to the type scale. That's
expected: edit the earlier section and log the change.

---

## Design direction

_Status: locked._ Three directions were explored as HTML previews (throwaway, in a prior
session's scratchpad — see the Decision log); Toby picked **"Public API"** and confirmed it as
the committed base ("pure direction 1", nothing borrowed from the others). The values below are
the agreed direction; refinements since then are captured in the token sections + Decision log.

- **Thesis / one-liner:** the site as a well-documented module — a persistent metadata block like
  file frontmatter, content sections read as named exports.
- **Mood:** precise, quietly confident, systems-y — like reading well-documented source.
- **Signature element:** the frontmatter block — `name / role / location / links` set as
  monospace key-value pairs, **inline at the top of the hero** (decided — a sticky left-rail
  variant was previewed and rejected; see Decision log).
- **The deliberate risk:** using monospace as real UI chrome (eyebrows, metadata, tags, dates),
  not just for code — without tipping into a fake-terminal cliché.
- **Structure device:** monospace field labels, never numbers — the content isn't a sequence.
- **Anti-goals — must not read as:** the cream-background + high-contrast-serif + terracotta
  cluster; the near-black + single-acid-accent cluster; the broadsheet / hairline-rule cluster;
  a generic "developer portfolio" template (dark hero, gradient blob, tech-logo cloud, 01/02/03
  section numbers that aren't a real sequence); or a full fake-terminal/REPL (rejected during
  brainstorming, before it reached a preview, for being the on-the-nose cliché for a CLI-tool
  author).
- **Reference points:** the built site itself is now the reference (`bun run dev` /
  `bun run preview`); the original direction preview lives in a prior session's scratchpad only.

## Design tokens

_Status: confirmed and in `src/`._ Originally reviewed by Toby as `tokens-specimen.html` (a prior
session's scratchpad); since revised in place several times against real content (links, the
shell/gutter, section markers, `--rule` / `--scrim`, the dark palette — all in the Decision log).
**`src/styles/tokens.css` is now the source of truth for concrete values**; the sections below
describe the intent and should track it.

### Typography

- Display face: **Space Grotesk** (500/600) · Body face: **Public Sans** (400/500) · Mono face:
  **Fira Code** (400/500 — decided, kept for all code snippets, and doubles as UI chrome per
  direction 1: eyebrows, metadata key/value pairs, tags, dates) · no separate utility/caption
  face — Fira Code at `text-xs` covers that role.
- Type scale (approximate px; `tokens.css` has the authoritative rem values): `xs` ~13 · `sm` ~15
  · `base` ~17 · `lg` ~20 · `xl` ~24 · `2xl` ~30 · `3xl` ~40 · `4xl` ~52. Not a strict modular
  ratio — tuned by eye per use. As built: mono chrome / metadata at `sm` (frontmatter) or `xs`
  (dates, footer, form labels), body copy at `base`, list-item titles at `lg`, section markers
  `xl` on narrow / `sm` in the gutter on wide, hero lead `3xl`–`4xl` responsive.
- Base line-height 1.65 (body), tight ~1.15 (display headings), ~1.5 (mono metadata blocks).
- Prose / section-body measure: **`--measure` 44rem** (~75ch). The hero is _not_ clamped to this
  — it sits flush at `--shell` (see Spacing).
- Weights in use, deliberately few: body 400, display 500 (lead line) / 600 (item titles, nav
  identity), mono 400 (body code) / 500 (UI chrome — labels, metadata, buttons). No 700 anywhere
  — the mood is quiet, not bold.
- Link treatment: ink by default everywhere; dodger-blue (`--accent`) is never a resting
  colour, only a hover/focus state. **Body, nav and footer links carry a quiet resting
  underline** (`--underline`, `#b9bfc7`, 1px, `0.15em` offset) so a link is always
  distinguishable from body text without relying on colour — on hover/focus the underline
  thickens to 2px and both it and the text go `--accent` (reversed from the earlier
  "underline only on hover" rule — see Decision log). Card/item titles (project + blog list
  items) still animate their underline in from transparent to `--accent` on hover/focus
  alongside the colour shift (1.5px, 3px offset). Focus-visible gets a 2px `--accent` outline,
  2px offset, on everything interactive (global rule in `global.css`).

### Colour

- Palette (proposed, 8 named roles — deliberately more than "4–6" since several are pure
  neutrals doing structural work, not accent choices):
  - `--bg` `#F6F7F9` — page background, cool off-white
  - `--surface` `#FFFFFF` — cards, inputs, anything raised off the page
  - `--ink` `#16181D` — primary text, near-black
  - `--muted` `#6B7280` — secondary text, metadata, captions
  - `--border` `#E1E4E8` — rules, dividers, input borders
  - `--accent` `#1E90FF` — dodger-blue, interactive-only (decided: stays in the palette, demoted
    from loud primary — see Decision log)
  - `--accent-strong` `#0F6FD1` — accent's hover/active state, a touch deeper
  - `--error` `#B3312A` — muted brick red, contact-form failure text only; no separate "success"
    colour — success is communicated by the message text plus a thin `--accent` left rule, not a
    colour of its own (avoids a generic green-tick moment)
- Light / **dark** mode: **both** (reversed from "light only" — see Decision log). Dark is a cool
  near-black, the light palette's counterpart rather than an inversion. Same eight roles, plus
  `--rule` (section dividers — `= --ink` on light, a dimmer `#3C4250` on dark so a near-white
  hairline doesn't shout) and `--scrim` (the mobile-nav overlay). Dark values:
  `--bg` `#10131A` · `--surface` `#191D26` · `--ink` `#E7E9EC` · `--muted` `#8B94A3` (6:1 on bg)
  · `--border` `#2A2F3A` · `--rule` `#3C4250` · `--accent` `#4DA6FF` · `--accent-strong` `#7CBEFF`
  · `--error` `#F0776E` · `--underline` `#4C5462`.
  Mechanism: `:root` is light; a pinned choice stamps `data-theme` on `<html>` and wins;
  `prefers-color-scheme` fills in for "system". A header **button** cycles in three steps,
  ordered so the first click always changes the look: **system → (the theme the OS isn't) →
  (the theme the OS is, now pinned) → system**. The OS preference only picks the direction; the
  two pinned steps are concrete and ignore later OS changes. Its icon (monitor / sun / moon —
  geometric SVGs in `Icon.astro`) _is_ the current state. `BaseLayout`'s inline `<head>` script
  plus `localStorage` persist the choice with no flash; `Header.astro`'s script runs the cycle.
- Code-block theme: Shiki **dual** — `light-plus` / `dark-plus` (`shikiConfig.themes`), swapped in
  `global.css` off the same two activation cases as the palette.

### Spacing, grid, breakpoints

- 4px base unit, scale: `sp-1` 4 · `sp-2` 8 · `sp-3` 12 · `sp-4` 16 · `sp-5` 24 · `sp-6` 32 ·
  `sp-7` 48 · `sp-8` 64 · `sp-9` 96 (px). Roughly ×1.5–2 steps, not a strict formula — kept small
  and countable on purpose (9 stops).
  Layout tracks: `--measure` **44rem** (readable text column — prose, section bodies), `--shell`
  **60rem** (the page shell — wider than the text column), `--gutter` **9rem** (the left label
  track). The hero (frontmatter block + lead) sits flush at the shell's left edge; every
  `.section` below it is a two-track grid — the monospace `# label` in the gutter, the body at
  `--measure` — so the labels read as export markers in a margin. (Reversed from "44rem for
  everything, single-column at every width" — see Decision log.)
- Breakpoints: **640px** for the mobile nav toggle, **960px** (`60rem`) for the label-gutter
  grid (below it the label / rail stacks above the body). Both are content-driven, not a device
  grid.
- The listing + article + policy pages use `.doc` — the same gutter grid as `.section`, so
  their content lines up with the index body rather than sitting in a narrow left-aligned
  column. The gutter (`.doc-rail`) holds page metadata: an RSS link (`/blog`), a back-link +
  date (article pages), or nothing (`/projects`, policies — deliberate margin).

### Motion

- Duration scale: `dur-fast` 120ms (hover colour/background shifts) · `dur-base` 200ms
  (underline-draw, focus transitions) · `dur-slow` 400ms (the load-in settle only).
- Easing: `ease-standard` `cubic-bezier(.2,.7,.3,1)` for the load-in settle · `ease-out`
  `cubic-bezier(.16,1,.3,1)` for hovers/underlines.
- Page-load sequence: **the one orchestrated moment** — the frontmatter block's key/value rows
  fade + rise in on load, ~70ms stagger per row, `dur-slow`/`ease-standard`. Nothing else animates
  on load.
- Scroll-triggered reveals: **none.** Deliberate — direction 3 ("Release") used a scroll stagger
  and it's exactly the kind of scattered effect the brief flagged as reading AI-generated; this
  direction's mood is quiet and systems-y, so lists just render. One signature moment (the
  settle), not several.
- Hover micro-interactions: underline-draw on body links, colour shift on card titles/buttons,
  all `dur-fast`–`dur-base`. Plus one easter egg: once the load-in has settled, hovering the
  frontmatter block flicks the `role` value to a random quip (`Full-stack developer` /
  `npm package author` / `TypeScript fanatic` / `Burrito over-filler`) and it snaps back to the
  real title on mouse-leave. Mouse-only (`hover: hover`), never repeats the previous quip, and
  the `.sr-only` real title is untouched throughout. Keeps the old rotating-title joke alive
  without the ruled-out ambient loop — it only moves when the reader reaches for it.
- Reduced-motion: `prefers-reduced-motion: reduce` disables every animation/transition outright
  (confirmed working in the specimen and both direction-1 previews) — the settle sequence simply
  never plays, content is present immediately.

### Other primitives

- Border radius: **2px**, everywhere something has one (inputs, buttons, cards, the avatar) —
  deliberately almost-off, crisp rather than soft-friendly.
- Borders / rules: 1px `--border` for hairline dividers and input borders; 1px `--rule` (see
  Colour) for the firmer line that opens each index `.section`; the frontmatter block keeps its
  own 2px `--border` left rule (its one structural flourish).
- Shadows: **none**, anywhere, in this direction — flat fits "reading source", and it's one fewer
  thing to make consistent across light/dark later.
- Icon style: a small inline-SVG set in `src/components/Icon.astro` — geometric, 1.5px stroke,
  `currentColor`, 16-unit grid (`arrow-right`, `arrow-left`, `arrow-up-right`, `rss`, `close`,
  `menu`, `sun`, `moon`, `monitor`). Replaces every unicode glyph that was doing an icon's job
  (`→`, `×`; the `chevron-left.svg` / `rss.svg` assets deleted). `--muted` at rest, `--accent`
  on hover, often with a 2–3px translate. See Decision log.
- Image treatment: the hero avatar is a **96 × 120 (4:5 portrait) crop, 2px radius, 1px
  `--border`**, top-aligned left of the frontmatter record so the two heights roughly match (see
  Decision log). Project logos still sit bare (contain-fit, no frame); revisit once the Projects
  layout section is underway.

## Page layouts

_Global shell + Index are implemented; the listing / detail / policy / 404 pages have not had a
dedicated pass (subsections below are stubs — that work is next). One subsection per surface._

### Global — header / nav (desktop + mobile)

_Status: implemented._ Header bar at `--shell` width: mono `toby smith` identity left; a
right-side `.controls` group holds the mono nav links (`projects` / `blog` / `contact`, muted →
ink with an underline that draws in on hover/active), then **the theme toggle** (`.icon-button`,
cycles system → light → dark, icon = current state — see Colour), then (below 640px only) the
"Open menu" `.icon-button`. **The mobile drawer** (`MobileMenu.astro`, Alpine) slides in from the
right over a `--scrim` overlay: a header row (`# menu` + a `close`-`.icon-button`), full-width
link rows (mono, `arrow-right` icon, `--accent` active/hover state), and a footer row of github /
linkedin / rss links. Esc closes it; body scroll locks while open. (Replaces the earlier drawer
that always rendered the toggle and had the desktop links leaking through — see Decision log.)

### Global — footer

_Status: implemented._ Rendered as a sibling of `<main>` (not inside it) so `main { flex: 1 }`
pins it to the viewport bottom on short pages. `--shell` width, mono, `--text-xs`: `© Toby Smith
{year}` left, legal links (terms / privacy / cookies / licenses) right, each with the resting
underline. Wraps to two rows under ~480px.

### Index

_Status: implemented in `src/` and revised once against a real preview (Toby's punch-list —
see Decision log); still pending final visual sign-off._ Hero (frontmatter block + lead line +
one-shot role settle, all flush at the shell's left edge), then four `.section`s (about,
projects spotlight, blog spotlight, contact) each opening with a 1px `--rule` line and a
monospace `# label` that sits in the left gutter on wide viewports / above the body on narrow.
Section order unchanged from Stage 6 (hero → about → projects → blog → contact).
Header/footer/mobile nav rebuilt in the same pass.

Since then: the round-1 + round-2 polish passes, the hover easter egg, the avatar, dark mode,
`.icon-button` — all logged. CI green throughout (currently 112 Playwright tests).

### Projects — index

_Status: implemented (2026-08-31)._ `.listing` wrapper. Opens like an index `.section` — a firm
`--rule`, the `# projects` marker in the gutter — then `<h1>Projects</h1>` and a mono `.summary`
line (`4 projects · all open source`). One un-marked `.entry-group` holds the `ProjectListItem`
list (no grouping — only four projects). Each row now carries monospace tag chips, via a new
`showTags` prop on `ProjectListItem` that `/projects` opts into (the index spotlight leaves it
off). Tag values live in each project's frontmatter (`tags: string[]`) — currently placeholders.

### Projects — detail

_Status: implemented (2026-08-31)._ `.doc` with a sticky `← Projects` back-link in the gutter.
The centring is gone. Header is a left-aligned `.entry-head`: the logo — a plain `<img>`, not
`astro:assets`'s `<Image>` (see the Decision log entry on the dev-mode `/_image` 400 this
avoids) — bare, contain-fit, 3.5rem, sits inline to the left of a text block — `<h1>` (`--text-3xl`),
`--text-lg` muted tagline, the `.tags` chips, then a monospace `.links` row of
`source` / `npm` / `site` links (each with an `arrow-up-right` icon, new tab). Below 34rem the
logo stacks above the text. Projects with no logo SVG (read-receipt) just render the text.
Then the shared hairline `.entry-head` rule, then `<Prose>`. Logo placement was picked from a
preview (variant "A"); a frontmatter-record variant ("E", echoing the index hero's
photo + record) was previewed and rejected. Needs a new `links` map on the projects schema —
see the Decision log.

### Blog — index

_Status: implemented (2026-08-31)._ `.listing` wrapper. Opens like an index `.section` — a firm
`--rule`, the `# blog` marker in the gutter — then `<h1>Blog</h1>` and a mono `.summary` line
(`10 posts · 2020–2024 · RSS`, the RSS being a text link, `a.rss`). Posts then group into
calendar years (`.entry-group` per year, newest first); each year is a monospace `.group-marker`
that sticks in the gutter while its group scrolls, like a version header down a changelog margin.
The 2023 gap is deliberately left visible. `BlogListItem` is unchanged — rows keep their full
date. The signature move for this page; see the Decision log for the rationale and the rejected
alternatives.

### Blog — detail

_Status: implemented (2026-08-31)._ `.doc` with `← Posts` back-link + mono date in the sticky
gutter; `<h1>` (`--text-3xl`) wrapped in a `.entry-head` that carries the shared hairline rule
before the `<Prose>` body — the same "end of the metadata, start of the body" beat the project
detail has. Light touch: the current page was already close. No standfirst (previewed, not
taken).

### Policy pages + license list

_Status: no dedicated pass._ `/terms` `/privacy` `/cookies` route through
`PolicyLayout → ProseLayout` (now `.doc`-wrapped); `/third-party` uses `ProseLayout` directly and
renders the generated license list. Legibility only — "not a showcase" per the brief.

### 404

_Status: light pass done, revisit with the rest._ `src/pages/404.astro`: `.doc`, left-aligned,
`# 404` marker + "This page doesn't exist" + icon back-link. Copy in the Copy section.

## Component specs

_Status: most are settled in code (Index build + the polish passes) but not written up as
standalone specs — read the components themselves._ Settled: primary button / CTA (dark `--ink`
fill, `arrow-right` icon, `--accent-strong` hover), `.icon-button` (bordered square — theme
toggle, menu toggle, blog RSS), contact-form fields (`--surface`, 1px border → 2px `--accent`
focus outline, `--muted` hover border), `ProjectListItem` / `BlogListItem` (flex row,
right-aligned nudging `arrow-right`, `--text-lg` title; `ProjectListItem` also takes an optional
`showTags` prop rendering monospace tag chips, used on `/projects` but not the index spotlight),
links (resting `--underline`, see
Typography), `.more` section actions, back-links (`arrow-left` + `--measure`), Prose (headings,
links, blockquote, inline + block code with Shiki dual themes), `.tags` chips (shared
`global.css` utility — `/projects` rows + project detail header), the project detail `.links`
row (`source`/`npm`/`site`, mono, `arrow-up-right`, new tab), the shared `.entry-head` (the
hairline rule closing a detail page's header). Still genuinely open: `HR`,
`Footnote`, `ArticleImage`, code-block chrome beyond the current border treatment.

## Copy

_Status: only one-off fixes so far; the deliberate copy pass is still to come._ Track every
wording change here so it's reviewable in one place.

- **Hero lead line** — replaced in the Index build: old "Blog and Portfolio Website" tagline →
  **"Builds small developer tools and writes about the sharp edges."** (this is now the `<h1>`).
  The rotating job titles are unchanged ("Full-stack developer" / "npm package author" /
  "TypeScript fanatic" / "Burrito over-filler" → settles on "Senior Software Developer"); still
  open to a copy review.
- **Section headings** ("About Me", "Projects", "Blog", "Contact Me") — still the originals,
  rendered lowercase by `.eyebrow`. Review TBD.
- **Listing page titles + summaries** (2026-08-31 pass): `/blog` `<h1>` "Blog Posts" → **"Blog"**;
  `/projects` `<h1>` "My Projects" → **"Projects"** (both match the nav + the `# marker`). New
  mono summary lines: `/blog` **"10 posts · 2020–2024 · RSS"** (counts + year span computed),
  `/projects` **"4 projects · all open source"**. `/projects`' old intro `<p>` ("A selection of
  the projects I've been working on recently.") is dropped — it was stale. Page `<title>` /
  meta descriptions are unchanged (still "Blog Posts" / "A selection of the projects…") — that's
  the meta-description pass's job.
- **Detail page back-links** (2026-08-31 pass): project detail `← My Projects` → **`← Projects`**
  (the `/projects` `<h1>` is now "Projects"). Blog post detail keeps `← Posts` for now — a
  wider "back-link matches its destination" sweep (`← Blog`?) is left for the copy pass.
- **Project detail links row** (2026-08-31 pass): labels are **`source` / `npm` / `site`**
  (lowercase mono). URLs are in each project's `links` frontmatter — best-effort, need Toby to
  verify.
- **CTA labels** ("Send Message", "More projects →", "More posts →"): TBD
- **Contact form:** labels, placeholders, success text ("Message sent successfully!"), error text,
  disabled / submitting states: TBD. Intro line reworded in the 2026-08-31 pass — was "Feel free
  to reach out me using the message form below." (typo included) → "Got a question or an idea?
  Send a message below, or reach me on LinkedIn."
- **404 copy:** reworded in the 2026-08-31 pass — "404! / The page you are looking for does not
  exist." → "`# 404` / This page doesn't exist / The link may be broken, or the page may have
  moved." + "← Back to the homepage". Revisit with the rest of the 404 layout pass.
- **Empty / error states:** TBD
- **Meta titles + descriptions** per page: TBD
- **Footer:** "Copyright Toby Smith {year}", link labels: TBD

## Open questions

- Definition of done — the concrete per-page checklist (needs Toby)
- Blog per-post curation — in scope for Stage 10, or deferred?
- ~~Dark mode — in or out?~~ **in** — see Colour + Decision log.
- ~~Body / display faces~~ **resolved** — Blinker + old Fira Code usage replaced with Space
  Grotesk (display) + Public Sans (body) + Fira Code (mono / UI chrome). See Typography.
- Profile photo — size/shape/position **resolved** (96 × 120 portrait, see Decision log). Still
  open: the source is the GitHub avatar (a side-cropped selfie — sky above, pavement below); a
  purpose-shot headshot would fill the portrait frame far better.

## Build sequence (once the direction is locked)

Order of implementation in `src/`; each step ends on a green local CI gate. Progress marked
`[x]` done · `[~]` partial · `[ ]` not started.

1. `[x]` **Tokens + global styles** — `tokens.css` / `global.css`, font imports, global element
   styles, reduced-motion baseline. (Later: dark palette, `--rule` / `--scrim`, `.icon-button`.)
2. `[x]` **Layout shell** — Header (+ theme toggle), MobileMenu, Footer, BaseLayout (+ the
   no-flash `<head>` script).
3. `[x]` **Prose system** — Prose.astro + ProseLayout + PolicyLayout; Shiki dual code themes.
4. `[x]` **Index** — all five sections + ContactForm. `featured: boolean` added to the `blog`
   schema; picks made (`my-deployments-in-2024` / `reverse-flex-directions` → `true`).
5. `[~]` **Listing + detail pages** — `/blog` + `/projects` listings (year grouping, manifest +
   tags) and the blog-post + project detail templates (shared `.entry-head`; project header
   rebuilt with logo + tags + `source`/`npm`/`site` links; new `links` schema field) all had
   their pass on 2026-08-31. **Only the policy pages + 404 remain** — both low-stakes.
6. `[x]` **Motion pass** — the load-in sequence, hover states, the role easter egg, the
   `clientPrerender` fix. (No scroll reveals — deliberate.)
7. `[ ]` **Copy pass** — apply agreed wording; update e2e page objects + specs. (Only one-off
   fixes so far.)
8. `[ ]` **Cross-cutting QA** — responsive sweep, keyboard / focus, reduced-motion, axe /
   Lighthouse.
9. `[ ]` **Wrap-up** — finish `CLAUDE.md`, resolve migration.md Open items into their notes
   (spotlight count is decided via `featured`; blog curation still open), final full CI gate.

## Decision log

Append-only, newest first. Format: `YYYY-MM-DD — <area>: <decision>. <why, briefly>.`

- **2026-08-31 — Bug: project logos 400 in `astro dev` — fixed by dropping `<Image>`.** Toby
  reported the logos 400ing on his dev server right after the detail-template pass landed.
  Reproduced: `astro dev` renders every route on demand (prerendering only happens at
  `astro build`), so `<Image>` always goes through the Cloudflare adapter's _runtime_ image
  service there — never the Sharp-based `imageService: "compile"` path, which only ever covers
  the build's prerendering pass. That runtime service only transforms
  `jpeg`/`png`/`gif`/`webp`/`avif` and 400s any other format ("Unsupported format: svg") — so
  every project logo was always going to 400 in dev, going all the way back to the original
  centred-logo header; it just hadn't been hit before (earlier verification went through
  `wrangler dev` against a build, or `astro preview`, which both serve the pre-optimized static
  file, or `astro dev` on a page whose logo wasn't looked at closely). Fix: SVGs don't need
  Sharp's resize/recompress anyway, so `resolveProjectImage` now resolves and returns the
  Vite-processed asset directly (`{ src, width, height }`) and the project detail page renders
  a plain `<img src={...}>` instead of `astro:assets`'s `<Image>` — sidesteps the runtime image
  service (and its format list) entirely, in both dev and prod. `<Image>` no longer appears
  anywhere in the codebase. Confirmed: `astro dev` 200s the page and the image; `astro build`
  still emits a static hashed `/_astro/*.svg`.

- **2026-08-31 — Page layouts: the two detail templates (blog post, project).** Both get a
  shared `.entry-head` (global.css) — a left-aligned header closed by a hairline `--border`
  rule that marks "end of the metadata, start of the body".
  - **Blog post** — light touch (was already close): `<h1>` wrapped in `.entry-head` for the
    rule; `← Posts` + date stay in the sticky gutter; `--text-3xl` title. A `description`
    standfirst was previewed and **not** taken (Toby: variant 1).
  - **Project** — the centred logo/title/tagline block is **gone**. Header is now left-aligned:
    the logo sits bare (contain-fit, 3.5rem) inline to the left of a text block (`<h1>`,
    `--text-lg` muted tagline, `.tags` chips, a monospace `.links` row). Stacks below 34rem;
    no-logo projects (read-receipt) render text only. Toby picked layout **"A"** from a
    5-option preview; the frontmatter-record variant **"E"** (framed logo + mono key:value
    record echoing the index hero's photo + frontmatter block) was previewed and rejected.
    Back-link copy `← My Projects` → `← Projects` (the listing's `<h1>` is now "Projects").
  - **New `links` map on the `projects` schema** — `{ source?, npm?, site? }`, all optional.
    Populated for all four projects; **the exact URLs are best-effort and need Toby to
    verify** (esp. the npm package names, and license-cop has no `site` because its js.org
    domain wasn't confirmable from the content).
  - `.tags` chip styling moved from `ProjectListItem`'s scoped `<style>` to a shared
    `global.css` utility (now used by the listing rows _and_ the project detail header).
  - The project logo as a build-time `og:image` was raised and **deferred** to a separate
    follow-up (needs build-time image composition) — noted so it isn't lost.
  - e2e: `generate-license-file.po` gains `tags` / `links` getters + specs; the details
    selector moved `div.details` → `div.entry-head`, image `img` → `img.logo`; back-link
    assertion "My Projects" → "Projects". CI green: lint / `format:check` / `astro check`
    (0 errors) / Playwright chromium.

- **2026-08-31 — Page layouts: `/blog` + `/projects` listing pass (Toby picked variants 1 + 5
  from a preview of 5).** Both pages now open the way an index `.section` does — a firm `--rule`,
  the monospace `# blog` / `# projects` marker in the gutter — then a modest `<h1>` ("Blog" /
  "Projects", copy shortened from "Blog Posts" / "My Projects") and a one-line mono `.summary`
  doing real work instead of a tagline: `10 posts · 2020–2024 · RSS`, `4 projects · all open
source`. New `.listing` / `.listing-head` / `.entry-group` utilities in `global.css`, kept
  separate from `.doc` (which has one page-wide rail; a grouped listing needs a marker per
  group).
  - **`/blog` — grouped by calendar year**, newest first; each year is a mono marker that sticks
    in the gutter while its group scrolls (changelog-margin feel). The **2023 gap is left
    visible** — honest cadence information, and it gives the otherwise-dead gutter a job. Years
    are real data, not `01/02/03` decoration (which the direction forbids). Rejected in the
    preview: a flat list (#3, nothing in the gutter for the whole scroll) and a
    marker-as-heading header with no visible `<h1>` (#2, too quiet at the top on wide screens).
    `BlogListItem` unchanged — rows keep full dates (also keeps the existing time-order e2e
    assertion working).
  - **`/projects` — manifest + tags.** Four projects, no grouping. `ProjectListItem` gains an
    optional `showTags` prop (default off — the index spotlight stays lean); `/projects` opts
    in. `tags: string[]` added to all four project frontmatters as **placeholder values** for
    Toby to retune: `["typescript","cli","licensing"]` (generate-license-file),
    `["typescript","cli","ci"]` (license-cop), `["typescript","next.js","reference"]`
    (which-node-js), `["next.js","docker","privacy"]` (read-receipt).
  - RSS moved from a floating `.icon-button` in the gutter to a text link in the `.summary`
    line (`a.rss`, href `/blog/rss.xml` unchanged).
  - e2e: `blog.po` / `projects.po` gain `yearHeadings` / `tags` getters; new specs for the year
    grouping and per-project tags; `projects.spec`'s `<h1>` assertion updated "My Projects" →
    "Projects". CI green: `bun run lint`, `format:check`, `astro check` (0 errors / 0 warnings,
    76 files), Playwright — chromium 58/58, firefox verified on the changed specs (the full
    firefox run is flaky under the local sandbox, as noted in earlier stages; a real runner
    covers it).

- **2026-08-31 — Icon buttons unified.** The blog RSS link had a transparent background while
  the header menu/theme toggles used `--surface`, so they read as different controls. Pulled the
  shared frame + hover into a `.icon-button` utility in `global.css`; all three now use it (and
  the RSS icon is `--ink` at rest like the others, was `--muted`).

- **2026-08-31 — Dark mode (Toby: yes, with a header toggle).** Reverses the "light only for
  Stage 10" call. A cool near-black dark palette — the light theme's counterpart, not an
  inversion — added to `tokens.css` as `:root[data-theme="dark"]` plus a
  `@media (prefers-color-scheme: dark)` block (guarded `:not([data-theme="light"])`) for
  "system"; the two must stay in sync. Two new tokens: `--rule` (section dividers, so the
  near-white `--ink` hairline doesn't shout on dark) and `--scrim` (mobile-nav overlay).
  **The control** is a single header button (Toby's spec: button that swaps its icon, not a
  switch). It cycles **system → the theme the OS isn't → the theme the OS is (pinned) →
  system**, so the first click always visibly changes something and the OS only sets the
  direction (revised from a fixed system→light→dark, which did nothing on the first click for
  anyone whose OS already matched). The icon is the state — new `monitor` / `sun` / `moon` SVGs
  in `Icon.astro`, same 16-grid / 1.5-stroke system as the rest. Which icon shows is pure CSS
  off `<html data-choice>`. `BaseLayout`'s inline `<head>` script reads
  `localStorage` and stamps `data-theme` + `data-choice` before first paint (no flash);
  `Header.astro`'s script handles the cycle + persistence. Shiki went dual
  (`light-plus` / `dark-plus`). New `e2e/theme.spec.ts` (defaults to system, the cycle,
  persistence across navigation, follows a dark OS, explicit choice beats the OS). CI green —
  lint / `astro check` (0) / Playwright (112).

- **2026-08-31 — Two bugs found while fixing the hover easter egg.**
  - **`.mono` was never defined.** Every element tagged `class="mono"` — the frontmatter record
    (the _signature element_), the nav, the footer, blog dates, project route paths, form labels,
    buttons, "more" links — was silently falling back to Public Sans, not Fira Code. The
    "monospace as UI chrome" layer of the direction simply wasn't rendering. Fixed with a
    one-line `.mono { font-family: var(--f-mono) }` utility in `global.css` (sibling of
    `.eyebrow`). This is a visible change across the whole site, but it's the documented intent
    (Typography section), not a new decision.
  - **Hover feedback loop.** When the cursor approached the frontmatter block from the right, the
    role easter egg spun forever: `mouseenter` → swap to a shorter quip → block narrows → cursor
    is now outside it → `mouseleave` → restore the long title → block widens → `mouseenter` →
    … Fixed by reserving the field's width — an invisible `.role-sizer` span holding the longest
    value ("Senior Software Developer") is stacked under the animated span in one grid cell, so
    swapping the visible text never changes the record's width. Font-agnostic; also stops the
    block twitching during the load-in cycle.

- **2026-08-31 — Hero avatar (Toby picked from 5 previewed options).** The 60px square thumbnail
  from the Index build was too small to actually see the face. Now **96 × 120, 4:5 portrait
  crop, 2px radius, 1px `--border`**, same position as before (top-aligned, left of the
  frontmatter record, `--sp-5` gap) — sized so it height-matches the record and reads as an
  ID photo rather than a favicon. Also reset the `<dl>`'s default margin so the record's first
  row aligns to the avatar's top edge. Options 1/2/4 (80/104/128 square) and 5 (circle) were
  previewed and rejected; circle was flagged as the generic-portfolio move. Supersedes the "small
  60px square thumbnail" note in the Index build entry below.

- **2026-08-31 — Hero role, hover easter egg (Toby's idea).** Once the load-in cycle has
  settled on the real title, hovering the frontmatter block flicks `role` to a random quip;
  mouse-leave snaps it back to "Senior Software Developer". Guardrails added on top of the bare
  idea: armed only after the load-in finishes, mouse-only (`hover: hover` — no touch, no
  keyboard path), never repeats the previous quip, and the `.sr-only` real title is never
  touched (assistive tech is unaffected). Under `prefers-reduced-motion` the swap is instant
  (the global rule zeroes the transition) but still works — it's a response to the reader's own
  hover, not ambient motion. New e2e test + `frontmatter` page-object getter.

- **2026-08-31 — Hero load-in vs `clientPrerender`.** With `prefetch` (`prefetchAll` +
  `viewport`) upgraded to speculation-rules prerendering, arriving at the index from another
  page activated a document that had already been built in the background — the frontmatter /
  lead `settle` animations had run to completion and the role-cycle timer partway, all before
  the page was ever on screen (so the rows/lead didn't animate and the role cycle appeared to
  skip its first entry). `Hero.astro`'s script now holds the whole load-in — rows, lead, role
  cycle — behind `document.prerendering` + the `prerenderingchange` event (a plain no-op on a
  normal load / in non-Chrome), and a `.hero.defer` class freezes the CSS animations until
  activation. Verified: the prerender-activation timeline now matches a cold load exactly.

- **2026-08-31 — Polish pass, round 2 (Toby's second punch-list).**
  - **Nav active state — fixed + widened.** `Astro.url.pathname === href` never matched at build
    (the emitted route is `blog.html`, not `/blog`), so `/projects` + `/blog` had no active
    styling. Now normalises away `.html` / trailing slash and matches the section on its own page
    _and_ its sub-pages (`/blog` stays lit on `/blog/some-post`). `/#contact` still never counts —
    it targets a section, not a route (Toby's point).
  - **`.doc` layout for the non-index pages.** New `.doc` utility = the same gutter grid as
    `.section`. Applied to `/blog`, `/projects`, both detail templates (via the page + `ProseLayout`),
    `/404`, and the policy pages. Their content now lines up with the index body (x≈360→1064 at
    1280px) instead of a narrow flush-left 44rem column — answers "the lists / article prose seem
    to use the old content width". Prose measure itself is unchanged (still `--measure`); it's the
    _position_ that was off. Gutter holds the RSS link / a back-link + date / nothing.
  - **List rows.** `.body` now `flex: 1` so the row fills the column and the arrow pins to a
    consistent right edge (was `justify-content: space-between`, leaving a big gap between a
    short line of text and a far-flung arrow).
  - **Project detail.** Divider + `--sp-8` gap between the centred title/tagline header and the
    prose (Toby: "more margin between tagline and content"); tagline demoted from bold to
    `--muted`.
  - **Index RSS link** now opens in a new tab (`target="_blank"`), matching the github/linkedin
    links beside it.
  - CI: lint / `astro check` (0) / Playwright (100, both browsers) green.

- **2026-08-31 — Polish pass (Toby's punch-list against the first real preview).** A round of
  quality fixes on the Index + the global shell; several reverse earlier token decisions, all
  because the earlier call didn't survive contact with real content. Body sections above and
  the token files updated to match.
  - **Links — resting underline.** Body / nav / footer links now carry a quiet 1px `--underline`
    (`#b9bfc7`) underline at rest, thickening to 2px `--accent` on hover/focus. Reverses
    "ink-only at rest, underline draws in on hover" — at rest a link was _indistinguishable_
    from body text (fails "not by colour alone", and just bad usability). New `--underline`
    token; `.text-link` utility + `.prose a` carry it.
  - **Wider shell + left label gutter.** New tokens `--shell` 60rem and `--gutter` 9rem. The
    hero sits flush at the shell's left edge; every `.section` is a two-track grid on ≥960px —
    monospace `# label` sticky in the gutter, body at `--measure` — collapsing to label-above-body
    below that. Reverses "44rem for everything, single-column at every width, one 640px
    breakpoint": the page read as very narrow, and the gutter makes direction 1's
    "metadata in the margin, content as named exports" literal rather than implied.
  - **Section markers promoted.** `.eyebrow` is `--text-xl` mono ink on narrow (a real section
    heading) / `--text-sm` in the gutter on wide, and every section opens with a 1px `--ink`
    rule. Reverses `--text-xs` muted everywhere — answers "are the section headers meant to be
    this tiny" and "hard to tell where one section stops". List-item titles dropped `--text-xl`
    → `--text-lg` and Prose `h3` likewise, so the hierarchy isn't inverted.
  - **Icon set.** New `src/components/Icon.astro` (see Other primitives). Every unicode glyph
    doing an icon's job is gone (`→`, `×`); `chevron-left.svg` / `rss.svg` deleted.
  - **Footer pinned.** `<Footer/>` moved out of `<main>` so it sits at the viewport bottom on
    short pages (404, policy stubs). Was a real bug.
  - **Mobile nav — real bug + redesign.** The toggle button and the desktop links _both_
    rendered at every width (the `.menu-toggle` `display` rule beat the `.mobile-only` helper on
    source order). Replaced the `.desktop-only`/`.mobile-only` helpers with media queries on the
    elements themselves. Drawer rebuilt: `# menu` header + icon close button, full-width link
    rows with active state, a github/linkedin/rss footer, Esc-to-close, body scroll lock, and a
    dedicated "Open menu" button (open/close state split so the toggle's label is honest).
  - **Hero.** The lead line now joins the frontmatter settle (staggered after the rows); the
    role-swap gains a small vertical nudge; `sharp edges` emphasis is now plain ink — a resting
    `--accent` in the hero contradicted the interactive-only rule and read as a broken link.
  - **Contact form.** Widened to `--measure`; real 2-column name/email that stacks under 34rem;
    message full-width; submit button larger with an `arrow-right` icon.
  - **Deferred pages, mechanical only:** `/blog` + `/projects` listings constrained to
    `--measure` with a sized `h1` and the RSS glyph swapped for `Icon`; `/404` rebuilt to match
    the site (left-aligned, `# 404` marker, icon back-link); blog/project detail back-links use
    `Icon` + a `--measure` column. Full layout passes for these still pending.
  - CI: lint / `astro check` (0) / Playwright (100 pass, both browsers) green. `e2e/index.spec.ts`
    contact-copy assertion updated for the reworded intro line.

- **2026-08-30 — Build:** the Index page (build-sequence steps 1–4: tokens/global styles, layout
  shell, Prose system, Index itself) implemented in `src/`, per Toby's go-ahead to restructure
  freely rather than shoehorn the redesign into the existing components. Notable calls made along
  the way, none asked about individually since they followed directly from confirmed
  direction/tokens:
  - Centralised every design token into `src/styles/tokens.css` + shared resets/utilities into
    `src/styles/global.css` (`.wrap`, `.eyebrow`, `.sr-only`) — replaces the old scattered
    `--primary`/`--primary-light`/`--primary-very-light` custom properties and each component
    redeclaring its own max-width/centring.
  - Deleted `HeaderMenuItem.astro` and `HR.astro` — both fully superseded (nav links render
    directly in `Header.astro`; list-item dividers are CSS borders now, not a component).
  - Dropped the footer's "invisible until hovered" treatment and gave the mobile-nav drawer a
    visible close button — both were minor accessibility/discoverability debts in the old design,
    fixed in passing rather than carried forward.
  - **Hero's rotating job title**: kept the joke, but changed it from an infinite 3s loop to a
    one-shot cycle that plays once on load (as an extension of the frontmatter's settle-in
    moment) and lands permanently on "Senior Software Developer" - the old design never actually
    said the real title anywhere. Infinite looping ambient motion is exactly what the Motion
    tokens ruled out; ending on the real title makes the front page state something true at rest,
    not just at random points in a loop. A visually-hidden span carries the real title throughout
    so screen readers never see the animated placeholder text. Not asked about individually since
    it's a direct application of the already-confirmed motion tokens - flagging here in case
    Toby wants the joke back as an infinite loop regardless.
  - **Profile photo**: kept (the direction-1 previews had omitted it only for mockup speed, not
    as a decision) but demoted from a large circular avatar with a heavy accent border to a small
    (60px) square thumbnail inside the identity block, `--radius`, 1px `--border` - fits the
    "quiet, precise" primitives instead of the old "generic portfolio hero photo" look.
  - **Project logos dropped from the shared list-item component** (`ProjectListItem.astro`), so
    both the index spotlight and the standalone `/projects` listing are text-first now, matching
    what was already shown and unobjected-to in the direction previews. The `/projects/[slug]`
    detail page is untouched and still shows the full logo.
  - **List-item heading level**: started at `h3` (correct nesting under each section's `h2`
    eyebrow) but reverted to `h2` - `/projects`' own e2e spec asserted list items are `h2`, and
    matching the old markup's flat-h2 pattern (standard and accessible - AT reads heading levels
    literally, not the unimplemented HTML5 outline algorithm) avoided a real regression on pages
    this round doesn't otherwise touch.
  - **Real bug found and fixed, unrelated to styling taste**: the mobile-nav drawer was painting
    _behind_ the page's own content instead of over it (confirmed via screenshot - the hero text
    showed through the "opaque" white drawer) because it relied on default stacking order with no
    explicit `z-index`. Fixed with `z-index: 100` on the overlay. Verified before/after with
    Playwright screenshots at multiple wait times to rule out an animation-timing red herring.
  - e2e updated alongside: `e2e/index.spec.ts` + `index.po.ts` rewritten for the new markup (h1 is
    now the lead line, `#tag` → `#role-cycle` with new one-shot timing, added a reduced-motion
    test and an always-correct accessible-name test, `img.profile-pic` → `img.avatar`). Full local
    CI green: lint, format, `astro check`, and the full Playwright suite (both chromium and
    firefox where noted).

- **2026-08-30 — Tokens:** confirmed, with one change. Card/item title hover (project + blog list
  items) gets an underline fading in alongside the colour shift, not colour alone — matches
  `tokens-specimen.html`'s body-link treatment more closely and keeps the hover affordance from
  being colour-only. Applied to `tokens-specimen.html` and both direction-1 previews
  (1a/1b `.item h3:hover`). Rest of the token proposal (type scale, palette, space, motion,
  primitives) confirmed as proposed.
- **2026-08-30 — Tokens:** full token proposal built as a throwaway specimen page,
  `tokens-specimen.html` in Toby's scratchpad (same folder as the direction previews) — type
  scale, weights, measure, link/hover treatment, an 8-role colour palette, the 4px space scale,
  the motion system (one load-in settle, no scroll reveals, full reduced-motion kill), and
  primitives (2px radius, no shadows). Concrete values are in the Design tokens section above.
  Deliberately covered all five token subsections in one pass rather than five separate rounds,
  since direction + the two prior decisions already fixed most of the inputs (palette neutrals
  and the three typefaces were already visible in the direction-1 previews). **Not yet reviewed
  by Toby** — treat the Design tokens section as a proposal until confirmed.
- **2026-08-30 — IA:** index spotlights are driven by an editorial `featured: boolean`, not a
  fixed card count. Projects already have this field (Stage 6); blog posts get the same field
  added to `src/content.config.ts`'s `blog` schema, and `Index/BlogSpotlight.astro` switches from
  `SPOTLIGHT_COUNT`-sliced recency to filtering on `featured` — mirroring
  `Index/ProjectsSpotlight.astro` exactly. No hard cap on how many can show; if that becomes a
  real problem once posts are marked, revisit then rather than pre-guessing a limit. Toby's call,
  replaces the "2 vs 3" framing entirely.
- **2026-08-30 — IA:** per-post `featured` picks made — "the top two of each for now" (Toby's
  words; revisitable, not treated as final curation). **Blog:** `100-my-deployments-in-2024` and
  `90-reverse-flex-directions` — the two highest `sortWeight`/most recent by `date`, confirmed
  those agree for every post (checked all 10, `sortWeight` order matches `date` order exactly).
  **Projects:** kept the existing Stage 6 picks, `read-receipt` and `generate-license-file`,
  rather than switching to the top two by `sortWeight` (`generate-license-file` and
  `license-cop`) — flagging this explicitly since "top two" is ambiguous for projects:
  `sortWeight` there is a manual display-order field, not a recency signal (unlike blog, where it
  tracks `date`), and Stage 6's choice of `read-receipt`/`generate-license-file` over
  `license-cop`/`which-node-js` was a deliberate editorial call, not a by-product of sort order —
  silently reversing it on a loose "top two" reading felt like the wrong default. Say the word if
  you actually meant the `sortWeight`-order pair instead.
- **2026-08-30 — Direction:** frontmatter block stays **inline at the top of the hero**, not a
  sticky left rail. Both were previewed (1a inline vs 1b sticky rail); Toby preferred 1a. Keeps
  every page's layout simpler (no persistent rail to account for on narrow content pages like
  policies) at the cost of the metadata not staying visible while scrolling.
- **2026-08-30 — Direction:** confirmed **pure direction 1** — "Public API" is the committed base
  to refine within, not a blend with "Field notes"/"Release". Nothing borrowed across directions.
- **2026-08-30 — Direction:** three directions brainstormed and shown as throwaway HTML previews
  in Toby's scratchpad ("Public API" — frontmatter metadata block, mono-as-UI-chrome; "Field
  notes" — warm paper, margin-column marginalia; "Release" — chronological spine, version/date
  chips). Toby chose **"Public API"** as the base to work towards; the other two are parked, not
  deleted, in case an element of them is worth borrowing later. A fourth option, a full
  fake-terminal/REPL, was rejected pre-preview as the on-the-nose cliché for a CLI-tool author.
- **2026-08-30 — Typography:** Fira Code kept as the mono face for all code snippets. Toby's call;
  not up for reconsideration.
- **2026-08-30 — Colour:** dodger-blue stays in the palette but is no longer required to be the
  loud primary — free to make it a subtler, more selective accent. Toby's call.
- **2026-08-30 — Process:** redesign.md created; structure and decision sequencing agreed
  (direction → tokens → layouts → components → copy). No design decisions made yet.
