import client from './client'

// 백엔드 명세: docs/backend/01-auth.md
// 공통 응답 형식 { success, data, error } 에서 data 만 꺼내 돌려줘요.

/** 7-1. 제공자 인가 URL 받기 → 프론트는 location.href = url 로 이동 */
export async function getAuthorizeUrl(provider) {
  const res = await client.get(`/auth/oauth/${provider}/authorize-url`)
  return res.data.data.url
}

/** API 에러에서 화면에 띄울 문장을 꺼내요. 서버가 꺼져 있으면 기본 문장을 써요. */
export function errorMessage(
  error,
  fallback = '서버에 연결할 수 없어요. 잠시 후 다시 시도해 주세요.',
) {
  return error?.response?.data?.error?.message ?? fallback
}
