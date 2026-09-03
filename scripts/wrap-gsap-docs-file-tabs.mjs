#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HTML_SNIPPETS, docsTabTitleFor, htmlTitleFor } from './gsap-demo-html-snippets.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const gsapDir = path.join(root, 'content/learn/gsap-react');

const blockRe =
  /(<ComponentPreview[^>]*>\s*\n\s*<Gsap[A-Za-z]+[^>]*\/?>\s*\n\n)(```(?:tsx|css|html) title="([^"]+)"\n)([\s\S]*?```)(\s*\n<\/ComponentPreview>)/g;

function wrapBlock(match, prefix, fenceOpen, fileTitle, codeBlock, suffix) {
  if (prefix.includes('<DocsFileTabs')) return match;

  const html = HTML_SNIPPETS[fileTitle];
  if (!html) {
    console.warn(`Missing HTML snippet for: ${fileTitle}`);
    return match;
  }

  const tabTitle = docsTabTitleFor(fileTitle);
  const htmlTitle = htmlTitleFor(fileTitle);

  return `${prefix}  <DocsFileTabs title="${tabTitle}">

${fenceOpen}${codeBlock}

\`\`\`html title="${htmlTitle}"
${html}
\`\`\`

  </DocsFileTabs>${suffix}`;
}

function transformFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  const updated = original.replace(blockRe, wrapBlock);
  if (updated !== original) {
    fs.writeFileSync(filePath, updated);
    console.log('Updated:', path.relative(root, filePath));
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.mdx') && entry.name !== 'index.mdx') transformFile(full);
  }
}

walk(gsapDir);
console.log('Done.');
