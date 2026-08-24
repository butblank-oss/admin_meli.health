#!/usr/bin/env python3
"""인터랙션 패턴 시트 · 컴포넌트 시트"""
import sys; sys.path.insert(0, '/Users/g-sso/Desktop/피그마연동')
from build import *

def frame(w, h, body, bg='#F7F8FA'):
    return f'''<!doctype html>
<html>
<head><meta charset="utf-8"><script src="./support.js"></script></head>
<body>
<x-dc>
<helmet><style>{KIT}</style></helmet>
<div style="width: {w}px; height: {h}px; background: {bg}; color: #15181D; padding: 40px 44px; display: flex; flex-direction: column; gap: 28px; overflow: hidden">
{body}
</div>
</x-dc>
<script data-dc-script data-props='{{"$preview":{{"width":{w},"height":{h}}}}}'>
class Component extends DCLogic {{ renderVals() {{ return {{}}; }} }}
</script>
</body>
</html>
'''

def sec(n, title, why, content):
    return (f'<div><div style="display: flex; align-items: baseline; gap: 10px; margin-bottom: 4px">'
            f'<span class="mono" style="font-size: 13px; font-weight: 600; color: #13BD7E">{n:02d}</span>'
            f'<span class="h2">{title}</span></div>'
            f'<p style="margin: 0 0 14px 30px; font-size: 14px; color: #68727F; line-height: 1.6; max-width: 78ch">{why}</p>'
            f'<div style="margin-left: 30px">{content}</div></div>')

def box(inner, pad='20px 22px'):
    return f'<div style="background: #FFFFFF; border: 1px solid #EDEEF1; border-radius: 14px; box-shadow: 0 1px 2px rgba(16,24,40,.04); padding: {pad}">{inner}</div>'

def lab(t):
    return f'<div style="font-size: 12px; font-weight: 600; color: #68727F; margin-bottom: 10px">{t}</div>'

def cols(*items, gap='14px', tpl=None):
    t = tpl or f'repeat({len(items)}, minmax(0, 1fr))'
    return f'<div style="display: grid; grid-template-columns: {t}; gap: {gap}">{"".join(items)}</div>'

# ─────────── 01 표 정렬 ───────────
def mini_table(th_html, rows):
    return (f'<table style="background: transparent"><thead><tr style="background: transparent">{th_html}</tr></thead>'
            f'<tbody>{rows}</tbody></table>')
r3 = ''.join(f'<tr><td style="height: 40px">{n}</td><td class="mono" style="height: 40px; text-align: right">{v}</td></tr>'
             for n, v in [('정*순','169'),('최*옥','146'),('강*례','118')])
sort_demo = cols(
  box(lab('기본 — 정렬 안 됨') + mini_table(sort_th('이름') + sort_th('활동일','none','right'), r3)),
  box(lab('오름차순 — 한 번 클릭') + mini_table(sort_th('이름') + sort_th('활동일','asc','right'), r3)),
  box(lab('내림차순 — 두 번 클릭') + mini_table(sort_th('이름') + sort_th('활동일','desc','right'), r3)),
)

# ─────────── 02 선택 ───────────
sel_demo = (
  cols(box(lab('선택 안 됨') + f'<div style="display:flex;gap:16px;align-items:center">{cb()}<span style="font-size:14px;color:#68727F">해제</span></div>'),
       box(lab('일부 선택') + f'<div style="display:flex;gap:16px;align-items:center">{cb("mixed")}<span style="font-size:14px;color:#4A5261">이 페이지 일부</span></div>'),
       box(lab('전체 선택') + f'<div style="display:flex;gap:16px;align-items:center">{cb("on")}<span style="font-size:14px;color:#4A5261">이 페이지 전부</span></div>'))
  + '<div style="height: 14px"></div>'
  + box(lab('페이지 넘김이 있을 때 — 2단계 선택 (핵심)') +
    '<div style="padding: 12px 18px; background: #E4F8EF; border-radius: 10px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap">'
    '<span style="font-size: 14px; font-weight: 600; color: #0A6B4A">이 페이지 <span style="font-variant-numeric: tabular-nums">20</span>명 선택</span>'
    '<button style="border: none; background: transparent; color: #077A50; font-size: 14px; font-weight: 700; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; font-family: inherit">조건에 맞는 184명 모두 선택</button>'
    '</div>'
    '<div style="padding: 12px 18px; background: #0A6B4A; border-radius: 10px; display: flex; align-items: center; gap: 12px; margin-top: 8px">'
    '<span style="font-size: 14px; font-weight: 600; color: #FFFFFF">조건에 맞는 <span style="font-variant-numeric: tabular-nums">184</span>명 전체가 선택됐어요</span>'
    '<button style="border: none; background: transparent; color: #8FE5C3; font-size: 14px; font-weight: 700; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; font-family: inherit">이 페이지 20명만 선택</button>'
    '</div>'
    '<p style="margin: 12px 0 0; font-size: 13px; color: #68727F; line-height: 1.6">헤더 체크박스는 <b style="color:#4A5261">보이는 페이지</b>만 선택해요. 184명 전체에 작업하려면 한 번 더 명시적으로 눌러야 해요. 이걸 구분 안 하면 20명만 지우려다 184명을 지우는 사고가 나요.</p>'))

