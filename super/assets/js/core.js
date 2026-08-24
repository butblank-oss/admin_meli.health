/* 맬리 슈퍼어드민 — 코어
   원메딕스 운영팀용. 채널 어드민(../)과 별개 앱이며 CSS만 공유한다.
   헬퍼 이름은 채널 어드민과 일부러 똑같이 맞췄다 — 두 앱을 번갈아 손댈 때
   같은 이름이 같은 일을 하게 하려는 것. (프로토타입이라 중복을 허용했다) */
var Sup=(function(){
"use strict";
var $=function(s,r){return (r||document).querySelector(s)},
    $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))},
    el=function(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e},
    esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})},
    fmt=function(n){return Number(n).toLocaleString('ko-KR')},
    pad2=function(n){return String(n).padStart(2,'0')};
function rnd(s){var x=Math.sin(s)*10000;return x-Math.floor(x)}

var LT='<svg width="13" height="13" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 3.5 5.5 9 11 14.5"/></svg>';
var RT='<svg width="13" height="13" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 3.5 5.5 5.5L7 14.5"/></svg>';
var CK='<svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10.5 8 14.5 16 6"/></svg>';
var BANG='<svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M10 5.5v5M10 14.2v.3"/></svg>';
var SRCH='<svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="9" cy="9" r="5.5"/><path d="m13.5 13.5 3.5 3.5"/></svg>';

var P={ok:['#ECFDF3','#067647','#17B26A'],wa:['#FFFAEB','#B54708','#F79009'],
 cr:['#FEF3F2','#B42318','#F04438'],nu:['#F2F4F7','#475467','#98A2B3'],in:['#EFF8FF','#175CD3','#2E90FA']};
function pill(t,k){var c=P[k]||P.nu;return '<span class="mpill" style="background:'+c[0]+';color:'+c[1]+'"><span class="mdot" style="background:'+c[2]+'"></span>'+t+'</span>'}
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
function chead(t,r){return '<div style="padding:16px 20px 12px;display:flex;align-items:center;gap:10px"><h2 class="mh">'+t+'</h2>'+(r?'<span style="margin-left:auto;display:flex;gap:8px;align-items:center">'+r+'</span>':'')+'</div>'}
function emptyBox(t,d,btn){return '<div class="empty"><span class="mh">'+t+'</span>'+(d?'<span class="mcap">'+d+'</span>':'')+(btn?'<button class="mb" type="button" style="margin-top:4px">'+btn+'</button>':'')+'</div>'}
function search(id,ph2,w){return '<span style="position:relative;display:inline-flex;align-items:center;width:'+(w||'300px')+'">'+
  '<span style="position:absolute;left:11px;color:#69707C;display:flex" aria-hidden="true">'+SRCH+'</span>'+
  '<input class="mfld" id="'+id+'" style="width:100%;padding-left:33px;padding-right:30px" placeholder="'+ph2+'" aria-label="'+esc(ph2)+'">'+
  '<button id="'+id+'-x" type="button" aria-label="검색어 지우기" style="display:none;position:absolute;right:9px;width:17px;height:17px;border-radius:999px;background:#69707C;color:#fff;border:none;cursor:pointer;align-items:center;justify-content:center;font-size:10px;line-height:1">✕</button></span>'}
function sth(label,key,st,num){
  var on=st.key===key,col=on?'#101828':'#667085',fw=on?'700':'500';
  var ar=!on?'<svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#D0D5DD" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4.8 6 2.5l2 2.3"/><path d="M4 7.2 6 9.5l2-2.3"/></svg>'
   :'<svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#13BD7E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="'+(st.dir===1?'M3 7.5 6 4l3 3.5':'M3 4.5 6 8l3-3.5')+'"/></svg>';
  var as=on?(st.dir===1?'ascending':'descending'):'none';
  return '<th'+(num?' class="num"':'')+' data-sort="'+key+'" aria-sort="'+as+'">'+
    '<span class="sw" role="button" tabindex="0" style="color:'+col+';font-weight:'+fw+'">'+label+
    '<span class="sr">'+(on?(st.dir===1?', 오름차순 정렬됨':', 내림차순 정렬됨'):', 정렬하려면 누르세요')+'</span>'+ar+'</span></th>'}
function bindSort(root,st,fn){$$('[data-sort]',root).forEach(function(h){
  function go2(){var k=h.dataset.sort;if(st.key===k)st.dir=-st.dir;else{st.key=k;st.dir=1}fn()}
  h.addEventListener('click',go2);
  h.addEventListener('keydown',function(e){if(e.key===' '||e.key==='Enter'){e.preventDefault();go2()}})})}
