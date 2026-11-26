package com.wuxiamate.user.entity;

import java.time.Instant;

import com.wuxiamate.auth.oauth.OAuthProvider;
import com.wuxiamate.global.entity.BaseTimeEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 사용자에 연결된 소셜 계정 (PC-01 명세 6장 social_accounts).
 * 사용자는 (provider, providerUserId) 로 알아봐요.
 */
@Entity
@Table(
	name = "social_accounts",
	uniqueConstraints = {
		// 같은 소셜 계정은 한 사용자에게만 연결
		@UniqueConstraint(name = "uk_social_accounts_provider_user", columnNames = {"provider", "provider_user_id"}),
		// 한 사용자는 제공자마다 하나만 연결
		@UniqueConstraint(name = "uk_social_accounts_user_provider", columnNames = {"user_id", "provider"})
	}
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SocialAccount extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	/** 연결된 사용자. LAZY: 소셜 계정을 조회할 때 users 까지 바로 읽지 않아요. */
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Enumerated(EnumType.STRING) // 숫자(0,1,2)가 아니라 이름(KAKAO)으로 저장. 순서가 바뀌어도 안전해요
	@Column(nullable = false, length = 20)
	private OAuthProvider provider;

	/** 제공자가 준 사용자 ID. 카카오는 숫자라 문자열로 바꿔서 저장해요. */
	@Column(name = "provider_user_id", nullable = false, length = 100)
	private String providerUserId;

	/** 받았으면 참고용. 카카오는 이메일 동의가 선택이라 없을 수 있어요. */
	@Column(length = 255)
	private String email;

	@Column(name = "last_login_at", nullable = false)
	private Instant lastLoginAt;

	private SocialAccount(User user, OAuthProvider provider, String providerUserId, String email, Instant lastLoginAt) {
		this.user = user;
		this.provider = provider;
		this.providerUserId = providerUserId;
		this.email = email;
		this.lastLoginAt = lastLoginAt;
	}

	/** 가입할 때 사용자와 소셜 계정을 연결해요. 가입 = 첫 로그인이라 lastLoginAt 도 함께 기록해요. */
	public static SocialAccount link(User user, OAuthProvider provider, String providerUserId, String email, Instant now) {
		return new SocialAccount(user, provider, providerUserId, email, now);
	}

	/** 다시 로그인했을 때 마지막 로그인 시각을 갱신해요. */
	public void recordLogin(Instant now) {
		this.lastLoginAt = now;
	}
}
