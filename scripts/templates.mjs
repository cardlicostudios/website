import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
export function cssHash(css=readFileSync('styles.css')) {return createHash('sha256').update(css).digest('hex').slice(0,16);}
export function renderPage(source, readPartial=name=>readFileSync(`partials/${name}.html`,'utf8')) {
 const html=source.replace(/<!-- partial:([a-z]+) -->/g,(_,name)=>{
  if(!['nav','footer','stores'].includes(name))throw new Error('Unknown partial');
  return readPartial(name);
 }).replaceAll('{{cssHash}}',cssHash());
 if(/<!-- partial:|\{\{/.test(html))throw new Error('Unresolved template');
 return html;
}
