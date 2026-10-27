/* 상단 바 — 도움말 · 알림 · 프로필
   예전엔 버튼만 있고 누르면 아무 일도 없었다. 알림 숫자 '3' 도 손으로 적은 값이었다.
   알림은 지금 처리할 일을 데이터에서 세고, 누르면 그 화면으로 간다. */
(function(A){
"use strict";
var $=A.$,$$=A.$$,el=A.el,esc=A.esc,fmt=A.fmt,go=A.go,M=A.M,toast=A.toast;

/* ── 팝오버 하나를 세 버튼이 같이 쓴다 ── */
var pop=null,owner=null;
function closePop(back){
  if(!pop)return;pop.remove();pop=null;
  if(owner){owner.setAttribute('aria-expanded','false');if(back)owner.focus()}owner=null}
function openPop(btn,html,label,w){
  if(owner===btn){closePop(true);return}
  closePop();owner=btn;btn.setAttribute('aria-expanded','true');
  pop=el('div','tb-pop');pop.setAttribute('role','dialog');pop.setAttribute('aria-label',label);
  pop.style.width=(w||320)+'px';pop.innerHTML=html;document.body.appendChild(pop);
  var r=btn.getBoundingClientRect();
  pop.style.top=(r.bottom+8)+'px';pop.style.left=Math.max(8,Math.min(window.innerWidth-(w||320)-8,r.right-(w||320)))+'px';
  var f=pop.querySelector('button,[href]');if(f)f.focus();
  return pop}
document.addEventListener('mousedown',function(e){if(pop&&!pop.contains(e.target)&&!(owner&&owner.contains(e.target)))closePop()});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&pop){closePop(true);e.stopPropagation()}},true);
window.addEventListener('resize',function(){closePop()});

/* ══════ 알림 ══════
   읽음 여부만 기억한다. 항목은 열 때마다 다시 센다 — 상담에 답하면 알림도 사라져야 한다 */
var seen={};
function items(){
  var T=A.LEDGER.T,dRisk=M.inactive14()-A.bandAsOf(T-7,'risk');
  var undone=A.AUDIT.filter(function(a){return /내려받기|다운로드/.test(a[4])&&!a[9]}).length;
  return [
   {k:'consult',on:M.consultWaiting()>0,lv:'cr',t:'답변을 기다리는 상담 '+M.consultWaiting()+'건',d:'영업일 3일이 넘으면 운영팀에 알림이 가요',go:'consult'},
   {k:'apply',on:M.applyPending()>0,lv:'cr',t:'승인 대기 중인 신청 '+fmt(M.applyPending())+'건',d:'가장 오래된 건 42일째예요',go:'apply'},
   {k:'audit',on:!A.auAllChecked(),lv:'wa',t:'이번 달 접속기록 점검이 남았어요',d:'점검 안 한 내려받기 '+undone+'건 — 안 하면 월간 리포트 점검표가 불이행',go:'audit'},
   {k:'risk',on:dRisk>0,lv:'wa',t:A.bandLabel().risk+' '+fmt(M.inactive14())+'명',d:'지난주보다 '+dRisk+'명 늘었어요',go:'people'},
   {k:'consent',on:M.noSensitiveConsent()>0,lv:'in',t:'건강정보 별도 동의가 없는 분 '+fmt(M.noSensitiveConsent())+'명',d:'동의 전에는 검사 점수를 볼 수 없어요',go:'people'}]
   .filter(function(x){return x.on})}
function unread(){return items().filter(function(x){return !seen[x.k]}).length}
function paintBadge(){var b=$('#tb-noti-n'),n=unread();if(!b)return;
  b.textContent=n;b.style.display=n?'':'none';
  var sr=$('#tb-noti-sr');if(sr)sr.textContent=n?'건 안 읽음':''}
A.paintNoti=paintBadge;
function openNoti(btn){
  var L=items(),C={cr:['#FEF3F2','#B42318'],wa:['#FFFAEB','#B54708'],in:['#EFF8FF','#175CD3']};
  var p=openPop(btn,'<div class="tb-ph"><b>알림</b>'+(L.length?'<button type="button" class="lnk" id="tb-read">모두 확인</button>':'')+'</div>'
    +(L.length?'<div class="tb-list">'+L.map(function(x){var c=C[x.lv];
      return '<button type="button" class="tb-it'+(seen[x.k]?' read':'')+'" data-go2="'+x.go+'" data-k="'+x.k+'">'
        +'<span class="tb-ic" style="background:'+c[0]+';color:'+c[1]+'" aria-hidden="true">'+A.BANG+'</span>'
        +'<span><span class="tb-t">'+esc(x.t)+(seen[x.k]?'':'<span class="sr"> (안 읽음)</span>')+'</span><span class="tb-d">'+esc(x.d)+'</span></span></button>'}).join('')+'</div>'
      :'<p class="mcap" style="padding:16px">처리할 일이 없어요</p>'),'알림',340);
  $$('.tb-it',p).forEach(function(b){b.addEventListener('click',function(){seen[b.dataset.k]=1;paintBadge();closePop();go(b.dataset.go2)})});
  var rd=$('#tb-read');if(rd)rd.addEventListener('click',function(){L.forEach(function(x){seen[x.k]=1});paintBadge();closePop(true);toast('알림을 모두 확인했어요')})}

