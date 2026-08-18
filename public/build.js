const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'src');
const out = __dirname;

const partial = name => {
  const content = fs.readFileSync(path.join(src, name), 'utf-8');
  // Avoid duplicating newlines if content already has them
  return `<!-- START: ${name} -->\n${content}\n<!-- END: ${name} -->`;
};

const pages = {
  'index.html': [
    '_head.html',
    '_nav.html',
    '_hero.html',
    '_about.html',
    '_expertise.html',
    '_reviews.html',
    '_projects.html',
    '_articles.html',
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
    '_footer.html',
    '_scripts.html',
  ],
  'when-to-upgrade-electrical-panel.html': [
    '_head-panel.html',
    '_nav.html',
    '_article-panel.html',
    '_footer.html',
    '_scripts.html',
  ],
  'whole-home-generators-northern-michigan.html': [
    '_head-generator.html',
    '_nav.html',
    '_article-generator.html',
    '_footer.html',
    '_scripts.html',
  ],
  'ev-charger-installation-traverse-city.html': [
    '_head-ev.html',
    '_nav.html',
    '_article-ev.html',
    '_footer.html',
    '_scripts.html',
  ],
  'older-home-wiring-safety.html': [
    '_head-wiring.html',
    '_nav.html',
    '_article-wiring.html',
    '_footer.html',
    '_scripts.html',
  ],
  'led-smart-lighting-upgrades.html': [
    '_head-lighting.html',
    '_nav.html',
    '_article-lighting.html',
    '_footer.html',
    '_scripts.html',
  ],
};

for (const [filename, partials] of Object.entries(pages)) {
  const html = partials.map(partial).join('\n');
  fs.writeFileSync(path.join(out, filename), html);
  console.log(`Built public/${filename}`);
}
