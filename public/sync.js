const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const src = path.join(__dirname, 'src');
const out = __dirname;

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
};

// 1. Read original atomic files
const originalSrc = {};
const files = fs.readdirSync(src);
for (const file of files) {
  if (file.endsWith('.html')) {
    originalSrc[file] = fs.readFileSync(path.join(src, file), 'utf-8');
  }
}

const updates = {};
let hasUpdates = false;

// 2. Read assembled files and extract partials
for (const [page, partials] of Object.entries(pages)) {
  const pagePath = path.join(out, page);
  if (!fs.existsSync(pagePath)) continue;
  
  const pageContent = fs.readFileSync(pagePath, 'utf-8');
  
  for (const partial of partials) {
    const startMarker = `<!-- START: ${partial} -->\\n`;
    const endMarker = `\\n<!-- END: ${partial} -->`;
    
    const startIndex = pageContent.indexOf(startMarker);
    if (startIndex === -1) continue; // If markers are missing, skip
    
    const contentStart = startIndex + startMarker.length;
    
    // Find the end marker after the content start
    const endIndex = pageContent.indexOf(endMarker, contentStart);
    if (endIndex === -1) continue;
    
    const content = pageContent.substring(contentStart, endIndex);
    
    if (content !== originalSrc[partial]) {
      if (updates[partial] && updates[partial] !== content) {
        console.warn(`[WARN] Conflict found for ${partial} in ${page}. Overwriting previous update.`);
      }
      updates[partial] = content;
      hasUpdates = true;
    }
  }
}

// 3. Write updates back to atomic files
if (hasUpdates) {
  for (const [partial, content] of Object.entries(updates)) {
    fs.writeFileSync(path.join(src, partial), content);
    console.log(`✅ Synced changes from built files back to src/${partial}`);
  }
  
  console.log('\\nRunning build to ensure all pages are in sync...');
  execSync('node build.js', { stdio: 'inherit', cwd: __dirname });
} else {
  console.log('No changes found in assembled files. (Make sure you ran build.js once to insert markers before making changes!)');
}
