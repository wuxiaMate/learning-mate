// v0.2 PC 웹 화면 (1440 × 900 뷰포트)
import { ic, HEX, mk, subj, legend, segbar, avatar, ph, check, field, select, table, ringSvg, donutSvg } from './core.mjs';

const NAV = [
  ['sec', '학습'], ['home', '대시보드', 'home'], ['planner', '플래너', 'calendar'], ['focus', '집중하기', 'timer'], ['records', '기록·통계', 'chart'],
  ['sec', '함께'], ['rooms', '스터디방', 'users', '2'],
  ['sec', '내 정보'], ['rewards', '보상·수집', 'gift'], ['settings', '설정', 'settings'],
];

export const browser = (url, inner, { left = 40, top = 118 } = {}) => `<div class="browser" style="left:${left}px;top:${top}px">
  <div class="bbar"><div class="bdots"><i></i><i></i><i></i></div>
    <div class="row" style="gap:14px">${ic('chevL', 16, HEX.muted)}${ic('chevR', 16, '#B5C1D8')}${ic('refresh', 15, HEX.muted)}</div>
    <div class="burl">${ic('lock', 13, HEX.muted)}<span>https://<b>learningmate.app</b>${url}</span></div>
    <div class="grow"></div>${ic('more', 18, HEX.muted)}</div>
  <div class="app">${inner}</div></div>`;

const side = (active, { lock = false, m = '' } = {}) => `<aside class="side"${mk(m)}>
  <div class="logo"><i>L</i>LearningMate</div>
  <div class="nav">${NAV.map(([k, l, icn, cnt]) => (k === 'sec'
    ? `<div class="sec">${l}</div>`
    : `<div class="it${active === k ? ' on' : ''}${lock && active !== k ? ' dis' : ''}">${ic(icn, 18, active === k ? '#fff' : '#AEB9D3')}${l}${cnt ? `<span class="cnt">${cnt}</span>` : ''}</div>`)).join('')}</div>
  <div class="fill"></div>
  ${lock ? `<div class="livecard"><div class="row xs" style="color:#AEB9D3;gap:6px">${ic('lock', 13, '#6E9BF5')}집중 모드</div><div class="sm" style="color:#fff;margin-top:6px;line-height:1.5">다른 메뉴로 이동하면<br>확인 후 일시정지돼요</div></div>` : ''}
  <div class="me">${avatar('A', '', 'k')}<div class="col grow"><b class="md">테스트 계정 A</b><span class="xs" style="color:#AEB9D3">1,320P · 연속 6일</span></div>${ic('logout', 16, '#5F6B85')}</div>
</aside>`;

const shell = ({ active, crumbs, title, right = '', body, lock = false, sideM = '', topM = '' }) => `${side(active, { lock, m: sideM })}
<div class="main">
  <div class="top"${mk(topM)}><div class="col"><div class="crumbs">${crumbs.map((c, i) => `${i ? ic('chevR', 12, HEX.muted2) : ''}<span>${c}</span>`).join('')}</div><h1>${title}</h1></div><div class="row" style="gap:10px">${right}</div></div>
  <div class="content">${body}</div>
</div>`;

const topIcons = (dday = true) => `${dday ? `<span class="chip sm n">${ic('flag', 13, '#fff')}정보처리기사 D-12</span>` : ''}<span class="iconbtn">${ic('search', 17, HEX.muted)}</span><span class="iconbtn">${ic('bell', 17, HEX.muted)}<i class="badge"></i></span>`;

const kpi = (label, icn, value, sub, m = '') => `<div class="card kpi"${mk(m)}><div class="k-l">${ic(icn, 15, HEX.muted)}${label}</div><div class="k-v">${value}</div><div class="k-s">${sub}</div></div>`;

/* ================================================================== */
/* PC-01 로그인                                                         */
/* ================================================================== */
const login = () => `<div style="display:flex;width:100%;height:100%">
  <div style="width:640px;background:var(--navy);color:#fff;padding:56px 60px;display:flex;flex-direction:column;position:relative">
    <div class="logo" style="padding:0;font-size:20px"><i>L</i>LearningMate</div>
    <div style="margin-top:56px;font-size:34px;font-weight:800;line-height:1.35;letter-spacing:-1px">계획하고, 집중하고,<br>기록까지 한 번에.</div>
    <div style="margin-top:14px;font-size:15px;color:var(--sky);line-height:1.6">AI 카메라 감지로 진짜 순공 시간만 쌓는 학습 메이트</div>
    <div class="col" style="gap:14px;margin-top:44px">
      ${[['calendar', '날짜별 계획과 시험 D-Day'], ['timer', '순공 타이머 · 자리 이탈 자동 기록'], ['users', '초대 코드로 함께하는 캠스터디']].map(([i, t]) => `<div class="row" style="gap:12px"><span style="width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,.1);display:grid;place-items:center">${ic(i, 18, '#fff')}</span><span style="font-size:15px">${t}</span></div>`).join('')}
    </div>
    <div style="flex:1;min-height:28px"></div>
    ${ph('100%', '170px', '서비스 소개 이미지', '', 'dark')}
  </div>
  <div style="flex:1;display:flex;align-items:center;justify-content:center;background:#fff;position:relative">
    <div class="toast" style="position:absolute;top:24px;right:28px"${mk(3)}>${ic('clock', 16, '#6E9BF5')}<div class="col"><b>진행 중인 세션이 있어요</b><span class="xs" style="color:#AEB9D3">데이터베이스 · 00:42:10 — 로그인하면 이어서 측정해요</span></div></div>
    <div style="width:400px" class="col">
      <div style="font-size:26px;font-weight:800;letter-spacing:-.6px">로그인</div>
      <div class="muted" style="margin-top:6px">학습 기록은 계정에 안전하게 저장돼요</div>
      <div class="col" style="gap:14px;margin-top:30px"${mk(1)}>
        ${field('이메일', '<div class="input focus">kim.ssafy@example.com</div>')}
        ${field('비밀번호', `<div class="input"><span>••••••••••</span><span class="chev">${ic('eye', 16, HEX.muted)}</span></div>`)}
        <div class="row between"><span class="row sm">${check(true)}로그인 상태 유지</span><span class="link">비밀번호 찾기</span></div>
        <div class="btn lg full">로그인</div>
      </div>
      <div class="row" style="gap:10px;margin:26px 0 14px"><div class="divider grow"></div><span class="xs muted w7">개발 · 데모용</span><div class="divider grow"></div></div>
      <div class="row" style="gap:10px"${mk(2)}><div class="btn g grow">${ic('user', 15)}테스트 계정 A</div><div class="btn g grow">${ic('user', 15)}테스트 계정 B</div></div>
      <div class="sm muted" style="text-align:center;margin-top:26px">계정이 없나요? <span class="link">회원가입</span></div>
      <div class="row xs muted" style="justify-content:center;margin-top:30px;gap:6px"${mk(4)}>${ic('shield', 14, HEX.blue)}카메라 기능은 HTTPS 주소에서만 동작해요</div>
    </div>
  </div>
</div>`;

/* ================================================================== */
/* PC-02 대시보드                                                       */
/* ================================================================== */
const planRow = ({ t, s, g, tag, st, act, m }) => `<div class="row" style="gap:14px;padding:12px 14px;border-radius:12px;${st === 'now' ? 'background:#F0F5FF;border:1px solid var(--blue2)' : 'border:1px solid var(--line2)'}"${mk(m)}>
  <span class="md num w7 ${st === 'done' ? 'muted2' : ''}" style="width:96px">${t}</span>
  ${subj(s)}
  <div class="col grow" style="min-width:0;${st === 'done' ? 'opacity:.6' : ''}"><b class="md" style="${st === 'done' ? 'text-decoration:line-through' : ''}">${g}</b><span class="tag">${tag}</span></div>
  ${st === 'done' ? `<span class="sm blue w7 num">${act}</span><span class="badge b-done">${ic('check', 12, HEX.navy, 3)}완료</span>`
    : st === 'now' ? `<span class="badge b-now">지금</span><span class="btn sm">${ic('play', 12, '#fff')}시작</span>`
    : `<span class="badge b-todo">예정</span><span class="btn sm o">${ic('play', 12, HEX.blue)}시작</span>`}
</div>`;

const dashboard = () => shell({
  active: 'home', crumbs: ['홈'], title: '대시보드',
  right: `${topIcons()}<span class="btn"${mk(7)}>${ic('play', 14, '#fff')}바로 집중 시작</span>`,
  body: `
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px"${mk(1)}>
    ${kpi('오늘 순공', 'timer', '2:14:30', `<div class="bar grow"><i style="width:56%"></i></div><span>목표 4:00</span>`)}
    ${kpi('이번 주 순공', 'chart', '18:42:10', `<span class="blue w7">▲ 1:12:05</span> 지난주 대비`)}
    ${kpi('오늘 계획 달성', 'check', '2 / 5', `<div class="bar grow"><i style="width:40%"></i></div><span>남은 3개</span>`)}
    ${kpi('연속 학습', 'flag', '6일', `<span class="row" style="gap:4px">${[1, 1, 1, 1, 1, 1, 0].map((x) => `<i style="width:14px;height:14px;border-radius:4px;display:block;background:${x ? 'var(--blue)' : 'var(--line2)'}"></i>`).join('')}</span><span>최고 14일</span>`)}
  </div>
  <div style="display:grid;grid-template-columns:1fr 372px;gap:16px">
    <div class="card"${mk(2)}>
      <div class="ch"><h3>오늘의 계획 <span class="sub">11월 24일 (화)</span></h3><div class="row"><span class="link">플래너에서 보기 ${ic('chevR', 13, HEX.blue)}</span><span class="btn sm g">${ic('plus', 14)}계획 추가</span></div></div>
      <div class="col" style="gap:8px">
        ${planRow({ t: '07:30–08:10', s: 'eng', g: '토익 RC 파트5 40문제', tag: '#토익', st: 'done', act: '실제 0:38:12' })}
        ${planRow({ t: '09:00–10:30', s: 'algo', g: '백준 DP 3문제', tag: '#코테 #복습', st: 'done', act: '실제 1:24:36' })}
        ${planRow({ t: '14:00–15:00', s: 'db', g: '정규화 개념 정리', tag: '#정처기', st: 'now', m: 3 })}
        ${planRow({ t: '16:00–17:30', s: 'exam', g: '필기 기출 1회분', tag: '#정처기 #기출', st: 'todo' })}
        ${planRow({ t: '20:00–21:00', s: 'eng', g: '단어 Day 12', tag: '#토익', st: 'todo' })}
      </div>
    </div>
    <div class="col" style="gap:16px">
      <div class="card"${mk(4)}>
        <div class="ch"><h3>시험 D-Day</h3><span class="link">${ic('plus', 13, HEX.blue)}시험 추가</span></div>
        ${[['D-12', '정보처리기사 필기', '12.06 (토)', 72, true], ['D-40', '토익 정기시험', '01.03 (토)', 28]].map(([d, n, dt, p, main]) => `<div class="row" style="gap:14px;padding:10px 0;border-top:1px solid var(--line2)"><span style="width:62px;height:44px;border-radius:10px;display:grid;place-items:center;font-weight:800;font-size:16px;${main ? 'background:var(--navy);color:#fff' : 'background:var(--tint);color:var(--navy)'}">${d}</span><div class="col grow"><b class="md">${n}</b><span class="xs muted">${dt} · 관련 계획 ${main ? '9개' : '4개'}</span><div class="bar" style="margin-top:6px;height:5px"><i style="width:${p}%"></i></div></div></div>`).join('')}
      </div>
      <div class="card" style="flex:1">
        <div class="ch"><h3>이번 주 순공</h3><span class="sub">18:42:10</span></div>
        <div class="bars" style="height:112px">${[['월', 62], ['화', 88], ['수', 40], ['목', 70], ['금', 55], ['토', 96], ['일', 30]].map(([d, hgt], i) => `<div><i style="display:block;width:100%;height:${hgt}%;border-radius:6px 6px 2px 2px;background:${i === 1 ? 'var(--navy)' : 'var(--blue2)'}"></i><small>${d}</small></div>`).join('')}</div>
      </div>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 372px;gap:16px">
    <div class="card"${mk(5)}>
      <div class="ch"><h3>최근 세션</h3><span class="link">기록·통계 ${ic('chevR', 13, HEX.blue)}</span></div>
      ${table([{ t: '일시', w: '150px' }, { t: '과목 · 목표' }, { t: '측정', w: '80px' }, { t: '순공', w: '84px', r: 1 }, { t: '이탈', w: '64px', r: 1 }, { t: '보상', w: '60px', r: 1 }], [
        ['<span class="md num">11.24 09:02–10:44</span>', `${subj('algo')}<span class="md">백준 DP 3문제</span>`, '<span class="badge b-line">AI</span>', '<b class="num">1:24:36</b>', '<span class="num muted">2회</span>', '<b class="blue">+80P</b>'],
        ['<span class="md num">11.24 07:31–08:12</span>', `${subj('eng')}<span class="md">토익 RC 파트5</span>`, '<span class="badge b-todo">수동</span>', '<b class="num">0:38:12</b>', '<span class="muted">–</span>', '<b class="blue">+50P</b>'],
      ])}
    </div>
    <div class="card"${mk(6)}>
      <div class="ch"><h3>스터디방</h3><span class="link">전체 ${ic('chevR', 13, HEX.blue)}</span></div>
      ${[['SSAFY 알고리즘 스터디', '2명 집중 중', ['f', 'f', 'p', 'o']], ['정처기 막판 스퍼트', '1명 집중 중', ['f', 'o', 'o']]].map(([n, s, sts], i) => `<div class="row" style="gap:12px;padding:9px 0;${i ? 'border-top:1px solid var(--line2)' : ''}"><div class="col grow"><b class="md">${n}</b><span class="row xs muted" style="gap:5px"><span class="dot d-f"></span>${s}</span></div><span class="stack">${sts.map((st, j) => avatar('민지도서'[j], st)).join('')}</span><span class="btn sm ${i ? 'g' : ''}" style="margin-left:10px">입장</span></div>`).join('')}
    </div>
  </div>`,
});

