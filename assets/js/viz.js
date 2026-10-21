/* 차트 부품 — 채널 어드민과 슈퍼어드민이 함께 쓴다.
   앱(App/Sup)에 기대지 않는다. 앱은 Viz.theme({accent}) 로 강조색만 넣는다.

   원칙 (dataviz 가이드)
   - 색은 역할로 쓴다: 크기 = 한 색 농도(순차) · 주인공 = 강조색 + 나머지 회색 · 증감 = 파랑/주황 + 회색 기준선
   - 글자는 데이터 색을 입지 않는다. 값·라벨은 글자색, 색은 옆의 표식이 진다
   - 선 2px · 점 지름 8px 이상(바탕색 2px 테두리) · 막대 14px · 끝 4px 둥글게, 기준선 쪽은 각지게
   - 격자·축은 1px 실선, 바탕보다 한 단계만 진하게
   - 툴팁은 거들 뿐 — 모든 값은 표 보기나 직접 라벨로도 읽힌다. 키보드 포커스에도 같은 툴팁
   - 색 검증 (scripts/validate_palette.js, 흰 바탕):
       채널 #0E9F6E · 파랑 #2a78d6 · 주황 #D9620F → 전 항목 통과
       회색 비교선 #8A94A6 = 3.06:1 (그래픽 최소 3:1)
       슈퍼 #6941C6 은 파랑과 한 차트에 두면 구분 실패 → 강조형에만 쓰고 증감 막대와 섞지 않는다 */