# ─────────── 03 검색 ───────────
search_demo = cols(
  box(lab('비어 있음') + searchbar('이름, 전화 뒷자리로 찾기','','100%')),
  box(lab('입력됨 — 지우기 버튼') + searchbar('이름, 전화 뒷자리로 찾기','정','100%')),
  box(lab('결과 없음') + searchbar('이름, 전화 뒷자리로 찾기','ㅋㅋ','100%') +
      '<div style="margin-top: 12px; font-size: 14px; color: #68727F">“ㅋㅋ”와 맞는 참여자가 없어요</div>'),
)

# ─────────── 04 적용된 조건 ───────────
fchip = lambda t: (f'<span style="display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 8px 0 12px;'
                   f'border-radius:999px;background:#E4F8EF;color:#0A6B4A;font-size:13px;font-weight:600">{t}'
                   f'<span style="width:16px;height:16px;border-radius:999px;background:#BEEBD8;display:flex;align-items:center;'
                   f'justify-content:center;cursor:pointer">'
                   f'<svg width="8" height="8" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M5 5l10 10M15 5L5 15"/></svg></span></span>')
filter_demo = box(lab('적용된 조건은 따로 모아서 하나씩 뗄 수 있게') +
  f'<div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap">'
  f'<span style="font-size: 13px; color: #68727F">적용된 조건</span>'
  f'{fchip("검색 “정”")}{fchip("14일+ 무활동")}{fchip("남동구보건소")}'
  f'<button class="btn sm" style="background: transparent; color: #68727F">모두 지우기</button></div>'
  f'<p style="margin: 12px 0 0; font-size: 13px; color: #68727F; line-height: 1.6">칩이 여러 줄로 늘어나면 뭐가 켜져 있는지 안 보여요. 켜진 조건만 따로 모아 보여주고, 각각 × 로 뗄 수 있게 해요.</p>')

# ─────────── 05 기간 ───────────
date_demo = box(lab('기간은 프리셋 먼저, 직접 지정은 마지막') +
  f'<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">{chip("오늘")}{chip("최근 7일")}{chip("이번 달",None,True)}{chip("지난 달")}{chip("최근 3개월")}{chip("직접 지정")}'
  f'<span style="margin-left:8px;font-size:14px;color:#68727F" class="mono">2026-08-01 ~ 08-21</span></div>'
  f'<p style="margin: 12px 0 0; font-size: 13px; color: #68727F; line-height: 1.6">달력 입력 두 칸만 두면 매번 날짜를 세야 해요. 실제로 쓰는 건 거의 프리셋이에요.</p>')

# ─────────── 06 버튼 상태 ───────────
spin = ('<span style="width:14px;height:14px;border-radius:999px;border:2px solid rgba(4,53,40,.25);'
        'border-top-color:#042E20;display:inline-block;vertical-align:-2px;margin-right:6px"></span>')
