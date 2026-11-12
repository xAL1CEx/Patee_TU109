/* ================= icons ================= */
const I={
  food:'<path d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 0-3 2-3 5s1 4 3 4v9"/>',
  car:'<path d="M5 16V11l2-5h10l2 5v5M5 16h14M5 16v2M19 16v2"/>',
  bed:'<path d="M3 18V7M3 13h18v5M21 13a3 3 0 0 0-3-3h-7v3"/><circle cx="7" cy="10.5" r="1.5"/>',
  ticket:'<path d="M4 10a2 2 0 0 0 0 4v4h16v-4a2 2 0 0 1 0-4V6H4z"/><path d="M14 8v8" stroke-dasharray="2 2"/>',
  bag:'<path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2"/>',
  other:'<circle cx="6" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="18" cy="12" r="1"/>',
  shuffle:'<circle cx="12" cy="12" r="9"/><path d="M12 3v9l6 4M12 12L6 16"/>',
  pin:'<path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  home:'<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-5h4v5"/>',
  list:'<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  chart:'<path d="M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3"/>',
  wallet:'<path d="M4 7h14a2 2 0 0 1 2 2v9H4zM4 7l11-3v3"/><circle cx="16" cy="13" r="1"/>',
  qr:'<path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2"/>',
  scan:'<path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M4 12h16"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0"/>',
  people:'<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14c3 0 5 2 5 5"/>',
  receipt:'<path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6"/>',
  copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V4H4v12h4"/>',
  check:'<path d="M5 12l5 5 9-10"/>',
  chev:'<path d="M9 6l6 6-6 6"/>',
  down:'<path d="M6 9l6 6 6-6"/>',
  x:'<path d="M6 6l12 12M18 6L6 18"/>',
  save:'<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  send:'<path d="M4 12l16-8-6 16-3-7z"/>',
  cal:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  invite:'<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5M19 8v6M16 11h6"/>'
};
const ic=(n,s=20,w=1.8)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;
const CATS={food:'อาหาร',car:'เดินทาง',bed:'ที่พัก',ticket:'กิจกรรม',bag:'ช้อปปิ้ง',other:'อื่น ๆ'};
const BANKS=['กสิกรไทย','ไทยพาณิชย์','กรุงเทพ','กรุงไทย','ทีทีบี','กรุงศรี','ออมสิน','ธ.ก.ส.','ยูโอบี','ซีไอเอ็มบี ไทย','แลนด์ แอนด์ เฮ้าส์','เกียรตินาคินภัทร'];
const KINDS=['ทริป','กลุ่ม','กิจกรรม'];
const INST_MIN=2000;
const POLL_MS=5000;
const TH_M=['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];

/* ================= helpers ================= */
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const r2=n=>Math.round(n*100)/100;
const baht=(n,d)=>'฿'+Number(n).toLocaleString('th-TH',{minimumFractionDigits:d??(Math.abs(n%1)>0.001?2:0),maximumFractionDigits:2});
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const nowISO=()=>new Date().toISOString();
const todayDate=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
// "1–3 ธ.ค." / "30 พ.ย. – 2 ธ.ค." / "5 ม.ค." from YYYY-MM-DD days
const fmtRange=(s,e)=>{if(!s)return '';if(!e||e===s)return fmtD(s);const a=new Date(s+'T00:00:00'),b=new Date(e+'T00:00:00');
  return a.getMonth()===b.getMonth()&&a.getFullYear()===b.getFullYear()?a.getDate()+'–'+fmtD(e):fmtD(s)+' – '+fmtD(e)};
function dateFields(px,t={}){
  return `<div class="two"><label class="f">วันเริ่ม<input class="inp" type="date" id="${px}-start" value="${esc(t.start||'')}"></label>
   <label class="f">วันสุดท้าย<input class="inp" type="date" id="${px}-end" value="${esc(t.end||'')}" ${t.start?`min="${esc(t.start)}"`:''}></label></div>`;
}
function wireDates(sh,px){
  const s=sh.querySelector('#'+px+'-start'),e=sh.querySelector('#'+px+'-end');
  s.onchange=()=>{e.min=s.value;if(s.value&&(!e.value||e.value<s.value))e.value=s.value};
}
// -> {start,end,dates}, or null (after a toast) when the days don't make sense
function readDates(sh,px){
  const start=sh.querySelector('#'+px+'-start').value,end=sh.querySelector('#'+px+'-end').value;
  if(end&&!start){toast('เลือกวันเริ่มก่อน');return null}
  if(start&&end&&end<start){toast('วันสุดท้ายต้องไม่ก่อนวันเริ่ม');return null}
  return {start,end:start?(end||start):'',dates:fmtRange(start,end||start)};
}
const fmtD=iso=>{if(!iso)return '';const d=new Date(iso.length===10?iso+'T00:00:00':iso);return isNaN(d)?'':d.getDate()+' '+TH_M[d.getMonth()]};
const addMonths=(iso,n)=>{const d=new Date(iso);d.setMonth(d.getMonth()+n);return d.toISOString()};
const LS={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
// Codex: keep these IDs in sync with the CSS palettes; this per-device preference is persisted locally.
const THEMES={light:'Light',dark:'Dark',dracula:'Dracula',cream:'Cream',ocean:'Ocean',forest:'Forest',earth:'Earth',sunset:'Sunset'};
let theme=LS.get('sp-theme','light');
if(!Object.hasOwn(THEMES,theme))theme='light';
document.documentElement.dataset.theme=theme;
function themePicker(){return `<section class="theme-setting"><div class="f">เลือกธีม</div><div class="seg">${Object.entries(THEMES).map(([id,label])=>`<button type="button" data-theme-choice="${id}" aria-pressed="${theme===id}">${label}</button>`).join('')}</div></section>`}
document.addEventListener('click',e=>{const b=e.target.closest('[data-theme-choice]');if(!b)return;theme=b.dataset.themeChoice;if(!Object.hasOwn(THEMES,theme))return;LS.set('sp-theme',theme);document.documentElement.dataset.theme=theme;document.querySelectorAll('[data-theme-choice]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.themeChoice===theme)))});
// percentages -> baht, in whole satang, so the parts always add up to the total exactly
function pctSplit(ps,amt){
  const ids=Object.keys(ps),S=ids.reduce((a,k)=>a+ps[k],0),cents=Math.round(amt*100);
  const raw=ids.map(k=>cents*ps[k]/S),fl=raw.map(Math.floor);let left=cents-fl.reduce((a,v)=>a+v,0);
  raw.map((v,i)=>[v-fl[i],i]).sort((a,b)=>b[0]-a[0]).forEach(([,i])=>{if(left>0){fl[i]++;left--}});
  const out={};ids.forEach((k,i)=>{if(fl[i]>0)out[k]=fl[i]/100});return out;
}
function eqSplit(ids,amt){const s={},n=ids.length,cents=Math.round(amt*100),b=Math.floor(cents/n);ids.forEach((id,i)=>s[id]=(b+(i<cents-b*n?1:0))/100);return s}

/* ================= account state (from server) ================= */
let user=null;          // {id, username, profile}
let profile=null;       // user.profile: {name,pp,bank,acct}
let groups=[];          // [{id,name,kind,dates}] groups this account belongs to
let authed=null;        // null = checking, false = signed out, true = signed in
let authTab='login';
let curId=LS.get('sp-cur',null);   // last opened group on this device (convenience only)
const entry=id=>groups.find(g=>g.id===id);
function setUser(u,list){user=u;profile=u?u.profile:null;authed=!!u;if(list)groups=list}

/* ================= group state (from server) ================= */
let G=null, me=null, loading=false, loadErr=null, offline=false, pending=null, busy=0;
let D={people:{},trips:{},expenses:{},payments:{},plans:{},reminders:{},spots:{}};

function adopt(g){
  G=g; curId=g.id; LS.set('sp-cur',curId); me=g.me;
  const e=entry(g.id); if(e){e.name=g.name; e.kind=g.kind} else groups.push({id:g.id,name:g.name,kind:g.kind,dates:g.dates});
  const mem=g.members||{};
  const order=Object.keys(mem).sort((a,b)=>(mem[a].joinedAt||'').localeCompare(mem[b].joinedAt||''));
  D={people:mem,trips:{[g.id]:{id:g.id,name:g.name,kind:g.kind,dates:g.dates,start:g.start||'',end:g.end||'',members:order,activities:g.activities||[],createdAt:g.createdAt}},
     expenses:g.expenses||{},payments:g.payments||{},plans:g.plans||{},reminders:g.reminders||{},spots:g.spots||{}};
  scheduleRender();
}

class ApiErr extends Error{constructor(status,code){super(code);this.status=status;this.code=code}}
async function api(path,opts={}){
  let res;
  try{res=await fetch('/api'+path,{...opts,headers:{'content-type':'application/json'}})}
  catch(e){offline=true;scheduleRender();throw new ApiErr(0,'offline')}
  if(offline){offline=false;scheduleRender()}
  let body={};try{body=await res.json()}catch(e){}
  if(!res.ok){
    if(res.status===401&&!path.startsWith('/auth')&&authed){signedOut();toast('กรุณาเข้าสู่ระบบอีกครั้ง')}
    throw new ApiErr(res.status,body.error||'error');
  }
  return body;
}
function signedOut(){setUser(null,[]);G=null;me=null;authTab='login';closeSheet();render()}

async function load(id,force){
  if(!entry(id))return;
  if(!G||G.id!==id){loading=true;loadErr=null;render()}
  try{
    const rev=(!force&&G&&G.id===id)?'?rev='+G.rev:'';
    const r=await api(`/groups/${id}${rev}`);
    loading=false;
    if(r.group)adopt(r.group);else scheduleRender();
  }catch(err){
    loading=false;
    if(!G||G.id!==id){loadErr=err.status===404?'notfound':'offline';render()}
  }
}
/* poll fast while someone is active, then back off, then stop until they touch the screen again (saves server calls) */
let lastAct=Date.now(),lastPoll=0;
const pollEvery=()=>{const idle=Date.now()-lastAct;return idle<60e3?POLL_MS:idle<300e3?15e3:idle<900e3?30e3:Infinity};
const wake=()=>{const was=Date.now()-lastAct;lastAct=Date.now();if(was>=900e3&&G&&document.visibilityState==='visible'){lastPoll=Date.now();load(G.id)}};
['pointerdown','keydown','touchstart','scroll'].forEach(e=>addEventListener(e,wake,{passive:true,capture:true}));
setInterval(()=>{if(document.visibilityState!=='visible'||!G||busy||pending)return;if(Date.now()-lastPoll<pollEvery()-500)return;lastPoll=Date.now();load(G.id)},POLL_MS);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&G){lastPoll=Date.now();load(G.id)}});

/* writes: apply locally right away, then send to the server one batch at a time */
function localApply(g,ops){
  g=structuredClone(g);
  for(const o of ops){
    if(o.op==='meta')Object.assign(g,o.doc);
    else if(o.op==='put')g[o.col]={...(g[o.col]||{}),[o.id]:{...o.doc,id:o.id}};
    else if(o.op==='del'){g[o.col]={...(g[o.col]||{})};delete g[o.col][o.id]}
  }
  return g;
}
let chain=Promise.resolve();
function send(ops){
  if(!G)return Promise.resolve(false);
  const gid=G.id;
  adopt(localApply(G,ops));
  busy++;
  const p=chain.then(async()=>{
    const r=await api(`/groups/${gid}/ops`,{method:'POST',body:JSON.stringify({ops})});
    if(G&&G.id===gid)adopt(r.group);
    return true;
  }).catch(err=>{
    if(err.status!==401)toast(err.code==='offline'?'ไม่มีอินเทอร์เน็ต บันทึกไม่สำเร็จ':err.code==='group_full'?'กลุ่มนี้ข้อมูลเต็มแล้ว':err.code==='not_your_member'?'แก้ข้อมูลของเพื่อนที่มีบัญชีไม่ได้':err.code==='cannot_remove_account'?'เอาเพื่อนที่มีบัญชีออกไม่ได้':err.code==='not_your_expense'?'แก้ได้เฉพาะคนที่บันทึกรายการนี้':err.code==='payer_must_record'?'คนที่จ่ายต้องเป็นคนบันทึกเอง':err.code==='bad_split'||err.code==='bad_amount'?'ยอดเงินหรือการแบ่งไม่ถูกต้อง':err.code==='payment_locked'?'รายการโอนนี้แก้ไม่ได้แล้ว':err.code==='not_your_payment'?'บันทึกได้เฉพาะการโอนของคุณเอง':'บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง');
    load(gid,true);return false;
  }).finally(()=>busy--);
  chain=p;return p;
}
const COLMAP={people:'members',expenses:'expenses',payments:'payments',plans:'plans',reminders:'reminders',spots:'spots'};
function put(col,obj){
  const {id,...doc}=obj;
  if(col==='trips')return send([{op:'meta',doc:{name:doc.name,kind:doc.kind,dates:doc.dates,start:doc.start,end:doc.end,activities:doc.activities}}]);
  return send([{op:'put',col:COLMAP[col],id,doc}]);
}
function del(col,id){return send([{op:'del',col:COLMAP[col],id}])}

/* ================= derived ================= */
const P=id=>D.people[id]||{name:'?',bank:'',acct:'',pp:''};
const avInner=p=>p.img?`<img alt="" src="${esc(p.img)}">`:esc((p.name||'?')[0]);
const av=(id,cls='')=>`<span class="av ${id===me?'me':''} ${cls}">${avInner(P(id))}</span>`;
const nm=id=>id===me?'คุณ':P(id).name;
const trip=()=>G?D.trips[G.id]:null;
const texp=t=>Object.values(D.expenses).filter(e=>e.trip===t.id).sort((a,b)=>((a.date||'')+(a.createdAt||'')).localeCompare((b.date||'')+(b.createdAt||'')));
// transfers count toward debts only after the receiver confirms them
const tpaid=t=>tpay(t).filter(p=>p.confirmed);
const pendingTo=(t,from,to)=>r2(tpay(t).filter(p=>!p.confirmed&&p.from===from&&p.to===to).reduce((a,p)=>a+p.amount,0));
const tpay=t=>Object.values(D.payments).filter(p=>p.trip===t.id).sort((a,b)=>(a.createdAt||'').localeCompare(b.createdAt||''));
function balances(t){
  const net={};(t.members||[]).forEach(m=>net[m]=0);
  texp(t).forEach(e=>{net[e.payer]=(net[e.payer]||0)+e.amount;for(const k in e.split)net[k]=(net[k]||0)-e.split[k]});
  tpaid(t).forEach(p=>{net[p.from]=(net[p.from]||0)+p.amount;net[p.to]=(net[p.to]||0)-p.amount});
  for(const k in net)net[k]=r2(net[k]);
  return net;
}
// Who owes whom, pair by pair: for each expense, everyone in the split owes their share to the payer;
// a payment from A to B pays down what A owes B. Each pair is netted, so it can be traced item by item.
function settle(t){
  const owe={};const add=(a,b,v)=>{if(a===b||!v)return;owe[a+'|'+b]=(owe[a+'|'+b]||0)+v};
  texp(t).forEach(e=>{for(const k in e.split)add(k,e.payer,e.split[k])});
  tpaid(t).forEach(p=>add(p.from,p.to,-p.amount));
  const out=[],seen=new Set();
  for(const key in owe){const[a,b]=key.split('|'),pk=[a,b].sort().join('|');if(seen.has(pk))continue;seen.add(pk);
    const v=r2((owe[a+'|'+b]||0)-(owe[b+'|'+a]||0));
    if(v>0.009)out.push({from:a,to:b,amount:v});else if(v<-0.009)out.push({from:b,to:a,amount:-v})}
  return out.sort((x,y)=>y.amount-x.amount);
}
// Everything between me and one other person, oldest first. sign>0: they owe me more; <0: I owe them more.
function ledger(t,other){
  const rows=[];
  texp(t).forEach(e=>{
    if(e.payer===me&&e.split?.[other])rows.push({kind:'exp',e,v:e.split[other],date:e.date||e.createdAt});
    else if(e.payer===other&&e.split?.[me])rows.push({kind:'exp',e,v:-e.split[me],date:e.date||e.createdAt});
  });
  tpay(t).forEach(p=>{
    const k=p.confirmed?1:0;   // a transfer waiting for confirmation is listed but doesn't count yet
    if(p.from===other&&p.to===me)rows.push({kind:'pay',p,v:-p.amount*k,date:p.createdAt});
    else if(p.from===me&&p.to===other)rows.push({kind:'pay',p,v:p.amount*k,date:p.createdAt});
  });
  rows.sort((a,b)=>String(a.date||'').localeCompare(String(b.date||'')));
  let run=0;rows.forEach(r=>{run=r2(run+r.v);r.run=run});
  return {rows,net:run};
}
function planInfo(pl){
  const pays=Object.values(D.payments).filter(p=>p.plan===pl.id&&p.confirmed);
  const paid=r2(pays.reduce((a,p)=>a+p.amount,0)),count=pays.length,inst=r2(pl.total/pl.months),remaining=r2(pl.total-paid);
  return {paid,count,inst,remaining,done:remaining<0.01,due:addMonths(pl.startedAt,count),overdue:new Date(addMonths(pl.startedAt,count))<new Date()};
}
const activePlan=(t,from,to)=>Object.values(D.plans).find(p=>p.trip===t.id&&p.from===from&&p.to===to&&!planInfo(p).done);
const expOwner=e=>e.by||e.payer;
const canEditExp=e=>expOwner(e)===me;
// people I'm allowed to record as the payer: myself, or a friend who has no account
const payerChoices=t=>t.members.filter(m=>m===me||!P(m).claimed);
const myDebt=t=>r2(settle(t).filter(s=>s.from===me).reduce((a,s)=>a+s.amount,0));
const involved=(t,m)=>texp(t).some(e=>e.payer===m||e.split?.[m])||tpay(t).some(p=>p.from===m||p.to===m);

/* ================= PromptPay QR payload (EMVCo) ================= */
function crc16(s){let c=0xFFFF;for(let i=0;i<s.length;i++){c^=s.charCodeAt(i)<<8;for(let j=0;j<8;j++)c=c&0x8000?(c<<1)^0x1021:c<<1;c&=0xFFFF}return c.toString(16).toUpperCase().padStart(4,'0')}
function promptpay(id,amount){
  const f=(k,v)=>k+String(v.length).padStart(2,'0')+v;
  const n=String(id).replace(/\D/g,'');
  let target;
  if(n.length>=15)target=f('03',n);else if(n.length===13)target=f('02',n);else target=f('01',('0000000000000'+('66'+n.replace(/^0/,''))).slice(-13));
  let p=f('00','01')+f('01',amount?'12':'11')+f('29',f('00','A000000677010111')+target)+f('53','764');
  if(amount)p+=f('54',amount.toFixed(2));
  p+=f('58','TH')+'6304';
  return p+crc16(p);
}
const validPP=v=>{const n=String(v||'').replace(/\D/g,'');return n.length===10||n.length===13||n.length===15};

/* ================= invite links ================= */
const inviteUrl=g=>`${location.origin}/?join=${g.id}.${g.invite}`;
function parseJoin(text){
  try{const u=new URL(String(text).trim());const j=u.searchParams.get('join');if(!j)return null;const [id,token]=j.split('.');return id&&token?{id,token}:null}catch(e){return null}
}
// Opening an invite: if signed out, the invite waits until the person signs in or signs up.
async function startJoin(j){
  pending={...j,group:null,err:null};
  if(!authed){render();return}
  if(entry(j.id)){pending=null;history.replaceState(null,'','/');G=null;tab='home';await load(j.id);return}
  render();
  try{
    const r=await api(`/groups/${j.id}/preview?t=${encodeURIComponent(j.token)}`);
    if(r.joined){pending=null;history.replaceState(null,'','/');groups.push({id:j.id,name:r.preview.name,kind:r.preview.kind});G=null;await load(j.id);return}
    pending.group=r.preview;
    if(!Object.values(r.preview.members||{}).some(m=>!m.claimed)){await finishJoin(null);return}   // nobody to pick: go straight in
  }catch(err){if(err.status===401)return;pending.err=err.status===404?'ลิงก์เชิญนี้ใช้ไม่ได้ หรือกลุ่มถูกลบไปแล้ว':'เชื่อมต่อไม่ได้ ตรวจอินเทอร์เน็ตแล้วลองใหม่'}
  render();
}
async function finishJoin(claimId){
  const j=pending;
  try{
    const r=await api(`/groups/${j.id}/join?t=${encodeURIComponent(j.token)}`,{method:'POST',body:JSON.stringify({claim:claimId||null})});
    pending=null;history.replaceState(null,'','/');tab='home';adopt(r.group);toast('เข้าร่วม '+r.group.name+' แล้ว');
  }catch(err){toast(err.code==='already_claimed'?'ชื่อนี้มีคนรับไปแล้ว':'เข้าร่วมไม่สำเร็จ ลองใหม่อีกครั้ง');if(err.code==='already_claimed')startJoin(j)}
}

/* ================= render ================= */
let tab='home', actFilter='ทั้งหมด';
let rq=0;const scheduleRender=()=>{clearTimeout(rq);rq=setTimeout(render,0)};
const TABS=[['home','หน้าแรก','home'],['list','รายการ','list'],['add','','plus'],['sum','สรุป','chart'],['settle','เคลียร์เงิน','wallet']];

function render(){
  const v=$('#view');
  const t=(!pending&&profile&&G&&G.members[me])?trip():null;
  $('#tabsWrap').hidden=!t;
  $('#tripPick').hidden=!profile||!!pending||!groups.length;
  $('#meBtn').hidden=!profile||!!pending;
  if(profile){$('#meBtn').innerHTML=`<span class="av lg me">${avInner(profile)}</span>`}
  $('#tripPick').innerHTML=`<span>${G?esc(G.name):'เลือกกลุ่ม'}</span>${ic('down',14)}`;
  let top=offline?`<div class="modebar">ออฟไลน์อยู่ ข้อมูลอาจไม่อัปเดต</div>`:'';
  if(authed===null){v.innerHTML=`<div class="empty" style="background:none;padding-top:60px"><div class="spin"></div>กำลังเปิด Splitly…</div>`;return}
  if(!authed){v.innerHTML=top+vAuth();return}
  if(pending){v.innerHTML=top+vJoin();return}
  if(!groups.length){v.innerHTML=top+vNoGroup();return}
  if(loading||!G){
    if(loadErr==='notfound'){v.innerHTML=`<div class="empty">ไม่พบกลุ่มนี้ อาจถูกลบไปแล้ว<button class="btn line" data-do="leave">เอาออกจากรายการ</button><button class="btn" data-do="groups">เลือกกลุ่มอื่น</button></div>`;return}
    if(loadErr){v.innerHTML=`<div class="empty">โหลดข้อมูลไม่ได้ ตรวจอินเทอร์เน็ตแล้วลองใหม่<button class="btn" data-do="retry">ลองใหม่</button></div>`;return}
    v.innerHTML=`<div class="empty" style="background:none;padding-top:60px"><div class="spin"></div>กำลังโหลดกลุ่ม…</div>`;return;
  }
  if(!t){v.innerHTML=`<div class="empty">คุณไม่ได้อยู่ในกลุ่มนี้แล้ว<button class="btn line" data-do="leave">เอาออกจากรายการ</button></div>`;return}
  $('#tabs').innerHTML=TABS.map(([k,l,i])=>k==='add'
    ?`<button data-open="addExp" aria-label="เพิ่มค่าใช้จ่าย"><span class="plus">${ic('plus',22,2.2)}</span></button>`
    :`<button data-tab="${k}" ${tab===k?'aria-current="page"':''}>${ic(i,21)}<span>${l}</span></button>`).join('');
  v.innerHTML=top+({home:vHome,list:vList,sum:vSum,settle:vSettle})[tab](t);
}

// Receive money by ONE method: PromptPay or a bank account. Required for your own account,
// optional for a friend you add who doesn't use the app.
function personFields(p,px='pf',required=true){
  const pay=p.pay||(p.pp?'pp':p.acct?'bank':'pp');
  return `<label class="f">ชื่อเล่น<input class="inp" id="${px}-name" value="${esc(p.name||'')}" placeholder="เช่น ต้น" maxlength="30" autocomplete="nickname"></label>
  <div class="f payset" id="${px}-payset" data-cur="${pay}"><span>รับเงินผ่าน${required?'':' (ไม่ใส่ก็ได้)'}</span>
   <div class="seg"><button type="button" data-paymethod="pp" aria-pressed="${pay==='pp'}">พร้อมเพย์</button><button type="button" data-paymethod="bank" aria-pressed="${pay==='bank'}">บัญชีธนาคาร</button></div></div>
  <label class="f" data-paybox="pp" ${pay==='pp'?'':'hidden'}>เบอร์พร้อมเพย์ หรือเลขบัตรประชาชน<input class="inp num" id="${px}-pp" value="${esc(p.pp||'')}" inputmode="numeric" placeholder="0812345678" maxlength="17"></label>
  <div class="two" data-paybox="bank" ${pay==='bank'?'':'hidden'}><label class="f">ธนาคาร<select class="inp" id="${px}-bank"><option value="">เลือกธนาคาร</option>${BANKS.map(b=>`<option ${b===p.bank?'selected':''}>${b}</option>`).join('')}</select></label>
  <label class="f">เลขบัญชี<input class="inp num" id="${px}-acct" value="${esc(p.acct||'')}" inputmode="numeric" placeholder="xxx-x-xxxxx-x" maxlength="20"></label></div>`;
}
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-paymethod]');if(!b)return;
  const set=b.closest('.payset'),pay=b.dataset.paymethod;set.dataset.cur=pay;
  set.querySelectorAll('[data-paymethod]').forEach(x=>x.setAttribute('aria-pressed',x===b));
  set.parentElement.querySelectorAll('[data-paybox]').forEach(x=>x.hidden=x.dataset.paybox!==pay);
});
const validAcct=v=>{const n=String(v||'').replace(/\D/g,'').length;return n>=10&&n<=15&&!/[^\d\s-]/.test(v)};
function readPerson(root,px='pf',required=true){
  const g=k=>root.querySelector('#'+px+'-'+k).value.trim();
  const name=g('name'),pay=root.querySelector('#'+px+'-payset').dataset.cur;
  if(!name){toast('ใส่ชื่อเล่นก่อน');return null}
  if(pay==='pp'){
    const pp=g('pp').replace(/[^\d]/g,'');
    if(!pp&&required){toast('ใส่เบอร์พร้อมเพย์ก่อน');return null}
    if(pp&&!validPP(pp)){toast('พร้อมเพย์ต้องเป็นเบอร์ 10 หลัก หรือเลขบัตร 13 หลัก');return null}
    return {name,pay,pp,bank:'',acct:''};
  }
  const bank=g('bank'),acct=g('acct');
  if((required||acct)&&!bank){toast('เลือกธนาคารก่อน');return null}
  if((required||bank)&&!validAcct(acct)){toast('เลขบัญชีต้องเป็นตัวเลข 10–15 หลัก');return null}
  return {name,pay,pp:'',bank,acct};
}

