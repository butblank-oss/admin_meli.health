#!/usr/bin/env python3
"""맬리 채널 어드민 아트보드 빌더 — ADMIN_DESIGN.md 토큰으로 .dc.html 생성"""
import pathlib, json, sys

KIT = pathlib.Path('/tmp/_kit.css').read_text()
OUT = pathlib.Path('/Users/g-sso/Desktop/피그마연동')

# ─────────────────────────── 아이콘 ───────────────────────────
I = {
 'home':'<path d="M3 8 10 2.5 17 8v8.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>',
 'users':'<path d="M13.5 17v-1.5a3 3 0 0 0-3-3h-5a3 3 0 0 0-3 3V17"/><circle cx="8" cy="6.5" r="3"/><path d="M17.5 17v-1.5a3 3 0 0 0-2.2-2.9"/>',
 'chart':'<path d="M3 17h14M6 14V9M10 14V4M14 14V11"/>',
 'chat':'<path d="M17.5 11.5a2 2 0 0 1-2 2H7.5L4 16.5V5a2 2 0 0 1 2-2h9.5a2 2 0 0 1 2 2z"/>',
 'cal':'<rect x="3" y="4" width="14" height="13" rx="2.5"/><path d="M3 8h14M7 2v3M13 2v3"/>',
 'target':'<circle cx="10" cy="10" r="6.5"/><circle cx="10" cy="10" r="2.3"/>',
 'doc':'<path d="M11.5 2.5H6A2 2 0 0 0 4 4.5v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7z"/><path d="M11.5 2.5V7H16"/>',
 'userplus':'<path d="M12.5 17v-1.5a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3V17"/><circle cx="7.5" cy="6.5" r="3"/><path d="M15.5 7v4M17.5 9h-4"/>',
 'list':'<path d="M4 5h12M4 10h12M4 15h7"/>',
 'search':'<circle cx="9" cy="9" r="5.5"/><path d="m13.5 13.5 3.5 3.5"/>',
 'left':'<path d="M12 4 6 10l6 6"/>', 'right':'<path d="m8 4 6 6-6 6"/>',
 'check':'<path d="M4 10.5 8 14.5 16 6"/>',
 'x':'<path d="M5 5l10 10M15 5L5 15"/>',
 'alert':'<path d="M10 5.5v5M10 14.2v.3"/>',
 'undo':'<path d="M7 5 3.5 8.5 7 12"/><path d="M3.5 8.5H12a4.5 4.5 0 0 1 0 9h-2"/>',
 'down':'<path d="M5 7.5 10 12.5 15 7.5"/>',
}
def ic(k, s=18, w=1.7):
    return (f'<svg width="{s}" height="{s}" viewBox="0 0 20 20" fill="none" stroke="currentColor" '
            f'stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round">{I[k]}</svg>')

