// v0.2 모바일 웹 (같은 반응형 웹을 폰 브라우저로 연 모습 · 390 × 844)
import { ic, HEX, mk, subj, legend, segbar, avatar, ph, check, field, select, ringSvg, donutSvg } from './core.mjs';

const chrome = (path) => `<div class="sb"><b>9:41</b><span class="sbr"><i></i><i></i><i></i></span></div>
<div class="mbar"><div class="murl">${ic('lock', 13, HEX.muted)}<span><b>learningmate.app</b>${path}</span></div><span class="mtabs">3</span>${ic('moreV', 18)}</div>`;
const hdr = (title, right = '', m = '') => `<div class="mhdr"${mk(m)}>${ic('menu', 22)}<span class="t">${title}</span>${right || avatar('A', '', 'k')}</div>`;

/* W01 대시보드 */
const dash = () => `${chrome('/')}${hdr('대시보드', '', 1)}
<div class="mbody">
  <div class="card navy" style="padding:14px 16px"${mk(2)}><div class="row between"><span class="xs" style="color:var(--sky)">${ic('flag', 12, '#DCE8FF')} 시험 D-Day</span><span class="xs" style="color:var(--sky)">1 / 2</span></div><div class="row" style="gap:12px;margin-top:6px;align-items:flex-end"><b style="font-size:30px;line-height:1">D-12</b><div class="col"><b class="md">정보처리기사 필기</b><span class="xs" style="color:var(--sky)">12.06 (토)</span></div></div></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"${mk(3)}>
    ${[['오늘 순공', '2:14:30', '목표 4:00 · 56%'], ['이번 주', '18:42:10', '▲ 1:12 지난주 대비'], ['계획 달성', '2 / 5', '남은 3개'], ['연속 학습', '6일', '최고 14일']].map(([a, b, c]) => `<div class="card kpi" style="padding:12px 14px"><div class="k-l" style="font-size:11.5px">${a}</div><div class="k-v" style="font-size:22px;margin-top:4px">${b}</div><div class="k-s" style="font-size:11px;margin-top:4px">${c}</div></div>`).join('')}
  </div>
  <div class="row between"><b>오늘의 계획</b><span class="link">${ic('plus', 13, HEX.blue)}추가</span></div>
  <div class="col" style="gap:8px"${mk(4)}>
    ${[['09:00', 'algo', '백준 DP 3문제', 'done', '1:24:36'], ['14:00', 'db', '정규화 개념 정리', 'now'], ['16:00', 'exam', '필기 기출 1회분', 'todo']].map(([t, s, g, st, a]) => `<div class="card row" style="padding:11px 12px;gap:10px;${st === 'now' ? 'border-color:var(--blue2);background:#F0F5FF' : ''}"><span class="sm num w7 ${st === 'done' ? 'muted2' : ''}" style="width:40px">${t}</span><div class="col grow" style="gap:3px;${st === 'done' ? 'opacity:.6' : ''}">${subj(s)}<b class="md" style="${st === 'done' ? 'text-decoration:line-through' : ''}">${g}</b></div>${st === 'done' ? `<span class="xs blue w7 num">${a}</span>` : `<span class="btn sm ${st === 'now' ? '' : 'o'}" style="padding:0 10px">${ic('play', 11, st === 'now' ? '#fff' : HEX.blue)}</span>`}</div>`).join('')}
  </div>
</div>
<div class="mcta"${mk(5)}><span class="btn lg grow">${ic('play', 14, '#fff')}바로 집중 시작</span></div>`;