/* ================================================================== */
/* PC-03 플래너 (주간)                                                  */
/* ================================================================== */
const H0 = 7, RH = 44;
const PLAN_STYLE = {
  algo: 'background:var(--blue);color:#fff',
  eng: 'background:var(--sky);color:var(--navy)',
  db: 'background:var(--navy);color:#fff',
  exam: 'background:#fff;color:var(--black);border:1.5px solid var(--black)',
};
const WEEK = [
  ['월', 23, [[9, 2, 'algo', '백준 그래프', 'done'], [13, 1, 'eng', 'LC 파트2', 'done'], [20, 2, 'exam', '필기 기출', 'done']]],
  ['화', 24, [[7.5, 0.67, 'eng', '토익 RC', 'done'], [9, 1.5, 'algo', '백준 DP 3문제', 'done', 'sel'], [14, 1, 'db', '정규화 정리', 'now'], [16, 1.5, 'exam', '필기 기출 1회', ''], [20, 1, 'eng', '단어 Day 12', '']]],
  ['수', 25, [[10, 2, 'algo', '백준 DP 심화', ''], [19, 2, 'exam', '필기 기출 2회', '']]],
  ['목', 26, [[9, 1, 'eng', 'RC 파트6', ''], [14, 2, 'db', 'SQL 조인', ''], [20, 2, 'exam', '필기 요약', '']]],
  ['금', 27, [[13, 2, 'algo', '구현 모의', '']]],
  ['토', 28, [[10, 3, 'exam', '모의고사', '']]],
  ['일', 29, [[15, 1, 'eng', '오답 노트', '']]],
];
const hm = (h) => `${String(Math.floor(h)).padStart(2, '0')}:${String(Math.round((h % 1) * 60)).padStart(2, '0')}`;
const plannerGrid = (m = true) => `<div class="card flat" style="display:flex;flex-direction:column"${mk(m ? 1 : '')}>
  <div class="row" style="gap:0;height:58px;border-bottom:1px solid var(--line);flex:none">
    <div style="width:52px"></div>
    ${WEEK.map(([d, n], i) => `<div class="col" style="flex:1;align-items:center;justify-content:center;gap:2px;height:100%;border-left:1px solid var(--line2);${i === 1 ? 'background:#F0F5FF' : ''}"><span class="xs ${i === 1 ? 'blue w7' : 'muted'}">${d}</span><span style="font-weight:800;font-size:16px;${i === 1 ? 'width:28px;height:28px;border-radius:50%;background:var(--blue);color:#fff;display:grid;place-items:center;font-size:14px' : ''}">${n}</span></div>`).join('')}
  </div>
  <div style="display:flex;position:relative;flex:1">
    <div style="width:52px;position:relative">${Array.from({ length: 15 }, (_, k) => `<span class="xs muted2 num" style="position:absolute;right:8px;top:${k * RH - 7}px">${String(H0 + k).padStart(2, '0')}:00</span>`).join('')}
      <span class="xs w8 num" style="position:absolute;right:6px;top:${(14 + 20 / 60 - H0) * RH - 8}px;background:var(--black);color:#fff;padding:1px 4px;border-radius:4px"${m ? mk(3) : ''}>14:20</span></div>
    ${WEEK.map(([, , plans], i) => `<div style="flex:1;position:relative;border-left:1px solid var(--line2);${i === 1 ? 'background:#F7FAFF' : ''};background-image:none">
      ${Array.from({ length: 15 }, (_, k) => `<i style="position:absolute;left:0;right:0;top:${k * RH}px;height:1px;background:var(--line2);display:block"></i>`).join('')}
      ${plans.map(([st, dur, s, g, state, sel]) => `<div style="position:absolute;left:4px;right:4px;top:${(st - H0) * RH + 2}px;height:${dur * RH - 4}px;border-radius:8px;padding:5px 7px;z-index:1;${PLAN_STYLE[s]};${state === 'done' ? 'opacity:.55' : ''};${sel ? 'opacity:1;box-shadow:0 0 0 2.5px var(--black)' : ''};${state === 'now' ? 'box-shadow:0 0 0 2.5px var(--blue2)' : ''}"${sel && m ? mk(2) : ''}><div class="row" style="gap:4px;font-size:11.5px;font-weight:800;line-height:1.3;white-space:nowrap;overflow:hidden">${state === 'done' ? ic('check', 11, s === 'eng' || s === 'exam' ? HEX.navy : '#fff', 3) : ''}<span style="overflow:hidden;text-overflow:ellipsis">${g}</span></div>${dur >= 1 ? `<div style="font-size:10.5px;opacity:.85;margin-top:2px;white-space:nowrap" class="num">${hm(st)}–${hm(st + dur)}</div>` : ''}${sel ? `<div style="margin-top:4px;font-size:10.5px;background:rgba(255,255,255,.22);border-radius:4px;padding:1px 5px;white-space:nowrap" class="num">실제 1:24:36</div>` : ''}</div>`).join('')}
      ${i === 1 ? `<div style="position:absolute;left:-1px;right:0;top:${(14 + 20 / 60 - H0) * RH}px;height:2px;background:var(--black);z-index:0"><i style="position:absolute;left:-4px;top:-4px;width:10px;height:10px;border-radius:50%;background:var(--black);display:block"></i></div>` : ''}
    </div>`).join('')}
  </div>
</div>`;

const planner = () => shell({
  active: 'planner', crumbs: ['플래너'], title: '플래너',
  right: `<div class="seg" style="width:180px"><span>일</span><span class="on">주</span><span>월</span></div><span class="btn g sm">오늘</span><div class="row" style="gap:6px"><span class="iconbtn" style="width:32px;height:32px">${ic('chevL', 15)}</span><b class="md" style="width:170px;text-align:center">11월 4주 · 11.23 – 11.29</b><span class="iconbtn" style="width:32px;height:32px">${ic('chevR', 15)}</span></div><span class="btn">${ic('plus', 15, '#fff')}계획 추가</span>`,
  body: `<div style="display:grid;grid-template-columns:1fr 330px;gap:18px;flex:1;min-height:0">
    ${plannerGrid()}
    <div class="col" style="gap:14px">
      <div class="card"${mk(4)}>
        <div class="row between">${subj('algo')}<span class="badge b-done">${ic('check', 12, HEX.navy, 3)}완료</span></div>
        <div style="font-size:18px;font-weight:800;margin-top:10px;letter-spacing:-.3px">백준 DP 3문제</div>
        <div class="col" style="gap:8px;margin-top:12px">
          ${[['clock', '11.24 (화) 09:00 – 10:30'], ['tag', '#코테  #복습'], ['flag', '정보처리기사 필기 (D-12)']].map(([i, t]) => `<div class="row md">${ic(i, 15, HEX.muted)}<span>${t}</span></div>`).join('')}
        </div>
        <div class="card tint" style="padding:12px 14px;margin-top:14px">
          <div class="row between sm"><b>계획 대비 실제</b><span class="blue w8">94%</span></div>
          <div class="row sm" style="margin-top:8px"><span class="muted" style="width:30px">계획</span><div class="bar grow" style="height:7px"><i style="width:100%;background:var(--line)"></i></div><span class="num" style="width:48px;text-align:right">1:30:00</span></div>
          <div class="row sm" style="margin-top:6px"><span class="muted" style="width:30px">실제</span><div class="bar grow" style="height:7px"><i style="width:94%"></i></div><span class="num w7" style="width:48px;text-align:right">1:24:36</span></div>
          <div class="row xs" style="margin-top:10px;justify-content:space-between"><span class="muted">세션 09:02–10:44</span><span class="link">세션 상세 ${ic('chevR', 12, HEX.blue)}</span></div>
        </div>
        <div class="row" style="gap:8px;margin-top:14px"><span class="btn sm grow">${ic('play', 12, '#fff')}이 계획으로 다시 시작</span><span class="iconbtn" style="width:32px;height:32px">${ic('edit', 15)}</span><span class="iconbtn" style="width:32px;height:32px">${ic('trash', 15)}</span></div>
      </div>
      <div class="card"${mk(5)}>
        <div class="ch" style="margin-bottom:8px"><h3>시험 D-Day</h3><span class="link">${ic('plus', 13, HEX.blue)}추가</span></div>
        ${[['D-12', '정보처리기사 필기', '12.06 (토)'], ['D-40', '토익 정기시험', '01.03 (토)']].map(([d, n, dt], i) => `<div class="row" style="gap:10px;padding:8px 0;${i ? 'border-top:1px solid var(--line2)' : ''}"><span class="chip sm ${i ? 's' : 'n'}" style="width:52px;justify-content:center">${d}</span><span class="md grow">${n}</span><span class="xs muted num">${dt}</span></div>`).join('')}
      </div>
      <div class="card" style="flex:1"${mk(6)}>
        <div class="ch" style="margin-bottom:10px"><h3>이번 주 달성</h3><b class="blue">9 / 17</b></div>
        <div class="bar"><i style="width:53%"></i></div>
        <div class="col" style="gap:7px;margin-top:14px">${[['algo', '4/5'], ['eng', '3/6'], ['db', '1/2'], ['exam', '1/4']].map(([s, v]) => `<div class="row between">${subj(s)}<span class="sm num muted">${v}</span></div>`).join('')}</div>
      </div>
    </div>
  </div>`,
});

