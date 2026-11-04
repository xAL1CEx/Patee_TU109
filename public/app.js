/* ================= icons ================= */
const I={
  food:'<path d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 0-3 2-3 5s1 4 3 4v9"/>',
  car:'<path d="M5 16V11l2-5h10l2 5v5M5 16h14M5 16v2M19 16v2"/>',
  bed:'<path d="M3 18V7M3 13h18v5M21 13a3 3 0 0 0-3-3h-7v3"/><circle cx="7" cy="10.5" r="1.5"/>',
  ticket:'<path d="M4 10a2 2 0 0 0 0 4v4h16v-4a2 2 0 0 1 0-4V6H4z"/><path d="M14 8v8" stroke-dasharray="2 2"/>',
  bag:'<path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2"/>',
  other:'<circle cx="6" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="18" cy="12" r="1"/>',
  home:'<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-5h4v5"/>',
  list:'<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  chart:'<path d="M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3"/>',
  wallet:'<path d="M4 7h14a2 2 0 0 1 2 2v9H4zM4 7l11-3v3"/><circle cx="16" cy="13" r="1"/>',
  qr:'<path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2"/>',
  scan:'<path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M4 12h16"/>',
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
const fmtD=iso=>{if(!iso)return '';const d=new Date(iso.length===10?iso+'T00:00:00':iso);return isNaN(d)?'':d.getDate()+' '+TH_M[d.getMonth()]};
const addMonths=(iso,n)=>{const d=new Date(iso);d.setMonth(d.getMonth()+n);return d.toISOString()};
const LS={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
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
let D={people:{},trips:{},expenses:{},payments:{},plans:{},reminders:{}};

function adopt(g){
  G=g; curId=g.id; LS.set('sp-cur',curId); me=g.me;
  const e=entry(g.id); if(e){e.name=g.name; e.kind=g.kind} else groups.push({id:g.id,name:g.name,kind:g.kind,dates:g.dates});
  const mem=g.members||{};
  const order=Object.keys(mem).sort((a,b)=>(mem[a].joinedAt||'').localeCompare(mem[b].joinedAt||''));
  D={people:mem,trips:{[g.id]:{id:g.id,name:g.name,kind:g.kind,dates:g.dates,members:order,activities:g.activities||[],createdAt:g.createdAt}},
     expenses:g.expenses||{},payments:g.payments||{},plans:g.plans||{},reminders:g.reminders||{}};
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
setInterval(()=>{if(document.visibilityState==='visible'&&G&&!busy&&!pending)load(G.id)},POLL_MS);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&G)load(G.id)});

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
    if(err.status!==401)toast(err.code==='offline'?'ไม่มีอินเทอร์เน็ต บันทึกไม่สำเร็จ':err.code==='group_full'?'กลุ่มนี้ข้อมูลเต็มแล้ว':err.code==='not_your_member'?'แก้ข้อมูลของเพื่อนที่มีบัญชีไม่ได้':err.code==='cannot_remove_account'?'เอาเพื่อนที่มีบัญชีออกไม่ได้':'บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง');
    load(gid,true);return false;
  }).finally(()=>busy--);
  chain=p;return p;
}
const COLMAP={people:'members',expenses:'expenses',payments:'payments',plans:'plans',reminders:'reminders'};
function put(col,obj){
  const {id,...doc}=obj;
  if(col==='trips')return send([{op:'meta',doc:{name:doc.name,kind:doc.kind,dates:doc.dates,activities:doc.activities}}]);
  return send([{op:'put',col:COLMAP[col],id,doc}]);
}
function del(col,id){return send([{op:'del',col:COLMAP[col],id}])}

