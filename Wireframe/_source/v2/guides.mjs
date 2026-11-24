// v0.2 가이드 보드: 사이트맵·흐름 / 반응형·실기기 테스트 / 컴포넌트·상태 / 집중 세션 상태 정의
import { ic, HEX, mk, subj, legend, segbar, avatar, ph, check, field, select, ringSvg } from './core.mjs';

const box = (title, path, ids, cls = '') => `<div class="${cls}" style="width:124px;border-radius:12px;padding:10px 10px;text-align:center;${cls === 'root' ? '' : 'background:#fff;border:1.5px solid var(--line)'}"><b class="md" style="display:block;letter-spacing:-.3px">${title}</b><span class="xs muted" style="display:block;margin-top:2px">${path}</span>${ids ? `<span class="xs w8 blue" style="display:block;margin-top:5px">${ids}</span>` : ''}</div>`;
const vl = (h = 18) => `<i style="display:block;width:2px;height:${h}px;background:var(--blue2)"></i>`;

/* ================================================================== */
/* G01 사이트맵 · 사용자 흐름                                           */
/* ================================================================== */
const sitemap = () => {
  const cols = [
    [['로그인', '/login', 'PC01']],
    [['대시보드', '/', 'PC02 · W01']],
    [['플래너', '/planner', 'PC03'], ['계획 추가 모달', '?new=1', 'PC04']],
    [['집중하기', '/focus/new', 'PC05 · W03'], ['집중 세션', '/focus/:id', 'PC06 · W04'], ['세션 결과', '/focus/:id/result', 'PC08']],
    [['기록·통계', '/records', 'PC09 · W05'], ['세션 상세', '/records/:id', 'PC10']],
    [['스터디방', '/rooms', 'PC11'], ['캠스터디', '/rooms/:code', 'PC12 · W06']],
    [['보상·수집', '/rewards', 'PC13']],
    [['설정', '/settings', 'PC14']],
  ];
  const scen = [
    ['1', '계획에서 학습 시작', 'M01–M03 · M06–M07', [['대시보드 · 플래너', ''], ['계획 ▶ 시작', 'on'], ['학습 시작 설정', ''], ['집중 세션', ''], ['세션 결과', ''], ['기록·통계', '']], '시험 D-Day와 계획을 확인하고 시작 → 종료 후 계획과 통계에 집중 시간 반영'],
    ['2', '카메라 이탈과 복귀', 'M01–M02 · M05', [['집중 세션 (재실)', ''], ['자리 이탈 감지', 'k'], ['복귀 · 자동 재개', 'on'], ['세션 상세 (이탈 구간)', '']], '권한 거부·연결 끊김·가림 → 안내와 수동 전환'],
    ['3', '두 계정으로 캠스터디', 'M01 · M08', [['스터디방 목록', ''], ['초대 코드 입장', 'on'], ['캠스터디', ''], ['나가기 → 영상 종료', 'k'], ['기록·통계', '']], '방 밖 계정 접근 제한, 퇴장 후 영상 공유 종료 확인'],
    ['4', '집중 보조 함께 사용', 'M09–M11', [['집중 세션', ''], ['다른 탭 이동', 'k'], ['복귀 안내', 'on'], ['배경음 전환', ''], ['타임랩스 저장·삭제', '']], '탭 복귀 안내, 음원 겹침 없음, 타임랩스는 켠 세션만'],
    ['5', '재시도와 보상', 'M01–M02 · M12', [['세션 종료', ''], ['응답 유실', 'k'], ['같은 세션 ID 재시도', 'on'], ['종료·보상 각 1건', '']], '종료 기록과 보상이 각각 한 건만 남는지 확인'],
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
    <div class="card" style="margin-top:14px;padding:14px 16px"${mk(4)}><div class="row" style="gap:12px">${ic('lock', 18, HEX.navy)}<div class="col"><b class="md">집중 모드 라우트 가드</b><span class="sm muted">/focus/:id 에 있는 동안 다른 라우트로 이동하면 확인 다이얼로그 → 일시정지 후 이동. 새로고침·재접속 시 진행 중 세션으로 복귀.</span></div></div></div>
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
    <div class="col" style="gap:10px"><div style="width:470px;height:300px;border:2px solid var(--black);border-radius:10px;overflow:hidden;display:flex;flex-direction:column"><div style="height:18px;background:#EEF2F9;border-bottom:1px solid var(--line)"></div><div style="flex:1;display:flex"><div style="width:76px;background:var(--black)"></div><div style="flex:1;display:flex;flex-direction:column"><div style="height:24px;border-bottom:1px solid var(--line)"></div><div style="flex:1;padding:10px;display:grid;grid-template-columns:repeat(12,1fr);gap:4px">${Array.from({ length: 12 }, () => '<i style="display:block;background:rgba(37,99,235,.08);border-left:1px dashed var(--blue2);border-right:1px dashed var(--blue2)"></i>').join('')}</div></div></div></div><div class="row">${ic('monitor', 17, HEX.navy)}<b>PC · 1280 이상 (기준 1440)</b></div><span class="sm muted">사이드바 232 · 12컬럼 · 거터 16~18 · 좌우 여백 32</span></div>
    <div class="col" style="gap:10px"><div style="width:300px;height:250px;border:2px solid var(--black);border-radius:12px;overflow:hidden;display:flex"><div style="width:30px;background:var(--black)"></div><div style="flex:1;padding:10px;display:grid;grid-template-columns:repeat(8,1fr);gap:4px">${Array.from({ length: 8 }, () => '<i style="display:block;background:rgba(37,99,235,.08);border-left:1px dashed var(--blue2);border-right:1px dashed var(--blue2)"></i>').join('')}</div></div><div class="row">${ic('tablet', 17, HEX.navy)}<b>태블릿 · 768–1279</b></div><span class="sm muted">아이콘 사이드바 72 · 8컬럼</span></div>
    <div class="col" style="gap:10px"><div style="width:150px;height:300px;border:2px solid var(--black);border-radius:20px;overflow:hidden;display:flex;flex-direction:column"><div style="height:24px;background:#EEF2F9"></div><div style="height:22px;border-bottom:1px solid var(--line);display:flex;align-items:center;padding:0 8px">${ic('menu', 12)}</div><div style="flex:1;padding:8px;display:grid;grid-template-columns:repeat(4,1fr);gap:3px">${Array.from({ length: 4 }, () => '<i style="display:block;background:rgba(37,99,235,.08);border-left:1px dashed var(--blue2);border-right:1px dashed var(--blue2)"></i>').join('')}</div><div style="height:30px;border-top:1px solid var(--line);padding:5px 8px"><i style="display:block;height:100%;border-radius:5px;background:var(--blue)"></i></div></div><div class="row">${ic('phone', 17, HEX.navy)}<b>모바일 · 767 이하</b></div><span class="sm muted">☰ 드로어 · 4컬럼 · 하단 고정 CTA</span></div>
  </div>
  <div class="divider" style="margin:24px 0 18px"></div>
  <h2 style="font-size:16px">화면별 반응형 규칙</h2>
  <div class="tbl" style="margin-top:10px"${mk(2)}>
    <div class="tr th"><span style="width:150px;flex:none">화면</span><span style="flex:1">PC (기준)</span><span style="flex:1">모바일 웹</span></div>
    ${[['대시보드', 'KPI 4열 · 계획/D-Day 2단 · 최근 세션 표', 'KPI 2×2 · D-Day 배너 · 계획 카드 · 하단 CTA'], ['플래너', '주간 시간표 + 오른쪽 상세 패널', '일간 리스트(날짜 스트립) · 상세는 바텀시트'], ['학습 시작', '폼 + 카메라 확인 2단', '1단 · 카메라 미리보기 위 · 권한 요청'], ['집중 세션', '타이머 카드 + 카메라/배경음/로그 사이드', '타이머 중심 · 카메라 PIP · 미니 플레이어 · Wake Lock'], ['기록·통계', '필터 바 · 차트 2단 · 표 + 페이지네이션', '칩 가로 스크롤 · 차트 세로 · 세션 카드'], ['스터디방', '타일 3열 + 오른쪽 패널', '타일 2열 · 내 타이머 하단 고정']].map(([a, b, c]) => `<div class="tr"><b class="md" style="width:150px;flex:none">${a}</b><span class="md" style="flex:1">${b}</span><span class="md muted" style="flex:1">${c}</span></div>`).join('')}
  </div>
</div>
<div class="panel" style="position:absolute;left:1240px;top:118px;width:680px;height:900px">
  <h2>폰 실기기 테스트 체크리스트</h2><div class="desc">카메라 기능은 모바일부터 검증 (기획서 1장). 앱 대신 폰 브라우저로 같은 주소를 열어요.</div>
  <div class="card tint" style="padding:16px 18px"${mk(3)}>
    <b class="md">개발 서버를 폰에서 여는 방법</b>
    <div class="col" style="gap:9px;margin-top:10px">${[['1', 'PC와 폰을 같은 Wi-Fi에 연결하고 Vite를 --host 로 실행'], ['2', '카메라는 HTTPS에서만 동작 → 개발용 인증서(basic-ssl) 또는 터널(ngrok·cloudflared)로 https 주소 만들기'], ['3', '폰 브라우저에서 https 주소 접속 → 테스트 계정 로그인'], ['4', '데모는 같은 HTTPS 배포 주소에서 PC + 폰 두 계정으로 시연']].map(([n, t]) => `<div class="row" style="gap:10px;align-items:flex-start"><span style="width:20px;height:20px;border-radius:50%;background:var(--navy);color:#fff;display:grid;place-items:center;font-size:11px;font-weight:800;flex:none">${n}</span><span class="sm" style="line-height:1.5">${t}</span></div>`).join('')}</div>
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
  <div class="panel"${mk(1)}><h2>색상 토큰</h2><div class="desc">파랑 계열 + 검정 + 흰색만 사용</div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">${[['Black', HEX.black, '텍스트 · 이탈'], ['Navy', HEX.navy, '강조 · 선택'], ['Blue', HEX.blue, '주요 액션 · 집중'], ['Blue 2', HEX.blue2, '보조 · 판정 불가'], ['Sky', HEX.sky, '일시정지 · 배지'], ['Tint', HEX.tint, '배경 카드'], ['Line', HEX.line, '테두리'], ['White', '#FFFFFF', '바탕']].map(([n, c, u]) => `<div class="col" style="gap:4px"><div class="swatch" style="background:${c}"></div><b class="sm">${n}</b><span class="xs muted num">${c}</span><span class="xs muted2">${u}</span></div>`).join('')}</div>
    <div class="divider" style="margin:16px 0"></div>
    <h2 style="font-size:15px">타이포그래피 · Noto Sans KR</h2>
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
  <div class="panel"${mk(4)} style="grid-column:span 2"><h2>다이얼로그 · 알림</h2><div class="desc">집중 세션 중 상태 변화를 알리는 공통 패턴</div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px">
      ${[['camera', '카메라를 사용할 수 없어요', '권한이 거부됐거나 다른 앱이 쓰고 있어요. 수동 모드로 이어서 측정할 수 있어요.', ['수동 모드로 계속', '다시 시도']], ['lock', '집중 중이에요. 이동할까요?', '이동하면 세션이 일시정지돼요. 현재 순공 00:39:12는 저장돼요.', ['계속 집중', '일시정지 후 이동']], ['refresh', '다시 돌아오셨네요', '다른 탭에 2분 18초 머물렀어요. 타이머는 그대로 진행 중이에요.', ['집중 이어가기', '일시정지']], ['clock', '진행 중인 세션이 있어요', '데이터베이스 · 00:42:10 (다른 기기·탭에서 시작). 이어서 측정할까요?', ['이어서 측정', '종료하기']]].map(([i, t, d, [a, b]]) => `<div class="card" style="padding:16px;box-shadow:0 12px 30px -16px rgba(10,42,107,.45)"><span style="width:36px;height:36px;border-radius:50%;background:var(--tint);display:grid;place-items:center">${ic(i, 18, HEX.navy)}</span><b class="md" style="display:block;margin-top:10px">${t}</b><div class="xs muted" style="margin-top:5px;line-height:1.55;min-height:52px">${d}</div><div class="col" style="gap:6px;margin-top:12px"><span class="btn sm full">${a}</span><span class="btn sm g full">${b}</span></div></div>`).join('')}
    </div>
    <div class="row" style="gap:12px;margin-top:16px"><div class="toast">${ic('check', 15, '#6E9BF5', 3)}세션이 저장됐어요 · +60P</div><div class="toast">${ic('refresh', 15, '#6E9BF5')}저장 응답이 없어 다시 시도 중… (같은 세션 ID)</div><div class="toast" style="background:#fff;color:var(--black);border:1px solid var(--line)">${ic('wifi', 15, HEX.blue)}스터디방 재연결 중</div></div>
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
/* PC07 집중 세션 상태 정의                                             */
/* ================================================================== */
const stateCard = (n, title, pill, timer, msg, rows, extra = '') => `<div class="panel" style="padding:18px 20px">
  <div class="row between"><div class="row"><span style="width:24px;height:24px;border-radius:50%;background:var(--navy);color:#fff;display:grid;place-items:center;font-size:12px;font-weight:800">${n}</span><b class="lg">${title}</b></div>${pill}</div>
  <div class="card tint" style="margin-top:14px;padding:16px;display:flex;align-items:center;gap:16px">
    <div class="ring" style="width:96px;height:96px">${ringSvg(96, 7, timer[1], timer[2] || HEX.blue, HEX.sky)}<div class="in"><b class="timer ${timer[3] ? 'muted' : ''}" style="font-size:19px;letter-spacing:-.5px">${timer[0]}</b></div></div>
    <div class="col grow" style="gap:6px">${msg}</div>
  </div>
  <div class="col" style="gap:7px;margin-top:14px">${rows.map(([k, v]) => `<div class="row" style="gap:10px;align-items:flex-start"><span class="xs w8 muted" style="width:54px;flex:none;margin-top:1px">${k}</span><span class="sm" style="line-height:1.5">${v}</span></div>`).join('')}</div>
  ${extra}
</div>`;
const states = () => `
<div class="panel" style="position:absolute;left:40px;top:118px;right:40px;padding:18px 24px"${mk(1)}>
  <div class="row between"><div><h2 style="margin:0">상태 전이</h2><span class="sm muted">수동 구간 + AI 재실 구간만 순공에 합산 · 서버가 이벤트 순서·중복을 확인해 최종 시간 확정</span></div>
  <div class="row" style="gap:8px">
    <span class="pill sm st-focus"><i></i>재실·집중</span><span class="arw">⇄</span><span class="pill sm st-away"><i></i>자리 이탈</span>
    <span class="xs muted" style="margin:0 6px">|</span>
    <span class="pill sm st-focus"><i></i>재실·집중</span><span class="arw">→</span><span class="pill sm st-unk"><i></i>판정 불가</span><span class="arw">→</span><span class="pill sm st-man"><i></i>수동</span>
    <span class="xs muted" style="margin:0 6px">|</span>
    <span class="pill sm st-focus"><i></i>집중</span><span class="arw">⇄</span><span class="pill sm st-pause"><i></i>일시정지</span>
  </div></div>
</div>
<div style="position:absolute;left:40px;top:222px;right:40px;display:grid;grid-template-columns:repeat(3,1fr);gap:20px">
  ${stateCard(1, '재실 · 집중', '<span class="pill sm st-focus"><i></i>재실</span>', ['00:39:12', 0.65], '<b class="md">얼굴이 계속 검출되는 상태</b><span class="xs muted">카메라 패널에 얼굴 박스와 \'0.2초 전\' 표시</span>', [['조건', 'AI 모드에서 얼굴 검출 연속 성공'], ['순공', '증가'], ['기록', '상태 전환 시각만 저장 (프레임 저장 없음)']])}
  ${stateCard(2, '자리 이탈', '<span class="pill sm st-away"><i></i>자리 이탈</span>', ['00:39:12', 0.65, HEX.line, 1], '<div class="toast" style="padding:9px 12px;font-size:12px">자리를 비운 것 같아요 · 00:42</div><span class="xs muted">돌아오면 자동으로 이어서 측정</span>', [['조건', '얼굴 미검출이 임계시간(예: 30초) 초과'], ['순공', '멈춤 (이탈 구간은 합산 안 함)'], ['기록', '이탈 구간 1회 · 복귀 시 자동 재개, 배경음 일시정지']])}
  ${stateCard(3, '판정 불가', '<span class="pill sm st-unk"><i></i>판정 불가</span>', ['00:39:12', 0.65, HEX.blue2], '<b class="md">카메라로 판단하기 어려워요</b><span class="row" style="gap:6px"><span class="btn sm">수동으로 계속</span><span class="btn sm g">다시 시도</span></span>', [['조건', '저조도 · 가림 · 카메라 연결 끊김'], ['순공', '구간 표시 후 사용자 선택 대기'], ['기록', '판정 불가 구간 (사유 포함)']])}
  ${stateCard(4, '수동 모드', '<span class="pill sm st-man"><i></i>수동</span>', ['00:39:12', 0.65, HEX.black], '<b class="md">카메라 없이 측정 중</b><span class="xs muted">권한 거부 시 자동 제안 · 언제든 AI로 복귀</span>', [['조건', '사용자 선택 또는 권한 거부·판정 불가 후 전환'], ['순공', '사용자가 시작한 구간 합산'], ['기록', '모드 변경 이벤트']])}
  ${stateCard(5, '일시정지', '<span class="pill sm st-pause"><i></i>일시정지</span>', ['00:39:12', 0.65, HEX.blue2, 1], `<b class="md">일시정지됨 · 02:10</b><span class="row" style="gap:6px"><span class="btn sm">${ic('play', 11, '#fff')}재개</span><span class="btn sm k">종료</span></span>`, [['조건', '사용자 일시정지 (Space) · 메뉴 이동 확인 후'], ['순공', '멈춤'], ['기록', '정지·재개 이벤트, 배경음 정지']])}
  ${stateCard(6, '탭 이탈 후 복귀', '<span class="pill sm st-focus"><i></i>진행 중</span>', ['00:41:30', 0.69], '<b class="md">다시 돌아오셨네요</b><span class="xs muted">다른 탭 2분 18초 · 타이머 유지</span>', [['조건', 'visibilitychange (다른 탭·앱 전환·화면 잠금)'], ['순공', '유지 (AI 모드는 카메라 판정이 우선)'], ['기록', '탭 이탈 알림 이벤트만 선택 저장 · 앱 목록 수집 안 함']])}
</div>
<div class="panel" style="position:absolute;left:40px;right:40px;top:868px;padding:18px 24px"${mk(2)}>
  <div class="row between"><h2 style="margin:0;font-size:16px">판정 파라미터 <span class="sm muted" style="font-weight:500">— 기획서 '팀이 먼저 결정할 항목' · 아래는 예시 값</span></h2><span class="badge b-todo">대표 기기에서 측정 후 확정</span></div>
  <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-top:14px">
    ${[['이탈 확정 임계시간', '30초', '얼굴 미검출 연속 시간'], ['복귀 판정', '2초', '얼굴 재검출 연속 시간'], ['판정 주기', '5 fps', '브라우저 추론 부하와 지연 비교'], ['판정 불가 조건', '저조도 · 가림 · 끊김', '프레임 밝기·트랙 상태 기준'], ['검증 기록', '오탐 · 누락 · 지연', '정상 착석·이탈·저조도·가림별 횟수']].map(([a, b, c]) => `<div style="border:1px solid var(--line2);border-radius:12px;padding:12px 14px"><span class="xs muted w7">${a}</span><b style="display:block;font-size:18px;color:var(--navy);margin-top:4px">${b}</b><span class="xs muted2">${c}</span></div>`).join('')}
  </div>
</div>`;

export const GUIDES = [
  { id: 'G01', file: 'G01_사이트맵_흐름', title: '사이트맵 · 통합 시나리오 흐름', feats: ['전체'], body: sitemap, w: 1960, h: 1080, notes: null },
  { id: 'G02', file: 'G02_반응형_실기기테스트', title: '반응형 규칙 · 폰 실기기 테스트', feats: ['PC 우선', '모바일 웹'], body: responsive, w: 1960, h: 1080, notes: null },
  { id: 'G03', file: 'G03_컴포넌트_상태', title: '컴포넌트 · 상태', feats: ['공통'], body: components, w: 1960, h: 1230, notes: null },
  { id: 'PC07', file: 'PC07_집중세션_상태정의', title: '집중 세션 상태 정의', feats: ['M01', 'M05', 'M09'], body: states, w: 1960, h: 1080, notes: null },
];
