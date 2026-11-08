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
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
        '  <url>',
        `    <loc>${siteUrl}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        '    <changefreq>monthly</changefreq>',
        '    <priority>1.0</priority>',
        '    <image:image>',
        `      <image:loc>${siteUrl}og-image.jpg</image:loc>`,
        '      <image:title>Гондусов Денис Вадимович — гастроэнтеролог и эндоскопист</image:title>',
        '    </image:image>',
        '    <image:image>',
        `      <image:loc>${siteUrl}8082192B-0B52-4BC5-B8B9-646CFA7B3B06.avif</image:loc>`,
        '      <image:title>Гондусов Денис Вадимович, врач-гастроэнтеролог</image:title>',
        '    </image:image>',
        '  </url>',
        '  <url>',
        `    <loc>${siteUrl}articles/</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        '    <changefreq>monthly</changefreq>',
        '    <priority>0.8</priority>',
        '  </url>',
        '  <url>',
        `    <loc>${siteUrl}articles/nbi-endoskopiya.html</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        '    <changefreq>monthly</changefreq>',
        '    <priority>0.8</priority>',
        '  </url>',
        '  <url>',
        `    <loc>${siteUrl}articles/iskusstvennyy-intellekt-v-endoskopii.html</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        '    <changefreq>monthly</changefreq>',
        '    <priority>0.8</priority>',
        '  </url>',
        '  <url>',
        `    <loc>${siteUrl}articles/ballon-ves-vernulsya.html</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        '    <changefreq>monthly</changefreq>',
        '    <priority>0.8</priority>',
        '  </url>',
        '  <url>',
        `    <loc>${siteUrl}articles/ballon-4-prichiny.html</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        '    <changefreq>monthly</changefreq>',
        '    <priority>0.8</priority>',
        '  </url>',
        '  <url>',
        `    <loc>${siteUrl}articles/srk-simptomy-lechenie.html</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        '    <changefreq>monthly</changefreq>',
        '    <priority>0.8</priority>',
        '  </url>',
        '  <url>',
        `    <loc>${siteUrl}articles/probiotiki-shramm.html</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        '    <changefreq>monthly</changefreq>',
        '    <priority>0.8</priority>',
        '  </url>',
        '  <url>',
        `    <loc>${siteUrl}articles/gastrit-ne-prohodit.html</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        '    <changefreq>monthly</changefreq>',
        '    <priority>0.8</priority>',
        '  </url>',
        '  <url>',
        `    <loc>${siteUrl}articles/vzdutie-lechenie.html</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        '    <changefreq>monthly</changefreq>',
        '    <priority>0.8</priority>',
        '  </url>',
        '  <url>',
        `    <loc>${siteUrl}privacy.html</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        '    <changefreq>yearly</changefreq>',
        '    <priority>0.3</priority>',
        '  </url>',
        '  <url>',
        `    <loc>${siteUrl}agreement.html</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        '    <changefreq>yearly</changefreq>',
        '    <priority>0.3</priority>',
        '  </url>',
        ...['ballon-20-30-procentov', 'posle-balla-chto-rabotaet', 'diety-kishechnik-ne-luchshe', 'diety-ne-rabotayut', 'zhirnaya-pechen', 'kak-peresadit-mikrobiotu', 'fmt-pri-srk-i-ozhirenii', 'chto-takoe-fmt'].map(
          (slug) =>
            `  <url>\n    <loc>${siteUrl}articles/${slug}.html</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`
        ),
        ...['ballon', 'pechen-ves', 'mikrobiota'].map(
          (slug) =>
            `  <url>\n    <loc>${siteUrl}articles/collections/${slug}.html</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`
        ),
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