# ─────────────────────────── 사이드바 ───────────────────────────
NAV = [
 ('운영', [('today','오늘','home','crit:3'), ('people','참여자','users','n:822'),
           ('stats','활동 현황','chart',''), ('consult','상담실','chat','crit:4')]),
 ('프로그램', [('sched','프로그램 일정','cal','ro'), ('quest','챌린지','target','ro')]),
 ('행정', [('report','월간 리포트','doc',''), ('apply','참여 신청','userplus','crit:111'),
           ('audit','열람 기록','list','')]),
]
def sidebar(active):
    h = ['<aside style="width: 236px; flex: none; background: #FFFFFF; display: flex; flex-direction: column; padding: 26px 0 20px">',
         '<div style="padding: 0 22px 2px; display: flex; align-items: center; gap: 8px">'
         '<span style="width: 22px; height: 22px; border-radius: 7px; background: #13BD7E; display: flex; align-items: center; justify-content: center">'
         '<svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="#042E20" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10.5 8 14.5 16 6"/></svg></span>'
         '<span style="font-size: 16px; font-weight: 700; letter-spacing: -0.04em; color: #15181D">맬리 케어센터</span></div>',
         '<div style="margin: 18px 10px 2px; padding: 12px 12px; background: #F7F8F9; border-radius: 10px; cursor: pointer">'
         '<div style="display: flex; align-items: center; gap: 6px">'
         '<span style="font-size: 14px; font-weight: 700; color: #15181D; letter-spacing: -0.03em; line-height: 1.4">인천 남동구 치매안심센터</span>'
         '<svg style="margin-left: auto; flex: none" width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="#A0A8B3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7.5 10 12.5 15 7.5"/></svg></div>'
         '<div style="font-size: 12.5px; color: #68727F; margin-top: 4px; font-variant-numeric: tabular-nums">3기 · 진행 171일째</div></div>']
    for grp, items in NAV:
        h.append(f'<div class="navgrp">{grp}</div>')
        for key, label, icon, badge in items:
            on = ' on' if key == active else ''
            b = ''
            if badge.startswith('crit:'):
                b = f'<span class="badge" style="background: #FEF1F0; color: #C0362B">{badge[5:]}</span>'
            elif badge.startswith('n:'):
                bg, fg = ('#D8F5E8', '#0A6B4A') if on else ('#F2F4F6', '#A0A8B3')
                b = f'<span class="badge" style="background: {bg}; color: {fg}">{badge[2:]}</span>'
            elif badge == 'ro':
                b = '<span class="badge" style="background: #F2F4F6; color: #A0A8B3; font-weight: 500">읽기</span>'
            h.append(f'<div class="nav{on}">{ic(icon)} {label} {b}</div>')
    h.append('<div style="margin-top: auto; padding: 18px 22px 0; display: flex; align-items: center; gap: 10px">'
             '<span style="width: 30px; height: 30px; border-radius: 999px; background: #F2F4F6; color: #68727F; display: flex; align-items: center; justify-content: center; font-size: 12.5px; font-weight: 700; flex: none">김</span>'
             '<span><span style="display: block; font-size: 13.5px; font-weight: 600; color: #15181D">김주무 주무관</span>'
             '<span style="display: block; font-size: 12.5px; color: #A0A8B3">채널관리자</span></span></div></aside>')
    return ''.join(h)

def shell(active, title, body, w=1440, h=900, actions='', sub=''):
    subhtml = f'<div class="psub">{sub}</div>' if sub else ''
    act = f'<div style="margin-left: auto; display: flex; gap: 8px; align-items: center; padding-top: 4px">{actions}</div>' if actions else ''
    return f"""<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet><style>{KIT}</style></helmet>
<div style="width: {w}px; height: {h}px; display: flex; background: #FFFFFF; color: #15181D; overflow: hidden">
{sidebar(active)}
<div style="flex: 1; min-width: 0; display: flex; flex-direction: column; background: #F7F8F9">
  <div style="flex: 1; padding: 34px 36px 32px; display: flex; flex-direction: column; gap: 22px; overflow: hidden">
    <div style="display: flex; align-items: flex-start; gap: 16px">
      <div><div class="ptitle">{title}</div>{subhtml}</div>
      {act}
    </div>
{body}
  </div>
</div>
</div>
</x-dc>
<script data-dc-script data-props='{{"$preview":{{"width":{w},"height":{h}}}}}'>
class Component extends DCLogic {{
  renderVals() {{ return {{}}; }}
}}
</script>
</body>
</html>
"""

# ─────────────────────────── 조각 ───────────────────────────
def sort_th(label, state='none', align='left', pad=''):
    """정렬 가능한 표 헤더. state: none | asc | desc"""
    color = '#15181D' if state != 'none' else '#68727F'
    weight = '700' if state != 'none' else '600'
    if state == 'none':
        arrow = ('<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#C7CCD4" stroke-width="1.6" '
                 'stroke-linecap="round" stroke-linejoin="round" style="opacity:.85"><path d="M4 4.8 6 2.5l2 2.3"/><path d="M4 7.2 6 9.5l2-2.3"/></svg>')
    elif state == 'asc':
        arrow = ('<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#13BD7E" stroke-width="2" '
                 'stroke-linecap="round" stroke-linejoin="round"><path d="M3 7.5 6 4l3 3.5"/></svg>')
    else:
        arrow = ('<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#13BD7E" stroke-width="2" '
                 'stroke-linecap="round" stroke-linejoin="round"><path d="M3 4.5 6 8l3-3.5"/></svg>')
    just = 'flex-end' if align == 'right' else 'flex-start'
    return (f'<th style="{pad}"><span style="display:inline-flex;align-items:center;gap:5px;cursor:pointer;'
            f'justify-content:{just};width:100%;color:{color};font-weight:{weight}">{label}{arrow}</span></th>')

