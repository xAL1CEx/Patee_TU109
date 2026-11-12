// Service worker: shows push notifications and opens the right group when one is tapped. It caches nothing.
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('push',e=>{
  let d={};try{d=e.data?e.data.json():{}}catch(_){}
  e.waitUntil(self.registration.showNotification(d.title||'Splitly',{body:d.body||'',icon:'/icon-192.png',badge:'/icon-192.png',tag:d.tag,renotify:true,data:{url:d.url||'/'}}));
});
// The push service can replace a device's subscription (after a long idle, for instance): take a new one and tell the server.
self.addEventListener('pushsubscriptionchange',e=>e.waitUntil((async()=>{
  const {key}=await (await fetch('/api/push/key',{credentials:'same-origin'})).json();
  const raw=atob(key.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-key.length%4)%4));
  const sub=await self.registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:Uint8Array.from(raw,c=>c.charCodeAt(0))});
  await fetch('/api/push/subscribe',{method:'POST',credentials:'same-origin',headers:{'content-type':'application/json'},body:JSON.stringify({sub:sub.toJSON()})});
})().catch(()=>{})));
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const url=e.notification.data?.url||'/';
  e.waitUntil((async()=>{
    const all=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    for(const c of all){if('focus' in c){await c.focus();c.postMessage({openGroup:new URL(url,self.location.origin).searchParams.get('g')});return}}
    await self.clients.openWindow(url);
  })());
});
