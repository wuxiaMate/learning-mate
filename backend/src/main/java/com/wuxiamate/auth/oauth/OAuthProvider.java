package com.wuxiamate.auth.oauth;

/**
 * 지원하는 소셜 로그인 제공자 (PC-01 명세 1장).
 * DB의 social_accounts.provider 에는 이 이름(GOOGLE, KAKAO, NAVER)이 문자열로 저장돼요.
 */
public enum OAuthProvider {
	GOOGLE,
	KAKAO,
	NAVER
}
