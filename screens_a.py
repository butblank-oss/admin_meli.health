#!/usr/bin/env python3
"""A급 화면: 오늘 · 참여자 · 참여자 상세 · 활동 현황 · 월간 리포트"""
import sys; sys.path.insert(0, '/Users/g-sso/Desktop/피그마연동')
from build import *

# ══════════════════════ 1. 오늘 ══════════════════════
todo = [
 ('cr','alert','참여 신청 111건이 대기 중이에요','이 중 27명은 이미 앱에 가입해서 활동하고 있어요','신청 목록 열기',''),
 ('wa','chat','답변을 기다리는 상담이 4건 있어요','가장 오래된 건 3일 지났어요. 3일이 넘으면 운영팀에 알림이 가요','상담실 열기',''),
 ('ok','doc','7월 보건소 제출 자료를 아직 안 만들었어요','6개 항목 중 5개는 자동으로 채워져요','리포트 만들기','pri'),
]
rows = []
for i, (tone, icon, t, d, btn, cls) in enumerate(todo):
    bg, fg = {'cr':('#FEF1F0','#C0362B'), 'wa':('#FFF6E5','#A8620A'), 'ok':('#E4F8EF','#0A6B4A')}[tone]
    border = 'border-top: 1px solid #F2F4F6;' if i else ''
    pad = '14px 24px 22px' if i == len(todo)-1 else '14px 24px'
    rows.append(f'<div style="display: flex; align-items: center; gap: 14px; padding: {pad}; {border}">'
      f'<span style="width: 40px; height: 40px; flex: none; border-radius: 10px; background: {bg}; color: {fg}; display: flex; align-items: center; justify-content: center">{ic(icon,20,1.9)}</span>'
      f'<span style="min-width: 0"><span style="display: block; font-size: 14px; font-weight: 600">{t}</span>'
      f'<span style="display: block; font-size: 14px; color: #68727F; margin-top: 2px">{d}</span></span>'
      f'<button class="btn {cls}" style="margin-left: auto; flex: none">{btn}</button></div>')

spark = ''.join(
    f'<div style="flex: 1; height: {h}%; background: {"#EDEEF1" if wk else "#13BD7E"}; border-radius: 6px"></div>'
    for h, wk in [(93,0),(97,0),(92,0),(96,0),(91,0),(28,1),(21,1),(93,0),(100,0),(85,0),(96,0),(92,0),(28,1),(22,1)])

attn = [('정*순','우울 위험','cr','GDS-SF 11점','3일'),('황*학','활동 중단','wa','14일 무활동','14일'),
        ('이*자','불면 경계','wa','ISI-K 16점','6일'),('박*희','앱 미설치','cr','승인 후 미가입','37일')]
attn_rows = ''.join(
    f'<tr><td style="padding-left: 24px; font-weight: 600">{n}</td>'
    f'<td>{pill(p,k)} <span style="font-size: 14px; color: #68727F; margin-left: 4px">{d}</span></td>'
    f'<td class="mono" style="text-align: right; color: #68727F">{e}</td>'
    f'<td style="text-align: right; padding-right: 24px"><button class="btn sm">연락</button></td></tr>'
    for n, p, k, d, e in attn)

