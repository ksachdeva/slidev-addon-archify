---
name: slidev-archify
description: Author presenter-led or self-guided developer decks, interactive architecture walkthroughs, embedded explainers, and optional animated SVG preview thumbnails by combining Slidev and Archify. Use when creating or updating Slidev decks with Archify stories, viewers, semantic diffs, or explainers.
---

# Developer Decks with Slidev + Archify

Build **presenter-led, self-guided, or hybrid developer decks** by combining **Archify** (compiled architecture diagrams, multi-view stories, semantic diffs, and interactive explainers) with **Slidev** (interactive Vue-powered slide decks). The same components work for live talks and decks people explore on their own.

## Core Principles

- **Write for how the deck will be used:** For a live talk, keep on-screen text concise and let the presenter supply context and advance the beats. For a self-guided deck, make navigation discoverable and put essential context on-screen. For a hybrid deck, keep the slides readable on their own and use presenter notes for extra live commentary.
- **Clean separation of responsibilities:**
  - **Archify** owns diagram IR, orthogonal layout, routing, motion, semantic diffs, source-line verification, and explainers.
  - **Slidev / Vue** owns slide layout, click synchronization (`$clicks`), optional sidebars, and integration with native Slidev components (Shiki code blocks, cards, layouts).
  - Never re-render Archify IR in Vue—embed Archify's compiled same-origin HTML artifacts via `slidev-addon-archify`.

## Skill Delegation

The **`archify`** and **`slidev`** skills are required for this authoring workflow. Confirm both are available to the agent before starting. If either is missing, point the user to the [installation instructions](https://github.com/ksachdeva/slidev-addon-archify#optional-install-the-agent-skill) rather than guessing at Archify IR or Slidev syntax.

1. **Invoke the `archify` skill** for the Archify CLI (`bin/archify.mjs`), authoritative IR schemas, validation, rendering, story compilation, compare diffs, SVG export, and explainer authoring.
2. **Invoke the `slidev` skill** for all Slidev Markdown syntax, frontmatter, layouts, themes, clicks, Shiki code highlighting, UnoCSS/styling, Vue integration, routing, and build configuration.
3. **Use `slidev-archify`** for the **combined Slidev + Archify experience**: choosing the right artifact format, choreographing clear visual beats, wiring the addon's components, and optionally emitting static+animated SVG preview thumbnails.

## Install and Register the Addon

When editing a deck, find its Slidev project and main entry Markdown file (usually `slides.md`). If `slidev-addon-archify` is not already in that project's `package.json`, add it as a dev dependency with the project's package manager so the lockfile is updated too:

```sh
pnpm add -D slidev-addon-archify
# Or, for an npm project:
npm install -D slidev-addon-archify
```

When giving advice rather than making edits, show the matching install command and the frontmatter change instead. Register the package in the first frontmatter block of the main deck, preserving existing settings and addon entries. If the deck already uses a local path to this addon, replace that entry rather than listing both:

```yaml
---
addons:
  - slidev-addon-archify
---
```

Slidev discovers the components automatically. Do not copy Vue files into the deck or add explicit imports for the addon's components. If the deck has local components of the same name, check for customizations before migrating; do not discard them silently. The addon does not generate diagram HTML: place the compiled files in the deck's `public/diagrams/` as described below.

## Choose the Right Artifact

| Reader need | Artifact & pattern |
| --- | --- |
| Guided, click-by-click architecture concept (default visual story) | **Slidev full-bleed Story:** `layout: full` + `<ArchifyStory full-bleed />` (leave `loop-by-default` off on morph stories) |
| Guided concept that needs extra written invariants, snippets, or direct step-jump tabs *(optional)* | **Slidev split slide:** `layout: full` + `flex` container pairing `<ArchifyStory fill hide-loop />` with `<StorySidePanel width="260px" />` (or a custom Vue sidebar)—use only when requested or when the concept genuinely benefits from side-panel context |
| Live hover Intent Trace or before/after semantic architecture diff | **Slidev Viewer slide:** `layout: full` + `<ArchifyViewer />` over `archify render` or `archify compare architecture` |
| Diagram synchronized with native Slidev UI (Shiki code, custom Vue cards) | **Side-by-side Slidev slide:** standard grid sharing `$clicks` between `<ArchifyStory />` and Slidev/Vue components |
| Long-form, scrollable ADR, postmortem, runbook, or comparison doc | **Archify Explainer (`*.archify.md`):** compiled with `archify finalize explainer`, embedded inside a `layout: full` Slidev slide via `<ArchifyExplainer />` (light theme default, white-labeled, no user toggles) or linked standalone |
| Multi-level clickable drill-down (`Overview → Platform → API`) | **Standalone Viewer link** outside Slidev (keeps browser Back and full Viewer toolbar without Slidev arrow conflicts) |
| Preview thumbnail for a card grid or deck index *(optional)* | **Static + zero-JS animated SVG pair** (`export-svg --animate-flow` or `story svg --still`) swapped on card hover |

## Addon Components

- `ArchifyStory` — Click-driven Story Stage (`<name>.stage.html`), with `full-bleed`, `fill`, `hide-loop`, `loop-by-default`, and **R** to replay the current beat.
- `ArchifyViewer` — Interactive diagram or architecture delta (`<name>.html`), with Left/Right arrow events you can wire to Slidev navigation.
- `ArchifyExplainer` — Scrollable explainer (`<name>.explainer.html`) with **Step through**, interactive checklists, and configurable branding and controls.
- `StorySidePanel` — **Optional** beat guide with captions, jump tabs, and Prev/Next controls. It takes a `beats` array rather than an HTML file. Include it only when requested or when it adds useful context beyond the story captions.

## Reference Guides & Examples (Read as Needed)

- **Choreography, spotlighting, morphs, and code panels:** [Archify Choreography Rules](./references/archify-choreography-rules.md)
- **Embedding wrappers, layouts, and deck build scripts:** [Slidev Composition & Build](./references/slidev-composition.md)
- **Explainers (`ArchifyExplainer.vue`) & collection card SVGs:** [Explainers & Collection Cards](./references/explainers-and-cards.md)
- **Archify artifact authoring:** Use the Type router in the installed `archify` skill to pick a native example from its `examples/` directory. For stories and explainers, use its `references/story-authoring.md` and `references/explainer-authoring.md`.
- **End-to-end Slidev integration:** See the [addon README](https://github.com/ksachdeva/slidev-addon-archify#use-the-components) and [showcase deck source](https://github.com/ksachdeva/slidev-addon-archify/blob/main/showcase/slides.md). The showcase uses a local addon path to exercise this repository's checkout; use the npm package name in consumer decks.

## Verification Before Finishing a Deck

1. Validate every story with `archify story validate <story.story.json> --repo-root <repo-root> --json` (must return `"ok": true`).
2. Validate any `compare` delta or standalone explainer with `archify compare architecture ... --quality showcase --json` or `archify finalize explainer ... --json`.
3. Regenerate `public/diagrams/` and run the deck's production build (`npm run build`, and any theme variants).
4. Spot-check in a browser: no autoplay on slide entry, no faded active trace arrows, clean transitions without distorted morphs, crisp code-line highlights, and working click/arrow navigation.