function vAuth(){
  const reg=authTab==='register';
  const inv=pending?`<div class="alert">${ic('invite',20)}<div class="grow"><b>มีคำเชิญเข้ากลุ่มรออยู่</b><div class="muted">เข้าสู่ระบบหรือสมัครบัญชีก่อน แล้วจะพาเข้ากลุ่มให้ต่อ</div></div></div>`:'';
  return `<div class="welcome">
    <div class="hero"><div class="tier">Splitly</div><div class="big">หารเงินกับเพื่อน<br>ไม่ต้องทวงเอง</div><p class="muted" style="margin:0;max-width:30ch">จดค่าใช้จ่ายในทริปหรือกลุ่ม แอปคิดให้ว่าใครต้องโอนให้ใคร พร้อม QR พร้อมเพย์</p></div>
    ${inv}
    <div class="seg" style="justify-content:center"><button data-authtab="login" aria-pressed="${!reg}">เข้าสู่ระบบ</button><button data-authtab="register" aria-pressed="${reg}">สมัครบัญชีใหม่</button></div>
    <form id="authForm" style="display:grid;gap:12px" novalidate>
      <label class="f">ชื่อผู้ใช้<input class="inp" id="au-user" autocomplete="username" autocapitalize="none" spellcheck="false" maxlength="20" placeholder="${reg?'a-z, 0-9, _ หรือ . (3–20 ตัว)':''}"></label>
      <label class="f">รหัสผ่าน<input class="inp" id="au-pass" type="password" autocomplete="${reg?'new-password':'current-password'}" maxlength="200" placeholder="${reg?'อย่างน้อย 8 ตัวอักษร':''}"></label>
      ${reg?`<label class="f">ยืนยันรหัสผ่าน<input class="inp" id="au-pass2" type="password" autocomplete="new-password" maxlength="200"></label>
        <hr class="sep"><h2>โปรไฟล์ของคุณ</h2><p class="muted" style="margin:0">${pending?'ใส่แค่ชื่อเล่นก็เข้ากลุ่มได้ ช่องทางรับเงินมาใส่ทีหลังได้':'เพื่อนในกลุ่มจะเห็นชื่อเล่น และช่องทางรับเงินนี้ไว้โอนคืนคุณ'}</p>${personFields({},'pf',!pending)}`:''}
      <button class="btn block" type="submit" id="au-go">${reg?'สมัครและเริ่มใช้งาน':'เข้าสู่ระบบ'}</button>
    </form>
    ${themePicker()}
  </div>`;
}
const AUTH_ERR={username_taken:'ชื่อผู้ใช้นี้มีคนใช้แล้ว ลองชื่ออื่น',bad_username:'ชื่อผู้ใช้ใช้ได้เฉพาะ a-z, 0-9, _ และ . ยาว 3–20 ตัว',bad_password:'รหัสผ่านต้องยาวอย่างน้อย 8 ตัวอักษร',
  wrong_login:'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',too_many_attempts:'ลองผิดหลายครั้งเกินไป รอ 10 นาทีแล้วลองใหม่',bad_name:'ใส่ชื่อเล่นก่อน',bad_promptpay:'พร้อมเพย์ต้องเป็นเบอร์ 10 หลัก หรือเลขบัตร 13 หลัก',bad_bank:'เลือกธนาคารก่อน',bad_acct:'เลขบัญชีต้องเป็นตัวเลข 10–15 หลัก',offline:'ไม่มีอินเทอร์เน็ต'};
async function submitAuth(form){
  const reg=authTab==='register',btn=form.querySelector('#au-go');
  const username=form.querySelector('#au-user').value.trim().toLowerCase(),password=form.querySelector('#au-pass').value;
  if(!username||!password){toast('ใส่ชื่อผู้ใช้และรหัสผ่าน');return}
  let body={username,password};
  if(reg){
    if(password.length<8){toast(AUTH_ERR.bad_password);return}
    if(password!==form.querySelector('#au-pass2').value){toast('รหัสผ่านสองช่องไม่ตรงกัน');return}
    const p=readPerson(form,'pf',!pending);if(!p)return;if(pending&&!p.pp&&!p.acct)p.later=true;body.profile=p;
  }
  btn.disabled=true;
  try{
    const r=await api('/auth/'+(reg?'register':'login'),{method:'POST',body:JSON.stringify(body)});
    await afterSignIn(r.user);toast(reg?'สร้างบัญชีแล้ว ยินดีต้อนรับ '+r.user.profile.name:'ยินดีต้อนรับกลับ '+r.user.profile.name);
  }catch(err){btn.disabled=false;toast(AUTH_ERR[err.code]||'ทำรายการไม่สำเร็จ ลองใหม่อีกครั้ง')}
}
async function afterSignIn(u){
  const r=await api('/me');setUser(r.user,r.groups);G=null;
  if(pending){await startJoin({id:pending.id,token:pending.token});return}
  const first=entry(curId)?curId:groups[0]?.id;
  if(first)load(first);else render();
}
function vNoGroup(){
  return `<div class="hero"><div class="tier">สวัสดี ${esc(profile.name)}</div><h1>เริ่มจากกลุ่มแรก</h1><p class="muted" style="margin:0;max-width:32ch">สร้างกลุ่มแล้วให้เพื่อนสแกน QR หรือสแกน QR ของเพื่อนที่สร้างกลุ่มไว้แล้ว</p>
    <div class="hero-actions"><button class="btn" data-do="create">สร้างกลุ่มใหม่</button><button class="btn line" data-do="scan">${ic('scan',16)} สแกนเข้ากลุ่ม</button></div></div>`;
}
function vJoin(){
  const j=pending;
  if(j.err)return `<div class="empty">${esc(j.err)}<button class="btn line" data-do="cancelJoin">กลับ</button></div>`;
  if(!j.group)return `<div class="empty" style="background:none;padding-top:60px"><div class="spin"></div>กำลังเปิดลิงก์เชิญ…</div>`;
  const g=j.group, mem=Object.values(g.members||{});
  const free=mem.filter(m=>!m.claimed);
  return `<div class="hero"><div class="tier">คำเชิญเข้า${esc(g.kind||'กลุ่ม')}</div><h1>${esc(g.name)}</h1><div class="muted">${esc(g.dates||'')}${g.dates?' · ':''}สมาชิก ${mem.length} คน</div>
    <div class="avatars">${mem.slice(0,8).map(m=>`<span class="av">${esc((m.name||'?')[0])}</span>`).join('')}</div></div>
  ${profile?`<section style="display:grid;gap:12px">
      <button class="btn block" data-do="joinNew">เข้าร่วมในชื่อ ${esc(profile.name)}</button>
      ${free.length?`<div class="label" style="text-align:center">หรือ ถ้าเพื่อนเพิ่มชื่อคุณไว้แล้ว แตะชื่อของคุณ</div><div class="box list">${free.map(m=>`<button class="row" data-claim="${m.id}"><span class="av lg">${esc(m.name[0])}</span><div class="grow"><div class="t">ฉันคือ ${esc(m.name)}</div></div>${ic('chev',16)}</button>`).join('')}</div>`:''}
    </section>`
  :''}
  <button class="btn line block" data-do="cancelJoin">ยกเลิก</button>`;
}

