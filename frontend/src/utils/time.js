const pad = (n) => String(n).padStart(2, '0')

/** 초 → "00:39:12" */
export function formatDuration(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds))
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`
}

/** 초 → "2:53:42" (앞자리 0 없이) */
export function formatDurationShort(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds))
  return `${Math.floor(s / 3600)}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`
}

/** Date → "14:39" */
export function formatClock(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/** Date → "11월 24일 (화)" */
export function formatKoreanDate(date) {
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${days[date.getDay()]})`
}

/** 십이시진: 23–01시 자시(子時), 01–03시 축시(丑時) … */
const SIJIN = [
  ['자시', '子時'],
  ['축시', '丑時'],
  ['인시', '寅時'],
  ['묘시', '卯時'],
  ['진시', '辰時'],
  ['사시', '巳時'],
  ['오시', '午時'],
  ['미시', '未時'],
  ['신시', '申時'],
  ['유시', '酉時'],
  ['술시', '戌時'],
  ['해시', '亥時'],
]
export function sijin(date) {
  const [ko, hanja] = SIJIN[Math.floor(((date.getHours() + 1) % 24) / 2)]
  return `${ko}(${hanja})`
}

/** Date → 14.65 같은 소수 시각 (장면의 하늘색 계산용) */
export function decimalHour(date) {
  return date.getHours() + date.getMinutes() / 60
}
