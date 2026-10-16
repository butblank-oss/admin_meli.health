var App=(function(){
"use strict";
var $=function(s,r){return (r||document).querySelector(s)},
    $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))},
    el=function(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e},
    esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})},
    fmt=function(n){return Number(n).toLocaleString('ko-KR')},
    pad2=function(n){return String(n).padStart(2,'0')};
function rnd(s){var x=Math.sin(s)*10000;return x-Math.floor(x)}

var CHEV='<svg width="12" height="12" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 7 9 11.5 13.5 7"/></svg>';
var LT='<svg width="13" height="13" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 3.5 5.5 9 11 14.5"/></svg>';
var RT='<svg width="13" height="13" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 3.5 5.5 5.5L7 14.5"/></svg>';
var CK='<svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10.5 8 14.5 16 6"/></svg>';
var BANG='<svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M10 5.5v5M10 14.2v.3"/></svg>';
var SRCH='<svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="9" cy="9" r="5.5"/><path d="m13.5 13.5 3.5 3.5"/></svg>';

var P={ok:['#ECFDF3','#067647','#17B26A'],wa:['#FFFAEB','#B54708','#F79009'],
 cr:['#FEF3F2','#B42318','#F04438'],nu:['#F2F4F7','#475467','#98A2B3'],in:['#EFF8FF','#175CD3','#2E90FA']};
function pill(t,k){var c=P[k];return '<span class="mpill" style="background:'+c[0]+';color:'+c[1]+'"><span class="mdot" style="background:'+c[2]+'"></span>'+t+'</span>'}
function note(t,k){var c={ok:['#ECFDF3','#067647','#17B26A'],wa:['#FFFAEB','#B54708','#F79009'],cr:['#FEF3F2','#B42318','#F04438'],nu:['#F9FAFB','#475467','#98A2B3'],in:['#EFF8FF','#175CD3','#2E90FA']}[k||'nu'];
  return '<div class="note" style="background:'+c[0]+';color:'+c[1]+'"><span class="mdot" style="background:'+c[2]+';margin-top:7px"></span><span>'+t+'</span></div>'}
function kpi(items){
  return '<div class="mc kpi" style="grid-template-columns:repeat('+items.length+',minmax(0,1fr))">'+items.map(function(x){
    var fg={wa:'#B54708',cr:'#B42318',ok:'#067647'}[x[4]]||'#101828';
    var dt={wa:'#F79009',cr:'#F04438',ok:'#17B26A'}[x[4]]||'';
    var nc={up:'#067647',down:'#B42318'}[x[5]]||(x[4]?fg:'#69707C');
    return '<div><div class="ml" style="font-size:12.5px;display:flex;align-items:center;color:'+(x[4]?fg:'#475467')+'">'+
      (dt?'<span class="mdot" style="background:'+dt+';margin-right:5px"></span>':'')+x[0]+'</div>'+
      '<div class="mt" style="margin-top:6px;font-size:24px;font-weight:700;letter-spacing:-0.03em;color:'+fg+'">'+x[1]+
      (x[2]?'<span style="font-size:12.5px;color:#667085;font-weight:600;margin-left:2px">'+x[2]+'</span>':'')+'</div>'+
      (x[3]?'<div class="mcap mt" style="margin-top:5px;color:'+nc+'">'+x[3]+'</div>':'')+'</div>'}).join('')+'</div>'}
function cbx(s,label){return '<span class="cbx'+(s==='on'?' on':s==='mx'?' mx':'')+'" role="checkbox" tabindex="0"'+
  ' aria-checked="'+(s==='on'?'true':s==='mx'?'mixed':'false')+'"'+(label?' aria-label="'+esc(label)+'"':'')+'>'+
  '<svg width="10" height="10" viewBox="0 0 20 20" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10.5 8 14.5 16 6"/></svg><span class="b"></span></span>'}
function brow(l,pct,v,cls,lw){return '<div class="brow"><span class="l"'+(lw?' style="width:'+lw+'"':'')+'>'+l+'</span><span class="bar"><i class="'+(cls||'')+'" style="width:'+pct+'%"></i></span><span class="v">'+v+'</span></div>'}
function ph(title,sub,acts){return '<div class="ph"><div><h1 class="ttl">'+title+'</h1>'+(sub?'<div class="mcap mt" style="margin-top:5px">'+sub+'</div>':'')+'</div>'+(acts?'<div class="acts">'+acts+'</div>':'')+'</div>'}
function card(inner,style){return '<div class="mc"'+(style?' style="'+style+'"':'')+'>'+inner+'</div>'}
function chead(t,r){return '<div style="padding:16px 20px 12px;display:flex;align-items:center;gap:10px"><h2 class="mh">'+t+'</h2>'+(r?'<span style="margin-left:auto;display:flex;gap:8px;align-items:center">'+r+'</span>':'')+'</div>'}
function emptyBox(t,d,btn){return '<div class="empty"><span class="mh">'+t+'</span>'+(d?'<span class="mcap">'+d+'</span>':'')+(btn?'<button class="mb" style="margin-top:4px">'+btn+'</button>':'')+'</div>'}
function search(id,ph2,w){return '<span style="position:relative;display:inline-flex;align-items:center;width:'+(w||'300px')+'">'+
  '<span style="position:absolute;left:11px;color:#69707C;display:flex">'+SRCH+'</span>'+
  '<input class="mfld" id="'+id+'" style="width:100%;padding-left:33px;padding-right:30px" placeholder="'+ph2+'">'+
  '<button id="'+id+'-x" type="button" aria-label="검색어 지우기" style="display:none;position:absolute;right:9px;width:17px;height:17px;border-radius:999px;background:#69707C;color:#fff;border:none;cursor:pointer;align-items:center;justify-content:center;font-size:10px;line-height:1">✕</button></span>'}
function sth(label,key,st,num){
  var on=st.key===key,col=on?'#101828':'#667085',fw=on?'700':'500';
  var ar=!on?'<svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#D0D5DD" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4.8 6 2.5l2 2.3"/><path d="M4 7.2 6 9.5l2-2.3"/></svg>'
   :'<svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#13BD7E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="'+(st.dir===1?'M3 7.5 6 4l3 3.5':'M3 4.5 6 8l3-3.5')+'"/></svg>';
  var as=on?(st.dir===1?'ascending':'descending'):'none';
  return '<th'+(num?' class="num"':'')+' data-sort="'+key+'" aria-sort="'+as+'">'+
    '<span class="sw" role="button" tabindex="0" style="color:'+col+';font-weight:'+fw+'">'+label+
    '<span class="sr">'+(on?(st.dir===1?', 오름차순 정렬됨':', 내림차순 정렬됨'):', 정렬하려면 누르세요')+'</span>'+ar+'</span></th>'}
/* 탭 묶음에 tablist 의미와 좌우 화살표 이동을 붙인다 (W3C tabs 패턴) */
function bindTabs(host){
  if(!host)return;
  host.setAttribute('role','tablist');
  var tabs=$$('.tab',host);
  tabs.forEach(function(t,i){
    t.setAttribute('role','tab');t.type='button';
    t.tabIndex=t.getAttribute('aria-selected')==='true'?0:-1;
    t.addEventListener('keydown',function(e){
      var d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:e.key==='Home'?'h':e.key==='End'?'e':0;
      if(!d)return;e.preventDefault();
      var n=d==='h'?0:d==='e'?tabs.length-1:(i+d+tabs.length)%tabs.length;
      tabs[n].focus();tabs[n].click()})})}
