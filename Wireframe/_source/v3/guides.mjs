// v0.3 가이드 보드: 사이트맵·흐름 / 반응형·실기기 테스트 / 컴포넌트·상태 / 폐관 수련 상태 정의
import { ic, HEX, mk, subj, legend, segbar, avatar, ph, check, field, select, ringSvg } from './core.mjs';
import { scene } from './scene.mjs';

const box = (title, path, ids, cls = '') => `<div class="${cls}" style="width:124px;border-radius:12px;padding:10px 10px;text-align:center;${cls === 'root' ? '' : 'background:#fff;border:1.5px solid var(--line)'}"><b class="md" style="display:block;letter-spacing:-.3px">${title}</b><span class="xs muted" style="display:block;margin-top:2px">${path}</span>${ids ? `<span class="xs w8 blue" style="display:block;margin-top:5px">${ids}</span>` : ''}</div>`;
const vl = (h = 18) => `<i style="display:block;width:2px;height:${h}px;background:var(--blue2)"></i>`;

/* ================================================================== */
/* G01 사이트맵 · 사용자 흐름                                           */
/* ================================================================== */
const sitemap = () => {
  const cols = [
    [['로그인', '/login', 'PC01']],
    [['수련장', '/', 'PC02 · W01']],
    [['수련 계획', '/planner', 'PC03'], ['수련 계획 추가 모달', '?new=1', 'PC04']],
    [['폐관 수련', '/focus/new', 'PC05 · W03'], ['폐관 수련', '/focus/:id', 'PC06 · W04'], ['수련 결과', '/focus/:id/result', 'PC08']],
    [['수련록', '/records', 'PC09 · W05'], ['수련 상세', '/records/:id', 'PC10']],
    [['문파', '/rooms', 'PC11'], ['합동 수련', '/rooms/:code', 'PC12 · W06']],
    [['무인 성장', '/growth', 'PC13']],
    [['설정', '/settings', 'PC14']],
  ];
  const scen = [
    ['1', '계획에서 학습 시작', 'M01–M03 · M06–M07', [['수련장 · 수련 계획', ''], ['계획 ▶ 시작', 'on'], ['폐관 준비', ''], ['폐관 수련', ''], ['수련 결과', ''], ['수련록', '']], '비무 D-Day와 계획을 확인하고 시작 → 종료 후 계획과 통계에 집중 시간 반영'],
    ['2', '카메라 이탈과 복귀', 'M01–M02 · M05', [['폐관 수련 (재실)', ''], ['자리 이탈 감지', 'k'], ['복귀 · 자동 재개', 'on'], ['수련 상세 (이탈 구간)', '']], '권한 거부·연결 끊김·가림 → 안내와 수동 전환'],
    ['3', '두 계정으로 합동 수련', 'M01 · M08', [['문파 목록', ''], ['초대 코드 입장', 'on'], ['합동 수련', ''], ['나가기 → 영상 종료', 'k'], ['수련록', '']], '방 밖 계정 접근 제한, 퇴장 후 영상 공유 종료 확인'],
    ['4', '집중 보조 함께 사용', 'M09–M11', [['폐관 수련', ''], ['다른 탭 이동', 'k'], ['복귀 안내', 'on'], ['배경음 전환', ''], ['타임랩스 저장·삭제', '']], '탭 복귀 안내, 음원 겹침 없음, 타임랩스는 켠 세션만'],
    ['5', '재시도와 보상', 'M01–M02 · M12', [['출관', ''], ['응답 유실', 'k'], ['같은 세션 ID 재시도', 'on'], ['종료·보상 각 1건', '']], '종료 기록과 보상이 각각 한 건만 남는지 확인'],
  ];
  return `
  <div class="panel" style="position:absolute;left:40px;top:118px;width:1120px;height:900px">
    <h2>사이트맵 · 라우트</h2><div class="desc">PC와 모바일이 같은 URL을 공유하는 하나의 반응형 웹앱 (Vue Router). 박스 아래는 이 와이어프레임의 화면 번호.</div>
    <div class="col" style="align-items:center;margin-top:18px">
      <div class="card navy" style="padding:14px 22px;text-align:center"${mk(1)}><b class="lg">learningmate.app</b><div class="xs" style="color:var(--sky);margin-top:2px">반응형 웹 · PC 1440 기준 / 모바일 브라우저에서 같은 화면</div></div>
      ${vl(26)}
      <div style="position:relative;display:flex;gap:10px"${mk(2)}>
        <i style="position:absolute;left:62px;right:62px;top:0;height:2px;background:var(--blue2);display:block"></i>
        ${cols.map((c) => `<div class="col" style="align-items:center">${vl(22)}${c.map((b, i) => `${i ? vl(16) : ''}${box(...b)}`).join('')}</div>`).join('')}
      </div>
    </div>
    <div class="divider" style="margin:34px 0 22px"></div>
    <h2 style="font-size:16px">공통 레이아웃</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:12px"${mk(3)}>
      ${[['monitor', 'PC ≥ 1280', '왼쪽 사이드바(232) + 상단 바(68) + 콘텐츠'], ['tablet', '태블릿 768–1279', '아이콘 사이드바(72) + 콘텐츠 2열→1열'], ['phone', '모바일 < 768', '웹 헤더(☰) + 드로어 + 하단 고정 CTA']].map(([i, t, d]) => `<div class="card tint" style="padding:14px 16px"><div class="row">${ic(i, 18, HEX.navy)}<b>${t}</b></div><div class="sm muted" style="margin-top:6px;line-height:1.5">${d}</div></div>`).join('')}
    </div>
    <div class="card" style="margin-top:14px;padding:14px 16px"${mk(4)}><div class="row" style="gap:12px">${ic('lock', 18, HEX.navy)}<div class="col"><b class="md">폐관 모드 라우트 가드</b><span class="sm muted">/focus/:id 에 있는 동안 다른 라우트로 이동하면 확인 다이얼로그 → 일시정지 후 이동. 새로고침·재접속 시 진행 중 세션으로 복귀.</span></div></div></div>
  </div>
  <div class="panel" style="position:absolute;left:1180px;top:118px;width:740px;height:900px"${mk(5)}>
    <h2>통합 검증 시나리오 흐름</h2><div class="desc">기획서 7장의 통합 시나리오를 화면 흐름으로 옮긴 것. 데모 환경(HTTPS)에서 그대로 시연해요.</div>
    <div class="col" style="gap:14px">
      ${scen.map(([n, t, f, steps, d]) => `<div class="card" style="padding:14px 16px"><div class="row between"><div class="row"><span style="width:24px;height:24px;border-radius:50%;background:var(--navy);color:#fff;display:grid;place-items:center;font-size:12px;font-weight:800">${n}</span><b>${t}</b></div><span class="badge b-line">${f}</span></div>
        <div class="row wrap" style="gap:6px;margin-top:12px">${steps.map(([s, c], i) => `${i ? '<span class="arw">→</span>' : ''}<span class="flowchip ${c}">${s}</span>`).join('')}</div>
        <div class="xs muted" style="margin-top:10px">${d}</div></div>`).join('')}
    </div>
  </div>`;
};