/* W02 메뉴 드로어 */
const drawer = () => `${chrome('/')}${hdr('대시보드')}
<div class="mbody"><div class="card" style="height:120px"></div><div class="card" style="height:220px"></div></div>
<div class="dim" style="top:94px"></div>
<div class="drawer" style="top:94px"${mk(1)}>
  <div class="row between"><div class="logo" style="margin:0;padding:0"><i>L</i>LearningMate</div>${ic('x', 20, '#AEB9D3')}</div>
  <div class="row" style="gap:10px;margin:20px 0 14px;padding:12px;border-radius:12px;background:#141B2D">${avatar('A', '', 'k')}<div class="col"><b class="md">테스트 계정 A</b><span class="xs" style="color:#AEB9D3">1,380P · 연속 6일</span></div></div>
  <div class="nav"${mk(2)}>${[['home', '대시보드', 1], ['calendar', '플래너'], ['timer', '집중하기'], ['chart', '기록·통계'], ['users', '스터디방'], ['gift', '보상·수집'], ['settings', '설정']].map(([i, t, on]) => `<div class="it${on ? ' on' : ''}">${ic(i, 18, on ? '#fff' : '#AEB9D3')}${t}</div>`).join('')}</div>
  <div class="fill"></div>
  <div class="livecard" style="margin:0 0 10px"${mk(3)}><div class="row xs" style="color:#AEB9D3;gap:6px">${ic('phone', 13, '#6E9BF5')}앱처럼 쓰기</div><div class="sm" style="margin-top:6px;line-height:1.5">브라우저 메뉴 → <b>홈 화면에 추가</b>하면 전체 화면으로 열려요</div></div>
  <div class="row xs" style="color:#5F6B85;gap:6px">${ic('logout', 14, '#5F6B85')}로그아웃</div>
</div>`;

/* W03 학습 시작 + 카메라 권한 */
const perm = () => `${chrome('/focus/new')}${hdr('집중 시작하기', ic('x', 20))}
<div class="mbody" style="gap:10px">
  ${field('연결된 계획', select('<span class="sm">14:00–15:00 · 정규화 개념 정리</span>'))}
  <div class="row" style="gap:6px">${subj('db')}<span class="tag">#정처기</span></div>
  <div class="seg dark"><span class="on">AI 카메라 감지</span><span>수동</span></div>
  <div style="position:relative">${ph('100%', '210px', '', `<div class="face" style="width:30%"></div>`)}<span class="chip sm k" style="position:absolute;left:10px;bottom:10px;z-index:3">${ic('camera', 12, '#fff')}권한 대기 중</span></div>
  <div class="card" style="padding:4px 14px">
    <div class="row between" style="height:44px"><span class="row md">${ic('music', 16, HEX.navy)}배경음 · 빗소리</span><span class="toggle on"></span></div>
    <div class="divider"></div>
    <div class="row between" style="height:44px"><span class="row md">${ic('video', 16, HEX.navy)}타임랩스 · 10초</span><span class="toggle on"></span></div>
  </div>
</div>
<div class="mcta"><span class="btn lg grow dis">${ic('play', 14, HEX.muted2)}집중 시작</span></div>
<div class="dim" style="top:94px;background:rgba(11,15,25,.35)"></div>
<div class="perm" style="top:104px"${mk(1)}>
  <div class="row" style="gap:10px"><span style="width:36px;height:36px;border-radius:50%;background:var(--tint);display:grid;place-items:center">${ic('camera', 18, HEX.navy)}</span><div class="col"><b class="md">learningmate.app에서<br>카메라 사용을 요청합니다</b><span class="xs muted">브라우저 권한 요청 (OS·브라우저마다 모양이 달라요)</span></div></div>
  <div class="row" style="gap:8px;margin-top:14px;justify-content:flex-end"><span class="btn sm g">차단</span><span class="btn sm">이번 방문 동안 허용</span></div>
</div>
<div class="card" style="position:absolute;left:16px;right:16px;bottom:100px;z-index:22;padding:12px 14px"${mk(2)}><div class="row" style="gap:10px">${ic('info', 16, HEX.blue)}<span class="sm" style="line-height:1.5">거부해도 <b>수동 모드</b>로 바로 측정할 수 있어요. 나중에 주소창 ${ic('lock', 11, HEX.muted)} 에서 다시 허용할 수 있어요.</span></div></div>`;