function bindSort(root,st,fn){$$('[data-sort]',root).forEach(function(h){
  function go2(){var k=h.dataset.sort;if(st.key===k)st.dir=-st.dir;else{st.key=k;st.dir=1}fn()}
  h.addEventListener('click',go2);
  h.addEventListener('keydown',function(e){if(e.key===' '||e.key==='Enter'){e.preventDefault();go2()}})})}
function sortBy(a,st,get){if(!st.key)return a;return a.slice().sort(function(x,y){
  var p=get(x,st.key),q=get(y,st.key);
  if(typeof p==='string')return st.dir*p.localeCompare(q,'ko');return st.dir*(p-q)})}
function mkPager(render){
  var st={page:1,size:20,total:0};
  st.render=function(host){
    var pages=Math.max(1,Math.ceil(st.total/st.size));
    if(st.page>pages)st.page=pages;
    var lo=st.total?(st.page-1)*st.size+1:0,hi=Math.min(st.total,st.page*st.size);
    host.innerHTML='';
    host.appendChild(el('span',null,'<span style="font-size:13px;color:#667085">총 <b class="mt" style="color:#101828">'+fmt(st.total)+'</b>건 중 <b class="mt" style="color:#101828">'+fmt(lo)+'–'+fmt(hi)+'</b></span>'));
    var sz=el('select','mfld');sz.style.cssText='height:30px;font-size:13px;border-radius:6px';
    [20,50,100].forEach(function(n){var o=el('option',null,n+'개씩');o.value=n;if(n===st.size)o.selected=true;sz.appendChild(o)});
    sz.setAttribute('aria-label','페이지당 표시 건수');
    sz.addEventListener('change',function(){st.size=+sz.value;st.page=1;render()});
    host.appendChild(sz);
    var pg=el('span','pgs');
    var pv=el('button','pgn',LT);pv.type='button';pv.setAttribute('aria-label','이전 페이지');pv.disabled=st.page<=1;pv.addEventListener('click',function(){st.page--;render()});pg.appendChild(pv);
    var list=[],last=0;
    for(var p=1;p<=pages;p++)if(p<=2||p>pages-1||Math.abs(p-st.page)<=1)list.push(p);
    list.forEach(function(p){
      if(last&&p-last>1)pg.appendChild(el('span',null,'<span style="color:#D0D5DD;padding:0 2px">…</span>'));
      var b=el('button','pgb',String(p));b.type='button';b.setAttribute('aria-label',p+'페이지');
      if(p===st.page){b.setAttribute('aria-current','page');b.setAttribute('aria-label',p+'페이지, 현재 페이지')}
      b.addEventListener('click',function(){st.page=p;render()});pg.appendChild(b);last=p});
    var nx=el('button','pgn',RT);nx.type='button';nx.setAttribute('aria-label','다음 페이지');nx.disabled=st.page>=pages;nx.addEventListener('click',function(){st.page++;render()});pg.appendChild(nx);
    host.appendChild(pg)};
  st.slice=function(a){st.total=a.length;return a.slice((st.page-1)*st.size,st.page*st.size)};
  return st}
var tseq=0;
function toast(text,kind,aLabel,aFn){
  var c={ok:['#ECFDF3','#067647'],cr:['#FEF3F2','#B42318'],wa:['#FFFAEB','#B54708']}[kind||'ok'];
  var t=el('div','toast');
  t.setAttribute('role',kind==='cr'?'alert':'status');
  t.innerHTML='<span class="i" aria-hidden="true" style="background:'+c[0]+';color:'+c[1]+'">'+(kind==='cr'?BANG:CK)+'</span><span class="x">'+esc(text)+'</span>';
  if(aLabel){var b=el('button','a',esc(aLabel));b.addEventListener('click',function(){if(aFn)aFn();cl()});t.appendChild(b)}
  $('#toasts').appendChild(t);
  var to=setTimeout(cl,aLabel?6000:3000);
  function cl(){clearTimeout(to);if(t.parentNode)t.parentNode.removeChild(t)}
  return cl}
/* 모달 열 때 포커스를 안으로 넣고, 닫을 때 원래 자리로 돌려준다.
   이게 없으면 키보드 사용자는 모달을 열어도 포커스가 뒤쪽 페이지에 남는다 */
var lastFocus=null;
function open(id){
  var m=$('#'+id);if(!m)return;
  lastFocus=document.activeElement;
  m.classList.add('on');
  var f=m.querySelector('select,input,textarea,button:not([data-close])')||m.querySelector('button');
  if(f)f.focus();
}
function closeAll(){
  var was=$$('.mask.on').length;
  $$('.mask').forEach(function(m){m.classList.remove('on')});
  if(was&&lastFocus&&lastFocus.isConnected){lastFocus.focus();lastFocus=null}
}
/* 모달 안에서 Tab이 바깥으로 새지 않게 가둔다 */
document.addEventListener('keydown',function(e){
  if(e.key!=='Tab')return;
  var m=$('.mask.on');if(!m)return;
  var f=$$('a[href],button:not([disabled]),select,input,textarea,[tabindex]:not([tabindex="-1"])',m)
        .filter(function(x){return x.offsetParent!==null});
  if(!f.length)return;
  var first=f[0],last=f[f.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
});
document.addEventListener('click',function(e){
  var m=e.target.closest('[data-modal]');if(m)open(m.dataset.modal);
  if(e.target.closest('[data-close]')||e.target.classList.contains('mask'))closeAll();
  var g=e.target.closest('[data-go]');if(g)go(g.dataset.go)});
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){closeAll();return}
  /* 커스텀 체크박스는 span이라 스페이스/엔터가 먹지 않는다. 클릭으로 바꿔 기존 핸들러를 그대로 쓴다 */
  var c=e.target.closest&&e.target.closest('.cbx[role="checkbox"]');
  if(c&&(e.key===' '||e.key==='Enter')){e.preventDefault();c.click()}});

