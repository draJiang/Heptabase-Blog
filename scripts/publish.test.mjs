import test from 'node:test';
import assert from 'node:assert/strict';
import { collectNotes, uploadSnapshot } from './publish.mjs';
import schema from '../lib/published-notes.cjs';
import api from '../api/notes.js';

const date = '2026-11-04T00:00:00.000Z';
const metadata = id => ({ id, title: id, createdTime: date, lastEditedTime: date });
const note = id => ({ id, title: id, content: JSON.stringify({ type: 'doc', content: [{ type: 'paragraph' }] }) });
const snapshot = schema.canonicalSnapshot([{ ...metadata('one'), ...note('one') }]);
function fakeCLI({ tags, tagged, library, fail, change } = {}) {
  const cards = tagged || [metadata('one'), metadata('pdf')];
  let tagReads = 0;
  return async (...args) => {
    if (args[0] === 'tag' && args[1] === 'list') return { tags: tags || [{ id: 'public-tag', name: 'public' }, { id: 'wrong', name: 'Public' }] };
    if (args[0] === 'tag' && args[1] === 'cards') {
      assert.equal(args[2], 'public-tag');
      return { tagId: 'public-tag', tagName: 'public', cards: change && tagReads++ ? [] : cards };
    }
    if (args[0] === 'card') {
      const all = library || [{ id: 'one', objectType: 'note' }];
      const offset = Number(args[args.indexOf('--offset') + 1]);
      return { results: all.slice(offset, offset + 100), total: all.length, offset };
    }
    if (args[0] === 'note') {
      if (fail) throw new Error('read failure');
      return note(args[2]);
    }
    throw new Error('unexpected CLI command');
  };
}

test('exact case-sensitive public tag, note filtering, no untagged note expansion', async () => {
  const result = await collectNotes(fakeCLI({ library: [{ id: 'one', objectType: 'note' }, { id: 'private', objectType: 'note' }] }), () => {});
  assert.deepEqual(result, snapshot);
  await assert.rejects(collectNotes(fakeCLI({ tags: [{ id: 'wrong', name: 'Public' }] }), () => {}), /exactly one tag/);
  await assert.rejects(collectNotes(fakeCLI({ tags: [{ id: 'wrong', name: 'notpublic' }] }), () => {}), /exactly one tag/);
});
test('paginates note library, deduplicates tag results, and sorts output', async () => {
  const library = Array.from({ length: 101 }, (_, i) => ({ id: String(i), objectType: 'note' }));
  const result = await collectNotes(fakeCLI({ library, tagged: [metadata('100'), metadata('0'), metadata('100')] }), () => {});
  assert.deepEqual(result.data.cards.map(c => c.id), ['0', '100']);
});
test('empty publication, read failures, and membership changes abort', async () => {
  await assert.rejects(collectNotes(fakeCLI({ tagged: [] }), () => {}), /empty/);
  await assert.rejects(collectNotes(fakeCLI({ fail: true }), () => {}), /read failure/);
  await assert.rejects(collectNotes(fakeCLI({ change: true }), () => {}), /changed during export/);
});
test('schema rejects duplicate notes, malformed documents, and invalid dates', () => {
  assert.throws(() => schema.canonicalSnapshot([snapshot.data.cards[0], snapshot.data.cards[0]]), /duplicate/);
  assert.throws(() => schema.canonicalSnapshot([{ ...snapshot.data.cards[0], content: '{}' }]), /document/);
  assert.throws(() => schema.canonicalSnapshot([{ ...snapshot.data.cards[0], lastEditedTime: '' }]), /metadata/);
});
test('unchanged snapshot does not upload; replacement removes untagged notes and uses ETag', async () => {
  let writes = 0;
  const storage = {
    get: async (_path, options) => {
      assert.equal(options.useCache, false);
      return { statusCode: 200, stream: new Response(JSON.stringify(snapshot)).body, blob: { etag: 'W/"current"' } };
    },
    head: async () => ({ etag: '"current"' }),
    put: async (_path, body, options) => {
      writes++;
      assert.equal(options.access, 'private');
      assert.equal(options.ifMatch, '"current"');
      assert.equal(options.addRandomSuffix, false);
      assert.deepEqual(JSON.parse(body).data.cards.map(c => c.id), ['two']);
    },
  };
  assert.equal(await uploadSnapshot(snapshot, storage), false);
  assert.equal(writes, 0);
  assert.equal(await uploadSnapshot(schema.canonicalSnapshot([{ ...metadata('two'), ...note('two') }]), storage), true);
  assert.equal(writes, 1);
});
test('initial publication does not allow overwriting a concurrent first publication', async () => {
  await uploadSnapshot(snapshot, { get: async () => null, put: async (_path, _body, options) => assert.equal(options.allowOverwrite, false) });
  await assert.rejects(uploadSnapshot(snapshot, { get: async () => null, put: async () => { throw new Error('upload failure'); } }), /upload failure/);
});
test('a change between download and metadata read aborts without overwriting', async () => {
  let writes = 0;
  const storage = {
    get: async () => ({ statusCode: 200, stream: new Response('{}').body, blob: { etag: 'W/"old"' } }),
    head: async () => ({ etag: '"new"' }),
    put: async () => { writes++; },
  };
  await assert.rejects(uploadSnapshot(snapshot, storage), /changed during upload preparation/);
  assert.equal(writes, 0);
});
test('a conflict after metadata read is propagated without an unconditional retry', async () => {
  let writes = 0;
  const storage = {
    get: async () => ({ statusCode: 200, stream: new Response('{}').body, blob: { etag: '"current"' } }),
    head: async () => ({ etag: '"current"' }),
    put: async () => { writes++; throw new Error('ETag mismatch'); },
  };
  await assert.rejects(uploadSnapshot(snapshot, storage), /ETag mismatch/);
  assert.equal(writes, 1);
});
function response() {
  return { headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(s) { this.statusCode = s; return this; }, json(body) { this.body = body; return this; } };
}
test('API reads private Blob without caching; method and failure handling', async () => {
  const handler = api.createHandler(async (_path, options) => {
    assert.deepEqual(options, { access: 'private', useCache: false });
    return { statusCode: 200, stream: new Response(JSON.stringify(snapshot)).body };
  });
  const res = response();
  await handler({ method: 'GET' }, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, snapshot);
  assert.match(res.headers['Cache-Control'], /no-store/);
  const wrongMethod = response();
  await handler({ method: 'POST' }, wrongMethod);
  assert.equal(wrongMethod.statusCode, 405);
  const missing = response();
  await api.createHandler(async () => null)({ method: 'GET' }, missing);
  assert.equal(missing.statusCode, 503);
});