/* W04 집중 세션 */
const focus = () => `${chrome('/focus/2482')}
<div class="mhdr"${mk(1)}><span class="chip sm k">${ic('lock', 12, '#fff')}집중 모드</span><span class="t" style="font-size:14px">${''}정규화 개념 정리</span><span class="row xs muted" style="gap:4px">${ic('sun', 14, HEX.blue)}화면 켜짐</span></div>
<div class="mbody" style="align-items:center;gap:12px;padding-top:16px">
  <div class="row" style="gap:8px;width:100%;justify-content:space-between"><span class="pill sm st-focus"${mk(2)}><i></i>재실 · 집중 중</span>
    <div style="position:relative;width:78px;height:100px"${mk(3)}>${ph('78px', '100px', '', `<div class="face" style="width:56%"></div>`)}<span class="rec" style="position:absolute;right:6px;top:6px;z-index:3"></span></div></div>
  <div class="ring" style="width:250px;height:250px;margin-top:-30px"${mk(4)}>${ringSvg(250, 12, 0.65)}<div class="in"><span class="xs muted w7">순공 시간</span><div class="timer" style="font-size:50px">00:39:12</div><span class="xs muted">목표 1:00:00</span></div></div>
  <div class="col" style="gap:6px;width:100%">${segbar([['f', 19], ['p', 2], ['f', 15], ['a', 1], ['f', 7], ['e', 16]], 12)}<div class="row between xs muted2 num"><span>14:02</span><span>15:00</span></div></div>
  <div class="row" style="gap:36px;margin-top:4px"${mk(5)}>
    <div class="col" style="align-items:center;gap:5px"><span class="rb out" style="width:64px;height:64px">${ic('pause', 22, HEX.navy)}</span><span class="xs w7">일시정지</span></div>
    <div class="col" style="align-items:center;gap:5px"><span class="rb k" style="width:64px;height:64px">${ic('stop', 20, '#fff')}</span><span class="xs w7">종료</span></div>
  </div>
  <div class="fill" style="flex:1"></div>
  <div class="card row" style="width:100%;padding:10px 14px;gap:10px"${mk(6)}>${ic('music', 17, HEX.blue)}<div class="col grow"><b class="md">빗소리</b><div class="slider" style="margin-top:10px;flex:none;width:100%"><i style="width:60%"></i></div></div><span class="iconbtn" style="width:36px;height:36px">${ic('pause', 13, HEX.navy)}</span><span class="iconbtn" style="width:36px;height:36px">${ic('chevD', 15)}</span></div>
</div>
<div class="home-ind"><i></i></div>`;

/* W05 기록 */
const records = () => `${chrome('/records')}${hdr('기록·통계')}
<div class="mbody" style="gap:10px">
  <div class="seg"${mk(1)}><span>일간</span><span class="on">주간</span><span>월간</span></div>
  <div class="row between"><span>${ic('chevL', 16, HEX.muted)}</span><b class="md">11.23 – 11.29</b><span>${ic('chevR', 16, HEX.muted)}</span></div>
  <div class="row" style="gap:6px;overflow:hidden"><span class="chip sm n">과목: 전체 ${ic('chevD', 11, '#fff')}</span><span class="chip sm">태그 ${ic('chevD', 11, HEX.muted)}</span><span class="chip sm">측정 ${ic('chevD', 11, HEX.muted)}</span></div>
  <div class="card" style="padding:14px"${mk(2)}>
    <div class="row between"><span class="sm muted w7">이번 주 순공</span><span class="xs blue w7">▲ 1:12</span></div>
    <div class="timer" style="font-size:28px;margin-top:6px">18:42:10</div>
    <div class="bars" style="height:86px;margin-top:12px">${[62, 88, 40, 70, 55, 96, 30].map((h, i) => `<div><i style="display:block;width:100%;height:${h}%;border-radius:5px 5px 2px 2px;background:${i === 1 ? 'var(--navy)' : 'var(--blue2)'}"></i><small>${'월화수목금토일'[i]}</small></div>`).join('')}</div>
  </div>
  <div class="card row" style="padding:12px 14px;gap:14px"><div class="donut" style="width:66px;height:66px;position:relative">${donutSvg(66, [[HEX.blue, 0.42], [HEX.blue2, 0.28], [HEX.navy, 0.18], [HEX.black, 0.12]], 0.26)}</div><div class="col grow" style="gap:4px">${[['algo', '42%'], ['eng', '28%'], ['db', '18%']].map(([s, p]) => `<div class="row between">${subj(s)}<span class="xs num muted">${p}</span></div>`).join('')}</div></div>
  <b class="md">세션 <span class="muted">12</span></b>
  <div class="col" style="gap:8px"${mk(3)}>
    ${[['11.24 14:02', 'db', '정규화 개념 정리', '0:58:40', [['f', 19], ['p', 2], ['f', 15], ['a', 1], ['f', 14], ['a', 2], ['f', 11]]], ['11.24 09:02', 'algo', '백준 DP 3문제', '1:24:36', [['f', 32], ['p', 12], ['f', 28], ['a', 3], ['f', 20], ['u', 2], ['f', 6]]]].map(([d, s, g, t, sg]) => `<div class="card" style="padding:11px 12px"><div class="row between"><span class="xs muted num">${d}</span><b class="num">${t}</b></div><div class="row" style="margin-top:4px">${subj(s)}<span class="md grow">${g}</span>${ic('chevR', 14, HEX.muted)}</div><div style="margin-top:8px">${segbar(sg, 6)}</div></div>`).join('')}
  </div>
</div>`;