/* ═══ data ═══ */
var ORGS=['남동구보건소','만수노인문화센터','남동구노인복지관','만월종합사회복지관','미배정'];
var SUR='김이박최정강조윤장임한오서신권황안송류전홍고문양손배백허유남'.split('');
var GIV=['순','자','옥','희','수','식','호','철','영','미','숙','현','진','규','화','태','근','만','복','례'];
var BRAIN=['꿀벌의 숫자놀이','기찻길 만들기','기억의 숨바꼭질','재밌는 숫자 퍼즐 4X4','숨은 헬씨 찾기','양말정리 대작전','초성 퀴즈','진짜 색깔 찾기'];
var MIND=['호흡으로 마음 가라앉히기','핸드크림 바르며 손 마사지하기','오늘 감사한 일 적기','좋았던 기억 떠올리기'];
var ASMT=['주관적 기억감퇴 평가 설문','노인우울 간편 검사','불면증 자가진단'];
var ROUT=[
 {n:'상체·유연성 운동',area:'어깨·목·상체',lv:'하',how:'의자에 앉거나 서서 천천히 진행해요. 반동을 주지 않고 늘어나는 느낌이 드는 지점에서 10초간 유지하세요. 통증이 있으면 바로 멈춰요.',
  mv:[['서서 깍지 낀 팔 당기며 상체 숙이기','2세트 × 10회'],['앉아서 머리 사선으로 당기기, 왼쪽','10초 × 3회'],['앉아서 머리 사선으로 당기기, 오른쪽','10초 × 3회'],['의자 잡고 팔 뻗어 어깨 펴기','2세트 × 8회'],['손가락 앞으로 모았다 펴기, 왼쪽','2세트 × 10회'],['손가락 앞으로 모았다 펴기, 오른쪽','2세트 × 10회'],['고양이 자세로 어깨 늘리기, 왼쪽','10초 × 3회'],['고양이 자세로 어깨 늘리기, 오른쪽','10초 × 3회']]},
 {n:'전신·지구력 운동',area:'전신·심폐',lv:'중',how:'가벼운 걷기로 몸을 데운 뒤 진행해요. 호흡이 많이 가빠지면 쉬었다가 이어가세요. 밴드는 무릎 위에 겁니다.',
  mv:[['제자리 걷기','2분'],['밴드 걸고 무릎 굽혀 옆으로 걷기','좌우 각 10걸음'],['의자에 앉아 미니 스쿼트','2세트 × 8회'],['누워서 복부에 손 얹고 복부 호흡','10회']]},
 {n:'하체·균형 운동',area:'하체·균형',lv:'중',how:'넘어짐을 막기 위해 반드시 의자나 벽을 잡을 수 있는 곳에서 진행해요.',
  mv:[['의자 잡고 한 발로 서기, 왼쪽','30초'],['의자 잡고 한 발로 서기, 오른쪽','30초'],['발뒤꿈치 들었다 내리기','2세트 × 12회'],['옆으로 걷기','좌우 각 10걸음'],['의자 잡고 다리 뒤로 들기','좌우 각 8회']]},
 {n:'가볍게 걷기 10분',area:'유산소',lv:'하',how:'실내에서도 할 수 있어요. 시선은 정면, 팔은 자연스럽게 흔들며 대화가 가능한 속도를 유지하세요.',
  mv:[['제자리 걷기','5분'],['팔 크게 흔들며 걷기','5분']]}];
/* 등급 구간은 '활동 현황 → 판정 기준' 탭의 표와 반드시 같아야 한다.
   두 곳이 어긋나면 위험군 자동 선별이 조용히 틀어진다. 표준 척도 기준. */
var TESTS=[{c:'gds-sf',n:'노인우울 (GDS-SF)',max:15,items:15,
  lv:function(s){return s<=5?['정상','ok']:s<=9?['주의','wa']:['위험','cr']}},
 {c:'isi-k',n:'불면증 (ISI-K)',max:28,items:7,
  lv:function(s){return s<=7?['정상','ok']:s<=14?['주의','wa']:s<=21?['중등도','cr']:['심각','cr']}},
 {c:'pss',n:'스트레스 (PSS)',max:40,items:10,
  lv:function(s){return s<=13?['정상','ok']:s<=16?['주의','wa']:s<=18?['높음','cr']:['매우 높음','cr']}},
 {c:'smcq',n:'기억감퇴 (SMCQ)',max:14,items:14,
  lv:function(s){return s<=5?['정상','ok']:['주의','wa']}}];

/* ═══════════ 내 채널 정보 (설정) ═══════════
   화면에 흩어져 하드코딩돼 있던 값을 한곳에 모은다.
   locked 는 법정·계약·시스템 제약이라 채널이 못 바꾼다 — 슈퍼에 변경 요청만 보낸다. */
var CFG={
  name:'인천 남동구 치매안심센터', key:'C-PRD-CARE-0001',
  recvOrg:'인천남동구 보건소', recvTitle:'건강관리팀장',
  sendOrg:'㈜원메딕스인더스트리', writer:'김주무 주무관',
  docNo:'남동보건-{YYYY}-{NNN}', form:'남동구 보건소 표준 공문',
  warn:7, risk:14,
  pushFrom:9, pushTo:18,
  locked:{escalateDays:3, remaskSec:30, retainYears:2, idleMin:30,
          dormantDays:60, permYears:3, pwMin:10, failLock:5, keepYears:3,
          contract:'2026-03-01 ~ 2026-12-31'}};

/* ═══════════ 판정 기준 버전 ═══════════
   기준을 바꿔도 과거 판정을 덮어쓰지 않는다.
   보건소에 이미 제출한 숫자가 나중에 달라지면 해명할 방법이 없고,
   위험군 등급은 상담·연계 판단의 근거라서 사후 변경은 기록 조작에 가깝다.

     정책 변경 → 소급 안 함. 적용 시작일 이후 판정만 새 기준.
     오류 정정 → 소급 함. 애초에 틀린 값이었으므로.

   화면에서 이 둘을 구분해서 고르게 한다. */
var RULEVER=[
  {from:'2026-03-03', warn:7, risk:14, kind:'policy', memo:'3기 개강 기준'}];
function ruleAt(dateStr){
  var r=RULEVER[0];
  for(var i=0;i<RULEVER.length;i++) if(RULEVER[i].from<=dateStr) r=RULEVER[i];
  return r}
function ruleNow(){return {warn:CFG.warn, risk:CFG.risk}}
function pushRule(from,warn,risk,kind,memo){
  RULEVER.push({from:from,warn:warn,risk:risk,kind:kind,memo:memo});
  RULEVER.sort(function(a,b){return a.from<b.from?-1:1})}

/* 무활동 구간 — 키는 고정, 라벨은 현재 기준을 따라간다 */
function band(p){return p.days===0?'none':p.last<=CFG.warn?'recent':p.last<=CFG.risk?'warn':'risk'}
function bandLabel(){return {none:'무활동',recent:'최근 활동',
  warn:CFG.warn+'일 무활동',risk:CFG.risk+'일+ 무활동'}}

/* ═══════════ 프로그램 그룹 ═══════════
   기수·상시반·코호트가 전부 이것의 인스턴스다. 계층으로 쪼개진다.
     kind   fixed  = 전원 같은 날 시작(개강형). 늦게 들어오면 잔존이 무너진다.
            rolling= 사람마다 등록일이 1일차(상시형). 병원 수술일 코호트도 여기.
     scope  site | multi | district | city
   생성은 슈퍼(Own). 채널은 담당자 지정과 운영(Operate)만 한다. */
var CH_SELF='인천 남동구 치매안심센터';
var KIND={fixed:['기수형','전원 같은 날 시작'],rolling:['상시형','등록일부터 개인별 시작']};
var SCOPE={site:'시설 1곳',multi:'여러 시설',district:'구 전체',city:'시 전체'};
var SITES=['남동구보건소','만수노인문화센터','남동구노인복지관','만월종합사회복지관',
           '구월동 경로당','간석동 경로당','논현동 경로당'];