btn_demo = box(lab('버튼 상태 — 누른 뒤 아무 반응이 없으면 두 번 누르게 돼요') +
  '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">'
  '<button class="btn pri">기본</button>'
  '<button class="btn pri" style="background:#0FA76D">마우스 올림</button>'
  '<button class="btn pri" style="background:#0B8A5A">누르는 중</button>'
  f'<button class="btn pri" style="opacity:.75">{spin}처리 중…</button>'
  '<button class="btn pri" style="opacity:.4; cursor:not-allowed">비활성</button>'
  '<span style="width:1px;height:22px;background:#EDEEF1;margin:0 4px"></span>'
  '<button class="btn">보조</button><button class="btn dgr">파괴</button>'
  '<button style="height:36px;padding:0 16px;border-radius:10px;border:none;background:#C0362B;color:#fff;font-size:14px;font-weight:700;font-family:inherit;cursor:pointer">파괴 확정</button>'
  '</div>'
  '<p style="margin: 12px 0 0; font-size: 13px; color: #68727F; line-height: 1.6">비활성 버튼에는 <b style="color:#4A5261">왜 못 누르는지</b>를 툴팁으로 붙여요. 예: “참여자를 먼저 선택해주세요”</p>')

# ─────────── 07 결과 알림 ───────────
def toast(icon_bg, icon_fg, icon, text, action='', dark=False):
    bg = '#15181D' if dark else '#FFFFFF'
    fg = '#FFFFFF' if dark else '#15181D'
    a = (f'<button style="margin-left:auto;border:none;background:transparent;color:{"#6BDCAF" if dark else "#077A50"};'
         f'font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:5px">{action}</button>') if action else ''
    return (f'<div style="display:flex;align-items:center;gap:12px;background:{bg};border-radius:10px;padding:14px 18px;'
            f'box-shadow:0 8px 28px rgba(25,31,40,.14)">'
            f'<span style="width:26px;height:26px;flex:none;border-radius:999px;background:{icon_bg};color:{icon_fg};'
            f'display:flex;align-items:center;justify-content:center">{icon}</span>'
            f'<span style="font-size:14px;font-weight:500;color:{fg}">{text}</span>{a}</div>')
toast_demo = (cols(
  toast('#E4F8EF','#0A6B4A', ic('check',14,2.6), '3명에게 메시지를 보냈어요','실행 취소'),
  toast('#FEF1F0','#C0362B', ic('alert',14,2.2), '12건 중 2건이 실패했어요','자세히'),
  toast('#FFF6E5','#A8620A', ic('undo',14,2), '3명을 탈퇴 처리했어요','되돌리기', True), gap='14px')
  + '<p style="margin: 12px 0 0; font-size: 13px; color: #68727F; line-height: 1.6">되돌릴 수 있는 작업은 <b style="color:#4A5261">확인창 대신 실행 후 되돌리기</b>가 더 빨라요. 일괄 작업이 부분 실패하면 몇 건이 왜 실패했는지 반드시 알려줘야 해요.</p>')

# ─────────── 08 폼 오류 ───────────
form_demo = cols(
  box(lab('정상') +
    '<div style="font-size:13px;font-weight:600;color:#4A5261;margin-bottom:6px">탈퇴 사유 <span style="color:#C0362B">*</span></div>'
    '<select class="fld" style="width:100%"><option>연락 두절</option></select>'),
  box(lab('오류 — 무엇을 어떻게 고칠지') +
    '<div style="font-size:13px;font-weight:600;color:#4A5261;margin-bottom:6px">탈퇴 사유 <span style="color:#C0362B">*</span></div>'
    '<select class="fld" style="width:100%;background:#FEF1F0;box-shadow:inset 0 0 0 1.5px #C0362B;color:#68727F"><option>사유를 선택하세요</option></select>'
    '<div style="display:flex;gap:6px;align-items:center;margin-top:8px;font-size:13px;color:#C0362B">'
    + ic('alert',14,2.2) + '탈퇴 사유를 선택해야 처리할 수 있어요</div>'),
  box(lab('포커스 — 키보드로 이동할 때') +
    '<div style="font-size:13px;font-weight:600;color:#4A5261;margin-bottom:6px">열람 사유</div>'
    '<select class="fld" style="width:100%;box-shadow:0 0 0 3px rgba(19,189,126,.28), inset 0 0 0 1.5px #13BD7E"><option>미활동자 안부 연락</option></select>'
    '<p style="margin:8px 0 0;font-size:13px;color:#68727F">포커스 링은 절대 지우지 않아요.</p>'),
)

# ─────────── 09 불러오는 중 ───────────
sk = lambda w, h='14px': f'<span style="display:block;width:{w};height:{h};border-radius:6px;background:#EDEEF1"></span>'
skrow = ('<div style="display:flex;gap:14px;align-items:center;height:48px;border-top:1px solid #F2F4F6">'
         + sk('17px','17px') + sk('64px') + sk('42px') + sk('108px') + sk('96px') + sk('54px') + '</div>')
