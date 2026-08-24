(function(A){
"use strict";
var $=A.$,$$=A.$$,el=A.el,esc=A.esc,fmt=A.fmt,pad2=A.pad2,rnd=A.rnd,pill=A.pill,note=A.note,kpi=A.kpi,cbx=A.cbx,
    brow=A.brow,ph=A.ph,chead=A.chead,emptyBox=A.emptyBox,search=A.search,sth=A.sth,bindSort=A.bindSort,
    sortBy=A.sortBy,mkPager=A.mkPager,toast=A.toast,open=A.open,closeAll=A.closeAll,go=A.go,V=A.V,
    PEOPLE=A.PEOPLE,byId=A.byId,ORGS=A.ORGS,BRAIN=A.BRAIN,MIND=A.MIND,ASMT=A.ASMT,ROUT=A.ROUT,
    QUESTS=A.QUESTS,APPS=A.APPS,AUDIT=A.AUDIT,dayRec=A.dayRec,achieve=A.achieve,addAudit=A.addAudit,
    LT=A.LT,RT=A.RT,openPerson=A.openPerson,openAchieve=A.openAchieve,cnt=A.cnt;

/* ══════ 활동 현황 ══════ */
var sTab='ret';
V.stats=function(){
  var h=$('#v-stats');
  h.innerHTML=ph('활동 현황','기수 전체의 참여와 이탈을 봅니다.','<select class="mfld" aria-label="조회 월"><option>2026년 7월</option><option>2026년 6월</option></select>')
   +'<div class="mc" style="overflow:hidden"><div class="tabs" id="s-tabs"></div><div id="s-b" style="padding:20px"></div></div>';
  var tb=$('#s-tabs');
  [['sum','종합'],['ret','참여 지속'],['pat','활동 패턴'],['cont','콘텐츠'],['ind','개인별'],['def','판정 기준']].forEach(function(x){
    var b=el('button','tab',x[1]);b.setAttribute('aria-selected',sTab===x[0]?'true':'false');
    b.addEventListener('click',function(){sTab=x[0];V.stats()});tb.appendChild(b)});
  A.bindTabs(tb);
  var B=$('#s-b');
  if(sTab==='sum')sumTab(B);else if(sTab==='ret')retTab(B);else if(sTab==='pat')patTab(B);
  else if(sTab==='cont')contTab(B);else if(sTab==='ind')indTab(B);else defTab(B)};
function sumTab(B){
  var ORG=[['남동구보건소',341,148],['만수노인문화센터',198,71],['남동구노인복지관',164,58],['만월종합사회복지관',86,31],['미배정',119,19]];
  B.innerHTML='<div class="gap">'
   +kpi([['대상자','822',''],['참여자','735','','▼ 6'],['활동자','296','','▲ 12','','up'],['누적 중도포기','2',''],
         ['총 활동 수','40,512','','▲ 1,572','','up'],['인당 일평균','4.56','회']])
   +'<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px">'
   +'<div class="mc" style="overflow:hidden">'+chead('기관별 참여')
     +'<div class="scroll"><table class="mtb"><thead><tr><th style="padding-left:20px">기관</th><th class="num">대상</th><th class="num">활동</th><th class="num">활동률</th><th style="width:120px;padding-right:20px"></th></tr></thead><tbody>'
     +ORG.map(function(o){var r=o[2]/o[1]*100;
       return '<tr><td style="padding-left:20px">'+o[0]+'</td><td class="num mt">'+o[1]+'</td><td class="num mt">'+o[2]+'</td><td class="num mt">'+r.toFixed(1)+'%</td>'
       +'<td style="padding-right:20px"><span class="bar"><i class="'+(r>40?'':r>30?'w':'c')+'" style="width:'+r+'%"></i></span></td></tr>'}).join('')
     +'</tbody></table></div></div>'
   +'<div class="mc" style="padding:20px">'+'<span class="mh">참여 강도 분포</span><div style="display:flex;flex-direction:column;gap:11px;margin-top:16px">'
     +brow('0일 (한 번도)',72,'198명','c')+brow('1–4일',100,'275명','c')+brow('5–19일',41,'112명','w')+brow('20–59일',21,'58명')+brow('60일 이상',33,'92명')
     +'</div><p class="mcap" style="margin:24px 0 0;font-size:13px"><b style="color:#101828">473명(64%)이 4일 이하로 하고 멈췄어요.</b> 반대로 92명은 60일 넘게 계속하고 있어요.</p></div></div></div>'}
function retTab(B){
  var COH=[['개강 첫 주','3/3~','140명',[76.4,78.6,75.7,67.1,67.1]],['2주차','3/10~','58명',[48.3,41.4,27.6,24.1,22.4]],
   ['8주차','4/21~','30명',[33.3,30.0,26.7,26.7,13.3]],['9주차','4/28~','22명',[63.6,45.5,59.1,45.5,22.7]]];
  function hc(v){var c=v>=60?['#ECFDF3','#067647']:v>=30?['#FFFAEB','#B54708']:['#FEF3F2','#B42318'];
    return '<td style="text-align:center"><span style="display:block;margin:4px 0;padding:8px 0;border-radius:6px;background:'+c[0]+';color:'+c[1]+';font-weight:700;font-variant-numeric:tabular-nums">'+v.toFixed(1)+'%</span></td>'}
  var SIG=[['7일 연속 무활동','184','71%','#B42318'],['수행률 20% 미만 2주 지속','101','64%','#B42318'],
   ['진입만 하고 중단 3회 이상','57','48%','#B54708'],['앱 구버전 3개월 이상 사용','32','44%','#B54708']];
  B.innerHTML='<div class="gap">'
   +kpi([['개강 첫 주 시작 → 12주 후','67.1','%','140명 중 94명이 남았어요','ok'],
         ['2주차 이후 시작 → 12주 후','22.4','%','58명 중 13명만 남았어요','cr'],
         ['첫 주 재방문 (D+7)','49.5','%','238 / 481명'],['한 달 후 (D+30)','40.2','%','182 / 453명']])
   +note('<b>가장 중요한 발견이에요.</b> 개강 첫 주에 시작한 분은 12주 뒤에도 67%가 남아 있는데, 한 주만 늦게 시작하면 22%로 떨어져요. <b>3배 차이</b>예요. 개강 첫 주 온보딩에 힘을 쏟는 게 다른 어떤 개선보다 효과가 커요.','wa')
   +'<div class="mc" style="overflow:hidden">'+chead('언제 시작했느냐에 따른 잔존율','<span class="mcap">첫 활동 주 기준 · 그 주에 1회라도 활동</span>')
     +'<div class="scroll"><table class="mtb"><thead><tr><th style="padding-left:20px">시작 시점</th><th class="num">인원</th>'
     +['1주 후','2주 후','4주 후','8주 후','12주 후'].map(function(x){return '<th style="text-align:center">'+x+'</th>'}).join('')+'</tr></thead><tbody>'
     +COH.map(function(c){return '<tr><td style="padding-left:20px;font-weight:600">'+c[0]+' <span class="mt" style="color:#69707C;font-size:12px;font-weight:400">'+c[1]+'</span></td>'
       +'<td class="num mt" style="color:#667085">'+c[2]+'</td>'+c[3].map(hc).join('')+'</tr>'}).join('')+'</tbody></table></div></div>'
   +'<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px">'
   +'<div class="mc" style="padding:20px"><span class="mh">이탈 직전 콘텐츠</span><div style="display:flex;flex-direction:column;gap:11px;margin-top:16px">'
     +brow('두뇌훈련',100,'361명','c')+brow('운동',37,'135명','w')+brow('마음다루기',18,'64명')+brow('검사측정',6,'23명','w')+'</div>'
     +'<p class="mcap" style="margin:24px 0 0;font-size:13px">두뇌훈련을 마지막으로 떠난 분이 가장 많지만, 전체 활동의 절반이라 노출량 대비로는 평균 수준이에요. 상대적으로 위험한 건 검사예요.</p></div>'
   +'<div class="mc" style="overflow:hidden">'+chead('이탈 전조 신호','<span class="mcap">자동 감지</span>')
     +'<div class="scroll"><table class="mtb"><thead><tr><th style="padding-left:20px">신호</th><th class="num">해당</th><th class="num" style="padding-right:20px">2주 내 이탈률</th></tr></thead><tbody>'
     +SIG.map(function(s){return '<tr><td style="padding-left:20px">'+s[0]+'</td><td class="num mt" style="color:#475467">'+s[1]+'</td><td class="num mt" style="padding-right:20px;font-weight:700;color:'+s[3]+'">'+s[2]+'</td></tr>'}).join('')
     +'</tbody></table></div><p class="mcap" style="padding:14px 20px">이 신호에 걸린 분은 <b style="color:#475467">오늘</b> 화면에 자동으로 올라와요.</p></div></div></div>'}
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
      tr.addEventListener('click',function(){openPerson(p,'stats')});tb.appendChild(tr)});
    iPager.render($('#i-pg'))}
  fill()}
