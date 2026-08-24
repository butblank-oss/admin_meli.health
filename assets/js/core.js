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
    var nc={up:'#067647',down:'#B42318'}[x[5]]||(x[4]?fg:'#98A2B3');
    return '<div><div class="ml" style="font-size:12.5px;display:flex;align-items:center;color:'+(x[4]?fg:'#475467')+'">'+
      (dt?'<span class="mdot" style="background:'+dt+';margin-right:5px"></span>':'')+x[0]+'</div>'+
      '<div class="mt" style="margin-top:6px;font-size:24px;font-weight:700;letter-spacing:-0.03em;color:'+fg+'">'+x[1]+
      (x[2]?'<span style="font-size:12.5px;color:#667085;font-weight:600;margin-left:2px">'+x[2]+'</span>':'')+'</div>'+
      (x[3]?'<div class="mcap mt" style="margin-top:5px;color:'+nc+'">'+x[3]+'</div>':'')+'</div>'}).join('')+'</div>'}
function cbx(s){return '<span class="cbx'+(s==='on'?' on':s==='mx'?' mx':'')+'">'+
  '<svg width="10" height="10" viewBox="0 0 20 20" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10.5 8 14.5 16 6"/></svg><span class="b"></span></span>'}
function brow(l,pct,v,cls,lw){return '<div class="brow"><span class="l"'+(lw?' style="width:'+lw+'"':'')+'>'+l+'</span><span class="bar"><i class="'+(cls||'')+'" style="width:'+pct+'%"></i></span><span class="v">'+v+'</span></div>'}
function ph(title,sub,acts){return '<div class="ph"><div><div class="ttl">'+title+'</div>'+(sub?'<div class="mcap mt" style="margin-top:5px">'+sub+'</div>':'')+'</div>'+(acts?'<div class="acts">'+acts+'</div>':'')+'</div>'}
function card(inner,style){return '<div class="mc"'+(style?' style="'+style+'"':'')+'>'+inner+'</div>'}
function chead(t,r){return '<div style="padding:16px 20px 12px;display:flex;align-items:center;gap:10px"><span class="mh">'+t+'</span>'+(r?'<span style="margin-left:auto;display:flex;gap:8px;align-items:center">'+r+'</span>':'')+'</div>'}
function emptyBox(t,d,btn){return '<div class="empty"><span class="mh">'+t+'</span>'+(d?'<span class="mcap">'+d+'</span>':'')+(btn?'<button class="mb" style="margin-top:4px">'+btn+'</button>':'')+'</div>'}
function search(id,ph2,w){return '<span style="position:relative;display:inline-flex;align-items:center;width:'+(w||'300px')+'">'+
  '<span style="position:absolute;left:11px;color:#98A2B3;display:flex">'+SRCH+'</span>'+
  '<input class="mfld" id="'+id+'" style="width:100%;padding-left:33px;padding-right:30px" placeholder="'+ph2+'">'+
  '<button id="'+id+'-x" style="display:none;position:absolute;right:9px;width:17px;height:17px;border-radius:999px;background:#98A2B3;color:#fff;border:none;cursor:pointer;align-items:center;justify-content:center;font-size:10px;line-height:1">✕</button></span>'}
function sth(label,key,st,num){
  var on=st.key===key,col=on?'#101828':'#667085',fw=on?'700':'500';
  var ar=!on?'<svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#D0D5DD" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4.8 6 2.5l2 2.3"/><path d="M4 7.2 6 9.5l2-2.3"/></svg>'
   :'<svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#13BD7E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="'+(st.dir===1?'M3 7.5 6 4l3 3.5':'M3 4.5 6 8l3-3.5')+'"/></svg>';
  return '<th'+(num?' class="num"':'')+' data-sort="'+key+'"><span class="sw" style="color:'+col+';font-weight:'+fw+'">'+label+ar+'</span></th>'}
function bindSort(root,st,fn){$$('[data-sort]',root).forEach(function(h){h.addEventListener('click',function(){
  var k=h.dataset.sort;if(st.key===k)st.dir=-st.dir;else{st.key=k;st.dir=1}fn()})})}
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
    sz.addEventListener('change',function(){st.size=+sz.value;st.page=1;render()});
    host.appendChild(sz);
    var pg=el('span','pgs');
    var pv=el('button','pgn',LT);pv.disabled=st.page<=1;pv.addEventListener('click',function(){st.page--;render()});pg.appendChild(pv);
    var list=[],last=0;
    for(var p=1;p<=pages;p++)if(p<=2||p>pages-1||Math.abs(p-st.page)<=1)list.push(p);
    list.forEach(function(p){
      if(last&&p-last>1)pg.appendChild(el('span',null,'<span style="color:#D0D5DD;padding:0 2px">…</span>'));
      var b=el('button','pgb',String(p));if(p===st.page)b.setAttribute('aria-current','true');
      b.addEventListener('click',function(){st.page=p;render()});pg.appendChild(b);last=p});
    var nx=el('button','pgn',RT);nx.disabled=st.page>=pages;nx.addEventListener('click',function(){st.page++;render()});pg.appendChild(nx);
    host.appendChild(pg)};
  st.slice=function(a){st.total=a.length;return a.slice((st.page-1)*st.size,st.page*st.size)};
  return st}
