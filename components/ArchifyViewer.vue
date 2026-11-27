<script setup>
import { ref } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  title: { type: String, required: true },
  allowDrilldown: Boolean,
})
const emit = defineEmits(['next', 'previous'])
const src = `${import.meta.env.BASE_URL}diagrams/${props.name}.html?theme=dark&present=1`
const ready = ref(false)
const error = ref(false)

function prepareViewer(event) {
  const doc = event.currentTarget.contentDocument
  const isStandard = Boolean(doc?.querySelector('.diagram-container > svg'))
  const isDelta = Boolean(doc?.querySelector('main.proof-page section.canvas[data-view="delta"] > svg'))
  if (!isStandard && !isDelta) {
    error.value = true
    return
  }
  if (props.allowDrilldown && isStandard) {
    doc.documentElement.dataset.theme = 'dark'
    doc.documentElement.dataset.present = 'true'
  }
  // The Viewer's embed mode hides chrome but also disables hover previews.
  const style = doc.createElement('style')
  const hideNavChrome = props.allowDrilldown
    ? '.toolbar, .cards, .overview-map, .page-feedback'
    : '.toolbar, .cards, .diagram-nav, .overview-map, .focus-chip, .route-probe, .semantic-lens, .diagram-guide, .node-finder, .node-outline, .page-feedback'
  style.textContent = isDelta
    ? `
      body { padding: 0; overflow: hidden; }
      main.proof-page {
        box-sizing: border-box;
        max-width: none;
        height: 100dvh;
        padding: 0.75rem 1.25rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .proof-head { padding: 0; gap: 0.75rem; align-items: center; }
      .proof-head h1 { font-size: 1.35rem; margin: 0; }
      .proof-head h1 br { display: none; }
      .proof-head .eyebrow, .proof-head .subtitle { margin: 0; font-size: 0.78rem; }
      .proof-tools { padding: 0; }
      .proof-tools .utility, .page-feedback, footer { display: none !important; }
      .review-strip { margin: 0; padding: 0.35rem 0.65rem; }
      section.canvas { flex: 1 1 auto; min-height: 0; display: flex; align-items: center; justify-content: center; overflow: hidden; }
      section.canvas[hidden] { display: none !important; }
      section.canvas > svg { width: 100%; height: 100%; max-height: 100%; }
      section.canvas > iframe.snapshot-frame { width: 100%; height: 100%; border: 0; }
      main.proof-page > :not(.proof-head):not(.proof-tools):not(.review-strip):not(section.canvas) { display: none !important; }
    `
    : `
      html[data-present="true"] body { padding: 0; }
      html[data-present="true"] .container { height: 100dvh; gap: 0; }
      html[data-present="true"] .header { padding: 1rem 1.25rem 0.5rem; }
      html[data-present="true"] .header-row { margin: 0; }
      .header-row::after,
      .header > :not(.header-row),
      .header-row > :not(h1) { display: none !important; }
      html[data-present="true"] .diagram-container { padding: 0; border-radius: 0; }
      ${hideNavChrome} { display: none !important; }
    `
  doc.head.append(style)
  doc.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey
      || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return
    event.preventDefault()
    event.stopPropagation()
    emit(event.key === 'ArrowLeft' ? 'previous' : 'next')
  }, { capture: true })
  ready.value = true
}
</script>

<template>
  <div class="viewer">
    <p v-if="error" role="alert">The diagram did not load. Run npm run diagrams and reload the deck.</p>
    <iframe v-else :src="src" :title="title" :class="{ ready }" @load="prepareViewer" />
  </div>
</template>

<style scoped>
.viewer {
  position: absolute;
  inset: 0;
  background: #0b1220;
  color: #e2e8f0;
}

iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
  visibility: hidden;
}

iframe.ready {
  visibility: visible;
}
</style>
