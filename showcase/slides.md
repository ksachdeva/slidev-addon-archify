---
theme: default
title: Inside an AI Agent Turn
addons:
  - '@/..'
fonts:
  provider: none
---

# Inside an AI Agent Turn

An interactive showcase for `slidev-addon-archify`. Explore how an agent handles a request and try three ways to present it:

- <Link to="2">Interactive diagrams</Link> — compare architectures and inspect the turn.
- <Link to="7">Click-driven story</Link> — follow the fan-out with a clickable beat guide.
- <Link to="8">Scrollable explainer</Link> — step through the critical path.

---
layout: full
---

<ArchifyViewer name="agent-turn-baseline" title="AI Agent Runtime — Baseline" @next="$nav.next()" @previous="$nav.prev()" />

---
layout: full
---

<ArchifyViewer name="agent-turn-optimized" title="AI Agent Runtime — Optimized" @next="$nav.next()" @previous="$nav.prev()" />

---
layout: full
---

<ArchifyViewer name="agent-turn-fanout" title="Parallel Context & Tool Assembly" @next="$nav.next()" @previous="$nav.prev()" />

---
layout: full
---

<ArchifyViewer name="agent-turn-states" title="Agent Turn State Machine" @next="$nav.next()" @previous="$nav.prev()" />

---
layout: full
---

<ArchifyViewer name="agent-turn-latency" title="Where did 2.4 seconds go?" @next="$nav.next()" @previous="$nav.prev()" />

---
layout: full
title: From fan-out to grounded answer
clicks: 2
---

<div class="absolute inset-0 flex">
  <div class="h-full min-w-0 flex-1">
    <ArchifyStory
      name="agent-turn-fanout"
      title="From fan-out to grounded answer"
      :step="$clicks"
      :active="$page === $nav.currentPage"
      fill
      hide-loop
    />
  </div>
  <StorySidePanel
    topic="Agent turn fan-out"
    :step="$clicks"
    :beats="[
      { tag: '01', title: 'See the whole turn', summary: 'Use the numbered tabs or press Right Arrow to follow the request.' },
      { tag: '02', title: 'Start three branches', summary: 'Memory, retrieval, and tool execution start together.' },
      { tag: '03', title: 'Join before synthesis', summary: 'The context builder combines memory, retrieved chunks, and sanitized tool output.' },
    ]"
    @select="(index) => $nav.go($page, index)"
    @prev="$nav.prev()"
    @next="$nav.next()"
  />
</div>

---
layout: full
title: What holds up the agent's answer?
---

<ArchifyExplainer
  name="agent-turn-latency"
  title="What holds up the agent's answer?"
  @next="$nav.next()"
  @previous="$nav.prev()"
/>