def pill(text, kind, dot=True):
    c = {'ok':('#E4F8EF','#0A6B4A','#17B26A'), 'wa':('#FFF6E5','#A8620A','#F79009'),
         'cr':('#FEF1F0','#C0362B','#F04438'), 'nu':('#F2F4F6','#4A5261','#A0A8B3'),
         'in':('#EDF4FF','#1B5FCC','#2E90FA')}[kind]
    d = f'<span class="dot" style="background: {c[2]}"></span>' if dot else ''
    return f'<span class="pill" style="background: {c[0]}; color: {c[1]}">{d}{text}</span>'

def metric(label, value, unit='', note='', tone='', note_tone=''):
    fg = {'wa':'#A8620A','cr':'#C0362B','ok':'#0A6B4A'}.get(tone, '#15181D')
    dt = {'wa':'#F79009','cr':'#F04438','ok':'#17B26A'}.get(tone, '')
    nc = {'up':'#0A6B4A','down':'#C0362B'}.get(note_tone, fg if tone else '#68727F')
    d = f'<span class="dot" style="background: {dt}; margin-right: 6px"></span>' if dt else ''
    n = f'<div style="margin-top: 7px; font-size: 12.5px; font-weight: 500; color: {nc}">{note}</div>' if note else ''
    u = f'<small>{unit}</small>' if unit else ''
    return (f'<div class="card" style="padding: 20px 22px">'
            f'<div class="lbl" style="display: flex; align-items: center">{d}{label}</div>'
            f'<div class="metric" style="margin-top: 9px; color: {fg}">{value}{u}</div>{n}</div>')

def searchbar(placeholder, value='', width='400px'):
    clear = ('<span style="position:absolute;right:12px;width:20px;height:20px;border-radius:999px;background:#A0A8B3;'
             'color:#FFFFFF;display:flex;align-items:center;justify-content:center;cursor:pointer">'
             '<svg width="10" height="10" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M5 5l10 10M15 5L5 15"/></svg></span>') if value else ''
    v = f' value="{value}"' if value else ''
    return (f'<div style="position: relative; display: flex; align-items: center; flex: 1; max-width: {width}">'
            f'<span style="position:absolute;left:13px;color:#A0A8B3;display:flex">{ic("search",17,1.8)}</span>'
            f'<input class="fld" style="width: 100%; padding-left: 39px; padding-right: {"36px" if value else "14px"}" placeholder="{placeholder}"{v}>{clear}</div>')

def pager(total, lo, hi, page=1, pages=10):
    btns = []
    btns.append('<button style="width: 32px; height: 32px; border-radius: 9px; border: none; background: #F7F8F9; color: #C7CCD4; cursor: not-allowed; display: inline-flex; align-items: center; justify-content: center">'
                + ic('left', 14, 2) + '</button>')
    shown = [p for p in range(1, pages + 1) if p <= 2 or p > pages - 1 or abs(p - page) <= 1]
    last = 0
    for p in shown:
        if last and p - last > 1:
            btns.append('<span style="color: #C7CCD4; padding: 0 2px">…</span>')
        if p == page:
            btns.append(f'<button class="mono" style="min-width: 32px; height: 32px; padding: 0 10px; border-radius: 9px; border: none; background: #13BD7E; color: #042E20; font-size: 13.5px; font-weight: 700; cursor: pointer; font-family: inherit">{p}</button>')
        else:
            btns.append(f'<button class="mono" style="min-width: 32px; height: 32px; padding: 0 10px; border-radius: 9px; border: none; background: transparent; color: #4A5261; font-size: 13.5px; cursor: pointer; font-family: inherit">{p}</button>')
        last = p
    btns.append('<button style="width: 32px; height: 32px; border-radius: 9px; border: none; background: #F2F4F6; color: #4A5261; cursor: pointer; display: inline-flex; align-items: center; justify-content: center">'
                + ic('right', 14, 2) + '</button>')
    return (f'<div style="margin-top: auto; padding: 18px 24px; display: flex; align-items: center; gap: 12px; border-top: 1px solid #F1F2F4">'
            f'<span style="font-size: 13.5px; color: #68727F">총 <span class="mono" style="color: #15181D; font-weight: 600">{total}</span>건 중 '
            f'<span class="mono" style="color: #15181D; font-weight: 600">{lo}–{hi}</span></span>'
            f'<select class="fld" style="height: 32px; font-size: 13.5px; border-radius: 9px"><option>20개씩</option><option>50개씩</option><option>100개씩</option></select>'
            f'<div style="margin-left: auto; display: flex; align-items: center; gap: 4px">{"".join(btns)}</div></div>')

