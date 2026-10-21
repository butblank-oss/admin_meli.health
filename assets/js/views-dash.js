/* 활동 현황 — 월간 대시보드
   보건소 담당자가 매달 궁금한 것에 한 화면으로 답한다.
     이번 달 잘 되고 있나? (지난달 같은 날짜까지와 비교)   이대로면 월말 숫자는?
     어느 날 무슨 일이 있었나? (캘린더)                    목표 대비 어디쯤인가?
     어느 기관이 문제인가?                                 효과가 있긴 한가?
   숫자는 전부 활동 원장(ledger.js)에서 센다. 기관 필터는 원장의 부분집합을 만들어 같은 함수에 넣는다.

   비교 기준 두 가지 (정책 정의서 6.1)
     누적값  → 지난달 '같은 날짜'까지. 직관적이고 월간 리포트와 맞는다
     하루치  → '4주 전 같은 요일'. 주말 활동이 평일의 1/4 이라 날짜로 맞추면 매주 월요일이 급증으로 보인다 */
(function(A){
"use strict";
var $=A.$,$$=A.$$,el=A.el,esc=A.esc,fmt=A.fmt,pad2=A.pad2,pill=A.pill,note=A.note,chead=A.chead,go=A.go,V=A.V,
    PEOPLE=A.PEOPLE,ORGS=A.ORGS,APPS=A.APPS,CFG=A.CFG,M=A.M,TESTS=A.TESTS,QUESTS=A.QUESTS,LEDGER=A.LEDGER;
var DOWK='일월화수목금토';

/* ── 필터 상태: 화면 전체를 다스린다 ── */
var st={y:A.TODAY.getFullYear(),m:A.TODAY.getMonth()+1,org:'',day:null};
var FIRST={y:A.D0.getFullYear(),m:A.D0.getMonth()+1};

/* 기관 필터 = 원장의 부분집합. 같은 Ledger 함수를 그대로 쓴다 */
var SUB={};
function sub(org){
  var key=(org||'*')+'|'+CFG.risk;if(SUB[key])return SUB[key];
  var P=org?LEDGER.P.filter(function(lp){return PEOPLE[lp.i].org===org}):LEDGER.P;
  var L={start:LEDGER.start,T:LEDGER.T,off:LEDGER.off,P:P};
  L.S=Ledger.series(L,CFG.risk);
  return (SUB[key]=L)}
function di(d){return Ledger.idx(LEDGER,d)}
function sum(arr,a,b){var s=0;for(var d=Math.max(0,a);d<=Math.min(LEDGER.T,b);d++)s+=arr[d];return s}
/* 한 달 집계 — upto(일)까지만. 원장 범위 밖이면 null */
function agg(L,y,m,upto){
  var dim=new Date(y,m,0).getDate(),end=Math.min(upto||dim,dim),a=di(new Date(y,m-1,1)),b=di(new Date(y,m-1,end));
  if(b<0||a>LEDGER.T)return null;
  /* 이번 달은 오늘까지만 있다 */
  if(b>LEDGER.T){end-=b-LEDGER.T;b=LEDGER.T}
  var S=L.S,o={y:y,m:m,a:a,b:b,dim:dim,lastDay:end};
  o.aud=L.P.filter(function(p){return p.join<=b}).length;
  o.activist=Ledger.activeIn(L,a,b);o.acts=sum(S.acts,a,b);
  o.join=sum(S.join,a,b);o.lost=sum(S.lost,a,b);o.back=sum(S.back,a,b);
  var sp=Ledger.stepIn(L,a,b);o.stepOnly=sp.only;o.stepUsers=sp.users;
  o.rate=o.aud?o.activist/o.aud*100:0;
  return o}
function prevYM(y,m){return m===1?{y:y-1,m:12}:{y:y,m:m-1}}
function nextYM(y,m){return m===12?{y:y+1,m:1}:{y:y,m:m+1}}
function inRange(y,m){var a=y*12+m;return a>=FIRST.y*12+FIRST.m&&a<=A.TODAY.getFullYear()*12+A.TODAY.getMonth()+1}
function sgn(n,u){return n===0?'같아요':(n>0?'+':'−')+fmt(Math.abs(Math.round(n)))+(u||'')}

/* ══════ 그리기 ══════ */
function dash(B){
  var L=sub(st.org),isNow=st.y===A.TODAY.getFullYear()&&st.m===A.TODAY.getMonth()+1;
  var C=agg(L,st.y,st.m),upto=C.lastDay;
  var pv=prevYM(st.y,st.m),hasPrev=inRange(pv.y,pv.m);
  var P=hasPrev?agg(L,pv.y,pv.m,upto):null,PF=hasPrev?agg(L,pv.y,pv.m):null;
  var label=st.m+'월',plabel=pv.m+'월',who=st.org||'전체';
  if(st.day==null||st.day>upto)st.day=upto;

  /* 누적 활동 수 — 지출처럼 날마다 쌓이는 값이라 두 달의 간격이 한눈에 보인다 */
  function cumActs(a,n){var o=[],c=0;for(var k=0;k<n;k++){var d=a+k;c+=d<=LEDGER.T&&d>=0?L.S.acts[d]:0;o.push(c)}return o}
  var cur=cumActs(C.a,upto),prv=hasPrev?cumActs(PF.a,PF.dim):[];
  var gap=hasPrev?cur[upto-1]-prv[Math.min(upto,prv.length)-1]:0;
  var head=!hasPrev?'<b>'+label+'</b>은 개강 첫 달이라 비교할 지난달이 없어요'
    :isNow?'지난달 이맘때보다 활동이 <b class="'+(gap<0?'dn':'up')+'">'+fmt(Math.abs(gap))+'회 '+(gap<0?'적은':'많은')+'</b> 중'
    :'지난달보다 활동이 <b class="'+(gap<0?'dn':'up')+'">'+fmt(Math.abs(gap))+'회 '+(gap<0?'적었어요':'많았어요')+'</b>';

  /* 월말 예상 — 지난달 같은 날 이후 늘어난 활동자만큼 더한다. 단순하지만 설명할 수 있는 계산 */
  var proj=null;
  if(isNow&&hasPrev&&upto<C.dim){var add=Math.max(0,PF.activist-P.activist);proj=C.activist+add}

  var goals=goalVals(L,C,proj);
  var opApp=APPS.filter(function(a){return (a.st==='pending'||a.st==='hold')&&a.signed==='Y'}).length;

  B.innerHTML='<div class="gap">'
   /* 필터 한 줄 — 아래 전부를 같이 바꾼다 */
   +'<div class="dz-filter" role="group" aria-label="조회 조건">'
     +'<button type="button" class="pgn" id="dz-pm" aria-label="이전 달"'+(inRange(pv.y,pv.m)?'':' disabled')+'>'+A.LT+'</button>'
     +'<span class="mh mt" style="min-width:104px;text-align:center" aria-live="polite">'+st.y+'년 '+st.m+'월</span>'
     +'<button type="button" class="pgn" id="dz-nm" aria-label="다음 달"'+(inRange(nextYM(st.y,st.m).y,nextYM(st.y,st.m).m)?'':' disabled')+'>'+A.RT+'</button>'
     +(isNow?'':'<button type="button" class="mb mbs" id="dz-now">이번 달</button>')
     +'<select class="mfld" id="dz-org" aria-label="기관" style="margin-left:8px"><option value="">기관 전체</option>'
       +ORGS.map(function(o){return '<option'+(o===st.org?' selected':'')+'>'+o+'</option>'}).join('')+'</select>'
     +'<span class="mcap" style="margin-left:auto">'+(isNow?st.m+'월 1일~'+upto+'일 · 매일 새벽 3시 갱신':'월 전체')+'</span></div>'

   /* 1 — 이번 달 한 문장 + 누적 곡선 | 이번 달 숫자 */
   +'<div class="bento wide">'
   +'<div class="mc dz-card"><div class="dz-hero">'+head+'</div>'
     +'<p class="mcap" style="margin:6px 0 0">'+who+' · 누적 활동 수 '+fmt(cur[upto-1])+'회'
       +(hasPrev?' · '+plabel+' 같은 날까지 '+fmt(prv[Math.min(upto,prv.length)-1])+'회':'')+'</p>'
     +'<div id="dz-cum" style="margin-top:12px"></div></div>'
   +'<div class="mc dz-card"><h2 class="mh">'+label+' 숫자</h2>'
     +'<p class="mcap" style="margin:4px 0 10px">'+(hasPrev?'괄호는 '+plabel+' '+(upto===C.dim?'전체':'같은 날까지')+' 대비':'개강 첫 달')+'</p>'
     +numRow('활동자',C.activist,'명',P&&P.activist,'추천 활동 1회 이상 (걸음 제외)',true)
     +numRow('신규 합류',C.join,'명',P&&P.join,'그룹에 들어온 인원',true)
     +numRow('이탈',C.lost,'명',P&&P.lost,CFG.risk+'일 넘게 쉬기 시작한 인원',false)
     +numRow('복귀',C.back,'명',P&&P.back,'이탈했다가 다시 활동',true)
     +numRow('걸음만 기록',C.stepOnly,'명',P&&P.stepOnly,'폰은 쓰는데 활동은 0회 — 연락 대상',false)
     +(proj!=null?'<div class="dz-proj">이 추세면 <b>'+label+' 활동자 약 '+fmt(proj)+'명</b>'
        +'<span class="mcap" style="display:block;margin-top:2px">'+plabel+' '+upto+'일 이후 늘어난 '+fmt(PF.activist-P.activist)+'명만큼 더했어요</span></div>':'')
     +(st.org?'':'<div class="dz-op1">'+A.BANG+'<span>활동자는 <b>그룹 합류</b> 기준이에요. 신청 승인과 앱 가입이 따로 놀아 '
        +'<b>승인 후 미가입 '+fmt(M.approvedNoApp())+'명</b> · <b>미승인 가입 '+fmt(opApp)+'명</b>이 이 숫자 밖에 있어요 (OP-1)</span></div>')
   +'</div></div>'

   /* 2 — 캘린더 | 고른 날 */
   +'<div class="bento wide">'
   +'<div class="mc dz-card"><h2 class="mh">'+label+' 날짜별 활동자</h2>'
     +'<p class="mcap" style="margin:4px 0 10px">칸이 진할수록 활동자가 많아요. 날짜를 누르면 그날 누가 들어오고 빠졌는지 보여요</p>'
     +'<div id="dz-cal"></div></div>'
   +'<div class="mc dz-card" id="dz-day"></div></div>'

   /* 3 — 사업 목표 */
   +'<div class="mc dz-card"><div class="row" style="align-items:baseline"><h2 class="mh">사업 목표</h2>'
     +'<span class="mcap">출발점으로 잡은 값이에요 · <button type="button" class="lnk" data-go="settings">내 채널 정보에서 바꾸기</button></span></div>'
     +'<div class="dz-goals">'+goals.map(function(g){
       return '<div><div class="dz-gh"><span>'+g.n+'</span>'+(g.ok==null?'':pill(g.ok?'달성':'미달',g.ok?'ok':'wa'))+'</div>'
         +Viz.range({min:0,max:100,v:g.v,goal:g.goal,goalLabel:'목표',minLabel:'',maxLabel:'',vLabel:g.vl,unit:'%',fill:1,
            fmt:function(x){return (Math.round(x*10)/10).toString()}})
         +'<p class="mcap" style="margin:6px 0 0">'+g.d+'</p></div>'}).join('')+'</div></div>'

   /* 4 — 기관별 | 순증감 (기관 전체일 때만) */
   +(st.org?'':'<div class="bento" style="grid-template-columns:minmax(0,1.25fr) minmax(0,1fr)">'
     +'<div class="mc" style="overflow:hidden">'+chead('기관별 활동률','<span class="mcap">줄을 누르면 그 기관만 봐요</span>')
       +'<div class="scroll"><table class="mtb"><thead><tr><th style="padding-left:20px">기관</th><th class="num">대상</th><th class="num">활동자</th>'
       +'<th class="num">활동률</th><th>최근 6주</th><th class="num" style="padding-right:20px">평균 대비</th></tr></thead><tbody id="dz-org-tb"></tbody></table></div></div>'
     +'<div class="mc dz-card"><h2 class="mh">기관별 순증감</h2>'
       +'<p class="mcap" style="margin:4px 0 0">'+label+' 신규 합류 + 복귀 − 이탈</p><div id="dz-div"></div></div></div>')

   /* 5 — 3기 누적 성과 */
   +'<div class="mc" style="overflow:hidden">'+chead('3기 누적 성과','<span class="mcap">개강일부터 '+(isNow?'오늘':label+' 말')+'까지 · '+who+'</span>')
     +'<div id="dz-out"></div></div>'
   +'</div>';

  /* 누적 곡선 */
  if(hasPrev)Viz.cumLine($('#dz-cum'),{cur:cur,prev:prv,dim:C.dim,curName:label,prevName:plabel,unit:'회',h:160,
    aria:label+' 1일부터 '+upto+'일까지 누적 활동 '+fmt(cur[upto-1])+'회, '+plabel+' 같은 날까지 '+fmt(prv[Math.min(upto,prv.length)-1])+'회.'});
  else $('#dz-cum').innerHTML='<p class="mcap">지난달 비교선 없이 '+label+' 누적만 있어요 — 누적 활동 '+fmt(cur[upto-1])+'회</p>';

  /* 캘린더 */
  var days=[];
  for(var d=1;d<=C.dim;d++){var i=C.a+d-1;
    days.push(i>LEDGER.T||d>upto?{d:d,future:1}:{d:d,v:L.S.dau[i],join:L.S.join[i],lost:L.S.lost[i],off:LEDGER.off[i],today:i===LEDGER.T})}
  Viz.calendar($('#dz-cal'),{y:st.y,m:st.m,days:days,name:'활동자',unit:'명',selected:st.day,
    tip:function(x){var i=C.a+x.d-1,w4=i-28>=0?L.S.dau[i-28]:null;
      return '<div class="vz-th">'+st.m+'월 '+x.d+'일 '+DOWK[new Date(st.y,st.m-1,x.d).getDay()]+'요일</div>'
        +'<div class="vz-tr"><b>'+fmt(x.v)+'명</b><span>활동자</span></div>'
        +(w4!=null?'<div class="vz-tf">4주 전 같은 요일 대비 '+sgn(x.v-w4,'명')+'</div>':'')},
    onPick:function(d){st.day=d;dayPanel(L,C);
      $$('#dz-cal .vz-day').forEach(function(b){var on=+b.dataset.d===d;b.classList.toggle('sel',on);
        b.parentNode.setAttribute('aria-selected',on?'true':'false')})},
    legendExtra:'<span style="margin-left:auto"><b style="color:#175CD3">+n</b> 신규 합류 · <b style="color:#B42318">−n</b> 이탈</span>'});
  dayPanel(L,C);

  /* 기관별 */
  if(!st.org){
    var all=sub(''),allRate=C.rate,rows=ORGS.map(function(o){var Lo=sub(o),c=agg(Lo,st.y,st.m);
      var wk=[];for(var w=5;w>=0;w--){var e=Math.min(LEDGER.T,C.b)-w*7,s=e-6,au=Lo.P.filter(function(p){return p.join<=e}).length;
        wk.push(au?Ledger.activeIn(Lo,s,e)/au*100:0)}
      return {o:o,c:c,wk:wk}});
    var tb=$('#dz-org-tb');
    rows.forEach(function(r){var dlt=r.c.rate-allRate,tr=el('tr','clk');
      /* 표의 행을 통째로 버튼으로 만들면 표 구조가 사라진다 — 기관명만 버튼, 행 클릭은 마우스용 덤 */
      tr.innerHTML='<td style="padding-left:20px"><button type="button" class="lnk dz-ob">'+esc(r.o)+'<span class="sr"> — 이 기관만 보기</span></button></td><td class="num mt">'+fmt(r.c.aud)+'</td>'
       +'<td class="num mt">'+fmt(r.c.activist)+'</td><td class="num mt" style="font-weight:700">'+r.c.rate.toFixed(1)+'%</td>'
       +'<td>'+Viz.spark(r.wk,{aria:r.o+' 최근 6주 주간 활동률 '+Math.round(r.wk[0])+'%에서 '+Math.round(r.wk[5])+'%'})+'</td>'
       +'<td class="num mt" style="padding-right:20px;color:'+(dlt<-3?'#B42318':'#475467')+';font-weight:'+(dlt<-3?700:500)+'">'
       +(Math.abs(dlt)<0.05?'—':(dlt>0?'+':'−')+Math.abs(dlt).toFixed(1)+'%p')+'</td>';
      function pick(){st.org=r.o;st.day=null;V.stats()}
      tr.addEventListener('click',pick);
      tb.appendChild(tr)});
    Viz.divBars($('#dz-div'),{unit:'명',posName:'늘어남',negName:'줄어듦',rows:rows.map(function(r){
      return {label:r.o,v:r.c.join+r.c.back-r.c.lost,note:'신규 '+r.c.join+' · 복귀 '+r.c.back+' · 이탈 '+r.c.lost}})})}

  outcome(L,C,isNow);

  /* 필터 */
  $('#dz-pm').addEventListener('click',function(){var p=prevYM(st.y,st.m);st.y=p.y;st.m=p.m;st.day=null;V.stats()});
  $('#dz-nm').addEventListener('click',function(){var p=nextYM(st.y,st.m);st.y=p.y;st.m=p.m;st.day=null;V.stats()});
  if($('#dz-now'))$('#dz-now').addEventListener('click',function(){st.y=A.TODAY.getFullYear();st.m=A.TODAY.getMonth()+1;st.day=null;V.stats()});
  $('#dz-org').addEventListener('change',function(){st.org=this.value;st.day=null;V.stats()})}

function numRow(n,v,u,pv,d,upGood){
  var dl=pv==null?'':(v===pv?'<span class="dz-d">(같음)</span>'
    :'<span class="dz-d '+((v>pv)===upGood?'g':'b')+'">('+(v>pv?'▲':'▼')+fmt(Math.abs(v-pv))+')</span>');
  return '<div class="dz-num"><span><span class="dz-nn">'+n+'</span><span class="mcap">'+d+'</span></span>'
    +'<span class="dz-nv"><b>'+fmt(v)+'</b>'+u+' '+dl+'</span></div>'}

/* ── 고른 날 ── */
function dayPanel(L,C){
  var d=st.day,i=C.a+d-1,dt=new Date(st.y,st.m-1,d),off=LEDGER.off[i],S=L.S,risk=CFG.risk;
  /* 같은 종류(평일/주말·공휴일)끼리 최저~최고 — 주말을 평일과 비교하면 늘 '최저' 로 보인다 */
  var same=[];for(var x=0;x<=LEDGER.T;x++)if(LEDGER.off[x]===off&&x!==i)same.push(S.dau[x]);
  var w4=i-28>=0?S.dau[i-28]:null;
  var joins=[],losts=[],backs=[];
  L.P.forEach(function(lp){
    if(lp.join===i)joins.push(lp);
    if(lp.first<0||i<=lp.first)return;
    var la=-1;for(var y=i-1;y>=0;y--)if(lp.acts[y]){la=y;break}
    if(la<0)return;
    if(!lp.acts[i]&&i-la===risk+1)losts.push(lp);
    if(lp.acts[i]&&i-la>=risk+2)backs.push(lp)});
  function names(list,why){
    if(!list.length)return '<p class="mcap" style="margin:4px 0 0">없어요</p>';
    return '<div class="dz-names">'+list.slice(0,10).map(function(lp){var p=PEOPLE[lp.i];
      return '<button type="button" class="mchip" data-p="'+p.id+'" aria-label="'+esc(p.name+' — '+why+', 누르면 사유를 적고 상세가 열려요')+'">'+esc(p.name)+'</button>'}).join('')
      +(list.length>10?'<span class="mcap">외 '+(list.length-10)+'명</span>':'')+'</div>'}
  $('#dz-day').innerHTML='<h2 class="mh">'+st.m+'월 '+d+'일 '+DOWK[dt.getDay()]+'요일'+(off&&dt.getDay()%6?' · 공휴일':'')+'</h2>'
   +'<p class="mcap" style="margin:4px 0 0">'+(st.org||'전체')+'</p>'
   +Viz.range({min:Math.min.apply(null,same),max:Math.max.apply(null,same),v:S.dau[i],
      minLabel:'3기 '+(off?'주말·공휴일':'평일')+' 최저',maxLabel:'최고',vLabel:'활동자',unit:'명'})
   +'<div class="dz-dstat"><div><span class="mcap">활동</span><b>'+fmt(S.acts[i])+'회</b></div>'
   +'<div><span class="mcap">4주 전 같은 요일</span><b>'+(w4==null?'—':sgn(S.dau[i]-w4,'명'))+'</b></div>'
   +'<div><span class="mcap">걸음 기록</span><b>'+fmt(S.stepN[i])+'명</b></div></div>'
   +'<div class="dz-sec"><h3>신규 합류 <b>'+joins.length+'</b></h3>'+names(joins,'이날 합류')+'</div>'
   +'<div class="dz-sec"><h3>이탈 <b>'+losts.length+'</b><span class="mcap"> · '+risk+'일째 쉬는 날</span></h3>'+names(losts,'이날 이탈')+'</div>'
   +'<div class="dz-sec"><h3>복귀 <b>'+backs.length+'</b></h3>'+names(backs,'이날 복귀')+'</div>'
   +'<p class="mcap" style="margin:12px 0 0">이름은 가린 채로 보여요. 누르면 열람 사유를 적고 상세가 열려요.</p>';
  $$('#dz-day [data-p]').forEach(function(b){b.addEventListener('click',function(){A.askOpen(A.byId[b.dataset.p],'stats')})})}

/* ── 사업 목표 ── */
function goalVals(L,C,proj){
  var G=CFG.goals,r12=null;
  Ledger.retention(L,12).forEach(function(g){if(+g.key===0&&g.seen[12])r12=(g.hit[12]||0)/g.seen[12]*100});
  var ever=0,re=0;
  L.P.forEach(function(lp){if(lp.first<0)return;ever++;var h=A.assessHist(PEOPLE[lp.i]),c={};
    if(h.some(function(x){c[x.test.c]=(c[x.test.c]||0)+1;return c[x.test.c]>=2}))re++});
  var reR=ever?re/ever*100:0;
  return [
   {n:'월 활동률',v:C.rate,goal:G.monthRate,vl:'지금',ok:C.rate>=G.monthRate,
    d:'활동자 '+fmt(C.activist)+' ÷ 대상자 '+fmt(C.aud)+(proj!=null?' · 월말 예상 '+(proj/C.aud*100).toFixed(1)+'%':'')},
   {n:'12주 잔존율',v:r12==null?0:r12,goal:G.retain12,vl:'3기',ok:r12==null?null:r12>=G.retain12,
    d:r12==null?'아직 12주가 지나지 않았어요':'개강 첫 주 시작자 중 12주차에도 활동'},
   {n:'재검사율',v:reR,goal:G.retestRate,vl:'지금',ok:reR>=G.retestRate,d:'활동한 '+fmt(ever)+'명 중 '+fmt(re)+'명이 같은 검사를 2회 이상'}]}

/* ── 3기 누적 성과 — 구성으로 나눠 보여준다 ── */
function outcome(L,C,isNow){
  var total=sum(L.S.acts,0,C.b),ever=L.P.filter(function(lp){return lp.first>=0&&lp.first<=C.b}).length;
  var ids={};L.P.forEach(function(lp){ids[lp.i]=1});
  var rows=TESTS.map(function(t){var o={retest:0,better:0,worse:0};
    PEOPLE.forEach(function(p){if(!ids[p.idx])return;
      var h=A.assessHist(p).filter(function(x){return x.test.c===t.c&&x.date<=Ledger.ymd(A.dAt(C.b))});
      if(h.length<2)return;o.retest++;
      var f=A.lvRank(t,h[h.length-1].score),l=A.lvRank(t,h[0].score);if(l<f)o.better++;else if(l>f)o.worse++});
    return {t:t,o:o}});
  var qs=QUESTS.filter(function(q){return q.st==='완료'});
  $('#dz-out').innerHTML='<div class="dz-out">'
   +'<div class="dz-big"><span class="mcap">총 활동</span><span><b>'+fmt(total)+'</b>회</span><span class="mcap">한 번이라도 활동한 '+fmt(ever)+'명</span></div>'
   +'<div class="dz-big"><span class="mcap">끝난 챌린지 성공</span><span><b>'+fmt(qs.reduce(function(a,q){return a+q.succ},0))+'</b>명</span><span class="mcap">'+qs.length+'개 챌린지 합계 · 기관 구분 없음</span></div></div>'
   +'<div class="scroll"><table class="mtb"><thead><tr><th style="padding-left:20px">검사</th><th class="num">재검사</th>'
   +'<th class="num">등급 개선</th><th class="num">그대로</th><th class="num">악화</th><th style="padding-right:20px;width:34%">재검사자 중 비율</th></tr></thead><tbody>'
   +rows.map(function(r){var o=r.o,same=o.retest-o.better-o.worse,n=o.retest||1;
     return '<tr><td style="padding-left:20px;font-weight:600">'+r.t.n+'</td><td class="num mt">'+fmt(o.retest)+'명</td>'
      +'<td class="num mt" style="font-weight:700">'+fmt(o.better)+'</td><td class="num mt">'+fmt(same)+'</td><td class="num mt">'+fmt(o.worse)+'</td>'
      +'<td style="padding-right:20px"><span class="dz-stack" role="img" aria-label="개선 '+Math.round(o.better/n*100)+'%, 그대로 '+Math.round(same/n*100)+'%, 악화 '+Math.round(o.worse/n*100)+'%">'
      +'<i style="width:'+(o.better/n*100)+'%;background:#2a78d6"></i><i style="width:'+(same/n*100)+'%;background:#D0D5DD"></i><i style="width:'+(o.worse/n*100)+'%;background:#D9620F"></i></span></td></tr>'}).join('')
   +'</tbody></table></div>'
   +'<div class="vz-legend" style="padding:10px 20px 4px"><span><i style="background:#2a78d6"></i>등급 개선</span><span><i style="background:#D0D5DD"></i>그대로</span><span><i style="background:#D9620F"></i>악화</span></div>'
   +'<p class="mcap" style="padding:4px 20px 16px;margin:0">같은 검사를 2회 이상 받은 분만 셉니다 — 첫 등급과 마지막 등급 비교. 한 번만 받은 분은 분모에 넣지 않아요.</p>'}

A.dashMonth=dash;
A.dashState=st;
})(App);