/* ================= derived ================= */
const P=id=>D.people[id]||{name:'?',bank:'',acct:'',pp:''};
const av=(id,cls='')=>`<span class="av ${id===me?'me':''} ${cls}">${esc((P(id).name||'?')[0])}</span>`;
const nm=id=>id===me?'คุณ':P(id).name;
const trip=()=>G?D.trips[G.id]:null;
const texp=t=>Object.values(D.expenses).filter(e=>e.trip===t.id).sort((a,b)=>((a.date||'')+(a.createdAt||'')).localeCompare((b.date||'')+(b.createdAt||'')));
const tpay=t=>Object.values(D.payments).filter(p=>p.trip===t.id).sort((a,b)=>(a.createdAt||'').localeCompare(b.createdAt||''));
function balances(t){
  const net={};(t.members||[]).forEach(m=>net[m]=0);
  texp(t).forEach(e=>{net[e.payer]=(net[e.payer]||0)+e.amount;for(const k in e.split)net[k]=(net[k]||0)-e.split[k]});
  tpay(t).forEach(p=>{net[p.from]=(net[p.from]||0)+p.amount;net[p.to]=(net[p.to]||0)-p.amount});
  for(const k in net)net[k]=r2(net[k]);
  return net;
}
function settle(t){
  const net=balances(t),cr=[],db=[];
  for(const k in net){if(net[k]>0.009)cr.push([k,net[k]]);else if(net[k]<-0.009)db.push([k,-net[k]])}
  cr.sort((a,b)=>b[1]-a[1]);db.sort((a,b)=>b[1]-a[1]);
  const out=[];let i=0,j=0;
  while(i<db.length&&j<cr.length){const a=Math.min(db[i][1],cr[j][1]);out.push({from:db[i][0],to:cr[j][0],amount:r2(a)});db[i][1]-=a;cr[j][1]-=a;if(db[i][1]<0.01)i++;if(cr[j][1]<0.01)j++}
  return out;
}
function planInfo(pl){
  const pays=Object.values(D.payments).filter(p=>p.plan===pl.id);
  const paid=r2(pays.reduce((a,p)=>a+p.amount,0)),count=pays.length,inst=r2(pl.total/pl.months),remaining=r2(pl.total-paid);
  return {paid,count,inst,remaining,done:remaining<0.01,due:addMonths(pl.startedAt,count),overdue:new Date(addMonths(pl.startedAt,count))<new Date()};
}
const activePlan=(t,from,to)=>Object.values(D.plans).find(p=>p.trip===t.id&&p.from===from&&p.to===to&&!planInfo(p).done);
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
  if(profile){$('#meBtn').innerHTML=`<span class="av lg me">${esc(profile.name[0])}</span>`}
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

function personFields(p,px='pf'){
  return `<label class="f">ชื่อเล่น<input class="inp" id="${px}-name" value="${esc(p.name||'')}" placeholder="เช่น ต้น" maxlength="30" autocomplete="nickname"></label>
  <label class="f">พร้อมเพย์ (เบอร์โทรหรือเลขบัตรประชาชน)<input class="inp num" id="${px}-pp" value="${esc(p.pp||'')}" inputmode="numeric" placeholder="0812345678"></label>
  <div class="two"><label class="f">ธนาคาร<select class="inp" id="${px}-bank"><option value="">ไม่ระบุ</option>${BANKS.map(b=>`<option ${b===p.bank?'selected':''}>${b}</option>`).join('')}</select></label>
  <label class="f">เลขบัญชี<input class="inp num" id="${px}-acct" value="${esc(p.acct||'')}" inputmode="numeric" placeholder="xxx-x-xxxxx-x"></label></div>`;
}
function readPerson(root,px='pf'){
  const g=k=>root.querySelector('#'+px+'-'+k).value.trim();
  const p={name:g('name'),pp:g('pp').replace(/[^\d]/g,''),bank:g('bank'),acct:g('acct')};
  if(!p.name){toast('ใส่ชื่อเล่นก่อน');return null}
  if(p.pp&&!validPP(p.pp)){toast('พร้อมเพย์ต้องเป็นเบอร์ 10 หลัก หรือเลขบัตร 13 หลัก');return null}
  return p;
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
        <hr class="sep"><h2>โปรไฟล์ของคุณ</h2><p class="muted" style="margin:0">เพื่อนในกลุ่มจะเห็นชื่อเล่น พร้อมเพย์ และเลขบัญชีนี้ไว้โอนคืนคุณ</p>${personFields({})}`:''}
      <button class="btn block" type="submit" id="au-go">${reg?'สมัครและเริ่มใช้งาน':'เข้าสู่ระบบ'}</button>
    </form>
  </div>`;
}
const AUTH_ERR={username_taken:'ชื่อผู้ใช้นี้มีคนใช้แล้ว ลองชื่ออื่น',bad_username:'ชื่อผู้ใช้ใช้ได้เฉพาะ a-z, 0-9, _ และ . ยาว 3–20 ตัว',bad_password:'รหัสผ่านต้องยาวอย่างน้อย 8 ตัวอักษร',
  wrong_login:'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',too_many_attempts:'ลองผิดหลายครั้งเกินไป รอ 10 นาทีแล้วลองใหม่',bad_name:'ใส่ชื่อเล่นก่อน',bad_promptpay:'พร้อมเพย์ต้องเป็นเบอร์ 10 หลัก หรือเลขบัตร 13 หลัก',offline:'ไม่มีอินเทอร์เน็ต'};