function defTab(B){
  var D=[['대상자 수','기수에 배정된 전원','audienceCount'],['참여자 수','해당 월 참여 상태 유지자','participantCount'],
   ['활동자 수','해당 월 1회 이상 활동','activistCount'],['누적 중도포기','참여 상태 = 종료(T)','abandonerCount'],
   ['수행률','추천받은 활동 중 수행 비율','활동수 ÷ 추천수'],['랭킹 점수','월 단위 총점 (최대 1000)','600×(활동÷추천) + 400×(연속일÷추천일)'],
   ['N (오늘 수행)','오늘 수행한 활동 수','todayActivityCount'],['PIN','전화 응대용 조회번호','vocNumber'],
   ['무활동 판정','마지막 활동 이후 경과일','7일 주의 / 14일 위험']]
   /* 검사 등급은 손으로 적지 않고 TESTS에서 뽑아 쓴다. 표와 실제 판정이 어긋날 수 없게 하기 위함. */
   .concat(A.TESTS.map(function(t){
     var seen={},bands=[],prev=0;
     for(var sc=0;sc<=t.max;sc++){
       var l=t.lv(sc)[0];
       if(l!==seen.l){if(seen.l)bands.push(seen.l+' '+prev+'–'+(sc-1));seen={l:l};prev=sc}}
     bands.push(seen.l+' '+prev+'–'+t.max);
     return [t.n,t.items+'문항 · 0–'+t.max+'점',bands.join(' / ')]}));
  B.innerHTML='<div class="gap">'
   +note('화면의 숫자가 무엇을 세는지 정의해요. 보건소 제출 수치와 대조할 때 정의부터 맞추면 차이가 사라져요.','in')
   +'<div class="mc" style="overflow:hidden"><div class="scroll"><table class="mtb"><thead><tr><th style="padding-left:20px">지표</th><th>세는 대상</th><th style="padding-right:20px">계산식</th></tr></thead><tbody>'
   +D.map(function(d){return '<tr><td style="padding-left:20px;font-weight:600">'+d[0]+'</td><td style="color:#475467">'+d[1]+'</td><td class="mt" style="color:#667085;padding-right:20px;font-size:12.5px">'+d[2]+'</td></tr>'}).join('')
   +'</tbody></table></div></div>'
   +note('검사 등급은 이 표와 실제 판정이 <b>같은 값에서 나와요.</b> 표만 고치고 판정이 안 바뀌는 일은 생기지 않아요.','ok')
   +note('<b>확인이 필요한 항목 — 운영팀 회신 대기 중</b><br>· 노력 점수는 계산되지만 랭킹 총점에 반영되지 않아요.<br>· 음주(AUDIT-K)는 아직 검사 목록에 없어요.<br>· 터그테스트는 점수가 전송되지 않아 등급 산출이 안 돼요.','cr')+'</div>'}

