/* CS 접수 / 문의 상세 / 전 채널 발송 / 발송 만들기 / 이상 열람 탐지 + 초기화 */
(function(A){
"use strict";
var $=A.$,$$=A.$$,el=A.el,esc=A.esc,fmt=A.fmt,pill=A.pill,note=A.note,kpi=A.kpi,cbx=A.cbx,
    ph=A.ph,chead=A.chead,search=A.search,sth=A.sth,bindSort=A.bindSort,sortBy=A.sortBy,
    mkPager=A.mkPager,toast=A.toast,open=A.open,closeAll=A.closeAll,go=A.go,V=A.V,
    CHANNELS=A.CHANNELS,byCh=A.byCh,TICKETS=A.TICKETS,SRC=A.SRC,TK_ST=A.TK_ST,TK_PRI=A.TK_PRI,
    PUSHES=A.PUSHES,PS_ST=A.PS_ST,RULES=A.RULES,ALERTS=A.ALERTS,AL_ST=A.AL_ST,AUDIT=A.AUDIT,
    chChip=A.chChip,chName=A.chName;

/* ══════ CS 접수 ══════ */
var tFil=[],tSort={key:'aged',dir:-1},tPager=mkPager(function(){V.cs()}),tq='';
V.cs=function(){
  var h=$('#v-cs');
  var open2=TICKETS.filter(function(x){return x.st==='open'});
  var oldest=open2.slice().sort(function(a,b){return b.aged-a.aged})[0];
  h.innerHTML=ph('CS 접수','채널에서 올라온 문의를 한 곳에서 처리해요. 유입 경로가 4개라 각각 보면 놓칩니다.',
     '<button class="mb" type="button">담당자 배정</button><button class="mb mbp" type="button">일괄 답변</button>')
   +kpi([['접수',String(open2.length),'건','가장 오래된 건 '+oldest.aged+'일째','cr'],
         ['처리 중',String(TICKETS.filter(function(x){return x.st==='prog'}).length),'건',''],
         ['완료',String(TICKETS.filter(function(x){return x.st==='done'}).length),'건',''],
         ['높은 우선순위',String(open2.filter(function(x){return x.pri==='high'}).length),'건','','cr'],
         ['SLA 초과',String(TICKETS.filter(function(x){return x.st!=='done'&&x.aged>2}).length),'건','기준: 영업일 2일 내 1차 회신','cr']])
   +note('운영팀 SLA는 <b>영업일 2일 내 1차 회신</b>이에요(SP-8 확정). 채널의 3일보다 짧게 잡은 건, 채널의 답이 우리 회신에 달려 있어서 상위 단계가 더 빨라야 체인이 성립하기 때문입니다.','in')
   +'<div class="mc" style="padding:16px 20px;display:flex;flex-direction:column;gap:12px">'
     +'<div class="row">'+search('tq','제목, 담당자로 찾기','300px')
     +'<span style="margin-left:auto;font-size:13px;color:#667085">조건에 맞는 문의 <b class="mt" style="color:#101828" id="t-cnt">0</b>건</span></div>'
     +'<div class="row" id="t-chips"></div></div>'
   +'<div class="mc" style="overflow:hidden"><div class="scroll"><table class="mtb"><thead><tr id="t-th"></tr></thead><tbody id="t-tb"></tbody></table></div>'
     +'<div id="t-empty" style="display:none"></div><div class="pager" id="t-pg"></div></div>';
  var cc=$('#t-chips');
  Object.keys(SRC).forEach(function(k){
    var n=TICKETS.filter(function(x){return x.src===k}).length;
    var b=el('button','mchip'+(tFil.indexOf('src:'+k)>=0?' on':''),SRC[k][0]+' <span class="c mt">'+n+'</span>');b.type='button';
    b.addEventListener('click',function(){tog('src:'+k)});cc.appendChild(b)});
  cc.appendChild(el('span','sep'));
  Object.keys(TK_ST).forEach(function(k){
    var n=TICKETS.filter(function(x){return x.st===k}).length;
    var b=el('button','mchip'+(tFil.indexOf('st:'+k)>=0?' on':''),TK_ST[k][0]+' <span class="c mt">'+n+'</span>');b.type='button';
    b.addEventListener('click',function(){tog('st:'+k)});cc.appendChild(b)});
  function tog(v){var i=tFil.indexOf(v);if(i>=0)tFil.splice(i,1);else tFil.push(v);tPager.page=1;V.cs()}
  $('#tq').value=tq;
  $('#tq').addEventListener('input',function(){tq=this.value;tPager.page=1;fill()});
  $('#tq-x').addEventListener('click',function(){tq='';$('#tq').value='';fill()});
  function fill(){
    $('#tq-x').style.display=tq?'flex':'none';
    var srcF=tFil.filter(function(v){return v.indexOf('src:')===0}).map(function(v){return v.slice(4)});
    var stF=tFil.filter(function(v){return v.indexOf('st:')===0}).map(function(v){return v.slice(3)});
    var list=TICKETS.filter(function(x){
      if(srcF.length&&srcF.indexOf(x.src)<0)return false;
      if(stF.length&&stF.indexOf(x.st)<0)return false;
      if(tq&&x.t.indexOf(tq)<0&&x.by.indexOf(tq)<0)return false;
      return true});
    list=sortBy(list,tSort,function(x,k){return k==='t'?x.t:k==='ch'?chName(x.ch):k==='pri'?({high:3,mid:2,low:1})[x.pri]:x[k]||0});
    /* 작업 큐이므로 완료된 건은 항상 아래로 내린다. 사용자가 정렬을 바꿔도 유지된다 —
       38일 지난 완료 건이 맨 위에 뜨면 처리할 일이 안 보인다 */
    list=list.slice().sort(function(a,b){return (a.st==='done'?1:0)-(b.st==='done'?1:0)});
    var th=$('#t-th');
    th.innerHTML='<th style="width:50px;padding-left:20px">'+cbx('off','전체 선택')+'</th>'
      +'<th>경로</th>'+sth('제목','t',tSort)+sth('기관','ch',tSort)+'<th>올린 사람</th>'
      +sth('경과','aged',tSort,1)+sth('우선순위','pri',tSort)+'<th style="padding-right:20px">상태</th>';
    bindSort(th,tSort,function(){tPager.page=1;fill()});
    var rows=tPager.slice(list),tb=$('#t-tb');tb.innerHTML='';
    $('#t-cnt').textContent=list.length;
    $('#t-empty').innerHTML=list.length?'':A.emptyBox('조건에 맞는 문의가 없어요','필터를 줄여보세요');
    $('#t-empty').style.display=list.length?'none':'block';
    rows.forEach(function(x){
      var s=SRC[x.src],st=TK_ST[x.st],pr=TK_PRI[x.pri],tr=el('tr','clk');
      tr.innerHTML='<td style="padding-left:20px">'+cbx('off',x.t)+'</td>'
       +'<td>'+pill(s[0],s[1])+'</td>'
       +'<td style="max-width:340px;overflow:hidden;text-overflow:ellipsis"><span class="lnk" style="font-weight:600">'+esc(x.t)+'</span></td>'
       +'<td>'+chChip(x.ch)+'</td><td style="color:#475467">'+esc(x.by)+'</td>'
       +'<td class="num mt" style="color:'+(x.aged>2?'#B42318':'#475467')+';font-weight:'+(x.aged>2?'600':'400')+'">'+x.aged+'일'+(x.aged>2&&x.st!=='done'?' <span class="mcap" style="color:#B42318">초과</span>':'')+'</td>'
       +'<td>'+pill(pr[0],pr[1])+'</td><td style="padding-right:20px">'+pill(st[0],st[1])+'</td>';
      tr.querySelector('.cbx').addEventListener('click',function(e){e.stopPropagation()});
      tr.addEventListener('click',function(e){if(!e.target.closest('.cbx'))openTk(x)});
      tb.appendChild(tr)});
    tPager.render($('#t-pg'))}
  fill()};

/* ══════ 문의 상세 ══════ */
var curTk=null;
function openTk(x){curTk=x;go('csdetail')}
V.csdetail=function(){
  var x=curTk;if(!x){go('cs');return}
  var s=SRC[x.src],st=TK_ST[x.st],pr=TK_PRI[x.pri],c=byCh[x.ch];
  var h=$('#v-csdetail');
  h.innerHTML=ph(esc(x.t),x.id+' · '+chName(x.ch)+' · '+esc(x.by)+' · '+x.aged+'일 경과',
     '<button class="mb" type="button" id="tk-b">‹ 목록</button>'
     +(x.st!=='done'?'<button class="mb" type="button" id="tk-prog">처리 중으로</button><button class="mb mbp" type="button" id="tk-done">완료 처리</button>':''))
   +'<div class="row" style="gap:7px">'+pill(s[0],s[1])+pill(pr[0],pr[1])+pill(st[0],st[1])
     +'<span class="mcap">'+esc(c?c.n:'')+' · '+esc(c?c.mgrPhone:'')+'</span></div>'
   +'<div style="display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:16px">'
   +'<div class="gap"><div class="mc" style="padding:20px">'
       +'<h2 class="mh">문의 내용</h2>'
       +'<p style="font-size:13.5px;line-height:1.75;color:#344054;margin:12px 0 0">'+esc(x.body)+'</p></div>'
     +'<div class="mc" style="padding:20px;display:flex;flex-direction:column;gap:12px">'
       +'<h2 class="mh">답변</h2>'
       +'<textarea class="mfld" id="tk-r" rows="5" aria-label="답변 내용" style="width:100%;height:auto;padding:11px 12px;line-height:1.6" placeholder="채널관리자에게 보낼 답변을 적어주세요"></textarea>'
       +'<div class="row"><label style="display:flex;gap:8px;align-items:center;font-size:13px;color:#475467;cursor:pointer" id="tk-nw">'
         +cbx('on','답변과 함께 알림 보내기')+'답변과 함께 알림 보내기</label>'
       +'<button class="mb mbp" type="button" id="tk-send" style="margin-left:auto">답변 보내기</button></div></div></div>'
   +'<div class="gap"><div class="mc" style="padding:20px;display:flex;flex-direction:column;gap:12px">'
       +'<h2 class="mh">기관 상황</h2>'
       +(c?'<div style="display:flex;flex-direction:column;gap:9px">'
         +[['담당자',c.mgr],['기수',c.cohort?c.cohort+'기 '+c.day+'일째':'—'],['대상자',c.people?fmt(c.people)+'명':'—'],
           ['앱 설치',c.app?fmt(c.app)+'명':'—'],['수행률',c.rate?c.rate+'%':'—'],['중도포기',c.drop?c.drop+'%':'—']]
          .map(function(r){return '<div style="display:flex;gap:10px;font-size:13px"><span style="color:#667085;width:56px;flex:none">'+r[0]+'</span><b class="mt" style="font-weight:600">'+esc(String(r[1]))+'</b></div>'}).join('')
         +'</div>':'')
       +'<button class="mb" type="button" style="margin-top:4px" id="tk-ch">채널 상세 보기</button></div>'
     +'<div class="mc" style="padding:20px">'
       +'<h2 class="mh">같은 기관의 다른 문의</h2>'
       +'<div id="tk-sib" style="margin-top:10px"></div></div></div></div>';
  $('#tk-b').addEventListener('click',function(){go('cs')});
  $('#tk-ch').addEventListener('click',function(){if(c){A.openCh(c)}});
  if($('#tk-prog'))$('#tk-prog').addEventListener('click',function(){x.st='prog';V.csdetail();toast('처리 중으로 바꿨어요','ok')});
  if($('#tk-done'))$('#tk-done').addEventListener('click',function(){x.st='done';go('cs');toast(x.id+'을 완료 처리했어요','ok','되돌리기',function(){x.st='open';V.cs()})});
  $('#tk-send').addEventListener('click',function(){
    if(!$('#tk-r').value.trim()){toast('답변 내용을 적어주세요','cr');$('#tk-r').focus();return}
    x.st='done';go('cs');toast(esc(x.by)+'님에게 답변을 보냈어요','ok')});
  $('#tk-nw').addEventListener('click',function(e){
    e.preventDefault();var a=this.querySelector('.cbx'),on=a.classList.toggle('on');
    a.setAttribute('aria-checked',on?'true':'false')});
  var sib=TICKETS.filter(function(y){return y.ch===x.ch&&y.id!==x.id}),sb=$('#tk-sib');
  if(!sib.length)sb.innerHTML='<p class="mcap" style="margin:0">다른 문의가 없어요</p>';
  sib.slice(0,5).forEach(function(y){
    var d=el('div');d.style.cssText='padding:9px 0;border-top:1px solid #F2F4F7;cursor:pointer';
    d.innerHTML='<div class="row" style="gap:6px">'+pill(SRC[y.src][0],SRC[y.src][1])+'<span class="mcap mt">'+y.aged+'일</span></div>'
      +'<div style="font-size:13px;margin-top:4px">'+esc(y.t)+'</div>';
    d.addEventListener('click',function(){openTk(y)});sb.appendChild(d)})};

/* ══════ 전 채널 발송 ══════ */
V.push=function(){
  var h=$('#v-push');
  var sched=PUSHES.filter(function(p){return p.st==='sched'});
  h.innerHTML=ph('전 채널 발송','여러 채널에 한번에 보내요. 채널 어드민의 발송과 <b>대상 범위가 다릅니다.</b>',
     '<button class="mb mbp" type="button" data-go="pushnew">발송 만들기</button>')
   +kpi([['예약',String(sched.length),'건','가장 이른 건 내일 오전 10시'],
         ['이번 달 발송',String(PUSHES.filter(function(p){return p.st==='sent'}).length),'건',''],
         ['누적 도달',fmt(PUSHES.filter(function(p){return p.st==='sent'}).reduce(function(a,p){return a+p.n},0)),'명',''],
         ['평균 열어본 비율','35.8','%','오전 9시 발송이 가장 높아요']])
   +note('오발송하면 되돌릴 수 없어요. 그래서 발송 전에 <b>받는 사람 수를 직접 입력</b>하게 했습니다. 채널 어드민보다 확인이 한 겹 더 있어요.','wa')
   +'<div class="mc" style="overflow:hidden">'+chead('발송 목록')
     +'<div class="scroll"><table class="mtb"><thead><tr><th style="padding-left:20px">발송 시각</th><th>제목</th><th>대상 채널</th><th class="num">받는 사람</th><th class="num">열어본 비율</th><th>보낸 사람</th><th style="padding-right:20px">상태</th></tr></thead><tbody id="ps-tb"></tbody></table></div></div>';
  var tb=$('#ps-tb');
  PUSHES.forEach(function(p){
    var st=PS_ST[p.st],tr=el('tr');
    tr.innerHTML='<td style="padding-left:20px"><span class="mt" style="font-weight:600">'+p.when+'</span>'
       +'<span class="mcap" style="display:block">'+p.rel+'</span></td>'
     +'<td style="max-width:280px"><b style="font-weight:600">'+esc(p.t)+'</b><span class="mcap" style="display:block">'+esc(p.memo)+'</span></td>'
     +'<td>'+p.chs.map(function(x){return chChip(x)}).join(' ')+'</td>'
     +'<td class="num"><span class="reach mt'+(p.n>2000?' big':'')+'">'+fmt(p.n)+'</span></td>'
     +'<td class="num mt" style="color:#475467">'+(p.open?p.open+'%':'—')+'</td>'
     +'<td style="color:#475467">'+esc(p.by)+'</td>'
     +'<td style="padding-right:20px">'+pill(st[0],st[1])+'</td>';
    tb.appendChild(tr)})};

/* ══════ 발송 만들기 — SP-7 안전장치 ══════ */
var np={t:'',body:'',chs:['C01'],when:'2026-08-26T09:00'};
function reachOf(){return np.chs.reduce(function(a,id){var c=byCh[id];return a+(c?c.app:0)},0)}
V.pushnew=function(){
  var h=$('#v-pushnew'),reach=reachOf();
  h.innerHTML=ph('발송 만들기','대상 채널을 고르고 문안을 확인하세요.',
     '<button class="mb" type="button" id="np-b">‹ 목록</button><button class="mb" type="button" id="np-test">내 번호로 테스트</button><button class="mb mbp" type="button" id="np-go">발송 예약</button>')
   +'<div style="display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:16px">'
   +'<div class="gap">'
     +'<div class="mc" style="padding:20px;display:flex;flex-direction:column;gap:16px">'
       +'<h2 class="mh">문안</h2>'
       +'<div><label class="flab" for="np-t">제목 <span class="mcap">최대 20자</span></label>'
         +'<input class="mfld" id="np-t" maxlength="20" style="width:100%" value="'+esc(np.t)+'" placeholder="예) 9월 출석 챌린지가 시작돼요"></div>'
       +'<div><label class="flab" for="np-body">내용 <span class="mcap">최대 60자</span></label>'
         +'<textarea class="mfld" id="np-body" maxlength="60" rows="2" style="width:100%;height:auto;padding:10px 12px;line-height:1.6" placeholder="예) 오늘부터 시작이에요. 하루 2가지만 해보세요.">'+esc(np.body)+'</textarea></div>'
       +'<div><label class="flab" for="np-when">발송 시각</label><input type="datetime-local" class="mfld" id="np-when" value="'+np.when+'" style="width:100%">'
         +'<p class="mcap" style="margin:7px 0 0">오전 9시~오후 6시만 나가요. 밖의 시간은 다음 날 오전 9시로 옮겨집니다.</p></div></div>'
     +'<div class="mc" style="padding:20px;display:flex;flex-direction:column;gap:12px">'
       +'<div class="row"><h2 class="mh">대상 채널</h2>'
         +'<button class="mb mbs" type="button" id="np-all" style="margin-left:auto">전체 선택</button></div>'
       +'<div id="np-chs" style="display:flex;flex-direction:column;gap:2px"></div></div></div>'
   +'<div class="gap">'
     +'<div class="mc" style="padding:20px;display:flex;flex-direction:column;gap:14px">'
       +'<h2 class="mh">미리보기</h2>'
       +'<div class="prev"><div class="mt" style="text-align:center;padding:6px 0 14px">'
         +'<div style="font-size:12.5px;color:#A9B2C0">8월 26일 수요일</div>'
         +'<div style="font-size:34px;font-weight:700;letter-spacing:-0.03em">9:00</div></div>'
         +'<div class="pnote"><span aria-hidden="true" style="width:26px;height:26px;border-radius:7px;background:#7C5CFF;flex:none;display:flex;align-items:center;justify-content:center"><svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2.5 15.5 6v6L9 15.5 2.5 12V6z"/></svg></span>'
         +'<span style="min-width:0"><span style="display:flex;gap:8px"><b style="font-size:13px;font-weight:700">'+esc(np.t||'제목을 입력하세요')+'</b>'
           +'<span class="mcap" style="margin-left:auto;color:#A9B2C0;font-size:11.5px">지금</span></span>'
         +'<span style="display:block;font-size:12.5px;color:#D0D5DD;margin-top:3px;line-height:1.5">'+esc(np.body||'내용을 입력하세요')+'</span></span></div>'
         +'<div class="mcap" style="text-align:center;margin-top:12px;color:#A9B2C0;font-size:11.5px">맬리 케어센터 · 알림함에도 함께 쌓여요</div></div></div>'
     +'<div class="mc" style="padding:20px">'
       +'<h2 class="mh">받는 사람</h2>'
       +'<div class="reach mt'+(reach>2000?' big':'')+'" style="font-size:34px;margin-top:8px">'+fmt(reach)+'<span style="font-size:14px;font-weight:600;color:#667085">명</span></div>'
       +'<p class="mcap" style="margin:6px 0 0">채널 '+np.chs.length+'곳 · 앱을 설치하고 알림을 켠 분만 셈</p>'
       +(reach>2000?'<div class="danger" style="margin-top:14px"><h3>규모가 큽니다</h3><p class="mcap" style="margin:0;color:#B42318">'+fmt(reach)+'명에게 한번에 나갑니다. 문안을 다시 읽어주세요.</p></div>':'')+'</div></div></div>';
  var cw=$('#np-chs');
  CHANNELS.filter(function(c){return c.st==='run'}).forEach(function(c){
    var on=np.chs.indexOf(c.id)>=0,lab=el('label');
    lab.style.cssText='display:flex;gap:10px;align-items:center;padding:9px 2px;cursor:pointer;font-size:13.5px';
    lab.innerHTML=cbx(on?'on':'off',c.n)+'<span>'+esc(c.n)+'</span>'
      +'<span class="mcap mt" style="margin-left:auto">앱 '+fmt(c.app)+'명</span>';
    lab.addEventListener('click',function(e){e.preventDefault();
      var i=np.chs.indexOf(c.id);if(i>=0)np.chs.splice(i,1);else np.chs.push(c.id);V.pushnew()});
    cw.appendChild(lab)});
  $('#np-all').addEventListener('click',function(){
    np.chs=CHANNELS.filter(function(c){return c.st==='run'}).map(function(c){return c.id});V.pushnew()});
  $('#np-t').addEventListener('input',function(){np.t=this.value;V.pushnew();$('#np-t').focus()});
  $('#np-body').addEventListener('input',function(){np.body=this.value});
  $('#np-when').addEventListener('change',function(){np.when=this.value});
  $('#np-b').addEventListener('click',function(){go('push')});
  $('#np-test').addEventListener('click',function(){toast('내 번호로 테스트 발송했어요','ok')});
  $('#np-go').addEventListener('click',function(){
    if(!np.t.trim()){toast('제목을 입력해주세요','cr');$('#np-t').focus();return}
    if(!np.chs.length){toast('대상 채널을 하나 이상 골라주세요','cr');return}
    openConfirm()})};

/* 발송 전 확인 — 받는 사람 수를 직접 입력해야 열린다 */
var pcOk=false;
function openConfirm(){
  var reach=reachOf();
  $('#pc-b').innerHTML=note('보내면 <b>되돌릴 수 없어요.</b> 받는 사람 수를 직접 입력해 확인해주세요.','cr')
   +'<div style="display:flex;flex-direction:column;gap:9px">'
     +[['제목',np.t],['대상 채널',np.chs.map(function(id){return chName(id).replace(' 치매안심센터','')}).join(', ')],
       ['발송 시각',np.when.replace('T',' ')]]
      .map(function(r){return '<div style="display:flex;gap:10px;font-size:13px"><span style="color:#667085;width:64px;flex:none">'+r[0]+'</span><b style="font-weight:600">'+esc(r[1])+'</b></div>'}).join('')
   +'</div>'
   +'<div style="padding:14px;background:#FEF3F2;border-radius:8px;text-align:center">'
     +'<span class="mcap" style="color:#B42318">받는 사람</span>'
     +'<div class="reach mt big" style="font-size:30px;margin-top:2px">'+fmt(reach)+'명</div></div>'
   +'<div><label class="flab" for="pc-n">위 숫자를 그대로 입력하세요</label>'
     +'<input class="mfld mt" id="pc-n" style="width:100%;text-align:center;font-size:16px" inputmode="numeric" placeholder="'+reach+'"></div>'
   +'<label style="display:flex;gap:9px;align-items:center;font-size:13.5px;color:#475467;cursor:pointer" id="pc-aw">'
     +cbx('off','문안을 확인했어요')+'문안을 확인했어요</label>';
  pcOk=false;upd();
  $('#pc-n').addEventListener('input',upd);
  $('#pc-aw').addEventListener('click',function(e){
    e.preventDefault();var a=this.querySelector('.cbx'),on=a.classList.toggle('on');
    a.setAttribute('aria-checked',on?'true':'false');upd()});
  function upd(){
    var typed=+($('#pc-n').value||0),checked=$('#pc-aw .cbx').classList.contains('on');
    pcOk=(typed===reach&&checked);
    var b=$('#pc-ok');
    b.style.opacity=pcOk?'1':'.8';b.style.cursor=pcOk?'pointer':'not-allowed';
    b.setAttribute('aria-disabled',pcOk?'false':'true')}
  open('m-push-confirm')}
$('#pc-ok').addEventListener('click',function(){
  if(!pcOk)return;
  var reach=reachOf();
  PUSHES.unshift({id:'P-'+(PUSHES.length+3),when:np.when.replace('T',' ')+'',rel:'예약됨',t:np.t,
    chs:np.chs.slice(),n:reach,st:'sched',by:'이운영',memo:'수동 발송'});
  closeAll();go('push');
  toast(fmt(reach)+'명에게 예약했어요','ok','되돌리기',function(){PUSHES.shift();V.push()})});

/* ══════ 이상 열람 탐지 ══════ */
var curAl=null;
V.anomaly=function(){
  var h=$('#v-anomaly');
  var op=ALERTS.filter(function(a){return a.st==='open'});
  h.innerHTML=ph('이상 열람 탐지','개인정보 유출은 대개 권한 있는 내부자에서 시작해요. 그래서 <b>열람 기록만</b> 감시합니다.',
     '<button class="mb" type="button" id="an-rules">판정 기준</button><button class="mb" type="button">증빙 내려받기</button>')
   +note('<b>운영팀은 개인정보 원문을 볼 수 없어요.</b> 감시하는 쪽이 감시 대상 권한을 함께 가지면 감사가 무의미해지기 때문입니다. 이 화면에서도 이름·전화번호는 나오지 않아요.','in')
   +note('판정 기준 3종은 <b>2026-08-24 확정</b>됐어요(SP-2). 3개월 뒤 오탐률을 보고 조정합니다 — 오탐이 많으면 아무도 안 보게 돼요.','nu')
   +kpi([['확인 필요',String(op.length),'건','','cr'],
         ['이번 달 열람',fmt(AUDIT.length),'건','전 채널 합계'],
         ['원문 열람',fmt(AUDIT.filter(function(a){return a.act==='원문 열람'}).length),'건',''],
         ['사유 없이 열람','0','건','사유는 반드시 남아요','ok']])
   +'<div class="mc" style="overflow:hidden">'+chead('탐지된 이상 징후','<span class="mcap">최근 7일</span>')
     +'<div id="an-list"></div></div>'
   +'<div class="mc" style="overflow:hidden">'+chead('전 채널 열람 기록','<span class="mcap">'+fmt(AUDIT.length)+'건</span>')
     +'<div class="scroll"><table class="mtb"><thead><tr id="an-th"></tr></thead><tbody id="an-tb"></tbody></table></div>'
     +'<div class="pager" id="an-pg"></div></div>';
  $('#an-rules').addEventListener('click',function(){
    toast('판정 기준: '+RULES.map(function(r){return r.n}).join(' / '),'wa')});
  var lb=$('#an-list');
  ALERTS.forEach(function(a,ix){
    var r=RULES.filter(function(x){return x.id===a.rule})[0],st=AL_ST[a.st];
    var d=el('div');
    d.style.cssText='display:flex;align-items:flex-start;gap:13px;padding:16px 20px;'+(ix?'border-top:1px solid #F2F4F7':'');
    d.innerHTML='<span aria-hidden="true" style="width:34px;height:34px;flex:none;border-radius:8px;background:'
      +(a.st==='open'?'#FEF3F2;color:#B42318':'#ECFDF3;color:#067647')+';display:flex;align-items:center;justify-content:center">'+A.BANG+'</span>'
     +'<span style="min-width:0;flex:1">'
       +'<span class="row" style="gap:7px">'+pill(r.n,a.st==='open'?'cr':'ok')+A.chChip(a.ch)
         +'<span class="mcap mt">'+a.when+'</span>'+pill(st[0],st[1])+'</span>'
       +'<span style="display:block;font-size:13.5px;font-weight:600;margin-top:6px">'+esc(a.who)+' · 원문 '+a.cnt+'건'+(a.win!=='—'?' / '+a.win:'')+'</span>'
       +'<span class="mcap" style="display:block;margin-top:3px">'+esc(a.why)+'</span></span>'
     +'<button class="mb mbs" type="button" style="flex:none">살펴보기</button>';
    d.querySelector('.mb').addEventListener('click',function(){openAl(a)});
    lb.appendChild(d)});
  var aSort={key:'t',dir:-1},aPager=mkPager(fill);
  function fill(){
    var list=sortBy(AUDIT,aSort,function(x,k){return k==='t'?x.t:k==='ch'?chName(x.ch):k==='act'?x.act:x[k]||0});
    var th=$('#an-th');
    th.innerHTML=sth('일시','t',aSort)+sth('기관','ch',aSort)+'<th>담당자</th>'+sth('행위','act',aSort)
      +sth('대상','n',aSort,1)+'<th>사유</th><th style="padding-right:20px">접속 위치</th>';
    bindSort(th,aSort,function(){aPager.page=1;fill()});
    var rows=aPager.slice(list),tb=$('#an-tb');tb.innerHTML='';
    rows.forEach(function(x){
      var late=+x.t.slice(11,13)>=22||+x.t.slice(11,13)<6;
      tb.appendChild(el('tr',null,'<td class="mt" style="padding-left:20px;color:'+(late?'#B42318':'#475467')+'">'+x.t+(late?' <span class="mcap" style="color:#B42318">심야</span>':'')+'</td>'
       +'<td>'+A.chChip(x.ch)+'</td><td style="font-weight:600">'+esc(x.who)+'</td>'
       +'<td>'+x.act+'</td><td class="num mt" style="color:'+(x.n>=50?'#B42318':'#475467')+'">'+fmt(x.n)+'</td>'
       +'<td style="color:#475467">'+esc(x.reason)+'</td>'
       +'<td class="mt" style="color:#69707C;padding-right:20px">'+x.ip+'</td>'))});
    aPager.render($('#an-pg'))}
  fill()};

function openAl(a){
  curAl=a;
  var r=RULES.filter(function(x){return x.id===a.rule})[0];
  $('#al-b').innerHTML=note('<b>'+esc(r.n)+'</b> — '+esc(r.desc),'wa')
   +'<div style="display:flex;flex-direction:column;gap:9px">'
     +[['기관',chName(a.ch)],['담당자',a.who],['일시',a.when],['원문 열람',a.cnt+'건'],
       ['소요 시간',a.win],['남긴 사유',a.reason],['접속 위치',a.ip]]
      .map(function(x){return '<div style="display:flex;gap:10px;font-size:13px"><span style="color:#667085;width:70px;flex:none">'+x[0]+'</span><b style="font-weight:600">'+esc(x[1])+'</b></div>'}).join('')
   +'</div>'
   +'<div class="danger"><h3>왜 걸렸나</h3><p style="margin:0;font-size:13px;line-height:1.7;color:#475467">'+esc(a.why)+'</p></div>'
   +'<div><label class="flab" for="al-memo">확인 메모</label>'
     +'<textarea class="mfld" id="al-memo" rows="3" style="width:100%;height:auto;padding:10px 12px" placeholder="담당자에게 확인한 내용을 적어주세요"></textarea></div>';
  open('m-alert')}
$('#al-ack').addEventListener('click',function(){
  if(curAl)curAl.st='ack';closeAll();V.anomaly();toast('확인 완료로 처리했어요','ok')});
$('#al-esc').addEventListener('click',function(){
  if(curAl)curAl.st='esc';closeAll();V.anomaly();toast('상부 보고로 올렸어요','wa')});

/* ══════ 초기화 ══════ */
/* 계정 발급 모달의 채널 목록은 데이터에서 채운다 */
$('#ac-c').innerHTML='<option value="">전체 (운영팀)</option>'
  +CHANNELS.map(function(c){return '<option value="'+c.id+'">'+esc(c.n)+'</option>'}).join('');
A.buildNav();
go('home');
})(Sup);
