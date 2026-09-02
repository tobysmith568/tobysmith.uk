// Convert a single Grammarly-exported .docx to Markdown via pandoc, using the
// defaults file in pandoc/docx-to-md.yaml. Output lands in
// pandoc/outputs/<input basename>.md.
//
// Usage: bun run docx-to-md <path/to/file.docx>

import { $ } from "bun";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, extname, join, resolve } from "node:path";
import { preprocessGrammarlyDocx } from "./preprocess-grammarly-docx.ts";

const input = process.argv[2];
if (!input) {
  console.error("Usage: bun run docx-to-md <path/to/file.docx>");
  process.exit(1);
}

const repoRoot = resolve(import.meta.dir, "..");
const outDir = join(repoRoot, "pandoc", "outputs");
await mkdir(outDir, { recursive: true });

const outFile = join(outDir, `${basename(input, extname(input))}.md`);
const defaults = join(repoRoot, "pandoc", "docx-to-md.yaml");

// Restyle Grammarly's monospace paragraphs/runs as code before pandoc sees them.
const staged = join(tmpdir(), `docx-to-md-${Date.now()}.docx`);
await writeFile(staged, preprocessGrammarlyDocx(await readFile(input)));

try {
  await $`pandoc -d ${defaults} ${staged} -o ${outFile}`.cwd(repoRoot);
} finally {
  await rm(staged, { force: true });
}

console.log(`Wrote ${outFile}`);
