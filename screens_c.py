#!/usr/bin/env python3
"""B급 화면: 상담실 · 프로그램 일정 · 챌린지 · 챌린지 상세 · 참여 신청 · 열람 기록"""
import sys; sys.path.insert(0, '/Users/g-sso/Desktop/피그마연동')
from build import *

# ══════════════════════ 6. 상담실 ══════════════════════
ROOMS = [('황*학','미답변','cr','3일','걸음 수가 안 올라가요',1),
         ('정*순','미답변','cr','1일','글씨를 더 크게 못하나요',0),
         ('이*희','운영팀','in','4시간','앱이 자꾸 꺼집니다',0),
         ('최*옥','진행','ok','2시간','감사합니다 잘 쓰고 있어요',0),
         ('김*자','진행','ok','1일','네 알겠습니다',0),
         ('박*수','대화 없음','nu','—','',0)]
rooms = ''.join(
    f'<div style="padding: 14px 18px; {"background: #E4F8EF;" if sel else ""} border-bottom: 1px solid #F2F4F6; cursor: pointer">'
    f'<div style="display: flex; align-items: center; gap: 8px"><span style="font-size: 14px; font-weight: 600">{n}</span>{pill(s,k)}'
    f'<span class="mono" style="margin-left: auto; font-size: 12px; color: #68727F">{t}</span></div>'
    f'<div style="font-size: 13px; color: #68727F; margin-top: 3px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">{m or "아직 대화가 없어요"}</div></div>'
    for n, s, k, t, m, sel in ROOMS)

def msg(side, text, time):
    if side == 'me':
        return (f'<div style="align-self: flex-end; max-width: 74%; background: #13BD7E; color: #042E20; padding: 11px 14px; '
                f'border-radius: 14px 16px 4px 16px; font-size: 14px; line-height: 1.55">{text}'
                f'<div class="mono" style="font-size: 11px; opacity: .6; margin-top: 4px">{time}</div></div>')
    return (f'<div style="align-self: flex-start; max-width: 74%; background: #FFFFFF; padding: 11px 14px; '
            f'border-radius: 14px 16px 16px 4px; font-size: 14px; line-height: 1.55">{text}'
            f'<div class="mono" style="font-size: 11px; color: #68727F; margin-top: 4px">{time}</div></div>')

body = f'''
<div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px">
  {metric('답변을 기다려요','4','건','가장 오래된 건 3일째','cr')}
  {metric('내 상담실','621','개','전체 625개 중')}
  {metric('운영팀이 맡은 방','4','개')}
  {metric('이번 달 응답','28','건','평균 5.2시간 안에 답했어요','','up')}
</div>

{note('상담방은 참여자 한 명당 하나씩 자동으로 만들어져요(현재 625개). 이 중 222개는 아직 대화가 없어요. 개별 문의는 드물고 실제로는 <b>단체 공지함</b>으로 쓰이고 있어요.','in')}

<div class="card flush" style="flex: 1; min-height: 0; display: flex; flex-direction: column; overflow: hidden">
  <div style="padding: 20px 24px 14px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap">
    {chip('내 상담실',621,True)}{chip('전체 상담실',625)}{sep()}
    {chip('미답변',2)}{chip('진행 중',12)}{chip('운영팀 담당',4)}{chip('대화 없음',222)}
    <div style="margin-left: auto; display: flex; gap: 8px">{searchbar('이름·전화번호','','220px')}
    <button class="btn pri">단체 공지 보내기</button></div>
  </div>
  <div style="display: grid; grid-template-columns: 280px minmax(0, 1fr) 300px; flex: 1; min-height: 0; border-top: 1px solid #F2F4F6">
    <div style="border-right: 1px solid #F2F4F6; overflow: hidden">{rooms}</div>
    <div style="display: flex; flex-direction: column; background: #F9FAFB; min-width: 0">
      <div style="flex: 1; padding: 20px; display: flex; flex-direction: column; gap: 10px; overflow: hidden">
        <span style="align-self: center; font-size: 12px; color: #68727F; background: #FFFFFF; padding: 4px 12px; border-radius: 999px">2026년 8월 11일</span>
        {msg('them','걸음 수가 안 올라가요','오전 7:12')}
      </div>
      <div style="padding: 14px 16px; background: #FFFFFF; border-top: 1px solid #F2F4F6; display: flex; gap: 10px; align-items: flex-end">
        <textarea style="flex: 1; height: 44px; border: none; background: #F2F4F6; border-radius: 10px; padding: 12px 14px; font-family: inherit; font-size: 14px; resize: none; color: #15181D" placeholder="답변을 입력하고 Enter로 보내요"></textarea>
        <button class="btn pri" style="height: 44px">보내기</button>
      </div>
    </div>
    <div style="border-left: 1px solid #F2F4F6; padding: 20px; display: flex; flex-direction: column; gap: 18px">
      <div><div class="cap" style="margin-bottom: 10px">참여자</div>
        <div style="font-size: 16px; font-weight: 700">황*학</div>
        <div class="mono" style="font-size: 14px; color: #68727F; margin-top: 4px">010-****-2727</div>
        <div style="font-size: 14px; color: #68727F; margin-top: 2px">만수노인문화센터 · 14일 무활동</div>
        <button class="btn sm" style="margin-top: 12px">참여자 상세 열기</button></div>
      <div style="border-top: 1px solid #F2F4F6; padding-top: 16px">
        <div class="cap" style="margin-bottom: 8px">담당</div>
        <div style="font-size: 14px; font-weight: 600">김주무 (채널)</div>
        <button class="btn sm" style="margin-top: 10px; width: 100%">운영팀으로 이관</button></div>
      {note('3일 넘게 답변이 없으면 운영팀에 자동으로 알림이 가요.','nu')}
    </div>
  </div>
</div>'''
write('Consult.dc.html', shell('consult','상담실', body, 1440, 1060))