load_demo = cols(
  box(lab('불러오는 중 — 빈 화면 대신 뼈대') + skrow + skrow + skrow),
  box(lab('불러오지 못함 — 다시 시도 경로') +
    '<div style="padding:24px 12px;text-align:center;display:flex;flex-direction:column;gap:8px;align-items:center">'
    '<span style="font-size:14px;font-weight:700">명단을 불러오지 못했어요</span>'
    '<span style="font-size:13px;color:#68727F;line-height:1.6">잠시 후 다시 시도해주세요.<br>계속 안 되면 운영팀에 알려주세요.</span>'
    '<button class="btn" style="margin-top:4px">다시 시도</button></div>'),
  tpl='1.3fr 1fr')

# ─────────── 10 빈 상태 ───────────
empty_demo = cols(
  box(empty('조건에 맞는 참여자가 없어요','필터를 줄이거나 조건을 지워보세요','조건 초기화').replace('56px','28px')),
  box(empty('활동 기록이 없어요','가입 후 한 번도 활동하지 않았어요','안내 메시지 보내기').replace('56px','28px')),
  box(empty('이 상담실은 답변할 수 없어요','원메딕스 운영팀이 맡고 있어요','담당 가져오기').replace('56px','28px')),
)

# ─────────── 11 파괴적 확인 ───────────
destr = box(lab('되돌릴 수 없는 작업 — 사유 + 동의를 둘 다 채워야 열려요'),'20px 22px')
destr = ('<div style="background:#FFFFFF;border-radius:10px;overflow:hidden;box-shadow:0 16px 48px rgba(25,31,40,.16);max-width:460px">'
  '<div style="padding:18px 22px 0"><span style="font-size:17px;font-weight:700;color:#C0362B">탈퇴 처리</span></div>'
  '<div style="padding:14px 22px;display:flex;flex-direction:column;gap:12px">'
  '<div style="padding:12px 16px;background:#FEF1F0;border-radius:10px"><p style="margin:0;font-size:14px;line-height:1.6;color:#C0362B">'
  '<b>3명</b>을 탈퇴 처리해요. 앱 이용이 바로 막히고 <b>되돌릴 수 없어요.</b></p></div>'
  '<div style="font-size:14px;color:#4A5261;line-height:1.9">정*순 <span class="mono" style="color:#68727F">010-****-2877</span><br>'
  '황*학 <span class="mono" style="color:#68727F">010-****-2727</span><br>이*자 <span class="mono" style="color:#68727F">010-****-4413</span></div>'
  '<select class="fld" style="width:100%;color:#68727F"><option>탈퇴 사유를 선택하세요</option></select>'
  f'<label style="display:flex;gap:10px;align-items:center;font-size:14px;color:#4A5261;cursor:pointer">{cb("off",18)} 위 내용을 확인했어요</label>'
  '</div>'
  '<div style="padding:14px 22px 18px;display:flex;gap:8px;justify-content:flex-end">'
  '<button class="btn">취소</button>'
  '<button style="height:36px;padding:0 16px;border-radius:10px;border:none;background:#C0362B;color:#fff;font-size:14px;font-weight:700;font-family:inherit;opacity:.4;cursor:not-allowed">탈퇴 처리</button>'
  '</div></div>')
destr_demo = cols(destr, box(lab('되돌릴 수 있는 작업은 확인창을 띄우지 않아요') +
  '<p style="margin:0 0 14px;font-size:14px;color:#4A5261;line-height:1.7">승인·보류·거절처럼 되돌릴 수 있는 건 바로 실행하고 토스트로 <b>되돌리기</b>를 줘요. 확인창을 매번 띄우면 111건을 처리할 때 111번 눌러야 해요.</p>'
  + toast('#E4F8EF','#0A6B4A', ic('check',14,2.6), '서*화님 신청을 승인했어요','실행 취소')), tpl='460px 1fr')

