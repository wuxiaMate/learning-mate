package com.wuxiamate.dev;

import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Profile("local") 				// local 프로필에서만 빈으로 등록 → 다른 프로필에선 주소 자체
@RestController
@RequestMapping("/api/dev")
@RequiredArgsConstructor
public class DevAuthController {
	private final UserService userService;
	
	@PostMapping("/login")
	public ApiResponse<UserResponse> login(@RequestBody DevLoginRequest request, HttpSession session){
		
	}
}
