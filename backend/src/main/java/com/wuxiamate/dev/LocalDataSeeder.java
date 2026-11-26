package com.wuxiamate.dev;

import java.time.Instant;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.wuxiamate.user.entity.User;
import com.wuxiamate.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Profile("local")
@Component
@RequiredArgsConstructor
public class LocalDataSeeder implements ApplicationRunner{ // 서버가 다 뜬 직후 run()이 한 번 실햄됨
	
	private final UserRepository userRepository;
	
	@Override
	@Transactional
	public void run(ApplicationArguments args) {
		seedUser("테스트 계정 A");
		seedUser("테스트 계정 B");
	}
	
	private void seedUser(String nickname) {
		if(userRepository.existsByNickname(nickname)) {
			return;
		}
		User user = userRepository.save(User.signUp(nickname, Instant.now()));
		log.info("[local 시드] {} 생성 (userId={})", nickname, user.getId());
	}
}
