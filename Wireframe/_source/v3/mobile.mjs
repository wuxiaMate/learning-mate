// v0.3 모바일 웹 (같은 반응형 웹을 폰 브라우저로 연 모습 · 390 × 844)
import { ic, HEX, mk, subj, legend, segbar, avatar, ph, check, field, select, ringSvg, donutSvg } from './core.mjs';
import { scene } from './scene.mjs';
import { focusTimer, realmBadge } from './pc.mjs';

const chrome = (path) => `<div class="sb"><b>9:41</b><span class="sbr"><i></i><i></i><i></i></span></div>
<div class="mbar"><div class="murl">${ic('lock', 13, HEX.muted)}<span><b>learningmate.app</b>${path}</span></div><span class="mtabs">3</span>${ic('moreV', 18)}</div>`;
const hdr = (title, right = '', m = '') => `<div class="mhdr"${mk(m)}>${ic('menu', 22)}<span class="t">${title}</span>${right || avatar('A', '', 'k')}</div>`;

/* W01 수련장 */
const dash = () => `${chrome('/')}${hdr('수련장', '', 1)}
<div class="mbody">
  <div class="card navy" style="padding:14px 16px"${mk(2)}><div class="row between"><span class="xs" style="color:var(--sky)">${ic('flag', 12, '#EFE2CB')} 비무 D-Day</span><span class="xs" style="color:var(--sky)">1 / 2</span></div><div class="row" style="gap:12px;margin-top:6px;align-items:flex-end"><b style="font-size:30px;line-height:1">D-12</b><div class="col"><b class="md">정보처리기사 필기</b><span class="xs" style="color:var(--sky)">12.06 (토)</span></div></div></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"${mk(3)}>
    ${[['오늘 순공', '2:14:30', '목표 4:00 · 56%'], ['이번 주', '18:42:10', '▲ 1:12 지난주 대비'], ['계획 달성', '2 / 5', '남은 3개'], ['연속 수련', '6일', '최고 14일']].map(([a, b, c]) => `<div class="card kpi" style="padding:12px 14px"><div class="k-l" style="font-size:11.5px">${a}</div><div class="k-v" style="font-size:22px;margin-top:4px">${b}</div><div class="k-s" style="font-size:11px;margin-top:4px">${c}</div></div>`).join('')}
  </div>
  <div class="row between"><b>오늘의 수련 계획</b><span class="link">${ic('plus', 13, HEX.blue)}추가</span></div>
  <div class="col" style="gap:8px"${mk(4)}>
    ${[['09:00', 'algo', '백준 DP 3문제', 'done', '1:24:36'], ['14:00', 'db', '정규화 개념 정리', 'now'], ['16:00', 'exam', '필기 기출 1회분', 'todo']].map(([t, s, g, st, a]) => `<div class="card row" style="padding:11px 12px;gap:10px;${st === 'now' ? 'border-color:var(--blue2);background:#FAECE6' : ''}"><span class="sm num w7 ${st === 'done' ? 'muted2' : ''}" style="width:40px">${t}</span><div class="col grow" style="gap:3px;${st === 'done' ? 'opacity:.6' : ''}">${subj(s)}<b class="md" style="${st === 'done' ? 'text-decoration:line-through' : ''}">${g}</b></div>${st === 'done' ? `<span class="xs blue w7 num">${a}</span>` : `<span class="btn sm ${st === 'now' ? '' : 'o'}" style="padding:0 10px">${ic('play', 11, st === 'now' ? '#fff' : HEX.blue)}</span>`}</div>`).join('')}
  </div>
</div>
<div class="mcta"${mk(5)}><span class="btn lg grow">${ic('play', 14, '#fff')}바로 폐관 수련</span></div>`;

