import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
const root=resolve('dist');
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.xml':'application/xml','.txt':'text/plain'};
http.createServer(async(req,res)=>{
 let path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(path==='/api/signup'){res.writeHead(503,{'Content-Type':'application/json'});res.end('{"message":"Preview requires Vercel server configuration"}');return;}
 if(path==='/')path='/index.html';else if(!extname(path))path+='.html';
 const file=resolve(root,'.'+path);
 if(!file.startsWith(root+'/')&&!file.startsWith(root+'\\')){res.writeHead(403);res.end();return;}
 try{const data=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream'});res.end(data);}catch{res.writeHead(404);res.end('Not found');}
}).listen(4180,'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:4180'));