function expRow(e){
  const mine=e.split?.[me]||0;
  return `<button class="row" data-exp="${e.id}"><span class="cat cat-${e.cat||'other'}">${ic(e.cat||'other',18)}</span>
   <div class="grow"><div class="t">${esc(e.title)}</div><div class="muted">${fmtD(e.date)} · ${e.payer===me?'คุณจ่าย':esc(P(e.payer).name)+' จ่าย'}<span class="tag">${esc(e.act||'')}</span></div></div>
   <div class="amt num">${baht(e.amount)}<div class="muted" style="font-weight:400">${mine?'ส่วนคุณ '+baht(mine):'ไม่เกี่ยวกับคุณ'}${canEditExp(e)?'':' '+ic('lock',11)}</div></div></button>`;
}

function alerts(t){
  const st=settle(t),out=[];
  tpay(t).filter(p=>p.to===me&&!p.confirmed).forEach(p=>out.push(`<div class="alert">${ic('check',20)}<div class="grow"><b>${esc(P(p.from).name)} แจ้งว่าโอนให้คุณแล้ว</b><div class="muted num">${baht(p.amount,2)} · ${fmtD(p.createdAt)}</div></div>
    <button class="btn sm" data-confirm="${p.id}">ได้รับแล้ว</button></div>`));
  st.filter(s=>s.from===me).forEach(s=>{
    const pl=activePlan(t,me,s.to),rem=Object.values(D.reminders).filter(r=>r.trip===t.id&&r.from===s.to&&r.to===me).sort((a,b)=>b.createdAt.localeCompare(a.createdAt))[0];
    const sub=pl?(()=>{const i=planInfo(pl);return `ผ่อนงวดที่ ${i.count+1}/${pl.months} · ${baht(Math.min(i.inst,s.amount),2)} ${i.overdue?'<span class="neg-t">เลยกำหนดแล้ว</span>':'ครบกำหนด '+fmtD(i.due)}`})()
      :`ค้างอยู่ ${baht(s.amount,2)}${pendingTo(t,me,s.to)?` · แจ้งโอนแล้ว ${baht(pendingTo(t,me,s.to),2)} รอยืนยัน`:rem?` · ${esc(P(s.to).name)} ทวงเมื่อ ${fmtD(rem.createdAt)}`:''}`;
    out.push(`<div class="alert">${ic('bell',20)}<div class="grow"><b>คุณยังไม่ได้จ่าย${esc(P(s.to).name)}</b><div class="muted num">${sub}</div></div><button class="btn sm" data-pay="${s.from}|${s.to}">จ่าย</button></div>`);
  });
  const owed=st.filter(s=>s.to===me);
  if(owed.length)out.push(`<div class="alert plain">${ic('wallet',20)}<div class="grow"><b>${owed.length} คนยังค้างคุณ</b><div class="muted num">รวม ${baht(owed.reduce((a,s)=>a+s.amount,0),2)}</div></div><button class="btn sm line" data-tab="settle">ดู / ทวง</button></div>`);
  if(!out.length&&texp(t).length)out.push(`<div class="alert plain">${ic('check',20)}<div class="grow"><b>เคลียร์ครบแล้ว</b><div class="muted">คุณไม่มียอดค้างในกลุ่มนี้</div></div></div>`);
  return out.join('');
}

const needPay=()=>profile&&!profile.pp&&!profile.acct;
function vHome(t){
  const ex=texp(t),total=ex.reduce((a,e)=>a+e.amount,0),net=balances(t);
  const myShare=ex.reduce((a,e)=>a+(e.split?.[me]||0),0),myPaid=ex.filter(e=>e.payer===me).reduce((a,e)=>a+e.amount,0);
  const alone=t.members.length<2;
  return `${needPay()?`<div class="alert">${ic('wallet',20)}<div class="grow"><b>ยังไม่ได้ใส่ช่องทางรับเงิน</b><div class="muted">เพื่อนจะโอนคืนคุณไม่ได้จนกว่าจะใส่</div></div><button class="btn sm" data-do="myPay">ใส่เลย</button></div>`:''}
  <section class="hero">
    <div style="display:grid;gap:4px;justify-items:center"><div class="tier">${esc(t.kind)}${t.dates?' · '+esc(t.dates):''}</div><h1>${esc(t.name)}</h1></div>
    <div class="hero-row"><div class="label">ค่าใช้จ่ายทั้งหมด</div><div class="big num">${baht(total)}</div>
      <button class="avatars" data-open="members" style="border:0;background:none;padding:0" aria-label="ดูสมาชิก">${t.members.slice(0,6).map(m=>av(m)).join('')}${t.members.length>6?`<span class="av">+${t.members.length-6}</span>`:''}</button></div>
    <div class="hero-actions"><button class="btn" data-open="addExp">เพิ่มค่าใช้จ่าย</button><button class="btn line" data-open="invite">${ic('qr',16)} เชิญเพื่อน</button></div>
    <div class="mini"><div><div class="label">ส่วนของคุณ</div><b class="num">${baht(r2(myShare))}</b></div><div><div class="label">คุณสำรองจ่าย</div><b class="num">${baht(myPaid)}</b></div><div><div class="label">ยอดสุทธิ</div><b class="num ${net[me]>0.009?'pos-t':net[me]<-0.009?'neg-t':''}">${net[me]>0?'+':''}${baht(net[me]||0)}</b></div></div>
  </section>
  ${alone?`<div class="alert">${ic('invite',20)}<div class="grow"><b>ยังมีแค่คุณในกลุ่มนี้</b><div class="muted">ให้เพื่อนสแกน QR เชิญเพื่อเข้ากลุ่ม</div></div><button class="btn sm" data-open="invite">แสดง QR</button></div>`:''}
  <div class="quick">
    <button data-open="addExp">${ic('receipt',22)}<span>เพิ่มรายการ</span></button>
    <button data-open="members">${ic('people',22)}<span>สมาชิก</span></button>
    <button data-tab="settle">${ic('wallet',22)}<span>จ่าย / QR</span></button>
    <button data-open="editTrip">${ic('edit',22)}<span>ตั้งค่ากลุ่ม</span></button>
  </div>
  ${alerts(t)}
  <button class="btn line block" data-open="food">${ic('food',18)} ไปกินที่ไหนดี? หาร้านอาหารให้กลุ่ม</button>
  <section><div class="sec-h"><h2>รายการล่าสุด</h2>${ex.length?'<button class="link" data-tab="list">ดูทั้งหมด</button>':''}</div>
    <div class="box list">${ex.slice(-4).reverse().map(expRow).join('')||`<div class="empty">ยังไม่มีค่าใช้จ่าย<button class="btn sm" data-open="addExp">เพิ่มรายการแรก</button></div>`}</div></section>
  <section><div class="sec-h"><h2>ยอดระหว่างคุณกับเพื่อน</h2></div>
    <div class="box list">${(()=>{
      const rows=t.members.filter(m=>m!==me).map(m=>({m,...ledger(t,m)})).filter(x=>x.rows.length)
        .sort((a,b)=>Math.abs(b.net)-Math.abs(a.net));
      return rows.map(({m,net:v})=>`<button class="row" data-ledger="${m}">${av(m,'lg')}<div class="grow"><div class="t">${esc(P(m).name)}</div>
        <div class="muted">${v>0.009?'ค้างคุณอยู่':v<-0.009?'คุณค้างอยู่':'เคลียร์กันแล้ว'}</div></div>
        <span class="amt num ${v>0.009?'pos-t':v<-0.009?'neg-t':''}">${baht(Math.abs(v),2)}</span>${ic('chev',16)}</button>`).join('')
        ||'<div class="empty">ยังไม่มีรายการที่เกี่ยวกับคุณกับเพื่อนคนไหน</div>';
    })()}</div></section>`;
}

function vList(t){
  const acts=['ทั้งหมด',...(t.activities||[])];
  if(!acts.includes(actFilter))actFilter='ทั้งหมด';
  const items=texp(t).filter(e=>actFilter==='ทั้งหมด'||e.act===actFilter).reverse();
  return `<div><h1>รายการค่าใช้จ่าย</h1><div class="muted">แตะรายการเพื่อแก้ไขหรือลบ</div></div>
  <div class="seg">${acts.map(a=>`<button data-filter="${esc(a)}" aria-pressed="${a===actFilter}">${esc(a)}</button>`).join('')}<button data-open="editTrip">+ กิจกรรม</button></div>
  <div class="box list">${items.map(expRow).join('')||'<div class="empty">ไม่มีรายการในกิจกรรมนี้</div>'}</div>
  <div class="muted num" style="text-align:right">รวม ${baht(items.reduce((a,e)=>a+e.amount,0))} · ${items.length} รายการ</div>`;
}

function vSum(t){
  const ex=texp(t),total=ex.reduce((a,e)=>a+e.amount,0);
  if(!ex.length)return `<h1>สรุปรายจ่าย</h1><div class="empty">ยังไม่มีข้อมูลให้สรุป</div>`;
  const byCat={},byAct={},paidBy={},share={};
  ex.forEach(e=>{byCat[e.cat]=(byCat[e.cat]||0)+e.amount;byAct[e.act]=(byAct[e.act]||0)+e.amount;paidBy[e.payer]=(paidBy[e.payer]||0)+e.amount;for(const k in e.split)share[k]=(share[k]||0)+e.split[k]});
  // Each section has its own color family (--c); inside it a bigger share gets a stronger shade, a smaller share a paler one.
  const bars=(obj,lab,base)=>{const ent=Object.entries(obj).sort((a,b)=>b[1]-a[1]),mx=ent.length?ent[0][1]:1;return ent.map(([k,v])=>`<div style="display:grid;gap:5px">
    <div style="display:flex;justify-content:space-between;gap:8px"><span>${lab(k)}</span><span class="num">${baht(r2(v))} <span class="muted">${Math.round(v/base*100)}%</span></span></div>
    <div class="bar"><i style="width:${v/base*100}%;--r:${(v/mx).toFixed(3)}"></i></div></div>`).join('')};
  return `<div><h1>สรุปรายจ่าย</h1><div class="muted">${esc(t.name)} · ${ex.length} รายการ</div></div>
  <div class="stats">
    <div class="stat"><span class="label">รวมทั้งหมด</span><b class="num">${baht(total)}</b></div>
    <div class="stat"><span class="label">ส่วนของคุณ</span><b class="num">${baht(r2(share[me]||0))}</b></div>
    <div class="stat"><span class="label">เฉลี่ยต่อคน</span><b class="num">${baht(Math.round(total/t.members.length))}</b></div>
    <div class="stat"><span class="label">คุณสำรองจ่าย</span><b class="num">${baht(paidBy[me]||0)}</b></div>
  </div>
  <section class="panel sumsec s1"><h2>ตามหมวดหมู่</h2>${bars(byCat,k=>CATS[k]||k,total)}</section>
  <section class="panel sumsec s2"><h2>ตามกิจกรรม</h2>${bars(byAct,k=>esc(k),total)}</section>
  <section class="panel sumsec s3"><h2>แต่ละคนใช้ไปเท่าไร</h2>${bars(share,k=>esc(P(k).name)+(k===me?' (คุณ)':''),total)}</section>`;
}

function vSettle(t){
  const st=settle(t),mine=st.filter(s=>s.from===me||s.to===me),others=st.filter(s=>s.from!==me&&s.to!==me);
  const line=s=>{
    const pl=activePlan(t,s.from,s.to),info=pl&&planInfo(pl);
    const iPay=s.from===me,iGet=s.to===me;
    return `<div class="row">${av(s.from,'lg')}<span class="muted">${ic('chev',14)}</span>${av(s.to,'lg')}
      <div class="grow" ${iPay||iGet?`data-ledgerrow="${iPay?s.to:s.from}" style="cursor:pointer"`:''}><div class="t">${esc(nm(s.from))} → ${esc(nm(s.to))}</div>
      <div class="muted">${pl?`ผ่อน ${info.count}/${pl.months} งวด`:iPay?'คุณต้องจ่าย':iGet?'รอรับเงิน':''}</div></div>
      <div style="display:grid;justify-items:end;gap:4px"><b class="num ${iPay?'neg-t':iGet?'pos-t':''}">${baht(s.amount,2)}</b>
      ${iPay?`<button class="btn sm" data-pay="${s.from}|${s.to}">จ่าย</button>`:iGet?`<button class="btn sm line" data-remind="${s.from}">ทวง</button>`:''}</div></div>`;
  };
  const plans=Object.values(D.plans).filter(p=>p.trip===t.id&&!planInfo(p).done);
  const pend=tpay(t).filter(p=>p.to===me&&!p.confirmed);
  return `<div><h1>เคลียร์เงิน</h1><div class="muted">แยกยอดตามคู่ แตะชื่อเพื่อดูว่ามาจากรายการไหน</div></div>
  ${pend.length?`<section><div class="sec-h"><h2>รอคุณยืนยันว่าได้รับเงิน</h2></div><div class="box list">${pend.map(p=>`<div class="row">${av(p.from,'lg')}<div class="grow"><div class="t">${esc(P(p.from).name)} โอนให้คุณ</div><div class="muted num">${baht(p.amount,2)} · ${fmtD(p.createdAt)}</div></div>
     <button class="btn sm line" data-reject="${p.id}">ยังไม่ได้รับ</button><button class="btn sm" data-confirm="${p.id}">ได้รับแล้ว</button></div>`).join('')}</div></section>`:''}
  <section><div class="sec-h"><h2>ที่เกี่ยวกับคุณ</h2></div><div class="box list">${mine.map(line).join('')||'<div class="empty">คุณไม่มียอดค้างในกลุ่มนี้</div>'}</div></section>
  ${plans.length?`<section><div class="sec-h"><h2>แผนผ่อนจ่าย</h2></div><div class="box list">${plans.map(p=>{const i=planInfo(p);return `<div class="row" style="display:grid;gap:8px">
     <div style="display:flex;justify-content:space-between;gap:8px"><span>${esc(nm(p.from))} ผ่อนจ่าย ${esc(nm(p.to))}</span><b class="num">${baht(i.inst,2)}/งวด</b></div>
     <div class="steps">${Array.from({length:p.months},(_,k)=>`<i class="${k<i.count?'on':''}"></i>`).join('')}</div>
     <div class="muted num">จ่ายแล้ว ${i.count}/${p.months} งวด · งวดถัดไป <span class="${i.overdue?'neg-t':''}">${fmtD(i.due)}</span> · คงเหลือ ${baht(i.remaining,2)}</div></div>`}).join('')}</div></section>`:''}
  ${others.length?`<section><div class="sec-h"><h2>ระหว่างเพื่อนคนอื่น</h2></div><div class="box list">${others.map(line).join('')}</div></section>`:''}
  <section><div class="sec-h"><h2>ประวัติการจ่าย</h2></div><div class="box list">${tpay(t).reverse().map(p=>`<div class="row"><span class="cat">${ic('check',17)}</span>
    <div class="grow"><div class="t">${esc(nm(p.from))} จ่าย ${esc(nm(p.to))}</div><div class="muted">${fmtD(p.createdAt)}${p.plan?' · ผ่อน':''}</div></div>
    <b class="num">${baht(p.amount,2)}</b><span class="state ${p.confirmed?'pos':'warn'}">${p.confirmed?'ยืนยันแล้ว':'รอยืนยัน'}</span>
    ${(p.to===me||(p.from===me&&!p.confirmed))?`<button class="x" data-unpay="${p.id}" aria-label="ลบรายการจ่ายนี้">${ic('x',14)}</button>`:''}</div>`).join('')||'<div class="empty">ยังไม่มีการจ่าย</div>'}</div></section>`;
}