function sortBy(a,st,get){if(!st.key)return a;return a.slice().sort(function(x,y){
  var p=get(x,st.key),q=get(y,st.key);
  if(typeof p==='string')return st.dir*p.localeCompare(q,'ko');return st.dir*(p-q)})}
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
function mkPager(render){
  var st={page:1,size:20,total:0};
  st.render=function(host){
    var pages=Math.max(1,Math.ceil(st.total/st.size));
    if(st.page>pages)st.page=pages;
    var lo=st.total?(st.page-1)*st.size+1:0,hi=Math.min(st.total,st.page*st.size);
    host.innerHTML='';
    host.appendChild(el('span',null,'<span style="font-size:13px;color:#667085">총 <b class="mt" style="color:#101828">'+fmt(st.total)+'</b>건 중 <b class="mt" style="color:#101828">'+fmt(lo)+'–'+fmt(hi)+'</b></span>'));
    var sz=el('select','mfld');sz.style.cssText='height:30px;font-size:13px;border-radius:6px';
    sz.setAttribute('aria-label','페이지당 표시 건수');
    [20,50,100].forEach(function(n){var o=el('option',null,n+'개씩');o.value=n;if(n===st.size)o.selected=true;sz.appendChild(o)});
    sz.addEventListener('change',function(){st.size=+sz.value;st.page=1;render()});
    host.appendChild(sz);
    var pg=el('span','pgs');
    var pv=el('button','pgn',LT);pv.type='button';pv.setAttribute('aria-label','이전 페이지');pv.disabled=st.page<=1;
    pv.addEventListener('click',function(){st.page--;render()});pg.appendChild(pv);
    var list=[],last=0;
    for(var p=1;p<=pages;p++)if(p<=2||p>pages-1||Math.abs(p-st.page)<=1)list.push(p);
    list.forEach(function(p){
      if(last&&p-last>1)pg.appendChild(el('span',null,'<span style="color:#D0D5DD;padding:0 2px">…</span>'));
      var b=el('button','pgb',String(p));b.type='button';b.setAttribute('aria-label',p+'페이지');
      if(p===st.page){b.setAttribute('aria-current','page');b.setAttribute('aria-label',p+'페이지, 현재 페이지')}
      b.addEventListener('click',function(){st.page=p;render()});pg.appendChild(b);last=p});
    var nx=el('button','pgn',RT);nx.type='button';nx.setAttribute('aria-label','다음 페이지');nx.disabled=st.page>=pages;
    nx.addEventListener('click',function(){st.page++;render()});pg.appendChild(nx);
    host.appendChild(pg)};
  st.slice=function(a){st.total=a.length;return a.slice((st.page-1)*st.size,st.page*st.size)};
  return st}
function toast(text,kind,aLabel,aFn){
  var c={ok:['#ECFDF3','#067647'],cr:['#FEF3F2','#B42318'],wa:['#FFFAEB','#B54708']}[kind||'ok'];
  var t=el('div','toast');
  t.setAttribute('role',kind==='cr'?'alert':'status');
  t.innerHTML='<span class="i" aria-hidden="true" style="background:'+c[0]+';color:'+c[1]+'">'+(kind==='cr'?BANG:CK)+'</span><span class="x">'+esc(text)+'</span>';
  if(aLabel){var b=el('button','a',esc(aLabel));b.type='button';b.addEventListener('click',function(){if(aFn)aFn();cl()});t.appendChild(b)}
  $('#toasts').appendChild(t);
  var to=setTimeout(cl,aLabel?6000:3000);
  function cl(){clearTimeout(to);if(t.parentNode)t.parentNode.removeChild(t)}
  return cl}
var lastFocus=null;
function open(id){
  var m=$('#'+id);if(!m)return;
  lastFocus=document.activeElement;
  m.classList.add('on');
  var f=m.querySelector('select,input,textarea,button:not([data-close])')||m.querySelector('button');
  if(f)f.focus()}
function closeAll(){
  var was=$$('.mask.on').length;
  $$('.mask').forEach(function(m){m.classList.remove('on')});
  if(was&&lastFocus&&lastFocus.isConnected){lastFocus.focus();lastFocus=null}}
document.addEventListener('click',function(e){
  var m=e.target.closest('[data-modal]');if(m)open(m.dataset.modal);
  if(e.target.closest('[data-close]')||e.target.classList.contains('mask'))closeAll();
  var g=e.target.closest('[data-go]');if(g)go(g.dataset.go)});
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){closeAll();return}
  var c=e.target.closest&&e.target.closest('.cbx[role="checkbox"]');
  if(c&&(e.key===' '||e.key==='Enter')){e.preventDefault();c.click()}});
document.addEventListener('keydown',function(e){
  if(e.key!=='Tab')return;
  var m=$('.mask.on');if(!m)return;
  var f=$$('a[href],button:not([disabled]),select,input,textarea,[tabindex]:not([tabindex="-1"])',m)
        .filter(function(x){return x.offsetParent!==null});
  if(!f.length)return;
  var first=f[0],last=f[f.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}});