var GROUPS=[
 {id:'g3',parent:null,ch:CH_SELF,name:'3기 두뇌운동 치매예방교실',kind:'fixed',anchor:'개강일',start:'2026-03-03',
  weeks:12,scope:'district',sites:['남동구 전체'],n:822,active:296,st:'진행 중',k:'ok',day:171,owner:'김주무',subs:['박선영']},
 {id:'gj',parent:null,ch:CH_SELF,name:'남동구 경로당',kind:'rolling',anchor:'등록일',start:'2026-05-11',
  weeks:0,scope:'district',sites:['경로당 3곳'],n:82,active:56,st:'진행 중',k:'ok',day:103,owner:'정미경',subs:[]},
 {id:'gj1',parent:'gj',ch:CH_SELF,name:'구월동 경로당',kind:'rolling',anchor:'등록일',start:'2026-05-11',
  weeks:0,scope:'site',sites:['구월동 경로당'],n:41,active:28,st:'진행 중',k:'ok',day:103,owner:'정미경',subs:[]},
 {id:'gj1w',parent:'gj1',ch:CH_SELF,name:'걷기 챌린지',kind:'fixed',anchor:'개강일',start:'2026-08-01',
  weeks:4,scope:'site',sites:['구월동 경로당'],n:41,active:22,st:'진행 중',k:'ok',day:39,owner:'정미경',subs:[]},
 {id:'gj1g',parent:'gj1',ch:CH_SELF,name:'게임 챌린지',kind:'fixed',anchor:'개강일',start:'2026-09-01',
  weeks:4,scope:'site',sites:['구월동 경로당'],n:0,active:0,st:'예정',k:'in',day:0,owner:null,subs:[]},
 {id:'gj2',parent:'gj',ch:CH_SELF,name:'논현동 경로당',kind:'rolling',anchor:'등록일',start:'2026-08-04',
  weeks:0,scope:'site',sites:['논현동 경로당'],n:18,active:15,st:'진행 중',k:'ok',day:18,owner:null,subs:[]},
 {id:'gj3',parent:'gj',ch:CH_SELF,name:'간석동 경로당',kind:'rolling',anchor:'등록일',start:'2026-06-02',
  weeks:0,scope:'site',sites:['간석동 경로당'],n:23,active:13,st:'진행 중',k:'ok',day:81,owner:'최한나',subs:[]},
 {id:'g4',parent:null,ch:CH_SELF,name:'4기 두뇌운동 치매예방교실',kind:'fixed',anchor:'개강일',start:'2026-11-02',
  weeks:12,scope:'district',sites:['남동구 전체'],n:0,active:0,st:'신청 접수 중',k:'in',day:0,owner:'김주무',subs:[]},
 {id:'g2',parent:null,ch:CH_SELF,name:'2기 두뇌운동 치매예방교실',kind:'fixed',anchor:'개강일',start:'2025-03-04',
  weeks:12,scope:'district',sites:['남동구 전체'],n:714,active:0,st:'종료',k:'nu',day:0,owner:'김주무',subs:[]},
 {id:'gx',parent:null,ch:CH_SELF,name:'미그룹',kind:'rolling',anchor:'가입일',start:'—',
  weeks:0,scope:'district',sites:['—'],n:133,active:44,st:'상시',k:'nu',day:0,owner:null,subs:[],ghost:1}];
var curGroup='g3';
function groupById(id){for(var i=0;i<GROUPS.length;i++)if(GROUPS[i].id===id)return GROUPS[i];return GROUPS[0]}
function getGroup(){return curGroup}
function putGroup(id){curGroup=id}
function groupDepth(g){var d=0,x=g;while(x&&x.parent){x=groupById(x.parent);d++}return d}
function groupTree(list){
  var out=[],byP={};
  list.forEach(function(g){(byP[g.parent||'_']=byP[g.parent||'_']||[]).push(g)});
  (function walk(pid){(byP[pid]||[]).forEach(function(g){out.push(g);walk(g.id)})})('_');
  return out}

/* ═══════════ 권한 — 역할은 계정이 아니라 자리(사람 × 그룹·기관)에 붙는다 ═══════════
   같은 사람이 A그룹 주관리자이면서 B그룹 부관리자일 수 있다.
   한 운영자는 한 채널만 운영한다. */
var ROLES={owner:['주관리자','ok'],sub:['부관리자','nu'],sys:['시스템관리자','in']};
var SITES_OWN={'남동구보건소':{owner:'김주무',subs:['박선영']},
  '만수노인문화센터':{owner:'박선영',subs:[]},
  '남동구노인복지관':{owner:'박선영',subs:['최한나']},
  '만월종합사회복지관':{owner:null,subs:[]},
  '미배정':{owner:null,subs:[]}};
var OPERATORS=[
 {id:'o1',name:'김주무',ch:CH_SELF,sys:0,last:'오늘 09:12',st:'정상',stK:'nu'},
 {id:'o2',name:'박선영',ch:CH_SELF,sys:0,last:'어제 17:40',st:'정상',stK:'nu'},
 {id:'o3',name:'정미경',ch:CH_SELF,sys:0,last:'3일 전',st:'정상',stK:'nu'},
 {id:'o4',name:'최한나',ch:CH_SELF,sys:0,last:'62일 전',st:'휴면',stK:'wa'},
 {id:'o5',name:'이운영',ch:'전체 채널',sys:1,last:'오늘 08:03',st:'정상',stK:'nu'}];
function siteOwner(o){return (SITES_OWN[o]||{}).owner||null}
function opChannel(name){
  for(var i=0;i<OPERATORS.length;i++)if(OPERATORS[i].name===name)return OPERATORS[i].ch;
  return null}
function assignments(name){
  var out=[],ch=opChannel(name),all=(ch==='전체 채널');
  GROUPS.forEach(function(g){
    if(g.ghost)return;
    if(!all&&ch&&g.ch!==ch)return;
    if(g.owner===name)out.push({kind:'group',ref:g,name:g.name,role:'owner'});
    else if((g.subs||[]).indexOf(name)>=0)out.push({kind:'group',ref:g,name:g.name,role:'sub'})});
  Object.keys(SITES_OWN).forEach(function(k){
    if(k==='미배정')return;
    if(!all&&ch&&ch!==CH_SELF)return;
    var o=SITES_OWN[k];
    if(o.owner===name)out.push({kind:'site',ref:o,name:k,role:'owner'});
    else if(o.subs.indexOf(name)>=0)out.push({kind:'site',ref:o,name:k,role:'sub'})});
  return out}
function ownedBy(name){return assignments(name).filter(function(a){return a.role==='owner'})
  .map(function(a){return a.name})}
function subsAt(a){return (a.kind==='group'?a.ref.subs:a.ref.subs)||[]}
/* 참여자 담당자는 저장하지 않는다 — 기관 담당자, 없으면 소속 그룹 담당자에서 파생 */
function ownerOf(p,g){return siteOwner(p.org)||(g&&g.owner)||null}
function canEditSched(){var g=groupById(getGroup());return g.owner==='김주무'}

/* 프로그램 일정 — 기본은 공식, 편집한 날만 덮어쓴다 */
var SCHED={};
function skey(y,m,d){return y+'-'+('0'+m).slice(-2)+'-'+('0'+d).slice(-2)}
/* 4기 이월 — 리포트에서 신청하면 쌓이고, 참여 신청에서 승인해야 참여자가 된다 */
var CARRY={done:false,n:0,at:'',from:'',to:''};

