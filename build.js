// Builds the site in two languages from src/:
//   index.html     – Hebrew (main language, right-to-left)
//   en/index.html  – English (left-to-right)
// Shared: src/style.css, src/script.js, src/images/*.webp (embedded as data URIs).
// Per language: src/body.he.html, src/body.en.html.
// Usage: node build.js
const fs = require('fs'), path = require('path');
const root = __dirname;
const SITE = 'https://prdsbi.com';
const read = f => fs.readFileSync(path.join(root, 'src', f), 'utf8');

const LANGS = {
  he: {
    out: 'index.html', dir: 'rtl', locale: 'he_IL', url: SITE + '/',
    title: 'פרד"ס חקירות — חקירות פרטיות ומודיעין עסקי',
    desc: 'פרד"ס חקירות – משרד חקירות פרטיות ומודיעין עסקי מורשה מטעם משרד המשפטים: חקירות כלכליות, איתור נכסים, בדיקות נאותות, בדיקות רקע וחקירות סייבר, בישראל ובחו"ל.'
  },
  en: {
    out: 'en/index.html', dir: 'ltr', locale: 'en_US', url: SITE + '/en/',
    title: 'Pardes Investigations — Private Investigations & Business Intelligence',
    desc: 'Pardes Investigations is a private investigation and business intelligence firm licensed by the Israeli Ministry of Justice: financial investigations, asset tracing, due diligence, background checks and cyber investigations, in Israel and abroad.'
  }
};

const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const img = html => html.replace(/\{\{IMG:(\w+)\}\}/g, (m, name) =>
  'data:image/webp;base64,' + fs.readFileSync(path.join(root, 'src', 'images', name + '.webp')).toString('base64'));

const css = read('style.css'), js = read('script.js');

for (const [code, L] of Object.entries(LANGS)) {
  const other = Object.entries(LANGS).find(([c]) => c !== code)[1];
  const head = [
    '<!DOCTYPE html>',
    `<html lang="${code}" dir="${L.dir}">`,
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">',
    `<title>${esc(L.title)}</title>`,
    `<meta name="description" content="${esc(L.desc)}">`,
    `<link rel="canonical" href="${L.url}">`,
    `<link rel="alternate" hreflang="he" href="${LANGS.he.url}">`,
    `<link rel="alternate" hreflang="en" href="${LANGS.en.url}">`,
    `<link rel="alternate" hreflang="x-default" href="${LANGS.he.url}">`,
    '<meta property="og:type" content="website">',
    `<meta property="og:title" content="${esc(L.title)}">`,
    `<meta property="og:description" content="${esc(L.desc)}">`,
    `<meta property="og:url" content="${L.url}">`,
    `<meta property="og:locale" content="${L.locale}">`,
    `<meta property="og:locale:alternate" content="${other.locale}">`,
    '<meta name="claude:viewport-fit-sides" content="cover">',
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700;800&display=swap" rel="stylesheet">',
    '<style>', css, '</style>',
    '</head>',
    '<body>'
  ].join('\n');
  const html = img(head + '\n' + read(`body.${code}.html`) + '\n<script>\n' + js + '</script>\n</body>\n</html>\n');
  fs.mkdirSync(path.dirname(path.join(root, L.out)), { recursive: true });
  fs.writeFileSync(path.join(root, L.out), html);
  console.log(L.out + ' written (' + html.length + ' bytes)');
}
