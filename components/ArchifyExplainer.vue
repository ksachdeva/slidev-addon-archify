<script setup>
import { ref } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  title: { type: String, required: true },
  theme: { type: String, default: 'light' },
  stylePreset: { type: String, default: 'clean' },
  hideBranding: { type: Boolean, default: true },
  hideThemeToggle: { type: Boolean, default: true },
  hideStyleMenu: { type: Boolean, default: true },
  hideExport: { type: Boolean, default: true },
  hideAsk: { type: Boolean, default: true },
  hideExplore: { type: Boolean, default: true },
  hideWalk: { type: Boolean, default: false },
  allowDiagramModal: { type: Boolean, default: true },
})

const emit = defineEmits(['next', 'previous'])
const src = `${import.meta.env.BASE_URL}diagrams/${props.name}.explainer.html`
const ready = ref(false)
const error = ref(false)

function prepareExplainer(event) {
  const doc = event.currentTarget.contentDocument
  if (!doc?.querySelector('#board')) {
    error.value = true
    return
  }
  doc.documentElement.dataset.theme = props.theme
  doc.documentElement.dataset.style = props.stylePreset

  const hidden = []
  if (props.hideBranding) hidden.push('.colophon')
  if (props.hideThemeToggle) hidden.push('.theme-controls')
  if (props.hideStyleMenu) hidden.push('.style-menu')
  if (props.hideExport) hidden.push('.export-menu')
  // .js .interactive in reader.css uses !important with (0,2,0) specificity.
  if (props.hideAsk) hidden.push('.js .ask-button', '.ask-button', '.js .ask-floating', '.ask-floating')
  if (props.hideExplore) hidden.push('.js .explore-button', '.explore-button')
  if (props.hideWalk) hidden.push('.js .walk-start', '.walk-start')
  if (props.hideExplore && props.hideWalk) hidden.push('.js .diagram-actions', '.diagram-actions')
  if (props.hideThemeToggle && props.hideStyleMenu && props.hideExport) hidden.push('.js .masthead .tools', '.masthead .tools')

  const style = doc.createElement('style')
  style.id = 'ndx-explainer-overrides'
  style.textContent = `
    .shell { padding-top: 1.25rem; }
    ${hidden.length ? `${hidden.join(', ')} { display: none !important; }` : ''}
    ${!props.allowDiagramModal ? '[data-diagram-link], .diagram-preview [data-node-id] { cursor: default; }' : ''}
  `
  doc.head.append(style)

  if (!props.allowDiagramModal) {
    doc.addEventListener('click', (e) => {
      const target = e.target
      if (target instanceof doc.defaultView.Element && target.closest('[data-diagram-link], .diagram-preview [data-node-id]')) {
        e.preventDefault()
        e.stopPropagation()
      }
    }, { capture: true })
  }

  doc.addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey
      || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return
    const target = e.target
    if (target instanceof doc.defaultView.HTMLElement && (target.isContentEditable || target.closest('input, textarea, select'))) return
    e.preventDefault()
    e.stopPropagation()
    emit(e.key === 'ArrowLeft' ? 'previous' : 'next')
  }, { capture: true })

  ready.value = true
}
</script>

<template>
  <div class="explainer-wrap" :class="theme">
    <p v-if="error" role="alert" class="err">The explainer did not load. Run npm run diagrams and reload.</p>
    <iframe v-else :src="src" :title="title" :class="{ ready }" @load="prepareExplainer" />
  </div>
</template>

<style scoped>
.explainer-wrap {
  position: absolute;
  inset: 0;
  background: #ffffff;
  color: #0f172a;
}

.explainer-wrap.dark {
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

.err {
  padding: 1rem;
}
</style>