var PEOPLE=[],byId={};
for(var i=0;i<822;i++){(function(i){
  var r=function(k){return rnd(i*17+k)};
  var st=r(1)<0.976?'active':(r(2)<0.25?'dropped':'expired');
  /* 실측 분포에 맞춘다 — 무활동 198 · 최근 활동 191 · 8~14일 249 · 14일+ 무활동 184.
     곡선 하나로는 세 구간을 동시에 못 맞춰서 구간을 직접 배정한다. */
  var days=Math.floor(Math.pow(r(3),3.6)*170),u=r(4);
  var last=days===0?999
    :u<0.306?Math.floor(u/0.306*7)
    :u<0.705?7+Math.floor((u-0.306)/0.399*7)
    :15+Math.floor((u-0.705)/0.295*145);
  var p={idx:i,id:'P'+(10000+i),sur:SUR[Math.floor(r(5)*SUR.length)],mid:GIV[Math.floor(r(6)*GIV.length)],end:GIV[Math.floor(r(7)*GIV.length)],
   tail:String(1000+Math.floor(r(8)*8999)).slice(0,4),mid4:String(1000+Math.floor(r(14)*8999)).slice(0,4),
   pin:String(1000+Math.floor(r(22)*8999)).slice(0,4),birth:1930+Math.floor(Math.pow(r(9),0.8)*40),
   sex:r(10)<0.79?'여성':(r(11)<0.9?'남성':'미상'),
   org:r(13)<0.145?'미배정':ORGS[Math.floor(r(12)*4)],
   status:st,days:days,last:last,rate:days===0?0:Math.min(99,Math.round(Math.pow(r(15),1.4)*100)),
   app:['4.0.7','4.0.6','4.0.5','4.0.3','3.4.0'][Math.floor(Math.pow(r(16),2)*5)],
   score:Math.round(Math.pow(r(17),1.3)*1000),streak:Math.floor(Math.pow(r(18),2)*22),
   mind:Math.floor(Math.pow(r(19),2.5)*20),symp:Math.floor(Math.pow(r(20),3)*10),
   step:Math.floor(r(21)*11000),todayN:last===0?1+Math.floor(r(23)*4):0,
   installed:r(24)>0.04,notif:r(25)>0.03};
  p.name=p.sur+'*'+p.end;p.full=p.sur+p.mid+p.end;
  p.phone='010-****-'+p.tail;p.phoneFull='010-'+p.mid4+'-'+p.tail;
  p.age=2026-p.birth;
  /* 동의 — 민감정보는 다른 개인정보 동의와 '별도로' 받아야 한다(법 제23조①).
     앱 가입 시 일괄 동의만 받은 케이스가 섞여 있다. 현실에 가깝고, 화면이 그걸 드러내야 한다. */
  var cd=function(off){var d=new Date(2026,2,3);d.setDate(d.getDate()+off);
    return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate())};
  var cv=r(29);
  p.consent={service:cd(0),privacy:cd(0),
    sensitive: cv<0.88?cd(0):null,
    third:     cv<0.72?cd(0):null, revoked:null};
  /* 그룹 합류일 — 이 날 이전은 미그룹 기간이라 채널이 볼 수 없다 */
  var jw=r(28);
  p.joinW=jw<0.60?0:jw<0.78?1:jw<0.88?2:jw<0.95?8:11;
  p.joinG=new Date(2026,2,3+p.joinW*7);
  p.ageBand=p.age<60?'60대 미만':p.age<70?'60대':p.age<80?'70대':'80대 이상';

  PEOPLE.push(p);byId[p.id]=p})(i)}

/* ═══════════ 지표 — 단일 계산 지점 ═══════════
   화면은 직접 세지 않는다. 전부 M.<키>() 로 가져간다.
   같은 지표가 화면마다 다른 숫자를 내는 건 어드민 신뢰를 무너뜨리는 1순위 사고고,
   원인은 언제나 "화면마다 따로 셌다"이다. 여기 없는 숫자는 화면에 쓰지 않는다.
   판정 기준 탭이 이 배열을 렌더하므로 정의서와 화면이 어긋날 수 없다. */
function pCount(f){var n=0;for(var i=0;i<PEOPLE.length;i++)if(f(PEOPLE[i]))n++;return n}
var METRICS=[
 {k:'audience',n:'대상자 수',d:'그룹에 배정된 전원',f:'audienceCount',use:'오늘 · 참여자 · 리포트',
  c:function(){return PEOPLE.length}},
 {k:'participant',n:'참여자 수',d:'해당 월 참여 상태 유지자',f:'participantCount',use:'리포트',
  c:function(){return pCount(function(p){return p.status==='active'})}},
 {k:'activist',n:'활동자 수',d:'해당 월 1회 이상 활동',f:'activistCount',use:'오늘 · 활동 현황 · 리포트',
  c:function(){return pCount(function(p){return p.days>0&&p.last<=30})}},
 {k:'weekActive',n:'최근 활동',d:'마지막 활동이 경고 기준일 이내',f:'weeklyActivistCount',use:'오늘 · 참여자',
  c:function(){return pCount(function(p){return band(p)==='recent'})}},
 {k:'inactive7',n:'경고 구간 무활동',d:'경고 기준 초과 ~ 위험 기준 이내',f:'inactive7Count',use:'참여자',
  c:function(){return pCount(function(p){return band(p)==='warn'})}},
 {k:'inactive14',n:'위험 구간 무활동',d:'위험 기준일 초과',f:'inactive14Count',use:'오늘 · 참여자 · 활동 현황',
  c:function(){return pCount(function(p){return band(p)==='risk'})}},
 {k:'never',n:'무활동',d:'가입 후 한 번도 활동 없음',f:'neverActiveCount',use:'참여자 · 리포트',
  c:function(){return pCount(function(p){return p.days===0})}},
 {k:'todayDone',n:'오늘 수행',d:'오늘 활동을 1회 이상 한 사람',f:'todayActivistCount',use:'오늘 · 참여자',
  c:function(){return pCount(function(p){return p.todayN>0})}},
 {k:'unassigned',n:'기관 미배정',d:'담당 복지관이 지정되지 않음',f:'unassignedCount',use:'참여자',
  c:function(){return pCount(function(p){return p.org==='미배정'})}},
 {k:'noSensitiveConsent',n:'민감정보 동의 없음',d:'건강정보 별도 동의를 받지 않은 참여자',f:'noSensitiveConsentCount',use:'참여자 · 오늘',
  c:function(){return pCount(function(p){return !p.consent.sensitive&&!p.consent.revoked})}},
 {k:'revoked',n:'동의 철회',d:'동의를 철회해 처리를 멈춰야 하는 참여자',f:'consentRevokedCount',use:'참여자',
  c:function(){return pCount(function(p){return !!p.consent.revoked})}},
 {k:'noOwnerGroup',n:'담당자 없는 그룹',d:'주관리자가 지정되지 않은 그룹',f:'ownerlessGroupCount',use:'프로그램 그룹 · 운영자',
  c:function(){return GROUPS.filter(function(g){return !g.owner&&!g.ghost&&g.st!=='종료'}).length}},
 {k:'noOwnerSite',n:'담당자 없는 기관',d:'기관 담당자가 지정되지 않음',f:'ownerlessSiteCount',use:'운영자',
  c:function(){var n=0;for(var k in SITES_OWN)if(k!=='미배정'&&!SITES_OWN[k].owner)n++;return n}},
 {k:'applyPending',n:'처리 안 된 신청',d:'승인·거절·보류 어느 것도 아닌 신청',f:'pendingApplyCount',use:'오늘 · 참여 신청',
  c:function(){return 111}},
 {k:'approvedNoApp',n:'승인 후 앱 미설치',d:'승인됐지만 앱에 가입하지 않음',f:'approvedNotJoinedCount',use:'오늘 · 참여 신청',
  c:function(){return 37}},
 {k:'consultWaiting',n:'답변 대기 상담',d:'참여자 마지막 발화 후 미답변',f:'unansweredRoomCount',use:'오늘 · 상담실',
  c:function(){return 4}},
 /* 값이 하나로 안 떨어지는 것 — 정의만 둔다 */
 {n:'수행률',d:'추천받은 활동 중 수행 비율',f:'활동수 ÷ 추천수',use:'참여자 · 참여자 상세'},
 {n:'랭킹 점수',d:'월 단위 총점 (최대 1000)',f:'600×(활동÷추천) + 400×(연속일÷추천일)',use:'참여자 상세'},
 {n:'PIN',d:'전화 응대용 조회번호',f:'vocNumber',use:'참여자 · 상담실'},
 {n:'무활동 판정',d:'마지막 활동 이후 경과일',f:'경고/위험 기준은 내 채널 정보에서',use:'오늘 · 참여자'}];
