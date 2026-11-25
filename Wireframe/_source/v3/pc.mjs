// v0.3 PC 웹 화면 (1440 × 900 뷰포트)
import { ic, HEX, mk, subj, legend, segbar, avatar, ph, check, field, select, table, ringSvg, donutSvg } from './core.mjs';
import { scene } from './scene.mjs';

const NAV = [
  ['sec', '수련'], ['home', '수련장', 'home'], ['planner', '수련 계획', 'calendar'], ['focus', '폐관 수련', 'timer'], ['records', '수련록', 'chart'],
  ['sec', '강호'], ['rooms', '문파', 'users', '2'],
  ['sec', '무인'], ['rewards', '무인 성장', 'gift'], ['settings', '설정', 'settings'],
];

export const browser = (url, inner, { left = 40, top = 118 } = {}) => `<div class="browser" style="left:${left}px;top:${top}px">
  <div class="bbar"><div class="bdots"><i></i><i></i><i></i></div>
    <div class="row" style="gap:14px">${ic('chevL', 16, HEX.muted)}${ic('chevR', 16, '#C8BBA5')}${ic('refresh', 15, HEX.muted)}</div>
    <div class="burl">${ic('lock', 13, HEX.muted)}<span>https://<b>learningmate.app</b>${url}</span></div>
    <div class="grow"></div>${ic('more', 18, HEX.muted)}</div>
  <div class="app">${inner}</div></div>`;

const side = (active, { lock = false, m = '' } = {}) => `<aside class="side"${mk(m)}>
  <div class="logo"><i>修</i>LearningMate</div>
  <div class="nav">${NAV.map(([k, l, icn, cnt]) => (k === 'sec'
    ? `<div class="sec">${l}</div>`
    : `<div class="it${active === k ? ' on' : ''}${lock && active !== k ? ' dis' : ''}">${ic(icn, 18, active === k ? '#fff' : '#BFB3A0')}${l}${cnt ? `<span class="cnt">${cnt}</span>` : ''}</div>`)).join('')}</div>
  <div class="fill"></div>
  ${lock ? `<div class="livecard"><div class="row xs" style="color:#BFB3A0;gap:6px">${ic('lock', 13, '#C9A15B')}폐관 모드</div><div class="sm" style="color:#fff;margin-top:6px;line-height:1.5">다른 메뉴로 이동하면<br>확인 후 일시정지돼요</div></div>` : ''}
  <div class="me">${avatar('A', '', 'k')}<div class="col grow"><b class="md">김싸피</b><span class="xs" style="color:#BFB3A0"><b style="color:#C9A15B">이류 고수</b> · 내공 1,380</span></div>${ic('logout', 16, '#857865')}</div>
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
/* 소셜 로그인 버튼 — 와이어프레임용 단순 표기. 실제 구현은 각 제공자 디자인 가이드의 공식 버튼 리소스를 쓴다. */
const OAUTH = {
  google: { label: 'Google로 계속하기', bg: '#FFFFFF', fg: '#1F1F1F', bd: '#DADCE0', icon: '<span style="width:22px;height:22px;border-radius:50%;border:1.5px solid #DADCE0;display:grid;place-items:center;font-weight:900;font-size:13px;color:#4285F4;font-family:Arial,sans-serif">G</span>' },
  kakao: { label: '카카오로 계속하기', bg: '#FEE500', fg: 'rgba(0,0,0,.85)', bd: '#FEE500', icon: '<svg width="22" height="22" viewBox="0 0 24 24"><ellipse cx="12" cy="11" rx="9" ry="7" fill="#191919"/><path d="M8 16.5 L7 21 L11.5 17.5 Z" fill="#191919"/></svg>' },
  naver: { label: '네이버로 계속하기', bg: '#03C75A', fg: '#FFFFFF', bd: '#03C75A', icon: '<span style="width:22px;height:22px;display:grid;place-items:center;font-weight:900;font-size:17px;color:#fff;font-family:Arial,sans-serif">N</span>' },
  instagram: { label: 'Instagram으로 계속하기', bg: '#FFFFFF', fg: '#1F1F1F', bd: '#DADCE0', icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C13584" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.3" cy="6.7" r="1" fill="#C13584" stroke="none"/></svg>', tag: '검토 필요' },
};
const oauthBtn = (k, recent = false) => { const o = OAUTH[k]; return `<div style="position:relative;height:52px;border-radius:10px;background:${o.bg};border:1px solid ${o.bd};display:flex;align-items:center;padding:0 16px;gap:10px">
  ${o.icon}<b style="flex:1;text-align:center;font-size:14.5px;color:${o.fg};margin-right:32px">${o.label}</b>
  ${o.tag ? `<span class="badge b-todo" style="position:absolute;right:10px">${o.tag}</span>` : ''}
  ${recent ? `<span class="xs w7" style="position:absolute;right:-8px;top:-10px;background:var(--black);color:#F8F2E7;border-radius:6px;padding:1px 7px">최근 사용</span>` : ''}
</div>`; };

const login = () => `<div style="display:flex;width:100%;height:100%">
  <div style="width:640px;background:var(--navy);color:#fff;padding:56px 60px;display:flex;flex-direction:column;position:relative">
    <div class="logo" style="padding:0;font-size:20px"><i>修</i>LearningMate</div>
    <div class="serif" style="margin-top:56px;font-size:36px;font-weight:800;line-height:1.35;letter-spacing:-1px">매일의 순공이<br>내공이 된다.</div>
    <div style="margin-top:14px;font-size:15px;color:var(--sky);line-height:1.6">폐관 수련으로 쌓은 순공만큼 경지가 오르는 학습 메이트</div>
    <div class="col" style="gap:14px;margin-top:44px">
      ${[['calendar', '날짜별 계획과 비무 D-Day'], ['timer', '폐관 수련 · 자리 이탈 자동 기록'], ['trophy', '내공을 쌓아 삼류에서 생사경까지'], ['users', '초대 코드로 함께하는 문파 합동 수련']].map(([i, t]) => `<div class="row" style="gap:12px"><span style="width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,.1);display:grid;place-items:center">${ic(i, 18, '#fff')}</span><span style="font-size:15px">${t}</span></div>`).join('')}
    </div>
    <div style="flex:1;min-height:28px"></div>
    <div style="position:relative;height:190px;border-radius:12px;overflow:hidden">${scene({ t: 0.55, hour: 17.4 })}</div>
  </div>
  <div style="flex:1;display:flex;align-items:center;justify-content:center;background:#fff;position:relative">
    <div class="toast" style="position:absolute;top:24px;right:28px"${mk(5)}>${ic('clock', 16, '#C9A15B')}<div class="col"><b>진행 중인 세션이 있어요</b><span class="xs" style="color:#BFB3A0">데이터베이스 · 00:42:10 — 로그인하면 이어서 측정해요</span></div></div>
    <div style="width:400px" class="col">
      <div class="serif" style="font-size:28px;font-weight:800;letter-spacing:-.6px">강호 입문</div>
      <div class="muted" style="margin-top:6px">자주 쓰는 계정으로 바로 시작하세요 · 처음이면 자동으로 가입돼요</div>
      <div class="col" style="gap:10px;margin-top:26px"${mk(1)}>
        ${oauthBtn('google')}${oauthBtn('kakao', true)}${oauthBtn('naver')}
        <div${mk(2)}>${oauthBtn('instagram')}</div>
      </div>
      <div class="card tint" style="margin-top:22px;padding:12px 14px"${mk(3)}><div class="row" style="gap:10px;align-items:flex-start">${ic('info', 16, HEX.navy)}<span class="sm" style="line-height:1.55">LearningMate는 <b>별도 아이디·비밀번호 없이</b> 소셜 계정으로만 로그인해요. 처음 로그인하면 무호(닉네임)만 정하고 바로 시작해요.</span></div></div>
      <div class="col xs muted" style="align-items:center;margin-top:20px;gap:6px;text-align:center;line-height:1.5"${mk(4)}><span>계속하면 <u>이용약관</u>과 <u>개인정보 처리방침</u>에 동의하게 돼요</span><span class="row" style="gap:6px">${ic('shield', 14, HEX.blue)}로그인·카메라는 HTTPS 주소에서만 동작해요</span></div>
    </div>
  </div>