/* W06 스터디방 */
const room = () => `${chrome('/rooms/A7K2Q9')}${hdr('SSAFY 알고리즘', `<span class="row xs muted" style="gap:4px">${ic('wifi', 14, HEX.blue)}연결됨</span>`)}
<div class="mbody" style="gap:10px">
  <div class="row sm" style="gap:12px"><span class="row" style="gap:5px"><span class="dot d-f"></span>집중 3</span><span class="row" style="gap:5px"><span class="dot d-p"></span>휴식 1</span><span class="row" style="gap:5px"><span class="dot d-o"></span>오프라인 1</span><span class="grow"></span><span class="chip sm">${ic('copy', 11, HEX.muted)}A7K2Q9</span></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"${mk(1)}>
    ${[['나', 'f', '00:52:18', 'cam', 1], ['민수', 'f', '02:05:11', 'cam'], ['하늘', 'f', '연결 중…', 'conn'], ['지현', 'p', '휴식 05:12', '']].map(([n, st, t, c, me]) => `<div style="position:relative;height:150px;border-radius:12px;overflow:hidden;${me ? 'border:2.5px solid var(--blue)' : ''}">${c === 'cam' ? `<div class="ph dark" style="position:absolute;inset:0;border-radius:0"><div class="face" style="width:34%"></div></div>` : c === 'conn' ? `<div style="position:absolute;inset:0;background:#141B2D;display:grid;place-items:center">${ic('refresh', 20, '#6E9BF5')}</div>` : `<div style="position:absolute;inset:0;background:var(--tint);border:1px solid var(--line);border-radius:12px;display:grid;place-items:center">${avatar(n[0], '', 'lg')}</div>`}<div class="row" style="position:absolute;left:6px;right:6px;bottom:6px;background:#fff;border-radius:8px;padding:4px 8px;gap:5px"><span class="dot d-${st}"></span><b class="xs">${n}</b><span class="xs muted grow" style="text-align:right">${t}</span></div></div>`).join('')}
  </div>
  <div class="row xs muted" style="gap:6px">${ic('user', 13, HEX.muted)}도윤 · 오프라인 3분 전</div>
  <div class="card" style="padding:4px 14px"${mk(2)}>
    <div class="row between" style="height:44px"><span class="row md">${ic('video', 16, HEX.navy)}내 카메라 공유</span><span class="toggle on"></span></div>
    <div class="divider"></div>
    <div class="row between" style="height:44px"><span class="row md">${ic('camera', 16, HEX.navy)}AI 재실 감지</span><span class="toggle on"></span></div>
  </div>
</div>
<div class="mcta" style="align-items:center;gap:10px"${mk(3)}><div class="col grow"><span class="xs muted">내 타이머 · 재실</span><b class="timer" style="font-size:24px">00:52:18</b></div><span class="rb out" style="width:44px;height:44px">${ic('pause', 15, HEX.navy)}</span><span class="rb k" style="width:44px;height:44px">${ic('stop', 14, '#fff')}</span></div>`;