body = f'''
<div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px">
{metric('3기 대상자','822','명','1기 230 · 2기 714')}
{metric('이번 주 활동자','191','명','전주보다 6명 늘었어요','','up')}
{metric('14일 넘게 활동이 없어요','184','명','지난주보다 21명 늘었어요','wa')}
{metric('처리 안 된 신청','111','건','가장 오래된 건 42일째','cr')}
</div>

<div class="card flush">
  <div style="padding: 22px 24px 14px"><span class="h2">처리할 일</span></div>
  {''.join(rows)}
</div>

<div style="display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); gap: 18px; flex: 1; min-height: 0">
  <div class="card" style="display: flex; flex-direction: column">
    <div style="display: flex; align-items: baseline; gap: 10px">
      <span class="h2">최근 2주 활동</span><span class="cap" style="margin-left: auto">주말은 회색</span>
    </div>
    <div style="display: flex; align-items: flex-end; gap: 7px; height: 92px; margin-top: 20px">{spark}</div>
    <div class="cap mono" style="display: flex; justify-content: space-between; margin-top: 10px"><span>08-08</span><span>08-14</span><span>08-21</span></div>
    <p style="margin: auto 0 0; font-size: 14px; line-height: 1.6; color: #68727F">추천 활동이 평일에만 있어서 주말 활동량이 평일의 <span style="font-weight: 700; color: #15181D">27%</span>로 떨어져요.</p>
  </div>

  <div class="card flush" style="display: flex; flex-direction: column; overflow: hidden">
    {card_head('먼저 연락해볼 분들','<span class="cap">자동 선별</span>')}
    <table><thead><tr><th style="padding-left: 24px">이름</th><th>사유</th><th style="text-align: right">경과</th><th style="padding-right: 24px"></th></tr></thead>
    <tbody>{attn_rows}</tbody></table>
    <div style="padding: 16px 24px; margin-top: auto"><p style="margin: 0; font-size: 14px; color: #68727F">선별 기준은 활동 현황 → 판정 기준에서 바꿀 수 있어요.</p></div>
  </div>
</div>'''
write('Main.dc.html', shell('today','오늘',body,1440,900,sub='8월 21일 목요일'))


# ══════════════════════ 2. 참여자 ══════════════════════
PEOPLE = [
 ('정*순','2661','010-****-2877','1940','남동구보건소','활동 중단','wa','169','66%','15일 전','4.0.6',1),
 ('황*학','5586','010-****-2727','1956','만수노인문화센터','활동 중단','wa','38','9%','99일 전','4.0.3',1),
 ('이*자','4413','010-****-4413','1948','남동구노인복지관','활동 중단','wa','92','41%','21일 전','4.0.7',1),
 ('최*옥','6634','010-****-6634','1938','남동구보건소','활동 중단','wa','146','78%','18일 전','4.0.6',0),
 ('박*수','1180','010-****-1180','1945','미배정','중도포기','nu','14','3%','141일 전','3.4.0',0),
 ('한*순','9021','010-****-9021','1952','만월종합사회복지관','활동 중단','wa','61','33%','16일 전','4.0.7',0),
 ('윤*자','5540','010-****-5540','1943','남동구보건소','활동 중단','wa','203','88%','17일 전','4.0.7',0),
 ('서*화','3341','010-****-3341','1961','만수노인문화센터','활동 중단','wa','27','12%','29일 전','4.0.5',0),
 ('노*식','8827','010-****-8827','1949','남동구노인복지관','활동 중단','wa','55','24%','33일 전','4.0.4',0),
 ('강*례','1092','010-****-1092','1936','남동구보건소','활동 중단','wa','118','52%','22일 전','4.0.6',0),
 ('문*희','2214','010-****-2214','1958','만수노인문화센터','활동 중단','wa','74','36%','19일 전','4.0.7',0),
]
prows = []
for nm, pin, ph, by, org, st, stk, days, rate, last, app, sel in PEOPLE:
    bg = ' style="background: #F5FCF9"' if sel else ''
    orgc = '#68727F' if org == '미배정' else '#4A5261'
    prows.append(f'<tr{bg}>'
      f'<td style="padding-left: 24px">{cb("on" if sel else "off")}</td>'
      f'<td><span style="font-weight: 600">{nm}</span> <button class="btn sm" style="height: 24px; padding: 0 9px; font-size: 12px; border-radius: 10px; background: {"#FFFFFF" if sel else "#F2F4F6"}; color: #68727F; margin-left: 4px">보기</button></td>'
      f'<td class="mono" style="text-align: right; color: #68727F">{pin}</td>'
      f'<td class="mono" style="color: #4A5261">{ph}</td>'
      f'<td class="mono" style="text-align: right; color: #4A5261">{by}</td>'
      f'<td style="color: {orgc}">{org}</td><td>{pill(st,stk)}</td>'
      f'<td class="mono" style="text-align: right">{days}</td>'
      f'<td class="mono" style="text-align: right">{rate}</td>'
      f'<td class="mono" style="color: #68727F">{last}</td>'
      f'<td class="mono" style="color: #68727F; padding-right: 24px">{app}</td></tr>')

