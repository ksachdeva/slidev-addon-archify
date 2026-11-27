<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  title: { type: String, required: true },
  step: { type: Number, required: true },
  active: { type: Boolean, required: true },
  loopByDefault: Boolean,
  fullBleed: Boolean,
  fill: Boolean,
  hideLoop: Boolean,
})

const frame = ref(null)
const ready = ref(false)
const error = ref('')
const loopStep = ref(props.loopByDefault)
const canReplay = computed(() => ready.value && props.active && props.step > 0)
const src = `${import.meta.env.BASE_URL}diagrams/${props.name}.stage.html`
let stage
let animationFrame
let replayTimer

function stop() {
  cancelAnimationFrame(animationFrame)
  clearTimeout(replayTimer)
  stage?.pause()
}

function showStep(animate) {
  if (!stage) return
  stop()
  const { duration, steps } = stage.state()
  const index = Math.max(0, Math.min(props.step, steps.length - 1))
  const start = steps[index].at
  // Hold before the caption fades out at the end of the beat.
  const end = index === 0 ? 0 : (steps[index + 1]?.at ?? duration) - 0.65
  if (!animate || index === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    stage.seek(end)
    return
  }

  stage.seek(start)
  stage.play()
  const untilEnd = () => {
    if (stage.state().time >= end) {
      stop()
      stage.seek(end)
      if (loopStep.value && props.active) replayTimer = setTimeout(() => showStep(true), 1000)
    }
    else {
      animationFrame = requestAnimationFrame(untilEnd)
    }
  }
  animationFrame = requestAnimationFrame(untilEnd)
}

function replayStep() {
  if (canReplay.value) showStep(true)
}

function toggleLoop(event) {
  loopStep.value = !loopStep.value
  showStep(loopStep.value)
  // Slidev suppresses arrow navigation while a button has focus.
  if (event.detail > 0) event.currentTarget.blur()
}

function onReplayKey(event) {
  if (!canReplay.value || !frame.value?.getClientRects().length || event.defaultPrevented
    || event.repeat || event.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey
    || event.key.toLowerCase() !== 'r') return
  const target = event.target
  if (target instanceof HTMLElement && (target.isContentEditable || target.closest('input, textarea, select'))) return
  event.preventDefault()
  replayStep()
}

function loadStage() {
  stop()
  stage = frame.value.contentWindow.ArchifyStoryStage
  if (!stage) {
    error.value = 'The diagram did not load. Run npm run diagrams and reload the deck.'
    return
  }
  const doc = frame.value.contentDocument
  const style = doc.createElement('style')
  // Slidev preloads hidden slides. CSS animations recreated on reveal must start paused.
  style.textContent = `
    body { padding: 0; overflow: hidden; }
    .shell { width: 100%; }
    .shell > :not(.canvas-wrap) { display: none; }
    .canvas-wrap { padding: 0; border: 0; }
    .stage-pane > svg { width: 100%; height: 100vh; border-radius: 0; }
    .stage-pane svg, .stage-pane svg * { animation-play-state: paused !important; }
    .stage-pane [id^="story-source-hl"] { fill-opacity: 0.3 !important; }
  `
  doc.head.append(style)
  showStep(false)
  ready.value = true
}

watch(
  () => [props.step, props.active],
  ([step, active], [previousStep, wasActive]) => {
    if (!active) loopStep.value = props.loopByDefault
    showStep(active && wasActive && (loopStep.value || step === previousStep + 1))
  },
  { flush: 'post' },
)
onMounted(() => window.addEventListener('keydown', onReplayKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onReplayKey)
  stop()
})
</script>

<template>
  <div :class="{ 'full-bleed': fullBleed, 'fill-stage': fill }">
    <p v-if="error" role="alert">{{ error }}</p>
    <template v-else>
      <button v-if="!hideLoop" class="loop" type="button" :aria-pressed="loopStep" :disabled="!ready || !active" @click="toggleLoop">
        Loop step <span aria-hidden="true">{{ loopStep ? 'On' : 'Off' }}</span>
      </button>
      <iframe
        ref="frame"
        :src="src"
        :title="title"
        :class="{ ready }"
        tabindex="-1"
        @load="loadStage"
      />
    </template>
  </div>
</template>

<style scoped>
iframe {
  display: block;
  width: min(100%, 700px);
  aspect-ratio: 16 / 9;
  margin-inline: auto;
  border: 0;
  border-radius: 12px;
  pointer-events: none;
  visibility: hidden;
}

.ready {
  visibility: visible;
}

.loop {
  display: block;
  margin: 0 auto 0.4rem;
  padding: 0.15rem 0.65rem;
  border: 1px solid currentColor;
  border-radius: 0.45rem;
  font-size: 0.8rem;
}

.loop:not(:disabled) {
  cursor: pointer;
}

.loop:disabled {
  opacity: 0.45;
}

.loop span {
  margin-inline-start: 0.4em;
  font-weight: 600;
}

.full-bleed {
  position: absolute;
  inset: 0;
  background: #0b1220;
  color: #e2e8f0;
}

.fill-stage {
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  background: #0b1220;
  color: #e2e8f0;
}

.full-bleed iframe,
.fill-stage iframe {
  width: 100%;
  height: 100%;
  aspect-ratio: auto;
  border-radius: 0;
}

.full-bleed .loop,
.fill-stage .loop {
  position: absolute;
  z-index: 1;
  top: 0.4rem;
  right: 0.75rem;
  margin: 0;
  background: #0b1220;
}
</style>
