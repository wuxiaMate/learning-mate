package com.wuxiamate.user.repository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.Instant;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.dao.DataIntegrityViolationException;

import com.wuxiamate.auth.oauth.OAuthProvider;
import com.wuxiamate.global.config.JpaAuditingConfig;
import com.wuxiamate.user.entity.SocialAccount;
import com.wuxiamate.user.entity.User;

/**
 * User·SocialAccount 매핑과 UNIQUE 제약을 실제 PostgreSQL(docker compose)로 확인해요.
 * 테스트마다 끝나면 롤백돼서 DB에 데이터가 남지 않아요.
 */
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE) // 내장 DB 대신 실제 PostgreSQL 사용
@Import(JpaAuditingConfig.class) // @DataJpaTest 는 created_at 자동 기록 설정을 따로 불러와야 해요
class SocialAccountRepositoryTest {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private SocialAccountRepository socialAccountRepository;

	@Test
	void 제공자와_제공자_사용자ID로_소셜계정을_찾는다() {
		Instant now = Instant.now();
		User user = userRepository.save(User.signUp("청운검객", now));
		socialAccountRepository.save(SocialAccount.link(user, OAuthProvider.KAKAO, "123456789", null, now));

		SocialAccount found = socialAccountRepository
			.findByProviderAndProviderUserId(OAuthProvider.KAKAO, "123456789")
			.orElseThrow();

		assertThat(found.getUser().getId()).isEqualTo(user.getId());
		assertThat(found.getEmail()).isNull(); // 이메일 없이도 가입 가능
		assertThat(found.getCreatedAt()).isNotNull(); // JPA Auditing 동작
		assertThat(user.getTimezone()).isEqualTo("Asia/Seoul");
	}

	@Test
	void 사용자ID로_연결된_소셜계정_목록을_찾는다() {
		Instant now = Instant.now();
		User user = userRepository.save(User.signUp("청운검객", now));
		socialAccountRepository.save(SocialAccount.link(user, OAuthProvider.KAKAO, "kakao-1", null, now));
		socialAccountRepository.save(SocialAccount.link(user, OAuthProvider.GOOGLE, "google-1", "a@example.com", now));

		assertThat(socialAccountRepository.findAllByUserId(user.getId()))
			.extracting(SocialAccount::getProvider)
			.containsExactlyInAnyOrder(OAuthProvider.KAKAO, OAuthProvider.GOOGLE);
	}

	@Test
	void 같은_소셜계정을_두_사용자에게_연결할_수_없다() {
		Instant now = Instant.now();
		User a = userRepository.save(User.signUp("테스트A", now));
		User b = userRepository.save(User.signUp("테스트B", now));
		socialAccountRepository.saveAndFlush(SocialAccount.link(a, OAuthProvider.KAKAO, "same-id", null, now));

		assertThatThrownBy(() -> socialAccountRepository
			.saveAndFlush(SocialAccount.link(b, OAuthProvider.KAKAO, "same-id", null, now)))
			.isInstanceOf(DataIntegrityViolationException.class);
	}

	@Test
	void 한_사용자는_같은_제공자를_두_번_연결할_수_없다() {
		Instant now = Instant.now();
		User user = userRepository.save(User.signUp("청운검객", now));
		socialAccountRepository.saveAndFlush(SocialAccount.link(user, OAuthProvider.KAKAO, "kakao-1", null, now));

		assertThatThrownBy(() -> socialAccountRepository
			.saveAndFlush(SocialAccount.link(user, OAuthProvider.KAKAO, "kakao-2", null, now)))
			.isInstanceOf(DataIntegrityViolationException.class);
	}
}
