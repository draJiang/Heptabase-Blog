import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve, dirname } from 'node:path';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { get, put } from '@vercel/blob';
import schema from '../lib/published-notes.cjs';

const { BLOB_PATH, canonicalSnapshot, normalizeNote, validateSnapshot } = schema;
const exec = promisify(execFile);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

async function cli(...args) {
  // Never print stdout/stderr on failure: both can contain private note data.
  try {
    const { stdout } = await exec('heptabase', args, { timeout: 60_000, maxBuffer: 16 * 1024 * 1024 });
    const result = JSON.parse(stdout);
    if (result.error || result.status === 'failed') throw new Error('CLI rejected request');
    return result;
  } catch {
    throw new Error(`Heptabase ${args.slice(0, 2).join(' ')} failed. Check the desktop app and Local CLI Server; no data uploaded.`);
  }
}

export async function publicCards(runCli) {
  const { tags } = await runCli('tag', 'list', '--name-filter', 'public');
  if (!Array.isArray(tags)) throw new Error('Invalid tag list.');
  const matches = tags.filter(tag => tag.name === 'public');
  if (matches.length !== 1) throw new Error('Expected exactly one tag named public (case sensitive).');
  const result = await runCli('tag', 'cards', matches[0].id);
  if (result.tagId !== matches[0].id || result.tagName !== 'public' || !Array.isArray(result.cards)) {
    throw new Error('Invalid public tag card list.');
  }
  return [...new Map(result.cards.map(card => [card.id, card])).values()];
}

function fingerprint(cards) {
  return JSON.stringify(cards.map(({ id, createdTime, lastEditedTime }) => ({ id, createdTime, lastEditedTime }))
    .sort((a, b) => a.id.localeCompare(b.id)));
}

export async function collectNotes(runCli = cli, log = console.log) {
  const tagged = await publicCards(runCli);
  if (!tagged.length) throw new Error('public is empty; refusing to clear the website.');
  const noteIds = new Set();
  let expectedTotal;
  for (let offset = 0; ; offset += 100) {
    const page = await runCli('card', 'list', '--card-types', 'note', '--sort', 'createdTime',
      '--direction', 'ascending', '--offset', String(offset), '--limit', '100');
    if (!Array.isArray(page.results) || !Number.isInteger(page.total) || page.total < 0 || page.offset !== offset) {
      throw new Error('Invalid note library page.');
    }
    if (expectedTotal !== undefined && expectedTotal !== page.total) throw new Error('Card Library changed; run publish again.');
    expectedTotal = page.total;
    for (const card of page.results) {
      if (card.objectType !== 'note' || noteIds.has(card.id)) throw new Error('Invalid or unstable note pagination.');
      noteIds.add(card.id);
    }
    if (offset + page.results.length >= page.total) break;
    if (page.results.length !== 100) throw new Error('Incomplete note library page.');
  }
  if (noteIds.size !== expectedTotal) throw new Error('Incomplete note library results.');
  const selected = tagged.filter(card => noteIds.has(card.id));
  log(`public: ${selected.length} notes; skipped ${tagged.length - selected.length} other cards.`);
  const notes = [];
  // Bounded concurrency keeps the desktop app responsive.
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(4, selected.length) }, async () => {
    while (cursor < selected.length) {
      const meta = selected[cursor++];
      notes.push(normalizeNote(await runCli('note', 'read', meta.id), meta));
      if (notes.length % 50 === 0) log(`Read ${notes.length}/${selected.length} notes.`);
    }
  }));
  // Detect untagging/edits while the export was running, before replacing live data.
  if (fingerprint(tagged) !== fingerprint(await publicCards(runCli))) {
    throw new Error('public membership or edit times changed during export; run publish again.');
  }
  return canonicalSnapshot(notes);
}

export async function uploadSnapshot(snapshot, storage = { get, put }) {
  validateSnapshot(snapshot);
  const body = JSON.stringify(snapshot);
  const current = await storage.get(BLOB_PATH, { access: 'private', useCache: false });
  if (current && current.statusCode !== 200) throw new Error('Could not read the current snapshot.');
  if (current && await new Response(current.stream).text() === body) return false;
  await storage.put(BLOB_PATH, body, {
    access: 'private', contentType: 'application/json', addRandomSuffix: false,
    allowOverwrite: Boolean(current), cacheControlMaxAge: 60,
    ...(current ? { ifMatch: current.blob.etag } : {}),
  });
  return true;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help')) {
    console.log('npm run publish [-- --dry-run]\nExports notes tagged exactly public to private Vercel Blob. No Git commits or deployment required.');
    return;
  }
  if (args.some(arg => arg !== '--dry-run')) throw new Error('Only --dry-run and --help are supported.');
  if (typeof process.loadEnvFile !== 'function') throw new Error('Node.js >=20.12 is required.');
  if (existsSync(resolve(root, '.env.local'))) {
    // Explicit shell environment wins over the local file.
    const original = { ...process.env };
    process.loadEnvFile(resolve(root, '.env.local'));
    Object.assign(process.env, original);
  }
  const { stdout: branch } = await exec('git', ['branch', '--show-current'], { cwd: root });
  if (branch.trim() !== 'jiang') throw new Error('Run Publish from the jiang deployment branch.');
  const { stdout: version } = await exec('heptabase', ['--version'], { timeout: 15_000 });
  if (!/^0\.8\.\d+\s*$/.test(version.trim())) throw new Error('This exporter requires Heptabase CLI 0.8.x. Update the exporter before using a different CLI version.');
  if (!args.includes('--dry-run') && !process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('Missing BLOB_READ_WRITE_TOKEN. Connect a private Blob store and run vercel env pull .env.local.');
  }
  const snapshot = await collectNotes();
  const body = JSON.stringify(snapshot);
  console.log(`Validated ${snapshot.data.cards.length} notes, ${Buffer.byteLength(body)} bytes, SHA256 ${createHash('sha256').update(body).digest('hex')}.`);
  if (args.includes('--dry-run')) {
    console.log('Dry run complete. No files written or uploads performed.');
    return;
  }
  console.log(await uploadSnapshot(snapshot) ? 'Published. The website will read the new notes on its next load.' : 'No changes; nothing uploaded.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(error => {
    // SDK errors can include request details; do not dump stacks or credentials.
    console.error(`Publish failed: ${error instanceof Error ? error.message.replace(/vercel_blob_rw_[\w]+/g, '[redacted]') : 'unknown error'}`);
    process.exitCode = 1;
  });
}
