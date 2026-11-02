// Writes the English values of editor/public/data/en/seo.json into the build copy of index.html.
// Crawlers and link-preview bots do not run JavaScript, so without this they only see empty <meta> tags.
// The page still updates the tags at runtime for the language the visitor picks (see js/main.js).
// Usage (part of `npm run build`): node scripts/inject-seo.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const seo = JSON.parse(readFileSync(new URL('editor/public/data/en/seo.json', root), 'utf8'));
const htmlUrl = new URL('editor/public/index.html', root);
let html = readFileSync(htmlUrl, 'utf8');

const escape = (value) => String(value)
  .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// og:url and og:image must be absolute URLs: resolve the image against the site URL.
let pageUrl = '';
try {
  pageUrl = new URL(seo.ogUrl).href;
} catch {
  console.warn('inject-seo: "ogUrl" in seo.json is not an absolute URL, so og:url and og:image stay empty.');
}
const imageUrl = pageUrl && seo.ogImage ? new URL(seo.ogImage, pageUrl).href : '';

const tags = [
  [/<title>[^<]*<\/title>/, `<title>${escape(seo.ogTitle)}</title>`],
  [/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escape(seo.description)}">`],
  [/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escape(seo.ogTitle)}">`],
  [/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${escape(seo.ogDescription)}">`],
  [/<meta name="twitter:card" content="[^"]*">/, `<meta name="twitter:card" content="${escape(seo.twitterCard)}">`],
];
if (pageUrl) {
  tags.push([/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${escape(pageUrl)}">`]);
}
if (imageUrl) {
  tags.push([/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${escape(imageUrl)}">`]);
}

for (const [pattern, replacement] of tags) {
  if (!pattern.test(html)) {
    throw new Error(`inject-seo: ${pattern} was not found in editor/public/index.html`);
  }
  html = html.replace(pattern, () => replacement);
}
writeFileSync(htmlUrl, html);
console.log(`inject-seo: wrote ${tags.length} tags${imageUrl ? ` (og:image ${imageUrl})` : ''}`);