fchip = lambda t: (f'<span style="display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 8px 0 12px;'
                   f'border-radius:999px;background:#E4F8EF;color:#0A6B4A;font-size:13px;font-weight:600">{t}'
                   f'<span style="width:16px;height:16px;border-radius:999px;background:#BEEBD8;display:flex;align-items:center;'
                   f'justify-content:center;cursor:pointer;color:#0A6B4A">'
                   f'<svg width="8" height="8" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M5 5l10 10M15 5L5 15"/></svg></span></span>')

body = f'''
<div class="card" style="padding: 20px 24px; display: flex; flex-direction: column; gap: 14px">
  <div style="display: flex; gap: 10px; align-items: center">
    {searchbar('이름, 전화 뒷자리, PIN으로 찾기','정')}
    <select class="fld"><option>연령 전체</option></select>
    <select class="fld"><option>성별 전체</option></select>
    <span style="margin-left: auto; font-size: 14px; color: #68727F">조건에 맞는 참여자 <span style="font-weight: 700; color: #15181D; font-variant-numeric: tabular-nums">184</span>명</span>
  </div>
  <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap">
    {chip('참여 중',802)}{chip('중도포기',2)}{chip('회원탈퇴',12)}{sep()}
    {chip('남동구보건소',341)}{chip('만수노인문화센터',198)}{chip('남동구노인복지관',164)}{chip('미배정',119)}{sep()}
    {chip('오늘 수행',64)}{chip('14일+ 무활동',184,True)}
  </div>
  <div style="display: flex; gap: 8px; align-items: center; padding-top: 12px; border-top: 1px solid #F2F4F6">
    <span style="font-size: 13px; color: #68727F; margin-right: 2px">적용된 조건</span>
    {fchip('검색 “정”')}{fchip('14일+ 무활동')}
    <button class="btn sm" style="background: transparent; color: #68727F">모두 지우기</button>
  </div>
</div>

<div class="card flush" style="flex: 1; min-height: 0; display: flex; flex-direction: column; overflow: hidden">
  <div style="margin: 16px 16px 0; padding: 12px 18px; background: #E4F8EF; border-radius: 10px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap">
    <span style="font-size: 14px; font-weight: 600; color: #0A6B4A">이 페이지 <span style="font-variant-numeric: tabular-nums">3</span>명 선택</span>
    <button style="border: none; background: transparent; color: #077A50; font-size: 14px; font-weight: 700; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; font-family: inherit">조건에 맞는 184명 모두 선택</button>
    <span style="width: 1px; height: 18px; background: #BEEBD8; margin: 0 2px"></span>
    <button class="btn sm" style="background: #FFFFFF; color: #077A50">메시지 보내기</button>
    <button class="btn sm" style="background: #FFFFFF; color: #077A50">명단 내려받기</button>
    <button class="btn sm" style="background: #FFFFFF; color: #C0362B">탈퇴 처리</button>
    <button class="btn sm" style="margin-left: auto; background: transparent; color: #0A6B4A">선택 해제</button>
  </div>
  <table>
    <thead><tr>
      <th style="width: 52px; padding-left: 24px">{cb('mixed')}</th>
      {sort_th('이름')}{sort_th('PIN','none','right')}<th>연락처</th>{sort_th('생년','none','right')}
      {sort_th('기관')}<th>상태</th>{sort_th('활동일','desc','right')}{sort_th('수행률','none','right')}
      {sort_th('최근 이용')}<th style="padding-right: 24px">앱</th>
    </tr></thead>
    <tbody>{''.join(prows)}</tbody>
  </table>
  {pager('184','1','20')}
</div>'''
write('Participants.dc.html', shell('people','참여자', body, 1440, 1100,
      actions='<button class="btn">단체 메시지</button><button class="btn">명단 내려받기</button>'))
print('A급 1–2 완료')
