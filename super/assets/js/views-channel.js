/* 운영 현황 / 채널 관리 / 채널 상세 / 기수 관리 */
(function(A){
"use strict";
var $=A.$,$$=A.$$,el=A.el,esc=A.esc,fmt=A.fmt,pill=A.pill,note=A.note,kpi=A.kpi,cbx=A.cbx,brow=A.brow,
    ph=A.ph,chead=A.chead,search=A.search,sth=A.sth,bindSort=A.bindSort,sortBy=A.sortBy,
    mkPager=A.mkPager,toast=A.toast,open=A.open,closeAll=A.closeAll,go=A.go,V=A.V,
    CHANNELS=A.CHANNELS,CH_ST=A.CH_ST,byCh=A.byCh,COHORTS=A.COHORTS,CO_ST=A.CO_ST,
    TICKETS=A.TICKETS,ALERTS=A.ALERTS,CHALLENGES=A.CHALLENGES;

function chName(id){var c=byCh[id];return c?c.n:id}
function chChip(id){var c=byCh[id];return '<span class="chip-ch">'+esc(c?c.n.replace(' 치매안심센터',''):id)+'</span>'}
A.chChip=chChip;A.chName=chName;

/* ══════ 운영 현황 ══════ */
V.home=function(){
  var t=A.totals(),h=$('#v-home');
  var openTk=TICKETS.filter(function(x){return x.st!=='done'}).length;
  var openAl=ALERTS.filter(function(x){return x.st==='open'}).length;
  var review=CHALLENGES.filter(function(x){return x.st==='review'}).length;
  var worst=CHANNELS.filter(function(c){return c.st==='run'}).slice().sort(function(a,b){return b.drop-a.drop})[0];

  h.innerHTML=ph('운영 현황','2026년 8월 24일 월요일 · 전 채널 통합',
     '<button class="mb" type="button" data-go="cs">CS 큐 열기</button><button class="mb mbp" type="button" data-go="pushnew">전 채널 발송</button>')
   +kpi([['운영 채널',String(t.run),'개','전체 '+t.ch+'개 중'],
         ['전 채널 대상자',fmt(t.people),'명','앱 설치 '+fmt(t.app)+'명'],
         ['앱 설치율',Math.round(t.app/t.people*100)+'%','','미설치 '+fmt(t.people-t.app)+'명','wa'],
         ['답변 대기 CS',String(openTk),'건','가장 오래된 건 15일째','cr'],
         ['이상 열람',String(openAl),'건','확인이 필요해요','cr'],
         ['챌린지 검수',String(review),'건','9월 출석 챌린지','cr']])
   +'<div class="mc"><div style="padding:16px 20px 12px"><h2 class="mh">처리할 일</h2></div><div id="h-todo"></div></div>'
   +'<div style="display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:16px">'
   +'<div class="mc" style="overflow:hidden">'+chead('채널별 현황','<span class="mcap">중도포기율 높은 순</span>')
     +'<div class="scroll"><table class="mtb"><thead><tr><th style="padding-left:20px">기관</th><th>상태</th><th class="num">대상자</th><th class="num">수행률</th><th class="num" style="padding-right:20px">중도포기</th></tr></thead><tbody id="h-ch"></tbody></table></div></div>'
   +'<div class="mc" style="padding:20px;display:flex;flex-direction:column;gap:14px">'
     +'<h2 class="mh">기관 간 격차</h2>'
     +'<p class="mcap" style="margin:0">같은 프로그램인데 기관별 수행률이 <b style="color:#101828">39%~71%</b>로 벌어져요. 편성이 아니라 운영 차이일 가능성이 큽니다.</p>'
     +'<div id="h-bars" style="display:flex;flex-direction:column;gap:10px"></div>'
     +'<p class="mcap" style="margin:auto 0 0;padding-top:10px;border-top:1px solid #F2F4F7">'
       +'<b style="color:#B42318">'+esc(worst.n)+'</b>가 중도포기 '+worst.drop+'%로 가장 높아요. '+esc(worst.note||'확인이 필요합니다.')+'</p></div></div>';

  var slaOver=TICKETS.filter(function(x){return x.st!=='done'&&x.aged>2}).length;
  var TD=[['cr','SLA를 넘긴 CS가 '+slaOver+'건이에요','우리 기준은 영업일 2일 내 1차 회신이에요. 가장 오래된 건 15일 지났어요','CS 큐 열기','cs','mbp'],
   ['cr','이상 열람 '+openAl+'건이 확인을 기다려요','시흥시 담당자가 8분 동안 23건을 열람했어요','열람 기록 보기','anomaly',''],
   ['wa','9월 출석 챌린지가 검수 대기예요','9월 1일 시작인데 아직 승인되지 않았어요. 대상 채널 4곳','챌린지 열기','challenges',''],
   ['wa','안산시 단원구에 담당자가 없어요','9월 14일 개소 예정인데 계정 발급 요청이 9일째 대기예요','채널 관리','channels','']];
  var tb=$('#h-todo');
  TD.forEach(function(x,ix){
    var c={cr:['#FEF3F2','#B42318'],wa:['#FFFAEB','#B54708'],ok:['#ECFDF3','#067647']}[x[0]];
    var d=el('div');d.style.cssText='display:flex;align-items:center;gap:12px;padding:'+(ix===TD.length-1?'14px 20px 20px':'14px 20px')+';'+(ix?'border-top:1px solid #F2F4F7':'');
    d.innerHTML='<span aria-hidden="true" style="width:34px;height:34px;flex:none;border-radius:8px;background:'+c[0]+';color:'+c[1]+';display:flex;align-items:center;justify-content:center">'+A.BANG+'</span>'+
     '<span style="min-width:0"><span style="display:block;font-size:13.5px;font-weight:600">'+x[1]+'</span><span class="mcap" style="display:block;margin-top:2px">'+x[2]+'</span></span>'+
     '<button class="mb '+x[5]+'" type="button" data-go="'+x[4]+'" style="margin-left:auto;flex:none">'+x[3]+'</button>';
    tb.appendChild(d)});

  var rows=CHANNELS.slice().sort(function(a,b){return b.drop-a.drop}),cb=$('#h-ch');
  rows.forEach(function(c){
    var tr=el('tr','clk');
    var st=CH_ST[c.st];
    tr.innerHTML='<td style="padding-left:20px"><span class="lnk">'+esc(c.n)+'</span></td>'
     +'<td>'+pill(st[0],st[1])+'</td><td class="num mt">'+(c.people?fmt(c.people):'—')+'</td>'
     +'<td class="num mt">'+(c.rate?c.rate+'%':'—')+'</td>'
     +'<td class="num mt" style="padding-right:20px;color:'+(c.drop>15?'#B42318':c.drop>10?'#B54708':'#475467')+'">'+(c.drop?c.drop+'%':'—')+'</td>';
    tr.addEventListener('click',function(){openCh(c)});cb.appendChild(tr)});

  var bb=$('#h-bars');
  CHANNELS.filter(function(c){return c.st==='run'}).sort(function(a,b){return b.rate-a.rate}).forEach(function(c){
    bb.insertAdjacentHTML('beforeend',brow(esc(c.n.replace(' 치매안심센터','')),c.rate,c.rate+'%',c.rate<45?'c':c.rate<60?'w':'','108px'))})};

/* ══════ 채널 관리 ══════ */
var cFil=[],cSort={key:'drop',dir:-1},cq='';
V.channels=function(){
  var h=$('#v-channels');
  h.innerHTML=ph('채널 관리','기관 등록과 담당자 배정을 여기서 해요. 채널 어드민의 계정은 여기서 나갑니다.',
     '<button class="mb" type="button" data-modal="m-channel-new">채널 등록</button>')
   +'<div class="mc" style="padding:16px 20px;display:flex;flex-direction:column;gap:12px">'
     +'<div class="row">'+search('cq','기관명, 담당자로 찾기','300px')
     +'<span style="margin-left:auto;font-size:13px;color:#667085">조건에 맞는 채널 <b class="mt" style="color:#101828" id="c-cnt">'+CHANNELS.length+'</b>개</span></div>'
     +'<div class="row" id="c-chips"></div></div>'
   +'<div class="mc" style="overflow:hidden"><div class="scroll"><table class="mtb"><thead><tr id="c-th"></tr></thead><tbody id="c-tb"></tbody></table></div>'
     +'<div id="c-empty" style="display:none"></div></div>';
  var CH=[['진행 중','run'],['개소 준비','prep'],['종료','done']];
  var cc=$('#c-chips');
  CH.forEach(function(x){
    var n=CHANNELS.filter(function(c){return c.st===x[1]}).length;
    var b=el('button','mchip'+(cFil.indexOf(x[1])>=0?' on':''),esc(x[0])+' <span class="c mt">'+n+'</span>');
    b.type='button';
    b.addEventListener('click',function(){var i=cFil.indexOf(x[1]);if(i>=0)cFil.splice(i,1);else cFil.push(x[1]);V.channels()});
    cc.appendChild(b)});
  $('#cq').value=cq;
  $('#cq').addEventListener('input',function(){cq=this.value;fill()});
  $('#cq-x').addEventListener('click',function(){cq='';$('#cq').value='';fill()});
  function fill(){
    $('#cq-x').style.display=cq?'flex':'none';
    var list=CHANNELS.filter(function(c){
      if(cFil.length&&cFil.indexOf(c.st)<0)return false;
      if(cq&&c.n.indexOf(cq)<0&&c.mgr.indexOf(cq)<0)return false;
      return true});
    list=sortBy(list,cSort,function(c,k){return k==='n'?c.n:k==='mgr'?c.mgr:c[k]||0});
    var th=$('#c-th');
    th.innerHTML=sth('기관','n',cSort)+'<th>지역</th>'+sth('담당자','mgr',cSort)+'<th>상태</th>'
      +sth('기수','cohort',cSort,1)+sth('대상자','people',cSort,1)+sth('앱 설치','app',cSort,1)
      +sth('수행률','rate',cSort,1)+sth('중도포기','drop',cSort,1)+'<th style="padding-right:20px">비고</th>';
    bindSort(th,cSort,fill);
    var tb=$('#c-tb');tb.innerHTML='';
    $('#c-cnt').textContent=list.length;
    $('#c-empty').innerHTML=list.length?'':A.emptyBox('조건에 맞는 채널이 없어요','필터를 줄여보세요');
    $('#c-empty').style.display=list.length?'none':'block';
    list.forEach(function(c){
      var st=CH_ST[c.st],tr=el('tr','clk');
      tr.innerHTML='<td style="padding-left:20px"><span class="lnk" style="font-weight:600">'+esc(c.n)+'</span></td>'
       +'<td style="color:#475467">'+c.region+'</td>'
       +'<td style="color:'+(c.mgr==='—'?'#B42318':'#475467')+';font-weight:'+(c.mgr==='—'?'600':'400')+'">'+esc(c.mgr)+'</td>'
       +'<td>'+pill(st[0],st[1])+'</td>'
       +'<td class="num mt">'+(c.cohort?c.cohort+'기':'—')+'</td>'
       +'<td class="num mt">'+(c.people?fmt(c.people):'—')+'</td>'
       +'<td class="num mt" style="color:#475467">'+(c.app?fmt(c.app):'—')+'</td>'
       +'<td class="num mt">'+(c.rate?c.rate+'%':'—')+'</td>'
       +'<td class="num mt" style="color:'+(c.drop>15?'#B42318':'#475467')+'">'+(c.drop?c.drop+'%':'—')+'</td>'
       +'<td class="mcap" style="padding-right:20px;max-width:200px;white-space:normal">'+esc(c.note||'')+'</td>';
      tr.addEventListener('click',function(){openCh(c)});tb.appendChild(tr)})}
  fill()};

/* ══════ 채널 상세 ══════ */
var curCh=null;
function openCh(c){curCh=c;go('channel')}
A.openCh=openCh;
V.channel=function(){
  var c=curCh;if(!c){go('channels');return}
  var st=CH_ST[c.st],h=$('#v-channel');
  var mine=COHORTS.filter(function(x){return x.ch===c.id}).sort(function(a,b){return b.no-a.no});
  var tk=TICKETS.filter(function(x){return x.ch===c.id&&x.st!=='done'});
  h.innerHTML=ph(esc(c.n),c.region+' · '+esc(c.mgr)+' '+esc(c.mgrPhone)+' · '+c.since+' 개소',
     '<button class="mb" type="button" id="ch-back">‹ 목록</button><button class="mb" type="button">담당자 변경</button><button class="mb mbp" type="button" data-go="cohorts">기수 관리</button>')
   +kpi([['상태',st[0],'',c.st==='run'?c.cohort+'기 '+c.day+'일째':'',c.st==='run'?'':'nu'],
         ['대상자',c.people?fmt(c.people):'—','명',c.app?'앱 설치 '+fmt(c.app)+'명':''],
         ['수행률',c.rate?c.rate+'%':'—','',c.rate?(c.rate<45?'전 채널 평균 아래':'양호'):'',c.rate&&c.rate<45?'wa':''],
         ['중도포기',c.drop?c.drop+'%':'—','','',c.drop>15?'cr':''],
         ['대기 CS',String(tk.length),'건','',tk.length?'cr':'']])
   +(c.note?note('<b>비고</b> '+esc(c.note),c.st==='prep'?'in':'wa'):'')
   +'<div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px">'
   +'<div class="mc" style="overflow:hidden">'+chead('기수 이력')
     +'<div class="scroll"><table class="mtb"><thead><tr><th style="padding-left:20px">기수</th><th>기간</th><th class="num">대상자</th><th style="padding-right:20px">상태</th></tr></thead><tbody id="ch-co"></tbody></table></div></div>'
   +'<div class="mc" style="overflow:hidden">'+chead('대기 중 문의','<span class="mcap">'+tk.length+'건</span>')
     +'<div id="ch-tk"></div></div></div>';
  $('#ch-back').addEventListener('click',function(){go('channels')});
  var cob=$('#ch-co');
  mine.forEach(function(x){
    var s=CO_ST[x.st];
    cob.appendChild(el('tr',null,'<td style="padding-left:20px;font-weight:600">'+x.no+'기</td>'
      +'<td class="mt" style="color:#475467">'+x.s+' ~ '+x.e+'</td>'
      +'<td class="num mt">'+(x.people?fmt(x.people):'—')+'</td>'
      +'<td style="padding-right:20px">'+pill(s[0],s[1])+'</td>'))});
  if(!mine.length)cob.appendChild(el('tr',null,'<td colspan="4" style="padding-left:20px;color:#69707C">기수 이력이 없어요</td>'));
  var tkb=$('#ch-tk');
  if(!tk.length)tkb.innerHTML=A.emptyBox('대기 중 문의가 없어요','');
  tk.forEach(function(x,ix){
    var s=A.SRC[x.src],d=el('div');
    d.style.cssText='padding:13px 20px;'+(ix?'border-top:1px solid #F2F4F7':'');
    d.innerHTML='<div class="row" style="gap:7px">'+pill(s[0],s[1])+'<span class="mcap mt">'+x.aged+'일 경과</span></div>'
      +'<div style="font-size:13.5px;font-weight:600;margin-top:5px">'+esc(x.t)+'</div>';
    tkb.appendChild(d)})};

/* ══════ 기수 관리 ══════ */
var hSort={key:'s',dir:-1},endTarget=null;
V.cohorts=function(){
  var h=$('#v-cohorts');
  var run=COHORTS.filter(function(x){return x.st==='run'});
  var plan=COHORTS.filter(function(x){return x.st==='plan'});
  h.innerHTML=ph('기수 관리','기수를 열고 닫아요. 종료하면 참여자의 앱 이용이 막히니 신중하게 해주세요.',
     '<button class="mb mbp" type="button" id="co-new">기수 개설</button>')
   +kpi([['진행 중',String(run.length),'개',fmt(run.reduce(function(a,x){return a+x.people},0))+'명'],
         ['개설 예정',String(plan.length),'개',plan.length?'안산시 단원구 9월':''],
         ['종료',String(COHORTS.filter(function(x){return x.st==='done'}).length),'개',''],
         ['올해 종료 예정','2','개','남동구 3기 · 부천 3기 (12월)','wa']])
   +note('기수를 종료하면 <b>참여자가 만료 상태로 바뀌고 앱 이용이 막혀요.</b> 진행 중 챌린지가 있으면 달성 직전인 분들의 기록이 사라질 수 있어요.','wa')
   +'<div class="mc" style="overflow:hidden"><div class="scroll"><table class="mtb"><thead><tr id="co-th"></tr></thead><tbody id="co-tb"></tbody></table></div></div>';
  $('#co-new').addEventListener('click',function(){toast('기수 개설 화면은 다음 단계에서 붙여요','wa')});
  function fill(){
    var list=sortBy(COHORTS,hSort,function(x,k){return k==='ch'?A.chName(x.ch):k==='s'?x.s:x[k]||0});
    var th=$('#co-th');
    th.innerHTML=sth('기관','ch',hSort)+sth('기수','no',hSort,1)+sth('시작','s',hSort)+'<th>종료</th>'
      +sth('대상자','people',hSort,1)+'<th>상태</th><th style="padding-right:20px"></th>';
    bindSort(th,hSort,fill);
    var tb=$('#co-tb');tb.innerHTML='';
    list.forEach(function(x){
      var s=CO_ST[x.st],tr=el('tr');
      tr.innerHTML='<td style="padding-left:20px">'+chChip(x.ch)+'</td>'
       +'<td class="num mt" style="font-weight:600">'+x.no+'기</td>'
       +'<td class="mt" style="color:#475467">'+x.s+'</td><td class="mt" style="color:#475467">'+x.e+'</td>'
       +'<td class="num mt">'+(x.people?fmt(x.people):'—')+'</td><td>'+pill(s[0],s[1])+'</td>'
       +'<td style="text-align:right;padding-right:20px">'+(x.st==='run'?'<button class="mb mbs" type="button" style="color:#B42318;border-color:#FDA29B">종료</button>':'')+'</td>';
      var b=tr.querySelector('.mb');
      if(b)b.addEventListener('click',function(){openEnd(x)});
      tb.appendChild(tr)})}
  fill()};

/* 기수 종료 — 3중 확인 (사유 + 체크 + 영향 명시) */
var ceA=false;
function openEnd(x){
  endTarget=x;
  var ch=A.chName(x.ch);
  var q=CHALLENGES.filter(function(c){return c.st==='run'&&c.chs.indexOf(x.ch)>=0});
  $('#ce-t').innerHTML='<b>'+esc(ch)+' '+x.no+'기</b>를 종료해요. 참여자 <b>'+fmt(x.people)+'명</b>의 앱 이용이 막혀요.'
    +(q.length?'<br>진행 중 챌린지 <b>'+q.length+'건</b>이 함께 중단될 수 있어요.':'');
  $('#ce-r').value='';ceA=false;setCeA();updCe();open('m-cohort-end')}
function setCeA(){var a=$('#ce-a');a.className='cbx'+(ceA?' on':'');a.setAttribute('aria-checked',ceA?'true':'false')}
function updCe(){var ok=$('#ce-r').value&&ceA,b=$('#ce-ok');
  b.style.opacity=ok?'1':'.8';b.style.cursor=ok?'pointer':'not-allowed';b.dataset.ok=ok?'1':'';
  b.setAttribute('aria-disabled',ok?'false':'true')}
$('#ce-r').addEventListener('change',updCe);
$('#ce-aw').addEventListener('click',function(e){e.preventDefault();ceA=!ceA;setCeA();updCe()});
[['ce-aw1','ce-a1'],['ce-aw2','ce-a2']].forEach(function(p){
  $('#'+p[0]).addEventListener('click',function(e){
    e.preventDefault();var a=$('#'+p[1]),on=a.classList.toggle('on');
    a.setAttribute('aria-checked',on?'true':'false')})});
$('#ce-ok').addEventListener('click',function(){
  if(!this.dataset.ok)return;
  var x=endTarget;x.st='done';
  var c=A.byCh[x.ch];if(c&&c.cohort===x.no)c.st='done';
  closeAll();V.cohorts();
  toast(A.chName(x.ch)+' '+x.no+'기를 종료했어요','ok')});
})(Sup);

