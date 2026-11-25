// 과목 목록 (M03 과목 API가 생기기 전까지 쓰는 목업)
// color: 글자·점 색, bg: 칩 배경색 — 와이어프레임 v0.3 과목 색
export const SUBJECTS = [
  { id: 1, name: '데이터베이스', color: '#23403A', bg: '#E1EBE7' },
  { id: 2, name: '알고리즘', color: '#A8322A', bg: '#F6E2DA' },
  { id: 3, name: '영어', color: '#23403A', bg: '#F6EEDD' },
  { id: 4, name: '정보처리기사', color: '#1C1814', bg: '#ECE8E1' },
]

export const findSubject = (id) => SUBJECTS.find((s) => s.id === id) ?? SUBJECTS[0]