/* ══════ 상담실 ══════ */
var ROOMS=[{n:'황*학',st:'unans',t:'3일',last:'걸음 수가 안 올라가요',mine:1,msgs:[['them','걸음 수가 안 올라가요','오전 7:12','08-11']]},
 {n:'정*순',st:'unans',t:'1일',last:'글씨를 더 크게 못하나요',mine:1,msgs:[['them','글씨를 더 크게 못하나요','오전 6:41','08-13']]},
 {n:'이*희',st:'ops',t:'4시간',last:'앱이 자꾸 꺼집니다',mine:0,msgs:[['them','앱이 자꾸 꺼집니다','오전 8:02','08-14'],['me','확인 중입니다. 잠시만 기다려주세요.','오전 9:15','08-14']]},
 {n:'최*옥',st:'open',t:'2시간',last:'감사합니다 잘 쓰고 있어요',mine:1,msgs:[['me','오늘부터 29일까지 활동 7일 이상 하신 분께 선물을 드려요!','오전 8:57','08-13'],['them','감사합니다 잘 쓰고 있어요','오전 11:20','08-14']]},
 {n:'김*자',st:'open',t:'1일',last:'네 알겠습니다',mine:1,msgs:[['them','비밀번호를 잊어버렸어요','오전 7:30','08-12'],['me','앱에서 전화번호로 다시 로그인하시면 돼요.','오전 9:10','08-12'],['them','네 알겠습니다','오전 6:55','08-13']]},
 {n:'박*수',st:'empty',t:'—',last:'',mine:1,msgs:[]}];
