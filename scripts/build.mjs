import { mkdir, readdir, copyFile, cp, readFile, writeFile } from 'node:fs/promises';
import {renderPage} from './templates.mjs';
await mkdir('dist', { recursive: true });
const files = (await readdir('.')).filter(name => /\.(html|css|js|xml|txt)$/.test(name));
for (const file of files) {
 if(file.endsWith('.html'))await writeFile(`dist/${file}`,renderPage(await readFile(file,'utf8')));
 else await copyFile(file, `dist/${file}`);
}
await cp('assets', 'dist/assets', { recursive: true });
console.log(`Built ${files.length} public files and assets. Server code, partials and documentation excluded.`);
