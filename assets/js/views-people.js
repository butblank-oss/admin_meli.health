(function(A){
"use strict";
var $=A.$,$$=A.$$,el=A.el,esc=A.esc,fmt=A.fmt,pad2=A.pad2,rnd=A.rnd,pill=A.pill,note=A.note,kpi=A.kpi,cbx=A.cbx,
    brow=A.brow,ph=A.ph,chead=A.chead,emptyBox=A.emptyBox,search=A.search,sth=A.sth,bindSort=A.bindSort,
    sortBy=A.sortBy,mkPager=A.mkPager,toast=A.toast,open=A.open,closeAll=A.closeAll,go=A.go,V=A.V,
    PEOPLE=A.PEOPLE,byId=A.byId,ORGS=A.ORGS,BRAIN=A.BRAIN,MIND=A.MIND,ASMT=A.ASMT,ROUT=A.ROUT,
    QUESTS=A.QUESTS,APPS=A.APPS,AUDIT=A.AUDIT,dayRec=A.dayRec,moveRows=A.moveRows,assessHist=A.assessHist,
    achieve=A.achieve,addAudit=A.addAudit,LT=A.LT,RT=A.RT;
function cnt(f){return PEOPLE.filter(f).length}
function statusPill(p){
  if(p.status==='withdrawn')return pill('회원탈퇴','cr');
  if(p.status==='dropped')return pill('중도포기','nu');
  if(p.status==='expired')return pill('만료','nu');
  if(p.actBand==='14일+ 무활동')return pill('활동 중단','wa');
  return pill('참여 중','nu')}

/* ══════ 오늘 ══════ */
V.today=function(){
  var h=$('#v-today');
  var sp=[93,97,92,96,91,28,21,93,100,85,96,92,28,22].map(function(n,i){
    return '<i class="'+([5,6,12,13].indexOf(i)>=0?'wk':'')+'" style="height:'+n+'%"></i>'}).join('');
  h.innerHTML=
   ph('오늘','2026년 8월 21일 목요일 · 3기 171일째',
     '<span class="mcap" style="margin-right:2px">기간</span><button class="mchip">오늘</button><button class="mchip">최근 7일</button><button class="mchip on">이번 달</button><button class="mchip">지난 달</button><button class="mb mbp" data-go="report" style="margin-left:8px">8월 리포트 만들기</button>')
   +kpi([['3기 대상자','822','명','1기 230 · 2기 714'],['이번 주 활동자','191','명','전주보다 6명 늘었어요','','up'],
         ['어제 활동','1,284','회','일평균 1,350회'],['14일+ 무활동','184','명','지난주보다 21명 늘었어요','wa'],
         ['답변 대기 상담','4','건','가장 오래된 건 3일째','cr'],['처리 안 된 신청','111','건','가장 오래된 건 42일째','cr']])
   +'<div class="mc"><div style="padding:16px 20px 12px"><span class="mh">처리할 일</span></div><div id="t-todo"></div></div>'
   +'<div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:16px">'
   +'<div class="mc" style="padding:20px;display:flex;flex-direction:column">'
     +'<div style="display:flex;align-items:baseline"><span class="mh">최근 2주 활동</span><span class="mcap" style="margin-left:auto">주말은 회색</span></div>'
     +'<div class="spark" style="margin-top:24px">'+sp+'</div>'
     +'<div class="mcap mt" style="display:flex;justify-content:space-between;margin-top:14px"><span>08-08</span><span>08-14</span><span>08-21</span></div>'
     +'<p class="mcap" style="margin:24px 0 0;font-size:13px">추천 활동이 평일에만 있어서 주말 활동량이 평일의 <b style="color:#101828">27%</b>로 떨어져요.</p></div>'
   +'<div class="mc" style="overflow:hidden;display:flex;flex-direction:column">'+chead('먼저 연락해볼 분들','<span class="mcap">자동 선별</span>')
     +'<table class="mtb"><thead><tr><th style="padding-left:20px">이름</th><th>사유</th><th class="num">경과</th><th style="padding-right:20px"></th></tr></thead><tbody id="t-attn"></tbody></table>'
     +'<p class="mcap" style="padding:14px 20px;margin:auto 0 0">선별 기준은 활동 현황 → 판정 기준에서 바꿀 수 있어요.</p></div></div>';
  var TD=[['cr','참여 신청 111건이 대기 중이에요','이 중 27명은 이미 앱에 가입해서 활동하고 있어요','신청 목록 열기','apply',''],
   ['wa','답변을 기다리는 상담이 4건 있어요','가장 오래된 건 3일 지났어요. 영업일 3일이 넘으면 운영팀에 알림이 가요','상담실 열기','consult',''],
   ['ok','7월 보건소 제출 자료를 아직 안 만들었어요','6개 항목 중 5개는 자동으로 채워져요','리포트 만들기','report','mbp']];
  var tb=$('#t-todo');
  TD.forEach(function(t,ix){
    var c={cr:['#FEF3F2','#B42318'],wa:['#FFFAEB','#B54708'],ok:['#ECFDF3','#067647']}[t[0]];
    var d=el('div');d.style.cssText='display:flex;align-items:center;gap:12px;padding:'+(ix===TD.length-1?'14px 20px 20px':'14px 20px')+';'+(ix?'border-top:1px solid #F2F4F7':'');
    d.innerHTML='<span style="width:34px;height:34px;flex:none;border-radius:8px;background:'+c[0]+';color:'+c[1]+';display:flex;align-items:center;justify-content:center">'+A.BANG+'</span>'+
     '<span style="min-width:0"><span style="display:block;font-size:13.5px;font-weight:600">'+t[1]+'</span><span class="mcap" style="display:block;margin-top:2px">'+t[2]+'</span></span>'+
     '<button class="mb '+t[5]+'" data-go="'+t[4]+'" style="margin-left:auto;flex:none">'+t[3]+'</button>';
    tb.appendChild(d)});
  [['정*순','우울 위험','cr','GDS-SF 11점','3일','P10007'],['황*학','활동 중단','wa','14일 무활동','14일','P10011'],
   ['이*자','불면 경계','wa','ISI-K 16점','6일','P10019'],['박*희','앱 미설치','cr','승인 후 미가입','37일','P10027']].forEach(function(a){
    var tr=el('tr');
    tr.innerHTML='<td style="padding-left:20px"><span class="lnk">'+a[0]+'</span></td><td>'+pill(a[1],a[2])+' <span class="mcap" style="margin-left:4px">'+a[3]+'</span></td>'+
     '<td class="num mt" style="color:#667085">'+a[4]+'</td><td style="text-align:right;padding-right:20px"><button class="mb mbs">연락</button></td>';
    tr.querySelector('.lnk').addEventListener('click',function(){openPerson(byId[a[5]],'today')});
    tr.querySelector('.mb').addEventListener('click',function(){toast(a[0]+'님에게 연락 메모를 남겼어요','ok','실행 취소',null)});
    $('#t-attn').appendChild(tr)})};

/* ══════ 참여자 ══════ */
var pf={st:[],org:[],act:[]},pSel={},pAll=false,pageRows=[],pSort={key:'days',dir:-1},pPager=mkPager(function(){V.people(1)}),pList=[],pq='',pAge=0,pSex=0;
V.people=function(keep){
  var h=$('#v-people');
  if(!keep){
    h.innerHTML=ph('참여자','3기에 배정된 822명을 관리해요.',
      '<button class="mb" id="p-msg">단체 메시지</button><button class="mb" data-modal="m-export">명단 내려받기</button>')
     +'<div class="mc" style="padding:16px 20px;display:flex;flex-direction:column;gap:12px">'
       +'<div class="row">'+search('pq','이름, 전화 뒷자리, PIN으로 찾기','320px')
       +'<select class="mfld" id="p-age" aria-label="연령대 필터"><option>연령 전체</option><option>60대 미만</option><option>60대</option><option>70대</option><option>80대 이상</option></select>'
       +'<select class="mfld" id="p-sex" aria-label="성별 필터"><option>성별 전체</option><option>여성</option><option>남성</option><option>미상</option></select>'
       +'<span style="margin-left:auto;font-size:13px;color:#667085">조건에 맞는 참여자 <b class="mt" style="color:#101828" id="p-cnt">822</b>명</span></div>'
       +'<div class="row" id="p-chips"></div><div class="row" id="p-app" style="display:none;padding-top:10px;border-top:1px solid #F2F4F7"></div></div>'
     +'<div class="mc" style="overflow:hidden"><div class="bulk" id="p-bulk"></div>'
       +'<div class="scroll"><table class="mtb"><thead><tr id="p-th"></tr></thead><tbody id="p-tb"></tbody></table></div>'
       +'<div id="p-empty" style="display:none"></div><div class="pager" id="p-pg"></div></div>';
    var CH=[['참여 중','st:active',cnt(function(p){return p.status==='active'})],['중도포기','st:dropped',cnt(function(p){return p.status==='dropped'})],
      ['만료','st:expired',cnt(function(p){return p.status==='expired'})],['회원탈퇴','st:withdrawn',cnt(function(p){return p.status==='withdrawn'})],['|',''],
    ].concat(ORGS.map(function(o){return [o,'org:'+o,cnt(function(p){return p.org===o})]})).concat([['|',''],
      ['오늘 수행','act:today',cnt(function(p){return p.todayN>0})],['최근 활동','act:최근 활동',cnt(function(p){return p.actBand==='최근 활동'})],
      ['7일+ 무활동','act:7일+ 무활동',cnt(function(p){return p.actBand==='7일+ 무활동'})],
      ['14일+ 무활동','act:14일+ 무활동',cnt(function(p){return p.actBand==='14일+ 무활동'})],
      ['무활동','act:무활동',cnt(function(p){return p.actBand==='무활동'})]]);
    var cb=$('#p-chips');
    CH.forEach(function(c){
      if(c[0]==='|'){cb.appendChild(el('span','sep'));return}
      var on=(c[1].indexOf('st:')===0&&pf.st.indexOf(c[1].slice(3))>=0)||(c[1].indexOf('org:')===0&&pf.org.indexOf(c[1].slice(4))>=0)||(c[1].indexOf('act:')===0&&pf.act.indexOf(c[1].slice(4))>=0);
      var b=el('button','mchip'+(on?' on':''),esc(c[0])+(c[2]!=null?' <span class="c mt">'+fmt(c[2])+'</span>':''));
      b.dataset.v=c[1];
      b.addEventListener('click',function(){toggleChip(c[1])});cb.appendChild(b)});
    $('#pq').value=pq;$('#p-age').selectedIndex=pAge;$('#p-sex').selectedIndex=pSex;
    $('#pq').addEventListener('input',function(){pq=this.value;pPager.page=1;V.people(1)});
    $('#pq-x').addEventListener('click',function(){pq='';pPager.page=1;V.people()});
    $('#p-age').addEventListener('change',function(){pAge=this.selectedIndex;pPager.page=1;V.people(1)});
    $('#p-sex').addEventListener('change',function(){pSex=this.selectedIndex;pPager.page=1;V.people(1)});
    $('#p-msg').addEventListener('click',function(){go('pushnew')});
  }
  pList=sortBy(filterP(),pSort,function(p,k){return k==='name'?p.full:k==='pin'?+p.pin:k==='birth'?p.birth:k==='org'?p.org:k==='days'?p.days:k==='rate'?p.rate:k==='last'?-p.last:0});
  $('#p-cnt').textContent=fmt(pList.length);
  $('#pq-x').style.display=pq?'flex':'none';
  renderApplied();
  pageRows=pList.slice((pPager.page-1)*pPager.size,pPager.page*pPager.size);
  var allOn=pageRows.length&&pageRows.every(function(p){return pSel[p.id]}),someOn=pageRows.some(function(p){return pSel[p.id]});
  var thh=$('#p-th');
  thh.innerHTML='<th style="width:50px;padding-left:20px"><span id="p-all">'+cbx(allOn?'on':someOn?'mx':'off','이 페이지 전체 선택')+'</span></th>'
   +sth('이름','name',pSort)+sth('PIN','pin',pSort,1)+'<th class="num">N</th><th>연락처</th>'+sth('생년','birth',pSort,1)
   +sth('기관','org',pSort)+'<th>상태</th>'+sth('활동일','days',pSort,1)+sth('수행률','rate',pSort,1)
   +sth('최근 이용','last',pSort)+'<th style="padding-right:20px">앱</th>';
  bindSort(thh,pSort,function(){pPager.page=1;V.people(1)});
  $('#p-all').addEventListener('click',function(){var on=!allOn;pageRows.forEach(function(p){if(on)pSel[p.id]=1;else delete pSel[p.id]});if(!on)pAll=false;V.people(1)});
  var rows=pPager.slice(pList),tb=$('#p-tb');tb.innerHTML='';
  $('#p-empty').innerHTML=pList.length?'':emptyBox('조건에 맞는 참여자가 없어요','필터를 줄이거나 조건을 지워보세요','조건 초기화');
  $('#p-empty').style.display=pList.length?'none':'block';
  if(!pList.length)$('#p-empty .mb').addEventListener('click',resetP);
  rows.forEach(function(p){
    var tr=el('tr','clk'+(pSel[p.id]?' sel':''));
    tr.innerHTML='<td style="padding-left:20px">'+cbx(pSel[p.id]?'on':'off',p.name+' 선택')+'</td>'
     +'<td><span class="mask-n" style="font-weight:600">'+p.name+'</span> <button class="mb mbx rv" style="margin-left:4px">보기</button></td>'
     +'<td class="num mt" style="color:#69707C">'+p.pin+'</td>'
     +'<td class="num">'+(p.todayN?'<span class="mpill" style="background:#E7F9F1;color:#065C3D">'+p.todayN+'</span>':'')+'</td>'
     +'<td class="mt mask-p" style="color:#475467">'+p.phone+'</td>'
     +'<td class="num mt" style="color:#475467">'+p.birth+'</td>'
     +'<td style="color:'+(p.org==='미배정'?'#69707C':'#475467')+'">'+p.org+'</td><td>'+statusPill(p)+'</td>'
     +'<td class="num mt">'+p.days+'</td><td class="num mt">'+(p.days?p.rate+'%':'—')+'</td>'
     +'<td class="mt" style="color:#667085">'+(p.last>900?'—':p.last===0?'오늘':p.last+'일 전')+'</td>'
     +'<td class="mt" style="color:#69707C;padding-right:20px">'+p.app+'</td>';
    tr.querySelector('.cbx').addEventListener('click',function(e){e.stopPropagation();if(pSel[p.id])delete pSel[p.id];else pSel[p.id]=1;pAll=false;V.people(1)});
    tr.querySelector('.rv').addEventListener('click',function(e){e.stopPropagation();askReveal(p,tr)});
    tr.addEventListener('click',function(e){if(!e.target.closest('button')&&!e.target.closest('.cbx'))openPerson(p,'people')});
    tb.appendChild(tr)});
  pPager.render($('#p-pg'));
  renderBulk()};
function toggleChip(v){
  var t=v.slice(0,v.indexOf(':')),val=v.slice(v.indexOf(':')+1),arr=pf[t==='st'?'st':t==='org'?'org':'act'];
  var i=arr.indexOf(val);if(i>=0)arr.splice(i,1);else arr.push(val);
  pPager.page=1;V.people()}
function filterP(){
  var ab=['','60대 미만','60대','70대','80대 이상'][pAge],sx=['','여성','남성','미상'][pSex];
  return PEOPLE.filter(function(p){
    if(pf.st.length&&pf.st.indexOf(p.status)<0)return false;
    if(pf.org.length&&pf.org.indexOf(p.org)<0)return false;
    if(pf.act.length&&!pf.act.some(function(v){return v==='today'?p.todayN>0:p.actBand===v}))return false;
    if(ab&&p.ageBand!==ab)return false;
    if(sx&&p.sex!==sx)return false;
    if(pq)return p.full.indexOf(pq)>=0||p.tail.indexOf(pq)>=0||p.pin.indexOf(pq)>=0;
    return true})}
function renderApplied(){
  var box=$('#p-app'),it=[];
  if(pq)it.push(['검색 “'+pq+'”',function(){pq='';V.people()}]);
  pf.st.forEach(function(v){it.push([{active:'참여 중',dropped:'중도포기',expired:'만료',withdrawn:'회원탈퇴'}[v],function(){toggleChip('st:'+v)}])});
  pf.org.forEach(function(v){it.push([v,function(){toggleChip('org:'+v)}])});
  pf.act.forEach(function(v){it.push([v==='today'?'오늘 수행':v,function(){toggleChip('act:'+v)}])});
  if(pAge)it.push([['','60대 미만','60대','70대','80대 이상'][pAge],function(){pAge=0;V.people()}]);
  if(pSex)it.push([['','여성','남성','미상'][pSex],function(){pSex=0;V.people()}]);
  if(!it.length){box.style.display='none';return}
  box.style.display='flex';box.innerHTML='<span class="mcap" style="margin-right:2px">적용된 조건</span>';
  it.forEach(function(x){var c=el('span','ftag',esc(x[0])+'<button type="button" class="x" aria-label="'+esc(x[0])+' 필터 제거">✕</button>');
    c.querySelector('.x').addEventListener('click',x[1]);box.appendChild(c)});
  var b=el('button','mb mbs mbg','모두 지우기');b.addEventListener('click',resetP);box.appendChild(b)}
function resetP(){pf={st:[],org:[],act:[]};pq='';pAge=0;pSex=0;pPager.page=1;V.people()}
function selN(){return pAll?pList.length:Object.keys(pSel).length}
function renderBulk(){
  var b=$('#p-bulk'),n=selN();
  if(!n){b.className='bulk';b.innerHTML='';return}
  b.className='bulk'+(pAll?' all':'')+' on';b.innerHTML='';
  b.appendChild(el('span',null,'<span style="font-size:13.5px;font-weight:700">'+(pAll?'조건에 맞는 <b class="mt">'+fmt(pList.length)+'</b>명 전체가 선택됐어요':'<b class="mt">'+fmt(n)+'</b>명 선택')+'</span>'));
  if(!pAll&&pList.length>n){var a=el('button','lb','조건에 맞는 '+fmt(pList.length)+'명 모두 선택');
    a.addEventListener('click',function(){pAll=true;pList.forEach(function(p){pSel[p.id]=1});V.people(1)});b.appendChild(a)}
  if(pAll){var a2=el('button','lb','이 페이지만 선택');
    a2.addEventListener('click',function(){pAll=false;pSel={};pageRows.forEach(function(p){pSel[p.id]=1});V.people(1)});b.appendChild(a2)}
  b.appendChild(el('span','sep'));
  [['메시지 보내기',function(){go('pushnew')}],['명단 내려받기',function(){$('#ex-scope').innerHTML='<option>선택한 참여자 '+fmt(selN())+'명</option>';open('m-export')}],
   ['탈퇴 처리',function(){openWithdraw(Object.keys(pSel).map(function(k){return byId[k]}).filter(Boolean))}]].forEach(function(x,i){
    var btn=el('button','mb mbs'+(i===2?' mbd':''),x[0]);btn.style.background='#fff';btn.addEventListener('click',x[1]);b.appendChild(btn)});
  var cl=el('button','lb','선택 해제');cl.style.marginLeft='auto';cl.addEventListener('click',function(){pSel={};pAll=false;V.people(1)});b.appendChild(cl)}

/* reveal */
var revC=null,revT=null;
function askReveal(p,tr){
  if(tr.dataset.rev==='1'){hideRev(p,tr);return}
  revC={p:p,tr:tr};$('#rev-t').textContent=p.name+' · '+p.phone+' ('+p.org+')';
  $('#rev-r').value='';$('#rev-e').style.display='none';$('#rev-r').classList.remove('err');open('m-reveal')}
$('#rev-r').addEventListener('change',function(){$('#rev-e').style.display='none';this.classList.remove('err')});
$('#rev-ok').addEventListener('click',function(){
  if(!$('#rev-r').value){$('#rev-e').style.display='flex';$('#rev-r').classList.add('err');return}
  if(!revC||!revC.tr||!revC.tr.isConnected){closeAll();toast('목록이 새로고침되어 다시 시도해야 해요','wa');return}
  var p=revC.p,tr=revC.tr;
  tr.querySelector('.mask-n').textContent=p.full;tr.querySelector('.mask-p').textContent=p.phoneFull;
  tr.querySelector('.rv').textContent='가리기';tr.dataset.rev='1';tr.style.background='#FFFAEB';
  addAudit('원문 열람','1건',$('#rev-r').value);
  toast('원문을 열었어요. 30초 뒤 자동으로 가려져요','wa');
  revT=setTimeout(function(){if(tr.dataset.rev==='1')hideRev(p,tr)},30000);closeAll()});
function hideRev(p,tr){clearTimeout(revT);
  tr.querySelector('.mask-n').textContent=p.name;tr.querySelector('.mask-p').textContent=p.phone;
  tr.querySelector('.rv').textContent='보기';tr.dataset.rev='';tr.style.background=''}

/* withdraw */
var wdL=[],wdA=false;
function openWithdraw(list){
  wdL=list.filter(function(p){return p.status!=='withdrawn'});
  if(!wdL.length){toast('탈퇴 처리할 대상이 없어요','cr');return}
  $('#wd-c').textContent=fmt(wdL.length)+'명';
  $('#wd-n').innerHTML=wdL.slice(0,10).map(function(p){return p.name+' <span class="mt" style="color:#69707C">'+p.phone+' · '+p.org+'</span>'}).join('<br>')+(wdL.length>10?'<br><span style="color:#69707C">외 '+(wdL.length-10)+'명</span>':'');
  $('#wd-r').value='';wdA=false;setWdA();updWd();open('m-withdraw')}
function updWd(){var ok=$('#wd-r').value&&wdA,b=$('#wd-ok');b.style.opacity=ok?'1':'.8';b.style.cursor=ok?'pointer':'not-allowed';b.dataset.ok=ok?'1':'';
  b.setAttribute('aria-disabled',ok?'false':'true');
  b.setAttribute('aria-describedby','wd-hint')}
$('#wd-r').addEventListener('change',updWd);
$('#wd-aw').addEventListener('click',function(e){e.preventDefault();wdA=!wdA;setWdA();updWd()});
function setWdA(){var a=$('#wd-a');a.className='cbx'+(wdA?' on':'');a.setAttribute('aria-checked',wdA?'true':'false')}
$('#wd-ok').addEventListener('click',function(){
  if(!this.dataset.ok)return;
  var n=wdL.length,r=$('#wd-r').value;
  wdL.forEach(function(p){p.status='withdrawn';delete pSel[p.id]});
  pAll=false;addAudit('탈퇴 처리',n+'건',r);closeAll();V.people();toast(fmt(n)+'명을 탈퇴 처리했어요','ok')});
$('#ex-mask').addEventListener('change',function(){
  var r=this.value==='r',n=$('#ex-note');
  n.style.background=r?'#FEF3F2':'#F9FAFB';n.style.color=r?'#B42318':'#475467';
  n.textContent=r?'원문이 포함된 파일이 만들어져요. 사유를 입력해야 하고 파일에 내려받은 사람과 시각이 표시돼요.':'가린 상태로 내려받아요. 이름은 가운데 글자, 전화번호는 뒷 4자리만 나와요.'});
$('#ex-go').addEventListener('click',function(){addAudit('명단 내려받기',fmt(selN()||pList.length)+'건','명단 내려받기');closeAll();toast('엑셀 파일을 내려받았어요','ok')});
$('#ed-s').addEventListener('click',function(){closeAll();toast('정보를 저장했어요','ok')});
$('#sr-go').addEventListener('click',function(){closeAll();toast('일정 변경을 요청했어요. 운영팀이 확인하면 알려드려요','ok')});

/* ══════ 참여자 상세 ══════ */
var cP=null,pdTab='act',pdSel=null,pdM=null,backTo='people';
var AMIN=new Date(2026,2,3),AMAX=new Date(2026,7,21);
function dstr(d){return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate())}
function lastAct(p){var d=new Date(2026,7,21);if(p.last<=160)d.setDate(d.getDate()-p.last);return d}
function openPerson(p,from){cP=p;backTo=from||'people';pdTab='act';pdSel=null;pdM=null;go('person')}
A.openPerson=openPerson;
V.person=function(){
  var p=cP,h=$('#v-person');if(!p)return;
  h.innerHTML=ph(p.name,p.birth+'년생 · '+p.sex+' · PIN '+p.pin+' · '+p.org,
    '<button class="mb" id="pd-b">‹ 목록</button><button class="mb" id="pd-e">정보 수정</button><button class="mb" id="pd-c">상담 열기</button><button class="mb mbd" id="pd-o">탈퇴 처리</button>')
   +kpi([['누적 활동일',p.days,'일'],['수행률',p.days?p.rate:'—',p.days?'%':''],['연속 출석',p.streak,'일'],
         ['랭킹 점수',fmt(p.score),'/ 1000'],['마음 기록',p.mind,'회'],['일평균 걸음',fmt(p.step),'보']])
   +(p.days===0?'<div class="mc" id="pd-none"></div>':'<div class="mc" style="overflow:hidden"><div class="tabs" id="pd-tabs"></div><div id="pd-body"></div></div>');
  $('#pd-b').addEventListener('click',function(){go(backTo)});
  $('#pd-o').addEventListener('click',function(){openWithdraw([p])});
  $('#pd-c').addEventListener('click',function(){go('consult')});
  $('#pd-e').addEventListener('click',function(){$('#ed-n').value=p.full;$('#ed-b').value=p.birth;
    $('#ed-o').innerHTML=ORGS.map(function(o){return '<option'+(o===p.org?' selected':'')+'>'+o+'</option>'}).join('');open('m-edit')});
  if(p.days===0){$('#pd-none').innerHTML=emptyBox('활동 기록이 없어요','가입 후 한 번도 활동하지 않았어요. 앱 설치·로그인 안내가 필요할 수 있어요','안내 메시지 보내기');
    $('#pd-none .mb').addEventListener('click',function(){toast(p.name+'님에게 설치 안내를 보냈어요','ok','실행 취소',null)});return}
  var tb=$('#pd-tabs');
  [['act','활동 내역'],['chk','검사 이력'],['qst','챌린지 참여']].forEach(function(x){
    var b=el('button','tab',x[1]);b.setAttribute('aria-selected',pdTab===x[0]?'true':'false');
    b.addEventListener('click',function(){pdTab=x[0];V.person()});tb.appendChild(b)});
  A.bindTabs(tb);
  var body=$('#pd-body');
  if(pdTab==='act')tabAct(p,body);else if(pdTab==='chk')tabChk(p,body);else tabQst(p,body)};
function tabAct(p,box){
  if(!pdSel)pdSel=lastAct(p);
  if(!pdM)pdM={y:pdSel.getFullYear(),m:pdSel.getMonth()+1};
  box.innerHTML='<div style="padding:20px;display:grid;grid-template-columns:284px minmax(0,1fr);gap:18px">'
   +'<div style="display:flex;flex-direction:column"><div class="row" style="margin-bottom:14px">'
     +'<button type="button" class="pgn" id="am-p" aria-label="이전 달">'+LT+'</button><span class="mt" style="font-size:13.5px;font-weight:700;min-width:104px;text-align:center">'+pdM.y+'년 '+pdM.m+'월</span>'
     +'<button type="button" class="pgn" id="am-n" aria-label="다음 달">'+RT+'</button><button class="mb mbs mbg" id="am-l" style="margin-left:auto">최근 활동일</button></div>'
     +'<div class="dcal" id="am-c"></div>'
     +'<div class="lgd" style="margin-top:14px"><span><b style="background:#F2F4F7"></b>0회</span><span><b style="background:#C6F2E0"></b>1–2</span><span><b style="background:#6BDCAF"></b>3–4</span><span><b style="background:#13BD7E"></b>5+</span></div>'
     +'<div id="am-f" style="margin-top:auto;padding:12px 14px;background:#F9FAFB;border-radius:8px;font-size:13px;color:#475467"></div></div>'
   +'<div style="background:#F9FAFB;border-radius:10px;display:flex;flex-direction:column;overflow:hidden" id="am-d"></div></div>';
  var g=$('#am-c');
  ['일','월','화','수','목','금','토'].forEach(function(d,ix){g.appendChild(el('span','h'+(ix===0?' s':ix===6?' t':''),d))});
  var first=new Date(pdM.y,pdM.m-1,1),dim=new Date(pdM.y,pdM.m,0).getDate(),mD=0,mA=0;
  for(var k=0;k<first.getDay();k++)g.appendChild(el('span'));
  for(var dn=1;dn<=dim;dn++){(function(dn){
    var d=new Date(pdM.y,pdM.m-1,dn),b=el('button',null,String(dn));
    if(d<AMIN||d>AMAX){b.disabled=true;g.appendChild(b);return}
    var n=dayRec(p,d).acts.length;
    if(n>0){mD++;mA+=n;var s=n>=5?['#13BD7E','#043528','700']:n>=3?['#6BDCAF','#043528','600']:['#C6F2E0','#065C3D','500'];
      b.style.background=s[0];b.style.color=s[1];b.style.fontWeight=s[2]}
    b.title=dstr(d)+' · 활동 '+n+'회';
    if(dstr(d)===dstr(pdSel))b.classList.add('on');
    b.addEventListener('click',function(){pdSel=d;V.person()});g.appendChild(b)})(dn)}
  $('#am-f').innerHTML='이번 달 활동 <b class="mt" style="color:#101828">'+mD+'</b>일 · 총 <b class="mt" style="color:#101828">'+fmt(mA)+'</b>회';
  $('#am-p').addEventListener('click',function(){pdM.m--;if(pdM.m<1){pdM.m=12;pdM.y--}V.person()});
  $('#am-n').addEventListener('click',function(){pdM.m++;if(pdM.m>12){pdM.m=1;pdM.y++}V.person()});
  $('#am-l').addEventListener('click',function(){pdSel=lastAct(p);pdM={y:pdSel.getFullYear(),m:pdSel.getMonth()+1};V.person()});
  var rec=dayRec(p,pdSel),diff=Math.round((AMAX-pdSel)/864e5);
  var lab=diff===0?'오늘':diff===1?'어제':(pdSel.getMonth()+1)+'월 '+pdSel.getDate()+'일 '+'일월화수목금토'[pdSel.getDay()]+'요일';
  var D=$('#am-d');
  D.innerHTML='<div class="row" style="padding:16px 20px"><button type="button" class="pgn" id="ad-p" aria-label="이전 날" style="background:#fff">'+LT+'</button>'
   +'<span class="mh">'+lab+'</span><button type="button" class="pgn" id="ad-n" aria-label="다음 날" style="background:#fff">'+RT+'</button>'
   +'<span class="mcap mt" style="margin-left:auto">'+dstr(pdSel)+'</span></div>'
   +'<div style="padding:0 20px 14px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px">'
   +[['활동',rec.acts.length,'회',0],['걸음 수',fmt(rec.steps),'보',0],['마음 기록',rec.mind,'건',0],['증상 기록',rec.symp,'건',!rec.symp]].map(function(x){
     return '<div style="background:#fff;border-radius:8px;padding:12px"><div class="mcap">'+x[0]+'</div><div class="mt" style="font-size:20px;font-weight:700;letter-spacing:-0.03em;margin-top:2px'+(x[3]?';color:#69707C':'')+'">'+x[1]+'<span style="font-size:11.5px;color:#69707C;font-weight:600;margin-left:2px">'+x[2]+'</span></div></div>'}).join('')
   +'</div><div id="ad-l" style="background:#fff;margin:0 14px 14px;border-radius:8px;flex:1;min-height:0;overflow:auto"></div>';
  var L=$('#ad-l');
  if(rec.acts.length){
    rec.acts.forEach(function(a){
      var pct=a.kind==='운동'?moveRows(a).pct:(a.lab[0]==='완료'?100:a.lab[0]==='중단'?50:0);
      var pc=pct===0?'#B42318':pct<100?'#B54708':'#101828',sub='';
      if(a.kind==='운동'&&a.lab[0]!=='진입만')sub='<span class="sub">'+moveRows(a).rows.map(function(r){
        return '<span class="r"><span class="tt">'+r.t+'</span><span>'+esc(r.nm)+'</span><span class="pp"'+(r.z?' style="color:#B42318"':'')+'>'+r.p+'</span></span>'}).join('')+'</span>';
      var hh=+a.t.slice(0,2);
      L.appendChild(el('div','fd','<span class="t">'+(hh>=12?'오후':'오전')+' '+((hh%12)||12)+'시 '+(+a.t.slice(3))+'분</span>'
       +'<span class="m"><span style="font-size:13.5px;font-weight:600">'+esc(a.name)+(a.score!=null?' <span class="mt" style="font-size:12px;font-weight:400;color:#69707C">'+fmt(a.score)+'점</span>':'')+'</span>'
       +'<span class="mcap" style="display:block;margin-top:2px">두뇌운동 치매예방교실-26년 · '+a.kind+(a.dur?' · '+a.dur+'초':'')+'</span>'+sub+'</span>'
       +'<span class="p" style="color:'+pc+'">'+pct+'%</span>'))});
  }else{
    var near=null;
    for(var off=1;off<=60&&!near;off++){var sc=new Date(pdSel);sc.setDate(sc.getDate()-off);if(sc>=AMIN&&dayRec(p,sc).acts.length)near=sc}
    L.innerHTML=emptyBox('이 날은 활동이 없어요',near?'가장 가까운 활동일은 '+dstr(near)+'이에요':'',near?'그 날로 이동':'');
    if(near)L.querySelector('.mb').addEventListener('click',function(){pdSel=near;pdM={y:near.getFullYear(),m:near.getMonth()+1};V.person()})}
  $('#ad-p').addEventListener('click',function(){var d=new Date(pdSel);d.setDate(d.getDate()-1);if(d>=AMIN){pdSel=d;pdM={y:d.getFullYear(),m:d.getMonth()+1};V.person()}});
  $('#ad-n').addEventListener('click',function(){var d=new Date(pdSel);d.setDate(d.getDate()+1);if(d<=AMAX){pdSel=d;pdM={y:d.getFullYear(),m:d.getMonth()+1};V.person()}})}
function tabChk(p,box){
  var h=assessHist(p);
  if(!h.length){box.innerHTML=emptyBox('검사 기록이 없어요','');return}
  box.innerHTML='<div class="scroll"><table class="mtb"><thead><tr><th style="padding-left:20px">검사일</th><th>검사</th><th class="num">점수</th><th>판정</th><th class="num">직전</th><th style="padding-right:20px">변화</th></tr></thead><tbody>'
   +h.map(function(x){var lv=x.test.lv(x.score);
     var d=x.prev==null?'<span style="color:#69707C">첫 검사</span>':x.score<x.prev?'<span style="color:#067647;font-weight:600">▼ '+(x.prev-x.score)+' 호전</span>':x.score>x.prev?'<span style="color:#B42318;font-weight:600">▲ '+(x.score-x.prev)+'</span>':'<span style="color:#69707C">변화 없음</span>';
     return '<tr><td class="mt" style="padding-left:20px;color:#475467">'+x.date+' '+x.time+'</td><td>'+x.test.n+'</td><td class="num mt">'+x.score+'</td><td>'+pill(lv[0],lv[1])+'</td><td class="num mt" style="color:#69707C">'+(x.prev==null?'—':x.prev)+'</td><td style="padding-right:20px">'+d+'</td></tr>'}).join('')
   +'</tbody></table></div>'}
function tabQst(p,box){
  box.innerHTML='<div style="padding:20px;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px" id="qz"></div>';
  QUESTS.filter(function(q){return q.st!=='예정'}).forEach(function(q){
    var a=achieve(p,q),c=el('div');c.style.cssText='background:#F9FAFB;border-radius:10px;padding:18px';
    c.innerHTML='<div class="row"><span class="mh" style="font-size:14.5px">'+q.n+'</span>'+pill(a.done>=q.crit?'성공':'진행 중',a.done>=q.crit?'ok':'wa')+'<span class="mcap mt" style="margin-left:auto">'+a.done+' / '+q.crit+'일</span></div>';
    var g=el('div','acal');g.style.margin='14px 0 0';
    ['일','월','화','수','목','금','토'].forEach(function(d){g.appendChild(el('span','h',d))});
    var f=new Date(2026,q.m-1,1).getDay();
    for(var k=0;k<f;k++)g.appendChild(el('span','d out'));
    a.days.forEach(function(x){var d=el('span','d '+x.st,String(x.d));
      d.title=(q.ty==='attendance'?'활동 '+x.n+'회':fmt(x.steps)+'보')+(x.st==='hit'?' · 달성':'');g.appendChild(d)});
    c.appendChild(g);
    var b=el('button','mb mbs','달성 상세 보기');b.style.marginTop='14px';
    b.addEventListener('click',function(){openAchieve(p,q)});c.appendChild(b);$('#qz').appendChild(c)})}
function openAchieve(p,q){
  var a=achieve(p,q);
  $('#ac-t').firstChild.textContent=q.n+' · '+p.name;
  var b=$('#ac-b');
  b.innerHTML=kpi([['달성일',a.done,'/ '+q.crit+'일'],['하루 기준',q.ty==='attendance'?'활동 '+q.per+'개':fmt(q.per)+'보',''],
    ['결과',a.done>=q.crit?'성공':'진행 중','',a.done>=q.crit?'ok':'wa']])
   +'<div style="background:#F9FAFB;border-radius:10px;padding:18px;display:flex;flex-direction:column;align-items:center;gap:12px"><span class="mh" style="font-size:14.5px">일별 달성 캘린더</span><div class="acal" id="ac-c"></div>'
   +'<div class="lgd"><span><b style="background:#13BD7E"></b>달성</span><span><b style="background:#FFFAEB"></b>기준 미달</span><span><b style="background:#F2F4F7"></b>활동 없음</span>'+(q.ty==='attendance'?'<span style="color:#69707C">빈 칸은 주말</span>':'')+'</div></div>';
  var g=$('#ac-c');
  ['일','월','화','수','목','금','토'].forEach(function(d){g.appendChild(el('span','h',d))});
  var f=new Date(2026,q.m-1,1).getDay();
  for(var k=0;k<f;k++)g.appendChild(el('span','d out'));
  a.days.forEach(function(x){var d=el('span','d '+x.st,String(x.d));
    d.title=(q.ty==='attendance'?'활동 '+x.n+'회':fmt(x.steps)+'보')+(x.st==='hit'?' · 달성':x.st==='out'?' · 주말':' · 미달성');g.appendChild(d)});
  $('#ac-p').onclick=function(){closeAll();openPerson(p,'questdetail')};
  open('m-achieve')}
A.openAchieve=openAchieve;A.openWithdraw=openWithdraw;A.statusPill=statusPill;A.cnt=cnt;
})(App);
