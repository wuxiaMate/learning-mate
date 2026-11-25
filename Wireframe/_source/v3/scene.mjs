// v0.3 폐관 수련 장면 — 수묵 산수 + 좌선하는 무인 (오리지널 드로잉)
// 시간의 흐름: ① 해/달이 계획 시간대의 호(arc)를 따라 이동 ② 향(일주향)이 타들어감 ③ 하늘색이 실제 시각을 따라 변함
// Figma 변환 호환: 단색 fill + opacity만 사용 (SVG gradient·filter·marker 없음). 하늘은 바깥 div의 단일 linear-gradient.

const PAL = {
  dawn: { top: '#EBC9B4', bot: '#F7EDE0', orb: '#C9442F', far: '#6B5040', near: '#2E2420', mist: '#FBF3EA', star: 0 },
  day: { top: '#D6E0DB', bot: '#F5EFE2', orb: '#B8342A', far: '#4A5A55', near: '#1F2622', mist: '#FBF8F1', star: 0 },
  dusk: { top: '#E2A27C', bot: '#F4DEC0', orb: '#A8322A', far: '#6A4335', near: '#2A1C18', mist: '#F8E8D6', star: 0 },
  night: { top: '#161B27', bot: '#383A47', orb: '#F1E7CF', far: '#7C8090', near: '#0B0D12', mist: '#6D7080', star: 1 },
};
export const timeOfDay = (h) => (h >= 5 && h < 8 ? 'dawn' : h >= 8 && h < 16.5 ? 'day' : h >= 16.5 && h < 19 ? 'dusk' : 'night');
export const skyCss = (h) => { const p = PAL[timeOfDay(h)]; return `background:linear-gradient(180deg,${p.top} 0%,${p.bot} 78%)`; };

const qb = (p0, p1, p2, t) => [0, 1].map((k) => (1 - t) ** 2 * p0[k] + 2 * (1 - t) * t * p1[k] + t ** 2 * p2[k]);
const f = (n) => n.toFixed(1);

/**
 * @param {object} o
 * @param {number} o.t      계획 시간 대비 경과 비율 0~1 (해/달 위치, 향 길이)
 * @param {number} o.hour   실제 시각(0~24) → 하늘 팔레트
 * @param {'focus'|'away'|'pause'|'unk'|'manual'} o.state
 * @param {number[]} o.arc  해/달 궤적 [x0, x1] (모바일은 좁게)
 * @param {string[]} o.labels 궤적 양 끝 라벨 (예: ['14:00','15:00'])
 */