body = f'''
<div>
  <div style="font-size: 26px; font-weight: 700; letter-spacing: -0.03em">인터랙션 패턴</div>
  <p style="margin: 6px 0 0; font-size: 14px; color: #68727F; line-height: 1.6; max-width: 80ch">화면마다 다르게 만들면 안 되는 것들. 표를 어떻게 정렬하고, 뭘 선택했다고 알려주고, 실수를 어떻게 되돌리는지 — 관리자 화면에서 사람들이 이미 알고 있는 약속이에요.</p>
</div>
{sec(1,'표 정렬','컬럼 제목을 누르면 정렬돼요. 한 번 누르면 오름차순, 다시 누르면 내림차순. 정렬 가능한 컬럼에는 항상 화살표를 흐리게 띄워둬서 “누를 수 있다”를 알려요.', sort_demo)}
{sec(2,'선택','체크박스는 세 가지 상태가 있어요. 페이지 넘김이 있으면 “이 페이지”와 “조건 전체”를 반드시 나눠야 해요.', sel_demo)}
{sec(3,'검색','입력하면 지우기 버튼이 생기고, 결과가 없으면 무엇으로 찾았는지 되짚어줘요.', search_demo)}
{sec(4,'적용된 조건','켜져 있는 필터만 따로 모아 보여주고 하나씩 뗄 수 있게 해요.', filter_demo)}
{sec(5,'기간','프리셋을 먼저 주고 직접 지정은 마지막에.', date_demo)}
{sec(6,'버튼 상태','누른 뒤 반응이 없으면 사람은 한 번 더 눌러요. 처리 중 상태가 반드시 필요해요.', btn_demo)}
{sec(7,'결과 알림','작업이 끝나면 무슨 일이 일어났는지 알려주고, 되돌릴 수 있으면 되돌릴 기회를 줘요.', toast_demo)}
{sec(8,'폼 오류와 포커스','오류는 무엇을 어떻게 고칠지 말해줘요. 포커스 링은 키보드 사용자의 유일한 단서예요.', form_demo)}
{sec(9,'불러오는 중 · 실패','기다리는 동안 빈 화면을 보여주지 않고, 실패했을 때 다시 시도할 길을 줘요.', load_demo)}
{sec(10,'빈 상태','비어 있는 이유와 다음에 할 일을 함께 줘요. 이 어드민에서 빈 화면은 예외가 아니라 일상이에요.', empty_demo)}
{sec(11,'되돌릴 수 없는 작업','파괴적인 작업만 확인창을 띄우고, 사유와 동의를 둘 다 받아요.', destr_demo)}
'''
write('Patterns.dc.html', frame(1400, 3180, body))


# ══════════════════════ 컴포넌트 시트 ══════════════════════
def sw(hexv, name, note=''):
    return (f'<div style="border-radius: 10px; overflow: hidden; background: #FFFFFF">'
            f'<div style="height: 52px; background: {hexv}"></div>'
            f'<div style="padding: 8px 10px"><div style="font-size: 12px; font-weight: 700">{name}</div>'
            f'<div class="mono" style="font-size: 11px; color: #68727F">{hexv}{" · " + note if note else ""}</div></div></div>')

