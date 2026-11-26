package com.wuxiamate.user.dto.response;

import java.util.List;

import com.wuxiamate.auth.oauth.OAuthProvider;
import com.wuxiamate.user.entity.User;

public record UserResponse(Long id, String nickname, String timezone, List<OAuthProvider> providers) {
	public static UserResponse of(User user, List<OAuthProvider> providers) {
		return new UserResponse(user.getId(), user.getNickname(), user.getTimezone(), providers);
	}
}
