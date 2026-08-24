#!/usr/bin/env python3
"""참여자 상세 · 활동 현황 · 월간 리포트"""
import sys; sys.path.insert(0, '/Users/g-sso/Desktop/피그마연동')
from build import *

def tabs(items, active):
    h = ['<div style="display: flex; gap: 6px; padding: 0 24px; border-bottom: 1px solid #F2F4F6">']
    for t in items:
        on = t == active
        h.append(f'<div style="padding: 14px 4px; margin-right: 14px; font-size: 14px; font-weight: {"700" if on else "500"}; '
                 f'color: {"#15181D" if on else "#68727F"}; border-bottom: 2.5px solid {"#13BD7E" if on else "transparent"}; '
                 f'margin-bottom: -1px; cursor: pointer">{t}</div>')
    h.append('</div>')
    return ''.join(h)

# ══════════════════════ 3. 참여자 상세 ══════════════════════
DENS = {4:1,5:2,6:3,7:2,8:1,11:3,12:2,13:2,14:3,15:1,17:1,18:2,19:2,20:1,21:1}
cal = ['<div style="display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 5px; margin-bottom: 8px">']
for i, d in enumerate(['일','월','화','수','목','금','토']):
    c = '#C0362B' if i == 0 else ('#1B5FCC' if i == 6 else '#C7CCD4')
    cal.append(f'<span style="font-size: 12px; color: {c}; text-align: center">{d}</span>')
cal.append('</div><div style="display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 5px">')
cal += ['<span></span>'] * 5
for dn in range(1, 32):
    lvl = DENS.get(dn, 0)
    bg, fg, fw = [('#F2F4F6','#C7CCD4','400'), ('#C6F2E0','#0A6B4A','500'),
                  ('#6BDCAF','#042E20','600'), ('#13BD7E','#042E20','700')][lvl]
    if dn > 21:
        bg, fg, fw = 'transparent', '#EDEEF1', '400'
    ring = 'box-shadow: 0 0 0 2.5px #A8620A;' if dn == 19 else ''
    cal.append(f'<span style="aspect-ratio: 1; border-radius: 10px; background: {bg}; color: {fg}; font-weight: {fw}; '
               f'display: flex; align-items: center; justify-content: center; font-size: 13px; font-variant-numeric: tabular-nums; {ring}">{dn}</span>')
cal.append('</div>')
CAL = ''.join(cal)

MOVES = [('07:28','서서 깍지 낀 팔 당기며 상체 숙이기','100%',0),('07:29','앉아서 머리 사선으로 당기기, 왼쪽','100%',0),
         ('07:30','앉아서 머리 사선으로 당기기, 오른쪽','100%',0),('07:31','의자 잡고 팔 뻗어 어깨 펴기','100%',0),
         ('07:32','손가락 앞으로 모았다 펴기, 왼쪽','100%',0),('07:33','손가락 앞으로 모았다 펴기, 오른쪽','100%',0),
         ('07:34','고양이 자세로 어깨 늘리기, 왼쪽','100%',0),('07:35','고양이 자세로 어깨 늘리기, 오른쪽','100%',0)]
MOVES2 = [('09:27','제자리 걷기','100%',0),('09:28','밴드 걸고 무릎 굽혀 옆으로 걷기','100%',0),('09:29','의자에 앉아 미니 스쿼트','0',1)]

def submoves(ms):
    rows = ''.join(
        f'<span style="display: flex; gap: 12px; align-items: baseline; font-size: 14px; color: #4A5261">'
        f'<span class="mono" style="width: 46px; flex: none; font-size: 13px; color: #68727F">{t}</span><span>{n}</span>'
        f'<span class="mono" style="margin-left: auto; font-size: 13px; color: {"#C0362B" if z else "#4A5261"}">{v}</span></span>'
        for t, n, v, z in ms)
    return (f'<span style="display: flex; flex-direction: column; gap: 6px; margin: 10px 0 2px; padding-left: 14px; '
            f'border-left: 2px solid #EDEEF1">{rows}</span>')

def actrow(time, title, meta, pct, sub='', last=False):
    pc = '#C0362B' if pct == '0' else ('#A8620A' if pct != '100%' else '#15181D')
    bt = '' if last else 'border-bottom: 1px solid #F2F4F6;'
    return (f'<div style="display: flex; gap: 18px; padding: 14px 24px; {bt} align-items: flex-start">'
            f'<span class="mono" style="width: 96px; flex: none; font-size: 14px; color: #68727F">{time}</span>'
            f'<span style="flex: 1; min-width: 0"><span style="font-size: 14px; font-weight: 600">{title}</span>'
            f'<span style="display: block; font-size: 13px; color: #68727F; margin-top: 2px">{meta}</span>{sub}</span>'
            f'<span class="mono" style="flex: none; font-size: 14px; font-weight: 600; color: {pc}">{pct}</span></div>')