/* ================================================================== */
/* G02 반응형 · 실기기 테스트                                           */
/* ================================================================== */
const responsive = () => `
<div class="panel" style="position:absolute;left:40px;top:118px;width:1180px;height:900px">
  <h2>하나의 웹, 세 가지 폭</h2><div class="desc">PC 1440 레이아웃을 기준으로 만들고, 같은 컴포넌트가 폭에 따라 재배치돼요. 별도 앱 없이 폰 브라우저로 테스트합니다.</div>
  <div class="row" style="gap:28px;align-items:flex-end;margin-top:8px"${mk(1)}>
    <div class="col" style="gap:10px"><div style="width:470px;height:300px;border:2px solid var(--black);border-radius:10px;overflow:hidden;display:flex;flex-direction:column"><div style="height:18px;background:#EFE7D9;border-bottom:1px solid var(--line)"></div><div style="flex:1;display:flex"><div style="width:76px;background:var(--black)"></div><div style="flex:1;display:flex;flex-direction:column"><div style="height:24px;border-bottom:1px solid var(--line)"></div><div style="flex:1;padding:10px;display:grid;grid-template-columns:repeat(12,1fr);gap:4px">${Array.from({ length: 12 }, () => '<i style="display:block;background:rgba(168,50,42,.08);border-left:1px dashed var(--blue2);border-right:1px dashed var(--blue2)"></i>').join('')}</div></div></div></div><div class="row">${ic('monitor', 17, HEX.navy)}<b>PC · 1280 이상 (기준 1440)</b></div><span class="sm muted">사이드바 232 · 12컬럼 · 거터 16~18 · 좌우 여백 32</span></div>
    <div class="col" style="gap:10px"><div style="width:300px;height:250px;border:2px solid var(--black);border-radius:12px;overflow:hidden;display:flex"><div style="width:30px;background:var(--black)"></div><div style="flex:1;padding:10px;display:grid;grid-template-columns:repeat(8,1fr);gap:4px">${Array.from({ length: 8 }, () => '<i style="display:block;background:rgba(168,50,42,.08);border-left:1px dashed var(--blue2);border-right:1px dashed var(--blue2)"></i>').join('')}</div></div><div class="row">${ic('tablet', 17, HEX.navy)}<b>태블릿 · 768–1279</b></div><span class="sm muted">아이콘 사이드바 72 · 8컬럼</span></div>
    <div class="col" style="gap:10px"><div style="width:150px;height:300px;border:2px solid var(--black);border-radius:20px;overflow:hidden;display:flex;flex-direction:column"><div style="height:24px;background:#EFE7D9"></div><div style="height:22px;border-bottom:1px solid var(--line);display:flex;align-items:center;padding:0 8px">${ic('menu', 12)}</div><div style="flex:1;padding:8px;display:grid;grid-template-columns:repeat(4,1fr);gap:3px">${Array.from({ length: 4 }, () => '<i style="display:block;background:rgba(168,50,42,.08);border-left:1px dashed var(--blue2);border-right:1px dashed var(--blue2)"></i>').join('')}</div><div style="height:30px;border-top:1px solid var(--line);padding:5px 8px"><i style="display:block;height:100%;border-radius:5px;background:var(--blue)"></i></div></div><div class="row">${ic('phone', 17, HEX.navy)}<b>모바일 · 767 이하</b></div><span class="sm muted">☰ 드로어 · 4컬럼 · 하단 고정 CTA</span></div>
  </div>
  <div class="divider" style="margin:24px 0 18px"></div>
  <h2 style="font-size:16px">화면별 반응형 규칙</h2>
  <div class="tbl" style="margin-top:10px"${mk(2)}>
    <div class="tr th"><span style="width:150px;flex:none">화면</span><span style="flex:1">PC (기준)</span><span style="flex:1">모바일 웹</span></div>
    ${[['수련장', 'KPI 4열 · 계획/D-Day 2단 · 최근 수련 표', 'KPI 2×2 · D-Day 배너 · 계획 카드 · 하단 CTA'], ['수련 계획', '주간 시간표 + 오른쪽 상세 패널', '일간 리스트(날짜 스트립) · 상세는 바텀시트'], ['학습 시작', '폼 + 카메라 확인 2단', '1단 · 카메라 미리보기 위 · 권한 요청'], ['폐관 수련', '타이머 카드 + 카메라/배경음/로그 사이드', '타이머 중심 · 카메라 PIP · 미니 플레이어 · Wake Lock'], ['수련록', '필터 바 · 차트 2단 · 표 + 페이지네이션', '칩 가로 스크롤 · 차트 세로 · 세션 카드'], ['문파', '타일 3열 + 오른쪽 패널', '타일 2열 · 내 타이머 하단 고정']].map(([a, b, c]) => `<div class="tr"><b class="md" style="width:150px;flex:none">${a}</b><span class="md" style="flex:1">${b}</span><span class="md muted" style="flex:1">${c}</span></div>`).join('')}
  </div>
</div>
<div class="panel" style="position:absolute;left:1240px;top:118px;width:680px;height:900px">
  <h2>폰 실기기 테스트 체크리스트</h2><div class="desc">카메라 기능은 모바일부터 검증 (기획서 1장). 앱 대신 폰 브라우저로 같은 주소를 열어요.</div>
  <div class="card tint" style="padding:16px 18px"${mk(3)}>
    <b class="md">개발 서버를 폰에서 여는 방법</b>
    <div class="col" style="gap:9px;margin-top:10px">${[['1', 'PC와 폰을 같은 Wi-Fi에 연결하고 Vite를 --host 로 실행'], ['2', '카메라는 HTTPS에서만 동작 → 개발용 인증서(basic-ssl) 또는 터널(ngrok·cloudflared)로 https 주소 만들기'], ['3', '폰 브라우저에서 https 주소 접속 → 소셜 계정으로 로그인 (터널 주소를 각 제공자 리디렉션 URI에 등록)'], ['4', '데모는 같은 HTTPS 배포 주소에서 PC + 폰 두 계정으로 시연']].map(([n, t]) => `<div class="row" style="gap:10px;align-items:flex-start"><span style="width:20px;height:20px;border-radius:50%;background:var(--navy);color:#fff;display:grid;place-items:center;font-size:11px;font-weight:800;flex:none">${n}</span><span class="sm" style="line-height:1.5">${t}</span></div>`).join('')}</div>
  </div>
  <div class="col" style="gap:8px;margin-top:16px"${mk(4)}>
    ${[['카메라 권한', '허용 · 거부 · 나중에 재허용 흐름 (거부 시 수동 모드)'], ['iOS Safari 영상', 'video에 playsinline · muted 지정, 전면 카메라 선택'], ['화면 꺼짐', 'Screen Wake Lock API로 집중 중 화면 유지 (미지원 시 안내)'], ['백그라운드 탭', '타이머는 setInterval 누적 대신 시작 시각 기준 계산'], ['배경음 자동재생', '사용자 탭 이후에만 재생, 음원 전환 시 이전 정지'], ['탭 이탈 감지', 'visibilitychange · 앱 전환/잠금 화면도 이탈로 처리'], ['네트워크', 'LTE/Wi-Fi 전환 시 WebSocket 재연결 · 오프라인 표시'], ['저조도 · 가림', '판정 불가 → 수동 전환 안내, 오탐/누락 횟수 기록']].map(([t, d]) => `<div class="row" style="gap:12px;padding:10px 12px;border:1px solid var(--line2);border-radius:10px">${check(false)}<b class="md" style="width:120px;flex:none">${t}</b><span class="sm muted">${d}</span></div>`).join('')}
  </div>
  <div class="card" style="margin-top:16px;padding:14px 16px;border-color:var(--navy)"${mk(5)}><div class="row" style="gap:12px;align-items:flex-start">${ic('phone', 20, HEX.navy)}<div class="col"><b class="md">"앱처럼" 테스트하고 싶다면</b><span class="sm muted" style="line-height:1.5;margin-top:3px">PWA(manifest + 아이콘)만 추가하면 '홈 화면에 추가'로 주소창 없이 전체 화면 실행 — 네이티브 앱은 1차 MVP 범위 밖.</span></div></div></div>
</div>`;