# ══════════════════════ 7. 프로그램 일정 ══════════════════════
BRAIN = ['꿀벌의 숫자놀이','기찻길 만들기','기억의 숨바꼭질','재밌는 숫자 퍼즐 4X4','숨은 헬씨 찾기','양말정리 대작전','초성 퀴즈','진짜 색깔 찾기']
EX = ['상체·유연성 운동','전신·지구력 운동','하체·균형 운동','가볍게 걷기 10분']
MIND = ['호흡으로 마음 가라앉히기','핸드크림 바르며 손 마사지하기','오늘 감사한 일 적기','좋았던 기억 떠올리기']
ASMT = ['주관적 기억감퇴 평가 설문','노인우울 간편 검사','불면증 자가진단']
def it(text, kind):
    c = {'br':('#E4F8EF','#0A6B4A'),'ex':('#EDF4FF','#1B5FCC'),'mi':('#FFF6E5','#A8620A'),'as':('#F1EFFB','#6741C1')}[kind]
    cur = 'cursor: pointer; text-decoration: underline; text-underline-offset: 2px;' if kind == 'ex' else ''
    return (f'<span style="display: block; font-size: 12px; padding: 3px 7px; border-radius: 7px; background: {c[0]}; color: {c[1]}; '
            f'overflow: hidden; text-overflow: ellipsis; white-space: nowrap; {cur}">{text}</span>')
cells = []
for i, d in enumerate(['일','월','화','수','목','금','토']):
    c = '#C0362B' if i == 0 else ('#1B5FCC' if i == 6 else '#68727F')
    cells.append(f'<div style="text-align: center; padding: 10px 0; font-size: 13px; font-weight: 600; color: {c}">{d}</div>')
first = 5  # 2026-08-01 = 토
for k in range(first):
    cells.append('<div style="min-height: 108px; background: #FAFBFC; border-radius: 10px"></div>')
for dn in range(1, 32):
    dow = (first + dn - 1) % 7
    wk = dow in (0, 6)
    today = dn == 21
    bg = '#E4F8EF' if today else ('#FAFBFC' if wk else '#FFFFFF')
    inner = f'<div style="font-size: 12px; font-weight: {"700" if today else "500"}; color: {"#0A6B4A" if today else "#C7CCD4"}; font-variant-numeric: tabular-nums; margin-bottom: 5px">{dn}</div>'
    if not wk:
        s = dn * 3
        inner += it(BRAIN[s % 8], 'br') + it(EX[s % 4], 'ex') + it(MIND[s % 4], 'mi')
        if dn % 9 == 3:
            inner += it(ASMT[s % 3], 'as')
    cells.append(f'<div style="min-height: 108px; background: {bg}; border-radius: 10px; padding: 9px; display: flex; flex-direction: column; gap: 4px">{inner}</div>')