</div>`;

/* ================================================================== */
/* PC-02 수련장                                                       */
/* ================================================================== */
const planRow = ({ t, s, g, tag, st, act, m }) => `<div class="row" style="gap:14px;padding:12px 14px;border-radius:12px;${st === 'now' ? 'background:#FAECE6;border:1px solid var(--blue2)' : 'border:1px solid var(--line2)'}"${mk(m)}>
  <span class="md num w7 ${st === 'done' ? 'muted2' : ''}" style="width:96px">${t}</span>
  ${subj(s)}
  <div class="col grow" style="min-width:0;${st === 'done' ? 'opacity:.6' : ''}"><b class="md" style="${st === 'done' ? 'text-decoration:line-through' : ''}">${g}</b><span class="tag">${tag}</span></div>
  ${st === 'done' ? `<span class="sm blue w7 num">${act}</span><span class="badge b-done">${ic('check', 12, HEX.navy, 3)}완료</span>`
    : st === 'now' ? `<span class="badge b-now">지금</span><span class="btn sm">${ic('play', 12, '#fff')}시작</span>`
    : `<span class="badge b-todo">예정</span><span class="btn sm o">${ic('play', 12, HEX.blue)}시작</span>`}
</div>`;

const dashboard = () => shell({
  active: 'home', crumbs: ['홈'], title: '수련장',
  right: `${topIcons()}<span class="btn"${mk(7)}>${ic('play', 14, '#fff')}바로 폐관 수련</span>`,
  body: `
  <div style="display:grid;grid-template-columns:1.75fr 1fr 1fr 1fr;gap:16px"${mk(1)}>
    <div class="card black" style="padding:16px 20px"><div class="row" style="gap:16px">
      <span class="seal" style="width:58px;height:58px;font-size:28px;box-shadow:0 0 0 2px #A8322A,inset 0 0 0 2px #F8F2E7">二</span>
      <div class="col grow"><div class="row" style="gap:8px"><span class="realm fill">이류 고수</span><span class="xs" style="color:#BFB3A0">다음 경지 · 일류</span></div>
        <div class="row" style="margin-top:12px;gap:10px"><div class="gauge grow" style="background:#3A3128"><i style="width:46%"></i></div><span class="sm num" style="color:#EFE2CB;white-space:nowrap"><b>내공 1,380</b> / 3,000</span></div>
        <span class="xs" style="color:#BFB3A0;margin-top:7px">오늘 +130 내공 · 일류까지 1,620</span></div></div></div>
    ${kpi('오늘 순공', 'timer', '2:14:30', `<div class="bar grow"><i style="width:56%"></i></div><span>목표 4:00</span>`)}
    ${kpi('이번 주 순공', 'chart', '18:42:10', `<span class="blue w7">▲ 1:12:05</span> 지난주 대비`)}
    ${kpi('연속 수련', 'flag', '6일', `<span class="row" style="gap:4px">${[1, 1, 1, 1, 1, 1, 0].map((x) => `<i style="width:14px;height:14px;border-radius:4px;display:block;background:${x ? 'var(--blue)' : 'var(--line2)'}"></i>`).join('')}</span><span>최고 14일</span>`)}
  </div>
  <div style="display:grid;grid-template-columns:1fr 372px;gap:16px">
    <div class="card"${mk(2)}>
      <div class="ch"><h3>오늘의 수련 계획 <span class="sub">11월 24일 (화)</span></h3><div class="row"><span class="link">수련 계획에서 보기 ${ic('chevR', 13, HEX.blue)}</span><span class="btn sm g">${ic('plus', 14)}수련 계획 추가</span></div></div>
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
        <div class="ch"><h3>비무 D-Day</h3><span class="link">${ic('plus', 13, HEX.blue)}비무 추가</span></div>
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
      <div class="ch"><h3>최근 수련</h3><span class="link">수련록 ${ic('chevR', 13, HEX.blue)}</span></div>
      ${table([{ t: '일시', w: '150px' }, { t: '과목 · 목표' }, { t: '측정', w: '80px' }, { t: '순공', w: '84px', r: 1 }, { t: '이탈', w: '64px', r: 1 }, { t: '보상', w: '60px', r: 1 }], [
        ['<span class="md num">11.24 09:02–10:44</span>', `${subj('algo')}<span class="md">백준 DP 3문제</span>`, '<span class="badge b-line">AI</span>', '<b class="num">1:24:36</b>', '<span class="num muted">2회</span>', '<b class="blue">+80 내공</b>'],
        ['<span class="md num">11.24 07:31–08:12</span>', `${subj('eng')}<span class="md">토익 RC 파트5</span>`, '<span class="badge b-todo">수동</span>', '<b class="num">0:38:12</b>', '<span class="muted">–</span>', '<b class="blue">+50 내공</b>'],
      ])}
    </div>
    <div class="card"${mk(6)}>
      <div class="ch"><h3>문파</h3><span class="link">전체 ${ic('chevR', 13, HEX.blue)}</span></div>
      ${[['SSAFY 알고리즘 스터디', '2명 집중 중', ['f', 'f', 'p', 'o']], ['정처기 막판 스퍼트', '1명 집중 중', ['f', 'o', 'o']]].map(([n, s, sts], i) => `<div class="row" style="gap:12px;padding:9px 0;${i ? 'border-top:1px solid var(--line2)' : ''}"><div class="col grow"><b class="md">${n}</b><span class="row xs muted" style="gap:5px"><span class="dot d-f"></span>${s}</span></div><span class="stack">${sts.map((st, j) => avatar('민지도서'[j], st)).join('')}</span><span class="btn sm ${i ? 'g' : ''}" style="margin-left:10px">입장</span></div>`).join('')}
    </div>
  </div>`,
});

/* ================================================================== */
/* PC-03 수련 계획 (주간)                                                  */
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
    ${WEEK.map(([d, n], i) => `<div class="col" style="flex:1;align-items:center;justify-content:center;gap:2px;height:100%;border-left:1px solid var(--line2);${i === 1 ? 'background:#FAECE6' : ''}"><span class="xs ${i === 1 ? 'blue w7' : 'muted'}">${d}</span><span style="font-weight:800;font-size:16px;${i === 1 ? 'width:28px;height:28px;border-radius:50%;background:var(--blue);color:#fff;display:grid;place-items:center;font-size:14px' : ''}">${n}</span></div>`).join('')}
  </div>
  <div style="display:flex;position:relative;flex:1">
    <div style="width:52px;position:relative">${Array.from({ length: 15 }, (_, k) => `<span class="xs muted2 num" style="position:absolute;right:8px;top:${k * RH - 7}px">${String(H0 + k).padStart(2, '0')}:00</span>`).join('')}
      <span class="xs w8 num" style="position:absolute;right:6px;top:${(14 + 20 / 60 - H0) * RH - 8}px;background:var(--black);color:#fff;padding:1px 4px;border-radius:4px"${m ? mk(3) : ''}>14:20</span></div>
    ${WEEK.map(([, , plans], i) => `<div style="flex:1;position:relative;border-left:1px solid var(--line2);${i === 1 ? 'background:#FBF6EE' : ''};background-image:none">
      ${Array.from({ length: 15 }, (_, k) => `<i style="position:absolute;left:0;right:0;top:${k * RH}px;height:1px;background:var(--line2);display:block"></i>`).join('')}
      ${plans.map(([st, dur, s, g, state, sel]) => `<div style="position:absolute;left:4px;right:4px;top:${(st - H0) * RH + 2}px;height:${dur * RH - 4}px;border-radius:8px;padding:5px 7px;z-index:1;${PLAN_STYLE[s]};${state === 'done' ? 'opacity:.55' : ''};${sel ? 'opacity:1;box-shadow:0 0 0 2.5px var(--black)' : ''};${state === 'now' ? 'box-shadow:0 0 0 2.5px var(--blue2)' : ''}"${sel && m ? mk(2) : ''}><div class="row" style="gap:4px;font-size:11.5px;font-weight:800;line-height:1.3;white-space:nowrap;overflow:hidden">${state === 'done' ? ic('check', 11, s === 'eng' || s === 'exam' ? HEX.navy : '#fff', 3) : ''}<span style="overflow:hidden;text-overflow:ellipsis">${g}</span></div>${dur >= 1 ? `<div style="font-size:10.5px;opacity:.85;margin-top:2px;white-space:nowrap" class="num">${hm(st)}–${hm(st + dur)}</div>` : ''}${sel ? `<div style="margin-top:4px;font-size:10.5px;background:rgba(255,255,255,.22);border-radius:4px;padding:1px 5px;white-space:nowrap" class="num">실제 1:24:36</div>` : ''}</div>`).join('')}
      ${i === 1 ? `<div style="position:absolute;left:-1px;right:0;top:${(14 + 20 / 60 - H0) * RH}px;height:2px;background:var(--black);z-index:0"><i style="position:absolute;left:-4px;top:-4px;width:10px;height:10px;border-radius:50%;background:var(--black);display:block"></i></div>` : ''}
    </div>`).join('')}
  </div>
</div>`;

