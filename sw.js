const CACHE='saju-talktalk-15.1';
const CORE=[
  './','./index.html','./styles.css?v=15.1','./v8.css?v=15.1','./v10.css?v=15.1','./v12.css?v=15.1','./v13.css?v=15.1','./v14.css?v=15.1','./v15.css?v=15.1',
  './app.js?v=15.1','./v8.js?v=15.1','./v10.js?v=15.1','./v12.js?v=15.1','./v13.js?v=15.1','./v14.js?v=15.1','./v15.js?v=15.1',
  './manifest.webmanifest?v=15.1','./icon-192.png','./icon-512.png'
];
self.addEventListener('install',e=>e.waitUntil((async()=>{
  const c=await caches.open(CACHE);
  for(const u of CORE){try{const r=await fetch(u,{cache:'reload'});if(r.ok)await c.put(u,r)}catch{}}
  await self.skipWaiting();
})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
  await self.clients.claim();
})()));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  const same=url.origin===self.location.origin;
  const isCode=same && /\.(?:js|css|html|webmanifest)$/.test(url.pathname);
  if(e.request.mode==='navigate'||isCode){
    e.respondWith((async()=>{
      try{
        const r=await fetch(e.request,{cache:'no-store'});
        if(r.ok){const c=await caches.open(CACHE);c.put(e.request,r.clone()).catch(()=>{})}
        return r;
      }catch{
        return (await caches.match(e.request)) || (e.request.mode==='navigate'?await caches.match('./index.html'):Response.error());
      }
    })());
    return;
  }
  e.respondWith((async()=>{
    const c=await caches.match(e.request);
    if(c)return c;
    try{
      const r=await fetch(e.request);
      if(r.ok){const ca=await caches.open(CACHE);ca.put(e.request,r.clone()).catch(()=>{})}
      return r;
    }catch{return Response.error()}
  })());
});