body = f'''
{note('채널관리자는 일정을 <b>확인만</b> 할 수 있어요. 바꿔야 하면 오른쪽 위 <b>일정 변경 요청</b>을 눌러주세요. 요청과 처리 결과는 기록에 남아요.','nu')}
<div class="card" style="flex: 1; min-height: 0; display: flex; flex-direction: column; overflow: hidden">
  <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px">
    <button class="btn sm" style="width: 32px; padding: 0; display: inline-flex; align-items: center; justify-content: center">{ic('left',14,2)}</button>
    <span class="h2 mono">2026년 8월</span>
    <button class="btn sm" style="width: 32px; padding: 0; display: inline-flex; align-items: center; justify-content: center">{ic('right',14,2)}</button>
    <button class="btn sm">오늘</button>
    <span style="margin-left: auto; display: flex; align-items: center; gap: 14px; font-size: 13px; color: #68727F">
      <span style="display:inline-flex;align-items:center;gap:5px"><span style="width:10px;height:10px;border-radius:3px;background:#C6F2E0"></span>두뇌훈련</span>
      <span style="display:inline-flex;align-items:center;gap:5px"><span style="width:10px;height:10px;border-radius:3px;background:#C3DBFB"></span>운동 <span style="color:#1B5FCC">눌러서 동작 보기</span></span>
      <span style="display:inline-flex;align-items:center;gap:5px"><span style="width:10px;height:10px;border-radius:3px;background:#F7DCA8"></span>마음다루기</span>
      <span style="display:inline-flex;align-items:center;gap:5px"><span style="width:10px;height:10px;border-radius:3px;background:#DAD3F7"></span>검사측정</span>
    </span>
  </div>
  <div style="display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 6px">{''.join(cells)}</div>
</div>'''
write('Schedule.dc.html', shell('sched','프로그램 일정', body, 1440, 940,
      actions='<button class="btn pri">일정 변경 요청</button>'))


# ══════════════════════ 8. 챌린지 ══════════════════════
Q = [('7월 출석 챌린지','출석','07-01 – 07-31','수업일 중 <b>15일</b> 이상 출석','하루 추천 활동 2개 이상','296','66','22.3%','진행 중','ok'),
     ('7월 걷기 챌린지','걷기','07-01 – 07-31','기간 중 <b>20일</b> 이상 달성','하루 3,000보 이상','550','171','31.1%','진행 중','ok'),
     ('6월 출석 챌린지','출석','06-01 – 06-30','수업일 중 <b>14일</b> 이상 출석','하루 추천 활동 2개 이상','284','71','25.0%','완료','in'),
     ('8월 걷기 챌린지','걷기','08-01 – 08-31','기간 중 <b>20일</b> 이상 달성','하루 3,000보 이상','—','—','—','예정','nu')]
qrows = ''.join(
    f'<tr><td style="padding-left: 24px"><span style="font-weight: 600; color: #077A50; cursor: pointer">{n}</span></td>'
    f'<td>{pill(t,"nu")}</td><td class="mono" style="color: #68727F">{p}</td>'
    f'<td style="white-space: normal; max-width: 280px; font-size: 14px; line-height: 1.5; padding: 12px 14px">{c}'
    f'<span style="display: block; color: #68727F; font-size: 13px">{c2}</span></td>'
    f'<td class="mono" style="text-align: right">{pa}</td><td class="mono" style="text-align: right">{s}</td>'
    f'<td class="mono" style="text-align: right; font-weight: 600">{r}</td>'
    f'<td style="padding-right: 24px">{pill(st,k)}</td></tr>'
    for n, t, p, c, c2, pa, s, r, st, k in Q)

body = f'''
{note('채널관리자는 챌린지를 <b>확인만</b> 할 수 있어요. 만들기·수정·삭제는 원메딕스 운영팀이 해요.','nu')}
<div class="card flush" style="flex: 1; min-height: 0; display: flex; flex-direction: column; overflow: hidden">
  <div style="padding: 20px 24px 14px; display: flex; align-items: center; gap: 8px">
    {chip('진행 중',2,True)}{chip('예정',1)}{chip('완료',1)}
    <div style="margin-left: auto">{searchbar('챌린지 이름','','220px')}</div>
  </div>
  <table>
    <thead><tr>{sort_th('챌린지','asc','left','padding-left: 24px')}<th>종류</th>{sort_th('기간')}<th>달성 조건</th>
      {sort_th('참여','none','right')}{sort_th('성공','none','right')}{sort_th('성공률','none','right')}
      <th style="padding-right: 24px">상태</th></tr></thead>
    <tbody>{qrows}</tbody>
  </table>
  <div style="padding: 16px 24px; margin-top: auto; border-top: 1px solid #F2F4F6">
    <p style="margin: 0; font-size: 14px; color: #68727F">챌린지 이름을 누르면 참여자별 달성 현황을 볼 수 있어요.</p></div>
</div>'''
write('Quest.dc.html', shell('quest','챌린지', body, 1440, 720))


# ══════════════════════ 9. 챌린지 상세 ══════════════════════
import math
days = []
for d in range(1, 32):
    dow = (2 + d - 1) % 7   # 2026-07-01 = 수
    wk = dow in (5, 6)
    v = 22 + (d * 7 % 18) if wk else 62 + (d * 13 % 62)
    days.append((v, wk))
mx = max(v for v, _ in days)
sp = ''.join(f'<div style="flex: 1; height: {v/mx*100:.0f}%; background: {"#EDEEF1" if wk else "#13BD7E"}; border-radius: 4px"></div>' for v, wk in days)