var Viz=(function(){
"use strict";
var T={accent:'#0E9F6E',ink:'#101828',sub:'#475467',muted:'#69707C',grid:'#EAECF0',axis:'#D0D5DD',
       ctx:'#8A94A6',up:'#2a78d6',down:'#D9620F',plus:'#175CD3',minus:'#B42318',surface:'#FFFFFF'};
function theme(o){for(var k in o)T[k]=o[k];return T}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function fmt(n){return Number(n).toLocaleString('ko-KR')}
var uid=0;function nid(p){return (p||'vz')+(++uid)}

/* ── 툴팁 하나를 모든 차트가 같이 쓴다 ── */
var tipEl=null;
function tip(html,x,y){
  if(!tipEl){tipEl=document.createElement('div');tipEl.className='vz-tip';tipEl.setAttribute('role','status');
    tipEl.setAttribute('aria-live','polite');document.body.appendChild(tipEl)}
  if(html==null){tipEl.style.display='none';return}
  tipEl.innerHTML=html;tipEl.style.display='block';
  var w=tipEl.offsetWidth,h=tipEl.offsetHeight,vw=window.innerWidth;
  var left=Math.min(vw-w-8,Math.max(8,x+14)),top=y-h-12;if(top<8)top=y+16;
  tipEl.style.left=left+'px';tipEl.style.top=top+'px'}
function hideTip(){tip(null)}
/* 툴팁 줄 — 값이 앞, 이름이 뒤. 계열은 짧은 선으로 표시 */
function tipRow(color,value,label,dash){
  return '<div class="vz-tr"><span class="vz-key" style="border-top:2px '+(dash?'dashed':'solid')+' '+color+'"></span>'
   +'<b>'+esc(value)+'</b><span>'+esc(label)+'</span></div>'}

/* ══════ 월 캘린더 ══════
   opt = {y, m, days:[{d, v, join, lost, off, future, today}], name:'활동자', unit:'명',
          selected, onPick(d), tip(day)→툴팁 HTML, legendExtra}
   칸 농도 = 활동자 수(5단계). 글자는 늘 진한 색 — 농도는 60% 를 넘기지 않아 대비가 유지된다.
   방향키로 날짜를 옮기는 격자 — 31개를 Tab 으로 다 지나가게 하지 않는다 */
var STEPS=[0,12,24,38,54];
function calendar(host,opt){
  var first=new Date(opt.y,opt.m-1,1).getDay(),dim=new Date(opt.y,opt.m,0).getDate();
  var vals=opt.days.filter(function(x){return !x.future}).map(function(x){return x.v});
  var mx=Math.max.apply(null,vals.concat([1]));
  function step(v){if(!v)return 0;var r=v/mx;return r>0.8?4:r>0.6?3:r>0.35?2:1}
  var byD={};opt.days.forEach(function(x){byD[x.d]=x});
  var cap=opt.y+'년 '+opt.m+'월 날짜별 '+opt.name;
  var h='<table class="vz-cal" role="grid" aria-label="'+esc(cap)+'"><thead><tr>'
   +'일월화수목금토'.split('').map(function(w,i){return '<th scope="col"'+(i===0||i===6?' class="we"':'')+'>'+w+'</th>'}).join('')+'</tr></thead><tbody><tr>';
  for(var i=0;i<first;i++)h+='<td class="pad" role="gridcell" aria-hidden="true"></td>';
  for(var d=1;d<=dim;d++){
    var x=byD[d]||{d:d,future:1},st=x.future?0:step(x.v),dow=(first+d-1)%7;
    var mix=STEPS[st],bg=mix?'color-mix(in srgb,'+T.accent+' '+mix+'%,'+T.surface+')':'';
    var sel=opt.selected===d,DW='일월화수목금토'[dow];
    h+='<td role="gridcell" class="'+(x.future?'fut ':'')+(x.off?'off ':'')+'"'+(sel?' aria-selected="true"':'')+'>'
     +'<button type="button" class="vz-day'+(x.today?' today':'')+(sel?' sel':'')+(st>=3?' deep':'')+'" data-d="'+d+'" tabindex="-1"'
     +(x.future?' disabled':'')+(bg?' style="background:'+bg+'"':'')+'>'
     /* 읽을 이름은 화면 글자 사이에 숨은 글자를 끼워 만든다 — aria-label 로 덮으면
        보이는 글자('21')와 이름이 어긋나 음성 입력으로 누를 수 없다 */
     +'<span class="sr">'+opt.m+'월 </span><span class="dn'+(dow===0||dow===6||x.off?' we':'')+'">'+d+'</span>'
     +'<span class="sr">일 '+DW+'요일'+(x.off&&dow!==0&&dow!==6?' 공휴일':'')+(x.today?' 오늘':'')+'</span>'
     +(x.future?'':'<span class="sr">, '+esc(opt.name)+' </span><span class="dv">'+fmt(x.v||0)+'</span><span class="sr">'+esc(opt.unit)+'</span>'
       +'<span class="dd">'+(x.join?'<span class="sr">, 신규 합류 </span><span class="pl">+'+x.join+'</span><span class="sr">명</span>':'')
       +(x.lost?'<span class="sr">, 이탈 </span><span class="mi">−'+x.lost+'</span><span class="sr">명</span>':'')+'</span>')
     +'</button></td>';
    if(dow===6&&d<dim)h+='</tr><tr>'}
  var tail=(7-(first+dim)%7)%7;for(var j=0;j<tail;j++)h+='<td class="pad" role="gridcell" aria-hidden="true"></td>';
  h+='</tr></tbody></table>'
   +'<div class="vz-legend"><span>'+esc(opt.name)+' 적음</span>'
   +STEPS.slice(1).map(function(s){return '<i style="background:color-mix(in srgb,'+T.accent+' '+s+'%,'+T.surface+')"></i>'}).join('')
   +'<span>많음</span>'
   +(opt.legendExtra||'')+'</div>';
  host.innerHTML=h;
  var btns=[].slice.call(host.querySelectorAll('.vz-day:not([disabled])'));
  if(!btns.length)return;
  var start=host.querySelector('.vz-day.sel:not([disabled])')||host.querySelector('.vz-day.today')||btns[btns.length-1];
  start.tabIndex=0;
  function move(b){btns.forEach(function(x){x.tabIndex=-1});b.tabIndex=0;b.focus()}
  btns.forEach(function(b,ix){
    b.addEventListener('click',function(){if(opt.onPick)opt.onPick(+b.dataset.d)});
    b.addEventListener('keydown',function(e){
      var k={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7}[e.key];
      if(e.key==='Home')k=-ix;if(e.key==='End')k=btns.length-1-ix;
      if(k==null)return;e.preventDefault();
      var n=Math.max(0,Math.min(btns.length-1,ix+k));move(btns[n])});
    b.addEventListener('mouseenter',function(e){
      if(opt.tip)tip(opt.tip(byD[+b.dataset.d]),e.clientX,e.clientY)});
    b.addEventListener('mousemove',function(e){if(opt.tip&&tipEl&&tipEl.style.display==='block')tip(tipEl.innerHTML,e.clientX,e.clientY)});
    b.addEventListener('mouseleave',hideTip);
    b.addEventListener('blur',hideTip)})}

/* ══════ 누적 비교 곡선 — "지난달 이맘때보다" ══════
   opt = {cur:[1일차부터 오늘까지 누적값], prev:[지난달 전체 누적값], dim:이번 달 일수,
          curName:'8월', prevName:'7월', unit:'명', h:150, aria}
   이번 달 = 강조색 실선 + 오늘 점. 지난달 = 회색 선(전체). 축은 하나. */
function cumLine(host,opt){
  var W=600,H=opt.h||150,PL=8,PR=56,PT=14,PB=26,iw=W-PL-PR,ih=H-PT-PB;
  var n=Math.max(opt.dim,opt.prev.length),mx=Math.max.apply(null,opt.cur.concat(opt.prev).concat([1]));
  var nice=function(v){var p=Math.pow(10,Math.floor(Math.log10(v))),f=v/p,S=[1,1.5,2,2.5,3,4,5,6,8,10];
    for(var i=0;i<S.length;i++)if(f<=S[i])return S[i]*p;return 10*p};
  var top=nice(mx*1.05);
  function X(d){return PL+(n>1?(d-1)/(n-1):0)*iw}
  function Y(v){return PT+ih-(v/top)*ih}
  function path(a){return a.map(function(v,i){return (i?'L':'M')+X(i+1).toFixed(1)+' '+Y(v).toFixed(1)}).join(' ')}
  var c=opt.cur,p=opt.prev,k=c.length,id=nid('cl');
  var ticks=[0,top/2,top];
  var svg='<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" class="vz-svg" aria-hidden="true" focusable="false">'
   +ticks.map(function(t){return '<line x1="'+PL+'" x2="'+(PL+iw)+'" y1="'+Y(t)+'" y2="'+Y(t)+'" stroke="'+T.grid+'" stroke-width="1" vector-effect="non-scaling-stroke"/>'}).join('')
   +'<path d="'+path(p)+'" fill="none" stroke="'+T.ctx+'" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>'
   +'<path d="'+path(c)+' L'+X(k).toFixed(1)+' '+Y(0)+' L'+X(1)+' '+Y(0)+'Z" fill="'+T.accent+'" fill-opacity="0.1"/>'
   +'<path d="'+path(c)+'" fill="none" stroke="'+T.accent+'" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>'
   +'<line class="vz-xh" x1="0" x2="0" y1="'+PT+'" y2="'+(PT+ih)+'" stroke="'+T.axis+'" stroke-width="1" vector-effect="non-scaling-stroke" style="display:none"/>'
   +'</svg>';
  /* 점·라벨은 SVG 밖 HTML 로 — viewBox 가 늘어나도 점이 찌그러지지 않게 */
  function pct(x,y){return 'left:'+(x/W*100)+'%;top:'+(y/H*100)+'%'}
  var dots='<span class="vz-dot" style="'+pct(X(k),Y(c[k-1]))+';background:'+T.accent+'"></span>'
   +'<span class="vz-dot ctx" style="'+pct(X(p.length),Y(p[p.length-1]))+';background:'+T.ctx+'"></span>'
   +'<span class="vz-hdot ctx" style="display:none;background:'+T.ctx+'"></span><span class="vz-hdot" style="display:none;background:'+T.accent+'"></span>';
  var below=k<p.length&&p[k-1]>c[k-1];
  var lab='<span class="vz-elab cur '+(below?'dn':'up')+'" style="'+pct(X(k),Y(c[k-1]))+'"><b>'+fmt(c[k-1])+'</b></span>'
   +'<span class="vz-elab ctx" style="left:calc('+(X(p.length)/W*100)+'% + 8px);top:'+(Y(p[p.length-1])/H*100)+'%">'+fmt(p[p.length-1])+'</span>';
  var axis='<div class="vz-xax"><span>1일</span><span>'+Math.ceil(n/2)+'일</span><span>'+n+'일</span></div>';
  var yax='<div class="vz-yax">'+ticks.slice().reverse().map(function(t){return '<span style="top:'+(Y(t)/H*100)+'%">'+(t>=1000?(t/1000)+'K':fmt(t))+'</span>'}).join('')+'</div>';
  var legend='<div class="vz-legend line"><span><i style="background:'+T.accent+'"></i>'+esc(opt.curName)+' (오늘까지)</span>'
   +'<span><i style="background:'+T.ctx+'"></i>'+esc(opt.prevName)+'</span></div>';
  /* 표 보기 — 툴팁 없이도 모든 값을 읽을 수 있게 */
  var rows='';for(var d=1;d<=n;d++)rows+='<tr><th scope="row">'+d+'일</th><td>'+(d<=k?fmt(c[d-1]):'—')+'</td><td>'+(d<=p.length?fmt(p[d-1]):'—')+'</td></tr>';
  var table='<details class="vz-tbl"><summary>표로 보기</summary><div class="scroll"><table class="mtb"><caption class="sr">'+esc(opt.aria||'')+'</caption><thead><tr><th scope="col">날짜</th><th scope="col">'+esc(opt.curName)+'</th><th scope="col">'+esc(opt.prevName)+'</th></tr></thead><tbody>'+rows+'</tbody></table></div></details>';
  host.innerHTML=legend+'<div class="vz-plot" id="'+id+'" tabindex="0" role="img" aria-label="'+esc(opt.aria||'')+' 방향키로 날짜별 값을 읽을 수 있어요." style="aspect-ratio:'+W+'/'+H+'">'
   +svg+dots+lab+yax+'</div>'+axis+table;
  var plot=host.querySelector('#'+id),xh=plot.querySelector('.vz-xh'),hd=plot.querySelectorAll('.vz-hdot'),cur=k;
  function show(d,cx,cy){
    d=Math.max(1,Math.min(n,d));cur=d;
    xh.setAttribute('x1',X(d));xh.setAttribute('x2',X(d));xh.style.display='';
    var cv=d<=k?c[d-1]:null,pv=d<=p.length?p[d-1]:null;
    hd[1].style.display=cv==null?'none':'';if(cv!=null)hd[1].setAttribute('style',pct(X(d),Y(cv))+';background:'+T.accent);
    hd[0].style.display=pv==null?'none':'';if(pv!=null)hd[0].setAttribute('style',pct(X(d),Y(pv))+';background:'+T.ctx);
    var r=plot.getBoundingClientRect();
    tip('<div class="vz-th">'+d+'일까지</div>'
      +(cv!=null?tipRow(T.accent,fmt(cv)+opt.unit,opt.curName):'')
      +(pv!=null?tipRow(T.ctx,fmt(pv)+opt.unit,opt.prevName):'')
      +(cv!=null&&pv!=null?'<div class="vz-tf">'+(cv===pv?'같아요':(cv>pv?'+':'−')+fmt(Math.abs(cv-pv))+opt.unit)+'</div>':''),
      cx!=null?cx:r.left+X(d)/W*r.width,cy!=null?cy:r.top+Y(cv!=null?cv:pv)/H*r.height)}
  function off(){xh.style.display='none';hd[0].style.display='none';hd[1].style.display='none';hideTip()}
  plot.addEventListener('pointermove',function(e){var r=plot.getBoundingClientRect();
    var d=Math.round(((e.clientX-r.left)/r.width*W-PL)/iw*(n-1))+1;show(d,e.clientX,e.clientY)});
  plot.addEventListener('pointerleave',off);
  plot.addEventListener('focus',function(){show(cur)});
  plot.addEventListener('blur',off);
  plot.addEventListener('keydown',function(e){
    var m={ArrowLeft:-1,ArrowRight:1,Home:-99,End:99}[e.key];if(m==null)return;e.preventDefault();show(cur+m)})}

/* ══════ 범위 바 — 최저~최고 중 지금은 어디쯤 ══════
   opt = {min, max, v, minLabel, maxLabel, vLabel, goal, goalLabel, unit, fmt}
   목표가 있으면 눈금을 하나 세운다. 점은 지금 값 하나뿐 — 숫자를 몰라도 '평소보다 낮다' 가 보인다 */
function range(opt){
  var f=opt.fmt||fmt,lo=opt.min,hi=opt.max>lo?opt.max:lo+1;
  function P(v){return Math.max(0,Math.min(100,(v-lo)/(hi-lo)*100))}
  var g=opt.goal!=null?'<span class="vz-goal" style="left:'+P(opt.goal)+'%"><span>'+esc(opt.goalLabel||'목표')+' '+f(opt.goal)+(opt.unit||'')+'</span></span>':'';
  var pv=P(opt.v),vx=pv<12?'0%':pv>88?'-100%':'-50%';
  var vl='<span class="vz-rv" aria-hidden="true" style="left:'+pv+'%;transform:translateX('+vx+')">'+esc(opt.vLabel||'지금')+' <b>'+f(opt.v)+(opt.unit||'')+'</b></span>';
  function cap(t,v){return '<span>'+(t?esc(t):'')+'<b>'+f(v)+(opt.unit||'')+'</b></span>'}
  var al=(opt.vLabel||'지금')+' '+f(opt.v)+(opt.unit||'')+'. '+(opt.minLabel||'최저')+' '+f(lo)+(opt.unit||'')+', '+(opt.maxLabel||'최고')+' '+f(hi)+(opt.unit||'')
    +(opt.goal!=null?', '+(opt.goalLabel||'목표')+' '+f(opt.goal)+(opt.unit||''):'');
  return '<div class="vz-range'+(opt.goal!=null?' hasg':'')+'" role="img" aria-label="'+esc(al)+'">'+vl
   +'<div class="vz-rt">'+(opt.fill?'<i style="width:'+P(opt.v)+'%;background:'+T.accent+'"></i>':'')+g
   +'<span class="vz-rd" style="left:'+P(opt.v)+'%;background:'+T.accent+'"></span></div>'
   +'<div class="vz-rl" aria-hidden="true">'+cap(opt.minLabel==null?'최저':opt.minLabel,lo)
   +cap(opt.maxLabel==null?'최고':opt.maxLabel,hi).replace('<span>','<span style="text-align:right">')+'</div></div>'}

/* ══════ 스파크라인 ══════
   추이만 보여준다. 선은 회색, 마지막 점만 강조색. 값은 옆 글자가 진다 */
function spark(vals,opt){
  opt=opt||{};var W=opt.w||88,H=opt.h||26,pad=4,n=vals.length;
  if(!n)return '';
  var lo=Math.min.apply(null,vals),hi=Math.max.apply(null,vals);if(hi===lo){hi=lo+1;lo=lo-1}
  function X(i){return pad+(n>1?i/(n-1):0)*(W-pad*2)}
  function Y(v){return pad+(1-(v-lo)/(hi-lo))*(H-pad*2)}
  var d=vals.map(function(v,i){return (i?'L':'M')+X(i).toFixed(1)+' '+Y(v).toFixed(1)}).join(' ');
  return '<svg class="vz-spark" width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(opt.aria||'')+'">'
   +'<path d="'+d+'" fill="none" stroke="'+T.ctx+'" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>'
   +'<circle cx="'+X(n-1)+'" cy="'+Y(vals[n-1])+'" r="4" fill="'+(opt.color||T.accent)+'" stroke="'+T.surface+'" stroke-width="2"/></svg>'}

/* ══════ 증감 막대 — 기관별 순증감 ══════
   opt = {rows:[{label, v, note}], unit, posName:'순증', negName:'순감'}
   가운데 회색 기준선에서 양쪽으로. 늘면 파랑, 줄면 주황 — 둘 다 부호와 숫자를 같이 단다 */
function divBars(host,opt){
  var mx=Math.max.apply(null,opt.rows.map(function(r){return Math.abs(r.v)}).concat([1]));
  host.innerHTML='<div class="vz-legend"><span><i style="background:'+T.up+'"></i>'+esc(opt.posName||'늘어남')+'</span>'
   +'<span><i style="background:'+T.down+'"></i>'+esc(opt.negName||'줄어듦')+'</span></div>'
   +'<div class="vz-div" role="list">'+opt.rows.map(function(r,i){
     var w=Math.abs(r.v)/mx*36,pos=r.v>=0,val=(r.v>0?'+':r.v<0?'−':'')+fmt(Math.abs(r.v))+(opt.unit||'');
     return '<div class="vz-dr" role="listitem" tabindex="0" data-i="'+i+'" aria-label="'+esc(r.label+' '+val+(r.note?', '+r.note:''))+'">'
      +'<span class="vz-dl">'+esc(r.label)+'</span>'
      +'<span class="vz-dt"><span class="vz-d0"></span>'
      +(r.v?'<i class="'+(pos?'p':'n')+'" style="'+(pos?'left:50%':'right:50%')+';width:'+w+'%;background:'+(pos?T.up:T.down)+'"></i>':'')
      +'<span class="vz-dvl" style="'+(pos?'left:calc(50% + '+w+'% + 6px)':'right:calc(50% + '+w+'% + 6px)')+'">'+val+'</span></span></div>'}).join('')+'</div>';
  [].forEach.call(host.querySelectorAll('.vz-dr'),function(el){
    var r=opt.rows[+el.dataset.i];if(!r.note)return;
    function sh(x,y){tip('<div class="vz-th">'+esc(r.label)+'</div><div class="vz-tf" style="margin:0">'+esc(r.note)+'</div>',x,y)}
    el.addEventListener('pointerenter',function(e){sh(e.clientX,e.clientY)});
    el.addEventListener('pointerleave',hideTip);
    el.addEventListener('focus',function(){var b=el.getBoundingClientRect();sh(b.left+b.width/2,b.top)});
    el.addEventListener('blur',hideTip)})}

return {theme:theme,T:T,calendar:calendar,cumLine:cumLine,range:range,spark:spark,divBars:divBars,tip:tip,hideTip:hideTip}})();
