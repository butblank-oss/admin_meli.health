/* 참여자 찾기 / 참여자 상세 — 전 채널.
   16204b2 에서 '모든 DB를 가진 쪽이 못 보면 안 된다'로 정책이 바뀌어
   운영팀도 좌석 권한 + 사유로 원문을 열람한다. 이 화면이 그 정책의 실체다.
   문지기와 열람 모델은 채널 어드민(assets/js/views-people.js)과 똑같다 —
   동의 · 권한 · 사유, 상세 진입 = 열람, 목록으로 나가면 다시 가림, 전부 기록. */
(function(A){
"use strict";
var $=A.$,el=A.el,esc=A.esc,fmt=A.fmt,pill=A.pill,note=A.note,kpi=A.kpi,
    ph=A.ph,search=A.search,sth=A.sth,bindSort=A.bindSort,sortBy=A.sortBy,
    mkPager=A.mkPager,toast=A.toast,closeAll=A.closeAll,go=A.go,V=A.V,modalBox=A.modalBox,
    CHANNELS=A.CHANNELS,byCh=A.byCh,chChip=A.chChip,chName=A.chName,PEOPLE=A.PEOPLE;

var ST={active:['참여 중','ok'],dropped:['중도포기','wa'],expired:['만료','nu']};
function statusPill(p){var s=ST[p.status]||ST.active;return pill(s[0],s[1])}

/* ══════ 목록 ══════ */
var pq='',pFil=[],pSort={key:'',dir:1},pPager=mkPager(function(){V.people(1)});
function tog(v){var i=pFil.indexOf(v);if(i>=0)pFil.splice(i,1);else pFil.push(v);pPager.page=1;V.people()}
function filterP(){
  function sub(pre){return pFil.filter(function(v){return v.indexOf(pre)===0}).map(function(v){return v.slice(pre.length)})}
  var ch=sub('ch:'),st=sub('st:'),cs=sub('cs:');
  return PEOPLE.filter(function(p){
    if(ch.length&&ch.indexOf(p.ch)<0)return false;
    if(st.length&&st.indexOf(p.status)<0)return false;
    if(cs.length&&!cs.some(function(v){
      return v==='none'?(!p.consent.sensitive&&!p.consent.revoked):!!p.consent.revoked}))return false;
    if(pq)return p.full.indexOf(pq)>=0||p.tail.indexOf(pq)>=0||p.pin.indexOf(pq)>=0;
    return true})}
V.people=function(keep){
  var h=$('#v-people');
  if(!keep){
    h.innerHTML=ph('참여자 찾기','전 채널 '+fmt(PEOPLE.length)+'명 — 본인 확인·CS 대응용이에요. 이름을 누르면 사유를 받고 곧바로 상세가 열려요.','')
     +note('<b>운영팀 열람도 채널과 같은 문지기를 지나요</b> — 동의 · 좌석 권한 · 사유. 열람은 채널 담당자와 <b>같은 장부</b>에 남고, 이상 열람 탐지가 같은 기준으로 감시합니다. 운영팀이라고 다른 장부를 쓰면 감사가 운영팀만 비켜 가요.','in')
     +'<div class="mc" style="padding:16px 20px;display:flex;flex-direction:column;gap:12px">'
       +'<div class="row">'+search('spq','이름, 전화 뒷 4자리, PIN으로 찾기','320px')
       +'<span style="margin-left:auto;font-size:13px;color:#667085">조건에 맞는 참여자 <b class="mt" style="color:#101828" id="sp-cnt">0</b>명</span></div>'
       +'<div class="row" id="sp-chips"></div></div>'
     +'<div class="mc" style="overflow:hidden"><div class="scroll"><table class="mtb"><thead><tr id="sp-th"></tr></thead><tbody id="sp-tb"></tbody></table></div>'
       +'<div id="sp-empty" style="display:none"></div><div class="pager" id="sp-pg"></div></div>';
    var cb=$('#sp-chips'),cnt={};
    PEOPLE.forEach(function(p){cnt[p.ch]=(cnt[p.ch]||0)+1});
    function mk(lab,v,n){var on=pFil.indexOf(v)>=0;
      var b=el('button','mchip'+(on?' on':''),esc(lab)+' <span class="c mt">'+fmt(n)+'</span>');b.type='button';
      b.addEventListener('click',function(){tog(v)});cb.appendChild(b)}
    CHANNELS.forEach(function(c){if(!cnt[c.id])return;
      mk(c.n.replace(' 치매안심센터',''),'ch:'+c.id,cnt[c.id])});
    cb.appendChild(el('span','sep'));
    [['참여 중','active'],['중도포기','dropped'],['만료','expired']].forEach(function(x){
      mk(x[0],'st:'+x[1],PEOPLE.filter(function(p){return p.status===x[1]}).length)});
    cb.appendChild(el('span','sep'));
    mk('민감정보 동의 없음','cs:none',PEOPLE.filter(function(p){return !p.consent.sensitive&&!p.consent.revoked}).length);
    mk('동의 철회','cs:rv',PEOPLE.filter(function(p){return p.consent.revoked}).length);
    $('#spq').value=pq;
    $('#spq').addEventListener('input',function(){pq=this.value;pPager.page=1;V.people(1)});
    $('#spq-x').addEventListener('click',function(){pq='';pPager.page=1;V.people()});
  }
  var list=sortBy(filterP(),pSort,function(p,k){
    return k==='name'?p.full:k==='pin'?+p.pin:k==='birth'?p.birth:k==='ch'?chName(p.ch)
      :k==='days'?p.days:k==='rate'?p.rate:k==='last'?-p.last:0});
  $('#sp-cnt').textContent=fmt(list.length);
  $('#spq-x').style.display=pq?'flex':'none';
  var th=$('#sp-th');
  th.innerHTML=sth('이름','name',pSort)+sth('PIN','pin',pSort,1)+'<th>연락처</th>'+sth('생년','birth',pSort,1)
   +sth('채널','ch',pSort)+'<th>상태</th>'+sth('활동일','days',pSort,1)+sth('수행률','rate',pSort,1)
   +sth('최근 이용','last',pSort)+'<th style="padding-right:20px">앱</th>';
  bindSort(th,pSort,function(){pPager.page=1;V.people(1)});
  var rows=pPager.slice(list),tb=$('#sp-tb');tb.innerHTML='';
  $('#sp-empty').innerHTML=list.length?'':A.emptyBox('조건에 맞는 참여자가 없어요','검색어나 필터를 줄여보세요');
  $('#sp-empty').style.display=list.length?'none':'block';
  rows.forEach(function(p){
    var tr=el('tr','clk');
    tr.innerHTML='<td style="padding-left:20px"><span class="mask-n lnk2" style="font-weight:600;cursor:pointer" title="누르면 사유를 적고 원문이 보여요">'+p.name+'</span></td>'
     +'<td class="num mt" style="color:#69707C">'+p.pin+'</td>'
     +'<td class="mt" style="color:#475467">'+p.phone+'</td>'
     +'<td class="num mt" style="color:#475467">'+p.birth+'</td>'
     +'<td>'+chChip(p.ch)+'</td><td>'+statusPill(p)+'</td>'
     +'<td class="num mt">'+p.days+'</td><td class="num mt">'+(p.days?p.rate+'%':'—')+'</td>'
     +'<td class="mt" style="color:#667085">'+(p.last>900?'—':p.last===0?'오늘':p.last+'일 전')+'</td>'
     +'<td class="mt" style="color:#69707C;padding-right:20px">'+p.app+'</td>';
    /* 행을 누르면 사유를 받고 곧바로 상세가 열린다 — 채널 어드민과 같은 동선 */
    tr.addEventListener('click',function(){askOpen(p)});
    tb.appendChild(tr)});
  pPager.render($('#sp-pg'))};

/* ═══ 상세 진입 = 열람 ═══
   사유 코드는 맬리 본서비스 공통 8종. 케어센터 전용 4종은 채널 좌석의 업무라 여기엔 없다. */
var REASON_COMMON=[
 ['USER_REQUEST','사용자 요청에 따른 정보 확인'],['CONSULT','환자 상담/고객 응대'],
 ['DATA_ANOMALY','이상 데이터 확인 (오류/누락 검증)'],['OPS_ISSUE','서비스 운영 이슈 대응'],
 ['LEGAL','법적 요구 대응 (분쟁, 요청 등)'],['INTERNAL_AUDIT','내부 감사 및 점검'],
 ['IDENTITY_CHECK','회원 상담 중 본인 확인'],['ETC','기타 (직접 입력)']];
/* 원문은 상세를 보는 동안 계속 보인다. 목록으로 나가는 순간 닫고,
   열려 있던 시간을 열람 기록에 남긴다 — 이상 탐지 R-D(오래 열어둠)가 이 값을 본다. */
var pdRev=false,pdReason='',revRow=null,cP=null;
/* 열람은 셋 + 사유가 맞아야 열린다 — 동의 · 좌석 권한 · 사유. 채널 어드민과 같은 문지기 */
function openBlock(p){
  if(p.consent.revoked)return ['동의를 철회하신 분이에요',
    '열람과 처리를 멈춰야 해요. 철회일 '+p.consent.revoked+'. 다시 받으려면 앱에서 동의가 필요해요.'];
  if(!p.consent.sensitive)return ['건강정보 별도 동의를 안 받았어요',
    '검사 점수·마음기록은 민감정보라 별도 동의 없이는 볼 수 없어요(법 제23조). 동의 요청은 담당 채널에서 보내요.'];
  if(!A.meAcct().sens)return ['민감정보 열람 권한이 없어요',
    A.meAcct().n+' 님 좌석에는 건강정보 열람이 열려 있지 않아요. 계정·권한에서 좌석별로 열어요.'];
  return null}
function askOpen(p){
  var blk=openBlock(p);
  if(blk){var bb=el('div');
    bb.innerHTML='<p style="font-size:14px;font-weight:700;margin:0 0 6px">'+blk[0]+'</p>'
     +'<p class="mcap" style="margin:0">'+blk[1]+'</p>';
    var mm=modalBox('열람할 수 없어요',bb);
    mm.querySelector('.mfoot').innerHTML='<button class="mb" type="button" data-close>닫기</button>';return}
  var b=el('div');b.style.cssText='display:flex;flex-direction:column;gap:13px';
  b.innerHTML='<p class="mcap">대상 <b style="color:#101828">'+esc(p.name)+'</b> · '+p.birth+'년생 · '+esc(chName(p.ch))+'<br>'
   +'사유는 채널 담당자와 같은 열람 장부에 남고 같은 탐지 규칙으로 감시돼요. '
   +'목록으로 나가면 다시 가려지고, 열려 있던 시간도 함께 남아요.</p>'
   +'<div><span class="flab">조회 사유 <span style="color:#B42318">*</span></span>'
   +'<select class="mfld" id="srv-r" style="width:100%" aria-label="조회 사유 (필수)"><option value="">사유를 선택하세요</option>'
   +REASON_COMMON.map(function(x){return '<option value="'+x[0]+'">'+x[1]+'</option>'}).join('')
   +'</select></div>'
   +'<div id="srv-etc" style="display:none"><span class="flab">상세 사유 <span style="color:#B42318">*</span></span>'
   +'<textarea class="mfld" id="srv-e" style="width:100%;height:64px;padding:9px 11px" aria-label="상세 사유 (필수)" '
   +'placeholder="어떤 업무로 원문이 필요한지 적어주세요"></textarea>'
   +'<div class="mcap" style="margin-top:5px">직접 입력 사유는 5자 이상 적어야 해요.</div></div>'
   +'<label class="chk"><input type="checkbox" id="srv-ok2" style="accent-color:#6941C6;width:15px;height:15px">'
   +'<span><b>[필수]</b> 업무 목적 외 조회하지 않겠습니다.</span></label>';
  var err=el('div');err.style.cssText='font-size:12.5px;color:#B42318;display:none';
  err.textContent='사유를 고르고 동의에 체크해야 열람할 수 있어요.';b.appendChild(err);
  var m=modalBox('개인정보 열람 사유',b);
  $('#srv-r').addEventListener('change',function(){
    $('#srv-etc').style.display=this.value==='ETC'?'block':'none';err.style.display='none'});
  var f=m.querySelector('.mfoot');f.innerHTML='<button class="mb" type="button" data-close>취소</button>';
  var ok=el('button','mb mbp','열람하기');ok.type='button';
  ok.addEventListener('click',function(){
    var v=$('#srv-r').value,et=$('#srv-e')?$('#srv-e').value.trim():'';
    if(!v||!$('#srv-ok2').checked||(v==='ETC'&&et.length<5)){err.style.display='block';return}
    pdRev=true;pdReason=$('#srv-r').selectedOptions[0].text;
    revRow=A.logView(p,pdReason);
    closeAll();cP=p;go('person')});
  f.appendChild(ok)}
function onPerson(){var e=document.querySelector('.pane.on');return !!e&&e.dataset.pane==='person'}
/* 상세를 벗어날 때 core.js 의 go() 가 부른다 */
window.__supCloseReveal=function(quiet){
  if(!pdRev)return;
  pdRev=false;A.endView(revRow);revRow=null;
  if(!quiet&&onPerson())V.person()};

/* ══════ 상세 ══════ */
function consentCard(p){
  var cs=p.consent,gone=!!cs.revoked,miss=!cs.sensitive&&!gone;
  function row(l,v,pl){return '<div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #F2F4F7">'
    +'<span style="flex:1;font-size:13.5px">'+l+'</span>'
    +'<span class="mcap mt" style="width:110px;color:#667085">'+v+'</span>'+pl+'</div>'}
  return '<div class="mc" style="overflow:hidden">'
   +'<div class="row" style="padding:16px 20px 10px"><span class="mh">동의 현황</span>'
   +'<span class="mcap mt" style="margin-left:auto">'
   +(gone?'철회 '+cs.revoked:miss?'민감정보 동의가 없어요':'모두 받았어요')+'</span></div>'
   +(gone?note('<b>동의를 철회했어요.</b> 건강정보 처리를 멈춰야 해요. 철회 처리와 재동의 안내는 담당 채널에서 해요.','cr')
     :miss?note('<b>건강정보 별도 동의가 없습니다.</b> 민감정보는 다른 동의와 <b>분리해서</b> 받아야 처리할 수 있어요(법 제23조).','cr'):'')
   +'<div style="padding:4px 20px 8px">'
   +row('<b>건강정보(민감정보) 별도 동의</b>',gone?'—':(cs.sensitive||'—'),
     gone?pill('철회','cr'):cs.sensitive?pill('동의','ok'):pill('없음','cr'))
   +row('동의 철회',cs.revoked||'—',cs.revoked?pill('철회','cr'):pill('해당 없음','nu'))
   +'</div>'
   +'<div style="padding:8px 20px 16px"><span class="mcap">동의 접수와 철회 처리는 담당 채널 어드민에서 해요. 여기서는 확인만 합니다.</span></div></div>'}
V.person=function(){
  var p=cP,h=$('#v-person');if(!p){go('people');return}
  var c=byCh[p.ch];
  h.innerHTML=ph(pdRev?p.full:p.name,
    (pdRev?p.phoneFull+' · ':'')+p.birth+'년생 · 만 '+p.age+'세 · '+p.sex+' · PIN '+p.pin+' · '+chName(p.ch),
    '<button class="mb" type="button" id="sp-b">‹ 목록</button><button class="mb" type="button" id="sp-ch">채널 상세 보기</button>')
   +(pdRev?'<div class="mc" style="background:#FFFAEB;border-color:#FEDF89;padding:13px 18px;display:flex;align-items:center;gap:12px">'
      +'<span class="mdot" style="background:#F79009"></span>'
      +'<span style="flex:1;font-size:13.5px;color:#B54708">개인정보 원문을 보는 중이에요 · 사유 <b>'+esc(pdReason)+'</b>'
      +'<span class="mcap" style="display:block;margin-top:2px;color:#B54708">목록으로 나가면 다시 가려져요. 이 열람은 채널 담당자와 같은 장부에 남았어요.</span></span>'
      +'<button class="mb mbx" type="button" id="sp-hide">지금 가리기</button></div>'
     /* 가린 뒤에도 다시 열 길을 남긴다. 없으면 목록으로 나갔다 들어와야 한다 */
     :'<div class="mc" style="padding:13px 18px;display:flex;align-items:center;gap:12px">'
      +'<span style="flex:1;font-size:13.5px;color:#475467">이름과 연락처는 <b>가려 둔 상태</b>예요. '
      +'<span class="mcap">원문이 필요하면 사유를 적고 다시 열 수 있어요 — 열람은 기록에 남아요.</span></span>'
      +'<button class="mb mbx" type="button" id="sp-show">다시 열람하기</button></div>')
   +kpi([['누적 활동일',String(p.days),'일'],['수행률',p.days?String(p.rate):'—',p.days?'%':''],
         ['최근 이용',p.last>900?'—':p.last===0?'오늘':p.last+'일 전',''],['앱 버전',p.app,'']])
   +consentCard(p)
   +note('활동 내역·검사 이력 원본은 <b>담당 채널 어드민의 참여자 상세</b>에 있어요. 어느 좌석이든 원문 열람 범위는 전 채널 공통 <b>최근 6개월</b>입니다(채널 관리 → 보안 기준).','nu');
  $('#sp-b').addEventListener('click',function(){go('people')});
  $('#sp-ch').addEventListener('click',function(){if(c&&A.openCh)A.openCh(c)});
  if($('#sp-hide'))$('#sp-hide').addEventListener('click',function(){
    pdRev=false;A.endView(revRow);revRow=null;V.person();toast('원문을 가렸어요')});
  if($('#sp-show'))$('#sp-show').addEventListener('click',function(){askOpen(p)})};
})(Sup);
