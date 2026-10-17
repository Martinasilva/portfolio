const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store, max-age=0',
  'x-content-type-options': 'nosniff',
};
const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['application/pdf', 'image/jpeg', 'image/png', 'image/webp']);

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

function isValidId(id) {
  return typeof id === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(id);
}

function getSuppliedToken(request) {
  const authorization = request.headers.get('Authorization') || '';
  const bearer = authorization.match(/^Bearer\s+(.+)$/i)?.[1]?.trim();
  return bearer || request.headers.get('X-Admin-Token') || '';
}

function isAuthorized(request, env) {
  const expected = env.PORTFOLIO_ADMIN_TOKEN;
  const supplied = getSuppliedToken(request);
  return typeof expected === 'string' && expected.length > 0 && supplied.length > 0 && supplied === expected;
}

function bytesToBase64(bytes) {
  let binary = '';
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return btoa(binary);
}

function base64ToBytes(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function safeFilename(name) {
  return String(name || 'document').replace(/[\r\n"\\]/g, '_').slice(0, 180) || 'document';
}

function requireKV(env) {
  if (!env.PORTFOLIO_KV) {
    return json({
      error: 'Portfolio storage is not configured. Create a Cloudflare KV namespace and bind it as PORTFOLIO_KV.',
      code: 'STORAGE_NOT_CONFIGURED',
    }, 503);
  }
  return null;
}

async function handleFile(request, env, url) {
  const id = url.searchParams.get('id');
  if (!isValidId(id)) return json({ error: 'Invalid file id' }, 400);
  const missingBinding = requireKV(env);
  if (missingBinding) return missingBinding;

  const fileKey = `portfolio:file:${id}`;
  const metaKey = `portfolio:file-meta:${id}`;

  if (request.method === 'GET') {
    const [encoded, rawMeta] = await Promise.all([
      env.PORTFOLIO_KV.get(fileKey),
      env.PORTFOLIO_KV.get(metaKey),
    ]);
    if (!encoded) return json({ error: 'File not found' }, 404);

    let meta = {};
    try { meta = rawMeta ? JSON.parse(rawMeta) : {}; } catch { /* use safe defaults */ }
    const bytes = base64ToBytes(encoded);
    const filename = safeFilename(meta.name || 'document');
    return new Response(bytes, {
      headers: {
        'content-type': ALLOWED_TYPES.has(meta.mimeType) ? meta.mimeType : 'application/octet-stream',
        'content-disposition': `inline; filename*=UTF-8''${encodeURIComponent(filename)}`,
        'cache-control': 'no-store, max-age=0',
        'x-content-type-options': 'nosniff',
        'content-security-policy': "default-src 'none'; sandbox",
      },
    });
  }

  if (request.method !== 'POST' && request.method !== 'DELETE') {
    return json({ error: 'Method not allowed' }, 405);
  }
  if (!isAuthorized(request, env)) {
    return json({ error: 'Admin token rejected. Check the PORTFOLIO_ADMIN_TOKEN secret in Cloudflare and try again.' }, 401);
  }

  if (request.method === 'DELETE') {
    await Promise.all([env.PORTFOLIO_KV.delete(fileKey), env.PORTFOLIO_KV.delete(metaKey)]);
    return json({ ok: true, id });
  }

  let form;
  try { form = await request.formData(); } catch { return json({ error: 'Expected a multipart file upload' }, 400); }
  const file = form.get('file');
  if (!file || typeof file.arrayBuffer !== 'function') return json({ error: 'Missing file' }, 400);
  if (file.size > MAX_FILE_SIZE) return json({ error: 'Files must be 4 MB or smaller' }, 413);
  if (!ALLOWED_TYPES.has(file.type)) return json({ error: 'Only PDF, JPG, PNG, and WebP files are allowed' }, 415);

  const bytes = new Uint8Array(await file.arrayBuffer());
  const encoded = bytesToBase64(bytes);
  // KV values are limited to 25 MiB; the app's 4 MiB upload cap keeps base64 values safely below that limit.
  await env.PORTFOLIO_KV.put(fileKey, encoded);
  await env.PORTFOLIO_KV.put(metaKey, JSON.stringify({
    name: safeFilename(file.name),
    mimeType: file.type,
    size: file.size,
    uploadedAt: new Date().toISOString(),
  }));
  return json({ ok: true, id, name: file.name, size: file.size, mimeType: file.type });
}

async function handlePortfolio(request, env) {
  const missingBinding = requireKV(env);
  if (missingBinding) return missingBinding;

  if (request.method === 'GET') {
    const raw = await env.PORTFOLIO_KV.get('portfolio:metadata');
    if (!raw) return json({ certificates: [], updatedAt: null });
    try { return json(JSON.parse(raw)); }
    catch { return json({ error: 'Stored portfolio metadata is invalid JSON' }, 500); }
  }

  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  if (!isAuthorized(request, env)) {
    return json({ error: 'Admin token rejected. Check the PORTFOLIO_ADMIN_TOKEN secret in Cloudflare and try again.' }, 401);
  }

  let body;
  try { body = await request.json(); }
  catch { return json({ error: 'Invalid JSON body' }, 400); }
  if (!body || !Array.isArray(body.certificates)) return json({ error: 'Invalid certificate metadata' }, 400);

  const certificates = body.certificates.map((certificate) => {
    if (!certificate || typeof certificate !== 'object') return null;
    const { customUploadedPdfUrl, ...metadata } = certificate;
    return metadata;
  }).filter(Boolean);
  const payload = { certificates, updatedAt: new Date().toISOString() };
  await env.PORTFOLIO_KV.put('portfolio:metadata', JSON.stringify(payload));
  return json({ ok: true, updatedAt: payload.updatedAt });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      if (url.pathname === '/api/portfolio-file') return await handleFile(request, env, url);
      if (url.pathname === '/api/portfolio') return await handlePortfolio(request, env);
      if (url.pathname.startsWith('/api/')) return json({ error: 'API route not found' }, 404);
      return env.ASSETS.fetch(request);
    } catch (error) {
      console.error('Portfolio Worker request failed:', error);
      return json({ error: 'The portfolio server could not complete the request. Check the Worker logs.' }, 500);
    }
  },
};