/* ================================================================== */
/* G03 컴포넌트 · 상태                                                  */
/* ================================================================== */
const components = () => `
<div style="position:absolute;left:40px;top:118px;right:40px;display:grid;grid-template-columns:repeat(3,1fr);gap:20px">
  <div class="panel"${mk(1)}><h2>색상 토큰</h2><div class="desc">먹 · 한지 · 인주 · 청록 · 금</div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">${[['먹', HEX.black, '텍스트 · 이탈'], ['청록', HEX.navy, '강조 · 선택'], ['인주', HEX.blue, '주요 액션 · 집중'], ['금', HEX.blue2, '보조 · 판정 불가'], ['미색', HEX.sky, '일시정지 · 배지'], ['한지', HEX.tint, '배경 카드'], ['Line', HEX.line, '테두리'], ['White', '#FFFFFF', '바탕']].map(([n, c, u]) => `<div class="col" style="gap:4px"><div class="swatch" style="background:${c}"></div><b class="sm">${n}</b><span class="xs muted num">${c}</span><span class="xs muted2">${u}</span></div>`).join('')}</div>
    <div class="divider" style="margin:16px 0"></div>
    <h2 style="font-size:15px">타이포그래피 · 제목 Noto Serif KR / 본문 Noto Sans KR</h2>
    <div class="col" style="gap:8px;margin-top:10px">${[['Page title', '21 / 800', 'font-size:21px;font-weight:800'], ['Card title', '15 / 800', 'font-size:15px;font-weight:800'], ['Body', '14 / 400', 'font-size:14px'], ['Caption', '12 / 500', 'font-size:12px;color:var(--muted)'], ['Timer', '66 / 800 tabular', 'font-size:34px;font-weight:800;color:var(--navy);font-variant-numeric:tabular-nums']].map(([a, b, s]) => `<div class="row between"><span style="${s}">${a === 'Timer' ? '01:24:36' : '학습 메이트 ' + a}</span><span class="xs muted num">${b}</span></div>`).join('')}</div>
  </div>
  <div class="panel"${mk(2)}><h2>버튼 · 입력</h2><div class="desc">높이 32 / 40 / 48 · 모서리 8~12</div>
    <div class="row wrap" style="gap:8px"><span class="btn">${ic('play', 13, '#fff')}주요</span><span class="btn o">보조</span><span class="btn g">기본</span><span class="btn k">${ic('stop', 11, '#fff')}종료</span><span class="btn t">텍스트</span><span class="btn dis">비활성</span></div>
    <div class="row wrap" style="gap:8px;margin-top:10px"><span class="btn sm">Small</span><span class="btn">Medium</span><span class="btn lg">Large</span></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px">
      ${field('기본', '<div class="input hint">입력하세요</div>')}${field('포커스', '<div class="input focus">백준 DP</div>')}
      ${field('오류', '<div class="input err">10:00</div>', '<span class="help err">' + ic('alert', 12, HEX.black) + '계획 시간이 겹쳐요</span>')}${field('비활성', '<div class="input dis">선택 안 함</div>')}
    </div>
    <div class="row" style="gap:18px;margin-top:14px"><span class="row sm">${check(true)}체크</span><span class="row sm"><span class="radio on"></span>라디오</span><span class="row sm"><span class="toggle on"></span>켜짐</span><span class="row sm"><span class="toggle"></span>꺼짐</span></div>
    <div class="seg" style="margin-top:14px"><span>일간</span><span class="on">주간</span><span>월간</span></div>
  </div>
  <div class="panel"${mk(3)}><h2>칩 · 배지 · 과목</h2><div class="desc">과목은 색 + 글자 두 가지로 구분</div>
    <div class="row wrap" style="gap:6px">${subj('algo')}${subj('eng')}${subj('db')}${subj('exam')}</div>
    <div class="row wrap" style="gap:6px;margin-top:10px"><span class="chip">기본</span><span class="chip on">선택</span><span class="chip n">필터 적용</span><span class="chip s">#태그</span><span class="chip dash">${ic('plus', 12, HEX.blue)}추가</span></div>
    <div class="row wrap" style="gap:6px;margin-top:10px"><span class="badge b-done">${ic('check', 11, HEX.navy, 3)}완료</span><span class="badge b-now">지금</span><span class="badge b-todo">예정</span><span class="badge b-line">AI</span><span class="badge b-k">D-12</span></div>
    <div class="divider" style="margin:16px 0"></div>
    <h2 style="font-size:15px">세션 상태 배지</h2>
    <div class="row wrap" style="gap:8px;margin-top:10px"><span class="pill st-focus"><i></i>재실 · 집중</span><span class="pill st-away"><i></i>자리 이탈</span><span class="pill st-unk"><i></i>판정 불가</span><span class="pill st-man"><i></i>수동</span><span class="pill st-pause"><i></i>일시정지</span></div>
    <div class="row wrap" style="gap:8px;margin-top:10px"><span class="pill sm st-focus"><i></i>집중</span><span class="pill sm st-rest"><i></i>휴식</span><span class="pill sm st-away"><i></i>종료</span><span class="pill sm st-off"><i></i>오프라인</span><span class="xs muted">← 그룹 상태</span></div>
    <div class="col" style="gap:8px;margin-top:14px">${segbar([['f', 30], ['p', 10], ['f', 24], ['a', 4], ['f', 18], ['u', 6], ['f', 8]], 14)}${legend()}</div>
  </div>
  <div class="panel"${mk(4)} style="grid-column:span 2"><h2>다이얼로그 · 알림</h2><div class="desc">폐관 수련 중 상태 변화를 알리는 공통 패턴</div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px">
      ${[['camera', '카메라를 사용할 수 없어요', '권한이 거부됐거나 다른 앱이 쓰고 있어요. 수동 모드로 이어서 측정할 수 있어요.', ['수동 모드로 계속', '다시 시도']], ['lock', '집중 중이에요. 이동할까요?', '이동하면 세션이 일시정지돼요. 현재 순공 00:39:12는 저장돼요.', ['계속 집중', '일시정지 후 이동']], ['refresh', '다시 돌아오셨네요', '다른 탭에 2분 18초 머물렀어요. 타이머는 그대로 진행 중이에요.', ['집중 이어가기', '일시정지']], ['clock', '진행 중인 세션이 있어요', '데이터베이스 · 00:42:10 (다른 기기·탭에서 시작). 이어서 측정할까요?', ['이어서 측정', '종료하기']]].map(([i, t, d, [a, b]]) => `<div class="card" style="padding:16px;box-shadow:0 12px 30px -16px rgba(40,30,20,.45)"><span style="width:36px;height:36px;border-radius:50%;background:var(--tint);display:grid;place-items:center">${ic(i, 18, HEX.navy)}</span><b class="md" style="display:block;margin-top:10px">${t}</b><div class="xs muted" style="margin-top:5px;line-height:1.55;min-height:52px">${d}</div><div class="col" style="gap:6px;margin-top:12px"><span class="btn sm full">${a}</span><span class="btn sm g full">${b}</span></div></div>`).join('')}
    </div>
    <div class="row" style="gap:12px;margin-top:16px"><div class="toast">${ic('check', 15, '#C9A15B', 3)}세션이 저장됐어요 · +60 내공</div><div class="toast">${ic('refresh', 15, '#C9A15B')}저장 응답이 없어 다시 시도 중… (같은 세션 ID)</div><div class="toast" style="background:#fff;color:var(--black);border:1px solid var(--line)">${ic('wifi', 15, HEX.blue)}문파 재연결 중</div></div>
  </div>
  <div class="panel"${mk(5)}><h2>빈 · 로딩 · 오류 상태</h2><div class="desc">모든 목록 화면 공통</div>
    <div class="col" style="gap:12px">
      <div class="card tint row" style="gap:14px;padding:14px">${ph('56px', '56px', '', '', '')}<div class="col grow"><b class="md">아직 기록이 없어요</b><span class="xs muted">첫 집중을 시작하면 여기에 쌓여요</span></div><span class="btn sm">시작하기</span></div>
      <div class="card col" style="gap:8px;padding:14px">${[80, 60, 70].map((w) => `<div class="row" style="gap:10px"><i style="width:36px;height:12px;border-radius:6px;background:var(--line2);display:block"></i><i style="width:${w}%;height:12px;border-radius:6px;background:var(--line2);display:block"></i></div>`).join('')}<span class="xs muted2">불러오는 중 (skeleton)</span></div>
      <div class="card row" style="gap:12px;padding:14px;border-color:var(--black)">${ic('alert', 20, HEX.black)}<div class="col grow"><b class="md">기록을 불러오지 못했어요</b><span class="xs muted">네트워크를 확인해 주세요</span></div><span class="btn sm g">${ic('refresh', 13)}다시 시도</span></div>
    </div>
  </div>
</div>`;