body = f'''
<div>
  <div style="font-size: 26px; font-weight: 700; letter-spacing: -0.03em">컴포넌트</div>
  <p style="margin: 6px 0 0; font-size: 14px; color: #68727F">맬리 케어센터 채널 어드민 · Pretendard · 키컬러 #13BD7E</p>
</div>

<div>{lab('브랜드')}
{cols(sw('#E4F8EF','brand-50','선택된 행'), sw('#C6F2E0','brand-100'), sw('#6BDCAF','brand-200'),
      sw('#13BD7E','brand-400','채움·키'), sw('#077A50','brand-700','텍스트·링크'), sw('#042E20','brand-900','채움 위 글자'))}</div>

<div>{lab('중립 — 파랑 쪽으로 아주 살짝 기운 회색 (초록빛 회색 금지)')}
{cols(sw('#F2F4F6','gray-100','바탕'), sw('#F9FAFB','gray-50','보조 표면'), sw('#EDEEF1','gray-200','구분선'),
      sw('#C7CCD4','gray-400','비활성'), sw('#68727F','gray-500','흐린 글자'), sw('#68727F','gray-600','보조'),
      sw('#4A5261','gray-700'), sw('#15181D','gray-900','본문'))}</div>

<div>{lab('상태 — 기본 상태는 회색. 초록은 실제로 이룬 것에만')}
{cols(box(f'{pill("참여 중","nu")} {pill("중도포기","nu")}<div class="cap" style="margin-top:10px">중립 · 기본 상태 전부</div>'),
      box(f'{pill("달성","ok")} {pill("이행","ok")}<div class="cap" style="margin-top:10px">성공 · 실제로 이룬 것</div>'),
      box(f'{pill("활동 중단","wa")} {pill("보류","wa")}<div class="cap" style="margin-top:10px">주의</div>'),
      box(f'{pill("미답변","cr")} {pill("회원탈퇴","cr")}<div class="cap" style="margin-top:10px">위험</div>'),
      box(f'{pill("운영팀 담당","in")}<div class="cap" style="margin-top:10px">정보 · 판단 아님</div>'))}</div>

<div>{lab('타이포그래피 — Pretendard')}
<div style="background: #FFFFFF; border-radius: 14px; overflow: hidden">
  <div style="display:flex;align-items:baseline;gap:24px;padding:14px 22px"><span class="mono" style="width:180px;flex:none;font-size:12px;color:#68727F">Metric 32 / 700</span><span class="metric">40,512</span></div>
  <div style="display:flex;align-items:baseline;gap:24px;padding:14px 22px;border-top:1px solid #F2F4F6"><span class="mono" style="width:180px;flex:none;font-size:12px;color:#68727F">Title 22 / 700</span><span class="h1">참여자 상세</span></div>
  <div style="display:flex;align-items:baseline;gap:24px;padding:14px 22px;border-top:1px solid #F2F4F6"><span class="mono" style="width:180px;flex:none;font-size:12px;color:#68727F">Heading 18 / 700</span><span class="h2">먼저 연락해볼 분들</span></div>
  <div style="display:flex;align-items:baseline;gap:24px;padding:14px 22px;border-top:1px solid #F2F4F6"><span class="mono" style="width:180px;flex:none;font-size:12px;color:#68727F">Body 15 / 400</span><span style="font-size:14px">인천 남동구 치매안심센터 · 3기</span></div>
  <div style="display:flex;align-items:baseline;gap:24px;padding:14px 22px;border-top:1px solid #F2F4F6"><span class="mono" style="width:180px;flex:none;font-size:12px;color:#68727F">Caption 13 / 400</span><span class="cap">사유는 기록에 남고 2년간 보관돼요</span></div>
</div></div>

<div>{lab('버튼 · 칩 · 입력')}
{cols(box('<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn pri">주요</button><button class="btn">보조</button>'
          '<button class="btn dgr">파괴</button><button class="btn sm">작게</button></div>'
          '<div class="cap" style="margin-top:12px">주요 버튼은 화면당 1개</div>'),
      box(f'<div style="display:flex;gap:8px;flex-wrap:wrap">{chip("전체",822)}{chip("14일+ 무활동",184,True)}{chip("무활동",198)}</div>'
          '<div class="cap" style="margin-top:12px">복수 선택 · 건수 표시</div>'),
      box(searchbar('찾기','정','100%') + '<div class="cap" style="margin-top:12px">지우기 버튼 포함</div>'))}</div>

<div>{lab('형태')}
{cols(box('<div style="display:flex;gap:10px;align-items:flex-end">'
          '<span style="width:44px;height:44px;border-radius:6px;background:#EDEEF1"></span>'
          '<span style="width:44px;height:44px;border-radius:10px;background:#EDEEF1"></span>'
          '<span style="width:44px;height:44px;border-radius:10px;background:#EDEEF1"></span>'
          '<span style="width:44px;height:44px;border-radius:12px;background:#EDEEF1"></span></div>'
          '<div class="cap mono" style="margin-top:12px">태그 6 · 컨트롤 8 · 카드 10 · 모달 12</div>'),
      box('<div class="mono" style="font-size:13px;color:#4A5261;line-height:2">카드 여백 20 · 카드 사이 16<br>표 행 44 · 셀 좌우 14<br>버튼 34 · 입력 34</div>'),
      box('<div style="font-size:14px;color:#4A5261;line-height:1.9">카드 = 헤어라인 + 미세 그림자<br>팝오버 = 부드러운 그림자<br>모달 = 깊은 그림자</div>'),
      box('<div style="font-size:14px;color:#C0362B;line-height:1.9">그라데이션 · 텍스트 그림자<br>카드 중첩 · 이모지 아이콘<br>초록빛 회색 · 16px+ 라운드</div>'
          '<div class="cap" style="margin-top:8px;color:#C0362B">금지</div>'))}</div>
'''
write('Components.dc.html', frame(1400, 1560, body))
print('패턴 · 컴포넌트 완료')