async function submitAuth(form){
  const reg=authTab==='register',btn=form.querySelector('#au-go');
  const username=form.querySelector('#au-user').value.trim().toLowerCase(),password=form.querySelector('#au-pass').value;
  if(!username||!password){toast('ใส่ชื่อผู้ใช้และรหัสผ่าน');return}
  let body={username,password};
  if(reg){
    if(password.length<8){toast(AUTH_ERR.bad_password);return}
    if(password!==form.querySelector('#au-pass2').value){toast('รหัสผ่านสองช่องไม่ตรงกัน');return}
    const p=readPerson(form);if(!p)return;body.profile=p;
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
  return `<button class="row" data-exp="${e.id}"><span class="cat">${ic(e.cat||'other',18)}</span>
   <div class="grow"><div class="t">${esc(e.title)}</div><div class="muted">${fmtD(e.date)} · ${e.payer===me?'คุณจ่าย':esc(P(e.payer).name)+' จ่าย'}<span class="tag">${esc(e.act||'')}</span></div></div>
   <div class="amt num">${baht(e.amount)}<div class="muted" style="font-weight:400">${mine?'ส่วนคุณ '+baht(mine):'ไม่เกี่ยวกับคุณ'}</div></div></button>`;
}

function alerts(t){
  const st=settle(t),out=[];
  tpay(t).filter(p=>p.to===me&&!p.confirmed).forEach(p=>out.push(`<div class="alert">${ic('check',20)}<div class="grow"><b>${esc(P(p.from).name)} แจ้งว่าโอนให้คุณแล้ว</b><div class="muted num">${baht(p.amount,2)} · ${fmtD(p.createdAt)}</div></div>
    <button class="btn sm" data-confirm="${p.id}">ได้รับแล้ว</button></div>`));
  st.filter(s=>s.from===me).forEach(s=>{
    const pl=activePlan(t,me,s.to),rem=Object.values(D.reminders).filter(r=>r.trip===t.id&&r.from===s.to&&r.to===me).sort((a,b)=>b.createdAt.localeCompare(a.createdAt))[0];
    const sub=pl?(()=>{const i=planInfo(pl);return `ผ่อนงวดที่ ${i.count+1}/${pl.months} · ${baht(Math.min(i.inst,s.amount),2)} ${i.overdue?'<span class="neg-t">เลยกำหนดแล้ว</span>':'ครบกำหนด '+fmtD(i.due)}`})()
      :`ค้างอยู่ ${baht(s.amount,2)}${rem?` · ${esc(P(s.to).name)} ทวงเมื่อ ${fmtD(rem.createdAt)}`:''}`;
    out.push(`<div class="alert">${ic('bell',20)}<div class="grow"><b>คุณยังไม่ได้จ่าย${esc(P(s.to).name)}</b><div class="muted num">${sub}</div></div><button class="btn sm" data-pay="${s.from}|${s.to}">จ่าย</button></div>`);
  });
  const owed=st.filter(s=>s.to===me);
  if(owed.length)out.push(`<div class="alert plain">${ic('wallet',20)}<div class="grow"><b>${owed.length} คนยังค้างคุณ</b><div class="muted num">รวม ${baht(owed.reduce((a,s)=>a+s.amount,0),2)}</div></div><button class="btn sm line" data-tab="settle">ดู / ทวง</button></div>`);
  if(!out.length&&texp(t).length)out.push(`<div class="alert plain">${ic('check',20)}<div class="grow"><b>เคลียร์ครบแล้ว</b><div class="muted">คุณไม่มียอดค้างในกลุ่มนี้</div></div></div>`);
  return out.join('');
}

function vHome(t){
  const ex=texp(t),total=ex.reduce((a,e)=>a+e.amount,0),net=balances(t);
  const myShare=ex.reduce((a,e)=>a+(e.split?.[me]||0),0),myPaid=ex.filter(e=>e.payer===me).reduce((a,e)=>a+e.amount,0);
  const alone=t.members.length<2;
  return `
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
  <section><div class="sec-h"><h2>รายการล่าสุด</h2>${ex.length?'<button class="link" data-tab="list">ดูทั้งหมด</button>':''}</div>
    <div class="box list">${ex.slice(-4).reverse().map(expRow).join('')||`<div class="empty">ยังไม่มีค่าใช้จ่าย<button class="btn sm" data-open="addExp">เพิ่มรายการแรก</button></div>`}</div></section>
  <section><div class="sec-h"><h2>ยอดของแต่ละคน</h2></div>
    <div class="box list">${t.members.map(m=>{const v=net[m]||0;return `<div class="row">${av(m,'lg')}<div class="grow"><div class="t">${esc(P(m).name)}${m===me?' (คุณ)':''}</div></div>
      <span class="amt num ${v>0.009?'pos-t':v<-0.009?'neg-t':''}">${v>0?'+':''}${baht(v)}</span>
      <span class="state ${v>0.009?'pos':v<-0.009?'neg':''}">${v>0.009?'ได้คืน':v<-0.009?'ต้องจ่าย':'เคลียร์แล้ว'}</span></div>`}).join('')}</div></section>`;
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
  const bars=(obj,lab,base)=>Object.entries(obj).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<div style="display:grid;gap:5px">
    <div style="display:flex;justify-content:space-between;gap:8px"><span>${lab(k)}</span><span class="num">${baht(r2(v))} <span class="muted">${Math.round(v/base*100)}%</span></span></div>
    <div class="bar"><i style="width:${v/base*100}%"></i></div></div>`).join('');
  return `<div><h1>สรุปรายจ่าย</h1><div class="muted">${esc(t.name)} · ${ex.length} รายการ</div></div>
  <div class="stats">
    <div class="stat"><span class="label">รวมทั้งหมด</span><b class="num">${baht(total)}</b></div>
    <div class="stat"><span class="label">ส่วนของคุณ</span><b class="num">${baht(r2(share[me]||0))}</b></div>
    <div class="stat"><span class="label">เฉลี่ยต่อคน</span><b class="num">${baht(Math.round(total/t.members.length))}</b></div>
    <div class="stat"><span class="label">คุณสำรองจ่าย</span><b class="num">${baht(paidBy[me]||0)}</b></div>
  </div>
  <section class="panel"><h2>ตามหมวดหมู่</h2>${bars(byCat,k=>CATS[k]||k,total)}</section>
  <section class="panel"><h2>ตามกิจกรรม</h2>${bars(byAct,k=>esc(k),total)}</section>
  <section class="panel"><h2>แต่ละคนใช้ไปเท่าไร</h2>${bars(share,k=>esc(P(k).name)+(k===me?' (คุณ)':''),total)}</section>`;
}

function vSettle(t){
  const st=settle(t),mine=st.filter(s=>s.from===me||s.to===me),others=st.filter(s=>s.from!==me&&s.to!==me);
  const line=s=>{
    const pl=activePlan(t,s.from,s.to),info=pl&&planInfo(pl);
    const iPay=s.from===me,iGet=s.to===me;
    return `<div class="row">${av(s.from,'lg')}<span class="muted">${ic('chev',14)}</span>${av(s.to,'lg')}
      <div class="grow"><div class="t">${esc(nm(s.from))} → ${esc(nm(s.to))}</div>
      <div class="muted">${pl?`ผ่อน ${info.count}/${pl.months} งวด`:iPay?'คุณต้องจ่าย':iGet?'รอรับเงิน':''}</div></div>
      <div style="display:grid;justify-items:end;gap:4px"><b class="num ${iPay?'neg-t':iGet?'pos-t':''}">${baht(s.amount,2)}</b>
      ${iPay?`<button class="btn sm" data-pay="${s.from}|${s.to}">จ่าย</button>`:iGet?`<button class="btn sm line" data-remind="${s.from}">ทวง</button>`:''}</div></div>`;
  };
  const plans=Object.values(D.plans).filter(p=>p.trip===t.id&&!planInfo(p).done);
  const pend=tpay(t).filter(p=>p.to===me&&!p.confirmed);
  return `<div><h1>เคลียร์เงิน</h1><div class="muted">คำนวณให้โอนน้อยครั้งที่สุดแล้ว</div></div>
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
    ${(p.from===me||p.to===me)?`<button class="x" data-unpay="${p.id}" aria-label="ลบรายการจ่ายนี้">${ic('x',14)}</button>`:''}</div>`).join('')||'<div class="empty">ยังไม่มีการจ่าย</div>'}</div></section>`;
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
   <div class="two"><label class="f">ประเภท<select class="inp" id="cg-kind">${KINDS.map(k=>`<option>${k}</option>`).join('')}</select></label>
   <label class="f">วันที่ / รอบ<input class="inp" id="cg-dates" placeholder="เช่น 1–3 ธ.ค." maxlength="40"></label></div>
   <p class="muted" style="margin:0">สร้างแล้วจะได้ QR เชิญ ให้เพื่อนสแกนเข้ากลุ่มด้วยมือถือของตัวเอง</p>
   <button class="btn block" id="cg-go">สร้างกลุ่ม</button>`,sh=>{
    const go=sh.querySelector('#cg-go');
    go.onclick=async()=>{
      const name=sh.querySelector('#cg-name').value.trim();if(!name){toast('ใส่ชื่อกลุ่มก่อน');return}
      go.disabled=true;go.textContent='กำลังสร้าง…';
      try{
        const r=await api('/groups',{method:'POST',body:JSON.stringify({meta:{name,kind:sh.querySelector('#cg-kind').value,dates:sh.querySelector('#cg-dates').value.trim(),activities:acts}})});
        tab='home';adopt(r.group);closeSheet();sheetInvite();
      }catch(e){go.disabled=false;go.textContent='สร้างกลุ่ม';toast(e.code==='offline'?'ไม่มีอินเทอร์เน็ต':'สร้างกลุ่มไม่สำเร็จ ลองใหม่')}
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
   <div class="two"><label class="f">ประเภท<select class="inp" id="te-kind">${KINDS.map(k=>`<option ${k===t.kind?'selected':''}>${k}</option>`).join('')}</select></label>
   <label class="f">วันที่ / รอบ<input class="inp" id="te-dates" value="${esc(t.dates||'')}" maxlength="40"></label></div>
   <div class="label">กิจกรรมย่อย (ใช้แยกรายการ)</div><div class="chips" id="te-acts"></div>
   <div style="display:flex;gap:8px"><input class="inp" id="te-act" placeholder="เช่น ล่องแพ" maxlength="30"><button class="btn line" id="te-addact">เพิ่ม</button></div>
   <button class="btn block" id="te-save">บันทึก</button>
   <hr class="sep">
   <div class="sec-h" style="margin:0"><h2>สมาชิก</h2><button class="link" id="te-inv">เชิญด้วย QR</button></div>
   <div class="box list" id="te-mem"></div>
   <details class="box" style="padding:12px 14px"><summary style="cursor:pointer;font-weight:600">+ เพิ่มเพื่อนที่ไม่ได้ใช้แอป</summary><div style="display:grid;gap:10px;margin-top:12px"><p class="muted" style="margin:0">ถ้าเพื่อนคนนี้มาใช้แอปทีหลัง ตอนสแกนเข้ากลุ่มให้แตะ "ฉันคือ…" เพื่อรับชื่อนี้ไป</p>${personFields({},'nf')}<button class="btn line" id="nf-go">เพิ่มเพื่อนคนนี้</button></div></details>
   <hr class="sep">
   <button class="btn line block" id="te-leave">ออกจากกลุ่มนี้</button>
   ${isOwner?'<button class="btn danger block" id="te-del">ลบกลุ่มนี้ทั้งหมด</button>':''}`,sh=>{
    const drawActs=()=>sh.querySelector('#te-acts').innerHTML=acts.map((a,i)=>`<span>${esc(a)}<button data-rm="${i}" aria-label="ลบ ${esc(a)}">${ic('x',12)}</button></span>`).join('')||'<span class="muted">ยังไม่มี</span>';
    const drawMem=()=>sh.querySelector('#te-mem').innerHTML=trip().members.map(m=>`<div class="row">${av(m,'lg')}<div class="grow"><div class="t">${esc(P(m).name)}${m===me?' (คุณ)':''}</div><div class="muted">${m===G.owner?'คนสร้างกลุ่ม':P(m).claimed?'ใช้แอปอยู่':'ยังไม่ได้ใช้แอป'}</div></div>
      ${m!==me&&!P(m).claimed&&!involved(t,m)?`<button class="x" data-kick="${m}" aria-label="เอา ${esc(P(m).name)} ออก">${ic('x',14)}</button>`:''}</div>`).join('');
    drawActs();drawMem();
    sh.querySelector('#te-acts').onclick=e=>{const b=e.target.closest('[data-rm]');if(!b)return;acts.splice(+b.dataset.rm,1);drawActs()};
    sh.querySelector('#te-mem').onclick=async e=>{const b=e.target.closest('[data-kick]');if(!b)return;await del('people',b.dataset.kick);drawMem();toast('เอาออกจากกลุ่มแล้ว')};
    const addAct=()=>{const i=sh.querySelector('#te-act');const v=i.value.trim();if(v&&!acts.includes(v)){acts.push(v);drawActs()}i.value='';i.focus()};
    sh.querySelector('#te-addact').onclick=addAct;
    sh.querySelector('#te-act').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();addAct()}};
    sh.querySelector('#te-inv').onclick=sheetInvite;
    sh.querySelector('#nf-go').onclick=async()=>{
      const p=readPerson(sh,'nf');if(!p)return;
      await put('people',{id:uid(),...p,claimed:false,joinedAt:nowISO()});drawMem();
      ['name','pp','acct'].forEach(k=>sh.querySelector('#nf-'+k).value='');toast('เพิ่ม '+p.name+' แล้ว');
    };
    sh.querySelector('#te-save').onclick=async()=>{
      const name=sh.querySelector('#te-name').value.trim();if(!name){toast('ใส่ชื่อก่อน');return}
      if(!acts.length)acts=['ทั่วไป'];
      closeSheet();if(await put('trips',{id:t.id,name,kind:sh.querySelector('#te-kind').value,dates:sh.querySelector('#te-dates').value.trim(),activities:acts}))toast('บันทึกแล้ว');
    };
    twoTap(sh.querySelector('#te-leave'),'แตะอีกครั้ง (ชื่อและรายการของคุณยังอยู่ในกลุ่ม)',async()=>{const id=G.id;closeSheet();try{await api(`/groups/${id}/leave`,{method:'POST'});leaveLocal(id);toast('ออกจากกลุ่มแล้ว')}catch(err){toast('ทำรายการไม่สำเร็จ ลองใหม่')}});
    const d=sh.querySelector('#te-del');
    if(d)twoTap(d,'แตะอีกครั้งเพื่อลบกลุ่มของทุกคน',async()=>{
      const id=G.id;closeSheet();
      try{await api(`/groups/${id}`,{method:'DELETE'});leaveLocal(id);toast('ลบกลุ่มแล้ว')}catch(err){toast('ลบไม่สำเร็จ ลองใหม่')}
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

function sheetPerson(id){
  const isMe=!id||id===me, p=isMe?profile:D.people[id];
  openSheet(isMe?'บัญชีของคุณ':'ข้อมูลของ '+p.name,`${isMe?`<div class="kv"><span class="av lg me">${esc(profile.name[0])}</span><div class="grow"><div class="label">ชื่อผู้ใช้</div><b>@${esc(user.username)}</b></div></div>`:''}
   ${personFields(p)}
   ${isMe?'<p class="muted" style="margin:0">ใช้กับบัญชีของคุณทุกเครื่อง และอัปเดตให้กลุ่มที่กำลังดูอยู่</p>':''}
   <button class="btn block" id="pf-save">บันทึก</button>
   ${isMe?`<hr class="sep"><details class="box" style="padding:12px 14px"><summary style="cursor:pointer;font-weight:600">เปลี่ยนรหัสผ่าน</summary><form id="pw-form" style="display:grid;gap:10px;margin-top:12px" novalidate>
     <input type="text" autocomplete="username" value="${esc(user.username)}" hidden>
     <label class="f">รหัสผ่านปัจจุบัน<input class="inp" type="password" id="pw-cur" autocomplete="current-password"></label>
     <label class="f">รหัสผ่านใหม่ (อย่างน้อย 8 ตัว)<input class="inp" type="password" id="pw-new" autocomplete="new-password"></label>
     <button class="btn line" type="submit">เปลี่ยนรหัสผ่าน</button><p class="note" style="margin:0">เครื่องอื่นที่ล็อกอินอยู่จะถูกออกจากระบบ</p></form></details>
     <button class="btn danger block" id="pf-out">ออกจากระบบ</button>`:''}`,sh=>{
    const out=sh.querySelector('#pf-out');
    if(out)out.onclick=async()=>{try{await api('/auth/logout',{method:'POST'})}catch(e){}signedOut();toast('ออกจากระบบแล้ว')};
    const pw=sh.querySelector('#pw-form');
    if(pw)pw.onsubmit=async e=>{e.preventDefault();const c=sh.querySelector('#pw-cur').value,n=sh.querySelector('#pw-new').value;
      if(n.length<8){toast(AUTH_ERR.bad_password);return}
      try{await api('/auth/password',{method:'POST',body:JSON.stringify({current:c,next:n})});closeSheet();toast('เปลี่ยนรหัสผ่านแล้ว')}
      catch(err){toast(err.code==='wrong_password'?'รหัสผ่านปัจจุบันไม่ถูกต้อง':AUTH_ERR[err.code]||'เปลี่ยนไม่สำเร็จ')}};
    sh.querySelector('#pf-save').onclick=async()=>{
      const v=readPerson(sh);if(!v)return;
      if(isMe){try{const r=await api('/me',{method:'PUT',body:JSON.stringify({profile:v})});setUser(r.user)}catch(err){toast(AUTH_ERR[err.code]||'บันทึกไม่สำเร็จ');return}
        if(G&&G.members[me])await put('people',{...G.members[me],...v,id:me});render()}
      else await put('people',{...D.people[id],...v,id});
      closeSheet();toast('บันทึกแล้ว');
    };
  });
}

function sheetExpense(id){
  const t=trip(),old=id?D.expenses[id]:null;
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
   <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><span class="label">หารกับใคร</span>
     <div class="seg" id="ex-mode"><button data-m="eq">หารเท่ากัน</button><button data-m="cu">กำหนดเอง</button></div></div>
   <div id="ex-split"></div>
   <button class="btn block" id="ex-save">บันทึก</button>
   ${old?'<button class="btn danger block" id="ex-del">ลบรายการนี้</button>':''}`,sh=>{
    const amtEl=sh.querySelector('#ex-amt');
    const drawPayer=()=>sh.querySelector('#ex-payer').innerHTML=t.members.map(m=>`<button data-p="${m}" aria-pressed="${m===payer}">${av(m)}${esc(nm(m))}</button>`).join('');
    const drawSplit=()=>{
      sh.querySelectorAll('#ex-mode [data-m]').forEach(x=>x.setAttribute('aria-pressed',x.dataset.m===mode2));
      const amt=+amtEl.value||0;
      if(mode2==='eq'){
        sh.querySelector('#ex-split').innerHTML=`<div class="who">${t.members.map(m=>`<button data-s="${m}" aria-pressed="${sel.has(m)}">${av(m)}${esc(nm(m))}</button>`).join('')}</div>
          <p class="muted num" style="margin:8px 0 0">${sel.size?`คนละ ${baht(amt/sel.size,2)} · ${sel.size} คน`:'เลือกอย่างน้อย 1 คน'}</p>`;
      }else{
        sh.querySelector('#ex-split').innerHTML=t.members.map(m=>`<div class="split-row">${av(m)}<span style="flex:1">${esc(nm(m))}</span><input class="inp num" id="cu-${m}" data-cu="${m}" inputmode="decimal" placeholder="0" value="${old&&old.split[m]?old.split[m]:''}"></div>`).join('')+`<p class="muted num" id="cu-left" style="margin:6px 0 0"></p>`;
        const upd=()=>{const s=[...sh.querySelectorAll('[data-cu]')].reduce((a,i)=>a+(+i.value||0),0),a=+amtEl.value||0;sh.querySelector('#cu-left').innerHTML=`ใส่แล้ว ${baht(s,2)} จาก ${baht(a,2)}${Math.abs(a-s)>0.01?` · <span class="neg-t">ต่างกัน ${baht(r2(a-s),2)}</span>`:''}`};
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
    });
    sh.querySelector('#ex-save').onclick=async()=>{
      const amt=r2(+amtEl.value||0);
      if(!(amt>0)){toast('ใส่จำนวนเงินก่อน');amtEl.focus();return}
      let split={};
      if(mode2==='eq'){if(!sel.size){toast('เลือกคนหารอย่างน้อย 1 คน');return}split=eqSplit(t.members.filter(m=>sel.has(m)),amt)}
      else{sh.querySelectorAll('[data-cu]').forEach(i=>{const v=r2(+i.value||0);if(v>0)split[i.dataset.cu]=v});
        const s=Object.values(split).reduce((a,v)=>a+v,0);if(Math.abs(s-amt)>0.01){toast('ยอดที่แบ่งยังไม่เท่ากับยอดรวม');return}}
      const cat=sh.querySelector('#ex-cat').value;
      const doc={id:old?.id||uid(),trip:t.id,title:sh.querySelector('#ex-title').value.trim()||CATS[cat],amount:amt,payer,split,cat,act:sh.querySelector('#ex-act').value,date:sh.querySelector('#ex-date').value||todayDate(),createdAt:old?.createdAt||nowISO(),by:me};
      closeSheet();if(await put('expenses',doc))toast(old?'แก้ไขแล้ว':'บันทึกแล้ว');
    };
    const d=sh.querySelector('#ex-del');if(d)twoTap(d,'แตะอีกครั้งเพื่อยืนยันการลบ',async()=>{closeSheet();if(await del('expenses',old.id))toast('ลบรายการแล้ว')});
    if(!old)setTimeout(()=>amtEl.focus(),60);
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
      ops.push({op:'put',col:'payments',id:uid(),doc:{trip:t.id,from,to,amount:a,confirmed:false,createdAt:nowISO(),...(planId?{plan:planId}:{})}});
      closeSheet();if(await send(ops))toast(`บันทึกแล้ว รอ${rcv.name}ยืนยัน`);
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
  if(ds.exp)return sheetExpense(ds.exp);
  if(ds.pay){const[f,t]=ds.pay.split('|');return sheetPay(f,t)}
  if(ds.remind)return sheetRemind(ds.remind);
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
  const first=entry(curId)?curId:groups[0]?.id;
  if(first)load(first);else render();
})();
