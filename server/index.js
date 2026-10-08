import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { join, extname, normalize } from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import { gzip, brotliCompress, constants as zlibConstants } from 'zlib';
import { handleContact } from './telegram.js';

const gzipAsync = promisify(gzip);
const brotliAsync = promisify(brotliCompress);

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DIST_DIR = join(__dirname, '..', 'dist');
const PORT = Number(process.env.PORT) || 80;
const HOST = process.env.HOST || '0.0.0.0';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.jfif': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

const IMMUTABLE = 'public, max-age=31536000, immutable';
const STATIC_LONG = 'public, max-age=2592000';
const NO_CACHE = 'no-cache';

function cacheControlFor(pathname) {
  if (pathname.startsWith('/assets/')) return IMMUTABLE;
  const ext = extname(pathname).toLowerCase();
  if (['.avif', '.webp', '.png', '.jpg', '.jpeg', '.jfif', '.svg', '.ico', '.ttf', '.woff', '.woff2'].includes(ext)) {
    return STATIC_LONG;
  }
  return NO_CACHE;
}

const COMPRESSIBLE = new Set(['.html', '.js', '.css', '.json', '.svg', '.txt', '.xml', '.webmanifest']);

async function maybeCompress(req, data, headers) {
  if (data.length < 1024) return data;
  const accept = String(req.headers['accept-encoding'] || '');
  headers['Vary'] = 'Accept-Encoding';
  try {
    if (/\bbr\b/.test(accept)) {
      headers['Content-Encoding'] = 'br';
      return await brotliAsync(data, {
        params: { [zlibConstants.BROTLI_PARAM_QUALITY]: 5 },
      });
    }
    if (/\bgzip\b/.test(accept)) {
      headers['Content-Encoding'] = 'gzip';
      return await gzipAsync(data);
    }
  } catch (e) {
    console.error('[server] compression error:', e);
    delete headers['Content-Encoding'];
  }
  return data;
}

function readBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 1e6) req.destroy();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(raw || '{}'));
      } catch {
        resolve({});
      }
    });
  });
}

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

async function serveStatic(req, res, pathname) {
  let safePath = '/';
  try {
    safePath = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  } catch {
    safePath = '/';
  }
  const filePath = join(DIST_DIR, safePath);

  try {
    let target = filePath;
    const info = await stat(target);
    if (info.isDirectory()) target = join(target, 'index.html');
    const ext = extname(target).toLowerCase();
    const headers = {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': cacheControlFor(pathname),
    };

    if (COMPRESSIBLE.has(ext)) {
      const accept = String(req.headers['accept-encoding'] || '');
      headers['Vary'] = 'Accept-Encoding';

      let encoding = null;
      let servedFile = null;
      if (/\bbr\b/.test(accept)) {
        try {
          await stat(`${target}.br`);
          encoding = 'br';
          servedFile = `${target}.br`;
        } catch { /* no precompressed brotli */ }
      }
      if (encoding === null && /\bgzip\b/.test(accept)) {
        try {
          await stat(`${target}.gz`);
          encoding = 'gzip';
          servedFile = `${target}.gz`;
        } catch { /* no precompressed gzip */ }
      }
      if (encoding && servedFile) {
        const compressed = await readFile(servedFile);
        headers['Content-Encoding'] = encoding;
        headers['Content-Length'] = compressed.length;
        res.writeHead(200, headers);
        res.end(req.method === 'HEAD' ? undefined : compressed);
        return;
      }

      const data = await readFile(target);
      const body = await maybeCompress(req, data, headers);
      headers['Content-Length'] = body.length;
      res.writeHead(200, headers);
      res.end(req.method === 'HEAD' ? undefined : body);
      return;
    }

    const data = await readFile(target);
    headers['Content-Length'] = data.length;
    res.writeHead(200, headers);
    res.end(req.method === 'HEAD' ? undefined : data);
    return;
  } catch {
    // fall through to 404
  }

  try {
    const data = await readFile(join(DIST_DIR, '404.html'));
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': NO_CACHE });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': NO_CACHE });
    res.end('Not found');
  }
}

const server = createServer(async (req, res) => {
  try {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

    if (url.pathname === '/health') {
      sendJson(res, 200, { status: 'ok', uptime: Math.round(process.uptime()) });
      return;
    }

    if (url.pathname === '/api/contact') {
      if (req.method !== 'POST') {
        sendJson(res, 405, { error: 'Method not allowed' });
        return;
      }
      const body = await readBody(req);
      const result = await handleContact(body, process.env);
      sendJson(res, result.status, result);
      return;
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405);
      res.end();
      return;
    }

    await serveStatic(req, res, url.pathname);
  } catch (err) {
    console.error('[server] request error:', err);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    }
    res.end('Internal Server Error');
  }
});

process.on('uncaughtException', (err) => {
  console.error('[server] uncaughtException:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('[server] unhandledRejection:', err);
});

process.on('SIGTERM', () => {
  console.log('[server] SIGTERM received, shutting down');
  server.close(() => process.exit(0));
});

server.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT} (PORT=${process.env.PORT ?? 'default'})`);
});