export const MOBILE = [
  { id: 'W01', file: 'W01_대시보드_모바일웹', title: '대시보드 · 모바일 웹', route: '/', feats: ['M01', 'M02', 'M06', 'M07'], body: dash, notes: [
    { t: '웹 헤더 + 메뉴', d: '앱 탭바 대신 햄버거 메뉴(드로어). PC 사이드바와 같은 메뉴 구조.', f: '반응형' },
    { t: '시험 D-Day', d: 'PC 카드가 한 줄 배너로 접혀요. 좌우로 넘겨 여러 시험 확인.', f: 'M07' },
    { t: 'KPI 2×2', d: 'PC 4열 → 모바일 2열.', f: 'M02' },
    { t: '오늘의 계획', d: '시간·과목·목표만 남기고 ▶ 버튼으로 바로 시작.', f: 'M06 M01' },
    { t: '하단 고정 CTA', d: '스크롤해도 \'바로 집중 시작\'이 보이도록 sticky 버튼.', f: 'M01' },
  ] },
  { id: 'W02', file: 'W02_메뉴드로어_모바일웹', title: '메뉴 드로어 · 모바일 웹', route: '/ · menu open', feats: ['반응형'], body: drawer, notes: [
    { t: '드로어 내비게이션', d: '헤더 ☰ 로 열고 바깥 영역·✕ 로 닫아요. 768px 미만에서만 사용.', f: '반응형' },
    { t: '메뉴 구성', d: 'PC 사이드바와 동일한 7개 메뉴 — 라우트 공유.', f: '반응형' },
    { t: '홈 화면에 추가 (선택)', d: 'PWA로 설치하면 주소창 없이 앱처럼 테스트 가능. 별도 앱 개발 불필요.', f: '테스트' },
  ] },
  { id: 'W03', file: 'W03_학습시작_권한_모바일웹', title: '학습 시작 + 카메라 권한 · 모바일 웹', route: '/focus/new', feats: ['M05', 'M01'], body: perm, notes: [
    { t: '브라우저 권한 요청', d: 'AI 감지를 고르면 getUserMedia로 카메라 권한 요청. HTTPS 주소에서만 뜨고, 폰 실기기에서 먼저 검증해요.', f: 'M05' },
    { t: '거부해도 진행 가능', d: '거부 시 수동 모드로 바로 측정. 주소창 자물쇠에서 다시 허용하는 방법 안내.', f: 'M05 M01' },
  ] },
  { id: 'W04', file: 'W04_집중세션_모바일웹', title: '집중 세션 · 모바일 웹', route: '/focus/:sessionId', feats: ['M01', 'M05', 'M09', 'M10', 'M11'], body: focus, notes: [
    { t: '집중 모드 헤더', d: '메뉴 대신 집중 모드 표시. Wake Lock으로 화면 꺼짐을 막고 상태를 표시.', f: 'M09' },
    { t: '현재 판정', d: '재실·이탈·판정 불가·수동 배지.', f: 'M05' },
    { t: '카메라 PIP', d: '작은 미리보기 + 타임랩스 녹화 점. 탭하면 크게 보기.', f: 'M05 M11' },
    { t: '순공 타이머', d: '시작 시각 기준으로 계산해 백그라운드 탭에서도 정확하게.', f: 'M01' },
    { t: '컨트롤', d: '일시정지·종료를 엄지 영역에 배치.', f: 'M01' },
    { t: '배경음 미니 플레이어', d: '접힌 상태로 재생·볼륨, ⌄ 로 트랙 목록.', f: 'M10' },
  ] },
  { id: 'W05', file: 'W05_기록통계_모바일웹', title: '기록·통계 · 모바일 웹', route: '/records', feats: ['M02', 'M03'], body: records, notes: [
    { t: '기간 전환 · 필터', d: '필터 칩은 가로 스크롤.', f: 'M02 M03' },
    { t: '요약 + 차트', d: 'PC의 KPI·막대·도넛을 세로로 쌓아요.', f: 'M02' },
    { t: '세션 카드 리스트', d: 'PC 표 → 카드. 구간 미니 바 유지.', f: 'M02' },
  ] },
  { id: 'W06', file: 'W06_스터디방_모바일웹', title: '스터디방 · 모바일 웹', route: '/rooms/:code', feats: ['M08', 'M01', 'M05'], body: room, notes: [
    { t: '멤버 타일 2열', d: 'PC 3열 → 2열. 넘치는 멤버는 아래 목록으로.', f: 'M08' },
    { t: '공유 · 감지 스위치', d: '카메라 공유와 AI 감지를 따로 제어.', f: 'M08 M05' },
    { t: '내 타이머 하단 고정', d: '타이머·일시정지·종료를 sticky 바로.', f: 'M01' },
  ] },
];
