// Service worker: shows push notifications and opens the right group when one is tapped. It caches nothing.
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('push',e=>{
  let d={};try{d=e.data?e.data.json():{}}catch(_){}
  e.waitUntil(self.registration.showNotification(d.title||'Splitly',{body:d.body||'',icon:'/icon-192.png',badge:'/icon-192.png',tag:d.tag,renotify:true,data:{url:d.url||'/'}}));
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const url=e.notification.data?.url||'/';
  e.waitUntil((async()=>{
    const all=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    for(const c of all){if('focus' in c){await c.focus();c.postMessage({openGroup:new URL(url,self.location.origin).searchParams.get('g')});return}}
    await self.clients.openWindow(url);
  })());
});