/* ================================================================== */
/* PC07 폐관 수련 상태 정의 — 상태는 '장면'이 바뀌어 알려준다          */
/* ================================================================== */
const thumb = (w, h, sc, overlay = '') => `<div style="position:relative;width:${w}px;height:${h}px;border-radius:12px;overflow:hidden;flex:none;box-shadow:0 0 0 1px var(--line)">${scene(sc)}${overlay}</div>`;
const miniTimer = (t, label, paused = false) => `<div class="glass" style="position:absolute;right:10px;top:10px;border-radius:12px;padding:6px 10px;text-align:right"><div class="xs w7" style="color:${paused ? 'var(--muted)' : 'var(--blue)'}">${label}</div><div class="timer" style="font-size:20px;color:${paused ? 'var(--muted)' : 'var(--black)'}">${t}</div></div>`;
const toastIn = (html, dark = false) => `<div class="glass ${dark ? 'dark' : ''}" style="position:absolute;left:10px;right:10px;bottom:10px;border-radius:10px;padding:7px 10px;font-size:11.5px;line-height:1.45">${html}</div>`;

const flowCard = (title, sub, sc, ov) => `<div class="col" style="gap:8px">${thumb(430, 236, sc, ov)}<div class="row between"><b class="md serif">${title}</b><span class="xs muted">${sub}</span></div></div>`;
const stateCard = (n, title, pill, sc, ov, rows) => `<div class="panel" style="padding:14px 14px 16px">
  <div class="row between" style="margin-bottom:10px"><div class="row"><span style="width:22px;height:22px;border-radius:4px;background:var(--blue);color:#F8F2E7;display:grid;place-items:center;font-size:11.5px;font-weight:800">${n}</span><b class="lg serif">${title}</b></div>${pill}</div>
  ${thumb(334, 188, sc, ov)}
  <div class="col" style="gap:7px;margin-top:12px">${rows.map(([k, v]) => `<div class="row" style="gap:8px;align-items:flex-start"><span class="xs w8 muted" style="width:44px;flex:none;margin-top:1px">${k}</span><span class="sm" style="line-height:1.5">${v}</span></div>`).join('')}</div>
</div>`;

