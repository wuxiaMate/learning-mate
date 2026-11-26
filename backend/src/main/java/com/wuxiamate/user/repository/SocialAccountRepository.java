package com.wuxiamate.user.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.wuxiamate.auth.oauth.OAuthProvider;
import com.wuxiamate.user.entity.SocialAccount;

/**
 * social_accounts 테이블 접근.
 * 메서드 이름 규칙(findBy + 필드명)만 지키면 Spring Data JPA 가 SQL 을 만들어 줘요.
 */
public interface SocialAccountRepository extends JpaRepository<SocialAccount, Long> {

	/** 콜백에서 "이미 가입한 소셜 계정인가" 확인 (PC-01 명세 7-2 4단계). */
	Optional<SocialAccount> findByProviderAndProviderUserId(OAuthProvider provider, String providerUserId);

	/** /me 응답의 providers 목록용. user.id 로 찾아요 (user_id 컬럼). */
	List<SocialAccount> findAllByUserId(Long userId);
}
