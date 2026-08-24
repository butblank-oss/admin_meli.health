/* 더미 데이터. 시드 난수라 새로고침해도 같은 값이 나온다.
   채널 어드민(../)의 인천 남동구 822명과 숫자를 맞춰뒀다 — 두 화면을 나란히
   놓고 시연할 때 같은 기관 숫자가 다르면 신뢰를 잃는다. */
(function(A){
"use strict";
var rnd=A.rnd,pad2=A.pad2;

/* ── 채널 ── */
A.CHANNELS=[
 {id:'C01',n:'인천 남동구 치매안심센터',region:'인천',mgr:'김주무',mgrPhone:'032-***-1204',
  st:'run',cohort:3,day:171,people:822,app:789,rate:64,drop:8.2,cs:3,since:'2024-03',note:''},
 {id:'C02',n:'인천 미추홀구 치매안심센터',region:'인천',mgr:'박선주',mgrPhone:'032-***-3391',
  st:'run',cohort:2,day:96,people:514,app:471,rate:58,drop:11.4,cs:2,since:'2025-01',note:''},
 {id:'C03',n:'부천시 치매안심센터',region:'경기',mgr:'이한나',mgrPhone:'032-***-7720',
  st:'run',cohort:3,day:171,people:690,app:664,rate:71,drop:6.1,cs:1,since:'2024-03',note:''},
 {id:'C04',n:'시흥시 치매안심센터',region:'경기',mgr:'정우석',mgrPhone:'031-***-5518',
  st:'run',cohort:1,day:42,people:302,app:238,rate:39,drop:18.9,cs:5,since:'2026-07',note:'개소 초기 — 앱 설치율 낮음'},
 {id:'C05',n:'안산시 단원구 치매안심센터',region:'경기',mgr:'—',mgrPhone:'—',
  st:'prep',cohort:0,day:0,people:0,app:0,rate:0,drop:0,cs:1,since:'2026-09',note:'담당자 미배정 · 9월 개소 예정'},
 {id:'C06',n:'광명시 치매안심센터',region:'경기',mgr:'최민경',mgrPhone:'02-***-4417',
  st:'done',cohort:2,day:0,people:448,app:401,rate:66,drop:9.7,cs:0,since:'2024-09',note:'2기 종료 · 3기 재계약 협의 중'}];
A.CH_ST={run:['진행 중','ok'],prep:['개소 준비','in'],done:['종료','nu']};
A.byCh={};A.CHANNELS.forEach(function(c){A.byCh[c.id]=c});
A.totals=function(){
  var run=A.CHANNELS.filter(function(c){return c.st==='run'});
  return {ch:A.CHANNELS.length,run:run.length,
    people:run.reduce(function(a,c){return a+c.people},0),
    app:run.reduce(function(a,c){return a+c.app},0)}};

/* ── 기수 ── */
A.COHORTS=[
 {id:'H1',ch:'C01',no:3,s:'2026-03-04',e:'2026-12-20',people:822,st:'run'},
 {id:'H2',ch:'C01',no:2,s:'2025-03-05',e:'2025-12-19',people:714,st:'done'},
 {id:'H3',ch:'C01',no:1,s:'2024-04-01',e:'2024-12-20',people:230,st:'done'},
 {id:'H4',ch:'C02',no:2,s:'2026-05-18',e:'2027-02-26',people:514,st:'run'},
 {id:'H5',ch:'C02',no:1,s:'2025-02-03',e:'2025-11-28',people:388,st:'done'},
 {id:'H6',ch:'C03',no:3,s:'2026-03-04',e:'2026-12-20',people:690,st:'run'},
 {id:'H7',ch:'C04',no:1,s:'2026-07-13',e:'2027-04-30',people:302,st:'run'},
 {id:'H8',ch:'C06',no:2,s:'2025-09-01',e:'2026-06-30',people:448,st:'done'},
 {id:'H9',ch:'C05',no:1,s:'2026-09-14',e:'2027-06-30',people:0,st:'plan'}];
A.CO_ST={run:['진행 중','ok'],plan:['개설 예정','in'],done:['종료','nu']};

/* ── 콘텐츠 20종 ── */
A.CONTENT=[
 {id:'B1',k:'두뇌훈련',n:'꿀벌의 숫자놀이',lv:'하',use:9873,ch:6,st:'live',up:'2026-05-12'},
 {id:'B2',k:'두뇌훈련',n:'기찻길 만들기',lv:'중',use:8241,ch:6,st:'live',up:'2026-05-12'},
 {id:'B3',k:'두뇌훈련',n:'기억의 숨바꼭질',lv:'중',use:7690,ch:6,st:'live',up:'2026-04-02'},
 {id:'B4',k:'두뇌훈련',n:'재밌는 숫자 퍼즐 4X4',lv:'상',use:5112,ch:6,st:'live',up:'2026-04-02'},
 {id:'B5',k:'두뇌훈련',n:'숨은 헬씨 찾기',lv:'하',use:6884,ch:6,st:'live',up:'2026-06-20'},
 {id:'B6',k:'두뇌훈련',n:'양말정리 대작전',lv:'하',use:6301,ch:6,st:'live',up:'2026-06-20'},
 {id:'B7',k:'두뇌훈련',n:'초성 퀴즈',lv:'중',use:4470,ch:4,st:'live',up:'2026-07-08'},
 {id:'B8',k:'두뇌훈련',n:'진짜 색깔 찾기',lv:'중',use:2218,ch:2,st:'test',up:'2026-08-14'},
 {id:'M1',k:'마음다루기',n:'호흡으로 마음 가라앉히기',lv:'하',use:3120,ch:6,st:'live',up:'2026-03-11'},
 {id:'M2',k:'마음다루기',n:'핸드크림 바르며 손 마사지하기',lv:'하',use:2884,ch:6,st:'live',up:'2026-03-11'},
 {id:'M3',k:'마음다루기',n:'오늘 감사한 일 적기',lv:'하',use:2411,ch:6,st:'live',up:'2026-03-11'},
 {id:'M4',k:'마음다루기',n:'좋았던 기억 떠올리기',lv:'하',use:1996,ch:6,st:'live',up:'2026-05-30'},
 {id:'R1',k:'운동',n:'상체·유연성 운동',lv:'하',use:7740,ch:6,st:'live',up:'2026-02-19',mv:8},
 {id:'R2',k:'운동',n:'전신·지구력 운동',lv:'중',use:6115,ch:6,st:'live',up:'2026-02-19',mv:4},
 {id:'R3',k:'운동',n:'하체·균형 운동',lv:'중',use:5902,ch:6,st:'live',up:'2026-02-19',mv:5},
 {id:'R4',k:'운동',n:'가볍게 걷기 10분',lv:'하',use:8830,ch:6,st:'live',up:'2026-06-01',mv:2},
 {id:'T1',k:'검사',n:'노인우울 (GDS-SF)',lv:'—',use:1842,ch:6,st:'live',up:'2026-01-08',items:15},
 {id:'T2',k:'검사',n:'불면증 (ISI-K)',lv:'—',use:1544,ch:6,st:'live',up:'2026-01-08',items:7},
 {id:'T3',k:'검사',n:'스트레스 (PSS)',lv:'—',use:1210,ch:6,st:'live',up:'2026-08-22',items:10},
 {id:'T4',k:'검사',n:'기억감퇴 (SMCQ)',lv:'—',use:1688,ch:6,st:'live',up:'2026-01-08',items:14}];
A.CT_ST={live:['배포 중','ok'],test:['시범 운영','wa'],draft:['작성 중','nu']};

/* ── 챌린지 ── */
A.CHALLENGES=[
 {id:'Q1',n:'8월 걷기 챌린지',type:'걷기',ty:'step',s:'2026-08-01',e:'2026-08-31',crit:20,per:3000,
  chs:['C01','C02','C03'],part:1512,succ:0,st:'run',wk:false},
 {id:'Q2',n:'7월 출석 챌린지',type:'출석',ty:'att',s:'2026-07-01',e:'2026-07-31',crit:15,per:2,
  chs:['C01','C02','C03'],part:1043,succ:241,st:'done',wk:true},
 {id:'Q3',n:'7월 걷기 챌린지',type:'걷기',ty:'step',s:'2026-07-01',e:'2026-07-31',crit:20,per:3000,
  chs:['C01','C03'],part:1240,succ:388,st:'done',wk:false},
 {id:'Q4',n:'9월 출석 챌린지',type:'출석',ty:'att',s:'2026-09-01',e:'2026-09-30',crit:15,per:2,
  chs:['C01','C02','C03','C04'],part:0,succ:0,st:'review',wk:true},
 {id:'Q5',n:'6월 출석 챌린지',type:'출석',ty:'att',s:'2026-06-01',e:'2026-06-30',crit:14,per:2,
  chs:['C01','C03'],part:967,succ:288,st:'done',wk:true}];
A.Q_ST={run:['진행 중','ok'],review:['검수 필요','cr'],plan:['예정','in'],done:['종료','nu']};

/* ── CS 접수 (유입 경로 4종) ── */
A.SRC={ask:['1:1 문의','in'],esc:['SLA 초과','cr'],crit:['판정 기준 회신','wa'],sched:['일정 변경','nu']};
A.TICKETS=[
 {id:'T-241',src:'esc',ch:'C04',by:'정우석',t:'앱 설치가 안 된다는 문의가 계속 옵니다',aged:5,st:'open',pri:'high',
  body:'개소 초기라 어르신들이 앱 설치를 못 하고 계십니다. 설치 지원 방문이 가능한지 문의드립니다. 현재 302명 중 64명이 미설치입니다.'},
 {id:'T-240',src:'crit',ch:'C01',by:'김주무',t:'터그테스트 점수가 화면에 안 나옵니다',aged:4,st:'open',pri:'high',
  body:'판정 기준 탭에 터그테스트가 등급 산출 안 된다고 표시돼 있습니다. 보건소 제출 항목에 들어가는데 언제 반영되나요?'},
 {id:'T-239',src:'sched',ch:'C03',by:'이한나',t:'8/25 지역 행사로 휴강 요청',aged:3,st:'open',pri:'mid',
  body:'8월 25일 구청 주최 행사와 겹칩니다. 휴강 처리 부탁드립니다.'},
 {id:'T-238',src:'ask',ch:'C02',by:'박선주',t:'월간 리포트 서식을 우리 보건소 양식으로 바꿀 수 있나요',aged:3,st:'prog',pri:'mid',
  body:'미추홀구 보건소가 자체 양식을 요구합니다. 표준 공문 서식과 항목 순서가 다릅니다.'},
 {id:'T-237',src:'esc',ch:'C04',by:'정우석',t:'중도포기율이 너무 높게 나옵니다',aged:6,st:'open',pri:'high',
  body:'18.9%로 다른 기관보다 두 배입니다. 집계 기준이 개소 초기 기관에 불리한 건 아닌지 확인 부탁드립니다.'},
 {id:'T-236',src:'crit',ch:'C01',by:'김주무',t:'노력 점수가 랭킹에 반영되지 않습니다',aged:8,st:'open',pri:'mid',
  body:'판정 기준에 계산은 되지만 총점에 안 들어간다고 적혀 있습니다. 어르신들께 설명하기 어렵습니다.'},
 {id:'T-235',src:'ask',ch:'C03',by:'이한나',t:'푸시를 저녁 7시에 보낼 수 있나요',aged:2,st:'open',pri:'low',
  body:'저녁 시간에 활동하시는 분들이 많습니다. 발송 가능 시간이 오후 6시까지로 막혀 있습니다.'},
 {id:'T-234',src:'sched',ch:'C02',by:'박선주',t:'9월 첫 주 활동 교체 요청',aged:2,st:'open',pri:'low',
  body:'상체 운동이 3주 연속으로 배정돼 있습니다. 하체·균형으로 교체 부탁드립니다.'},
 {id:'T-233',src:'ask',ch:'C05',by:'—',t:'담당자 계정 발급 요청',aged:9,st:'open',pri:'high',
  body:'9월 개소 예정인데 아직 담당자 계정이 없습니다. 사전 준비를 위해 발급 부탁드립니다.'},
 {id:'T-232',src:'esc',ch:'C01',by:'김주무',t:'참여 신청 승인과 앱 가입이 따로 돌아갑니다',aged:12,st:'open',pri:'high',
  body:'거절한 분이 앱을 쓰고 있습니다. 승인 절차의 의미가 없습니다. 정책 결정이 필요합니다.'},
 {id:'T-231',src:'ask',ch:'C03',by:'이한나',t:'명단 내려받기에 기관 열이 없습니다',aged:4,st:'open',pri:'low',
  body:'복지관별로 나눠 관리하는데 엑셀에 담당 복지관 열이 빠져 있습니다.'},
 {id:'T-230',src:'crit',ch:'C02',by:'박선주',t:'음주 검사(AUDIT-K)는 왜 없나요',aged:7,st:'open',pri:'mid',
  body:'보건소가 음주 항목을 요구합니다. 검사 목록에 없습니다.'},
 {id:'T-229',src:'ask',ch:'C01',by:'김주무',t:'PIN 번호가 중복된 분이 있습니다',aged:15,st:'done',pri:'mid',
  body:'전화 응대 중 같은 PIN으로 두 분이 조회됩니다.'},
 {id:'T-228',src:'sched',ch:'C01',by:'김주무',t:'7/17 휴강 요청',aged:38,st:'done',pri:'low',body:'처리 완료.'}];
A.TK_ST={open:['접수','cr'],prog:['처리 중','wa'],done:['완료','ok']};
A.TK_PRI={high:['높음','cr'],mid:['보통','wa'],low:['낮음','nu']};

/* ── 전 채널 발송 ── */
A.PUSHES=[
 {id:'P-08',when:'08-26 (수) 09:00',rel:'2일 뒤',t:'9월 출석 챌린지가 곧 시작돼요',
  chs:['C01','C02','C03','C04'],n:2162,st:'sched',by:'이운영',memo:'9월 챌린지 사전 안내'},
 {id:'P-07',when:'08-25 (화) 10:00',rel:'1일 뒤',t:'앱을 최신 버전으로 올려주세요',
  chs:['C01','C02','C03','C04'],n:418,st:'sched',by:'이운영',memo:'3.4.0 이하 사용자 대상'},
 {id:'P-06',when:'08-20 (목) 09:00',rel:'4일 전',t:'8월 걷기 챌린지가 시작됐어요',
  chs:['C01','C02','C03'],n:1924,st:'sent',by:'이운영',memo:'8월 챌린지 시작',open:41.2},
 {id:'P-05',when:'08-11 (월) 14:00',rel:'13일 전',t:'8월 12일 새벽 점검이 있어요',
  chs:['C01','C02','C03','C04'],n:2162,st:'sent',by:'이운영',memo:'정기 점검 공지',open:28.7},
 {id:'P-04',when:'08-01 (금) 09:00',rel:'23일 전',t:'8월에도 함께 걸어요',
  chs:['C01','C02','C03'],n:1898,st:'sent',by:'이운영',memo:'월초 인사',open:37.4},
 {id:'P-03',when:'07-28 (월) 16:30',rel:'27일 전',t:'설문에 참여해주세요',
  chs:['C01'],n:789,st:'cancel',by:'이운영',memo:'발송 20분 전 취소 — 문안 수정'}];
A.PS_ST={sched:['예약됨','in'],sent:['발송 완료','ok'],cancel:['취소','nu'],draft:['임시저장','nu']};

/* ── 이상 열람 탐지 ──
   판정 기준은 SP-2 미결이라 화면에 기준을 노출해 언제든 조정 가능하게 한다 */
A.RULES=[
 {id:'R-A',n:'단시간 과다 열람',desc:'같은 담당자가 10분 안에 원문 15건 이상',lv:'high'},
 {id:'R-B',n:'심야 열람',desc:'22시~06시 사이 원문 열람',lv:'mid'},
 {id:'R-C',n:'대량 내려받기',desc:'한 번에 300건 이상 원문 포함 다운로드',lv:'high'}];
A.ALERTS=[
 {id:'AL-3',rule:'R-A',ch:'C04',who:'정우석',when:'2026-08-23 15:42',cnt:23,win:'8분',
  st:'open',reason:'미활동자 안부 연락',ip:'118.***.***.77',
  why:'8분 동안 23건. 같은 사유로 연속 열람했고 통화 기록은 3건뿐입니다.'},
 {id:'AL-2',rule:'R-B',ch:'C02',who:'박선주',when:'2026-08-22 23:18',cnt:4,win:'—',
  st:'open',reason:'앱 오류 문의 회신',ip:'210.***.***.31',
  why:'23시 18분 열람. 해당 시각 접수된 문의는 없습니다.'},
 {id:'AL-1',rule:'R-C',ch:'C01',who:'김주무',when:'2026-08-21 09:10',cnt:184,win:'—',
  st:'ack',reason:'7월 보고자료 작성',ip:'218.***.***.42',
  why:'184건 원문 포함 다운로드. 보건소 제출 기간과 일치해 정상으로 확인했습니다.'}];
A.AL_ST={open:['확인 필요','cr'],ack:['확인 완료','ok'],esc:['상부 보고','wa']};

/* ── 계정 ──
   SP-6 권고: 퇴사 통보 즉시 정지. 인수인계는 계정 공유가 아니라 계정 2개로 푼다. */
A.ROLES={mgr:['채널관리자','in'],ops:['운영팀','ok'],view:['조회 전용','nu']};
A.AC_ST={live:['사용 중','ok'],susp:['정지','cr'],wait:['발급 대기','wa'],hand:['인수인계 중','in']};
A.ACCOUNTS=[
 {id:'U01',n:'김주무',role:'mgr',ch:'C01',st:'live',email:'kim@***.go.kr',last:'2026-08-24 09:12',
  made:'2024-03-04',mfa:true,note:''},
 {id:'U02',n:'박선주',role:'mgr',ch:'C02',st:'live',email:'park@***.go.kr',last:'2026-08-23 23:18',
  made:'2025-01-20',mfa:true,note:'심야 접속 이력 있음'},
 {id:'U03',n:'이한나',role:'mgr',ch:'C03',st:'live',email:'lee@***.go.kr',last:'2026-08-24 08:40',
  made:'2024-03-04',mfa:false,note:'2단계 인증 미설정'},
 {id:'U04',n:'정우석',role:'mgr',ch:'C04',st:'live',email:'jung@***.go.kr',last:'2026-08-23 15:50',
  made:'2026-07-13',mfa:true,note:''},
 {id:'U05',n:'최민경',role:'mgr',ch:'C06',st:'susp',email:'choi@***.go.kr',last:'2026-06-30 17:22',
  made:'2024-09-01',mfa:true,note:'2기 종료로 정지'},
 {id:'U06',n:'—',role:'mgr',ch:'C05',st:'wait',email:'—',last:'—',
  made:'—',mfa:false,note:'9일째 발급 대기 — 9월 14일 개소 예정'},
 {id:'U07',n:'이운영',role:'ops',ch:'',st:'live',email:'lee@onemedix.***',last:'2026-08-24 09:30',
  made:'2024-01-15',mfa:true,note:''},
 {id:'U08',n:'한지훈',role:'ops',ch:'',st:'live',email:'han@onemedix.***',last:'2026-08-22 18:04',
  made:'2025-06-02',mfa:true,note:''},
 {id:'U09',n:'서보건',role:'view',ch:'C01',st:'live',email:'seo@***.go.kr',last:'2026-08-19 14:11',
  made:'2026-05-11',mfa:false,note:'보건소 감독관 — 조회만'}];

/* 전 채널 열람 기록 — 시드로 생성 */
A.AUDIT=[];
(function(){
 var acts=['원문 열람','명단 내려받기','리포트 생성','푸시 발송','탈퇴 처리','신청 일괄 처리'];
 var reasons=['미활동자 안부 연락','위험군 상담 연계','앱 오류 문의 회신','참여 신청 확인','보건소 공문 회신'];
 var chs=['C01','C02','C03','C04'];
 for(var i=0;i<148;i++){
   var r=function(k){return rnd(i*13+k)};
   var ci=Math.floor(r(1)*chs.length),c=A.byCh[chs[ci]];
   var d=23-Math.floor(Math.pow(r(2),1.4)*22),h=6+Math.floor(r(3)*16);
   A.AUDIT.push({t:'2026-08-'+pad2(d)+' '+pad2(h)+':'+pad2(Math.floor(r(4)*60)),
     ch:c.id,who:c.mgr,act:acts[Math.floor(Math.pow(r(5),1.8)*acts.length)],
     n:1+Math.floor(Math.pow(r(6),3)*80),reason:reasons[Math.floor(r(7)*reasons.length)],
     ip:c.id==='C01'?'218.***.***.42':c.id==='C02'?'210.***.***.31':c.id==='C03'?'175.***.***.9':'118.***.***.77'})}
 A.AUDIT.sort(function(a,b){return a.t<b.t?1:-1})})();
})(Sup);
