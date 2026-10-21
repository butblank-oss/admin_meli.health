/* 채널 비교 — 운영팀이 매달 궁금한 것: "어느 센터가 같은 시점에 뒤처지고 있나"
   채널마다 개강일이 다르니 달력으로 겹치면 비교가 안 된다. 개강 N일째로 맞춘다.
   숫자는 채널마다의 활동 원장(data.js · ledger.js)에서 — 채널 어드민과 같은 계산이다.
   선 그래프는 3계열까지(색 검증 범위). 운영 채널이 4개라 고르게 한다 */
(function(A){
"use strict";
var $=A.$,$$=A.$$,el=A.el,esc=A.esc,fmt=A.fmt,ph=A.ph,chead=A.chead,note=A.note,V=A.V,CHANNELS=A.CHANNELS;
var pick=null;
function short(c){return c.n.replace(' 치매안심센터','')}
function r1(x){return x==null?'—':(Math.round(x*10)/10).toFixed(1)}

V.compare=function(){
  var h=$('#v-compare'),T=A.TODAY,y=T.getFullYear(),m=T.getMonth()+1,dd=T.getDate();
  var run=CHANNELS.filter(function(c){return c.st==='run'&&A.LEDGERS[c.id]});
  var rows=run.map(function(c){
    var L=A.LEDGERS[c.id],cur=A.chMonth(c.id,y,m),pv=A.chMonth(c.id,y,m-1,dd);
    /* 최근 6주 주간 활동률 */
    var wk=[];for(var w=5;w>=0;w--){var e=L.T-w*7,s=e-6;
      if(s<0){wk.push(null);continue}
      var au=L.P.filter(function(p){return p.join<=e}).length;wk.push(au?Ledger.activeIn(L,s,e)/au*100:0)}
    var cv=Ledger.curve(L,7);
    return {c:c,L:L,cur:cur,pv:pv,wk:wk,cv:cv}});
  if(!pick)pick=['C01','C03','C04'];
  /* 같은 경과일 — 모든 운영 채널이 지나온 가장 긴 공통 일차 */
  var common=Math.floor(Math.min.apply(null,rows.map(function(r){return r.L.T}))/7)*7;
  function at(r,d){var p=r.cv.pts.filter(function(x){return x.d===d})[0];return p?p.rate:null}
  var atC=rows.map(function(r){return {r:r,v:at(r,common)}}).sort(function(a,b){return b.v-a.v});

  h.innerHTML=ph('채널 비교','개강일이 다른 채널을 같은 경과일로 맞춰 비교해요. 이번 달 숫자는 지난달 같은 날까지와 견줘요.','')
   +'<div class="mc" style="overflow:hidden">'+chead('채널별 이번 달','<span class="mcap">'+m+'월 1~'+dd+'일 · 괄호는 지난달 같은 날까지 대비 · 채널명을 누르면 상세</span>')
     +'<div class="scroll"><table class="mtb"><caption class="sr">채널별 이번 달 활동 비교</caption><thead><tr><th scope="col" style="padding-left:20px">채널</th><th scope="col">기수</th><th scope="col" class="num">대상자</th>'
     +'<th scope="col" class="num">활동자</th><th scope="col" class="num">월 활동률</th><th scope="col">최근 6주</th><th scope="col" class="num">신규</th><th scope="col" class="num">이탈</th>'
     +'<th scope="col" class="num" style="padding-right:20px">월 이탈률</th></tr></thead><tbody id="cp-tb"></tbody></table></div>'
     +'<p class="mcap" style="padding:10px 20px 16px;margin:0">월 활동률 = 이번 달 활동자 ÷ 대상자 · 월 이탈률 = 이번 달 이탈 ÷ 지난달 활동자. '
     +'누적 이탈 비율은 오래된 채널일수록 커져서 개소 6주차와 171일째를 비교할 수 없어요.</p></div>'

   +'<div class="mc dz-card"><h2 class="mh">같은 경과일 잔존 — 개강 '+common+'일째</h2>'
     +'<p class="mcap" style="margin:4px 0 10px">'+atC.map(function(o){return short(o.r.c)+' '+r1(o.v)+'%'}).join(' · ')
       +' — 첫 활동한 분 중 그날까지 7일 안에 활동한 비율. 3개까지 골라 겹쳐 봐요</p>'
     +'<div class="row" id="cp-pick" role="group" aria-label="비교할 채널" style="gap:6px;margin-bottom:6px"></div>'
     +'<div id="cp-lines"></div>'
     +note('<b>'+esc(short(atC[atC.length-1].r.c))+'</b>가 '+common+'일째 '+r1(atC[atC.length-1].v)+'%로 가장 낮고, <b>'+esc(short(atC[0].r.c))+'</b>와 '
       +(atC[0].v-atC[atC.length-1].v).toFixed(1)+'%p 차이예요. 같은 시점의 차이라 개강 시기 탓이 아니에요 — 초기 온보딩을 먼저 보세요.','wa')+'</div>'

   +'<div class="bento" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr)">'
   +'<div class="mc dz-card"><h2 class="mh">채널별 순증감</h2><p class="mcap" style="margin:4px 0 0">'+m+'월 신규 합류 + 복귀 − 이탈</p><div id="cp-div"></div></div>'
   +'<div class="mc dz-card"><h2 class="mh">월 활동률 위치</h2><p class="mcap" style="margin:4px 0 0">운영 채널 중 최저~최고 사이 어디쯤인지</p><div id="cp-rng"></div></div></div>';

  var tb=$('#cp-tb');
  rows.forEach(function(r){var c=r.c,cu=r.cur,pv=r.pv;
    function dl(a,b,goodUp){if(b==null)return '';var x=a-b;if(!x)return ' <span class="dz-d">(같음)</span>';
      return ' <span class="dz-d '+((x>0)===goodUp?'g':'b')+'">('+(x>0?'▲':'▼')+fmt(Math.abs(x))+')</span>'}
    var tr=el('tr');
    tr.innerHTML='<td style="padding-left:20px"><button type="button" class="lnk dz-ob">'+esc(c.n)+'</button></td>'
     +'<td class="mt" style="color:#475467">'+c.cohort+'기 '+r.L.T+'일째</td>'
     +'<td class="num mt">'+fmt(cu.aud)+'</td>'
     +'<td class="num mt">'+fmt(cu.activist)+dl(cu.activist,pv&&pv.activist,true)+'</td>'
     +'<td class="num mt" style="font-weight:700">'+r1(cu.rate)+'%</td>'
     +'<td>'+(r.wk.filter(function(v){return v!=null}).length>1?Viz.spark(r.wk.filter(function(v){return v!=null}),{aria:short(c)+' 최근 주간 활동률 추이'}):'<span class="mcap">개소 초기</span>')+'</td>'
     +'<td class="num mt">'+fmt(cu.join)+'</td><td class="num mt">'+fmt(cu.lost)+'</td>'
     +'<td class="num mt" style="padding-right:20px;color:'+(c.drop>15?'#B42318':c.drop>10?'#B54708':'#475467')+';font-weight:'+(c.drop>10?700:500)+'">'+(c.drop?c.drop+'%':'—')+'</td>';
    tr.querySelector('button').addEventListener('click',function(){A.openCh(c)});
    tb.appendChild(tr)});

  var pk=$('#cp-pick');
  rows.forEach(function(r){var on=pick.indexOf(r.c.id)>=0;
    var b=el('button','mchip'+(on?' on':''),esc(short(r.c))+' <span class="c mt">'+r.L.T+'일째</span>');
    b.type='button';b.setAttribute('aria-pressed',on?'true':'false');
    b.addEventListener('click',function(){var i=pick.indexOf(r.c.id);
      if(i>=0)pick.splice(i,1);else{if(pick.length>=3){A.toast('3개까지 비교할 수 있어요. 하나를 먼저 빼주세요','wa');return}pick.push(r.c.id)}
      V.compare()});
    pk.appendChild(b)});
  var sel=pick.map(function(id){return rows.filter(function(r){return r.c.id===id})[0]}).filter(Boolean);
  var maxT=Math.max.apply(null,sel.map(function(r){return r.L.T}).concat([7])),xs=[];
  for(var d=7;d<=Math.floor(maxT/7)*7;d+=7)xs.push(d);
  if(sel.length)Viz.lines($('#cp-lines'),{xs:xs,unit:'%',yMax:100,h:150,tableHead:'개강 후',
    xLabel:function(d){return d+'일째'},
    series:sel.map(function(r){return {name:short(r.c),pts:xs.map(function(d){return {x:d,y:at(r,d)}})}}),
    aria:'채널별 같은 경과일 잔존. '+sel.map(function(r){return short(r.c)+' '+common+'일째 '+r1(at(r,common))+'%'}).join(', ')+'.'});
  else $('#cp-lines').innerHTML='<p class="mcap">위에서 비교할 채널을 골라주세요</p>';

  Viz.divBars($('#cp-div'),{unit:'명',posName:'늘어남',negName:'줄어듦',rows:rows.map(function(r){
    return {label:short(r.c),v:r.cur.join+r.cur.back-r.cur.lost,note:'신규 '+r.cur.join+' · 복귀 '+r.cur.back+' · 이탈 '+r.cur.lost}})});
  var rates=rows.map(function(r){return r.cur.rate}),lo=Math.min.apply(null,rates),hi=Math.max.apply(null,rates);
  $('#cp-rng').innerHTML=rows.map(function(r){
    return '<div style="margin-top:14px"><div class="dz-gh"><span>'+esc(short(r.c))+'</span></div>'
      +Viz.range({min:Math.floor(lo),max:Math.ceil(hi),v:Math.round(r.cur.rate*10)/10,minLabel:'',maxLabel:'',vLabel:'',unit:'%'})+'</div>'}).join('')};
})(Sup);