/* ══════ 프로필 ══════ */
function openMe(btn){
  var me=A.meOp(),own=A.ownedBy(me.name);
  var p=openPop(btn,'<div class="tb-me"><span class="tb-av" aria-hidden="true">'+esc(me.name.charAt(0))+'</span>'
     +'<span><b>'+esc(me.name)+'</b><span class="tb-d">'+(own.length?'주관리자 · '+own.length+'곳':'부관리자')+' · '+esc(A.CH_SELF)+'</span>'
     +'<span class="tb-d">2단계 인증 사용 중 · 마지막 접속 '+esc(me.last)+'</span></span></div>'
    +'<div class="tb-list">'
     +[['settings','내 채널 정보'],['chops','우리 채널 운영자'],['audit','열람 기록 (내 기록 포함)']].map(function(x){
       return '<button type="button" class="tb-it sm" data-go2="'+x[0]+'"><span class="tb-t">'+x[1]+'</span></button>'}).join('')
     +'<button type="button" class="tb-it sm" id="tb-pw"><span class="tb-t">비밀번호 바꾸기</span></button>'
     +'<button type="button" class="tb-it sm" id="tb-out"><span class="tb-t" style="color:#B42318">로그아웃</span></button>'
    +'</div>','내 계정',300);
  $$('[data-go2]',p).forEach(function(b){b.addEventListener('click',function(){closePop();go(b.dataset.go2)})});
  $('#tb-pw').addEventListener('click',function(){closePop();
    var b=el('div');b.innerHTML='<p class="mcap" style="margin:0 0 10px">계정 이메일로 재설정 링크를 보내요. 링크는 30분 동안만 열려요.</p>'
      +'<p style="margin:0;font-size:13.5px"><b>kim@***.go.kr</b></p>'
      +'<p class="mcap" style="margin:10px 0 0">비밀번호는 '+A.CFG.locked.pwMin+'자 이상, 영문·숫자·기호 중 2종 이상이어야 해요.</p>';
    var m=A.modalBox('비밀번호 바꾸기',b),f=m.querySelector('.mfoot');
    f.innerHTML='<button class="mb" type="button" data-close>취소</button>';
    var ok=el('button','mb mbp','재설정 링크 보내기');ok.type='button';
    ok.addEventListener('click',function(){A.closeAll();A.addAudit('비밀번호 재설정 요청','본인','본인 요청');toast('재설정 링크를 이메일로 보냈어요','ok')});
    f.appendChild(ok)});
  $('#tb-out').addEventListener('click',function(){closePop();
    /* 로그아웃 = 자동 로그아웃과 같은 길. 열려 있던 원문도 함께 닫힌다 */
    if(A.SESS.onExpire)A.SESS.onExpire();
    var l=$('#m-locked');if(!l)return;
    l.querySelector('h3').textContent='로그아웃했어요';
    l.querySelector('.mbody .mcap').textContent='열려 있던 개인정보 원문은 다시 가려졌어요. 다시 쓰려면 로그인하세요.';
    A.addAudit('로그아웃','본인','직접 로그아웃');l.classList.add('on');
    var i=l.querySelector('input');if(i)i.focus()})}

/* ══════ 도움말 ══════ */
function openHelp(){
  var b=el('div');b.className='tb-help';
  b.innerHTML='<h4>처음 쓰실 때</h4><ol>'
    +'<li><b>오늘</b>에서 처리할 일(상담 답변·신청 승인)부터 보세요. 빨간 숫자가 오늘 손댈 것이에요.</li>'
    +'<li>이름·연락처는 늘 <b>가린 상태</b>예요. 열려면 조회 사유를 고르고, 그 기록은 2년간 남아요.</li>'
    +'<li><b>활동 현황 → 월간 현황</b>에서 지난달 이맘때와 비교한 이번 달 숫자를 봐요.</li></ol>'
    +'<h4>자주 묻는 질문</h4><dl>'
    +'<dt>숫자가 실시간이 아닌가요?</dt><dd>매일 새벽 3시에 한 번 집계해요. 화면 숫자는 전날까지예요.</dd>'
    +'<dt>활동자는 누구를 세나요?</dt><dd>두뇌훈련·운동·마음다루기를 1회 이상 한 분이에요. 걸음만 기록된 날은 세지 않아요. 정의는 <b>활동 현황 → 판정 기준</b>에 다 있어요.</dd>'
    +'<dt>사업 목표는 어디서 바꾸나요?</dt><dd><b>활동 현황 → 월간 현황</b>의 사업 목표 카드에서 바로 바꾸거나, <b>내 채널 정보</b>에서 바꿔요.</dd>'
    +'<dt>프로그램 일정을 바꾸고 싶어요</dt><dd>일정은 운영팀이 편성해요. <b>프로그램 일정 → 일정 변경 요청</b>으로 보내주세요.</dd></dl>'
    +'<h4>단축키</h4><p class="mcap" style="margin:0"><kbd>/</kbd> 어디서든 검색 · <kbd>Esc</kbd> 창 닫기 · 표에서 <kbd>←</kbd><kbd>→</kbd> 이동</p>';
  var m=A.modalBox('도움말',b,560),f=m.querySelector('.mfoot');
  f.innerHTML='<button class="mb" type="button" data-close>닫기</button>';
  var cx=el('button','mb mbp','운영팀에 문의하기');cx.type='button';
  cx.addEventListener('click',function(){A.closeAll();go('cx')});f.appendChild(cx)}

/* ── 연결 ── */
var hb=$('#tb-help'),nb=$('#tb-noti'),mb=$('#tb-me');
if(hb)hb.addEventListener('click',openHelp);
if(nb){nb.setAttribute('aria-haspopup','dialog');nb.setAttribute('aria-expanded','false');nb.addEventListener('click',function(){openNoti(nb)})}
if(mb){mb.setAttribute('aria-haspopup','dialog');mb.setAttribute('aria-expanded','false');mb.addEventListener('click',function(){openMe(mb)})}
paintBadge();
})(App);
