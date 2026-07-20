const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'src');
const out = __dirname;

const partial = name => fs.readFileSync(path.join(src, name), 'utf-8');

const pages = {
  'index.html': [
    '_head.html',
    '_nav.html',
    '_hero.html',
    '_about.html',
    '_expertise.html',
    '_reviews.html',
    '_projects.html',
    '_badges.html',
    '_serving.html',
    '_projects.html',
    '_badges.html',
    '_serving.html',
    '_map.html',
    '_footer.html',
    '_scripts.html',
  ],
  'residential.html': [
    '_head-residential.html',
    '_nav.html',
    '_hero-residential.html',
    '_content-residential.html',
    '_about.html',
    '_expertise.html',
    '_reviews.html',
    '_projects.html',
    '_badges.html',
    '_serving.html',
    '_map.html',
    '_footer.html',
    '_scripts.html',
  ],
  'contact.html': [
    '_head-contact.html',
    '_nav.html',
    '_hero-contact.html',
    '_content-contact.html',
    '_about.html',
    '_expertise.html',
    '_reviews.html',
    '_projects.html',
    '_badges.html',
    '_serving.html',
    '_map.html',
    '_serving.html',
    '_footer.html',
    '_scripts.html',
  ],
};

for (const [filename, partials] of Object.entries(pages)) {
  const html = partials.map(partial).join('\n');
  fs.writeFileSync(path.join(out, filename), html);
  console.log(`Built demo/${filename}`);
}