body = f'''
<div class="card" style="padding: 20px 24px">
  <div style="display: flex; align-items: center; gap: 12px">
    <button class="btn sm" style="display: inline-flex; align-items: center; gap: 5px">{ic('left',13,2)} 목록</button>
    <span style="font-size: 20px; font-weight: 700; letter-spacing: -0.03em">안*순</span>
    <span style="font-size: 14px; color: #68727F">1935년생 · 여성 · PIN <span class="mono">5716</span></span>
    {pill('참여 중','nu')}
    <span style="margin-left: auto; display: flex; gap: 8px">
      <button class="btn">정보 수정</button><button class="btn">상담 열기</button>
      <button class="btn dgr">탈퇴 처리</button>
    </span>
  </div>
  <div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #F2F4F6">
    <div><div class="cap">담당 복지관</div><div style="font-size: 14px; font-weight: 500; margin-top: 4px">남동구노인복지관</div></div>
    <div><div class="cap">누적 활동일</div><div style="font-size: 14px; font-weight: 500; margin-top: 4px" class="mono">169일</div></div>
    <div><div class="cap">수행률 · 연속 출석</div><div style="font-size: 14px; font-weight: 500; margin-top: 4px" class="mono">66% · 13일</div></div>
    <div><div class="cap">랭킹 점수</div><div style="font-size: 14px; font-weight: 500; margin-top: 4px" class="mono">891 / 1000</div></div>
  </div>
</div>

<div class="card flush" style="flex: 1; min-height: 0; display: flex; flex-direction: column; overflow: hidden">
  {tabs(['활동 내역','검사 이력','챌린지 참여'],'활동 내역')}
  <div style="padding: 20px 24px; display: grid; grid-template-columns: 300px minmax(0, 1fr); gap: 20px; flex: 1; min-height: 0">

    <div style="display: flex; flex-direction: column">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px">
        <button class="btn sm" style="width: 30px; padding: 0; display: inline-flex; align-items: center; justify-content: center">{ic('left',13,2)}</button>
        <span class="mono" style="font-size: 14px; font-weight: 600">2026년 8월</span>
        <button class="btn sm" style="width: 30px; padding: 0; display: inline-flex; align-items: center; justify-content: center">{ic('right',13,2)}</button>
        <button class="btn sm" style="margin-left: auto; background: transparent; color: #077A50">최근 활동일</button>
      </div>
      {CAL}
      <div style="display: flex; align-items: center; gap: 10px; margin-top: 16px; font-size: 12px; color: #68727F">
        <span style="display:inline-flex;align-items:center;gap:4px"><span style="width:11px;height:11px;border-radius:4px;background:#F2F4F6"></span>0회</span>
        <span style="display:inline-flex;align-items:center;gap:4px"><span style="width:11px;height:11px;border-radius:4px;background:#C6F2E0"></span>1–2</span>
        <span style="display:inline-flex;align-items:center;gap:4px"><span style="width:11px;height:11px;border-radius:4px;background:#6BDCAF"></span>3–4</span>
        <span style="display:inline-flex;align-items:center;gap:4px"><span style="width:11px;height:11px;border-radius:4px;background:#13BD7E"></span>5+</span>
      </div>
      <div style="margin-top: auto; padding: 14px 16px; background: #F9FAFB; border-radius: 10px; font-size: 14px; color: #4A5261">
        이번 달 활동 <span class="mono" style="font-weight: 700; color: #15181D">14</span>일 · 총 <span class="mono" style="font-weight: 700; color: #15181D">40</span>회
      </div>
    </div>

    <div style="background: #F9FAFB; border-radius: 14px; display: flex; flex-direction: column; overflow: hidden">
      <div style="padding: 16px 24px; display: flex; align-items: center; gap: 8px">
        <button class="btn sm" style="width: 30px; padding: 0; background: #FFFFFF; display: inline-flex; align-items: center; justify-content: center">{ic('left',13,2)}</button>
        <span class="h2">8월 19일 수요일</span>
        <button class="btn sm" style="width: 30px; padding: 0; background: #FFFFFF; display: inline-flex; align-items: center; justify-content: center">{ic('right',13,2)}</button>
      </div>
      <div style="padding: 0 24px 16px; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px">
        <div style="background: #FFFFFF; border-radius: 10px; padding: 14px"><div class="cap">활동</div><div class="metric" style="font-size: 26px; margin-top: 2px">4<small>회</small></div></div>
        <div style="background: #FFFFFF; border-radius: 10px; padding: 14px"><div class="cap">걸음 수</div><div class="metric" style="font-size: 26px; margin-top: 2px">10,854<small>보</small></div></div>
        <div style="background: #FFFFFF; border-radius: 10px; padding: 14px"><div class="cap">마음 기록</div><div class="metric" style="font-size: 26px; margin-top: 2px">1<small>건</small></div></div>
        <div style="background: #FFFFFF; border-radius: 10px; padding: 14px"><div class="cap">증상 기록</div><div class="metric" style="font-size: 26px; margin-top: 2px; color: #68727F">0<small>건</small></div></div>
      </div>
      <div style="background: #FFFFFF; margin: 0 16px 16px; border-radius: 14px; flex: 1; min-height: 0; overflow: hidden">
        {actrow('오전 6시 12분','호흡으로 마음 가라앉히기','두뇌운동 치매예방교실-26년 · 마음다루기 · 214초','100%')}
        {actrow('오전 7시 28분','상체·유연성 운동','두뇌운동 치매예방교실-26년 · 운동','100%', submoves(MOVES))}
        {actrow('오전 9시 27분','전신·지구력 운동','두뇌운동 치매예방교실-26년 · 운동','50%', submoves(MOVES2))}
        {actrow('오후 1시 17분','꿀벌의 숫자놀이 <span class="mono" style="font-size: 13px; font-weight: 400; color: #68727F">886점</span>','두뇌운동 치매예방교실-26년 · 168초','100%','',True)}
      </div>
    </div>
  </div>
</div>'''
write('ParticipantDetail.dc.html', shell('people','참여자 상세', body, 1440, 1020))