var M={};METRICS.forEach(function(m){if(m.k)M[m.k]=m.c});

function dayRec(p,d){
  /* 그룹 합류 이전은 미그룹 기간. UI만 가리면 합계가 어긋나므로 소스에서 막는다. */
  if(p.joinG&&d<p.joinG)return {acts:[],steps:0,mind:0,symp:0,locked:1};
  var doy=Math.floor((d-new Date(2026,0,1))/864e5),s=p.idx*991+doy*7;
  var dow=d.getDay(),wk=(dow===0||dow===6);
  var lastD=new Date(2026,7,21);lastD.setDate(lastD.getDate()-(p.last>900?9999:p.last));
  var lvl=p.days/170,on=d<=lastD&&rnd(s)<(wk?lvl*0.35:lvl*1.15);
  var n=on?1+Math.floor(rnd(s+1)*(wk?2:5)):0,acts=[];
  for(var k=0;k<n;k++){
    var t=rnd(s+2+k),kind=t<0.5?'두뇌훈련':t<0.85?'운동':'마음다루기';
    var ri=Math.floor(rnd(s+9+k)*ROUT.length);
    var nm=kind==='두뇌훈련'?BRAIN[Math.floor(rnd(s+9+k)*BRAIN.length)]:kind==='운동'?ROUT[ri].n:MIND[Math.floor(rnd(s+9+k)*MIND.length)];
    var pr=rnd(s+20+k),lab=pr<0.72?['완료','ok']:pr<0.84?['중단','wa']:['진입만','cr'];
    var hh=5+Math.floor(Math.pow(rnd(s+30+k),1.6)*15);
    acts.push({t:pad2(hh)+':'+pad2(Math.floor(rnd(s+40+k)*60)),kind:kind,name:nm,lab:lab,ri:kind==='운동'?ri:null,seed:s+k,
      score:kind==='두뇌훈련'&&lab[0]==='완료'?Math.round(100+rnd(s+50+k)*900):null,
      dur:lab[0]!=='진입만'?Math.round(40+rnd(s+60+k)*200):null})}
  acts.sort(function(a,b){return a.t<b.t?-1:1});
  return {steps:on||rnd(s+70)<lvl?Math.round(Math.pow(rnd(s+71),0.7)*(wk?7000:11000)):0,acts:acts,
    mind:on&&rnd(s+80)<0.25?1:0,symp:on&&rnd(s+81)<0.08?1:0}}
function moveRows(a){
  var rt=ROUT[a.ri],n=rt.mv.length;
  var done=a.lab[0]==='완료'?n:a.lab[0]==='중단'?Math.max(1,Math.floor(rnd(a.seed)*n)):0;
  var rows=[],hm=a.t.split(':'),mm=+hm[1];
  for(var j=0;j<done;j++)rows.push({t:hm[0]+':'+pad2((mm+j)%60),nm:rt.mv[j][0],p:'100%',z:0});
  if(a.lab[0]!=='완료'&&done<n)rows.push({t:hm[0]+':'+pad2((mm+done)%60),nm:rt.mv[done][0],p:'0',z:1});
  return {rows:rows,pct:a.lab[0]==='완료'?100:Math.round(done/n*100)}}
function assessHist(p){
  var out=[];
  TESTS.forEach(function(ts,ti){
    var n=p.days===0?0:1+Math.floor(rnd(p.idx*7+ti)*Math.min(5,1+p.days/30)),prev=null;
    for(var k=0;k<n;k++){
      var m=3+Math.floor(k*(5.5/Math.max(1,n-1||1))),dd=3+Math.floor(rnd(p.idx+ti*9+k)*24);
      if(m>8)m=8;if(m===8)dd=Math.min(dd,20);
      var sc=Math.round(rnd(p.idx*3+ti*11+k)*ts.max*0.85);
      out.push({date:'2026-'+pad2(m)+'-'+pad2(dd),time:pad2(6+Math.floor(rnd(p.idx+k)*12))+':'+pad2(Math.floor(rnd(p.idx+k+1)*60)),test:ts,score:sc,prev:prev});
      prev=sc}});
  out.sort(function(a,b){return a.date<b.date?1:-1});return out}

var QUESTS=[
 {id:'q1',n:'7월 출석 챌린지',type:'출석',ty:'attendance',s:'2026-07-01',e:'2026-07-31',crit:15,per:2,part:296,succ:66,st:'진행 중',days:31,m:7},
 {id:'q2',n:'7월 걷기 챌린지',type:'걷기',ty:'step',s:'2026-07-01',e:'2026-07-31',crit:20,per:3000,part:550,succ:171,st:'진행 중',days:31,m:7},
 {id:'q3',n:'6월 출석 챌린지',type:'출석',ty:'attendance',s:'2026-06-01',e:'2026-06-30',crit:14,per:2,part:284,succ:71,st:'완료',days:30,m:6},
 {id:'q4',n:'8월 걷기 챌린지',type:'걷기',ty:'step',s:'2026-08-01',e:'2026-08-31',crit:20,per:3000,part:0,succ:0,st:'예정',days:31,m:8}];
function achieve(p,q){
  var days=[],done=0;
  for(var d=1;d<=q.days;d++){
    var dt=new Date(2026,q.m-1,d),wk=(dt.getDay()===0||dt.getDay()===6),rec=dayRec(p,dt),hit;
    if(q.ty==='attendance')hit=!wk&&rec.acts.length>=q.per;else hit=rec.steps>=q.per;
    var s=hit?'hit':(q.ty==='attendance'&&wk)?'out':(rec.acts.length||rec.steps)?'miss':'none';
    if(hit)done++;days.push({d:d,st:s,steps:rec.steps,n:rec.acts.length})}
  return {days:days,done:done}}

var ADDR=['만수동','구월동','논현동','만월동','간석동','서창동','장수동'];
var APPS=[];
for(var j=0;j<144;j++){(function(i){
  var r=function(k){return rnd(i*31+k)};
  var st=i<80?'pending':i<86?'hold':i<120?'approved':'rejected';
  var a={id:'A'+i,sur:SUR[Math.floor(r(1)*SUR.length)],end:GIV[Math.floor(r(2)*GIV.length)],
   tail:String(1000+Math.floor(r(3)*8999)).slice(0,4),addr:'남동구 '+ADDR[Math.floor(r(4)*ADDR.length)],
   st:st,aged:Math.floor(r(5)*42)+1,signed:r(6)<0.25?'Y':'N',
   memo:st==='hold'?['주소 확인 필요','본인 확인 대기','기관 배정 협의 중'][Math.floor(r(7)*3)]:''};
  a.name=a.sur+'*'+a.end;a.phone='010-****-'+a.tail;APPS.push(a)})(j)}