const states = () => `
<div class="panel" style="position:absolute;left:40px;top:118px;right:40px;padding:18px 24px"${mk(1)}>
  <div class="row between"><div><h2 style="margin:0">시간의 흐름 — 같은 장면, 다른 시각</h2><span class="sm muted">해/달 = 계획 시간 안의 위치 · 일주향 = 남은 목표 · 하늘 = 실제 시각. 숫자를 보지 않아도 '얼마나 왔는지'가 느껴지게.</span></div><span class="badge b-todo">움직임: 구름 천천히 흐름 · 향 연기 · 해는 1분마다 갱신</span></div>
  <div class="row" style="gap:20px;margin-top:14px;align-items:flex-start">
    ${flowCard('입관 14:00', '해가 궤적 시작점 · 향 가득', { t: 0.02, hour: 14 }, miniTimer('00:00:00', '수련 시작'))}
    ${flowCard('수련 중 14:39', '해가 중천을 지남 · 향 1/3', { t: 0.65, hour: 14.65 }, miniTimer('00:39:12', '재실'))}
    ${flowCard('출관 예정 15:00', '해가 끝점 · 향 거의 다 탐', { t: 0.98, hour: 15 }, miniTimer('00:58:40', '목표 달성'))}
    ${flowCard('밤 수련 22:10', '달과 별 · 같은 규칙', { t: 0.35, hour: 22.2 }, miniTimer('00:21:05', '재실'))}
  </div>
</div>
<div style="position:absolute;left:40px;top:500px;right:40px;display:grid;grid-template-columns:repeat(5,1fr);gap:16px"${mk(2)}>
  ${stateCard(1, '수련 중', '<span class="pill sm st-focus"><i></i>재실</span>', { t: 0.65, hour: 14.65 }, miniTimer('00:39:12', '재실'), [['조건', 'AI 모드에서 얼굴 검출 연속 성공'], ['순공', '증가 · 해와 향이 움직임'], ['장면', '향 연기 · 새 · 구름 흐름'], ['기록', '상태 전환 시각만 저장']])}
  ${stateCard(2, '자리 이탈', '<span class="pill sm st-away"><i></i>자리 이탈</span>', { t: 0.65, hour: 14.65, state: 'away' }, miniTimer('00:39:12', '멈춤', true) + toastIn('<b>자리를 비웠어요 · 00:42</b><br>돌아오면 자동으로 이어서 수련해요', true), [['조건', '얼굴 미검출이 임계시간(예: 30초) 초과'], ['순공', '멈춤 · 해와 향도 멈춤'], ['장면', '방석만 남고 향불이 꺼짐, 화면이 바래짐'], ['기록', '이탈 구간 1회 · 배경음 일시정지']])}
  ${stateCard(3, '판정 불가', '<span class="pill sm st-unk"><i></i>판정 불가</span>', { t: 0.65, hour: 14.65, state: 'unk' }, miniTimer('00:39:12', '확인 필요') + toastIn('<b>기척이 흐려요</b> — 조명·가림 확인<br><span class="btn sm" style="height:24px;margin-top:5px">수동으로 계속</span> <span class="btn sm g" style="height:24px">다시 시도</span>'), [['조건', '저조도 · 가림 · 카메라 연결 끊김'], ['순공', '구간 표시 후 사용자 선택 대기'], ['장면', '인물 주변에 안개가 짙어짐'], ['기록', '판정 불가 구간 (사유 포함)']])}
  ${stateCard(4, '수동 수련', '<span class="pill sm st-man"><i></i>수동</span>', { t: 0.65, hour: 14.65, state: 'manual' }, miniTimer('00:39:12', '수동') + toastIn(`${ic('camera', 12, HEX.muted)} 카메라 꺼짐 · 직접 시작·일시정지·출관`), [['조건', '사용자 선택 · 권한 거부 · 판정 불가 후 전환'], ['순공', '사용자가 시작한 구간 합산'], ['장면', '수련 중과 동일 (감지 한 줄만 바뀜)'], ['기록', '모드 변경 이벤트']])}
  ${stateCard(5, '일시정지', '<span class="pill sm st-pause"><i></i>일시정지</span>', { t: 0.65, hour: 14.65, state: 'pause' }, miniTimer('00:39:12', '일시정지 02:10', true) + `<div class="glass" style="position:absolute;left:50%;top:54%;transform:translate(-50%,-50%);border-radius:12px;padding:10px 14px;text-align:center"><b class="sm serif">잠시 운기조식 중</b><div class="row" style="gap:6px;margin-top:6px;justify-content:center"><span class="btn sm" style="height:26px">${ic('play', 10, '#fff')}재개</span><span class="btn sm k" style="height:26px">출관</span></div></div>`, [['조건', 'Space · 메뉴 이동 확인 후'], ['순공', '멈춤 · 해와 향도 멈춤'], ['장면', '어둡게 덮고 새·연기가 멈춤'], ['기록', '정지·재개 이벤트, 배경음 정지']])}
</div>
<div class="panel" style="position:absolute;left:40px;right:40px;top:902px;padding:16px 24px"${mk(3)}>
  <div class="row between"><h2 style="margin:0;font-size:16px">판정 파라미터 <span class="sm muted" style="font-weight:500;font-family:'Noto Sans KR'">— 기획서 '팀이 먼저 결정할 항목' · 아래는 예시 값 · 탭 이탈 후 복귀는 '다시 돌아오셨네요' 안내만 (타이머 유지)</span></h2><span class="badge b-todo">대표 기기에서 측정 후 확정</span></div>
  <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-top:12px">
    ${[['이탈 확정 임계시간', '30초', '얼굴 미검출 연속 시간'], ['복귀 판정', '2초', '얼굴 재검출 연속 시간'], ['판정 주기', '5 fps', '브라우저 추론 부하와 지연 비교'], ['판정 불가 조건', '저조도 · 가림 · 끊김', '프레임 밝기·트랙 상태 기준'], ['검증 기록', '오탐 · 누락 · 지연', '정상 착석·이탈·저조도·가림별 횟수']].map(([a, b, c]) => `<div style="border:1px solid var(--line2);border-radius:12px;padding:10px 14px"><span class="xs muted w7">${a}</span><b class="serif" style="display:block;font-size:18px;color:var(--navy);margin-top:4px">${b}</b><span class="xs muted2">${c}</span></div>`).join('')}
  </div>
</div>`;

