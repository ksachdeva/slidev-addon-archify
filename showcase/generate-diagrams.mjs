import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = fileURLToPath(new URL('../', import.meta.url))
const cli = process.env.ARCHIFY_CLI
  ? resolve(process.env.ARCHIFY_CLI)
  : join(repoRoot, '.agents/skills/archify/bin/archify.mjs')

if (!existsSync(cli)) {
  console.error('Archify CLI not found. Install the Archify skill locally or set ARCHIFY_CLI to its bin/archify.mjs path.')
  process.exit(1)
}

const diagrams = [
  ['agent-turn-baseline', 'architecture'],
  ['agent-turn-optimized', 'architecture'],
  ['agent-turn-fanout', 'dataflow'],
  ['agent-turn-states', 'lifecycle'],
  ['agent-turn-latency', 'waterfall'],
]

const story = 'showcase/diagrams/agent-turn-fanout.story.json'
const explainer = 'showcase/diagrams/agent-turn-latency.archify.md'
const outputs = [
  ...diagrams.map(([name]) => `${name}.html`),
  'agent-turn-fanout.stage.html',
  'agent-turn-latency.explainer.html',
]

function runArchify(...args) {
  execFileSync(process.execPath, [cli, ...args, '--json'], { cwd: repoRoot, stdio: 'inherit' })
}

// Publish only HTML, and only after every generation step succeeds.
const stage = mkdtempSync(join(tmpdir(), 'archify-showcase-'))
try {
  for (const [name, type] of diagrams) {
    runArchify('finalize', type, `showcase/diagrams/${name}.${type}.json`,
      join(stage, `${name}.html`), '--quality', 'showcase')
  }
  runArchify('story', 'validate', story)
  runArchify('story', 'stage', story, join(stage, 'agent-turn-fanout.stage.html'), '--theme', 'dark')
  runArchify('finalize', 'explainer', explainer, join(stage, 'agent-turn-latency.explainer.html'))

  const publicDiagrams = join(repoRoot, 'showcase/public/diagrams')
  mkdirSync(publicDiagrams, { recursive: true })
  for (const filename of outputs) {
    copyFileSync(join(stage, filename), join(publicDiagrams, filename))
  }
} finally {
  rmSync(stage, { recursive: true, force: true })
}