/* ================= sheets ================= */
let scanStop=null;
function openSheet(title,html,onMount){
  closeSheet();
  $('#sheetRoot').innerHTML=`<div class="scrim" id="scrim"><div class="sheet gut" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="grip"></div>
    <div class="sheet-h"><h3>${esc(title)}</h3><button class="x" data-close aria-label="ปิด">${ic('x',16)}</button></div>${html}</div></div>`;
  $('#scrim').addEventListener('click',e=>{if(e.target.id==='scrim'||e.target.closest('[data-close]'))closeSheet()});
  onMount&&onMount($('.sheet'));
}
function closeSheet(){if(scanStop){scanStop();scanStop=null}$('#sheetRoot').innerHTML=''}
function toast(msg){$('#toastRoot').innerHTML=`<div class="toast" role="status">${esc(msg)}</div>`;clearTimeout(toast.t);toast.t=setTimeout(()=>$('#toastRoot').innerHTML='',2800)}
function twoTap(btn,label,fn){btn.dataset.orig=btn.textContent;btn.onclick=()=>{if(btn.dataset.armed){fn();return}btn.dataset.armed=1;btn.textContent=label;setTimeout(()=>{if(btn.isConnected){delete btn.dataset.armed;btn.textContent=btn.dataset.orig}},3000)}}
async function copy(text,msg){try{await navigator.clipboard.writeText(text);toast(msg||'คัดลอกแล้ว')}catch(e){toast(text)}}
function makeQR(el,text,size=400){el.innerHTML='';if(window.QRCode)new QRCode(el,{text,width:size,height:size,colorDark:'#262626',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.M});else el.textContent='โหลดตัวสร้าง QR ไม่ได้'}

function sheetGroups(){
  openSheet('กลุ่มของคุณ',`<div class="box list">${groups.map(g=>`<button class="row" data-switch="${g.id}">
     <span class="cat" style="${g.id===curId?'background:var(--ink);color:#fff':''}">${ic(g.kind==='กลุ่ม'?'people':g.kind==='ทริป'?'car':'cal',17)}</span>
     <div class="grow"><div class="t">${esc(g.name||'กลุ่ม')}</div><div class="muted">${esc(g.kind||'')}</div></div>${g.id===curId?'<span class="state">กำลังดู</span>':ic('chev',16)}</button>`).join('')}</div>
   <div class="two"><button class="btn" data-new>สร้างกลุ่มใหม่</button><button class="btn line" data-scan>${ic('scan',16)} สแกนเข้ากลุ่ม</button></div>`,sh=>{
    sh.querySelectorAll('[data-switch]').forEach(b=>b.onclick=()=>{closeSheet();actFilter='ทั้งหมด';tab='home';if(b.dataset.switch!==G?.id){G=null;load(b.dataset.switch)}});
    sh.querySelector('[data-new]').onclick=sheetCreate;
    sh.querySelector('[data-scan]').onclick=sheetScan;
  });
}

function sheetCreate(){
  let acts=['ทั่วไป'];
  openSheet('สร้างกลุ่มใหม่',`
   <label class="f">ชื่อกลุ่ม<input class="inp" id="cg-name" placeholder="เช่น ทริปเกาะล้าน" maxlength="60"></label>
   <label class="f">ประเภท<select class="inp" id="cg-kind">${KINDS.map(k=>`<option>${k}</option>`).join('')}</select></label>
   ${dateFields('cg')}
   <p class="muted" style="margin:0">สร้างแล้วจะได้ QR เชิญ ให้เพื่อนสแกนเข้ากลุ่มด้วยมือถือของตัวเอง</p>
   <button class="btn block" id="cg-go">สร้างกลุ่ม</button>`,sh=>{
    const go=sh.querySelector('#cg-go');wireDates(sh,'cg');
    go.onclick=async()=>{
      const name=sh.querySelector('#cg-name').value.trim();if(!name){toast('ใส่ชื่อกลุ่มก่อน');return}
      const dt=readDates(sh,'cg');if(!dt)return;
      go.disabled=true;go.textContent='กำลังสร้าง…';
      try{
        const r=await api('/groups',{method:'POST',body:JSON.stringify({meta:{name,kind:sh.querySelector('#cg-kind').value,...dt,activities:acts}})});
        tab='home';adopt(r.group);closeSheet();sheetInvite();
      }catch(e){go.disabled=false;go.textContent='สร้างกลุ่ม';toast(e.code==='offline'?'ไม่มีอินเทอร์เน็ต':e.code==='bad_dates'?'วันที่ไม่ถูกต้อง':'สร้างกลุ่มไม่สำเร็จ ลองใหม่')}
    };
    setTimeout(()=>sh.querySelector('#cg-name').focus(),60);
  });
}

function sheetInvite(){
  const url=inviteUrl(G);
  openSheet('เชิญเพื่อนเข้า '+G.name,`
   <div class="qrbox"><span class="pp">สแกนเพื่อเข้ากลุ่ม</span><div id="inv-qr"></div><div style="font-weight:600">${esc(G.name)}</div><div class="label">${Object.keys(G.members).length} คนในกลุ่มตอนนี้</div></div>
   <p class="muted" style="margin:0">ให้เพื่อนเปิดกล้องมือถือสแกน QR นี้ หรือกด "สแกนเข้ากลุ่ม" ใน Splitly ก็ได้</p>
   <div class="two"><a class="btn line" href="https://line.me/R/share?text=${encodeURIComponent('มาหารเงิน '+G.name+' ใน Splitly กัน\n'+url)}" target="_blank" rel="noopener">${ic('send',16)} ส่งทาง LINE</a>
   <button class="btn line" id="inv-copy">${ic('copy',16)} คัดลอกลิงก์</button></div>
   <p class="note" style="margin:0">เพื่อนต้องเข้าสู่ระบบหรือสมัครบัญชีก่อน แล้วจะเข้ากลุ่มได้เลย ส่ง QR หรือลิงก์นี้ให้เฉพาะคนในกลุ่ม</p>`,sh=>{
    makeQR(sh.querySelector('#inv-qr'),url);
    sh.querySelector('#inv-copy').onclick=()=>copy(url,'คัดลอกลิงก์เชิญแล้ว');
  });
}

function sheetScan(){
  openSheet('สแกน QR เข้ากลุ่ม',`
   <div class="scanbox"><video id="sc-v" playsinline muted></video><span class="scanframe"></span></div>
   <p class="muted" id="sc-msg" style="margin:0;text-align:center">เล็งกล้องไปที่ QR เชิญของเพื่อน</p>
   <label class="f">หรือวางลิงก์เชิญ<input class="inp" id="sc-link" placeholder="https://…/?join=…" inputmode="url"></label>
   <button class="btn line block" id="sc-go">เข้ากลุ่มจากลิงก์</button>`,async sh=>{
    let stopped=false,stream=null;
    const stop=()=>{stopped=true;if(stream)stream.getTracks().forEach(t=>t.stop())};
    scanStop=stop;
    const use=text=>{const j=parseJoin(text);if(!j)return false;closeSheet();startJoin(j);return true};
    sh.querySelector('#sc-go').onclick=()=>{if(!use(sh.querySelector('#sc-link').value))toast('ลิงก์นี้ไม่ใช่ลิงก์เชิญ Splitly')};
    const msg=sh.querySelector('#sc-msg'),v=sh.querySelector('#sc-v');
    if(!navigator.mediaDevices?.getUserMedia){msg.textContent='เบราว์เซอร์นี้เปิดกล้องไม่ได้ ใช้แอปกล้องมือถือสแกนแทน หรือวางลิงก์ด้านล่าง';return}
    try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'},audio:false})}
    catch(e){msg.textContent='เปิดกล้องไม่ได้ อนุญาตการใช้กล้อง หรือใช้แอปกล้องมือถือสแกนแทน';return}
    if(stopped){stop();return}
    v.srcObject=stream;try{await v.play()}catch(e){}
    const det=('BarcodeDetector' in window)?new BarcodeDetector({formats:['qr_code']}):null;
    const c=document.createElement('canvas'),g=c.getContext('2d',{willReadFrequently:true});
    let bad='';
    const tick=async()=>{
      if(stopped||!v.isConnected){stop();return}
      let text=null;
      try{
        if(det){const r=await det.detect(v);if(r[0])text=r[0].rawValue}
        else if(window.jsQR&&v.videoWidth){const w=Math.min(640,v.videoWidth),h=Math.round(v.videoHeight*w/v.videoWidth);c.width=w;c.height=h;g.drawImage(v,0,0,w,h);const r=jsQR(g.getImageData(0,0,w,h).data,w,h);if(r)text=r.data}
      }catch(e){}
      if(text&&text!==bad){if(use(text))return;bad=text;msg.textContent='QR นี้ไม่ใช่ QR เชิญของ Splitly'}
      requestAnimationFrame(tick);
    };
    tick();
  });
}

function sheetTripEdit(){
  const t=trip();let acts=[...(t.activities||[])];
  const isOwner=G.owner===me;
  openSheet('ตั้งค่ากลุ่ม',`
   <label class="f">ชื่อ<input class="inp" id="te-name" value="${esc(t.name)}" maxlength="60"></label>
   <label class="f">ประเภท<select class="inp" id="te-kind">${KINDS.map(k=>`<option ${k===t.kind?'selected':''}>${k}</option>`).join('')}</select></label>
   ${dateFields('te',t)}${t.dates&&!t.start?`<p class="note" style="margin:0">วันที่เดิม: ${esc(t.dates)} (เลือกวันใหม่จากปฏิทินได้)</p>`:''}
   <div class="label">กิจกรรมย่อย (ใช้แยกรายการ)</div><div class="chips" id="te-acts"></div>
   <div style="display:flex;gap:8px"><input class="inp" id="te-act" placeholder="เช่น ล่องแพ" maxlength="30"><button class="btn line" id="te-addact">เพิ่ม</button></div>
   <button class="btn block" id="te-save">บันทึก</button>
   <hr class="sep">
   <div class="sec-h" style="margin:0"><h2>สมาชิก</h2><button class="link" id="te-inv">เชิญด้วย QR</button></div>
   <div class="box list" id="te-mem"></div>
   <details class="box" style="padding:12px 14px"><summary style="cursor:pointer;font-weight:600">+ เพิ่มเพื่อนที่ไม่ได้ใช้แอป</summary><div style="display:grid;gap:10px;margin-top:12px"><p class="muted" style="margin:0">ถ้าเพื่อนคนนี้มาใช้แอปทีหลัง ตอนสแกนเข้ากลุ่มให้แตะ "ฉันคือ…" เพื่อรับชื่อนี้ไป</p>${personFields({},'nf',false)}<button class="btn line" id="nf-go">เพิ่มเพื่อนคนนี้</button></div></details>
   <hr class="sep">
   ${myDebt(t)>0?`<div class="alert plain">${ic('lock',18)}<div class="grow"><b>ยังออกจากกลุ่มไม่ได้</b><div class="muted num">คุณยังค้างเพื่อนอยู่ ${baht(myDebt(t),2)} จ่ายให้ครบก่อนถึงจะออกได้</div></div><button class="btn sm" data-goSettle>จ่าย</button></div>`
     :'<button class="btn line block" id="te-leave">ออกจากกลุ่มนี้</button>'}
   ${isOwner?(settle(t).length?`<div class="alert plain">${ic('lock',18)}<div class="grow"><b>ยังลบกลุ่มไม่ได้</b><div class="muted">ยังมีคนค้างเงินกันอยู่ ${settle(t).length} รายการ ลบได้เมื่อทุกคนเคลียร์ครบ</div></div></div>`:'<button class="btn danger block" id="te-del">ลบกลุ่มนี้ทั้งหมด</button>'):''}`,sh=>{
    const drawActs=()=>sh.querySelector('#te-acts').innerHTML=acts.map((a,i)=>`<span>${esc(a)}<button data-rm="${i}" aria-label="ลบ ${esc(a)}">${ic('x',12)}</button></span>`).join('')||'<span class="muted">ยังไม่มี</span>';
    const drawMem=()=>sh.querySelector('#te-mem').innerHTML=trip().members.map(m=>`<div class="row">${av(m,'lg')}<div class="grow"><div class="t">${esc(P(m).name)}${m===me?' (คุณ)':''}</div><div class="muted">${m===G.owner?'คนสร้างกลุ่ม':P(m).claimed?'ใช้แอปอยู่':'ยังไม่ได้ใช้แอป'}</div></div>
      ${m!==me&&!P(m).claimed&&!involved(t,m)?`<button class="x" data-kick="${m}" aria-label="เอา ${esc(P(m).name)} ออก">${ic('x',14)}</button>`:''}</div>`).join('');
    drawActs();drawMem();wireDates(sh,'te');
    sh.querySelector('#te-acts').onclick=e=>{const b=e.target.closest('[data-rm]');if(!b)return;acts.splice(+b.dataset.rm,1);drawActs()};
    sh.querySelector('#te-mem').onclick=async e=>{const b=e.target.closest('[data-kick]');if(!b)return;await del('people',b.dataset.kick);drawMem();toast('เอาออกจากกลุ่มแล้ว')};
    const addAct=()=>{const i=sh.querySelector('#te-act');const v=i.value.trim();if(v&&!acts.includes(v)){acts.push(v);drawActs()}i.value='';i.focus()};
    sh.querySelector('#te-addact').onclick=addAct;
    sh.querySelector('#te-act').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();addAct()}};
    sh.querySelector('#te-inv').onclick=sheetInvite;
    sh.querySelector('#nf-go').onclick=async()=>{
      const p=readPerson(sh,'nf',false);if(!p)return;
      await put('people',{id:uid(),...p,claimed:false,joinedAt:nowISO()});drawMem();
      ['name','pp','bank','acct'].forEach(k=>sh.querySelector('#nf-'+k).value='');toast('เพิ่ม '+p.name+' แล้ว');
    };
    sh.querySelector('#te-save').onclick=async()=>{
      const name=sh.querySelector('#te-name').value.trim();if(!name){toast('ใส่ชื่อก่อน');return}
      let dt=readDates(sh,'te');if(!dt)return;
      if(!dt.start&&!t.start)dt={start:'',end:'',dates:t.dates||''};   // keep an old free-text date untouched
      if(!acts.length)acts=['ทั่วไป'];
      closeSheet();if(await put('trips',{id:t.id,name,kind:sh.querySelector('#te-kind').value,...dt,activities:acts}))toast('บันทึกแล้ว');
    };
    const gs=sh.querySelector('[data-goSettle]');if(gs)gs.onclick=()=>{closeSheet();tab='settle';render();window.scrollTo(0,0)};
    const lv=sh.querySelector('#te-leave');if(lv)twoTap(lv,'แตะอีกครั้ง (ชื่อและรายการของคุณยังอยู่ในกลุ่ม)',async()=>{const id=G.id;closeSheet();try{await api(`/groups/${id}/leave`,{method:'POST'});leaveLocal(id);toast('ออกจากกลุ่มแล้ว')}catch(err){toast(err.code==='still_owe'?'ยังค้างเพื่อนอยู่ จ่ายให้ครบก่อนถึงจะออกได้':'ทำรายการไม่สำเร็จ ลองใหม่')}});
    const d=sh.querySelector('#te-del');
    if(d)twoTap(d,'แตะอีกครั้งเพื่อลบกลุ่มของทุกคน',async()=>{
      const id=G.id;closeSheet();
      try{await api(`/groups/${id}`,{method:'DELETE'});leaveLocal(id);toast('ลบกลุ่มแล้ว')}catch(err){toast(err.code==='has_debts'?'ยังมีคนค้างเงินกันอยู่ ลบกลุ่มไม่ได้':'ลบไม่สำเร็จ ลองใหม่')}
    });
  });
}
function leaveLocal(id){
  groups=groups.filter(g=>g.id!==id);
  G=null;me=null;loadErr=null;tab='home';
  if(groups[0])load(groups[0].id);else{curId=null;LS.set('sp-cur',null);render()}
}

function sheetMembers(){
  const t=trip();
  openSheet('สมาชิกและบัญชีรับเงิน',`<p class="muted" style="margin:0">ทุกคนในกลุ่มเห็นพร้อมเพย์และเลขบัญชีของกัน ไม่ต้องถามซ้ำ</p>
   <div class="box list">${t.members.map(m=>{const p=P(m);return `<div class="row">${av(m,'lg')}<div class="grow"><div class="t">${esc(p.name)}${m===me?' (คุณ)':''}</div>
     <div class="muted num">${p.pp?'พร้อมเพย์ '+esc(p.pp):'ยังไม่ใส่พร้อมเพย์'}</div><div class="muted num">${p.acct?esc(p.bank)+' '+esc(p.acct):''}</div></div>
     ${p.acct||p.pp?`<button class="x" data-copy="${esc((p.acct||p.pp).replace(/-/g,''))}" aria-label="คัดลอก">${ic('copy',15)}</button>`:''}
     ${m===me||!p.claimed?`<button class="x" data-person="${m}" aria-label="แก้ไขข้อมูล ${esc(p.name)}">${ic('edit',15)}</button>`:''}</div>`}).join('')}</div>
   <button class="btn block" data-inv>${ic('qr',16)} เชิญเพื่อนด้วย QR</button>`,sh=>{
     sh.querySelectorAll('[data-person]').forEach(b=>b.onclick=()=>sheetPerson(b.dataset.person));
     sh.querySelector('[data-inv]').onclick=sheetInvite;
   });
}

