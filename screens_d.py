#!/usr/bin/env python3
"""참여 신청 · 열람 기록 · 인터랙션 패턴 · 컴포넌트"""
import sys; sys.path.insert(0, '/Users/g-sso/Desktop/피그마연동')
from build import *

# ══════════════════════ 10. 참여 신청 ══════════════════════
A = [('서*화','010-****-3341','남동구 만수동','07-03','42일','대기','cr','가입함','ok','',['승인','보류','거절']),
     ('노*식','010-****-8827','남동구 구월동','07-11','34일','대기','cr','미가입','nu','',['승인','보류','거절']),
     ('한*순','010-****-1092','남동구 논현동','07-28','17일','대기','cr','미가입','nu','',['승인','보류','거절']),
     ('윤*자','010-****-5540','남동구 만월동','08-06','8일','보류','wa','가입함','ok','주소 확인 필요',['승인','거절']),
     ('오*근','010-****-7702','남동구 간석동','08-09','5일','보류','wa','미가입','nu','본인 확인 대기',['승인','거절']),
     ('문*희','010-****-2214','남동구 서창동','08-14','3일','승인','ok','가입함','ok','',['되돌리기']),
     ('강*례','010-****-1092','남동구 장수동','08-16','1일','거절','nu','미가입','nu','중복 신청',['되돌리기'])]
def abtn(labels):
    out = []
    for l in labels:
        if l == '승인': out.append('<button class="btn sm pri">승인</button>')
        elif l == '거절': out.append('<button class="btn sm" style="background:#FEF1F0;color:#C0362B">거절</button>')
        elif l == '보류': out.append('<button class="btn sm">보류</button>')
        else: out.append('<button class="btn sm" style="background:transparent;color:#68727F">되돌리기</button>')
    return '<span style="display:flex;gap:6px;justify-content:flex-end">' + ''.join(out) + '</span>'
arows = ''.join(
    f'<tr><td style="padding-left: 24px">{cb()}</td><td style="font-weight: 600">{n}</td>'
    f'<td class="mono" style="color: #4A5261">{p}</td><td style="color: #4A5261">{ad}</td>'
    f'<td class="mono" style="text-align: right; color: #68727F">{d}</td>'
    f'<td class="mono" style="text-align: right; {"color:#C0362B;font-weight:700" if "42" in e or "34" in e else "color:#68727F"}">{e}</td>'
    f'<td>{pill(s,sk)}</td><td>{pill(g,gk)}</td>'
    f'<td style="color: #68727F; font-size: 14px">{m or "—"}</td>'
    f'<td style="padding-right: 24px">{abtn(btns)}</td></tr>'
    for n, p, ad, d, e, s, sk, g, gk, m, btns in A)

body = f'''
<div style="display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 18px">
  {metric('대기','111','건','가장 오래된 건 42일째','cr')}
  {metric('보류','6','건','확인 후 다시 검토','wa')}
  {metric('승인','1,227','건')}
  {metric('거절','27','건')}
  {metric('승인했는데 앱 미설치','37','명','설치 안내가 필요해요','wa')}
</div>

{note('<b>지금은 승인 여부와 상관없이 앱에 가입할 수 있어요.</b> 대기 111건 중 27명, 거절 27건 중 15명이 이미 가입해서 활동 중이에요. 승인을 앱 사용 조건으로 걸지, 명단 관리용으로만 둘지 보건소와 정해야 해요.','cr')}

<div class="card flush" style="flex: 1; min-height: 0; display: flex; flex-direction: column; overflow: hidden">
  <div style="padding: 20px 24px 14px; display: flex; flex-direction: column; gap: 12px">
    <div style="display: flex; gap: 10px; align-items: center">
      {searchbar('이름, 전화 뒷자리, 주소로 찾기','','360px')}
      <span class="cap">신청일</span>
      {chip('전체 기간',None,True)}{chip('최근 7일')}{chip('이번 달')}{chip('지난 달')}{chip('직접 지정')}
      <span style="margin-left: auto; font-size: 14px; color: #68727F">조건에 맞는 신청 <span style="font-weight: 700; color: #15181D; font-variant-numeric: tabular-nums">144</span>건</span>
    </div>
    <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap">
      {chip('대기',111,True)}{chip('보류',6,True)}{chip('승인',1227)}{chip('거절',27)}{sep()}
      {chip('가입함',1232)}{chip('미가입',133)}{sep()}
      {chip('30일 초과',48)}
      <button class="btn sm" style="margin-left: auto; background: transparent; color: #68727F">조건 초기화</button>
    </div>
  </div>
  <table>
    <thead><tr><th style="width: 52px; padding-left: 24px">{cb()}</th>{sort_th('이름')}<th>연락처</th>
      {sort_th('주소')}{sort_th('신청일','asc','right')}{sort_th('경과','none','right')}
      <th>상태</th><th>앱 가입</th><th>메모</th><th style="padding-right: 24px; text-align: right">처리</th></tr></thead>
    <tbody>{arows}</tbody>
  </table>
  {pager('144','1','20',1,8)}
</div>'''
write('Apply.dc.html', shell('apply','참여 신청', body, 1440, 1160,
      actions='<button class="btn">엑셀 일괄 등록</button>'))