/* ═══════════ 접속기록 ═══════════
   고시가 요구하는 5개 항목: 계정 · 접속일시 · 접속지 정보 · 처리한 정보주체 정보 · 수행업무.
   [8]에 대상 정보주체 식별자를 남긴다 — 건수만 남기면 '누구를 봤는지'가 사라져 증빙이 안 된다.
   [9]는 월간 점검 확인 여부. 민감정보 처리 시스템이라 2년 보관. */
var AUDIT=[
 ['2026-08-21 14:22','김주무','남동구 치매안심센터',0,'상세 열람','1건','미활동자 안부 연락','218.***.***.42',['안*순(5716)'],0],
 ['2026-08-21 09:10','김주무','남동구 치매안심센터',0,'명단 내려받기','184건','7월 보고자료 작성','218.***.***.42',['14일+ 무활동 184명'],0],
 ['2026-08-20 16:47','이운영','원메딕스 운영팀',1,'상세 열람','1건','앱 오류 문의 회신','121.***.***.8',['황*학(2727)'],1],
 ['2026-08-20 11:02','김주무','남동구 치매안심센터',0,'상세 열람','3건','우울 위험군 안부 확인','218.***.***.42',['정*순(5716)','이*자(3341)','최*옥(4413)'],1],
 ['2026-08-19 10:31','김주무','남동구 치매안심센터',0,'리포트 생성','7월분','보건소 제출','218.***.***.42',['집계값만 · 개별 식별 없음'],1],
 ['2026-08-19 08:12','김주무','남동구 치매안심센터',0,'푸시 발송','147명','무활동 어르신 안내','218.***.***.42',['14일+ 무활동 147명'],1],
 ['2026-08-18 15:55','김주무','남동구 치매안심센터',0,'신청자 명단 열람','111건','승인 검토','218.***.***.42',['대기 신청자 111명'],1],
 ['2026-08-15 09:40','김주무','남동구 치매안심센터',0,'탈퇴 처리','3건','연락 두절','218.***.***.42',['한*순(1180)','노*식(3341)','강*례(8827)'],1]];
function addAudit(act,tgt,reason,subjects){
  var d=new Date();
  AUDIT.unshift(['2026-08-21 '+pad2(d.getHours())+':'+pad2(d.getMinutes()),'김주무','남동구 치매안심센터',0,act,tgt,reason,'218.***.***.42',
    subjects||['—'],0]);
  if(V.audit)V.audit()}
/* 권한 변경 이력 — 열람 기록(2년)보다 1년 더(3년) 보관해야 해서 따로 쌓는다 */
var PERMLOG=[
 {at:'2026-08-04 18:02',who:'이운영',act:'권한 부여',tgt:'최한나',detail:'간석동 경로당 주관리자'},
 {at:'2026-06-11 09:41',who:'김주무',act:'권한 부여',tgt:'박선영',detail:'3기 부관리자'},
 {at:'2026-03-02 10:15',who:'이운영',act:'계정 생성',tgt:'김주무',detail:'남동구 주관리자 · 이메일 초대'}];
function addPermLog(act,tgt,detail){
  var d=new Date();
  PERMLOG.unshift({at:'2026-08-21 '+pad2(d.getHours())+':'+pad2(d.getMinutes()),
    who:'김주무',act:act,tgt:tgt,detail:detail})}

/* ═══════════ 세션 자동 로그아웃 ═══════════
   취급자가 일정시간 업무처리를 하지 않으면 자동으로 접속을 차단한다(안전성 확보조치 기준).
   주무관 자리는 민원인이 오가는 개방된 사무실이라 자리 비움이 실제 유출 경로다.
   만료되면 열어둔 개인정보 원문도 같이 닫는다. */
var SESS={t:null,warnT:null,onExpire:null,warnSec:60};
function sessMs(){return (window.__idleTestSec?window.__idleTestSec:CFG.locked.idleMin*60)*1000}
function sessReset(){
  if(SESS.t)clearTimeout(SESS.t); if(SESS.warnT)clearTimeout(SESS.warnT);
  closeIdleWarn();
  var total=sessMs(),warn=Math.min(SESS.warnSec*1000,total/2);
  SESS.warnT=setTimeout(function(){openIdleWarn(Math.round(warn/1000))},total-warn);
  SESS.t=setTimeout(sessExpire,total)}
function openIdleWarn(sec){
  var m=$('#m-idle');if(!m)return;
  m.classList.add('on');
  var n=sec,lab=$('#idle-n');
  (function tick(){ if(!m.classList.contains('on'))return;
    if(lab)lab.textContent=n; if(n--<=0)return; setTimeout(tick,1000)})()}
function closeIdleWarn(){var m=$('#m-idle');if(m)m.classList.remove('on')}
function sessExpire(){
  closeIdleWarn();
  if(SESS.onExpire)SESS.onExpire();
  var l=$('#m-locked'); if(l)l.classList.add('on')}
function sessStart(){
  if(!$('#m-idle'))return;
  ['mousedown','keydown','wheel','touchstart'].forEach(function(e){
    document.addEventListener(e,function(){
      if($('#m-locked').classList.contains('on'))return;
      if($('#m-idle').classList.contains('on'))return;
      sessReset()},true)});
  sessReset()}

/* 공용 모달 — 여러 화면에서 쓴다 */
function modalBox(title,body,maxw){
  var m=$('#m-box');
  if(!m){m=el('div','mask');m.id='m-box';
    m.innerHTML='<div class="modal sm"><h3></h3><div class="mbody"></div>'
     +'<div class="mfoot"><button class="mb" data-close>닫기</button></div></div>';
    document.body.appendChild(m);
    m.addEventListener('click',function(e){
      if(e.target===m||e.target.hasAttribute('data-close'))closeAll()})}
  if(maxw)m.querySelector('.modal').style.maxWidth=maxw+'px';
  m.querySelector('h3').innerHTML=esc(title)+'<button class="x" data-close aria-label="닫기">✕</button>';
  var mb=m.querySelector('.mbody');mb.innerHTML='';mb.appendChild(body);
  open('m-box');return m}

/* ═══ nav ═══ */
/* ═══ 권한 축 — 소유 / 운영 / 조회 ═══
   맬리 본서비스(admin.stg ↔ partner.stg)가 쓰는 모델을 그대로 따른다.
   DB 원본은 전부 슈퍼가 갖고, 채널에는 자기 범위만 잘라서 내려준다.

     Own      원본을 만들고 지운다          → 슈퍼만
     Operate  주어진 범위 안에서 판단·기록한다 → 케어센터 채널
     View     자기 범위를 본다              → 전부

   맬리 파트너(병원)는 View 만 갖지만, 케어센터 주무관은 사업 수행 주체라
   Operate 까지 갖는다. 그래서 메뉴가 파트너보다 많은 것은 의도다.
   대신 Own 에 해당하는 것(콘텐츠·그룹·계정·공지 원본)은 슈퍼에만 둔다.

   메뉴 라벨에 범위를 박는 것도 맬리 규칙이다 —
   슈퍼 '회원 현황' ↔ 파트너 '소속 회원 현황', '채널 현황' ↔ '내 채널 정보'.

   API 경로도 맬리를 따른다 — 슈퍼 /adm/*, 채널 /mng/*.
   같은 응답 스키마를 쓰고 서버가 토큰 보고 범위를 자른다.
   예: /mng/meliDashboard/summary 와 /adm/meliDashboard/summary 는 모양이 같고
       채널 쪽은 자기 소속분만 담겨 온다. 화면은 한 벌로 끝난다. */
