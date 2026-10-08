import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { gzipSync, brotliCompressSync, constants as zlibConstants } from 'zlib';
import { readFile, writeFile, readdir, stat } from 'fs/promises';
import { join, extname } from 'path';
import { handleContact } from './server/telegram.js';

const COMPRESS_EXT = new Set(['.html', '.js', '.css', '.svg', '.json', '.txt', '.xml', '.webmanifest']);

function precompressPlugin() {
  let outDir;
  const walk = async (dir, acc = []) => {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) await walk(full, acc);
      else acc.push(full);
    }
    return acc;
  };
  return {
    name: 'precompress',
    configResolved(cfg) {
      outDir = cfg.build.outDir;
    },
    async closeBundle() {
      let count = 0;
      for (const file of await walk(outDir)) {
        const ext = extname(file).toLowerCase();
        if (!COMPRESS_EXT.has(ext)) continue;
        if (file.endsWith('.br') || file.endsWith('.gz')) continue;
        let data;
        try {
          data = await readFile(file);
        } catch {
          continue;
        }
        if (data.length < 512) continue;
        try {
          const gzPath = `${file}.gz`;
          const brPath = `${file}.br`;
          const existing = await Promise.allSettled([stat(brPath), stat(gzPath)]);
          if (existing[0].status === 'rejected') {
            await writeFile(brPath, brotliCompressSync(data, {
              params: { [zlibConstants.BROTLI_PARAM_QUALITY]: 5 },
            }));
          }
          if (existing[1].status === 'rejected') {
            await writeFile(gzPath, gzipSync(data));
          }
          count++;
        } catch (err) {
          console.error('[precompress] error on', file, err);
        }
      }
      console.log(`[precompress] ${count} files`);
    },
  };
}

function contactApiPlugin(env) {
  return {
    name: 'contact-api-dev',
    configureServer(server) {
      server.middlewares.use('/api/contact', (req, res, next) => {
        if (req.method !== 'POST') return next();
        let raw = '';
        req.on('data', (chunk) => {
          raw += chunk;
        });
        req.on('end', async () => {
          let body = {};
          try {
            body = JSON.parse(raw || '{}');
          } catch {
            body = {};
          }
          const result = await handleContact(body, env);
          res.statusCode = result.status;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify(result));
        });
      });
    },
  };
}

function seoPlugin(siteUrl) {
  return {
    name: 'seo',
    transformIndexHtml(html) {
      return html.replace(/__SITE_URL__/g, siteUrl);
    },
    generateBundle() {
      const robots = [
        'User-agent: *',
        'Allow: /',
        'Disallow: /api/',
        '',
        `Sitemap: ${siteUrl}sitemap.xml`,
        '',
      ].join('\n');

      const lastmod = new Date().toISOString().slice(0, 10);
      const sitemap = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        '  <url>',
        `    <loc>${siteUrl}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        '    <changefreq>monthly</changefreq>',
        '    <priority>1.0</priority>',
        '  </url>',
        '  <url>',
        `    <loc>${siteUrl}privacy.html</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        '    <changefreq>yearly</changefreq>',
        '    <priority>0.3</priority>',
        '  </url>',
        '</urlset>',
        '',
      ].join('\n');

      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots });
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = env.VITE_SITE_URL || 'https://drgondusov.ru/';
  return {
    base: './',
    plugins: [react(), tailwindcss(), contactApiPlugin(env), seoPlugin(siteUrl), precompressPlugin()],
  };
});