def chip(label, count=None, on=False):
    c = f' <span class="c">{count}</span>' if count is not None else ''
    return f'<button class="chip{" on" if on else ""}">{label}{c}</button>'

def sep():
    return '<span style="width: 1px; height: 18px; background: #E9EBEF; margin: 0 6px"></span>'

def cb(state='off', size=17):
    """체크박스 3-state: off | on | mixed"""
    if state == 'on':
        return (f'<span style="width:{size}px;height:{size}px;border-radius:5px;background:#13BD7E;display:inline-flex;'
                f'align-items:center;justify-content:center;vertical-align:middle">'
                f'<svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10.5 8 14.5 16 6"/></svg></span>')
    if state == 'mixed':
        return (f'<span style="width:{size}px;height:{size}px;border-radius:5px;background:#13BD7E;display:inline-flex;'
                f'align-items:center;justify-content:center;vertical-align:middle">'
                f'<span style="width:9px;height:2.5px;border-radius:2px;background:#FFFFFF"></span></span>')
    return f'<span style="width:{size}px;height:{size}px;border-radius:5px;border:1.5px solid #D9DDE3;background:#FFFFFF;display:inline-block;vertical-align:middle"></span>'

def note(text, kind='nu'):
    c = {'ok':('#E4F8EF','#0A6B4A'), 'wa':('#FFF6E5','#A8620A'),
         'cr':('#FEF1F0','#C0362B'), 'nu':('#F7F8F9','#4A5261'),
         'in':('#EDF4FF','#1B5FCC')}[kind]
    return (f'<div style="padding: 16px 18px; background: {c[0]}; border-radius: 12px">'
            f'<p style="margin: 0; font-size: 14px; line-height: 1.7; color: {c[1]}">{text}</p></div>')

def empty(title, desc, action=''):
    a = f'<button class="btn" style="margin-top: 6px">{action}</button>' if action else ''
    return (f'<div style="padding: 72px 20px; display: flex; flex-direction: column; align-items: center; gap: 9px; text-align: center">'
            f'<span class="h3">{title}</span><span style="font-size: 13.5px; color: #68727F; line-height: 1.65">{desc}</span>{a}</div>')

def bar(label, pct, value, color='#13BD7E', lw='116px'):
    return (f'<div style="display: flex; align-items: center; gap: 12px">'
            f'<span style="width: {lw}; flex: none; font-size: 14px; color: #4A5261">{label}</span>'
            f'<span style="flex: 1; height: 8px; border-radius: 5px; background: #F2F4F6; overflow: hidden">'
            f'<span style="display: block; height: 100%; width: {pct}%; background: {color}; border-radius: 5px"></span></span>'
            f'<span class="mono" style="width: 64px; text-align: right; flex: none; font-size: 14px; color: #4A5261">{value}</span></div>')

def card_head(title, right=''):
    r = f'<span style="margin-left: auto; display: flex; gap: 8px; align-items: center">{right}</span>' if right else ''
    return f'<div style="padding: 22px 24px 12px; display: flex; align-items: center; gap: 10px"><span class="h2">{title}</span>{r}</div>'

def write(name, html):
    (OUT / name).write_text(html)
    print(f'  {name}  {len(html)/1024:.0f} KB')