/* ================================================================== */
/* PC-04 계획 추가 모달                                                 */
/* ================================================================== */
const planModal = () => `${shell({ active: 'planner', crumbs: ['플래너'], title: '플래너', right: `<span class="btn">${ic('plus', 15, '#fff')}계획 추가</span>`, body: `<div style="display:grid;grid-template-columns:1fr 330px;gap:18px;flex:1;min-height:0">${plannerGrid(false)}<div class="card"></div></div>` })}
<div class="dim"></div>
<div class="modal" style="left:${(1440 - 600) / 2}px;top:70px;width:600px">
  <div class="row between" style="padding:22px 26px 0"><b style="font-size:19px;letter-spacing:-.4px">계획 추가</b>${ic('x', 20, HEX.muted)}</div>
  <div style="padding:16px 26px 0"><div class="seg dark"${mk(1)}><span class="on">${ic('calendar', 14, '#fff')}&nbsp;공부 계획</span><span>${ic('flag', 14, HEX.muted)}&nbsp;시험 D-Day</span></div></div>
  <div class="col" style="gap:16px;padding:20px 26px">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
      <div class="field" style="position:relative"${mk(2)}><span class="lbl">과목 <span class="blue">*</span></span>${select(`${subj('algo')}`, 'focus')}
        <div class="menu" style="left:0;right:0;top:70px">
          <div class="mi on">${subj('algo')}<span class="grow"></span>${ic('check', 15, HEX.blue, 2.5)}</div>
          <div class="mi">${subj('eng')}</div><div class="mi">${subj('db')}</div><div class="mi">${subj('exam')}</div>
          <div class="divider" style="margin:4px 0"></div>
          <div class="mi blue w7">${ic('plus', 15, HEX.blue)}새 과목 만들기</div>
        </div>
      </div>
      ${field('목표 (선택)', '<div class="input">그래프 탐색 2문제</div>')}
      ${field('날짜', `<div class="input">${ic('calendar', 15, HEX.muted)}2026.11.25 (수)</div>`)}
      <div class="field"${mk(3)}><span class="lbl">시간</span><div class="row" style="gap:6px"><div class="input err num" style="flex:1">10:00</div><span class="muted">~</span><div class="input err num" style="flex:1">12:00</div></div><span class="help err">${ic('alert', 13, HEX.black)}같은 시간에 '백준 DP 심화' 계획이 있어요</span></div>
      ${field('태그 (선택)', `<div class="input" style="height:auto;min-height:40px;padding:6px 8px;flex-wrap:wrap;gap:6px"><span class="chip sm s">#코테 ${ic('x', 11, HEX.navy, 2.5)}</span><span class="muted2 sm">입력 후 Enter</span></div>`)}
      <div${mk(4)}>${field('시험 연결 (선택)', select(`${ic('flag', 15, HEX.navy)}<span style="margin-left:6px">정보처리기사 필기 · D-12</span>`), 'D-Day 카드의 관련 계획 수에 반영돼요')}</div>
    </div>
  </div>
  <div class="row between" style="padding:16px 26px 22px;border-top:1px solid var(--line2)"><span class="row sm">${check(false)}저장 후 계속 추가</span><div class="row"${mk(5)}><span class="btn g">취소</span><span class="btn dis">저장</span></div></div>
</div>`;

/* ================================================================== */
/* PC-05 학습 시작 설정                                                 */
/* ================================================================== */
const setup = () => shell({
  active: 'focus', crumbs: ['집중하기', '새 세션'], title: '집중 시작하기',
  right: `<span class="btn g">취소</span>`,
  body: `<div style="display:grid;grid-template-columns:1fr 540px;gap:18px;flex:1;min-height:0">
    <div class="col" style="gap:16px">
      <div class="card"${mk(1)}>
        <div class="ch"><h3>세션 정보</h3></div>
        <div class="col" style="gap:14px">
          ${field('연결된 계획', select(`${ic('calendar', 15, HEX.navy)}<span style="margin-left:6px">11.24 (화) 14:00–15:00 · 데이터베이스 · 정규화 개념 정리</span>`), '계획 없이 시작하려면 \'선택 안 함\' — 과목·목표가 자동으로 채워져요')}
          <div class="field"><span class="lbl">과목 <span class="blue">*</span></span><div class="row" style="gap:6px">${subj('db')}<span class="chip sm">알고리즘</span><span class="chip sm">영어</span><span class="chip sm">정보처리기사</span><span class="chip sm dash">${ic('plus', 12, HEX.blue)}새 과목</span></div></div>
          <div style="display:grid;grid-template-columns:1.3fr 1fr;gap:12px">${field('목표', '<div class="input">정규화 개념 정리 (1NF~BCNF)</div>')}${field('태그', '<div class="input" style="gap:6px"><span class="chip sm s">#정처기</span><span class="muted2 sm">추가</span></div>')}</div>
        </div>
      </div>
      <div class="card"${mk(2)}>
        <div class="ch"><h3>측정 방식</h3><span class="sub">세션 중에도 바꿀 수 있어요</span></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div style="border:1.5px solid var(--blue);background:#F0F5FF;border-radius:12px;padding:14px" class="row"><span class="radio on"></span><div class="col grow" style="gap:3px"><div class="row"><b>AI 카메라 감지</b><span class="badge b-now">권장</span></div><span class="sm muted" style="line-height:1.5">얼굴 검출로 자리 이탈을 자동 기록하고 재실 구간만 순공에 합산</span></div></div>
          <div style="border:1px solid var(--line);border-radius:12px;padding:14px" class="row"><span class="radio"></span><div class="col grow" style="gap:3px"><b>수동</b><span class="sm muted" style="line-height:1.5">카메라 없이 직접 시작·일시정지·종료</span></div></div>
        </div>
      </div>
      <div class="card" style="flex:1"${mk(3)}>
        <div class="ch"><h3>집중 보조</h3></div>
        <div class="row" style="gap:12px;padding-bottom:14px;border-bottom:1px solid var(--line2)">${ic('music', 18, HEX.navy)}<div class="col" style="width:150px"><b class="md">배경음</b><span class="xs muted">사용자 클릭 후 재생</span></div>${select('빗소리')}<span class="iconbtn" style="width:36px;height:36px">${ic('play', 13, HEX.navy)}</span>${ic('volume', 16, HEX.muted)}<div class="slider" style="max-width:120px"><i style="width:60%"></i></div><span class="toggle on"></span></div>
        <div class="row" style="gap:12px;padding-top:14px">${ic('video', 18, HEX.navy)}<div class="col" style="width:150px"><b class="md">타임랩스</b><span class="xs muted">이 브라우저에만 저장</span></div>${select('10초 간격')}<span class="sm muted grow">약 1시간 → 0:36 영상</span><span class="toggle on"></span></div>
      </div>
    </div>
    <div class="card"${mk(4)}>
      <div class="ch"><h3>${ic('camera', 17, HEX.black)}카메라 확인</h3>${select(`<span class="sm">HD Webcam (내장)</span>`)}</div>
      ${ph('100%', '280px', '', `<div class="face" style="width:24%"></div><div class="facebox" style="left:39%;top:26%;width:22%;height:52%"><span>얼굴 인식됨</span></div>`)}
      <div class="col" style="gap:10px;margin-top:16px"${mk(5)}>
        ${[['check', '카메라 권한 허용됨', 'blue', ''], ['check', '얼굴이 화면 안에 있어요', 'blue', ''], ['alert', '조명이 조금 어두워요 — 판정 불가가 늘 수 있어요', 'k', '조명 켜기']].map(([i, t, c, a]) => `<div class="row" style="gap:10px;padding:10px 12px;border-radius:10px;background:${c === 'k' ? '#fff' : 'var(--tint)'};border:1px solid ${c === 'k' ? 'var(--black)' : 'var(--line2)'}">${ic(i, 16, c === 'k' ? HEX.black : HEX.blue, 2.5)}<span class="md grow ${c === 'k' ? 'w7' : ''}">${t}</span>${a ? `<span class="xs muted">${a}</span>` : ''}</div>`).join('')}
      </div>
      <div class="row sm muted" style="gap:8px;margin-top:14px;line-height:1.5"${mk(6)}>${ic('shield', 16, HEX.blue)}<span>프레임은 이 브라우저 안에서만 분석하고 서버로 전송·저장하지 않아요</span></div>
      <div class="divider" style="margin:16px 0"></div>
      <div class="row between"><span class="sm muted">데이터베이스 · AI 감지 · 배경음 · 타임랩스</span><span class="btn lg"${mk(7)}>${ic('play', 15, '#fff')}집중 시작<span class="kbd" style="margin-left:4px;background:transparent;color:#DCE8FF;border-color:rgba(255,255,255,.4)">Enter</span></span></div>
    </div>
  </div>`,
});

/* ================================================================== */
/* PC-06 집중 세션                                                      */
/* ================================================================== */
const focusTop = (state = 'focus') => `<div class="top"${mk(1)}>
  <div class="row" style="gap:12px"><span class="chip sm k">${ic('lock', 13, '#fff')}집중 모드</span>${subj('db')}<b style="font-size:19px;letter-spacing:-.4px">정규화 개념 정리</b><span class="sm muted">· 계획 14:00–15:00</span></div>
  <div class="row" style="gap:8px"><span class="btn g sm">${ic('camera', 14)}수동 모드로 전환</span><span class="btn k sm">${ic('stop', 12, '#fff')}세션 종료</span></div>
</div>`;

const focusPage = () => `${side('focus', { lock: true })}
<div class="main">${focusTop()}
  <div class="content"><div style="display:grid;grid-template-columns:1fr 400px;gap:18px;flex:1;min-height:0">
    <div class="card" style="display:flex;flex-direction:column;align-items:center;padding:26px 30px">
      <span class="pill st-focus"${mk(2)}><i></i>재실 · 집중 중</span>
      <div class="ring" style="width:330px;height:330px;margin-top:18px"${mk(3)}>${ringSvg(330, 14, 0.65)}
        <div class="in"><span class="sm muted w7">순공 시간</span><div class="timer" style="font-size:66px">00:39:12</div><span class="sm muted">목표 1:00:00 · 오늘 누적 2:53:42</span></div></div>
      <div class="row" style="gap:40px;margin-top:18px"${mk(4)}>
        <div class="col" style="align-items:center;gap:6px"><span class="rb out" style="width:68px;height:68px">${ic('pause', 24, HEX.navy)}</span><span class="sm w7">일시정지 <span class="kbd">Space</span></span></div>
        <div class="col" style="align-items:center;gap:6px"><span class="rb k" style="width:68px;height:68px">${ic('stop', 22, '#fff')}</span><span class="sm w7">종료 <span class="kbd">Esc</span></span></div>
      </div>
      <div class="fill" style="flex:1"></div>
      <div class="col" style="gap:8px;width:100%"${mk(5)}>
        <div class="row between"><b class="md">구간 타임라인</b>${legend()}</div>
        ${segbar([['f', 19], ['p', 2], ['f', 15], ['a', 1], ['f', 7], ['e', 16]], 16)}
        <div class="row between xs muted2 num"><span>14:00</span><span>14:15</span><span>14:30</span><span>14:45</span><span>15:00</span></div>
      </div>
    </div>
    <div class="col" style="gap:14px">
      <div class="card" style="padding:14px"${mk(6)}>
        ${ph('100%', '198px', '', `<div class="face" style="width:24%"></div><div class="facebox" style="left:38%;top:24%;width:24%;height:56%"><span>재실 · 0.2초 전</span></div><span class="chip sm k" style="position:absolute;right:10px;top:10px;z-index:3"><span class="rec" style="box-shadow:none;background:#6E9BF5"></span>타임랩스 186컷</span>`)}
        <div class="row between" style="margin-top:12px"><div class="col"><b class="md">AI 재실 감지</b><span class="xs muted">얼굴 검출 정상 · 프레임 미전송</span></div><span class="toggle on"></span></div>
        <div class="row between" style="margin-top:10px"><div class="col"><b class="md">카메라</b><span class="xs muted">끄면 수동 모드로 이어서 측정</span></div><span class="toggle on"></span></div>
      </div>
      <div class="card" style="padding:14px 16px"${mk(7)}>
        <div class="ch" style="margin-bottom:10px"><h3>${ic('music', 16)}배경음</h3><div class="row" style="gap:8px">${ic('volume', 15, HEX.muted)}<div class="slider" style="width:90px;flex:none"><i style="width:60%"></i></div></div></div>
        <div class="col" style="gap:4px">${[['빗소리', 1], ['카페 소음', 0], ['백색소음', 0], ['모닥불', 0]].map(([t, on]) => `<div class="row" style="gap:10px;height:34px;padding:0 10px;border-radius:8px;${on ? 'background:var(--tint)' : ''}">${ic(on ? 'pause' : 'play', 12, on ? HEX.blue : HEX.muted)}<span class="md ${on ? 'w7 blue' : ''}">${t}</span><span class="grow"></span>${on ? '<span class="row" style="gap:2px;align-items:flex-end;height:14px">' + [8, 13, 6, 11].map((h) => `<i style="width:3px;height:${h}px;background:var(--blue);border-radius:1px;display:block"></i>`).join('') + '</span>' : ''}</div>`).join('')}</div>
      </div>
      <div class="card" style="padding:14px 16px;flex:1"${mk(8)}>
        <div class="ch" style="margin-bottom:8px"><h3>이벤트 로그</h3><span class="sub">세션 #2482</span></div>
        ${[['14:02', '집중 시작', '계획에서 시작', 'f'], ['14:21', '일시정지', '사용자 · 2:10', 'p'], ['14:23', '집중 재개', '', 'f'], ['14:38', '자리 이탈', 'AI · 0:45', 'a'], ['14:39', '복귀 · 자동 재개', '', 'f']].map(([t, e, d, c]) => `<div class="row" style="gap:10px;height:30px"><span class="xs num muted" style="width:36px">${t}</span><span class="dot d-${c}"></span><span class="md grow">${e}</span><span class="xs muted">${d}</span></div>`).join('')}
      </div>
    </div>
  </div></div>