# ══════════════════════ 11. 열람 기록 ══════════════════════
AU = [('2026-08-21 14:22','김주무','남동구 치매안심센터',0,'원문 열람','1건','미활동자 안부 연락','218.***.***.42'),
      ('2026-08-21 09:10','김주무','남동구 치매안심센터',0,'명단 내려받기','184건','7월 보고자료 작성','218.***.***.42'),
      ('2026-08-20 16:47','이운영','원메딕스 운영팀',1,'원문 열람','1건','앱 오류 문의 회신','121.***.***.8'),
      ('2026-08-20 11:02','김주무','남동구 치매안심센터',0,'원문 열람','3건','우울 위험군 안부 확인','218.***.***.42'),
      ('2026-08-19 10:31','김주무','남동구 치매안심센터',0,'리포트 생성','7월분','보건소 제출','218.***.***.42'),
      ('2026-08-18 15:55','김주무','남동구 치매안심센터',0,'신청자 명단 열람','111건','승인 검토','218.***.***.42'),
      ('2026-08-15 09:40','김주무','남동구 치매안심센터',0,'탈퇴 처리','3건','연락 두절','218.***.***.42')]
aurows = ''.join(
    f'<tr><td class="mono" style="padding-left: 24px; color: #4A5261">{t}</td><td style="font-weight: 500">{w}</td>'
    f'<td>{pill(o,"in") if ext else f"<span style=\'color:#68727F\'>{o}</span>"}</td>'
    f'<td>{a}</td><td class="mono" style="text-align: right; color: #4A5261">{c}</td>'
    f'<td style="color: #4A5261">{r}</td>'
    f'<td class="mono" style="color: #68727F; padding-right: 24px">{ip}</td></tr>'
    for t, w, o, ext, a, c, r, ip in AU)

body = f'''
{note('개인정보를 열람하거나 내려받은 기록이에요. 보건소 관리·감독 점검표의 <b>접속기록 보관</b> 항목 증빙으로 그대로 제출할 수 있어요. 보관 기간은 2년이에요.','in')}
<div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px">
  {metric('이번 달 열람','47','건')}
  {metric('명단 내려받기','6','회')}
  {metric('원문 열람','38','건')}
  {metric('사유 없이 열람','0','건','사유는 반드시 남겨야 해요','ok')}
</div>

<div class="card flush" style="flex: 1; min-height: 0; display: flex; flex-direction: column; overflow: hidden">
  <div style="padding: 20px 24px 14px; display: flex; flex-direction: column; gap: 12px">
    <div style="display: flex; gap: 10px; align-items: center">
      {searchbar('대상자·사유로 찾기','','300px')}
      <span class="cap">기간</span>
      {chip('오늘')}{chip('최근 7일')}{chip('이번 달',None,True)}{chip('지난 달')}{chip('직접 지정')}
      <button class="btn" style="margin-left: auto">점검표 증빙용 내려받기</button>
    </div>
    <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap">
      {chip('원문 열람',38)}{chip('명단 내려받기',6)}{chip('리포트 생성',2)}{chip('탈퇴 처리',1)}{sep()}
      {chip('김주무 (채널)',44)}{chip('원메딕스 운영팀',3)}
    </div>
  </div>
  <table>
    <thead><tr>{sort_th('일시','desc','left','padding-left: 24px')}{sort_th('담당자')}<th>소속</th>
      {sort_th('행위')}{sort_th('대상','none','right')}<th>사유</th>
      <th style="padding-right: 24px">접속 위치</th></tr></thead>
    <tbody>{aurows}</tbody>
  </table>
  {pager('47','1','20',1,3)}
</div>'''
write('Audit.dc.html', shell('audit','열람 기록', body, 1440, 1000))
print('B급 10–11 완료')
