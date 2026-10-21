/* 활동 원장 — 사람 × 날짜 하나짜리 장부.
   채널 어드민과 슈퍼어드민이 함께 쓴다. 두 앱의 네임스페이스(App/Sup)에 기대지 않는 순수 함수만 둔다.

   예전 생성기는 '마지막 활동일' 을 먼저 정하고 거꾸로 활동을 채웠다. 그러면 오늘에 가까울수록
   활동할 수 있는 사람이 줄어 일별 활동자가 곤두박질치고(8/12 100명 → 8/21 7명),
   합류가 3~5월에만 몰려 '이번 달 신규' 가 늘 0 이었다. 여기서는 순서를 바로 세운다 —
     합류 → 첫 활동 → 하루하루 활동 → (이탈)
   참여자 목록의 활동일·최근 이용, 상세의 일별 기록, 대시보드·코호트·월간 리포트가
   전부 이 장부 하나에서 나온다. 화면마다 따로 만들면 숫자가 갈린다.

   용어 (2026-10-21 확정)
     활동    추천 활동(두뇌훈련·운동·마음다루기) 1회 이상. 걸음만 기록된 날은 활동이 아니다
     합류    프로그램 그룹에 들어온 날. 신청 승인일·앱 가입일과 다를 수 있다 (OP-1)
     이탈    활동하던 사람이 위험 기준일(기본 14일)을 처음 넘긴 날
     복귀    이탈한 뒤 다시 활동한 날 */