# ══════════════════════ 4. 활동 현황 ══════════════════════
COH = [('개강 첫 주','3/3~','140명',[76.4,78.6,75.7,67.1,67.1]),
       ('2주차','3/10~','58명',[48.3,41.4,27.6,24.1,22.4]),
       ('8주차','4/21~','30명',[33.3,30.0,26.7,26.7,13.3]),
       ('9주차','4/28~','22명',[63.6,45.5,59.1,45.5,22.7])]
def hcell(v):
    if v >= 60: bg, fg = '#C6F2E0', '#0A6B4A'
    elif v >= 30: bg, fg = '#FFF6E5', '#A8620A'
    else: bg, fg = '#FEF1F0', '#C0362B'
    return (f'<td style="text-align: center; padding: 0 6px"><span style="display: block; margin: 5px 0; padding: 9px 0; '
            f'border-radius: 14px; background: {bg}; color: {fg}; font-weight: 700; font-variant-numeric: tabular-nums">{v}%</span></td>')
coh_rows = ''.join(
    f'<tr><td style="padding-left: 24px; font-weight: 600">{n} <span class="mono" style="color: #68727F; font-size: 13px; font-weight: 400">{d}</span></td>'
    f'<td class="mono" style="text-align: right; color: #68727F">{c}</td>' + ''.join(hcell(v) for v in vals) + '</tr>'
    for n, d, c, vals in COH)

SIG = [('7일 연속 무활동','184','71%','cr'),('수행률 20% 미만 2주 지속','101','64%','cr'),
       ('진입만 하고 중단 3회 이상','57','48%','wa'),('앱 구버전 3개월 이상 사용','32','44%','wa')]
sig_rows = ''.join(
    f'<tr><td style="padding-left: 24px">{n}</td><td class="mono" style="text-align: right; color: #4A5261">{c}</td>'
    f'<td class="mono" style="text-align: right; padding-right: 24px; font-weight: 700; color: {"#C0362B" if k=="cr" else "#A8620A"}">{r}</td></tr>'
    for n, c, r, k in SIG)