var AXIS={own:['소유','cr'],op:['운영','ok'],view:['조회','nu']};
var NAV=[['운영',[['today','오늘','cr:3'],['people','소속 참여자','n:822'],['stats','활동 현황',''],['consult','상담실','cr:4']]],
 ['프로그램',[['groups','소속 프로그램 그룹',''],['sched','프로그램 일정',''],['quest','챌린지','ro']]],
 ['알림',[['push','푸시 메시지','n:예약 4']]],
 ['기록과 보고',[['report','월간 리포트',''],['apply','참여 신청','cr:111'],['audit','열람 기록','']]],
 ['채널',[['chops','우리 채널 운영자',''],['settings','내 채널 정보',''],['cx','운영팀 문의','']]]];
var TITLES={today:'오늘',people:'소속 참여자',person:'참여자 상세',stats:'활동 현황',consult:'상담실',
 groups:'소속 프로그램 그룹',sched:'프로그램 일정',quest:'챌린지',questdetail:'챌린지 상세',
 push:'푸시 메시지',pushnew:'메시지 만들기',report:'월간 리포트',apply:'참여 신청',audit:'열람 기록',
 chops:'우리 채널 운영자',settings:'내 채널 정보',cx:'운영팀 문의'}
var V={},cur='today';
function buildNav(){
  var n=$('#nav');n.innerHTML='';
  NAV.forEach(function(g){
    n.appendChild(el('div','mgrp',g[0]));
    g[1].forEach(function(it){
      var b=el('div','mnav');b.dataset.p=it[0];b.setAttribute('role','link');b.tabIndex=0;
      var bd='';
      if(it[2].indexOf('cr:')===0)bd='<span class="mbdg mt" style="background:#FEF3F2;color:#B42318">'+it[2].slice(3)+'</span>';
      else if(it[2].indexOf('n:')===0)bd='<span class="mbdg mt" style="background:#F2F4F7;color:#667085">'+it[2].slice(2)+'</span>';
      else if(it[2]==='ro')bd='<span class="mcap" style="margin-left:auto;font-size:11.5px">읽기 전용</span>';
      b.innerHTML=it[1]+bd;
      b.addEventListener('click',function(){go(it[0])});
      b.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();go(it[0])}});
      n.appendChild(b)})})}
/* 좁은 화면에선 thead 가 숨고 행이 카드로 접힌다 — 각 칸 앞에 열 이름을 붙여 둔다.
   표마다 손으로 data-l 을 적지 않도록 thead 를 읽어 한 번에 찍는다. */
function labelCells(root){
  (root||document).querySelectorAll('table.mtb').forEach(function(t){
    var hs=[].map.call(t.querySelectorAll('thead th'),function(h){
      var c=h.cloneNode(true);                     /* 정렬 안내는 스크린리더용 — 라벨에서 뺀다 */
      [].forEach.call(c.querySelectorAll('.sr'),function(x){x.remove()});
      return c.textContent.trim()});
    if(!hs.length)return;
    [].forEach.call(t.querySelectorAll('tbody tr'),function(r){
      if(r.cells.length!==hs.length)return;        /* 빈 상태 등 colspan 행은 건너뛴다 */
      [].forEach.call(r.cells,function(c,i){
        if(c.dataset.l===undefined&&hs[i])c.dataset.l=hs[i]})})})}
(function(){var m=document.getElementById('main');if(!m)return;
  var q=0,mo=new MutationObserver(function(){if(q)return;q=1;
    requestAnimationFrame(function(){q=0;labelCells(m)})});
  mo.observe(m,{childList:true,subtree:true})})();
function go(p){
  cur=p;
  $$('.pane').forEach(function(e){e.classList.toggle('on',e.dataset.pane===p)});
  var hl=p==='questdetail'?'quest':p==='person'?'people':p==='pushnew'?'push':p;
  $$('.mnav').forEach(function(e){
    var on=e.dataset.p===hl;e.classList.toggle('on',on);
    if(on)e.setAttribute('aria-current','page');else e.removeAttribute('aria-current');
    var dot=e.querySelector('.navdot');
    if(on&&!dot){var d=el('span','navdot mdot');d.style.cssText='background:#13BD7E;width:6px;height:6px;margin-right:1px';e.insertBefore(d,e.firstChild)}
    if(!on&&dot)dot.remove()});
  if(V[p])V[p]();
  window.scrollTo(0,0);
  /* 화면이 통째로 바뀌므로 제목으로 포커스를 옮겨 스크린리더가 새 화면을 읽게 한다 */
  var t=$('.pane.on h1.ttl');
  if(t){t.tabIndex=-1;t.focus({preventScroll:true})}
  document.title=(TITLES[p]||'')+' · 맬리 케어센터 채널 어드민'}
return {$:$,$$:$$,el:el,esc:esc,fmt:fmt,pad2:pad2,rnd:rnd,pill:pill,note:note,kpi:kpi,cbx:cbx,brow:brow,ph:ph,card:card,
 chead:chead,bindTabs:bindTabs,emptyBox:emptyBox,search:search,sth:sth,bindSort:bindSort,sortBy:sortBy,mkPager:mkPager,toast:toast,
 open:open,closeAll:closeAll,go:go,labelCells:labelCells,buildNav:buildNav,V:V,
 PEOPLE:PEOPLE,byId:byId,ORGS:ORGS,BRAIN:BRAIN,MIND:MIND,ASMT:ASMT,ROUT:ROUT,TESTS:TESTS,QUESTS:QUESTS,APPS:APPS,AUDIT:AUDIT,
 dayRec:dayRec,moveRows:moveRows,assessHist:assessHist,achieve:achieve,addAudit:addAudit,
 CHEV:CHEV,LT:LT,RT:RT,CK:CK,BANG:BANG,SRCH:SRCH,
 cur:function(){return cur},
 CFG:CFG,RULEVER:RULEVER,ruleAt:ruleAt,ruleNow:ruleNow,pushRule:pushRule,
 band:band,bandLabel:bandLabel,METRICS:METRICS,M:M,pCount:pCount,
 CH_SELF:CH_SELF,KIND:KIND,SCOPE:SCOPE,SITES:SITES,GROUPS:GROUPS,
 groupById:groupById,getGroup:getGroup,putGroup:putGroup,groupDepth:groupDepth,groupTree:groupTree,
 ROLES:ROLES,SITES_OWN:SITES_OWN,OPERATORS:OPERATORS,siteOwner:siteOwner,opChannel:opChannel,
 assignments:assignments,ownedBy:ownedBy,subsAt:subsAt,ownerOf:ownerOf,canEditSched:canEditSched,
 SCHED:SCHED,skey:skey,CARRY:CARRY,PERMLOG:PERMLOG,addPermLog:addPermLog,
 SESS:SESS,sessReset:sessReset,sessStart:sessStart,modalBox:modalBox};
})();