</div>`;

/* ================================================================== */
/* PC-08 세션 결과                                                      */
/* ================================================================== */
const result = () => shell({
  active: 'focus', crumbs: ['집중하기', '세션 결과'], title: '세션 완료',
  right: `<span class="btn g">대시보드</span><span class="btn">${ic('chart', 15, '#fff')}기록에서 보기</span>`,
  body: `<div style="display:grid;grid-template-columns:1fr 460px;gap:18px;flex:1;min-height:0">
    <div class="col" style="gap:16px">
      <div class="card" style="padding:22px 24px"${mk(1)}>
        <div class="row" style="gap:14px"><span style="width:48px;height:48px;border-radius:50%;background:var(--blue);display:grid;place-items:center">${ic('check', 24, '#fff', 3)}</span><div class="col"><b style="font-size:19px;letter-spacing:-.4px">수고했어요! 계획한 시간의 98%를 채웠어요</b><span class="md muted">${''}데이터베이스 · 정규화 개념 정리 · 14:02 – 15:06 · AI 카메라 감지</span></div></div>
        <div class="row" style="gap:28px;margin-top:22px;align-items:flex-end">
          <div class="col"><span class="lbl">순공 시간</span><div class="timer" style="font-size:52px;margin-top:6px">0:58:40</div></div>
          <div class="vdiv"></div>
          ${[['총 경과', '1:04:12', ''], ['일시정지', '0:02:10', '1회'], ['자리 이탈', '0:03:22', '2회'], ['판정 불가', '0:00:00', '0회']].map(([a, b, c]) => `<div class="col" style="gap:4px"><span class="sm muted">${a}</span><b class="num" style="font-size:20px">${b}</b><span class="xs muted">${c || '&nbsp;'}</span></div>`).join('')}
        </div>
        <div class="col" style="gap:8px;margin-top:22px"${mk(2)}>${segbar([['f', 19], ['p', 2], ['f', 15], ['a', 1], ['f', 14], ['a', 2], ['f', 11]], 18)}<div class="row between">${legend()}<span class="xs muted2 num">14:02 → 15:06</span></div></div>
        <div class="row xs muted" style="gap:6px;margin-top:16px"${mk(3)}>${ic('check', 13, HEX.blue, 3)}서버 저장 완료 · 세션 #2482 <span class="muted2">— 응답이 없으면 같은 세션 ID로 자동 재시도해요</span></div>
      </div>
      <div class="card"${mk(4)}>
        <div class="ch"><h3>계획 대비</h3><span class="row sm">${check(true)}<b>계획 완료로 표시</b></span></div>
        <div class="row" style="gap:16px">
          <div class="col grow" style="gap:10px">
            <div class="row sm"><span class="muted" style="width:40px">계획</span><div class="bar grow" style="height:10px"><i style="width:100%;background:var(--line)"></i></div><span class="num" style="width:150px;text-align:right;white-space:nowrap">14:00–15:00 · 1:00:00</span></div>
            <div class="row sm"><span class="muted" style="width:40px">실제</span><div class="bar grow" style="height:10px"><i style="width:98%"></i></div><span class="num w7" style="width:150px;text-align:right;white-space:nowrap">14:02–15:06 · 0:58:40</span></div>
          </div>
          <div class="col" style="align-items:center;width:110px;border-left:1px solid var(--line2)"><b style="font-size:28px;color:var(--navy)">98%</b><span class="xs muted">달성률</span></div>
        </div>
        <div class="divider" style="margin:16px 0"></div>
        <div class="row between md"><span class="muted">오늘 다음 계획</span><span class="row">${subj('exam')}<b>필기 기출 1회분</b><span class="muted num">16:00</span><span class="btn sm o" style="margin-left:6px">${ic('play', 11, HEX.blue)}이어서 시작</span></span></div>
      </div>
      <div class="card" style="flex:1">
        <div class="ch" style="margin-bottom:8px"><h3>이벤트 요약</h3><span class="link">세션 상세 ${ic('chevR', 12, HEX.blue)}</span></div>
        ${[['14:02', '집중 시작', '계획에서 시작 · AI 모드', 'f'], ['14:21', '일시정지 2:10', '사용자 조작', 'p'], ['14:38', '자리 이탈 0:45', 'AI · 얼굴 미검출', 'a'], ['14:52', '자리 이탈 2:37', 'AI · 얼굴 미검출', 'a'], ['15:06', '세션 종료', '사용자 종료 · 보상 지급', 'k']].map(([t, e, d, c]) => `<div class="row" style="gap:12px;height:32px;border-top:1px solid var(--line2)"><span class="sm num muted" style="width:40px">${t}</span><span class="dot ${c === 'k' ? '' : `d-${c}`}" style="${c === 'k' ? 'border:2px solid var(--black)' : ''}"></span><span class="md grow">${e}</span><span class="xs muted">${d}</span></div>`).join('')}
      </div>
    </div>
    <div class="col" style="gap:16px">
      <div class="card navy" style="padding:20px 22px"${mk(5)}>
        <div class="row between"><span class="sm" style="color:var(--sky)">세션 보상</span><span class="sm" style="color:var(--sky)">보유 1,380P ›</span></div>
        <div style="font-size:30px;font-weight:800;margin-top:6px">+60P 획득</div>
        <div class="col" style="gap:6px;margin-top:12px">${['정상 종료', '최소 집중 25분 이상 (58분)', '세션당 1회 지급 · 중복 지급 없음'].map((t) => `<div class="row sm">${ic('check', 14, '#6E9BF5', 3)}<span>${t}</span></div>`).join('')}</div>
      </div>
      <div class="card"${mk(6)}>
        <div class="ch"><h3>${ic('video', 17)}공부 타임랩스</h3><span class="sub">186컷 · 10초 간격</span></div>
        ${ph('100%', '232px', '', `<span style="width:56px;height:56px;border-radius:50%;background:rgba(11,15,25,.75);display:grid;place-items:center;position:relative;z-index:2">${ic('play', 22, '#fff')}</span>`)}
        <div class="row" style="gap:10px;margin-top:10px">${ic('play', 13, HEX.navy)}<div class="slider"><i style="width:0%"></i></div><span class="xs num muted">0:00 / 0:31</span></div>
        <div class="row" style="gap:8px;margin-top:14px"><span class="btn sm grow">${ic('download', 14, '#fff')}다운로드 (.webm)</span><span class="btn sm g">${ic('trash', 14)}삭제</span></div>
        <div class="row xs muted" style="gap:6px;margin-top:12px;line-height:1.5">${ic('info', 14, HEX.muted)}<span>서버에 올리지 않고 이 브라우저에만 보관해요. 브라우저 데이터를 지우면 사라져요.</span></div>
      </div>
    </div>
  </div>`,
});

/* ================================================================== */
/* PC-09 기록·통계                                                      */
/* ================================================================== */
const records = () => shell({
  active: 'records', crumbs: ['기록·통계'], title: '기록·통계',
  right: `<div class="seg" style="width:200px"><span>일간</span><span class="on">주간</span><span>월간</span></div><div class="row" style="gap:6px"><span class="iconbtn" style="width:32px;height:32px">${ic('chevL', 15)}</span><div class="input" style="height:34px;font-size:13px">${ic('calendar', 14, HEX.muted)}2026.11.23 – 11.29</div><span class="iconbtn" style="width:32px;height:32px">${ic('chevR', 15)}</span></div>`,
  body: `
  <div class="row" style="gap:8px"${mk(1)}>${ic('filter', 15, HEX.muted)}<span class="sm muted w7">필터</span><span class="chip sm n">과목: 전체 ${ic('chevD', 12, '#fff')}</span><span class="chip sm">태그: 전체 ${ic('chevD', 12, HEX.muted)}</span><span class="chip sm">측정: 전체 ${ic('chevD', 12, HEX.muted)}</span><span class="chip sm">시험: 전체 ${ic('chevD', 12, HEX.muted)}</span><span class="btn t sm">초기화</span><span class="grow"></span><span class="xs muted">시간대: Asia/Seoul · 자정 기준 집계</span></div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px"${mk(2)}>
    ${kpi('이번 주 순공', 'timer', '18:42:10', '<span class="blue w7">▲ 1:12:05</span> 지난주 대비')}
    ${kpi('일 평균', 'chart', '2:40:18', '7일 중 6일 학습')}
    ${kpi('세션', 'list', '12회', '평균 1:33:30 · 계획 연결 9회')}
    ${kpi('자리 이탈', 'alert', '0:42:10', '세션당 평균 1.8회')}
  </div>
  <div style="display:grid;grid-template-columns:1fr 380px;gap:16px">
    <div class="card"${mk(3)}>
      <div class="ch"><h3>요일별 순공</h3><div class="row" style="gap:14px"><div class="legend">${[['var(--blue)', '알고리즘'], ['var(--navy)', '데이터베이스'], ['var(--blue2)', '영어'], ['var(--black)', '정보처리기사']].map(([c, t]) => `<span><i style="background:${c}"></i>${t}</span>`).join('')}</div><span class="xs muted">--- 일 목표 4:00</span></div></div>
      <div style="position:relative;height:178px">
        <i style="position:absolute;left:0;right:0;top:${178 - 24 - 148 * 0.95}px;border-top:1.5px dashed var(--muted2);display:block"></i>
        <div class="bars" style="height:100%">${[[30, 10, 15, 12], [35, 10, 25, 18], [15, 8, 10, 7], [20, 22, 10, 18], [25, 10, 12, 8], [28, 15, 20, 33], [8, 0, 12, 10]].map((v, i) => `<div><div class="stackbar" style="height:${v.reduce((a, b) => a + b, 0)}%;${i === 1 ? 'box-shadow:0 0 0 2px var(--black)' : ''}">${v.map((x, j) => `<i style="height:${x}%;background:${['var(--blue)', 'var(--navy)', 'var(--blue2)', 'var(--black)'][j]};flex:${x}"></i>`).join('')}</div><small>${'월화수목금토일'[i]} ${23 + i}</small></div>`).join('')}</div>
      </div>
    </div>
    <div class="card"${mk(4)}>
      <div class="ch"><h3>과목별 비율</h3><span class="sub">18:42:10</span></div>
      <div class="row" style="gap:18px"><div class="donut" style="width:132px;height:132px;position:relative;flex:none">${donutSvg(132, [[HEX.blue, 0.42], [HEX.blue2, 0.28], [HEX.navy, 0.18], [HEX.black, 0.12]])}<div style="position:absolute;left:0;top:0;width:132px;height:132px;display:flex;flex-direction:column;align-items:center;justify-content:center"><b class="num" style="font-size:16px">42%</b><span class="xs muted">알고리즘</span></div></div>
        <div class="col grow" style="gap:8px">${[['algo', '7:51', '42%'], ['eng', '5:14', '28%'], ['db', '3:22', '18%'], ['exam', '2:15', '12%']].map(([s, t, p]) => `<div class="row between">${subj(s)}<span class="sm num"><b>${t}</b> <span class="muted">${p}</span></span></div>`).join('')}</div></div>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:300px 1fr;gap:16px;flex:1;min-height:0">
    <div class="card"${mk(5)}>
      <div class="ch"><h3>11월 학습 잔디</h3><span class="sub">22일</span></div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;width:226px;margin:0 auto">${'월화수목금토일'.split('').map((d) => `<span class="xs muted2" style="text-align:center">${d}</span>`).join('')}${Array.from({ length: 42 }, (_, k) => { const day = k - 5; const lv = day < 1 || day > 30 ? -1 : day > 24 ? 0 : [3, 2, 0, 1, 3, 2, 4, 1, 2, 3, 0, 2, 4, 3, 1, 2, 3, 4, 2, 0, 1, 3, 4, 2][day - 1] ?? 1; return `<i style="aspect-ratio:1;border-radius:5px;display:block;background:${lv < 0 ? 'transparent' : ['var(--line2)', '#C7D9FF', '#8FB2F7', 'var(--blue)', 'var(--navy)'][lv]};${day === 24 ? 'box-shadow:0 0 0 2px var(--black)' : ''}"></i>`; }).join('')}</div>
      <div class="row xs muted" style="gap:5px;margin-top:10px;justify-content:flex-end">적음${['var(--line2)', '#C7D9FF', '#8FB2F7', 'var(--blue)', 'var(--navy)'].map((c) => `<i style="width:11px;height:11px;border-radius:3px;background:${c};display:block"></i>`).join('')}많음</div>
    </div>
    <div class="card" style="padding-bottom:10px"${mk(6)}>
      <div class="ch"><h3>세션 목록 <span class="sub">12건</span></h3><div class="row"><span class="chip sm">최신순 ${ic('chevD', 12, HEX.muted)}</span></div></div>
      ${table([{ t: '일시', w: '160px' }, { t: '과목 · 목표' }, { t: '측정', w: '56px' }, { t: '순공', w: '76px', r: 1 }, { t: '구간', w: '130px' }, { t: '보상', w: '56px', r: 1 }, { t: '', w: '16px' }], [
        ['<span class="md num">11.24 (화) 14:02</span>', `${subj('db')}<span class="md">정규화 개념 정리</span>`, '<span class="badge b-line">AI</span>', '<b class="num">0:58:40</b>', `<div style="width:120px">${segbar([['f', 19], ['p', 2], ['f', 15], ['a', 1], ['f', 14], ['a', 2], ['f', 11]], 8)}</div>`, '<b class="blue">+60P</b>', ic('chevR', 14, HEX.muted)],
        ['<span class="md num">11.24 (화) 09:02</span>', `${subj('algo')}<span class="md">백준 DP 3문제</span>`, '<span class="badge b-line">AI</span>', '<b class="num">1:24:36</b>', `<div style="width:120px">${segbar([['f', 32], ['p', 12], ['f', 28], ['a', 3], ['f', 20], ['u', 2], ['f', 6]], 8)}</div>`, '<b class="blue">+80P</b>', ic('chevR', 14, HEX.muted)],
        ['<span class="md num">11.24 (화) 07:31</span>', `${subj('eng')}<span class="md">토익 RC 파트5</span>`, '<span class="badge b-todo">수동</span>', '<b class="num">0:38:12</b>', `<div style="width:120px">${segbar([['f', 20], ['p', 2], ['f', 18]], 8)}</div>`, '<b class="blue">+50P</b>', ic('chevR', 14, HEX.muted)],
        ['<span class="md num">11.23 (월) 20:05</span>', `${subj('exam')}<span class="md">필기 기출</span>`, '<span class="badge b-line">AI</span>', '<b class="num">1:48:02</b>', `<div style="width:120px">${segbar([['f', 40], ['a', 4], ['f', 50]], 8)}</div>`, '<b class="blue">+90P</b>', ic('chevR', 14, HEX.muted)],
      ], { sel: 1 })}
      <div class="row" style="justify-content:center;gap:6px;margin-top:8px">${ic('chevL', 14, HEX.muted2)}${[1, 2, 3].map((n) => `<span style="width:26px;height:26px;border-radius:7px;display:grid;place-items:center;font-size:12px;${n === 1 ? 'background:var(--navy);color:#fff;font-weight:800' : 'color:var(--muted)'}">${n}</span>`).join('')}${ic('chevR', 14, HEX.muted)}</div>
    </div>
  </div>`,
});

/* ================================================================== */
/* PC-10 세션 상세                                                      */
/* ================================================================== */
const detail = () => {
  const T0 = 9, T1 = 10 + 50 / 60, W = 100;
  const pos = (h, m) => ((h + m / 60 - T0) / (T1 - T0)) * W;
  const segs = [[9, 2, 9, 34, 'f'], [9, 34, 9, 46, 'p'], [9, 46, 10, 14, 'f'], [10, 14, 10, 17, 'a'], [10, 17, 10, 37, 'f'], [10, 37, 10, 39, 'u'], [10, 39, 10, 41, 'a'], [10, 41, 10, 44, 'f']];
  return shell({
    active: 'records', crumbs: ['기록·통계', '세션 상세'], title: '세션 #2481',
    right: `<span class="btn g sm">${ic('chevL', 14)}목록</span><span class="iconbtn">${ic('more', 17, HEX.muted)}</span>`,
    body: `
    <div class="card" style="padding:18px 22px"${mk(1)}><div class="row" style="gap:18px">
      <div class="col grow" style="gap:6px"><div class="row" style="gap:8px">${subj('algo')}<span class="tag">#코테 #복습</span><span class="badge b-line">AI 카메라 감지</span></div><b style="font-size:20px;letter-spacing:-.4px">백준 DP 3문제</b><span class="md muted num">2026.11.24 (화) 09:02 – 10:44 · Asia/Seoul</span></div>
      ${[['순공', '1:24:36', 'var(--blue)', ''], ['일시정지', '0:12:04', 'var(--sky)', '1회'], ['자리 이탈', '0:05:30', 'var(--black)', '2회'], ['판정 불가', '0:01:40', 'hatch', '1회']].map(([a, b, c, n]) => `<div class="col" style="gap:4px;padding:0 18px;border-left:1px solid var(--line2);min-width:128px"><span class="row sm muted w7" style="gap:6px"><i class="${c === 'hatch' ? 'hatch' : ''}" style="width:11px;height:11px;border-radius:3px;display:block;${c === 'hatch' ? 'border:1px solid var(--blue2)' : `background:${c}`}"></i>${a}</span><b class="num" style="font-size:22px;${a === '순공' ? 'color:var(--navy)' : ''}">${b}</b><span class="xs muted">${n || '합계 기준'}</span></div>`).join('')}
    </div></div>
    <div class="card"${mk(2)}>
      <div class="ch"><h3>구간 타임라인</h3>${legend()}</div>
      <div style="position:relative;height:86px">
        <div style="position:absolute;left:0;right:0;top:20px;height:30px;border-radius:8px;background:var(--line2)"></div>
        ${segs.map(([h0, m0, h1, m1, k]) => `<i class="${k === 'u' ? 'hatch' : ''}" style="position:absolute;top:20px;height:30px;left:${pos(h0, m0)}%;width:${pos(h1, m1) - pos(h0, m0)}%;display:block;${k === 'u' ? 'border:1px solid var(--blue2)' : `background:${{ f: 'var(--blue)', p: 'var(--sky)', a: 'var(--black)' }[k]}`};border-right:2px solid #fff"></i>`).join('')}
        ${[[9, 34, '일시정지 12:04'], [10, 14, '이탈 3:12'], [10, 37, '판정 불가 1:40']].map(([h, m, t]) => `<span class="xs w7" style="position:absolute;top:0;left:${pos(h, m)}%;white-space:nowrap;color:var(--navy)">▾ ${t}</span>`).join('')}
        ${[[9, 0], [9, 15], [9, 30], [9, 45], [10, 0], [10, 15], [10, 30], [10, 45]].map(([h, m]) => `<span class="xs muted2 num" style="position:absolute;top:58px;left:${pos(h, m)}%">${h}:${String(m).padStart(2, '0')}</span>`).join('')}
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 400px;gap:16px;flex:1;min-height:0">
      <div class="card"${mk(3)}>
        <div class="ch"><h3>이벤트 로그</h3><span class="sub">서버가 순서·중복을 확인해 확정한 구간</span></div>
        ${table([{ t: '시각', w: '70px' }, { t: '이벤트', w: '150px' }, { t: '원인' }, { t: '구간 길이', w: '90px', r: 1 }], [
          ['<span class="num md">09:02</span>', '<span class="row md"><span class="dot d-f"></span>집중 시작</span>', '<span class="md muted">계획에서 시작 · AI 모드</span>', '<span class="num">32:10</span>'],
          ['<span class="num md">09:34</span>', '<span class="row md"><span class="dot d-p"></span>일시정지</span>', '<span class="md muted">사용자 조작</span>', '<span class="num">12:04</span>'],
          ['<span class="num md">09:46</span>', '<span class="row md"><span class="dot d-f"></span>집중 재개</span>', '<span class="md muted">사용자 조작</span>', '<span class="num">28:00</span>'],
          ['<span class="num md">10:14</span>', '<span class="row md"><span class="dot d-a"></span>자리 이탈</span>', '<span class="md muted">AI · 얼굴 미검출 30초 초과</span>', '<span class="num">3:12</span>'],
          ['<span class="num md">10:37</span>', '<span class="row md"><i class="hatch" style="width:8px;height:8px;border-radius:50%;display:block;border:1px solid var(--blue2)"></i>판정 불가</span>', '<span class="md muted">저조도 · 수동 전환 안내 표시</span>', '<span class="num">1:40</span>'],
          ['<span class="num md">10:44</span>', '<span class="row md"><span class="dot" style="border:2px solid var(--black)"></span>세션 종료</span>', '<span class="md muted">종료 확정 · 보상 지급</span>', '<span class="muted">–</span>'],
        ])}
      </div>
      <div class="col" style="gap:14px">
        <div class="card"${mk(4)}><div class="ch" style="margin-bottom:10px"><h3>연결된 계획</h3><span class="link">플래너 ${ic('chevR', 12, HEX.blue)}</span></div>
          <div class="row sm"><span class="muted" style="width:34px">계획</span><div class="bar grow" style="height:7px"><i style="width:100%;background:var(--line)"></i></div><span class="num" style="width:96px;text-align:right">09:00–10:30</span></div>
          <div class="row sm" style="margin-top:6px"><span class="muted" style="width:34px">실제</span><div class="bar grow" style="height:7px"><i style="width:94%"></i></div><span class="num w7" style="width:96px;text-align:right">1:24:36 · 94%</span></div></div>
        <div class="card"${mk(5)}><div class="row between"><div class="col"><span class="sm muted">세션 보상</span><b class="blue" style="font-size:20px">+80P 지급됨</b></div><span class="xs muted" style="text-align:right">지급 키: session-2481<br>중복 지급 없음</span></div></div>
        <div class="card" style="flex:1"${mk(6)}><div class="ch" style="margin-bottom:10px"><h3>타임랩스</h3><span class="badge b-todo">이 기기에만 저장</span></div>
          <div class="row" style="gap:12px">${ph('132px', '76px', '', `<span style="position:relative;z-index:2">${ic('play', 18, HEX.navy)}</span>`)}<div class="col" style="gap:6px"><span class="md">0:24 · 142컷</span><div class="row" style="gap:6px"><span class="btn sm g">${ic('download', 13)}저장</span><span class="btn sm g">${ic('trash', 13)}삭제</span></div></div></div></div>
      </div>
    </div>`,
  });
};

/* ================================================================== */
/* PC-11 스터디방 목록                                                  */
/* ================================================================== */
const roomCard = (n, code, members, live, me = false) => `<div class="card" style="padding:16px 18px">
  <div class="row between"><b class="lg" style="letter-spacing:-.3px">${n}</b>${ic('moreV', 16, HEX.muted)}</div>
  <div class="row xs muted" style="gap:6px;margin-top:4px">${ic('copy', 12, HEX.muted)}코드 ${code} · 최대 4명${me ? ' · 방장' : ''}</div>
  <div class="row" style="margin-top:16px;gap:10px"><span class="stack">${members.map(([t, st]) => avatar(t, st)).join('')}</span><span class="row sm" style="gap:5px;margin-left:12px"><span class="dot d-f"></span><b>${live}명</b> 집중 중</span></div>
  <div class="divider" style="margin:14px 0 12px"></div>
  <div class="row between"><span class="xs muted">오늘 방 합계 순공 ${me ? '6:12:40' : '2:05:11'}</span><span class="btn sm">입장</span></div>