body = f'''
<div class="card flush" style="flex: 1; min-height: 0; display: flex; flex-direction: column; overflow: hidden">
  {tabs(['종합','참여 지속','활동 패턴','콘텐츠','개인별','판정 기준'],'참여 지속')}
  <div style="padding: 20px 24px; display: flex; flex-direction: column; gap: 18px; overflow: hidden">

    <div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px">
      <div style="background: #E4F8EF; border-radius: 14px; padding: 20px">
        <div class="lbl" style="color: #0A6B4A">개강 첫 주 시작 → 12주 후</div>
        <div class="metric" style="margin-top: 8px; color: #0A6B4A">67.1<small style="color: #68727F">%</small></div>
        <div style="margin-top: 6px; font-size: 13px; font-weight: 600; color: #0A6B4A">140명 중 94명이 남았어요</div>
      </div>
      <div style="background: #FEF1F0; border-radius: 14px; padding: 20px">
        <div class="lbl" style="color: #C0362B">2주차 이후 시작 → 12주 후</div>
        <div class="metric" style="margin-top: 8px; color: #C0362B">22.4<small style="color: #68727F">%</small></div>
        <div style="margin-top: 6px; font-size: 13px; font-weight: 600; color: #C0362B">58명 중 13명만 남았어요</div>
      </div>
      <div class="card" style="padding: 20px"><div class="lbl">첫 주 재방문 (D+7)</div>
        <div class="metric" style="margin-top: 8px">49.5<small>%</small></div>
        <div class="cap mono" style="margin-top: 6px">238 / 481명</div></div>
      <div class="card" style="padding: 20px"><div class="lbl">한 달 후 (D+30)</div>
        <div class="metric" style="margin-top: 8px">40.2<small>%</small></div>
        <div class="cap mono" style="margin-top: 6px">182 / 453명</div></div>
    </div>

    {note('<b>가장 중요한 발견이에요.</b> 개강 첫 주에 시작한 분은 12주 뒤에도 67%가 남아 있는데, 한 주만 늦게 시작하면 22%로 떨어져요. <b>3배 차이</b>예요. 개강 첫 주 온보딩에 힘을 쏟는 게 다른 어떤 개선보다 효과가 커요.','wa')}

    <div style="background: #F9FAFB; border-radius: 14px; overflow: hidden">
      {card_head('언제 시작했느냐에 따른 잔존율','<span class="cap">첫 활동 주 기준 · 그 주에 1회라도 활동</span>')}
      <table style="background: transparent">
        <thead><tr style="background: transparent">
          <th style="padding-left: 24px; background: transparent">시작 시점</th>
          <th style="text-align: right; background: transparent">인원</th>
          <th style="text-align: center; background: transparent">1주 후</th><th style="text-align: center; background: transparent">2주 후</th>
          <th style="text-align: center; background: transparent">4주 후</th><th style="text-align: center; background: transparent">8주 후</th>
          <th style="text-align: center; background: transparent; padding-right: 24px">12주 후</th>
        </tr></thead>
        <tbody>{coh_rows}</tbody>
      </table>
      <div style="height: 16px"></div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px">
      <div style="background: #F9FAFB; border-radius: 14px; padding: 22px 24px">
        <span class="h2">참여 강도 분포</span>
        <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 18px">
          {bar('0일 (한 번도)',72,'198명','#C0362B')}
          {bar('1–4일',100,'275명','#C0362B')}
          {bar('5–19일',41,'112명','#A8620A')}
          {bar('20–59일',21,'58명')}
          {bar('60일 이상',33,'92명')}
        </div>
        <p style="margin: 16px 0 0; font-size: 14px; line-height: 1.6; color: #68727F"><span style="font-weight: 700; color: #15181D">473명(64%)이 4일 이하로 하고 멈췄어요.</span> 반대로 92명은 60일 넘게 계속하고 있어요.</p>
      </div>
      <div style="background: #F9FAFB; border-radius: 14px; overflow: hidden; display: flex; flex-direction: column">
        {card_head('이탈 전조 신호','<span class="cap">자동 감지</span>')}
        <table style="background: transparent"><thead><tr style="background: transparent">
          <th style="padding-left: 24px; background: transparent">신호</th>
          <th style="text-align: right; background: transparent">해당</th>
          <th style="text-align: right; background: transparent; padding-right: 24px">2주 내 이탈률</th></tr></thead>
        <tbody>{sig_rows}</tbody></table>
        <div style="padding: 16px 24px; margin-top: auto"><p style="margin: 0; font-size: 14px; color: #68727F">이 신호에 걸린 분은 <b style="color: #4A5261">오늘</b> 화면에 자동으로 올라와요.</p></div>
      </div>
    </div>
  </div>
</div>'''
write('Analytics.dc.html', shell('stats','활동 현황', body, 1440, 1080,
      actions='<select class="fld"><option>2026년 7월</option></select>'))