/* W02 메뉴 드로어 */
const drawer = () => `${chrome('/')}${hdr('수련장')}
<div class="mbody"><div class="card" style="height:120px"></div><div class="card" style="height:220px"></div></div>
<div class="dim" style="top:94px"></div>
<div class="drawer" style="top:94px"${mk(1)}>
  <div class="row between"><div class="logo" style="margin:0;padding:0"><i>修</i>LearningMate</div>${ic('x', 20, '#BFB3A0')}</div>
  <div class="row" style="gap:10px;margin:20px 0 14px;padding:12px;border-radius:12px;background:#26201A">${avatar('A', '', 'k')}<div class="col"><b class="md">김싸피</b><span class="xs" style="color:#BFB3A0">이류 고수 · 내공 1,380</span></div></div>
  <div class="nav"${mk(2)}>${[['home', '수련장', 1], ['calendar', '수련 계획'], ['timer', '폐관 수련'], ['chart', '수련록'], ['users', '문파'], ['gift', '무인 성장'], ['settings', '설정']].map(([i, t, on]) => `<div class="it${on ? ' on' : ''}">${ic(i, 18, on ? '#fff' : '#BFB3A0')}${t}</div>`).join('')}</div>
  <div class="fill"></div>
  <div class="livecard" style="margin:0 0 10px"${mk(3)}><div class="row xs" style="color:#BFB3A0;gap:6px">${ic('phone', 13, '#C9A15B')}앱처럼 쓰기</div><div class="sm" style="margin-top:6px;line-height:1.5">브라우저 메뉴 → <b>홈 화면에 추가</b>하면 전체 화면으로 열려요</div></div>
  <div class="row xs" style="color:#857865;gap:6px">${ic('logout', 14, '#857865')}로그아웃</div>
</div>`;

/* W03 학습 시작 + 카메라 권한 */
const perm = () => `${chrome('/focus/new')}${hdr('폐관 준비', ic('x', 20))}
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
<div class="dim" style="top:94px;background:rgba(28,24,20,.35)"></div>
<div class="perm" style="top:104px"${mk(1)}>
  <div class="row" style="gap:10px"><span style="width:36px;height:36px;border-radius:50%;background:var(--tint);display:grid;place-items:center">${ic('camera', 18, HEX.navy)}</span><div class="col"><b class="md">learningmate.app에서<br>카메라 사용을 요청합니다</b><span class="xs muted">브라우저 권한 요청 (OS·브라우저마다 모양이 달라요)</span></div></div>
  <div class="row" style="gap:8px;margin-top:14px;justify-content:flex-end"><span class="btn sm g">차단</span><span class="btn sm">이번 방문 동안 허용</span></div>
</div>
<div class="card" style="position:absolute;left:16px;right:16px;bottom:100px;z-index:22;padding:12px 14px"${mk(2)}><div class="row" style="gap:10px">${ic('info', 16, HEX.blue)}<span class="sm" style="line-height:1.5">거부해도 <b>수동 모드</b>로 바로 측정할 수 있어요. 나중에 주소창 ${ic('lock', 11, HEX.muted)} 에서 다시 허용할 수 있어요.</span></div></div>`;

/* W04 폐관 수련 (몰입 화면 · 세로) */
const focus = () => `${chrome('/focus/2482')}
<div style="position:relative;flex:1;overflow:hidden">
  ${scene({ t: 0.65, hour: 14.65, arc: [530, 910], labels: ['14:00', '15:00'] })}
  <div style="position:absolute;left:18px;top:14px"${mk(1)}><div class="xs w7 ink" style="opacity:.72">11.24 (화) · 미시</div><div class="serif ink" style="font-size:34px;font-weight:700;line-height:1.05">14:39</div></div>
  <div style="position:absolute;left:16px;top:76px"${mk(2)}>${realmBadge(60)}</div>
  <div style="position:absolute;right:12px;top:10px"${mk(3)}>${focusTimer(156, { sub: '목표 1:00:00', status: '재실' })}</div>
  <div class="glass row" style="position:absolute;left:14px;right:14px;bottom:76px;height:46px;border-radius:999px;padding:0 8px 0 14px;gap:10px"${mk(4)}>${ic('music', 16, HEX.blue)}<b class="sm serif grow">죽림 빗소리</b><span class="fab" style="width:32px;height:32px;border:1.5px solid var(--black)">${ic('pause', 12, HEX.black)}</span>${ic('chevD', 16, HEX.muted)}</div>
  <div class="row" style="position:absolute;left:14px;right:14px;bottom:14px;gap:10px">
    <div class="glass row grow" style="height:48px;border-radius:999px;padding:0 12px 0 6px;gap:8px"${mk(5)}><span class="fab" style="width:34px;height:34px;background:var(--black)">${ic('camera', 15, '#F8F2E7')}</span><div class="col"><b class="xs">기척 있음 · AI 감지</b><span class="xs muted" style="font-size:10.5px">화면 켜짐 유지 · 타임랩스</span></div></div>
    <span class="glass fab" style="width:48px;height:48px"${mk(6)}>${ic('list', 18, HEX.black)}</span>
    <span class="fab" style="width:52px;height:52px;background:var(--blue)"${mk(7)}>${ic('stop', 18, '#F8F2E7')}</span>
  </div>
</div>
<div class="home-ind"><i></i></div>`;