</div>`;
const roomsList = () => shell({
  active: 'rooms', crumbs: ['스터디방'], title: '스터디방',
  right: `<span class="btn">${ic('plus', 15, '#fff')}방 만들기</span>`,
  body: `<div style="display:grid;grid-template-columns:minmax(0,1fr) 380px;gap:18px;flex:1;min-height:0">
    <div class="col" style="gap:18px">
      <div class="card" style="padding:20px 22px"${mk(1)}>
        <div class="row" style="gap:20px">
          <div class="col" style="flex:1;min-width:0"><b class="lg">초대 코드로 참여</b><span class="sm muted" style="margin-top:4px;line-height:1.5">방장이 공유한 6자리 코드를 입력하면<br>멤버십 확인 후 입장해요</span></div>
          <div class="row" style="gap:7px">${['A', '7', 'K', '2', 'Q', ''].map((c, i) => `<div style="width:46px;height:54px;border-radius:12px;display:grid;place-items:center;font-size:24px;font-weight:800;border:${c ? '1.5px solid var(--navy)' : '2px solid var(--blue)'};background:#fff">${c}</div>`).join('')}</div>
          <span class="btn lg">입장하기</span>
        </div>
        <div class="row xs muted" style="gap:6px;margin-top:12px">${ic('info', 13, HEX.muted)}코드를 모르면 방장에게 링크(learningmate.app/rooms/코드)를 받아도 돼요</div>
      </div>
      <div class="ch" style="margin:4px 0 -4px"><h3>내 스터디방 <span class="sub">2개</span></h3><div class="seg" style="width:140px"><span class="on">${ic('grid', 14)}</span><span>${ic('list', 14, HEX.muted)}</span></div></div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px"${mk(2)}>
        ${roomCard('SSAFY 알고리즘 스터디', 'A7K2Q9', [['나', 'o'], ['민', 'f'], ['지', 'p'], ['도', 'f']], 2, true)}
        ${roomCard('정처기 막판 스퍼트', 'P3X8LM', [['하', 'f'], ['준', 'o'], ['유', 'o']], 1)}
        <div style="border:1.5px dashed var(--line);border-radius:14px;display:grid;place-items:center;min-height:200px"><div class="col" style="align-items:center;gap:8px">${ic('plus', 26, HEX.blue2)}<b class="md muted">새 방 만들기</b><span class="xs muted2">소규모(최대 4명) 캠스터디</span></div></div>
      </div>
      <div class="card tint" style="padding:14px 18px"${mk(3)}><div class="row" style="gap:12px">${ic('info', 17, HEX.navy)}<span class="md">방에서 측정한 시간은 <b>개인 세션</b>으로 저장돼요. 방을 나가도 기록·통계에서 확인할 수 있어요.</span></div></div>
    </div>
    <div class="card" style="padding:20px 22px"${mk(4)}>
      <div class="ch"><h3>새 스터디방 만들기</h3></div>
      <div class="col" style="gap:14px">
        ${field('방 이름', '<div class="input focus">SSAFY 알고리즘 스터디</div>', '2–20자')}
        ${field('최대 인원', select('4명 (권장)'), '데모 기준: WebRTC 연결 안정성 확인 후 확정')}
        <div class="field"><span class="lbl">입장 시 기본 설정</span>
          <div class="row between md" style="padding:10px 12px;border:1px solid var(--line2);border-radius:10px"><span>카메라 공유 기본값</span><span class="row sm muted">꺼짐 <span class="toggle"></span></span></div>
          <div class="row between md" style="padding:10px 12px;border:1px solid var(--line2);border-radius:10px"><span>멤버 상태 공개</span><span class="row sm muted">집중·휴식만 <span class="toggle on"></span></span></div>
        </div>
        <div class="card tint" style="padding:12px 14px"><div class="row between"><div class="col"><span class="xs muted">생성 후 초대 코드</span><b class="num" style="font-size:20px;letter-spacing:3px">A7K2Q9</b></div><span class="btn sm g">${ic('copy', 13)}복사</span></div></div>
        <span class="btn full lg">만들고 입장하기</span>
      </div>
    </div>
  </div>`,
});

/* ================================================================== */
/* PC-12 스터디방 (캠스터디)                                            */
/* ================================================================== */
const tile = ({ name, st, time, cam, me, off, conn, empty }) => empty
  ? `<div style="border-radius:14px;border:1.5px dashed var(--line);display:grid;place-items:center;background:#fff"><div class="col" style="align-items:center;gap:6px">${ic('plus', 22, HEX.blue2)}<span class="sm muted">초대 대기 중</span><span class="xs muted2">코드 A7K2Q9</span></div></div>`
  : `<div style="position:relative;border-radius:14px;overflow:hidden;${off ? 'opacity:.5;' : ''}${me ? 'border:3px solid var(--blue)' : ''}">
    ${cam ? `<div class="ph dark" style="position:absolute;inset:0;border-radius:0"><div class="face" style="width:22%"></div></div>`
      : conn ? `<div style="position:absolute;inset:0;background:#141B2D;display:grid;place-items:center"><div class="col" style="align-items:center;gap:8px;color:#AEB9D3">${ic('refresh', 22, '#6E9BF5')}<span class="sm">영상 연결 중…</span><span class="xs" style="color:#5F6B85">실패해도 상태는 계속 표시돼요</span></div></div>`
      : `<div style="position:absolute;inset:0;background:var(--tint);border:1px solid var(--line);border-radius:14px;display:grid;place-items:center">${avatar(name[0], '', 'lg')}</div>`}
    <div style="position:absolute;left:10px;bottom:10px;right:10px;background:#fff;border-radius:10px;padding:7px 11px" class="row"><span class="dot d-${st}"></span><b class="md">${name}</b><span class="xs muted grow" style="text-align:right">${time}</span></div>
    ${cam ? `<span class="chip sm k" style="position:absolute;right:10px;top:10px">${ic('video', 12, '#fff')}캠 공유</span>` : ''}
  </div>`;
const room = () => shell({
  active: 'rooms', crumbs: ['스터디방', 'SSAFY 알고리즘 스터디'], title: 'SSAFY 알고리즘 스터디',
  right: `<span class="row sm muted" style="gap:6px"${mk(1)}>${ic('wifi', 15, HEX.blue)}실시간 연결됨</span><span class="chip sm">${ic('copy', 12, HEX.muted)}코드 A7K2Q9</span><span class="btn g sm">${ic('user', 14)}초대</span><span class="btn k sm">${ic('logout', 14, '#fff')}나가기</span>`,
  body: `<div style="display:grid;grid-template-columns:1fr 360px;gap:18px;flex:1;min-height:0">
    <div style="display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:1fr 1fr;gap:12px"${mk(2)}>
      ${tile({ name: '나', st: 'f', time: '집중 00:52:18', cam: true, me: true })}
      ${tile({ name: '민수', st: 'f', time: '집중 02:05:11', cam: true })}
      ${tile({ name: '하늘', st: 'f', time: '집중 00:12:40', conn: true })}
      ${tile({ name: '지현', st: 'p', time: '휴식 · 05:12' })}
      ${tile({ name: '도윤', st: 'o', time: '오프라인 · 3분 전', off: true })}
      ${tile({ empty: true })}
    </div>
    <div class="col" style="gap:14px">
      <div class="card"${mk(3)}>
        <div class="row between">${subj('algo')}<span class="pill sm st-focus"><i></i>재실</span></div>
        <div class="timer" style="font-size:44px;margin-top:12px">00:52:18</div>
        <div class="xs muted" style="margin-top:6px">개인 세션 #2483 · 방에서 측정 중</div>
        <div class="row" style="gap:8px;margin-top:14px"><span class="btn o sm grow">${ic('pause', 12, HEX.blue)}일시정지</span><span class="btn k sm grow">${ic('stop', 11, '#fff')}종료</span></div>
      </div>
      <div class="card" style="padding:6px 18px"${mk(4)}>
        ${[['video', '내 카메라 공유', '방 참여자에게만 · 끄면 즉시 중단', true], ['camera', 'AI 재실 감지', '공유와 별개 · 기기 안에서만 분석', true]].map(([i, t, d, on], k) => `<div class="row" style="gap:12px;padding:12px 0;${k ? 'border-top:1px solid var(--line2)' : ''}">${ic(i, 18, HEX.navy)}<div class="col grow"><b class="md">${t}</b><span class="xs muted">${d}</span></div><span class="toggle ${on ? 'on' : ''}"></span></div>`).join('')}
      </div>
      <div class="card" style="padding:14px 18px"${mk(5)}>
        <div class="ch" style="margin-bottom:8px"><h3>멤버 <span class="sub">5 / 6</span></h3><span class="xs muted">오늘 순공</span></div>
        ${[['나', 'f', '집중', '0:52'], ['민수', 'f', '집중', '2:05'], ['하늘', 'f', '집중', '0:12'], ['지현', 'p', '휴식', '1:40'], ['도윤', 'o', '오프라인', '0:48']].map(([n, s, t, v]) => `<div class="row" style="gap:10px;height:34px">${avatar(n[0], s)}<b class="md grow">${n}</b><span class="xs muted" style="width:52px">${t}</span><span class="sm num w7" style="width:36px;text-align:right">${v}</span></div>`).join('')}
      </div>
      <div class="card" style="padding:14px 18px;flex:1"${mk(6)}>
        <div class="ch" style="margin-bottom:8px"><h3>방 활동</h3></div>
        ${[['14:31', '하늘님이 입장했어요'], ['14:20', '지현님이 휴식을 시작했어요'], ['14:02', '도윤님 연결이 끊겼어요 → 오프라인']].map(([t, e]) => `<div class="row xs" style="gap:10px;height:24px"><span class="num muted2" style="width:32px">${t}</span><span class="muted">${e}</span></div>`).join('')}
      </div>
    </div>
  </div>`,
});

/* ================================================================== */
/* PC-13 보상·수집                                                      */
/* ================================================================== */
const rewards = () => shell({
  active: 'rewards', crumbs: ['보상·수집'], title: '보상·수집',
  right: topIcons(false),
  body: `
  <div style="display:grid;grid-template-columns:1.3fr 1fr 1fr 1fr;gap:16px">
    <div class="card navy"${mk(1)}><div class="sm" style="color:var(--sky)">보유 포인트</div><div style="font-size:34px;font-weight:800;margin-top:6px;letter-spacing:-1px">1,380 P</div><div class="sm" style="color:var(--sky);margin-top:6px">이번 주 +300P · 지급 세션 18회</div></div>
    ${kpi('이번 주 획득', 'gift', '+300P', '세션 5회')}
    ${kpi('수집', 'trophy', '3 / 12', '다음: 야행성 (22시 이후 3회)')}
    ${kpi('미지급 세션', 'info', '1회', '최소 집중 25분 미달')}
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;flex:1;min-height:0">
    <div class="col" style="gap:16px">
      <div class="card"${mk(2)}>
        <div class="ch"><h3>지급 규칙</h3><span class="badge b-todo">예시 값 · 팀 결정 필요</span></div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">${[['check', '정상 종료', '사용자가 종료 버튼으로 끝낸 세션'], ['timer', '최소 25분', '순공(재실·수동 집중) 기준'], ['shield', '세션당 1회', '세션 ID로 중복 지급 방지']].map(([i, t, d]) => `<div style="border:1px solid var(--line2);border-radius:12px;padding:12px"><span style="width:32px;height:32px;border-radius:9px;background:var(--tint);display:grid;place-items:center">${ic(i, 16, HEX.blue)}</span><b class="md" style="display:block;margin-top:10px">${t}</b><span class="xs muted" style="line-height:1.5">${d}</span></div>`).join('')}</div>
      </div>
      <div class="card"${mk(3)}>
        <div class="ch"><h3>수집 <span class="sub">3 / 12</span></h3><span class="link">전체 보기 ${ic('chevR', 12, HEX.blue)}</span></div>
        <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:10px">${['새싹', '첫 집중', '7일 연속', '야행성', '아침형', '100시간', '스터디원', '완벽한 주', '시험 전날', '몰입 2h', 'D-Day', '마스터'].map((t, i) => `<div class="col" style="align-items:center;gap:6px">${i < 3 ? ph('100%', '64px', '', '', '') : `<div style="width:100%;height:64px;border-radius:10px;border:1.5px dashed var(--line);display:grid;place-items:center">${ic('lock', 16, '#B5C1D8')}</div>`}<span class="xs ${i < 3 ? 'w7' : 'muted2'}">${t}</span></div>`).join('')}</div>
      </div>
      <div class="card tint" style="padding:14px 18px"><div class="row" style="gap:12px;align-items:flex-start">${ic('info', 17, HEX.navy)}<div class="col"><b class="md">포인트 사용처는 후속 범위로 제안</b><span class="sm muted" style="line-height:1.5;margin-top:2px">1차 MVP는 지급·잔액·내역·수집 표시까지. 교환·상점은 범위 밖.</span></div></div></div>
    </div>
    <div class="card"${mk(4)}>
      <div class="ch"><h3>지급 내역</h3><div class="row"><span class="chip sm">전체 ${ic('chevD', 12, HEX.muted)}</span></div></div>
      ${table([{ t: '일시', w: '110px' }, { t: '세션' }, { t: '순공', w: '70px', r: 1 }, { t: '결과', w: '128px', r: 1 }], [
        ['<span class="md num">11.24 15:06</span>', `${subj('db')}<span class="md">정규화 정리</span>`, '<span class="num">0:58:40</span>', '<b class="blue">+60P</b>'],
        ['<span class="md num">11.24 10:44</span>', `${subj('algo')}<span class="md">백준 DP</span>`, '<span class="num">1:24:36</span>', '<b class="blue">+80P</b>'],
        ['<span class="md num">11.24 08:12</span>', `${subj('eng')}<span class="md">토익 RC</span>`, '<span class="num">0:38:12</span>', '<b class="blue">+50P</b>'],
        ['<span class="md num">11.23 22:40</span>', `${subj('eng')}<span class="md">단어 복습</span>`, '<span class="num">0:18:20</span>', '<span class="xs muted">미지급 · 25분 미달</span>'],
        ['<span class="md num">11.23 21:53</span>', `${subj('exam')}<span class="md">필기 기출</span>`, '<span class="num">1:48:02</span>', '<b class="blue">+90P</b>'],
        ['<span class="md num">11.23 15:10</span>', `${subj('algo')}<span class="md">백준 그래프</span>`, '<span class="num">1:52:30</span>', '<b class="blue">+90P</b>'],
        ['<span class="md num">11.22 20:00</span>', `${subj('db')}<span class="md">SQL 기본</span>`, '<span class="num">0:44:10</span>', '<b class="blue">+60P</b>'],
      ])}
    </div>
  </div>`,
});

/* ================================================================== */
/* PC-14 설정                                                           */
/* ================================================================== */
const settings = () => shell({
  active: 'settings', crumbs: ['설정'], title: '설정',
  right: '',
  body: `
  <div class="row" style="gap:4px;border-bottom:1px solid var(--line);margin:-6px 0 0">${['학습 설정', '계정', '알림'].map((t, i) => `<span style="height:40px;padding:0 16px;display:flex;align-items:center;font-size:14px;${i === 0 ? 'font-weight:800;border-bottom:2.5px solid var(--navy)' : 'color:var(--muted)'}">${t}</span>`).join('')}</div>
  <div style="display:grid;grid-template-columns:1fr 440px;gap:18px;flex:1;min-height:0">
    <div class="col" style="gap:16px">
      <div class="card"${mk(1)}>
        <div class="ch"><h3>과목 <span class="sub">4개</span></h3><span class="btn sm">${ic('plus', 13, '#fff')}과목 추가</span></div>
        ${table([{ t: '과목' }, { t: '색', w: '90px' }, { t: '세션', w: '70px', r: 1 }, { t: '누적 순공', w: '100px', r: 1 }, { t: '', w: '70px', r: 1 }], [
          [subj('algo'), '<span class="row xs"><i style="width:14px;height:14px;border-radius:4px;background:var(--blue);display:block"></i>Blue</span>', '<span class="num">24</span>', '<b class="num">38:12:40</b>', `${ic('edit', 15, HEX.muted)}${ic('trash', 15, HEX.muted)}`],
          [subj('eng'), '<span class="row xs"><i style="width:14px;height:14px;border-radius:4px;background:var(--blue2);display:block"></i>Light</span>', '<span class="num">19</span>', '<b class="num">21:40:05</b>', `${ic('edit', 15, HEX.muted)}${ic('trash', 15, HEX.muted)}`],
          [subj('db'), '<span class="row xs"><i style="width:14px;height:14px;border-radius:4px;background:var(--navy);display:block"></i>Navy</span>', '<span class="num">8</span>', '<b class="num">9:02:11</b>', `${ic('edit', 15, HEX.muted)}${ic('trash', 15, HEX.muted)}`],
          [subj('exam'), '<span class="row xs"><i style="width:14px;height:14px;border-radius:4px;background:var(--black);display:block"></i>Black</span>', '<span class="num">11</span>', '<b class="num">17:30:48</b>', `${ic('edit', 15, HEX.muted)}${ic('trash', 15, HEX.muted)}`],
        ])}
        <div class="row xs muted" style="gap:6px;margin-top:10px">${ic('info', 13, HEX.muted)}과목을 삭제해도 지난 기록에는 과목 이름이 그대로 남아요 (보관 처리)</div>
      </div>
      <div class="card"${mk(2)}>
        <div class="ch"><h3>태그 <span class="sub">6개</span></h3><span class="btn sm g">${ic('plus', 13)}태그 추가</span></div>
        <div class="row wrap" style="gap:8px">${['#코테 12', '#복습 9', '#정처기 15', '#토익 10', '#기출 6', '#오답 3'].map((t) => `<span class="chip s">${t} ${ic('x', 12, HEX.navy, 2.5)}</span>`).join('')}</div>
      </div>
    </div>
    <div class="col" style="gap:16px">
      <div class="card"${mk(3)}>
        <div class="ch"><h3>시험 D-Day</h3><span class="btn sm g">${ic('plus', 13)}시험 추가</span></div>
        ${[['D-12', '정보처리기사 필기', '2026.12.06 (토)', true], ['D-40', '토익 정기시험', '2027.01.03 (토)'], ['D+3', 'SSAFY 월말평가', '2026.11.21 (금)']].map(([d, n, dt, main], i) => `<div class="row" style="gap:12px;padding:11px 0;${i ? 'border-top:1px solid var(--line2)' : ''}"><span class="chip sm ${main ? 'n' : i === 2 ? '' : 's'}" style="width:54px;justify-content:center">${d}</span><div class="col grow"><b class="md">${n}</b><span class="xs muted num">${dt}</span></div>${ic('edit', 15, HEX.muted)}${ic('trash', 15, HEX.muted)}</div>`).join('')}
        <div class="row xs muted" style="gap:6px;margin-top:6px">${ic('info', 13, HEX.muted)}사용자 시간대 기준: 전날 D-1 · 당일 D-Day · 다음 날 D+1</div>
      </div>
      <div class="card" style="flex:1"${mk(4)}>
        <div class="ch"><h3>시간·집계</h3></div>
        <div class="col" style="gap:14px">
          ${field('시간대', select('Asia/Seoul (UTC+9)'), '일간 통계는 이 시간대의 자정을 기준으로 나눠요')}
          ${field('하루 목표 순공', select('4시간'))}
          ${field('자리 이탈 판정 시간', select('30초 (기본)'), '팀 합의 후 확정 — 짧을수록 오탐이 늘어요')}
        </div>
      </div>
    </div>
  </div>`,
});

/* ================================================================== */
/* Registry                                                            */
/* ================================================================== */
export const PC = [
  { id: 'PC01', file: 'PC01_로그인', title: '로그인', route: '/login', feats: ['공통 기반', 'M01'], url: '/login', body: login, notes: [
    { t: '이메일 로그인', d: '계정 진입 방식은 팀 확정 전 — 이메일·비밀번호를 기본안으로 둬요.', f: '공통' },
    { t: '테스트 계정 A·B', d: '데모·그룹 시연용 빠른 로그인. 두 브라우저(또는 PC+폰)에서 각각 로그인해 캠스터디를 검증해요.', f: '공통 M08' },
    { t: '진행 중 세션 안내', d: '종료되지 않은 세션이 있으면 로그인 직후 집중 화면으로 복구해요.', f: 'M01' },
    { t: 'HTTPS 안내', d: '카메라(getUserMedia)는 보안 컨텍스트에서만 동작 — 데모 주소는 HTTPS로 배포해요.', f: 'M05' },
  ] },
  { id: 'PC02', file: 'PC02_대시보드', title: '대시보드', route: '/', feats: ['M01', 'M02', 'M06', 'M07', 'M08'], url: '/', body: dashboard, notes: [
    { t: '오늘·이번 주 요약', d: '오늘 순공(목표 대비), 주간 합계, 계획 달성률, 연속 학습일.', f: 'M02 M06' },
    { t: '오늘의 계획', d: '완료 계획은 실제 집중 시간과 함께, 남은 계획은 ▶ 시작으로 학습 시작 설정에 바로 연결.', f: 'M06 M01' },
    { t: '지금 할 계획 강조', d: '현재 시각에 해당하는 계획을 강조하고 기본 버튼을 채워요.', f: 'M06' },
    { t: '시험 D-Day', d: '시험 이름·날짜·관련 계획 수. 사용자 시간대 기준으로 D-n 계산.', f: 'M07' },
    { t: '최근 세션', d: '측정 방식·이탈 횟수·보상까지 한 줄로. 클릭 시 세션 상세.', f: 'M02 M12' },
    { t: '스터디방 바로가기', d: '참여 중인 방의 실시간 집중 인원과 입장 버튼.', f: 'M08' },
    { t: '바로 집중 시작', d: '계획 없이 시작하는 전역 버튼 — 학습 시작 설정으로 이동.', f: 'M01' },
  ] },
  { id: 'PC03', file: 'PC03_플래너', title: '플래너 (주간)', route: '/planner?view=week', feats: ['M06', 'M07', 'M03'], url: '/planner?view=week&date=2026-11-24', body: planner, notes: [
    { t: '주간 시간표', d: '일·주·월 전환. 계획 블록은 과목 색, 완료 블록은 흐리게 + 체크.', f: 'M06 M03' },
    { t: '선택한 계획', d: '블록을 누르면 오른쪽 패널에 상세 표시. 선택 블록 하단에 실제 순공을 함께 표기.', f: 'M06' },
    { t: '현재 시각선', d: '오늘 열에 현재 시각을 표시해 지금 할 계획을 찾기 쉽게.', f: 'M06' },
    { t: '계획 상세 · 계획 대비 실제', d: '연결된 세션의 실제 시간과 달성률. 다시 시작·수정·삭제.', f: 'M06 M01' },
    { t: '시험 D-Day', d: '플래너에서 남은 날짜를 바로 확인하고 추가.', f: 'M07' },
    { t: '이번 주 달성', d: '주간 계획 완료 수와 과목별 달성.', f: 'M06 M03' },
  ] },
  { id: 'PC04', file: 'PC04_계획추가모달', title: '계획 추가 모달', route: '/planner · modal', feats: ['M06', 'M03', 'M07'], url: '/planner?view=week&new=1', body: planModal, notes: [
    { t: '공부 계획 / 시험 D-Day 탭', d: '한 모달에서 계획 또는 시험(이름·날짜)을 등록.', f: 'M06 M07' },
    { t: '과목 선택 (필수)', d: '드롭다운에서 선택하거나 바로 새 과목 생성. 과목은 1개만.', f: 'M03' },
    { t: '시간 겹침 검증', d: '같은 날 다른 계획과 겹치면 경고하고 저장을 막아요.', f: 'M06' },
    { t: '시험 연결 (선택)', d: '계획을 시험에 연결하면 D-Day 카드의 관련 계획 수에 반영.', f: 'M07' },
    { t: '저장', d: '필수값·검증 통과 전까지 비활성. 저장 후 계속 추가 옵션.', f: 'M06' },
  ] },
  { id: 'PC05', file: 'PC05_학습시작설정', title: '학습 시작 설정', route: '/focus/new', feats: ['M01', 'M03', 'M05', 'M10', 'M11'], url: '/focus/new?plan=318', body: setup, notes: [
    { t: '세션 정보', d: '계획에서 오면 계획·과목·목표가 자동 입력. 계획 없이도 시작 가능.', f: 'M06 M03' },
    { t: '측정 방식', d: 'AI 카메라 감지(권장) / 수동. AI를 고를 때만 카메라 권한을 요청해요.', f: 'M05' },
    { t: '집중 보조', d: '배경음과 타임랩스는 각각 따로 켜고 끔. 배경음은 사용자 클릭 후 재생(자동재생 제한).', f: 'M10 M11' },
    { t: '카메라 확인', d: '장치 선택, 미리보기, 얼굴 인식 박스.', f: 'M05' },
    { t: '사전 점검', d: '권한·얼굴 위치·조명을 미리 알려 판정 불가를 줄여요.', f: 'M05' },
    { t: '프라이버시 안내', d: '프레임은 브라우저 안에서만 처리하고 저장·전송하지 않아요.', f: 'M05' },
    { t: '집중 시작', d: '세션 ID 생성 + 시작 이벤트 저장 후 집중 화면으로.', f: 'M01' },
  ] },
  { id: 'PC06', file: 'PC06_집중세션', title: '집중 세션', route: '/focus/:sessionId', feats: ['M01', 'M05', 'M09', 'M10', 'M11'], url: '/focus/2482', body: focusPage, notes: [
    { t: '집중 모드 헤더', d: '사이드 메뉴를 잠그고 이동 시 확인. 수동 전환·세션 종료는 항상 노출.', f: 'M09 M05' },
    { t: '현재 판정', d: '재실 · 자리 이탈 · 판정 불가 · 수동 · 일시정지 배지.', f: 'M05' },
    { t: '순공 타이머', d: '재실·수동 집중 구간만 합산. 새로고침해도 진행 중 세션 복구.', f: 'M01' },
    { t: '컨트롤 + 단축키', d: 'Space 일시정지/재개, Esc 종료 확인.', f: 'M01' },
    { t: '구간 타임라인', d: '계획 시간대 위에 구간을 색으로 쌓아 보여줘요.', f: 'M02' },
    { t: '카메라 패널', d: '얼굴 박스와 판정 근거, AI 감지·카메라 토글, 타임랩스 캡처 수.', f: 'M05 M11' },
    { t: '배경음', d: '트랙 선택·재생·볼륨. 바꾸면 이전 소리 정지, 종료·이탈 시 정지.', f: 'M10' },
    { t: '이벤트 로그', d: '상태 전환 시각과 원인을 실시간으로 쌓아요 (서버 저장 대상).', f: 'M01 M05' },
  ] },
  { id: 'PC08', file: 'PC08_세션결과', title: '세션 결과', route: '/focus/:sessionId/result', feats: ['M01', 'M02', 'M06', 'M11', 'M12'], url: '/focus/2482/result', body: result, notes: [
    { t: '확정된 순공', d: '서버가 이벤트 순서·중복을 확인해 확정한 시간과 상태별 합계.', f: 'M01' },
    { t: '구간 요약', d: '집중·일시정지·이탈·판정 불가를 한 줄로.', f: 'M02 M05' },
    { t: '저장 상태', d: '저장 실패 시 같은 세션 ID로 재시도 — 종료 기록은 한 건만.', f: 'M01' },
    { t: '계획 대비', d: '계획 완료 처리 + 달성률, 다음 계획 이어서 시작.', f: 'M06' },
    { t: '세션 보상', d: '조건 충족 시 1회 지급, 지급 조건을 체크리스트로.', f: 'M12' },
    { t: '타임랩스', d: '켠 세션만 생성. 재생·다운로드·삭제, 이 브라우저에만 보관.', f: 'M11' },
  ] },
  { id: 'PC09', file: 'PC09_기록통계', title: '기록·통계', route: '/records', feats: ['M02', 'M03'], url: '/records?range=week&from=2026-11-23', body: records, notes: [
    { t: '필터', d: '과목·태그·측정 방식·시험별 조회. 사용자 시간대 자정 기준 집계.', f: 'M03 M02' },
    { t: '기간 요약', d: '순공·일 평균·세션 수·자리 이탈 합계.', f: 'M02' },
    { t: '요일별 순공 (과목 누적)', d: '목표선과 함께, 오늘 막대 강조.', f: 'M02 M03' },
    { t: '과목별 비율', d: '도넛 + 과목별 시간·비율.', f: 'M03' },
    { t: '월간 잔디', d: '날짜별 순공 강도. 날짜를 누르면 일간 보기로.', f: 'M02' },
    { t: '세션 목록', d: '구간 미니 바·보상까지. 행을 누르면 세션 상세. 같은 조건의 합계와 상세 합계가 일치해야 해요.', f: 'M02' },
  ] },
  { id: 'PC10', file: 'PC10_세션상세', title: '세션 상세', route: '/records/:sessionId', feats: ['M02', 'M05', 'M06', 'M11', 'M12'], url: '/records/2481', body: detail, notes: [
    { t: '세션 요약', d: '과목·목표·태그·측정 방식과 상태별 합계.', f: 'M02 M03' },
    { t: '구간 타임라인 (간트)', d: '시간 축 위에 구간과 주요 이벤트 라벨.', f: 'M02 M05' },
    { t: '이벤트 로그', d: '서버가 확정한 상태 이벤트(시각·원인·길이). 본인 기록만 조회.', f: 'M02 M05' },
    { t: '연결된 계획', d: '계획 vs 실제 비교.', f: 'M06' },
    { t: '보상 결과', d: '세션 ID 기준 1회 지급 결과.', f: 'M12' },
    { t: '타임랩스', d: '이 기기에 있으면 재생·저장·삭제, 없으면 \'다른 기기에서 생성\' 표시.', f: 'M11' },
  ] },
  { id: 'PC11', file: 'PC11_스터디방목록', title: '스터디방 목록', route: '/rooms', feats: ['M08'], url: '/rooms', body: roomsList, notes: [
    { t: '초대 코드로 참여', d: '6자리 코드 → 멤버십 확인 후 입장. 링크로도 진입 가능.', f: 'M08' },
    { t: '내 스터디방', d: '방별 멤버 상태·집중 인원·오늘 합계. 소규모(최대 4명).', f: 'M08' },
    { t: '개인 기록 안내', d: '방에서 잰 시간도 개인 세션으로 저장.', f: 'M01 M02' },
    { t: '방 만들기', d: '이름·최대 인원·기본 공유 설정 → 초대 코드 생성·복사.', f: 'M08' },
  ] },
  { id: 'PC12', file: 'PC12_스터디방', title: '스터디방 (캠스터디)', route: '/rooms/:code', feats: ['M08', 'M01', 'M05'], url: '/rooms/A7K2Q9', body: room, notes: [
    { t: '연결 상태', d: 'WebSocket 연결 표시. 끊기면 재연결 중 배너.', f: 'M08' },
    { t: '멤버 타일', d: '동의한 영상만(WebRTC). 연결 중·실패·미공유·오프라인 상태를 구분하고, 영상이 실패해도 상태는 유지.', f: 'M08' },
    { t: '내 타이머', d: '그룹 안에서도 개인 세션으로 측정.', f: 'M01' },
    { t: '공유 · 감지 분리', d: '카메라 공유와 AI 감지는 별도 스위치. 끄거나 나가면 전송 즉시 종료.', f: 'M08 M05' },
    { t: '멤버 현황', d: '집중·휴식·종료·오프라인과 오늘 순공.', f: 'M08' },
    { t: '방 활동', d: '입장·휴식·연결 끊김 등 이벤트. 일정 시간 끊기면 오프라인 처리.', f: 'M08' },
  ] },
  { id: 'PC13', file: 'PC13_보상수집', title: '보상·수집', route: '/rewards', feats: ['M12'], url: '/rewards', body: rewards, notes: [
    { t: '보유 포인트', d: '잔액·이번 주 획득·지급 세션 수.', f: 'M12' },
    { t: '지급 규칙', d: '정상 종료 + 최소 집중 시간 + 세션당 1회. 수치는 팀 결정 항목.', f: 'M12' },
    { t: '수집', d: '획득/잠김 + 다음 목표 조건. 최초 표시 범위는 팀 결정.', f: 'M12' },
    { t: '지급 내역', d: '세션별 지급 결과와 미지급 사유.', f: 'M12' },
  ] },
  { id: 'PC14', file: 'PC14_설정', title: '설정 (과목·태그·D-Day·시간대)', route: '/settings', feats: ['M03', 'M07', 'M02'], url: '/settings/study', body: settings, notes: [
    { t: '과목 관리', d: '추가·수정·삭제(보관). 지난 기록의 과목 표시는 유지.', f: 'M03' },
    { t: '태그 관리', d: '사용 횟수와 함께 관리.', f: 'M03' },
    { t: '시험 D-Day 관리', d: '등록·수정·삭제, D-n 표기 규칙 안내.', f: 'M07' },
    { t: '시간·집계 설정', d: '시간대(자정 기준 집계), 하루 목표, 이탈 판정 시간.', f: 'M02 M05' },
  ] },
];