export const scene = ({ t = 0.65, hour = 14.6, state = 'focus', arc = [250, 1190], labels = null, labelColor = null } = {}) => {
  const p = PAL[timeOfDay(hour)];
  const night = p.star === 1;
  const ink = (o) => `fill="${p.near}" fill-opacity="${o}"`;
  // 해·달 궤적 (2차 베지어) — 지나온 구간은 실선, 남은 구간은 점선
  const P0 = [arc[0], 470], P2 = [arc[1], 470], P1 = [(arc[0] + arc[1]) / 2, -60];
  const [sx, sy] = qb(P0, P1, P2, t);
  const c1 = [P0[0] + (P1[0] - P0[0]) * t, P0[1] + (P1[1] - P0[1]) * t];
  const lc = labelColor || (night ? '#E6DFD0' : '#4A4036');
  const orb = night
    ? `<circle cx="${f(sx)}" cy="${f(sy)}" r="34" fill="${p.orb}"/><circle cx="${f(sx + 13)}" cy="${f(sy - 8)}" r="30" fill="${p.top}" fill-opacity=".9"/>`
    : `<circle cx="${f(sx)}" cy="${f(sy)}" r="58" fill="${p.orb}" fill-opacity=".14"/><circle cx="${f(sx)}" cy="${f(sy)}" r="36" fill="${p.orb}" fill-opacity="${state === 'away' || state === 'pause' ? '.55' : '.92'}"/>`;
  const stars = night ? [[180, 90], [340, 160], [460, 70], [610, 120], [880, 80], [990, 150], [1120, 60], [1290, 130], [1370, 210], [80, 220]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 3 ? 1.6 : 2.4}" fill="#F1E7CF" fill-opacity=".8"/>`).join('') : '';
  const birds = !night && state !== 'pause' ? `<g fill="none" stroke="${p.near}" stroke-opacity=".55" stroke-width="2.2" stroke-linecap="round"><path d="M 980 205 q 9 -8 18 0 q 9 -8 18 0"/><path d="M 1030 180 q 7 -6 14 0 q 7 -6 14 0"/><path d="M 1010 232 q 6 -5 12 0 q 6 -5 12 0"/></g>` : '';

  // 향 (일주향): 남은 길이 = 1 - t
  const stickH = 16 + 96 * (1 - Math.min(t, 1));
  const ix = 560, iy = 708;
  const burning = state === 'focus' || state === 'manual' || state === 'unk';
  const incense = `<g>
    <rect x="${ix - 3}" y="${iy - 40 - stickH}" width="6" height="${f(stickH)}" rx="2" fill="#8A5A3C"/>
    <circle cx="${ix}" cy="${f(iy - 40 - stickH)}" r="5" fill="${burning ? '#E2553D' : '#9C9284'}"/>
    ${burning ? `<path d="M ${ix} ${f(iy - 46 - stickH)} c -14 -26 16 -40 2 -70 c -10 -22 14 -34 6 -60" fill="none" stroke="${night ? '#E8E2D6' : '#7A7068'}" stroke-opacity=".45" stroke-width="3" stroke-linecap="round"/>` : ''}
    <path d="M ${ix - 34} ${iy - 40} h 68 l -8 36 h -52 z" fill="${p.near}" fill-opacity=".88"/>
    <rect x="${ix - 40}" y="${iy - 46}" width="80" height="9" rx="3" fill="${p.near}"/>
    <path d="M ${ix - 22} ${iy - 4} l -6 16 M ${ix + 22} ${iy - 4} l 6 16" stroke="${p.near}" stroke-width="5" stroke-linecap="round"/>
  </g>`;

  // 좌선하는 무인 (정면 실루엣) + 붉은 머리끈 · 허리띠
  const person = state === 'away' ? '' : `<g>
    <path d="M 622 712 C 618 680 640 662 664 650 L 776 650 C 800 662 822 680 818 712 C 790 728 650 728 622 712 Z" ${ink(0.94)}/>
    <path d="M 672 566 C 652 574 640 600 636 640 L 630 676 C 690 690 750 690 810 676 L 804 640 C 800 600 788 574 768 566 Z" ${ink(0.94)}/>
    <rect x="652" y="626" width="136" height="12" rx="4" fill="#A8322A"/>
    <ellipse cx="720" cy="668" rx="34" ry="13" fill="${p.mist}" fill-opacity=".22"/>
    <rect x="708" y="540" width="24" height="30" rx="8" ${ink(0.94)}/>
    <ellipse cx="720" cy="516" rx="29" ry="33" ${ink(0.96)}/>
    <ellipse cx="720" cy="476" rx="13" ry="11" ${ink(0.96)}/>
    <path d="M 704 478 h 34" stroke="#C9A15B" stroke-width="3" stroke-linecap="round"/>
    <path d="M 732 480 C 770 470 790 500 830 488 C 856 480 870 492 896 484" fill="none" stroke="#A8322A" stroke-width="5" stroke-linecap="round"/>
    <path d="M 734 486 C 764 492 780 520 812 514" fill="none" stroke="#A8322A" stroke-width="4" stroke-linecap="round" stroke-opacity=".85"/>
  </g>`;
  // 방석 + 검 (자리 이탈이어도 남는다)
  const seat = `<ellipse cx="720" cy="722" rx="124" ry="16" fill="#A8322A" fill-opacity="${state === 'away' ? '.75' : '.55'}"/>
    <g transform="rotate(-6 870 728)"><rect x="820" y="724" width="190" height="7" rx="3" fill="${p.near}"/><rect x="806" y="718" width="10" height="20" rx="2" fill="#C9A15B"/><rect x="776" y="724" width="32" height="7" rx="3" fill="#A8322A"/></g>`;

  // 원경 정자
  const pavilion = `<g fill="${p.far}" fill-opacity=".55"><path d="M 1068 318 l 34 -16 l 34 16 z"/><rect x="1080" y="318" width="44" height="4"/><rect x="1084" y="322" width="4" height="20"/><rect x="1116" y="322" width="4" height="20"/><rect x="1076" y="341" width="52" height="5"/></g>`;
  // 소나무 (오른쪽 절벽)
  const pine = `<g fill="${p.near}"><path d="M 1258 900 C 1250 780 1240 690 1270 600 C 1286 560 1300 540 1296 500" stroke="${p.near}" stroke-width="14" fill="none" stroke-linecap="round"/>
    <path d="M 1150 560 C 1190 530 1260 528 1320 548 C 1290 566 1210 576 1150 560 Z" fill-opacity=".92"/>
    <path d="M 1210 480 C 1250 456 1320 458 1380 478 C 1350 496 1270 500 1210 480 Z" fill-opacity=".92"/>
    <path d="M 1100 640 C 1140 614 1200 616 1250 632 C 1220 650 1150 656 1100 640 Z" fill-opacity=".85"/></g>`;
  // 대나무 (왼쪽)
  const bamboo = `<g stroke="${p.near}" stroke-linecap="round" fill="none">${[[118, 1.0], [168, 0.8], [212, 0.65]].map(([x, o]) => `<path d="M ${x} 900 L ${x + 18} 260" stroke-width="${10 * o + 4}" stroke-opacity="${o}"/>${[380, 500, 620, 740].map((y) => `<path d="M ${x + (900 - y) * 0.028 - 7} ${y} h 16" stroke-width="3" stroke="${p.mist}" stroke-opacity=".6"/>`).join('')}`).join('')}
    <g fill="${p.near}" stroke="none" fill-opacity=".85"><path d="M 136 300 c 40 -10 70 -2 96 14 c -40 4 -70 2 -96 -14 z"/><path d="M 186 420 c 36 -14 66 -10 92 4 c -36 8 -66 8 -92 -4 z"/><path d="M 130 520 c -40 -8 -66 0 -88 16 c 36 2 64 0 88 -16 z"/><path d="M 200 600 c 34 -18 62 -16 90 -4 c -34 10 -62 12 -90 4 z"/></g></g>`;

  const svg = `<svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
    ${stars}
    <path d="M ${P0[0]} ${P0[1]} Q ${P1[0]} ${P1[1]} ${P2[0]} ${P2[1]}" fill="none" stroke="${lc}" stroke-opacity=".55" stroke-width="2" stroke-dasharray="2 12" stroke-linecap="round"/>
    <path d="M ${P0[0]} ${P0[1]} Q ${f(c1[0])} ${f(c1[1])} ${f(sx)} ${f(sy)}" fill="none" stroke="${p.orb}" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"/>
    ${labels ? `<text x="${P0[0]}" y="${P0[1] - 22}" font-size="17" font-weight="800" fill="${lc}" text-anchor="middle" font-family="Noto Sans KR">${labels[0]}</text><text x="${P2[0]}" y="${P2[1] - 22}" font-size="17" font-weight="800" fill="${lc}" text-anchor="middle" font-family="Noto Sans KR">${labels[1]}</text>` : ''}
    ${orb}${birds}
    <path d="M 0 520 L 90 430 L 160 470 L 260 360 L 360 450 L 430 410 L 520 500 L 640 420 L 760 470 L 880 380 L 980 450 L 1100 340 L 1200 420 L 1300 380 L 1440 470 L 1440 900 L 0 900 Z" fill="${p.far}" fill-opacity=".2"/>
    <ellipse cx="420" cy="540" rx="520" ry="46" fill="${p.mist}" fill-opacity=".7"/><ellipse cx="1120" cy="520" rx="460" ry="40" fill="${p.mist}" fill-opacity=".6"/>
    <path d="M 0 610 C 120 560 220 520 330 560 C 420 590 470 540 560 520 C 660 500 700 580 800 570 C 900 560 960 500 1080 350 L 1110 352 C 1160 420 1220 480 1300 500 C 1360 515 1400 540 1440 560 L 1440 900 L 0 900 Z" fill="${p.far}" fill-opacity=".38"/>
    ${pavilion}
    <ellipse cx="760" cy="640" rx="620" ry="52" fill="${p.mist}" fill-opacity=".75"/>
    <path d="M 0 900 L 0 700 C 60 690 120 720 190 700 L 260 900 Z" ${ink(0.85)}/>
    <path d="M 430 900 C 470 800 520 748 600 734 C 680 722 780 722 860 736 C 940 750 990 800 1030 900 Z" ${ink(0.82)}/>
    <path d="M 1440 900 L 1440 580 C 1380 600 1330 660 1290 720 C 1250 790 1190 830 1120 900 Z" ${ink(0.9)}/>
    ${bamboo}${pine}${seat}${incense}${person}
    ${state === 'unk' ? `<ellipse cx="720" cy="600" rx="420" ry="230" fill="${p.mist}" fill-opacity=".72"/><ellipse cx="720" cy="560" rx="260" ry="150" fill="${p.mist}" fill-opacity=".6"/>` : ''}
    ${state === 'pause' ? `<rect x="0" y="0" width="1440" height="900" fill="#1C1814" fill-opacity=".38"/>` : ''}
    ${state === 'away' ? `<rect x="0" y="0" width="1440" height="900" fill="#6B5E4E" fill-opacity=".22"/>` : ''}
  </svg>`;
  return `<div class="scene" style="${skyCss(hour)}">${svg}</div>`;
};
