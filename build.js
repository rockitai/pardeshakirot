// Builds index.html from src/template.html, embedding src/images/*.webp as data URIs.
// Usage: node build.js
const fs = require('fs'), path = require('path');
const root = __dirname;
let html = fs.readFileSync(path.join(root, 'src', 'template.html'), 'utf8');
html = html.replace(/\{\{IMG:(\w+)\}\}/g, (m, name) => {
  const file = path.join(root, 'src', 'images', name + '.webp');
  return 'data:image/webp;base64,' + fs.readFileSync(file).toString('base64');
});
fs.writeFileSync(path.join(root, 'index.html'), html);
console.log('index.html written (' + html.length + ' bytes)');