/* ══════ 계정·권한 (A-3) ══════
   SP-6 권고를 화면으로 강제한다 — 정지는 즉시, 인수인계는 계정 2개로. */
(function(A){
"use strict";
var $=A.$,el=A.el,esc=A.esc,fmt=A.fmt,pill=A.pill,note=A.note,kpi=A.kpi,ph=A.ph,chead=A.chead,
    search=A.search,sth=A.sth,bindSort=A.bindSort,sortBy=A.sortBy,toast=A.toast,open=A.open,
    closeAll=A.closeAll,V=A.V,ACCOUNTS=A.ACCOUNTS,ROLES=A.ROLES,AC_ST=A.AC_ST,chChip=A.chChip,chName=A.chName;
var aFil=[],aSort={key:'last',dir:-1},aq='';
V.accounts=function(){
  var h=$('#v-accounts');
  var wait=ACCOUNTS.filter(function(u){return u.st==='wait'});
  var noMfa=ACCOUNTS.filter(function(u){return !u.mfa&&u.st==='live'});
  h.innerHTML=ph('계정·권한','채널 어드민에 접속할 수 있는 계정을 여기서 만들고 막아요.',
     '<button class="mb mbp" type="button" id="ac-new">계정 발급</button>')
   +kpi([['사용 중',String(ACCOUNTS.filter(function(u){return u.st==='live'}).length),'개',''],
         ['발급 대기',String(wait.length),'개',wait.length?'가장 오래된 건 9일째':'','cr'],
         ['정지',String(ACCOUNTS.filter(function(u){return u.st==='susp'}).length),'개',''],
         ['2단계 인증 미설정',String(noMfa.length),'개','개인정보를 다루는 계정이에요','wa'],
         ['담당자 없는 채널','1','개','안산시 단원구','cr']])
   +note('<b>퇴사 통보를 받으면 그날 정지해주세요.</b> 인수인계는 계정을 함께 쓰는 게 아니라 후임자 계정을 먼저 발급해서 풀어요. 퇴사자 계정으로 남긴 열람 기록은 감사 때 설명할 수 없어요.','wa')
   +'<div class="mc" style="padding:16px 20px;display:flex;flex-direction:column;gap:12px">'
     +'<div class="row">'+search('aq','이름, 이메일로 찾기','280px')
     +'<span style="margin-left:auto;font-size:13px;color:#667085">조건에 맞는 계정 <b class="mt" style="color:#101828" id="ac-cnt">0</b>개</span></div>'
     +'<div class="row" id="ac-chips"></div></div>'
   +'<div class="mc" style="overflow:hidden"><div class="scroll"><table class="mtb"><thead><tr id="ac-th"></tr></thead><tbody id="ac-tb"></tbody></table></div>'
     +'<div id="ac-empty" style="display:none"></div></div>';
  $('#ac-new').addEventListener('click',function(){open('m-account')});
  var cc=$('#ac-chips');
  Object.keys(ROLES).forEach(function(k){
    var n=ACCOUNTS.filter(function(u){return u.role===k}).length;
    var b=el('button','mchip'+(aFil.indexOf('r:'+k)>=0?' on':''),ROLES[k][0]+' <span class="c mt">'+n+'</span>');b.type='button';
    b.addEventListener('click',function(){tog('r:'+k)});cc.appendChild(b)});
  cc.appendChild(el('span','sep'));
  Object.keys(AC_ST).forEach(function(k){
    var n=ACCOUNTS.filter(function(u){return u.st===k}).length;
    if(!n)return;
    var b=el('button','mchip'+(aFil.indexOf('s:'+k)>=0?' on':''),AC_ST[k][0]+' <span class="c mt">'+n+'</span>');b.type='button';
    b.addEventListener('click',function(){tog('s:'+k)});cc.appendChild(b)});
  function tog(v){var i=aFil.indexOf(v);if(i>=0)aFil.splice(i,1);else aFil.push(v);V.accounts()}
  $('#aq').value=aq;
  $('#aq').addEventListener('input',function(){aq=this.value;fill()});
  $('#aq-x').addEventListener('click',function(){aq='';$('#aq').value='';fill()});
  function fill(){
    $('#aq-x').style.display=aq?'flex':'none';
    var rF=aFil.filter(function(v){return v[0]==='r'}).map(function(v){return v.slice(2)});
    var sF=aFil.filter(function(v){return v[0]==='s'}).map(function(v){return v.slice(2)});
    var list=ACCOUNTS.filter(function(u){
      if(rF.length&&rF.indexOf(u.role)<0)return false;
      if(sF.length&&sF.indexOf(u.st)<0)return false;
      if(aq&&u.n.indexOf(aq)<0&&u.email.indexOf(aq)<0)return false;
      return true});
    list=sortBy(list,aSort,function(u,k){return k==='n'?u.n:k==='ch'?(u.ch?chName(u.ch):'—'):k==='last'?u.last:k==='role'?ROLES[u.role][0]:u[k]||0});
    var th=$('#ac-th');
    th.innerHTML=sth('이름','n',aSort)+sth('역할','role',aSort)+sth('담당 채널','ch',aSort)+'<th>이메일</th>'
      +'<th>2단계</th>'+sth('마지막 접속','last',aSort)+'<th>상태</th><th style="padding-right:20px"></th>';
    bindSort(th,aSort,fill);
    var tb=$('#ac-tb');tb.innerHTML='';
    $('#ac-cnt').textContent=list.length;
    $('#ac-empty').innerHTML=list.length?'':A.emptyBox('조건에 맞는 계정이 없어요','필터를 줄여보세요');
    $('#ac-empty').style.display=list.length?'none':'block';
    list.forEach(function(u){
      var r=ROLES[u.role],st=AC_ST[u.st],tr=el('tr');
      tr.innerHTML='<td style="padding-left:20px;font-weight:600;color:'+(u.n==='—'?'#B42318':'#101828')+'">'+esc(u.n)+'</td>'
       +'<td>'+pill(r[0],r[1])+'</td>'
       +'<td>'+(u.ch?chChip(u.ch):'<span style="color:#69707C">전체</span>')+'</td>'
       +'<td class="mt" style="color:#475467">'+esc(u.email)+'</td>'
       +'<td>'+(u.mfa?'<span class="mcap" style="color:#067647">설정</span>':'<span class="mcap" style="color:#B42318;font-weight:600">미설정</span>')+'</td>'
       +'<td class="mt" style="color:#475467">'+u.last+'</td>'
       +'<td>'+pill(st[0],st[1])+'</td>'
       +'<td style="text-align:right;padding-right:20px">'
         +(u.st==='live'?'<button class="mb mbs sus" type="button" style="color:#B42318;border-color:#FDA29B">정지</button>'
          :u.st==='susp'?'<button class="mb mbs act" type="button">해제</button>'
          :u.st==='wait'?'<button class="mb mbs mbp iss" type="button">발급</button>':'')+'</td>';
      var s=tr.querySelector('.sus'),a2=tr.querySelector('.act'),i=tr.querySelector('.iss');
      if(s)s.addEventListener('click',function(){openSusp(u)});
      if(a2)a2.addEventListener('click',function(){u.st='live';V.accounts();toast(u.n+' 계정을 다시 열었어요','ok')});
      if(i)i.addEventListener('click',function(){open('m-account')});
      tb.appendChild(tr)})}
  fill()};

/* 계정 정지 — 즉시 차단이므로 사유 + 확인 */
var suspT=null,suA=false;
function openSusp(u){
  suspT=u;
  $('#su-t').innerHTML='<b>'+esc(u.n)+'</b> 계정을 정지해요. '+(u.ch?esc(chName(u.ch))+' ':'')
    +'접속이 <b>즉시</b> 막히고, 진행 중이던 작업은 저장되지 않아요.';
  $('#su-r').value='';suA=false;setSuA();updSu();open('m-suspend')}
function setSuA(){var a=$('#su-a');a.className='cbx'+(suA?' on':'');a.setAttribute('aria-checked',suA?'true':'false')}
function updSu(){var ok=$('#su-r').value&&suA,b=$('#su-ok');
  b.style.opacity=ok?'1':'.8';b.style.cursor=ok?'pointer':'not-allowed';b.dataset.ok=ok?'1':'';
  b.setAttribute('aria-disabled',ok?'false':'true')}
$('#su-r').addEventListener('change',updSu);
$('#su-aw').addEventListener('click',function(e){e.preventDefault();suA=!suA;setSuA();updSu()});
$('#su-ok').addEventListener('click',function(){
  if(!this.dataset.ok)return;
  var r=$('#su-r').value;
  suspT.st='susp';suspT.note=r;
  closeAll();V.accounts();
  toast(suspT.n+' 계정을 정지했어요',"ok");
  if(r==='퇴사'&&suspT.ch)
    setTimeout(function(){toast(chName(suspT.ch)+'에 담당자가 없어요. 후임자 계정을 발급해주세요','wa',
      '계정 발급',function(){open('m-account')})},600)});
$('#ac-ok').addEventListener('click',function(){
  var n=$('#ac-n').value.trim();
  if(!n){toast('이름을 입력해주세요','cr');$('#ac-n').focus();return}
  ACCOUNTS.unshift({id:'U'+(ACCOUNTS.length+10),n:n,role:$('#ac-r').value,ch:$('#ac-c').value,
    st:'live',email:$('#ac-e').value||'—',last:'—',made:'2026-08-24',mfa:false,note:'발급 직후'});
  closeAll();V.accounts();
  toast(n+' 계정을 발급했어요. 2단계 인증 설정 안내가 갔어요','ok','되돌리기',function(){ACCOUNTS.shift();V.accounts()})});
})(Sup);
