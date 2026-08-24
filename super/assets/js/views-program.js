/* 프로그램 편성 / 콘텐츠 / 챌린지 */
(function(A){
"use strict";
var $=A.$,$$=A.$$,el=A.el,esc=A.esc,fmt=A.fmt,pad2=A.pad2,pill=A.pill,note=A.note,kpi=A.kpi,cbx=A.cbx,
    ph=A.ph,chead=A.chead,search=A.search,sth=A.sth,bindSort=A.bindSort,sortBy=A.sortBy,bindTabs=A.bindTabs,
    toast=A.toast,open=A.open,closeAll=A.closeAll,go=A.go,V=A.V,
    CHANNELS=A.CHANNELS,byCh=A.byCh,CONTENT=A.CONTENT,CT_ST=A.CT_ST,
    CHALLENGES=A.CHALLENGES,Q_ST=A.Q_ST,chChip=A.chChip,chName=A.chName;

var DOW=['일','월','화','수','목','금','토'];
var ACT=CONTENT.filter(function(c){return c.k!=='검사'});

/* ══════ 프로그램 편성 ══════ */
var pCh='C01',pWeek=0,SCHED={};
function schedKey(ch,w,d){return ch+'|'+w+'|'+d}
function seedSched(ch,w,d){
  var k=schedKey(ch,w,d);
  if(SCHED[k]!==undefined)return SCHED[k];
  if(d===0||d===6)return null;
  var s=(ch.charCodeAt(2)*37+w*11+d*7);
  return ACT[Math.floor(A.rnd(s)*ACT.length)]}
V.programs=function(){
  var h=$('#v-programs');
  var c=byCh[pCh];
  var base=new Date(2026,7,24);base.setDate(base.getDate()+pWeek*7);
  var mon=new Date(base);mon.setDate(mon.getDate()-((mon.getDay()+6)%7));
  h.innerHTML=ph('프로그램 편성','채널 어드민이 <b>읽기 전용</b>으로 보는 그 일정의 원본이에요. 여기서 바꾸면 해당 채널에 바로 반영됩니다.',
     '<button class="mb" type="button" id="pg-copy">지난주 복사</button><button class="mb mbp" type="button" id="pg-pub">채널에 반영</button>')
   +'<div class="mc" style="padding:16px 20px;display:flex;flex-direction:column;gap:12px">'
     +'<div class="row"><label class="flab" for="pg-ch" style="margin:0">채널</label>'
     +'<select class="mfld" id="pg-ch">'+CHANNELS.filter(function(x){return x.st==='run'}).map(function(x){
        return '<option value="'+x.id+'"'+(x.id===pCh?' selected':'')+'>'+esc(x.n)+'</option>'}).join('')+'</select>'
     +'<span class="sep"></span>'
     +'<button class="pgn" type="button" id="pg-p" aria-label="지난 주">'+A.LT+'</button>'
     +'<span class="mh mt" style="min-width:168px;text-align:center" id="pg-lab"></span>'
     +'<button class="pgn" type="button" id="pg-n" aria-label="다음 주">'+A.RT+'</button>'
     +'<button class="mb mbs" type="button" id="pg-t">이번 주</button>'
     +'<span style="margin-left:auto" class="mcap">'+esc(c.n)+' · '+c.cohort+'기 대상자 '+fmt(c.people)+'명</span></div></div>'
   +note('주말은 배정하지 않는 게 기본이에요. 채널 어드민의 <b>활동 현황</b>에서 “주말 활동량이 평일의 27%”로 잡힌 원인이 이것입니다. 주말 배정을 늘리려면 여기서 칸을 채우면 돼요.','in')
   +'<div class="mc" style="padding:18px"><div class="grid-sched" id="pg-grid"></div>'
     +'<p class="mcap" style="margin:14px 0 0">칸을 눌러 활동을 바꿀 수 있어요. 하루 2개까지 배정합니다.</p></div>';
  var g=$('#pg-grid');
  var e=new Date(mon);e.setDate(e.getDate()+6);
  $('#pg-lab').textContent=(mon.getMonth()+1)+'/'+mon.getDate()+' – '+(e.getMonth()+1)+'/'+e.getDate();
  g.appendChild(el('div','hd',''));
  for(var d=0;d<7;d++){
    var dt=new Date(mon);dt.setDate(dt.getDate()+d);
    g.appendChild(el('div','hd',DOW[dt.getDay()]+'<br><span class="mt" style="font-weight:400;color:#69707C">'+dt.getDate()+'</span>'))}
  [['오전','am'],['오후','pm']].forEach(function(slot,si){
    g.appendChild(el('div','rowhd',slot[0]));
    for(var d=0;d<7;d++){(function(d){
      var wk=(d===5||d===6);
      var a=seedSched(pCh,pWeek*2+si,d);
      var cell=el('div','cell'+(wk&&!a?' off':''));
      cell.tabIndex=0;cell.setAttribute('role','button');
      if(a){cell.innerHTML='<span style="font-weight:600;font-size:12px;display:block;line-height:1.35">'+esc(a.n)+'</span>'
        +'<span class="mcap" style="font-size:11px">'+a.k+'</span>';
        cell.setAttribute('aria-label',slot[0]+' '+DOW[(d+1)%7]+'요일 '+a.n+', 바꾸려면 누르세요')}
      else{cell.innerHTML='<span style="color:#5925DC;font-size:12px">+ 배정</span>';
        cell.setAttribute('aria-label',slot[0]+' '+DOW[(d+1)%7]+'요일 비어 있음, 배정하려면 누르세요')}
      function act(){openCell(pWeek*2+si,d,a,slot[0])}
      cell.addEventListener('click',act);
      cell.addEventListener('keydown',function(ev){if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();act()}});
      g.appendChild(cell)})(d)}});
  $('#pg-ch').addEventListener('change',function(){pCh=this.value;V.programs()});
  $('#pg-p').addEventListener('click',function(){pWeek--;V.programs()});
  $('#pg-n').addEventListener('click',function(){pWeek++;V.programs()});
  $('#pg-t').addEventListener('click',function(){pWeek=0;V.programs()});
  $('#pg-copy').addEventListener('click',function(){toast('지난주 편성을 복사했어요','ok','되돌리기',null)});
  $('#pg-pub').addEventListener('click',function(){toast(esc(byCh[pCh].n)+'에 반영했어요. 채널 어드민에서 바로 보여요','ok')})};

var cellCtx=null;
function openCell(w,d,cur,slotName){
  cellCtx={w:w,d:d};
  $('#cl-t').textContent=slotName+' · '+DOW[(d+1)%7]+'요일 활동 배정';
  $('#cl-b').innerHTML='<div><label class="flab" for="cl-a">활동</label>'
    +'<select class="mfld" id="cl-a" style="width:100%"><option value="">배정 없음 (휴강)</option>'
    +['두뇌훈련','운동','마음다루기'].map(function(k){
       return '<optgroup label="'+k+'">'+ACT.filter(function(a){return a.k===k}).map(function(a){
         return '<option value="'+a.id+'"'+(cur&&cur.id===a.id?' selected':'')+'>'+esc(a.n)+' ('+a.lv+')</option>'}).join('')+'</optgroup>'}).join('')
    +'</select></div>'
    +(cur?'<div class="note" style="background:#F9FAFB;color:#475467">지금은 <b>'+esc(cur.n)+'</b>이 배정돼 있어요. 전 채널 사용 '+fmt(cur.use)+'회.</div>':'');
  open('m-cell')}
$('#cl-ok').addEventListener('click',function(){
  var v=$('#cl-a').value,k=schedKey(pCh,cellCtx.w,cellCtx.d);
  SCHED[k]=v?CONTENT.filter(function(c){return c.id===v})[0]:null;
  closeAll();V.programs();toast(v?'활동을 배정했어요':'휴강으로 바꿨어요','ok')});

/* ══════ 콘텐츠 ══════ */
var ctFil=[],ctSort={key:'use',dir:-1},ctq='';
V.content=function(){
  var h=$('#v-content');
  var live=CONTENT.filter(function(c){return c.st==='live'}).length;
  h.innerHTML=ph('콘텐츠','프로그램에 넣을 재료를 만들어요. 검사 항목의 <b>판정 기준</b>도 여기서만 바꿉니다.',
     '<button class="mb" type="button">콘텐츠 추가</button>')
   +kpi([['전체',String(CONTENT.length),'종',''],['배포 중',String(live),'종',''],
         ['시범 운영','1','종','진짜 색깔 찾기 · 2채널','wa'],
         ['이번 달 사용',fmt(CONTENT.reduce(function(a,c){return a+c.use},0)),'회','']])
   +note('<b>판정 기준을 바꾸면 과거 검사 결과의 등급도 다시 계산돼요.</b> 이미 보건소에 낸 리포트와 숫자가 어긋날 수 있어 적용 시작일을 함께 정해야 합니다.','cr')
   +'<div class="mc" style="padding:16px 20px;display:flex;flex-direction:column;gap:12px">'
     +'<div class="row">'+search('ctq','콘텐츠명으로 찾기','280px')
     +'<span style="margin-left:auto;font-size:13px;color:#667085">조건에 맞는 콘텐츠 <b class="mt" style="color:#101828" id="ct-cnt">'+CONTENT.length+'</b>종</span></div>'
     +'<div class="row" id="ct-chips"></div></div>'
   +'<div class="mc" style="overflow:hidden"><div class="scroll"><table class="mtb"><thead><tr id="ct-th"></tr></thead><tbody id="ct-tb"></tbody></table></div>'
     +'<div id="ct-empty" style="display:none"></div></div>';
  var cc=$('#ct-chips');
  ['두뇌훈련','운동','마음다루기','검사'].forEach(function(k){
    var n=CONTENT.filter(function(c){return c.k===k}).length;
    var b=el('button','mchip'+(ctFil.indexOf(k)>=0?' on':''),k+' <span class="c mt">'+n+'</span>');b.type='button';
    b.addEventListener('click',function(){var i=ctFil.indexOf(k);if(i>=0)ctFil.splice(i,1);else ctFil.push(k);V.content()});
    cc.appendChild(b)});
  $('#ctq').value=ctq;
  $('#ctq').addEventListener('input',function(){ctq=this.value;fill()});
  $('#ctq-x').addEventListener('click',function(){ctq='';$('#ctq').value='';fill()});
  function fill(){
    $('#ctq-x').style.display=ctq?'flex':'none';
    var list=CONTENT.filter(function(c){
      if(ctFil.length&&ctFil.indexOf(c.k)<0)return false;
      if(ctq&&c.n.indexOf(ctq)<0)return false;return true});
    list=sortBy(list,ctSort,function(c,k){return k==='n'?c.n:k==='k'?c.k:k==='up'?c.up:c[k]||0});
    var th=$('#ct-th');
    th.innerHTML=sth('콘텐츠','n',ctSort)+sth('유형','k',ctSort)+'<th>난이도</th>'
      +sth('사용','use',ctSort,1)+sth('배포 채널','ch',ctSort,1)+'<th>상태</th>'+sth('수정','up',ctSort)
      +'<th style="padding-right:20px"></th>';
    bindSort(th,ctSort,fill);
    var tb=$('#ct-tb');tb.innerHTML='';
    $('#ct-cnt').textContent=list.length;
    $('#ct-empty').innerHTML=list.length?'':A.emptyBox('조건에 맞는 콘텐츠가 없어요','필터를 줄여보세요');
    $('#ct-empty').style.display=list.length?'none':'block';
    list.forEach(function(c){
      var st=CT_ST[c.st],tr=el('tr','clk');
      tr.innerHTML='<td style="padding-left:20px"><span class="lnk" style="font-weight:600">'+esc(c.n)+'</span>'
        +(c.mv?'<span class="mcap" style="margin-left:6px">동작 '+c.mv+'개</span>':'')
        +(c.items?'<span class="mcap" style="margin-left:6px">'+c.items+'문항</span>':'')+'</td>'
       +'<td style="color:#475467">'+c.k+'</td><td class="mt" style="color:#475467">'+c.lv+'</td>'
       +'<td class="num mt">'+fmt(c.use)+'</td><td class="num mt" style="color:#475467">'+c.ch+'</td>'
       +'<td>'+pill(st[0],st[1])+'</td><td class="mt" style="color:#69707C">'+c.up+'</td>'
       +'<td style="text-align:right;padding-right:20px">'+(c.k==='검사'?'<button class="mb mbx" type="button">판정 기준</button>':'')+'</td>';
      var b=tr.querySelector('.mbx');
      if(b)b.addEventListener('click',function(e){e.stopPropagation();openCriteria(c)});
      tr.addEventListener('click',function(e){if(!e.target.closest('button'))openContent(c)});
      tb.appendChild(tr)})}
  fill()};

function openContent(c){
  $('#ct-t').textContent=c.n;
  $('#ct-b').innerHTML='<div class="row" style="gap:7px">'+pill(CT_ST[c.st][0],CT_ST[c.st][1])
    +'<span class="mcap">'+c.k+' · 난이도 '+c.lv+' · 마지막 수정 '+c.up+'</span></div>'
   +'<div class="mc kpi" style="grid-template-columns:repeat(3,1fr);box-shadow:none">'
     +'<div><div class="ml" style="font-size:12.5px">이번 달 사용</div><div class="mt" style="font-size:20px;font-weight:700;margin-top:4px">'+fmt(c.use)+'<span style="font-size:12px;color:#667085">회</span></div></div>'
     +'<div><div class="ml" style="font-size:12.5px">배포 채널</div><div class="mt" style="font-size:20px;font-weight:700;margin-top:4px">'+c.ch+'<span style="font-size:12px;color:#667085">개</span></div></div>'
     +'<div><div class="ml" style="font-size:12.5px">'+(c.mv?'동작':c.items?'문항':'구성')+'</div><div class="mt" style="font-size:20px;font-weight:700;margin-top:4px">'+(c.mv||c.items||'—')+'</div></div></div>'
   +'<div><label class="flab" for="ctf-n">콘텐츠명</label><input class="mfld" id="ctf-n" style="width:100%" value="'+esc(c.n)+'"></div>'
   +'<div><label class="flab" for="ctf-lv">난이도</label><select class="mfld" id="ctf-lv" style="width:100%">'
     +['하','중','상','—'].map(function(x){return '<option'+(x===c.lv?' selected':'')+'>'+x+'</option>'}).join('')+'</select></div>'
   +'<div><label class="flab" for="ctf-st">배포 상태</label><select class="mfld" id="ctf-st" style="width:100%">'
     +[['live','배포 중'],['test','시범 운영'],['draft','작성 중']].map(function(x){
        return '<option value="'+x[0]+'"'+(x[0]===c.st?' selected':'')+'>'+x[1]+'</option>'}).join('')+'</select></div>'
   +note('배포 상태를 바꾸면 <b>'+c.ch+'개 채널</b>에 즉시 반영돼요. 시범 운영으로 내리면 진행 중인 편성에서 빠집니다.','wa');
  open('m-content')}
$('#ct-save').addEventListener('click',function(){closeAll();toast('콘텐츠를 저장했어요','ok')});

/* 판정 기준 — SP-4 소급 적용 선택 */
var TESTS={T1:{n:'노인우울 (GDS-SF)',max:15,b:[[0,5,'정상'],[6,9,'주의'],[10,15,'위험']]},
 T2:{n:'불면증 (ISI-K)',max:28,b:[[0,7,'정상'],[8,14,'주의'],[15,21,'중등도'],[22,28,'심각']]},
 T3:{n:'스트레스 (PSS)',max:40,b:[[0,13,'정상'],[14,16,'주의'],[17,18,'높음'],[19,40,'매우 높음']]},
 T4:{n:'기억감퇴 (SMCQ)',max:14,b:[[0,5,'정상'],[6,14,'주의']]}};
function openCriteria(c){
  var t=TESTS[c.id];if(!t){toast('이 검사는 기준이 등록되지 않았어요','cr');return}
  $('#m-criteria-h').textContent=t.n+' 판정 기준';
  $('#cr-b').innerHTML=note('이 표가 <b>유일한 기준</b>이에요. 채널 어드민의 판정 기준 탭과 위험군 자동 선별이 모두 이 값을 읽습니다.','in')
   +'<div class="scroll"><table class="mtb"><thead><tr><th style="padding-left:4px">등급</th><th class="num">시작</th><th class="num">끝</th><th>구간</th></tr></thead><tbody>'
   +t.b.map(function(b,i){
     var k=['ok','wa','cr','cr'][i]||'nu';
     return '<tr><td style="padding-left:4px">'+pill(b[2],k)+'</td>'
      +'<td class="num"><input class="mfld mt" style="width:70px;height:30px;text-align:right" value="'+b[0]+'" aria-label="'+b[2]+' 시작 점수"></td>'
      +'<td class="num"><input class="mfld mt" style="width:70px;height:30px;text-align:right" value="'+b[1]+'" aria-label="'+b[2]+' 끝 점수"></td>'
      +'<td class="mt" style="color:#667085">'+b[0]+'–'+b[1]+'점</td></tr>'}).join('')
   +'</tbody></table></div>'
   +'<div><label class="flab" for="cr-from">적용 시작일</label><input type="date" class="mfld" id="cr-from" value="2026-09-01" style="width:100%"></div>'
   +'<div class="danger"><h3>과거 데이터는 어떻게 할까요</h3>'
     +'<label style="display:flex;gap:9px;align-items:flex-start;font-size:13.5px;color:#475467;cursor:pointer;padding:6px 0">'
     +'<input type="radio" name="cr-past" checked style="margin-top:3px"><span>적용 시작일 이전은 <b>당시 기준을 유지</b> (권장)<span class="mcap" style="display:block">이미 제출한 보건소 리포트와 숫자가 맞아요</span></span></label>'
     +'<label style="display:flex;gap:9px;align-items:flex-start;font-size:13.5px;color:#475467;cursor:pointer;padding:6px 0">'
     +'<input type="radio" name="cr-past" style="margin-top:3px"><span>전체 소급 재계산<span class="mcap" style="display:block">과거 등급이 바뀌어 제출한 자료와 어긋날 수 있어요</span></span></label></div>';
  open('m-criteria')}
$('#cr-ok').addEventListener('click',function(){closeAll();toast('판정 기준을 저장했어요. 9월 1일부터 적용돼요','ok')});

/* ══════ 챌린지 ══════ */
var qSort={key:'s',dir:-1};
V.challenges=function(){
  var h=$('#v-challenges');
  var run=CHALLENGES.filter(function(q){return q.st==='run'});
  var rev=CHALLENGES.filter(function(q){return q.st==='review'});
  h.innerHTML=ph('챌린지','여러 채널에 걸쳐 챌린지를 만들어요. 채널 어드민은 결과만 봅니다.',
     '<button class="mb mbp" type="button" data-go="challengenew">챌린지 만들기</button>')
   +kpi([['진행 중',String(run.length),'개',fmt(run.reduce(function(a,q){return a+q.part},0))+'명 참여'],
         ['검수 필요',String(rev.length),'개','9월 1일 시작 예정','cr'],
         ['종료',String(CHALLENGES.filter(function(q){return q.st==='done'}).length),'개',''],
         ['평균 성공률','27','%','출석형 24% · 걷기형 31%']])
   +(rev.length?note('<b>9월 출석 챌린지가 아직 승인되지 않았어요.</b> 9월 1일 시작인데 대상 채널 4곳에 아직 안내가 나가지 않았습니다.','cr'):'')
   +'<div class="mc" style="overflow:hidden"><div class="scroll"><table class="mtb"><thead><tr id="q-th"></tr></thead><tbody id="q-tb"></tbody></table></div></div>';
  function fill(){
    var list=sortBy(CHALLENGES,qSort,function(q,k){return k==='n'?q.n:k==='s'?q.s:k==='rate'?(q.part?q.succ/q.part:0):q[k]||0});
    var th=$('#q-th');
    th.innerHTML=sth('챌린지','n',qSort)+'<th>유형</th><th>기준</th>'+sth('시작','s',qSort)+'<th>대상 채널</th>'
      +sth('참여','part',qSort,1)+sth('성공','succ',qSort,1)+sth('성공률','rate',qSort,1)+'<th>상태</th><th style="padding-right:20px"></th>';
    bindSort(th,qSort,fill);
    var tb=$('#q-tb');tb.innerHTML='';
    list.forEach(function(q){
      var st=Q_ST[q.st],tr=el('tr');
      var rate=q.part?Math.round(q.succ/q.part*100):null;
      tr.innerHTML='<td style="padding-left:20px;font-weight:600">'+esc(q.n)+'</td>'
       +'<td>'+q.type+'</td>'
       +'<td class="mcap">'+(q.ty==='step'?fmt(q.per)+'보':q.per+'회')+' × '+q.crit+'일'+(q.wk?'':' <span style="color:#B54708">주말 포함</span>')+'</td>'
       +'<td class="mt" style="color:#475467">'+q.s+'</td>'
       +'<td>'+q.chs.map(function(x){return chChip(x)}).join(' ')+'</td>'
       +'<td class="num mt">'+(q.part?fmt(q.part):'—')+'</td><td class="num mt">'+(q.succ?fmt(q.succ):'—')+'</td>'
       +'<td class="num mt">'+(rate!==null&&q.st!=='run'?rate+'%':'—')+'</td>'
       +'<td>'+pill(st[0],st[1])+'</td>'
       +'<td style="text-align:right;padding-right:20px">'+(q.st==='review'?'<button class="mb mbs mbp" type="button">승인</button>':'')+'</td>';
      var b=tr.querySelector('.mb');
      if(b)b.addEventListener('click',function(){q.st='run';V.challenges();
        toast(q.n+'를 승인했어요. 대상 채널 '+q.chs.length+'곳에 안내가 나가요','ok')});
      tb.appendChild(tr)})}
  fill()};

/* ══════ 챌린지 만들기 ══════ */
var nq={n:'',type:'출석',crit:15,per:2,chs:['C01'],wk:true,s:'2026-09-01',e:'2026-09-30'};
V.challengenew=function(){
  var h=$('#v-challengenew');
  var reach=nq.chs.reduce(function(a,id){var c=byCh[id];return a+(c?c.app:0)},0);
  h.innerHTML=ph('챌린지 만들기','기준을 정하고 대상 채널을 고르세요.',
     '<button class="mb" type="button" id="nq-b">‹ 목록</button><button class="mb mbp" type="button" id="nq-ok">만들기</button>')
   +'<div style="display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:16px">'
   +'<div class="gap">'
     +'<div class="mc" style="padding:20px;display:flex;flex-direction:column;gap:16px">'
       +'<h2 class="mh">기본</h2>'
       +'<div><label class="flab" for="nq-n">이름</label><input class="mfld" id="nq-n" style="width:100%" placeholder="예) 9월 출석 챌린지" value="'+esc(nq.n)+'"></div>'
       +'<div class="row"><div style="flex:1"><label class="flab" for="nq-s">시작</label><input type="date" class="mfld" id="nq-s" value="'+nq.s+'" style="width:100%"></div>'
       +'<div style="flex:1"><label class="flab" for="nq-e">종료</label><input type="date" class="mfld" id="nq-e" value="'+nq.e+'" style="width:100%"></div></div>'
       +'<div><span class="flab">유형</span><div class="row" id="nq-ty"></div></div></div>'
     +'<div class="mc" style="padding:20px;display:flex;flex-direction:column;gap:16px">'
       +'<h2 class="mh">달성 기준</h2>'
       +'<div class="row"><div style="flex:1"><label class="flab" for="nq-per">'+(nq.type==='걷기'?'하루 걸음 수':'하루 활동 횟수')+'</label>'
         +'<input class="mfld mt" id="nq-per" style="width:100%" value="'+nq.per+'" inputmode="numeric"></div>'
       +'<div style="flex:1"><label class="flab" for="nq-crit">달성 일수</label><input class="mfld mt" id="nq-crit" style="width:100%" value="'+nq.crit+'" inputmode="numeric"></div></div>'
       +'<label style="display:flex;gap:9px;align-items:flex-start;font-size:13.5px;color:#475467;cursor:pointer" id="nq-wkw">'
         +cbx(nq.wk?'on':'off','주말은 판정에서 제외')+'<span>주말은 판정에서 제외<span class="mcap" style="display:block">지금 출석형만 이 규칙을 쓰고 걷기형은 안 써요. 유형별로 다른 게 맞는지 확인이 필요합니다</span></span></label></div>'
     +'<div class="mc" style="padding:20px;display:flex;flex-direction:column;gap:14px">'
       +'<h2 class="mh">대상 채널</h2><div id="nq-chs" style="display:flex;flex-direction:column;gap:2px"></div></div></div>'
   +'<div class="gap"><div class="mc" style="padding:20px;display:flex;flex-direction:column;gap:14px">'
       +'<h2 class="mh">요약</h2>'
       +'<div style="display:flex;flex-direction:column;gap:9px" id="nq-sum"></div>'
       +'<div style="padding:14px;background:#F4F3FF;border-radius:8px;margin-top:4px">'
         +'<span class="mcap" style="color:#53389E">받는 사람</span>'
         +'<div class="reach mt'+(reach>2000?' big':'')+'" style="font-size:26px;margin-top:3px">'+fmt(reach)+'<span style="font-size:13px;font-weight:600;color:#53389E">명</span></div>'
         +'<span class="mcap" style="color:#53389E">앱을 설치한 분만 셈</span></div></div></div></div>';
  var ty=$('#nq-ty');
  [['출석','att'],['걷기','step']].forEach(function(x){
    var b=el('button','mchip'+(nq.type===x[0]?' on':''),x[0]);b.type='button';
    b.addEventListener('click',function(){nq.type=x[0];nq.per=x[0]==='걷기'?3000:2;nq.wk=x[0]==='출석';V.challengenew()});
    ty.appendChild(b)});
  var cw=$('#nq-chs');
  CHANNELS.filter(function(c){return c.st==='run'}).forEach(function(c){
    var on=nq.chs.indexOf(c.id)>=0;
    var lab=el('label','chk');
    lab.style.cssText='display:flex;gap:10px;align-items:center;padding:9px 2px;cursor:pointer;font-size:13.5px';
    lab.innerHTML=cbx(on?'on':'off',c.n)+'<span>'+esc(c.n)+'</span>'
      +'<span class="mcap mt" style="margin-left:auto">앱 '+fmt(c.app)+'명</span>';
    lab.addEventListener('click',function(e){
      e.preventDefault();
      var i=nq.chs.indexOf(c.id);if(i>=0)nq.chs.splice(i,1);else nq.chs.push(c.id);
      V.challengenew()});
    cw.appendChild(lab)});
  var sum=$('#nq-sum');
  [['이름',nq.n||'—'],['기간',nq.s+' ~ '+nq.e],['유형',nq.type+'형'],
   ['기준',(nq.type==='걷기'?fmt(nq.per)+'보':nq.per+'회')+' × '+nq.crit+'일'],
   ['주말',nq.wk?'판정에서 제외':'판정에 포함'],['채널',nq.chs.length+'곳']].forEach(function(r){
    sum.insertAdjacentHTML('beforeend','<div style="display:flex;gap:10px;font-size:13px"><span style="color:#667085;width:52px;flex:none">'+r[0]+'</span><b style="font-weight:600">'+esc(String(r[1]))+'</b></div>')});
  $('#nq-n').addEventListener('input',function(){nq.n=this.value});
  $('#nq-per').addEventListener('input',function(){nq.per=+this.value||0});
  $('#nq-crit').addEventListener('input',function(){nq.crit=+this.value||0});
  $('#nq-s').addEventListener('change',function(){nq.s=this.value});
  $('#nq-e').addEventListener('change',function(){nq.e=this.value});
  $('#nq-wkw').addEventListener('click',function(e){e.preventDefault();nq.wk=!nq.wk;V.challengenew()});
  $('#nq-b').addEventListener('click',function(){go('challenges')});
  $('#nq-ok').addEventListener('click',function(){
    if(!nq.n){toast('챌린지 이름을 입력해주세요','cr');$('#nq-n').focus();return}
    if(!nq.chs.length){toast('대상 채널을 하나 이상 골라주세요','cr');return}
    CHALLENGES.unshift({id:'Q'+(CHALLENGES.length+1),n:nq.n,type:nq.type,ty:nq.type==='걷기'?'step':'att',
      s:nq.s,e:nq.e,crit:nq.crit,per:nq.per,chs:nq.chs.slice(),part:0,succ:0,st:'review',wk:nq.wk});
    go('challenges');toast(nq.n+'을 만들었어요. 검수 후 시작돼요','ok','되돌리기',function(){CHALLENGES.shift();V.challenges()})})};
})(Sup);
