const { get } = require('@vercel/blob');
const { BLOB_PATH, validateSnapshot } = require('../lib/published-notes.cjs');

function createHandler(readBlob = get) {
  return async function notes(req, res) {
    res.setHeader('Cache-Control', 'private, no-store, max-age=0');
    res.setHeader('CDN-Cache-Control', 'no-store');
    res.setHeader('Vercel-CDN-Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json({ error: 'Method not allowed' });
    }
    try {
      const blob = await readBlob(BLOB_PATH, { access: 'private', useCache: false });
      if (!blob) return res.status(503).json({ error: 'Notes have not been published yet.' });
      if (blob.statusCode !== 200) throw new Error('Unexpected Blob response');
      const snapshot = validateSnapshot(await new Response(blob.stream).json());
      return res.status(200).json(snapshot);
    } catch {
      console.error('Published notes could not be loaded.');
      return res.status(503).json({ error: 'Notes are temporarily unavailable.' });
    }
  };
}

module.exports = createHandler();
module.exports.createHandler = createHandler;
