/* 코호트 — "누구를 한 묶음으로 보면 무엇이 보이나" (슈퍼어드민)
   2026-10-27 채널 어드민에서 옮겨 왔다. 잔존 분석은 센터 담당자보다 운영팀이 편성·온보딩을 고칠 때 쓴다.

   잔존 = 그 사람의 첫 활동 주를 0주차로 두고, k주 뒤 그 주(7일)에 1회 이상 활동했나.
   아직 k주가 지나지 않은 칸은 0% 가 아니라 '—' (모름).
   숫자는 채널마다의 활동 원장(ledger.js)에서 — 채널 어드민 월간 현황의 12주 잔존과 같은 함수다.
   채널마다 개강일이 달라 '첫 활동 주' 는 그 채널 개강일 기준으로 센다.

   '이탈 직전 콘텐츠' 는 넣지 않았다. 더미 생성기가 활동 종류를 무작위로 고르므로
   어떤 결과가 나와도 가짜 인사이트다. 실데이터가 붙으면 다시 넣는다. */
(function(A){
"use strict";
var $=A.$,$$=A.$$,el=A.el,esc=A.esc,fmt=A.fmt,note=A.note,chead=A.chead,ph=A.ph,kpi=A.kpi,V=A.V,CHANNELS=A.CHANNELS;

var RISK=14;                                    /* 채널 기본 위험 기준 — 채널 어드민 CFG.risk 기본값과 같다 */
var COLS=[1,2,4,8,12,16,20,24];
var AGES=['60대 미만','60대','70대','80대 이상'];
var CHS=['C01','C02','C03','C04'];
function short(id){return A.byCh[id].n.replace(' 치매안심센터','')}
function md(d){return (d.getMonth()+1)+'/'+d.getDate()}
function ageBand(a){return a<60?'60대 미만':a<70?'60대':a<80?'70대':'80대 이상'}
/* 원장 줄 → 참여자 */
var PBY={};A.PEOPLE.forEach(function(p){(PBY[p.ch]=PBY[p.ch]||[])[p.li]=p});
function person(ch,lp){return PBY[ch][lp.i]}

var st={by:'week',ch:'',pick:null};
function units(){return (st.ch?[st.ch]:CHS).map(function(ch){return {ch:ch,L:A.LEDGERS[ch]}})}
var BY={
  week:{n:'첫 활동 주',
    key:function(u,lp){return Math.min(3,Math.floor(lp.first/7))},
    label:function(k){var nm=['개강 첫 주','2주차','3주차','4주차 이후'][+k];
      if(!st.ch)return nm;var d=Ledger.addDays(A.LEDGERS[st.ch].start,+k*7);return nm+' ('+md(d)+'~)'},
    order:function(a,b){return a-b}},
  month:{n:'첫 활동 월',
    key:function(u,lp){return Ledger.addDays(u.L.start,lp.first).getMonth()+1},
    label:function(k){return k+'월 시작'},order:function(a,b){return a-b}},
  ch:{n:'채널',all:1,key:function(u){return u.ch},
    label:function(k){return short(k)},order:function(a,b){return CHS.indexOf(a)-CHS.indexOf(b)}},
  age:{n:'연령대',key:function(u,lp){return ageBand(person(u.ch,lp).age)},
    label:function(k){return k},order:function(a,b){return AGES.indexOf(a)-AGES.indexOf(b)}}};

/* 채널 여러 개를 합쳐 묶는다 — 채널별로 잔존을 센 뒤 분모·분자를 더한다 (비율을 평균하지 않는다) */
function merge(list){
  var G={};
  list.forEach(function(g){var x=G[g.key]||(G[g.key]={key:g.key,n:0,seen:[],hit:[]});x.n+=g.n;
    for(var k=0;k<=24;k++){if(g.seen[k]){x.seen[k]=(x.seen[k]||0)+g.seen[k];x.hit[k]=(x.hit[k]||0)+(g.hit[k]||0)}}});
  return Object.keys(G).map(function(k){var g=G[k];g.rate=[];
    for(var x=0;x<=24;x++)g.rate.push(g.seen[x]?(g.hit[x]||0)/g.seen[x]*100:null);return g})}
function groups(by){
  var all=[];units().forEach(function(u){
    all=all.concat(Ledger.retention(u.L,24,function(lp){return BY[by].key(u,lp)}))});
  return merge(all).sort(function(a,b){return BY[by].order(a.key,b.key)})}
function retAt(k,pick){var n=0,h=0;
  units().forEach(function(u){Ledger.retention(u.L,24).forEach(function(g){if(!pick(+g.key)||!g.seen[k])return;n+=g.seen[k];h+=g.hit[k]||0})});
  return {n:n,h:h,r:n?h/n*100:null}}
function r1(x){return x==null?'—':(Math.round(x*10)/10).toFixed(1)}

/* ══════ 화면 ══════ */
V.cohort=function(){
  if(st.by==='ch'&&st.ch)st.by='week';
  var h=$('#v-cohort'),G=groups(st.by);
  if(!st.pick||st.pick.some(function(k){return !G.some(function(g){return String(g.key)===String(k)})}))
    st.pick=G.filter(function(g){return g.n>=20}).slice(0,st.by==='week'?2:3).map(function(g){return g.key});
  var w0=retAt(12,function(k){return k===0}),wl=retAt(12,function(k){return k>=1});
  var k1=retAt(1,function(){return true}),k4=retAt(4,function(){return true});
  var ratio=w0.r&&wl.r?w0.r/wl.r:null;

  h.innerHTML=ph('코호트','같은 때 시작한 분들이 몇 주 뒤에도 남아 있는지 봅니다. 묶는 기준을 바꿔 어디서 빠지는지 찾으세요.','')
   +'<div class="dz-filter" role="group" aria-label="조회 조건">'
     +'<select class="mfld" id="ch-ch" aria-label="채널"><option value="">운영 채널 전체</option>'
       +CHS.map(function(c){return '<option value="'+c+'"'+(c===st.ch?' selected':'')+'>'+esc(A.byCh[c].n)+'</option>'}).join('')+'</select>'
     +'<label class="flab" for="ch-by" style="margin:0 0 0 8px">묶는 기준</label>'
     +'<select class="mfld" id="ch-by">'+Object.keys(BY).filter(function(k){return !(BY[k].all&&st.ch)})
       .map(function(k){return '<option value="'+k+'"'+(k===st.by?' selected':'')+'>'+BY[k].n+'</option>'}).join('')+'</select>'
     +'<span class="mcap" style="margin-left:auto">잔존 = k주 뒤 그 주에 추천 활동 1회 이상 · 첫 활동 주 = 0주차'+(st.ch?'':' · 주차는 채널별 개강일 기준')+'</span></div>'

   +kpi([['개강 첫 주 시작 → 12주 후',r1(w0.r),'%',fmt(w0.n)+'명 중 '+fmt(w0.h)+'명이 남았어요','ok'],
         ['2주차 이후 시작 → 12주 후',r1(wl.r),'%',fmt(wl.n)+'명 중 '+fmt(wl.h)+'명','cr'],
         ['1주 후 다시 활동',r1(k1.r),'%',fmt(k1.h)+' / '+fmt(k1.n)+'명'],
         ['4주 후',r1(k4.r),'%',fmt(k4.h)+' / '+fmt(k4.n)+'명']])
   +(ratio?note('<b>가장 중요한 발견이에요.</b> 개강 첫 주에 시작한 분은 12주 뒤에도 '+r1(w0.r)+'%가 남아 있는데, 한 주라도 늦게 시작하면 '
      +r1(wl.r)+'%예요. <b>'+ratio.toFixed(1)+'배 차이</b>예요. 개강 첫 주 온보딩에 힘을 쏟는 게 다른 어떤 개선보다 효과가 커요.','wa')
     :(w0.n?'':note('아직 12주가 지난 시작자가 없어요. 개소 초기 채널은 1주·4주 후 수치부터 보세요.','nu')))

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

   /* 기수 비교 — 지난 기수 기록이 있는 남동구만 */
   +(!st.ch||st.ch==='C01'?'<div class="mc dz-card" id="ch-gen"></div>':'')

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

  if($('#ch-gen'))generations();
  signals();

  $('#ch-by').addEventListener('change',function(){st.by=this.value;st.pick=null;V.cohort()});
  $('#ch-ch').addEventListener('change',function(){st.ch=this.value;st.pick=null;V.cohort()})};

/* ══════ 기수 비교 — 같은 경과일로 맞춘다 ══════
   기수마다 개강일이 다르니 달력으로 겹치면 비교가 안 된다. '개강 N일째' 로 맞춘다.
   값 = 첫 활동한 분 중 그날까지 7일 안에 활동한 비율. 지난 기수 기록은 남동구만 있다.
   1·2기는 개강 첫 주 온보딩이 없던 때라 초반 이탈이 더 크다 */
var PAST=null;
function pastCohorts(){
  if(PAST)return PAST;
  var sea=function(d){var m=d.getMonth();return m===6||m===7?0.9:m===11||m<=1?0.92:1},jw=Ledger.CARE.joinWeek;
  PAST=[
   {id:'g1',name:'1기',L:Ledger.build({seed:3101,n:230,start:new Date(2024,8,3),end:new Date(2025,1,27),season:sea,
     joinWeek:jw,neverP:function(w){return w===0?0.24:0.4},earlyP:function(w){return w===0?0.3:0.75},earlyMean:10,longMean:500})},
   {id:'g2',name:'2기',L:Ledger.build({seed:5101,n:714,start:new Date(2025,2,4),end:new Date(2025,11,30),season:sea,
     joinWeek:jw,neverP:function(w){return w===0?0.21:0.36},earlyP:function(w){return w===0?0.25:0.72},earlyMean:11,longMean:650})},
   {id:'g3',name:'3기',L:A.LEDGERS.C01,now:1}];
  return PAST}
function generations(){
  var P=pastCohorts(),T3=A.LEDGERS.C01.T,lim=Math.floor(T3/7)*7;
  var C=P.map(function(c){var cv=Ledger.curve(c.L,7);return {c:c,cv:cv}});
  var xs=[];for(var d=7;d<=lim;d+=7)xs.push(d);
  function at(o,d){var p=o.cv.pts.filter(function(x){return x.d===d})[0];return p?p.rate:null}
  var c3=C.filter(function(o){return o.c.now})[0],c2=C.filter(function(o){return o.c.id==='g2'})[0];
  var early=28,e3=at(c3,early),e2=at(c2,early),l3=at(c3,lim),l2=at(c2,lim);
  $('#ch-gen').innerHTML='<h2 class="mh">기수 비교 — 인천 남동구, 같은 경과일로</h2>'
   +'<p class="mcap" style="margin:4px 0 10px">개강 '+lim+'일째 · '+C.map(function(o){return o.c.name+' '+r1(at(o,lim))+'%'}).join(' · ')
     +' — 첫 활동한 분 중 그날까지 7일 안에 활동한 비율 · 지난 기수 기록은 남동구만 있어요</p>'
   +'<div id="ch-gl"></div>'
   +note(early+'일째엔 3기가 2기보다 <b>'+((e3-e2)>=0?'+':'−')+Math.abs(e3-e2).toFixed(1)+'%p</b> '+(e3>=e2?'높았는데':'낮았는데')+', '
     +lim+'일째엔 차이가 <b>'+((l3-l2)>=0?'+':'−')+Math.abs(l3-l2).toFixed(1)+'%p</b>예요. '
     +(Math.abs(l3-l2)<Math.abs(e3-e2)?'초반 이탈은 줄였지만 <b>후반에는 2기와 비슷해졌어요</b> — 중반 이후 유지 프로그램이 다음 과제예요.':'차이가 끝까지 유지되고 있어요.'),'in');
  Viz.lines($('#ch-gl'),{xs:xs,unit:'%',yMax:100,h:150,tableHead:'개강 후',
    xLabel:function(d){return d+'일째'},
    series:C.slice().reverse().map(function(o){return {name:o.c.name+' ('+fmt(o.cv.n)+'명)',pts:xs.map(function(d){return {x:d,y:at(o,d)}})}}),
    aria:'남동구 기수별 같은 경과일 잔존. '+C.map(function(o){return o.c.name+' '+lim+'일째 '+r1(at(o,lim))+'%'}).join(', ')+'.'})}

/* ══════ 이탈 전조 신호 ══════
   과거에 같은 신호가 나온 분이 실제로 이탈한 비율 + 지금 그 신호에 걸린 분.
   이탈 = 위험 기준일(14일)을 넘겨 쉬기 시작. 결과를 볼 만큼 시간이 지난 경우만 센다 */
function signals(){
  var risk=RISK;
  var S=[
   {n:'7일째 쉬는 중',d:'마지막 활동 후 7일이 지났어요 (결과는 '+(risk+1)+'일째까지)',ev:0,hit:0,now:[]},
   {n:'첫 주에 하루만 활동',d:'시작한 주에 1일만 했어요 (결과는 그 뒤 4주)',ev:0,hit:0,now:[]},
   {n:'주간 활동일이 절반 아래로',d:'지난주 3일 이상 → 이번 주 1일 이하 (결과는 그 뒤 3주)',ev:0,hit:0,now:[]}];
  units().forEach(function(u){
    var L=u.L,T=L.T;
    function weekDays(lp,a){var n=0;for(var d=a;d<a+7&&d<=T;d++)if(lp.acts[d])n++;return n}
    /* 쉰 날은 a 이전 마지막 활동부터 이어서 센다 — 창 시작에서 0 으로 다시 세면 짧은 창에선 이탈이 영영 안 잡힌다 */
    function churnsBetween(lp,a,b){
      var la=-1;for(var x=a-1;x>=0;x--)if(lp.acts[x]){la=x;break}
      var g=la<0?0:a-1-la;
      for(var d=a;d<=Math.min(T,b);d++){if(lp.acts[d])g=0;else{g++;if(g>risk)return true}}return false}
    L.P.forEach(function(lp){
      if(lp.first<0)return;
      var who={ch:u.ch,lp:lp},g=0;
      for(var d=lp.first;d<=T;d++){
        if(lp.acts[d]){g=0;continue}
        g++;
        if(g===7){
          if(d+(risk+1-7)<=T){S[0].ev++;var back=false;for(var x=d+1;x<=d+(risk+1-7);x++)if(lp.acts[x]){back=true;break}if(!back)S[0].hit++}
          else if(d===T||lp.acts.slice(d+1,T+1).every(function(v){return !v}))S[0].now.push(who)}}
      if(weekDays(lp,lp.first)<=1){
        if(lp.first+34<=T){S[1].ev++;if(churnsBetween(lp,lp.first+1,lp.first+34))S[1].hit++}
        else if(T-lp.first<=13)S[1].now.push(who)}
      for(var w=lp.first;w+13<=T;w+=7){
        var a=weekDays(lp,w),b=weekDays(lp,w+7);
        if(a>=3&&b<=1){
          if(w+13+21<=T){S[2].ev++;if(churnsBetween(lp,w+14,w+13+21))S[2].hit++}
          else if(w+13>=T-6)S[2].now.push(who);
          break}}})});
  var box=$('#ch-sig');
  box.innerHTML=chead('이탈 전조 신호','<span class="mcap">원장에서 자동 계산 · 과거 같은 신호가 나온 분의 실제 결과</span>')
   +'<div class="scroll"><table class="mtb"><thead><tr><th scope="col" style="padding-left:20px">신호</th><th scope="col" class="num">지금 해당</th>'
   +'<th scope="col" class="num">과거 이런 분의 이탈률</th><th scope="col" class="num" style="padding-right:20px">근거</th></tr></thead><tbody id="ch-sg"></tbody></table></div>'
   +'<p class="mcap" style="padding:12px 20px 16px;margin:0">이탈률은 그 신호가 나온 뒤 결과를 볼 만큼 시간이 지난 경우만 셉니다. 이름은 가려져 있고 누르면 열람 사유를 받아요 — 운영팀 열람도 채널과 같은 장부에 남아요.</p>';
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
      +s.now.slice(0,20).map(function(w){var p=person(w.ch,w.lp);
        return '<button type="button" class="mchip" data-p="'+p.id+'">'+esc(p.name)+(st.ch?'':' <span class="c">'+esc(short(w.ch))+'</span>')+'</button>'}).join('')
      +(s.now.length>20?'<span class="mcap">외 '+(s.now.length-20)+'명</span>':'')+'</div></td>';
    tb.appendChild(nr);
    var bt=tr.querySelector('button');
    if(bt)bt.addEventListener('click',function(){nr.hidden=!nr.hidden;bt.setAttribute('aria-expanded',nr.hidden?'false':'true')})});
  $$('#ch-sg [data-p]').forEach(function(b){b.addEventListener('click',function(){A.askOpen(A.byP[b.dataset.p],'cohort')})})}
})(Sup);