const planner = () => shell({
  active: 'planner', crumbs: ['수련 계획'], title: '수련 계획',
  right: `<div class="seg" style="width:180px"><span>일</span><span class="on">주</span><span>월</span></div><span class="btn g sm">오늘</span><div class="row" style="gap:6px"><span class="iconbtn" style="width:32px;height:32px">${ic('chevL', 15)}</span><b class="md" style="width:170px;text-align:center">11월 4주 · 11.23 – 11.29</b><span class="iconbtn" style="width:32px;height:32px">${ic('chevR', 15)}</span></div><span class="btn">${ic('plus', 15, '#fff')}수련 계획 추가</span>`,
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
          <div class="row xs" style="margin-top:10px;justify-content:space-between"><span class="muted">세션 09:02–10:44</span><span class="link">수련 상세 ${ic('chevR', 12, HEX.blue)}</span></div>
        </div>
        <div class="row" style="gap:8px;margin-top:14px"><span class="btn sm grow">${ic('play', 12, '#fff')}이 계획으로 다시 시작</span><span class="iconbtn" style="width:32px;height:32px">${ic('edit', 15)}</span><span class="iconbtn" style="width:32px;height:32px">${ic('trash', 15)}</span></div>
      </div>
      <div class="card"${mk(5)}>
        <div class="ch" style="margin-bottom:8px"><h3>비무 D-Day</h3><span class="link">${ic('plus', 13, HEX.blue)}추가</span></div>
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
/* PC-04 수련 계획 추가 모달                                                 */
/* ================================================================== */
const planModal = () => `${shell({ active: 'planner', crumbs: ['수련 계획'], title: '수련 계획', right: `<span class="btn">${ic('plus', 15, '#fff')}수련 계획 추가</span>`, body: `<div style="display:grid;grid-template-columns:1fr 330px;gap:18px;flex:1;min-height:0">${plannerGrid(false)}<div class="card"></div></div>` })}
<div class="dim"></div>
<div class="modal" style="left:${(1440 - 600) / 2}px;top:70px;width:600px">
  <div class="row between" style="padding:22px 26px 0"><b style="font-size:19px;letter-spacing:-.4px">수련 계획 추가</b>${ic('x', 20, HEX.muted)}</div>
  <div style="padding:16px 26px 0"><div class="seg dark"${mk(1)}><span class="on">${ic('calendar', 14, '#fff')}&nbsp;공부 계획</span><span>${ic('flag', 14, HEX.muted)}&nbsp;비무 D-Day</span></div></div>
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
      <div${mk(4)}>${field('비무 연결 (선택)', select(`${ic('flag', 15, HEX.navy)}<span style="margin-left:6px">정보처리기사 필기 · D-12</span>`), 'D-Day 카드의 관련 계획 수에 반영돼요')}</div>
    </div>
  </div>
  <div class="row between" style="padding:16px 26px 22px;border-top:1px solid var(--line2)"><span class="row sm">${check(false)}저장 후 계속 추가</span><div class="row"${mk(5)}><span class="btn g">취소</span><span class="btn dis">저장</span></div></div>
</div>`;

/* ================================================================== */
/* PC-05 폐관 준비                                                 */
/* ================================================================== */
const setup = () => shell({
  active: 'focus', crumbs: ['폐관 수련', '새 세션'], title: '폐관 준비',
  right: `<span class="btn g">취소</span>`,
  body: `<div style="display:grid;grid-template-columns:minmax(0,1fr) 540px;gap:18px;flex:1;min-height:0">
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
          <div style="border:1.5px solid var(--blue);background:#FAECE6;border-radius:12px;padding:14px" class="row"><span class="radio on"></span><div class="col grow" style="gap:3px"><div class="row"><b>AI 카메라 감지</b><span class="badge b-now">권장</span></div><span class="sm muted" style="line-height:1.5">얼굴 검출로 자리 이탈을 자동 기록하고 재실 구간만 순공에 합산</span></div></div>
          <div style="border:1px solid var(--line);border-radius:12px;padding:14px" class="row"><span class="radio"></span><div class="col grow" style="gap:3px"><b>수동</b><span class="sm muted" style="line-height:1.5">카메라 없이 직접 시작·일시정지·종료</span></div></div>
        </div>
      </div>
      <div class="card" style="flex:1"${mk(3)}>
        <div class="ch"><h3>수련 환경</h3><span class="sub">장소는 경지가 오르면 열려요</span></div>
        <div class="row" style="gap:12px;padding-bottom:14px;border-bottom:1px solid var(--line2)">${ic('sun', 18, HEX.navy)}<div class="col" style="width:112px"><b class="md">수련 장소</b><span class="xs muted">하늘은 실제 시각을 따라감</span></div>
          <div class="col" style="gap:4px;align-items:center"><div style="position:relative;width:92px;height:54px;border-radius:8px;overflow:hidden;box-shadow:0 0 0 2.5px var(--blue)">${scene({ t: 0.4, hour: 14.3 })}</div><b class="xs">죽림 절벽</b></div>
          ${[['설산', '일류'], ['폭포', '절정'], ['객잔', '초절정']].map(([n, r]) => `<div class="col" style="gap:4px;align-items:center"><div style="width:92px;height:54px;border-radius:8px;border:1.5px dashed var(--line);display:grid;place-items:center;background:var(--tint)"><span class="row xs muted" style="gap:4px">${ic('lock', 12, HEX.muted2)}${r}</span></div><span class="xs muted">${n}</span></div>`).join('')}</div>
        <div class="row" style="gap:12px;padding:14px 0;border-bottom:1px solid var(--line2)">${ic('music', 18, HEX.navy)}<div class="col" style="width:150px"><b class="md">배경음</b><span class="xs muted">사용자 클릭 후 재생</span></div>${select('죽림 빗소리')}<span class="iconbtn" style="width:36px;height:36px">${ic('play', 13, HEX.navy)}</span>${ic('volume', 16, HEX.muted)}<div class="slider" style="max-width:120px"><i style="width:60%"></i></div><span class="toggle on"></span></div>
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
      <div class="row between"><span class="sm muted">데이터베이스 · AI 감지 · 배경음 · 타임랩스</span><span class="btn lg"${mk(7)}>${ic('play', 15, '#fff')}폐관 시작<span class="kbd" style="margin-left:4px;background:transparent;color:#EFE2CB;border-color:rgba(255,255,255,.4)">Enter</span></span></div>
    </div>
  </div>`,
});

/* ================================================================== */
/* PC-06 폐관 수련 (몰입 화면)                                          */
/* 사이드바·카드를 걷어내고 장면 위에 최소 요소만 — 시간의 흐름은 해의 궤적·일주향·하늘색으로 */
/* ================================================================== */
export const focusTimer = (size = 300, { t = '00:39:12', pct = 0.65, status = '재실 · 수련 중', dot = 'var(--blue)', sub = '목표 1:00:00 · 오늘 순공 2:53:42', paused = false } = {}) => `<div class="glass ring" style="width:${size}px;height:${size}px;border-radius:50%">${ringSvg(size, 6, pct, paused ? HEX.muted : HEX.blue, 'rgba(107,94,78,.18)')}
  <div class="in" style="gap:${Math.round(size / 50)}px"><span class="row ${size > 260 ? 'sm' : 'xs'} w7" style="gap:6px;color:var(--muted)"><i style="width:8px;height:8px;border-radius:50%;background:${dot};display:block"></i>${status}</span>
    <div class="timer" style="font-size:${Math.round(size * 0.19)}px;color:var(--black);letter-spacing:-1px">${t}</div>
    <span class="xs muted">${sub}</span>
    <div class="row" style="gap:${Math.round(size / 15)}px;margin-top:${Math.round(size / 40)}px">${paused ? ic('play', size / 11, HEX.blue) : ic('pause', size / 11, HEX.black)}<span style="width:1px;height:${size / 14}px;background:var(--line)"></span>${ic('stop', size / 12, HEX.blue)}</div>
  </div></div>`;
export const realmBadge = (size = 96) => `<div class="glass ring" style="width:${size}px;height:${size}px;border-radius:50%">${ringSvg(size, 4, 0.46, HEX.blue2, 'rgba(107,94,78,.16)')}<div class="in" style="gap:1px"><span class="xs muted w7" style="font-size:${size / 9}px">경지</span><b class="serif" style="font-size:${size / 4.2}px;color:var(--blue);line-height:1.1">이류</b><span class="xs w7 num" style="font-size:${size / 9}px;color:var(--navy)">내공 +39</span></div></div>`;
const fab = (icn, label, m = '', on = false) => `<div class="col" style="align-items:center;gap:5px"${mk(m)}><span class="glass fab" style="${on ? 'background:var(--black);border-color:var(--black)' : ''}">${ic(icn, 20, on ? '#F8F2E7' : HEX.black)}</span><span class="xs w7 glass" style="padding:2px 9px;border-radius:999px;box-shadow:none">${label}</span></div>`;

const focusPage = () => `${scene({ t: 0.65, hour: 14.65, labels: ['14:00 입관', '15:00 출관 예정'] })}
<div style="position:absolute;left:36px;top:26px"${mk(1)}>
  <div class="sm w7 ink" style="opacity:.72">11월 24일 (화) · 미시(未時)</div>
  <div class="serif ink" style="font-size:60px;font-weight:700;line-height:1.05;letter-spacing:-1px">14:39<span style="font-size:20px;margin-left:8px;font-weight:600">오후</span></div>
</div>
<div class="glass row" style="position:absolute;left:50%;top:30px;transform:translateX(-50%);height:40px;padding:0 16px;border-radius:999px;gap:10px"${mk(2)}>${ic('lock', 14, HEX.blue)}<b class="sm">폐관 중</b><span style="width:1px;height:14px;background:var(--line)"></span>${subj('db')}<b class="md">정규화 개념 정리</b></div>
<div style="position:absolute;right:358px;top:30px"${mk(5)}>${realmBadge(96)}</div>
<div style="position:absolute;right:40px;top:26px"${mk(4)}>${focusTimer(300)}</div>
<div class="col" style="position:absolute;right:52px;top:372px;gap:16px"${mk(6)}>${fab('list', '수련 계획')}${fab('clock', '수련 일지')}${fab('camera', '카메라')}</div>
<div class="glass row" style="position:absolute;left:36px;bottom:30px;height:48px;padding:0 16px 0 8px;border-radius:999px;gap:10px"${mk(7)}><span class="fab" style="width:34px;height:34px;background:var(--black)">${ic('camera', 16, '#F8F2E7')}</span><div class="col"><b class="sm">AI 재실 감지 · 기척 있음</b><span class="xs muted">0.2초 전 · 프레임 미전송</span></div><span class="rec" style="margin-left:6px;box-shadow:0 0 0 3px rgba(168,50,42,.2)"></span><span class="xs muted">타임랩스</span></div>
<div class="glass row" style="position:absolute;left:50%;bottom:30px;transform:translateX(-50%);height:56px;padding:0 20px;border-radius:999px;gap:16px"${mk(8)}>${ic('music', 18, HEX.blue)}<div class="col" style="width:150px"><b class="sm serif">죽림 빗소리</b><span class="xs muted">배경음 · 1 / 4</span></div>${ic('chevL', 18, HEX.muted)}<span class="fab" style="width:38px;height:38px;border:1.5px solid var(--black)">${ic('pause', 14, HEX.black)}</span>${ic('chevR', 18, HEX.muted)}<span style="width:1px;height:22px;background:var(--line)"></span>${ic('volume', 17, HEX.muted)}<div class="slider" style="width:80px;flex:none"><i style="width:60%"></i></div></div>
<div class="row" style="position:absolute;right:40px;bottom:28px;gap:14px;align-items:flex-end">${fab('eye', '몰입 보기', 9)}<div class="col" style="align-items:center;gap:5px"${mk(10)}><span class="fab" style="width:56px;height:56px;background:var(--blue);box-shadow:0 10px 24px -10px rgba(168,50,42,.8)">${ic('stop', 20, '#F8F2E7')}</span><span class="xs w7 glass" style="padding:2px 9px;border-radius:999px;box-shadow:none">출관 <span class="kbd">Esc</span></span></div></div>`;

/* ================================================================== */
/* PC-08 수련 결과                                                      */
/* ================================================================== */
const result = () => shell({
  active: 'focus', crumbs: ['폐관 수련', '수련 결과'], title: '출관 · 수련 완료',
  right: `<span class="btn g">수련장</span><span class="btn">${ic('chart', 15, '#fff')}기록에서 보기</span>`,
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
        <div class="ch" style="margin-bottom:8px"><h3>이벤트 요약</h3><span class="link">수련 상세 ${ic('chevR', 12, HEX.blue)}</span></div>
        ${[['14:02', '집중 시작', '계획에서 시작 · AI 모드', 'f'], ['14:21', '일시정지 2:10', '사용자 조작', 'p'], ['14:38', '자리 이탈 0:45', 'AI · 얼굴 미검출', 'a'], ['14:52', '자리 이탈 2:37', 'AI · 얼굴 미검출', 'a'], ['15:06', '출관', '사용자 종료 · 보상 지급', 'k']].map(([t, e, d, c]) => `<div class="row" style="gap:12px;height:32px;border-top:1px solid var(--line2)"><span class="sm num muted" style="width:40px">${t}</span><span class="dot ${c === 'k' ? '' : `d-${c}`}" style="${c === 'k' ? 'border:2px solid var(--black)' : ''}"></span><span class="md grow">${e}</span><span class="xs muted">${d}</span></div>`).join('')}
      </div>
    </div>
    <div class="col" style="gap:16px">
      <div class="card navy" style="padding:20px 22px"${mk(5)}>
        <div class="row between"><span class="sm" style="color:var(--sky)">내공 획득</span><span class="sm" style="color:var(--sky)">보유 내공 1,380 ›</span></div>
        <div style="font-size:30px;font-weight:800;margin-top:6px">+60 내공 획득</div>
        <div class="col" style="gap:6px;margin-top:12px">${['정상 종료', '최소 집중 25분 이상 (58분)', '세션당 1회 지급 · 중복 지급 없음'].map((t) => `<div class="row sm">${ic('check', 14, '#C9A15B', 3)}<span>${t}</span></div>`).join('')}</div>
      </div>
      <div class="card"${mk(6)}>
        <div class="ch"><h3>${ic('video', 17)}공부 타임랩스</h3><span class="sub">186컷 · 10초 간격</span></div>
        ${ph('100%', '232px', '', `<span style="width:56px;height:56px;border-radius:50%;background:rgba(28,24,20,.75);display:grid;place-items:center;position:relative;z-index:2">${ic('play', 22, '#fff')}</span>`)}
        <div class="row" style="gap:10px;margin-top:10px">${ic('play', 13, HEX.navy)}<div class="slider"><i style="width:0%"></i></div><span class="xs num muted">0:00 / 0:31</span></div>
        <div class="row" style="gap:8px;margin-top:14px"><span class="btn sm grow">${ic('download', 14, '#fff')}다운로드 (.webm)</span><span class="btn sm g">${ic('trash', 14)}삭제</span></div>
        <div class="row xs muted" style="gap:6px;margin-top:12px;line-height:1.5">${ic('info', 14, HEX.muted)}<span>서버에 올리지 않고 이 브라우저에만 보관해요. 브라우저 데이터를 지우면 사라져요.</span></div>
      </div>
    </div>
  </div>`,
});

/* ================================================================== */
/* PC-09 수련록                                                      */
/* ================================================================== */
const records = () => shell({
  active: 'records', crumbs: ['수련록'], title: '수련록',
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
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;width:226px;margin:0 auto">${'월화수목금토일'.split('').map((d) => `<span class="xs muted2" style="text-align:center">${d}</span>`).join('')}${Array.from({ length: 42 }, (_, k) => { const day = k - 5; const lv = day < 1 || day > 30 ? -1 : day > 24 ? 0 : [3, 2, 0, 1, 3, 2, 4, 1, 2, 3, 0, 2, 4, 3, 1, 2, 3, 4, 2, 0, 1, 3, 4, 2][day - 1] ?? 1; return `<i style="aspect-ratio:1;border-radius:5px;display:block;background:${lv < 0 ? 'transparent' : ['var(--line2)', '#EBCFC0', '#D08770', 'var(--blue)', 'var(--navy)'][lv]};${day === 24 ? 'box-shadow:0 0 0 2px var(--black)' : ''}"></i>`; }).join('')}</div>
      <div class="row xs muted" style="gap:5px;margin-top:10px;justify-content:flex-end">적음${['var(--line2)', '#EBCFC0', '#D08770', 'var(--blue)', 'var(--navy)'].map((c) => `<i style="width:11px;height:11px;border-radius:3px;background:${c};display:block"></i>`).join('')}많음</div>
    </div>
    <div class="card" style="padding-bottom:10px"${mk(6)}>
      <div class="ch"><h3>수련 목록 <span class="sub">12건</span></h3><div class="row"><span class="chip sm">최신순 ${ic('chevD', 12, HEX.muted)}</span></div></div>
      ${table([{ t: '일시', w: '160px' }, { t: '과목 · 목표' }, { t: '측정', w: '56px' }, { t: '순공', w: '76px', r: 1 }, { t: '구간', w: '130px' }, { t: '보상', w: '56px', r: 1 }, { t: '', w: '16px' }], [
        ['<span class="md num">11.24 (화) 14:02</span>', `${subj('db')}<span class="md">정규화 개념 정리</span>`, '<span class="badge b-line">AI</span>', '<b class="num">0:58:40</b>', `<div style="width:120px">${segbar([['f', 19], ['p', 2], ['f', 15], ['a', 1], ['f', 14], ['a', 2], ['f', 11]], 8)}</div>`, '<b class="blue">+60 내공</b>', ic('chevR', 14, HEX.muted)],
        ['<span class="md num">11.24 (화) 09:02</span>', `${subj('algo')}<span class="md">백준 DP 3문제</span>`, '<span class="badge b-line">AI</span>', '<b class="num">1:24:36</b>', `<div style="width:120px">${segbar([['f', 32], ['p', 12], ['f', 28], ['a', 3], ['f', 20], ['u', 2], ['f', 6]], 8)}</div>`, '<b class="blue">+80 내공</b>', ic('chevR', 14, HEX.muted)],
        ['<span class="md num">11.24 (화) 07:31</span>', `${subj('eng')}<span class="md">토익 RC 파트5</span>`, '<span class="badge b-todo">수동</span>', '<b class="num">0:38:12</b>', `<div style="width:120px">${segbar([['f', 20], ['p', 2], ['f', 18]], 8)}</div>`, '<b class="blue">+50 내공</b>', ic('chevR', 14, HEX.muted)],
        ['<span class="md num">11.23 (월) 20:05</span>', `${subj('exam')}<span class="md">필기 기출</span>`, '<span class="badge b-line">AI</span>', '<b class="num">1:48:02</b>', `<div style="width:120px">${segbar([['f', 40], ['a', 4], ['f', 50]], 8)}</div>`, '<b class="blue">+100 내공</b>', ic('chevR', 14, HEX.muted)],
      ], { sel: 1 })}
      <div class="row" style="justify-content:center;gap:6px;margin-top:8px">${ic('chevL', 14, HEX.muted2)}${[1, 2, 3].map((n) => `<span style="width:26px;height:26px;border-radius:7px;display:grid;place-items:center;font-size:12px;${n === 1 ? 'background:var(--navy);color:#fff;font-weight:800' : 'color:var(--muted)'}">${n}</span>`).join('')}${ic('chevR', 14, HEX.muted)}</div>
    </div>
  </div>`,
});

/* ================================================================== */
/* PC-10 수련 상세                                                      */
/* ================================================================== */
const detail = () => {
  const T0 = 9, T1 = 10 + 50 / 60, W = 100;
  const pos = (h, m) => ((h + m / 60 - T0) / (T1 - T0)) * W;
  const segs = [[9, 2, 9, 34, 'f'], [9, 34, 9, 46, 'p'], [9, 46, 10, 14, 'f'], [10, 14, 10, 17, 'a'], [10, 17, 10, 37, 'f'], [10, 37, 10, 39, 'u'], [10, 39, 10, 41, 'a'], [10, 41, 10, 44, 'f']];
  return shell({
    active: 'records', crumbs: ['수련록', '수련 상세'], title: '세션 #2481',
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
          ['<span class="num md">10:44</span>', '<span class="row md"><span class="dot" style="border:2px solid var(--black)"></span>출관</span>', '<span class="md muted">종료 확정 · 보상 지급</span>', '<span class="muted">–</span>'],
        ])}
      </div>
      <div class="col" style="gap:14px">
        <div class="card"${mk(4)}><div class="ch" style="margin-bottom:10px"><h3>연결된 계획</h3><span class="link">수련 계획 ${ic('chevR', 12, HEX.blue)}</span></div>
          <div class="row sm"><span class="muted" style="width:34px">계획</span><div class="bar grow" style="height:7px"><i style="width:100%;background:var(--line)"></i></div><span class="num" style="width:96px;text-align:right">09:00–10:30</span></div>
          <div class="row sm" style="margin-top:6px"><span class="muted" style="width:34px">실제</span><div class="bar grow" style="height:7px"><i style="width:94%"></i></div><span class="num w7" style="width:96px;text-align:right">1:24:36 · 94%</span></div></div>
        <div class="card"${mk(5)}><div class="row between"><div class="col"><span class="sm muted">내공 획득</span><b class="blue" style="font-size:20px">+80 내공 지급됨</b></div><span class="xs muted" style="text-align:right">지급 키: session-2481<br>중복 지급 없음</span></div></div>
        <div class="card" style="flex:1"${mk(6)}><div class="ch" style="margin-bottom:10px"><h3>타임랩스</h3><span class="badge b-todo">이 기기에만 저장</span></div>
          <div class="row" style="gap:12px">${ph('132px', '76px', '', `<span style="position:relative;z-index:2">${ic('play', 18, HEX.navy)}</span>`)}<div class="col" style="gap:6px"><span class="md">0:24 · 142컷</span><div class="row" style="gap:6px"><span class="btn sm g">${ic('download', 13)}저장</span><span class="btn sm g">${ic('trash', 13)}삭제</span></div></div></div></div>
      </div>
    </div>`,
  });
};

/* ================================================================== */
/* PC-11 문파 목록                                                  */
/* ================================================================== */
const roomCard = (n, code, members, live, me = false) => `<div class="card" style="padding:16px 18px">
  <div class="row between"><b class="lg" style="letter-spacing:-.3px">${n}</b>${ic('moreV', 16, HEX.muted)}</div>
  <div class="row xs muted" style="gap:6px;margin-top:4px">${ic('copy', 12, HEX.muted)}코드 ${code} · 최대 4명${me ? ' · 방장' : ''}</div>
  <div class="row" style="margin-top:16px;gap:10px"><span class="stack">${members.map(([t, st]) => avatar(t, st)).join('')}</span><span class="row sm" style="gap:5px;margin-left:12px"><span class="dot d-f"></span><b>${live}명</b> 집중 중</span></div>
  <div class="divider" style="margin:14px 0 12px"></div>
  <div class="row between"><span class="xs muted">오늘 방 합계 순공 ${me ? '6:12:40' : '2:05:11'}</span><span class="btn sm">입장</span></div>
</div>`;
const roomsList = () => shell({
  active: 'rooms', crumbs: ['문파'], title: '문파',
  right: `<span class="btn">${ic('plus', 15, '#fff')}문파 세우기</span>`,
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
      <div class="ch" style="margin:4px 0 -4px"><h3>내 문파 <span class="sub">2개</span></h3><div class="seg" style="width:140px"><span class="on">${ic('grid', 14)}</span><span>${ic('list', 14, HEX.muted)}</span></div></div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px"${mk(2)}>
        ${roomCard('SSAFY 알고리즘 스터디', 'A7K2Q9', [['나', 'o'], ['민', 'f'], ['지', 'p'], ['도', 'f']], 2, true)}
        ${roomCard('정처기 막판 스퍼트', 'P3X8LM', [['하', 'f'], ['준', 'o'], ['유', 'o']], 1)}
        <div style="border:1.5px dashed var(--line);border-radius:14px;display:grid;place-items:center;min-height:200px"><div class="col" style="align-items:center;gap:8px">${ic('plus', 26, HEX.blue2)}<b class="md muted">새 문파 세우기</b><span class="xs muted2">소규모(최대 4명) 합동 수련</span></div></div>
      </div>
      <div class="card tint" style="padding:14px 18px"${mk(3)}><div class="row" style="gap:12px">${ic('info', 17, HEX.navy)}<span class="md">방에서 측정한 시간은 <b>개인 세션</b>으로 저장돼요. 방을 나가도 수련록에서 확인할 수 있어요.</span></div></div>
    </div>
    <div class="card" style="padding:20px 22px"${mk(4)}>
      <div class="ch"><h3>새 문파 세우기</h3></div>
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
/* PC-12 문파 (합동 수련)                                            */
/* ================================================================== */
const tile = ({ name, st, time, cam, me, off, conn, empty }) => empty
  ? `<div style="border-radius:14px;border:1.5px dashed var(--line);display:grid;place-items:center;background:#fff"><div class="col" style="align-items:center;gap:6px">${ic('plus', 22, HEX.blue2)}<span class="sm muted">초대 대기 중</span><span class="xs muted2">코드 A7K2Q9</span></div></div>`
  : `<div style="position:relative;border-radius:14px;overflow:hidden;${off ? 'opacity:.5;' : ''}${me ? 'border:3px solid var(--blue)' : ''}">
    ${cam ? `<div class="ph dark" style="position:absolute;inset:0;border-radius:0"><div class="face" style="width:22%"></div></div>`
      : conn ? `<div style="position:absolute;inset:0;background:#26201A;display:grid;place-items:center"><div class="col" style="align-items:center;gap:8px;color:#BFB3A0">${ic('refresh', 22, '#C9A15B')}<span class="sm">영상 연결 중…</span><span class="xs" style="color:#857865">실패해도 상태는 계속 표시돼요</span></div></div>`
      : `<div style="position:absolute;inset:0;background:var(--tint);border:1px solid var(--line);border-radius:14px;display:grid;place-items:center">${avatar(name[0], '', 'lg')}</div>`}
    <div style="position:absolute;left:10px;bottom:10px;right:10px;background:#fff;border-radius:10px;padding:7px 11px" class="row"><span class="dot d-${st}"></span><b class="md">${name}</b><span class="xs muted grow" style="text-align:right">${time}</span></div>
    ${cam ? `<span class="chip sm k" style="position:absolute;right:10px;top:10px">${ic('video', 12, '#fff')}캠 공유</span>` : ''}
  </div>`;
const room = () => shell({
  active: 'rooms', crumbs: ['문파', 'SSAFY 알고리즘 스터디'], title: 'SSAFY 알고리즘 스터디',
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
/* PC-13 무인 성장                                                      */
/* ================================================================== */
const REALMS = [['삼류', '三流', 0], ['이류', '二流', 1000], ['일류', '一流', 3000], ['절정', '絶頂', 8000], ['초절정', '超絶頂', 15000], ['화경', '化境', 30000], ['현경', '玄境', 50000], ['생사경', '生死境', 80000]];
const rewards = () => shell({
  active: 'rewards', crumbs: ['무인 성장'], title: '무인 성장',
  right: topIcons(false),
  body: `
  <div style="display:grid;grid-template-columns:1fr 1.25fr;gap:16px">
    <div class="card black" style="padding:16px;display:flex;gap:18px"${mk(1)}>
      <div style="position:relative;width:190px;height:170px;border-radius:10px;overflow:hidden;flex:none">${scene({ t: 0.6, hour: 14.6 })}<span class="xs w7" style="position:absolute;left:8px;top:8px;background:rgba(28,24,20,.6);color:#F8F2E7;border-radius:4px;padding:1px 7px">무인 초상 · 외형은 후속</span></div>
      <div class="col grow" style="gap:0">
        <div class="row" style="gap:8px"><span class="realm fill" style="height:30px;font-size:15px">이류 고수</span><span class="xs" style="color:#BFB3A0">김싸피 · 입문 34일째</span></div>
        <div class="row" style="margin-top:14px;gap:10px"><b class="serif" style="font-size:26px;color:#F8F2E7;white-space:nowrap">내공 1,380</b><span class="sm" style="color:#BFB3A0">/ 3,000 · 일류까지 1,620</span></div>
        <div class="gauge" style="background:#3A3128;margin-top:8px;height:12px"><i style="width:46%"></i></div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:16px">${[['총 순공', '86:25'], ['수련', '52회'], ['연속 수련', '6일'], ['오늘 내공', '+130']].map(([a, b]) => `<div class="col"><span class="xs" style="color:#BFB3A0">${a}</span><b class="serif num" style="font-size:18px;color:#EFE2CB">${b}</b></div>`).join('')}</div>
      </div>
    </div>
    <div class="card"${mk(2)}>
      <div class="ch"><h3>경지 (境界)</h3><span class="badge b-todo">예시 수치 · 팀 결정 필요</span></div>
      <div style="display:grid;grid-template-columns:repeat(8,1fr);gap:6px;position:relative">
        <i style="position:absolute;left:5%;right:5%;top:27px;height:2px;background:var(--line);display:block"></i>
        ${REALMS.map(([k, h, need], i) => `<div class="col" style="align-items:center;gap:6px;position:relative">
          <span class="seal" style="width:${i === 1 ? 54 : 44}px;height:${i === 1 ? 54 : 44}px;font-size:${h.length > 2 ? 12 : 16}px;${i > 1 ? 'background:#fff;color:var(--muted2);box-shadow:0 0 0 1.5px var(--line)' : i === 0 ? 'background:var(--navy)' : 'box-shadow:0 0 0 3px #F6E2DA'};margin-top:${i === 1 ? 0 : 5}px">${h}</span>
          <b class="sm serif" style="${i === 1 ? 'color:var(--blue)' : i > 1 ? 'color:var(--muted)' : ''}">${k}</b><span class="xs num ${i > 1 ? 'muted2' : 'muted'}">${need ? need.toLocaleString() : '입문'}</span></div>`).join('')}
      </div>
      <div class="row xs muted" style="gap:6px;margin-top:12px">${ic('info', 13, HEX.muted)}경지가 오르면 칭호 · 수련 장소(배경)가 열려요. 내공은 줄지 않고 쌓이기만 해요.</div>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1.1fr;gap:16px;flex:1;min-height:0">
    <div class="col" style="gap:16px">
      <div class="card"${mk(3)}>
        <div class="ch"><h3>내공 쌓는 법</h3><span class="sub">출관할 때 한 번 지급</span></div>
        <div class="col" style="gap:8px">${[['check', '정상 출관 + 순공 25분 이상', '기본 +30 내공'], ['timer', '순공 15분마다', '+10 내공 (재실·수동 집중만)'], ['shield', '수련(세션)당 1회', '세션 ID로 중복 지급 방지'], ['x', '제외 구간', '자리 이탈 · 일시정지 · 판정 불가']].map(([i, t, d]) => `<div class="row" style="gap:10px;padding:8px 10px;border:1px solid var(--line2);border-radius:10px"><span style="width:30px;height:30px;border-radius:8px;background:var(--tint);display:grid;place-items:center;flex:none">${ic(i, 15, HEX.blue)}</span><b class="sm grow">${t}</b><span class="xs muted">${d}</span></div>`).join('')}</div>
      </div>
      <div class="card" style="flex:1"${mk(4)}>
        <div class="ch"><h3>무공 성취 <span class="sub">과목별 누적 순공 → 1~12성</span></h3></div>
        <div class="col" style="gap:10px">${[['algo', 7, '38:12'], ['eng', 5, '21:40'], ['exam', 4, '17:30'], ['db', 3, '9:02']].map(([s, lv, t]) => `<div class="row" style="gap:10px"><span style="width:96px;flex:none">${subj(s)}</span><span class="row" style="gap:3px">${Array.from({ length: 12 }, (_, k) => `<i style="width:11px;height:14px;border-radius:2px;display:block;background:${k < lv ? 'var(--blue)' : 'var(--line2)'}"></i>`).join('')}</span><b class="sm serif" style="width:30px">${lv}성</b><span class="xs muted num grow" style="text-align:right">${t}</span></div>`).join('')}</div>
      </div>
    </div>
    <div class="col" style="gap:16px">
      <div class="card" style="flex:1"${mk(5)}>
        <div class="ch"><h3>비급 수집 <span class="sub">3 / 12</span></h3><span class="link">전체 보기 ${ic('chevR', 12, HEX.blue)}</span></div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">${[['입문서', '첫 로그인'], ['첫 폐관', '첫 수련 완료'], ['칠일 수련', '7일 연속'], ['야행 수련', '22시 이후 3회'], ['새벽 수련', '6시 전 3회'], ['백 시진', '순공 100시간'], ['동문', '문파 합동 수련'], ['완벽한 한 주', '주간 계획 100%'], ['비무 전야', '비무 D-1 수련'], ['몰입 이 시진', '한 번에 4시간'], ['비무 당일', 'D-Day 출관'], ['대성', '한 과목 12성']].map(([t, d], i) => `<div class="col" style="align-items:center;gap:4px">${i < 3 ? `<span style="width:100%;height:64px;border-radius:8px;background:var(--tint);border:1.5px solid var(--blue);display:grid;place-items:center"><span class="seal" style="width:34px;height:40px;font-size:15px;border-radius:3px">${'書閉七'[i]}</span></span>` : `<div style="width:100%;height:64px;border-radius:8px;border:1.5px dashed var(--line);display:grid;place-items:center">${ic('lock', 16, '#C8BBA5')}</div>`}<b class="xs ${i < 3 ? '' : 'muted2'}">${t}</b><span class="xs muted2" style="font-size:10px;margin-top:-3px">${d}</span></div>`).join('')}</div>
      </div>
      <div class="card tint" style="padding:12px 16px"><div class="row" style="gap:10px;align-items:flex-start">${ic('info', 16, HEX.navy)}<div class="col"><b class="sm">내공 사용처는 후속 범위</b><span class="xs muted" style="line-height:1.5;margin-top:2px">1차 MVP는 적립·경지·잔액·내역·수집까지. 무인 외형·상점은 범위 밖.</span></div></div></div>
    </div>
    <div class="card"${mk(6)}>
      <div class="ch"><h3>내공 획득 내역</h3><div class="row"><span class="chip sm">전체 ${ic('chevD', 12, HEX.muted)}</span></div></div>
      ${table([{ t: '출관', w: '86px' }, { t: '수련' }, { t: '순공', w: '62px', r: 1 }, { t: '내공', w: '74px', r: 1 }], [
        ['<span class="sm num">11.24 15:06</span>', `${subj('db')}`, '<span class="sm num">0:58:40</span>', '<b class="blue sm">+60</b>'],
        ['<span class="sm num">11.24 10:44</span>', `${subj('algo')}`, '<span class="sm num">1:24:36</span>', '<b class="blue sm">+80</b>'],
        ['<span class="sm num">11.24 08:12</span>', `${subj('eng')}`, '<span class="sm num">0:38:12</span>', '<b class="blue sm">+50</b>'],
        ['<span class="sm num">11.23 22:40</span>', `${subj('eng')}`, '<span class="sm num">0:18:20</span>', '<span class="xs muted">25분 미달</span>'],
        ['<span class="sm num">11.23 21:53</span>', `${subj('exam')}`, '<span class="sm num">1:48:02</span>', '<b class="blue sm">+100</b>'],
        ['<span class="sm num">11.23 15:10</span>', `${subj('algo')}`, '<span class="sm num">1:52:30</span>', '<b class="blue sm">+100</b>'],
        ['<span class="sm num">11.22 20:00</span>', `${subj('db')}`, '<span class="sm num">0:44:10</span>', '<b class="blue sm">+50</b>'],
      ])}
      <div class="row xs muted" style="gap:6px;margin-top:10px">${ic('info', 13, HEX.muted)}예: 0:58:40 → 기본 30 + 15분×3 = 60</div>
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
        <div class="ch"><h3>비무 D-Day</h3><span class="btn sm g">${ic('plus', 13)}비무 추가</span></div>
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
  { id: 'PC01', file: 'PC01_로그인', title: '강호 입문 (소셜 로그인)', route: '/login', feats: ['공통 기반', 'OAuth', 'M01'], url: '/login', body: login, notes: [
    { t: '소셜 로그인 (OAuth 2.0)', d: '유일한 로그인 방법. Google·카카오·네이버 버튼 → 제공자 동의 화면 → /auth/callback/:provider → Spring이 인가 코드를 교환하고 사용자를 식별해 서비스 토큰 발급. 처음이면 자동 가입, 마지막에 쓴 제공자에 「최근 사용」 표시. 실제 버튼은 각 제공자 공식 리소스 사용.', f: '공통' },
    { t: 'Instagram — 검토 필요', d: 'Instagram 로그인은 비즈니스·크리에이터 계정에만 제공돼 일반 개인 계정은 쓸 수 없어요. 채택 여부·대안을 팀이 결정 (기획서 5장 팀 결정 항목).', f: '공통' },
    { t: '소셜 로그인 전용', d: '서비스 자체 로그인·회원가입·비밀번호 찾기는 두지 않아요. 처음 로그인하면 무호(닉네임)만 정하고 시작. 비밀번호를 저장하지 않음.', f: '공통' },
        { t: '동의 · HTTPS', d: '계속하면 약관 동의. 제공자별 리디렉션 URI는 HTTPS 주소로 등록하고, 카메라(getUserMedia)도 HTTPS에서만 동작해요.', f: '공통 M05' },
    { t: '진행 중 세션 안내', d: '종료되지 않은 세션이 있으면 로그인 직후 폐관 수련 화면으로 복구해요.', f: 'M01' },
  ] },
  { id: 'PC02', file: 'PC02_수련장', title: '수련장', route: '/', feats: ['M01', 'M02', 'M06', 'M07', 'M08'], url: '/', body: dashboard, notes: [
    { t: '무인 카드 · 요약', d: '경지(이류 고수)와 다음 경지까지 내공 게이지 — 순공이 곧 내공. 옆에 오늘 순공·주간 합계·연속 수련일.', f: 'M12 M02' },
    { t: '오늘의 수련 계획', d: '완료 계획은 실제 집중 시간과 함께, 남은 계획은 ▶ 시작으로 폐관 준비에 바로 연결.', f: 'M06 M01' },
    { t: '지금 할 계획 강조', d: '현재 시각에 해당하는 계획을 강조하고 기본 버튼을 채워요.', f: 'M06' },
    { t: '비무 D-Day', d: '시험 이름·날짜·관련 계획 수. 사용자 시간대 기준으로 D-n 계산.', f: 'M07' },
    { t: '최근 수련', d: '측정 방식·이탈 횟수·보상까지 한 줄로. 클릭 시 수련 상세.', f: 'M02 M12' },
    { t: '문파 바로가기', d: '참여 중인 방의 실시간 집중 인원과 입장 버튼.', f: 'M08' },
    { t: '바로 폐관 수련', d: '계획 없이 시작하는 전역 버튼 — 폐관 준비으로 이동.', f: 'M01' },
  ] },
  { id: 'PC03', file: 'PC03_수련계획', title: '수련 계획 (주간)', route: '/planner?view=week', feats: ['M06', 'M07', 'M03'], url: '/planner?view=week&date=2026-11-24', body: planner, notes: [
    { t: '주간 시간표', d: '일·주·월 전환. 계획 블록은 과목 색, 완료 블록은 흐리게 + 체크.', f: 'M06 M03' },
    { t: '선택한 계획', d: '블록을 누르면 오른쪽 패널에 상세 표시. 선택 블록 하단에 실제 순공을 함께 표기.', f: 'M06' },
    { t: '현재 시각선', d: '오늘 열에 현재 시각을 표시해 지금 할 계획을 찾기 쉽게.', f: 'M06' },
    { t: '계획 상세 · 계획 대비 실제', d: '연결된 세션의 실제 시간과 달성률. 다시 시작·수정·삭제.', f: 'M06 M01' },
    { t: '비무 D-Day', d: '수련 계획에서 남은 날짜를 바로 확인하고 추가.', f: 'M07' },
    { t: '이번 주 달성', d: '주간 계획 완료 수와 과목별 달성.', f: 'M06 M03' },
  ] },
  { id: 'PC04', file: 'PC04_계획추가모달', title: '수련 계획 추가 모달', route: '/planner · modal', feats: ['M06', 'M03', 'M07'], url: '/planner?view=week&new=1', body: planModal, notes: [
    { t: '공부 계획 / 비무 D-Day 탭', d: '한 모달에서 계획 또는 시험(이름·날짜)을 등록.', f: 'M06 M07' },
    { t: '과목 선택 (필수)', d: '드롭다운에서 선택하거나 바로 새 과목 생성. 과목은 1개만.', f: 'M03' },
    { t: '시간 겹침 검증', d: '같은 날 다른 계획과 겹치면 경고하고 저장을 막아요.', f: 'M06' },
    { t: '비무 연결 (선택)', d: '계획을 시험에 연결하면 D-Day 카드의 관련 계획 수에 반영.', f: 'M07' },
    { t: '저장', d: '필수값·검증 통과 전까지 비활성. 저장 후 계속 추가 옵션.', f: 'M06' },
  ] },
  { id: 'PC05', file: 'PC05_폐관준비', title: '폐관 준비', route: '/focus/new', feats: ['M01', 'M03', 'M05', 'M10', 'M11'], url: '/focus/new?plan=318', body: setup, notes: [
    { t: '세션 정보', d: '계획에서 오면 계획·과목·목표가 자동 입력. 계획 없이도 시작 가능.', f: 'M06 M03' },
    { t: '측정 방식', d: 'AI 카메라 감지(권장) / 수동. AI를 고를 때만 카메라 권한을 요청해요.', f: 'M05' },
    { t: '수련 환경', d: '수련 장소(폐관 장면 배경) · 배경음 · 타임랩스. 장소는 경지 보상으로 해금. 배경음은 사용자 클릭 후 재생(자동재생 제한).', f: 'M10 M11 M12' },
    { t: '카메라 확인', d: '장치 선택, 미리보기, 얼굴 인식 박스.', f: 'M05' },
    { t: '사전 점검', d: '권한·얼굴 위치·조명을 미리 알려 판정 불가를 줄여요.', f: 'M05' },
    { t: '프라이버시 안내', d: '프레임은 브라우저 안에서만 처리하고 저장·전송하지 않아요.', f: 'M05' },
    { t: '폐관 시작', d: '세션 ID 생성 + 시작 이벤트 저장 후 폐관 수련 화면으로.', f: 'M01' },
  ] },
  { id: 'PC06', file: 'PC06_폐관수련', title: '폐관 수련 (몰입 화면)', route: '/focus/:sessionId', feats: ['M01', 'M05', 'M09', 'M10', 'M11', 'M12'], url: '/focus/2482', body: focusPage, notes: [
    { t: '현재 시각 · 시진', d: '실제 시각과 십이시진(미시 13–15시). 하늘색도 실제 시각을 따라 새벽→낮→노을→밤으로 바뀌어요.', f: 'M01' },
    { t: '폐관 중 표시', d: '사이드바 없이 과목·목표만. 다른 라우트 이동은 확인 후 일시정지(라우트 가드 유지).', f: 'M09' },
    { t: '해의 궤적 = 계획 시간', d: '입관(14:00)→출관 예정(15:00) 호를 해가 지나가요. 지나온 구간은 실선. 밤 수련은 달로 바뀜. 일주향은 남은 목표 시간만큼 타들어가요.', f: 'M01' },
    { t: '폐관 타이머', d: '순공·상태·목표. 링 = 목표 대비 진행. ❚❚ 일시정지(Space) · ■ 출관(Esc).', f: 'M01 M05' },
    { t: '경지 · 내공', d: '이번 수련으로 쌓이는 내공을 실시간 표시(+39). 링은 다음 경지까지 남은 내공.', f: 'M12' },
    { t: '접어 둔 도구', d: '수련 계획 · 수련 일지(이벤트 로그) · 카메라 미리보기는 기본 숨김 → 누르면 오른쪽 패널로 열림.', f: 'M01 M05' },
    { t: '기척(재실) 감지 한 줄', d: 'AI 판정 근거만 짧게 + 타임랩스 기록 점. 이탈·판정 불가는 장면 자체가 바뀌어 알려줘요 (PC07).', f: 'M05 M11' },
    { t: '배경음', d: '트랙·재생·볼륨만. 바꾸면 이전 소리 정지.', f: 'M10' },
    { t: '몰입 보기', d: '마우스가 3초 멈추면 시각·타이머만 남기고 나머지 UI를 흐리게. 움직이면 다시 표시.', f: 'M09' },
    { t: '출관', d: '종료 확인 후 수련 결과로. 항상 같은 자리(오른쪽 아래)에 고정.', f: 'M01' },
  ] },
  { id: 'PC08', file: 'PC08_수련결과', title: '수련 결과', route: '/focus/:sessionId/result', feats: ['M01', 'M02', 'M06', 'M11', 'M12'], url: '/focus/2482/result', body: result, notes: [
    { t: '확정된 순공', d: '서버가 이벤트 순서·중복을 확인해 확정한 시간과 상태별 합계.', f: 'M01' },
    { t: '구간 요약', d: '집중·일시정지·이탈·판정 불가를 한 줄로.', f: 'M02 M05' },
    { t: '저장 상태', d: '저장 실패 시 같은 세션 ID로 재시도 — 종료 기록은 한 건만.', f: 'M01' },
    { t: '계획 대비', d: '계획 완료 처리 + 달성률, 다음 계획 이어서 시작.', f: 'M06' },
    { t: '내공 획득', d: '조건 충족 시 1회 지급, 지급 조건을 체크리스트로.', f: 'M12' },
    { t: '타임랩스', d: '켠 세션만 생성. 재생·다운로드·삭제, 이 브라우저에만 보관.', f: 'M11' },
  ] },
  { id: 'PC09', file: 'PC09_수련록', title: '수련록', route: '/records', feats: ['M02', 'M03'], url: '/records?range=week&from=2026-11-23', body: records, notes: [
    { t: '필터', d: '과목·태그·측정 방식·시험별 조회. 사용자 시간대 자정 기준 집계.', f: 'M03 M02' },
    { t: '기간 요약', d: '순공·일 평균·세션 수·자리 이탈 합계.', f: 'M02' },
    { t: '요일별 순공 (과목 누적)', d: '목표선과 함께, 오늘 막대 강조.', f: 'M02 M03' },
    { t: '과목별 비율', d: '도넛 + 과목별 시간·비율.', f: 'M03' },
    { t: '월간 잔디', d: '날짜별 순공 강도. 날짜를 누르면 일간 보기로.', f: 'M02' },
    { t: '수련 목록', d: '구간 미니 바·보상까지. 행을 누르면 수련 상세. 같은 조건의 합계와 상세 합계가 일치해야 해요.', f: 'M02' },
  ] },
  { id: 'PC10', file: 'PC10_수련상세', title: '수련 상세', route: '/records/:sessionId', feats: ['M02', 'M05', 'M06', 'M11', 'M12'], url: '/records/2481', body: detail, notes: [
    { t: '세션 요약', d: '과목·목표·태그·측정 방식과 상태별 합계.', f: 'M02 M03' },
    { t: '구간 타임라인 (간트)', d: '시간 축 위에 구간과 주요 이벤트 라벨.', f: 'M02 M05' },
    { t: '이벤트 로그', d: '서버가 확정한 상태 이벤트(시각·원인·길이). 본인 기록만 조회.', f: 'M02 M05' },
    { t: '연결된 계획', d: '계획 vs 실제 비교.', f: 'M06' },
    { t: '보상 결과', d: '세션 ID 기준 1회 지급 결과.', f: 'M12' },
    { t: '타임랩스', d: '이 기기에 있으면 재생·저장·삭제, 없으면 \'다른 기기에서 생성\' 표시.', f: 'M11' },
  ] },
  { id: 'PC11', file: 'PC11_문파목록', title: '문파 목록', route: '/rooms', feats: ['M08'], url: '/rooms', body: roomsList, notes: [
    { t: '초대 코드로 참여', d: '6자리 코드 → 멤버십 확인 후 입장. 링크로도 진입 가능.', f: 'M08' },
    { t: '내 문파', d: '방별 멤버 상태·집중 인원·오늘 합계. 소규모(최대 4명).', f: 'M08' },
    { t: '개인 기록 안내', d: '방에서 잰 시간도 개인 세션으로 저장.', f: 'M01 M02' },
    { t: '문파 세우기', d: '이름·최대 인원·기본 공유 설정 → 초대 코드 생성·복사.', f: 'M08' },
  ] },
  { id: 'PC12', file: 'PC12_문파', title: '문파 (합동 수련)', route: '/rooms/:code', feats: ['M08', 'M01', 'M05'], url: '/rooms/A7K2Q9', body: room, notes: [
    { t: '연결 상태', d: 'WebSocket 연결 표시. 끊기면 재연결 중 배너.', f: 'M08' },
    { t: '멤버 타일', d: '동의한 영상만(WebRTC). 연결 중·실패·미공유·오프라인 상태를 구분하고, 영상이 실패해도 상태는 유지.', f: 'M08' },
    { t: '내 타이머', d: '그룹 안에서도 개인 세션으로 측정.', f: 'M01' },
    { t: '공유 · 감지 분리', d: '카메라 공유와 AI 감지는 별도 스위치. 끄거나 나가면 전송 즉시 종료.', f: 'M08 M05' },
    { t: '멤버 현황', d: '집중·휴식·종료·오프라인과 오늘 순공.', f: 'M08' },
    { t: '방 활동', d: '입장·휴식·연결 끊김 등 이벤트. 일정 시간 끊기면 오프라인 처리.', f: 'M08' },
  ] },
  { id: 'PC13', file: 'PC13_무인성장', title: '무인 성장 (경지 · 내공 · 비급)', route: '/growth', feats: ['M12', '추가: 성장'], url: '/growth', body: rewards, notes: [
    { t: '무인 카드', d: '현재 경지·내공·다음 경지까지 남은 양과 누적 지표. 초상은 수련 장면을 재사용(외형 커스터마이즈는 후속).', f: 'M12' },
    { t: '경지 사다리', d: '삼류→이류→일류→절정→초절정→화경→현경→생사경. 필요 내공은 예시 — 첫 주에 이류, 한 달 꾸준히 하면 일류가 목표.', f: 'M12' },
    { t: '내공 쌓는 법', d: '기존 보상 규칙(정상 종료·최소 25분·세션당 1회)을 내공으로 표현. 순공에 비례해 쌓이고 줄지 않음.', f: 'M12' },
    { t: '무공 성취', d: '과목별 누적 순공을 1~12성으로. 과목 색과 함께 표시.', f: 'M03 M02' },
    { t: '비급 수집', d: '기존 수집(배지)을 비급으로. 획득/잠김 + 획득 조건.', f: 'M12' },
    { t: '내공 획득 내역', d: '출관별 지급 결과와 미지급 사유. 계산식 예시를 함께.', f: 'M12' },
  ] },
  { id: 'PC14', file: 'PC14_설정', title: '설정 (과목·태그·D-Day·시간대)', route: '/settings', feats: ['M03', 'M07', 'M02'], url: '/settings/study', body: settings, notes: [
    { t: '과목 관리', d: '추가·수정·삭제(보관). 지난 기록의 과목 표시는 유지.', f: 'M03' },
    { t: '태그 관리', d: '사용 횟수와 함께 관리.', f: 'M03' },
    { t: '비무 D-Day 관리', d: '등록·수정·삭제, D-n 표기 규칙 안내.', f: 'M07' },
    { t: '시간·집계 설정', d: '시간대(자정 기준 집계), 하루 목표, 이탈 판정 시간.', f: 'M02 M05' },
  ] },
];