var cScope='MINE',cFilter=[],cRoom=null;
V.consult=function(){
  var h=$('#v-consult');
  h.innerHTML=ph('상담실','참여자 한 명당 방이 하나씩 자동으로 만들어져요.','<button class="mb mbp" id="c-bc">단체 공지 보내기</button>')
   +kpi([['답변을 기다려요','4','건','가장 오래된 건 3일째','cr'],['내 상담실','621','개','전체 625개 중'],
         ['운영팀이 맡은 방','4','개',''],['이번 달 응답','28','건','평균 5.2시간 안에 답했어요','','up']])
   +note('상담방은 참여자 한 명당 하나씩 자동으로 만들어져요(현재 625개). 이 중 <b>222개는 아직 대화가 없어요.</b> 개별 문의는 드물고 실제로는 단체 공지함으로 쓰이고 있어요.','in')
   +'<div class="mc" style="overflow:hidden"><div class="row" style="padding:16px 20px" id="c-f"></div>'
   +'<div class="chat"><div class="rooms" id="c-rooms"></div><div class="thr"><div class="msgs" id="c-msgs"></div><div id="c-comp"></div></div><div class="cpn" id="c-pn"></div></div></div>'
   +note('<b>지금 시스템의 제약이에요.</b> 답변 입력창은 그 방의 담당자로 지정된 사람에게만 나타나요. 담당자 1명 = 답변 권한 1명 구조라 주무관 1차 / 운영팀 2차 응대가 아직 안 돼요.','cr');
  $('#c-bc').addEventListener('click',function(){go('pushnew')});
  var f=$('#c-f');
  [['내 상담실','MINE',621],['전체 상담실','ALL',625]].forEach(function(x){
    var b=el('button','mchip'+(cScope===x[1]?' on':''),x[0]+' <span class="c mt">'+x[2]+'</span>');
    b.addEventListener('click',function(){cScope=x[1];cRoom=null;V.consult()});f.appendChild(b)});
  f.appendChild(el('span','sep'));
  [['미답변','unans',2],['진행 중','open',12],['운영팀 담당','ops',4],['대화 없음','empty',222]].forEach(function(x){
    var b=el('button','mchip'+(cFilter.indexOf(x[1])>=0?' on':''),x[0]+' <span class="c mt">'+x[2]+'</span>');
    b.addEventListener('click',function(){var i=cFilter.indexOf(x[1]);if(i>=0)cFilter.splice(i,1);else cFilter.push(x[1]);V.consult()});f.appendChild(b)});
  var list=ROOMS.filter(function(r){
    if(cScope==='MINE'&&!r.mine)return false;
    if(cFilter.length&&cFilter.indexOf(r.st)<0)return false;return true});
  var rl=$('#c-rooms');rl.innerHTML='';
  if(!list.length){rl.innerHTML=emptyBox('해당하는 상담실이 없어요','');thread(null);return}
  if(!cRoom||list.indexOf(cRoom)<0)cRoom=list[0];
  list.forEach(function(r){
    var b=el('button','room');
    var pl=r.st==='unans'?pill('미답변','cr'):r.st==='ops'?pill('운영팀','in'):r.st==='empty'?pill('대화 없음','nu'):pill('진행','ok');
    b.innerHTML='<span class="r1">'+r.n+' '+pl+'<span class="t">'+r.t+'</span></span><span class="r2">'+(r.last||'아직 대화가 없어요')+'</span>';
    b.setAttribute('aria-selected',cRoom===r?'true':'false');
    b.setAttribute('role','option');b.type='button';
    b.addEventListener('click',function(){cRoom=r;V.consult()});rl.appendChild(b)});
  rl.setAttribute('role','listbox');rl.setAttribute('aria-label','상담 목록');
  thread(cRoom)};