# ══════════════════════ 5. 월간 리포트 ══════════════════════
ITEMS = [('1. 월별 앱 업데이트 횟수','스토어 배포 건수와 버전별 이용자',True,'신규 API 필요',True),
         ('2. 관리·감독 점검표','개인정보 18개 항목 중 6개 자동 판정',True,'audit_log + 수기',False),
         ('3. 운영 현황','대상자·참여자·활동자·중도포기',True,'getMonthlyStat',False),
         ('4. 참여자 현황','연령·성별 분포, 기관별 배정',True,'getPathStat',False),
         ('5. 운영 결과','유형별 수행량, 검사 점수, 위험군',True,'getChallengeOutcomes',False),
         ('6. 기타 / 특이사항','장애·민원·현장 이슈',False,'수기 입력',True)]
items = []
for i, (t, d, on, src, miss) in enumerate(ITEMS):
    sb, sf = ('#FEF1F0','#C0362B') if miss else ('#E4F8EF','#0A6B4A')
    bt = 'border-top: 1px solid #F2F4F6;' if i else ''
    items.append(f'<label style="display: flex; gap: 12px; padding: 14px 24px; {bt} cursor: pointer; align-items: flex-start">'
      f'<span style="margin-top: 1px">{cb("on" if on else "off",18)}</span>'
      f'<span style="min-width: 0"><span style="display: block; font-size: 14px; font-weight: 600; color: {"#15181D" if on else "#68727F"}">{t}</span>'
      f'<span style="display: block; font-size: 13px; color: #68727F; line-height: 1.5; margin-top: 2px">{d}</span>'
      f'<span class="mono" style="display: inline-block; margin-top: 6px; font-size: 12px; padding: 2px 8px; border-radius: 6px; background: {sb}; color: {sf}">{src}</span></span></label>')

def dtable(head, rows, mt='8px'):
    th = ''.join(f'<th style="background: #F9FAFB; border: 1px solid #EDEEF1; padding: 7px 10px; font-size: 13px; font-weight: 600; color: #4A5261; height: auto">{h}</th>' for h in head)
    tr = ''.join('<tr>' + ''.join(f'<td style="border: 1px solid #EDEEF1; padding: 7px 10px; font-size: 13px; height: auto; {c[1]}">{c[0]}</td>' for c in r) + '</tr>' for r in rows)
    return f'<table style="margin-top: {mt}; border: 1px solid #EDEEF1"><thead><tr>{th}</tr></thead><tbody>{tr}</tbody></table>'