/* a profile photo is shrunk to a small square on the phone (about 4 KB) so it can travel with every group */
async function shrinkPhoto(file){
  const url=URL.createObjectURL(file);
  try{
    const im=await new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src=url});
    const side=Math.min(im.naturalWidth,im.naturalHeight);if(!side)throw new Error('empty');
    for(const [px,q] of [[112,.72],[96,.6],[80,.5],[64,.45]]){
      const c=document.createElement('canvas');c.width=c.height=px;
      c.getContext('2d').drawImage(im,(im.naturalWidth-side)/2,(im.naturalHeight-side)/2,side,side,0,0,px,px);
      const out=c.toDataURL('image/jpeg',q);
      if(out.length<=6500)return out;
    }
    throw new Error('too big');
  }finally{URL.revokeObjectURL(url)}
}

/* turn phone notifications on or off for this device (needs the app on the home screen on iPhone) */
async function pushBox(box){
  if(!box)return;
  const ios=/iphone|ipad/i.test(navigator.userAgent),standalone=navigator.standalone||matchMedia('(display-mode: standalone)').matches;
  const head='<div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><div><b>แจ้งเตือนบนเครื่องนี้</b><div class="muted">เด้งเมื่อมีรายการใหม่ ถูกทวง หรือมีคนโอนให้</div></div>';
  if(!('serviceWorker' in navigator)||!('PushManager' in window)||!('Notification' in window)){
    box.innerHTML=head+'</div>'+(ios&&!standalone?'<p class="note" style="margin:0">บน iPhone ต้องเพิ่ม Splitly ลงหน้าจอโฮมก่อน (ปุ่มแชร์ > เพิ่มไปยังหน้าจอโฮม) แล้วเปิดจากไอคอนนั้น ถึงจะเปิดแจ้งเตือนได้ (iOS 16.4 ขึ้นไป)</p>':'<p class="note" style="margin:0">เบราว์เซอร์นี้ยังไม่รองรับการแจ้งเตือน</p>');return}
  let reg=null,sub=null,on=false;
  try{reg=await navigator.serviceWorker.ready;sub=await reg.pushManager.getSubscription();
    if(sub&&Notification.permission==='granted')on=(await api('/push/status',{method:'POST',body:JSON.stringify({endpoint:sub.endpoint})})).on}catch(e){}
  const denied=Notification.permission==='denied';
  box.innerHTML=head+`<button class="btn sm ${on?'line':''}" id="pn-t" ${denied?'disabled':''}>${on?'ปิด':'เปิด'}</button></div>`+(denied?'<p class="note" style="margin:0">เครื่องนี้บล็อกการแจ้งเตือนไว้ ไปเปิดที่การตั้งค่าของเบราว์เซอร์หรือแอปก่อน</p>':'');
  const t=box.querySelector('#pn-t');if(!t)return;
  t.onclick=async()=>{
    t.disabled=true;
    try{
      if(on){if(sub){await api('/push/unsubscribe',{method:'POST',body:JSON.stringify({endpoint:sub.endpoint})});await sub.unsubscribe()}toast('ปิดแจ้งเตือนแล้ว')}
      else{
        if(await Notification.requestPermission()!=='granted'){toast('ไม่ได้รับอนุญาตให้แจ้งเตือน');return pushBox(box)}
        const {key}=await api('/push/key');
        const raw=atob(key.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-key.length%4)%4));
        sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:Uint8Array.from(raw,c=>c.charCodeAt(0))});
        await api('/push/subscribe',{method:'POST',body:JSON.stringify({sub:sub.toJSON()})});toast('เปิดแจ้งเตือนแล้ว');
      }
    }catch(e){toast('ตั้งค่าแจ้งเตือนไม่สำเร็จ ลองใหม่อีกครั้ง')}
    pushBox(box);
  };
}

function sheetPerson(id){
  const isMe=!id||id===me, p=isMe?profile:D.people[id];
  // Codex: place appearance controls directly after profile/payment fields so the setting is easy to find.
  openSheet(isMe?'บัญชีของคุณ':'ข้อมูลของ '+p.name,`${isMe?`<div class="kv"><button type="button" class="av xl me" id="pf-photo" aria-label="เปลี่ยนรูปโปรไฟล์">${avInner(profile)}</button><div class="grow"><div class="label">ชื่อผู้ใช้</div><b>@${esc(user.username)}</b><div style="display:flex;gap:12px"><button type="button" class="link" id="pf-pick">เปลี่ยนรูป</button><button type="button" class="link" id="pf-unpick" ${profile.img?'':'hidden'}>ลบรูป</button></div></div><input type="file" id="pf-file" accept="image/*" hidden></div>`:''}
   ${personFields(p,'pf',isMe)}
   ${isMe?themePicker():''}
   ${isMe?'<div class="box" id="pn-box" style="padding:12px 14px;display:grid;gap:8px"></div>':''}
   ${isMe?'<p class="muted" style="margin:0">ใช้กับบัญชีของคุณทุกเครื่อง และอัปเดตให้กลุ่มที่กำลังดูอยู่</p>':''}
   <button class="btn block" id="pf-save">บันทึก</button>
   ${isMe?`<hr class="sep"><details class="box" style="padding:12px 14px"><summary style="cursor:pointer;font-weight:600">เปลี่ยนรหัสผ่าน</summary><form id="pw-form" style="display:grid;gap:10px;margin-top:12px" novalidate>
     <input type="text" autocomplete="username" value="${esc(user.username)}" hidden>
     <label class="f">รหัสผ่านปัจจุบัน<input class="inp" type="password" id="pw-cur" autocomplete="current-password"></label>
     <label class="f">รหัสผ่านใหม่ (อย่างน้อย 8 ตัว)<input class="inp" type="password" id="pw-new" autocomplete="new-password"></label>
     <button class="btn line" type="submit">เปลี่ยนรหัสผ่าน</button><p class="note" style="margin:0">เครื่องอื่นที่ล็อกอินอยู่จะถูกออกจากระบบ</p></form></details>
     <button class="btn danger block" id="pf-out">ออกจากระบบ</button>`:''}`,sh=>{
    if(isMe)pushBox(sh.querySelector('#pn-box'));
    let img=isMe?(profile.img||''):'';
    if(isMe){
      const file=sh.querySelector('#pf-file'),ph=sh.querySelector('#pf-photo'),un=sh.querySelector('#pf-unpick');
      const paint=()=>{ph.innerHTML=avInner({name:profile.name,img});un.hidden=!img};
      sh.querySelector('#pf-pick').onclick=ph.onclick=()=>file.click();
      un.onclick=()=>{img='';paint()};
      file.onchange=async()=>{const f=file.files[0];file.value='';if(!f)return;
        try{img=await shrinkPhoto(f);paint()}catch(e){toast('ใช้รูปนี้ไม่ได้ ลองรูปอื่น')}};
    }
    const out=sh.querySelector('#pf-out');
    if(out)out.onclick=async()=>{try{await api('/auth/logout',{method:'POST'})}catch(e){}signedOut();toast('ออกจากระบบแล้ว')};
    const pw=sh.querySelector('#pw-form');
    if(pw)pw.onsubmit=async e=>{e.preventDefault();const c=sh.querySelector('#pw-cur').value,n=sh.querySelector('#pw-new').value;
      if(n.length<8){toast(AUTH_ERR.bad_password);return}
      try{await api('/auth/password',{method:'POST',body:JSON.stringify({current:c,next:n})});closeSheet();toast('เปลี่ยนรหัสผ่านแล้ว')}
      catch(err){toast(err.code==='wrong_password'?'รหัสผ่านปัจจุบันไม่ถูกต้อง':AUTH_ERR[err.code]||'เปลี่ยนไม่สำเร็จ')}};
    sh.querySelector('#pf-save').onclick=async()=>{
      const v=readPerson(sh,'pf',isMe);if(!v)return;
      if(isMe)v.img=img;
      if(isMe){try{const r=await api('/me',{method:'PUT',body:JSON.stringify({profile:v})});setUser(r.user)}catch(err){toast(AUTH_ERR[err.code]||'บันทึกไม่สำเร็จ');return}
        if(G&&G.members[me])await put('people',{...G.members[me],...v,id:me});render()}
      else await put('people',{...D.people[id],...v,id});
      closeSheet();toast('บันทึกแล้ว');
    };
  });
}

function sheetExpenseView(e){
  const t=trip();
  openSheet('รายละเอียดรายการ',`
   <div><div class="label">${esc(e.title)}</div><div class="big num">${baht(e.amount,2)}</div>
    <div class="muted">${fmtD(e.date)} · ${esc(nm(e.payer))} จ่าย${e.act?' · '+esc(e.act):''}</div></div>
   <div class="box list">${Object.entries(e.split||{}).map(([m,v])=>`<div class="row">${av(m)}<div class="grow"><div class="t">${esc(nm(m))}</div></div><span class="amt num">${baht(v,2)}</span></div>`).join('')}</div>
   <div class="alert plain">${ic('lock',18)}<div class="grow">แก้หรือลบได้เฉพาะ <b>${esc(nm(expOwner(e)))}</b> ที่บันทึกรายการนี้ ถ้ารายการผิด ทักบอกให้แก้ได้เลย</div></div>`);
}
function sheetExpense(id){
  const t=trip(),old=id?D.expenses[id]:null;
  if(old&&!canEditExp(old))return sheetExpenseView(old);
  const payers=payerChoices(t);if(old&&!payers.includes(old.payer))payers.push(old.payer);
  let payer=old?.payer||me,mode2='eq',sel=new Set(old?Object.keys(old.split):t.members);
  if(old){const eq=eqSplit(Object.keys(old.split),old.amount);if(Object.keys(old.split).some(k=>Math.abs(old.split[k]-eq[k])>0.011))mode2='cu'}
  const acts=t.activities?.length?t.activities:['ทั่วไป'];
  openSheet(old?'แก้ไขรายการ':'เพิ่มค่าใช้จ่าย',`
   <label class="f">จำนวนเงิน (บาท)<input class="inp amount num" id="ex-amt" inputmode="decimal" placeholder="0" value="${old?old.amount:''}"></label>
   <label class="f">รายการ<input class="inp" id="ex-title" placeholder="เช่น ค่าอาหารเย็น" maxlength="60" value="${esc(old?.title||'')}"></label>
   <div class="two"><label class="f">กิจกรรม<select class="inp" id="ex-act">${acts.map(a=>`<option ${a===old?.act?'selected':''}>${esc(a)}</option>`).join('')}</select></label>
   <label class="f">หมวด<select class="inp" id="ex-cat">${Object.entries(CATS).map(([k,n])=>`<option value="${k}" ${k===old?.cat?'selected':''}>${n}</option>`).join('')}</select></label></div>
   <label class="f">วันที่<input class="inp" type="date" id="ex-date" value="${old?.date||todayDate()}"></label>
   <div class="label">ใครจ่าย</div><div class="who" id="ex-payer"></div>
   <p class="note" style="margin:0">บันทึกได้เฉพาะรายการที่คุณจ่ายเอง${payers.length>1?' หรือที่เพื่อนซึ่งยังไม่มีบัญชีจ่าย':''} ถ้าเพื่อนที่มีบัญชีเป็นคนจ่าย ให้เขาบันทึกเอง</p>
   <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><span class="label">หารกับใคร</span>
     <div class="seg" id="ex-mode"><button data-m="eq">หารเท่ากัน</button><button data-m="cu">กำหนดเอง</button></div></div>
   <div id="ex-split"></div>
   <button class="btn block" id="ex-save">บันทึก</button>
   ${old?'<button class="btn danger block" id="ex-del">ลบรายการนี้</button>':''}`,sh=>{
    const amtEl=sh.querySelector('#ex-amt');
    let unit='baht';           // custom split can be typed in baht or in percent
    const cuVals={};           // what's typed per person; kept while switching views or units
    if(old)Object.keys(old.split).forEach(k=>cuVals[k]=String(old.split[k]));
    const drawPayer=()=>sh.querySelector('#ex-payer').innerHTML=payers.map(m=>`<button data-p="${m}" aria-pressed="${m===payer}">${av(m)}${esc(nm(m))}</button>`).join('');
    const drawSplit=()=>{
      sh.querySelectorAll('#ex-mode [data-m]').forEach(x=>x.setAttribute('aria-pressed',x.dataset.m===mode2));
      const amt=+amtEl.value||0;
      if(mode2==='eq'){
        sh.querySelector('#ex-split').innerHTML=`<div class="who">${t.members.map(m=>`<button data-s="${m}" aria-pressed="${sel.has(m)}">${av(m)}${esc(nm(m))}</button>`).join('')}</div>
          <p class="muted num" style="margin:8px 0 0">${sel.size?`คนละ ${baht(amt/sel.size,2)} · ${sel.size} คน`:'เลือกอย่างน้อย 1 คน'}</p>`;
      }else{
        const isP=unit==='pct';
        sh.querySelector('#ex-split').innerHTML=`<div class="seg" id="ex-unit" style="margin-bottom:6px"><button type="button" data-u="baht" aria-pressed="${!isP}">บาท ฿</button><button type="button" data-u="pct" aria-pressed="${isP}">เปอร์เซ็นต์ %</button></div>`
          +t.members.map(m=>`<div class="split-row">${av(m)}<span style="flex:1">${esc(nm(m))}</span><input class="inp num" data-cu="${m}" inputmode="decimal" placeholder="0" value="${esc(cuVals[m]||'')}"><span class="muted" style="width:14px">${isP?'%':'฿'}</span></div>`).join('')
          +`<p class="muted num" id="cu-left" style="margin:6px 0 0"></p>`;
        const upd=()=>{
          const ins=[...sh.querySelectorAll('[data-cu]')];ins.forEach(i=>cuVals[i.dataset.cu]=i.value);
          const s=ins.reduce((a,i)=>a+(+i.value||0),0),a=+amtEl.value||0,L=sh.querySelector('#cu-left');
          if(isP){const d=r2(100-s);L.innerHTML=`ใส่แล้ว ${r2(s)}% จาก 100%${Math.abs(d)>0.05?` · <span class="neg-t">${d>0?'เหลืออีก':'เกินมา'} ${Math.abs(d)}%</span>`:' · ครบแล้ว'}${a>0&&s>0?` · รวม ${baht(a,2)}`:''}`}
          else L.innerHTML=`ใส่แล้ว ${baht(s,2)} จาก ${baht(a,2)}${Math.abs(a-s)>0.01?` · <span class="neg-t">ต่างกัน ${baht(r2(a-s),2)}</span>`:''}`;
        };
        sh.querySelectorAll('[data-cu]').forEach(i=>i.oninput=upd);upd();
      }
    };
    drawPayer();drawSplit();
    amtEl.oninput=()=>{if(mode2==='eq')drawSplit();else sh.querySelector('[data-cu]')?.oninput()};
    sh.addEventListener('click',e=>{
      const b=e.target.closest('button');if(!b)return;
      if(b.dataset.p){payer=b.dataset.p;drawPayer()}
      if(b.dataset.s){sel.has(b.dataset.s)?sel.delete(b.dataset.s):sel.add(b.dataset.s);drawSplit()}
      if(b.dataset.m){mode2=b.dataset.m;drawSplit()}
      if(b.dataset.u&&b.dataset.u!==unit){   // convert what's typed so nothing is lost
        const a=+amtEl.value||0,toP=b.dataset.u==='pct';
        for(const k in cuVals){const v=+cuVals[k]||0;cuVals[k]=!v?'':toP?(a>0?String(r2(v/a*100)):''):String(r2(v*a/100))}
        unit=b.dataset.u;drawSplit();
      }
    });
    sh.querySelector('#ex-save').onclick=async()=>{
      const amt=r2(+amtEl.value||0);
      if(!(amt>0)){toast('ใส่จำนวนเงินก่อน');amtEl.focus();return}
      let split={};
      if(mode2==='eq'){if(!sel.size){toast('เลือกคนหารอย่างน้อย 1 คน');return}split=eqSplit(t.members.filter(m=>sel.has(m)),amt)}
      else if(unit==='pct'){
        const ps={};sh.querySelectorAll('[data-cu]').forEach(i=>{const v=+i.value||0;if(v>0)ps[i.dataset.cu]=v});
        const S=Object.values(ps).reduce((a,v)=>a+v,0);
        if(Math.abs(S-100)>0.05){toast(`เปอร์เซ็นต์รวมต้องเท่ากับ 100% (ตอนนี้ ${r2(S)}%)`);return}
        split=pctSplit(ps,amt);
      }
      else{sh.querySelectorAll('[data-cu]').forEach(i=>{const v=r2(+i.value||0);if(v>0)split[i.dataset.cu]=v});
        const s=Object.values(split).reduce((a,v)=>a+v,0);if(Math.abs(s-amt)>0.01){toast('ยอดที่แบ่งยังไม่เท่ากับยอดรวม');return}}
      const cat=sh.querySelector('#ex-cat').value;
      const doc={id:old?.id||uid(),trip:t.id,title:sh.querySelector('#ex-title').value.trim()||CATS[cat],amount:amt,payer,split,cat,act:sh.querySelector('#ex-act').value,date:sh.querySelector('#ex-date').value||todayDate(),createdAt:old?.createdAt||nowISO(),by:old?expOwner(old):me};
      closeSheet();if(await put('expenses',doc))toast(old?'แก้ไขแล้ว':'บันทึกแล้ว');
    };
    const d=sh.querySelector('#ex-del');if(d)twoTap(d,'แตะอีกครั้งเพื่อยืนยันการลบ',async()=>{closeSheet();if(await del('expenses',old.id))toast('ลบรายการแล้ว')});
    if(!old)setTimeout(()=>amtEl.focus(),60);
  });
}

