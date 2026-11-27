---
theme: default
title: Inside an AI Agent Turn
addons:
  - '@/..'
fonts:
  provider: none
---

# Inside an AI Agent Turn

An interactive showcase for `slidev-addon-archify`: compare two agent architectures, then explore how work fans out, how a turn changes state, and where the time goes.

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
