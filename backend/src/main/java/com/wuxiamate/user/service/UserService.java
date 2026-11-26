package com.wuxiamate.user.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wuxiamate.auth.oauth.OAuthProvider;
import com.wuxiamate.user.dto.response.UserResponse;
import com.wuxiamate.user.entity.SocialAccount;
import com.wuxiamate.user.entity.User;
import com.wuxiamate.user.repository.SocialAccountRepository;
import com.wuxiamate.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {
	private final UserRepository userRepository;
	private final SocialAccountRepository socialAccountRepository;
	
	public UserResponse getUser(Long userId) {
		User user = userRepository.findById(userId).orElseThrow();
		List<OAuthProvider> providers = socialAccountRepository.findAllByUserId(userId)
				.stream()
				.map(SocialAccount::getProvider)
				.toList();
		return UserResponse.of(user, providers);
	}
}
