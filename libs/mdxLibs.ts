import path from 'path';
import fs from 'fs';

const cwd = process.cwd();
export const getMdxPath = path.join(cwd, 'blog-content');
export const getPostFiles = fs.readdirSync(getMdxPath).filter((p) => p.endsWith('.md'));