var Ledger=(function(){
"use strict";
function rnd(s){var x=Math.sin(s)*10000;return x-Math.floor(x)}
var DAY=864e5;
function addDays(d,n){return new Date(d.getFullYear(),d.getMonth(),d.getDate()+n)}
function idx(L,d){return Math.round((new Date(d.getFullYear(),d.getMonth(),d.getDate())-L.start)/DAY)}
function ymd(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}

/* opt
   seed, n, start(Date, 0일차), end(Date, 오늘)
   joinWeek(u)      u∈[0,1) → 합류 주차
   neverP(w)        그 주차 합류자가 끝내 한 번도 활동하지 않을 확률
   earlyP(w)        초반 이탈형일 확률 (늦게 들어올수록 높다 — 기수형의 약점)
   earlyMean        초반 이탈형의 평균 활동 기간(일)
   longMean         장기형의 평균 활동 기간(일)
   season(date)     계절 보정 (1 = 평소)
   holidays         {'YYYY-MM-DD':1} — 주말처럼 다룬다
   force(i)         {early:1} 같은 개인 강제값 (중도포기 상태 등) */
function build(opt){
  var start=opt.start,T=Math.round((opt.end-start)/DAY);
  var hol=opt.holidays||{},season=opt.season||function(){return 1};
  var off=[],sea=[];
  for(var d=0;d<=T;d++){var dt=addDays(start,d),w=dt.getDay();
    off.push(w===0||w===6||!!hol[ymd(dt)]);sea.push(season(dt))}
  var P=[];
  for(var i=0;i<opt.n;i++){
    var S=opt.seed+i*37,r=function(k){return rnd(S+k)},fc=(opt.force&&opt.force(i))||{};
    /* 합류일 — 평일로 맞춘다. 주말·공휴일에 그룹 배정을 하지 않는다 */
    var w=opt.joinWeek(r(1)),j=w*7+(w===0?Math.floor(Math.pow(r(2),2.2)*5):Math.floor(r(2)*7));
    if(j>T)j=T-Math.floor(r(3)*6);
    while(j<T&&off[j])j++;
    var never=r(4)<opt.neverP(w),first=-1,churn=T+1;
    if(!never){
      first=j+Math.floor(Math.pow(r(5),3)*6);
      while(first<=T&&off[first])first++;
      if(first>T){never=true;first=-1}}
    if(!never){
      var early=fc.early||r(6)<opt.earlyP(w);
      var life=Math.ceil(-Math.log(1-r(7))*(early?opt.earlyMean:opt.longMean));
      churn=first+Math.max(1,life)}
    /* 개인 활동 성향 — 하루에 활동할 확률. 시간이 갈수록 조금씩 느슨해진다 */
    var base=Math.min(0.95,0.16+0.82*Math.pow(r(8),1.1));
    var acts=new Uint8Array(T+1),steps=new Uint16Array(T+1);
    var stepper=r(9)<(never?0.42:0.74),stepMean=1700+Math.pow(r(10),1.35)*7800,stepTail=Math.floor(r(11)*75);
    var days=0,total=0,la=-1;
    for(var d2=0;d2<=T;d2++){
      var s=S*131+d2*7;
      if(first>=0&&d2>=first&&d2<churn){
        var fade=1-0.12*Math.min(1,(d2-first)/150);
        var p=off[d2]?base*0.4:base*fade*sea[d2];
        if(d2===first||rnd(s)<p){
          var n=1+Math.floor(rnd(s+1)*(off[d2]?2:5));
          acts[d2]=n;days++;total+=n;la=d2}}
      if(stepper&&d2>=j&&d2<churn+stepTail&&rnd(s+2)<0.78)
        steps[d2]=Math.round(stepMean*(0.55+0.9*rnd(s+3))*(off[d2]?0.72:1)*sea[d2])}
    P.push({i:i,w:w,join:j,first:first,churn:churn<=T?churn:-1,la:la,days:days,total:total,
            acts:acts,steps:steps,stepper:stepper})}
  return {start:start,T:T,P:P,off:off}}

/* 일별 계열 — 활동자 · 활동 수 · 합류 · 이탈 · 복귀 · 걸음
   이탈은 기준일에 따라 달라지므로 기준을 받아서 센다 */
function series(L,risk){
  var T=L.T,z=function(){return new Float64Array(T+1)};
  var o={dau:z(),acts:z(),join:z(),lost:z(),back:z(),stepN:z(),stepSum:z(),risk:risk};
  L.P.forEach(function(p){
    o.join[p.join]++;
    var gap=0,lost=false;
    for(var d=0;d<=T;d++){
      if(p.steps[d]){o.stepN[d]++;o.stepSum[d]+=p.steps[d]}
      if(p.acts[d]){o.dau[d]++;o.acts[d]+=p.acts[d];
        if(lost){o.back[d]++;lost=false}gap=0}
      else if(p.first>=0&&d>p.first){gap++;if(gap===risk+1){o.lost[d]++;lost=true}}}});
  return o}
/* [a,b] 구간에 한 번이라도 활동한 사람 수 */
function activeIn(L,a,b,filter){
  var n=0;a=Math.max(0,a);b=Math.min(L.T,b);
  L.P.forEach(function(p){if(filter&&!filter(p))return;
    for(var d=a;d<=b;d++)if(p.acts[d]){n++;return}});return n}
/* [a,b] 를 하루씩 늘려 가며 센 고유 활동자 — "이번 달 지금까지 몇 명" 곡선. 결과[k] = a~a+k 일 */
function cumActive(L,a,b,filter){
  var out=[];a=Math.max(0,a);b=Math.min(L.T,b);
  var hit=new Int32Array(Math.max(0,b-a+1));
  L.P.forEach(function(p){if(filter&&!filter(p))return;
    for(var d=a;d<=b;d++)if(p.acts[d]){hit[d-a]++;return}});
  var c=0;for(var k=0;k<hit.length;k++){c+=hit[k];out.push(c)}
  return out}
function stepIn(L,a,b,filter){
  var n=0,sum=0,cnt=0,only=0;a=Math.max(0,a);b=Math.min(L.T,b);
  L.P.forEach(function(p){if(filter&&!filter(p))return;
    var st=0,ac=0;
    for(var d=a;d<=b;d++){if(p.steps[d]){st++;sum+=p.steps[d];cnt++}if(p.acts[d])ac++}
    if(st)n++;if(st&&!ac)only++});
  return {users:n,avg:cnt?Math.round(sum/cnt):0,only:only}}
/* d일 기준으로 마지막 활동이 며칠 전인가 (없으면 -1) */
function lastAsOf(p,d){for(var x=Math.min(d,p.acts.length-1);x>=0;x--)if(p.acts[x])return d-x;return -1}

/* 주간 잔존 — 첫 활동 주(0일차 기준 주차)로 묶고, k주 뒤 그 주에 1회라도 활동했나.
   아직 k주가 지나지 않은 칸은 null (0% 가 아니라 '모름') */
function retention(L,weeks,groupOf){
  var G={};
  L.P.forEach(function(p){
    if(p.first<0)return;
    var key=groupOf?groupOf(p):Math.floor(p.first/7);if(key==null)return;
    var g=G[key]||(G[key]={key:key,n:0,hit:[],seen:[]});g.n++;
    var w0=Math.floor(p.first/7);
    for(var k=0;k<=weeks;k++){
      var a=(w0+k)*7,b=a+6;
      if(b>L.T){continue}
      g.seen[k]=(g.seen[k]||0)+1;
      for(var d=a;d<=b;d++)if(p.acts[d]){g.hit[k]=(g.hit[k]||0)+1;break}}});
  return Object.keys(G).map(function(k){var g=G[k];
    g.rate=[];for(var x=0;x<=weeks;x++)g.rate.push(g.seen[x]?(g.hit[x]||0)/g.seen[x]*100:null);
    return g})}
/* 경과일 곡선 — 기수끼리 같은 경과일로 맞춰 비교할 때 쓴다. 첫 활동자 중 d일에서 7일 창 안에 활동한 비율 */
function curve(L,step){
  var starters=L.P.filter(function(p){return p.first>=0}),out=[];
  for(var d=0;d<=L.T;d+=step||7){
    var a=Math.max(0,d-6),n=0;
    starters.forEach(function(p){for(var x=a;x<=d;x++)if(p.acts[x]){n++;return}});
    out.push({d:d,rate:starters.length?n/starters.length*100:0})}
  return {n:starters.length,pts:out}}

return {rnd:rnd,build:build,series:series,activeIn:activeIn,cumActive:cumActive,stepIn:stepIn,lastAsOf:lastAsOf,
        retention:retention,curve:curve,idx:idx,addDays:addDays,ymd:ymd}})();
if(typeof module!=='undefined')module.exports=Ledger;