QP = [('김*자','010-****-4413','남동구노인복지관','21','96%','성공','ok','07-18'),
      ('정*순','010-****-2877','남동구보건소','19','91%','성공','ok','07-21'),
      ('최*옥','010-****-6634','남동구보건소','17','84%','성공','ok','07-24'),
      ('이*희','010-****-9021','만월종합사회복지관','14','70%','진행 중','wa','—'),
      ('윤*자','010-****-5540','남동구보건소','12','63%','진행 중','wa','—'),
      ('강*례','010-****-1092','남동구보건소','9','48%','진행 중','wa','—'),
      ('문*희','010-****-2214','만수노인문화센터','6','32%','진행 중','wa','—')]
qprows = ''.join(
    f'<tr><td class="mono" style="text-align: right; padding-left: 24px; color: #68727F">{i+1}</td>'
    f'<td><span style="font-weight: 600; color: #077A50; cursor: pointer">{n}</span></td>'
    f'<td class="mono" style="color: #4A5261">{ph}</td><td style="color: #4A5261">{o}</td>'
    f'<td class="mono" style="text-align: right">{dd} / 15</td>'
    f'<td style="width: 130px"><span style="display: block; height: 8px; border-radius: 999px; background: #F2F4F6; overflow: hidden">'
    f'<span style="display: block; height: 100%; width: {p}; background: {"#13BD7E" if k=="ok" else "#F79009"}; border-radius: 999px"></span></span></td>'
    f'<td>{pill(s,k)}</td><td class="mono" style="color: #68727F; padding-right: 24px">{c}</td></tr>'
    for i, (n, ph, o, dd, p, s, k, c) in enumerate(QP))

body = f'''
<div class="card" style="padding: 20px 24px">
  <div style="display: flex; align-items: center; gap: 12px">
    <button class="btn sm" style="display: inline-flex; align-items: center; gap: 5px">{ic('left',13,2)} 목록</button>
    <span style="font-size: 20px; font-weight: 700; letter-spacing: -0.03em">7월 출석 챌린지</span>
    {pill('진행 중','ok')}
    <span class="cap" style="margin-left: auto">읽기 전용 · 수정은 운영팀</span>
  </div>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #F2F4F6">
    <div style="display: grid; grid-template-columns: auto 1fr; gap: 10px 20px; font-size: 14px; align-items: baseline">
      <span style="color: #68727F">기간</span><span class="mono">2026-07-01 ~ 07-31</span>
      <span style="color: #68727F">달성 조건</span><span>수업일 중 <b>15일</b> 이상 출석</span>
      <span style="color: #68727F">하루 기준</span><span>추천 활동 <b>2개</b> 이상 하면 그날 출석</span>
      <span style="color: #68727F">대상</span><span>3기 참여자 전원 296명</span>
    </div>
    <div style="display: flex; flex-direction: column; gap: 12px">
      {bar('성공',22,'66명','#13BD7E','70px')}
      {bar('진행 중',38,'112명','#F79009','70px')}
      {bar('미참여',40,'118명','#C7CCD4','70px')}
    </div>
  </div>
</div>

<div class="card">
  <div style="display: flex; align-items: baseline; gap: 10px">
    <span class="h2">날짜별 달성 인원</span><span class="cap" style="margin-left: auto">주말은 회색 · 수업일이 아니라 달성 불가</span>
  </div>
  <div style="display: flex; align-items: flex-end; gap: 4px; height: 88px; margin-top: 18px">{sp}</div>
  <div class="cap mono" style="display: flex; justify-content: space-between; margin-top: 8px"><span>7월 1일</span><span>15일</span><span>31일</span></div>
</div>

<div class="card flush" style="flex: 1; min-height: 0; display: flex; flex-direction: column; overflow: hidden">
  <div style="padding: 20px 24px 14px; display: flex; align-items: center; gap: 8px">
    <span class="h2">참여자별 달성</span>
    {chip('성공',66)}{chip('진행 중',112)}{chip('미참여',118)}
    <div style="margin-left: auto; display: flex; gap: 8px">{searchbar('이름·전화 뒷자리','','200px')}
    <button class="btn">목록 내려받기</button></div>
  </div>
  <table>
    <thead><tr><th style="text-align: right; padding-left: 24px; width: 56px">#</th>{sort_th('이름')}<th>연락처</th>
      {sort_th('기관')}{sort_th('달성일','desc','right')}<th>진행</th><th>결과</th>
      <th style="padding-right: 24px">완수일</th></tr></thead>
    <tbody>{qprows}</tbody>
  </table>
  {pager('296','1','20',1,15)}
</div>'''
write('QuestDetail.dc.html', shell('quest','챌린지 상세', body, 1440, 1180))
print('B급 6–9 완료')