/* ================= where to eat (OpenStreetMap data through /api/places) ================= */
const FOOD_TH={thai:'อาหารไทย',isan:'อีสาน',regional:'อาหารท้องถิ่น',local:'อาหารท้องถิ่น',chinese:'อาหารจีน',dim_sum:'ติ่มซำ',japanese:'ญี่ปุ่น',sushi:'ซูชิ',ramen:'ราเมน',korean:'เกาหลี',korean_bbq:'หมูกระทะเกาหลี',barbecue:'ปิ้งย่าง',bbq:'ปิ้งย่าง',grill:'ปิ้งย่าง',hot_pot:'ชาบู/หม้อไฟ',shabu:'ชาบู',buffet:'บุฟเฟ่ต์',seafood:'อาหารทะเล',fish:'อาหารทะเล',noodle:'ก๋วยเตี๋ยว',noodles:'ก๋วยเตี๋ยว',steak_house:'สเต็ก',steak:'สเต็ก',pizza:'พิซซ่า',pasta:'พาสต้า',italian:'อิตาเลียน',burger:'เบอร์เกอร์',sandwich:'แซนด์วิช',vietnamese:'เวียดนาม',indian:'อินเดีย',vegetarian:'มังสวิรัติ',vegan:'วีแกน',coffee_shop:'คาเฟ่',cafe:'คาเฟ่',breakfast:'อาหารเช้า',international:'นานาชาติ',asian:'เอเชีย',french:'ฝรั่งเศส',mexican:'เม็กซิกัน',dessert:'ของหวาน',chicken:'ไก่',cake:'เค้ก',bakery:'เบเกอรี่',ice_cream:'ไอศกรีม',juice:'น้ำผลไม้',tea:'ชา',bubble_tea:'ชานม',pub:'ผับ/บาร์',tapas:'ทาปาส',salad:'สลัด',soup:'ซุป',rice:'ข้าว',curry:'แกง'};
// Which food suits which group size. OpenStreetMap doesn't know how many seats a place has, so this is only a guess from the type of food.
const FOOD_FIT={
  large:new Set(['barbecue','bbq','grill','korean_bbq','hot_pot','shabu','buffet','chinese','seafood','fish','thai','isan','regional','local','dim_sum']),
  medium:new Set(['thai','isan','regional','local','chinese','seafood','fish','barbecue','bbq','grill','korean_bbq','hot_pot','shabu','japanese','korean','vietnamese','dim_sum']),
  small:new Set(['noodle','noodles','ramen','sushi','burger','pizza','steak_house','steak','pasta','sandwich','coffee_shop','cafe','breakfast','korean','vietnamese','japanese','thai'])};
const FOOD_BIG=new Set(['barbecue','bbq','grill','korean_bbq','hot_pot','shabu','buffet']);
const FOOD_TAG={large:'มักรับกลุ่มใหญ่ได้',medium:'แบ่งกันกินได้',small:'เหมาะกับคนน้อย'};
const FOOD_HINT={large:'กลุ่มใหญ่ (6 คนขึ้นไป) ขึ้นร้านที่มักมีโต๊ะใหญ่หรือแบ่งกันกิน เช่น ปิ้งย่าง ชาบู บุฟเฟ่ต์ ก่อน',medium:'กลุ่ม 4–5 คน ขึ้นร้านที่สั่งมาแบ่งกันกินได้ก่อน',small:'กลุ่มเล็ก (1–3 คน) ขึ้นร้านจานเดียวหรือนั่งสบายก่อน'};
const FOOD_ERR={outside_thailand:'ตอนนี้รองรับเฉพาะในประเทศไทย',places_unavailable:'ระบบข้อมูลร้านตอบช้า ลองใหม่อีกครั้งในสักครู่',slow_down:'ค้นถี่เกินไป รอสักครู่แล้วลองใหม่',bad_location:'ตำแหน่งไม่ถูกต้อง',bad_query:'พิมพ์ชื่อสถานที่ก่อน',offline:'ไม่มีอินเทอร์เน็ต'};
// Places most groups start from: tap one instead of typing (coordinates checked against OpenStreetMap)
const FOOD_POP=[{n:'มธ.รังสิต',lat:14.0728,lng:100.6069},{n:'มธ.ท่าพระจันทร์',lat:13.7576,lng:100.4906},{n:'สยาม',lat:13.7468,lng:100.535},{n:'จุฬาฯ',lat:13.7431,lng:100.5329},{n:'ฟิวเจอร์พาร์ค รังสิต',lat:13.989,lng:100.6184},{n:'เซ็นทรัลเวิลด์',lat:13.7466,lng:100.539},{n:'เมกาบางนา',lat:13.6471,lng:100.6805},{n:'จตุจักร',lat:13.8003,lng:100.5511},{n:'ม.เชียงใหม่',lat:18.8009,lng:98.9522},{n:'นิมมาน เชียงใหม่',lat:18.7981,lng:98.9705},{n:'พัทยา',lat:12.9367,lng:100.8865}];
// No photos in the data, so each card gets a food picture and colour from its type of food.
const FOOD_LOOK=[
  [['barbecue','bbq','grill','korean_bbq','steak_house','steak'],'🥩','#ff9966','#ff5e62'],
  [['hot_pot','shabu'],'🍲','#ffb347','#ff7e5f'],
  [['buffet'],'🍽️','#f7971e','#ffd200'],
  [['noodle','noodles','ramen','vietnamese'],'🍜','#f7b733','#fc4a1a'],
  [['sushi','japanese'],'🍣','#ff9a9e','#fad0c4'],
  [['chinese','dim_sum'],'🥟','#f6d365','#fda085'],
  [['seafood','fish'],'🦐','#43cea2','#2b8cc4'],
  [['pizza','italian','pasta'],'🍕','#ffb88c','#de6262'],
  [['burger','sandwich'],'🍔','#f9d423','#ff4e50'],
  [['coffee_shop','cafe','cake','bakery','dessert','ice_cream','tea','bubble_tea','juice','breakfast'],'☕','#c79081','#dfa579'],
  [['vegetarian','vegan','salad'],'🥗','#96e6a1','#46b86c'],
  [['thai','isan','regional','local','indian','curry','rice','chicken','soup'],'🍛','#f6d365','#ff9a56'],
  [['korean'],'🍱','#fbc2eb','#a6c1ee']];
const foodLook=p=>FOOD_LOOK.find(l=>p.cuisine.some(c=>l[0].includes(c)))||[null,'🍽️','#c3cfe2','#8ea2c4'];
// Filter chips: a place matches when any of its food types is in the list (a place can be in several)
const FOOD_CATS=[
  {k:'cafe',l:'ร้านกาแฟ/คาเฟ่',t:['cafe','coffee_shop','tea','bubble_tea','juice','breakfast']},
  {k:'dessert',l:'ของหวาน/เบเกอรี่',t:['dessert','bakery','cake','ice_cream']},
  {k:'noodle',l:'ก๋วยเตี๋ยว/เส้น',t:['noodle','noodles','ramen','vietnamese']},
  {k:'thai',l:'อาหารไทย/อีสาน',t:['thai','isan','regional','local','rice','curry','soup']},
  {k:'korean',l:'เกาหลี',t:['korean','korean_bbq']},
  {k:'japanese',l:'ญี่ปุ่น',t:['japanese','sushi','ramen']},
  {k:'grill',l:'ปิ้งย่าง/ชาบู/บุฟเฟ่ต์',t:['barbecue','bbq','grill','korean_bbq','hot_pot','shabu','buffet']},
  {k:'chinese',l:'อาหารจีน',t:['chinese','dim_sum']},
  {k:'seafood',l:'อาหารทะเล',t:['seafood','fish']},
  {k:'western',l:'ฟาสต์ฟู้ด/ตะวันตก',t:['pizza','italian','pasta','burger','sandwich','steak_house','steak','french','mexican','international']},
  {k:'veg',l:'มังสวิรัติ/สลัด',t:['vegetarian','vegan','salad']},
  {k:'other',l:'ไม่ระบุประเภท',t:[]}];
