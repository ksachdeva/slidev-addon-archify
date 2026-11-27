# Slidev Composition & Build Pipeline

Follow the `slidev` skill for all Slidev syntax, layouts, themes, and configuration. These patterns assume the deck has installed `slidev-addon-archify` and registered it in its [headmatter](../SKILL.md#install-and-register-the-addon).

## 1. `ArchifyStory.vue` Contract

Serves `public/diagrams/<name>.stage.html` on the **same origin** as Slidev.

- **Click count:** The opening overview is click `0`. Always set frontmatter `clicks: <steps.length - 1>`.
- **Three sizing modes:**
  1. **Centered (default):** Omit `full-bleed` and `fill` — renders `width: min(100%, 700px); aspect-ratio: 16 / 9;` for standard padded slides or side-by-side grids.
  2. **Full-bleed (`full-bleed`):** Use with `layout: full` for an edge-to-edge Story slide (`position: absolute; inset: 0;`). Put the slide title in frontmatter instead of a Markdown heading.
  3. **Container-fill (`fill`):** Use with `layout: full` inside a split grid (e.g. `grid-cols-[1fr_255px]`) so the iframe fills 100% × 100% of its grid cell (`width: 100%; height: 100vh;` on `.stage-pane > svg`).
- **Looping & morphs:**
  - Leave `loop-by-default` **off** on multi-view morph stories. Looping seeks back to `steps[index].at`, repeatedly re-running the cross-view morph.
  - Pass `hide-loop` on split slides where a clean diagram canvas is preferred (**R** still replays the current beat).
- **Code-highlight visibility:** `ArchifyStory.vue` boosts `.stage-pane [id^="story-source-hl"]` from Archify's default `fill-opacity="0.1"` to `0.3 !important` so moving `selections` highlights stand out clearly on dark slides.

## 2. Optional Split Layout (`StorySidePanel.vue`)

Use a side panel **only when requested or when a slide genuinely needs extra written context** (invariants, runbook links, snippets, direct step-jump tabs) beyond Story captions—it is **not** required for every deck. Use a `flex` container so `StorySidePanel`'s `width` prop (default `260px`) sizes the sidebar while `<ArchifyStory fill />` takes all remaining space:

```md
---
clicks: 6
layout: full
title: "Checkout Evolution"
---

<div class="absolute inset-0 flex">
  <div class="flex-1 h-full min-w-0 min-h-0">
    <ArchifyStory
      name="architecture-evolution"
      title="Zero-Downtime Architecture Evolution"
      :step="$clicks"
      :active="$page === $nav.currentPage"
      fill
      hide-loop
    />
  </div>
  <StorySidePanel
    topic="Checkout Evolution"
    width="260px"
    :step="$clicks"
    :beats="[...]"
    @select="(i) => $nav.go($page, i)"
    @prev="$nav.prev()"
    @next="$nav.next()"
  />
</div>
```

- Any interactive button in a custom sidebar (`StorySidePanel` or future replacements) **must blur pointer-acquired focus** (`if (event.detail > 0) event.currentTarget.blur()`) so Slidev does not suppress Left/Right Arrow navigation.

## 3. `ArchifyViewer.vue` Contract

Serves `public/diagrams/<name>.html?theme=dark&present=1` on the same origin.

- **Standard Viewer (`archify render`):** Hides standalone toolbar/cards/outline chrome while keeping live hover Intent Trace and click-to-focus active. Bridges unmodified Left/Right Arrow presses back to Slidev via `@previous="$nav.prev()"` and `@next="$nav.next()"`.
- **Architecture Delta Viewer (`archify compare architecture`):** Automatically detected via `main.proof-page section.canvas[data-view="delta"] > svg`. Hides utility buttons (`Export SVG`, `Share Card`, `Preset`, `Theme`) while keeping the **Before | Delta | After** tabs, `+ ADD / − DEL / ~ MOD / ↔ MOVE` legend, and **Overview / Review** change stepper interactive.
- **Avoid multi-level drill-down inside Slidev:** `allow-drilldown` exists for reference, but nested iframe drill-down introduces hidden click targets, Back-navigation conflicts with Slidev's Left Arrow, and toolbar clutter. Link multi-level drill-down graphs as standalone pages from the outer Knowledge Hub instead.

## 4. Deck Generation Script (`generate-diagrams.mjs`)

Keep the Archify sources in Git. Generate the HTML in `public/diagrams/` before building or previewing the deck if the files aren't already there. Follow the project's convention: either commit the generated HTML so builds don't require Archify, or regenerate it as part of the dev/build pipeline.

Resolve the Archify CLI binary via the installed **`archify` skill** (or an explicit `ARCHIFY_CLI` environment variable / installed skill path)—do **not** hardcode a relative path to an Archify repo checkout:

- **Stories:** `<archify-cli> story stage <story.json> public/diagrams/<name>.stage.html --theme dark --repo-root <repo-root>`
- **Native Viewers:** `<archify-cli> render <type> <ir.json> public/diagrams/<name>.html --quality showcase`
- **Semantic Diffs:** `<archify-cli> compare architecture <base.json> <head.json> public/diagrams/<name>.html --quality showcase`
- **Explainers:** `<archify-cli> finalize explainer <topic>.archify.md public/diagrams/<name>.explainer.html --no-update-notice` (clean up the `*.finalize*.json` receipts from `public/diagrams/` if not needed)

For a working example that validates artifacts before copying the HTML into the deck, see the [showcase generator](https://github.com/ksachdeva/slidev-addon-archify/blob/main/showcase/generate-diagrams.mjs).

## 5. Multi-Repo / Multi-Deck Scaling

For independent decks across teams and repos:
- Give concept slides stable frontmatter `routeAlias` slugs so outer portal links survive slide reordering.
- Build each deck with its own `--base /<repo>/<deck>/` path.
- Install and register `slidev-addon-archify` in each deck that uses its components. Share any custom portal components separately if needed.
- Note on Slidev `setup/routes.ts`: if adding custom deck routes, prepend them **before** `...routes` because Slidev's built-in `/:no` and `/:pathMatch(.*)*` wildcards otherwise intercept them.
