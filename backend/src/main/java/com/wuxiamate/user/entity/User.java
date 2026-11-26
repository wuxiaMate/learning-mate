package com.wuxiamate.user.entity;

import java.time.Instant;

import com.wuxiamate.global.entity.BaseTimeEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 서비스 사용자 (PC-01 명세 6장 users).
 * 비밀번호는 저장하지 않아요. 로그인 수단은 {@link SocialAccount}에 있어요.
 */
@Entity
@Table(name = "users") // user 는 PostgreSQL 예약어라 users 로 써요
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA용 기본 생성자. 밖에서 new User() 못 하게 막아요
public class User extends BaseTimeEntity {

	public static final String DEFAULT_TIMEZONE = "Asia/Seoul";

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	/** 무호(닉네임). 중복 허용 (MVP). 길이 규칙(2~12자)은 가입 요청 DTO에서 검사해요. */
	@Column(nullable = false, length = 20)
	private String nickname;

	/** 통계·D-Day·오늘 날짜 계산에 쓰는 사용자 시간대 (IANA 이름, 예: Asia/Seoul). */
	@Column(nullable = false, length = 40)
	private String timezone;

	/** 가입 시 약관 동의 시각. 가입 요청 자체를 동의로 봐요 (PC-01 명세 7-3). */
	@Column(name = "terms_agreed_at", nullable = false)
	private Instant termsAgreedAt;

	private User(String nickname, String timezone, Instant termsAgreedAt) {
		this.nickname = nickname;
		this.timezone = timezone;
		this.termsAgreedAt = termsAgreedAt;
	}

	/** 처음 온 사용자를 가입시켜요. 시간대는 기본값 Asia/Seoul. */
	public static User signUp(String nickname, Instant termsAgreedAt) {
		return new User(nickname, DEFAULT_TIMEZONE, termsAgreedAt);
	}
}