function thread(r){
  var m=$('#c-msgs'),c=$('#c-comp'),p=$('#c-pn');
  if(!r){m.innerHTML='';c.innerHTML='';p.innerHTML='';return}
  m.innerHTML='';
  if(!r.msgs.length)m.innerHTML=emptyBox('아직 대화가 없어요','참여자가 가입할 때 자동으로 만들어진 방이에요');
  else{var day='';r.msgs.forEach(function(x){
    if(x[3]!==day){day=x[3];m.appendChild(el('span','mday','2026년 '+day.replace('-','월 ')+'일'))}
    m.appendChild(el('div','msg '+(x[0]==='me'?'me':'them'),esc(x[1])+'<div class="mt2">'+x[2]+'</div>'))})}
  if(r.mine){c.className='comp';c.innerHTML='<textarea placeholder="답변을 입력하고 Enter로 보내요"></textarea><button class="mb mbp" style="height:40px" id="c-send">보내기</button>';
    $('#c-send').addEventListener('click',function(){
      var ta=c.querySelector('textarea');if(!ta.value.trim())return;
      r.msgs.push(['me',ta.value.trim(),'오후 2:30','08-21']);r.last=ta.value.trim();r.st='open';r.t='방금';
      ta.value='';V.consult();toast('답변을 보냈어요','ok')})}
  else{c.className='';c.innerHTML='<div style="padding:14px;background:#F9FAFB;border-top:1px solid #EAECF0;display:flex;gap:10px;align-items:center">'
    +'<span class="mcap">이 상담실은 <b style="color:#475467">원메딕스 운영팀</b>이 담당하고 있어 답변할 수 없어요.</span>'
    +'<button class="mb mbs" style="margin-left:auto;flex:none" id="c-take">담당 가져오기</button></div>';
    $('#c-take').addEventListener('click',function(){r.mine=1;r.st='open';V.consult();toast('담당을 가져왔어요','ok','되돌리기',function(){r.mine=0;r.st='ops';V.consult()})})}
  p.innerHTML='<div><div class="mcap" style="margin-bottom:8px">참여자</div><div style="font-size:15px;font-weight:700">'+r.n+'</div>'
   +'<div class="mt mcap" style="margin-top:3px">010-****-2727</div><div class="mcap">만수노인문화센터 · 14일 무활동</div>'
   +'<button class="mb mbs" style="margin-top:10px" id="c-op">참여자 상세 열기</button></div>'
   +'<div style="border-top:1px solid #F2F4F7;padding-top:14px"><div class="mcap" style="margin-bottom:6px">담당</div>'
   +'<div style="font-size:13.5px;font-weight:600">'+(r.mine?'김주무 (채널)':'이운영 (원메딕스)')+'</div>'
   +'<button class="mb mbs" style="margin-top:9px;width:100%" id="c-mv">'+(r.mine?'운영팀으로 이관':'담당 가져오기')+'</button></div>'
   +note('3일 넘게 답변이 없으면 운영팀에 자동으로 알림이 가요.','nu');
  $('#c-op').addEventListener('click',function(){openPerson(PEOPLE[11],'consult')});
  $('#c-mv').addEventListener('click',function(){var was=r.mine;r.mine=r.mine?0:1;r.st=r.mine?'open':'ops';V.consult();
    toast(was?'운영팀으로 이관했어요':'담당을 가져왔어요','ok','되돌리기',function(){r.mine=was;r.st=was?'open':'ops';V.consult()})})}

