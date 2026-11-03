const BLOB_PATH = 'heptabase/notes.json';
// Leave room below Vercel Functions' 4.5 MB response limit.
const MAX_BYTES = 4_000_000;

function validateSnapshot(snapshot, { allowEmpty = false } = {}) {
  const cards = snapshot?.data?.cards;
  if (snapshot?.version !== 1 || !Array.isArray(cards)) {
    throw new Error('Invalid published notes snapshot.');
  }
  if (!allowEmpty && cards.length === 0) throw new Error('No public notes; refusing to clear the website.');
  const ids = new Set();
  for (const card of cards) {
    if (typeof card.id !== 'string' || !card.id || ids.has(card.id) ||
        typeof card.title !== 'string' || typeof card.content !== 'string' ||
        !Number.isFinite(Date.parse(card.createdTime)) ||
        !Number.isFinite(Date.parse(card.lastEditedTime))) {
      throw new Error('Invalid or duplicate note metadata.');
    }
    let doc;
    try { doc = JSON.parse(card.content); } catch { throw new Error('Invalid note JSON.'); }
    if (doc?.type !== 'doc' || !Array.isArray(doc.content)) throw new Error('Invalid note document.');
    ids.add(card.id);
  }
  if (Buffer.byteLength(JSON.stringify(snapshot)) > MAX_BYTES) {
    throw new Error('Notes exceed the 4 MB API response budget; split the API before publishing.');
  }
  return snapshot;
}

function normalizeNote(note, metadata) {
  if (note.id !== metadata.id) throw new Error('CLI returned a different note ID.');
  return {
    id: note.id,
    title: note.title,
    content: note.content,
    createdTime: metadata.createdTime,
    lastEditedTime: metadata.lastEditedTime,
  };
}

function canonicalSnapshot(cards) {
  return validateSnapshot({ version: 1, data: { cards: [...cards].sort((a, b) => a.id.localeCompare(b.id)) } });
}

module.exports = { BLOB_PATH, MAX_BYTES, validateSnapshot, normalizeNote, canonicalSnapshot };