/* ═══ 네비게이션 · 라우팅 ═══ */
/* 배지 숫자는 손으로 적지 않고 데이터에서 센다.
   손으로 적으면 반드시 실제 값과 어긋나고, 어긋나도 아무도 모른다.
   (채널 어드민의 판정 기준표를 코드에서 파생시킨 것과 같은 이유) */
var BADGE={
 channels:function(){return {k:'n',v:Sup.CHANNELS.length}},
 content:function(){return {k:'n',v:Sup.CONTENT.length}},
 accounts:function(){var n=Sup.ACCOUNTS.filter(function(u){return u.st==='wait'}).length;
   return n?{k:'cr',v:n}:null},
 challenges:function(){var n=Sup.CHALLENGES.filter(function(q){return q.st==='review'}).length;
   return n?{k:'cr',v:n}:null},
 cs:function(){var n=Sup.TICKETS.filter(function(t){return t.st!=='done'}).length;
   return n?{k:'cr',v:n}:null},
 push:function(){var n=Sup.PUSHES.filter(function(p){return p.st==='sched'}).length;
   return n?{k:'n',v:'예약 '+n}:null},
 anomaly:function(){var n=Sup.ALERTS.filter(function(a){return a.st==='open'}).length;
   return n?{k:'cr',v:n}:null}};
var NAV=[['운영',[['home','운영 현황']]],
 ['채널',[['channels','채널 관리'],['cohorts','기수 관리'],['accounts','계정·권한']]],
 ['프로그램',[['programs','프로그램 편성'],['content','콘텐츠'],['challenges','챌린지']]],
 ['소통',[['cs','CS 접수'],['push','전 채널 발송']]],
 ['감사',[['anomaly','이상 열람 탐지']]]];
var TITLES={home:'운영 현황',channels:'채널 관리',channel:'채널 상세',cohorts:'기수 관리',accounts:'계정·권한',
 programs:'프로그램 편성',content:'콘텐츠',challenges:'챌린지',challengenew:'챌린지 만들기',
 cs:'CS 접수',csdetail:'문의 상세',push:'전 채널 발송',pushnew:'발송 만들기',anomaly:'이상 열람 탐지'};
var V={},cur='home';
function buildNav(){
  var n=$('#nav');n.innerHTML='';
  NAV.forEach(function(g){
    n.appendChild(el('div','mgrp',g[0]));
    g[1].forEach(function(it){
      var b=el('div','mnav');b.dataset.p=it[0];b.setAttribute('role','link');b.tabIndex=0;
      var bd='',g=BADGE[it[0]]&&BADGE[it[0]]();
      if(g)bd=g.k==='cr'?'<span class="mbdg mt" style="background:#FEF3F2;color:#B42318">'+g.v+'</span>'
                        :'<span class="mbdg mt" style="background:#F2F4F7;color:#667085">'+g.v+'</span>';
      b.innerHTML=it[1]+bd;
      b.addEventListener('click',function(){go(it[0])});
      b.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();go(it[0])}});
      n.appendChild(b)})})}
function go(p){
  cur=p;
  /* 배지를 매번 다시 센다 — 문의를 처리하면 사이드바 숫자도 같이 줄어야 한다 */
  if($('#nav').children.length)buildNav();
  $$('.pane').forEach(function(e){e.classList.toggle('on',e.dataset.pane===p)});
  var hl=p==='channel'?'channels':p==='challengenew'?'challenges':p==='csdetail'?'cs':p==='pushnew'?'push':p;
  $$('.mnav').forEach(function(e){
    var on=e.dataset.p===hl;e.classList.toggle('on',on);
    if(on)e.setAttribute('aria-current','page');else e.removeAttribute('aria-current');
    var dot=e.querySelector('.navdot');
    if(on&&!dot){var d=el('span','navdot mdot');d.style.cssText='background:#B79FFF;width:6px;height:6px;margin-right:1px';e.insertBefore(d,e.firstChild)}
    if(!on&&dot)dot.remove()});
  if(V[p])V[p]();
  window.scrollTo(0,0);
  var t=$('.pane.on h1.ttl');
  if(t){t.tabIndex=-1;t.focus({preventScroll:true})}
  document.title=(TITLES[p]||'')+' · 맬리 슈퍼어드민'}

return {$:$,$$:$$,el:el,esc:esc,fmt:fmt,pad2:pad2,rnd:rnd,pill:pill,note:note,kpi:kpi,cbx:cbx,brow:brow,ph:ph,
 chead:chead,emptyBox:emptyBox,search:search,sth:sth,bindSort:bindSort,sortBy:sortBy,bindTabs:bindTabs,
 mkPager:mkPager,toast:toast,open:open,closeAll:closeAll,go:go,buildNav:buildNav,V:V,
 LT:LT,RT:RT,CK:CK,BANG:BANG,SRCH:SRCH,cur:function(){return cur}};
})();