const catsOf=p=>FOOD_CATS.filter(c=>c.k==='other'?!p.cuisine.length:p.cuisine.some(x=>c.t.includes(x))).map(c=>c.k);
const DAY_TH={Mo:'จ.',Tu:'อ.',We:'พ.',Th:'พฤ.',Fr:'ศ.',Sa:'ส.',Su:'อา.',PH:'วันหยุด'};
const fmtHours=h=>String(h||'').replace(/Mo-Su/g,'ทุกวัน').replace(/\b(Mo|Tu|We|Th|Fr|Sa|Su|PH)\b/g,d=>DAY_TH[d]).replace(/\boff\b/gi,'ปิด').replace(/;\s*/g,' · ');
const sizeBand=n=>n>=6?'large':n>=4?'medium':'small';
const fmtDist=d=>d<1000?d+' ม.':(d/1000).toFixed(1)+' กม.';
function foodScore(p,size){
  const band=sizeBand(size),fit=p.cuisine.some(c=>FOOD_FIT[band].has(c));
  let s=fit?2:0;
  if(band==='large'&&p.cuisine.some(c=>FOOD_BIG.has(c)))s+=1;
  if(p.phone||p.web)s+=1;            // can be contacted to book
  if(p.hours)s+=0.5;
  s-=Math.min(2.5,p.dist/2000);      // nearer is better
  return {s,fit};
}
const spotKey=p=>p.name+'|'+p.lat+'|'+p.lng;
const spotOf=p=>Object.values(D.spots).find(x=>x.name.toLowerCase()===String(p.name).toLowerCase());
const spotList=()=>Object.values(D.spots).sort((a,b)=>(a.createdAt||'').localeCompare(b.createdAt||''));
function foodCard(p,fit,band){
  const [,emo,c1,c2]=foodLook(p);
  const labels=[...new Set(p.cuisine.map(c=>FOOD_TH[c]||c.replace(/_/g,' ')))];
  const chips=[...labels.slice(0,2),p.phone?'โทรได้':'',p.web?'มีเว็บไซต์':''].filter(Boolean);
  const maps='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(p.name+' '+p.lat+','+p.lng);
  return `<article class="fd-card"><div class="fd-hero" style="--a:${c1};--b:${c2}"><span aria-hidden="true">${emo}</span><b class="fd-dist">${fmtDist(p.dist)}</b></div>
    <div class="fd-body"><div class="fd-lab">${esc(fit?FOOD_TAG[band]:(labels[0]||'ร้านอาหาร'))}</div><h4 class="fd-name">${esc(p.name)}</h4>
     <div class="fd-meta">${esc(fmtHours(p.hours)||'ไม่มีข้อมูลเวลาเปิด')}</div>
     <div class="fd-chips">${chips.map(c=>`<span class="fd-chip">${esc(c)}</span>`).join('')}</div>
     <div class="acts"><button class="btn sm ${spotOf(p)?'':'line'}" data-addspot="${esc(spotKey(p))}">${spotOf(p)?'แอดแล้ว ✓':'แอด'}</button><a class="btn sm line" href="${esc(maps)}" target="_blank" rel="noopener">Google Maps</a>${p.phone?`<a class="btn sm line" href="tel:${esc(p.phone.replace(/[^\d+]/g,''))}">โทร</a>`:''}${p.web?`<a class="btn sm line" href="${esc(p.web)}" target="_blank" rel="noopener noreferrer">เว็บ</a>`:''}</div></div></article>`;
}
// Click-and-drag scrolling for the horizontal rows (touch screens already scroll by swiping, a mouse can't)
function dragScroll(el){
  if(!el||el.dataset.drag)return;el.dataset.drag='1';
  let down=false,moved=false,sx=0,sl=0,pid=null;
  el.addEventListener('dragstart',e=>e.preventDefault());           // no ghost image when dragging a link
  el.addEventListener('pointerdown',e=>{
    if(e.pointerType!=='mouse'||e.button!==0)return;
    down=true;moved=false;sx=e.clientX;sl=el.scrollLeft;pid=e.pointerId;
    e.preventDefault();                                              // no text selection while dragging
  });
  el.addEventListener('pointermove',e=>{
    if(!down)return;
    const dx=e.clientX-sx;
    if(!moved&&Math.abs(dx)>5){moved=true;el.classList.add('dragging');try{el.setPointerCapture(pid)}catch(err){}}   // keep following the mouse outside the row
    if(moved)el.scrollLeft=sl-dx;
  });
  const end=()=>{if(!down)return;down=false;el.classList.remove('dragging');try{el.releasePointerCapture(pid)}catch(err){}};
  el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end);el.addEventListener('lostpointercapture',end);
  el.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);   // a drag is not a click
}
/* the wheel: every restaurant the group added, one spin picks one */
function sheetWheel(){
  const rand=n=>{const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]/4294967296*n};
  let rot=0,spinning=false,anim=0;
  openSheet('วงล้อสุ่มร้าน',`
   <div class="wheel-wrap"><i class="wheel-pin" aria-hidden="true"></i><canvas id="wh-c" width="600" height="600" aria-label="วงล้อร้านอาหาร"></canvas></div>
   <div id="wh-res" class="wheel-res" aria-live="polite"></div>
   <button class="btn block" id="wh-go">หมุนเลย</button>
   <div style="display:flex;gap:8px"><input class="inp" id="wh-in" placeholder="เพิ่มร้านเอง เช่น ข้าวมันไก่ปากซอย" maxlength="80" enterkeyhint="done"><button class="btn line" id="wh-add">แอด</button></div>
   <div id="wh-list" class="box list"></div>
   <button class="btn line block" id="wh-back">ไปหาร้านเพิ่ม</button>`,sh=>{
    const $q=s=>sh.querySelector(s),cv=$q('#wh-c'),cx=cv.getContext('2d'),W=cv.width,R=W/2-6;
    const cs=getComputedStyle(document.documentElement);
    const ink=cs.getPropertyValue('--ink').trim()||'#222',canvas=cs.getPropertyValue('--canvas').trim()||'#fff';
    const draw=()=>{
      const L=spotList(),n=L.length;cx.clearRect(0,0,W,W);cx.save();cx.translate(W/2,W/2);
      if(!n){cx.fillStyle=cs.getPropertyValue('--fog').trim()||'#eee';cx.beginPath();cx.arc(0,0,R,0,7);cx.fill();cx.fillStyle=ink;cx.font='600 30px "Noto Sans Thai",sans-serif';cx.textAlign='center';cx.fillText('ยังไม่มีร้านในวงล้อ',0,10);cx.restore();return}
      const a=Math.PI*2/n;
      L.forEach((x,i)=>{
        cx.beginPath();cx.moveTo(0,0);cx.arc(0,0,R,rot+i*a,rot+(i+1)*a);cx.closePath();
        cx.fillStyle=`hsl(${(i*137.5)%360} ${n>1?62:0}% ${i%2?58:66}%)`;cx.fill();cx.lineWidth=3;cx.strokeStyle=canvas;cx.stroke();
        cx.save();cx.rotate(rot+(i+.5)*a);cx.textAlign='right';cx.fillStyle='#1b1b1b';
        cx.font=`600 ${n>14?22:28}px "Noto Sans Thai",sans-serif`;
        const t=x.name.length>14?x.name.slice(0,13)+'…':x.name;cx.fillText(t,R-24,9);cx.restore();
      });
      cx.beginPath();cx.arc(0,0,26,0,7);cx.fillStyle=canvas;cx.fill();cx.lineWidth=4;cx.strokeStyle=ink;cx.stroke();
      cx.restore();
    };
    const list=()=>{
      const L=spotList();
      $q('#wh-list').innerHTML=L.length?L.map(x=>`<div class="row"><div class="grow"><div class="t">${esc(x.name)}</div><div class="muted">${esc(x.kind||'')}${x.kind&&D.people[x.by]?' · ':''}${D.people[x.by]?'แอดโดย '+esc(D.people[x.by].name):''}</div></div>${x.lat!=null?`<a class="x" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(x.name+' '+x.lat+','+x.lng)}" target="_blank" rel="noopener" aria-label="เปิดแผนที่">${ic('pin',15)}</a>`:''}<button class="x" data-rm="${x.id}" aria-label="เอา ${esc(x.name)} ออก">${ic('x',15)}</button></div>`).join(''):'<div class="empty" style="background:none">แอดร้านจากหน้าค้นหา หรือพิมพ์ชื่อร้านด้านบน อย่างน้อย 2 ร้านถึงจะหมุนได้</div>';
      $q('#wh-go').disabled=spinning||L.length<2;draw();
    };
    list();
    $q('#wh-list').onclick=async e=>{const b=e.target.closest('[data-rm]');if(!b||spinning)return;await del('spots',b.dataset.rm);$q('#wh-res').textContent='';list()};
    const addOwn=async()=>{const i=$q('#wh-in'),name=i.value.trim();if(!name)return;
      if(spotList().some(x=>x.name.toLowerCase()===name.toLowerCase())){toast('มีร้านนี้ในวงล้อแล้ว');return}
      i.value='';if(await put('spots',{id:uid(),name,kind:'',lat:null,lng:null})!==false)list()};
    $q('#wh-add').onclick=addOwn;$q('#wh-in').onkeydown=e=>{if(e.key==='Enter')addOwn()};
    $q('#wh-back').onclick=sheetFood;
    $q('#wh-go').onclick=()=>{
      const L=spotList(),n=L.length;if(n<2||spinning)return;
      const a=Math.PI*2/n,win=Math.floor(rand(n));
      // land the middle of the winning slice (give or take a bit inside it) under the pin at the top
      const target=Math.PI*1.5-(win+.5+(rand(.7)-.35))*a+Math.PI*2*Math.ceil((rot+Math.PI*2*5)/(Math.PI*2));
      const from=rot,dur=matchMedia('(prefers-reduced-motion: reduce)').matches?300:4600,t0=performance.now();
      spinning=true;$q('#wh-go').disabled=true;$q('#wh-res').textContent='';
      const step=now=>{
        if(!cv.isConnected){spinning=false;return}
        const k=Math.min(1,(now-t0)/dur);rot=from+(target-from)*(1-Math.pow(1-k,4));draw();
        if(k<1){anim=requestAnimationFrame(step);return}
        spinning=false;rot%=Math.PI*2;const w=L[win];
        $q('#wh-res').innerHTML=`<div class="label">วันนี้กิน</div><b>${esc(w.name)}</b>${w.lat!=null?`<a class="btn sm" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(w.name+' '+w.lat+','+w.lng)}" target="_blank" rel="noopener">เปิดแผนที่</a>`:''}`;
        $q('#wh-go').textContent='หมุนใหม่';$q('#wh-go').disabled=false;
      };
      anim=requestAnimationFrame(step);
    };
  });
}
function sheetFood(){
  const t=trip();
  let size=Math.min(50,Math.max(1,t.members.length)),rad=LS.get('sp-foodr',1000),loc=LS.get('sp-foodloc',null),last=null,all=false,picked=new Set();
  rad=Math.min(10000,Math.max(1000,Math.round((+rad||1000)/500)*500));   // the slider goes 1–10 km in half-km steps
  if(!(loc&&Number.isFinite(loc.lat)&&Number.isFinite(loc.lng)))loc=null;
  openSheet('ไปกินที่ไหนดี',`
   <button class="btn line block" id="fd-wheel">${ic('shuffle',16)} วงล้อสุ่มร้าน (<span id="fd-wn">${spotList().length}</span>)</button>
   <div class="kv" style="justify-content:space-between"><div><div class="label">กินกี่คน</div><b class="num" id="fd-n" style="font-size:22px"></b></div>
     <div style="display:flex;gap:8px"><button class="btn sm line" id="fd-m" aria-label="ลดจำนวนคน">−</button><button class="btn sm line" id="fd-p" aria-label="เพิ่มจำนวนคน">+</button></div></div>
   <div style="display:grid;gap:8px"><span class="label">เลือกสถานที่</span>
     <div class="fd-pop" id="fd-pop">${FOOD_POP.map((x,k)=>`<button class="btn sm line" data-pop="${k}">${esc(x.n)}</button>`).join('')}</div></div>
   <div style="display:flex;gap:8px"><input class="inp" id="fd-q" placeholder="หรือพิมพ์ชื่อสถานที่ เช่น สยามพารากอน" maxlength="80" enterkeyhint="search"><button class="btn line" id="fd-find">ค้นหา</button></div>
   <div id="fd-cands"></div>
   <div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><span class="muted">ค้นรอบ: <b id="fd-loc"></b></span><button class="btn sm line" id="fd-gps">ใช้ตำแหน่งของฉัน</button></div>
   <div style="display:grid;gap:2px"><div style="display:flex;justify-content:space-between;align-items:baseline"><span class="label">รัศมีค้นหา</span><b class="num" id="fd-rv" style="font-size:18px"></b></div>
     <input type="range" class="fd-range" id="fd-r" min="1" max="10" step="0.5" value="${rad/1000}" aria-label="รัศมีค้นหา (กิโลเมตร)">
     <div class="fd-ticks" aria-hidden="true"><span>1</span><span>4</span><span>7</span><span>10 กม.</span></div></div>
   <div id="fd-out" style="display:grid;gap:10px"></div>
   <p class="note" style="margin:0"><span id="fd-src">ข้อมูลร้านจาก © OpenStreetMap contributors</span> <button class="link" id="fd-again" hidden>ข้อมูลยังไม่ครบ ค้นอีกครั้ง</button> บางร้านยังไม่มีเวลาเปิดหรือเบอร์โทร ส่วนคะแนนรีวิว รูป และการจองดูได้ใน Google Maps</p>`,sh=>{
    const $q=s=>sh.querySelector(s);
    const drawN=()=>{$q('#fd-n').textContent=size+' คน'};
    const drawLoc=()=>{$q('#fd-loc').textContent=loc?loc.label:'ยังไม่ได้เลือก'};
    const drawResults=()=>{
      const out=$q('#fd-out');
      if(!last){out.innerHTML='';return}
      if(!last.length){out.innerHTML='<div class="empty">ไม่พบร้านในรัศมีนี้ ลองขยายรัศมีหรือเลือกที่อื่น</div>';return}
      const counts={};last.forEach(p=>catsOf(p).forEach(k=>counts[k]=(counts[k]||0)+1));
      [...picked].forEach(k=>{if(!counts[k])picked.delete(k)});          // a type with no places here can't stay selected
      const pool=picked.size?last.filter(p=>catsOf(p).some(k=>picked.has(k))):last;
      const band=sizeBand(size),ranked=pool.map(p=>({p,...foodScore(p,size)})).sort((a,b)=>b.s-a.s);
      const list=all?ranked:ranked.slice(0,10);
      const chips=`<div class="fd-pop" id="fd-cats"><button class="btn sm ${picked.size?'line':''}" data-cat="*">ทั้งหมด ${last.length}</button>${FOOD_CATS.filter(c=>counts[c.k]).map(c=>`<button class="btn sm ${picked.has(c.k)?'':'line'}" data-cat="${c.k}" aria-pressed="${picked.has(c.k)}">${esc(c.l)} ${counts[c.k]}</button>`).join('')}</div>`;
      out.innerHTML=`<div class="sec-h" style="margin:0"><h2>ร้านแนะนำสำหรับ ${size} คน</h2><a class="link" href="https://www.google.com/maps/search/${encodeURIComponent('ร้านอาหาร')}/@${loc.lat},${loc.lng},16z" target="_blank" rel="noopener">ดูคะแนนใน Google Maps</a></div>
        ${chips}
        <p class="note" style="margin:0">${FOOD_HINT[band]} ระบบเดาจากประเภทอาหาร ไม่รู้จำนวนที่นั่งจริง ควรโทรหรือจองก่อนไป</p>
        ${rad>3000?'<p class="note" style="margin:0">รัศมีเกิน 3 กม. ในเมืองใหญ่มีร้านมากจนแสดงได้แค่ตัวอย่างบางส่วน (ร้านใกล้ตำแหน่งยังพยายามให้ครบก่อน) ลดรัศมีถ้าอยากให้ครบ</p>':''}
        ${all?`<div class="fd-grid">${list.map(({p,fit})=>foodCard(p,fit,band)).join('')}</div>`
          :`<div class="fd-railwrap"><button class="fd-nav prev" aria-label="ก่อนหน้า" hidden>‹</button><div class="fd-rail">${list.map(({p,fit})=>foodCard(p,fit,band)).join('')}</div><button class="fd-nav next" aria-label="ถัดไป">›</button></div>`}
        ${ranked.length>10?`<button class="btn line block" id="fd-all">${all?'แสดงเฉพาะร้านแนะนำ':`ดูทั้งหมด (${ranked.length} ร้าน)`}</button>`:''}`;
      $q('#fd-cats').onclick=e=>{const b=e.target.closest('[data-cat]');if(!b)return;const k=b.dataset.cat;if(k==='*')picked.clear();else picked.has(k)?picked.delete(k):picked.add(k);all=false;drawResults()};
      const b=$q('#fd-all');if(b)b.onclick=()=>{all=!all;drawResults()};
      dragScroll($q('#fd-cats'));
      const rail=$q('.fd-rail');
      if(rail){
        dragScroll(rail);
        const prev=$q('.fd-nav.prev'),next=$q('.fd-nav.next');
        const upd=()=>{prev.hidden=rail.scrollLeft<8;next.hidden=rail.scrollLeft+rail.clientWidth>=rail.scrollWidth-8};
        rail.addEventListener('scroll',upd,{passive:true});upd();
        prev.onclick=()=>rail.scrollBy({left:-rail.clientWidth*0.85,behavior:'smooth'});
        next.onclick=()=>rail.scrollBy({left:rail.clientWidth*0.85,behavior:'smooth'});
      }
    };
    const run=async()=>{
      if(!loc){toast('เลือกสถานที่ก่อน');return}
      $q('#fd-out').innerHTML='<div class="empty" style="background:none"><div class="spin"></div>กำลังหาร้านอาหาร…</div>';
      try{
        let r;
        try{r=await api(`/places?lat=${loc.lat}&lng=${loc.lng}&r=${rad}`)}
        catch(e){if(e.code!=='places_unavailable')throw e;r=await api(`/places?lat=${loc.lat}&lng=${loc.lng}&r=${rad}`)}   // free servers are sometimes slow: try once more
        if(!sh.isConnected)return;
        last=r.places;all=false;
        $q('#fd-src').textContent='ข้อมูลร้านจาก '+(r.sources||['OpenStreetMap']).map(x=>x==='OpenStreetMap'?'© OpenStreetMap contributors':x).join(' และ ');
        $q('#fd-again').hidden=!r.partial;
        drawResults();
      }catch(err){
        if(!sh.isConnected)return;
        last=null;$q('#fd-out').innerHTML=`<div class="empty">${esc(FOOD_ERR[err.code]||'ค้นไม่สำเร็จ ลองใหม่อีกครั้ง')}<button class="btn sm" id="fd-retry">ลองใหม่</button></div>`;
        $q('#fd-retry').onclick=run;
      }
    };
    const setLoc=l=>{loc=l;LS.set('sp-foodloc',l);drawLoc();run()};
    $q('#fd-wheel').onclick=sheetWheel;
    $q('#fd-out').addEventListener('click',async e=>{
      const b=e.target.closest('[data-addspot]');if(!b||!last)return;
      const p=last.find(x=>spotKey(x)===b.dataset.addspot);if(!p)return;
      const have=spotOf(p);
      b.disabled=true;
      const ok=have?await del('spots',have.id):await put('spots',{id:uid(),name:p.name,kind:(p.cuisine.map(c=>FOOD_TH[c]||'')[0])||'',lat:p.lat,lng:p.lng});
      b.disabled=false;if(!sh.isConnected)return;
      if(ok!==false){const on=!!spotOf(p);b.textContent=on?'แอดแล้ว ✓':'แอด';b.classList.toggle('line',!on);if(on)toast('แอด '+p.name+' เข้าวงล้อแล้ว')}
      $q('#fd-wn').textContent=spotList().length;
    });
    $q('#fd-again').onclick=run;
    $q('#fd-m').onclick=()=>{if(size>1){size--;drawN();drawResults()}};
    $q('#fd-p').onclick=()=>{if(size<50){size++;drawN();drawResults()}};
    const rv=$q('#fd-r'),rl=$q('#fd-rv');let rt=null;
    const paintR=()=>{const km=+rv.value;rl.textContent=km+' กม.';rv.style.setProperty('--p',((km-1)/9*100)+'%')};
    paintR();
    rv.oninput=paintR;                                                  // the label and the filled track follow the thumb smoothly
    rv.onchange=()=>{rad=Math.round(+rv.value*1000);LS.set('sp-foodr',rad);clearTimeout(rt);if(loc)rt=setTimeout(run,350)};   // search when you let go
    $q('#fd-pop').onclick=e=>{const b=e.target.closest('[data-pop]');if(!b)return;const x=FOOD_POP[+b.dataset.pop];$q('#fd-cands').innerHTML='';setLoc({lat:x.lat,lng:x.lng,label:x.n})};
    $q('#fd-gps').onclick=()=>{
      if(!navigator.geolocation){toast('เครื่องนี้ไม่รองรับตำแหน่ง ลองเลือกหรือพิมพ์ชื่อสถานที่แทน');return}
      toast('กำลังหาตำแหน่ง…');
      navigator.geolocation.getCurrentPosition(
        pos=>{if(sh.isConnected)setLoc({lat:+pos.coords.latitude.toFixed(5),lng:+pos.coords.longitude.toFixed(5),label:'ตำแหน่งของคุณ'})},
        ()=>toast('ขอตำแหน่งไม่ได้ อนุญาตการใช้ตำแหน่ง หรือเลือกสถานที่แทน'),
        {timeout:10000,maximumAge:300000});
    };
    const find=async()=>{
      const q=$q('#fd-q').value.trim(),box=$q('#fd-cands');
      if(q.length<2){toast('พิมพ์ชื่อสถานที่ก่อน');return}
      box.innerHTML='<div class="muted">กำลังค้นหา…</div>';
      try{
        const r=await api('/geocode?q='+encodeURIComponent(q));
        if(!sh.isConnected)return;
        box.innerHTML=r.results.length?`<div class="box list">${r.results.map((c,k)=>`<button class="row" data-pick="${k}"><div class="grow"><div class="t">${esc(c.name)}</div><div class="muted">${esc(c.detail)}</div></div>${ic('chev',16)}</button>`).join('')}</div>`
          :'<div class="muted">ไม่พบสถานที่นี้ ลองพิมพ์ชื่อเต็มหรือเติมชื่อจังหวัด หรือเลือกจากสถานที่ด้านบน หรือกด "ใช้ตำแหน่งของฉัน"</div>';
        box.onclick=e=>{const b=e.target.closest('[data-pick]');if(!b)return;const c=r.results[+b.dataset.pick];box.innerHTML='';setLoc({lat:c.lat,lng:c.lng,label:c.name})};
      }catch(err){if(sh.isConnected)box.innerHTML=`<div class="muted">${esc(FOOD_ERR[err.code]||'ค้นไม่สำเร็จ ลองใหม่อีกครั้ง')}</div>`}
    };
    $q('#fd-find').onclick=find;
    $q('#fd-q').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();find()}};
    dragScroll($q('#fd-pop'));
    drawN();drawLoc();if(loc)run();
  });
}