var tseq=0;
function toast(text,kind,aLabel,aFn){
  var c={ok:['#ECFDF3','#067647'],cr:['#FEF3F2','#B42318'],wa:['#FFFAEB','#B54708']}[kind||'ok'];
  var t=el('div','toast');
  t.innerHTML='<span class="i" style="background:'+c[0]+';color:'+c[1]+'">'+(kind==='cr'?BANG:CK)+'</span><span class="x">'+esc(text)+'</span>';
  if(aLabel){var b=el('button','a',esc(aLabel));b.addEventListener('click',function(){if(aFn)aFn();cl()});t.appendChild(b)}
  $('#toasts').appendChild(t);
  var to=setTimeout(cl,aLabel?6000:3000);
  function cl(){clearTimeout(to);if(t.parentNode)t.parentNode.removeChild(t)}
  return cl}
function open(id){var m=$('#'+id);if(m)m.classList.add('on')}
function closeAll(){$$('.mask').forEach(function(m){m.classList.remove('on')})}
document.addEventListener('click',function(e){
  var m=e.target.closest('[data-modal]');if(m)open(m.dataset.modal);
  if(e.target.closest('[data-close]')||e.target.classList.contains('mask'))closeAll();
  var g=e.target.closest('[data-go]');if(g)go(g.dataset.go)});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeAll()});

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
var TESTS=[{c:'gds-sf',n:'노인우울 (GDS-SF)',max:15,lv:function(s){return s<=5?['정상','ok']:s<=9?['주의','wa']:['위험','cr']}},
 {c:'isi-k',n:'불면증 (ISI-K)',max:28,lv:function(s){return s<=7?['정상','ok']:s<=14?['주의','wa']:['중등도','cr']}},
 {c:'pss',n:'스트레스 (PSS)',max:30,lv:function(s){return s<=13?['정상','ok']:s<=16?['주의','wa']:['높음','cr']}},
 {c:'smcq',n:'기억감퇴 (SMCQ)',max:14,lv:function(s){return s<=5?['정상','ok']:['주의','wa']}}];

var PEOPLE=[],byId={};
for(var i=0;i<822;i++){(function(i){
  var r=function(k){return rnd(i*17+k)};
  var st=r(1)<0.976?'active':(r(2)<0.25?'dropped':'expired');
  var days=Math.floor(Math.pow(r(3),2.6)*170),last=days===0?999:Math.floor(Math.pow(r(4),2)*160);
  var p={idx:i,id:'P'+(10000+i),sur:SUR[Math.floor(r(5)*SUR.length)],mid:GIV[Math.floor(r(6)*GIV.length)],end:GIV[Math.floor(r(7)*GIV.length)],
   tail:String(1000+Math.floor(r(8)*8999)).slice(0,4),mid4:String(1000+Math.floor(r(14)*8999)).slice(0,4),
   pin:String(1000+Math.floor(r(22)*8999)).slice(0,4),birth:1930+Math.floor(Math.pow(r(9),0.8)*40),
   sex:r(10)<0.79?'여성':(r(11)<0.9?'남성':'미상'),
   org:st==='active'?ORGS[Math.floor(r(12)*4)]:(r(13)<0.6?ORGS[Math.floor(r(12)*4)]:'미배정'),
   status:st,days:days,last:last,rate:days===0?0:Math.min(99,Math.round(Math.pow(r(15),1.4)*100)),
   app:['4.0.7','4.0.6','4.0.5','4.0.3','3.4.0'][Math.floor(Math.pow(r(16),2)*5)],
   score:Math.round(Math.pow(r(17),1.3)*1000),streak:Math.floor(Math.pow(r(18),2)*22),
   mind:Math.floor(Math.pow(r(19),2.5)*20),symp:Math.floor(Math.pow(r(20),3)*10),
   step:Math.floor(r(21)*11000),todayN:last===0?1+Math.floor(r(23)*4):0,
   installed:r(24)>0.04,notif:r(25)>0.03};
  p.name=p.sur+'*'+p.end;p.full=p.sur+p.mid+p.end;
  p.phone='010-****-'+p.tail;p.phoneFull='010-'+p.mid4+'-'+p.tail;
  p.age=2026-p.birth;
  p.ageBand=p.age<60?'60대 미만':p.age<70?'60대':p.age<80?'70대':'80대 이상';
  p.actBand=p.days===0?'무활동':p.last<=7?'최근 활동':p.last<=14?'7일 무활동':'14일+ 무활동';
  PEOPLE.push(p);byId[p.id]=p})(i)}

