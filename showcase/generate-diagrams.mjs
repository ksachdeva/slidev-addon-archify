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

// Keep validation receipts out of the public directory. Only update the deck
// assets once every diagram has passed validation and browser checks.
const stage = mkdtempSync(join(tmpdir(), 'archify-showcase-'))
try {
  for (const [name, type] of diagrams) {
    execFileSync(process.execPath, [
      cli, 'finalize', type, `showcase/diagrams/${name}.${type}.json`,
      join(stage, `${name}.html`), '--quality', 'showcase', '--json',
    ], { cwd: repoRoot, stdio: 'inherit' })
  }

  const publicDiagrams = join(repoRoot, 'showcase/public/diagrams')
  mkdirSync(publicDiagrams, { recursive: true })
  for (const [name] of diagrams) {
    copyFileSync(join(stage, `${name}.html`), join(publicDiagrams, `${name}.html`))
  }
} finally {
  rmSync(stage, { recursive: true, force: true })
}
