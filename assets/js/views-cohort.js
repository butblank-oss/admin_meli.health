/* 코호트 — "누구를 한 묶음으로 보면 무엇이 보이나"
   잔존 = 그 사람의 첫 활동 주를 0주차로 두고, k주 뒤 그 주(7일)에 1회 이상 활동했나.
   아직 k주가 지나지 않은 칸은 0% 가 아니라 '—' (모름).
   숫자는 활동 원장(ledger.js) 하나에서 — 월간 현황·월간 리포트의 12주 잔존과 같은 함수다.

   예전 '참여 지속' 탭에 있던 '이탈 직전 콘텐츠' 는 옮기지 않았다. 더미 생성기가 활동 종류를
   무작위로 고르므로 어떤 결과가 나와도 가짜 인사이트다. 실데이터가 붙으면 다시 넣는다. */
(function(A){
"use strict";
var $=A.$,$$=A.$$,el=A.el,esc=A.esc,fmt=A.fmt,pad2=A.pad2,note=A.note,chead=A.chead,ph=A.ph,kpi=A.kpi,V=A.V,
    PEOPLE=A.PEOPLE,ORGS=A.ORGS,CFG=A.CFG,LEDGER=A.LEDGER;

var COLS=[1,2,4,8,12,16,20,24];
var AGES=['60대 미만','60대','70대','80대 이상'];
function md(d){return (d.getMonth()+1)+'/'+d.getDate()}
var BY={
  week:{n:'첫 활동 주',
    key:function(lp){return Math.min(3,Math.floor(lp.first/7))},
    label:function(k){var d=A.dAt(+k*7);return ['개강 첫 주','2주차','3주차','4주차 이후'][+k]+' ('+md(d)+(+k===3?'~':'~')+')'},
    order:function(a,b){return a-b}},
  month:{n:'첫 활동 월',
    key:function(lp){return A.dAt(lp.first).getMonth()+1},
    label:function(k){return k+'월 시작'},order:function(a,b){return a-b}},
  org:{n:'기관',key:function(lp){return PEOPLE[lp.i].org},
    label:function(k){return k},order:function(a,b){return ORGS.indexOf(a)-ORGS.indexOf(b)}},
  age:{n:'연령대',key:function(lp){return PEOPLE[lp.i].ageBand},
    label:function(k){return k},order:function(a,b){return AGES.indexOf(a)-AGES.indexOf(b)}}};
var st={by:'week',org:'',pick:null};

var SUB={};
function sub(org){
  var key=org||'*';if(SUB[key])return SUB[key];
  var P=org?LEDGER.P.filter(function(lp){return PEOPLE[lp.i].org===org}):LEDGER.P;
  return (SUB[key]={start:LEDGER.start,T:LEDGER.T,off:LEDGER.off,P:P})}
/* 묶음 하나 = 같은 기준의 사람들 */
function groups(L,by){
  var g=Ledger.retention(L,24,function(lp){return BY[by].key(lp)});
  return g.sort(function(a,b){return BY[by].order(a.key,b.key)})}
function retAt(L,k,pick){var n=0,h=0;Ledger.retention(L,24).forEach(function(g){if(!pick(+g.key)||!g.seen[k])return;n+=g.seen[k];h+=g.hit[k]||0});
  return {n:n,h:h,r:n?h/n*100:null}}
function r1(x){return x==null?'—':(Math.round(x*10)/10).toFixed(1)}

/* ══════ 화면 ══════ */
V.cohort=function(){
  var h=$('#v-cohort'),L=sub(st.org),G=groups(L,st.by);
  if(!st.pick||st.pick.some(function(k){return !G.some(function(g){return String(g.key)===String(k)})}))
    st.pick=G.filter(function(g){return g.n>=20}).slice(0,st.by==='week'?2:3).map(function(g){return g.key});
  var w0=retAt(L,12,function(k){return k===0}),wl=retAt(L,12,function(k){return k>=1});
  var k1=retAt(L,1,function(){return true}),k4=retAt(L,4,function(){return true});
  var ratio=w0.r&&wl.r?w0.r/wl.r:null;

  h.innerHTML=ph('코호트','같은 때 시작한 분들이 몇 주 뒤에도 남아 있는지 봅니다. 묶는 기준을 바꿔 어디서 빠지는지 찾으세요.','')
   +'<div class="dz-filter" role="group" aria-label="조회 조건">'
     +'<label class="flab" for="ch-by" style="margin:0">묶는 기준</label>'
     +'<select class="mfld" id="ch-by">'+Object.keys(BY).map(function(k){return '<option value="'+k+'"'+(k===st.by?' selected':'')+'>'+BY[k].n+'</option>'}).join('')+'</select>'
     +'<select class="mfld" id="ch-org" aria-label="기관" style="margin-left:8px"'+(st.by==='org'?' disabled':'')+'><option value="">기관 전체</option>'
       +ORGS.map(function(o){return '<option'+(o===st.org?' selected':'')+'>'+o+'</option>'}).join('')+'</select>'
     +'<span class="mcap" style="margin-left:auto">잔존 = k주 뒤 그 주에 추천 활동 1회 이상 · 첫 활동 주 = 0주차</span></div>'

   +kpi([['개강 첫 주 시작 → 12주 후',r1(w0.r),'%',fmt(w0.n)+'명 중 '+fmt(w0.h)+'명이 남았어요','ok'],
         ['2주차 이후 시작 → 12주 후',r1(wl.r),'%',fmt(wl.n)+'명 중 '+fmt(wl.h)+'명','cr'],
         ['1주 후 다시 활동',r1(k1.r),'%',fmt(k1.h)+' / '+fmt(k1.n)+'명'],
         ['4주 후',r1(k4.r),'%',fmt(k4.h)+' / '+fmt(k4.n)+'명']])
   +(ratio?note('<b>가장 중요한 발견이에요.</b> 개강 첫 주에 시작한 분은 12주 뒤에도 '+r1(w0.r)+'%가 남아 있는데, 한 주라도 늦게 시작하면 '
      +r1(wl.r)+'%예요. <b>'+ratio.toFixed(1)+'배 차이</b>예요. 개강 첫 주 온보딩에 힘을 쏟는 게 다른 어떤 개선보다 효과가 커요.','wa'):'')

   /* 잔존 매트릭스 */
   +'<div class="mc" style="overflow:hidden">'+chead(BY[st.by].n+'별 잔존율','<span class="mcap">칸이 진할수록 많이 남았어요 · — 는 아직 그만큼 지나지 않음</span>')
     +'<div class="scroll"><table class="mtb ch-mx"><caption class="sr">'+BY[st.by].n+'별 주차 잔존율</caption><thead><tr><th scope="col" style="padding-left:20px">'+BY[st.by].n+'</th><th scope="col" class="num">시작 인원</th>'
     +COLS.map(function(k){return '<th scope="col" class="num">'+k+'주 후</th>'}).join('')+'</tr></thead><tbody id="ch-tb"></tbody></table></div>'
     +'<div class="vz-legend" style="padding:12px 20px 16px"><span>잔존 낮음</span>'
       +[12,24,38,54].map(function(s){return '<i style="background:color-mix(in srgb,'+Viz.T.accent+' '+s+'%,#fff)"></i>'}).join('')
       +'<span>높음</span><span class="mcap" style="margin-left:auto">시작 인원 20명 미만은 흐리게 — 한두 명에 비율이 크게 흔들려요</span></div></div>'

   /* 곡선 겹쳐보기 */
   +'<div class="mc dz-card"><h2 class="mh">잔존 곡선 겹쳐보기</h2>'
     +'<p class="mcap" style="margin:4px 0 10px">최대 3개까지 골라 비교해요. 색은 고른 순서대로 붙어요</p>'
     +'<div class="row" id="ch-pick" role="group" aria-label="비교할 묶음" style="gap:6px;margin-bottom:6px"></div>'
     +'<div id="ch-lines"></div></div>'

   /* 기수 비교 */
   +'<div class="mc dz-card" id="ch-gen"></div>'

   /* 이탈 전조 */
   +'<div class="mc" style="overflow:hidden" id="ch-sig"></div>';

  /* 매트릭스 */
  var tb=$('#ch-tb'),mx=0;
  G.forEach(function(g){COLS.forEach(function(k){if(g.rate[k]!=null&&g.n>=20)mx=Math.max(mx,g.rate[k])})});
  G.forEach(function(g){
    var small=g.n<20,tr=el('tr');
    tr.innerHTML='<th scope="row" style="padding-left:20px;font-weight:600;text-align:left">'+esc(BY[st.by].label(g.key))+'</th>'
     +'<td class="num mt" style="color:#475467">'+fmt(g.n)+'명</td>'
     +COLS.map(function(k){var v=g.rate[k];
       if(v==null)return '<td class="num ch-c na"><span>—</span></td>';
       var t=mx?v/mx:0,mix=small?8:t>0.85?54:t>0.65?38:t>0.4?24:12;
       return '<td class="num ch-c'+(small?' small':'')+'" data-k="'+k+'" data-g="'+esc(String(g.key))+'"><span style="background:color-mix(in srgb,'+Viz.T.accent+' '+mix+'%,#fff)">'+r1(v)+'%</span></td>'}).join('');
    tb.appendChild(tr)});
  $$('#ch-tb .ch-c[data-k]').forEach(function(c){
    var g=G.filter(function(x){return String(x.key)===c.dataset.g})[0],k=+c.dataset.k;
    c.addEventListener('pointerenter',function(e){
      Viz.tip('<div class="vz-th">'+esc(BY[st.by].label(g.key))+' · '+k+'주 후</div>'
        +'<div class="vz-tr"><b>'+r1(g.rate[k])+'%</b><span>잔존</span></div>'
        +'<div class="vz-tf">'+fmt(g.seen[k])+'명 중 '+fmt(g.hit[k]||0)+'명이 그 주에 활동</div>',e.clientX,e.clientY)});
    c.addEventListener('pointerleave',Viz.hideTip)});

  /* 곡선 고르기 */
  var pk=$('#ch-pick');
  G.forEach(function(g){var on=st.pick.some(function(k){return String(k)===String(g.key)});
    var b=el('button','mchip'+(on?' on':''),esc(BY[st.by].label(g.key))+' <span class="c mt">'+fmt(g.n)+'</span>');
    b.type='button';b.setAttribute('aria-pressed',on?'true':'false');
    b.addEventListener('click',function(){
      var i=st.pick.findIndex(function(k){return String(k)===String(g.key)});
      if(i>=0)st.pick.splice(i,1);
      else{if(st.pick.length>=3){A.toast('3개까지 비교할 수 있어요. 하나를 먼저 빼주세요','wa');return}st.pick.push(g.key)}
      V.cohort()});
    pk.appendChild(b)});
  var sel=st.pick.map(function(k){return G.filter(function(g){return String(g.key)===String(k)})[0]}).filter(Boolean);
  var xs=[];for(var k=0;k<=24;k++)xs.push(k);
  if(sel.length)Viz.lines($('#ch-lines'),{xs:xs,unit:'%',yMax:100,h:150,tableHead:'경과',
    xLabel:function(k){return k===0?'시작 주':k+'주 후'},
    series:sel.map(function(g){return {name:BY[st.by].label(g.key),pts:xs.map(function(k){return {x:k,y:g.rate[k]}})}}),
    aria:BY[st.by].n+'별 잔존 곡선. '+sel.map(function(g){var last=null;for(var k=24;k>=0;k--)if(g.rate[k]!=null){last=k;break}
      return BY[st.by].label(g.key)+' '+last+'주 후 '+r1(g.rate[last])+'%'}).join(', ')+'.'});
  else $('#ch-lines').innerHTML='<p class="mcap">위에서 비교할 묶음을 골라주세요</p>';

  generations();
  signals(L);

  $('#ch-by').addEventListener('change',function(){st.by=this.value;st.pick=null;if(st.by==='org')st.org='';V.cohort()});
  $('#ch-org').addEventListener('change',function(){st.org=this.value;st.pick=null;V.cohort()})};

/* ══════ 기수 비교 — 같은 경과일로 맞춘다 ══════
   기수마다 개강일이 다르니 달력으로 겹치면 비교가 안 된다. '개강 N일째' 로 맞춘다.
   값 = 첫 활동한 분 중 그날까지 7일 안에 활동한 비율. 지난 기수에는 기관 정보가 없어 늘 기수 전체로 본다 */
function generations(){
  var P=A.pastCohorts(),T3=LEDGER.T,lim=Math.floor(T3/7)*7;
  var C=P.map(function(c){var cv=Ledger.curve(c.L,7);return {c:c,cv:cv}});
  var xs=[];for(var d=7;d<=lim;d+=7)xs.push(d);
  function at(o,d){var p=o.cv.pts.filter(function(x){return x.d===d})[0];return p?p.rate:null}
  var c3=C.filter(function(o){return o.c.now})[0],c2=C.filter(function(o){return o.c.id==='g2'})[0];
  var early=28,e3=at(c3,early),e2=at(c2,early),l3=at(c3,lim),l2=at(c2,lim);
  $('#ch-gen').innerHTML='<h2 class="mh">기수 비교 — 같은 경과일로</h2>'
   +'<p class="mcap" style="margin:4px 0 10px">개강 '+lim+'일째 · '+C.map(function(o){return o.c.name+' '+r1(at(o,lim))+'%'}).join(' · ')
     +' — 첫 활동한 분 중 그날까지 7일 안에 활동한 비율 · 기관 필터와 상관없이 기수 전체</p>'
   +'<div id="ch-gl"></div>'
   +note(early+'일째엔 3기가 2기보다 <b>'+((e3-e2)>=0?'+':'−')+Math.abs(e3-e2).toFixed(1)+'%p</b> '+(e3>=e2?'높았는데':'낮았는데')+', '
     +lim+'일째엔 차이가 <b>'+((l3-l2)>=0?'+':'−')+Math.abs(l3-l2).toFixed(1)+'%p</b>예요. '
     +(Math.abs(l3-l2)<Math.abs(e3-e2)?'초반 이탈은 줄였지만 <b>후반에는 2기와 비슷해졌어요</b> — 중반 이후 유지 프로그램이 다음 과제예요.':'차이가 끝까지 유지되고 있어요.'),'in');
  Viz.lines($('#ch-gl'),{xs:xs,unit:'%',yMax:100,h:150,tableHead:'개강 후',
    xLabel:function(d){return d+'일째'},
    series:C.slice().reverse().map(function(o){return {name:o.c.name+' ('+fmt(o.cv.n)+'명)',pts:xs.map(function(d){return {x:d,y:at(o,d)}})}}),
    aria:'기수별 같은 경과일 잔존. '+C.map(function(o){return o.c.name+' '+lim+'일째 '+r1(at(o,lim))+'%'}).join(', ')+'.'})}

/* ══════ 이탈 전조 신호 ══════
   과거에 같은 신호가 나온 분이 실제로 이탈한 비율 + 지금 그 신호에 걸린 분.
   이탈 = 위험 기준일(기본 14일)을 넘겨 쉬기 시작. 결과를 볼 만큼 시간이 지난 경우만 센다 */
function signals(L){
  var T=L.T,risk=CFG.risk,off=L.off;
  function weekDays(lp,a){var n=0;for(var d=a;d<a+7&&d<=T;d++)if(lp.acts[d])n++;return n}
  /* [a,b] 안에 이탈(쉰 날이 위험 기준을 넘김)이 일어나나. 쉰 날은 a 이전 마지막 활동부터 이어서 센다 —
     창 시작에서 0 으로 다시 세면 창이 위험 기준보다 짧을 때 이탈이 영영 안 잡힌다 */
  function churnsBetween(lp,a,b){
    var la=-1;for(var x=a-1;x>=0;x--)if(lp.acts[x]){la=x;break}
    var g=la<0?0:a-1-la;
    for(var d=a;d<=Math.min(T,b);d++){if(lp.acts[d])g=0;else{g++;if(g>risk)return true}}return false}
  var S=[
   {n:'7일째 쉬는 중',d:'마지막 활동 후 7일이 지났어요 (결과는 '+(risk+1)+'일째까지)',ev:0,hit:0,now:[]},
   {n:'첫 주에 하루만 활동',d:'시작한 주에 1일만 했어요 (결과는 그 뒤 4주)',ev:0,hit:0,now:[]},
   {n:'주간 활동일이 절반 아래로',d:'지난주 3일 이상 → 이번 주 1일 이하 (결과는 그 뒤 3주)',ev:0,hit:0,now:[]}];
  L.P.forEach(function(lp){
    if(lp.first<0)return;
    /* ① 쉬는 날 수가 7이 되는 순간마다 */
    var g=0;
    for(var d=lp.first;d<=T;d++){
      if(lp.acts[d]){g=0;continue}
      g++;
      if(g===7){
        if(d+(risk+1-7)<=T){S[0].ev++;var back=false;for(var x=d+1;x<=d+(risk+1-7);x++)if(lp.acts[x]){back=true;break}if(!back)S[0].hit++}
        else if(d===T||lp.acts.slice(d+1,T+1).every(function(v){return !v}))S[0].now.push(lp)}}
    /* ② 첫 주 하루 */
    var fw=weekDays(lp,lp.first);
    if(fw<=1){
      if(lp.first+34<=T){S[1].ev++;if(churnsBetween(lp,lp.first+1,lp.first+34))S[1].hit++}
      else if(T-lp.first<=13)S[1].now.push(lp)}
    /* ③ 주간 감소 — 주 단위로 겹치지 않게 */
    for(var w=lp.first;w+13<=T;w+=7){
      var a=weekDays(lp,w),b=weekDays(lp,w+7);
      if(a>=3&&b<=1){
        if(w+13+21<=T){S[2].ev++;if(churnsBetween(lp,w+14,w+13+21))S[2].hit++}
        else if(w+13>=T-6)S[2].now.push(lp);
        break}}});
  var box=$('#ch-sig');
  box.innerHTML=chead('이탈 전조 신호','<span class="mcap">원장에서 자동 계산 · 과거 같은 신호가 나온 분의 실제 결과</span>')
   +'<div class="scroll"><table class="mtb"><thead><tr><th scope="col" style="padding-left:20px">신호</th><th scope="col" class="num">지금 해당</th>'
   +'<th scope="col" class="num">과거 이런 분의 이탈률</th><th scope="col" class="num" style="padding-right:20px">근거</th></tr></thead><tbody id="ch-sg"></tbody></table></div>'
   +'<p class="mcap" style="padding:12px 20px 16px;margin:0">이탈률은 그 신호가 나온 뒤 결과를 볼 만큼 시간이 지난 경우만 셉니다. 이름은 가려져 있고 누르면 열람 사유를 받아요.</p>';
  var tb=$('#ch-sg');
  S.forEach(function(s,i){
    var r=s.ev?s.hit/s.ev*100:null,tr=el('tr');
    tr.innerHTML='<td style="padding-left:20px"><b style="font-weight:600">'+s.n+'</b><span class="mcap" style="display:block">'+s.d+'</span></td>'
     +'<td class="num">'+(s.now.length?'<button type="button" class="lnk mt" aria-expanded="false" aria-controls="ch-sn'+i+'">'+fmt(s.now.length)+'명</button>':'<span class="mt">0명</span>')+'</td>'
     +'<td class="num mt" style="font-weight:700;color:'+(r!=null&&r>=50?'#B42318':'#101828')+'">'+(r==null?'—':r1(r)+'%')+'</td>'
     +'<td class="num mt" style="color:#475467;padding-right:20px">'+fmt(s.hit)+' / '+fmt(s.ev)+'건</td>';
    tb.appendChild(tr);
    var nr=el('tr');nr.id='ch-sn'+i;nr.hidden=true;
    nr.innerHTML='<td colspan="4" style="padding:4px 20px 14px"><div class="dz-names">'
      +s.now.slice(0,20).map(function(lp){var p=PEOPLE[lp.i];return '<button type="button" class="mchip" data-p="'+p.id+'">'+esc(p.name)+'</button>'}).join('')
      +(s.now.length>20?'<span class="mcap">외 '+(s.now.length-20)+'명</span>':'')+'</div></td>';
    tb.appendChild(nr);
    var bt=tr.querySelector('button');
    if(bt)bt.addEventListener('click',function(){nr.hidden=!nr.hidden;bt.setAttribute('aria-expanded',nr.hidden?'false':'true')})});
  $$('#ch-sg [data-p]').forEach(function(b){b.addEventListener('click',function(){A.askOpen(A.byId[b.dataset.p],'cohort')})})}
})(App);
