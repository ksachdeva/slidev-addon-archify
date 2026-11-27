# Archify Choreography & Authoring Rules

Follow the `archify` skill for IR schemas and CLI commands. Use these guardrails to keep each visual beat clear, whether a presenter advances it during a talk or a reader explores it independently.

## 1. Direct Attention Explicitly on Every Beat

`trace` animates moving tokens along edges, but it **does not dim unrelated nodes or edges**. On dense diagrams, full-brightness background boxes compete with the active flow.

- **Progressive reveal (`enter` + `connect`):** Start with only the opening path visible, and stagger-reveal later subsystems and edges on the beat where they become relevant.
- **Dim finished branches (`fade`):** Fade unrelated or already-explained nodes and edges to `0.16–0.22` so the active path owns the screen.
- **Camera spotlight (`focus`):** Use `focus: ["a", "b"]` or `focus: { nodes: ["a", "b"], area: "left" }` (paired with `detail` code panels) to frame the active subsystem.

## 2. `fade` Is One-Way Per View

In Archify's SVG compiler (`applyFadeOps`), each `fade` emits a CSS opacity track from `1` to `op.to` held until the end of the story. Adding a second `fade` with `to: 1` on the same node or edge in the same view does **not** reliably restore it—later traces will run over dimmed arrows.

- **Rule:** Never fade a node or edge that a later beat in the same view still needs.
- **Pattern:** Use `enter` + `connect` to keep later elements off-screen until their beat, and `fade` only after you are finished with an element in that view.

## 3. Morph Only on Genuine Component Identity

`transition.shared` looks impressive only when the **same services/components** glide into a new structural arrangement:

- **Good morphs:** `architecture` → `dataflow`, `architecture` → `sequence`, `sequence` → `architecture`, or `architecture (before)` → `architecture (after)`.
- **Avoid:** Stretching service cards into horizontal `waterfall` timing bars or bars into `lifecycle` state nodes. When switching analytical lenses (`dataflow` → `waterfall` → `lifecycle` → `architecture`), omit `transition` for a crisp view cut.

## 4. Pinned Multi-Click Code Spotlights (`details` + `selections`)

To walk a developer through real repository code across multiple Slidev clicks without the code panel blinking closed between beats:

1. Declare a **top-level `details` entry** (not per-step `detail`) whose `start`..`end` spans all consecutive beats for that file.
2. Provide up to 20 verified 1-based line numbers in `lines`.
3. Align `selections: [{ "at": <step.at>, "lines": [...] }, ...]` with each beat's timestamp so the highlight band glides smoothly (`0.45 s` crossfade) on every click while the code panel stays rock-steady.
4. Always pass `--repo-root <path>` to `archify story validate` and `archify story stage` so every cited path and line number is verified against the repository.

## 5. Layout, Routing & Schema Gotchas

- **Orthogonal routing:** Let Archify's automatic orthogonal router plan `architecture` edges; avoid hand-coding non-perpendicular `via` coordinates (which trigger `clean-flow/endpoint-side-direction` and `composition/label-route-clearance` errors in `showcase` mode).
- **Dataflow fan-outs:** Set explicit `fromSide`/`toSide` (`top`/`bottom`) on branching flows and `route: "straight"` on the center spine to keep label clearance clean.
- **Sequence messages:** Start the first message at `y >= 160` (`schema/minimum` clears participant headers).
- **Change highlights in Story views:** Do not put `changeStatus` on standalone `architecture` IR (rejected by `additionalProperties: false`). Use view `callouts` (`tone: "added" | "modified" | "removed"`) plus node `emphasis` / `tag`, or use `archify compare architecture` for true semantic diffs.
- **Visual presets:** `"classic"`, `"signal-flow"`, `"blueprint"`, and `"editorial"` are purely styling choices—swap via `"preset"` in `.story.json` without changing IR or choreography.
- **Beat timing:** `ArchifyStory.vue` stops each beat `0.65 s` before the next step's `at` (or story end) so captions never fade out while reading. Leave at least `3.5–5.0 s` per animated beat so traces finish before the hold point.

## Authoring References

Use `references/story-authoring.md` in the installed `archify` skill for the story schema and multi-view authoring. For a small example wired to Slidev clicks, see the [showcase fan-out story](https://github.com/ksachdeva/slidev-addon-archify/blob/main/showcase/diagrams/agent-turn-fanout.story.json).
