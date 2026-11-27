<script setup>
import { computed } from 'vue'

const props = defineProps({
  topic: { type: String, required: true },
  step: { type: Number, required: true },
  beats: { type: Array, required: true },
  width: { type: String, default: '260px' },
})

const emit = defineEmits(['select', 'prev', 'next'])
const currentIndex = computed(() => Math.max(0, Math.min(props.step, props.beats.length - 1)))
const current = computed(() => props.beats[currentIndex.value])

function onSelect(index, event) {
  emit('select', index)
  if (event.detail > 0) event.currentTarget.blur()
}

function onNav(dir, event) {
  emit(dir)
  if (event.detail > 0) event.currentTarget.blur()
}
</script>

<template>
  <aside class="side-panel" :style="{ width }" aria-label="Slide beat guide">
    <header class="panel-header">
      <div class="panel-eyebrow">{{ topic }}</div>
      <div class="panel-progress">{{ currentIndex + 1 }} / {{ beats.length }}</div>
    </header>

    <nav class="panel-tabs" aria-label="Jump to beat">
      <button
        v-for="(beat, index) in beats"
        :key="beat.tag"
        type="button"
        class="panel-tab"
        :class="{ active: index === currentIndex, visited: index < currentIndex }"
        :aria-current="index === currentIndex ? 'step' : undefined"
        @click="onSelect(index, $event)"
      >
        {{ String(index + 1).padStart(2, '0') }}
      </button>
    </nav>

    <div class="panel-body">
      <div class="panel-tag">{{ current.tag }}</div>
      <h2 class="panel-title">{{ current.title }}</h2>
      <p class="panel-summary">{{ current.summary }}</p>

      <div v-if="current.invariants?.length" class="panel-section">
        <div class="panel-label">Key invariants &amp; gotchas</div>
        <ul class="panel-list">
          <li v-for="item in current.invariants" :key="item">{{ item }}</li>
        </ul>
      </div>

      <pre v-if="current.snippet" class="panel-code"><code>{{ current.snippet }}</code></pre>

      <div v-if="current.meta?.length" class="panel-meta">
        <span v-for="chip in current.meta" :key="chip" class="panel-chip">{{ chip }}</span>
      </div>
    </div>

    <footer class="panel-footer">
      <button type="button" class="panel-nav" :disabled="currentIndex === 0" @click="onNav('prev', $event)">
        ← Prev
      </button>
      <span class="panel-hint">Click step or press R</span>
      <button type="button" class="panel-nav primary" :disabled="currentIndex === beats.length - 1" @click="onNav('next', $event)">
        Next →
      </button>
    </footer>
  </aside>
</template>

<style scoped>
.side-panel {
  flex: 0 0 auto;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding: 0.75rem 0.85rem;
  background: #0f172a;
  color: #e2e8f0;
  border-left: 1px solid rgba(148, 163, 184, 0.2);
  font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  min-width: 0;
}

.panel-eyebrow {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #38bdf8;
}

.panel-progress {
  flex-shrink: 0;
  white-space: nowrap;
  font-size: 0.72rem;
  font-weight: 600;
  color: #94a3b8;
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.14);
}

.panel-tabs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(26px, 1fr));
  gap: 0.25rem;
}

.panel-tab {
  padding: 0.22rem 0;
  border-radius: 6px;
  border: 1px solid rgba(148, 163, 184, 0.24);
  background: rgba(15, 23, 42, 0.8);
  color: #94a3b8;
  font-size: 0.68rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.18s ease, color 0.18s ease, border-color 0.18s ease;
}

.panel-tab.visited {
  color: #cbd5e1;
  border-color: rgba(56, 189, 248, 0.35);
}

.panel-tab.active {
  background: #38bdf8;
  border-color: #38bdf8;
  color: #0b1220;
}

.panel-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.panel-tag {
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #94a3b8;
}

.panel-title {
  margin: 0;
  font-size: 0.98rem;
  font-weight: 700;
  line-height: 1.25;
  color: #f8fafc;
}

.panel-summary {
  margin: 0;
  font-size: 0.77rem;
  line-height: 1.45;
  color: #cbd5e1;
}

.panel-section {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-top: 0.1rem;
}

.panel-label {
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #7dd3fc;
}

.panel-list {
  margin: 0;
  padding-left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.28rem;
  font-size: 0.74rem;
  line-height: 1.38;
  color: #e2e8f0;
}

.panel-code {
  margin: 0.1rem 0 0;
  padding: 0.5rem 0.6rem;
  border-radius: 8px;
  background: #020617;
  border: 1px solid rgba(56, 189, 248, 0.22);
  font-size: 0.68rem;
  line-height: 1.4;
  color: #bae6fd;
  overflow-x: auto;
}

.panel-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: auto;
  padding-top: 0.2rem;
}

.panel-chip {
  font-size: 0.66rem;
  padding: 0.16rem 0.45rem;
  border-radius: 999px;
  background: rgba(56, 189, 248, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.28);
  color: #bae6fd;
}

.panel-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
  padding-top: 0.55rem;
  border-top: 1px solid rgba(148, 163, 184, 0.18);
}

.panel-hint {
  font-size: 0.64rem;
  color: #64748b;
  text-align: center;
  white-space: nowrap;
}

.panel-nav {
  flex-shrink: 0;
  white-space: nowrap;
  padding: 0.25rem 0.6rem;
  border-radius: 7px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: transparent;
  color: #e2e8f0;
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
}

.panel-nav.primary {
  background: #38bdf8;
  border-color: #38bdf8;
  color: #0b1220;
}

.panel-nav:disabled {
  opacity: 0.35;
  cursor: default;
}
</style>