/* ══════ 프로그램 일정 ══════ */
var pcM={y:2026,m:8};
V.sched=function(){
  var h=$('#v-sched');
  h.innerHTML=ph('프로그램 일정','확인만 할 수 있어요. 바꿔야 하면 변경 요청을 보내주세요.','<button class="mb" data-modal="m-schedreq">일정 변경 요청</button>')
   +note('채널관리자는 일정을 <b>확인만</b> 할 수 있어요. 변경 요청과 처리 결과는 기록에 남아요.','nu')
   +'<div class="mc" style="padding:20px"><div class="row" style="margin-bottom:16px">'
     +'<button type="button" class="pgn" id="sc-p" aria-label="이전 달">'+LT+'</button><span class="mh mt" style="min-width:116px;text-align:center">'+pcM.y+'년 '+pcM.m+'월</span>'
     +'<button type="button" class="pgn" id="sc-n" aria-label="다음 달">'+RT+'</button><button class="mb mbs" id="sc-t">오늘</button>'
     +'<span class="lgd" style="margin-left:auto"><span><b style="background:#E7F9F1"></b>두뇌훈련</span>'
     +'<span><b style="background:#EFF8FF"></b>운동 <span style="color:#175CD3">눌러서 동작 보기</span></span>'
     +'<span><b style="background:#FFFAEB"></b>마음다루기</span><span><b style="background:#F4F3FF"></b>검사측정</span></span></div>'
     +'<div class="pcal" id="pc"></div></div>';
  $('#sc-p').addEventListener('click',function(){pcM.m--;if(pcM.m<1){pcM.m=12;pcM.y--}V.sched()});
  $('#sc-n').addEventListener('click',function(){pcM.m++;if(pcM.m>12){pcM.m=1;pcM.y++}V.sched()});
  $('#sc-t').addEventListener('click',function(){pcM={y:2026,m:8};V.sched()});
  var g=$('#pc');
  ['일','월','화','수','목','금','토'].forEach(function(d,ix){g.appendChild(el('div','dh'+(ix===0?' s':ix===6?' t':''),d))});
  var first=new Date(pcM.y,pcM.m-1,1).getDay(),dim=new Date(pcM.y,pcM.m,0).getDate();
  for(var k=0;k<first;k++)g.appendChild(el('div','dy off'));
  for(var dn=1;dn<=dim;dn++){(function(dn){
    var dow=(first+dn-1)%7,wk=dow===0||dow===6,tdy=(pcM.y===2026&&pcM.m===8&&dn===21);
    var d=el('div','dy'+(wk?' off':'')+(tdy?' tdy':''));
    d.appendChild(el('div','n',String(dn)));
    if(!wk){var s=dn*3+pcM.m;
      d.appendChild(el('div','it br',BRAIN[s%BRAIN.length]));
      var ri=s%ROUT.length,b=el('button','it ex',ROUT[ri].n);
      b.addEventListener('click',function(){showWorkout(ROUT[ri])});d.appendChild(b);
      d.appendChild(el('div','it mi',MIND[s%MIND.length]));
      if(dn%9===3)d.appendChild(el('div','it as',ASMT[s%ASMT.length]))}
    g.appendChild(d)})(dn)}};
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
