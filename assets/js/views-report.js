(function(A){
"use strict";
var $=A.$,$$=A.$$,el=A.el,esc=A.esc,fmt=A.fmt,pad2=A.pad2,rnd=A.rnd,pill=A.pill,note=A.note,kpi=A.kpi,cbx=A.cbx,
    brow=A.brow,ph=A.ph,chead=A.chead,emptyBox=A.emptyBox,search=A.search,sth=A.sth,bindSort=A.bindSort,
    sortBy=A.sortBy,mkPager=A.mkPager,toast=A.toast,open=A.open,closeAll=A.closeAll,go=A.go,V=A.V,
    PEOPLE=A.PEOPLE,APPS=A.APPS,AUDIT=A.AUDIT,addAudit=A.addAudit,LT=A.LT,RT=A.RT,cnt=A.cnt,
    CFG=A.CFG,pCount=A.pCount,M=A.M,METRICS=A.METRICS,band=A.band,bandLabel=A.bandLabel,ownerOf=A.ownerOf,siteOwner=A.siteOwner,groupById=A.groupById,getGroup=A.getGroup,putGroup=A.putGroup,GROUPS=A.GROUPS,KIND=A.KIND,SCOPE=A.SCOPE,SITES=A.SITES,groupTree=A.groupTree,groupDepth=A.groupDepth,ROLES=A.ROLES,SITES_OWN=A.SITES_OWN,OPERATORS=A.OPERATORS,assignments=A.assignments,ownedBy=A.ownedBy,subsAt=A.subsAt,opChannel=A.opChannel,canEditSched=A.canEditSched,SCHED=A.SCHED,skey=A.skey,CARRY=A.CARRY,PERMLOG=A.PERMLOG,addPermLog=A.addPermLog,modalBox=A.modalBox,CH_SELF=A.CH_SELF,ruleAt=A.ruleAt,pushRule=A.pushRule,RULEVER=A.RULEVER;

/* ══════ 푸시 메시지 목록 ══════ */
var MSGS=[
 {id:'m1',when:'08-22 (금) 09:00',rel:'17시간 뒤',t:'오늘은 가볍게 걷기만 해볼까요',memo:'무활동 어르신 안내 8/22',tgt:'14일 넘게 활동이 없는 분',n:147,how:'푸시 + 알림함',st:'예약됨',k:'in',tab:'sched'},
 {id:'m2',when:'08-24 (일) 09:00',rel:'3일 뒤',t:'8월 걷기 챌린지가 시작돼요',memo:'챌린지 시작 안내',tgt:'3기 전체',n:785,how:'푸시 + 알림함',st:'예약됨',k:'in',tab:'sched'},
 {id:'m3',when:'08-25 (월) 10:00',rel:'4일 뒤',t:'이번 주 프로그램을 알려드려요',memo:'주간 안내 · 반복 발송',tgt:'남동구보건소',n:341,how:'푸시',st:'매주 월요일 반복',k:'nu',tab:'sched'},
 {id:'m4',when:'08-28 (목) 14:00',rel:'7일 뒤',t:'앱을 새로 받아주세요',memo:'구버전 업데이트 안내',tgt:'3개월 넘게 구버전 사용',n:32,how:'푸시',st:'대상 자동 갱신',k:'wa',tab:'sched'},
 {id:'s1',when:'08-19 (화) 09:00',rel:'2일 전',t:'오늘의 활동이 도착했어요',memo:'일일 안내',tgt:'3기 전체',n:781,how:'푸시 + 알림함',st:'열어봄 41.2%',k:'ok',tab:'sent'},
 {id:'s2',when:'08-14 (목) 09:00',rel:'7일 전',t:'이번 주도 함께해요',memo:'주간 안내',tgt:'남동구보건소',n:338,how:'푸시',st:'열어봄 36.8%',k:'ok',tab:'sent'},
 {id:'s3',when:'08-12 (화) 15:00',rel:'9일 전',t:'설문에 참여해 주세요',memo:'만족도 조사',tgt:'활동자 전체',n:294,how:'푸시 + 알림함',st:'열어봄 28.4%',k:'wa',tab:'sent'},
 {id:'d1',when:'—',rel:'임시저장 08-20 14:20',t:'9월 프로그램 안내',memo:'작성 중',tgt:'3기 전체',n:822,how:'푸시 + 알림함',st:'임시저장',k:'nu',tab:'draft'},
 {id:'d2',when:'—',rel:'임시저장 08-18 11:05',t:'',memo:'제목 없음',tgt:'미지정',n:0,how:'—',st:'임시저장',k:'nu',tab:'draft'}];
var mTab='sched',mSort={key:'when',dir:1};
V.push=function(){
  var h=$('#v-push');
  h.innerHTML=ph('푸시 메시지','앱을 쓰는 어르신에게 보내는 알림이에요. 예약 4건 · 이번 달 27건 보냈어요',
    '<button class="mb" id="pu-dl">발송 결과 내려받기</button><button class="mb mbp" id="pu-new">새 메시지 만들기</button>')
   +kpi([['예약된 메시지','4','건','가장 이른 건 내일 오전 9시'],['이번 달 보낸 메시지','27','건','받은 사람 누적 4,318명'],
         ['열어본 비율','38.2','%','오전 9시 발송이 가장 높아요','ok'],['보내지 못한 메시지','2','건','앱 알림을 끈 분들이에요','wa']])
   +note('보낼 수 있는 시간은 <b>오전 9시부터 오후 6시</b>까지예요. 그 밖의 시간으로 예약하면 다음 날 오전 9시로 옮겨져요. 발송 30분 전까지는 고치거나 취소할 수 있어요.','in')
   +'<div class="mc" style="overflow:hidden"><div class="row" style="padding:16px 20px" id="pu-f"></div>'
   +'<div class="scroll"><table class="mtb"><thead><tr id="pu-th"></tr></thead><tbody id="pu-tb"></tbody></table></div>'
   +'<div id="pu-empty"></div>'
   +'<div class="row" style="padding:14px 20px;border-top:1px solid #F2F4F7"><span class="mcap">‘대상 자동 갱신’은 보낼 때 조건을 다시 계산해요. 지금 32명이지만 발송 시점에 달라질 수 있어요.</span>'
   +'<button class="mb mbs mbg" style="margin-left:auto">보낸 메시지 성과 보기</button></div></div>';
  $('#pu-new').addEventListener('click',function(){go('pushnew')});
  $('#pu-dl').addEventListener('click',function(){addAudit('푸시 성과 내려받기','27건','발송 결과 확인');toast('발송 결과를 내려받았어요','ok')});
  var f=$('#pu-f');
  [['예약','sched',4],['보낸 메시지','sent',27],['임시저장','draft',2],['반복 발송','rep',1]].forEach(function(x){
    var b=el('button','mchip'+(mTab===x[1]?' on':''),x[0]+' <span class="c mt">'+x[2]+'</span>');
    b.addEventListener('click',function(){mTab=x[1];V.push()});f.appendChild(b)});
  var th=$('#pu-th');
  th.innerHTML=sth('보낼 시각','when',mSort)+'<th>메시지</th><th>받는 사람</th>'+sth('인원','n',mSort,1)+'<th>보내는 방법</th><th>상태</th><th style="padding-right:20px;text-align:right">처리</th>';
  bindSort(th,mSort,V.push);
  var list=MSGS.filter(function(m){return mTab==='rep'?m.st.indexOf('반복')>=0:m.tab===mTab});
  list=sortBy(list,mSort,function(m,k){return k==='when'?m.when:m.n});
  var tb=$('#pu-tb');tb.innerHTML='';
  $('#pu-empty').innerHTML=list.length?'':emptyBox('아직 없어요','새 메시지를 만들면 여기에 쌓여요','새 메시지 만들기');
  if(!list.length)$('#pu-empty .mb').addEventListener('click',function(){go('pushnew')});
  list.forEach(function(m){
    var tr=el('tr');
    var acts=m.tab==='sent'?'<button class="mb mbx">성과 보기</button>':
      '<button class="mb mbx ed">수정</button> <button class="mb mbx cn" style="color:#B42318">'+(m.tab==='draft'?'삭제':'취소')+'</button>';
    tr.innerHTML='<td style="padding-left:20px"><b class="mt" style="font-size:13px">'+m.when+'</b><span class="mcap" style="display:block;font-size:11.5px">'+m.rel+'</span></td>'
     +'<td><b style="font-weight:600">'+(m.t||'<span style="color:#69707C">제목 없음</span>')+'</b><span class="mcap" style="display:block;font-size:11.5px">'+m.memo+'</span></td>'
     +'<td style="color:#475467">'+m.tgt+'</td><td class="num mt">'+(m.n?fmt(m.n):'—')+'</td>'
     +'<td class="mcap">'+m.how+'</td><td>'+pill(m.st,m.k)+'</td>'
     +'<td style="text-align:right;padding-right:20px">'+acts+'</td>';
    var e=tr.querySelector('.ed'),c=tr.querySelector('.cn');
    if(e)e.addEventListener('click',function(){go('pushnew')});
    if(c)c.addEventListener('click',function(){
      var i=MSGS.indexOf(m);MSGS.splice(i,1);V.push();
      toast('“'+(m.t||'제목 없음')+'”을 '+(m.tab==='draft'?'삭제':'취소')+'했어요','ok','되돌리기',function(){MSGS.splice(i,0,m);V.push()})});
    tb.appendChild(tr)})};

/* ══════ 메시지 만들기 ══════ */
var nw={seg:'both',target:'act:14',title:'오늘은 가볍게 걷기만 해볼까요',
  bodyT:'{이름} 어르신, 오늘 10분만 걸어볼까요? 걷기 기록은 챌린지에도 함께 쌓여요.',
  land:'걷기 기록 화면',sched:'time',time:'오전 9:00',date:'2026-08-22'};
var TGT=[['3기 전체','all',M.audience()],[bandLabel().risk,'act:14',M.inactive14()],['활동 0일','act:0',M.never()],
  ['우울·불면 주의 이상','risk',298],['챌린지 미참여','noq',272],['기관별 고르기','org',0]];
function tgtPeople(){
  var t=nw.target;
  if(t==='act:14')return PEOPLE.filter(function(p){return band(p)==='risk'});
  if(t==='act:0')return PEOPLE.filter(function(p){return p.days===0});
  if(t==='risk')return PEOPLE.filter(function(p){return p.idx%823<298});
  if(t==='noq')return PEOPLE.filter(function(p){return p.streak<3});
  if(t==='org')return PEOPLE.filter(function(p){return p.org==='남동구보건소'});
  return PEOPLE}
function reach(){
  var g=tgtPeople();
  var noApp=g.filter(function(p){return !p.installed});
  var noNoti=g.filter(function(p){return p.installed&&!p.notif});
  return {base:g.length,noApp:noApp.length,noNoti:noNoti.length,go:g.length-noApp.length-noNoti.length,
    listApp:noApp,listNoti:noNoti}}
V.pushnew=function(){
  var h=$('#v-pushnew'),r=reach();
  h.innerHTML=ph('새 메시지','임시저장 14:20',
    '<button class="mb" id="nw-b">‹ 목록</button><button class="mb" id="nw-test">내 번호로 테스트</button><button class="mb" id="nw-save">임시저장</button><button class="mb mbp" id="nw-go">'+nw.time+'로 예약하기</button>')
   +'<div style="display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:16px;align-items:start">'
   +'<div class="gap">'
     /* 01 */
     +'<div class="mc" style="padding:20px"><div class="step"><span class="no">01</span><span class="mh">받는 사람</span><span class="mcap" style="margin-left:auto">조건을 고르면 인원이 바로 계산돼요</span></div>'
       +'<div class="row" id="nw-tgt"></div>'
       +'<div style="margin-top:14px;padding:14px 16px;background:#F9FAFB;border-radius:8px;display:flex;gap:12px;align-items:flex-start">'
         +'<span style="flex:1"><span style="font-size:13.5px">이 조건에 맞는 <b class="mt">'+fmt(r.base)+'명</b> 중 <b class="mt" style="color:#067647">'+fmt(r.go)+'명</b>에게 갑니다</span>'
         +'<span class="mcap" style="display:block;margin-top:5px">앱을 설치하지 않은 <b class="mt">'+r.noApp+'명</b>과 알림을 끈 <b class="mt">'+r.noNoti+'명</b>은 자동으로 빠져요. 이분들은 명단으로 받아 전화로 안내할 수 있어요.</span></span>'
         +'<button class="mb mbs" id="nw-ex" style="flex:none">빠진 '+(r.noApp+r.noNoti)+'명 명단</button></div></div>'
     /* 02 */
     +'<div class="mc" style="padding:20px"><div class="step"><span class="no">02</span><span class="mh">보낼 내용</span>'
       +'<span style="margin-left:auto"><span class="seg" id="nw-seg">'
       +[['both','푸시 + 알림함'],['push','푸시만'],['inbox','알림함만']].map(function(s){return '<button data-v="'+s[0]+'" class="'+(nw.seg===s[0]?'on':'')+'">'+s[1]+'</button>'}).join('')+'</span></span></div>'
       +'<div style="display:flex;flex-direction:column;gap:14px">'
       +'<div><div class="row" style="margin-bottom:6px"><span class="flab" style="margin:0">알림 제목</span><span class="mcap mt" style="margin-left:auto" id="nw-tc">'+nw.title.length+' / 20자</span></div>'
         +'<input class="mfld" id="nw-title" aria-label="메시지 제목" style="width:100%" maxlength="20" value="'+esc(nw.title)+'"></div>'
       +'<div><div class="row" style="margin-bottom:6px"><span class="flab" style="margin:0">알림 내용</span><span class="mcap mt" style="margin-left:auto" id="nw-bc">'+nw.bodyT.length+' / 60자</span></div>'
         +'<textarea class="mfld" id="nw-body" aria-label="메시지 내용" rows="2" maxlength="60" style="width:100%;height:auto;padding:10px 12px">'+esc(nw.bodyT)+'</textarea></div>'
       +'<div><span class="flab">넣을 수 있는 값</span><div class="row" id="nw-vars"></div>'
         +'<span class="mcap" style="display:block;margin-top:6px">이름이 없는 분에게는 “어르신”으로 나가요</span></div>'
       +'<div><span class="flab">누르면 열릴 화면</span><div class="row" id="nw-land"></div></div></div></div>'
     /* 03 */
     +'<div class="mc" style="padding:20px"><div class="step"><span class="no">03</span><span class="mh">언제 보낼까요</span><span class="mcap" style="margin-left:auto">오전 9시–오후 6시만 가능</span></div>'
       +'<div class="row" id="nw-when"></div>'
       +'<div id="nw-detail" style="margin-top:14px"></div></div>'
   +'</div>'
   /* preview */
   +'<div class="gap"><div class="mc" style="padding:18px">'
     +'<div class="row" style="margin-bottom:14px"><span class="mh">미리보기</span><span class="mcap" style="margin-left:auto">잠금화면 · 글씨 크게</span></div>'
     +'<div class="prev"><div class="mt" style="text-align:center;padding:6px 0 14px"><div style="font-size:12.5px;color:#A9B2C0">8월 22일 금요일</div><div style="font-size:34px;font-weight:700;letter-spacing:-0.03em">9:00</div></div>'
       +'<div class="pnote"><span style="width:26px;height:26px;border-radius:7px;background:#13BD7E;flex:none;display:flex;align-items:center;justify-content:center"><svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="#043528" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 9.5 7 13l7.5-8"/></svg></span>'
       +'<span style="min-width:0"><span style="display:flex;gap:8px"><b id="pv-t" style="font-size:13px;font-weight:700">'+esc(nw.title)+'</b><span class="mcap" style="margin-left:auto;color:#A9B2C0;font-size:11.5px">지금</span></span>'
       +'<span id="pv-b" style="display:block;font-size:12.5px;color:#D0D5DD;margin-top:3px;line-height:1.5">'+esc(nw.bodyT.replace('{이름}','안순'))+'</span></span></div>'
       +'<div class="mcap" style="text-align:center;margin-top:12px;color:#A9B2C0;font-size:11.5px">맬리 케어센터 · 알림함에도 함께 쌓여요</div></div>'
     +'<div style="margin-top:16px"><span class="flab">앱 알림함에서는 이렇게 보여요</span>'
       +'<div style="border:1px solid #EAECF0;border-radius:8px;padding:12px;display:flex;gap:10px">'
       +'<span style="width:26px;height:26px;border-radius:7px;background:#E7F9F1;flex:none"></span>'
       +'<span style="min-width:0"><b id="pv-t2" style="font-size:13px;font-weight:600">'+esc(nw.title)+'</b>'
       +'<span id="pv-b2" class="mcap" style="display:block;margin-top:2px">'+esc(nw.bodyT.replace('{이름}','안순'))+'</span>'
       +'<span class="mcap mt" style="display:block;margin-top:4px;color:#69707C;font-size:11.5px">8월 22일 오전 9:00</span></span></div></div></div>'
     +note('오전 9시 발송이 열어본 비율이 가장 높아요(41.2%). 고령 이용자가 많아 야간 발송은 피해주세요.','in')+'</div></div>';
  $('#nw-b').addEventListener('click',function(){go('push')});
  $('#nw-save').addEventListener('click',function(){toast('임시저장했어요','ok')});
  $('#nw-test').addEventListener('click',function(){toast('내 번호로 테스트 발송했어요','ok')});
  $('#nw-go').addEventListener('click',function(){
    if(!nw.title.trim()){toast('알림 제목을 입력해주세요','cr');return}
    MSGS.unshift({id:'m'+Date.now(),when:'08-22 (금) 09:00',rel:'17시간 뒤',t:nw.title,memo:'직접 만든 메시지',
      tgt:(TGT.filter(function(x){return x[1]===nw.target})[0]||['—'])[0],n:reach().go,how:nw.seg==='both'?'푸시 + 알림함':nw.seg==='push'?'푸시':'알림함',st:'예약됨',k:'in',tab:'sched'});
    addAudit('푸시 예약',fmt(reach().go)+'명',nw.title);
    go('push');toast(fmt(reach().go)+'명에게 예약했어요','ok','되돌리기',function(){MSGS.shift();V.push()})});
  $('#nw-ex').addEventListener('click',function(){
    var r2=reach();
    $('#ex-t').firstChild.textContent='빠진 '+(r2.noApp+r2.noNoti)+'명 명단';
    var noApp=r2.listApp,noN=r2.listNoti;
    $('#ex-b').innerHTML=note('아래 분들은 푸시를 받을 수 없어요. 명단을 내려받아 전화로 안내할 수 있어요.','wa')
     +'<div class="mc" style="overflow:hidden"><div class="scroll"><table class="mtb"><thead><tr><th style="padding-left:16px">이름</th><th>연락처</th><th>기관</th><th style="padding-right:16px">사유</th></tr></thead><tbody>'
     +noApp.concat(noN).map(function(p,i){return '<tr><td style="padding-left:16px">'+p.name+'</td><td class="mt" style="color:#475467">'+p.phone+'</td><td style="color:#475467">'+p.org+'</td><td style="padding-right:16px">'+pill(i<noApp.length?'앱 미설치':'알림 꺼둠',i<noApp.length?'cr':'wa')+'</td></tr>'}).join('')
     +'</tbody></table></div></div>';
    open('m-excluded')});
  var tg=$('#nw-tgt');
  var prev=nw.target;
  TGT.forEach(function(t){
    nw.target=t[1];var n=tgtPeople().length;nw.target=prev;
    var b=el('button','mchip'+(nw.target===t[1]?' on':''),t[0]+' <span class="c mt">'+fmt(n)+'</span>');
    b.addEventListener('click',function(){nw.target=t[1];V.pushnew()});tg.appendChild(b)});
  $$('#nw-seg button').forEach(function(b){b.addEventListener('click',function(){nw.seg=b.dataset.v;V.pushnew()})});
  var vs=$('#nw-vars');
  ['이름','기관','연속 출석일'].forEach(function(v){
    var b=el('button','mb mbs','＋ '+v);
    b.addEventListener('click',function(){var ta=$('#nw-body');ta.value+=' {'+v+'}';nw.bodyT=ta.value;V.pushnew()});vs.appendChild(b)});
  var ld=$('#nw-land');
  ['걷기 기록 화면','오늘의 추천 활동','챌린지 상세','상담실','앱 첫 화면'].forEach(function(l){
    var b=el('button','mchip'+(nw.land===l?' on':''),l);
    b.addEventListener('click',function(){nw.land=l;V.pushnew()});ld.appendChild(b)});
  $('#nw-title').addEventListener('input',function(){nw.title=this.value;$('#nw-tc').textContent=this.value.length+' / 20자';
    $('#pv-t').textContent=this.value;$('#pv-t2').textContent=this.value});
  $('#nw-body').addEventListener('input',function(){nw.bodyT=this.value;$('#nw-bc').textContent=this.value.length+' / 60자';
    $('#pv-b').textContent=this.value.replace('{이름}','안순');$('#pv-b2').textContent=this.value.replace('{이름}','안순')});
  var wh=$('#nw-when');
  [['지금 바로 보내기','now'],['시간을 정해 예약','time'],['매주 같은 시각에 반복','rep']].forEach(function(w){
    var b=el('button','mchip'+(nw.sched===w[1]?' on':''),w[0]);
    b.addEventListener('click',function(){nw.sched=w[1];V.pushnew()});wh.appendChild(b)});
  var dt=$('#nw-detail');
  if(nw.sched==='now')dt.innerHTML=note('지금 바로 보내면 되돌릴 수 없어요. 발송 후에는 성과만 확인할 수 있어요.','wa');
  else dt.innerHTML='<div class="row"><label class="flab" for="nw-date" style="margin:0;width:42px">날짜</label><input id="nw-date" type="date" class="mfld" value="'+nw.date+'"></div>'
    +'<div class="row" style="margin-top:10px"><span class="flab" style="margin:0;width:42px">시각</span>'
    +['오전 9:00','오전 10:00','오후 2:00'].map(function(t){return '<button class="mchip'+(nw.time===t?' on':'')+'" data-t="'+t+'">'+t+'</button>'}).join('')
    +'<span class="mcap" style="margin-left:8px">가장 많이 열어보는 시간대예요</span></div>'
    +'<p class="mcap" style="margin:12px 0 0">예약 후에도 발송 30분 전까지 고칠 수 있어요. 취소하면 기록에는 남아요.</p>';
  $$('#nw-detail [data-t]').forEach(function(b){b.addEventListener('click',function(){nw.time=b.dataset.t;V.pushnew()})});
  $('#ex-dl').onclick=function(){addAudit('명단 내려받기',(reach().noApp+reach().noNoti)+'건','푸시 미도달자 전화 안내');closeAll();toast('명단을 내려받았어요','ok')}};

/* ══════ 월간 리포트 ══════ */
var RI=[[1,'월별 앱 업데이트 횟수','스토어 배포 건수와 버전별 이용자',1,'신규 API 필요',1],
 [2,'관리·감독 점검표','개인정보 18개 항목 중 6개 자동 판정',1,'audit_log + 수기',0],
 [3,'운영 현황','대상자·참여자·활동자·중도포기',1,'getMonthlyStat',0],
 [4,'참여자 현황','연령·성별 분포, 기관별 배정',1,'getPathStat',0],
 [5,'운영 결과','유형별 수행량, 검사 점수, 위험군',1,'getChallengeOutcomes',0],
 [6,'기타 / 특이사항','장애·민원·현장 이슈',0,'수기 입력',1]];
/* 이월 신청 — 자동인 건 '신청'까지다. 참여자가 되려면 한 명씩 승인해야 한다.
   3기 종료 → 리포트에서 4기 신청으로 적재 → 참여 신청에서 건별 승인. */
function openCarry(g){
  var elig=Math.round(g.n*0.86),skip=g.n-elig;
  var b=el('div');b.style.cssText='display:flex;flex-direction:column;gap:13px';
  b.innerHTML='<p class="mcap"><b>'+esc(g.name)+'</b> 참여자를 <b>4기 두뇌운동 치매예방교실</b> 신청으로 넘겨요.</p>'
   +'<div><span class="flab">넘길 대상</span>'
   +'<div id="cy-k" style="display:flex;gap:8px;margin-top:2px">'
   +'<button class="mb" data-k="act" style="flex:1;height:auto;padding:10px;text-align:left;display:block">'
   +'<b>활동 이력이 있는 분</b><div class="mcap">'+fmt(elig)+'명 · 한 번이라도 활동한 분</div></button>'
   +'<button class="mb" data-k="all" style="flex:1;height:auto;padding:10px;text-align:left;display:block">'
   +'<b>전원</b><div class="mcap">'+fmt(g.n)+'명 · 활동 0일인 '+fmt(skip)+'명 포함</div></button></div></div>'
   +note('넘기면 <b>참여 신청</b> 화면에 <b>3기 이월</b> 표시로 쌓여요. 거기서 승인해야 4기 참여자가 돼요. '
     +'승인 전까지는 <b>미그룹</b> 상태라 기본 화면만 보여요.','in');
  var kind='act';
  function paint(){$$('#cy-k .mb',b).forEach(function(x){
    var on=x.dataset.k===kind;x.style.borderColor=on?'#6BDCAF':'#D0D5DD';x.style.background=on?'#E7F9F1':'#fff'})}
  $$('#cy-k .mb',b).forEach(function(x){x.addEventListener('click',function(){kind=x.dataset.k;paint()})});
  paint();
  var m=modalBox('4기로 이월 신청',b);
  var f=m.querySelector('.mfoot');f.innerHTML='<button class="mb" data-close>취소</button>';
  var ok=el('button','mb mbp','신청 쌓기');
  ok.addEventListener('click',function(){
    var n=kind==='act'?elig:g.n;
    CARRY.done=true;CARRY.n=n;CARRY.at='오늘';CARRY.from=g.name;CARRY.to='4기 두뇌운동 치매예방교실';
    PEOPLE.slice(0,8).forEach(function(pp,i){
      APPS.unshift({id:'C'+i,name:pp.name,tail:pp.tail,phone:pp.phone,
        addr:'남동구 '+['구월동','만수동','논현동','간석동'][i%4],st:'pending',aged:0,
        signed:'Y',memo:'',carry:20+i*7})});
    addAudit('이월 신청',fmt(n)+'명',g.name+' → 4기');
    closeAll();V.report();
    toast(fmt(n)+'명을 4기 신청으로 넘겼어요. 승인은 참여 신청에서 하세요','ok')});
  f.appendChild(ok)}

V.report=function(){
  var h=$('#v-report'),cg=groupById(getGroup()),ended=cg.st==='종료';
  h.innerHTML=ph('월간 리포트','보건소 제출 자료 6종을 한 번에 만들어요.','<select class="mfld" aria-label="리포트 대상 월"><option>2026년 7월</option><option>2026년 6월</option></select>')
   +(ended?(CARRY.done
      ? note('<b>'+esc(CARRY.to)+' 이월 신청을 '+CARRY.at+'에 접수했어요.</b> '+fmt(CARRY.n)+'명이 신청 대기로 들어갔어요. '
        +'<b>승인은 한 사람씩</b> 참여 신청 화면에서 하셔야 4기 참여자가 돼요.','ok')
      : note('<b>'+esc(cg.name)+'이(가) 종료됐어요.</b> 이 기수 참여자를 다음 기수 신청으로 한 번에 넘길 수 있어요. '
        +'넘겨도 바로 참여자가 되는 건 아니고 <b>승인을 거쳐야</b> 해요.','wa'))
     :'')
   +(ended?'<div class="mc" style="padding:18px 20px;margin-bottom:16px;display:flex;align-items:center;gap:14px">'
      +'<div style="flex:1"><span class="mh">다음 기수로 이월 신청</span>'
      +'<div class="mcap" style="margin-top:3px">'+esc(cg.name)+' 참여자를 4기 신청 대기로 쌓아요. 종료된 이 기수의 리포트는 계속 뽑을 수 있어요.</div></div>'
      +'<button class="mb '+(CARRY.done?'':'mbp')+'" id="r-carry"'+(CARRY.done?' disabled':'')+'>'
      +(CARRY.done?'신청 완료':'4기로 이월 신청')+'</button></div>':'')
   +'<div style="display:grid;grid-template-columns:320px minmax(0,1fr);gap:16px;align-items:start">'
   +'<div class="gap"><div class="mc" style="overflow:hidden"><div class="row" style="padding:16px 20px 10px"><span class="mh">포함할 항목</span><span class="mcap mt" style="margin-left:auto" id="r-c"></span></div><div id="r-l"></div></div>'
     +'<div class="mc" style="padding:18px"><span class="mh">서식</span><select class="mfld" aria-label="공문 서식" style="width:100%;margin-top:10px"><option>남동구 보건소 표준 공문 (기본)</option><option>요약본 (2쪽)</option></select>'
     +'<p class="mcap" style="margin:8px 0 0">채널마다 다른 서식을 쓸 수 있어요.</p></div>'
     +'<div class="mc" style="padding:18px"><button class="mb mbp" style="width:100%;height:40px" id="r-hwp">한글(HWP) 공문으로 받기</button>'
     +'<div class="row" style="margin-top:8px;flex-wrap:nowrap"><button class="mb" style="flex:1" id="r-xls">엑셀 원자료</button><button class="mb" style="flex:1" id="r-pdf">PDF</button></div>'
     +'<p class="mcap" style="margin:10px 0 0">문서번호·수신·발신은 채널 설정값이 자동으로 채워져요. 내려받은 기록은 열람 기록에 남아요.</p></div></div>'
   +'<div class="doc" id="r-doc"></div></div>';
  var L=$('#r-l');
  RI.forEach(function(it){
    var lab=el('label','chk');
    lab.innerHTML='<span style="margin-top:1px">'+cbx(it[3]?'on':'off',it[0]+'. '+it[1])+'</span>'
     +'<span style="min-width:0"><span style="display:block;font-size:13.5px;font-weight:600;color:'+(it[3]?'#101828':'#69707C')+'">'+it[0]+'. '+it[1]+'</span>'
     +'<span class="mcap" style="display:block;margin-top:1px">'+it[2]+'</span>'
     +'<span class="src'+(it[5]?' ms':'')+'">'+it[4]+'</span></span>';
    lab.addEventListener('click',function(){it[3]=it[3]?0:1;V.report()});L.appendChild(lab)});
  $('#r-c').textContent=RI.filter(function(x){return x[3]}).length+' / 6';
  if($('#r-carry'))$('#r-carry').addEventListener('click',function(){openCarry(cg)});
  ['#r-hwp','#r-xls','#r-pdf'].forEach(function(s,i){$(s).addEventListener('click',function(){
    addAudit('리포트 생성','7월분','보건소 제출');toast(['한글 공문','엑셀 원자료','PDF'][i]+'을 내려받았어요','ok')})});
  var M='text-align:right;font-variant-numeric:tabular-nums';
  function dt(head,rows){return '<table class="dt"><thead><tr>'+head.map(function(x){return '<th>'+x+'</th>'}).join('')+'</tr></thead><tbody>'
    +rows.map(function(r){return '<tr>'+r.map(function(c){return '<td'+(c[1]?' style="'+c[1]+'"':'')+'>'+c[0]+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table>'}
  var S={};RI.forEach(function(x){S[x[0]]=x[3]});
  $('#r-doc').innerHTML='<h3>2026년도 스마트 어플 두뇌운동 치매예방교실<br>월간 운영 보고 (7월)</h3>'
   +'<p class="dm">수신 인천남동구 보건소 건강관리팀장 · 발신 ㈜원메딕스인더스트리 · 작성 2026-08-05</p><div class="rule"></div>'
   +(S[1]?'<h4>1. 월별 앱 업데이트 횟수</h4>'+dt(['구분','버전','배포일','주요 내용','이용자'],[
      [['Android'],['4.0.7','font-variant-numeric:tabular-nums'],['2026-07-09','font-variant-numeric:tabular-nums'],['걷기 챌린지 집계 오류 수정'],['284',M]],
      [['Android'],['4.0.6','font-variant-numeric:tabular-nums'],['2026-06-18','font-variant-numeric:tabular-nums'],['검사 등급·응답 전송 복원'],['283',M]],
      [['iOS'],['4.0.7','font-variant-numeric:tabular-nums'],['2026-07-11','font-variant-numeric:tabular-nums'],['동일'],['9',M]]])
     +'<p class="dn2">해당 월 배포 <b>2회</b>. 구버전(3.x) 잔류 32명에게 업데이트 안내 푸시 2회 발송.</p>':'')
   +(S[2]?'<h4>2. 위·수탁업체 관리·감독 점검표</h4>'+dt(['단계','점검 내용','판정','증빙'],[
      [['수집·이용'],['고유식별정보 미처리'],[pill('이행','ok')],['수집 항목 스키마']],
      [['관리'],['개인정보 암호화'],[pill('이행','ok')],['저장·전송 점검']],
      [['관리'],['접속기록 보관·위변조 방지'],[pill('이행','ok')],[CFG.locked.retainYears+'년 보관 · 해시 연결 검증']],
      [['관리'],['접속기록 월 1회 점검'],[auAllChecked()?pill('이행','ok'):pill('불이행','cr')],
        [auAllChecked()?'8월 점검 완료':'미점검 다운로드 있음']],
      [['관리'],['취급자 자동 접속차단'],[pill('이행','ok')],[CFG.locked.idleMin+'분 유휴 시 차단']],
      [['관리'],['취급자 정기 교육'],[pill('수기 확인','wa')],['이수증 첨부']]])
     +'<p class="dn2">18개 중 시스템이 증빙할 수 있는 6개만 자동 판정해요.</p>':'')
   +(S[3]?'<h4>3. 운영 현황</h4>'+dt(['지표','7월','6월','증감'],[
      [['대상자 수'],['822',M],['822',M],['—',M]],[['참여자 수'],['735',M],['741',M],['-6',M]],
      [['활동자 수'],['296',M],['284',M],['+12',M]],[['누적 중도포기'],['2',M],['2',M],['—',M]],
      [['총 활동 수'],['40,512',M],['38,940',M],['+1,572',M]],[['일평균 활동 수'],['1,350',M],['1,298',M],['+52',M]],
      [['인당 일평균 활동 수'],['4.56',M],['4.57',M],['-0.01',M]]]):'')
   +(S[4]?'<h4>4. 참여자 현황</h4>'+dt(['연령','인원','비율','성별','인원'],[
      [['60대'],['192',M],['26.1%',M],['여성'],['581',M]],[['70대'],['361',M],['49.1%',M],['남성'],['105',M]],
      [['80대 이상'],['132',M],['18.0%',M],['미상'],['49',M]]])
     +'<p class="dn2">월 접속자 429명, 1인당 월평균 접속일 10.2일. 걷기 기록자 550명, 일평균 6,355보.<br><b>참여 지속</b>: 개강 첫 주 시작자의 12주 후 잔존율 67.1%, 2주차 이후 22.4%.</p>':'')
   +(S[5]?'<h4>5. 운영 결과</h4>'+dt(['활동 유형','수행','완료','완료율'],[
      [['두뇌훈련'],['20,326',M],['15,650',M],['77.0%',M]],[['운동'],['16,200',M],['10,940',M],['67.5%',M]],
      [['마음다루기'],['3,986',M],['2,620',M],['65.7%',M]]]):'')
   +(S[6]?'<h4>6. 기타 / 특이사항</h4><p class="dn2" style="border:1px dashed #EAECF0;padding:12px;border-radius:8px">직접 입력하는 영역이에요. 현장 이슈, 민원, 장애, 다음 달 계획 등을 작성하세요.</p>':'')};

/* ══════ 참여 신청 ══════ */
var aFil={st:['pending','hold'],sg:[],per:''},aSort={key:'aged',dir:-1},aPager=mkPager(function(){V.apply(1)}),aq='',aSel={};
/* 승인 = 그룹 소속 스위치. 앱 가입 여부가 아니라 "지금 뭘 받고 있나"를 보여준다.
   승인했는데 미설치 = 승인해줬는데 아무것도 못 받는 중 → 유일한 실제 액션 대상.
   거절인데 가입함 = 기본 프로그램(미그룹) 이용 중 → 정상이므로 회색으로 조용히. */
function viaCell(a){
  return a.carry?pill('3기 이월','in')+'<div class="mcap">지난 기수 활동 '+a.carry+'일</div>'
                :'<span class="mt" style="color:#667085">직접 신청</span>'}
function progCell(a){
  var g=groupById(getGroup());
  if(a.st==='approved')return a.signed==='Y'
    ? pill(g.name.length>14?g.name.slice(0,13)+'…':g.name,'ok')
    : pill('없음 — 앱 미설치','cr');
  return a.signed==='Y'?pill('미그룹','nu'):'<span style="color:#98A2B3">없음</span>'}
V.apply=function(keep){
  var h=$('#v-apply');
  if(!keep){
    h.innerHTML=ph('참여 신청','기수 개강 때 접수된 신청을 승인하거나 보류해요.','<button class="mb" data-modal="m-bulk">엑셀 일괄 등록</button>')
     +kpi([['대기','111','건','가장 오래된 건 42일째','cr'],['보류','6','건','확인 후 다시 검토','wa'],
           ['승인','1,227','건',''],['거절','27','건',''],['승인했는데 앱 미설치','37','명','설치 안내가 필요해요','wa']])
     +note('<b>지금은 승인 여부와 상관없이 앱에 가입할 수 있어요.</b> 대기 111건 중 27명, 거절 27건 중 15명이 이미 가입해서 활동 중이에요. 승인을 앱 사용 조건으로 걸지 보건소와 정해야 해요.','cr')
     +'<div class="mc" style="overflow:hidden"><div style="padding:16px 20px;display:flex;flex-direction:column;gap:12px">'
       +'<div class="row">'+search('aq','이름, 전화 뒷자리, 주소로 찾기','300px')
       +'<span class="mcap" style="margin-left:4px">신청일</span><span class="row" id="a-per"></span>'
       +'<span style="margin-left:auto;font-size:13px;color:#667085">조건에 맞는 신청 <b class="mt" style="color:#101828" id="a-cnt">0</b>건</span></div>'
       +'<div class="row" id="a-chips"></div></div>'
       +'<div class="bulk" id="a-bulk"></div>'
       +'<div class="scroll"><table class="mtb"><thead><tr id="a-th"></tr></thead><tbody id="a-tb"></tbody></table></div>'
       +'<div id="a-empty"></div><div class="pager" id="a-pg"></div></div>';
    $('#aq').value=aq;
    $('#aq').addEventListener('input',function(){aq=this.value;aPager.page=1;V.apply(1)});
    $('#aq-x').addEventListener('click',function(){aq='';aPager.page=1;V.apply()});
    var per=$('#a-per');
    [['전체 기간',''],['최근 7일','7'],['이번 달','m'],['지난 달','p'],['30일 초과','30']].forEach(function(x){
      var b=el('button','mchip'+(aFil.per===x[1]?' on':''),x[0]);
      b.addEventListener('click',function(){aFil.per=aFil.per===x[1]?'':x[1];aPager.page=1;V.apply()});per.appendChild(b)});
    var cb=$('#a-chips');
    [['대기','st:pending',111],['보류','st:hold',6],['승인','st:approved',1227],['거절','st:rejected',27],['|'],
     ['가입함','sg:Y',1232],['미가입','sg:N',133]].forEach(function(c){
      if(c[0]==='|'){cb.appendChild(el('span','sep'));return}
      var t=c[1].slice(0,2),v=c[1].slice(3);
      var on=(t==='st'?aFil.st:aFil.sg).indexOf(v)>=0;
      var b=el('button','mchip'+(on?' on':''),c[0]+' <span class="c mt">'+fmt(c[2])+'</span>');
      b.addEventListener('click',function(){var arr=t==='st'?aFil.st:aFil.sg,i=arr.indexOf(v);
        if(i>=0)arr.splice(i,1);else arr.push(v);aPager.page=1;V.apply()});cb.appendChild(b)});
  }
  var list=APPS.filter(function(a){
    if(aFil.st.length&&aFil.st.indexOf(a.st)<0)return false;
    if(aFil.sg.length&&aFil.sg.indexOf(a.signed)<0)return false;
    if(aFil.per==='7'&&a.aged>7)return false;
    if(aFil.per==='m'&&a.aged>21)return false;
    if(aFil.per==='p'&&(a.aged<=21||a.aged>51))return false;
    if(aFil.per==='30'&&a.aged<=30)return false;
    if(aq)return (a.sur+a.end).indexOf(aq)>=0||a.tail.indexOf(aq)>=0||a.addr.indexOf(aq)>=0;
    return true});
  list=sortBy(list,aSort,function(a,k){return k==='name'?a.sur+a.end:k==='addr'?a.addr:k==='aged'?a.aged:0});
  $('#a-cnt').textContent=fmt(list.length);
  $('#aq-x').style.display=aq?'flex':'none';
  var nSel=Object.keys(aSel).length;
  var allOn=list.length&&list.every(function(a){return aSel[a.id]}),someOn=list.some(function(a){return aSel[a.id]});
  var th=$('#a-th');
  th.innerHTML='<th style="width:50px;padding-left:20px"><span id="a-all">'+cbx(allOn?'on':someOn?'mx':'off','이 페이지 전체 선택')+'</span></th>'
   +sth('이름','name',aSort)+'<th>연락처</th>'+sth('주소','addr',aSort)+sth('경과','aged',aSort,1)
   +'<th>경로</th><th>상태</th><th>받는 중인 프로그램</th><th>메모</th><th style="padding-right:20px;text-align:right">처리</th>';
  bindSort(th,aSort,function(){aPager.page=1;V.apply(1)});
  $('#a-all').addEventListener('click',function(){var on=!allOn;list.forEach(function(a){if(on)aSel[a.id]=1;else delete aSel[a.id]});V.apply(1)});
  var b=$('#a-bulk');
  if(nSel){b.className='bulk on';b.innerHTML='';
    b.appendChild(el('span',null,'<span style="font-size:13.5px;font-weight:700"><b class="mt">'+nSel+'</b>건 선택</span>'));
    [['승인','approved','mbp'],['보류','hold',''],['거절','rejected','mbd']].forEach(function(x){
      var btn=el('button','mb mbs '+x[2],x[0]+' ('+nSel+')');btn.style.background=x[2]==='mbp'?'#077A50':'#fff';
      btn.addEventListener('click',function(){bulkSet(x[1])});b.appendChild(btn)});
    var cl=el('button','lb','선택 해제');cl.style.marginLeft='auto';cl.addEventListener('click',function(){aSel={};V.apply(1)});b.appendChild(cl)}
  else{b.className='bulk';b.innerHTML=''}
  var rows=aPager.slice(list),tb=$('#a-tb');tb.innerHTML='';
  $('#a-empty').innerHTML=list.length?'':emptyBox('조건에 맞는 신청이 없어요','필터를 줄이거나 조건을 지워보세요');
  rows.forEach(function(a){
    var SP={pending:['대기','cr'],hold:['보류','wa'],approved:['승인','ok'],rejected:['거절','nu']}[a.st];
    var tr=el('tr',aSel[a.id]?'sel':'');
    var acts=a.st==='pending'?'<button class="mb mbx mbp ap">승인</button> <button class="mb mbx hd">보류</button> <button class="mb mbx rj" style="color:#B42318">거절</button>'
      :a.st==='hold'?'<button class="mb mbx mbp ap">승인</button> <button class="mb mbx rj" style="color:#B42318">거절</button>'
      :'<button class="mb mbx rv2" style="color:#667085">되돌리기</button>';
    tr.innerHTML='<td style="padding-left:20px">'+cbx(aSel[a.id]?'on':'off',a.name+' 선택')+'</td>'
     +'<td style="font-weight:600">'+a.name+'</td><td class="mt" style="color:#475467">'+a.phone+'</td>'
     +'<td style="color:#475467">'+a.addr+'</td>'
     +'<td class="num mt"'+(a.aged>30?' style="color:#B42318;font-weight:700"':'')+'>'+a.aged+'일</td>'
     +'<td>'+viaCell(a)+'</td><td>'+pill(SP[0],SP[1])+'</td><td>'+progCell(a)+'</td>'
     +'<td class="mcap">'+(a.memo||'—')+'</td>'
     +'<td style="text-align:right;padding-right:20px">'+acts+'</td>';
    tr.querySelector('.cbx').addEventListener('click',function(e){e.stopPropagation();if(aSel[a.id])delete aSel[a.id];else aSel[a.id]=1;V.apply(1)});
    function act(sel,to,label){var b2=tr.querySelector(sel);if(!b2)return;
      b2.addEventListener('click',function(){var was=a.st;a.st=to;if(to!=='hold')a.memo=to==='rejected'?'중복 신청':'';V.apply(1);
        toast(a.name+'님 신청을 '+label+'했어요','ok','되돌리기',function(){a.st=was;V.apply(1)})})}
    act('.ap','approved','승인');act('.hd','hold','보류');act('.rj','rejected','거절');act('.rv2','pending','대기로 되돌리기');
    tb.appendChild(tr)});
  aPager.render($('#a-pg'))};
function bulkSet(to){
  var ids=Object.keys(aSel),prev={};
  ids.forEach(function(id){var a=APPS.filter(function(x){return x.id===id})[0];if(a){prev[id]=a.st;a.st=to}});
  aSel={};V.apply(1);
  addAudit('신청 일괄 처리',ids.length+'건',{approved:'승인',hold:'보류',rejected:'거절'}[to]);
  toast(ids.length+'건을 '+{approved:'승인',hold:'보류',rejected:'거절'}[to]+'했어요','ok','되돌리기',function(){
    ids.forEach(function(id){var a=APPS.filter(function(x){return x.id===id})[0];if(a)a.st=prev[id]});V.apply(1)})}

/* ══════ 열람 기록 ══════ */
var auFil=[],auSort={key:'t',dir:-1},auPager=mkPager(function(){V.audit()});
/* ══════ 우리 채널 운영자 ══════
   한 운영자는 한 채널만. 그래서 자기 채널 사람만 보인다.
   역할은 계정이 아니라 자리에 붙으므로 '권한'은 자리 수의 요약이다. */
V.chops=function(){
  var h=$('#v-chops');
  var mine=OPERATORS.filter(function(o){return o.ch===CH_SELF});
  var dormant=mine.filter(function(o){return o.st==='휴면'});
  h.innerHTML=ph('우리 채널 운영자','주관리자가 부관리자를 초대할 수 있어요.',
    '<button class="mb mbp" id="co-new">부관리자 초대</button>')
   +note('<b>역할은 계정이 아니라 자리에 붙어요.</b> 한 사람이 A그룹에서는 주관리자, B그룹에서는 부관리자일 수 있어요. '
     +'그리고 <b>한 사람은 한 채널만</b> 맡아요 — 다른 채널 운영자는 여기 안 보여요.','in')
   +(dormant.length?note('<b>'+CFG.locked.dormantDays+'일 넘게 접속하지 않은 운영자가 '+dormant.length+'명 있어요.</b> '
     +dormant.map(function(o){return o.name+'('+(ownedBy(o.name).length?ownedBy(o.name).join(', '):'자리 없음')+')'}).join(' · ')
     +' — 전보·퇴직이면 <b>지체 없이</b> 권한을 넘기고 계정을 비활성해주세요.','cr'):'')
   +kpi([['우리 채널 운영자',fmt(mine.length),'명'],
         ['주관리자 자리를 가진 사람',fmt(mine.filter(function(o){return assignments(o.name).some(function(x){return x.role==='owner'})}).length),'명'],
         ['휴면',fmt(dormant.length),'명',dormant.length?'권한 정리 필요':'','wa'],
         ['주관리자 없는 그룹',fmt(M.noOwnerGroup()),'개','','cr']])
   +'<div class="mc" style="overflow:hidden">'+chead('권한 3단계')
   +'<div style="padding:0 20px 18px"><div class="scroll"><table class="mtb"><thead><tr>'
   +'<th style="padding-left:0">권한</th><th>범위</th><th>개인정보 원문</th><th>탈퇴·승인·거절</th><th>계정 관리</th></tr></thead><tbody>'
   +'<tr><td style="padding-left:0">'+pill('주관리자','ok')+'</td><td>맡은 그룹·기관의 모든 기능</td>'
   +'<td>'+pill('가능','ok')+'</td><td>'+pill('가능','ok')+'</td><td class="mt" style="color:#475467">부관리자 초대</td></tr>'
   +'<tr><td style="padding-left:0">'+pill('부관리자','nu')+'</td><td>열어준 메뉴만</td>'
   +'<td>'+pill('가능','ok')+'</td><td>'+pill('불가','cr')+'</td><td class="mt" style="color:#98A2B3">없음</td></tr>'
   +'<tr><td style="padding-left:0">'+pill('시스템관리자','in')+'</td><td>전 채널 · 원메딕스</td>'
   +'<td>'+pill('가능','ok')+'</td><td>'+pill('가능','ok')+'</td><td class="mt" style="color:#475467">주·부 초대/삭제/수정</td></tr>'
   +'</tbody></table></div></div></div>'
   +note('<b>권한 이전은 그 자리의 부관리자에게만 됩니다.</b> 받을 사람이 먼저 그 그룹의 부관리자로 초대돼 있어야 하고, '
     +'<b>부관리자가 없는 자리는 이전이 막혀요.</b> 넘긴 사람은 부관리자로 남아서 과거 상담 이력이 끊기지 않아요.','in')
   +'<div class="mc" style="overflow:hidden"><div class="scroll"><table class="mtb"><thead><tr>'
   +'<th style="padding-left:20px">이름</th><th>권한</th><th>맡은 자리</th>'
   +'<th>마지막 접속</th><th>상태</th><th style="padding-right:20px;text-align:right">관리</th>'
   +'</tr></thead><tbody id="co-tb"></tbody></table></div></div>'
   +'<div class="mc" style="overflow:hidden">'+chead('권한 변경 이력')
   +'<div class="mcap" style="padding:0 20px 10px">부여·변경·말소를 <b>'+CFG.locked.permYears+'년</b> 보관해요. '
   +'열람 기록('+CFG.locked.retainYears+'년)과 기간이 달라서 따로 쌓아요.</div>'
   +'<div class="scroll"><table class="mtb"><thead><tr><th style="padding-left:20px">일시</th>'
   +'<th>처리자</th><th>행위</th><th>대상</th><th style="padding-right:20px">내용</th></tr></thead><tbody>'
   +PERMLOG.map(function(x){return '<tr><td class="mt" style="padding-left:20px;color:#475467">'+x.at+'</td>'
     +'<td style="font-weight:600">'+esc(x.who)+'</td><td>'+pill(x.act,x.act==='계정 생성'?'in':'nu')+'</td>'
     +'<td>'+esc(x.tgt)+'</td><td style="color:#475467;padding-right:20px">'+esc(x.detail)+'</td></tr>'}).join('')
   +'</tbody></table></div></div>';
  $('#co-new').addEventListener('click',function(){toast('이메일을 입력받아 부관리자 초대를 보내요')});
  var tb=$('#co-tb');tb.innerHTML='';
  mine.forEach(function(o){
    var as=assignments(o.name);
    var nOwn=as.filter(function(x){return x.role==='owner'}).length;
    var nSub=as.filter(function(x){return x.role==='sub'}).length;
    var role=(nOwn||nSub)?[nOwn?pill('주관리자 '+nOwn,'ok'):'',nSub?pill('부관리자 '+nSub,'nu'):''].filter(Boolean).join(' ')
      :'<span style="color:#98A2B3">자리 없음</span>';
    var seats=as.length?as.map(function(x){
        return '<span class="mcap" style="display:inline-block;margin-right:8px">'
          +(x.role==='owner'?'<b style="color:#067647">주</b>':'<span style="color:#667085">부</span>')
          +' '+esc(x.name)+'</span>'}).join('')
      :'<span style="color:#98A2B3">없음</span>';
    var tr=el('tr');
    tr.innerHTML='<td style="padding-left:20px"><b>'+esc(o.name)+'</b></td><td>'+role+'</td><td>'+seats+'</td>'
     +'<td class="mt" style="color:'+(o.st==='휴면'?'#B54708':'#667085')+'">'+o.last+'</td>'
     +'<td>'+pill(o.st,o.stK)+'</td><td style="padding-right:20px;text-align:right"></td>';
    var act=tr.lastChild;
    if(nOwn){var b=el('button','mb mbx','권한 이전');
      b.addEventListener('click',function(){openHandover(o)});act.appendChild(b)}
    if(o.st==='휴면'){var bl=el('button','mb mbd mbx','계정 비활성');bl.style.marginLeft='6px';
      bl.addEventListener('click',function(){
        o.st='비활성';o.stK='cr';
        addPermLog('권한 말소',o.name,CFG.locked.dormantDays+'일 미접속 · 계정 비활성');
        addAudit('계정 비활성','1건','휴면 계정 정리',[o.name]);
        V.chops();toast(o.name+' 계정을 비활성했어요. 접속과 원문 열람이 막혀요','ok')});
      act.appendChild(bl)}
    tb.appendChild(tr)})};

/* 권한 이전 — 자리마다 따로. 그 자리의 부관리자가 없으면 그 줄만 막는다. */
function openHandover(o){
  var seats=assignments(o.name).filter(function(a){return a.role==='owner'});
  var b=el('div');b.style.cssText='display:flex;flex-direction:column;gap:12px';
  b.appendChild(el('p','mcap','<b>'+esc(o.name)+'</b>님이 주관리자인 자리 '+seats.length+'개예요. '
    +'넘길 자리를 고르고 받을 부관리자를 정해주세요.'));
  var picks={},blocked=0;
  seats.forEach(function(a){
    var cand=subsAt(a).filter(function(n){return n!==o.name});
    var row=el('div');
    row.style.cssText='border:1px solid #EAECF0;border-radius:8px;padding:11px 13px';
    if(!cand.length){
      blocked++;
      row.style.background='#FEF3F2';row.style.borderColor='#FECDCA';
      row.innerHTML='<div style="font-weight:600">'+esc(a.name)+'</div>'
       +'<div class="mcap" style="margin-top:3px;color:#B42318">이 자리에 부관리자가 없어서 넘길 수 없어요. '
       +'받을 분을 먼저 이 '+(a.kind==='group'?'그룹':'기관')+'의 부관리자로 초대해주세요.</div>';
    }else{
      row.innerHTML='<div style="font-weight:600;margin-bottom:7px">'+esc(a.name)+'</div>';
      var sel=el('select','mfld');sel.style.width='100%';
      sel.innerHTML='<option value="">넘기지 않음</option>'
        +cand.map(function(n){return '<option>'+esc(n)+'</option>'}).join('');
      sel.addEventListener('change',function(){picks[a.name]=this.value?{a:a,to:this.value}:null});
      row.appendChild(sel)}
    b.appendChild(row)});
  if(blocked)b.appendChild(el('div',null,note('부관리자가 없는 자리 <b>'+blocked+'개</b>는 이번에 못 넘겨요.','wa')));
  var err=el('div');err.style.cssText='font-size:12.5px;color:#B42318;display:none';
  err.textContent='넘길 자리를 하나 이상 골라주세요.';b.appendChild(err);
  var m=modalBox('권한 이전',b);
  var f=m.querySelector('.mfoot');f.innerHTML='<button class="mb" data-close>취소</button>';
  if(blocked===seats.length){
    var inv=el('button','mb mbp','부관리자 초대하기');
    inv.addEventListener('click',function(){closeAll();toast('초대할 이메일을 입력받아요')});
    f.appendChild(inv);return}
  var ok=el('button','mb mbp','넘기기');
  ok.addEventListener('click',function(){
    var done=[];
    Object.keys(picks).forEach(function(k){
      var pk=picks[k];if(!pk)return;
      var ref=pk.a.ref,to=pk.to;
      ref.owner=to;
      var i=ref.subs.indexOf(to);if(i>=0)ref.subs.splice(i,1);
      if(ref.subs.indexOf(o.name)<0)ref.subs.push(o.name);
      done.push(pk.a.name+' → '+to)});
    if(!done.length){err.style.display='block';return}
    addAudit('권한 이전',done.length+'개 자리',o.name+' 인사이동');
    done.forEach(function(d2){addPermLog('권한 이전',d2.split(' → ')[1],d2)});
    closeAll();V.chops();
    toast(done.join(' · ')+' 넘겼어요','ok','실행 취소',null)});
  f.appendChild(ok)}

/* ══════ 운영팀 문의 ══════
   맬리 파트너의 '채널 문의' ↔ 슈퍼의 '채널 1:1 문의' 쌍을 그대로 따른다.
   채널이 Own 에 속한 것(그룹 생성·콘텐츠·설정 잠금값)을 바꾸려면 여기로 온다. */
var CXQ=[
 {id:'q1',at:'2026-08-20 11:04',cat:'그룹 생성',t:'4기 개강일을 11월 2일로 잡아주세요',
  st:'답변 완료',k:'ok',by:'김주무',ans:'11/2 개강으로 생성했어요. 신청 접수를 열어뒀습니다.'},
 {id:'q2',at:'2026-08-18 15:22',cat:'설정 변경',t:'상담 자동 이관을 3일에서 5일로 늘려주세요',
  st:'검토 중',k:'wa',by:'김주무',ans:''},
 {id:'q3',at:'2026-08-11 09:40',cat:'콘텐츠',t:'경로당용 저강도 운동 편성이 필요해요',
  st:'답변 완료',k:'ok',by:'정미경',ans:'저강도 템플릿을 추가했어요. 프로그램 일정에서 고르시면 돼요.'}];
V.cx=function(){
  var h=$('#v-cx');
  var open2=CXQ.filter(function(q){return q.st!=='답변 완료'}).length;
  h.innerHTML=ph('운영팀 문의','채널에서 못 바꾸는 건 여기로 요청해요.',
    '<button class="mb mbp" id="cx-new">문의 보내기</button>')
   +note('<b>그룹 만들기·콘텐츠 편성·잠긴 설정값</b>은 원메딕스가 관리해요(Own). '
     +'여기로 보내면 운영팀 화면에 쌓이고, 처리 결과가 다시 여기로 와요.','in')
   +kpi([['답변 기다리는 문의',fmt(open2),'건',open2?'':'모두 처리됐어요',open2?'wa':'ok'],
         ['이번 달 보낸 문의',fmt(CXQ.length),'건'],
         ['평균 회신','1.8','일'],['처리 완료',fmt(CXQ.length-open2),'건']])
   +'<div class="mc" style="overflow:hidden"><div class="scroll"><table class="mtb"><thead><tr>'
   +'<th style="padding-left:20px">보낸 날</th><th>분류</th><th>내용</th><th>보낸 사람</th>'
   +'<th style="padding-right:20px">상태</th></tr></thead><tbody id="cx-tb"></tbody></table></div></div>';
  $('#cx-new').addEventListener('click',openCx);
  var tb=$('#cx-tb');tb.innerHTML='';
  CXQ.forEach(function(q){
    var tr=el('tr','clk');
    tr.innerHTML='<td class="mt" style="padding-left:20px;color:#475467">'+q.at+'</td>'
     +'<td>'+pill(q.cat,'nu')+'</td>'
     +'<td><b style="font-weight:600">'+esc(q.t)+'</b>'
       +(q.ans?'<div class="mcap" style="margin-top:3px;color:#067647">↳ '+esc(q.ans)+'</div>':'')+'</td>'
     +'<td class="mt" style="color:#475467">'+esc(q.by)+'</td>'
     +'<td style="padding-right:20px">'+pill(q.st,q.k)+'</td>';
    tb.appendChild(tr)})};
function openCx(){
  var b=el('div');b.style.cssText='display:flex;flex-direction:column;gap:13px';
  b.innerHTML='<div><span class="flab">분류 <span style="color:#B42318">*</span></span>'
   +'<select class="mfld" id="cx-c" style="width:100%">'
   +'<option value="">고르세요</option><option>그룹 생성</option><option>콘텐츠</option>'
   +'<option>설정 변경</option><option>계정·권한</option><option>오류 신고</option><option>기타</option></select></div>'
   +'<div><span class="flab">내용 <span style="color:#B42318">*</span></span>'
   +'<textarea class="mfld" id="cx-t" style="width:100%;height:92px;padding:9px 11px" '
   +'placeholder="무엇을 어떻게 바꾸고 싶은지 적어주세요"></textarea></div>'
   +note('문의와 처리 결과는 <b>열람 기록</b>에 남아요.','in');
  var err=el('div');err.style.cssText='font-size:12.5px;color:#B42318;display:none';
  err.textContent='분류와 내용을 모두 적어주세요.';b.appendChild(err);
  var m=modalBox('운영팀에 문의 보내기',b);
  var f=m.querySelector('.mfoot');f.innerHTML='<button class="mb" data-close>취소</button>';
  var ok=el('button','mb mbp','보내기');
  ok.addEventListener('click',function(){
    var c=$('#cx-c').value,t=$('#cx-t').value.trim();
    if(!c||!t){err.style.display='block';return}
    CXQ.unshift({id:'q'+Date.now(),at:'2026-08-21 지금',cat:c,t:t,st:'접수됨',k:'in',by:'김주무',ans:''});
    addAudit('운영팀 문의','1건',c+' · '+t.slice(0,20));
    closeAll();V.cx();toast('문의를 보냈어요. 보통 2일 안에 회신돼요','ok')});
  f.appendChild(ok)}

var auTab='log',auChk={};
/* 점검표 판정의 근거 — 화면 상태가 그대로 증빙이 되게 */
function auAllChecked(){
  return AUDIT.filter(function(a){return /내려받기|다운로드/.test(a[4])})
    .every(function(a){return a[9]||auChk[a[0]]})}
A.auAllChecked=auAllChecked;
V.audit=function(){
  var H=$('#v-audit');
  var dls=AUDIT.filter(function(a){return /내려받기|다운로드/.test(a[4])});
  var undone=dls.filter(function(a){return !a[9]&&!auChk[a[0]]}).length;
  H.innerHTML=ph('열람 기록','개인정보를 열람하거나 내려받은 이력이에요. '+CFG.locked.retainYears+'년간 보관돼요.',
    '<button class="mb" id="au-dl">점검표 증빙용 내려받기</button>')
   +note('민감정보를 처리하는 시스템이라 접속기록을 <b>'+CFG.locked.retainYears+'년</b> 보관해요. 일반 개인정보는 1년이에요. '
     +'기록에는 <b>계정 · 일시 · 접속지 · 처리한 정보주체 · 수행업무</b>가 모두 남아요.','in')
   +kpi([['이번 달 열람',fmt(AUDIT.length),'건'],['명단 내려받기',fmt(dls.length),'회'],
         ['점검 안 한 다운로드',fmt(undone),'건',undone?'월 1회 점검이 필요해요':'모두 확인했어요',undone?'cr':'ok'],
         ['사유 없이 열람','0','건','사유는 반드시 남겨야 해요','ok']])
   +'<div class="mc" style="overflow:hidden"><div class="tabs" id="au-tabs"></div><div id="au-body"></div></div>';
  $('#au-dl').addEventListener('click',function(){toast('증빙용 파일을 내려받았어요','ok')});
  var tb=$('#au-tabs');
  [['log','기록'],['chk','월간 점검'+(undone?' ('+undone+')':'')],['int','무결성']].forEach(function(x){
    var b=el('button','tab',x[1]);b.setAttribute('aria-selected',auTab===x[0]?'true':'false');
    b.addEventListener('click',function(){auTab=x[0];V.audit()});tb.appendChild(b)});
  var B=$('#au-body');
  if(auTab==='log')auLog(B); else if(auTab==='chk')auCheck(B,dls); else auIntegrity(B)};

function auLog(B){
  B.innerHTML='<div class="row" style="padding:16px 20px" id="au-f"></div>'
   +'<div class="scroll"><table class="mtb"><thead><tr id="au-th"></tr></thead><tbody id="au-tb"></tbody></table></div>'
   +'<div class="pager" id="au-pg"></div>';
  var acts={};AUDIT.forEach(function(a){acts[a[4]]=(acts[a[4]]||0)+1});
  var f=$('#au-f');
  Object.keys(acts).forEach(function(k){
    var b=el('button','mchip'+(auFil.indexOf(k)>=0?' on':''),k+' <span class="c mt">'+acts[k]+'</span>');
    b.addEventListener('click',function(){var i=auFil.indexOf(k);if(i>=0)auFil.splice(i,1);else auFil.push(k);
      auPager.page=1;V.audit()});f.appendChild(b)});
  var th=$('#au-th');
  th.innerHTML=sth('일시','t',auSort)+sth('담당자','w',auSort)+'<th>소속</th>'+sth('수행업무','a',auSort)
   +'<th class="num">건수</th><th>처리한 정보주체</th><th>사유</th><th style="padding-right:20px">접속지</th>';
  bindSort(th,auSort,function(){auPager.page=1;V.audit()});
  var list=AUDIT.filter(function(a){return !auFil.length||auFil.indexOf(a[4])>=0});
  list=sortBy(list,auSort,function(a,k){return k==='t'?a[0]:k==='w'?a[1]:a[4]});
  var rows=auPager.slice(list),tb=$('#au-tb');tb.innerHTML='';
  rows.forEach(function(a){
    var subj=a[8]||['—'];
    var cell=subj.length===1?esc(subj[0])
      :'<b style="font-weight:600">'+subj.length+'명</b> <button class="mb mbx au-more">보기</button>';
    var tr=el('tr',null,'<td class="mt" style="padding-left:20px;color:#475467">'+a[0]+'</td>'
     +'<td style="font-weight:600">'+a[1]+'</td><td>'+(a[3]?pill(a[2],'in'):'<span style="color:#667085">'+a[2]+'</span>')+'</td>'
     +'<td>'+a[4]+'</td><td class="num mt" style="color:#475467">'+a[5]+'</td>'
     +'<td class="mt" style="color:#475467;max-width:240px">'+cell+'</td>'
     +'<td style="color:#475467">'+a[6]+'</td>'
     +'<td class="mt" style="color:#98A2B3;padding-right:20px">'+a[7]+'</td>');
    var more=tr.querySelector('.au-more');
    if(more)more.addEventListener('click',function(){
      var b2=el('div');b2.innerHTML='<p class="mcap">'+a[0]+' · '+a[4]+'</p>'
        +'<div style="margin-top:10px;display:flex;flex-direction:column;gap:6px">'
        +subj.map(function(x){return '<div style="padding:8px 11px;background:#F9FAFB;border-radius:7px;font-size:13.5px">'+esc(x)+'</div>'}).join('')+'</div>';
      modalBox('처리한 정보주체',b2)});
    tb.appendChild(tr)});
  auPager.render($('#au-pg'))}

/* 월 1회 점검 — 보관만으로는 부족하고 점검 기록이 남아야 증빙이 된다 */
function auCheck(B,dls){
  B.innerHTML='<div class="mcap" style="padding:14px 20px 0">고시는 접속기록을 <b>월 1회 이상 점검</b>하고, '
   +'특히 개인정보를 내려받은 건은 사유가 업무 목적에 맞는지 확인하라고 해요. 확인하면 점검자와 일시가 남아요.</div>'
   +'<div class="scroll"><table class="mtb"><thead><tr><th style="padding-left:20px">일시</th><th>담당자</th>'
   +'<th>수행업무</th><th class="num">건수</th><th>사유</th><th>점검</th>'
   +'<th style="padding-right:20px;text-align:right">확인</th></tr></thead><tbody id="ac-tb"></tbody></table></div>'
   +'<div style="padding:16px 20px;border-top:1px solid #F2F4F7;display:flex;align-items:center;gap:12px">'
   +'<span class="mcap" style="flex:1">8월 점검 담당 · 김주무 주무관</span>'
   +'<button class="mb mbp" id="ac-done">8월 점검 완료 처리</button></div>';
  var tb=$('#ac-tb');tb.innerHTML='';
  if(!dls.length)tb.innerHTML='<tr><td colspan="7">'+emptyBox('이번 달 내려받기가 없어요','점검할 건이 없어요')+'</td></tr>';
  dls.forEach(function(a){
    var ok=a[9]||auChk[a[0]];
    var tr=el('tr');
    tr.innerHTML='<td class="mt" style="padding-left:20px;color:#475467">'+a[0]+'</td>'
     +'<td style="font-weight:600">'+a[1]+'</td><td>'+a[4]+'</td>'
     +'<td class="num mt">'+a[5]+'</td><td style="color:#475467">'+a[6]+'</td>'
     +'<td>'+(ok?pill('확인함','ok'):pill('미점검','cr'))+'</td>'
     +'<td style="padding-right:20px;text-align:right"></td>';
    if(!ok){var b=el('button','mb mbx','사유 적정 확인');
      b.addEventListener('click',function(){auChk[a[0]]=1;V.audit();toast('점검 기록을 남겼어요','ok')});
      tr.lastChild.appendChild(b)}
    else tr.lastChild.innerHTML='<span class="mcap">김주무 · 확인 완료</span>';
    tb.appendChild(tr)});
  $('#ac-done').addEventListener('click',function(){
    dls.forEach(function(a){auChk[a[0]]=1});
    addAudit('접속기록 점검',dls.length+'건','월 1회 정기 점검',['집계값만 · 개별 식별 없음']);
    V.audit();toast('8월 점검을 완료했어요. 점검표 증빙에 들어가요','ok')})}

/* 위·변조 방지 — 기록을 남기는 것만으로는 부족하다 */
function auIntegrity(B){
  B.innerHTML='<div style="padding:18px 20px;display:flex;flex-direction:column;gap:14px">'
   +note('접속기록은 <b>남기는 것</b>만으로는 부족하고 <b>위·변조되지 않게 보관</b>해야 해요. '
     +'어드민에서 기록을 지우거나 고칠 수 있으면 증빙 가치가 없어요.','in')
   +'<div class="scroll"><table class="mtb"><thead><tr><th style="padding-left:20px">점검 항목</th>'
   +'<th>상태</th><th style="padding-right:20px">설명</th></tr></thead><tbody>'
   +[['기록 수정·삭제 차단',1,'어드민에 수정·삭제 기능이 없어요. 읽기와 내려받기만 됩니다.'],
     ['무결성 검증값 저장',1,'기록마다 해시를 저장하고 앞 기록과 연결해요. 중간을 지우면 검증이 깨져요.'],
     ['최근 검증',1,'오늘 03:00 자동 검증 · 이상 없음'],
     ['보관기간',1,CFG.locked.retainYears+'년 — 민감정보 처리 시스템 기준'],
     ['백업 분리 보관',0,'서버 영역이에요. 인프라 담당 확인이 필요해요.']].map(function(x){
     return '<tr><td style="padding-left:20px;font-weight:600">'+x[0]+'</td>'
      +'<td>'+(x[1]?pill('이행','ok'):pill('미확인','nu'))+'</td>'
      +'<td style="color:#475467;padding-right:20px">'+x[2]+'</td></tr>'}).join('')
   +'</tbody></table></div>'
   +'<p class="mcap">이 상태가 월간 리포트의 <b>관리·감독 점검표</b>에 그대로 들어가요.</p></div>'};

/* ═══ 전역 검색 ═══
   PIN 을 '전화 응대용 조회번호'로 정의해놓고 정작 어디서든 칠 곳이 없었다.
   전화 받은 채로 메뉴를 들어가게 하지 않는다.
   결과는 마스킹 상태로 보이고, 열려면 사유를 받는다 — 상세 진입과 같은 규칙. */
function gsRun(q){
  var box=$('#gs-res');if(!box)return;
  q=(q||'').trim();
  if(q.length<2){box.classList.remove('on');box.innerHTML='';return}
  var low=q.toLowerCase();
  var ppl=PEOPLE.filter(function(p){
    return p.pin.indexOf(q)===0||p.tail.indexOf(q)===0||p.name.indexOf(q)>=0||p.full.indexOf(q)>=0}).slice(0,6);
  var grp=GROUPS.filter(function(g){return !g.ghost&&g.ch===CH_SELF&&g.name.toLowerCase().indexOf(low)>=0}).slice(0,3);
  box.innerHTML='';
  if(!ppl.length&&!grp.length){
    box.innerHTML='<div class="ge">‘'+esc(q)+'’으로 찾은 게 없어요<br>'
      +'<span class="mcap">이름 · PIN · 전화 뒷자리로 찾을 수 있어요</span></div>';
    box.classList.add('on');return}
  if(ppl.length){
    box.appendChild(el('div','gh','참여자 '+ppl.length));
    ppl.forEach(function(p){
      var b=el('button');b.type='button';
      b.innerHTML='<span style="flex:1;min-width:0"><span class="gn">'+esc(p.name)+'</span>'
        +'<span class="gm">PIN '+p.pin+' · '+p.phone+' · '+esc(p.org)+'</span></span>'
        +pill(p.status==='active'?'참여 중':p.status==='dropped'?'중도포기':'만료',
              p.status==='active'?'nu':p.status==='dropped'?'cr':'wa');
      b.addEventListener('click',function(){gsClose();A.askOpen(p,'people')});
      box.appendChild(b)})}
  if(grp.length){
    box.appendChild(el('div','gh','프로그램 그룹 '+grp.length));
    grp.forEach(function(g){
      var b=el('button');b.type='button';
      b.innerHTML='<span style="flex:1;min-width:0"><span class="gn">'+esc(g.name)+'</span>'
        +'<span class="gm">'+KIND[g.kind][0]+' · 대상자 '+fmt(g.n)+'명</span></span>'+pill(g.st,g.k);
      b.addEventListener('click',function(){gsClose();putGroup(g.id);go('groups')});
      box.appendChild(b)})}
  box.classList.add('on')}
function gsClose(){var b=$('#gs-res');if(b)b.classList.remove('on');var i=$('#gs');if(i)i.value=''}
if($('#gs')){
  $('#gs').addEventListener('input',function(){gsRun(this.value)});
  $('#gs').addEventListener('keydown',function(e){
    if(e.key==='Escape'){gsClose();this.blur()}
    if(e.key==='Enter'){var b=$('#gs-res button');if(b)b.click()}});
  document.addEventListener('mousedown',function(e){
    if(!e.target.closest('#gs-wrap')){var r=$('#gs-res');if(r)r.classList.remove('on')}});
  /* 어디서든 / 로 검색 */
  document.addEventListener('keydown',function(e){
    if(e.key==='/'&&!/^(INPUT|TEXTAREA|SELECT)$/.test((e.target.tagName||''))){
      e.preventDefault();$('#gs').focus()}})}

/* ══════ init ══════ */
/* 세션 만료 시 열려 있던 원문을 닫는다 */
A.SESS.onExpire=function(){
  $$('.mask.on').forEach(function(m){if(m.id!=='m-locked'&&m.id!=='m-idle')m.classList.remove('on')});
  if(window.__closeReveal)window.__closeReveal();
  if(V[A.cur()])V[A.cur()]()};
if($('#idle-stay')){
  $('#idle-stay').addEventListener('click',function(){A.sessReset();toast('세션을 연장했어요')});
  $('#idle-out').addEventListener('click',function(){
    if(A.SESS.onExpire)A.SESS.onExpire();
    $('#m-idle').classList.remove('on');$('#m-locked').classList.add('on')});
  var failN=0;
  $('#lock-in').addEventListener('click',function(){
    var v=$('#m-locked input').value;
    if(v!=='••••••••'){                       /* 값을 바꿨으면 틀린 것으로 본다 */
      failN++;
      var left=A.CFG.locked.failLock-failN;
      if(left<=0){
        $('#lock-msg').innerHTML='<span style="color:#B42318;font-weight:600">계정이 잠겼어요. 주관리자에게 요청하세요</span>';
        $('#lock-in').disabled=true;
        addAudit('계정 잠금',A.CFG.locked.failLock+'회 실패','로그인 연속 실패',['김주무']);
        return}
      $('#lock-msg').innerHTML='<span style="color:#B42318">비밀번호가 달라요 · '+left+'회 남음</span>';
      return}
    failN=0;$('#lock-msg').textContent='';
    $('#m-locked').classList.remove('on');A.sessReset();
    addAudit('로그인','세션 재개','자동 로그아웃 후 재인증');
    toast('다시 로그인했어요','ok')});
  A.sessStart()}
A.buildNav();
go('today');
})(App);