function dayRec(p,d){
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

var AUDIT=[
 ['2026-08-21 14:22','김주무','남동구 치매안심센터',0,'원문 열람','1건','미활동자 안부 연락','218.***.***.42'],
 ['2026-08-21 09:10','김주무','남동구 치매안심센터',0,'명단 내려받기','184건','7월 보고자료 작성','218.***.***.42'],
 ['2026-08-20 16:47','이운영','원메딕스 운영팀',1,'원문 열람','1건','앱 오류 문의 회신','121.***.***.8'],
 ['2026-08-20 11:02','김주무','남동구 치매안심센터',0,'원문 열람','3건','우울 위험군 안부 확인','218.***.***.42'],
 ['2026-08-19 10:31','김주무','남동구 치매안심센터',0,'리포트 생성','7월분','보건소 제출','218.***.***.42'],
 ['2026-08-19 08:12','김주무','남동구 치매안심센터',0,'푸시 발송','147명','무활동 어르신 안내','218.***.***.42'],
 ['2026-08-18 15:55','김주무','남동구 치매안심센터',0,'신청자 명단 열람','111건','승인 검토','218.***.***.42'],
 ['2026-08-15 09:40','김주무','남동구 치매안심센터',0,'탈퇴 처리','3건','연락 두절','218.***.***.42']];
function addAudit(act,tgt,reason){
  var d=new Date();
  AUDIT.unshift(['2026-08-21 '+pad2(d.getHours())+':'+pad2(d.getMinutes()),'김주무','남동구 치매안심센터',0,act,tgt,reason,'218.***.***.42']);
  if(V.audit)V.audit()}

/* ═══ nav ═══ */
var NAV=[['운영',[['today','오늘','cr:3'],['people','참여자','n:822'],['stats','활동 현황',''],['consult','상담실','cr:4']]],
 ['프로그램',[['sched','프로그램 일정','ro'],['quest','챌린지','']]],
 ['알림',[['push','푸시 메시지','n:예약 4']]],
 ['기록과 보고',[['report','월간 리포트',''],['apply','참여 신청','cr:111'],['audit','열람 기록','']]]];
var TITLES={today:'오늘',people:'참여자',person:'참여자 상세',stats:'활동 현황',consult:'상담실',sched:'프로그램 일정',
 quest:'챌린지',questdetail:'챌린지 상세',push:'푸시 메시지',pushnew:'메시지 만들기',report:'월간 리포트',apply:'참여 신청',audit:'열람 기록'};
var V={},cur='today';
function buildNav(){
  var n=$('#nav');n.innerHTML='';
  NAV.forEach(function(g){
    n.appendChild(el('div','mgrp',g[0]));
    g[1].forEach(function(it){
      var b=el('div','mnav');b.dataset.p=it[0];
      var bd='';
      if(it[2].indexOf('cr:')===0)bd='<span class="mbdg mt" style="background:#FEF3F2;color:#B42318">'+it[2].slice(3)+'</span>';
      else if(it[2].indexOf('n:')===0)bd='<span class="mbdg mt" style="background:#F2F4F7;color:#667085">'+it[2].slice(2)+'</span>';
      else if(it[2]==='ro')bd='<span class="mcap" style="margin-left:auto;font-size:11.5px">읽기 전용</span>';
      b.innerHTML=it[1]+bd;
      b.addEventListener('click',function(){go(it[0])});
      n.appendChild(b)})})}
function go(p){
  cur=p;
  $$('.pane').forEach(function(e){e.classList.toggle('on',e.dataset.pane===p)});
  var hl=p==='questdetail'?'quest':p==='person'?'people':p==='pushnew'?'push':p;
  $$('.mnav').forEach(function(e){
    var on=e.dataset.p===hl;e.classList.toggle('on',on);
    var dot=e.querySelector('.navdot');
    if(on&&!dot){var d=el('span','navdot mdot');d.style.cssText='background:#13BD7E;width:6px;height:6px;margin-right:1px';e.insertBefore(d,e.firstChild)}
    if(!on&&dot)dot.remove()});
  if(V[p])V[p]();
  window.scrollTo(0,0)}
return {$:$,$$:$$,el:el,esc:esc,fmt:fmt,pad2:pad2,rnd:rnd,pill:pill,note:note,kpi:kpi,cbx:cbx,brow:brow,ph:ph,card:card,
 chead:chead,emptyBox:emptyBox,search:search,sth:sth,bindSort:bindSort,sortBy:sortBy,mkPager:mkPager,toast:toast,
 open:open,closeAll:closeAll,go:go,buildNav:buildNav,V:V,
 PEOPLE:PEOPLE,byId:byId,ORGS:ORGS,BRAIN:BRAIN,MIND:MIND,ASMT:ASMT,ROUT:ROUT,TESTS:TESTS,QUESTS:QUESTS,APPS:APPS,AUDIT:AUDIT,
 dayRec:dayRec,moveRows:moveRows,assessHist:assessHist,achieve:achieve,addAudit:addAudit,
 CHEV:CHEV,LT:LT,RT:RT,CK:CK,BANG:BANG,SRCH:SRCH,
 cur:function(){return cur}};
})();