M = 'font-variant-numeric: tabular-nums; text-align: right;'
body = f'''
<div style="display: grid; grid-template-columns: 340px minmax(0, 1fr); gap: 18px; flex: 1; min-height: 0; overflow: hidden">
  <div style="display: flex; flex-direction: column; gap: 18px; min-height: 0">
    <div class="card flush">
      <div style="padding: 22px 24px 12px; display: flex; align-items: baseline"><span class="h2">포함할 항목</span>
        <span class="cap mono" style="margin-left: auto">5 / 6</span></div>
      {''.join(items)}
    </div>
    <div class="card" style="padding: 20px 24px">
      <span class="h2">서식</span>
      <select class="fld" style="width: 100%; margin-top: 12px"><option>남동구 보건소 표준 공문 (기본)</option></select>
      <p style="margin: 10px 0 0; font-size: 13px; line-height: 1.55; color: #68727F">채널마다 다른 서식을 쓸 수 있어요.</p>
    </div>
    <div class="card" style="padding: 20px 24px">
      <button class="btn pri" style="width: 100%; height: 44px; font-size: 14px">한글(HWP) 공문으로 받기</button>
      <div style="display: flex; gap: 8px; margin-top: 8px">
        <button class="btn" style="flex: 1">엑셀 원자료</button><button class="btn" style="flex: 1">PDF</button>
      </div>
      <p style="margin: 12px 0 0; font-size: 13px; line-height: 1.55; color: #68727F">문서번호·수신·발신은 채널 설정값이 자동으로 채워져요. 내려받은 기록은 열람 기록에 남아요.</p>
    </div>
  </div>

  <div class="card" style="padding: 36px 44px; overflow: hidden">
    <h3 style="margin: 0; font-size: 18px; font-weight: 700; text-align: center; line-height: 1.5; letter-spacing: -0.025em">2026년도 스마트 어플 두뇌운동 치매예방교실<br>월간 운영 보고 (7월)</h3>
    <p style="margin: 10px 0 0; text-align: center; font-size: 13px; color: #68727F">수신 인천남동구 보건소 건강관리팀장 · 발신 ㈜원메딕스인더스트리 · 작성 2026-08-05</p>
    <div style="height: 2px; background: #15181D; margin: 18px 0 22px"></div>

    <h4 style="margin: 0; font-size: 14px; font-weight: 700; color: #0A6B4A">1. 월별 앱 업데이트 횟수</h4>
    {dtable(['구분','버전','배포일','주요 내용','이용자'], [
      [('Android',''),('4.0.7','font-variant-numeric: tabular-nums;'),('2026-07-09','font-variant-numeric: tabular-nums;'),('걷기 챌린지 집계 오류 수정',''),('284',M)],
      [('Android',''),('4.0.6','font-variant-numeric: tabular-nums;'),('2026-06-18','font-variant-numeric: tabular-nums;'),('검사 등급·응답 전송 복원',''),('283',M)],
      [('iOS',''),('4.0.7','font-variant-numeric: tabular-nums;'),('2026-07-11','font-variant-numeric: tabular-nums;'),('동일',''),('9',M)]])}
    <p style="margin: 8px 0 0; font-size: 13px; color: #68727F; line-height: 1.5">해당 월 배포 <b style="color: #4A5261">2회</b>. 구버전(3.x) 잔류 32명에게 업데이트 안내 푸시 2회 발송.</p>

    <h4 style="margin: 22px 0 0; font-size: 14px; font-weight: 700; color: #0A6B4A">2. 위·수탁업체 관리·감독 점검표</h4>
    {dtable(['단계','점검 내용','판정','증빙'], [
      [('수집·이용',''),('고유식별정보 미처리',''),(pill('이행','ok'),''),('수집 항목 스키마','')],
      [('관리',''),('개인정보 암호화',''),(pill('이행','ok'),''),('저장·전송 점검','')],
      [('관리',''),('접속기록 보관·위변조 방지',''),(pill('불이행','cr'),''),('기록 미수집','')],
      [('관리',''),('취급자 정기 교육',''),(pill('수기 확인','wa'),''),('이수증 첨부','')]])}
    <p style="margin: 8px 0 0; font-size: 13px; color: #68727F; line-height: 1.5">18개 중 시스템이 증빙할 수 있는 6개만 자동 판정해요. 나머지 12개는 화면에서 체크하면 서명란과 함께 들어가요.</p>

    <h4 style="margin: 22px 0 0; font-size: 14px; font-weight: 700; color: #0A6B4A">3. 운영 현황</h4>
    {dtable(['지표','7월','6월','증감'], [
      [('대상자 수',''),('822',M),('822',M),('—',M)],
      [('참여자 수',''),('735',M),('741',M),('-6',M)],
      [('활동자 수',''),('296',M),('284',M),('+12',M)],
      [('누적 중도포기',''),('2',M),('2',M),('—',M)],
      [('총 활동 수',''),('40,512',M),('38,940',M),('+1,572',M)],
      [('일평균 활동 수',''),('1,350',M),('1,298',M),('+52',M)],
      [('인당 일평균 활동 수',''),('4.56',M),('4.57',M),('-0.01',M)]])}

    <h4 style="margin: 22px 0 0; font-size: 14px; font-weight: 700; color: #0A6B4A">4. 참여자 현황</h4>
    {dtable(['연령','인원','비율','성별','인원'], [
      [('60대',''),('192',M),('26.1%',M),('여성',''),('581',M)],
      [('70대',''),('361',M),('49.1%',M),('남성',''),('105',M)],
      [('80대 이상',''),('132',M),('18.0%',M),('미상',''),('49',M)]])}
    <p style="margin: 8px 0 0; font-size: 13px; color: #68727F; line-height: 1.5">월 접속자 429명, 1인당 월평균 접속일 10.2일. 걷기 기록자 550명, 일평균 6,355보.<br><b style="color: #4A5261">참여 지속</b>: 개강 첫 주 시작자의 12주 후 잔존율 67.1%, 2주차 이후 시작자 22.4%.</p>
  </div>
</div>'''
write('Report.dc.html', shell('report','월간 리포트', body, 1440, 1020,
      actions='<select class="fld"><option>2026년 7월</option></select>'))
print('A급 3–5 완료')
