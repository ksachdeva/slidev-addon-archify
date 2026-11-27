# Standalone Explainers & Collection Card Previews

Not every Knowledge Hub concept belongs inside a 16:9 Slidev deck, and every deck in an outer workspace collection needs a crisp visual preview card.

## 1. Standalone Interactive Explainers (`*.archify.md`)

Use Archify's `explainer` type (via the `archify` skill) when a concept is better read as a **scrollable, answer-first engineering page**—such as an ADR, incident postmortem, design comparison, or pre-ship runbook.

- Author in compact Markdown (`<topic>.archify.md`). Follow `references/explainer-authoring.md` in the installed `archify` skill for the format, or see the [showcase explainer source](https://github.com/ksachdeva/slidev-addon-archify/blob/main/showcase/diagrams/agent-turn-latency.archify.md) for a complete example. Use:
  - Direct conclusion + up to 4 reasons + `@answer scope="..."`.
  - Embedded native diagrams (`@sequence`, `@architecture`, `@workflow`, `@tree`, `@timeline`, `@erd`) paired with `@steps` beside the sticky diagram.
  - Verdict comparison tables (`{good:…}`, `{caution:…}`, `{bad:…}`).
  - Interactive developer checklists (`- [ ] ...`) that readers can tick on the page.
  - Optional `@code` / `@diff` blocks verified via `--repo-root`.
- Compile to one zero-server HTML page using the CLI resolved by the installed **`archify` skill**:
  ```sh
  <archify-cli> finalize explainer <topic>.archify.md public/diagrams/<name>.explainer.html --json --no-update-notice
  ```
- **Uniform Slidev embedding (`ArchifyExplainer.vue`):** Embed the compiled explainer inside a `layout: full` Slidev slide so stories, interactive viewers, and one-page explainers share one uniform deck experience:
  ```md
  ---
  layout: full
  title: "Explainer: Checkout Retry Storm"
  ---

  <ArchifyExplainer name="checkout-retry-storm" title="Checkout Retry Storm Explainer" @previous="$nav.prev()" @next="$nav.next()" />
  ```
  - Defaults: **`theme="light"`**, `style-preset="clean"`, **no user-facing toggle bar**.
  - White-labeling via same-origin `@load` CSS injection (using `.js`-prefixed selectors to beat Archify's `.js .interactive { display: initial !important }` rule): hides `.colophon` (Archify branding/footer), `.theme-controls`, `.style-menu`, `.export-menu` (collapsing `.masthead .tools`), `.ask-button, .ask-floating` (Archify's agent-revision prompt button), and `.explore-button` (`Open interactive view`) by default, while keeping `.walk-start` (`▶ Step through`), hover spotlighting, interactive checklists, and step-link click-to-open-modal live. All flags (`theme`, `style-preset`, `hide-branding`, `hide-theme-toggle`, `hide-style-menu`, `hide-export`, `hide-ask`, `hide-explore`, `hide-walk`, `allow-diagram-modal`) are author-time props—pass `:allow-diagram-modal="false"` to keep step hover spotlighting while preventing clicks from opening the interactive Viewer modal.
  - Can also be linked directly as a standalone HTML page if needed.

## 2. Static + Zero-JS Animated SVG Card Previews

For cards inside your outer collection/workspace portal, use the **"still at rest, alive on hover"** pattern with plain `<img>` tags (no `<iframe>`, no JS runtime, automatic `prefers-reduced-motion: reduce` support):

- **At rest:** Display the static SVG so a grid of 10–20 cards stays calm and uses zero animation CPU.
- **On card hover/focus:** Swap or crossfade to the zero-JS animated SVG so the hovered concept comes alive.

### Which Archify command to use

1. **Clean, caption-free card thumbnails (`export-svg`):** Best for small (280–360 px) collection cards.
   ```sh
   # Static resting thumbnail
   <archify-cli> export-svg dataflow <ir>.dataflow.json <out>-still.svg --theme dark --quality showcase
   # Animated hover thumbnail (zero-JS flowing edge pulses)
   <archify-cli> export-svg dataflow <ir>.dataflow.json <out>-animated.svg --theme dark --animate-flow --quality showcase
   ```
   *Important:* `export-svg --animate-flow` adds flowing pulses on flow-pulse diagram types (`dataflow`, `sequence`, etc.). Plain `architecture` exports stay static (`animated: false`).

2. **Animated `architecture` or multi-view Story thumbnails (`story svg --still`):**
   ```sh
   <archify-cli> story svg <story>.story.json <out>.svg --theme dark --still --repo-root <repo-root>
   ```
   Emits both a Camo-safe, zero-JS animated `<out>.svg` and a matching static `<out>.still.svg` (use `--theme both` if your portal supports light and dark modes).