/* ================================================================== */
/* G04 세계관 · 용어 · 성장 체계 (v0.3 신규)                             */
/* ================================================================== */
const world = () => `
<div class="panel" style="position:absolute;left:40px;top:118px;width:620px;height:910px"${mk(1)}>
  <h2>용어 사전</h2><div class="desc">메뉴·제목·보상은 무협 용어, <b>상태·오류·설정 문구는 기능 용어 그대로</b> — 처음 쓰는 사람도 헷갈리지 않게.</div>
  <div class="tbl">
    <div class="tr th"><span style="width:150px;flex:none">v0.2 (기능)</span><span style="width:150px;flex:none">v0.3 (무협)</span><span style="flex:1">쓰임</span></div>
    ${[['대시보드', '수련장', '홈'], ['플래너 · 계획', '수련 계획', '계획 블록은 그대로'], ['집중하기 · 세션', '폐관 수련', '몰입 화면 (PC06)'], ['집중 시작', '입관 · 폐관 시작', '버튼은 「폐관 수련」'], ['세션 종료', '출관', '종료 버튼 · 결과'], ['기록·통계', '수련록', '통계 화면'], ['스터디방', '문파', '초대 코드는 그대로'], ['캠스터디', '합동 수련', '문파 안 화면'], ['포인트', '내공', '순공 → 내공'], ['레벨', '경지', '삼류 … 생사경'], ['수집 배지', '비급', '수집 목록'], ['보상·수집', '무인 성장', '성장 화면 (PC13)'], ['시험 D-Day', '비무 D-Day', '시험 이름은 실제 이름'], ['재실', '기척 있음', 'AI 감지 한 줄에만'], ['자리 이탈 · 판정 불가', '(그대로)', '상태 문구는 기능 용어']].map(([a, b, c]) => `<div class="tr" style="min-height:44px"><span class="md muted" style="width:150px;flex:none">${a}</span><b class="md serif" style="width:150px;flex:none;color:${b === '(그대로)' ? 'var(--muted)' : 'var(--blue)'}">${b}</b><span class="sm muted" style="flex:1">${c}</span></div>`).join('')}
  </div>
</div>
<div class="panel" style="position:absolute;left:680px;top:118px;width:600px;height:450px"${mk(2)}>
  <h2>색 · 글꼴 · 문양</h2><div class="desc">수묵화의 먹과 한지 위에 인주(도장 빨강)로 행동을, 청록·금으로 깊이를 준다.</div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">${[['먹 Ink', HEX.black, '텍스트 · 이탈'], ['청록 Jade', HEX.navy, '선택 · 깊은 강조'], ['인주 Cinnabar', HEX.blue, '주요 행동 · 수련 중'], ['금 Gold', HEX.blue2, '보조 · 경지 링'], ['미색', HEX.sky, '일시정지 · 배지'], ['한지', HEX.tint, '카드 배경'], ['선', HEX.line, '테두리'], ['종이 바탕', '#F2EBDD', '화면 바탕']].map(([n, c, u]) => `<div class="col" style="gap:3px"><div class="swatch" style="background:${c};height:44px"></div><b class="sm">${n}</b><span class="xs muted num">${c}</span><span class="xs muted2">${u}</span></div>`).join('')}</div>
  <div class="divider" style="margin:14px 0"></div>
  <div class="row" style="gap:18px;align-items:flex-start">
    <div class="col" style="gap:6px;flex:1"><span class="serif" style="font-size:24px;font-weight:800">폐관 수련 00:39:12</span><span class="xs muted">제목 · 숫자 — Noto Serif KR (명조)</span><span style="font-size:14px">본문과 상태 문구는 Noto Sans KR</span><span class="xs muted">본문 — Noto Sans KR (고딕)</span></div>
    <div class="col" style="gap:6px;align-items:center"><span class="seal" style="width:52px;height:52px;font-size:24px;box-shadow:0 0 0 2px var(--blue),inset 0 0 0 2px #F8F2E7">修</span><span class="xs muted">낙관(도장) — 로고 · 경지 · 비급</span></div>
  </div>
</div>
<div class="panel" style="position:absolute;left:1300px;top:118px;width:620px;height:450px"${mk(3)}>
  <h2>성장 루프</h2><div class="desc">공통 기능(계획 → 측정 → 기록 → 보상)은 그대로 두고, 보상 끝에 '무인이 자란다'를 붙였다.</div>
  <div class="col" style="gap:8px">
    ${[['calendar', '수련 계획', '오늘 할 수련과 비무 D-Day', ''], ['timer', '폐관 수련', '재실·수동 구간만 순공으로', 'on'], ['check', '출관', '정상 종료 + 25분 이상이면 내공 지급', ''], ['trophy', '경지 상승', '내공이 기준을 넘으면 다음 경지', 'k'], ['sparkle', '해금', '칭호 · 수련 장소 · 비급', '']].map(([i, t, d, c], k) => `${k ? '<div style="padding-left:17px;color:var(--blue);font-weight:800;line-height:1">↓</div>' : ''}<div class="row" style="gap:12px;padding:8px 12px;border-radius:10px;${c === 'on' ? 'background:var(--blue);color:#F8F2E7' : c === 'k' ? 'background:var(--black);color:#F8F2E7' : 'border:1px solid var(--line2)'}">${ic(i, 17, c ? '#F8F2E7' : HEX.blue)}<b class="md serif" style="width:90px">${t}</b><span class="sm" style="${c ? 'opacity:.85' : 'color:var(--muted)'}">${d}</span></div>`).join('')}
  </div>
</div>
<div class="panel" style="position:absolute;left:680px;top:588px;width:1240px;height:440px"${mk(4)}>
  <h2>폐관 수련 화면 원칙</h2><div class="desc">참고 이미지처럼 요소를 걷어내고, 시간이 흐르는 느낌을 풍경으로 전한다.</div>
  <div style="display:grid;grid-template-columns:420px 1fr;gap:24px">
    <div style="position:relative;height:236px;border-radius:12px;overflow:hidden">${scene({ t: 0.65, hour: 14.65, labels: ['입관', '출관'] })}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      ${[['1', '장면이 주인공', '사이드바·카드·표를 없애고 화면 전체를 수련 장면으로. 남기는 것은 시각·타이머·경지·배경음·출관뿐.'], ['2', '시간은 풍경으로', '해/달 = 계획 시간 안의 위치, 일주향 = 남은 목표, 하늘 = 실제 시각. 숫자를 안 봐도 흐름이 느껴지게.'], ['3', '상태는 장면이 말한다', '자리 이탈이면 방석만 남고 향불이 꺼짐, 판정 불가면 안개, 일시정지면 어둡게.'], ['4', '도구는 접어 둔다', '카메라 미리보기·로그·계획은 아이콘 → 패널. 마우스가 3초 멈추면 UI가 흐려짐(몰입 보기).'], ['5', '출관은 늘 같은 자리', '오른쪽 아래 인주색 버튼 + Esc. 실수로 누르지 않도록 확인 한 번.'], ['6', '움직임은 느리게', '구름·연기는 아주 천천히, 해는 1분마다. 알림성 깜빡임 없음 — 집중을 깨지 않는다.']].map(([n, t, d]) => `<div class="row" style="gap:10px;align-items:flex-start"><span style="width:22px;height:22px;border-radius:4px;background:var(--blue);color:#F8F2E7;display:grid;place-items:center;font-size:11.5px;font-weight:800;flex:none">${n}</span><div class="col"><b class="md serif">${t}</b><span class="xs muted" style="line-height:1.55;margin-top:2px">${d}</span></div></div>`).join('')}
    </div>
  </div>
</div>`;

export const GUIDES = [
  { id: 'G01', file: 'G01_사이트맵_흐름', title: '사이트맵 · 통합 시나리오 흐름', feats: ['전체'], body: sitemap, w: 1960, h: 1080, notes: null },
  { id: 'G02', file: 'G02_반응형_실기기테스트', title: '반응형 규칙 · 폰 실기기 테스트', feats: ['PC 우선', '모바일 웹'], body: responsive, w: 1960, h: 1080, notes: null },
  { id: 'G03', file: 'G03_컴포넌트_상태', title: '컴포넌트 · 상태', feats: ['공통'], body: components, w: 1960, h: 1230, notes: null },
  { id: 'G04', file: 'G04_세계관_용어_성장', title: '세계관 · 용어 · 성장 체계', feats: ['v0.3 신규', '무협'], body: world, w: 1960, h: 1080, notes: null },
  { id: 'PC07', file: 'PC07_폐관수련_상태정의', title: '폐관 수련 상태 정의 · 시간의 흐름', feats: ['M01', 'M05', 'M09'], body: states, w: 1960, h: 1080, notes: null },
];