/* W05 기록 */
const records = () => `${chrome('/records')}${hdr('수련록')}
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

/* W06 문파 */
const room = () => `${chrome('/rooms/A7K2Q9')}${hdr('SSAFY 알고리즘', `<span class="row xs muted" style="gap:4px">${ic('wifi', 14, HEX.blue)}연결됨</span>`)}
<div class="mbody" style="gap:10px">
  <div class="row sm" style="gap:12px"><span class="row" style="gap:5px"><span class="dot d-f"></span>집중 3</span><span class="row" style="gap:5px"><span class="dot d-p"></span>휴식 1</span><span class="row" style="gap:5px"><span class="dot d-o"></span>오프라인 1</span><span class="grow"></span><span class="chip sm">${ic('copy', 11, HEX.muted)}A7K2Q9</span></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"${mk(1)}>
    ${[['나', 'f', '00:52:18', 'cam', 1], ['민수', 'f', '02:05:11', 'cam'], ['하늘', 'f', '연결 중…', 'conn'], ['지현', 'p', '휴식 05:12', '']].map(([n, st, t, c, me]) => `<div style="position:relative;height:150px;border-radius:12px;overflow:hidden;${me ? 'border:2.5px solid var(--blue)' : ''}">${c === 'cam' ? `<div class="ph dark" style="position:absolute;inset:0;border-radius:0"><div class="face" style="width:34%"></div></div>` : c === 'conn' ? `<div style="position:absolute;inset:0;background:#26201A;display:grid;place-items:center">${ic('refresh', 20, '#C9A15B')}</div>` : `<div style="position:absolute;inset:0;background:var(--tint);border:1px solid var(--line);border-radius:12px;display:grid;place-items:center">${avatar(n[0], '', 'lg')}</div>`}<div class="row" style="position:absolute;left:6px;right:6px;bottom:6px;background:#fff;border-radius:8px;padding:4px 8px;gap:5px"><span class="dot d-${st}"></span><b class="xs">${n}</b><span class="xs muted grow" style="text-align:right">${t}</span></div></div>`).join('')}
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
  { id: 'W01', file: 'W01_수련장_모바일웹', title: '수련장 · 모바일 웹', route: '/', feats: ['M01', 'M02', 'M06', 'M07'], body: dash, notes: [
    { t: '웹 헤더 + 메뉴', d: '앱 탭바 대신 햄버거 메뉴(드로어). PC 사이드바와 같은 메뉴 구조.', f: '반응형' },
    { t: '비무 D-Day', d: 'PC 카드가 한 줄 배너로 접혀요. 좌우로 넘겨 여러 시험 확인.', f: 'M07' },
    { t: 'KPI 2×2', d: 'PC 4열 → 모바일 2열.', f: 'M02' },
    { t: '오늘의 수련 계획', d: '시간·과목·목표만 남기고 ▶ 버튼으로 바로 시작.', f: 'M06 M01' },
    { t: '하단 고정 CTA', d: '스크롤해도 \'바로 폐관 수련\'이 보이도록 sticky 버튼.', f: 'M01' },
  ] },
  { id: 'W02', file: 'W02_메뉴드로어_모바일웹', title: '메뉴 드로어 · 모바일 웹', route: '/ · menu open', feats: ['반응형'], body: drawer, notes: [
    { t: '드로어 내비게이션', d: '헤더 ☰ 로 열고 바깥 영역·✕ 로 닫아요. 768px 미만에서만 사용.', f: '반응형' },
    { t: '메뉴 구성', d: 'PC 사이드바와 동일한 7개 메뉴 — 라우트 공유.', f: '반응형' },
    { t: '홈 화면에 추가 (선택)', d: 'PWA로 설치하면 주소창 없이 앱처럼 테스트 가능. 별도 앱 개발 불필요.', f: '테스트' },
  ] },
  { id: 'W03', file: 'W03_폐관준비_권한_모바일웹', title: '학습 시작 + 카메라 권한 · 모바일 웹', route: '/focus/new', feats: ['M05', 'M01'], body: perm, notes: [
    { t: '브라우저 권한 요청', d: 'AI 감지를 고르면 getUserMedia로 카메라 권한 요청. HTTPS 주소에서만 뜨고, 폰 실기기에서 먼저 검증해요.', f: 'M05' },
    { t: '거부해도 진행 가능', d: '거부 시 수동 모드로 바로 측정. 주소창 자물쇠에서 다시 허용하는 방법 안내.', f: 'M05 M01' },
  ] },
  { id: 'W04', file: 'W04_폐관수련_모바일웹', title: '폐관 수련 · 모바일 웹', route: '/focus/:sessionId', feats: ['M01', 'M05', 'M09', 'M10', 'M11'], body: focus, notes: [
    { t: '시각 · 시진', d: 'PC와 같은 장면을 세로로 잘라 인물·향을 가운데에. 하늘은 실제 시각.', f: 'M01' },
    { t: '경지 · 내공', d: '이번 수련으로 쌓이는 내공. 탭하면 무인 성장.', f: 'M12' },
    { t: '폐관 타이머', d: '해의 궤적은 화면 폭에 맞춰 좁게(14:00→15:00). ❚❚ 일시정지 · ■ 출관.', f: 'M01' },
    { t: '배경음 미니 플레이어', d: '접힌 상태로 재생, ⌄ 로 트랙 목록.', f: 'M10' },
    { t: '기척 감지 · 화면 유지', d: '카메라 미리보기 대신 한 줄 상태. Wake Lock으로 화면 꺼짐 방지.', f: 'M05 M09 M11' },
    { t: '접어 둔 도구', d: '수련 계획·일지·카메라는 바텀시트로.', f: 'M01' },
    { t: '출관', d: '엄지 영역 오른쪽 아래 고정.', f: 'M01' },
  ] },
  { id: 'W05', file: 'W05_수련록_모바일웹', title: '수련록 · 모바일 웹', route: '/records', feats: ['M02', 'M03'], body: records, notes: [
    { t: '기간 전환 · 필터', d: '필터 칩은 가로 스크롤.', f: 'M02 M03' },
    { t: '요약 + 차트', d: 'PC의 KPI·막대·도넛을 세로로 쌓아요.', f: 'M02' },
    { t: '세션 카드 리스트', d: 'PC 표 → 카드. 구간 미니 바 유지.', f: 'M02' },
  ] },
  { id: 'W06', file: 'W06_문파_모바일웹', title: '문파 · 모바일 웹', route: '/rooms/:code', feats: ['M08', 'M01', 'M05'], body: room, notes: [
    { t: '멤버 타일 2열', d: 'PC 3열 → 2열. 넘치는 멤버는 아래 목록으로.', f: 'M08' },
    { t: '공유 · 감지 스위치', d: '카메라 공유와 AI 감지를 따로 제어.', f: 'M08 M05' },
    { t: '내 타이머 하단 고정', d: '타이머·일시정지·종료를 sticky 바로.', f: 'M01' },
  ] },
];