function sheetPay(from,to){
  const t=trip(),s=settle(t).find(x=>x.from===from&&x.to===to);if(!s){toast('ยอดนี้เคลียร์แล้ว');return}
  const rcv=P(to),pl=activePlan(t,from,to),info=pl&&planInfo(pl);
  let months=1;
  const canInst=!pl&&s.amount>=INST_MIN;
  const amt=()=>pl?r2(Math.min(info.inst,s.amount)):r2(s.amount/months);
  openSheet('จ่ายให้'+rcv.name,`
   <div><div class="label">ยอดค้างทั้งหมด</div><div class="big num">${baht(s.amount,2)}</div></div>
   ${pendingTo(t,from,to)?`<div class="alert">${ic('clock',20)}<div class="grow"><b>แจ้งโอนไปแล้ว ${baht(pendingTo(t,from,to),2)}</b><div class="muted">ยังรอ${esc(rcv.name)}ยืนยัน ยอดนี้ยังไม่หัก ถ้าโอนไปแล้วไม่ต้องโอนซ้ำ</div></div></div>`:''}
   ${pl?`<div class="alert plain"><div class="grow"><b>งวดที่ ${info.count+1} จาก ${pl.months}</b><div class="steps" style="margin-top:6px">${Array.from({length:pl.months},(_,k)=>`<i class="${k<info.count?'on':''}"></i>`).join('')}</div><div class="muted" style="margin-top:4px">ครบกำหนด ${fmtD(info.due)}</div></div></div>`:''}
   ${canInst?`<div><div class="label" style="margin-bottom:6px">ยอดเยอะ แบ่งจ่ายเป็นงวดรายเดือนได้</div><div class="plans">
      ${[1,2,3].map(n=>`<button data-mo="${n}" aria-pressed="${n===1}"><b class="num">${n===1?'จ่ายเต็ม':n+' งวด'}</b><span class="muted num">${n===1?baht(s.amount):baht(Math.ceil(s.amount/n))+'/เดือน'}</span></button>`).join('')}</div></div>`:''}
   ${rcv.pp?`<div class="qrbox"><span class="pp">THAI QR · PROMPTPAY</span><div id="qr"></div><div class="num" id="qramt" style="font-weight:600;font-size:17px"></div><div class="num label">${esc(rcv.name)} · ${esc(rcv.pp)}</div></div>
     <div class="two"><button class="btn line" id="qr-save">${ic('save',16)} บันทึกรูป QR</button><button class="btn line" id="cp-amt">${ic('copy',16)} คัดลอกยอด</button></div>
     <p class="note" style="margin:0">ถ้าจ่ายจากมือถือเครื่องนี้: บันทึกรูป QR แล้วเปิดแอปธนาคาร เลือกสแกน แล้วเลือกรูปจากคลังภาพ ยอดเงินจะขึ้นให้เอง</p>`
     :`<div class="alert plain"><div class="grow">${esc(rcv.name)} ยังไม่ได้ใส่พร้อมเพย์ จึงยังสร้าง QR ไม่ได้</div></div>`}
   ${rcv.acct?`<div class="kv"><div class="grow"><div class="label">${esc(rcv.bank||'บัญชีธนาคาร')}</div><div class="num" style="font-weight:600">${esc(rcv.acct)}</div><div class="muted">${esc(rcv.name)}</div></div>
     <button class="btn sm line" data-copy="${esc(rcv.acct.replace(/-/g,''))}">${ic('copy',14)} คัดลอก</button></div>`:''}
   <p class="note" style="margin:0;text-align:center">${esc(rcv.name)} จะได้รับแจ้งให้ยืนยันว่าได้รับเงิน</p>
   <div class="buybar"><div class="price num"><span class="label" style="display:block">ยอดที่โอนครั้งนี้</span><span id="paid-amt"></span></div><button class="btn" style="height:48px;padding:0 28px" id="paid">ฉันโอนแล้ว</button></div>`,sh=>{
    const draw=()=>{
      const a=amt();
      sh.querySelector('#paid-amt').textContent=baht(a,2);
      const q=sh.querySelector('#qr');if(!q)return;
      sh.querySelector('#qramt').textContent=baht(a,2);
      makeQR(q,promptpay(rcv.pp,a));
    };
    draw();
    sh.querySelectorAll('[data-mo]').forEach(b=>b.onclick=()=>{months=+b.dataset.mo;sh.querySelectorAll('[data-mo]').forEach(x=>x.setAttribute('aria-pressed',x===b));draw()});
    const ca=sh.querySelector('#cp-amt');if(ca)ca.onclick=()=>copy(amt().toFixed(2),'คัดลอกยอด '+baht(amt(),2)+' แล้ว');
    const qs=sh.querySelector('#qr-save');if(qs)qs.onclick=()=>saveQR(sh.querySelector('#qr canvas'),rcv,amt());
    sh.querySelector('#paid').onclick=async()=>{
      const a=amt();let planId=pl?.id;const ops=[];
      if(!pl&&months>1){planId=uid();ops.push({op:'put',col:'plans',id:planId,doc:{trip:t.id,from,to,total:s.amount,months,startedAt:nowISO()}})}
      const auto=!rcv.claimed;   // a friend without an account can't confirm, so it counts right away
      ops.push({op:'put',col:'payments',id:uid(),doc:{trip:t.id,from,to,amount:a,confirmed:auto,createdAt:nowISO(),...(planId?{plan:planId}:{})}});
      closeSheet();if(await send(ops))toast(auto?'บันทึกการจ่ายแล้ว':`บันทึกแล้ว รอ${rcv.name}ยืนยัน ยอดจะหักเมื่อยืนยัน`);
    };
  });
}
function saveQR(qrCanvas,rcv,a){
  if(!qrCanvas)return;
  const c=document.createElement('canvas');c.width=720;c.height=920;const g=c.getContext('2d');
  g.fillStyle='#ffffff';g.fillRect(0,0,720,920);
  g.textAlign='center';g.fillStyle='#8c8c8c';g.font='600 24px "Open Sans","Noto Sans Thai",sans-serif';g.fillText('THAI QR · PROMPTPAY',360,80);
  g.drawImage(qrCanvas,110,120,500,500);
  g.fillStyle='#262626';g.font='600 52px "Open Sans","Noto Sans Thai",sans-serif';g.fillText(baht(a,2),360,710);
  g.font='32px "Open Sans","Noto Sans Thai",sans-serif';g.fillText(rcv.name+' · '+rcv.pp,360,770);
  g.fillStyle='#8c8c8c';g.font='24px "Open Sans","Noto Sans Thai",sans-serif';g.fillText('Splitly · '+(G?.name||''),360,840);
  c.toBlob(async blob=>{
    const name=`QR-${rcv.name}-${a.toFixed(2)}.png`;
    const file=new File([blob],name,{type:'image/png'});
    if(navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file],title:'QR พร้อมเพย์'});return}catch(e){if(e.name==='AbortError')return}}
    const url=URL.createObjectURL(blob);const a2=document.createElement('a');a2.href=url;a2.download=name;document.body.appendChild(a2);a2.click();a2.remove();setTimeout(()=>URL.revokeObjectURL(url),4000);
    toast('บันทึกรูป QR แล้ว');
  },'image/png');
}

function sheetLedger(other){
  const t=trip(),{rows,net}=ledger(t,other),o=P(other);
  const s=settle(t).find(x=>(x.from===other&&x.to===me)||(x.from===me&&x.to===other));
  const head=net>0.009?`${esc(o.name)} ค้างคุณ`:net<-0.009?`คุณค้าง ${esc(o.name)}`:`คุณกับ ${esc(o.name)} เคลียร์กันแล้ว`;
  const runLbl=v=>v>0.009?o.name+'ค้าง '+baht(v,2):v<-0.009?'คุณค้าง '+baht(-v,2):'เคลียร์แล้ว';
  const line=r=>{
    const v=r.v,cls=v>0?'pos-t':'neg-t',sign=v>0?'+':'−';
    if(r.kind==='pay'&&!r.p.confirmed){const p=r.p,fromMe=p.from===me;
      return `<div class="row"><span class="cat">${ic('clock',17)}</span><div class="grow"><div class="t">${fromMe?'คุณแจ้งว่าโอนให้ '+esc(o.name):esc(o.name)+' แจ้งว่าโอนให้คุณ'}</div>
        <div class="muted num">${fmtD(p.createdAt)} · รอ${fromMe?esc(o.name):'คุณ'}ยืนยัน ยังไม่หักยอด</div></div>
        <div class="amt num muted">${baht(p.amount,2)}</div></div>`}
    if(r.kind==='pay'){const p=r.p,fromMe=p.from===me;
      return `<div class="row"><span class="cat">${ic('check',17)}</span><div class="grow"><div class="t">${fromMe?'คุณโอนให้ '+esc(o.name):esc(o.name)+' โอนให้คุณ'}</div>
        <div class="muted num">${fmtD(p.createdAt)}${p.confirmed?'':' · รอยืนยัน'}</div></div>
        <div class="amt num ${cls}">${sign}${baht(Math.abs(v),2)}<div class="muted" style="font-weight:400">${runLbl(r.run)}</div></div></div>`}
    const e=r.e,iPaid=e.payer===me;
    return `<button class="row" data-ledexp="${e.id}"><span class="cat cat-${e.cat||'other'}">${ic(e.cat||'other',18)}</span><div class="grow"><div class="t">${esc(e.title)}</div>
      <div class="muted num">${fmtD(e.date)} · ${iPaid?`คุณจ่าย ${baht(e.amount)} · ส่วน${esc(o.name)}`:`${esc(o.name)} จ่าย ${baht(e.amount)} · ส่วนคุณ`} ${baht(Math.abs(v),2)}</div></div>
      <div class="amt num ${cls}">${sign}${baht(Math.abs(v),2)}<div class="muted" style="font-weight:400">${runLbl(r.run)}</div></div></button>`;
  };
  openSheet('ระหว่างคุณกับ '+o.name,`
   <div class="kv">${av(other,'lg')}<div class="grow"><div class="label">${head}</div><b class="num ${net>0.009?'pos-t':net<-0.009?'neg-t':''}" style="font-size:24px">${baht(Math.abs(net),2)}</b></div></div>
   <p class="muted" style="margin:0">+ คือ ${esc(o.name)} ติดคุณ · − คือคุณติด ${esc(o.name)} (หักลบกันแล้ว)</p>
   <div class="box list">${rows.slice().reverse().map(line).join('')||'<div class="empty">ยังไม่มีรายการระหว่างกัน</div>'}</div>
   ${s&&s.from===me?`<button class="btn block" id="lg-pay">จ่าย ${esc(o.name)} ${baht(s.amount,2)}</button>`:''}
   ${s&&s.to===me?`<button class="btn line block" id="lg-remind">${ic('bell',16)} ทวง ${esc(o.name)}</button>`:''}`,sh=>{
    sh.querySelector('.list').onclick=e=>{const b=e.target.closest('[data-ledexp]');if(b){closeSheet();sheetExpense(b.dataset.ledexp)}};
    const pb=sh.querySelector('#lg-pay');if(pb)pb.onclick=()=>{closeSheet();sheetPay(me,other)};
    const rb=sh.querySelector('#lg-remind');if(rb)rb.onclick=()=>{closeSheet();sheetRemind(other)};
  });
}

function sheetRemind(debtor){
  const t=trip(),s=settle(t).find(x=>x.from===debtor&&x.to===me);if(!s)return;
  const mp=P(me),d=P(debtor);
  const msg=`${d.name} ค่า${t.name} ที่ยังค้าง${mp.name}อยู่ ${baht(s.amount,2)} นะ`+(mp.pp?`\nโอนพร้อมเพย์ได้ที่ ${mp.pp} (${mp.name})`:'')+(mp.acct?`\nหรือ ${mp.bank} ${mp.acct}`:'')+`\nโอนแล้วกด "ฉันโอนแล้ว" ใน Splitly ด้วยนะ\n${location.origin}`;
  openSheet('ทวงเงิน'+d.name,`
   <div class="kv"><div class="grow"><div class="label">ยอดค้าง</div><b class="num" style="font-size:20px">${baht(s.amount,2)}</b></div>${av(debtor,'lg')}</div>
   <label class="f">ข้อความ<textarea class="inp" id="rm-msg" rows="5" style="resize:vertical">${esc(msg)}</textarea></label>
   <button class="btn block" id="rm-app">${ic('bell',16)} แจ้งเตือนใน Splitly</button>
   <div class="two"><a class="btn line" id="rm-line" href="#" target="_blank" rel="noopener">${ic('send',16)} ส่งทาง LINE</a>
   <button class="btn line" id="rm-copy">${ic('copy',16)} คัดลอกข้อความ</button></div>
   <p class="note" style="margin:0">แจ้งเตือนใน Splitly: ${esc(d.name)}จะเห็นแถบเตือนเมื่อเปิดแอป · ส่งทาง LINE: เปิดหน้าแชร์ของ LINE ให้เลือกแชท</p>`,sh=>{
    const ta=sh.querySelector('#rm-msg'),ln=sh.querySelector('#rm-line');
    const upd=()=>ln.href='https://line.me/R/share?text='+encodeURIComponent(ta.value);upd();ta.oninput=upd;
    sh.querySelector('#rm-copy').onclick=()=>copy(ta.value,'คัดลอกข้อความแล้ว');
    sh.querySelector('#rm-app').onclick=async()=>{closeSheet();if(await put('reminders',{id:uid(),trip:t.id,from:me,to:debtor,amount:s.amount,createdAt:nowISO()}))toast('แจ้งเตือน'+d.name+'แล้ว')};
  });
}

/* ================= events ================= */
document.addEventListener('click',e=>{const r=e.target.closest('[data-ledgerrow]');if(r&&!r.closest('.sheet'))sheetLedger(r.dataset.ledgerrow)});
document.addEventListener('click',async e=>{
  const b=e.target.closest('button');if(!b||b.closest('.sheet')&&!b.matches('[data-copy]'))return;
  const ds=b.dataset;
  if(b.id==='tripPick')return sheetGroups();
  if(b.id==='meBtn')return sheetPerson(null);
  if(ds.tab){tab=ds.tab;render();window.scrollTo(0,0);return}
  if(ds.filter){actFilter=ds.filter;render();return}
  if(ds.open==='addExp')return sheetExpense(null);
  if(ds.open==='members')return sheetMembers();
  if(ds.open==='editTrip')return sheetTripEdit();
  if(ds.open==='invite')return sheetInvite();
  if(ds.open==='food')return sheetFood();
  if(ds.exp)return sheetExpense(ds.exp);
  if(ds.pay){const[f,t]=ds.pay.split('|');return sheetPay(f,t)}
  if(ds.remind)return sheetRemind(ds.remind);
  if(ds.ledger)return sheetLedger(ds.ledger);
  if(ds.confirm){const p=D.payments[ds.confirm];if(p&&await put('payments',{...p,confirmed:true}))toast('ยืนยันว่าได้รับเงินแล้ว');return}
  if(ds.reject){if(await del('payments',ds.reject))toast('ยกเลิกรายการโอนนี้แล้ว');return}
  if(ds.unpay){if(b.dataset.armed){if(await del('payments',ds.unpay))toast('ลบรายการจ่ายแล้ว');return}b.dataset.armed=1;b.style.background='var(--error)';b.style.color='#fff';toast('แตะ × อีกครั้งเพื่อลบรายการจ่ายนี้');setTimeout(()=>{if(b.isConnected){delete b.dataset.armed;b.style.background='';b.style.color=''}},3000);return}
  if(ds.copy)return copy(ds.copy,'คัดลอกเลขบัญชีแล้ว');
  if(ds.claim)return finishJoin(ds.claim);
  if(ds.authtab){authTab=ds.authtab;render();return}
  switch(ds.do){
    case 'joinNew':return finishJoin(null);
    case 'cancelJoin':pending=null;history.replaceState(null,'','/');if(curId&&entry(curId))load(curId);else render();return;
    case 'create':return sheetCreate();
    case 'scan':return sheetScan();
    case 'groups':return sheetGroups();
    case 'retry':return load(curId,true);
    case 'myPay':return sheetPerson(null);
    case 'leave':return leaveLocal(curId);
  }
});
document.addEventListener('submit',e=>{if(e.target.id==='authForm'){e.preventDefault();submitAuth(e.target)}});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSheet()});

/* ================= boot ================= */
(async function boot(){
  pending=null;
  const j=parseJoin(location.href);
  if(j)pending={...j,group:null,err:null};
  render();
  try{const r=await api('/me');setUser(r.user,r.groups)}
  catch(err){
    if(err.status===401){setUser(null,[]);render();return}
    authed=false;render();toast('เชื่อมต่อไม่ได้ ตรวจอินเทอร์เน็ตแล้วรีเฟรช');return;
  }
  if(pending){startJoin({id:pending.id,token:pending.token});return}
  const want=new URLSearchParams(location.search).get('g');
  if(want){history.replaceState(null,'','/')}
  const first=entry(want)?want:entry(curId)?curId:groups[0]?.id;
  if(first)load(first);else render();
})();

/* phone notifications: the service worker shows them; a tap on one while the app is open switches to that group */
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/sw.js').catch(()=>{});
  navigator.serviceWorker.addEventListener('message',e=>{const g=e.data&&e.data.openGroup;if(g&&entry(g)){tab='home';load(g,true)}});
}
