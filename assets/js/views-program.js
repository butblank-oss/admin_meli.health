(function(A){
"use strict";
var $=A.$,$$=A.$$,el=A.el,esc=A.esc,fmt=A.fmt,pad2=A.pad2,rnd=A.rnd,pill=A.pill,note=A.note,kpi=A.kpi,cbx=A.cbx,
    brow=A.brow,ph=A.ph,chead=A.chead,emptyBox=A.emptyBox,search=A.search,sth=A.sth,bindSort=A.bindSort,
    sortBy=A.sortBy,mkPager=A.mkPager,toast=A.toast,open=A.open,closeAll=A.closeAll,go=A.go,V=A.V,
    PEOPLE=A.PEOPLE,byId=A.byId,ORGS=A.ORGS,BRAIN=A.BRAIN,MIND=A.MIND,ASMT=A.ASMT,ROUT=A.ROUT,
    QUESTS=A.QUESTS,APPS=A.APPS,AUDIT=A.AUDIT,dayRec=A.dayRec,achieve=A.achieve,addAudit=A.addAudit,
    LT=A.LT,RT=A.RT,openPerson=A.openPerson,openAchieve=A.openAchieve,cnt=A.cnt,
    CFG=A.CFG,pCount=A.pCount,M=A.M,METRICS=A.METRICS,band=A.band,bandLabel=A.bandLabel,ownerOf=A.ownerOf,siteOwner=A.siteOwner,groupById=A.groupById,getGroup=A.getGroup,putGroup=A.putGroup,GROUPS=A.GROUPS,KIND=A.KIND,SCOPE=A.SCOPE,SITES=A.SITES,groupTree=A.groupTree,groupDepth=A.groupDepth,ROLES=A.ROLES,SITES_OWN=A.SITES_OWN,OPERATORS=A.OPERATORS,assignments=A.assignments,ownedBy=A.ownedBy,subsAt=A.subsAt,opChannel=A.opChannel,canEditSched=A.canEditSched,SCHED=A.SCHED,skey=A.skey,CARRY=A.CARRY,PERMLOG=A.PERMLOG,addPermLog=A.addPermLog,modalBox=A.modalBox,CH_SELF=A.CH_SELF,ruleAt=A.ruleAt,pushRule=A.pushRule,RULEVER=A.RULEVER;

/* ══════ 활동 현황 ══════ */
var sTab='sum';
V.stats=function(){
  var h=$('#v-stats');
  h.innerHTML=ph('활동 현황','이번 달이 지난달 이맘때보다 나은지, 어느 날·어느 기관에서 무슨 일이 있었는지 봅니다.','')
   +'<div class="mc" style="overflow:hidden"><div class="tabs" id="s-tabs"></div><div id="s-b" style="padding:20px"></div></div>'
   /* 월간 현황은 카드 여러 장이라 탭 카드 안에 넣지 않는다 — 카드 속 카드가 된다 */
   +'<div id="s-dash"></div>';
  var tb=$('#s-tabs');
  [['sum','월간 현황'],['pat','활동 패턴'],['cont','콘텐츠'],['ind','개인별'],['def','판정 기준']].forEach(function(x){
    var b=el('button','tab',x[1]);b.setAttribute('aria-selected',sTab===x[0]?'true':'false');
    b.addEventListener('click',function(){sTab=x[0];V.stats()});tb.appendChild(b)});
  A.bindTabs(tb);
  var B=$('#s-b');
  B.style.display=sTab==='sum'?'none':'';
  if(sTab==='sum')A.dashMonth($('#s-dash'));else if(sTab==='pat')patTab(B);
  else if(sTab==='cont')contTab(B);else if(sTab==='ind')indTab(B);else defTab(B)};
/* 참여 지속(잔존)은 슈퍼어드민 '코호트' 로 옮겼다 — super/assets/js/views-cohort.js */
function patTab(B){
  var DOW=[['월',29236],['화',31459],['수',31034],['목',29428],['금',31926],['토',9111],['일',7533]];
  var HR=[7410,3200,1800,1500,4200,10629,17261,16409,14222,14067,10575,7131,7066,8339,6584,5585,6109,6161,4809,5548,5110,4100,3200,2400];
  B.innerHTML='<div class="gap"><div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px">'
   +'<div class="mc" style="padding:20px"><span class="mh">요일별 활동량</span><div style="display:flex;flex-direction:column;gap:11px;margin-top:16px">'
     +DOW.map(function(d){var wk=d[0]==='토'||d[0]==='일';return brow(d[0],d[1]/31926*100,fmt(d[1]),wk?'c':'','26px')}).join('')
     +'</div><p class="mcap" style="margin:24px 0 0;font-size:13px">평일은 고르게 3만 회 안팎인데 주말은 8천 회로 떨어져요. 추천 활동이 평일에만 편성되기 때문이에요.</p></div>'
   +'<div class="mc" style="padding:20px"><span class="mh">시간대별 활동량</span>'
     +'<div style="display:flex;align-items:flex-end;gap:3px;height:130px;margin-top:20px">'
     +HR.map(function(n,h){return '<div style="flex:1;height:'+(n/17261*100)+'%;background:'+(h>=6&&h<=9?'#13BD7E':'#EAECF0')+';border-radius:3px" title="'+h+'시 · '+fmt(n)+'회"></div>'}).join('')
     +'</div><div class="mcap mt" style="display:flex;justify-content:space-between;margin-top:14px"><span>0시</span><span>6시</span><span>12시</span><span>18시</span><span>23시</span></div>'
     +'<p class="mcap" style="margin:24px 0 0;font-size:13px"><b style="color:#101828">오전 6시가 하루 중 가장 활발해요.</b> 06–09시에 전체 활동의 42%가 몰려요. 푸시 알림 시간도 여기에 맞춰야 해요.</p></div></div>'
   +'<div class="mc" style="padding:20px"><span class="mh">요일 × 시간대</span><div class="scroll" style="margin-top:16px"><table class="mtb" id="hm"></table></div></div></div>';
  var hd='<thead><tr><th style="width:40px"></th>';
  for(var h2=0;h2<24;h2+=2)hd+='<th style="text-align:center;padding:0 4px">'+h2+'</th>';
  hd+='</tr></thead><tbody>';
  ['월','화','수','목','금','토','일'].forEach(function(d,di){
    hd+='<tr><th style="background:transparent;border:none">'+d+'</th>';
    for(var h3=0;h3<24;h3+=2){var v=Math.min(1,HR[h3]/17261*(di>=5?0.26:1)*(0.85+rnd(di*7+h3)*0.3));
      hd+='<td style="border:none;text-align:center;padding:3px"><span style="display:block;padding:7px 0;border-radius:4px;background:color-mix(in srgb,#13BD7E '+(v*80).toFixed(0)+'%,#fff);color:'+(v>0.45?'#fff':'#69707C')+';font-size:11.5px;font-variant-numeric:tabular-nums">'+(v>0.12?(v*100).toFixed(0):'')+'</span></td>'}
    hd+='</tr>'});
  $('#hm').innerHTML=hd+'</tbody>'}
function contTab(B){
  var C=[['두뇌훈련',20326,15650],['운동',16200,10940],['마음다루기',3986,2620]];
  var G=[['꿀벌의 숫자놀이',9873],['기찻길 만들기',9729],['기억의 숨바꼭질',7233],['재밌는 숫자 퍼즐 4X4',7230],['숨은 헬씨 찾기',6950],['양말정리 대작전',6907],['초성 퀴즈',6581],['진짜 색깔 찾기',5907]];
  B.innerHTML='<div class="gap">'
   +kpi([['완료','29,210','회','72.1%','ok'],['중도 이탈','4,689','회','11.6%','wa'],['진입만','6,613','회','16.3%','cr'],['총 활동','40,512','회','']])
   +'<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px">'
   +'<div class="mc" style="overflow:hidden">'+chead('유형별 수행','<span class="mcap">2026년 7월</span>')
     +'<div class="scroll"><table class="mtb"><thead><tr><th style="padding-left:20px">유형</th><th class="num">수행</th><th class="num">완료</th><th class="num">완료율</th><th style="width:110px;padding-right:20px"></th></tr></thead><tbody>'
     +C.map(function(c){var r=c[2]/c[1]*100;return '<tr><td style="padding-left:20px">'+c[0]+'</td><td class="num mt">'+fmt(c[1])+'</td><td class="num mt">'+fmt(c[2])+'</td><td class="num mt">'+r.toFixed(1)+'%</td><td style="padding-right:20px"><span class="bar"><i class="'+(r>75?'':r>70?'':'w')+'" style="width:'+r+'%"></i></span></td></tr>'}).join('')
     +'</tbody></table></div><p class="mcap" style="padding:14px 20px">완료율은 앱의 완료 신호 유실 이슈로 운동·마음 항목이 실제보다 낮게 집계돼요.</p></div>'
   +'<div class="mc" style="padding:20px"><span class="mh">두뇌훈련 인기 순위</span><div style="display:flex;flex-direction:column;gap:10px;margin-top:16px">'
     +G.map(function(g,i){return '<div class="brow"><span class="l mt" style="width:18px;color:#69707C">'+(i+1)+'</span><span class="l" style="width:130px">'+g[0]+'</span><span class="bar"><i style="width:'+(g[1]/9873*100)+'%"></i></span><span class="v">'+fmt(g[1])+'</span></div>'}).join('')
     +'</div></div></div></div>'}
var iSort={key:'score',dir:-1},iPager=mkPager(function(){V.stats()}),iq='';
function indTab(B){
  B.innerHTML='<div class="gap"><div class="row">'+search('iq','이름·전화 뒷자리','240px')
   +'<select class="mfld" id="i-sort"><option value="score">정렬: 점수</option><option value="rate">수행률</option><option value="days">활동일</option><option value="step">걸음</option></select>'
   +'<span style="margin-left:auto"><button class="mb">엑셀 내려받기</button></span></div>'
   +'<div class="mc" style="overflow:hidden"><div class="scroll"><table class="mtb"><thead><tr id="i-th"></tr></thead><tbody id="i-tb"></tbody></table></div><div class="pager" id="i-pg"></div></div></div>';
  $('#iq').value=iq;$('#i-sort').value=iSort.key;
  $('#iq').addEventListener('input',function(){iq=this.value;iPager.page=1;fill()});
  $('#iq-x').addEventListener('click',function(){iq='';$('#iq').value='';iPager.page=1;fill()});
  $('#i-sort').addEventListener('change',function(){iSort.key=this.value;iSort.dir=-1;iPager.page=1;fill()});
  function fill(){
    $('#iq-x').style.display=iq?'flex':'none';
    var base=PEOPLE.filter(function(p){return p.days>0&&(!iq||p.full.indexOf(iq)>=0||p.tail.indexOf(iq)>=0)});
    base=sortBy(base,iSort,function(p,k){return k==='name'?p.full:k==='org'?p.org:p[k]||0});
    var th=$('#i-th');
    th.innerHTML='<th class="num" style="padding-left:20px;width:56px">순위</th>'+sth('이름','name',iSort)+'<th>연락처</th>'+sth('기관','org',iSort)
     +sth('점수','score',iSort,1)+sth('수행률','rate',iSort,1)+sth('활동일','days',iSort,1)+sth('연속','streak',iSort,1)
     +'<th class="num">마음</th><th class="num">증상</th>'+sth('걸음','step',iSort,1);
    bindSort(th,iSort,function(){iPager.page=1;fill()});
    var rows=iPager.slice(base),tb=$('#i-tb');tb.innerHTML='';
    rows.forEach(function(p,ix){
      var tr=el('tr','clk');
      tr.innerHTML='<td class="num mt" style="padding-left:20px;color:#69707C">'+(base.indexOf(p)+1)+'</td>'
       +'<td><span class="lnk">'+p.name+'</span></td><td class="mt" style="color:#475467">'+p.phone+'</td><td style="color:#475467">'+p.org+'</td>'
       +'<td class="num mt">'+fmt(p.score)+'</td><td class="num mt">'+p.rate+'%</td><td class="num mt">'+p.days+'</td><td class="num mt">'+p.streak+'</td>'
       +'<td class="num mt">'+p.mind+'</td><td class="num mt">'+p.symp+'</td><td class="num mt">'+fmt(p.step)+'</td>';
      tr.addEventListener('click',function(){A.askOpen(p,'stats')});tb.appendChild(tr)});
    iPager.render($('#i-pg'))}
  fill()}
function defTab(B){
  /* 지표 정의도 손으로 적지 않는다 — 화면이 쓰는 계산(METRICS)과 같은 배열에서 그린다.
     예전엔 여기만 따로 적은 목록이라, 활동자 정의를 바꿔도 이 표는 옛 정의를 보여줬다 */
  var D=A.METRICS.map(function(m){return [m.n,m.d,m.f,m.use||'']})
   /* 검사 등급은 손으로 적지 않고 TESTS에서 뽑아 쓴다. 표와 실제 판정이 어긋날 수 없게 하기 위함. */
   .concat(A.TESTS.map(function(t){
     var seen={},bands=[],prev=0;
     for(var sc=0;sc<=t.max;sc++){
       var l=t.lv(sc)[0];
       if(l!==seen.l){if(seen.l)bands.push(seen.l+' '+prev+'–'+(sc-1));seen={l:l};prev=sc}}
     bands.push(seen.l+' '+prev+'–'+t.max);
     return [t.n,t.items+'문항 · 0–'+t.max+'점',bands.join(' / '),'참여자 상세 · 오늘']}));
  B.innerHTML='<div class="gap">'
   +note('화면의 숫자가 무엇을 세는지 정의해요. 보건소 제출 수치와 대조할 때 정의부터 맞추면 차이가 사라져요.','in')
   +'<div class="mc" style="overflow:hidden"><div class="scroll"><table class="mtb"><thead><tr><th style="padding-left:20px">지표</th><th>세는 대상</th><th>계산식</th><th style="padding-right:20px">쓰는 화면</th></tr></thead><tbody>'
   +D.map(function(d){return '<tr><td style="padding-left:20px;font-weight:600">'+d[0]+'</td><td style="color:#475467">'+d[1]+'</td><td class="mt" style="color:#667085;font-size:12.5px">'+d[2]+'</td><td class="mcap" style="padding-right:20px">'+d[3]+'</td></tr>'}).join('')
   +'</tbody></table></div></div>'
   +note('검사 등급은 이 표와 실제 판정이 <b>같은 값에서 나와요.</b> 표만 고치고 판정이 안 바뀌는 일은 생기지 않아요.','ok')
   +note('<b>운영팀 확정 사항 (2026-08-24)</b><br>· 노력 점수는 랭킹과 별개 지표라 화면에서 제외했어요 — 수행률·연속일이 이미 노력을 반영해요.<br>· 음주(AUDIT-K)는 <b>4기부터</b> 도입해요. 기수 중간에 넣으면 참여자별 검사가 달라져 통계가 갈라져요.<br>· 터그테스트는 앱 수정이 끝날 때까지 지표에서 뺐어요.','in')+'</div>'}

/* ══════ 상담실 ══════ */
var ROOMS=[{n:'황*학',st:'unans',t:'3일',last:'걸음 수가 안 올라가요',mine:1,msgs:[['them','걸음 수가 안 올라가요','오전 7:12','08-11']]},
 {n:'정*순',st:'unans',t:'1일',last:'글씨를 더 크게 못하나요',mine:1,msgs:[['them','글씨를 더 크게 못하나요','오전 6:41','08-13']]},
 {n:'이*희',st:'ops',t:'4시간',last:'앱이 자꾸 꺼집니다',mine:0,msgs:[['them','앱이 자꾸 꺼집니다','오전 8:02','08-14'],['me','확인 중입니다. 잠시만 기다려주세요.','오전 9:15','08-14']]},
 {n:'최*옥',st:'open',t:'2시간',last:'감사합니다 잘 쓰고 있어요',mine:1,msgs:[['me','오늘부터 29일까지 활동 7일 이상 하신 분께 선물을 드려요!','오전 8:57','08-13'],['them','감사합니다 잘 쓰고 있어요','오전 11:20','08-14']]},
 {n:'김*자',st:'open',t:'1일',last:'네 알겠습니다',mine:1,msgs:[['them','비밀번호를 잊어버렸어요','오전 7:30','08-12'],['me','앱에서 전화번호로 다시 로그인하시면 돼요.','오전 9:10','08-12'],['them','네 알겠습니다','오전 6:55','08-13']]},
 {n:'박*수',st:'empty',t:'—',last:'',mine:1,msgs:[]}];
/* 방마다 실제 참여자를 붙인다 — 예전엔 어느 방에서 '참여자 상세 열기' 를 눌러도 같은 사람(PEOPLE[11])이 열렸고
   오른쪽 패널의 연락처·기관도 고정 글자였다. 이름이 같은 분 중 건강정보 동의가 있는 분을 고르고, 없으면 그런 분을 대신 쓴다 */
(function(){var used={},pool=PEOPLE.filter(function(p){return p.consent.sensitive&&!p.consent.revoked&&p.status==='active'});
  ROOMS.forEach(function(r,i){
    var p=pool.filter(function(x){return x.name===r.n&&!used[x.id]})[0]||pool.filter(function(x){return !used[x.id]})[i*37%200];
    used[p.id]=1;r.pid=p.id;r.n=p.name})})();
/* 상태 — 종료가 없으면 끝난 상담도 전부 '진행' 으로 남아 무엇이 남았는지 안 보인다 */
var RST={unans:['미답변','cr'],open:['진행','ok'],ops:['운영팀','in'],empty:['대화 없음','nu'],done:['종료','nu']};
/* 목록의 방 6개는 625개 중 일부라, 칩 숫자 = 보이는 방 + 안 보이는 방(고정분). 상태를 바꾸면 칩도 같이 움직인다 */
var ROFF={unans:2,open:10,ops:3,empty:221,done:36};
function rcount(st){return ROOMS.filter(function(r){return r.st===st}).length+(ROFF[st]||0)}
var cScope='MINE',cFilter=[],cRoom=null,cMob='list';
/* 좁은 화면에선 목록과 대화를 같이 쌓지 않고 한 번에 하나만 보여준다 —
   keep 없이 부르면(메뉴 이동·필터 변경) 목록으로 되돌아온다 */
V.consult=function(keep){
  if(!keep)cMob='list';
  var h=$('#v-consult');
  h.innerHTML=ph('상담실','참여자 한 명당 방이 하나씩 자동으로 만들어져요.','<button class="mb mbp" id="c-bc">단체 공지 보내기</button>')
   +kpi([['답변을 기다려요',String(rcount('unans')),'건','가장 오래된 건 3일째','cr'],['내 상담실','621','개','전체 625개 중'],
         ['운영팀이 맡은 방',String(rcount('ops')),'개',''],['이번 달 종료',String(rcount('done')),'건','평균 5.2시간 안에 첫 답변','','up']])
   +note('상담방은 참여자 한 명당 하나씩 자동으로 만들어져요(현재 625개). 이 중 <b>'+rcount('empty')+'개는 아직 대화가 없어요.</b> 개별 문의는 드물고 실제로는 단체 공지함으로 쓰이고 있어요.','in')
   +'<div class="mc" style="overflow:hidden"><div class="row" style="padding:16px 20px" id="c-f"></div>'
   +'<div class="chat'+(cMob==='thread'?' thr-on':'')+'"><div class="rooms" id="c-rooms"></div>'
   +'<div class="thr"><button class="cback" id="c-back" type="button">'
     +'<svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4 6 9l5 5"/></svg>'
     +'<b id="c-back-n"></b></button>'
     +'<div class="msgs" id="c-msgs"></div><div id="c-comp"></div></div>'
   +'<div class="cpn" id="c-pn"></div></div></div>'
   +note('<b>지금 시스템의 제약이에요.</b> 답변 입력창은 그 방의 담당자로 지정된 사람에게만 나타나요. 담당자 1명 = 답변 권한 1명 구조라 주무관 1차 / 운영팀 2차 응대가 아직 안 돼요.','cr');
  /* 대화를 볼 땐 지표·필터·안내문을 치운다 — 좁은 화면에서 대화가 쓸 자리를 뺏는다 */
  h.classList.toggle('thr-on',cMob==='thread');
  $('#c-bc').addEventListener('click',function(){go('pushnew')});
  $('#c-back').addEventListener('click',function(){cMob='list';V.consult(1);window.scrollTo(0,0)});
  var f=$('#c-f');
  [['내 상담실','MINE',621],['전체 상담실','ALL',625]].forEach(function(x){
    var b=el('button','mchip'+(cScope===x[1]?' on':''),x[0]+' <span class="c mt">'+x[2]+'</span>');
    b.addEventListener('click',function(){cScope=x[1];cRoom=null;V.consult()});f.appendChild(b)});
  f.appendChild(el('span','sep'));
  [['미답변','unans'],['진행 중','open'],['운영팀 담당','ops'],['종료','done'],['대화 없음','empty']].forEach(function(x){
    var b=el('button','mchip'+(cFilter.indexOf(x[1])>=0?' on':''),x[0]+' <span class="c mt">'+rcount(x[1])+'</span>');
    b.setAttribute('aria-pressed',cFilter.indexOf(x[1])>=0?'true':'false');
    b.addEventListener('click',function(){var i=cFilter.indexOf(x[1]);if(i>=0)cFilter.splice(i,1);else cFilter.push(x[1]);V.consult()});f.appendChild(b)});
  var list=ROOMS.filter(function(r){
    if(cScope==='MINE'&&!r.mine)return false;
    if(cFilter.length&&cFilter.indexOf(r.st)<0)return false;return true})
  /* 끝난 상담은 아래로 — 위에는 손댈 방만 */
    .sort(function(a,b){return (a.st==='done'?1:0)-(b.st==='done'?1:0)});
  var rl=$('#c-rooms');rl.innerHTML='';
  if(!list.length){rl.innerHTML=emptyBox('해당하는 상담실이 없어요','');$('#c-back-n').textContent='목록';thread(null);return}
  if(!cRoom||list.indexOf(cRoom)<0)cRoom=list[0];
  list.forEach(function(r){
    var b=el('button','room'+(r.st==='done'?' done':''));
    var s=RST[r.st];
    b.innerHTML='<span class="r1">'+esc(r.n)+' '+pill(s[0],s[1])+'<span class="t">'+r.t+'</span></span><span class="r2">'+esc(r.last||'아직 대화가 없어요')+'</span>';
    b.setAttribute('aria-selected',cRoom===r?'true':'false');
    b.setAttribute('role','option');b.type='button';
    b.addEventListener('click',function(){cRoom=r;cMob='thread';V.consult(1);window.scrollTo(0,0)});
    rl.appendChild(b)});
  rl.setAttribute('role','listbox');rl.setAttribute('aria-label','상담 목록');
  $('#c-back-n').textContent=cRoom?cRoom.n:'목록';
  thread(cRoom)};
function thread(r){
  var m=$('#c-msgs'),c=$('#c-comp'),p=$('#c-pn');
  if(!r){m.innerHTML='';c.innerHTML='';p.innerHTML='';return}
  var P=byId[r.pid];
  m.innerHTML='';
  if(!r.msgs.length)m.innerHTML=emptyBox('아직 대화가 없어요','참여자가 가입할 때 자동으로 만들어진 방이에요');
  else{var day='';r.msgs.forEach(function(x){
    if(x[3]!==day){day=x[3];m.appendChild(el('span','mday','2026년 '+day.replace('-','월 ')+'일'))}
    m.appendChild(el('div','msg '+(x[0]==='me'?'me':'them'),esc(x[1])+'<div class="mt2">'+x[2]+'</div>'))})}
  if(r.st==='done'&&r.closed)m.appendChild(el('div','mend','<b>상담을 종료했어요</b> · '+esc(r.closed.why)+'<br><span>'+esc(r.closed.at)+' · '+esc(r.closed.by)
    +(r.closed.memo?' · '+esc(r.closed.memo):'')+'</span><span>참여자가 다시 말을 걸면 자동으로 다시 열려요</span>'));
  if(r.mine){c.className='comp';c.innerHTML='<textarea placeholder="답변을 입력하고 Enter로 보내요" aria-label="답변 입력"></textarea><button class="mb mbp" style="height:40px" id="c-send">보내기</button>';
    $('#c-send').addEventListener('click',function(){
      var ta=c.querySelector('textarea');if(!ta.value.trim())return;
      r.msgs.push(['me',ta.value.trim(),'오후 2:30','08-21']);r.last=ta.value.trim();r.st='open';r.t='방금';delete r.closed;
      ta.value='';V.consult(1);toast('답변을 보냈어요','ok')})}
  else{c.className='';c.innerHTML='<div style="padding:14px;background:#F9FAFB;border-top:1px solid #EAECF0;display:flex;gap:10px;align-items:center">'
    +'<span class="mcap">이 상담실은 <b style="color:#475467">원메딕스 운영팀</b>이 담당하고 있어 답변할 수 없어요.</span>'
    +'<button class="mb mbs" style="margin-left:auto;flex:none" id="c-take">담당 가져오기</button></div>';
    $('#c-take').addEventListener('click',function(){r.mine=1;r.st='open';V.consult(1);toast('담당을 가져왔어요','ok','되돌리기',function(){r.mine=0;r.st='ops';V.consult(1)})})}
  var BL=band(P)==='none'?'활동 기록 없음':band(P)==='recent'?'최근 활동 · '+(P.last===0?'오늘':P.last+'일 전'):bandLabel()[band(P)]+' · '+P.last+'일째';
  p.innerHTML='<div><div class="mcap" style="margin-bottom:8px">참여자</div><div style="font-size:15px;font-weight:700">'+esc(P.name)+'</div>'
   +'<div class="mt mcap" style="margin-top:3px">'+P.phone+' · PIN '+P.pin+'</div><div class="mcap">'+esc(P.org)+' · '+BL+'</div>'
   +'<button class="mb mbs" style="margin-top:10px" id="c-op">참여자 정보 보기</button>'
   +'<p class="mcap" style="margin:6px 0 0;font-size:12px">사유를 적으면 이 화면 위에 열려요</p></div>'
   +'<div style="border-top:1px solid #F2F4F7;padding-top:14px"><div class="mcap" style="margin-bottom:6px">담당</div>'
   +'<div style="font-size:13.5px;font-weight:600">'+(r.mine?'김주무 (채널)':'이운영 (원메딕스)')+'</div>'
   +(r.mine&&r.st!=='empty'?'<button class="mb mbs" style="margin-top:9px;width:100%" id="c-end">'+(r.st==='done'?'상담 다시 열기':'상담 종료')+'</button>':'')
   +'<button class="mb mbs" style="margin-top:6px;width:100%" id="c-mv">'+(r.mine?'운영팀으로 이관':'담당 가져오기')+'</button></div>'
   +note('<b>영업일 3일</b> 넘게 답변이 없으면 운영팀에 자동으로 알림이 가요. 주말·공휴일은 세지 않아요.','nu');
  $('#c-op').addEventListener('click',function(){A.askOpen(P,'consult',peek)});
  if($('#c-end'))$('#c-end').addEventListener('click',function(){r.st==='done'?reopen(r):endRoom(r)});
  $('#c-mv').addEventListener('click',function(){var was=r.mine,ws=r.st;r.mine=r.mine?0:1;r.st=r.mine?'open':'ops';V.consult(1);
    toast(was?'운영팀으로 이관했어요':'담당을 가져왔어요','ok','되돌리기',function(){r.mine=was;r.st=ws;V.consult(1)})})}

/* 상담 종료 — 끝난 상담이 '진행' 으로 계속 남으면 무엇이 남았는지 안 보인다.
   사유를 남기고, 참여자가 다시 말을 걸면 자동으로 다시 열린다 */
function endRoom(r){
  var b=el('div');b.style.cssText='display:flex;flex-direction:column;gap:13px';
  b.innerHTML='<p class="mcap" style="margin:0"><b style="color:#101828">'+esc(r.n)+'</b>님과의 상담을 종료해요. 종료해도 대화는 지워지지 않아요.</p>'
   +'<div><label class="flab" for="ce-why">종료 사유 <span style="color:#B42318" aria-hidden="true">*</span><span class="sr">(필수)</span></label>'
   +'<select class="mfld" id="ce-why" style="width:100%"><option value="">사유를 고르세요</option>'
   +['문의 해결','안내 완료','참여자 응답 없음','다른 창구로 연결','기타'].map(function(x){return '<option>'+x+'</option>'}).join('')+'</select></div>'
   +'<div><label class="flab" for="ce-memo">메모 <span class="mcap">선택</span></label>'
   +'<textarea class="mfld" id="ce-memo" style="width:100%;height:60px;padding:9px 11px" placeholder="다음 담당자가 알아야 할 것"></textarea></div>'
   +'<p id="ce-err" class="mcap" role="alert" style="margin:0;color:#B42318;display:none">종료 사유를 골라주세요</p>';
  var m=A.modalBox('상담 종료',b,420),f=m.querySelector('.mfoot');
  f.innerHTML='<button class="mb" type="button" data-close>취소</button>';
  var ok=el('button','mb mbp','종료');ok.type='button';f.appendChild(ok);
  ok.addEventListener('click',function(){
    var why=$('#ce-why').value;if(!why){$('#ce-err').style.display='block';$('#ce-why').focus();return}
    var prev=r.st,d=new Date();
    r.closed={why:why,memo:$('#ce-memo').value.trim(),by:A.meOp().name,at:'08-21 '+pad2(d.getHours())+':'+pad2(d.getMinutes())};
    r.st='done';closeAll();V.consult(1);
    toast(r.n+'님 상담을 종료했어요','ok','되돌리기',function(){r.st=prev;delete r.closed;V.consult(1)})})}
function reopen(r){r.st='open';delete r.closed;V.consult(1);toast('상담을 다시 열었어요','ok')}

/* 참여자 정보 보기 — 상담실을 떠나지 않고 팝업으로.
   예전엔 상세 화면으로 넘어가 상담으로 돌아오기 어려웠다. 문지기(동의·권한·사유)와 기록은 상세와 같고,
   팝업을 닫는 순간 원문이 다시 가려지고 열람이 끝난 것으로 기록된다 */
function peek(p,why,row){
  var L=A.LEDGER.P[p.idx],T=A.LEDGER.T,days=[];
  for(var d=T-13;d<=T;d++)days.push({d:A.dAt(d),n:L.acts[d],off:A.LEDGER.off[d]});
  var H=A.assessHist(p),latest={};H.forEach(function(x){if(!latest[x.test.c])latest[x.test.c]=x});
  var BL=band(p)==='none'?'활동 기록 없음':band(p)==='recent'?'최근 활동':bandLabel()[band(p)];
  var b=el('div');b.className='pk';
  b.innerHTML='<div class="pk-ban">원문을 보는 중 · 사유 <b>'+esc(why)+'</b> — 창을 닫으면 다시 가려지고 기록에 남아요</div>'
   +'<div class="pk-id"><b>'+esc(p.full)+'</b><span class="mt">'+p.phoneFull+'</span>'
   +'<span class="mcap">'+p.birth+'년생 · 만 '+p.age+'세 · '+p.sex+' · PIN '+p.pin+' · '+esc(p.org)+'</span></div>'
   +'<div class="pk-kpi">'
     +[['상태',BL],['최근 이용',p.last>900?'—':p.last===0?'오늘':p.last+'일 전'],['누적 활동일',p.days+'일'],['수행률',p.days?p.rate+'%':'—']]
      .map(function(x){return '<div><span class="mcap">'+x[0]+'</span><b>'+x[1]+'</b></div>'}).join('')+'</div>'
   +'<div><span class="flab">최근 2주 활동</span><div class="pk-days" role="list">'
     +days.map(function(x){var lab=(x.d.getMonth()+1)+'/'+x.d.getDate();
       return '<span role="listitem" class="'+(x.n?'on':'')+(x.off?' off':'')+'" title="'+lab+' 활동 '+x.n+'회"><i>'+(x.n||'')+'</i><em>'+x.d.getDate()+'</em>'
        +'<span class="sr">'+lab+' 활동 '+x.n+'회</span></span>'}).join('')+'</div></div>'
   +'<div><span class="flab">최근 검사</span>'
     +(Object.keys(latest).length?'<div class="pk-tests">'+A.TESTS.map(function(t){var x=latest[t.c];if(!x)return '';var lv=t.lv(x.score);
       return '<div><span>'+t.n+'</span><span class="mcap mt">'+x.date+'</span><b class="mt">'+x.score+'점</b>'+pill(lv[0],lv[1])+'</div>'}).join('')+'</div>'
      :'<p class="mcap" style="margin:4px 0 0">받은 검사가 없어요</p>')+'</div>';
  var m=A.modalBox(p.name+'님 정보',b,520),f=m.querySelector('.mfoot');
  f.innerHTML='<button class="mb" type="button" data-close>닫기</button>';
  var full=el('button','mb mbp','전체 상세로 이동');full.type='button';f.appendChild(full);
  var done=false;
  function end(){if(done)return;done=true;mo.disconnect();A.expireAudit(row)}
  /* 닫기·Esc·바깥 누르기·자동 로그아웃 — 어떤 길로 닫혀도 열람을 끝낸다 */
  var mo=new MutationObserver(function(){if(!m.classList.contains('on'))end()});
  mo.observe(m,{attributes:true,attributeFilter:['class']});
  /* 같은 열람을 상세로 이어간다 — 사유를 두 번 묻지 않고, 기록 줄도 하나로. 상세를 나갈 때 끝난다 */
  full.addEventListener('click',function(){done=true;mo.disconnect();closeAll();A.openRevealed(p,'consult',why,row)})}

/* ══════ 프로그램 일정 ══════ */
var pcM={y:2026,m:8};
/* 그날 편성 — 저장된 게 있으면 그걸, 없으면 기본 공식.
   편성은 그룹 주관리자만 바꾼다. 케어센터는 지역 사정에 맞춰 편성해야 해서
   맬리 파트너(콘텐츠 Own 없음)와 달리 예외로 열어둔 자리다. */
function schedOf(y,m,dn,dow){
  var k=skey(y,m,dn);
  if(SCHED[k])return SCHED[k];
  if(dow===0||dow===6)return null;
  var t=dn*3+m;
  return {br:BRAIN[t%BRAIN.length],ex:t%ROUT.length,mi:MIND[t%MIND.length],
          as:(dn%9===3)?ASMT[t%ASMT.length]:''}}
V.sched=function(){
  var h=$('#v-sched'),ed=canEditSched(),g0=groupById(getGroup());
  h.innerHTML=ph('프로그램 일정',ed?'참여자 앱에 언제 무엇이 나갈지 정해요.':'확인만 할 수 있어요. 바꿔야 하면 변경 요청을 보내주세요.',
    ed?'<button class="mb" id="sc-tpl">템플릿 적용</button><button class="mb" data-modal="m-schedreq">변경 요청</button>'
      :'<button class="mb" data-modal="m-schedreq">일정 변경 요청</button>')
   +(ed?note('<b>'+esc(g0.name)+'의 주관리자라 편집할 수 있어요.</b> 날짜를 누르면 그날 편성을 바꿔요. '
       +'직접 짜기 부담되면 <b>템플릿 적용</b>으로 12주치를 한 번에 깔거나, 운영팀에 요청하세요.','in')
      :note('이 그룹의 <b>주관리자만</b> 일정을 바꿀 수 있어요. 지금은 확인만 가능해요. 변경 요청은 기록에 남아요.','nu'))
   +'<div class="mc" style="padding:20px"><div class="row" style="margin-bottom:16px">'
     +'<button type="button" class="pgn" id="sc-p" aria-label="이전 달">'+LT+'</button>'
     +'<span class="mh mt" style="min-width:116px;text-align:center">'+pcM.y+'년 '+pcM.m+'월</span>'
     +'<button type="button" class="pgn" id="sc-n" aria-label="다음 달">'+RT+'</button>'
     +'<button class="mb mbs" id="sc-t">오늘</button>'
     +(ed?'<span class="mcap" style="margin-left:12px">날짜를 눌러 편성을 바꿔요</span>':'')
     +'<span class="lgd" style="margin-left:auto"><span><b style="background:#E7F9F1"></b>두뇌훈련</span>'
     +'<span><b style="background:#EFF8FF"></b>운동 <span style="color:#175CD3">눌러서 동작 보기</span></span>'
     +'<span><b style="background:#FFFAEB"></b>마음다루기</span><span><b style="background:#F4F3FF"></b>검사측정</span></span></div>'
     +'<div class="pcal" id="pc"></div></div>';
  $('#sc-p').addEventListener('click',function(){pcM.m--;if(pcM.m<1){pcM.m=12;pcM.y--}V.sched()});
  $('#sc-n').addEventListener('click',function(){pcM.m++;if(pcM.m>12){pcM.m=1;pcM.y++}V.sched()});
  $('#sc-t').addEventListener('click',function(){pcM={y:2026,m:8};V.sched()});
  if($('#sc-tpl'))$('#sc-tpl').addEventListener('click',openTemplate);
  var g=$('#pc');
  ['일','월','화','수','목','금','토'].forEach(function(d,ix){g.appendChild(el('div','dh'+(ix===0?' s':ix===6?' t':''),d))});
  var first=new Date(pcM.y,pcM.m-1,1).getDay(),dim=new Date(pcM.y,pcM.m,0).getDate();
  for(var k=0;k<first;k++)g.appendChild(el('div','dy off'));
  for(var dn=1;dn<=dim;dn++){(function(dn){
    var dow=(first+dn-1)%7,wk=dow===0||dow===6,tdy=(pcM.y===2026&&pcM.m===8&&dn===21);
    var edited=!!SCHED[skey(pcM.y,pcM.m,dn)];
    var d=el('div','dy'+(wk?' off':'')+(tdy?' tdy':'')+(ed&&!wk?' edt':''));
    var nn=el('div','n',String(dn));
    if(edited)nn.innerHTML=dn+' <span class="mcap" style="color:#077A50;font-weight:600">수정됨</span>';
    d.appendChild(nn);
    var sc=schedOf(pcM.y,pcM.m,dn,dow);
    if(sc){
      if(sc.br)d.appendChild(el('div','it br',sc.br));
      if(sc.ex!=null){var b2=el('button','it ex',ROUT[sc.ex].n);b2.type='button';
        b2.addEventListener('click',function(e){e.stopPropagation();showWorkout(ROUT[sc.ex])});d.appendChild(b2)}
      if(sc.mi)d.appendChild(el('div','it mi',sc.mi));
      if(sc.as)d.appendChild(el('div','it as',sc.as));
      if(!sc.br&&sc.ex==null&&!sc.mi&&!sc.as)d.appendChild(el('div','mcap','휴강'));
    }
    if(ed&&!wk)d.addEventListener('click',function(){openDayEdit(pcM.y,pcM.m,dn,dow)});
    g.appendChild(d)})(dn)}};

/* 하루 편성 편집 */
function openDayEdit(y,m,dn,dow){
  var sc=schedOf(y,m,dn,dow)||{br:'',ex:null,mi:'',as:''};
  var b=el('div');b.style.cssText='display:flex;flex-direction:column;gap:13px';
  function sel(id,label,opts,cur){
    return '<div><span class="flab">'+label+'</span><select class="mfld" id="'+id+'" style="width:100%">'
     +'<option value="">없음</option>'
     +opts.map(function(o,i){var v=typeof o==='string'?o:o.n;
       return '<option value="'+i+'"'+((typeof cur==='number'?cur===i:cur===v)?' selected':'')+'>'+esc(v)+'</option>'}).join('')
     +'</select></div>'}
  b.innerHTML='<p class="mcap">'+y+'년 '+m+'월 '+dn+'일 ('+'일월화수목금토'[dow]+') 편성이에요. 비우면 그날은 <b>휴강</b>이 돼요.</p>'
   +sel('sd-br','두뇌훈련',BRAIN,sc.br)+sel('sd-ex','운동',ROUT,sc.ex)
   +sel('sd-mi','마음다루기',MIND,sc.mi)+sel('sd-as','검사측정',ASMT,sc.as)
   +'<label class="chk"><input type="checkbox" id="sd-rep" style="accent-color:#13BD7E;width:15px;height:15px">'
   +'<span>이후 같은 요일에도 똑같이 적용 <span class="mcap">(12주치를 하나씩 고치지 않아도 돼요)</span></span></label>';
  var mo=modalBox(m+'월 '+dn+'일 편성',b);
  var f=mo.querySelector('.mfoot');f.innerHTML='<button class="mb" data-close>취소</button>';
  var rs=el('button','mb','기본값으로');
  rs.addEventListener('click',function(){delete SCHED[skey(y,m,dn)];closeAll();V.sched();toast('기본 편성으로 되돌렸어요')});
  f.appendChild(rs);
  var ok=el('button','mb mbp','저장');
  ok.addEventListener('click',function(){
    var v=function(id){var x=$('#'+id).value;return x===''?null:+x};
    var nb=v('sd-br'),ne=v('sd-ex'),nm=v('sd-mi'),na=v('sd-as');
    var rec={br:nb==null?'':BRAIN[nb],ex:ne,mi:nm==null?'':MIND[nm],as:na==null?'':ASMT[na]};
    SCHED[skey(y,m,dn)]=rec;
    var n=1;
    if($('#sd-rep').checked){
      var d=new Date(y,m-1,dn);
      for(var i=0;i<12;i++){d.setDate(d.getDate()+7);
        SCHED[skey(d.getFullYear(),d.getMonth()+1,d.getDate())]={br:rec.br,ex:rec.ex,mi:rec.mi,as:rec.as};n++}}
    addAudit('일정 변경',m+'/'+dn+(n>1?' 외 '+(n-1)+'일':''),'프로그램 편성 조정');
    closeAll();V.sched();
    toast(n>1?n+'일 편성을 바꿨어요':m+'월 '+dn+'일 편성을 바꿨어요','ok','실행 취소',null)});
  f.appendChild(ok)}

/* 템플릿 — 12주치를 한 번에. 60일을 하나씩 고칠 사람은 없다. */
function openTemplate(){
  var b=el('div');b.style.cssText='display:flex;flex-direction:column;gap:13px';
  b.innerHTML='<p class="mcap">원메딕스가 만든 편성표예요. 적용하면 <b>이번 달부터 12주치</b>가 한 번에 깔려요. '
   +'적용 후에도 날짜별로 고칠 수 있어요.</p>'
   +'<div><span class="flab">템플릿</span><select class="mfld" id="tp-s" style="width:100%">'
   +'<option>치매예방 표준 12주 (주 5일)</option><option>경증 인지저하 12주 (주 3일)</option>'
   +'<option>경로당 상시형 (주 2일 · 종료 없음)</option></select></div>'
   +note('이미 손으로 고친 날은 <b>덮어쓰지 않아요.</b> 템플릿은 비어 있는 날만 채워요.','in');
  var mo=modalBox('템플릿 적용',b);
  var f=mo.querySelector('.mfoot');f.innerHTML='<button class="mb" data-close>취소</button>';
  var ok=el('button','mb mbp','적용');
  ok.addEventListener('click',function(){
    addAudit('일정 변경','12주 템플릿',$('#tp-s').value);
    closeAll();toast('"'+$('#tp-s').value+'"을 적용했어요. 손으로 고친 날은 그대로 뒀어요','ok')});
  f.appendChild(ok)}
function showWorkout(rt){
  $('#wo-t').firstChild.textContent='세부 운동 · '+rt.n;
  $('#wo-b').innerHTML=kpi([['부위',rt.area,''],['난이도',rt.lv,''],['구성',rt.mv.length+'개 동작','약 '+rt.mv.length*2+'분']])
   +'<div class="mc" style="overflow:hidden">'+rt.mv.map(function(m,i){
     return '<div style="display:flex;gap:11px;padding:11px 16px;align-items:center'+(i?';border-top:1px solid #F2F4F7':'')+'">'
      +'<span style="width:36px;height:36px;border-radius:8px;background:#F2F4F7;flex:none;display:grid;place-items:center;color:#69707C;font-size:11.5px;font-weight:700">'+(i+1)+'</span>'
      +'<span style="min-width:0"><b style="font-size:13.5px;font-weight:600">'+esc(m[0])+'</b><span class="mcap" style="display:block">영상 '+(101+i)+' · 실사 시연</span></span>'
      +'<span class="mcap mt" style="margin-left:auto;color:#475467">'+esc(m[1])+'</span></div>'}).join('')+'</div>'
   +note('<b>운동 방법</b><br>'+esc(rt.how),'in')
   +'<p class="mcap" style="margin:0">참여자 앱에서는 동작마다 재활 전문가 시연 영상이 재생되고, 동작 단위로 완료가 기록돼요.</p>';
  open('m-workout')}

/* ══════ 챌린지 ══════ */
var qSort={key:'n',dir:1},qFil=[],cQ=null,qdPager=mkPager(function(){V.questdetail()}),qdq='';
/* ══════ 소속 프로그램 그룹 ══════
   그룹은 계층이다 — 남동구 경로당 > 구월동 경로당 > 걷기 챌린지.
   만드는 건 슈퍼(Own). 채널은 담당자 확인과 운영(Operate)만 한다. */
V.groups=function(){
  var h=$('#v-groups');
  var mine=groupTree(GROUPS.filter(function(g){return g.ch===CH_SELF}));
  h.innerHTML=ph('소속 프로그램 그룹','참여자를 묶는 단위예요. 큰 단위 아래로 얼마든지 나눠져요.')
   +note('<b>승인은 이 그룹에 넣는 스위치예요.</b> 소속되면 그룹 프로그램이 앱에 보이고, 어디에도 안 속하면 <b>미그룹</b>으로 기본 화면이 보여요.','in')
   +note('그룹을 만드는 건 원메딕스가 해요. 채널은 담당자 지정과 운영을 맡아요. 새 그룹이 필요하면 <b>운영팀 문의</b>로 요청해주세요.')
   +kpi([['진행 중 그룹',fmt(mine.filter(function(g){return g.st==='진행 중'&&!g.ghost}).length),'개'],
         ['신청 접수 중',fmt(mine.filter(function(g){return g.st==='신청 접수 중'}).length),'개'],
         ['담당자 없는 그룹',fmt(M.noOwnerGroup()),'개','지정이 필요해요','cr'],
         ['미그룹 참여자',fmt(133),'명','아직 어느 그룹에도 안 속해요','wa']])
   +'<div class="mc" style="overflow:hidden">'
   +'<div class="scroll"><table class="mtb"><thead><tr>'
   +'<th style="padding-left:20px">그룹</th><th>유형</th><th>시작 기준</th><th>주관리자</th><th>부관리자</th>'
   +'<th class="num">대상자</th><th class="num">이번 달 활동</th><th style="padding-right:20px">상태</th>'
   +'</tr></thead><tbody id="g-tb"></tbody></table></div></div>';
  var tb=$('#g-tb');tb.innerHTML='';
  mine.forEach(function(g){
    var on=g.id===getGroup(),d=groupDepth(g);
    var tr=el('tr','clk'+(on?' sel':''));
    tr.innerHTML='<td style="padding-left:'+(20+d*22)+'px">'
      +(d?'<span style="color:#D0D5DD;margin-right:6px">└</span>':'')
      +'<b'+(g.ghost?' style="color:#667085"':'')+'>'+esc(g.name)+'</b>'
      +(on?' <span class="mpill" style="background:#E7F9F1;color:#065C3D">보는 중</span>':'')
      +'<div class="mcap">'+g.sites.join(' · ')+'</div></td>'
     +'<td>'+(g.ghost?'<span style="color:#69707C">—</span>':pill(KIND[g.kind][0],g.kind==='fixed'?'nu':'in'))+'</td>'
     +'<td class="mt" style="color:#475467">'+g.anchor+'<div class="mcap">'+g.start+'</div></td>'
     +'<td>'+(g.owner?'<b style="font-weight:600">'+esc(g.owner)+'</b>'
        :(g.ghost?'<span style="color:#69707C">—</span>':pill('미지정','cr')))+'</td>'
     +'<td class="mt" style="color:#475467">'+(g.subs&&g.subs.length?g.subs.join(', ')
        :'<span style="color:#69707C">없음</span>')+'</td>'
     +'<td class="num mt">'+(g.n?fmt(g.n):'—')+'</td>'
     +'<td class="num mt">'+(g.active?fmt(g.active):'—')+'</td>'
     +'<td style="padding-right:20px">'+pill(g.st,g.k)+'</td>';
    if(!g.ghost)tr.addEventListener('click',function(){putGroup(g.id);V.groups();
      toast(g.name+'(으)로 바꿨어요. 참여자·활동·리포트가 이 그룹 기준이에요')});
    tb.appendChild(tr)});
  h.insertAdjacentHTML('beforeend',
    note('<b>기수형은 중간 합류에 약해요.</b> 3기 실측으로 개강 첫 주 시작자는 12주 뒤 <b>'+(A.retainAt(12,function(k){return k===0}).rate||0).toFixed(1)+'%</b> 남는데 '
     +'한 주만 늦으면 <b>'+(A.retainAt(12,function(k){return k===1}).rate||0).toFixed(1)+'%</b>예요. 중간 합류가 잦은 경로당은 <b>상시형</b>이 맞아요 — 각자 등록일이 1일차라서요.','wa'))};

/* ══════ 내 채널 정보 ══════
   화면에 흩어져 있던 하드코딩을 모은다. 잠긴 항목은 숨기지 않고 이유와 함께 보여준다. */
function lockRow(label,val,why){
  return '<div style="display:flex;gap:12px;align-items:flex-start;padding:11px 0;border-bottom:1px solid #F2F4F7">'
   +'<div style="width:156px;flex:none"><span class="flab" style="margin:0">'+label+'</span></div>'
   +'<div style="flex:1"><div style="color:#475467">'+val+'</div>'
   +'<div class="mcap" style="margin-top:2px">'+why+'</div></div>'
   +'<span class="mpill" style="background:#F2F4F7;color:#667085;flex:none">🔒 원메딕스</span></div>'}
function fld(id,v){return '<input class="mfld" id="'+id+'" value="'+esc(v)+'" style="width:100%">'}
V.settings=function(){
  var h=$('#v-settings'),L=CFG.locked;
  h.innerHTML=ph('내 채널 정보','이 채널의 기본값이에요. 리포트 공문과 화면 판정에 바로 반영돼요.',
    '<button class="mb" id="st-req">변경 요청</button><button class="mb mbp" id="st-save">저장</button>')
   +note('🔒 표시된 항목은 계약·법정·시스템 제약이라 채널에서 바꿀 수 없어요. 바꿔야 하면 <b>운영팀 문의</b>로 보내주세요.','in')
   +'<div class="mc">'+chead('기본 정보')+'<div style="padding:4px 20px 18px">'
     +'<div class="kvform"><label for="st-name">기관명</label><div>'+fld('st-name',CFG.name)+'</div>'
     +'<label>채널 ID</label><div class="mcap mt" style="padding-top:9px">'+CFG.key+'</div></div>'
     +lockRow('계약 기간',L.contract,'계약서 기준이라 원메딕스가 관리해요. 종료 30일 전에 안내가 가요.')+'</div></div>'
   +'<div class="mc">'+chead('보고 서식')
     +'<div class="mcap" style="padding:0 20px 10px">월간 리포트 공문 머리말에 그대로 들어가요.</div>'
     +'<div style="padding:0 20px 18px"><div class="kvform">'
     +'<label for="st-recv">수신 기관</label><div>'+fld('st-recv',CFG.recvOrg)+'</div>'
     +'<label for="st-recvt">수신 직위</label><div>'+fld('st-recvt',CFG.recvTitle)+'</div>'
     +'<label for="st-send">발신 명의</label><div>'+fld('st-send',CFG.sendOrg)+'</div>'
     +'<label for="st-writer">작성자</label><div>'+fld('st-writer',CFG.writer)+'</div>'
     +'<label for="st-doc">문서번호</label><div>'+fld('st-doc',CFG.docNo)
       +'<div class="mcap" style="margin-top:5px">{YYYY} 연도 · {NNN} 일련번호. 다음 번호는 <b>'
       +CFG.docNo.replace('{YYYY}','2026').replace('{NNN}','014')+'</b>예요.</div></div>'
     +'</div></div></div>'
   +'<div class="mc">'+chead('활동 판정 기준')
     +'<div class="mcap" style="padding:0 20px 10px">여기 숫자를 바꾸면 오늘·참여자·활동 현황이 <b>같이</b> 바뀌어요. 지표를 한 곳에서 계산하니까요.</div>'
     +'<div style="padding:0 20px 8px"><div class="kvform">'
     +'<label for="st-warn">경고 기준</label><div style="display:flex;gap:8px;align-items:center">'
       +'<input class="mfld" id="st-warn" type="number" min="1" max="60" value="'+CFG.warn+'" style="width:88px"> 일 이상 무활동</div>'
     +'<label for="st-risk">위험 기준</label><div style="display:flex;gap:8px;align-items:center">'
       +'<input class="mfld" id="st-risk" type="number" min="2" max="90" value="'+CFG.risk+'" style="width:88px"> 일 이상 무활동</div>'
     +'<label>과거 판정</label><div id="st-kind" style="display:flex;gap:8px">'
       +'<button class="mb" data-k="policy" style="flex:1;height:auto;padding:10px;text-align:left;display:block">'
       +'<b>그대로 둔다</b><div class="mcap">정책 변경 · 오늘부터 적용</div></button>'
       +'<button class="mb" data-k="fix" style="flex:1;height:auto;padding:10px;text-align:left;display:block">'
       +'<b>다시 판정한다</b><div class="mcap">오류 정정 · 과거까지 소급</div></button></div>'
     +'</div></div><div style="padding:0 20px 18px" id="st-pv"></div></div>'
   /* 사업 목표 — 사업계획서에 목표가 없어 출발점 값을 넣어 두고 채널이 고친다.
      목표 대비 % 는 활동 현황에서 이 값을 읽어 그린다 */
   +'<div class="mc">'+chead('사업 목표')
     +'<div class="mcap" style="padding:0 20px 10px">사업계획서에 목표값이 없어 <b>출발점으로 잡은 기본값</b>이에요. 3개월 실적을 보고 고치세요. 활동 현황에 목표 대비로 표시돼요.</div>'
     +'<div style="padding:0 20px 18px"><div class="kvform">'
     +A.GOALS.map(function(g){var now=M[g.k]();
       return '<label for="st-g-'+g.k+'">'+g.n+'</label><div><div style="display:flex;gap:8px;align-items:center">'
        +'<input class="mfld" id="st-g-'+g.k+'" type="number" min="1" max="100" value="'+CFG.goals[g.k]+'" style="width:88px"> '+g.u
        +'<span class="mcap" style="margin-left:8px">지금 <b class="mt" style="color:#101828">'+now+g.u+'</b></span></div>'
        +'<div class="mcap" style="margin-top:4px">'+g.d+' — '+g.why+'</div></div>'}).join('')
     +'</div></div></div>'
   +'<div class="mc">'+chead('알림')+'<div style="padding:4px 20px 18px">'
     +'<div class="kvform"><label for="st-pf">푸시 발송 시간</label><div style="display:flex;gap:8px;align-items:center">'
       +'<input class="mfld" id="st-pf" type="number" min="0" max="23" value="'+CFG.pushFrom+'" style="width:76px" aria-label="푸시 발송 시작 시각"> 시 ~ '
       +'<input class="mfld" id="st-pt" type="number" min="1" max="23" value="'+CFG.pushTo+'" style="width:76px" aria-label="푸시 발송 종료 시각"> 시</div></div>'
     +lockRow('자동 로그아웃',L.idleMin+'분 동안 조작이 없으면 접속 차단',
       '개인정보 보호법 안전성 확보조치 기준이에요. 열어둔 원문도 같이 닫혀요.')
     +lockRow('상담 자동 이관',L.escalateDays+'일 무응답 시 운영팀으로 알림',
       '담당자 1명 = 답변 권한 1명 구조라서 생긴 제약이에요. 구조가 바뀌면 열려요.')+'</div></div>'
   +'<div class="mc">'+chead('개인정보')+'<div style="padding:4px 20px 18px">'
     +lockRow('원문 열람 범위','그 참여자 상세를 보는 동안만',
       '목록으로 나가면 다시 가려지고, 나간 시각이 열람 기록에 남아요. 열람 최소화 원칙이라 채널이 늘릴 수 없어요.')
     +lockRow('열람 기록 보관',L.retainYears+'년','민감정보 처리 시스템 기준이에요. 일반 개인정보는 1년이에요.')
     +lockRow('권한 변경 이력 보관',L.permYears+'년','부여·변경·말소 내역은 열람 기록보다 1년 더 보관해요.')
     +lockRow('건강정보 보존기간',L.keepYears+'년','기수 종료 후 '+L.keepYears+'년이 지나면 파기 대상이 돼요. '
       +'<b>리포트용 집계는 남고 개인별 원본만 지워져요.</b>')
     +lockRow('비밀번호 규칙',L.pwMin+'자 이상 · 영문·숫자·기호 중 2종 이상','초대 수락할 때 적용돼요.')
     +lockRow('로그인 실패 잠금',L.failLock+'회 연속 실패 시 '+L.lockMin+'분 잠금 · 자동 해제',
       '맬리 본서비스와 같은 규격이에요. 잠금이 안 풀리면 주관리자나 원메딕스가 풀어줘요.')
     +lockRow('로그인 2단계',' 비밀번호 + 계정 이메일로 받은 인증번호',
       '맬리 본서비스와 같은 방식이에요. 비밀번호만으로는 들어올 수 없어요.')
     +lockRow('열람 기간 제한','한 번 열람에 최근 '+L.viewMonths+'개월까지',
       '열어줬다고 전 기간이 열리면 안 돼요. 그보다 이전 기록이 필요하면 사유를 다시 적고 범위를 넓혀 받아야 해요.')
     +lockRow('건강정보 열람 권한','좌석마다 따로 부여 · 우리 채널 운영자에서 관리',
       '검사 점수·마음기록·증상기록은 민감정보라 역할과 별개예요(법 제23조).')
     +'</div></div>'
   +'<div class="mc">'+chead('연계 정보')+'<div style="padding:4px 20px 18px">'
     +lockRow('제품 구분자',CFG.siteId,
       '맬리 본서비스와 같은 자리의 값이에요. 두 제품의 회원·열람 기록을 한 테이블에 둘 수 있어요.')
     +lockRow('채널 키',CFG.key,'공문·리포트에 찍히는 값이에요.')
     +'</div></div>';
  var kind='policy';
  function paintKind(){$$('#st-kind .mb').forEach(function(x){
    var on=x.dataset.k===kind;x.style.borderColor=on?'#6BDCAF':'#D0D5DD';x.style.background=on?'#E7F9F1':'#fff'})}
  $$('#st-kind .mb').forEach(function(x){x.addEventListener('click',function(){kind=x.dataset.k;paintKind();preview()})});
  function preview(){
    var w=+$('#st-warn').value,r2=+$('#st-risk').value;
    if(!(w>0)||!(r2>w)){$('#st-pv').innerHTML=note('위험 기준은 경고 기준보다 커야 해요.','cr');return}
    var nw=pCount(function(p){return p.days>0&&p.last>w&&p.last<=r2});
    var nr=pCount(function(p){return p.days>0&&p.last>r2});
    var na=pCount(function(p){return p.days>0&&p.last<=w});
    $('#st-pv').innerHTML=note('이 기준으로 바꾸면 — 최근 활동 <b>'+fmt(na)+'명</b> · '
      +A.gapLabel(w)+' <b>'+fmt(nw)+'명</b> · '+A.gapLabel(r2)+' <b>'+fmt(nr)+'명</b>'
      +(kind==='policy'
        ? '<br><b>과거 판정은 그대로 둬요.</b> 이미 제출한 리포트 숫자가 바뀌지 않아요.'
        : '<br><b>과거까지 다시 판정해요.</b> 이미 제출한 리포트의 숫자가 바뀝니다 — 오류 정정일 때만 고르세요.'),
      kind==='fix'?'wa':'')}
  $('#st-warn').addEventListener('input',preview);
  $('#st-risk').addEventListener('input',preview);
  paintKind();preview();
  $('#st-req').addEventListener('click',function(){go('cx')});
  $('#st-save').addEventListener('click',function(){
    var w=+$('#st-warn').value,r2=+$('#st-risk').value;
    if(!(w>0)||!(r2>w)){toast('위험 기준은 경고 기준보다 커야 해요','cr');return}
    CFG.name=$('#st-name').value;CFG.recvOrg=$('#st-recv').value;CFG.recvTitle=$('#st-recvt').value;
    CFG.sendOrg=$('#st-send').value;CFG.writer=$('#st-writer').value;CFG.docNo=$('#st-doc').value;
    var gBad=A.GOALS.filter(function(g){var v=+$('#st-g-'+g.k).value;return !(v>=1&&v<=100)});
    if(gBad.length){toast(gBad[0].n+' 목표는 1~100 사이로 적어주세요','cr');return}
    var gOld=JSON.stringify(CFG.goals);
    A.GOALS.forEach(function(g){CFG.goals[g.k]=+$('#st-g-'+g.k).value});
    if(JSON.stringify(CFG.goals)!==gOld){var gd=new Date();CFG.goalsSet='2026-08-21 '+pad2(gd.getHours())+':'+pad2(gd.getMinutes())+' · '+A.meOp().name}
    if(JSON.stringify(CFG.goals)!==gOld)addAudit('채널 설정 변경','사업 목표',
      A.GOALS.map(function(g){return g.n+' '+CFG.goals[g.k]+g.u}).join(' · '));
    CFG.warn=w;CFG.risk=r2;CFG.pushFrom=+$('#st-pf').value;CFG.pushTo=+$('#st-pt').value;
    pushRule('2026-08-21',w,r2,kind,kind==='policy'?'운영 기준 조정':'판정 오류 정정');
    addAudit('채널 설정 변경','판정 기준 '+w+'/'+r2+'일',
      kind==='policy'?'운영 기준 조정 · 과거 유지':'판정 오류 정정 · 과거 소급');
    toast('저장했어요. '+(kind==='policy'?'과거 판정은 그대로예요':'과거까지 다시 판정했어요'),'ok');
    V.settings()})};

V.quest=function(){
  var h=$('#v-quest');
  h.innerHTML=ph('챌린지','확인만 할 수 있어요. 만들기·수정은 원메딕스 운영팀이 해요.')
   +note('채널관리자는 챌린지를 <b>확인만</b> 할 수 있어요.','nu')
   +'<div class="mc" style="overflow:hidden"><div class="row" style="padding:16px 20px" id="q-f"></div>'
   +'<div class="scroll"><table class="mtb"><thead><tr id="q-th"></tr></thead><tbody id="q-tb"></tbody></table></div></div>';
  var f=$('#q-f');
  [['진행 중',2],['예정',1],['완료',1]].forEach(function(x){
    var b=el('button','mchip'+(qFil.indexOf(x[0])>=0?' on':''),x[0]+' <span class="c mt">'+x[1]+'</span>');
    b.addEventListener('click',function(){var i=qFil.indexOf(x[0]);if(i>=0)qFil.splice(i,1);else qFil.push(x[0]);V.quest()});f.appendChild(b)});
  var th=$('#q-th');
  th.innerHTML=sth('챌린지','n',qSort)+'<th>종류</th><th>기간</th><th>달성 조건</th>'+sth('참여','part',qSort,1)+sth('성공','succ',qSort,1)+sth('성공률','rate',qSort,1)+'<th style="padding-right:20px">상태</th>';
  bindSort(th,qSort,V.quest);
  var list=QUESTS.filter(function(q){return !qFil.length||qFil.indexOf(q.st)>=0});
  list=sortBy(list,qSort,function(q,k){return k==='n'?q.n:k==='rate'?(q.part?q.succ/q.part:0):q[k]||0});
  var tb=$('#q-tb');tb.innerHTML='';
  list.forEach(function(q){
    var tr=el('tr','clk'),r=q.part?q.succ/q.part*100:0;
    var cond=q.ty==='attendance'?'수업일 중 <b>'+q.crit+'일</b> 이상 출석<br><span class="mcap">하루 추천 활동 '+q.per+'개 이상 = 그날 출석</span>'
      :'기간 중 <b>'+q.crit+'일</b> 이상 달성<br><span class="mcap">하루 '+fmt(q.per)+'보 이상 = 그날 달성</span>';
    tr.innerHTML='<td style="padding-left:20px"><span class="lnk">'+q.n+'</span></td><td>'+pill(q.type,'nu')+'</td>'
     +'<td class="mt" style="color:#667085">'+q.s.slice(5)+' – '+q.e.slice(5)+'</td>'
     +'<td style="white-space:normal;max-width:260px;padding:10px 14px;font-size:13px;line-height:1.5">'+cond+'</td>'
     +'<td class="num mt">'+(q.part||'—')+'</td><td class="num mt">'+(q.part?q.succ:'—')+'</td>'
     +'<td class="num mt" style="font-weight:600">'+(q.part?r.toFixed(1)+'%':'—')+'</td>'
     +'<td style="padding-right:20px">'+pill(q.st,q.st==='진행 중'?'ok':q.st==='예정'?'nu':'in')+'</td>';
    tr.addEventListener('click',function(){cQ=q;qdq='';qdPager.page=1;go('questdetail')});tb.appendChild(tr)})};
V.questdetail=function(){
  var q=cQ,h=$('#v-qd');if(!q)return;
  h.innerHTML=ph(q.n,q.s+' ~ '+q.e+' · '+q.type+' 챌린지','<button class="mb" id="qd-b">‹ 목록</button><button class="mb">목록 내려받기</button>')
   +kpi([['달성 조건',q.crit+'일',' 이상'],['하루 기준',q.ty==='attendance'?'활동 '+q.per+'개':fmt(q.per)+'보',''],
         ['참여',q.part||'—',''],['성공',q.succ||'—','',q.part?'ok':''],
         ['성공률',q.part?(q.succ/q.part*100).toFixed(1):'—',q.part?'%':''],['상태',q.st,'']])
   +(q.st==='예정'?'<div class="mc" id="qd-e"></div>':
     '<div class="mc" style="padding:20px"><div class="row"><span class="mh">날짜별 달성 인원</span><span class="mcap" style="margin-left:auto">주말은 회색</span></div><div class="spark" id="qd-sp" style="margin-top:20px"></div></div>'
     +'<div class="mc" style="overflow:hidden"><div class="row" style="padding:16px 20px"><span class="mh">참여자별 달성</span>'
     +'<span style="margin-left:auto">'+search('qdq','이름·전화 뒷자리','220px')+'</span></div>'
     +'<div class="scroll"><table class="mtb"><thead><tr id="qd-th"></tr></thead><tbody id="qd-tb"></tbody></table></div><div class="pager" id="qd-pg"></div></div>');
  $('#qd-b').addEventListener('click',function(){go('quest')});
  if(q.st==='예정'){$('#qd-e').innerHTML=emptyBox('아직 시작하지 않은 챌린지예요',q.s+'부터 참여자 기록이 쌓여요');return}
  var sp=$('#qd-sp');
  for(var d=0;d<q.days;d++){var wk=new Date(2026,q.m-1,d+1).getDay(),isW=wk===0||wk===6;
    var v=isW?20+rnd(d*3)*25:60+rnd(d*3)*70;
    var b=el('i',isW?'wk':'');b.style.height=(v/130*100)+'%';b.title=(d+1)+'일 · '+Math.round(v)+'명';sp.appendChild(b)}
  $('#qdq').value=qdq;
  $('#qdq').addEventListener('input',function(){qdq=this.value;qdPager.page=1;fillQd()});
  $('#qdq-x').addEventListener('click',function(){qdq='';qdPager.page=1;V.questdetail()});
  fillQd();
  function fillQd(){
    $('#qdq-x').style.display=qdq?'flex':'none';
    var base=PEOPLE.filter(function(p){return p.days>0&&(!qdq||p.full.indexOf(qdq)>=0||p.tail.indexOf(qdq)>=0)}).sort(function(a,b){return b.streak-a.streak});
    $('#qd-th').innerHTML='<th class="num" style="padding-left:20px;width:56px">#</th><th>이름</th><th>연락처</th><th>기관</th><th class="num">달성일</th><th class="num">'+(q.ty==='attendance'?'연속':'일평균')+'</th><th style="width:110px">진행</th><th>결과</th><th style="padding-right:20px">완수일</th>';
    var rows=qdPager.slice(base),tb=$('#qd-tb');tb.innerHTML='';
    rows.forEach(function(p){
      var a=achieve(p,q),ok=a.done>=q.crit,pr=Math.min(100,a.done/q.crit*100),rank=base.indexOf(p)+1;
      var tr=el('tr','clk');
      tr.innerHTML='<td class="num mt" style="padding-left:20px;color:#69707C">'+rank+'</td><td><span class="lnk">'+p.name+'</span></td>'
       +'<td class="mt" style="color:#475467">'+p.phone+'</td><td style="color:#475467">'+p.org+'</td>'
       +'<td class="num mt">'+a.done+' / '+q.crit+'</td><td class="num mt">'+(q.ty==='attendance'?p.streak+'일':fmt(p.step)+'보')+'</td>'
       +'<td><span class="bar"><i class="'+(ok?'':'w')+'" style="width:'+pr+'%"></i></span></td>'
       +'<td>'+pill(ok?'성공':'진행 중',ok?'ok':'wa')+'</td><td class="mt" style="color:#667085;padding-right:20px">'+(ok?'07-'+pad2(15+rank%14):'—')+'</td>';
      tr.addEventListener('click',function(){openAchieve(p,q)});tb.appendChild(tr)});
    qdPager.render($('#qd-pg'))}};
A.showWorkout=showWorkout;
})(App);
